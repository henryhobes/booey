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
          className={`btn btn-sm min-h-[44px] ${
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
