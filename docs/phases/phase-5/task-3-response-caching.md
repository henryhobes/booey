# Phase 5 Task 3: Response Caching

## Goal
Implement response caching to reduce API costs by up to 90% via Anthropic prompt caching and Supabase-backed response cache.

## Requirements

### 1. Anthropic Prompt Caching
**Purpose:** Cache system prompt to save ~90% on input tokens for repeat interactions.

**How it works:**
- Anthropic caches prompts with `cache_control` markers
- System prompt (use case description + instructions) stays cached for 5 minutes
- Subsequent requests within 5min: only pay for NEW user input tokens
- Savings: ~500 tokens/request → ~50 tokens (10x reduction)

**Implementation:**
- Update `src/lib/ai/claude.ts` to use cache-enabled API
- Add `cache_control: { type: "ephemeral" }` to system message
- Requires Anthropic SDK >=0.21.0 (verify in package.json)

**Example:**
```typescript
const response = await anthropic.messages.create({
  model: "claude-3-5-haiku-20241022",
  max_tokens: 2048,
  system: [
    {
      type: "text",
      text: systemPrompt,  // use case description + instructions
      cache_control: { type: "ephemeral" },
    },
  ],
  messages: [{ role: "user", content: userPrompt }],
});

// Check cache performance in response headers
const cacheStats = {
  inputTokens: response.usage.input_tokens,
  cacheCreationTokens: response.usage.cache_creation_input_tokens || 0,
  cacheReadTokens: response.usage.cache_read_input_tokens || 0,
};
```

### 2. Response Cache (Supabase)
**Purpose:** Cache identical (use case + answers) pairs to avoid redundant API calls.

**Why:** Users might try the same use case with identical inputs (e.g., "Plan a trip to Paris" with same dates).

**Implementation:**
- Before calling Claude API, check if identical request exists in last 24 hours
- Cache key: SHA-256 hash of `useCaseId + JSON.stringify(answers)`
- Store in new `response_cache` table with 24h TTL
- If cache hit: return cached result, skip API call, don't charge against rate limit

**Schema:**
```sql
CREATE TABLE response_cache (
  cache_key TEXT PRIMARY KEY,
  use_case_id TEXT NOT NULL,
  result TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-delete after 24 hours
CREATE INDEX idx_cache_created ON response_cache(created_at);
-- Run daily cleanup: DELETE FROM response_cache WHERE created_at < NOW() - INTERVAL '24 hours';
```

**Usage flow:**
```typescript
// 1. Generate cache key
const cacheKey = crypto
  .createHash('sha256')
  .update(`${useCaseId}:${JSON.stringify(answers)}`)
  .digest('hex');

// 2. Check cache
const cached = await supabase
  .from('response_cache')
  .select('result')
  .eq('cache_key', cacheKey)
  .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000))
  .single();

if (cached.data) {
  return { result: cached.data.result, cached: true };
}

// 3. Call API, then cache result
const result = await generateResult(useCase, answers);

await supabase.from('response_cache').insert({
  cache_key: cacheKey,
  use_case_id: useCaseId,
  result: result.result,
});

return { ...result, cached: false };
```

### 3. Cache Analytics
Add optional cache hit/miss logging to track effectiveness:
- Log cache hit rate to Redis counter
- Include in budget tracking: `{ cached: X, uncached: Y }`

## Files to Create/Modify
- `src/lib/ai/claude.ts` (add prompt caching)
- `src/app/api/generate/route.ts` (add response cache logic)
- `supabase/migrations/006_response_cache.sql` (new table)
- `src/lib/cache.ts` (helper functions, optional)

## Acceptance Criteria
- [ ] Anthropic prompt caching enabled (system prompt cached)
- [ ] Response cache table created with 24h TTL
- [ ] Cache key logic implemented (SHA-256 hash)
- [ ] Cache hit returns result without API call
- [ ] Cache miss stores result after generation
- [ ] TypeScript clean, build passes
- [ ] Migration file committed

## Expected Savings
- **Prompt caching:** ~90% reduction on input tokens (500 → 50 per request)
- **Response caching:** Depends on duplicate rate; assume 10-20% cache hit rate
- **Combined:** Potentially 50-70% cost reduction on production workload

## Notes
- Prompt caching has no downside (automatic cost savings)
- Response caching trades storage for API cost (very favorable tradeoff)
- 24h TTL keeps cache fresh while preventing stale responses
- Cache invalidation: not needed (use cases/answers are deterministic)
