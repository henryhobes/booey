# Use Case Prompt Template

Guide for writing high-quality `systemPrompt` fields in Booey use case YAML files. Every use case prompt is combined with the global prompt at runtime — so this document covers only **what goes in the use-case-specific `systemPrompt`**.

## How Prompts Work at Runtime

```
GLOBAL_PROMPT (identity, tone, formatting, boundaries)
+
systemPrompt (role, task instructions, output structure)
+
User answers (formatted as "Label: value" pairs)
```

The global prompt already handles: Booey identity, plain language, markdown formatting rules, no preamble/sign-offs, warm-but-direct tone, and scanning-friendly style. **Do not repeat any of that in your use case prompt.**

---

## The Template

```yaml
systemPrompt: |
  You are a [specific expert role] who [key quality or specialization relevant to this use case].

  Provide:
  1. [Most important deliverable — the thing the user came for]
  2. [Supporting detail or explanation]
  3. [Practical next steps or actionable advice]
  4. [Additional value — alternatives, tips, or context]

  [1-2 sentences of behavioral guidance: tone calibration, what to avoid, or how to handle edge cases.]
```

### Annotated Breakdown

| Section | Purpose | Tips |
|---------|---------|------|
| **Role** | Activates domain-specific knowledge and framing | Be specific: "nutritionist and home cooking expert" > "food expert" > "helpful assistant" |
| **Provide list** | Defines the output structure Claude will follow | Number each deliverable. Put the most valuable item first. 3-6 items is the sweet spot. |
| **Behavioral guidance** | Steers tone and handles edge cases | Keep to 1-2 sentences. Focus on the *feeling* the user should walk away with. |

---

## Standards

### 1. Start with a Specific Role

The role is the single most impactful part of your prompt. It shifts Claude from generic assistant to domain expert.

**Strong roles:**
- "You are a consumer advocate and negotiation coach"
- "You are a fitness coach who specializes in realistic, sustainable exercise for people over 40"
- "You are a patient tech educator who makes technology understandable without being condescending"

**Weak roles:**
- "You are a helpful assistant" (too generic)
- "You are the world's best financial advisor" (superlatives don't help)
- "You are an AI that helps with recipes" (never reference being AI — the global prompt handles identity)

Add a qualifying phrase after the role that narrows the expertise to match the use case. "A resume coach who helps mid-career professionals stand out" is more effective than just "a resume coach."

### 2. Use a Numbered "Provide" List

A numbered output structure gives Claude a clear contract for what to deliver. It also makes responses scannable for users.

- **3-6 items** is the sweet spot. Fewer feels thin; more creates overwhelming responses.
- **Put the most valuable item first.** Users skim top-down. The primary deliverable (the draft, the plan, the recipe) should be item 1.
- **Be specific about each item.** "A complete email draft they can edit" is better than "An email draft." "Estimated costs breakdown" is better than "Cost info."
- **Match items to what the user actually needs to act on.** Every item should pass the test: "Would a 50-year-old find this useful right now?"

### 3. End with Behavioral Guidance (1-2 Sentences)

This is where you calibrate *how* Claude delivers — the emotional register, the boundaries, and the edge case handling.

**Effective guidance:**
- "Be specific and actionable. Make them feel confident making the call."
- "Don't tell them yes or no — help them decide for themselves."
- "Match the explanation to their tech comfort level. Make them feel smart, not stupid."
- "Focus on sustainability over intensity. Make them feel capable, not intimidated."

**Pattern:** Most good behavioral guidance follows the form: **[what to do] + [how the user should feel].**

### 4. Keep It Short

The best use case prompts are **5-12 lines**. Every token costs money (Booey uses Haiku at $1/million input tokens) and the global prompt already handles 15+ lines of formatting and identity rules.

- If your prompt is over 15 lines, you're probably repeating the global prompt or over-specifying.
- If it's under 4 lines, you're probably too vague and will get generic output.
- Cut any instruction that says "use bullet points," "be clear," "use markdown," or "write in plain language" — the global prompt covers all of that.

### 5. Don't Reference User Inputs Directly

User answers arrive as labeled pairs (e.g., "Budget: $500-1000"). Claude naturally incorporates them. You don't need to write "Based on the user's budget..." or "Consider their dietary restrictions when..."

The exception: if a specific input requires special handling (e.g., "If they mention physical limitations, provide exercise modifications"), call it out explicitly.

---

## Best Practices

### Specificity Over Length

A short, specific prompt beats a long, vague one every time.

```yaml
# Good (specific, concise)
systemPrompt: |
  You are a consumer advocate and negotiation coach. Help the user save money on their bills.

  Provide:
  1. A clear phone script with specific phrases to use
  2. Key negotiation tactics for this specific service
  3. What to ask for (realistic discounts or better plans)
  4. How to handle common objections from the representative
  5. When to escalate to a supervisor

  Be specific and actionable. Make them feel confident making the call.
```

```yaml
# Bad (vague, repetitive, over-instructed)
systemPrompt: |
  You are a helpful assistant that helps people with their bills. Please help them
  negotiate their bills to save money. Be friendly and helpful. Use bullet points
  and clear language. Make sure to consider their specific situation. Provide useful
  advice that they can use right away. Don't use jargon. Be encouraging.
  Remember to format your response with markdown headings and lists.
```

### Grounding Tactics

To reduce generic or hallucinated content:

- **Request specific, nameable deliverables.** "A sample itinerary for Friday evening through Sunday" is harder to fake than "Some travel ideas."
- **Ask for reasoning.** "Why each gift works for this person" forces Claude to connect recommendations to the user's actual inputs.
- **Include "realistic" or "honest" qualifiers.** "How much they could realistically earn" and "Be honest about effort vs. reward" encourage grounded responses.

### Encouraging Web Search

Booey has web search enabled (up to 5 searches per request). Claude will use it automatically when current information would improve the response, but you can nudge it:

- For time-sensitive use cases (travel, prices, current events), the role or instructions can imply currency: "who creates realistic, exciting weekend getaway plans" naturally encourages looking up current options.
- You generally don't need to explicitly say "search the web." Claude decides based on whether the query needs current info.

### Tone Calibration by Category

| Category | Tone direction |
|----------|---------------|
| Money & Finance | Confident, no-nonsense, empowering |
| Health & Wellness | Encouraging, non-judgmental, realistic |
| Work & Career | Professional, supportive, actionable |
| Home & Family | Warm, relatable, practical |
| Creative & Fun | Enthusiastic, inspiring, low-pressure |

---

## Anti-Patterns to Avoid

| Anti-pattern | Why it's bad | Fix |
|-------------|-------------|-----|
| Repeating global prompt instructions | Wastes tokens, can cause over-emphasis | Delete any formatting/tone instructions already in the global prompt |
| "You are a helpful AI assistant" | Generic role = generic output | Use a specific domain expert role |
| Laundry list of 10+ output items | Overwhelming responses, diluted quality | Trim to 3-6 high-value items |
| "Consider the user's answers carefully" | Claude does this by default | Delete — it adds nothing |
| "Make sure to be accurate" | Claude is already trying to be accurate | Delete — or specify *what* to verify |
| "Don't make things up" | Negativity framing is less effective | Use positive framing: "Provide realistic estimates" |
| Ending with "Have fun!" or "Good luck!" | The global prompt already prohibits sign-offs | Delete |
| Including example output in the prompt | Expensive in tokens, usually unnecessary with Haiku | Only add examples if Claude consistently misformats output |

---

## Checklist

Before merging a new or updated use case prompt:

- [ ] Starts with a specific expert role (not "helpful assistant")
- [ ] Role includes a qualifying phrase relevant to the use case
- [ ] Uses a numbered "Provide:" list with 3-6 items
- [ ] Most valuable deliverable is item 1
- [ ] Ends with 1-2 sentences of behavioral guidance
- [ ] Total prompt is 5-12 lines
- [ ] Does NOT repeat global prompt instructions (formatting, tone, identity)
- [ ] Does NOT reference being AI, a language model, or Claude
- [ ] Does NOT include unnecessary preamble or sign-off instructions
- [ ] Each output item would be useful to a non-technical 50-year-old
