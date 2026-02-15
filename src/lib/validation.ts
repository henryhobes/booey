import { z } from 'zod';

export const GenerateRequestSchema = z.object({
  useCaseId: z.string().min(1).max(100),
  answers: z.record(
    z.string(),
    z.union([
      z.string().max(5000),
      z.array(z.string().max(500)),
      z.number().min(0).max(1000000),
    ])
  ),
});

export type ValidatedGenerateRequest = z.infer<typeof GenerateRequestSchema>;
