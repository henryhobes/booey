# Use Case Discovery UX Research

*February 2026 — Research for Booey use case browsing experience*

---

## 1. Discovery UX Patterns in Template/Tool Marketplaces

Modern template and tool catalogs follow a consistent pattern across Canva, Notion, ChatGPT GPT Store, Figma Community, and Zapier:

**The "Netflix Model" — Curated Horizontal Rows**
- Homepage = vertically stacked sections, each a horizontal scrollable row
- Sections like "Featured," "Popular this week," "New," "For [your use case]"
- Each row shows 3-4 cards visible, with horizontal scroll for more
- This reduces choice paralysis vs. showing a flat grid of 100+ items

**Canva's approach:** Category landing pages with subcategory pills at top → grid of templates below. Heavy use of visual previews (thumbnails showing the actual template output). Search is prominent but most users browse by category first.

**GPT Store:** Featured/trending GPTs at top, then category sections. Cards show: name, short description, creator, conversation count ("50K+ conversations"), and category tag. Star ratings were removed — usage count is the primary social proof signal.

**Notion Templates:** Gallery grid with category sidebar (desktop) or horizontal pills (mobile). Each card: title, creator avatar, preview image, "Get template" CTA. Categories double as use-case labels ("Engineering," "Personal," "Marketing").

**Key insight:** All successful catalogs use a **two-tier architecture**: (1) curated/algorithmic homepage for browsing, and (2) category/search pages for targeted finding.

---

## 2. Category Filtering on Mobile

Three dominant patterns, each with clear use cases:

### Horizontal Scrolling Pills (Chips) ✅ Recommended
- **Best for: 5-15 categories** — the sweet spot for our use case
- Used by: YouTube, Google News, Airbnb, App Store, GPT Store
- Advantages: Always visible, no tap-to-reveal, shows active filter state, allows quick switching
- The first pill is often "All" or "For You"
- Selected state: filled/bold; unselected: outlined/muted
- **Critical:** Must be large enough touch targets (min 44px height per Apple HIG, ideally 48px)
- Shows ~3-4 pills on screen; rest accessible via horizontal scroll
- Users aged 40-60 understand this pattern well from YouTube/news apps

### Dropdown / Bottom Sheet
- **Best for: 15+ categories or multi-select filtering**
- More powerful but adds a tap before users see options
- Use when filters are complex (multiple dimensions: category + difficulty + time)

### Fixed Tabs
- **Best for: 2-5 mutually exclusive top-level sections**
- Like iOS tab bars — good for "All | New | Popular | My Favorites"
- Not ideal for category filtering specifically (too few slots)

**Recommendation for Booey:** Horizontal scrolling pills for categories (likely 6-12 categories). Optionally combine with fixed tabs for "All | New | Trending" as a separate top-level filter.

---

## 3. "New" and "Trending" Sections

### What drives "Trending"
- **Usage count over time window** (last 7 days) — most common signal
- Velocity of adoption (growth rate, not just absolute count)
- Engagement signals: completion rate, repeat usage, shares
- NOT just "most popular all-time" — that's a separate "Popular" section

### How to display
- **Dedicated section on homepage:** "🔥 Trending This Week" as a horizontal row
- **Badge/tag on cards:** Small "NEW" or "🔥 Trending" badge overlay
- **Numbered lists:** "Top 10 this week" (App Store pattern) — adds urgency + scannability
- **Time-decay:** New items get a boost for first 7-14 days, then must earn their place

### For a small catalog (40-60 items)
- "Trending" may not be meaningful early on — fake it with editorial picks ("Staff Picks" / "Featured")
- "New" is always valid — show recently added items with a "NEW" badge (auto-expires after 14 days)
- Consider "Recently Used" as a personalized section once users have history

---

## 4. Search vs. Browse

### When browse-only is sufficient
- **< 50 items** with good categorization
- Users don't know exact names of what they want
- Discovery and exploration is the primary goal
- Categories are well-defined and mutually exclusive

### When to add search
- **> 50 items** OR items have specific names users might remember
- Users return to find something they've used before
- Keyword matching adds value (searching by problem description)

### Recommendation for Booey
- **Start browse-only** with categories + featured sections
- Add search when catalog exceeds ~40-50 use cases
- If adding search: put it at top but don't make it the primary interaction. A search bar + browse below (like App Store) works well
- Consider "search by describing your problem" for AI-powered matching later

---

## 5. Card Design for Use Cases

Based on analysis of Canva, GPT Store, Notion, Zapier, and IFTTT card designs:

### Essential elements (must-have)
| Element | Purpose |
|---------|---------|
| **Icon/emoji** | Visual anchor, instant recognition (32-40px) |
| **Title** | Clear, action-oriented name (e.g., "Draft a blog post") |
| **One-line description** | What it does, max ~60 chars on mobile |
| **Category tag** | Small pill/badge showing category |

### Nice-to-have elements
| Element | When to include |
|---------|----------------|
| **Usage count** | When you have real data ("2.3K uses") — strong social proof |
| **"NEW" badge** | For items added in last 14 days |
| **Creator/source** | If community-contributed |
| **Star rating** | Generally declining — usage count is more trusted |

### Card sizing for mobile
- **Full-width list cards** (like Spotify/Settings): Best for quick scanning, shows more info per item
- **2-column grid** (like App Store): Better for visual browsing, shows more items per screen
- **Recommendation:** Full-width cards for the main list view (easier for older users to tap and read). 2-column grid for "Featured" or "Trending" carousel items.

### Visual hierarchy on each card
```
┌─────────────────────────────┐
│ 🎯  Draft a Blog Post       │
│     Write engaging blog      │
│     content from a topic     │
│     ┌──────────┐  ⚡ 1.2K   │
│     │ Writing  │   uses     │
│     └──────────┘            │
└─────────────────────────────┘
```
- Icon left-aligned or top-left
- Title: 16-18px bold
- Description: 14px regular, muted color
- Category pill: bottom-left, small
- Usage count: bottom-right, small

---

## 6. Empty States and Onboarding

### First-time user experience
The critical challenge: users arrive and don't know what a "use case" is or why they'd pick one.

**Pattern 1: "What do you want to do?" onboarding (Canva model)**
- First screen asks user to self-select their goal/role
- "I want to: Write better | Be more productive | Learn something | Create content"
- This personalizes the catalog immediately

**Pattern 2: Curated starter picks (Notion model)**
- Show 3-5 hand-picked "Start here" use cases prominently
- "Most popular with new users" section
- One-tap to try — minimize friction to first success

**Pattern 3: Contextual empty state (best practice)**
- When the "My Use Cases" / "Favorites" section is empty:
  - Don't show a blank screen
  - Show: friendly illustration + "You haven't tried any use cases yet" + "Browse popular use cases" CTA button
  - Optionally: 2-3 suggested use cases inline

### Key principles
- **Time to first value < 30 seconds** — user should be running their first use case within half a minute of seeing the catalog
- **Don't require signup/config before browsing** — let them see the catalog first
- **Progressive disclosure** — show simple options first, reveal power features later
- **One clear CTA** — every empty state needs exactly one obvious next action

---

## 7. Mobile-First Design for Ages 40-60

### Touch targets
- **Minimum 48x48px** tap targets (Google Material Design guideline; Apple says 44x44px)
- **8px minimum spacing** between interactive elements
- For this demographic, err toward **56px+ height** for primary buttons and list items

### Typography
- Body text: minimum **16px** (prevents zooming on iOS)
- Titles: **18-20px bold**
- Don't rely on color alone for state — use weight, size, and icons too
- High contrast ratios (WCAG AA minimum, ideally AAA: 7:1)

### Layout patterns that work
- **Single column layouts** — avoid complex multi-column grids
- **Large, full-width cards** — easy to tap, easy to read
- **Sticky category bar** at top — always accessible while scrolling
- **Bottom navigation** for primary actions (thumb-friendly zone)
- **Generous whitespace** — don't cram content; breathing room reduces cognitive load

### Navigation
- **Avoid hamburger menus** as primary navigation for this demographic — low discoverability
- Prefer **visible tab bars** (bottom) and **horizontal pills** (top)
- Clear "back" affordances — users in this age group are more likely to get "lost"
- **Breadcrumbs or clear titles** showing where they are

### Scroll behavior
- **Pull-to-refresh** is understood but not universal — don't rely on it as only refresh mechanism
- Avoid infinite scroll for catalogs — **paginated or "load more" button** is clearer
- Show scroll indicators if content extends below the fold

---

## Summary: Recommended Architecture for Booey

```
┌────────────────────────────────────┐
│  🔍 Search (when catalog > 50)     │
├────────────────────────────────────┤
│  [All] [Writing] [Research] [Code] │  ← Horizontal scrolling pills
│  [Productivity] [Creative] [...]   │
├────────────────────────────────────┤
│  ⭐ Featured / Staff Picks         │  ← 2-3 highlighted cards
│  ┌─────┐ ┌─────┐ ┌─────┐         │
│  └─────┘ └─────┘ └─────┘         │  ← Horizontal scroll
├────────────────────────────────────┤
│  🆕 New This Week                  │
│  ┌─────────────────────────────┐  │
│  │ 📝 Use Case Card (full-width)│  │  ← Full-width list cards
│  └─────────────────────────────┘  │
│  ┌─────────────────────────────┐  │
│  │ 🎯 Use Case Card            │  │
│  └─────────────────────────────┘  │
├────────────────────────────────────┤
│  🔥 Popular                       │
│  ...                               │
├────────────────────────────────────┤
│  📂 All Use Cases (by category)    │
│  ...                               │
└────────────────────────────────────┘
```

### Key decisions
1. **Horizontal pills** for category filtering (always visible)
2. **Full-width cards** for main browsing (accessibility for 40-60 demo)
3. **Curated sections** (Featured, New, Popular) over pure algorithmic sorting
4. **Browse-first, search-later** — add search when catalog grows
5. **3-5 "Start Here" picks** for first-time users
6. **48px+ touch targets**, 16px+ body text, high contrast
7. **"NEW" badges** auto-expire after 14 days; trending = last 7 days velocity

---

*Sources: Pages.report (2025), Sobooster Mobile Filter UX (2025), Eleken Card UI (2025), Toptal Empty States (2025), UI-Deploy Empty State Guide (2025), Justinmind Card Design (2024), Material Design guidelines, Apple HIG, analysis of Canva/GPT Store/Notion/Zapier UX patterns.*
