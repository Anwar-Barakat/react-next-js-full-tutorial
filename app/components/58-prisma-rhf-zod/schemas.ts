import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  name: z.string().optional(),
});

export const postSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long' }),
  content: z.string().optional(),
  authorId: z.number().positive({ message: 'Author is required' }),
});
