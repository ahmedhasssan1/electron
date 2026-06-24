import { z } from 'zod';

export const updateProjectSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
});

export type UpdateProjectDTO = z.infer<typeof updateProjectSchema>;
