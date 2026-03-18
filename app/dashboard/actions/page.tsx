"use client";

import { useState, useEffect } from "react";
import { ActionLogsTable } from "@/components/actions/ActionLogsTable";
import type { ActionLog } from "@/types";
import { LocalDB } from "@/lib/local-db";

export default function ActionsPage() {
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLogs(LocalDB.getLogs());
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const counts = {
    allow: logs.filter((l) => l.decision === "allow").length,
    deny: logs.filter((l) => l.decision === "deny").length,
    require_confirmation: logs.filter((l) => l.decision === "require_confirmation").length,
    sandbox: logs.filter((l) => l.decision === "sandbox").length,
  };

  if (loading) return null;

  return (
    <div className="bg-particles min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden px-8 pt-12 pb-8 border-b border-[#1e1e1e] bg-gradient-to-br from-[#2a1f00] via-[#1a1500] to-[#050505]">
        {/* Glow effects */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-[#FFC400]/20 via-[#FFC400]/5 to-transparent blur-[120px] rounded-full pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-[#FFC400]/10 to-transparent blur-[120px] rounded-full pointer-events-none transform -translate-x-1/3 translate-y-1/3" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3 text-[#FFC400]">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFC400] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FFC400]"></span>
            </span>
            <p className="text-xs font-bold tracking-[0.2em] uppercase font-display">
              Audit Trail (Local)
            </p>
          </div>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#aaa] leading-none uppercase tracking-tight">
            EVERY ACTION: <span className="text-[#FFC400] drop-shadow-[0_0_15px_rgba(255,196,0,0.3)]">LOGGED</span>
          </h1>
          <p className="text-[#888] text-sm md:text-base mt-4 max-w-2xl font-sans leading-relaxed">
            Complete audit trail of every simulated agent action evaluated by the local MoltWall. Click any row to inspect arguments and threat details.
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="border-b border-[#1e1e1e] bg-[#0a0a0a]">
        <div className="flex divide-x divide-[#1e1e1e] overflow-x-auto">
          {([
            { label: "Total", value: logs.length, color: "#fff" },
            { label: "Allowed", value: counts.allow, color: "#22c55e" },
            { label: "Denied", value: counts.deny, color: "#ef4444" },
            { label: "Needs Confirm", value: counts.require_confirmation, color: "#FFC400" },
            { label: "Sandboxed", value: counts.sandbox, color: "#777" },
          ] as const).map((s) => (
            <div key={s.label} className="flex-1 px-5 py-4 min-w-[100px]">
              <p className="text-[11px] font-semibold tracking-wider text-[#555] uppercase mb-1 font-sans">{s.label}</p>
              <p className="stat-value" style={{ color: s.color }}>{s.value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="px-8 py-7">
        <ActionLogsTable logs={logs} />
      </div>
    </div>
  );
}
