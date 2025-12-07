'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { userSchema } from '../components/user.schema';

export async function createUser(formData: FormData) {
  const validatedFields = userSchema.safeParse({
    email: formData.get('email'),
    name: formData.get('name'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.user.create({
      data: {
        email: validatedFields.data.email,
        name: validatedFields.data.name,
      },
    });
    revalidatePath('/');
    return {
      message: 'User created successfully',
    }
  } catch (error: any) {
    return {
      message: 'Failed to create user',
      error: error.message,
    }
  }
}
