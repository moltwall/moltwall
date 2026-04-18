"use client";

import { useState } from "react";

interface AgentQuota {
  id: string;
  agent_id: string;
  requests_per_minute: number;
  requests_per_day: number;
  max_spend_usd: number;
  used_today: number;
  used_minute: number;
  status: "active" | "throttled" | "blocked";
}

const INITIAL_QUOTAS: AgentQuota[] = [
  { id: "q1", agent_id: "TradingBot-V4",     requests_per_minute: 60,  requests_per_day: 5000,  max_spend_usd: 500,  used_today: 1842, used_minute: 12, status: "active"    },
  { id: "q2", agent_id: "ResearchAgent",      requests_per_minute: 30,  requests_per_day: 2000,  max_spend_usd: 100,  used_today: 1987, used_minute: 31, status: "throttled" },
  { id: "q3", agent_id: "CustomerSupport-AI", requests_per_minute: 120, requests_per_day: 10000, max_spend_usd: 200,  used_today: 3201, used_minute: 44, status: "active"    },
  { id: "q4", agent_id: "DataScraper-09",     requests_per_minute: 10,  requests_per_day: 500,   max_spend_usd: 50,   used_today: 502,  used_minute: 10, status: "blocked"   },
  { id: "q5", agent_id: "AutoGPT-Core",       requests_per_minute: 60,  requests_per_day: 3000,  max_spend_usd: 300,  used_today: 891,  used_minute: 8,  status: "active"    },
];

const STATUS_STYLE = {
  active:    { dot: "bg-[#22c55e] shadow-[0_0_6px_rgba(34,197,94,0.8)]",  text: "text-[#22c55e]",  label: "ACTIVE"    },
  throttled: { dot: "bg-[#FFC400] shadow-[0_0_6px_rgba(255,196,0,0.8)]",  text: "text-[#FFC400]",  label: "THROTTLED" },
  blocked:   { dot: "bg-[#ef4444] shadow-[0_0_6px_rgba(239,68,68,0.8)]",  text: "text-[#ef4444]",  label: "BLOCKED"   },
};

function UsageBar({ used, limit, color = "#FFC400" }: { used: number; limit: number; color?: string }) {
  const pct = Math.min(100, (used / limit) * 100);
  const barColor = pct >= 100 ? "#ef4444" : pct >= 80 ? "#f97316" : color;
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-[#111] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: barColor }} />
      </div>
      <span className="text-[10px] font-mono text-[#444] w-20 text-right shrink-0">
        {used.toLocaleString()} / {limit.toLocaleString()}
      </span>
    </div>
  );
}

export default function RateLimitsPage() {
  const [quotas, setQuotas] = useState<AgentQuota[]>(INITIAL_QUOTAS);
  const [adding, setAdding] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ agent_id: "", requests_per_minute: "60", requests_per_day: "5000", max_spend_usd: "100" });

  const totalActive    = quotas.filter(q => q.status === "active").length;
  const totalThrottled = quotas.filter(q => q.status === "throttled").length;
  const totalBlocked   = quotas.filter(q => q.status === "blocked").length;

  function handleSave() {
    if (!form.agent_id.trim()) return;
    if (editId) {
      setQuotas(prev => prev.map(q => q.id === editId ? {
        ...q,
        agent_id: form.agent_id,
        requests_per_minute: parseInt(form.requests_per_minute),
        requests_per_day: parseInt(form.requests_per_day),
        max_spend_usd: parseInt(form.max_spend_usd),
      } : q));
      setEditId(null);
    } else {
      setQuotas(prev => [...prev, {
        id: `q${Date.now()}`,
        agent_id: form.agent_id,
        requests_per_minute: parseInt(form.requests_per_minute),
        requests_per_day: parseInt(form.requests_per_day),
        max_spend_usd: parseInt(form.max_spend_usd),
        used_today: 0,
        used_minute: 0,
        status: "active",
      }]);
      setAdding(false);
    }
    setForm({ agent_id: "", requests_per_minute: "60", requests_per_day: "5000", max_spend_usd: "100" });
  }

  function handleEdit(q: AgentQuota) {
    setForm({ agent_id: q.agent_id, requests_per_minute: String(q.requests_per_minute), requests_per_day: String(q.requests_per_day), max_spend_usd: String(q.max_spend_usd) });
    setEditId(q.id);
    setAdding(true);
  }

  function handleDelete(id: string) {
    setQuotas(prev => prev.filter(q => q.id !== id));
  }

  function toggleStatus(id: string) {
    setQuotas(prev => prev.map(q => q.id === id ? {
      ...q, status: q.status === "blocked" ? "active" : "blocked"
    } : q));
  }

  return (
    <div className="min-h-screen bg-black p-8">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[10px] font-bold tracking-[0.25em] text-[#FFC400] uppercase font-mono mb-1">Rate Limiting</p>
          <h1 className="font-display font-black text-white text-3xl uppercase">Per-Agent Quotas</h1>
          <p className="text-[#555] text-sm mt-1">Control request rates, daily limits, and spend caps per agent.</p>
        </div>
        <button
          onClick={() => { setAdding(true); setEditId(null); setForm({ agent_id: "", requests_per_minute: "60", requests_per_day: "5000", max_spend_usd: "100" }); }}
          className="flex items-center gap-2 bg-[#FFC400] text-black text-[12px] font-black uppercase tracking-widest px-5 py-2.5 rounded-xl hover:bg-[#e6b000] transition-all font-display"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
          Add Agent
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Active Agents",    value: totalActive,    color: "#22c55e" },
          { label: "Throttled",         value: totalThrottled, color: "#FFC400" },
          { label: "Blocked",           value: totalBlocked,   color: "#ef4444" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-[#080808] border border-[#1e1e1e] rounded-2xl p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#444] font-mono mb-2">{label}</p>
            <p className="text-3xl font-black font-display" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Add / Edit form */}
      {adding && (
        <div className="bg-[#080808] border border-[#FFC400]/20 rounded-2xl p-6 mb-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FFC400] font-mono mb-4">
            {editId ? "Edit Quota" : "New Agent Quota"}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {[
              { key: "agent_id",              label: "Agent ID",           placeholder: "my-agent" },
              { key: "requests_per_minute",   label: "Req / Minute",       placeholder: "60" },
              { key: "requests_per_day",      label: "Req / Day",          placeholder: "5000" },
              { key: "max_spend_usd",         label: "Max Spend (USD)",    placeholder: "100" },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="block text-[10px] text-[#444] uppercase tracking-wider mb-1 font-mono">{label}</label>
                <input
                  type={key === "agent_id" ? "text" : "number"}
                  value={(form as Record<string, string>)[key]}
                  placeholder={placeholder}
                  onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  className="w-full bg-[#050505] border border-[#2a2a2a] focus:border-[#FFC400]/50 rounded-lg px-3 py-2 text-sm text-white font-mono outline-none transition-colors"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} className="bg-[#FFC400] text-black text-[11px] font-black uppercase tracking-widest px-5 py-2 rounded-lg hover:bg-[#e6b000] transition-all font-display">
              {editId ? "Save Changes" : "Create Quota"}
            </button>
            <button onClick={() => { setAdding(false); setEditId(null); }} className="text-[#555] text-[11px] font-bold uppercase tracking-widest px-5 py-2 rounded-lg border border-[#222] hover:border-[#444] hover:text-white transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Quota table */}
      <div className="bg-[#080808] border border-[#1e1e1e] rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#111] flex items-center justify-between">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#444] font-mono">Agent Quotas</p>
          <p className="text-[10px] font-mono text-[#333]">{quotas.length} agents configured</p>
        </div>

        <div className="divide-y divide-[#0d0d0d]">
          {quotas.map(q => {
            const st = STATUS_STYLE[q.status];
            return (
              <div key={q.id} className="px-6 py-5 hover:bg-[#0a0a0a] transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${st.dot}`} />
                    <div>
                      <p className="text-sm font-bold text-white font-mono">{q.agent_id}</p>
                      <p className={`text-[10px] font-bold uppercase tracking-widest font-mono mt-0.5 ${st.text}`}>{st.label}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(q)} className="text-[10px] font-mono text-[#444] hover:text-[#FFC400] transition-colors px-2 py-1 border border-[#1e1e1e] rounded-lg hover:border-[#FFC400]/30">
                      Edit
                    </button>
                    <button onClick={() => toggleStatus(q.id)} className={`text-[10px] font-mono px-2 py-1 border rounded-lg transition-colors ${q.status === "blocked" ? "text-[#22c55e] border-[#22c55e]/20 hover:border-[#22c55e]/40" : "text-[#ef4444] border-[#ef4444]/20 hover:border-[#ef4444]/40"}`}>
                      {q.status === "blocked" ? "Unblock" : "Block"}
                    </button>
                    <button onClick={() => handleDelete(q.id)} className="text-[10px] font-mono text-[#333] hover:text-[#ef4444] transition-colors px-2 py-1 border border-[#1e1e1e] rounded-lg hover:border-[#ef4444]/20">
                      Remove
                    </button>
                  </div>
                </div>

                {/* Limits */}
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-[9px] font-mono text-[#333] uppercase tracking-wider mb-1.5">Requests / min</p>
                    <UsageBar used={q.used_minute} limit={q.requests_per_minute} color="#FFC400" />
                  </div>
                  <div>
                    <p className="text-[9px] font-mono text-[#333] uppercase tracking-wider mb-1.5">Requests / day</p>
                    <UsageBar used={q.used_today} limit={q.requests_per_day} color="#FFC400" />
                  </div>
                  <div>
                    <p className="text-[9px] font-mono text-[#333] uppercase tracking-wider mb-1.5">Spend cap (USD)</p>
                    <UsageBar used={Math.floor(q.used_today * 0.08)} limit={q.max_spend_usd} color="#22c55e" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Global limits note */}
      <div className="mt-6 bg-[#080808] border border-[#1e1e1e] rounded-2xl p-5 flex items-start gap-4">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#FFC400] shrink-0 mt-0.5">
          <path d="M8 1L1.5 4v4.5c0 3.5 2.8 5.8 6.5 6.5 3.7-.7 6.5-3 6.5-6.5V4L8 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
          <path d="M8 5v4M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <div>
          <p className="text-[12px] font-bold text-white mb-1">Global fallback limits apply</p>
          <p className="text-[11px] text-[#555] leading-relaxed">
            Agents without a quota entry inherit global defaults: 30 req/min · 1,000 req/day · $50 spend cap.
            Blocked agents have all requests denied at the gateway before policy evaluation.
          </p>
        </div>
      </div>
    </div>
  );
}
