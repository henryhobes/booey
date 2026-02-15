import { Redis } from '@upstash/redis';

// Lazy-init Redis (allows graceful degradation if not configured)
let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    console.warn('Upstash Redis not configured — rate limiting disabled');
    return null;
  }
  redis = new Redis({ url, token });
  return redis;
}

export interface RateLimitResult {
  allowed: boolean;
  dailyRemaining: number;
  minuteRemaining: number;
  resetAt: number | null; // epoch ms when next slot opens
}

const DAILY_LIMIT = 20;
const MINUTE_LIMIT = 5;
const DAY_MS = 24 * 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;

/**
 * Sliding-window rate limit using Redis sorted sets.
 * Each member is a unique timestamp-based ID; score is the timestamp.
 */
export async function checkRateLimit(userId: string): Promise<RateLimitResult> {
  const r = getRedis();
  if (!r) {
    return { allowed: true, dailyRemaining: DAILY_LIMIT, minuteRemaining: MINUTE_LIMIT, resetAt: null };
  }

  try {
    const now = Date.now();
    const dayAgo = now - DAY_MS;
    const minuteAgo = now - MINUTE_MS;

    const dailyKey = `rate:daily:${userId}`;
    const minuteKey = `rate:minute:${userId}`;

    // Pipeline: remove expired entries, count current entries
    const pipe = r.pipeline();
    // Clean old entries
    pipe.zremrangebyscore(dailyKey, 0, dayAgo);
    pipe.zremrangebyscore(minuteKey, 0, minuteAgo);
    // Count current entries
    pipe.zcard(dailyKey);
    pipe.zcard(minuteKey);
    // Get oldest entry for reset time calculation
    pipe.zrange(dailyKey, 0, 0, { withScores: true });
    pipe.zrange(minuteKey, 0, 0, { withScores: true });

    const results = await pipe.exec();
    const dailyCount = results[2] as number;
    const minuteCount = results[3] as number;
    const dailyOldest = results[4] as Array<{ score: number }>;
    const minuteOldest = results[5] as Array<{ score: number }>;

    const dailyRemaining = Math.max(0, DAILY_LIMIT - dailyCount);
    const minuteRemaining = Math.max(0, MINUTE_LIMIT - minuteCount);

    if (dailyRemaining <= 0 || minuteRemaining <= 0) {
      let resetAt: number | null = null;
      if (minuteRemaining <= 0 && minuteOldest?.length > 0) {
        // Minute limit hit — resets when oldest minute entry expires
        const oldestScore = typeof minuteOldest[0] === 'string' 
          ? Number(minuteOldest[1]) // withScores returns [member, score, ...]
          : (minuteOldest[0] as unknown as { score: number }).score;
        resetAt = oldestScore + MINUTE_MS;
      } else if (dailyRemaining <= 0 && dailyOldest?.length > 0) {
        const oldestScore = typeof dailyOldest[0] === 'string'
          ? Number(dailyOldest[1])
          : (dailyOldest[0] as unknown as { score: number }).score;
        resetAt = oldestScore + DAY_MS;
      }
      return { allowed: false, dailyRemaining, minuteRemaining, resetAt };
    }

    return { allowed: true, dailyRemaining, minuteRemaining, resetAt: null };
  } catch (error) {
    console.error('Rate limit check failed, allowing request:', error);
    return { allowed: true, dailyRemaining: DAILY_LIMIT, minuteRemaining: MINUTE_LIMIT, resetAt: null };
  }
}

/**
 * Record a usage event after successful generation.
 */
export async function incrementUsage(userId: string): Promise<void> {
  const r = getRedis();
  if (!r) return;

  try {
    const now = Date.now();
    const member = `${now}:${Math.random().toString(36).slice(2, 8)}`;
    const dailyKey = `rate:daily:${userId}`;
    const minuteKey = `rate:minute:${userId}`;

    const pipe = r.pipeline();
    pipe.zadd(dailyKey, { score: now, member });
    pipe.zadd(minuteKey, { score: now, member });
    // Set TTL so keys auto-expire
    pipe.expire(dailyKey, 60 * 60 * 25); // 25 hours
    pipe.expire(minuteKey, 120); // 2 minutes
    await pipe.exec();
  } catch (error) {
    console.error('Failed to increment rate limit usage:', error);
  }
}

/**
 * Get current usage for display purposes.
 */
export async function getUsage(userId: string): Promise<{ dailyUsed: number; dailyLimit: number; minuteUsed: number; minuteLimit: number }> {
  const r = getRedis();
  if (!r) {
    return { dailyUsed: 0, dailyLimit: DAILY_LIMIT, minuteUsed: 0, minuteLimit: MINUTE_LIMIT };
  }

  try {
    const now = Date.now();
    const pipe = r.pipeline();
    pipe.zremrangebyscore(`rate:daily:${userId}`, 0, now - DAY_MS);
    pipe.zremrangebyscore(`rate:minute:${userId}`, 0, now - MINUTE_MS);
    pipe.zcard(`rate:daily:${userId}`);
    pipe.zcard(`rate:minute:${userId}`);
    const results = await pipe.exec();

    return {
      dailyUsed: results[2] as number,
      dailyLimit: DAILY_LIMIT,
      minuteUsed: results[3] as number,
      minuteLimit: MINUTE_LIMIT,
    };
  } catch {
    return { dailyUsed: 0, dailyLimit: DAILY_LIMIT, minuteUsed: 0, minuteLimit: MINUTE_LIMIT };
  }
}
