# Prisma ORM Complete Guide

---

## Overview

Prisma is a next-generation ORM for TypeScript and Node.js with:

- Auto-generated TypeScript types from your schema
- Clean, readable query API with full IntelliSense
- Schema-driven migrations with version control
- Support for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB, CockroachDB

**Three core components**: `schema.prisma` defines the data model → `prisma migrate` versions the schema → `PrismaClient` is the auto-generated query builder.

---

## Installation

```bash
npm install -D prisma
npm install @prisma/client
npx prisma init       # creates prisma/schema.prisma and .env
```

Configure your `.env`:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
```

---

## Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique @db.VarChar(255)
  name      String?
  age       Int
  role      Role     @default(USER)
  isActive  Boolean  @default(true)
  posts     Post[]
  profile   Profile?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([role, isActive])
  @@map("users")
}

enum Role {
  USER
  ADMIN
  MODERATOR
}
```

**Scalar types**: `String`, `Boolean`, `Int`, `BigInt`, `Float`, `Decimal`, `DateTime`, `Json`. Append `?` for nullable.

**Field attributes**: `@id`, `@default(value)`, `@unique`, `@updatedAt`, `@map("col_name")`, `@db.VarChar(255)`

**Block attributes**: `@@unique([a, b])`, `@@index([a, b])`, `@@map("table_name")`

---

## Database Relationships

### One-to-One

```prisma
model User {
  id      Int      @id @default(autoincrement())
  profile Profile?
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String
  userId Int    @unique
  user   User   @relation(fields: [userId], references: [id])
}
```

### One-to-Many

```prisma
model User {
  id    Int    @id @default(autoincrement())
  posts Post[]
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  authorId Int
  author   User   @relation(fields: [authorId], references: [id])

  @@index([authorId])
}
```

### Many-to-Many

**Implicit** (Prisma manages the join table):

```prisma
model Post {
  id         Int        @id @default(autoincrement())
  categories Category[]
}

model Category {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[]
}
```

**Explicit** (custom join table with extra fields):

```prisma
model PostCategory {
  postId     Int
  categoryId Int
  assignedAt DateTime @default(now())

  post     Post     @relation(fields: [postId], references: [id])
  category Category @relation(fields: [categoryId], references: [id])

  @@id([postId, categoryId])
}
```

---

## Prisma Client

Generate the client after every schema change:

```bash
npx prisma generate
```

**Singleton pattern** (required in Next.js to avoid multiple connections in dev):

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma || new PrismaClient({ log: ['query', 'error', 'warn'] });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

---

## CRUD Operations

```typescript
// Create
const user = await prisma.user.create({
  data: { email: 'user@example.com', name: 'John Doe' },
});

// Create with nested relations
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    posts: { create: [{ title: 'Post 1', content: 'Content 1' }] },
  },
  include: { posts: true },
});

// Create many
await prisma.user.createMany({
  data: [{ email: 'a@example.com' }, { email: 'b@example.com' }],
  skipDuplicates: true,
});
```

```typescript
// Read — unique lookup
const user = await prisma.user.findUnique({ where: { email: 'user@example.com' } });

// Read many with filter and pagination
const users = await prisma.user.findMany({
  where: { role: 'USER' },
  include: { posts: true },
  orderBy: { createdAt: 'desc' },
  take: 10,
  skip: 0,
});

// Select specific fields (cannot combine with include)
const users = await prisma.user.findMany({
  select: { id: true, email: true, name: true },
});
```

```typescript
// Update
const user = await prisma.user.update({
  where: { id: 1 },
  data: { name: 'Jane Doe' },
});

// Upsert
const user = await prisma.user.upsert({
  where: { email: 'user@example.com' },
  update: { name: 'Updated Name' },
  create: { email: 'user@example.com', name: 'New User' },
});

// Delete
await prisma.user.delete({ where: { id: 1 } });
await prisma.user.deleteMany({ where: { isActive: false } });
```

---

## Querying Data

### Filtering

```typescript
// Comparison
where: { age: { gte: 18, lte: 65 } }

// String
where: { email: { contains: '@example.com', mode: 'insensitive' } }

// Logical
where: {
  AND: [{ isActive: true }, { OR: [{ role: 'ADMIN' }, { age: { gte: 18 } }] }],
}

// Relation filter
where: { posts: { some: { published: true } } }
```

### Sorting and Pagination

```typescript
// Offset pagination
const users = await prisma.user.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
  orderBy: { createdAt: 'desc' },
});
const total = await prisma.user.count();

// Cursor pagination (more efficient for large datasets)
const users = await prisma.user.findMany({
  take: 10,
  skip: 1,
  cursor: { id: lastUserId },
  orderBy: { id: 'asc' },
});
```

### Aggregations

```typescript
const result = await prisma.user.aggregate({
  _count: { id: true },
  _avg: { age: true },
  _min: { age: true },
  _max: { age: true },
  where: { isActive: true },
});

// Group by
const result = await prisma.user.groupBy({
  by: ['role'],
  _count: { id: true },
  having: { age: { _avg: { gte: 30 } } },
});
```

---

## Transactions

```typescript
// Simple (array form)
const [user, post] = await prisma.$transaction([
  prisma.user.create({ data: { email: 'user@example.com', name: 'John' } }),
  prisma.post.create({ data: { title: 'Post', content: 'Content', authorId: 1 } }),
]);

// Interactive (supports conditional rollback)
const result = await prisma.$transaction(async (tx) => {
  const sender = await tx.account.update({
    where: { id: fromId },
    data: { balance: { decrement: amount } },
  });

  if (sender.balance < 0) throw new Error('Insufficient balance'); // triggers rollback

  return tx.account.update({
    where: { id: toId },
    data: { balance: { increment: amount } },
  });
});
```

---

## Migrations

```bash
# Development: create + apply migration and regenerate client
npx prisma migrate dev --name add-user-table

# Production: apply pending migrations
npx prisma migrate deploy

# Check status
npx prisma migrate status

# Reset database (dev only)
npx prisma migrate reset
```

Never manually edit or delete applied migration files. Commit migration files to Git.

---

## Database Seeding

```typescript
// prisma/seed.ts
async function main() {
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: { email: 'admin@example.com', name: 'Admin', role: 'ADMIN' },
  });
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
```

```json
// package.json
{ "prisma": { "seed": "tsx prisma/seed.ts" } }
```

```bash
npx prisma db seed
```

---

## Error Handling

```typescript
import { Prisma } from '@prisma/client';

try {
  return await prisma.user.create({ data: { email, name } });
} catch (error) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') throw new Error(`Email ${email} already exists`);
    if (error.code === 'P2025') throw new Error('Record not found');
  }
  throw error;
}
```

**Common error codes**: `P2002` unique constraint, `P2003` foreign key, `P2025` record not found, `P2000` value too long.

---

## Best Practices and Performance

- Always use `select` to fetch only needed fields — never `findMany()` with no args
- Use `include` (not N+1 loops) to load relations in a single query
- Prefer cursor pagination over offset for large datasets
- Use `createMany` / `updateMany` for bulk operations
- Always use the singleton pattern in Next.js
- Index foreign keys and frequently filtered fields with `@@index`
- Use enums for fixed value sets

**Soft delete pattern:**

```prisma
model User {
  deletedAt DateTime?
  @@index([deletedAt])
}
```

```typescript
await prisma.user.update({ where: { id: 1 }, data: { deletedAt: new Date() } });
const active = await prisma.user.findMany({ where: { deletedAt: null } });
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Type not found" after schema change | `npx prisma generate` |
| Connection pool exhausted | Ensure singleton pattern |
| Slow queries | Enable `log: ['query']`, add indexes |
| Need to inspect data | `npx prisma studio` |
