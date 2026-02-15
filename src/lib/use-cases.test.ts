import { describe, it, expect } from 'vitest';
import { validateRequiredAnswers } from './use-cases';
import type { UseCase } from '@/types';

// Minimal UseCase fixture
function makeUseCase(questions: Array<{ id: string; required: boolean; type?: string }>): UseCase {
  return {
    id: 'test',
    title: 'Test',
    description: 'Test',
    icon: '🧪',
    category: 'personal',
    category_label: 'Personal',
    systemPrompt: '',
    questions: questions.map(q => ({
      id: q.id,
      label: q.id,
      type: (q.type || 'text') as 'text',
      required: q.required,
    })),
  };
}

describe('validateRequiredAnswers', () => {
  it('returns field ID when required string is missing', () => {
    const uc = makeUseCase([{ id: 'name', required: true }]);
    expect(validateRequiredAnswers(uc, {})).toEqual(['name']);
  });

  it('returns field ID for empty multiselect array', () => {
    const uc = makeUseCase([{ id: 'tags', required: true, type: 'multiselect' }]);
    expect(validateRequiredAnswers(uc, { tags: [] })).toEqual(['tags']);
  });

  it('returns field ID for empty string', () => {
    const uc = makeUseCase([{ id: 'name', required: true }]);
    expect(validateRequiredAnswers(uc, { name: '' })).toEqual(['name']);
  });

  it('returns empty array when all required present', () => {
    const uc = makeUseCase([
      { id: 'name', required: true },
      { id: 'tags', required: true },
    ]);
    expect(validateRequiredAnswers(uc, { name: 'Alice', tags: ['a'] })).toEqual([]);
  });

  it('handles null and undefined values', () => {
    const uc = makeUseCase([
      { id: 'a', required: true },
      { id: 'b', required: true },
    ]);
    const answers = { a: null, b: undefined } as unknown as Record<string, string | string[] | number>;
    expect(validateRequiredAnswers(uc, answers)).toEqual(['a', 'b']);
  });

  it('allows missing non-required fields', () => {
    const uc = makeUseCase([
      { id: 'required_field', required: true },
      { id: 'optional_field', required: false },
    ]);
    expect(validateRequiredAnswers(uc, { required_field: 'yes' })).toEqual([]);
  });
});
