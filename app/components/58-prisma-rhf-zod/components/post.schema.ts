import { z } from 'zod';

export const postSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters long' }),
  content: z.string().optional(),
  authorId: z.number().positive({ message: 'Author is required' }),
});
