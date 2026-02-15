/**
 * Get the base URL for the current deployment
 * 
 * Uses Vercel's automatic environment variables to support:
 * - Production: booey.ai
 * - Preview deployments: *.vercel.app
 * - Local development: localhost
 * 
 * @param useClient - If true, use window.location (client-side only)
 * @returns The base URL with protocol (e.g., "https://booey.ai")
 */
export function getBaseUrl(useClient = false): string {
  // Client-side: use window.location
  if (useClient && typeof window !== 'undefined') {
    return window.location.origin
  }

  // Server-side: use Vercel environment variables
  // NEXT_PUBLIC_VERCEL_URL is automatically set by Vercel (without protocol)
  const vercelUrl = process.env.NEXT_PUBLIC_VERCEL_URL
  
  if (vercelUrl) {
    // Vercel URLs are always HTTPS
    return `https://${vercelUrl}`
  }

  // Local development fallback
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }

  // Production fallback
  return 'https://booey.ai'
}
