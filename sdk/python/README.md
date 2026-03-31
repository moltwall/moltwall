# MoltWall Python SDK (Beta)

Real-time security firewall for AI agents — Python edition.

```bash
pip install moltwall
# with httpx for best performance:
pip install "moltwall[httpx]"
# with LangChain integration:
pip install "moltwall[langchain]"
```

## Quickstart

```python
from moltwall import MoltWall

wall = MoltWall(api_key="moltwall_live_...", base_url="https://www.moltwall.xyz")

result = wall.check(
    agent_id="my-agent",
    action="transfer_funds",
    tool="wallet",
    args={"amount": 100, "to": "0xabc..."},
    source="user",
)

result.raise_if_blocked()  # raises MoltWallBlockedError if denied
print(f"Decision: {result.decision}  Risk: {result.risk_score:.2f}  Latency: {result.latency_ms:.1f}ms")
```

## LangChain Integration

```python
from langchain_community.tools import ShellTool, WikipediaQueryRun
from moltwall import MoltWall
from moltwall.integrations.langchain import wrap_tools

wall = MoltWall(api_key="moltwall_live_...")

# Wrap all tools in one call
safe_tools = wrap_tools(
    tools=[ShellTool(), WikipediaQueryRun()],
    wall=wall,
    agent_id="lc-agent-01",
    source="agent",
)

# Drop-in replacement — same interface as original tools
from langchain.agents import create_react_agent
agent = create_react_agent(llm, safe_tools, prompt)
```

## Error Handling

```python
from moltwall import MoltWall, MoltWallBlockedError, MoltWallAuthError

try:
    result = wall.check(agent_id="a1", action="delete_db", tool="sql", args={})
    result.raise_if_blocked()
except MoltWallBlockedError as e:
    print(f"Blocked: {e.response.reason}")
except MoltWallAuthError:
    print("Invalid API key")
```

## Links

- [Dashboard](https://www.moltwall.xyz/dashboard)
- [Docs](https://www.moltwall.xyz/docs)
- [GitHub](https://github.com/moltwall)
- [npm (TypeScript SDK)](https://www.npmjs.com/package/@moltwall/sdk)
