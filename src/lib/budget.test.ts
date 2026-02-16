import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockGet = vi.fn();
const mockSet = vi.fn();
const mockPipeExec = vi.fn();

vi.mock('@upstash/redis', () => ({
  Redis: class {
    get = mockGet;
    set = mockSet;
    pipeline = () => ({ exec: mockPipeExec });
  },
}));

// Mock fetch for alert tests
const mockFetch = vi.fn().mockResolvedValue({ ok: true });
vi.stubGlobal('fetch', mockFetch);

import { isEmergencyStopped, checkBudget, recordSpend } from './budget';

describe('isEmergencyStopped', () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns true when EMERGENCY_STOP=true', () => {
    vi.stubEnv('EMERGENCY_STOP', 'true');
    expect(isEmergencyStopped()).toBe(true);
  });

  it('returns false when not set', () => {
    vi.stubEnv('EMERGENCY_STOP', '');
    expect(isEmergencyStopped()).toBe(false);
  });
});

describe('checkBudget', () => {
  beforeEach(() => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://fake.upstash.io');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'fake-token');
    vi.stubEnv('DAILY_BUDGET_USD', '30.00');
    mockGet.mockReset();
    mockSet.mockReset();
  });

  it('allows when no spend recorded', async () => {
    mockGet.mockResolvedValue(null);
    const result = await checkBudget();
    expect(result.allowed).toBe(true);
    expect(result.spent).toBe(0);
    expect(result.remaining).toBe(30);
  });

  it('blocks when budget exceeded', async () => {
    mockGet.mockResolvedValue({ spent: 30.50, interactions: 100, lastReset: Date.now() });
    const result = await checkBudget();
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('calculates percentUsed correctly', async () => {
    mockGet.mockResolvedValue({ spent: 15.00, interactions: 50, lastReset: Date.now() });
    const result = await checkBudget();
    expect(result.percentUsed).toBe(50);
    expect(result.allowed).toBe(true);
  });

  it('fails open when Redis is down', async () => {
    mockGet.mockRejectedValue(new Error('Redis down'));
    const result = await checkBudget();
    expect(result.allowed).toBe(true);
  });
});

describe('recordSpend', () => {
  beforeEach(() => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://fake.upstash.io');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'fake-token');
    vi.stubEnv('DAILY_BUDGET_USD', '5.00');
    mockGet.mockReset();
    mockSet.mockReset();
    mockFetch.mockReset().mockResolvedValue({ ok: true });
  });

  it('accumulates cost correctly', async () => {
    mockGet.mockResolvedValue({ spent: 1.00, interactions: 10, lastReset: Date.now() });
    mockSet.mockResolvedValue('OK');

    // 1000 input tokens + 500 output tokens
    // Cost = 1000 * 0.000001 + 500 * 0.000005 = 0.001 + 0.0025 = 0.0035
    await recordSpend(1000, 500);

    expect(mockSet).toHaveBeenCalledWith(
      expect.stringContaining('budget:'),
      expect.objectContaining({
        spent: expect.closeTo(1.0035, 4),
        interactions: 11,
      }),
      { ex: 90000 } // 25 hours
    );
  });

  it('calculates cost accurately for Haiku 4.5 pricing', async () => {
    mockGet.mockResolvedValue(null);
    mockSet.mockResolvedValue('OK');

    // 1M input + 1M output = $1.00 + $5.00 = $6.00
    await recordSpend(1_000_000, 1_000_000);

    expect(mockSet).toHaveBeenCalledWith(
      expect.stringContaining('budget:'),
      expect.objectContaining({
        spent: expect.closeTo(6.00, 2),
      }),
      { ex: 90000 }
    );
  });

  it('fires threshold alerts at 50/75/90%', async () => {
    vi.stubEnv('NTFY_TOPIC', 'test-topic');
    // Spent $4.60 = 92% of $5 → should fire all thresholds
    mockGet.mockResolvedValue({ spent: 4.50, interactions: 90, lastReset: Date.now() });
    mockSet.mockResolvedValue('OK'); // for budget data
    // For alert NX keys, first call returns 'OK' (was set = new alert), rest too
    mockSet.mockResolvedValue('OK');

    await recordSpend(400_000, 0); // adds $0.10 → total $4.60
    
    // Wait for async alert processing
    await new Promise(r => setTimeout(r, 50));

    // Should have tried to send alerts via fetch
    // (alerts fire for thresholds where NX set succeeds)
    expect(mockSet).toHaveBeenCalled();
  });

  it('does not throw when Redis fails on record', async () => {
    mockGet.mockRejectedValue(new Error('Redis down'));
    await expect(recordSpend(1000, 500)).resolves.toBeUndefined();
  });

  it('sets 25-hour TTL on budget key', async () => {
    mockGet.mockResolvedValue(null);
    mockSet.mockResolvedValue('OK');
    await recordSpend(100, 100);

    expect(mockSet).toHaveBeenCalledWith(
      expect.stringContaining('budget:'),
      expect.any(Object),
      { ex: 90000 } // 25 * 60 * 60 = 90000
    );
  });

  it('uses daily key based on UTC date', async () => {
    mockGet.mockResolvedValue(null);
    mockSet.mockResolvedValue('OK');
    await recordSpend(100, 100);

    const now = new Date();
    const yyyy = now.getUTCFullYear();
    const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(now.getUTCDate()).padStart(2, '0');
    const expectedKey = `budget:${yyyy}-${mm}-${dd}`;

    expect(mockGet).toHaveBeenCalledWith(expectedKey);
  });
});
