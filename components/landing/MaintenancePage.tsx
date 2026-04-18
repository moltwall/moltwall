"use client";

import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { GridCanvas } from "@/components/ui/GridCanvas";

/* ─── SVG Plugs ──────────────────────────────────────────────────────────── */

function MalePlug() {
  return (
    <svg width="96" height="68" viewBox="0 0 96 68" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cable stub */}
      <rect x="0" y="27" width="10" height="14" rx="3" fill="#141414" stroke="#252525" strokeWidth="1.2" />
      {/* Body */}
      <rect x="8" y="4" width="50" height="60" rx="12" fill="#0d0d0d" stroke="#2a2a2a" strokeWidth="1.5" />
      {/* Inner highlight */}
      <rect x="11" y="7" width="22" height="26" rx="7" fill="white" fillOpacity="0.03" />
      {/* Prong top */}
      <rect x="55" y="18" width="41" height="12" rx="4" fill="#FFC400" />
      <rect x="55" y="18" width="22" height="5" rx="3" fill="#FFE066" fillOpacity="0.55" />
      {/* Prong bottom */}
      <rect x="55" y="38" width="41" height="12" rx="4" fill="#FFC400" />
      <rect x="55" y="38" width="22" height="5" rx="3" fill="#FFE066" fillOpacity="0.55" />
      {/* MW label */}
      <text x="32" y="36" textAnchor="middle" dominantBaseline="middle" fontSize="9" fill="#2a2a2a" fontFamily="monospace" fontWeight="bold">MW</text>
      {/* Status dot */}
      <circle cx="32" cy="50" r="3" fill="#FFC400" fillOpacity="0.35" />
    </svg>
  );
}

function FemaleSocket() {
  return (
    <svg width="96" height="68" viewBox="0 0 96 68" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Socket holes */}
      <rect x="0" y="18" width="30" height="12" rx="4" fill="#050505" stroke="#1c1c1c" strokeWidth="1.2" />
      <rect x="0" y="38" width="30" height="12" rx="4" fill="#050505" stroke="#1c1c1c" strokeWidth="1.2" />
      {/* Hole depth lines */}
      <line x1="8" y1="22" x2="26" y2="22" stroke="#111" strokeWidth="1" />
      <line x1="8" y1="42" x2="26" y2="42" stroke="#111" strokeWidth="1" />
      {/* Body */}
      <rect x="28" y="4" width="58" height="60" rx="12" fill="#0d0d0d" stroke="#2a2a2a" strokeWidth="1.5" />
      {/* Inner highlight */}
      <rect x="31" y="7" width="22" height="26" rx="7" fill="white" fillOpacity="0.03" />
      {/* Status LED (green = ready) */}
      <circle cx="57" cy="34" r="6" fill="#22c55e" fillOpacity="0.18" />
      <circle cx="57" cy="34" r="4" fill="#22c55e" fillOpacity="0.5" />
      <circle cx="57" cy="34" r="2.5" fill="#22c55e" />
      {/* Cable stub */}
      <rect x="86" y="27" width="10" height="14" rx="3" fill="#141414" stroke="#252525" strokeWidth="1.2" />
    </svg>
  );
}

/* ─── Typewriter hook ────────────────────────────────────────────────────── */
const MESSAGES = [
  "Firewall systems undergoing maintenance...",
  "Reconnecting policy engine nodes...",
  "Redis cache warming up...",
  "Audit log stream resuming...",
  "Back online shortly.",
];

function useTypewriter(messages: string[], speed = 40, pause = 1800) {
  const [text, setText] = useState("");
  const [msgIdx, setMsgIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = messages[msgIdx]!;
    if (!deleting && charIdx < current.length) {
      const t = setTimeout(() => { setText(current.slice(0, charIdx + 1)); setCharIdx(c => c + 1); }, speed);
      return () => clearTimeout(t);
    }
    if (!deleting && charIdx === current.length) {
      const t = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(t);
    }
    if (deleting && charIdx > 0) {
      const t = setTimeout(() => { setText(current.slice(0, charIdx - 1)); setCharIdx(c => c - 1); }, speed / 2);
      return () => clearTimeout(t);
    }
    if (deleting && charIdx === 0) {
      setDeleting(false);
      setMsgIdx(i => (i + 1) % messages.length);
    }
  }, [charIdx, deleting, messages, msgIdx, speed, pause]);

  return text;
}

/* ─── Component ──────────────────────────────────────────────────────────── */
export function MaintenancePage() {
  const typeText = useTypewriter(MESSAGES);
  // Progress bar loop 0→100 every ~8s
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setProgress(p => (p >= 100 ? 0 : p + 0.4)), 32);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden px-6">

      {/* ── CSS animations ───────────────────────────────────────────────── */}
      <style>{`
        @keyframes mw-slideL {
          0%,5%   { transform:translateX(-170px); opacity:.5; }
          35%     { transform:translateX(-6px); }
          46%     { transform:translateX(3px); }
          52%,62% { transform:translateX(0px); opacity:1; }
          72%     { transform:translateX(-6px); }
          90%,100%{ transform:translateX(-170px); opacity:.5; }
        }
        @keyframes mw-slideR {
          0%,5%   { transform:translateX(170px); opacity:.5; }
          35%     { transform:translateX(6px); }
          46%     { transform:translateX(-3px); }
          52%,62% { transform:translateX(0px); opacity:1; }
          72%     { transform:translateX(6px); }
          90%,100%{ transform:translateX(170px); opacity:.5; }
        }
        @keyframes mw-spark {
          0%,44%,68%,100%{ opacity:0; transform:scale(0) rotate(-10deg); }
          50%            { opacity:1; transform:scale(1.3) rotate(8deg); }
          56%            { opacity:.7; transform:scale(.9) rotate(-4deg); }
        }
        @keyframes mw-glow {
          0%,44%,68%,100%{ opacity:0; }
          50%,58%        { opacity:1; }
        }
        @keyframes mw-wireL {
          0%,5%   { opacity:.1; transform:scaleX(.15); transform-origin:right center; }
          35%     { opacity:.5; transform:scaleX(1); transform-origin:right center; }
          52%,62% { opacity:.9; transform:scaleX(1); transform-origin:right center; }
          90%,100%{ opacity:.1; transform:scaleX(.15); transform-origin:right center; }
        }
        @keyframes mw-wireR {
          0%,5%   { opacity:.1; transform:scaleX(.15); transform-origin:left center; }
          35%     { opacity:.5; transform:scaleX(1); transform-origin:left center; }
          52%,62% { opacity:.9; transform:scaleX(1); transform-origin:left center; }
          90%,100%{ opacity:.1; transform:scaleX(.15); transform-origin:left center; }
        }
        @keyframes mw-fadeUp {
          from{ opacity:0; transform:translateY(18px); }
          to  { opacity:1; transform:translateY(0);    }
        }
        @keyframes mw-scan {
          from{ transform:translateY(-100%); }
          to  { transform:translateY(200vh); }
        }
        @keyframes mw-blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes mw-float {
          0%,100%{ transform:translateY(0); }
          50%    { transform:translateY(-10px); }
        }
        @keyframes mw-pulse {
          0%,100%{ opacity:.4; transform:scale(1); }
          50%    { opacity:1;  transform:scale(1.15); }
        }
        @keyframes mw-dot1{ 0%,100%{opacity:.2} 33%{opacity:1} }
        @keyframes mw-dot2{ 0%,100%{opacity:.2} 66%{opacity:1} }
        @keyframes mw-dot3{ 0%,100%{opacity:.2} 100%{opacity:1} }
        @keyframes mw-ledPulse {
          0%,100%{ opacity:.6 }
          50%    { opacity:1  }
        }
        .mw-slideL { animation: mw-slideL 4s ease-in-out infinite; }
        .mw-slideR { animation: mw-slideR 4s ease-in-out infinite; }
        .mw-spark  { animation: mw-spark  4s ease-in-out infinite; }
        .mw-glow   { animation: mw-glow   4s ease-in-out infinite; }
        .mw-wireL  { animation: mw-wireL  4s ease-in-out infinite; }
        .mw-wireR  { animation: mw-wireR  4s ease-in-out infinite; }
        .mw-float  { animation: mw-float  6s ease-in-out infinite; }
      `}</style>

      {/* Scanline overlay */}
      <div className="pointer-events-none fixed inset-0 z-0"
        style={{ background: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,255,255,0.012) 3px,rgba(255,255,255,0.012) 4px)" }} />
      <div className="pointer-events-none fixed left-0 right-0 h-40 z-0"
        style={{ background: "linear-gradient(to bottom,transparent,rgba(255,196,0,0.025),transparent)", animation: "mw-scan 10s linear infinite" }} />

      <GridCanvas />

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-lg">

        {/* Logo */}
        <div style={{ animation: "mw-fadeUp .5s ease both" }} className="mb-10 mw-float">
          <BrandLogo variant="full" size="lg" href="/" />
        </div>

        {/* ── Plug Animation ─────────────────────────────────────────────── */}
        <div className="relative flex items-center justify-center mb-10"
          style={{ width: "min(420px,92vw)", height: "90px", animation: "mw-fadeUp .5s ease .1s both" }}>

          {/* Left wire */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 mw-wireL"
            style={{ width: "calc(50% - 96px)", height: "4px", borderRadius: "0 3px 3px 0",
              background: "linear-gradient(to right,transparent,rgba(255,196,0,.6),#FFC400)" }} />

          {/* Right wire */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 mw-wireR"
            style={{ width: "calc(50% - 96px)", height: "4px", borderRadius: "3px 0 0 3px",
              background: "linear-gradient(to left,transparent,rgba(34,197,94,.6),#22c55e)" }} />

          {/* Center glow */}
          <div className="absolute z-10 rounded-full mw-glow pointer-events-none"
            style={{ width: 90, height: 90,
              background: "radial-gradient(circle,rgba(255,196,0,.45) 0%,rgba(255,196,0,.15) 40%,transparent 70%)" }} />

          {/* Spark */}
          <div className="absolute z-30 mw-spark pointer-events-none">
            <svg width="28" height="28" viewBox="0 0 28 28">
              <polygon points="14,1 17.5,10.5 27,10.5 19.5,17 22,26.5 14,21.5 6,26.5 8.5,17 1,10.5 10.5,10.5"
                fill="#FFC400" />
            </svg>
          </div>

          {/* Left plug */}
          <div className="absolute mw-slideL" style={{ right: "50%" }}>
            <MalePlug />
          </div>

          {/* Right socket */}
          <div className="absolute mw-slideR" style={{ left: "50%" }}>
            <FemaleSocket />
          </div>
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-2 mb-5" style={{ animation: "mw-fadeUp .5s ease .15s both" }}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFC400] opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFC400]" />
          </span>
          <span className="font-mono text-[10px] tracking-[0.35em] text-[#FFC400]/70 uppercase">
            SYSTEM MAINTENANCE · RECONNECTING
          </span>
        </div>

        {/* Headline */}
        <h1 className="font-display font-black leading-none uppercase mb-4"
          style={{ fontSize: "clamp(3.2rem,13vw,6.5rem)", animation: "mw-fadeUp .5s ease .2s both" }}>
          <span className="text-white">BACK</span>
          <br />
          <span className="text-[#FFC400]">SOON</span>
        </h1>

        {/* Typewriter */}
        <div className="font-mono text-[13px] text-[#444] mb-8 h-5 flex items-center gap-1"
          style={{ animation: "mw-fadeUp .5s ease .25s both" }}>
          <span>{typeText}</span>
          <span className="w-[2px] h-[13px] bg-[#FFC400]/70 inline-block"
            style={{ animation: "mw-blink 1s step-start infinite" }} />
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs mb-10" style={{ animation: "mw-fadeUp .5s ease .3s both" }}>
          <div className="flex justify-between font-mono text-[9px] text-[#333] mb-1.5 tracking-widest uppercase">
            <span>Reconnecting</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-[3px] w-full bg-[#111] rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-none"
              style={{ width: `${progress}%`,
                background: "linear-gradient(to right,#FFC400,#FFE066)" }} />
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center gap-3 mb-12" style={{ animation: "mw-fadeUp .5s ease .35s both" }}>
          {/* X */}
          <a href="https://x.com/usemoltwall" target="_blank" rel="noreferrer"
            className="group h-10 px-4 flex items-center gap-2 bg-black border border-[#222] rounded-xl hover:border-[#FFC400]/40 hover:bg-[#0d0d0d] transition-all">
            <svg width="12" height="12" viewBox="0 0 1200 1227" fill="currentColor" className="text-[#666] group-hover:text-white transition-colors">
              <path d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.163 519.284ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.828Z"/>
            </svg>
            <span className="text-[11px] font-mono text-[#555] group-hover:text-white transition-colors tracking-wider">@usemoltwall</span>
          </a>

          {/* GitHub */}
          <a href="https://github.com/moltwall" target="_blank" rel="noreferrer"
            className="group h-10 px-4 flex items-center gap-2 bg-black border border-[#222] rounded-xl hover:border-[#FFC400]/40 hover:bg-[#0d0d0d] transition-all">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-[#666] group-hover:text-white transition-colors">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span className="text-[11px] font-mono text-[#555] group-hover:text-white transition-colors tracking-wider">GitHub</span>
          </a>

          {/* npm */}
          <a href="https://www.npmjs.com/package/@moltwall/sdk" target="_blank" rel="noreferrer"
            className="group h-10 px-4 flex items-center gap-2 bg-black border border-[#222] rounded-xl hover:border-[#FFC400]/40 hover:bg-[#0d0d0d] transition-all">
            <span className="shrink-0 inline-flex items-center justify-center bg-[#CB3837] text-white text-[8px] font-black font-mono leading-none px-1 py-0.5 rounded">npm</span>
            <span className="text-[11px] font-mono text-[#555] group-hover:text-white transition-colors tracking-wider">@moltwall/sdk</span>
          </a>
        </div>

        {/* Terminal status */}
        <div className="w-full max-w-sm bg-black border border-[#1a1a1a] rounded-xl p-4"
          style={{ animation: "mw-fadeUp .5s ease .4s both" }}>
          <div className="flex items-center gap-1.5 mb-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-2 font-mono text-[9px] text-[#333] tracking-widest uppercase">firewall status</span>
          </div>
          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex items-center gap-2 text-[#333]">
              <span className="text-[#22c55e]">✓</span>
              <span>SDK v1.0 · operational</span>
            </div>
            <div className="flex items-center gap-2 text-[#333]">
              <span className="text-[#22c55e]">✓</span>
              <span>Policy engine · loaded</span>
            </div>
            <div className="flex items-center gap-2 text-[#FFC400]">
              <span style={{ animation: "mw-blink 1s step-start infinite" }}>⊡</span>
              <span>Reconnecting instances</span>
              <span className="ml-auto flex gap-0.5">
                <span style={{ animation: "mw-dot1 1.2s ease-in-out infinite" }}>·</span>
                <span style={{ animation: "mw-dot2 1.2s ease-in-out infinite" }}>·</span>
                <span style={{ animation: "mw-dot3 1.2s ease-in-out infinite" }}>·</span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#333]">
              <span className="text-[#FFC400]/50" style={{ animation: "mw-blink 1.5s step-start infinite" }}>⊡</span>
              <span>Audit log stream · resuming</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
