/**
 * Custom error for rate limit responses.
 * Provides typed properties instead of Object.assign hacks.
 */
export class RateLimitError extends Error {
  readonly isRateLimit = true;
  readonly canRetry: boolean;

  constructor(message: string, canRetry: boolean) {
    super(message);
    this.name = 'RateLimitError';
    this.canRetry = canRetry;
  }
}
