import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  email: z.string().email().max(255).optional(),
  role: z.enum(['admin', 'member']).optional(),
});

export type UpdateUserDTO = z.infer<typeof updateUserSchema>;
