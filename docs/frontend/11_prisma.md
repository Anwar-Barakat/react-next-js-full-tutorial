# Prisma ORM Complete Guide

Comprehensive guide to using Prisma ORM with TypeScript for database management in modern web applications.

**Last Updated**: 2026-02-12

---

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Prisma Schema](#prisma-schema)
   - [Schema Basics](#schema-basics)
   - [Data Models](#data-models)
   - [Field Types](#field-types)
   - [Attributes](#attributes)
4. [Database Relationships](#database-relationships)
   - [One-to-One](#one-to-one)
   - [One-to-Many](#one-to-many)
   - [Many-to-Many](#many-to-many)
   - [Self-Relations](#self-relations)
5. [Prisma Client](#prisma-client)
   - [Initialization](#initialization)
   - [Usage in Applications](#usage-in-applications)
6. [CRUD Operations](#crud-operations)
   - [Create](#create)
   - [Read](#read)
   - [Update](#update)
   - [Delete](#delete)
7. [Querying Data](#querying-data)
   - [Filtering](#filtering)
   - [Sorting](#sorting)
   - [Pagination](#pagination)
   - [Relations](#relations)
   - [Aggregations](#aggregations)
8. [Transactions](#transactions)
   - [Sequential Operations](#sequential-operations)
   - [Interactive Transactions](#interactive-transactions)
9. [Migrations](#migrations)
   - [Creating Migrations](#creating-migrations)
   - [Running Migrations](#running-migrations)
   - [Migration Best Practices](#migration-best-practices)
10. [Database Seeding](#database-seeding)
11. [ID Generators](#id-generators)
    - [UUID vs CUID](#uuid-vs-cuid)
    - [Auto-increment IDs](#auto-increment-ids)
12. [Error Handling](#error-handling)
13. [Best Practices](#best-practices)
14. [Performance Optimization](#performance-optimization)
15. [Common Patterns](#common-patterns)
16. [Troubleshooting](#troubleshooting)

---

## Overview

### What is Prisma?

**Prisma** is a next-generation ORM (Object-Relational Mapping) that simplifies database workflows in TypeScript and Node.js applications.

**Key Features**:

| Feature | Description |
|---------|-------------|
| **Type Safety** | Auto-generated TypeScript types from your schema |
| **Intuitive API** | Clean, readable database queries |
| **Migrations** | Version control for your database schema |
| **Prisma Studio** | Visual database browser and editor |
| **Multiple Databases** | PostgreSQL, MySQL, SQLite, SQL Server, MongoDB, CockroachDB |
| **Auto-completion** | Full IntelliSense support |
| **Validation** | Runtime and compile-time validation |

### Prisma Components

```
┌──────────────────┐
│  Prisma Schema   │  ← Define your data model
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Prisma Migrate   │  ← Version control for schema
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Prisma Client    │  ← Auto-generated query builder
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Your Database   │  ← PostgreSQL, MySQL, etc.
└──────────────────┘
```

---

## Installation

### Initial Setup

```bash
# Install Prisma CLI as dev dependency
npm install -D prisma

# Install Prisma Client
npm install @prisma/client

# Initialize Prisma (creates prisma/ directory)
npx prisma init
```

**What gets created**:

```
your-project/
├── prisma/
│   └── schema.prisma    # Prisma schema file
└── .env                 # Database connection string
```

### Database Connection

Configure your database connection in `.env`:

```bash
# PostgreSQL
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"

# MySQL
DATABASE_URL="mysql://user:password@localhost:3306/mydb"

# SQLite
DATABASE_URL="file:./dev.db"
```

---

## Prisma Schema

### Schema Basics

The `schema.prisma` file defines your database structure, generators, and data sources.

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"  // or "mysql", "sqlite", etc.
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Components**:

| Component | Purpose | Example |
|-----------|---------|---------|
| `generator` | Specifies what to generate | Prisma Client |
| `datasource` | Database connection | PostgreSQL, MySQL |
| `model` | Database table definition | User, Post, Comment |

### Data Models

Models represent tables in your database:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  age       Int
  isActive  Boolean  @default(true)
  role      Role     @default(USER)
  posts     Post[]
  profile   Profile?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
  @@map("users")  // Custom table name
}

enum Role {
  USER
  ADMIN
  MODERATOR
}
```

### Field Types

**Scalar Types**:

| Prisma Type | PostgreSQL | MySQL | SQLite | TypeScript |
|-------------|------------|-------|--------|------------|
| `String` | `text` | `varchar` | `text` | `string` |
| `Boolean` | `boolean` | `tinyint(1)` | `integer` | `boolean` |
| `Int` | `integer` | `int` | `integer` | `number` |
| `BigInt` | `bigint` | `bigint` | `integer` | `bigint` |
| `Float` | `double` | `double` | `real` | `number` |
| `Decimal` | `decimal` | `decimal` | `decimal` | `Decimal` |
| `DateTime` | `timestamp` | `datetime` | `datetime` | `Date` |
| `Json` | `jsonb` | `json` | `text` | `object` |
| `Bytes` | `bytea` | `blob` | `blob` | `Buffer` |

**Special Types**:

```prisma
model Example {
  id          String   @id @default(cuid())
  uuid        String   @default(uuid())
  optionalStr String?  // Nullable field
  jsonData    Json     // JSON field
  binaryData  Bytes    // Binary data
  enumField   Status   // Enum type
}

enum Status {
  PENDING
  ACTIVE
  INACTIVE
}
```

### Attributes

**Field Attributes**:

| Attribute | Purpose | Example |
|-----------|---------|---------|
| `@id` | Primary key | `id Int @id` |
| `@default()` | Default value | `@default(now())` |
| `@unique` | Unique constraint | `email String @unique` |
| `@updatedAt` | Auto-update timestamp | `updatedAt DateTime @updatedAt` |
| `@map()` | Custom column name | `@map("user_email")` |
| `@db.*` | Database-specific type | `@db.VarChar(255)` |

**Block Attributes**:

```prisma
model User {
  id    Int    @id
  email String
  name  String

  @@unique([email, name])           // Composite unique
  @@index([email])                  // Index
  @@index([name, email])            // Composite index
  @@map("users")                    // Custom table name
  @@ignore                          // Ignore in Prisma Client
}
```

---

## Database Relationships

### One-to-One

One record relates to exactly one record in another table.

```prisma
model User {
  id      Int      @id @default(autoincrement())
  email   String   @unique
  profile Profile?  // ? indicates optional (one-to-one)
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String
  userId Int    @unique  // Foreign key
  user   User   @relation(fields: [userId], references: [id])
}
```

**Usage**:

```typescript
// Create user with profile
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    profile: {
      create: {
        bio: 'Software developer',
      },
    },
  },
  include: {
    profile: true,
  },
});
```

### One-to-Many

One record relates to many records in another table.

```prisma
model User {
  id    Int    @id @default(autoincrement())
  email String @unique
  posts Post[] // One user has many posts
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  content  String
  authorId Int    // Foreign key
  author   User   @relation(fields: [authorId], references: [id])

  @@index([authorId])
}
```

**Usage**:

```typescript
// Create user with multiple posts
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    posts: {
      create: [
        { title: 'First Post', content: 'Content 1' },
        { title: 'Second Post', content: 'Content 2' },
      ],
    },
  },
  include: {
    posts: true,
  },
});
```

### Many-to-Many

**Explicit Many-to-Many** (with join table):

```prisma
model Post {
  id         Int            @id @default(autoincrement())
  title      String
  categories PostCategory[]
}

model Category {
  id    Int            @id @default(autoincrement())
  name  String         @unique
  posts PostCategory[]
}

// Junction/Join table
model PostCategory {
  postId     Int
  categoryId Int
  assignedAt DateTime @default(now())

  post     Post     @relation(fields: [postId], references: [id])
  category Category @relation(fields: [categoryId], references: [id])

  @@id([postId, categoryId])  // Composite primary key
}
```

**Implicit Many-to-Many** (Prisma manages join table):

```prisma
model Post {
  id         Int        @id @default(autoincrement())
  title      String
  categories Category[]
}

model Category {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[]
}
```

**Usage**:

```typescript
// Create post with categories
const post = await prisma.post.create({
  data: {
    title: 'My Post',
    categories: {
      connect: [{ id: 1 }, { id: 2 }],  // Connect existing
      create: [{ name: 'New Category' }], // Create new
    },
  },
  include: {
    categories: true,
  },
});
```

### Self-Relations

A model relates to itself:

```prisma
model User {
  id         Int    @id @default(autoincrement())
  name       String
  followedBy User[] @relation("UserFollows")
  following  User[] @relation("UserFollows")
}
```

**Usage**:

```typescript
// User follows another user
await prisma.user.update({
  where: { id: 1 },
  data: {
    following: {
      connect: { id: 2 },
    },
  },
});
```

**Relationship Comparison**:

| Relationship | Relation Field | Foreign Key | Example |
|--------------|----------------|-------------|---------|
| **One-to-One** | Optional (`?`) | `@unique` on FK | User ↔ Profile |
| **One-to-Many** | Array (`[]`) | Regular FK | User → Posts |
| **Many-to-Many** | Array on both | Join table | Posts ↔ Categories |

---

## Prisma Client

### Initialization

**Generate Prisma Client**:

```bash
npx prisma generate
```

This reads your schema and generates the Prisma Client with TypeScript types.

### Usage in Applications

**Singleton Pattern** (Recommended):

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

**Usage in Files**:

```typescript
import { prisma } from '@/lib/prisma';

export async function getUsers() {
  const users = await prisma.user.findMany();
  return users;
}
```

**Configuration Options**:

| Option | Purpose | Example |
|--------|---------|---------|
| `log` | Logging level | `['query', 'error']` |
| `errorFormat` | Error formatting | `'pretty'`, `'minimal'` |
| `datasources` | Override connection | `{ db: { url: newUrl } }` |

---

## CRUD Operations

### Create

**Create Single Record**:

```typescript
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
    age: 30,
  },
});
```

**Create with Relations**:

```typescript
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
    posts: {
      create: [
        { title: 'Post 1', content: 'Content 1' },
        { title: 'Post 2', content: 'Content 2' },
      ],
    },
    profile: {
      create: {
        bio: 'Software developer',
      },
    },
  },
  include: {
    posts: true,
    profile: true,
  },
});
```

**Create Many**:

```typescript
const result = await prisma.user.createMany({
  data: [
    { email: 'user1@example.com', name: 'User 1' },
    { email: 'user2@example.com', name: 'User 2' },
    { email: 'user3@example.com', name: 'User 3' },
  ],
  skipDuplicates: true,  // Skip if email exists
});

console.log(`Created ${result.count} users`);
```

### Read

**Find Unique**:

```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  // or
  where: { email: 'user@example.com' },
});
```

**Find First**:

```typescript
const user = await prisma.user.findFirst({
  where: {
    role: 'ADMIN',
  },
  orderBy: {
    createdAt: 'desc',
  },
});
```

**Find Many**:

```typescript
const users = await prisma.user.findMany({
  where: {
    role: 'USER',
  },
  include: {
    posts: true,
  },
  orderBy: {
    createdAt: 'desc',
  },
  take: 10,  // Limit
  skip: 0,   // Offset
});
```

**Select Specific Fields**:

```typescript
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    name: true,
    // posts field not included
  },
});
```

**Include vs Select Comparison**:

| Method | Purpose | Returns |
|--------|---------|---------|
| ✅ **include** | Add related data | All fields + relations |
| ✅ **select** | Pick specific fields | Only selected fields |
| ❌ **Both** | Cannot use together | Error |

```typescript
// ✅ Correct - Use include
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: true,
  },
});

// ✅ Correct - Use select
const user = await prisma.user.findUnique({
  where: { id: 1 },
  select: {
    id: true,
    email: true,
    posts: {
      select: {
        id: true,
        title: true,
      },
    },
  },
});

// ❌ Wrong - Cannot use both
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: { posts: true },
  select: { email: true },  // Error!
});
```

### Update

**Update Single Record**:

```typescript
const user = await prisma.user.update({
  where: { id: 1 },
  data: {
    name: 'Jane Doe',
    age: 31,
  },
});
```

**Update with Relations**:

```typescript
const user = await prisma.user.update({
  where: { id: 1 },
  data: {
    name: 'Jane Doe',
    posts: {
      create: { title: 'New Post', content: 'Content' },
      update: {
        where: { id: 5 },
        data: { title: 'Updated Title' },
      },
      delete: { id: 10 },
    },
  },
});
```

**Update Many**:

```typescript
const result = await prisma.user.updateMany({
  where: {
    role: 'USER',
  },
  data: {
    isActive: true,
  },
});

console.log(`Updated ${result.count} users`);
```

**Upsert** (Update or Insert):

```typescript
const user = await prisma.user.upsert({
  where: { email: 'user@example.com' },
  update: {
    name: 'Updated Name',
  },
  create: {
    email: 'user@example.com',
    name: 'New User',
  },
});
```

### Delete

**Delete Single Record**:

```typescript
const user = await prisma.user.delete({
  where: { id: 1 },
});
```

**Delete Many**:

```typescript
const result = await prisma.user.deleteMany({
  where: {
    isActive: false,
  },
});

console.log(`Deleted ${result.count} users`);
```

**Delete with Cascade**:

```prisma
// Define cascade in schema
model User {
  id    Int    @id
  posts Post[]
}

model Post {
  id       Int  @id
  authorId Int
  author   User @relation(fields: [authorId], references: [id], onDelete: Cascade)
}
```

**CRUD Operation Summary**:

| Operation | Single | Multiple | Returns Count |
|-----------|--------|----------|---------------|
| **Create** | `create()` | `createMany()` | ✅ (Many) |
| **Read** | `findUnique()`, `findFirst()` | `findMany()` | ❌ |
| **Update** | `update()`, `upsert()` | `updateMany()` | ✅ (Many) |
| **Delete** | `delete()` | `deleteMany()` | ✅ (Many) |

---

## Querying Data

### Filtering

**Basic Filters**:

```typescript
// Equals
const users = await prisma.user.findMany({
  where: {
    role: 'ADMIN',
  },
});

// Not equals
const users = await prisma.user.findMany({
  where: {
    role: { not: 'ADMIN' },
  },
});

// In array
const users = await prisma.user.findMany({
  where: {
    role: { in: ['ADMIN', 'MODERATOR'] },
  },
});

// Not in array
const users = await prisma.user.findMany({
  where: {
    role: { notIn: ['ADMIN', 'MODERATOR'] },
  },
});
```

**Comparison Filters**:

```typescript
// Greater than
const users = await prisma.user.findMany({
  where: {
    age: { gt: 18 },
  },
});

// Greater than or equal
const users = await prisma.user.findMany({
  where: {
    age: { gte: 18 },
  },
});

// Less than
const users = await prisma.user.findMany({
  where: {
    age: { lt: 65 },
  },
});

// Less than or equal
const users = await prisma.user.findMany({
  where: {
    age: { lte: 65 },
  },
});

// Between (combine)
const users = await prisma.user.findMany({
  where: {
    age: {
      gte: 18,
      lte: 65,
    },
  },
});
```

**String Filters**:

```typescript
// Contains
const users = await prisma.user.findMany({
  where: {
    email: { contains: '@example.com' },
  },
});

// Starts with
const users = await prisma.user.findMany({
  where: {
    name: { startsWith: 'John' },
  },
});

// Ends with
const users = await prisma.user.findMany({
  where: {
    name: { endsWith: 'Doe' },
  },
});

// Case insensitive (PostgreSQL, MongoDB)
const users = await prisma.user.findMany({
  where: {
    email: { contains: 'example', mode: 'insensitive' },
  },
});
```

**Logical Operators**:

```typescript
// AND
const users = await prisma.user.findMany({
  where: {
    AND: [
      { role: 'USER' },
      { isActive: true },
      { age: { gte: 18 } },
    ],
  },
});

// OR
const users = await prisma.user.findMany({
  where: {
    OR: [
      { role: 'ADMIN' },
      { role: 'MODERATOR' },
    ],
  },
});

// NOT
const users = await prisma.user.findMany({
  where: {
    NOT: {
      role: 'ADMIN',
    },
  },
});

// Complex combination
const users = await prisma.user.findMany({
  where: {
    AND: [
      { isActive: true },
      {
        OR: [
          { role: 'ADMIN' },
          { age: { gte: 18 } },
        ],
      },
    ],
  },
});
```

**Relation Filters**:

```typescript
// Find users with at least one post
const users = await prisma.user.findMany({
  where: {
    posts: {
      some: {
        published: true,
      },
    },
  },
});

// Find users where every post is published
const users = await prisma.user.findMany({
  where: {
    posts: {
      every: {
        published: true,
      },
    },
  },
});

// Find users with no posts
const users = await prisma.user.findMany({
  where: {
    posts: {
      none: {},
    },
  },
});
```

**Filter Comparison**:

| Filter | Operator | Example | Use Case |
|--------|----------|---------|----------|
| `equals` | `=` | `{ role: 'ADMIN' }` | Exact match |
| `not` | `!=` | `{ not: 'ADMIN' }` | Not equal |
| `in` | `IN` | `{ in: ['ADMIN', 'USER'] }` | Match any value |
| `gt`, `gte` | `>`, `>=` | `{ gte: 18 }` | Numeric comparison |
| `lt`, `lte` | `<`, `<=` | `{ lte: 65 }` | Numeric comparison |
| `contains` | `LIKE` | `{ contains: 'example' }` | Substring search |
| `startsWith` | `LIKE` | `{ startsWith: 'John' }` | Prefix search |
| `endsWith` | `LIKE` | `{ endsWith: 'Doe' }` | Suffix search |

### Sorting

**Single Field**:

```typescript
// Ascending
const users = await prisma.user.findMany({
  orderBy: {
    name: 'asc',
  },
});

// Descending
const users = await prisma.user.findMany({
  orderBy: {
    createdAt: 'desc',
  },
});
```

**Multiple Fields**:

```typescript
const users = await prisma.user.findMany({
  orderBy: [
    { role: 'asc' },
    { name: 'asc' },
  ],
});
```

**Sort by Relations**:

```typescript
// Sort by relation count
const users = await prisma.user.findMany({
  orderBy: {
    posts: {
      _count: 'desc',
    },
  },
});

// Sort by related field
const posts = await prisma.post.findMany({
  orderBy: {
    author: {
      name: 'asc',
    },
  },
});
```

### Pagination

**Offset-based Pagination**:

```typescript
const page = 2;
const pageSize = 10;

const users = await prisma.user.findMany({
  skip: (page - 1) * pageSize,
  take: pageSize,
  orderBy: { createdAt: 'desc' },
});

// Get total count
const total = await prisma.user.count();
const totalPages = Math.ceil(total / pageSize);
```

**Cursor-based Pagination** (more efficient):

```typescript
const users = await prisma.user.findMany({
  take: 10,
  skip: 1,  // Skip the cursor
  cursor: {
    id: lastUserId,  // ID from previous page
  },
  orderBy: { id: 'asc' },
});
```

**Pagination Pattern Comparison**:

| Pattern | Pros | Cons | Best For |
|---------|------|------|----------|
| **Offset** | Simple, jump to any page | Slow on large datasets | Small datasets, page numbers |
| **Cursor** | Fast, consistent | Can't jump to arbitrary page | Large datasets, infinite scroll |

### Relations

**Include Relations**:

```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: true,
    profile: true,
  },
});
```

**Nested Includes**:

```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      include: {
        comments: {
          include: {
            author: true,
          },
        },
      },
    },
  },
});
```

**Filter Related Data**:

```typescript
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      where: {
        published: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
    },
  },
});
```

### Aggregations

**Count**:

```typescript
// Count all records
const count = await prisma.user.count();

// Count with filter
const count = await prisma.user.count({
  where: {
    role: 'ADMIN',
  },
});
```

**Aggregate Operations**:

```typescript
const result = await prisma.user.aggregate({
  _count: {
    id: true,
  },
  _avg: {
    age: true,
  },
  _sum: {
    age: true,
  },
  _min: {
    age: true,
  },
  _max: {
    age: true,
  },
  where: {
    isActive: true,
  },
});

console.log(result);
// {
//   _count: { id: 100 },
//   _avg: { age: 32.5 },
//   _sum: { age: 3250 },
//   _min: { age: 18 },
//   _max: { age: 65 }
// }
```

**Group By**:

```typescript
const result = await prisma.user.groupBy({
  by: ['role'],
  _count: {
    id: true,
  },
  _avg: {
    age: true,
  },
  having: {
    age: {
      _avg: {
        gte: 30,
      },
    },
  },
});

// [
//   { role: 'ADMIN', _count: { id: 5 }, _avg: { age: 35 } },
//   { role: 'USER', _count: { id: 95 }, _avg: { age: 32 } }
// ]
```

**Aggregation Functions**:

| Function | Purpose | Example |
|----------|---------|---------|
| `_count` | Count records | `_count: { id: true }` |
| `_avg` | Average value | `_avg: { age: true }` |
| `_sum` | Sum values | `_sum: { price: true }` |
| `_min` | Minimum value | `_min: { age: true }` |
| `_max` | Maximum value | `_max: { age: true }` |

---

## Transactions

### Sequential Operations

**Simple Transaction** (all succeed or all fail):

```typescript
const [user, post] = await prisma.$transaction([
  prisma.user.create({
    data: {
      email: 'user@example.com',
      name: 'John Doe',
    },
  }),
  prisma.post.create({
    data: {
      title: 'My First Post',
      content: 'Hello world',
      authorId: 1,
    },
  }),
]);
```

### Interactive Transactions

More control with rollback capability:

```typescript
const result = await prisma.$transaction(async (tx) => {
  // Create user
  const user = await tx.user.create({
    data: {
      email: 'user@example.com',
      name: 'John Doe',
    },
  });

  // Create posts for user
  const posts = await tx.post.createMany({
    data: [
      { title: 'Post 1', content: 'Content 1', authorId: user.id },
      { title: 'Post 2', content: 'Content 2', authorId: user.id },
    ],
  });

  // Check condition
  if (posts.count < 2) {
    throw new Error('Failed to create all posts');  // Rollback
  }

  return { user, posts };
});
```

**Transfer Money Example**:

```typescript
async function transferMoney(fromId: number, toId: number, amount: number) {
  return await prisma.$transaction(async (tx) => {
    // Deduct from sender
    const sender = await tx.account.update({
      where: { id: fromId },
      data: {
        balance: {
          decrement: amount,
        },
      },
    });

    // Check sufficient balance
    if (sender.balance < 0) {
      throw new Error('Insufficient balance');
    }

    // Add to receiver
    const receiver = await tx.account.update({
      where: { id: toId },
      data: {
        balance: {
          increment: amount,
        },
      },
    });

    return { sender, receiver };
  });
}
```

**Transaction Options**:

```typescript
await prisma.$transaction(
  async (tx) => {
    // Transaction operations
  },
  {
    maxWait: 5000,      // Max wait to acquire a connection (ms)
    timeout: 10000,     // Max time transaction can run (ms)
    isolationLevel: 'Serializable',  // Transaction isolation level
  }
);
```

**Transaction Comparison**:

| Type | Use Case | Pros | Cons |
|------|----------|------|------|
| **Sequential** | Simple operations | Easy, automatic | Limited control |
| **Interactive** | Complex logic, conditionals | Full control, rollback | More complex |

---

## Migrations

### Creating Migrations

**Development Workflow**:

```bash
# Create and apply migration
npx prisma migrate dev --name add-user-table

# This will:
# 1. Create SQL migration file
# 2. Apply migration to database
# 3. Generate Prisma Client
```

**Migration Files**:

```
prisma/migrations/
├── 20260212_000000_init/
│   └── migration.sql
├── 20260212_120000_add_user_table/
│   └── migration.sql
└── migration_lock.toml
```

**Example Migration SQL**:

```sql
-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
```

### Running Migrations

**Production Deployment**:

```bash
# Apply migrations (no prompts)
npx prisma migrate deploy

# Check migration status
npx prisma migrate status
```

**Reset Database** (Development only):

```bash
# ⚠️ WARNING: Deletes all data and re-runs all migrations
npx prisma migrate reset
```

### Migration Best Practices

**Best Practices**:

| Practice | Description |
|----------|-------------|
| ✅ **Version Control** | Commit migration files to Git |
| ✅ **Descriptive Names** | Use clear migration names: `add_user_email_index` |
| ✅ **Review SQL** | Always review generated SQL before applying |
| ✅ **Backup Production** | Backup database before running migrations |
| ✅ **Test Migrations** | Test on staging before production |
| ❌ **Manual Edits** | Don't manually edit applied migrations |
| ❌ **Delete Migrations** | Don't delete migration files after applying |

**Migration Commands Summary**:

| Command | Environment | Purpose |
|---------|-------------|---------|
| `migrate dev` | Development | Create and apply migration |
| `migrate deploy` | Production | Apply pending migrations |
| `migrate reset` | Development | Reset DB and replay migrations |
| `migrate status` | Any | Check migration status |
| `migrate resolve` | Any | Mark migration as applied/rolled back |

---

## Database Seeding

Create initial data for development/testing.

**Create Seed File** (`prisma/seed.ts`):

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Delete existing data
  await prisma.user.deleteMany();
  await prisma.post.deleteMany();

  // Create users
  const user1 = await prisma.user.create({
    data: {
      email: 'john@example.com',
      name: 'John Doe',
      posts: {
        create: [
          {
            title: 'First Post',
            content: 'This is my first post',
            published: true,
          },
          {
            title: 'Second Post',
            content: 'This is my second post',
            published: false,
          },
        ],
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      name: 'Jane Smith',
      posts: {
        create: [
          {
            title: 'Hello World',
            content: 'My first blog post',
            published: true,
          },
        ],
      },
    },
  });

  console.log({ user1, user2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Configure in package.json**:

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

**Run Seed**:

```bash
npx prisma db seed
```

**Seeding Patterns**:

```typescript
// ✅ Good - Idempotent seed (can run multiple times)
await prisma.user.upsert({
  where: { email: 'admin@example.com' },
  update: {},
  create: {
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'ADMIN',
  },
});

// ✅ Good - Use faker for realistic data
import { faker } from '@faker-js/faker';

const users = Array.from({ length: 100 }, () => ({
  email: faker.internet.email(),
  name: faker.person.fullName(),
  age: faker.number.int({ min: 18, max: 80 }),
}));

await prisma.user.createMany({
  data: users,
  skipDuplicates: true,
});
```

---

## ID Generators

### UUID vs CUID

**UUID (Universally Unique Identifier)**:

```prisma
model User {
  id    String @id @default(uuid())
  email String @unique
}
```

**Characteristics**:

| Aspect | Details |
|--------|---------|
| **Format** | Standard 128-bit identifier |
| **Example** | `550e8400-e29b-41d4-a716-446655440000` |
| **Database Type** | Native type in PostgreSQL (`uuid`) |
| **Generation** | Uses `gen_random_uuid()` |
| **Sortable** | No (unless using UUIDv7) |
| **Use Case** | Distributed systems, global uniqueness |

**CUID (Collision-resistant Unique ID)**:

```prisma
model User {
  id    String @id @default(cuid())
  email String @unique
}
```

**Characteristics**:

| Aspect | Details |
|--------|---------|
| **Format** | Custom format, starts with timestamp |
| **Example** | `clh3qo9w80000356m2r4g7b9e` |
| **Database Type** | Stored as `text` or `varchar` |
| **Generation** | Generated by Prisma Client |
| **Sortable** | Yes (sortable by creation time) |
| **Use Case** | APIs, URLs, human-readable IDs |

**Comparison**:

| Feature | UUID | CUID |
|---------|------|------|
| **Standard** | ✅ Industry standard | ❌ Custom format |
| **Database Support** | ✅ Native type | ❌ Stored as text |
| **Sortable** | ❌ Random | ✅ Timestamp-based |
| **URL-friendly** | ⚠️ Contains hyphens | ✅ More readable |
| **Performance** | ✅ Slightly faster | ✅ Good |
| **Size** | 36 characters (with hyphens) | 25 characters |

**When to use**:

```typescript
// ✅ Use UUID when:
// - Need industry standard
// - Working with distributed systems
// - Database has native UUID support
model User {
  id String @id @default(uuid())
}

// ✅ Use CUID when:
// - Want sortable IDs
// - Need URL-friendly IDs
// - Want more human-readable format
model Post {
  id String @id @default(cuid())
}

// ✅ Use Auto-increment when:
// - Small application
// - Single database server
// - Need sequential IDs
model Product {
  id Int @id @default(autoincrement())
}
```

### Auto-increment IDs

**Integer Auto-increment**:

```prisma
model User {
  id Int @id @default(autoincrement())
}
```

**BigInt Auto-increment**:

```prisma
model User {
  id BigInt @id @default(autoincrement())
}
```

**ID Type Comparison**:

| Type | Size | Example | Pros | Cons |
|------|------|---------|------|------|
| `Int` | 4 bytes | `1`, `2`, `3` | Simple, fast | Max ~2 billion |
| `BigInt` | 8 bytes | `1n`, `2n` | Larger range | Slightly slower |
| `String (UUID)` | 36 chars | `550e8400-...` | Globally unique | Larger storage |
| `String (CUID)` | 25 chars | `clh3qo9w8...` | Sortable, unique | Not standard |

---

## Error Handling

### Common Errors

**Unique Constraint Violation**:

```typescript
try {
  const user = await prisma.user.create({
    data: {
      email: 'existing@example.com',
    },
  });
} catch (error) {
  if (error.code === 'P2002') {
    console.error('Email already exists');
  }
}
```

**Record Not Found**:

```typescript
try {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: 999 },
  });
} catch (error) {
  if (error.code === 'P2025') {
    console.error('User not found');
  }
}
```

**Foreign Key Constraint**:

```typescript
try {
  const post = await prisma.post.create({
    data: {
      title: 'Post',
      content: 'Content',
      authorId: 999,  // Non-existent user
    },
  });
} catch (error) {
  if (error.code === 'P2003') {
    console.error('Referenced user does not exist');
  }
}
```

### Error Codes

| Code | Error | Description |
|------|-------|-------------|
| `P2000` | Value too long | Value exceeds column length |
| `P2001` | Record not found | Record searched for does not exist |
| `P2002` | Unique constraint | Unique constraint violation |
| `P2003` | Foreign key constraint | Foreign key constraint failed |
| `P2025` | Record not found | Record to update/delete not found |

### Error Handling Pattern

```typescript
import { Prisma } from '@prisma/client';

async function createUser(email: string, name: string) {
  try {
    return await prisma.user.create({
      data: { email, name },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Unique constraint violation
      if (error.code === 'P2002') {
        throw new Error(`Email ${email} already exists`);
      }
    }

    if (error instanceof Prisma.PrismaClientValidationError) {
      throw new Error('Invalid data provided');
    }

    // Unknown error
    throw error;
  }
}
```

---

## Best Practices

### Schema Design

**Best Practices**:

| Practice | Example |
|----------|---------|
| ✅ **Use meaningful names** | `User`, `Post`, `Comment` (not `tbl_usr`) |
| ✅ **Consistent naming** | PascalCase for models, camelCase for fields |
| ✅ **Add timestamps** | `createdAt`, `updatedAt` |
| ✅ **Add indexes** | Index foreign keys and frequently queried fields |
| ✅ **Use enums** | For fixed value sets (role, status) |
| ✅ **Validate at schema** | Use `@db` attributes for length, precision |
| ❌ **Avoid generic names** | Don't use `data`, `info`, `value` |

```prisma
// ✅ Good schema design
model User {
  id        String   @id @default(cuid())
  email     String   @unique @db.VarChar(255)
  name      String   @db.VarChar(100)
  role      Role     @default(USER)
  isActive  Boolean  @default(true)
  posts     Post[]
  profile   Profile?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([email])
  @@index([role, isActive])
  @@map("users")
}

enum Role {
  USER
  ADMIN
  MODERATOR
}

// ❌ Bad schema design
model usr {
  id   Int    @id
  data String
  val  String
}
```

### Query Optimization

**Select Only What You Need**:

```typescript
// ❌ Wrong - Fetches all fields
const users = await prisma.user.findMany();

// ✅ Correct - Select specific fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    email: true,
    name: true,
  },
});
```

**Avoid N+1 Queries**:

```typescript
// ❌ Wrong - N+1 query problem
const users = await prisma.user.findMany();
for (const user of users) {
  const posts = await prisma.post.findMany({
    where: { authorId: user.id },
  });
}

// ✅ Correct - Single query with include
const users = await prisma.user.findMany({
  include: {
    posts: true,
  },
});
```

**Use Pagination**:

```typescript
// ❌ Wrong - Loads all records
const users = await prisma.user.findMany();

// ✅ Correct - Paginate results
const users = await prisma.user.findMany({
  take: 20,
  skip: 0,
});
```

### Connection Management

**Use Singleton Pattern**:

```typescript
// ✅ Correct - Singleton instance
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// ❌ Wrong - New instance per file
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();  // Don't do this in multiple files
```

**Disconnect When Done**:

```typescript
async function main() {
  try {
    const users = await prisma.user.findMany();
    return users;
  } finally {
    await prisma.$disconnect();
  }
}
```

---

## Performance Optimization

### Indexing

**Add Indexes for Frequently Queried Fields**:

```prisma
model User {
  id    Int    @id
  email String @unique  // Automatically indexed

  @@index([email])              // Single field index
  @@index([name, email])        // Composite index
  @@index([role, isActive])     // Composite index for common query
}
```

**Index Usage**:

```typescript
// ✅ Uses index on email
const users = await prisma.user.findMany({
  where: { email: { contains: '@example.com' } },
});

// ✅ Uses composite index on [role, isActive]
const users = await prisma.user.findMany({
  where: {
    role: 'USER',
    isActive: true,
  },
});
```

### Connection Pooling

```typescript
// Configure connection pool
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  connectionPool: {
    poolSize: 10,  // Number of connections
  },
});
```

### Query Optimization Tips

| Tip | Description | Example |
|-----|-------------|---------|
| **Select specific fields** | Don't fetch unnecessary data | `select: { id: true, name: true }` |
| **Use indexes** | Speed up WHERE clauses | `@@index([email])` |
| **Batch operations** | Use `createMany`, `updateMany` | `createMany({ data: [...] })` |
| **Cursor pagination** | Faster than offset for large datasets | `cursor: { id: lastId }` |
| **Avoid deep nesting** | Limit relation depth | Max 3-4 levels |
| **Use raw queries** | For complex queries | `prisma.$queryRaw` |

---

## Common Patterns

### Soft Delete

```prisma
model User {
  id        Int       @id
  email     String
  deletedAt DateTime?  // Null = not deleted

  @@index([deletedAt])
}
```

```typescript
// Soft delete
await prisma.user.update({
  where: { id: 1 },
  data: { deletedAt: new Date() },
});

// Query non-deleted
const users = await prisma.user.findMany({
  where: { deletedAt: null },
});

// Restore
await prisma.user.update({
  where: { id: 1 },
  data: { deletedAt: null },
});
```

### Audit Trail

```prisma
model User {
  id        Int      @id
  email     String
  createdAt DateTime @default(now())
  createdBy Int?
  updatedAt DateTime @updatedAt
  updatedBy Int?

  creator User? @relation("CreatedBy", fields: [createdBy], references: [id])
  updater User? @relation("UpdatedBy", fields: [updatedBy], references: [id])
}
```

### Full-text Search (PostgreSQL)

```prisma
model Post {
  id      Int    @id
  title   String
  content String

  @@index([title], type: FullText)
  @@index([content], type: FullText)
}
```

```typescript
// Full-text search
const posts = await prisma.post.findMany({
  where: {
    title: {
      search: 'Prisma ORM',
    },
  },
});
```

---

## Troubleshooting

### Common Issues

**Issue 1: "Type not found" after schema changes**

```bash
# Solution: Regenerate Prisma Client
npx prisma generate
```

**Issue 2: Migration conflicts**

```bash
# Check migration status
npx prisma migrate status

# Mark migration as applied
npx prisma migrate resolve --applied "20260212_000000_migration_name"

# Or reset (development only)
npx prisma migrate reset
```

**Issue 3: Connection pool exhausted**

```typescript
// Solution: Use singleton pattern and disconnect
import { prisma } from '@/lib/prisma';

// In API routes, don't disconnect
// Prisma handles connection pooling
```

**Issue 4: Slow queries**

```typescript
// Enable query logging
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Check generated SQL
const users = await prisma.user.findMany();
// Logs: SELECT "id", "email" FROM "User"
```

### Debugging

**Enable Debug Logging**:

```typescript
const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
  ],
});

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query);
  console.log('Duration: ' + e.duration + 'ms');
});
```

**Use Prisma Studio**:

```bash
# Open visual database editor
npx prisma studio
```

---

## Resources

### Documentation

- [Prisma Official Docs](https://www.prisma.io/docs)
- [Prisma Examples](https://github.com/prisma/prisma-examples)

### Tools

- **Prisma Studio**: Visual database editor (`npx prisma studio`)
- **Prisma VS Code Extension**: Schema formatting and autocomplete

### Community

- [Prisma Discord](https://pris.ly/discord)
- [Prisma GitHub](https://github.com/prisma/prisma)
- [Prisma Slack](https://slack.prisma.io)

---

**Last Updated**: 2026-02-12

**Version**: 2.0

**License**: MIT
