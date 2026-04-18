"use client";

import { useState } from "react";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border border-[#2a2a2a] text-[#555] hover:text-[#FFC400] hover:border-[#FFC400]/30 transition-all"
    >
      {copied ? "COPIED" : "COPY"}
    </button>
  );
}

function CodeBlock({ code, lang = "yaml", title }: { code: string; lang?: string; title?: string }) {
  return (
    <div className="my-4 rounded-xl overflow-hidden border border-[#1e1e1e] bg-[#050505]">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#111]">
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full bg-[#ef4444]/40" />
          <span className="size-2.5 rounded-full bg-[#FFC400]/40" />
          <span className="size-2.5 rounded-full bg-[#22c55e]/40" />
          {title && <span className="ml-2 text-[11px] text-[#444] font-mono">{title}</span>}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#333] font-mono">{lang}</span>
          <CopyButton text={code} />
        </div>
      </div>
      <pre className="p-5 text-[12px] text-[#FFC400] font-mono leading-relaxed overflow-x-auto whitespace-pre">{code}</pre>
    </div>
  );
}

const GH_ACTIONS_BASIC = `name: MoltWall Security Scan

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main]

jobs:
  moltwall-scan:
    runs-on: ubuntu-latest
    name: Agent Security Audit

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install MoltWall SDK
        run: npm install @moltwall/sdk

      - name: Run MoltWall Policy Validation
        env:
          MOLTWALL_API_KEY: \${{ secrets.MOLTWALL_API_KEY }}
        run: node scripts/moltwall-scan.js`;

const GH_SCAN_SCRIPT = `// scripts/moltwall-scan.js
const { MoltWall } = require("@moltwall/sdk");

const wall = new MoltWall({
  apiKey: process.env.MOLTWALL_API_KEY,
  baseUrl: "https://www.moltwall.xyz",
});

const TEST_ACTIONS = [
  { action: "read_config",    tool: "fs",     source: "system", risk: "low"  },
  { action: "push_image",     tool: "docker", source: "system", risk: "low"  },
  { action: "deploy_service", tool: "k8s",    source: "system", risk: "high" },
];

async function run() {
  console.log("MoltWall: Running CI security scan...");
  let blocked = 0;

  for (const action of TEST_ACTIONS) {
    const result = await wall.check({
      agent_id: "github-actions",
      ...action,
      args: {},
    });

    const icon = result.decision === "allow" ? "✓" : "✗";
    console.log(\`  \${icon} \${action.action} → \${result.decision} (risk: \${result.risk_score.toFixed(2)})\`);

    if (result.decision === "deny") blocked++;
  }

  if (blocked > 0) {
    console.error(\`MoltWall: \${blocked} action(s) blocked by policy.\`);
    process.exit(1);
  }
  console.log("MoltWall: All actions cleared.");
}

run().catch(e => { console.error(e); process.exit(1); });`;

const GH_ACTIONS_ADVANCED = `name: MoltWall Full Pipeline Guard

on:
  workflow_dispatch:
  schedule:
    - cron: '0 */6 * * *'  # every 6 hours

jobs:
  policy-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Validate MoltWall Policy Config
        env:
          MOLTWALL_API_KEY: \${{ secrets.MOLTWALL_API_KEY }}
        run: |
          curl -sf -X GET https://www.moltwall.xyz/api/policy \\
            -H "x-api-key: \$MOLTWALL_API_KEY" | jq .

      - name: Check High-Risk Action Coverage
        env:
          MOLTWALL_API_KEY: \${{ secrets.MOLTWALL_API_KEY }}
        run: node scripts/moltwall-scan.js

      - name: Fetch Audit Summary
        env:
          MOLTWALL_API_KEY: \${{ secrets.MOLTWALL_API_KEY }}
        run: |
          curl -sf "https://www.moltwall.xyz/api/logs?limit=50&decision=deny" \\
            -H "x-api-key: \$MOLTWALL_API_KEY" | jq '.logs | length'`;

const INTEGRATIONS = [
  {
    id: "github-actions",
    name: "GitHub Actions",
    logo: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
    status: "live",
    description: "Validate agent policies and audit logs on every push or PR.",
  },
  {
    id: "slack",
    name: "Slack",
    logo: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
      </svg>
    ),
    status: "live",
    description: "Receive real-time block alerts and daily threat summaries in Slack.",
  },
  {
    id: "pagerduty",
    name: "PagerDuty",
    logo: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.2 0H9.4L8 1.4v8.3l1.4 1.4h6.8l1.4-1.4V1.4zm0 13.9H9.4L8 15.3v7.3L9.4 24h1.9v-6.2h4.9l1.4-1.4v-1.1zm-6.8 6.2v3.9H8v-3.9z"/>
      </svg>
    ),
    status: "live",
    description: "Page on-call when high-risk decisions exceed defined thresholds.",
  },
  {
    id: "datadog",
    name: "Datadog",
    logo: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.455 14.317l-1.09 1.09-1.09-1.09-1.09 1.09-1.09-1.09 1.09-1.09-1.09-1.09 1.09-1.09 1.09 1.09 1.09-1.09 1.09 1.09-1.09 1.09zm-5.455 0l-1.09 1.09-1.09-1.09-1.09 1.09-1.09-1.09 1.09-1.09-1.09-1.09 1.09-1.09 1.09 1.09 1.09-1.09 1.09 1.09-1.09 1.09z"/>
      </svg>
    ),
    status: "coming-soon",
    description: "Stream MoltWall metrics and decision events to Datadog dashboards.",
  },
];

export default function IntegrationsPage() {
  const [activeTab, setActiveTab] = useState("github-actions");

  return (
    <div className="min-h-screen bg-black p-8">

      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] font-bold tracking-[0.25em] text-[#FFC400] uppercase font-mono mb-1">Integrations</p>
        <h1 className="font-display font-black text-white text-3xl uppercase">GitHub Actions</h1>
        <p className="text-[#555] text-sm mt-1">Integrate MoltWall security checks into your CI/CD pipeline.</p>
      </div>

      {/* Integration cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {INTEGRATIONS.map(intg => (
          <button
            key={intg.id}
            onClick={() => intg.status === "live" && setActiveTab(intg.id)}
            className={`p-4 rounded-xl border text-left transition-all ${
              activeTab === intg.id
                ? "border-[#FFC400]/40 bg-[#FFC400]/5"
                : intg.status === "coming-soon"
                ? "border-[#111] bg-[#080808] opacity-50 cursor-not-allowed"
                : "border-[#1e1e1e] bg-[#080808] hover:border-[#2a2a2a]"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={activeTab === intg.id ? "text-[#FFC400]" : "text-[#555]"}>{intg.logo}</span>
              <span className={`text-[9px] font-bold uppercase tracking-wider font-mono px-1.5 py-0.5 rounded ${
                intg.status === "live" ? "text-[#22c55e] bg-[#22c55e]/10" : "text-[#333] bg-[#111]"
              }`}>
                {intg.status === "live" ? "LIVE" : "SOON"}
              </span>
            </div>
            <p className="text-[12px] font-bold text-white mb-1">{intg.name}</p>
            <p className="text-[10px] text-[#444] leading-relaxed">{intg.description}</p>
          </button>
        ))}
      </div>

      {/* GitHub Actions content */}
      {activeTab === "github-actions" && (
        <div className="space-y-6">
          {/* Step 1 */}
          <div className="bg-[#080808] border border-[#1e1e1e] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-6 rounded-full bg-[#FFC400] text-black text-[11px] font-black flex items-center justify-center font-display">1</span>
              <p className="text-white font-bold">Add your API key to GitHub Secrets</p>
            </div>
            <p className="text-[#555] text-sm mb-3">Go to your repo → Settings → Secrets and variables → Actions → New repository secret</p>
            <CodeBlock lang="text" title="Secret name" code={`MOLTWALL_API_KEY = moltwall_live_your_key_here`} />
          </div>

          {/* Step 2 */}
          <div className="bg-[#080808] border border-[#1e1e1e] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-6 rounded-full bg-[#FFC400] text-black text-[11px] font-black flex items-center justify-center font-display">2</span>
              <p className="text-white font-bold">Create the workflow file</p>
            </div>
            <p className="text-[#555] text-sm mb-3">Add this to <code className="text-[#FFC400] bg-[#FFC400]/10 px-1 rounded font-mono text-xs">.github/workflows/moltwall.yml</code></p>
            <CodeBlock lang="yaml" title=".github/workflows/moltwall.yml" code={GH_ACTIONS_BASIC} />
          </div>

          {/* Step 3 */}
          <div className="bg-[#080808] border border-[#1e1e1e] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-6 rounded-full bg-[#FFC400] text-black text-[11px] font-black flex items-center justify-center font-display">3</span>
              <p className="text-white font-bold">Create the scan script</p>
            </div>
            <p className="text-[#555] text-sm mb-3">Add this to <code className="text-[#FFC400] bg-[#FFC400]/10 px-1 rounded font-mono text-xs">scripts/moltwall-scan.js</code></p>
            <CodeBlock lang="javascript" title="scripts/moltwall-scan.js" code={GH_SCAN_SCRIPT} />
          </div>

          {/* Advanced */}
          <div className="bg-[#080808] border border-[#1e1e1e] rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-6 h-6 rounded-full border border-[#333] text-[#555] text-[11px] font-black flex items-center justify-center font-display">+</span>
              <p className="text-white font-bold">Advanced — Scheduled policy audit</p>
            </div>
            <p className="text-[#555] text-sm mb-3">Runs every 6 hours to validate policy state and fetch denial summary.</p>
            <CodeBlock lang="yaml" title=".github/workflows/moltwall-audit.yml" code={GH_ACTIONS_ADVANCED} />
          </div>

          {/* How it works */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: "🔍", title: "Policy Validation",  desc: "Checks that your active MoltWall policy matches expected config before deploy." },
              { icon: "⚡", title: "Action Simulation",  desc: "Fires test agent actions through the firewall to verify deny/allow decisions are correct." },
              { icon: "📋", title: "Audit Export",       desc: "Fetches recent deny logs and surfaces blocked actions directly in the CI run output." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-[#080808] border border-[#1e1e1e] rounded-xl p-5">
                <p className="text-2xl mb-3">{icon}</p>
                <p className="text-sm font-bold text-white mb-1">{title}</p>
                <p className="text-[11px] text-[#555] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Slack placeholder */}
      {activeTab === "slack" && (
        <div className="bg-[#080808] border border-[#1e1e1e] rounded-2xl p-8 text-center">
          <p className="text-4xl mb-4">💬</p>
          <p className="text-white font-bold text-lg mb-2">Slack Integration</p>
          <p className="text-[#555] text-sm max-w-md mx-auto">Configure your Slack webhook in Policy settings to receive real-time block alerts and daily threat digest messages.</p>
          <CodeBlock lang="bash" title="Webhook test" code={`curl -X POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL \\
  -H 'Content-Type: application/json' \\
  -d '{"text":"MoltWall: 3 threats blocked in the last hour."}'`} />
        </div>
      )}

      {/* PagerDuty placeholder */}
      {activeTab === "pagerduty" && (
        <div className="bg-[#080808] border border-[#1e1e1e] rounded-2xl p-8 text-center">
          <p className="text-4xl mb-4">🚨</p>
          <p className="text-white font-bold text-lg mb-2">PagerDuty Integration</p>
          <p className="text-[#555] text-sm max-w-md mx-auto">Add your PagerDuty routing key to trigger incidents when risk score thresholds are exceeded or agents are blocked.</p>
          <CodeBlock lang="bash" title="Trigger incident" code={`curl -X POST https://events.pagerduty.com/v2/enqueue \\
  -H 'Content-Type: application/json' \\
  -d '{
    "routing_key": "YOUR_ROUTING_KEY",
    "event_action": "trigger",
    "payload": {
      "summary": "MoltWall: High-risk agent action blocked",
      "severity": "critical",
      "source": "moltwall"
    }
  }'`} />
        </div>
      )}
    </div>
  );
}
