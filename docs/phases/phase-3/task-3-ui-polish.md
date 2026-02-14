# Phase 3 Task 3: UI Polish

## Goal
Polish the UI to feel professional and delightful.

## Scope

1. **Card Design** — Better shadows, spacing, hover states
2. **Emoji Display** — Larger, more prominent emojis
3. **Loading States** — Skeletons for async content
4. **Empty States** — Friendly messages when no content
5. **Accessibility** — Keyboard nav, ARIA labels, contrast

## Implementation

### 1. Use Case Card Polish

`src/components/UseCaseCard.tsx` (or inline):
```typescript
<Link
  href={`/use/${useCase.id}`}
  className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-200 cursor-pointer group"
>
  <div className="card-body">
    {/* Larger emoji */}
    <div className="text-5xl mb-3">{useCase.emoji}</div>
    
    {/* Title with group hover effect */}
    <h3 className="card-title text-xl group-hover:text-primary transition-colors">
      {useCase.title}
    </h3>
    
    {/* One-line description */}
    <p className="text-base-content/70 line-clamp-2">
      {useCase.description}
    </p>
    
    {/* Category badge */}
    <div className="card-actions mt-4">
      <span className="badge badge-outline">{useCase.category}</span>
    </div>
    
    {/* CTA */}
    <div className="mt-2 text-primary font-semibold group-hover:translate-x-1 transition-transform">
      Try it →
    </div>
  </div>
</Link>
```

### 2. Loading States

For category filtering or async data:
```typescript
{loading ? (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="skeleton h-12 w-12 mb-3"></div>
          <div className="skeleton h-6 w-3/4 mb-2"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-5/6"></div>
        </div>
      </div>
    ))}
  </div>
) : (
  <UseCaseGrid useCases={filteredUseCases} />
)}
```

### 3. Empty States

When category filter returns no results:
```typescript
{filteredUseCases.length === 0 && (
  <div className="text-center py-16">
    <div className="text-6xl mb-4">🔍</div>
    <h3 className="text-2xl font-bold mb-2">No use cases yet</h3>
    <p className="text-base-content/70 mb-6">
      We don't have any {activeCategory} tools yet, but check back soon!
    </p>
    <button
      onClick={() => setActiveCategory('all')}
      className="btn btn-primary"
    >
      View All Tools
    </button>
  </div>
)}
```

### 4. Hover States

Buttons with better hover:
```typescript
// Primary buttons with scale effect
<button className="btn btn-primary hover:scale-105 transition-transform">
  Get Started
</button>

// Cards with shadow transition (already in card polish above)
```

### 5. Keyboard Navigation

Ensure all interactive elements are keyboard-accessible:
```typescript
// Use semantic HTML
<button> instead of <div onClick>
<Link> instead of <div onClick>

// Add focus styles
<button className="btn focus:ring-2 focus:ring-primary focus:outline-none">
  Click me
</button>
```

### 6. ARIA Labels

Add accessible labels:
```typescript
// Category filter
<button
  aria-label={`Filter by ${category.label}`}
  aria-pressed={activeCategory === category.id}
>
  {category.label}
</button>

// Use case cards
<Link
  href={`/use/${useCase.id}`}
  aria-label={`Try ${useCase.title}: ${useCase.description}`}
>
  {/* card content */}
</Link>
```

### 7. Color Contrast

Verify contrast ratios:
- Text: 4.5:1 minimum (7:1 for AAA)
- Large text (≥24px): 3:1 minimum
- Use DaisyUI theme colors (already optimized)

## Success Criteria

- [ ] Cards have better shadows and hover effects
- [ ] Emojis are larger and more prominent
- [ ] Loading skeletons show while content loads
- [ ] Empty states friendly and actionable
- [ ] All buttons keyboard-accessible
- [ ] Focus indicators visible
- [ ] ARIA labels on interactive elements
- [ ] Contrast ratios meet WCAG AA
- [ ] Smooth transitions (not janky)
- [ ] Build passes, lint passes
- [ ] Codex review approves

## Testing

**Visual:**
- Hover over cards → see shadow increase and title color change
- Click category filter → see loading skeleton → see results

**Keyboard:**
- Tab through page → all interactive elements reachable
- Enter/Space on buttons → activates them
- Visible focus indicators

**Accessibility:**
- Check contrast with browser DevTools (Lighthouse)
- Screen reader test (VoiceOver on Mac)

## Branch & PR

- **Branch:** `phase-3/ui-polish`
- **PR Title:** "Phase 3 Task 3: UI Polish"

---

*Created: 2026-02-14 18:34 EST*
