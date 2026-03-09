# GraphQL for Backend

A comprehensive guide to GraphQL concepts, architecture, and implementation from a backend perspective.

---

## Table of Contents

1. [What is GraphQL?](#1-what-is-graphql)
2. [GraphQL vs REST API](#2-graphql-vs-rest-api)
3. [What are Queries in GraphQL?](#3-what-are-queries-in-graphql)
4. [What are Mutations in GraphQL?](#4-what-are-mutations-in-graphql)
5. [What are Subscriptions in GraphQL?](#5-what-are-subscriptions-in-graphql)
6. [What is a GraphQL Schema?](#6-what-is-a-graphql-schema)
7. [What are Resolvers?](#7-what-are-resolvers)
8. [What are GraphQL Types?](#8-what-are-graphql-types)
9. [What is the N+1 Problem in GraphQL?](#9-what-is-the-n1-problem-in-graphql)
10. [What is Authentication and Authorization in GraphQL?](#10-what-is-authentication-and-authorization-in-graphql)
11. [What is Pagination in GraphQL?](#11-what-is-pagination-in-graphql)
12. [What is Error Handling in GraphQL?](#12-what-is-error-handling-in-graphql)
13. [GraphQL with Laravel (Lighthouse)](#13-graphql-with-laravel-lighthouse)
14. [GraphQL with Node.js (Apollo Server)](#14-graphql-with-nodejs-apollo-server)
15. [When should you use GraphQL vs REST?](#15-when-should-you-use-graphql-vs-rest)

---

## 1. What is GraphQL?

GraphQL is a **query language for APIs** created by Facebook (Meta) in 2012 and open-sourced in 2015.

**Key idea:** The client decides exactly what data it needs — not the server.

**How it works:**
- There is **one single endpoint** (usually `/graphql`).
- The client sends a query describing exactly what fields it wants.
- The server returns **only** the requested data — nothing more, nothing less.

**Simple example:**

```graphql
# Client asks for specific fields
{
  user(id: 1) {
    name
    email
  }
}
```

```json
// Server returns exactly what was asked
{
  "data": {
    "user": {
      "name": "Anwar",
      "email": "anwar@example.com"
    }
  }
}
```

**Key characteristics:**
- One endpoint for all operations.
- Client controls the shape of the response.
- Strongly typed — every field has a defined type.
- Self-documenting — the schema describes all available data.
- Works with any backend language (PHP, Node.js, Python, Go, etc.).

---

## 2. GraphQL vs REST API

**REST API approach:**
- Multiple endpoints for different resources.
- Server decides what data to return.
- Over-fetching (getting more data than needed) and under-fetching (needing multiple requests) are common.

```
GET /api/users/1           → returns all user fields
GET /api/users/1/posts     → separate request for posts
GET /api/users/1/followers → separate request for followers
```

**GraphQL approach:**
- One endpoint for everything.
- Client decides what data to return.
- One request gets exactly what you need.

```graphql
{
  user(id: 1) {
    name
    posts {
      title
    }
    followers {
      name
    }
  }
}
```

**Comparison:**

- **Endpoints** — REST: many endpoints (`/users`, `/posts`, `/comments`) → GraphQL: one endpoint (`/graphql`).
- **Data fetching** — REST: server decides the response shape → GraphQL: client decides the response shape.
- **Over-fetching** — REST: common (returns all fields) → GraphQL: never (returns only requested fields).
- **Under-fetching** — REST: common (need multiple requests) → GraphQL: never (one request gets related data).
- **Versioning** — REST: needs `/v1/`, `/v2/` → GraphQL: no versioning needed (add new fields, deprecate old ones).
- **Caching** — REST: easy (HTTP caching by URL) → GraphQL: harder (single endpoint, needs special tools).
- **Learning curve** — REST: simple and familiar → GraphQL: steeper but more flexible.
- **File uploads** — REST: straightforward → GraphQL: needs extra setup.

---

## 3. What are Queries in GraphQL?

A **query** is how you **read/fetch** data in GraphQL. It is the equivalent of a GET request in REST.

**Basic query:**

```graphql
# Get a single user
{
  user(id: 1) {
    name
    email
  }
}
```

**Query with nested data:**

```graphql
# Get user with their posts and comments
{
  user(id: 1) {
    name
    email
    posts {
      title
      createdAt
      comments {
        body
        author {
          name
        }
      }
    }
  }
}
```

**Query with arguments:**

```graphql
# Get posts with filters
{
  posts(limit: 10, orderBy: "createdAt", status: "published") {
    title
    author {
      name
    }
  }
}
```

**Named query with variables:**

```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    name
    email
    role
  }
}
```

Variables:
```json
{ "id": "1" }
```

**Key points:**
- Queries are **read-only** — they don't change data.
- You can request **nested relationships** in a single query.
- You get **exactly** the fields you ask for.
- Variables make queries reusable and dynamic.

---

## 4. What are Mutations in GraphQL?

A **mutation** is how you **create, update, or delete** data in GraphQL. It is the equivalent of POST, PUT, PATCH, DELETE in REST.

**Create example:**

```graphql
mutation {
  createUser(input: {
    name: "Anwar"
    email: "anwar@example.com"
    password: "secret123"
  }) {
    id
    name
    email
  }
}
```

**Update example:**

```graphql
mutation {
  updateUser(id: 1, input: {
    name: "Anwar Barakat"
  }) {
    id
    name
    email
  }
}
```

**Delete example:**

```graphql
mutation {
  deleteUser(id: 1) {
    id
    message
  }
}
```

**Mutation with variables:**

```graphql
mutation CreatePost($input: CreatePostInput!) {
  createPost(input: $input) {
    id
    title
    body
    author {
      name
    }
  }
}
```

Variables:
```json
{
  "input": {
    "title": "My First Post",
    "body": "Hello world!",
    "categoryId": 5
  }
}
```

**Key points:**
- Mutations **change data** (create, update, delete).
- They return the modified data so the client stays in sync.
- Use `input` types to group related fields together.
- Mutations run **sequentially** (unlike queries which can run in parallel).

---

## 5. What are Subscriptions in GraphQL?

A **subscription** is how you get **real-time updates** in GraphQL. The client subscribes to an event, and the server pushes data when that event occurs.

**How it works:**
- Uses **WebSockets** (not HTTP like queries and mutations).
- Client says: "Notify me when X happens."
- Server pushes updates automatically.

**Example:**

```graphql
subscription {
  messageCreated(chatId: "123") {
    id
    body
    sender {
      name
    }
    createdAt
  }
}
```

**When the event happens, the server pushes:**

```json
{
  "data": {
    "messageCreated": {
      "id": "456",
      "body": "Hello!",
      "sender": {
        "name": "Anwar"
      },
      "createdAt": "2026-03-04T10:30:00Z"
    }
  }
}
```

**Use cases:**
- Real-time chat messages.
- Live notifications.
- Order status updates.
- Live dashboard data.
- Collaborative editing.

**Key points:**
- Subscriptions use **WebSockets**, not HTTP.
- They are event-driven — the server pushes data to the client.
- Not all GraphQL servers support subscriptions out of the box.
- Use them only when real-time updates are needed (not for regular data fetching).

---

## 6. What is a GraphQL Schema?

A **schema** defines the **structure of your API** — what data is available, what types exist, and what operations (queries, mutations, subscriptions) the client can perform.

**Think of it as:** The contract between the client and the server.

**Basic schema:**

```graphql
type Query {
  users: [User!]!
  user(id: ID!): User
  posts(limit: Int): [Post!]!
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
  createdAt: DateTime!
}

type Post {
  id: ID!
  title: String!
  body: String!
  author: User!
  comments: [Comment!]!
  published: Boolean!
}

input CreateUserInput {
  name: String!
  email: String!
  password: String!
}

input UpdateUserInput {
  name: String
  email: String
}

enum Role {
  ADMIN
  USER
  MODERATOR
}
```

**Key points:**
- The schema is the **single source of truth** for your API.
- It is **self-documenting** — tools like GraphiQL and Apollo Studio read the schema automatically.
- `!` means the field is **required** (non-nullable).
- `[Type!]!` means a **required list** of **required items**.
- `input` types are used for mutation arguments.
- `enum` types define a fixed set of allowed values.

---

## 7. What are Resolvers?

A **resolver** is a function that **returns the data** for a specific field in the schema.

**Think of it as:** The schema says "what" data exists. The resolver says "how" to get it.

**How resolvers work:**

```
Schema says:      type Query { user(id: ID!): User }
Resolver does:    fetches the user from the database and returns it
```

**Node.js resolver example:**

```javascript
const resolvers = {
  Query: {
    // Resolver for the "user" query
    user: async (parent, args, context) => {
      return await User.findById(args.id);
    },

    // Resolver for the "posts" query
    posts: async (parent, args, context) => {
      return await Post.find().limit(args.limit);
    },
  },

  Mutation: {
    // Resolver for creating a user
    createUser: async (parent, args, context) => {
      const user = new User(args.input);
      return await user.save();
    },
  },

  // Field-level resolver
  User: {
    posts: async (parent, args, context) => {
      return await Post.find({ authorId: parent.id });
    },
  },
};
```

**Resolver arguments:**
- **parent** — The result of the parent resolver (used in nested fields).
- **args** — The arguments passed to the field (e.g., `id`, `input`).
- **context** — Shared data across all resolvers (e.g., authenticated user, database connection).
- **info** — Information about the query (rarely used directly).

**Key points:**
- Every field in the schema **can** have a resolver.
- If no resolver is defined, GraphQL uses the **default resolver** (returns the field from the parent object).
- Resolvers are where your **business logic** lives.
- Resolvers can fetch data from databases, APIs, files, or any source.

---

## 8. What are GraphQL Types?

GraphQL is a **strongly typed** language. Every field has a defined type.

**Scalar types (built-in):**
- **Int** — Integer number (e.g., `42`).
- **Float** — Decimal number (e.g., `3.14`).
- **String** — Text (e.g., `"hello"`).
- **Boolean** — True or false.
- **ID** — Unique identifier (treated as a string).

**Object types:**

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  age: Int
  isActive: Boolean!
}
```

**Input types (for mutations):**

```graphql
input CreateUserInput {
  name: String!
  email: String!
  password: String!
}
```

**Enum types:**

```graphql
enum Status {
  ACTIVE
  INACTIVE
  SUSPENDED
}
```

**Interface types (shared fields):**

```graphql
interface Node {
  id: ID!
  createdAt: DateTime!
}

type User implements Node {
  id: ID!
  createdAt: DateTime!
  name: String!
}

type Post implements Node {
  id: ID!
  createdAt: DateTime!
  title: String!
}
```

**Union types (one of multiple types):**

```graphql
union SearchResult = User | Post | Comment

type Query {
  search(term: String!): [SearchResult!]!
}
```

**Non-null and list modifiers:**
- `String` — Nullable string (can be null).
- `String!` — Non-null string (required).
- `[String]` — Nullable list of nullable strings.
- `[String!]!` — Required list of required strings.

---

## 9. What is the N+1 Problem in GraphQL?

The **N+1 problem** occurs when fetching related data causes too many database queries.

**Example:**

```graphql
{
  posts {        # 1 query to fetch all posts
    title
    author {     # N queries — one per post to fetch each author
      name
    }
  }
}
```

**What happens:**
- 1 query to fetch 10 posts.
- 10 separate queries to fetch each post's author.
- Total: **11 queries** instead of 2.

**The solution: DataLoader (batching)**

DataLoader collects all the IDs, then makes **one batch query** instead of N separate queries.

```javascript
// Without DataLoader (N+1 problem)
// Post 1 → SELECT * FROM users WHERE id = 1
// Post 2 → SELECT * FROM users WHERE id = 2
// Post 3 → SELECT * FROM users WHERE id = 1  (duplicate!)
// ... 10 separate queries

// With DataLoader (batched)
// Collects all author IDs: [1, 2, 1, 3, 2, ...]
// One query: SELECT * FROM users WHERE id IN (1, 2, 3)
```

**Node.js DataLoader example:**

```javascript
const DataLoader = require('dataloader');

const userLoader = new DataLoader(async (userIds) => {
  const users = await User.find({ _id: { $in: userIds } });
  return userIds.map(id => users.find(user => user.id === id));
});

// In the resolver
const resolvers = {
  Post: {
    author: (post) => userLoader.load(post.authorId),
  },
};
```

**Key points:**
- The N+1 problem is the **most common performance issue** in GraphQL.
- **DataLoader** solves it by batching and caching within a single request.
- In Laravel (Lighthouse), **eager loading** and batch loaders solve this.
- Always monitor your queries in development to catch N+1 issues.

---

## 10. What is Authentication and Authorization in GraphQL?

**Authentication** = Who are you? (identity)
**Authorization** = What are you allowed to do? (permissions)

**Authentication via context:**

```javascript
// Server setup — extract user from token
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || '';
    const user = getUserFromToken(token);
    return { user };
  },
});
```

**Authorization in resolvers:**

```javascript
const resolvers = {
  Query: {
    // Only authenticated users
    me: (parent, args, context) => {
      if (!context.user) {
        throw new AuthenticationError('You must be logged in');
      }
      return context.user;
    },

    // Only admins
    users: (parent, args, context) => {
      if (!context.user || context.user.role !== 'ADMIN') {
        throw new ForbiddenError('Admin access only');
      }
      return User.find();
    },
  },
};
```

**Schema-level authorization with directives:**

```graphql
directive @auth on FIELD_DEFINITION
directive @hasRole(role: Role!) on FIELD_DEFINITION

type Query {
  me: User @auth
  users: [User!]! @auth @hasRole(role: ADMIN)
  publicPosts: [Post!]!
}
```

**Key points:**
- Authentication is handled in the **context** (parsed from headers).
- Authorization is checked in **resolvers** or via **directives**.
- GraphQL does not have built-in auth — you implement it yourself.
- Use middleware or directives to avoid repeating auth logic in every resolver.

---

## 11. What is Pagination in GraphQL?

Pagination controls how large datasets are returned in smaller chunks.

**Offset-based pagination (simple):**

```graphql
type Query {
  posts(limit: Int, offset: Int): [Post!]!
}
```

```graphql
# Page 1
{ posts(limit: 10, offset: 0) { title } }

# Page 2
{ posts(limit: 10, offset: 10) { title } }
```

**Cursor-based pagination (recommended):**

```graphql
type Query {
  posts(first: Int, after: String): PostConnection!
}

type PostConnection {
  edges: [PostEdge!]!
  pageInfo: PageInfo!
}

type PostEdge {
  node: Post!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}
```

```graphql
# First page
{
  posts(first: 10) {
    edges {
      node {
        title
      }
      cursor
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}

# Next page — use endCursor from previous response
{
  posts(first: 10, after: "cursor_abc123") {
    edges {
      node {
        title
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
```

**Offset vs Cursor pagination:**
- **Offset** — Simple to implement, but can skip or duplicate items if data changes between pages.
- **Cursor** — More reliable, better performance, handles real-time data changes. Recommended by GraphQL best practices.

---

## 12. What is Error Handling in GraphQL?

GraphQL **always returns HTTP 200** — even when there are errors. Errors are included in the response body.

**Error response format:**

```json
{
  "data": {
    "user": null
  },
  "errors": [
    {
      "message": "User not found",
      "locations": [{ "line": 2, "column": 3 }],
      "path": ["user"],
      "extensions": {
        "code": "NOT_FOUND",
        "statusCode": 404
      }
    }
  ]
}
```

**Partial data with errors:**

GraphQL can return **some data and some errors** in the same response:

```json
{
  "data": {
    "user": {
      "name": "Anwar",
      "secretField": null
    }
  },
  "errors": [
    {
      "message": "Not authorized to access secretField",
      "path": ["user", "secretField"]
    }
  ]
}
```

**Custom error handling in resolvers:**

```javascript
const resolvers = {
  Query: {
    user: async (parent, { id }) => {
      const user = await User.findById(id);

      if (!user) {
        throw new UserInputError('User not found', {
          extensions: { code: 'NOT_FOUND', id },
        });
      }

      return user;
    },
  },
};
```

**Key points:**
- GraphQL always returns **HTTP 200** — check the `errors` array for issues.
- Errors include `message`, `path`, and optional `extensions` for error codes.
- GraphQL supports **partial responses** — some fields succeed, others fail.
- Use custom error classes (`AuthenticationError`, `ForbiddenError`, `UserInputError`) for different error types.

---

## 13. GraphQL with Laravel (Lighthouse)

**Lighthouse** is the most popular GraphQL package for Laravel.

**Installation:**

```bash
composer require nuwave/lighthouse
php artisan vendor:publish --tag=lighthouse-schema
```

**Schema file (`graphql/schema.graphql`):**

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

**Lighthouse directives (built-in):**
- `@all` — Fetch all records.
- `@find` — Find a single record.
- `@create` — Create a new record.
- `@update` — Update a record.
- `@delete` — Delete a record.
- `@hasMany` — Define a one-to-many relationship.
- `@belongsTo` — Define a belongs-to relationship.
- `@auth` — Require authentication.
- `@can` — Check Laravel policy authorization.
- `@paginate` — Add pagination.
- `@hash` — Hash a field (e.g., password).

**Authentication with Lighthouse:**

```graphql
type Query {
  me: User @auth(guard: "sanctum")
}

type Mutation {
  login(email: String!, password: String!): AuthPayload!
  logout: LogoutResponse! @guard(with: "sanctum")
}
```

**Key points:**
- Lighthouse uses the **schema-first** approach — you define the schema, and Lighthouse maps it to Eloquent models.
- Most CRUD operations need **zero PHP code** — just directives.
- Custom logic goes in **custom resolvers** or **mutations**.
- It works with Laravel's built-in features (policies, guards, validation).

---

## 14. GraphQL with Node.js (Apollo Server)

**Apollo Server** is the most popular GraphQL server for Node.js.

**Installation:**

```bash
npm install @apollo/server graphql
```

**Basic setup:**

```javascript
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

// Schema
const typeDefs = `
  type Query {
    users: [User!]!
    user(id: ID!): User
  }

  type Mutation {
    createUser(input: CreateUserInput!): User!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    author: User!
  }

  input CreateUserInput {
    name: String!
    email: String!
    password: String!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    users: async () => await User.find(),
    user: async (_, { id }) => await User.findById(id),
  },

  Mutation: {
    createUser: async (_, { input }) => {
      const user = new User(input);
      return await user.save();
    },
  },

  User: {
    posts: async (parent) => await Post.find({ authorId: parent.id }),
  },
};

// Server
const server = new ApolloServer({ typeDefs, resolvers });

startStandaloneServer(server, { listen: { port: 4000 } })
  .then(({ url }) => console.log(`Server ready at ${url}`));
```

**Key points:**
- Apollo Server uses the **code-first** or **schema-first** approach.
- Define `typeDefs` (schema) and `resolvers` (logic) separately.
- Use **context** for authentication and shared data.
- Use **DataLoader** to solve the N+1 problem.
- Apollo provides tools like **Apollo Studio** for testing and monitoring.

---

## 15. When should you use GraphQL vs REST?

**Use GraphQL when:**
- The frontend needs **flexible data fetching** (different screens need different fields).
- You have **complex relationships** between data (nested objects).
- You want to **reduce the number of API requests** (one request instead of many).
- Multiple clients (web, mobile, admin) need **different data** from the same API.
- You want a **self-documenting API** with strong typing.

**Use REST when:**
- Your API is **simple** with straightforward CRUD operations.
- You need **easy HTTP caching** (each endpoint has its own URL).
- **File uploads** are a major part of your API.
- Your team is **more familiar** with REST.
- You need **simple webhooks** or third-party integrations.
- Performance is critical and you want **predictable query costs**.

**You can use both:**
- Many companies use REST for simple operations and GraphQL for complex data fetching.
- They are not mutually exclusive — use the right tool for the job.

**In short:** GraphQL shines when your frontend needs flexibility and your data has complex relationships. REST is simpler and better for straightforward APIs. Choose based on your project's needs, not hype.
