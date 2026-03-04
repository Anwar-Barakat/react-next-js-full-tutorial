# GraphQL for Frontend

A comprehensive guide to using GraphQL on the frontend with React, Apollo Client, and related tools.

---

## Table of Contents

1. [What is GraphQL from a Frontend Perspective?](#1-what-is-graphql-from-a-frontend-perspective)
2. [What is Apollo Client?](#2-what-is-apollo-client)
3. [How to Fetch Data with useQuery?](#3-how-to-fetch-data-with-usequery)
4. [How to Send Data with useMutation?](#4-how-to-send-data-with-usemutation)
5. [What is the Apollo Cache?](#5-what-is-the-apollo-cache)
6. [How to Handle Loading and Error States?](#6-how-to-handle-loading-and-error-states)
7. [What are Fragments in GraphQL?](#7-what-are-fragments-in-graphql)
8. [How to Handle Pagination on the Frontend?](#8-how-to-handle-pagination-on-the-frontend)
9. [GraphQL with React Query (TanStack Query)](#9-graphql-with-react-query-tanstack-query)
10. [What are GraphQL Code Generators?](#10-what-are-graphql-code-generators)
11. [Real-time Updates with Subscriptions](#11-real-time-updates-with-subscriptions)
12. [GraphQL vs REST from a Frontend Perspective](#12-graphql-vs-rest-from-a-frontend-perspective)
13. [Best Practices for Frontend GraphQL](#13-best-practices-for-frontend-graphql)

---

## 1. What is GraphQL from a Frontend Perspective?

For frontend developers, GraphQL means **you control the data**.

**The problem with REST:**
- You call `/api/users/1` and get **all 20 fields** — but you only need `name` and `avatar`.
- You need user + posts + comments — that's **3 separate API calls**.
- Different pages need different data, but the API returns the same fixed shape.

**With GraphQL:**
- You ask for **exactly** what you need.
- You get user + posts + comments in **one request**.
- Every page can request **different fields** from the same endpoint.

```graphql
# Homepage — only needs name and avatar
{
  user(id: 1) {
    name
    avatar
  }
}

# Profile page — needs everything
{
  user(id: 1) {
    name
    avatar
    email
    bio
    posts {
      title
      createdAt
    }
    followers {
      name
    }
  }
}
```

**Benefits for frontend developers:**
- No more waiting for backend to create new endpoints.
- No more over-fetching (wasted data) or under-fetching (multiple requests).
- Self-documenting — you can explore the entire API using tools like GraphiQL or Apollo Studio.
- Strong typing — you know exactly what types every field returns.
- Works great with TypeScript — types can be auto-generated from the schema.

---

## 2. What is Apollo Client?

**Apollo Client** is the most popular GraphQL client for React. It handles fetching, caching, and state management.

**Installation:**

```bash
npm install @apollo/client graphql
```

**Setup:**

```tsx
// src/lib/apollo.ts
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.example.com/graphql',
  cache: new InMemoryCache(),
  headers: {
    authorization: `Bearer ${token}`,
  },
});

// src/App.tsx
function App() {
  return (
    <ApolloProvider client={client}>
      <MyApp />
    </ApolloProvider>
  );
}
```

**What Apollo Client provides:**
- **useQuery** — Hook for fetching data.
- **useMutation** — Hook for creating/updating/deleting data.
- **useSubscription** — Hook for real-time updates.
- **InMemoryCache** — Automatic caching of query results.
- **Optimistic UI** — Update the UI before the server responds.
- **Error handling** — Built-in loading, error, and data states.
- **DevTools** — Browser extension for debugging queries and cache.

---

## 3. How to Fetch Data with useQuery?

**useQuery** is the main hook for fetching data in Apollo Client.

**Basic example:**

```tsx
import { useQuery, gql } from '@apollo/client';

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      avatar
    }
  }
`;

function UserList() {
  const { data, loading, error } = useQuery(GET_USERS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

**Query with variables:**

```tsx
const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      name
      email
      posts {
        title
      }
    }
  }
`;

function UserProfile({ userId }: { userId: string }) {
  const { data, loading, error } = useQuery(GET_USER, {
    variables: { id: userId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>{data.user.name}</h1>
      <p>{data.user.email}</p>
      {data.user.posts.map((post) => (
        <p key={post.title}>{post.title}</p>
      ))}
    </div>
  );
}
```

**useQuery options:**
- `variables` — Pass dynamic values to the query.
- `pollInterval` — Refetch data at regular intervals (e.g., every 5 seconds).
- `skip` — Skip the query conditionally.
- `fetchPolicy` — Control caching behavior (`cache-first`, `network-only`, `no-cache`).
- `onCompleted` — Callback when query succeeds.
- `onError` — Callback when query fails.

```tsx
const { data, loading, refetch } = useQuery(GET_USERS, {
  pollInterval: 5000,          // Refetch every 5 seconds
  fetchPolicy: 'cache-first',  // Use cache if available
  skip: !isAuthenticated,      // Skip if not logged in
});
```

---

## 4. How to Send Data with useMutation?

**useMutation** is the hook for creating, updating, or deleting data.

**Create example:**

```tsx
import { useMutation, gql } from '@apollo/client';

const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
    }
  }
`;

function CreateUserForm() {
  const [createUser, { data, loading, error }] = useMutation(CREATE_USER);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createUser({
      variables: {
        input: {
          name: 'Anwar',
          email: 'anwar@example.com',
          password: 'secret123',
        },
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </button>
      {error && <p>Error: {error.message}</p>}
    </form>
  );
}
```

**Update cache after mutation:**

```tsx
const [createPost] = useMutation(CREATE_POST, {
  // Update the cache so the UI shows the new post immediately
  update(cache, { data: { createPost } }) {
    const existing = cache.readQuery({ query: GET_POSTS });

    cache.writeQuery({
      query: GET_POSTS,
      data: {
        posts: [createPost, ...existing.posts],
      },
    });
  },
});
```

**Optimistic UI (update before server responds):**

```tsx
const [toggleLike] = useMutation(TOGGLE_LIKE, {
  optimisticResponse: {
    toggleLike: {
      id: postId,
      liked: !currentlyLiked,
      likesCount: currentlyLiked ? likesCount - 1 : likesCount + 1,
      __typename: 'Post',
    },
  },
});
```

**Key points:**
- `useMutation` returns a **tuple**: `[mutationFunction, { data, loading, error }]`.
- Use `update` to manually update the cache after a mutation.
- Use `optimisticResponse` for instant UI feedback.
- Use `refetchQueries` to refetch related queries after a mutation.

---

## 5. What is the Apollo Cache?

Apollo Client **automatically caches** all query results in memory. This means repeated queries don't hit the server again.

**How it works:**
- Every object with an `id` and `__typename` is stored in a **normalized cache**.
- If you query the same data again, Apollo returns it from cache instantly.
- When a mutation updates an object, the cache updates automatically (if the `id` matches).

**Cache behavior:**

```tsx
// First call — fetches from server, stores in cache
const { data } = useQuery(GET_USER, { variables: { id: 1 } });

// Second call — returns from cache instantly (no network request)
const { data } = useQuery(GET_USER, { variables: { id: 1 } });
```

**Fetch policies:**
- `cache-first` (default) — Read from cache first. Only fetch from network if not in cache.
- `network-only` — Always fetch from network. Don't read from cache.
- `cache-and-network` — Read from cache immediately, then also fetch from network.
- `no-cache` — Never read or write to cache.
- `cache-only` — Only read from cache. Never fetch from network.

```tsx
// Always get fresh data
const { data } = useQuery(GET_USERS, {
  fetchPolicy: 'network-only',
});

// Show cache first, then update with fresh data
const { data } = useQuery(GET_USERS, {
  fetchPolicy: 'cache-and-network',
});
```

**Key points:**
- Apollo cache is **automatic** — you don't need to configure it for basic use.
- Objects are **normalized** by `id` + `__typename` — updates propagate everywhere.
- Choose the right `fetchPolicy` based on how fresh your data needs to be.
- Use `cache.evict()` or `cache.modify()` for advanced cache management.

---

## 6. How to Handle Loading and Error States?

**Basic pattern:**

```tsx
function UserList() {
  const { data, loading, error } = useQuery(GET_USERS);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error.message} />;

  return (
    <ul>
      {data.users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

**Loading with skeleton UI:**

```tsx
function UserList() {
  const { data, loading, error } = useQuery(GET_USERS);

  if (error) return <ErrorMessage message={error.message} />;

  return (
    <ul>
      {loading
        ? Array.from({ length: 5 }).map((_, i) => (
            <li key={i}><Skeleton width={200} height={20} /></li>
          ))
        : data.users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
    </ul>
  );
}
```

**Error handling with retry:**

```tsx
function UserList() {
  const { data, loading, error, refetch } = useQuery(GET_USERS);

  if (error) {
    return (
      <div>
        <p>Something went wrong: {error.message}</p>
        <button onClick={() => refetch()}>Try Again</button>
      </div>
    );
  }

  // ...
}
```

**Global error handling:**

```tsx
import { ApolloClient, InMemoryCache, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, extensions }) => {
      if (extensions?.code === 'UNAUTHENTICATED') {
        // Redirect to login
        window.location.href = '/login';
      }
    });
  }

  if (networkError) {
    console.error('Network error:', networkError);
  }
});

const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
});
```

---

## 7. What are Fragments in GraphQL?

Fragments let you **reuse sets of fields** across multiple queries — avoiding repetition.

**Without fragments (repetitive):**

```graphql
query {
  user(id: 1) {
    id
    name
    email
    avatar
    role
  }
  post(id: 1) {
    author {
      id
      name
      email
      avatar
      role
    }
  }
}
```

**With fragments (reusable):**

```graphql
fragment UserFields on User {
  id
  name
  email
  avatar
  role
}

query {
  user(id: 1) {
    ...UserFields
  }
  post(id: 1) {
    author {
      ...UserFields
    }
  }
}
```

**Using fragments in React:**

```tsx
const USER_FIELDS = gql`
  fragment UserFields on User {
    id
    name
    email
    avatar
  }
`;

const GET_USERS = gql`
  ${USER_FIELDS}
  query GetUsers {
    users {
      ...UserFields
    }
  }
`;

const GET_POST = gql`
  ${USER_FIELDS}
  query GetPost($id: ID!) {
    post(id: $id) {
      title
      body
      author {
        ...UserFields
      }
    }
  }
`;
```

**Key points:**
- Fragments **reduce code duplication** across queries.
- They keep your queries **consistent** — if you add a field, it updates everywhere.
- Fragments are defined **on a specific type** (e.g., `on User`).
- They work with code generators to create **reusable TypeScript types**.

---

## 8. How to Handle Pagination on the Frontend?

**Offset-based pagination:**

```tsx
const GET_POSTS = gql`
  query GetPosts($offset: Int, $limit: Int) {
    posts(offset: $offset, limit: $limit) {
      id
      title
    }
  }
`;

function PostList() {
  const { data, loading, fetchMore } = useQuery(GET_POSTS, {
    variables: { offset: 0, limit: 10 },
  });

  const loadMore = () => {
    fetchMore({
      variables: { offset: data.posts.length },
      updateQuery: (prev, { fetchMoreResult }) => ({
        posts: [...prev.posts, ...fetchMoreResult.posts],
      }),
    });
  };

  return (
    <div>
      {data?.posts.map((post) => (
        <p key={post.id}>{post.title}</p>
      ))}
      <button onClick={loadMore} disabled={loading}>
        Load More
      </button>
    </div>
  );
}
```

**Cursor-based pagination:**

```tsx
const GET_POSTS = gql`
  query GetPosts($first: Int, $after: String) {
    posts(first: $first, after: $after) {
      edges {
        node {
          id
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
`;

function PostList() {
  const { data, loading, fetchMore } = useQuery(GET_POSTS, {
    variables: { first: 10 },
  });

  const loadMore = () => {
    fetchMore({
      variables: {
        after: data.posts.pageInfo.endCursor,
      },
    });
  };

  return (
    <div>
      {data?.posts.edges.map(({ node }) => (
        <p key={node.id}>{node.title}</p>
      ))}
      {data?.posts.pageInfo.hasNextPage && (
        <button onClick={loadMore} disabled={loading}>
          Load More
        </button>
      )}
    </div>
  );
}
```

**Key points:**
- Use `fetchMore` to load additional pages.
- **Offset pagination** is simpler but less reliable with changing data.
- **Cursor pagination** is recommended for infinite scroll and large datasets.
- Apollo handles merging paginated results into the cache.

---

## 9. GraphQL with React Query (TanStack Query)

You don't need Apollo Client to use GraphQL. **React Query** works great with GraphQL using a simple fetch wrapper.

**Setup:**

```tsx
// src/lib/graphql.ts
export async function graphqlFetch<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const response = await fetch('https://api.example.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ query, variables }),
  });

  const { data, errors } = await response.json();

  if (errors) {
    throw new Error(errors[0].message);
  }

  return data;
}
```

**Fetching with useQuery:**

```tsx
import { useQuery } from '@tanstack/react-query';
import { graphqlFetch } from '@/lib/graphql';

const GET_USERS = `
  query {
    users {
      id
      name
      email
    }
  }
`;

function UserList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => graphqlFetch(GET_USERS),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

**Mutations with useMutation:**

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

const CREATE_USER = `
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
    }
  }
`;

function CreateUserForm() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (input) =>
      graphqlFetch(CREATE_USER, { input }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  // ...
}
```

**Apollo Client vs React Query for GraphQL:**
- **Apollo Client** — Built specifically for GraphQL. Has normalized cache, optimistic UI, and subscriptions built-in. Heavier.
- **React Query** — General-purpose. Lighter. No normalized cache. Works with any data source. You write the fetch logic yourself.
- Use **Apollo** if GraphQL is your main data layer and you need advanced caching.
- Use **React Query** if you already use it for REST and want to add some GraphQL queries.

---

## 10. What are GraphQL Code Generators?

Code generators **automatically create TypeScript types** from your GraphQL schema and queries.

**Why use them:**
- You never write types manually for GraphQL responses.
- Types are always **in sync** with the schema.
- Catches errors at **compile time**, not runtime.
- Generates typed hooks (`useGetUsersQuery`, `useCreateUserMutation`).

**Setup with graphql-codegen:**

```bash
npm install -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations @graphql-codegen/typescript-react-apollo
```

**Config (`codegen.ts`):**

```typescript
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'https://api.example.com/graphql',
  documents: 'src/**/*.graphql',
  generates: {
    'src/generated/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
    },
  },
};

export default config;
```

**Define queries in `.graphql` files:**

```graphql
# src/graphql/users.graphql

query GetUsers {
  users {
    id
    name
    email
  }
}

mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    name
    email
  }
}
```

**Run the generator:**

```bash
npx graphql-codegen
```

**Use the generated typed hooks:**

```tsx
// Auto-generated types and hooks
import { useGetUsersQuery, useCreateUserMutation } from '@/generated/graphql';

function UserList() {
  // Fully typed — data.users is typed as User[]
  const { data, loading, error } = useGetUsersQuery();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data?.users.map((user) => (
        <li key={user.id}>{user.name} - {user.email}</li>
      ))}
    </ul>
  );
}
```

**Key points:**
- Code generators **eliminate manual type writing**.
- Types are **always in sync** with the backend schema.
- Generated hooks provide **full TypeScript support** out of the box.
- Run the generator as part of your build process or in watch mode during development.

---

## 11. Real-time Updates with Subscriptions

**Setup WebSocket link:**

```tsx
import { ApolloClient, InMemoryCache, split, HttpLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

const httpLink = new HttpLink({ uri: 'https://api.example.com/graphql' });

const wsLink = new GraphQLWsLink(
  createClient({ url: 'wss://api.example.com/graphql' })
);

// Use WebSocket for subscriptions, HTTP for queries/mutations
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
```

**Using useSubscription:**

```tsx
import { useSubscription, gql } from '@apollo/client';

const MESSAGE_CREATED = gql`
  subscription OnMessageCreated($chatId: ID!) {
    messageCreated(chatId: $chatId) {
      id
      body
      sender {
        name
        avatar
      }
      createdAt
    }
  }
`;

function ChatMessages({ chatId }: { chatId: string }) {
  const { data: newMessage } = useSubscription(MESSAGE_CREATED, {
    variables: { chatId },
  });

  // When a new message arrives, it's in newMessage.messageCreated
  // Combine with existing messages from useQuery
}
```

**Key points:**
- Subscriptions use **WebSockets**, not HTTP.
- Use `split` to route subscriptions to WebSocket and queries/mutations to HTTP.
- `useSubscription` automatically receives new data when the server pushes it.
- Use subscriptions for **chat, notifications, live dashboards** — not for regular data fetching.

---

## 12. GraphQL vs REST from a Frontend Perspective

**REST experience:**
- You call many endpoints to build one page.
- You get extra data you don't need (over-fetching).
- You need multiple round trips for related data (under-fetching).
- Adding a new field requires a backend change or new endpoint.
- Easy to cache (each URL = one resource).

**GraphQL experience:**
- One endpoint, one request per page.
- You get exactly the data you need.
- Related data comes in a single request.
- Frontend can request new fields without backend changes (if they exist in the schema).
- Caching requires a client library (Apollo, urql).

**When to use GraphQL on the frontend:**
- Your app has **many different views** that need different data shapes.
- You're building a **mobile app** where bandwidth matters (no over-fetching).
- The data model has **deep relationships** (users → posts → comments → likes).
- You want **strong typing** and auto-generated TypeScript types.

**When REST is fine on the frontend:**
- Simple apps with **few pages** and straightforward data needs.
- The API is **already built** with REST and works well.
- You don't need nested data or flexible queries.

---

## 13. Best Practices for Frontend GraphQL

**Query organization:**
- Keep queries **close to the components** that use them.
- Use **fragments** for reusable field sets.
- Use `.graphql` files with code generators for large projects.

**Performance:**
- Use `cache-first` fetch policy for data that doesn't change often.
- Use `cache-and-network` for data that should always be fresh.
- Avoid **deeply nested queries** — they can be slow on the backend.
- Use **pagination** for large lists — never fetch all records at once.

**Type safety:**
- Use **GraphQL Code Generator** to auto-generate TypeScript types.
- Never write response types manually.
- Use typed hooks (`useGetUsersQuery`) instead of raw `useQuery` with string queries.

**Error handling:**
- Always handle **loading**, **error**, and **empty** states.
- Use a **global error link** for authentication errors.
- Show user-friendly error messages, not raw GraphQL errors.

**Cache management:**
- After mutations, **update the cache** or **refetch queries** to keep the UI in sync.
- Use **optimistic responses** for instant UI feedback.
- Use `cache.evict()` to remove stale data when needed.

**Security:**
- Never expose sensitive data in client-side queries.
- Always send **authentication tokens** in headers.
- Validate and sanitize user input before sending mutations.
