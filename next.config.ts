import type { NextConfig } from "next";

const isProduction = process.env.VERCEL_ENV === 'production';

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    '/api/**': ['./src/data/use-cases/*.yaml'],
  },
  async headers() {
    const securityHeaders: { key: string; value: string }[] = [
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
    ];

    // Block iframe embedding in production only.
    // Preview deployments omit these so Vercel v0's embedded preview can render.
    if (isProduction) {
      securityHeaders.push({
        key: 'X-Frame-Options',
        value: 'DENY',
      });
    }

    const cspDirectives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co https://api.anthropic.com",
    ];

    if (isProduction) {
      cspDirectives.push("frame-ancestors 'none'");
    }

    securityHeaders.push({
      key: 'Content-Security-Policy',
      value: cspDirectives.join('; '),
    });

    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
