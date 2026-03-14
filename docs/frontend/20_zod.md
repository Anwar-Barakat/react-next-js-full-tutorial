# Zod Validation Guide

TypeScript-first schema validation for **runtime** data. Generates TypeScript types via `z.infer` — single source of truth. Zero dependencies, works in Node.js, browsers, and edge runtimes.

```bash
npm install zod
```

---

## Basic Schema Types

Common primitives: `z.string()`, `z.number()`, `z.boolean()`, `z.date()`, `z.literal('value')`, `z.enum(['a', 'b'])`, `z.any()`, `z.unknown()`

- `parse()` — throws a `ZodError` on failure
- `safeParse()` — returns `{ success, data, error }`, never throws

```typescript
import { z } from 'zod';

const nameSchema = z.string();
nameSchema.parse('Anwar');       // 'Anwar'
nameSchema.parse(123);           // throws ZodError

const result = nameSchema.safeParse(123);
if (!result.success) console.log(result.error);
```

---

## String and Number Validations

**Strings:** `.min()`, `.max()`, `.email()`, `.url()`, `.uuid()`, `.regex()`, `.trim()`, `.toLowerCase()`, `.datetime()`

**Numbers:** `.min()`, `.max()`, `.positive()`, `.negative()`, `.int()`, `.finite()`, `.multipleOf()`

**Coercion** — useful for HTML form inputs (always strings):

```typescript
const formSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().trim().toLowerCase().email('Invalid email'),
  age: z.coerce.number().min(18, 'Must be at least 18'),
  price: z.number().positive().multipleOf(0.01),
});
```

---

## Object Schemas

- `z.object({})` — define shape; strips unknown keys by default
- `.strict()` — reject unknown keys; `.passthrough()` — preserve them
- `.partial()` / `.required()` — toggle field optionality
- `.pick()` / `.omit()` — select or exclude fields
- `.extend()` / `.merge()` — compose schemas
- `z.infer<typeof schema>` — derive TypeScript type

```typescript
const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(['admin', 'user']),
});

type User = z.infer<typeof userSchema>;

const updateSchema = userSchema.partial();
const loginSchema  = userSchema.pick({ email: true });
const adminSchema  = userSchema.extend({ permissions: z.array(z.string()) });
```

---

## Arrays, Tuples, Unions, and Records

```typescript
const tagsSchema  = z.array(z.string()).min(1).max(10);
const coordSchema = z.tuple([z.number(), z.number()]);
const idOrSlug    = z.union([z.number(), z.string()]);
const scoreMap    = z.record(z.string(), z.number());

// Discriminated union — clearer errors than z.union
const eventSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('click'),    x: z.number(), y: z.number() }),
  z.object({ type: z.literal('keypress'), key: z.string() }),
]);
```

---

## Optional, Nullable, Default, and Coercion

- `.optional()` — allows `undefined`; `.nullable()` — allows `null`; `.nullish()` — allows both
- `.default(value)` — used when value is `undefined`
- `z.coerce.*` — converts before validating

```typescript
const querySchema = z.object({
  page:      z.coerce.number().default(1),
  limit:     z.coerce.number().default(10),
  active:    z.coerce.boolean().default(true),
  tag:       z.string().optional(),
  deletedAt: z.date().nullable(),
});
```

---

## Transform, Refine, and Pipe

```typescript
// Transform — change value after validation
const slugSchema = z.string().transform(v => v.toLowerCase().replace(/\s+/g, '-'));
slugSchema.parse('Hello World'); // 'hello-world'

// Refine — custom validation
const passwordSchema = z.string().min(8)
  .refine(v => /[A-Z]/.test(v), 'Must contain uppercase')
  .refine(v => /[0-9]/.test(v), 'Must contain a number');

// SuperRefine — cross-field validation with path-specific errors
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
```

---

## Custom Error Messages

- Inline: `z.string().min(3, 'Too short')`
- Missing field: `z.string({ required_error: 'Name is required' })`
- `result.error.flatten()` — returns `{ fieldErrors, formErrors }` (best for form UIs)

```typescript
const result = schema.safeParse({ name: '', email: 'bad', age: 15 });
if (!result.success) {
  console.log(result.error.flatten().fieldErrors);
  // { name: ['Name too short'], email: ['Invalid email address'], age: ['Must be at least 18'] }
}
```

---

## Zod with React Hook Form

```bash
npm install react-hook-form @hookform/resolvers zod
```

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  name:  z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  age:   z.coerce.number().min(18, 'Must be at least 18'),
});
type FormData = z.infer<typeof formSchema>;

function SignupForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <input {...register('name')} placeholder="Name" />
      {errors.name && <span>{errors.name.message}</span>}

      <input {...register('email')} placeholder="Email" />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register('age')} type="number" />
      {errors.age && <span>{errors.age.message}</span>}

      <button type="submit">Sign Up</button>
    </form>
  );
}
```

Use `z.coerce.number()` for number inputs — HTML inputs always return strings.

---

## Zod with Next.js Server Actions

```typescript
// app/actions.ts
'use server';
import { z } from 'zod';

const contactSchema = z.object({
  name:    z.string().min(2),
  email:   z.string().email(),
  message: z.string().min(10),
});

export async function submitContact(formData: FormData) {
  const result = contactSchema.safeParse({
    name:    formData.get('name'),
    email:   formData.get('email'),
    message: formData.get('message'),
  });
  if (!result.success) return { errors: result.error.flatten().fieldErrors };
  await saveToDatabase(result.data);
  return { success: true };
}
```

---

## API Response Validation

```typescript
const userSchema = z.object({
  id:        z.number(),
  name:      z.string(),
  email:     z.string().email(),
  createdAt: z.coerce.date(),
});
type UserResponse = z.infer<typeof userSchema>;

async function getUser(id: number): Promise<UserResponse> {
  const data = await fetch(`/api/users/${id}`).then(r => r.json());
  return userSchema.parse(data); // throws if shape doesn't match
}
```

---

## Environment Variable Validation

```typescript
// lib/env.ts
import { z } from 'zod';

export const env = z.object({
  DATABASE_URL: z.string().url(),
  API_KEY:      z.string().min(1),
  PORT:         z.coerce.number().default(3000),
  NODE_ENV:     z.enum(['development', 'production', 'test']).default('development'),
}).parse(process.env);
```

Validates at startup and crashes early with a clear error if variables are missing or malformed.

---

## Best Practices

- Prefer `safeParse` over `parse` when you need to handle errors gracefully.
- Use `z.infer` to derive types — avoid maintaining separate interfaces.
- Validate at all system boundaries: API responses, form inputs, env vars, external data.
- Use `z.coerce` for HTML form inputs and query string values.
- Use `flatten()` to map errors to form fields.
- Use discriminated unions over plain unions for better error messages.
- Compose schemas with `.extend()`, `.merge()`, `.pick()`, `.omit()` instead of duplicating fields.
