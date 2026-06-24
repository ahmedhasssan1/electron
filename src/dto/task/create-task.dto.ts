import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be at most 255 characters'),
  description: z.string().max(2000).optional().default(''),
  status: z
    .enum(['pending', 'in_progress', 'done'])
    .optional()
    .default('pending'),
  priority: z.enum(['low', 'medium', 'high']).optional().default('medium'),
  dueDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Due date must be YYYY-MM-DD')
    .optional(),
});

export type CreateTaskDTO = z.infer<typeof createTaskSchema>;
