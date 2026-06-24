import { z } from 'zod';

export const taskFilterSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
});

export type TaskFilterDTO = z.infer<typeof taskFilterSchema>;
