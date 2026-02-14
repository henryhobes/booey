# Phase 3 Task 1: Category System + Filtering

## Goal
Add category tags to use cases and implement category filtering on the homepage.

## Scope

1. **Update Types** — Add `category` field to UseCase type
2. **Categorize Use Cases** — Tag all 19 use cases with appropriate categories
3. **Filter UI** — Category pills/tabs at top of use case grid
4. **Filter Logic** — Show/hide use cases based on selected category

## Categories

Suggested categories (choose 4-6):
- 🍎 **Health** — healthy recipe, pantry meals
- 💼 **Work** — tough email, bill negotiation
- ✈️ **Travel** — weekend getaway
- 🎁 **Personal** — gift ideas
- 🏠 **Home** — (future: home organization, cleaning, etc.)
- 💰 **Money** — bill negotiation, budgeting

**Decision:** Use these 4 for MVP:
- 🍎 Health
- 💼 Work  
- ✈️ Lifestyle
- 🎁 Personal

## Implementation

### 1. Update Types

`src/types/index.ts`:
```typescript
export type UseCaseCategory = 'health' | 'work' | 'lifestyle' | 'personal'

export interface UseCase {
  id: string
  title: string
  description: string
  emoji: string
  category: UseCaseCategory  // NEW
  questions: Question[]
}
```

### 2. Update Use Cases JSON

`src/data/use-cases.json` — add `category` to each use case:
```json
{
  "id": "healthy-recipe",
  "title": "Make a Recipe Healthier",
  "emoji": "🍎",
  "category": "health",  // NEW
  ...
}
```

Suggested categorization:
- healthy-recipe → health
- pantry-meal → health
- difficult-email → work
- bill-negotiation → work
- weekend-trip → lifestyle
- gift-ideas → personal

### 3. Filter UI Component

`src/components/CategoryFilter.tsx`:
```typescript
'use client'

import { useState } from 'react'
import type { UseCaseCategory } from '@/types'

interface CategoryFilterProps {
  onFilterChange: (category: UseCaseCategory | 'all') => void
  activeCategory: UseCaseCategory | 'all'
}

const categories = [
  { id: 'all' as const, label: 'All', emoji: '✨' },
  { id: 'health' as const, label: 'Health', emoji: '🍎' },
  { id: 'work' as const, label: 'Work', emoji: '💼' },
  { id: 'lifestyle' as const, label: 'Lifestyle', emoji: '✈️' },
  { id: 'personal' as const, label: 'Personal', emoji: '🎁' },
]

export default function CategoryFilter({ onFilterChange, activeCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center mb-8">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onFilterChange(cat.id)}
          className={`btn btn-sm ${
            activeCategory === cat.id ? 'btn-primary' : 'btn-outline'
          }`}
        >
          <span className="mr-1">{cat.emoji}</span>
          {cat.label}
        </button>
      ))}
    </div>
  )
}
```

### 4. Update Landing Page

`src/app/page.tsx` — add filtering logic:
```typescript
'use client'

import { useState } from 'react'
import CategoryFilter from '@/components/CategoryFilter'
import type { UseCaseCategory } from '@/types'

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<UseCaseCategory | 'all'>('all')
  
  // Filter use cases
  const filteredUseCases = activeCategory === 'all'
    ? useCases
    : useCases.filter(uc => uc.category === activeCategory)

  return (
    <>
      <Hero />
      
      <section id="use-cases" className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-8">
            What can Booey help you with?
          </h2>
          
          <CategoryFilter 
            activeCategory={activeCategory}
            onFilterChange={setActiveCategory}
          />
          
          {filteredUseCases.length === 0 ? (
            <p className="text-center text-base-content/70">
              No use cases in this category yet. Try "All" to see everything!
            </p>
          ) : (
            <UseCaseGrid useCases={filteredUseCases} />
          )}
        </div>
      </section>
    </>
  )
}
```

## Success Criteria

- [ ] `category` field added to UseCase type
- [ ] All 19 use cases tagged with categories
- [ ] CategoryFilter component renders pills
- [ ] Clicking category filters use case grid
- [ ] "All" shows all use cases
- [ ] Empty state shows when category has no use cases
- [ ] Build passes, lint passes, TypeScript strict mode passes
- [ ] Codex review approves

## Testing

1. Click each category filter → see only relevant use cases
2. Click "All" → see all 19 use cases
3. Verify categories make sense (health, work, lifestyle, personal)
4. Check empty state (if a category has 0 use cases)

## Branch & PR

- **Branch:** `phase-3/category-filtering`
- **PR Title:** "Phase 3 Task 1: Category System + Filtering"

---

*Created: 2026-02-14 18:32 EST*
