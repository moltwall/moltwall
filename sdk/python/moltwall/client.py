"""
MoltWall Python SDK — Core client
"""

from __future__ import annotations

import time
from typing import Any, Dict, List, Optional
from urllib.parse import urljoin

try:
    import httpx
    _HTTPX = True
except ImportError:
    import urllib.request
    import json as _json
    _HTTPX = False

from .types import (
    CheckRequest,
    CheckResponse,
    RegisterToolRequest,
    ActionLog,
    MoltWallAuthError,
    MoltWallError,
)


class MoltWall:
    """
    MoltWall firewall client for Python agents.

    Usage::

        from moltwall import MoltWall

        wall = MoltWall(api_key="moltwall_live_...", base_url="https://www.moltwall.xyz")

        result = wall.check(
            agent_id="my-agent",
            action="transfer_funds",
            tool="wallet",
            args={"amount": 100, "to": "0xabc"},
            source="user",
        )
        result.raise_if_blocked()
        # safe to proceed
    """

    DEFAULT_TIMEOUT = 10.0  # seconds

    def __init__(
        self,
        api_key: str,
        base_url: str = "https://www.moltwall.xyz",
        timeout: float = DEFAULT_TIMEOUT,
    ) -> None:
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self._headers = {
            "x-api-key": api_key,
            "Content-Type": "application/json",
        }

    # ── Public API ──────────────────────────────────────────────────────────

    def check(
        self,
        agent_id: str,
        action: str,
        tool: str,
        args: Optional[Dict[str, Any]] = None,
        source: str = "agent",
        user_intent: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None,
    ) -> CheckResponse:
        """Evaluate an agent action through the MoltWall firewall."""
        payload: Dict[str, Any] = {
            "agent_id": agent_id,
            "action": action,
            "tool": tool,
            "args": args or {},
            "source": source,
        }
        if user_intent:
            payload["user_intent"] = user_intent
        if context:
            payload["context"] = context

        t0 = time.perf_counter()
        raw = self._post("/api/MoltWall/check", payload)
        latency_ms = (time.perf_counter() - t0) * 1000

        return CheckResponse(
            decision=raw["decision"],
            risk_score=raw.get("risk_score", 0.0),
            reason=raw.get("reason", ""),
            action_id=raw.get("action_id", ""),
            latency_ms=latency_ms,
            guardrail_flags=raw.get("guardrail_flags"),
            policy_matched=raw.get("policy_matched"),
        )

    def register_tool(self, req: RegisterToolRequest) -> Dict[str, Any]:
        """Register a tool with MoltWall for policy enforcement."""
        payload = {
            "tool_id": req.tool_id,
            "publisher": req.publisher,
            "risk_level": req.risk_level,
            "permissions": req.permissions,
        }
        if req.description:
            payload["description"] = req.description
        return self._post("/api/tools/register", payload)

    def get_logs(
        self,
        decision: Optional[str] = None,
        limit: int = 20,
        offset: int = 0,
    ) -> List[ActionLog]:
        """Fetch paginated audit logs."""
        params = f"?limit={limit}&offset={offset}"
        if decision:
            params += f"&decision={decision}"
        raw = self._get(f"/api/logs{params}")
        return [
            ActionLog(
                action_id=r["action_id"],
                agent_id=r["agent_id"],
                tool=r["tool"],
                action=r["action"],
                decision=r["decision"],
                risk_score=r["risk_score"],
                reason=r["reason"],
                source=r["source"],
                timestamp=r["timestamp"],
                args=r.get("args", {}),
            )
            for r in raw.get("logs", [])
        ]

    # ── Internal helpers ────────────────────────────────────────────────────

    def _post(self, path: str, payload: Dict[str, Any]) -> Dict[str, Any]:
        url = self.base_url + path
        if _HTTPX:
            resp = httpx.post(url, json=payload, headers=self._headers, timeout=self.timeout)
            self._raise_for_status(resp.status_code, resp.text)
            return resp.json()
        else:
            import json
            data = json.dumps(payload).encode()
            req = urllib.request.Request(url, data=data, headers=self._headers, method="POST")
            with urllib.request.urlopen(req, timeout=self.timeout) as r:
                return json.loads(r.read().decode())

    def _get(self, path: str) -> Dict[str, Any]:
        url = self.base_url + path
        if _HTTPX:
            resp = httpx.get(url, headers=self._headers, timeout=self.timeout)
            self._raise_for_status(resp.status_code, resp.text)
            return resp.json()
        else:
            import json
            req = urllib.request.Request(url, headers=self._headers, method="GET")
            with urllib.request.urlopen(req, timeout=self.timeout) as r:
                return json.loads(r.read().decode())

    @staticmethod
    def _raise_for_status(status: int, body: str) -> None:
        if status == 401:
            raise MoltWallAuthError("Invalid or missing API key.")
        if status >= 400:
            raise MoltWallError(f"MoltWall API error {status}: {body}")
