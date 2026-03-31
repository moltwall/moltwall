"""
MoltWall Python SDK — Type definitions
"""

from __future__ import annotations
from dataclasses import dataclass, field
from typing import Any, Dict, Literal, Optional

DecisionType = Literal["allow", "deny", "sandbox", "require_confirmation"]
SourceType = Literal["user", "agent", "system", "external", "developer"]
RiskLevel = Literal["low", "medium", "high", "critical"]


@dataclass
class CheckRequest:
    """Payload sent to the MoltWall firewall endpoint."""
    agent_id: str
    action: str
    tool: str
    args: Dict[str, Any] = field(default_factory=dict)
    source: SourceType = "agent"
    user_intent: Optional[str] = None
    context: Optional[Dict[str, Any]] = None


@dataclass
class CheckResponse:
    """Decision returned by the MoltWall firewall."""
    decision: DecisionType
    risk_score: float          # 0.0 – 1.0
    reason: str
    action_id: str
    latency_ms: Optional[float] = None
    guardrail_flags: Optional[list[str]] = None
    policy_matched: Optional[str] = None

    @property
    def allowed(self) -> bool:
        return self.decision == "allow"

    @property
    def blocked(self) -> bool:
        return self.decision in ("deny",)

    def raise_if_blocked(self) -> None:
        """Raise a MoltWallBlockedError if the decision is deny."""
        if self.blocked:
            raise MoltWallBlockedError(self)


@dataclass
class RegisterToolRequest:
    tool_id: str
    publisher: str
    risk_level: RiskLevel = "medium"
    permissions: list[str] = field(default_factory=list)
    description: Optional[str] = None


@dataclass
class ActionLog:
    action_id: str
    agent_id: str
    tool: str
    action: str
    decision: DecisionType
    risk_score: float
    reason: str
    source: SourceType
    timestamp: str
    args: Dict[str, Any] = field(default_factory=dict)


class MoltWallError(Exception):
    """Base exception for MoltWall SDK errors."""


class MoltWallBlockedError(MoltWallError):
    """Raised when the firewall blocks an action."""

    def __init__(self, response: CheckResponse):
        self.response = response
        super().__init__(
            f"[MoltWall] Action blocked (risk={response.risk_score:.2f}): {response.reason}"
        )


class MoltWallAuthError(MoltWallError):
    """Raised on invalid or expired API key."""
