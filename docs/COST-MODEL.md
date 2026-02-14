# Booey — Cost Model & Controls

## Infrastructure Costs (Monthly)

| Service | Free Tier | When to Upgrade |
|---------|-----------|-----------------|
| **Vercel** | 100GB bandwidth, unlimited deploys | >100GB bandwidth (~50k+ visits) |
| **Supabase** | 50k MAU, 500MB DB, 1GB storage | >50k users |
| **Upstash Redis** | 10k commands/day | >10k rate limit checks/day |
| **Domain (booey.ai)** | N/A — ~$12/year | N/A |
| **Total fixed** | **~$1/month** (just domain) | |

## AI API Costs

### Model Strategy
- **Claude Haiku** for most use cases (guided questions + response generation)
- **Claude Sonnet** only for flagged complex use cases (legal, financial, medical)

### Per-Interaction Cost (Haiku)
| Component | Tokens | Cost |
|-----------|--------|------|
| System prompt + use case context | ~300 input | $0.00024 |
| User answers (guided questions) | ~200 input | $0.00016 |
| AI response | ~800 output | $0.0032 |
| **Total per interaction** | | **~$0.004** |

### Monthly Projections

| Users (active) | Interactions/day avg | Monthly cost |
|----------------|---------------------|--------------|
| 50 | 3 | **$18** |
| 100 | 3 | **$36** |
| 500 | 5 | **$300** |
| 1,000 | 5 | **$600** |

### Cost Controls (Implemented in Phase 4)

1. **Per-user daily cap:** 20 interactions/day
2. **Per-user daily cost cap:** $0.50/day
3. **IP-based rate limiting:** 5 requests/min, 50/hour
4. **Global circuit breaker:** If hourly spend exceeds $50, enable maintenance mode
5. **Anthropic dashboard cap:** Hard monthly spending limit (set to $500 initially)
6. **New user velocity limit:** Max 50 signups/hour (prevent bot attacks)

### When to Worry
- Monthly cost exceeds $200 → consider monetization or model downgrade
- Single user consistently hitting daily cap → possible abuse, investigate
- Hourly spend spikes → check for scripted abuse, enable circuit breaker
