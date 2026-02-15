# Task 0006: Privacy Policy & Terms of Service Pages

## Problem
Google OAuth consent screen shows raw Supabase URL instead of "Booey" because app verification requires privacy policy and terms of service links. Currently blank in Google Cloud Console.

## Solution
Add `/privacy` and `/terms` pages to booey.ai.

## Pages

### `/privacy` — Privacy Policy
Cover:
- What data we collect (Google name, email, profile pic via OAuth)
- What we use it for (account creation, personalization)
- AI data handling (answers sent to Claude API, not stored permanently beyond session history)
- Session history stored in Supabase (user can see in History tab)
- No selling of data to third parties
- Cookies (Supabase auth cookies only)
- Data deletion (contact email to request)
- Contact info

### `/terms` — Terms of Service
Cover:
- Service description (AI-powered tools for personal use)
- Account requirements (Google sign-in, free tier with daily limits)
- Acceptable use (no harmful/illegal content in prompts)
- AI disclaimer (results are AI-generated, not professional advice — medical, legal, financial)
- Service availability (no uptime guarantee, free service)
- Limitation of liability
- Changes to terms
- Contact info

## Design
- Clean, readable pages matching Booey's warm tone
- NOT dense legalese — write for 40-60 year olds (the target audience)
- Simple language, short paragraphs, clear headers
- Back link to homepage
- Footer links from all pages

## Acceptance Criteria
- [ ] `/privacy` page exists with privacy policy content
- [ ] `/terms` page exists with terms of service content  
- [ ] Footer on all pages links to both
- [ ] Pages are mobile-friendly (same standards as rest of site)
- [ ] `npm run build` and `npm run lint` pass
- [ ] Content is accurate to how Booey actually works
