import { z } from 'zod';

export const projectFilterSchema = z.object({
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
});

export type ProjectFilterDTO = z.infer<typeof projectFilterSchema>;
