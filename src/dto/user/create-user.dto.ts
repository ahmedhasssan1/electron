import { z } from 'zod';

export const createUserSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name must be at most 255 characters'),
  email: z
    .string()
    .email({ message: 'Invalid email format' })
    .max(255, 'Email must be at most 255 characters'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(255, 'Password must be at most 255 characters'),
  role: z.enum(['admin', 'member']).optional().default('member'),
});

export type CreateUserDTO = z.infer<typeof createUserSchema>;
