# GraphQL for Backend

A guide to GraphQL concepts, architecture, and implementation from a backend perspective, with focus on Laravel (Lighthouse).

---

## Table of Contents

1. [What is GraphQL?](#1-what-is-graphql)
2. [GraphQL vs REST](#2-graphql-vs-rest)
3. [Queries](#3-queries)
4. [Mutations](#4-mutations)
5. [Subscriptions](#5-subscriptions)
6. [Schema](#6-schema)
7. [Resolvers](#7-resolvers)
8. [Types](#8-types)
9. [N+1 Problem](#9-n1-problem)
10. [Authentication & Authorization](#10-authentication--authorization)
11. [Pagination](#11-pagination)
12. [Error Handling](#12-error-handling)
13. [GraphQL with Laravel (Lighthouse)](#13-graphql-with-laravel-lighthouse)
14. [GraphQL with Node.js (Apollo Server)](#14-graphql-with-nodejs-apollo-server)
15. [When to Use GraphQL vs REST](#15-when-to-use-graphql-vs-rest)

---

## 1. What is GraphQL?

A **query language for APIs** (Facebook, 2015). The client decides exactly what data it needs.

- **One endpoint** (`/graphql`), client sends a query, server returns only requested fields.

```graphql
{ user(id: 1) { name, email } }
```

```json
{ "data": { "user": { "name": "Anwar", "email": "anwar@example.com" } } }
```

**Key traits:** Single endpoint, client-controlled response shape, strongly typed, self-documenting, language-agnostic.

---

## 2. GraphQL vs REST

| Aspect | REST | GraphQL |
|--------|------|---------|
| Endpoints | Many (`/users`, `/posts`) | One (`/graphql`) |
| Data control | Server decides | Client decides |
| Over-fetching | Common | Never |
| Under-fetching | Multiple requests needed | One request |
| Versioning | `/v1/`, `/v2/` | Not needed |
| Caching | Easy (HTTP/URL) | Harder (needs tools) |
| File uploads | Straightforward | Needs extra setup |

---

## 3. Queries

Queries **read data** (equivalent to GET in REST).

```graphql
# Basic
{ user(id: 1) { name, email } }

# Nested relations
{
  user(id: 1) {
    name
    posts {
      title
      comments { body, author { name } }
    }
  }
}

# With variables
query GetUser($id: ID!) {
  user(id: $id) { name, email, role }
}
```

Queries are read-only, support nested relationships, return only requested fields, and use variables for dynamic values.

---

## 4. Mutations

Mutations **create, update, or delete** data (equivalent to POST/PUT/DELETE).

```graphql
# Create
mutation {
  createUser(input: { name: "Anwar", email: "anwar@example.com", password: "secret123" }) {
    id, name, email
  }
}

# Update
mutation {
  updateUser(id: 1, input: { name: "Anwar Barakat" }) { id, name }
}

# Delete
mutation {
  deleteUser(id: 1) { id, message }
}

# With variables
mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) { id, title, author { name } }
}
```

Mutations return modified data, use `input` types to group fields, and run **sequentially** (unlike parallel queries).

---

## 5. Subscriptions

Real-time updates via **WebSockets**. The client subscribes, and the server pushes data when events occur.

```graphql
subscription {
  messageCreated(chatId: "123") {
    id, body, sender { name }, createdAt
  }
}
```

**Use cases:** Chat, notifications, order tracking, live dashboards, collaborative editing.

---

## 6. Schema

The schema defines your API's structure — the contract between client and server.

```graphql
type Query {
  users: [User!]!
  user(id: ID!): User
}

type Mutation {
  createUser(input: CreateUserInput!): User!
  updateUser(id: ID!, input: UpdateUserInput!): User!
  deleteUser(id: ID!): DeleteResponse!
}

type User {
  id: ID!
  name: String!
  email: String!
  role: Role!
  posts: [Post!]!
}

input CreateUserInput {
  name: String!
  email: String!
  password: String!
}

enum Role { ADMIN, USER, MODERATOR }
```

- `!` = required (non-nullable)
- `[Type!]!` = required list of required items
- `input` types for mutation arguments
- `enum` for fixed allowed values

---

## 7. Resolvers

A resolver **returns the data** for a schema field. Schema = "what" exists, resolver = "how" to get it.

```javascript
const resolvers = {
  Query: {
    user: async (parent, args, context) => await User.findById(args.id),
    posts: async (parent, args) => await Post.find().limit(args.limit),
  },
  Mutation: {
    createUser: async (_, { input }) => await new User(input).save(),
  },
  User: {
    posts: async (parent) => await Post.find({ authorId: parent.id }),
  },
};
```

**Arguments:** `parent` (parent result), `args` (field arguments), `context` (shared data like auth user), `info` (query metadata).

---

## 8. Types

GraphQL is strongly typed.

**Scalar types:** `Int`, `Float`, `String`, `Boolean`, `ID`

**Object, Input, Enum types:** (see Schema section)

**Interface types** (shared fields):

```graphql
interface Node {
  id: ID!
  createdAt: DateTime!
}

type User implements Node { id: ID!, createdAt: DateTime!, name: String! }
type Post implements Node { id: ID!, createdAt: DateTime!, title: String! }
```

**Union types:**

```graphql
union SearchResult = User | Post | Comment
type Query { search(term: String!): [SearchResult!]! }
```

**Nullability:** `String` (nullable), `String!` (required), `[String!]!` (required list of required strings).

---

## 9. N+1 Problem

Fetching related data causes too many queries:

```graphql
{ posts { title, author { name } } }
# 1 query for posts + N queries for each author = N+1 queries
```

**Solution: DataLoader (batching)**

```javascript
const DataLoader = require('dataloader');

const userLoader = new DataLoader(async (userIds) => {
  const users = await User.find({ _id: { $in: userIds } });
  return userIds.map(id => users.find(u => u.id === id));
});

// Resolver
Post: { author: (post) => userLoader.load(post.authorId) }
```

In **Laravel/Lighthouse**, use eager loading (`@with`) and batch loaders.

---

## 10. Authentication & Authorization

**Authentication** (who are you) via context:

```javascript
const server = new ApolloServer({
  typeDefs, resolvers,
  context: ({ req }) => {
    const user = getUserFromToken(req.headers.authorization || '');
    return { user };
  },
});
```

**Authorization** (what can you do) in resolvers:

```javascript
Query: {
  me: (_, __, { user }) => {
    if (!user) throw new AuthenticationError('Must be logged in');
    return user;
  },
  users: (_, __, { user }) => {
    if (user?.role !== 'ADMIN') throw new ForbiddenError('Admin only');
    return User.find();
  },
}
```

**Schema directives:**

```graphql
type Query {
  me: User @auth
  users: [User!]! @auth @hasRole(role: ADMIN)
}
```

---

## 11. Pagination

**Offset-based (simple):**

```graphql
type Query { posts(limit: Int, offset: Int): [Post!]! }

# Page 1: { posts(limit: 10, offset: 0) { title } }
# Page 2: { posts(limit: 10, offset: 10) { title } }
```

**Cursor-based (recommended):**

```graphql
type Query { posts(first: Int, after: String): PostConnection! }

type PostConnection {
  edges: [PostEdge!]!
  pageInfo: PageInfo!
}

type PostEdge { node: Post!, cursor: String! }

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}
```

Cursor pagination is more reliable with changing data and better for large datasets.

---

## 12. Error Handling

GraphQL **always returns HTTP 200**. Errors are in the response body.

```json
{
  "data": { "user": null },
  "errors": [{
    "message": "User not found",
    "path": ["user"],
    "extensions": { "code": "NOT_FOUND", "statusCode": 404 }
  }]
}
```

GraphQL supports **partial responses** — some fields succeed while others fail. Use custom error classes (`AuthenticationError`, `ForbiddenError`, `UserInputError`).

---

## 13. GraphQL with Laravel (Lighthouse)

**Lighthouse** is the most popular GraphQL package for Laravel.

```bash
composer require nuwave/lighthouse
php artisan vendor:publish --tag=lighthouse-schema
```

**Schema (`graphql/schema.graphql`):**

```graphql
type Query {
  users: [User!]! @all
  user(id: ID! @eq): User @find
  posts(limit: Int @limit): [Post!]! @all
}

type Mutation {
  createUser(input: CreateUserInput! @spread): User! @create
  updateUser(id: ID!, input: UpdateUserInput! @spread): User! @update
  deleteUser(id: ID!): User! @delete
}

type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]! @hasMany
  createdAt: DateTime! @rename(attribute: "created_at")
}

type Post {
  id: ID!
  title: String!
  body: String!
  author: User! @belongsTo
}

input CreateUserInput {
  name: String!
  email: String!
  password: String! @hash
}

input UpdateUserInput {
  name: String
  email: String
}
```

**Key Lighthouse directives:**

| Directive | Purpose |
|-----------|---------|
| `@all` | Fetch all records |
| `@find` | Find single record |
| `@create` / `@update` / `@delete` | CRUD operations |
| `@hasMany` / `@belongsTo` | Eloquent relationships |
| `@paginate` | Add pagination |
| `@auth` | Require authentication |
| `@can` | Check Laravel policy |
| `@hash` | Hash field (passwords) |
| `@spread` | Spread input into args |

**Authentication:**

```graphql
type Query {
  me: User @auth(guard: "sanctum")
}

type Mutation {
  login(email: String!, password: String!): AuthPayload!
  logout: LogoutResponse! @guard(with: "sanctum")
}
```

Most CRUD operations need **zero PHP code** — just directives. Custom logic goes in custom resolvers or mutations. Works with Laravel policies, guards, and validation.

---

## 14. GraphQL with Node.js (Apollo Server)

```bash
npm install @apollo/server graphql
```

```javascript
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

const typeDefs = `
  type Query { users: [User!]!, user(id: ID!): User }
  type Mutation { createUser(input: CreateUserInput!): User! }
  type User { id: ID!, name: String!, email: String!, posts: [Post!]! }
  type Post { id: ID!, title: String!, author: User! }
  input CreateUserInput { name: String!, email: String!, password: String! }
`;

const resolvers = {
  Query: {
    users: async () => await User.find(),
    user: async (_, { id }) => await User.findById(id),
  },
  Mutation: {
    createUser: async (_, { input }) => await new User(input).save(),
  },
  User: {
    posts: async (parent) => await Post.find({ authorId: parent.id }),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
startStandaloneServer(server, { listen: { port: 4000 } })
  .then(({ url }) => console.log(`Server ready at ${url}`));
```

---

## 15. When to Use GraphQL vs REST

**Use GraphQL when:** flexible data fetching needed, complex relationships, reducing API requests, multiple clients need different data, strong typing wanted.

**Use REST when:** simple CRUD, easy HTTP caching needed, file uploads are core, team prefers REST, simple webhooks/integrations.

**Both can coexist** — use the right tool for each part of your API.
