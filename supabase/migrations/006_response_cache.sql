-- Response cache table for caching identical use case + answers pairs
CREATE TABLE response_cache (
  cache_key TEXT PRIMARY KEY,
  use_case_id TEXT NOT NULL,
  result TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for TTL cleanup queries
CREATE INDEX idx_response_cache_created ON response_cache(created_at);

-- Enable RLS
ALTER TABLE response_cache ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (API routes use service role)
CREATE POLICY "Service role can manage cache"
  ON response_cache
  FOR ALL
  USING (true)
  WITH CHECK (true);
