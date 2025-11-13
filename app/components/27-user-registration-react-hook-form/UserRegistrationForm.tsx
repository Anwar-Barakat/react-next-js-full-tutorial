'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Define the schema for validation using Zod
const schema = z.object({
  fullName: z.string().min(1, 'Full Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Confirm Password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'], // Set the error on the confirmPassword field
});

// Infer the form data type from the schema
type FormData = z.infer<typeof schema>;

export const UserRegistrationForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    // Simulate API call
    console.log('Form Data:', data);
    setSubmissionMessage(`Registration successful for ${data.fullName}!`);
    reset(); // Clear the form after successful submission
  };

  return (
    <div className="center-content py-12 px-4">
      <div className="max-w-md w-full p-6 bg-[var(--card)] shadow-[var(--shadow-lg)] rounded-[var(--radius)] border border-[var(--border)]">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 center-text heading-gradient">User Registration</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              {...register('fullName')}
              className="input w-full"
            />
            {errors.fullName && <p className="mt-1 text-sm text-[var(--secondary)]">{errors.fullName.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register('email')}
              className="input w-full"
            />
            {errors.email && <p className="mt-1 text-sm text-[var(--secondary)]">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register('password')}
              className="input w-full"
            />
            {errors.password && <p className="mt-1 text-sm text-[var(--secondary)]">{errors.password.message}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--foreground)] mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...register('confirmPassword')}
              className="input w-full"
            />
            {errors.confirmPassword && <p className="mt-1 text-sm text-[var(--secondary)]">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
          >
            Register
          </button>
        </form>

        {submissionMessage && (
          <div className="mt-6 p-4 bg-[var(--accent)]/20 border border-[var(--accent)] text-[var(--accent)] rounded-[var(--radius)]">
            {submissionMessage}
          </div>
        )}
      </div>
    </div>
  );
};
