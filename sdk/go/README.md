# MoltWall Go SDK

Real-time security firewall for AI agents — Go edition.

```bash
go get github.com/moltwall/sdk-go
```

Zero hard dependencies — stdlib only.

## Quickstart

```go
package main

import (
    "context"
    "log"

    "github.com/moltwall/sdk-go/moltwall"
)

func main() {
    wall := moltwall.New("moltwall_live_...")

    resp, err := wall.Check(context.Background(), moltwall.CheckRequest{
        AgentID: "my-agent",
        Action:  "transfer_funds",
        Tool:    "wallet",
        Args:    map[string]any{"amount": 100, "to": "0xabc..."},
        Source:  moltwall.SourceUser,
    })
    if err != nil {
        log.Fatal(err)
    }

    if resp.Blocked() {
        log.Fatalf("[MoltWall] blocked (risk=%.2f): %s", resp.RiskScore, resp.Reason)
    }

    log.Printf("decision=%s latency=%.1fms", resp.Decision, resp.LatencyMs)
}
```

## CheckAndBlock — one-liner

```go
resp, err := wall.CheckAndBlock(ctx, moltwall.CheckRequest{
    AgentID: "my-agent",
    Action:  "delete_db",
    Tool:    "sql",
    Source:  moltwall.SourceAgent,
})
// returns *BlockedError if denied — no extra if-check needed
```

## Error Handling

```go
resp, err := wall.Check(ctx, req)
switch e := err.(type) {
case *moltwall.BlockedError:
    log.Printf("blocked: %s (risk=%.2f)", e.Response.Reason, e.Response.RiskScore)
case *moltwall.AuthError:
    log.Fatal("invalid API key")
case *moltwall.APIError:
    log.Printf("API error %d: %s", e.StatusCode, e.Body)
case nil:
    // proceed
}
```

## Register a Tool

```go
_, err := wall.RegisterTool(ctx, moltwall.RegisterToolRequest{
    ToolID:      "solana_wallet",
    Publisher:   "acme-corp",
    RiskLevel:   moltwall.RiskHigh,
    Permissions: []string{"sign_transaction", "transfer"},
})
```

## Fetch Audit Logs

```go
logs, err := wall.GetLogs(ctx, "deny", 20, 0)
for _, l := range logs.Logs {
    fmt.Printf("%s  %s  risk=%.2f\n", l.Timestamp, l.Action, l.RiskScore)
}
```

## Configuration

```go
wall := moltwall.New(
    "moltwall_live_...",
    moltwall.WithBaseURL("https://www.moltwall.xyz"),
    moltwall.WithTimeout(5 * time.Second),
)
```

## Links

- [Dashboard](https://www.moltwall.xyz/dashboard)
- [Docs](https://www.moltwall.xyz/docs)
- [GitHub](https://github.com/moltwall)
- [npm (TypeScript)](https://www.npmjs.com/package/@moltwall/sdk)
- [PyPI (Python)](https://pypi.org/project/moltwall)
