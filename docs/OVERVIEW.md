# Booey — Project Overview

## What is Booey?

Booey (booey.ai) is a web app that makes AI accessible to people who don't know what to ask. Instead of opening a blank chatbot and staring at a cursor, users browse curated AI use cases — like "Make this recipe healthier" or "Draft a resignation letter" — click one, and get guided through a few simple questions before the AI generates a personalized result.

**The name:** From "buoy" — a navigation marker that shows safe passage without steering the boat. Booey shows people what AI can do without overwhelming them.

## Who is it for?

**Primary audience:** Non-technical adults (40-60 year olds) — people like Henry's parents who know chatbots exist but don't instinctively reach for them. They're not anti-AI, they just don't know where to start.

**The problem:** Blank chatbot UX is intimidating. The average person doesn't think "I should ask AI to help me comparison-shop car insurance" — they just do it the old way. Booey bridges that gap by showing them possibilities they didn't know existed.

## Core Experience

1. **Browse** — Users see a grid of curated use cases organized by category (Health, Work, Creative, Personal, etc.)
2. **Select** — They click one that looks interesting
3. **Guided flow** — Instead of a blank chat, they get a wizard/form that asks a few clear questions ("Paste your recipe", "Any dietary restrictions?", "Target calories?")
4. **Result** — AI generates a personalized response based on their answers
5. **Save** — Results are saved to their account for later reference

**The magic moment:** A 55-year-old clicks "Make Recipe Healthier," answers 3 questions, and gets a thoughtful result. They think "wow, this just works" — no prompt engineering, no model selection, no confusion.

## Use Case Catalog

We've already built an extensive catalog through a multi-agent pipeline:
- **69 categories** spanning practical daily needs, career, health, creative, emotional, and life skills
- **~1,007 use cases** with descriptions, example scenarios, and guided question flows
- **Rated 9/10** by review agent across 4 iterations
- Master catalog at: `memory/projects/guided-ai/MASTER-CATALOG-v4.md` (in Frank's workspace)

For MVP, we'll ship ~15-20 curated use cases. The full catalog is ready for future expansion.

## Business Model

**MVP (this weekend):** Free for everyone. Henry eats the API costs.
- Estimated cost: ~$0.20-$0.60/user/month using Claude Haiku
- Daily interaction cap of 20 per user to control costs
- No payments, no subscriptions

**Future:** TBD based on traction. Options include freemium tier, pay-per-use, or subscription.

## Origin

Booey started as an idea on February 9, 2026 when Henry Hobin realized his parents and their generation were being left behind by AI — not because they couldn't use it, but because they didn't know what to use it for. The blank chatbot UX was the barrier, not the technology.
