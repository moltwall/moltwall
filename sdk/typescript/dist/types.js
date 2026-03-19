"use strict";
// MoltWall TypeScript SDK -Public Type Definitions
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentWallSDKError = exports.MoltWallSDKError = void 0;
// ─── SDK Error ────────────────────────────────────────────────────────────────
class MoltWallSDKError extends Error {
    constructor(message, statusCode, code) {
        super(message);
        this.name = "MoltWallSDKError";
        this.statusCode = statusCode;
        this.code = code;
    }
}
exports.MoltWallSDKError = MoltWallSDKError;
/** @deprecated Use MoltWallSDKError */
exports.AgentWallSDKError = MoltWallSDKError;
