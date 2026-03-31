"""
MoltWall × LangChain integration
Wraps any LangChain BaseTool so every invocation passes through
the MoltWall firewall before execution.

Usage::

    from langchain_community.tools import ShellTool
    from moltwall import MoltWall
    from moltwall.integrations.langchain import MoltWallToolWrapper

    wall = MoltWall(api_key="moltwall_live_...")
    safe_shell = MoltWallToolWrapper(tool=ShellTool(), wall=wall, agent_id="lc-agent-01")

    # Drop-in replacement — same interface as the original tool
    result = safe_shell.run("ls -la")
"""

from __future__ import annotations
from typing import Any, Optional, Union

try:
    from langchain_core.tools import BaseTool
    from langchain_core.callbacks import CallbackManagerForToolRun
    _LANGCHAIN = True
except ImportError:
    _LANGCHAIN = False

from ..client import MoltWall
from ..types import CheckResponse, MoltWallBlockedError


class MoltWallToolWrapper:
    """
    Wraps a LangChain BaseTool and gates every call through MoltWall.

    Parameters
    ----------
    tool        : BaseTool — the original LangChain tool to wrap
    wall        : MoltWall — configured MoltWall client
    agent_id    : str      — identifier for this agent in audit logs
    source      : str      — "agent" | "user" | "system"
    block_mode  : str      — "raise" (default) or "return_error"
    """

    def __init__(
        self,
        tool: Any,
        wall: MoltWall,
        agent_id: str,
        source: str = "agent",
        block_mode: str = "raise",
    ) -> None:
        if not _LANGCHAIN:
            raise ImportError(
                "langchain-core is required for MoltWallToolWrapper. "
                "Install it with: pip install langchain-core"
            )
        self._tool = tool
        self._wall = wall
        self._agent_id = agent_id
        self._source = source
        self._block_mode = block_mode

    # Mirror BaseTool properties
    @property
    def name(self) -> str:
        return self._tool.name

    @property
    def description(self) -> str:
        return self._tool.description

    def run(
        self,
        tool_input: Union[str, dict],
        *,
        user_intent: Optional[str] = None,
        **kwargs: Any,
    ) -> Any:
        """Intercept, evaluate, then (if approved) execute the tool."""
        args = tool_input if isinstance(tool_input, dict) else {"input": tool_input}

        response: CheckResponse = self._wall.check(
            agent_id=self._agent_id,
            action=self.name,
            tool=self.name,
            args=args,
            source=self._source,
            user_intent=user_intent,
        )

        if response.blocked:
            if self._block_mode == "raise":
                raise MoltWallBlockedError(response)
            return f"[MoltWall BLOCKED] {response.reason}"

        if response.decision == "require_confirmation":
            # In automated pipelines, treat require_confirmation as block
            raise MoltWallBlockedError(response)

        # decision == "allow" or "sandbox"
        return self._tool.run(tool_input, **kwargs)

    async def arun(
        self,
        tool_input: Union[str, dict],
        *,
        user_intent: Optional[str] = None,
        **kwargs: Any,
    ) -> Any:
        """Async version — evaluates synchronously then awaits tool."""
        args = tool_input if isinstance(tool_input, dict) else {"input": tool_input}

        response: CheckResponse = self._wall.check(
            agent_id=self._agent_id,
            action=self.name,
            tool=self.name,
            args=args,
            source=self._source,
            user_intent=user_intent,
        )

        if response.blocked:
            if self._block_mode == "raise":
                raise MoltWallBlockedError(response)
            return f"[MoltWall BLOCKED] {response.reason}"

        return await self._tool.arun(tool_input, **kwargs)


def wrap_tools(
    tools: list,
    wall: MoltWall,
    agent_id: str,
    source: str = "agent",
    block_mode: str = "raise",
) -> list:
    """
    Convenience helper — wrap a list of LangChain tools in one call.

        safe_tools = wrap_tools(tools, wall=wall, agent_id="my-agent")
        agent = create_react_agent(llm, safe_tools, prompt)
    """
    return [
        MoltWallToolWrapper(t, wall=wall, agent_id=agent_id, source=source, block_mode=block_mode)
        for t in tools
    ]
