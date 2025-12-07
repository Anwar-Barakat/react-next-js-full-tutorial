'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { postSchema } from '../components/post.schema';

export async function createPost(formData: FormData) {
  const validatedFields = postSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
    authorId: Number(formData.get('authorId')),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.post.create({
      data: {
        title: validatedFields.data.title,
        content: validatedFields.data.content,
        authorId: validatedFields.data.authorId,
      },
    });
    revalidatePath('/');
    return {
      message: 'Post created successfully',
    }
  } catch (error: any) {
    return {
      message: 'Failed to create post',
      error: error.message,
    }
  }
}
