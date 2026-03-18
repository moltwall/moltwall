"use client";

import { useState, useEffect } from "react";
import { ToolRegistryTable } from "@/components/tools/ToolRegistryTable";
import { LocalDB } from "@/lib/local-db";
import type { Tool } from "@/types";

export default function ToolsPage() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    // Map our simple ToolRegistry dummy format to the Tool type expected by table if needed
    // The table probably just needs something similar
    const data = LocalDB.getTools().map(t => ({
      tool_id: t.id,
      publisher: "local-user",
      permissions: [],
      risk_level: t.risk_level,
      schema_hash: null,
      description: t.description,
      created_at: new Date().toISOString()
    })) as unknown as Tool[];

    setTools(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const byRisk = {
    low: tools.filter((t) => t.risk_level === "low").length,
    medium: tools.filter((t) => t.risk_level === "medium").length,
    high: tools.filter((t) => t.risk_level === "high").length
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
              Tool Registry (Local)
            </p>
          </div>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#aaa] leading-none uppercase tracking-tight">
            MANAGE YOUR <span className="text-[#FFC400] drop-shadow-[0_0_15px_rgba(255,196,0,0.3)]">ARSENAL</span>
          </h1>
          <p className="text-[#888] text-sm md:text-base mt-4 max-w-2xl font-sans leading-relaxed">
            Register, inspect, and govern the tools available to your AI agents.
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="border-b border-[#1e1e1e] bg-[#0a0a0a]">
        <div className="flex divide-x divide-[#1e1e1e] overflow-x-auto">
          {([
            { label: "Registered", value: tools.length, color: "#fff" },
            { label: "Low Risk", value: byRisk.low, color: "#22c55e" },
            { label: "Medium Risk", value: byRisk.medium, color: "#FFC400" },
            { label: "High Risk", value: byRisk.high, color: "#ef4444" },
          ] as const).map((s) => (
            <div key={s.label} className="flex-1 px-5 py-4 min-w-[100px]">
              <p className="text-[11px] font-semibold tracking-wider text-[#555] uppercase mb-1 font-sans">{s.label}</p>
              <p className="stat-value" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Info banner */}
      <div className="px-8 pt-6">
        <div className="flex items-start gap-3 bg-[#111] border border-[#1e1e1e] rounded-xl p-4">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#FFC400] shrink-0 mt-0.5">
            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3" />
            <path d="M8 7v4M8 5v1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <p className="text-xs text-[#777] leading-relaxed font-sans">
            Tool definitions are scanned on registration for prompt injection by MoltWall. The <code className="text-[#FFC400] bg-[#FFC400]/10 px-1 py-0.5 rounded text-[11px]">tool_id</code> field is used
            to match tools in policy <span className="text-white">allowed_tools</span> and action check requests.
          </p>
        </div>
      </div>

      {/* Table + Register form */}
      <div className="px-8 py-6">
        <ToolRegistryTable initialTools={tools} />
      </div>
    </div>
  );
}
