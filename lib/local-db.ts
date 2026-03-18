import type { ActionLog, DashboardStats, Policy } from "@/types";

export interface ToolRegistry {
  id: string;
  name: string;
  description: string;
  risk_level: "low" | "medium" | "high";
  status: "active" | "deprecated";
  category: "finance" | "system" | "data" | "network";
}

const DEFAULT_POLICY: Policy = {
  id: "00000000-0000-0000-0000-000000000000",
  org_id: "00000000-0000-0000-0000-000000000000",
  allowed_tools: [],
  blocked_actions: [],
  trusted_domains: [],
  max_spend_usd: 100,
  sensitive_actions: ["payment", "transfer", "delete", "withdraw", "send"],
  risk_threshold_allow: 0.3,
  risk_threshold_sandbox: 0.6,
  risk_threshold_deny: 0.8,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const DEFAULT_TOOLS: ToolRegistry[] = [
  { id: "tool_1", name: "wallet_transfer", description: "Transfers funds between wallets", risk_level: "high", status: "active", category: "finance" },
  { id: "tool_2", name: "read_file", description: "Reads a local filesystem file", risk_level: "medium", status: "active", category: "system" },
  { id: "tool_3", name: "fetch_data", description: "GET request to external API", risk_level: "low", status: "active", category: "network" },
];

export const LocalDB = {
  getLogs: (): ActionLog[] => {
    if (typeof window === "undefined") return [];
    try {
      const data = localStorage.getItem("moltwall_logs");
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  },
  
  addLog: (log: ActionLog) => {
    if (typeof window === "undefined") return;
    const logs = LocalDB.getLogs();
    logs.unshift(log); // add to top
    // Keep max 50 for dummy purposes
    localStorage.setItem("moltwall_logs", JSON.stringify(logs.slice(0, 50)));
  },

  getStats: (): DashboardStats => {
    const logs = LocalDB.getLogs();
    const total = logs.length;
    return {
      total_checks: total,
      allow_count: logs.filter((l) => l.decision === "allow").length,
      deny_count: logs.filter((l) => l.decision === "deny").length,
      require_confirmation_count: logs.filter((l) => l.decision === "require_confirmation").length,
      sandbox_count: logs.filter((l) => l.decision === "sandbox").length,
      avg_risk_score: total > 0 ? logs.reduce((s, l) => s + l.risk_score, 0) / total : 0,
      high_risk_alerts: logs.filter((l) => l.risk_score >= 0.6).length,
    };
  },

  getPolicy: (): Policy => {
    if (typeof window === "undefined") return DEFAULT_POLICY;
    const data = localStorage.getItem("moltwall_policy");
    if (!data) {
      localStorage.setItem("moltwall_policy", JSON.stringify(DEFAULT_POLICY));
      return DEFAULT_POLICY;
    }
    return JSON.parse(data);
  },

  savePolicy: (policy: Policy) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("moltwall_policy", JSON.stringify(policy));
  },

  getTools: (): ToolRegistry[] => {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem("moltwall_tools");
    if (!data) {
      localStorage.setItem("moltwall_tools", JSON.stringify(DEFAULT_TOOLS));
      return DEFAULT_TOOLS;
    }
    return JSON.parse(data);
  },

  addTool: (tool: ToolRegistry) => {
    if (typeof window === "undefined") return;
    const tools = LocalDB.getTools();
    tools.unshift(tool);
    localStorage.setItem("moltwall_tools", JSON.stringify(tools));
  },

  clearAll: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("moltwall_logs");
    localStorage.removeItem("moltwall_policy");
    localStorage.removeItem("moltwall_tools");
  }
};
