import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Redis pipeline results
const mockPipeExec = vi.fn();
const mockPipeline = vi.fn(() => ({
  zremrangebyscore: vi.fn(),
  zcard: vi.fn(),
  zrange: vi.fn(),
  zadd: vi.fn(),
  expire: vi.fn(),
  exec: mockPipeExec,
}));

vi.mock('@upstash/redis', () => ({
  Redis: class {
    pipeline = mockPipeline;
  },
}));

// Must import after mock
import { checkRateLimit, incrementUsage } from './rate-limit';

describe('checkRateLimit', () => {
  beforeEach(() => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://fake.upstash.io');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'fake-token');
    vi.resetModules();
    mockPipeExec.mockReset();
    mockPipeline.mockClear();
  });

  it('allows fresh user with full quota', async () => {
    mockPipeExec.mockResolvedValue([
      0, 0,   // zremrangebyscore results
      0, 0,   // zcard: 0 daily, 0 minute
      [], [],  // zrange: no oldest entries
    ]);

    const result = await checkRateLimit('user-1');
    expect(result.allowed).toBe(true);
    expect(result.dailyRemaining).toBe(20);
    expect(result.minuteRemaining).toBe(5);
    expect(result.resetAt).toBeNull();
  });

  it('blocks user at daily limit', async () => {
    mockPipeExec.mockResolvedValue([
      0, 0,
      20, 0,  // 20 daily used, 0 minute used
      ['oldest', 1000000], [],
    ]);

    const result = await checkRateLimit('user-2');
    expect(result.allowed).toBe(false);
    expect(result.dailyRemaining).toBe(0);
  });

  it('blocks user at minute limit', async () => {
    mockPipeExec.mockResolvedValue([
      0, 0,
      3, 5,  // 3 daily, 5 minute (minute limit hit)
      [], ['oldest-min', 1000000],
    ]);

    const result = await checkRateLimit('user-3');
    expect(result.allowed).toBe(false);
    expect(result.minuteRemaining).toBe(0);
    expect(result.dailyRemaining).toBe(17);
  });

  it('calculates resetAt from oldest minute entry when minute-limited', async () => {
    const oldestTs = Date.now() - 30_000; // 30s ago
    mockPipeExec.mockResolvedValue([
      0, 0,
      3, 5,
      [], [String(oldestTs), oldestTs],
    ]);

    const result = await checkRateLimit('user-4');
    expect(result.allowed).toBe(false);
    // resetAt = oldest + 60_000
    expect(result.resetAt).toBe(oldestTs + 60_000);
  });

  it('calculates resetAt from oldest daily entry when daily-limited', async () => {
    const oldestTs = Date.now() - 23 * 60 * 60 * 1000; // 23h ago
    mockPipeExec.mockResolvedValue([
      0, 0,
      20, 0,
      [String(oldestTs), oldestTs], [],
    ]);

    const result = await checkRateLimit('user-5');
    expect(result.allowed).toBe(false);
    expect(result.resetAt).toBe(oldestTs + 24 * 60 * 60 * 1000);
  });

  it('sends cleanup commands for expired entries', async () => {
    mockPipeExec.mockResolvedValue([0, 0, 0, 0, [], []]);
    await checkRateLimit('user-6');

    // Pipeline was called, and zremrangebyscore was invoked on it
    const pipeInstance = mockPipeline.mock.results[0].value;
    expect(pipeInstance.zremrangebyscore).toHaveBeenCalledTimes(2);
  });

  it('shows partial remaining when some quota used', async () => {
    mockPipeExec.mockResolvedValue([0, 0, 10, 3, [], []]);

    const result = await checkRateLimit('user-7');
    expect(result.allowed).toBe(true);
    expect(result.dailyRemaining).toBe(10);
    expect(result.minuteRemaining).toBe(2);
  });

  it('fails open when Redis throws', async () => {
    mockPipeExec.mockRejectedValue(new Error('Redis down'));

    const result = await checkRateLimit('user-8');
    expect(result.allowed).toBe(true);
    expect(result.dailyRemaining).toBe(20);
    expect(result.minuteRemaining).toBe(5);
  });
});

describe('incrementUsage', () => {
  beforeEach(() => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://fake.upstash.io');
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'fake-token');
    mockPipeExec.mockReset();
    mockPipeline.mockClear();
  });

  it('adds to both daily and minute keys', async () => {
    mockPipeExec.mockResolvedValue([1, 1, 1, 1]);
    await incrementUsage('user-9');

    const pipeInstance = mockPipeline.mock.results[0].value;
    expect(pipeInstance.zadd).toHaveBeenCalledTimes(2);
    expect(pipeInstance.expire).toHaveBeenCalledTimes(2);
  });

  it('does not throw when Redis fails', async () => {
    mockPipeExec.mockRejectedValue(new Error('Redis down'));
    await expect(incrementUsage('user-10')).resolves.toBeUndefined();
  });
});
