'use client';

import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle } from 'lucide-react';

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
  path: ['confirmPassword'],
});

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
    console.log('Form Data:', data);
    setSubmissionMessage(`Registration successful for ${data.fullName}!`);
    reset();
  };

  const inputClasses = (hasError: boolean) => 
    `input w-full bg-white/10 border-white/20 focus:border-primary focus:bg-white/20 ${hasError ? 'input-error' : ''}`;

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="fullName"
            {...register('fullName')}
            className={inputClasses(!!errors.fullName)}
          />
          {errors.fullName && <p className="mt-1 text-sm text-secondary flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.fullName.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            {...register('email')}
            className={inputClasses(!!errors.email)}
          />
          {errors.email && <p className="mt-1 text-sm text-secondary flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            {...register('password')}
            className={inputClasses(!!errors.password)}
          />
          {errors.password && <p className="mt-1 text-sm text-secondary flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            {...register('confirmPassword')}
            className={inputClasses(!!errors.confirmPassword)}
          />
          {errors.confirmPassword && <p className="mt-1 text-sm text-secondary flex items-center"><AlertCircle className="w-4 h-4 mr-1" />{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full btn-lg"
        >
          Register
        </button>
      </form>

      {submissionMessage && (
        <div className="alert alert-success mt-4">
          <CheckCircle className="w-5 h-5 mr-2"/>
          {submissionMessage}
        </div>
      )}
    </div>
  );
};