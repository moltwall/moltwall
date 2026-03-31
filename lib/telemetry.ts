/**
 * MoltWall Dashboard v2 — Telemetry
 * Collects and aggregates real-time firewall performance metrics.
 * Designed for high-concurrency loads (1k+ checks/sec).
 */

export interface TelemetrySnapshot {
  timestamp: number;
  checksPerSecond: number;
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  errorRate: number;          // 0.0 – 1.0
  activeAgents: number;
  decisionBreakdown: {
    allow: number;
    deny: number;
    sandbox: number;
    require_confirmation: number;
  };
}

export interface LatencySample {
  ts: number;
  ms: number;
}

const WINDOW_MS = 60_000; // 1 minute rolling window
const MAX_SAMPLES = 10_000;

class TelemetryCollector {
  private samples: LatencySample[] = [];
  private checksInWindow: number[] = [];
  private errors = 0;
  private totalInWindow = 0;
  private activeAgents = new Set<string>();
  private decisions = { allow: 0, deny: 0, sandbox: 0, require_confirmation: 0 };

  record(agentId: string, latencyMs: number, decision: keyof typeof this.decisions, error = false) {
    const now = Date.now();
    this.samples.push({ ts: now, ms: latencyMs });
    this.checksInWindow.push(now);
    this.activeAgents.add(agentId);
    this.decisions[decision]++;
    if (error) this.errors++;
    this.totalInWindow++;

    // Trim old data outside rolling window
    if (this.samples.length > MAX_SAMPLES) this.samples.shift();
    const cutoff = now - WINDOW_MS;
    this.checksInWindow = this.checksInWindow.filter(t => t > cutoff);
  }

  snapshot(): TelemetrySnapshot {
    const now = Date.now();
    const cutoff = now - WINDOW_MS;
    const recent = this.samples.filter(s => s.ts > cutoff).map(s => s.ms).sort((a, b) => a - b);

    return {
      timestamp: now,
      checksPerSecond: this.checksInWindow.length / (WINDOW_MS / 1000),
      p50LatencyMs: this._percentile(recent, 50),
      p95LatencyMs: this._percentile(recent, 95),
      p99LatencyMs: this._percentile(recent, 99),
      errorRate: this.totalInWindow > 0 ? this.errors / this.totalInWindow : 0,
      activeAgents: this.activeAgents.size,
      decisionBreakdown: { ...this.decisions },
    };
  }

  reset() {
    this.samples = [];
    this.checksInWindow = [];
    this.errors = 0;
    this.totalInWindow = 0;
    this.activeAgents.clear();
    this.decisions = { allow: 0, deny: 0, sandbox: 0, require_confirmation: 0 };
  }

  private _percentile(sorted: number[], p: number): number {
    if (sorted.length === 0) return 0;
    const idx = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[Math.max(0, idx)] ?? 0;
  }
}

// Singleton — shared across the dashboard
export const telemetry = new TelemetryCollector();
