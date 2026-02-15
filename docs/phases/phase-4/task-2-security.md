# Phase 4 Task 2: Security Hardening

**Estimated Time:** 1 hour  
**Branch:** `phase-4/security`  
**PR:** Will open as #14

---

## Goal

Add critical security controls to protect against common attacks and secure sensitive data.

---

## Requirements

### 1. Security Headers

Add security headers in `next.config.js`:

```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requires unsafe-inline/eval in dev
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co https://api.anthropic.com",
              "frame-ancestors 'none'"
            ].join('; ')
          }
        ]
      }
    ];
  }
};
```

### 2. Input Validation

Add Zod validation for API route inputs:

**Files:**
- `src/lib/validation.ts` - Zod schemas
- `src/app/api/generate/route.ts` - Validate request body

**Schema:**
```typescript
import { z } from 'zod';

export const GenerateRequestSchema = z.object({
  useCaseId: z.string().min(1).max(100),
  answers: z.record(
    z.string(),
    z.union([
      z.string().max(5000), // Text answers
      z.array(z.string().max(500)), // Multiselect
      z.number().min(0).max(1000000) // Number answers
    ])
  )
});
```

**Validation in API route:**
```typescript
const body = await request.json();
const validation = GenerateRequestSchema.safeParse(body);

if (!validation.success) {
  return NextResponse.json(
    { error: 'Invalid request', details: validation.error },
    { status: 400 }
  );
}

const { useCaseId, answers } = validation.data;
```

### 3. API Key Protection

Verify Claude API key is never exposed:

1. **Check:** API key should NOT have `NEXT_PUBLIC_` prefix
2. **Verify:** Key is only used in API routes (server-side)
3. **Add comment:** Document in `.env.example` that this must be server-only

### 4. XSS Prevention

**Already handled by React** - React escapes rendered content by default.

**Only add if needed:** If we render user input as HTML (we don't currently), sanitize with DOMPurify:
```bash
npm install dompurify
npm install --save-dev @types/dompurify
```

**For now:** Just verify we're not using `dangerouslySetInnerHTML` anywhere (we're not).

---

## Implementation Steps

1. **Security Headers:**
   - Update `next.config.js` with headers config
   - Test headers are applied: `curl -I http://localhost:3000`
   - Verify CSP doesn't break anything in dev/build

2. **Input Validation:**
   - Install Zod: `npm install zod`
   - Create `src/lib/validation.ts` with schemas
   - Update `/api/generate` route to validate input
   - Test with invalid inputs (expect 400 errors)

3. **API Key Audit:**
   - Search codebase for `ANTHROPIC_API_KEY`
   - Confirm it's only in `.env.local` and API routes
   - Add warning comment in `.env.example`
   - Verify key is NOT in `NEXT_PUBLIC_*` format

4. **XSS Check:**
   - Search codebase for `dangerouslySetInnerHTML` (should be 0 results)
   - Confirm we're not rendering user input as raw HTML
   - Document that React handles XSS by default (in security docs)

5. **Test:**
   - Build succeeds with CSP headers
   - Invalid API requests return 400 with helpful errors
   - App still works normally
   - Security headers visible in browser dev tools

---

## Acceptance Criteria

- ✅ Security headers configured in `next.config.js`
- ✅ Headers visible in HTTP responses (verify with curl or dev tools)
- ✅ Zod validation on `/api/generate` route
- ✅ Invalid requests return 400 with validation errors
- ✅ Claude API key confirmed server-side only
- ✅ No `dangerouslySetInnerHTML` usage
- ✅ App builds and runs without CSP errors
- ✅ PR opened with Codex review passed

---

## Files to Modify/Create

- `next.config.js` - Add security headers
- `src/lib/validation.ts` - Zod schemas (new file)
- `src/app/api/generate/route.ts` - Add validation
- `.env.example` - Document API key security note
- `package.json` - Add `zod` dependency

---

## Notes

- **CSP tuning:** May need to adjust CSP if we add third-party scripts later
- **Zod:** Lightweight validation library, good for runtime type checking
- **Future additions:** CSRF tokens (Next.js has built-in protection via SameSite cookies), rate limiting headers (add in Task 1)
- **Nice-to-have:** Sentry for error monitoring (post-launch)

---

## Reference

Research: `memory/projects/booey/research-security.md` (created by subagent)

OWASP Top 10 coverage (critical items):
1. ✅ Broken Access Control - Handled by RLS (Task 3)
2. ✅ Injection - Zod validation + parameterized queries
3. ✅ Insecure Design - Security headers + principle of least privilege
4. ✅ Security Misconfiguration - Headers + env var audit
5. ✅ XSS - React auto-escape + no dangerouslySetInnerHTML
