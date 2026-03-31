"use client";

import { useEffect, useState } from "react";
import { telemetry, type TelemetrySnapshot } from "@/lib/telemetry";

function Metric({ label, value, unit, color = "#FFC400" }: {
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#444] font-mono">{label}</span>
      <span className="text-xl font-black font-display" style={{ color }}>
        {value}<span className="text-xs text-[#555] font-normal ml-0.5">{unit}</span>
      </span>
    </div>
  );
}

export function TelemetryPanel() {
  const [snap, setSnap] = useState<TelemetrySnapshot | null>(null);

  useEffect(() => {
    const update = () => setSnap(telemetry.snapshot());
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  if (!snap) return null;

  const totalDecisions = Object.values(snap.decisionBreakdown).reduce((a, b) => a + b, 0);

  return (
    <div className="bg-[#080808] border border-[#1e1e1e] rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFC400] animate-pulse shadow-[0_0_6px_rgba(255,196,0,0.8)]" />
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#555] font-mono">
            Live Telemetry
          </span>
        </div>
        <span className="text-[9px] font-mono text-[#333] uppercase">1-min rolling window</span>
      </div>

      {/* Latency grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-5 border-b border-[#111]">
        <Metric label="Throughput" value={snap.checksPerSecond.toFixed(1)} unit="req/s" />
        <Metric label="p50 Latency" value={snap.p50LatencyMs.toFixed(1)} unit="ms" color="#22c55e" />
        <Metric label="p95 Latency" value={snap.p95LatencyMs.toFixed(1)} unit="ms" color="#FFC400" />
        <Metric
          label="p99 Latency"
          value={snap.p99LatencyMs.toFixed(1)}
          unit="ms"
          color={snap.p99LatencyMs > 50 ? "#ef4444" : "#FFC400"}
        />
      </div>

      {/* Secondary row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-5">
        <Metric
          label="Error Rate"
          value={(snap.errorRate * 100).toFixed(2)}
          unit="%"
          color={snap.errorRate > 0.01 ? "#ef4444" : "#22c55e"}
        />
        <Metric label="Active Agents" value={snap.activeAgents} color="#aaa" />
        <Metric label="Total Decisions" value={totalDecisions.toLocaleString()} color="#aaa" />
      </div>

      {/* Decision mini-bars */}
      {totalDecisions > 0 && (
        <div className="mt-5 space-y-1.5">
          {(
            [
              { key: "allow", label: "Allow", color: "#22c55e" },
              { key: "deny", label: "Deny", color: "#ef4444" },
              { key: "sandbox", label: "Sandbox", color: "#FFC400" },
              { key: "require_confirmation", label: "Confirm", color: "#888" },
            ] as const
          ).map(({ key, label, color }) => {
            const count = snap.decisionBreakdown[key];
            const pct = totalDecisions > 0 ? (count / totalDecisions) * 100 : 0;
            return (
              <div key={key} className="flex items-center gap-3">
                <span className="text-[10px] font-mono text-[#444] w-14 shrink-0">{label}</span>
                <div className="flex-1 h-1 bg-[#111] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: color }}
                  />
                </div>
                <span className="text-[10px] font-mono w-8 text-right" style={{ color }}>
                  {pct.toFixed(0)}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
