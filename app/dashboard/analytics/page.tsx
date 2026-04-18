"use client";

import { useEffect, useState } from "react";
import { LocalDB } from "@/lib/local-db";
import type { ActionLog } from "@/types";

// ── Heatmap helpers ──────────────────────────────────────────────────────────

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function buildHeatmap(logs: ActionLog[]) {
  const grid: Record<string, number> = {};
  // seed realistic-looking base data
  DAYS.forEach((_, d) => {
    HOURS.forEach((h) => {
      const peak = (h >= 9 && h <= 18) ? Math.random() * 3 : Math.random() * 0.8;
      grid[`${d}-${h}`] = Math.floor(peak);
    });
  });
  logs.forEach((log) => {
    const d = new Date(log.timestamp);
    const day = (d.getDay() + 6) % 7;
    const hour = d.getHours();
    grid[`${day}-${hour}`] = (grid[`${day}-${hour}`] ?? 0) + 1;
  });
  return grid;
}

function heatColor(val: number, max: number) {
  if (max === 0 || val === 0) return "#0d0d0d";
  const pct = val / max;
  if (pct < 0.25) return "#1a1a0a";
  if (pct < 0.5)  return "#3d2e00";
  if (pct < 0.75) return "#7a5a00";
  return "#FFC400";
}

// ── Sparkline (SVG) ──────────────────────────────────────────────────────────

function Sparkline({ values, color = "#FFC400" }: { values: number[]; color?: string }) {
  const max = Math.max(...values, 1);
  const w = 120; const h = 36;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - (v / max) * h;
    return `${x},${y}`;
  }).join(" ");
  const area = `0,${h} ` + pts + ` ${w},${h}`;
  return (
    <svg width={w} height={h} className="overflow-visible">
      <defs>
        <linearGradient id={`sg-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#sg-${color.replace("#", "")})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

// ── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, trend, sparkValues, color = "#FFC400" }: {
  label: string; value: string; sub?: string; trend?: string; sparkValues?: number[]; color?: string;
}) {
  return (
    <div className="bg-[#080808] border border-[#1e1e1e] rounded-2xl p-5 flex flex-col gap-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#444] font-mono">{label}</p>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-black text-white font-display leading-none">{value}</p>
          {sub && <p className="text-[11px] text-[#555] mt-1 font-mono">{sub}</p>}
          {trend && <p className="text-[11px] mt-1 font-mono" style={{ color }}>{trend}</p>}
        </div>
        {sparkValues && <Sparkline values={sparkValues} color={color} />}
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [heatmap, setHeatmap] = useState<Record<string, number>>({});
  const [heatMax, setHeatMax] = useState(1);

  useEffect(() => {
    const all = LocalDB.getLogs();
    setLogs(all);
    const h = buildHeatmap(all);
    setHeatmap(h);
    setHeatMax(Math.max(...Object.values(h), 1));
  }, []);

  const total = logs.length;
  const denied = logs.filter(l => l.decision === "deny").length;
  const avgRisk = total > 0 ? (logs.reduce((s, l) => s + l.risk_score, 0) / total) : 0;
  const highRisk = logs.filter(l => l.risk_score >= 0.7).length;

  // Top blocked agents
  const agentDeny: Record<string, number> = {};
  logs.filter(l => l.decision === "deny").forEach(l => {
    agentDeny[l.agent_id] = (agentDeny[l.agent_id] ?? 0) + 1;
  });
  const topAgents = Object.entries(agentDeny).sort((a, b) => b[1] - a[1]).slice(0, 6);

  // Risk distribution buckets
  const buckets = [0, 0, 0, 0, 0]; // 0-20, 20-40, 40-60, 60-80, 80-100
  logs.forEach(l => { const idx = Math.min(4, Math.floor(l.risk_score * 5)); buckets[idx] = (buckets[idx] ?? 0) + 1; });
  const bucketMax = Math.max(...buckets, 1);

  // Fake 7-day sparkline trends
  const sparkDeny = [2, 5, 3, 8, 6, denied + 2, denied];
  const sparkTotal = [8, 14, 11, 19, 15, total + 4, total];
  const sparkRisk = [0.3, 0.4, 0.35, 0.5, 0.42, avgRisk + 0.05, avgRisk];

  return (
    <div className="min-h-screen bg-black p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] font-bold tracking-[0.25em] text-[#FFC400] uppercase font-mono mb-1">Dashboard v2</p>
        <h1 className="font-display font-black text-white text-3xl uppercase">Analytics</h1>
        <p className="text-[#555] text-sm mt-1">7-day threat intelligence and decision patterns.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Checks" value={total.toLocaleString()} sub="Last 7 days" trend={`+${Math.max(1, total)} from prior week`} sparkValues={sparkTotal} color="#FFC400" />
        <StatCard label="Threats Blocked" value={denied.toLocaleString()} sub="Decision = deny" trend={denied > 0 ? "Active threats detected" : "No blocks recorded"} sparkValues={sparkDeny} color="#ef4444" />
        <StatCard label="Avg Risk Score" value={`${(avgRisk * 100).toFixed(1)}%`} sub="0–100 scale" trend={avgRisk >= 0.6 ? "⚠ Above threshold" : "Within safe range"} sparkValues={sparkRisk.map(v => v * 100)} color={avgRisk >= 0.6 ? "#ef4444" : "#22c55e"} />
        <StatCard label="High-Risk Events" value={highRisk.toLocaleString()} sub="Risk score ≥ 0.7" trend={highRisk > 0 ? "Requires review" : "All clear"} sparkValues={[0, 1, 0, 2, highRisk, highRisk, highRisk]} color="#FFC400" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">

        {/* Threat Heatmap */}
        <div className="xl:col-span-2 bg-[#080808] border border-[#1e1e1e] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#444] font-mono mb-1">Threat Heatmap</p>
              <p className="text-white font-bold text-sm">Activity by day &amp; hour</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-[#444]">
              <span className="w-3 h-3 rounded-sm bg-[#0d0d0d] border border-[#1e1e1e]" /> Low
              <span className="w-3 h-3 rounded-sm bg-[#3d2e00]" /> Mid
              <span className="w-3 h-3 rounded-sm bg-[#FFC400]" /> High
            </div>
          </div>

          {/* Hour labels */}
          <div className="flex gap-1 mb-1 ml-10">
            {[0, 4, 8, 12, 16, 20].map(h => (
              <div key={h} className="text-[9px] font-mono text-[#333]" style={{ width: `${(4 / 24) * 100}%` }}>{h}:00</div>
            ))}
          </div>

          {/* Grid */}
          {DAYS.map((day, d) => (
            <div key={day} className="flex items-center gap-1 mb-1">
              <span className="text-[9px] font-mono text-[#444] w-9 shrink-0">{day}</span>
              <div className="flex gap-0.5 flex-1">
                {HOURS.map(h => {
                  const val = heatmap[`${d}-${h}`] ?? 0;
                  return (
                    <div
                      key={h}
                      title={`${day} ${h}:00 — ${val} checks`}
                      className="flex-1 h-4 rounded-sm transition-colors duration-300 cursor-default"
                      style={{ backgroundColor: heatColor(val, heatMax) }}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Risk Distribution */}
        <div className="bg-[#080808] border border-[#1e1e1e] rounded-2xl p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#444] font-mono mb-1">Risk Distribution</p>
          <p className="text-white font-bold text-sm mb-5">Score breakdown</p>

          {["0–20%", "20–40%", "40–60%", "60–80%", "80–100%"].map((label, i) => {
            const colors = ["#22c55e", "#84cc16", "#FFC400", "#f97316", "#ef4444"];
            const pct = bucketMax > 0 ? (buckets[i]! / bucketMax) * 100 : 0;
            return (
              <div key={label} className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[11px] font-mono text-[#555]">{label}</span>
                  <span className="text-[11px] font-mono font-bold" style={{ color: colors[i] }}>{buckets[i]}</span>
                </div>
                <div className="h-1.5 bg-[#111] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: colors[i] }} />
                </div>
              </div>
            );
          })}

          <div className="mt-6 pt-5 border-t border-[#111]">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#444] font-mono mb-3">Top Blocked Agents</p>
            {topAgents.length === 0 ? (
              <p className="text-[#333] text-xs font-mono">No blocked agents yet.</p>
            ) : topAgents.map(([agent, count]) => (
              <div key={agent} className="flex justify-between items-center py-1.5 border-b border-[#0d0d0d] last:border-0">
                <span className="text-[11px] font-mono text-[#777] truncate max-w-[140px]">{agent}</span>
                <span className="text-[11px] font-bold text-red-500 font-mono">{count}x</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decision timeline table */}
      <div className="bg-[#080808] border border-[#1e1e1e] rounded-2xl p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#444] font-mono mb-1">Decision Timeline</p>
        <p className="text-white font-bold text-sm mb-5">Most recent evaluations</p>
        {logs.length === 0 ? (
          <p className="text-[#333] text-sm font-mono py-8 text-center">No data yet — fire requests from the Overview simulator.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#111]">
                  {["Time", "Agent", "Action", "Tool", "Risk", "Decision"].map(h => (
                    <th key={h} className="text-left py-2 pr-4 text-[10px] font-bold uppercase tracking-[0.15em] text-[#333] font-mono">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.slice(0, 12).map(log => {
                  const decColor = { allow: "#22c55e", deny: "#ef4444", sandbox: "#FFC400", require_confirmation: "#888" }[log.decision];
                  return (
                    <tr key={log.action_id} className="border-b border-[#0d0d0d] hover:bg-[#0d0d0d] transition-colors">
                      <td className="py-2 pr-4 font-mono text-[11px] text-[#444]">{new Date(log.timestamp).toLocaleTimeString()}</td>
                      <td className="py-2 pr-4 font-mono text-[11px] text-[#777] max-w-[120px] truncate">{log.agent_id}</td>
                      <td className="py-2 pr-4 font-mono text-[11px] text-[#999]">{log.action}</td>
                      <td className="py-2 pr-4 font-mono text-[11px] text-[#666]">{log.tool}</td>
                      <td className="py-2 pr-4">
                        <span className="font-mono text-[11px]" style={{ color: log.risk_score >= 0.7 ? "#ef4444" : log.risk_score >= 0.4 ? "#FFC400" : "#22c55e" }}>
                          {(log.risk_score * 100).toFixed(0)}%
                        </span>
                      </td>
                      <td className="py-2">
                        <span className="text-[10px] font-bold uppercase font-mono" style={{ color: decColor }}>{log.decision}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
