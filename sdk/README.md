# @moltwall/sdk

Production-grade TypeScript SDK for **MoltWall** (AI Agent Security Firewall).

## Install

```bash
npm i @moltwall/sdk
```

## Quick Start

```ts
import { MoltWall, type MoltWallConfig } from "@moltwall/sdk";

const config: MoltWallConfig = {
  apiKey: process.env.MOLTWALL_API_KEY ?? "",
  // Example: https://www.moltwall.xyz
  baseUrl: process.env.MOLTWALL_BASE_URL ?? "http://localhost:3000"
};

const wall = new MoltWall(config);

const decision = await wall.check({
  agent_id: "agent_123",
  tool_id: "tool_search_web",
  action: "search",
  args: { query: "moltwall firewall" },
  // Optional provenance
  source: "external"
});

console.log(decision.decision);
```

## Configuration

`MoltWall` accepts a `MoltWallConfig`:

- `apiKey` (string): Your MoltWall API key.
- `baseUrl` (string): Your MoltWall API base URL.

Environment suggestions:

- `MOLTWALL_API_KEY`
- `MOLTWALL_BASE_URL`

## Decisions

The core firewall endpoint returns one of:

- `allow`
- `deny`
- `require_confirmation`
- `sandbox`

## Notes

- This SDK is designed to be used from Node.js or the browser.
- For full API semantics, see the MoltWall dashboard and docs.

