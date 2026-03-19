"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentWall = exports.MoltWall = exports.AgentWallSDKError = exports.MoltWallSDKError = void 0;
const types_1 = require("./types");
var types_2 = require("./types");
Object.defineProperty(exports, "MoltWallSDKError", { enumerable: true, get: function () { return types_2.MoltWallSDKError; } });
Object.defineProperty(exports, "AgentWallSDKError", { enumerable: true, get: function () { return types_2.AgentWallSDKError; } });
const DEFAULT_BASE_URL = "http://localhost:3000";
const DEFAULT_TIMEOUT = 10000;
class MoltWall {
    constructor(config) {
        var _a, _b;
        if (!config.apiKey || config.apiKey.trim().length === 0) {
            throw new types_1.MoltWallSDKError("MoltWall requires an apiKey. Get one from your MoltWall dashboard.", 0, "MISSING_API_KEY");
        }
        this.apiKey = config.apiKey.trim();
        this.baseUrl = ((_a = config.baseUrl) !== null && _a !== void 0 ? _a : DEFAULT_BASE_URL).replace(/\/$/, "");
        this.timeout = (_b = config.timeout) !== null && _b !== void 0 ? _b : DEFAULT_TIMEOUT;
    }
    // ─── check() ─────────────────────────────────────────────────────────────────
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
    async check(request) {
        var _a, _b;
        const body = {
            agent_id: request.agent_id,
            action: request.action,
            tool: request.tool,
            args: (_a = request.args) !== null && _a !== void 0 ? _a : {},
            source: (_b = request.source) !== null && _b !== void 0 ? _b : "external",
            user_intent: request.user_intent,
        };
        return this.post("/api/moltwall/check", body);
    }
    // ─── registerTool() ──────────────────────────────────────────────────────────
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
    async registerTool(tool) {
        var _a, _b, _c, _d;
        await this.post("/api/tools/register", {
            tool_id: tool.tool_id,
            publisher: tool.publisher,
            permissions: (_a = tool.permissions) !== null && _a !== void 0 ? _a : [],
            risk_level: (_b = tool.risk_level) !== null && _b !== void 0 ? _b : "medium",
            description: (_c = tool.description) !== null && _c !== void 0 ? _c : null,
            schema_hash: (_d = tool.schema_hash) !== null && _d !== void 0 ? _d : null,
        });
    }
    // ─── getLogs() ───────────────────────────────────────────────────────────────
    /**
     * Fetches paginated action logs from your MoltWall deployment.
     *
     * @example
     * const logs = await wall.getLogs({ decision: "deny", limit: 20 })
     */
    async getLogs(filters) {
        const params = new URLSearchParams();
        if (filters === null || filters === void 0 ? void 0 : filters.agent_id)
            params.set("agent_id", filters.agent_id);
        if (filters === null || filters === void 0 ? void 0 : filters.decision)
            params.set("decision", filters.decision);
        if (filters === null || filters === void 0 ? void 0 : filters.from)
            params.set("from", filters.from);
        if (filters === null || filters === void 0 ? void 0 : filters.to)
            params.set("to", filters.to);
        if (filters === null || filters === void 0 ? void 0 : filters.limit)
            params.set("limit", String(filters.limit));
        if (filters === null || filters === void 0 ? void 0 : filters.offset)
            params.set("offset", String(filters.offset));
        const qs = params.toString();
        const path = `/api/logs${qs ? `?${qs}` : ""}`;
        const result = await this.get(path);
        return result.logs;
    }
    // ─── Internal HTTP Helpers ───────────────────────────────────────────────────
    async post(path, body) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.timeout);
        try {
            const response = await fetch(`${this.baseUrl}${path}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": this.apiKey,
                },
                body: JSON.stringify(body),
                signal: controller.signal,
            });
            return this.handleResponse(response);
        }
        catch (err) {
            if (err instanceof types_1.MoltWallSDKError)
                throw err;
            const message = err instanceof Error ? err.message : "Network error";
            throw new types_1.MoltWallSDKError(`MoltWall request failed: ${message}`, 0, "NETWORK_ERROR");
        }
        finally {
            clearTimeout(timer);
        }
    }
    async get(path) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), this.timeout);
        try {
            const response = await fetch(`${this.baseUrl}${path}`, {
                method: "GET",
                headers: {
                    "x-api-key": this.apiKey,
                },
                signal: controller.signal,
            });
            return this.handleResponse(response);
        }
        catch (err) {
            if (err instanceof types_1.MoltWallSDKError)
                throw err;
            const message = err instanceof Error ? err.message : "Network error";
            throw new types_1.MoltWallSDKError(`MoltWall request failed: ${message}`, 0, "NETWORK_ERROR");
        }
        finally {
            clearTimeout(timer);
        }
    }
    async handleResponse(response) {
        var _a, _b;
        if (response.ok) {
            return response.json();
        }
        let errorBody = {};
        try {
            errorBody = (await response.json());
        }
        catch {
            // Non-JSON error body
        }
        throw new types_1.MoltWallSDKError((_a = errorBody.error) !== null && _a !== void 0 ? _a : `HTTP ${response.status}`, response.status, (_b = errorBody.code) !== null && _b !== void 0 ? _b : "HTTP_ERROR");
    }
}
exports.MoltWall = MoltWall;
/** @deprecated Use MoltWall */
exports.AgentWall = MoltWall;
