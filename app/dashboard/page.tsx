"use client";

import { useState, useEffect } from "react";
import { DecisionBadge } from "@/components/ui/DecisionBadge";
import { RiskBar } from "@/components/ui/RiskBar";
import { LocalDB } from "@/lib/local-db";
import type { ActionLog, DashboardStats, DecisionType, SourceType } from "@/types";

function StatItem({
  label, value, sub, subColor = "#22c55e",
}: { label: string; value: string; sub?: string; subColor?: string }) {
  return (
    <div className="flex-1 px-5 py-4 min-w-0">
      <p className="text-[11px] font-semibold tracking-wider text-[#555] uppercase mb-1 font-sans">{label}</p>
      <p className="stat-value text-white">{value}</p>
      {sub && <p className="text-[12px] mt-0.5" style={{ color: subColor }}>{sub}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    total_checks: 0, allow_count: 0, deny_count: 0, require_confirmation_count: 0, sandbox_count: 0, avg_risk_score: 0, high_risk_alerts: 0
  });
  const [recentLogs, setRecentLogs] = useState<ActionLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Playground state
  const [agentId, setAgentId] = useState("agent_001");
  const [actionName, setActionName] = useState("transfer_funds");
  const [toolName, setToolName] = useState("wallet");
  const [source, setSource] = useState("user");

  const loadData = () => {
    setStats(LocalDB.getStats());
    setRecentLogs(LocalDB.getLogs().slice(0, 10));
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFireRequest = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple local evaluation simulation
    const risk = Math.random();
    let decision: DecisionType = "allow";
    if (toolName === "wallet" && actionName.includes("transfer")) {
      decision = risk > 0.5 ? "deny" : "require_confirmation";
    } else if (risk > 0.8) {
      decision = "deny";
    } else if (risk > 0.5) {
      decision = "sandbox";
    }

    const log: ActionLog = {
      action_id: Math.random().toString(36).substring(7),
      agent_id: agentId,
      tool: toolName,
      action: actionName,
      args: { amount: 100 },
      risk_score: risk,
      decision,
      reason: "Local simulation decision",
      source: source as SourceType,
      org_id: null,
      timestamp: new Date().toISOString(),
    };

    LocalDB.addLog(log);
    loadData();
  };

  const total = stats.total_checks;

  if (loading) return null;

  return (
    <div className="bg-particles min-h-screen">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden px-8 pt-12 pb-8 border-b border-[#1e1e1e] bg-gradient-to-br from-[#2a1f00] via-[#1a1500] to-[#050505]">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#FFC400]/20 via-[#FFC400]/5 to-transparent blur-[120px] rounded-full pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#FFC400]/10 to-transparent blur-[120px] rounded-full pointer-events-none transform -translate-x-1/3 translate-y-1/3" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3 text-[#FFC400]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFC400] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FFC400]"></span>
            </span>
            <p className="text-xs font-bold tracking-[0.2em] uppercase font-display">
              Security Dashboard (Local Mode)
            </p>
          </div>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#aaa] leading-none uppercase tracking-tight">
            MONITOR YOUR <span className="text-[#FFC400] drop-shadow-[0_0_15px_rgba(255,196,0,0.3)]">AGENTS</span>
          </h1>
          <p className="text-[#888] text-sm md:text-base mt-4 max-w-2xl font-sans leading-relaxed">
            Real-time evaluation of every agent action by MoltWall 鎧. Simulating offline with zero backend dependencies.
            <span className="text-white font-medium ml-1">Enterprise-grade security, running entirely in your browser.</span>
          </p>
        </div>
      </div>

      {/* ── Stats bar ─────────────────────────────────────────────────────── */}
      <div className="border-b border-[#1e1e1e] bg-[#0a0a0a] relative shadow-[0_4px_20px_rgba(0,0,0,0.5)] z-20">
        <div className="flex divide-x divide-[#1e1e1e] overflow-x-auto scrollbar-hide">
          <StatItem label="Total Checks" value={total.toLocaleString()} sub={total > 0 ? "All time" : "No data yet"} subColor="#555" />
          <StatItem
            label="Allowed"
            value={stats.allow_count.toLocaleString()}
            sub={total > 0 ? `↑ ${Math.round((stats.allow_count / total) * 100)}%` : "—"}
            subColor="#22c55e"
          />
          <StatItem
            label="Denied"
            value={stats.deny_count.toLocaleString()}
            sub={total > 0 ? `↓ ${Math.round((stats.deny_count / total) * 100)}%` : "—"}
            subColor="#ef4444"
          />
          <StatItem
            label="Avg Risk Score"
            value={`${(stats.avg_risk_score * 100).toFixed(1)}%`}
            sub={stats.avg_risk_score >= 0.6 ? "⚠ High" : stats.avg_risk_score >= 0.3 ? "Medium" : "Low"}
            subColor={stats.avg_risk_score >= 0.6 ? "#ef4444" : stats.avg_risk_score >= 0.3 ? "#FFC400" : "#22c55e"}
          />
          <StatItem
            label="High Risk Alerts"
            value={stats.high_risk_alerts.toLocaleString()}
            sub={stats.high_risk_alerts > 0 ? "Require review" : "All clear"}
            subColor={stats.high_risk_alerts > 0 ? "#ef4444" : "#22c55e"}
          />
          <StatItem
            label="Sandboxed"
            value={stats.sandbox_count.toLocaleString()}
            sub={total > 0 ? `${Math.round((stats.sandbox_count / total) * 100)}%` : "—"}
            subColor="#FFC400"
          />
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────────────────────── */}
      <div className="px-8 py-7">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Playground & Decision breakdown (Left Col in xl) */}
          <div className="space-y-6">
            {/* Playground */}
            <div>
              <h2 className="font-display text-base font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#FFC400] animate-pulse"></span>
                Threat Simulator
              </h2>
              <form onSubmit={handleFireRequest} className="card p-5 space-y-4">
                <p className="text-xs text-[#777] leading-relaxed mb-2">
                  Send a simulated agent request through the local MoltWall evaluator.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-[#555] uppercase tracking-wider mb-1">Agent ID</label>
                    <input type="text" value={agentId} onChange={(e) => setAgentId(e.target.value)} className="w-full bg-[#050505] border border-[#2a2a2a] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FFC400] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#555] uppercase tracking-wider mb-1">Source</label>
                    <select value={source} onChange={(e) => setSource(e.target.value)} className="w-full bg-[#050505] border border-[#2a2a2a] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FFC400] transition-colors appearance-none">
                      <option value="user">User</option>
                      <option value="system">System</option>
                      <option value="developer">Developer</option>
                      <option value="external">External</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#555] uppercase tracking-wider mb-1">Tool</label>
                    <input type="text" value={toolName} onChange={(e) => setToolName(e.target.value)} className="w-full bg-[#050505] border border-[#2a2a2a] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FFC400] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#555] uppercase tracking-wider mb-1">Action</label>
                    <input type="text" value={actionName} onChange={(e) => setActionName(e.target.value)} className="w-full bg-[#050505] border border-[#2a2a2a] rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FFC400] transition-colors" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#111] hover:bg-[#FFC400] hover:text-black text-white text-[11px] font-bold uppercase tracking-widest py-2.5 rounded transition-all border border-[#2a2a2a] hover:border-[#FFC400]">
                  Execute Tool Call
                </button>
              </form>
            </div>

            {/* Decision breakdown */}
            <div>
              <h2 className="font-display text-base font-bold text-white uppercase tracking-wider mb-4">Decision Breakdown</h2>
              <div className="card p-4 space-y-3">
                {([
                  { label: "Allowed", count: stats.allow_count, color: "#22c55e" },
                  { label: "Denied", count: stats.deny_count, color: "#ef4444" },
                  { label: "Needs Confirm", count: stats.require_confirmation_count, color: "#FFC400" },
                  { label: "Sandboxed", count: stats.sandbox_count, color: "#777" },
                ] as const).map((item) => {
                  const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
                  return (
                    <div key={item.label}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-[#888] uppercase tracking-wider">{item.label}</span>
                        <span className="font-display text-sm font-bold" style={{ color: item.color }}>
                          {item.count} <span className="text-[#444] font-normal text-xs">({pct}%)</span>
                        </span>
                      </div>
                      <div className="h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: item.color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Actions (Right Col in xl) */}
          <div className="xl:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-base font-bold text-white uppercase tracking-wider">Recent Actions</h2>
              <a href="/dashboard/actions" className="text-[11px] text-[#FFC400] font-semibold tracking-wider uppercase hover:text-[#e6b000] transition-colors">
                View All →
              </a>
            </div>
            <div className="card overflow-hidden">
              {recentLogs.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="font-display text-xl font-bold text-[#222] uppercase">No Data Yet</p>
                  <p className="text-[#555] text-sm mt-2 font-sans max-w-sm mx-auto">
                    Use the Threat Simulator on the left to fire agent requests through MoltWall.
                  </p>
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Action / Tool</th>
                      <th>Decision</th>
                      <th className="w-32">Risk</th>
                      <th>Source</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLogs.map((log) => (
                      <tr key={log.action_id} className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <td>
                          <p className="text-white font-medium truncate max-w-[180px]">{log.action}</p>
                          <p className="text-[#555] text-xs mt-0.5">{log.tool}</p>
                        </td>
                        <td><DecisionBadge decision={log.decision} size="sm" /></td>
                        <td className="w-32"><RiskBar score={log.risk_score} showLabel={false} /></td>
                        <td>
                          <span className="text-xs text-[#777] bg-[#1a1a1a] border border-[#2a2a2a] px-2 py-0.5 rounded-full">
                            {log.source}
                          </span>
                        </td>
                        <td className="text-[#555] text-xs font-mono">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
