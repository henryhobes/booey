import { UseCase } from '@/types';
import useCasesData from '@/data/use-cases.json';

/**
 * Load all use cases from the static JSON file
 */
export function getAllUseCases(): UseCase[] {
  return useCasesData as UseCase[];
}

/**
 * Get a single use case by ID
 * @param id - The use case ID
 * @returns The use case or undefined if not found
 */
export function getUseCaseById(id: string): UseCase | undefined {
  const useCases = getAllUseCases();
  return useCases.find((useCase) => useCase.id === id);
}

/**
 * Validate that all required answers are present for a use case
 * @param useCase - The use case to validate against
 * @param answers - The user's answers
 * @returns Array of missing required field IDs (empty if all present)
 */
export function validateRequiredAnswers(
  useCase: UseCase,
  answers: Record<string, string | string[] | number>
): string[] {
  const missing: string[] = [];
  
  for (const question of useCase.questions) {
    if (question.required) {
      const answer = answers[question.id];
      // Check for missing values including empty arrays for multiselect
      if (
        answer === undefined || 
        answer === null || 
        answer === '' ||
        (Array.isArray(answer) && answer.length === 0)
      ) {
        missing.push(question.id);
      }
    }
  }
  
  return missing;
}
