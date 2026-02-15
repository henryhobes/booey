import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { useCaseSchema } from './_schema';
import type { UseCase } from '@/types';

const useCaseDir = path.join(process.cwd(), 'src/data/use-cases');

const yamlFiles = [
  'healthy-recipe',
  'pantry-meal',
  'difficult-email',
  'bill-negotiation',
  'weekend-trip',
  'gift-ideas',
  'contractor-quote',
  'tech-explainer',
  'pop-culture',
  'meal-plan-week',
  'resume-update',
  'exercise-plan',
  'conversation-starters',
  'side-hustle',
  'vacation-packing',
  'sympathy-message',
  'major-purchase',
  'parent-teacher-prep',
  'home-energy',
];

const rawUseCases = yamlFiles.map((name) => {
  const filePath = path.join(useCaseDir, `${name}.yaml`);
  const content = fs.readFileSync(filePath, 'utf8');
  return yaml.load(content);
});

// Validate all use cases at build time
export const useCases: UseCase[] = rawUseCases.map((raw) => {
  const parsed = useCaseSchema.parse(raw);
  return parsed as UseCase;
});
