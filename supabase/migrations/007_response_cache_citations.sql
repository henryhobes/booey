-- Add citations column to response_cache for web search sources
ALTER TABLE response_cache ADD COLUMN citations JSONB DEFAULT '[]'::jsonb;
