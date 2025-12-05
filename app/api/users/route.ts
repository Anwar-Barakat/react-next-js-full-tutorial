import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Ensure this path is correct based on project structure

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Failed to fetch users', error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
      },
    });
    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    if (error.code === 'P2002') { // Unique constraint violation
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Failed to create user', error: error.message }, { status: 500 });
  }
}
