import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });
    return NextResponse.json(posts);
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ message: 'Failed to fetch posts', error: error.message }), { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, content, authorId } = await request.json();

    if (!title || !authorId) {
      return new NextResponse(JSON.stringify({ message: 'Title and authorId are required' }), { status: 400 });
    }

    const newPost = await prisma.post.create({
      data: {
        title,
        content,
        author: {
          connect: {
            id: authorId,
          },
        },
      },
    });
    return new NextResponse(JSON.stringify(newPost), { status: 201 });
  } catch (error: any) {
    return new NextResponse(JSON.stringify({ message: 'Failed to create post', error: error.message }), { status: 500 });
  }
}
