"use client";

import { useEffect, useState, useCallback } from "react";
import { PolicyEditor } from "@/components/policies/PolicyEditor";
import type { Policy } from "@/types";
import { LocalDB } from "@/lib/local-db";

export default function PoliciesPage() {
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPolicy = useCallback(async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const pol = LocalDB.getPolicy();
    setPolicy(pol);
    setLoading(false);
  }, []);

  useEffect(() => { fetchPolicy(); }, [fetchPolicy]);

  async function handleSave(data: Partial<Policy>) {
    // Merge new values into existing policy
    const newPol = { ...policy, ...data, updated_at: new Date().toISOString() } as Policy;
    LocalDB.savePolicy(newPol);
    await new Promise(r => setTimeout(r, 400));
    setPolicy(newPol);
  }

  async function handleDelete() {
    // Reset to default
    localStorage.removeItem("moltwall_policy");
    await fetchPolicy();
  }

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
              Access Control (Local Mode)
            </p>
          </div>
          <h1 className="font-display text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-[#aaa] leading-none uppercase tracking-tight">
            DEFINE THE <span className="text-[#FFC400] drop-shadow-[0_0_15px_rgba(255,196,0,0.3)]">RULES</span>
          </h1>
          <p className="text-[#888] text-sm md:text-base mt-4 max-w-2xl font-sans leading-relaxed">
            Configure allowed tools, blocked actions, domain trust, spend limits, and risk thresholds for your agents.
            <span className="text-white font-medium ml-1">Safeguard operations before they execute.</span>
          </p>
        </div>

        {/* Policy status */}
        {!loading && (
          <div className="flex items-center gap-4 mt-4">
            {policy ? (
              <>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#22c55e] font-sans">
                  <span className="size-1.5 rounded-full bg-[#22c55e]" /> Policy Active
                </span>
                {policy.updated_at && (
                  <span className="text-xs text-[#555] font-sans">
                    Last updated {new Date(policy.updated_at).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                )}
              </>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FFC400] font-sans">
                <span className="size-1.5 rounded-full bg-[#FFC400]" /> Default Policy Active
              </span>
            )}
            <button onClick={fetchPolicy} disabled={loading}
              className="ml-auto btn-ghost text-xs">
              ↻ Reload
            </button>
          </div>
        )}
      </div>

      <div className="px-8 py-7 space-y-6 max-w-5xl">
        {/* Editor */}
        {loading ? (
          <div className="card p-10 flex items-center justify-center gap-3">
            <svg className="animate-spin size-5 text-[#FFC400]" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="60" strokeDashoffset="20" />
            </svg>
            <span className="text-[#777] font-sans">Loading policy…</span>
          </div>
        ) : (
          <PolicyEditor policy={policy} onSave={handleSave} onDelete={policy ? handleDelete : undefined} />
        )}

        {/* Reference */}
        <div className="relative group p-6 rounded-2xl border border-[#1e1e1e] bg-gradient-to-b from-[#111] to-[#050505] overflow-hidden">
          <div className="absolute inset-0 bg-[#FFC400]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <h2 className="relative font-display text-sm font-bold text-white uppercase tracking-wider mb-6 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[#FFC400]"></span> Field Reference
          </h2>
          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { label: "Allowed Tools", desc: "Whitelist of tool IDs. Empty = all tools permitted.", accent: "#FFC400" },
              { label: "Blocked Actions", desc: "Always denied, regardless of risk score.", accent: "#ef4444" },
              { label: "Trusted Domains", desc: "Untrusted domains increase risk score.", accent: "#FFC400" },
              { label: "Sensitive Actions", desc: "Not blocked but flagged for extra scrutiny.", accent: "#FFC400" },
              { label: "Max Spend USD", desc: "Monetary cap enforced on transaction args.", accent: "#777" },
              { label: "Risk Thresholds", desc: "Score bands: allow / confirm / sandbox / deny.", accent: "#FFC400" },
            ].map((item) => (
              <div key={item.label} className="flex gap-3 bg-[#0a0a0a] border border-[#1e1e1e] p-4 rounded-xl hover:border-[#333] transition-colors">
                <span className="size-1.5 rounded-full shrink-0 mt-1.5 shadow-[0_0_8px_currentColor]" style={{ background: item.accent, color: item.accent }} />
                <div>
                  <p className="text-sm font-semibold text-white tracking-wide">{item.label}</p>
                  <p className="text-xs text-[#666] mt-1 leading-relaxed font-sans">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
