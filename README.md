# MoltWall

**Production-grade security firewall for AI agents and agentic workflows.**

> MoltWall — real-time security firewall for AI agents.

MoltWall operates as a middleware layer between AI agents and external tools (APIs, wallets, browsers, MCP servers). every agent action is intercepted, validated, and evaluated before execution — returning `allow`, `deny`, `sandbox`, or `require_confirmation` — each with a full risk trace.

## What It Prevents

- Prompt injection and jailbreak attacks
- Malicious or tampered tool outputs
- Unsafe or unintended autonomous execution
- Wallet theft, key leakage / credential exfiltration
- Spend limit and budget overrun violations
- Tool misuse by compromised or hijacked agents

---

## Architecture

```
AI Agent
  ↓
MoltWall SDK
  ↓
POST /api/MoltWall/check
  ↓
API Key Auth → Rate Limiter → Guardrail Engine → Policy Engine → Risk Engine
  ↓
Decision: allow | deny | require_confirmation | sandbox
  ↓
Immutable Action Log (Supabase) + Decision Cache (Redis)
```

---

## Quick Start

### 1. Install

```bash
npm install
```

### 2. Set environment variables

```bash
cp .env.example .env.local
```

Fill in:

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_KEY` | Supabase service role key — server-only, never expose to client |
| `UPSTASH_REDIS_URL` | Upstash Redis REST URL |
| `UPSTASH_REDIS_TOKEN` | Upstash Redis REST token |
| `MOLTWALL_SECRET` | 64+ character secret for HMAC-SHA256 internal token signing |

### 3. Apply database migration

In your Supabase SQL editor (or via CLI), run:

```sql
-- contents of database/migrations/001_initial.sql
```

### 4. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — dashboard available at `/dashboard`

---

## API Reference

Full OpenAPI 3.1 spec (auto-generated): [`openapi/spec.yaml`](openapi/spec.yaml)

### Primary Firewall Endpoint

```http
POST /api/MoltWall/check
x-api-key: moltwall_live_your_key
Content-Type: application/json

{
  "agent_id": "agent-001",
  "action": "transfer",
  "tool": "solana_wallet",
  "args": { "amount": 100, "to": "0xabc..." },
  "source": "user",
  "user_intent": "Send 100 SOL to Alice"
}
```

Response:

```json
{
  "decision": "deny",
  "risk_score": 0.88,
  "reason": "Financial transfer tool not in allowlist — action denied by policy engine",
  "action_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Supporting Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/policy` | Get active policy |
| `POST` | `/api/policy` | Create/update policy |
| `DELETE` | `/api/policy` | Delete policy |
| `GET` | `/api/tools` | List registered tools |
| `POST` | `/api/tools/register` | Register a tool |
| `GET` | `/api/logs` | Get paginated action logs |

---

## SDK Usage

| Language | Package | Install |
|---|---|---|
| TypeScript | [@moltwall/sdk](https://www.npmjs.com/package/@moltwall/sdk) | `npm install @moltwall/sdk` |
| Python | [moltwall](https://pypi.org/project/moltwall/) | `pip install moltwall` |
| Go | [sdk-go](https://github.com/moltwall/sdk-go) | `go get github.com/moltwall/sdk-go` |

### TypeScript

```typescript
import { MoltWall } from "./sdk/typescript"

const wall = new MoltWall({
  apiKey: process.env.MOLTWALL_API_KEY!,
  baseUrl: "https://www.moltwall.xyz",
})

// Intercept and evaluate the agent action before execution
const result = await wall.check({
  agent_id: "agent-001",
  action: "transfer",
  tool: "solana_wallet",
  args: { amount: 100 },
  source: "user",
  user_intent: "Send 100 SOL to Alice.",
})

if (result.decision === "deny") {
  throw new Error(`[MoltWall] Action blocked: ${result.reason}`)
}

if (result.decision === "require_confirmation") {
  const confirmed = await askUserForConfirmation(result.reason)
  if (!confirmed) return
}

// Firewall approved — safe to execute
await executeTransfer(result)

// Register a tool
await wall.registerTool({
  tool_id: "solana_wallet",
  publisher: "acme-corp",
  risk_level: "high", // low | medium | high | critical,
  permissions: ["sign_transaction", "transfer"],
})

// Fetch audit logs
const logs = await wall.getLogs({ decision: "deny", limit: 20 })
```

---

## Policy Engine (Deterministic)

Policies define allowed behavior — evaluated **deterministically** — zero LLM inference, sub-millisecond latency.

```json
{
  "allowed_tools": ["browser", "search", "calendar", "email"],
  "blocked_actions": ["delete_account", "drop_table"],
  "trusted_domains": ["github.com", "docs.company.com", "api.moltwall.xyz"],
  "max_spend_usd": 500,
  "sensitive_actions": ["payment", "transfer", "delete"],
  "risk_threshold_allow": 0.25,
  "risk_threshold_sandbox": 0.6,
  "risk_threshold_deny": 0.8
}
```

---

## Project Structure

```
/app
  /api/MoltWall/check     ← Core firewall endpoint
  /api/agentwall/check    ← Legacy alias, kept for backward compat
  /api/policy             ← Policy CRUD
  /api/tools              ← Tool list
  /api/tools/register     ← Tool registration
  /api/logs               ← Action log query
  /dashboard              ← Admin UI + live audit feed
  /docs                   ← Embedded documentation + API reference
/sdk/typescript           ← MoltWall TypeScript SDK (ESM + CJS)
/lib
  /policy-engine          ← Deterministic evaluators
  /risk-engine            ← Weighted scorers
  /guardrail-engine       ← Injection, PII, credential + data-exfil scanners
  /redis                  ← Upstash wrapper, rate limiter + sliding window counters
  /supabase               ← Supabase server client + typed query helpers
/types                    ← Shared Zod schemas, TS types + runtime validators
/utils                    ← Error classes, structured logger, retry helpers
```

---

## Token

**Contract Address:** `BnmWGUwKU6qkcuMdiQAGn6Pds395Dd3HLPukHmduMWL`

---

## License

MIT
