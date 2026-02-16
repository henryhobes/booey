import { Redis } from '@upstash/redis';

// ── Configuration ──────────────────────────────────────────────────────────

const DAILY_BUDGET_USD = parseFloat(process.env.DAILY_BUDGET_USD || '30.00');
const NTFY_TOPIC = process.env.NTFY_TOPIC; // e.g. "booey-cost-alerts-abc123"

// Sonnet 4.5 pricing
const INPUT_COST_PER_TOKEN = 0.000003; // $3.00 / MTok
const OUTPUT_COST_PER_TOKEN = 0.000015; // $15.00 / MTok
const WEB_SEARCH_COST = 0.01; // $10.00 / 1K searches

const ALERT_THRESHOLDS = [50, 75, 90] as const;

// ── Redis helper (reuse pattern from rate-limit.ts) ────────────────────────

let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  redis = new Redis({ url, token });
  return redis;
}

// ── Key helpers ────────────────────────────────────────────────────────────

function todayKey(): string {
  const d = new Date();
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `budget:${yyyy}-${mm}-${dd}`;
}

function todayAlertKey(threshold: number): string {
  return `${todayKey()}:alert:${threshold}`;
}

// ── Data types ─────────────────────────────────────────────────────────────

interface BudgetData {
  spent: number;
  interactions: number;
  lastReset: number;
}

export interface BudgetStatus {
  allowed: boolean;
  spent: number;
  limit: number;
  remaining: number;
  interactions: number;
  percentUsed: number;
}

// ── Kill switch ────────────────────────────────────────────────────────────

export function isEmergencyStopped(): boolean {
  return process.env.EMERGENCY_STOP === 'true';
}

// ── Budget check (call BEFORE generation) ──────────────────────────────────

export async function checkBudget(): Promise<BudgetStatus> {
  const r = getRedis();
  if (!r) {
    return { allowed: true, spent: 0, limit: DAILY_BUDGET_USD, remaining: DAILY_BUDGET_USD, interactions: 0, percentUsed: 0 };
  }

  try {
    const key = todayKey();
    const data = await r.get<BudgetData>(key);
    const spent = data?.spent ?? 0;
    const interactions = data?.interactions ?? 0;
    const remaining = Math.max(0, DAILY_BUDGET_USD - spent);
    const percentUsed = DAILY_BUDGET_USD > 0 ? (spent / DAILY_BUDGET_USD) * 100 : 0;

    return {
      allowed: spent < DAILY_BUDGET_USD,
      spent,
      limit: DAILY_BUDGET_USD,
      remaining,
      interactions,
      percentUsed,
    };
  } catch (error) {
    console.error('Budget check failed, allowing request:', error);
    return { allowed: true, spent: 0, limit: DAILY_BUDGET_USD, remaining: DAILY_BUDGET_USD, interactions: 0, percentUsed: 0 };
  }
}

// ── Record spend (call AFTER generation) ───────────────────────────────────

export async function recordSpend(inputTokens: number, outputTokens: number, webSearches: number = 0): Promise<void> {
  const r = getRedis();
  if (!r) return;

  const cost = inputTokens * INPUT_COST_PER_TOKEN + outputTokens * OUTPUT_COST_PER_TOKEN + webSearches * WEB_SEARCH_COST;

  try {
    const key = todayKey();
    const data = await r.get<BudgetData>(key);

    const updated: BudgetData = {
      spent: (data?.spent ?? 0) + cost,
      interactions: (data?.interactions ?? 0) + 1,
      lastReset: data?.lastReset ?? Date.now(),
    };

    // Store with 25-hour TTL (auto-cleanup)
    await r.set(key, updated, { ex: 60 * 60 * 25 });

    // Fire threshold alerts (non-blocking)
    checkAlerts(updated.spent, updated.interactions).catch(console.error);
  } catch (error) {
    console.error('Failed to record budget spend:', error);
  }
}

// ── Alerting ───────────────────────────────────────────────────────────────

async function checkAlerts(spent: number, interactions: number): Promise<void> {
  if (!NTFY_TOPIC) return;
  const r = getRedis();
  if (!r) return;

  const percentUsed = (spent / DAILY_BUDGET_USD) * 100;

  for (const threshold of ALERT_THRESHOLDS) {
    if (percentUsed < threshold) continue;

    const alertKey = todayAlertKey(threshold);
    // Only send once per threshold per day (NX = set-if-not-exists)
    const wasSet = await r.set(alertKey, '1', { ex: 60 * 60 * 25, nx: true });
    if (!wasSet) continue; // Already sent today

    const level = threshold >= 90 ? '🚨' : threshold >= 75 ? '🔶' : '⚠️';
    const priority = threshold >= 90 ? 'urgent' : threshold >= 75 ? 'high' : 'default';
    const title = `${level} Booey Cost Alert: ${threshold}% Budget Used`;
    const body = [
      `Spent: $${spent.toFixed(2)} / $${DAILY_BUDGET_USD.toFixed(2)}`,
      `Interactions: ${interactions.toLocaleString()}`,
      `Time: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit', hour12: true, timeZoneName: 'short' })}`,
    ].join('\n');

    try {
      await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
        method: 'POST',
        headers: {
          Title: title,
          Priority: priority,
          Tags: 'moneybag,warning',
        },
        body,
      });
    } catch (err) {
      console.error(`Failed to send ntfy alert for ${threshold}%:`, err);
    }
  }
}

// ── Budget stats endpoint helper ───────────────────────────────────────────

export async function getBudgetStats(): Promise<BudgetStatus> {
  return checkBudget();
}
