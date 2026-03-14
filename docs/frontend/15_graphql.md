# GraphQL for Frontend

A guide to using GraphQL on the frontend with React, Apollo Client, and related tools.

---

## 1. What is GraphQL from a Frontend Perspective?

- Ask for only the fields you need
- Combine multiple resources in one request
- Self-documenting, strongly typed API with great TypeScript integration
- Frontend can request new fields freely (if in schema) without backend changes

---

## 2. Apollo Client Setup

```bash
npm install @apollo/client graphql
```

```tsx
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.example.com/graphql',
  cache: new InMemoryCache(),
  headers: { authorization: `Bearer ${token}` },
});

function App() {
  return (
    <ApolloProvider client={client}>
      <MyApp />
    </ApolloProvider>
  );
}
```

Key hooks: `useQuery` (fetch), `useMutation` (write), `useSubscription` (real-time).

---

## 3. Fetching Data with useQuery

```tsx
import { useQuery, gql } from '@apollo/client';

const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) { id, name, email, posts { title } }
  }
`;

function UserProfile({ userId }) {
  const { data, loading, error, refetch } = useQuery(GET_USER, {
    variables: { id: userId },
    fetchPolicy: 'cache-and-network',
    skip: !userId,
  });
  if (loading) return <Spinner />;
  if (error) return <button onClick={() => refetch()}>Retry: {error.message}</button>;
  return <p>{data.user.name}</p>;
}
```

---

## 4. Sending Data with useMutation

```tsx
const CREATE_POST = gql`
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) { id, title }
  }
`;

function NewPost() {
  const [createPost, { loading, error }] = useMutation(CREATE_POST, {
    update(cache, { data: { createPost } }) {
      const existing = cache.readQuery({ query: GET_POSTS });
      cache.writeQuery({
        query: GET_POSTS,
        data: { posts: [createPost, ...existing.posts] },
      });
    },
    optimisticResponse: {
      createPost: { id: 'temp', title: 'Draft', __typename: 'Post' },
    },
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); createPost({ variables: { input: { title: 'Hello' } } }); }}>
      <button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Create'}</button>
      {error && <p>{error.message}</p>}
    </form>
  );
}
```

---

## 5. Apollo Cache

Apollo normalizes cache entries by `id` + `__typename`, so updating one object updates it everywhere.

**Fetch policies:**
- `cache-first` (default) — cache first, network if missing
- `cache-and-network` — cache immediately, then update from network
- `network-only` — always network, skip cache reads
- `no-cache` / `cache-only` — never write/read cache

**Global error handling:**

```tsx
import { onError } from '@apollo/client/link/error';

const errorLink = onError(({ graphQLErrors }) => {
  if (graphQLErrors?.some(e => e.extensions?.code === 'UNAUTHENTICATED')) {
    window.location.href = '/login';
  }
});

const client = new ApolloClient({ link: from([errorLink, httpLink]), cache: new InMemoryCache() });
```

---

## 6. Fragments and Pagination

**Fragments** — reuse field sets across queries:

```tsx
const USER_FIELDS = gql`fragment UserFields on User { id, name, email, avatar }`;

const GET_POST = gql`
  ${USER_FIELDS}
  query GetPost($id: ID!) {
    post(id: $id) { title, body, author { ...UserFields } }
  }
`;
```

**Cursor-based pagination:**

```tsx
const { data, fetchMore } = useQuery(GET_POSTS, { variables: { first: 10 } });

const loadMore = () => fetchMore({
  variables: { after: data.posts.pageInfo.endCursor },
});
```

---

## 7. GraphQL with React Query

Use React Query with a lightweight fetch wrapper instead of Apollo:

```tsx
export async function graphqlFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch('https://api.example.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
    body: JSON.stringify({ query, variables }),
  });
  const { data, errors } = await res.json();
  if (errors) throw new Error(errors[0].message);
  return data;
}

const { data, isLoading } = useQuery({ queryKey: ['users'], queryFn: () => graphqlFetch(GET_USERS) });
```

Apollo has normalized cache, optimistic UI, and subscriptions built-in but is heavier. React Query is lighter and works with any data source.

---

## 8. Code Generators

Auto-generate TypeScript types and typed hooks from your schema:

```bash
npm install -D @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-react-apollo
```

```tsx
import { useGetUsersQuery } from '@/generated/graphql';
const { data } = useGetUsersQuery(); // data.users typed as User[]
```

---

## 9. Real-time Subscriptions

```tsx
import { split, HttpLink } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

const wsLink = new GraphQLWsLink(createClient({ url: 'wss://api.example.com/graphql' }));
const httpLink = new HttpLink({ uri: 'https://api.example.com/graphql' });

const splitLink = split(
  ({ query }) => {
    const def = getMainDefinition(query);
    return def.kind === 'OperationDefinition' && def.operation === 'subscription';
  },
  wsLink,
  httpLink
);

const { data } = useSubscription(MESSAGE_CREATED, { variables: { chatId } });
```

Use for chat, notifications, and live dashboards — not regular data fetching.

---

## 10. GraphQL vs REST & Best Practices

| | REST | GraphQL |
|---|---|---|
| Requests per page | Multiple | One |
| Data shape | Server decides | Client decides |
| Over-fetching | Common | Never |
| Caching | URL-based (built-in) | Needs client library |

Use GraphQL for complex views, mobile apps, deep relations, and strong typing. Use REST for simple apps or existing APIs.

**Best Practices:**
- Keep queries close to components; use fragments to avoid duplication
- Use `cache-first` for stable data, `cache-and-network` for fresh data
- Always paginate large lists; avoid deeply nested queries
- Use GraphQL Code Generator — never write response types manually
- Always handle loading, error, and empty states
- Update cache or use optimistic responses after mutations for instant feedback
