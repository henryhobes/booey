'use client'

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
          aria-label={`Filter by ${cat.label}`}
          aria-pressed={activeCategory === cat.id}
          className={`btn btn-sm min-h-[44px] focus:ring-2 focus:ring-primary focus:outline-none ${
            activeCategory === cat.id ? 'btn-primary' : 'btn-outline'
          }`}
        >
          <span className="mr-1" aria-hidden="true">{cat.emoji}</span>
          {cat.label}
        </button>
      ))}
    </div>
  )
}
