/**
 * MoltWall TypeScript SDK
 * Agent Security Firewall -full-stack protection for your AI agents.
 *
 * Usage:
 *   import { MoltWall } from "@moltwall/sdk"
 *
 *   const wall = new MoltWall({ apiKey: process.env.MOLTWALL_API_KEY ?? "" })
 *   const result = await wall.check({
 *     agent_id: "agent-1",
 *     action: "transfer",
 *     tool: "wallet",
 *     args: { amount: 100 }
 *   })
 *   if (result.decision !== "allow") throw new Error(`Blocked: ${result.reason}`)
 */
import { MoltWallConfig, SDKCheckRequest, SDKCheckResponse, SDKRegisterToolRequest, SDKLogFilters, SDKActionLog } from "./types";
export { MoltWallSDKError, AgentWallSDKError } from "./types";
export type { MoltWallConfig, SDKCheckRequest, SDKCheckResponse, SDKRegisterToolRequest, SDKLogFilters, SDKActionLog, DecisionType, SourceType, RiskLevel, } from "./types";
export declare class MoltWall {
    private readonly apiKey;
    private readonly baseUrl;
    private readonly timeout;
    constructor(config: MoltWallConfig);
    /**
     * Evaluates an agent action against your security policy and risk engine.
     *
     * @param request - The action to evaluate
     * @returns A decision with risk score and reason
     * @throws MoltWallSDKError on API errors
     *
     * @example
     * const result = await wall.check({
     *   agent_id: "agent-001",
     *   action: "transfer",
     *   tool: "solana_wallet",
     *   args: { amount: 100, to: "0xabc..." },
     *   source: "user",
     *   user_intent: "Send 100 SOL to Alice",
     * })
     *
     * if (result.decision === "deny") {
     *   throw new Error(`Action denied: ${result.reason}`)
     * }
     */
    check(request: SDKCheckRequest): Promise<SDKCheckResponse>;
    /**
     * Registers a tool in the MoltWall tool registry.
     * Registered tools receive their configured risk level instead of "unknown tool" penalty.
     *
     * @example
     * await wall.registerTool({
     *   tool_id: "solana_wallet",
     *   publisher: "my-company",
     *   risk_level: "high",
     *   permissions: ["sign_transaction", "transfer"],
     * })
     */
    registerTool(tool: SDKRegisterToolRequest): Promise<void>;
    /**
     * Fetches paginated action logs from your MoltWall deployment.
     *
     * @example
     * const logs = await wall.getLogs({ decision: "deny", limit: 20 })
     */
    getLogs(filters?: SDKLogFilters): Promise<SDKActionLog[]>;
    private post;
    private get;
    private handleResponse;
}
/** @deprecated Use MoltWall */
export declare const AgentWall: typeof MoltWall;
