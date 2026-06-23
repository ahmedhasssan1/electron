import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be at most 255 characters'),
  description: z.string().max(2000).optional().default(''),
  status: z.enum(['todo', 'in_progress', 'done']).optional().default('todo'),
});

export const updateProjectSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(2000).optional(),
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
});

export type CreateProjectDTO = z.infer<typeof createProjectSchema>;
export type UpdateProjectDTO = z.infer<typeof updateProjectSchema>;

export const projectFilterSchema = z.object({
  status: z.enum(['todo', 'in_progress', 'done']).optional(),
});

export type ProjectFilterDTO = z.infer<typeof projectFilterSchema>;
