# Phase 3 Task 2: Responsive Design

## Goal
Make Booey work beautifully on mobile devices with a mobile-first responsive design.

## Scope

1. **Mobile Layout** — Single column grid on small screens
2. **Desktop Layout** — 3-column grid on large screens
3. **Touch Targets** — Minimum 44px tap targets for mobile
4. **Typography** — Readable fonts at all sizes
5. **Spacing** — Proper padding/margins for mobile

## Implementation

### 1. Use Case Grid Responsive

`src/app/page.tsx` or component with grid:
```typescript
// Update grid classes for responsive layout
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {useCases.map(useCase => (
    <UseCaseCard key={useCase.id} useCase={useCase} />
  ))}
</div>
```

Breakdown:
- `grid-cols-1` — 1 column on mobile (default)
- `md:grid-cols-2` — 2 columns on tablet (≥768px)
- `lg:grid-cols-3` — 3 columns on desktop (≥1024px)
- `gap-6` — 1.5rem spacing between cards

### 2. Touch Targets (Minimum 44px)

Buttons and interactive elements:
```typescript
// Use btn-lg for mobile-friendly tap targets
<Link href={`/use/${useCase.id}`} className="btn btn-primary btn-lg">
  Try it →
</Link>

// Category filter buttons already use btn-sm, but add min-h
<button className="btn btn-sm min-h-[44px]">
  {category.label}
</button>
```

### 3. Mobile Typography

Add responsive font sizes:
```typescript
// Hero heading
<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
  AI tools for everyday life
</h1>

// Section headings
<h2 className="text-2xl md:text-3xl font-bold">
  What can Booey help you with?
</h2>

// Card titles
<h3 className="text-lg md:text-xl font-bold">
  {useCase.title}
</h3>
```

### 4. Mobile Spacing

Update container padding:
```typescript
// Add horizontal padding on mobile
<div className="container mx-auto px-4 md:px-6 lg:px-8">
  {/* content */}
</div>

// Section padding
<section className="py-12 md:py-16 lg:py-20">
  {/* content */}
</section>
```

### 5. Navigation Mobile

Ensure nav is mobile-friendly:
```typescript
// Stack nav items on mobile if needed
<nav className="flex flex-col md:flex-row items-center gap-4">
  <Link href="/">Booey</Link>
  <div className="flex gap-4">
    <Link href="/history">History</Link>
    <button>Sign Out</button>
  </div>
</nav>
```

### 6. Wizard Mobile

Ensure wizard questions work on mobile:
```typescript
// Use full-width buttons
<button className="btn btn-primary w-full md:w-auto">
  Next
</button>

// Stack wizard buttons on mobile
<div className="flex flex-col md:flex-row gap-4">
  <button className="btn btn-outline w-full md:w-auto">Back</button>
  <button className="btn btn-primary w-full md:w-auto">Next</button>
</div>
```

## Testing

**Mobile viewport (375px - iPhone SE):**
- [ ] Single column layout
- [ ] All tap targets ≥44px
- [ ] Text readable (not too small)
- [ ] No horizontal scroll
- [ ] Cards stack vertically

**Tablet viewport (768px - iPad):**
- [ ] 2-column layout
- [ ] Comfortable spacing
- [ ] Touch-friendly

**Desktop viewport (1024px+):**
- [ ] 3-column layout
- [ ] Max-width container (not too wide)
- [ ] Proper spacing

**Browser DevTools:**
- Test in Chrome DevTools responsive mode
- Try iPhone SE, iPhone 12 Pro, iPad, Desktop viewports

## Success Criteria

- [ ] Grid responsive (1/2/3 columns based on screen size)
- [ ] All buttons ≥44px tap targets
- [ ] Typography scales (smaller on mobile, larger on desktop)
- [ ] No horizontal scroll on mobile
- [ ] Wizard works on mobile (stacked buttons, full-width inputs)
- [ ] Nav works on mobile
- [ ] Build passes, lint passes
- [ ] Codex review approves

## Branch & PR

- **Branch:** `phase-3/responsive-design`
- **PR Title:** "Phase 3 Task 2: Responsive Design"

---

*Created: 2026-02-14 18:33 EST*
