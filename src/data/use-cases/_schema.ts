import { z } from 'zod';

const questionSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(['text', 'textarea', 'select', 'multiselect', 'number']),
  placeholder: z.string().optional(),
  options: z.array(z.string()).optional(),
  required: z.boolean(),
  min: z.number().optional(),
  max: z.number().optional(),
  helperText: z.string().optional(),
  allowOther: z.boolean().optional(),
});

export const useCaseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  icon: z.string(),
  category: z.enum(['health', 'work', 'lifestyle', 'personal']),
  category_label: z.string(),
  questions: z.array(questionSchema),
  systemPrompt: z.string(),
  addedDate: z.string().optional(),
  popular: z.boolean().optional(),
});

export type ValidatedUseCase = z.infer<typeof useCaseSchema>;
