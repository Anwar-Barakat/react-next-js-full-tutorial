# GraphQL for Frontend

A guide to using GraphQL on the frontend with React, Apollo Client, and related tools.

---

## Table of Contents

1. [What is GraphQL from a Frontend Perspective?](#1-what-is-graphql-from-a-frontend-perspective)
2. [Apollo Client Setup](#2-apollo-client-setup)
3. [Fetching Data with useQuery](#3-fetching-data-with-usequery)
4. [Sending Data with useMutation](#4-sending-data-with-usemutation)
5. [Apollo Cache](#5-apollo-cache)
6. [Loading and Error States](#6-loading-and-error-states)
7. [Fragments](#7-fragments)
8. [Pagination](#8-pagination)
9. [GraphQL with React Query](#9-graphql-with-react-query)
10. [Code Generators](#10-code-generators)
11. [Real-time Subscriptions](#11-real-time-subscriptions)
12. [GraphQL vs REST](#12-graphql-vs-rest)
13. [Best Practices](#13-best-practices)

---

## 1. What is GraphQL from a Frontend Perspective?

GraphQL lets the frontend **control exactly what data it receives**.

**REST problems:** over-fetching (all 20 fields when you need 2), under-fetching (3 calls for user + posts + comments), fixed response shapes.

**GraphQL solution:** ask for exactly what you need, get it in one request.

```graphql
# Homepage — minimal data
{ user(id: 1) { name, avatar } }

# Profile — full data with relations
{
  user(id: 1) {
    name
    avatar
    email
    bio
    posts { title, createdAt }
    followers { name }
  }
}
```

**Benefits:** No waiting for backend endpoints, no over/under-fetching, self-documenting API, strong typing, great TypeScript integration.

---

## 2. Apollo Client Setup

```bash
npm install @apollo/client graphql
```

```tsx
// src/lib/apollo.ts
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.example.com/graphql',
  cache: new InMemoryCache(),
  headers: { authorization: `Bearer ${token}` },
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

**Key hooks:** `useQuery` (fetch), `useMutation` (create/update/delete), `useSubscription` (real-time). Includes automatic caching, optimistic UI, error handling, and browser DevTools.

---

## 3. Fetching Data with useQuery

```tsx
import { useQuery, gql } from '@apollo/client';

const GET_USERS = gql`
  query GetUsers {
    users { id, name, email, avatar }
  }
`;

function UserList() {
  const { data, loading, error } = useQuery(GET_USERS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <ul>
      {data.users.map((user) => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```

**With variables:**

```tsx
const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) { name, email, posts { title } }
  }
`;

const { data } = useQuery(GET_USER, { variables: { id: userId } });
```

**Useful options:**

```tsx
const { data, refetch } = useQuery(GET_USERS, {
  pollInterval: 5000,          // Refetch every 5s
  fetchPolicy: 'cache-first',  // Use cache if available
  skip: !isAuthenticated,      // Skip conditionally
});
```

---

## 4. Sending Data with useMutation

```tsx
const CREATE_USER = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) { id, name, email }
  }
`;

function CreateUserForm() {
  const [createUser, { loading, error }] = useMutation(CREATE_USER);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createUser({
      variables: { input: { name: 'Anwar', email: 'anwar@example.com', password: 'secret123' } },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create User'}</button>
      {error && <p>Error: {error.message}</p>}
    </form>
  );
}
```

**Update cache after mutation:**

```tsx
const [createPost] = useMutation(CREATE_POST, {
  update(cache, { data: { createPost } }) {
    const existing = cache.readQuery({ query: GET_POSTS });
    cache.writeQuery({
      query: GET_POSTS,
      data: { posts: [createPost, ...existing.posts] },
    });
  },
});
```

**Optimistic UI:**

```tsx
const [toggleLike] = useMutation(TOGGLE_LIKE, {
  optimisticResponse: {
    toggleLike: { id: postId, liked: !currentlyLiked, likesCount: currentlyLiked ? likesCount - 1 : likesCount + 1, __typename: 'Post' },
  },
});
```

---

## 5. Apollo Cache

Apollo automatically caches query results using a **normalized cache** (keyed by `id` + `__typename`).

**Fetch policies:**

| Policy | Behavior |
|--------|----------|
| `cache-first` (default) | Cache first, network if missing |
| `network-only` | Always network, skip cache reads |
| `cache-and-network` | Cache immediately, then update from network |
| `no-cache` | Never read/write cache |
| `cache-only` | Only cache, never network |

```tsx
const { data } = useQuery(GET_USERS, { fetchPolicy: 'cache-and-network' });
```

---

## 6. Loading and Error States

```tsx
function UserList() {
  const { data, loading, error, refetch } = useQuery(GET_USERS);
  if (loading) return <Spinner />;
  if (error) return (
    <div>
      <p>Something went wrong: {error.message}</p>
      <button onClick={() => refetch()}>Try Again</button>
    </div>
  );
  return <ul>{data.users.map((u) => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

**Global error handling:**

```tsx
import { onError } from '@apollo/client/link/error';

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ extensions }) => {
      if (extensions?.code === 'UNAUTHENTICATED') window.location.href = '/login';
    });
  }
});

const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
});
```

---

## 7. Fragments

Reuse field sets across queries:

```tsx
const USER_FIELDS = gql`
  fragment UserFields on User { id, name, email, avatar }
`;

const GET_USERS = gql`
  ${USER_FIELDS}
  query GetUsers { users { ...UserFields } }
`;

const GET_POST = gql`
  ${USER_FIELDS}
  query GetPost($id: ID!) {
    post(id: $id) { title, body, author { ...UserFields } }
  }
`;
```

---

## 8. Pagination

**Offset-based:**

```tsx
const { data, fetchMore } = useQuery(GET_POSTS, { variables: { offset: 0, limit: 10 } });

const loadMore = () => fetchMore({
  variables: { offset: data.posts.length },
  updateQuery: (prev, { fetchMoreResult }) => ({
    posts: [...prev.posts, ...fetchMoreResult.posts],
  }),
});
```

**Cursor-based (recommended for infinite scroll):**

```tsx
const { data, fetchMore } = useQuery(GET_POSTS, { variables: { first: 10 } });

const loadMore = () => fetchMore({
  variables: { after: data.posts.pageInfo.endCursor },
});
```

---

## 9. GraphQL with React Query

No need for Apollo — use React Query with a simple fetch wrapper:

```tsx
// src/lib/graphql.ts
export async function graphqlFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const response = await fetch('https://api.example.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({ query, variables }),
  });
  const { data, errors } = await response.json();
  if (errors) throw new Error(errors[0].message);
  return data;
}

// Usage
const { data, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: () => graphqlFetch(GET_USERS),
});
```

**Apollo vs React Query:** Apollo has normalized cache, optimistic UI, subscriptions built-in (heavier). React Query is lighter, general-purpose, works with any data source.

---

## 10. Code Generators

Auto-generate TypeScript types and typed hooks from your GraphQL schema.

```bash
npm install -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations @graphql-codegen/typescript-react-apollo
```

```typescript
// codegen.ts
const config: CodegenConfig = {
  schema: 'https://api.example.com/graphql',
  documents: 'src/**/*.graphql',
  generates: {
    'src/generated/graphql.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
    },
  },
};
```

```tsx
// Use generated typed hooks — fully type-safe
import { useGetUsersQuery } from '@/generated/graphql';
const { data, loading } = useGetUsersQuery(); // data.users is typed as User[]
```

---

## 11. Real-time Subscriptions

```tsx
import { split, HttpLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

const wsLink = new GraphQLWsLink(createClient({ url: 'wss://api.example.com/graphql' }));
const httpLink = new HttpLink({ uri: 'https://api.example.com/graphql' });

// Route subscriptions to WebSocket, everything else to HTTP
const splitLink = split(
  ({ query }) => {
    const def = getMainDefinition(query);
    return def.kind === 'OperationDefinition' && def.operation === 'subscription';
  },
  wsLink,
  httpLink
);

// Usage
const { data } = useSubscription(MESSAGE_CREATED, { variables: { chatId } });
```

Use for **chat, notifications, live dashboards** — not regular data fetching.

---

## 12. GraphQL vs REST

| Aspect | REST | GraphQL |
|--------|------|---------|
| Requests per page | Multiple endpoints | One request |
| Data shape | Server decides | Client decides |
| Over-fetching | Common | Never |
| Adding fields | Backend change needed | Frontend can request if in schema |
| Caching | Easy (URL-based) | Needs client library |

**Use GraphQL** for complex views, mobile apps, deep relationships, strong typing. **Use REST** for simple apps, existing APIs, straightforward data needs.

---

## 13. Best Practices

- **Queries:** Keep close to components, use fragments, use `.graphql` files for large projects.
- **Performance:** Use `cache-first` for stable data, `cache-and-network` for fresh data, paginate large lists, avoid deep nesting.
- **Type safety:** Use GraphQL Code Generator, never write response types manually.
- **Errors:** Always handle loading/error/empty states, use global error link for auth errors.
- **Cache:** Update cache or refetch after mutations, use optimistic responses for instant feedback.
- **Security:** Never expose sensitive data in queries, always send auth tokens, validate input before mutations.
