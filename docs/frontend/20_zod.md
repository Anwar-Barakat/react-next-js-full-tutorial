# Zod Validation Guide

A comprehensive guide to Zod, the TypeScript-first schema validation library for runtime data validation.

---

## Table of Contents

1. [What is Zod?](#1-what-is-zod)
2. [Basic Schema Types](#2-basic-schema-types)
3. [String Validations](#3-string-validations)
4. [Number Validations](#4-number-validations)
5. [Object Schemas](#5-object-schemas)
6. [Arrays, Tuples, and Unions](#6-arrays-tuples-and-unions)
7. [Optional, Nullable, Default, and Coercion](#7-optional-nullable-default-and-coercion)
8. [Transform, Refine, and Pipe](#8-transform-refine-and-pipe)
9. [Custom Error Messages](#9-custom-error-messages)
10. [Zod with React Hook Form](#10-zod-with-react-hook-form)
11. [Zod with Next.js Server Actions](#11-zod-with-nextjs-server-actions)
12. [Zod with API Response Validation](#12-zod-with-api-response-validation)
13. [Environment Variable Validation](#13-environment-variable-validation)
14. [Best Practices](#14-best-practices)

---

## 1. What is Zod?

- **TypeScript-first** schema validation library for **runtime** data validation (TypeScript only checks at compile time).
- Zero dependencies, small bundle, works in Node.js, browsers, and edge runtimes.
- Validates API responses, form data, env variables — ensures they match your expected shape.
- Generates TypeScript types from schemas with `z.infer` — single source of truth.

**Installation:**

```bash
npm install zod
```

---

## 2. Basic Schema Types

Zod provides schema constructors for every common data type:

- `z.string()` — validates strings
- `z.number()` — validates numbers
- `z.boolean()` — validates booleans
- `z.date()` — validates Date objects
- `z.bigint()` — validates BigInt values
- `z.undefined()` / `z.null()` / `z.void()` — validates undefined, null, or void
- `z.any()` / `z.unknown()` — allows any value (use `z.unknown()` for safer typing)
- `z.literal('value')` — matches an exact value
- `z.enum(['admin', 'user', 'guest'])` — matches one of the listed values
- `z.nativeEnum(MyEnum)` — works with TypeScript enums

**Basic usage with `parse` and `safeParse`:**

```typescript
import { z } from 'zod';

const nameSchema = z.string();
nameSchema.parse('Anwar');     // 'Anwar'
nameSchema.parse(123);         // throws ZodError

// safeParse doesn't throw
const result = nameSchema.safeParse('Anwar');
if (result.success) {
  console.log(result.data); // 'Anwar'
} else {
  console.log(result.error); // ZodError
}
```

- `parse()` throws a `ZodError` if validation fails.
- `safeParse()` returns a result object with `success`, `data`, and `error` — never throws.

---

## 3. String Validations

Zod provides many built-in string validators:

- `z.string().min(3)` — minimum length
- `z.string().max(100)` — maximum length
- `z.string().length(10)` — exact length
- `z.string().email()` — valid email format
- `z.string().url()` — valid URL format
- `z.string().uuid()` — valid UUID format
- `z.string().regex(/pattern/)` — matches a regex pattern
- `z.string().trim()` — trims whitespace before validation
- `z.string().toLowerCase()` — converts to lowercase
- `z.string().startsWith('prefix')` — must start with a given string
- `z.string().endsWith('suffix')` — must end with a given string
- `z.string().includes('substring')` — must contain a substring
- `z.string().datetime()` — valid ISO datetime string

**Custom error messages** can be passed as a second argument:

```typescript
import { z } from 'zod';

const usernameSchema = z.string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be at most 20 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores allowed');

const emailSchema = z.string()
  .trim()
  .toLowerCase()
  .email('Please enter a valid email');
```

---

## 4. Number Validations

- `z.number().min(0)` — minimum value
- `z.number().max(100)` — maximum value
- `z.number().positive()` — must be greater than 0
- `z.number().negative()` — must be less than 0
- `z.number().nonnegative()` — must be 0 or greater
- `z.number().nonpositive()` — must be 0 or less
- `z.number().int()` — must be an integer
- `z.number().finite()` — must not be Infinity or -Infinity
- `z.number().multipleOf(5)` — must be divisible by 5
- `z.coerce.number()` — converts strings to numbers (e.g., `"123"` becomes `123`)

**Custom error messages:**

```typescript
import { z } from 'zod';

const ageSchema = z.number()
  .min(18, 'Must be at least 18 years old')
  .max(120, 'Invalid age');

const priceSchema = z.number()
  .positive('Price must be positive')
  .multipleOf(0.01, 'Price must have at most 2 decimal places');

// Coercion — useful for HTML form inputs that are always strings
const formAgeSchema = z.coerce.number().min(18);
formAgeSchema.parse('25'); // 25 (number)
```

---

## 5. Object Schemas

- `z.object({})` — defines the shape of an object
- Access individual field schemas with `schema.shape.fieldName`
- Generate TypeScript types with `z.infer<typeof schema>`
- `.parse()` strips unknown keys by default
- `.strict()` — rejects unknown keys (throws if extra keys present)
- `.passthrough()` — allows and preserves unknown keys
- `.partial()` — makes all fields optional
- `.required()` — makes all fields required
- `.pick({ field: true })` — select specific fields only
- `.omit({ field: true })` — exclude specific fields
- `.extend({})` — add new fields to the schema
- `.merge(otherSchema)` — combine two object schemas

```typescript
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  age: z.number().min(18),
  role: z.enum(['admin', 'user']),
});

type User = z.infer<typeof userSchema>;
// { name: string; email: string; age: number; role: 'admin' | 'user' }

// Partial — all fields become optional
const updateUserSchema = userSchema.partial();
// { name?: string; email?: string; age?: number; role?: 'admin' | 'user' }

// Pick — select specific fields
const loginSchema = userSchema.pick({ email: true });

// Omit — exclude specific fields
const publicUserSchema = userSchema.omit({ email: true });

// Extend — add new fields
const adminSchema = userSchema.extend({
  permissions: z.array(z.string()),
});
```

---

## 6. Arrays, Tuples, and Unions

**Arrays:**

- `z.array(z.string())` — array of strings
- `.min(1)` — minimum array length
- `.max(10)` — maximum array length
- `.length(5)` — exact array length
- `.nonempty()` — array must have at least one element

**Tuples:**

- `z.tuple([z.string(), z.number()])` — fixed-length typed array

**Unions:**

- `z.union([z.string(), z.number()])` — value must match string OR number
- `z.discriminatedUnion('type', [...])` — tagged union with better error messages
- `z.intersection(schemaA, schemaB)` — value must match both schemas (AND)

**Records:**

- `z.record(z.string(), z.number())` — key-value object like `Record<string, number>`

```typescript
import { z } from 'zod';

// Array with constraints
const tagsSchema = z.array(z.string()).min(1).max(10);

// Tuple
const coordinatesSchema = z.tuple([z.number(), z.number()]);

// Discriminated union — provides clearer error messages than z.union
const eventSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('click'), x: z.number(), y: z.number() }),
  z.object({ type: z.literal('keypress'), key: z.string() }),
]);

eventSchema.parse({ type: 'click', x: 10, y: 20 }); // valid
eventSchema.parse({ type: 'keypress', key: 'Enter' }); // valid
```

---

## 7. Optional, Nullable, Default, and Coercion

- `.optional()` — field can be `undefined`
- `.nullable()` — field can be `null`
- `.nullish()` — field can be `null` or `undefined`
- `.default(value)` — provides a default value if `undefined`
- `z.coerce.string()` — converts to string (e.g., `123` becomes `"123"`)
- `z.coerce.number()` — converts to number (e.g., `"42"` becomes `42`)
- `z.coerce.boolean()` — converts to boolean
- `z.coerce.date()` — converts string or number to a `Date` object

```typescript
import { z } from 'zod';

const settingsSchema = z.object({
  theme: z.string().default('light'),
  notifications: z.boolean().default(true),
  nickname: z.string().optional(),
  deletedAt: z.date().nullable(),
});

type Settings = z.infer<typeof settingsSchema>;
// { theme: string; notifications: boolean; nickname?: string; deletedAt: Date | null }

// Defaults are applied when the value is undefined
settingsSchema.parse({});
// { theme: 'light', notifications: true, nickname: undefined, deletedAt: ... }

// Coercion — useful for parsing form data or query strings
const querySchema = z.object({
  page: z.coerce.number().default(1),
  limit: z.coerce.number().default(10),
  active: z.coerce.boolean().default(true),
});

querySchema.parse({ page: '3', limit: '20', active: 'true' });
// { page: 3, limit: 20, active: true }
```

---

## 8. Transform, Refine, and Pipe

**Transform — change the value after validation:**

- `.transform(fn)` — takes the validated value and returns a new value

**Refine — custom validation logic:**

- `.refine(fn, message)` — returns `true` if valid, `false` if invalid
- `.superRefine(fn)` — advanced custom validation that can add multiple errors

**Pipe — chain schemas together:**

- `.pipe(schema)` — validate, then transform, then validate again

```typescript
import { z } from 'zod';

// Transform
const slugSchema = z.string().transform((val) =>
  val.toLowerCase().replace(/\s+/g, '-')
);
slugSchema.parse('Hello World'); // 'hello-world'

// Refine — custom validation
const passwordSchema = z.string()
  .min(8)
  .refine((val) => /[A-Z]/.test(val), 'Must contain an uppercase letter')
  .refine((val) => /[0-9]/.test(val), 'Must contain a number');

// SuperRefine — password confirmation with path-specific errors
const signupSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string(),
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    });
  }
});

// Pipe — coerce string to number then validate
const stringToPositiveNumber = z.coerce.number().pipe(z.number().positive());
stringToPositiveNumber.parse('42');  // 42
stringToPositiveNumber.parse('-5');  // throws ZodError
```

---

## 9. Custom Error Messages

- Pass inline messages directly on validators: `z.string().min(3, 'Too short')`
- Use `required_error` for missing fields: `z.string({ required_error: 'Name is required' })`
- Access errors from `safeParse`: `result.error.issues`
- Format errors with `result.error.flatten()` — returns `{ fieldErrors, formErrors }`
- Format errors with `result.error.format()` — returns a nested object matching the schema shape

```typescript
import { z } from 'zod';

const schema = z.object({
  name: z.string({ required_error: 'Name is required' }).min(2, 'Name too short'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be at least 18'),
});

const result = schema.safeParse({ name: '', email: 'bad', age: 15 });

if (!result.success) {
  // flatten() is ideal for displaying form errors
  const errors = result.error.flatten();
  console.log(errors.fieldErrors);
  // {
  //   name: ['Name too short'],
  //   email: ['Invalid email address'],
  //   age: ['Must be at least 18']
  // }

  // formErrors contains errors not tied to a specific field
  console.log(errors.formErrors);
  // []

  // issues gives you the raw error array
  console.log(result.error.issues);
  // [{ code: 'too_small', path: ['name'], message: 'Name too short', ... }, ...]
}
```

---

## 10. Zod with React Hook Form

- Install dependencies: `npm install react-hook-form @hookform/resolvers zod`
- Use `zodResolver` to connect a Zod schema with React Hook Form.
- Infer the form type directly from the schema — no need to define a separate interface.
- Validation runs automatically on submit and optionally on change/blur.

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  age: z.coerce.number().min(18, 'Must be at least 18'),
});

type FormData = z.infer<typeof formSchema>;

function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data); // fully typed and validated
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} placeholder="Name" />
      {errors.name && <span>{errors.name.message}</span>}

      <input {...register('email')} placeholder="Email" />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register('age')} type="number" placeholder="Age" />
      {errors.age && <span>{errors.age.message}</span>}

      <button type="submit">Sign Up</button>
    </form>
  );
}
```

- The `zodResolver` handles all validation and maps Zod errors to React Hook Form's error format.
- Use `z.coerce.number()` for number inputs since HTML inputs always return strings.

---

## 11. Zod with Next.js Server Actions

- Validate form data on the server to prevent invalid or malicious input.
- Use `safeParse` to handle errors gracefully without throwing.
- Return field errors to the client for display.

```typescript
// app/actions.ts
'use server';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function submitContact(formData: FormData) {
  const result = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message'),
  });

  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  }

  // result.data is fully typed and validated
  await saveToDatabase(result.data);
  return { success: true };
}
```

**Using the server action in a client component:**

```typescript
// app/contact/page.tsx
'use client';
import { useActionState } from 'react';
import { submitContact } from './actions';

export default function ContactPage() {
  const [state, formAction, isPending] = useActionState(submitContact, null);

  return (
    <form action={formAction}>
      <input name="name" placeholder="Name" />
      {state?.errors?.name && <span>{state.errors.name[0]}</span>}

      <input name="email" placeholder="Email" />
      {state?.errors?.email && <span>{state.errors.email[0]}</span>}

      <textarea name="message" placeholder="Message" />
      {state?.errors?.message && <span>{state.errors.message[0]}</span>}

      <button type="submit" disabled={isPending}>
        {isPending ? 'Sending...' : 'Send'}
      </button>

      {state?.success && <p>Message sent successfully!</p>}
    </form>
  );
}
```

---

## 12. Zod with API Response Validation

- Validate API responses to ensure they match the expected shape.
- Catch breaking API changes early instead of getting mysterious runtime errors.
- Works with `fetch`, `axios`, React Query, or any HTTP client.

```typescript
import { z } from 'zod';

const userResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.coerce.date(),
});

type UserResponse = z.infer<typeof userResponseSchema>;

// With fetch — throws if the response doesn't match
async function getUser(id: number): Promise<UserResponse> {
  const res = await fetch(`/api/users/${id}`);
  const data = await res.json();
  return userResponseSchema.parse(data);
}

// Safe version — handle errors without throwing
async function getUserSafe(id: number) {
  const res = await fetch(`/api/users/${id}`);
  const data = await res.json();
  const result = userResponseSchema.safeParse(data);

  if (!result.success) {
    console.error('API response mismatch:', result.error.issues);
    throw new Error('Invalid API response');
  }

  return result.data;
}

// With React Query — validated automatically
import { useQuery } from '@tanstack/react-query';

function useUser(id: number) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => getUser(id), // automatically validated
  });
}
```

---

## 13. Environment Variable Validation

- Validate environment variables at app startup.
- Crash early with a clear error if required variables are missing or invalid.
- Use `z.coerce` for variables that need type conversion (e.g., `PORT` from string to number).

```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  API_KEY: z.string().min(1),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Validate at startup — crash early if env is wrong
export const env = envSchema.parse(process.env);

// Now use env.DATABASE_URL, env.API_KEY, etc.
// Everything is typed and guaranteed to be valid
```

- This pattern ensures your app fails fast with a clear message if environment variables are misconfigured.
- Place this in a shared module (e.g., `lib/env.ts`) and import it wherever you need environment variables.

---

## 14. Best Practices

- **Use `safeParse` over `parse`** when you want to handle errors gracefully instead of throwing.
- **Use `z.infer` to generate types** — keep the schema as the single source of truth instead of maintaining separate interfaces.
- **Validate at system boundaries** — API responses, form inputs, environment variables, and any external data.
- **Use `z.coerce` for form inputs** — HTML form inputs always come as strings, so coerce them to the right type.
- **Create reusable schemas** for common patterns like email, phone number, or ID fields.
- **Use discriminated unions** instead of plain unions for better error messages.
- **Use `flatten()` for form errors** — it returns a `{ fieldErrors, formErrors }` object that maps cleanly to form UI.
- **Keep schemas close to where they're used** — colocate schemas with their forms, API routes, or server actions.
- **Use `.transform()` to normalize data** — trim whitespace, convert to lowercase, generate slugs.
- **Compose schemas** — use `.extend()`, `.merge()`, `.pick()`, and `.omit()` to build schemas from existing ones instead of duplicating fields.
