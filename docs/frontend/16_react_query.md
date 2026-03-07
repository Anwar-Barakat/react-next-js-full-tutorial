# TanStack Query (React Query) Guide

A comprehensive guide to TanStack Query (formerly React Query), the powerful data-fetching and server state management library for React.

---

## Table of Contents

1. [What is TanStack Query (React Query)?](#1-what-is-tanstack-query-react-query)
2. [Setup and Configuration](#2-setup-and-configuration)
3. [Fetching Data with useQuery](#3-fetching-data-with-usequery)
4. [What is Stale-While-Revalidate?](#4-what-is-stale-while-revalidate)
5. [Mutations with useMutation](#5-mutations-with-usemutation)
6. [Query Invalidation](#6-query-invalidation)
7. [Optimistic Updates](#7-optimistic-updates)
8. [Infinite Queries with useInfiniteQuery](#8-infinite-queries-with-useinfinitequery)
9. [Pagination with React Query](#9-pagination-with-react-query)
10. [Dependent Queries](#10-dependent-queries)
11. [Query Prefetching](#11-query-prefetching)
12. [React Query DevTools](#12-react-query-devtools)
13. [React Query vs SWR vs Redux](#13-react-query-vs-swr-vs-redux)
14. [Best Practices](#14-best-practices)

---

## 1. What is TanStack Query (React Query)?

**TanStack Query** is a data-fetching and server state management library for React (and other frameworks). It was originally called **React Query** and was renamed to TanStack Query in v4 to support multiple frameworks.

**The problem it solves:**
- Fetching data in React is tedious — you need `useEffect`, `useState` for loading/error/data, cleanup logic, and caching by hand.
- Every component that fetches data ends up with the same boilerplate pattern.
- There is no built-in way to cache, deduplicate, or automatically refetch stale data.
- Keeping server data in sync with the UI is error-prone and complex.

**Without React Query (the painful way):**

```tsx
import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isCancelled = false;

    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        if (!isCancelled) {
          setUsers(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (!isCancelled) {
          setError(err);
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

**With React Query (the clean way):**

```tsx
import { useQuery } from "@tanstack/react-query";

interface User {
  id: number;
  name: string;
  email: string;
}

function Users() {
  const { data: users, isLoading, error } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => fetch("/api/users").then((res) => res.json()),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {users?.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

**Server state vs client state:**
- **Server state** is data that lives on the server and is fetched asynchronously — users, posts, products, orders. It can become stale, can be modified by other users, and needs synchronization.
- **Client state** is data that lives entirely in the browser — UI toggles, form inputs, selected tabs, theme preference. It is synchronous and fully controlled by the user.
- React Query manages **server state**. Libraries like Zustand, Redux, or Context API manage **client state**.
- Mixing server state into Redux or Context is a common mistake — it leads to stale data, manual refetching logic, and unnecessary complexity.

**What React Query gives you out of the box:**
- Automatic caching and cache invalidation
- Background refetching when data becomes stale
- Request deduplication (multiple components using the same query make only one request)
- Automatic retries on failure
- Window focus refetching (data refreshes when the user returns to the tab)
- Pagination and infinite scroll support
- Optimistic updates
- DevTools for debugging

---

## 2. Setup and Configuration

**Installation:**

```bash
npm install @tanstack/react-query
```

**Basic setup with QueryClient and QueryClientProvider:**

```tsx
// main.tsx or App.tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a QueryClient instance
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
    </QueryClientProvider>
  );
}

export default App;
```

**Key points about setup:**
- `QueryClient` holds the cache and manages all queries and mutations.
- `QueryClientProvider` makes the client available to all child components via React context.
- You should create the `QueryClient` **outside** the component (or use `useState` / `useRef`) to avoid re-creating it on every render.

**Configuring default options:**

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes — data stays fresh for 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes — unused cache is garbage collected after 30 minutes
      retry: 3, // retry failed requests 3 times
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // exponential backoff
      refetchOnWindowFocus: true, // refetch when the user returns to the tab
      refetchOnReconnect: true, // refetch when the network reconnects
      refetchOnMount: true, // refetch when the component mounts
    },
    mutations: {
      retry: 1, // retry failed mutations once
    },
  },
});
```

**Next.js App Router setup (important difference):**

```tsx
// app/providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  // Use useState to ensure each request gets its own QueryClient in SSR
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

```tsx
// app/layout.tsx
import Providers from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

**Why `useState` for QueryClient in Next.js:**
- In the App Router, components can render on the server.
- Creating the client at module level would share the cache across all users/requests on the server.
- Using `useState` ensures each client-side render gets its own isolated client.

---

## 3. Fetching Data with useQuery

`useQuery` is the primary hook for fetching and caching data.

**Basic usage:**

```tsx
import { useQuery } from "@tanstack/react-query";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

function Posts() {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    isSuccess,
    status,
    refetch,
  } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: async () => {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts");
      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }
      return response.json();
    },
  });

  if (isLoading) return <p>Loading posts...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div>
      {isFetching && <span>Updating...</span>}
      {data?.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </article>
      ))}
    </div>
  );
}
```

**Understanding queryKey:**
- The `queryKey` is an array that uniquely identifies the query in the cache.
- React Query uses this key for caching, refetching, and deduplication.
- Keys are serialized deterministically, so `["posts", { page: 1 }]` and `["posts", { page: 1 }]` are the same.
- When the key changes, React Query fetches new data automatically.

```tsx
// Simple key
useQuery({ queryKey: ["posts"], queryFn: fetchPosts });

// Key with a variable — refetches when userId changes
useQuery({ queryKey: ["posts", userId], queryFn: () => fetchPostsByUser(userId) });

// Key with an object — useful for filters
useQuery({
  queryKey: ["posts", { status: "published", page: 2 }],
  queryFn: () => fetchPosts({ status: "published", page: 2 }),
});

// Nested key — for a specific resource
useQuery({
  queryKey: ["users", userId, "posts"],
  queryFn: () => fetchUserPosts(userId),
});
```

**Understanding queryFn:**
- The `queryFn` is the function that actually fetches the data.
- It must return a promise that resolves with the data or throws an error.
- React Query does **not** treat 4xx/5xx responses as errors by default when using `fetch` — you must throw manually.

```tsx
// WRONG — fetch does not throw on HTTP errors
queryFn: () => fetch("/api/posts").then((res) => res.json())

// CORRECT — check the response status
queryFn: async () => {
  const res = await fetch("/api/posts");
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  return res.json();
}

// Using axios (throws automatically on non-2xx)
queryFn: () => axios.get<Post[]>("/api/posts").then((res) => res.data)
```

**Key options explained:**

- **`staleTime`** — How long data is considered fresh (default: `0`). While fresh, React Query serves from cache and does **not** refetch.
- **`gcTime`** (formerly `cacheTime` in v4) — How long unused/inactive cache data is kept in memory before being garbage collected (default: 5 minutes).
- **`enabled`** — Whether the query should run automatically. Set to `false` to disable automatic fetching — useful for dependent queries or manual triggers.
- **`refetchOnWindowFocus`** — Refetch when the browser tab regains focus (default: `true`).
- **`refetchOnMount`** — Refetch when the component mounts (default: `true`).
- **`refetchOnReconnect`** — Refetch when the network reconnects (default: `true`).
- **`refetchInterval`** — Automatically refetch at a specified interval in milliseconds. Useful for polling.
- **`retry`** — Number of times to retry a failed query (default: `3`).
- **`select`** — Transform or select a subset of the data returned by `queryFn`.
- **`placeholderData`** — Data to show while the real data is loading (not stored in cache).

```tsx
// Example with multiple options
const { data: user } = useQuery<User>({
  queryKey: ["user", userId],
  queryFn: () => fetchUser(userId),
  staleTime: 1000 * 60 * 10, // fresh for 10 minutes
  gcTime: 1000 * 60 * 60, // keep in cache for 1 hour
  enabled: !!userId, // only fetch when userId is truthy
  refetchInterval: 1000 * 30, // poll every 30 seconds
  retry: 2, // retry twice on failure
  select: (data) => ({ name: data.name, email: data.email }), // only use name and email
});
```

**Difference between isLoading and isFetching:**
- `isLoading` is `true` only on the **first** load (when there is no cached data yet).
- `isFetching` is `true` whenever a request is in flight, including background refetches.
- Use `isLoading` for initial loading spinners. Use `isFetching` for subtle "updating" indicators.

**Creating a reusable query hook (recommended pattern):**

```tsx
// hooks/useUsers.ts
import { useQuery } from "@tanstack/react-query";

interface User {
  id: number;
  name: string;
  email: string;
}

async function fetchUsers(): Promise<User[]> {
  const response = await fetch("/api/users");
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
}

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUser(userId: number) {
  return useQuery<User>({
    queryKey: ["users", userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch user");
      }
      return response.json();
    },
    enabled: !!userId,
  });
}
```

---

## 4. What is Stale-While-Revalidate?

**Stale-While-Revalidate (SWR)** is a caching strategy that React Query uses as its core mechanism.

**How it works:**
- When you fetch data, it is stored in the cache and marked as **fresh**.
- After the `staleTime` expires, the data is marked as **stale**.
- When stale data is requested (e.g., the component remounts or the window regains focus), React Query **immediately returns the stale data** from the cache and **simultaneously refetches** fresh data in the background.
- Once the fresh data arrives, the UI updates seamlessly.

**The lifecycle of a query:**

- **Fresh** — Data is within `staleTime`. Served from cache, no refetch happens.
- **Stale** — Data is past `staleTime`. Served from cache immediately, but a background refetch is triggered.
- **Fetching** — A network request is in progress (either initial or background refetch).
- **Inactive** — No component is using this query. Cache is kept for `gcTime`, then garbage collected.

**Visual timeline example:**

```
User visits page -> Cache is empty -> Fetch from server -> Show data (fresh)
                                                            |
                                                      staleTime expires
                                                            |
User navigates away and comes back -> Show stale data instantly -> Refetch in background -> Update UI
                                                                                            |
                                                                                      staleTime resets
```

**Why it matters for UX:**
- The user **never sees a loading spinner** for data they have already seen — they see the cached version immediately.
- The data is still updated behind the scenes, so they always end up with fresh data.
- This creates a **fast, responsive feel** even when the network is slow.
- It eliminates the jarring flash of loading states when navigating between pages.

**Controlling staleness:**

```tsx
// Data is always stale (default) — refetches on every mount/focus
useQuery({
  queryKey: ["posts"],
  queryFn: fetchPosts,
  staleTime: 0,
});

// Data stays fresh for 5 minutes — no refetching within that window
useQuery({
  queryKey: ["posts"],
  queryFn: fetchPosts,
  staleTime: 1000 * 60 * 5,
});

// Data is always fresh — never automatically refetches
useQuery({
  queryKey: ["posts"],
  queryFn: fetchPosts,
  staleTime: Infinity,
});
```

**Common mistake:**
- Setting `staleTime: 0` (the default) means every mount triggers a refetch. This is correct for rapidly changing data but wasteful for mostly-static data.
- For data that changes rarely (user profile, settings, categories), set a longer `staleTime`.

---

## 5. Mutations with useMutation

`useMutation` is used for creating, updating, and deleting data on the server.

**Key differences from useQuery:**
- Mutations are **not automatic** — they do not run on mount. You call them manually.
- Mutations are **not cached** — they represent side effects, not read operations.
- Mutations provide callbacks like `onSuccess`, `onError`, and `onSettled` for handling outcomes.

**Basic mutation:**

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface CreatePostData {
  title: string;
  body: string;
  userId: number;
}

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

function CreatePost() {
  const queryClient = useQueryClient();

  const mutation = useMutation<Post, Error, CreatePostData>({
    mutationFn: async (newPost) => {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });
      if (!response.ok) {
        throw new Error("Failed to create post");
      }
      return response.json();
    },
    onSuccess: (data) => {
      console.log("Post created:", data);
      // Invalidate the posts query so it refetches
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      console.error("Error creating post:", error.message);
    },
    onSettled: () => {
      // Runs after either success or error — good for cleanup
      console.log("Mutation finished");
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    mutation.mutate({
      title: formData.get("title") as string,
      body: formData.get("body") as string,
      userId: 1,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="title" placeholder="Title" required />
      <textarea name="body" placeholder="Body" required />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Creating..." : "Create Post"}
      </button>
      {mutation.isError && <p>Error: {mutation.error.message}</p>}
      {mutation.isSuccess && <p>Post created successfully!</p>}
    </form>
  );
}
```

**Update mutation:**

```tsx
interface UpdatePostData {
  id: number;
  title: string;
  body: string;
}

function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation<Post, Error, UpdatePostData>({
    mutationFn: async ({ id, ...data }) => {
      const response = await fetch(`/api/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to update post");
      }
      return response.json();
    },
    onSuccess: (data, variables) => {
      // Update the specific post in cache
      queryClient.setQueryData(["posts", variables.id], data);
      // Invalidate the posts list
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
```

**Delete mutation:**

```tsx
function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (postId) => {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete post");
      }
    },
    onSuccess: (_data, postId) => {
      // Remove the specific post from cache
      queryClient.removeQueries({ queryKey: ["posts", postId] });
      // Invalidate the posts list
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
```

**Using mutateAsync for promise-based control:**

```tsx
const mutation = useMutation({
  mutationFn: createPost,
});

// mutate — fire and forget, uses callbacks
mutation.mutate(newPost, {
  onSuccess: (data) => {
    // per-call callback (in addition to the one defined in useMutation)
  },
});

// mutateAsync — returns a promise, can be awaited
try {
  const result = await mutation.mutateAsync(newPost);
  console.log("Created:", result);
} catch (error) {
  console.error("Failed:", error);
}
```

**Mutation states:**
- `mutation.isPending` — the mutation is currently running
- `mutation.isSuccess` — the mutation completed successfully
- `mutation.isError` — the mutation failed
- `mutation.isIdle` — the mutation has not been triggered yet
- `mutation.reset()` — resets the mutation back to its idle state

---

## 6. Query Invalidation

**Query invalidation** tells React Query that certain cached data is no longer valid and should be refetched.

**Why invalidation matters:**
- After a mutation (create, update, delete), the cached data is outdated.
- Invalidation triggers a background refetch so the UI shows the latest data.
- Without invalidation, users would see stale data until they manually refresh.

**Basic invalidation:**

```tsx
import { useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();

// Invalidate a specific query
queryClient.invalidateQueries({ queryKey: ["posts"] });

// Invalidate a specific post
queryClient.invalidateQueries({ queryKey: ["posts", 42] });

// Invalidate all queries that start with "posts"
// This matches ["posts"], ["posts", 1], ["posts", { page: 2 }], etc.
queryClient.invalidateQueries({ queryKey: ["posts"] });

// Invalidate everything
queryClient.invalidateQueries();
```

**How invalidation works internally:**
- The query is marked as **stale** immediately.
- If a component is currently using that query, it triggers a background **refetch** right away.
- If no component is using the query, it will refetch the next time a component subscribes to it.

**Invalidation after mutations (the standard pattern):**

```tsx
const queryClient = useQueryClient();

const createPost = useMutation({
  mutationFn: async (newPost: CreatePostData) => {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    });
    return res.json();
  },
  onSuccess: () => {
    // After creating a post, refetch the posts list
    queryClient.invalidateQueries({ queryKey: ["posts"] });
    // Also refetch the user's post count
    queryClient.invalidateQueries({ queryKey: ["users", "me", "stats"] });
  },
});
```

**Direct cache updates with setQueryData:**

Sometimes you already have the new data (from the mutation response) and can update the cache directly without refetching:

```tsx
const updatePost = useMutation({
  mutationFn: async (updatedPost: Post) => {
    const res = await fetch(`/api/posts/${updatedPost.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPost),
    });
    return res.json();
  },
  onSuccess: (data: Post) => {
    // Directly update the single post in cache
    queryClient.setQueryData(["posts", data.id], data);

    // Update the post within the posts list
    queryClient.setQueryData<Post[]>(["posts"], (oldPosts) => {
      if (!oldPosts) return [data];
      return oldPosts.map((post) => (post.id === data.id ? data : post));
    });
  },
});
```

**Invalidation vs setQueryData:**
- Use `invalidateQueries` when you want the server to be the source of truth — simpler and safer.
- Use `setQueryData` when you already have the exact data and want to avoid an extra network request.
- You can combine both — update the cache immediately with `setQueryData` and then `invalidateQueries` as a safety net.

---

## 7. Optimistic Updates

**Optimistic updates** update the UI immediately before the server responds, assuming the mutation will succeed. If it fails, the changes are rolled back.

**Why use optimistic updates:**
- The UI feels **instant** — no waiting for the server.
- Common for actions like liking a post, toggling a favorite, or updating a todo.
- Creates a more responsive user experience.

**Full optimistic update pattern:**

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

function useToggleTodo() {
  const queryClient = useQueryClient();

  return useMutation<Todo, Error, Todo>({
    mutationFn: async (todo) => {
      const response = await fetch(`/api/todos/${todo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      if (!response.ok) throw new Error("Failed to update todo");
      return response.json();
    },

    // Called BEFORE the mutation function
    onMutate: async (updatedTodo) => {
      // 1. Cancel any outgoing refetches so they don't overwrite the optimistic update
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      // 2. Snapshot the previous value (for rollback)
      const previousTodos = queryClient.getQueryData<Todo[]>(["todos"]);

      // 3. Optimistically update the cache
      queryClient.setQueryData<Todo[]>(["todos"], (old) =>
        old?.map((todo) =>
          todo.id === updatedTodo.id
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      );

      // 4. Return the snapshot as context for rollback
      return { previousTodos };
    },

    // If the mutation fails, roll back to the snapshot
    onError: (_error, _variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(["todos"], context.previousTodos);
      }
    },

    // Always refetch after success or error to ensure server state is in sync
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}
```

**Using it in a component:**

```tsx
function TodoItem({ todo }: { todo: Todo }) {
  const toggleTodo = useToggleTodo();

  return (
    <li>
      <label>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo.mutate(todo)}
        />
        <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
          {todo.title}
        </span>
      </label>
    </li>
  );
}
```

**Optimistic update for adding an item:**

```tsx
function useAddTodo() {
  const queryClient = useQueryClient();

  return useMutation<Todo, Error, { title: string }>({
    mutationFn: async (newTodo) => {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo),
      });
      return res.json();
    },

    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      const previousTodos = queryClient.getQueryData<Todo[]>(["todos"]);

      // Add a temporary todo with a fake ID
      const optimisticTodo: Todo = {
        id: Date.now(), // temporary ID
        title: newTodo.title,
        completed: false,
      };

      queryClient.setQueryData<Todo[]>(["todos"], (old) =>
        old ? [...old, optimisticTodo] : [optimisticTodo]
      );

      return { previousTodos };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(["todos"], context.previousTodos);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
}
```

**Important notes on optimistic updates:**
- Always cancel outgoing queries first (`cancelQueries`) to prevent race conditions.
- Always save the previous state for rollback.
- Always invalidate in `onSettled` to sync with the server regardless of success or failure.
- Use optimistic updates only for simple, predictable mutations. For complex operations (e.g., creating a resource that generates related data on the server), prefer waiting for the server response.

---

## 8. Infinite Queries with useInfiniteQuery

`useInfiniteQuery` is designed for infinite scroll and "load more" patterns where data is fetched in pages.

**Basic infinite query:**

```tsx
import { useInfiniteQuery } from "@tanstack/react-query";

interface Post {
  id: number;
  title: string;
  body: string;
}

interface PostsResponse {
  posts: Post[];
  nextCursor: number | null;
  totalCount: number;
}

function InfinitePostList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery<PostsResponse>({
    queryKey: ["posts", "infinite"],
    queryFn: async ({ pageParam }) => {
      const response = await fetch(`/api/posts?cursor=${pageParam}&limit=10`);
      if (!response.ok) throw new Error("Failed to fetch posts");
      return response.json();
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data?.pages.map((page, pageIndex) => (
        <div key={pageIndex}>
          {page.posts.map((post) => (
            <article key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </article>
          ))}
        </div>
      ))}

      <button
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? "Loading more..."
          : hasNextPage
          ? "Load More"
          : "No more posts"}
      </button>
    </div>
  );
}
```

**Key options for useInfiniteQuery:**
- **`initialPageParam`** — The parameter for the first page (required in v5).
- **`getNextPageParam`** — A function that receives the last page and returns the parameter for the next page. Return `undefined` to signal there are no more pages.
- **`getPreviousPageParam`** — Same as above, but for fetching previous pages (bidirectional infinite scroll).
- **`maxPages`** — Limit the number of pages stored in cache (useful for memory management).

**Understanding the data structure:**

```tsx
// data.pages is an array of all fetched pages
// data.pageParams is an array of all page parameters used
console.log(data?.pages);
// [
//   { posts: [...10 posts], nextCursor: 10 },  // page 0
//   { posts: [...10 posts], nextCursor: 20 },  // page 1
//   { posts: [...10 posts], nextCursor: null }, // page 2 (last page)
// ]

// Flatten all posts from all pages
const allPosts = data?.pages.flatMap((page) => page.posts) ?? [];
```

**Infinite scroll with Intersection Observer:**

```tsx
import { useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

function InfiniteScrollPosts() {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery<PostsResponse>({
      queryKey: ["posts", "infinite"],
      queryFn: async ({ pageParam }) => {
        const res = await fetch(`/api/posts?cursor=${pageParam}&limit=10`);
        return res.json();
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    });

  // Automatically fetch the next page when the sentinel element becomes visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const el = loadMoreRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      {data?.pages.map((page, i) => (
        <div key={i}>
          {page.posts.map((post) => (
            <article key={post.id}>
              <h3>{post.title}</h3>
            </article>
          ))}
        </div>
      ))}

      {/* Sentinel element — triggers loading when scrolled into view */}
      <div ref={loadMoreRef} style={{ height: 20 }}>
        {isFetchingNextPage && <p>Loading more...</p>}
      </div>
    </div>
  );
}
```

**Bidirectional infinite scroll (fetch previous pages too):**

```tsx
const { data, fetchNextPage, fetchPreviousPage, hasPreviousPage } =
  useInfiniteQuery<PostsResponse>({
    queryKey: ["posts", "infinite"],
    queryFn: async ({ pageParam }) => {
      const res = await fetch(`/api/posts?cursor=${pageParam}&limit=10`);
      return res.json();
    },
    initialPageParam: 50, // start in the middle
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    getPreviousPageParam: (firstPage) => firstPage.prevCursor ?? undefined,
  });
```

---

## 9. Pagination with React Query

For traditional page-based navigation (page 1, 2, 3...), use `useQuery` with the page number in the query key.

**Basic pagination:**

```tsx
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";

interface PaginatedResponse {
  data: Post[];
  total: number;
  page: number;
  totalPages: number;
}

function PaginatedPosts() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, isPlaceholderData } =
    useQuery<PaginatedResponse>({
      queryKey: ["posts", "paginated", page],
      queryFn: async () => {
        const res = await fetch(`/api/posts?page=${page}&limit=10`);
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      },
      placeholderData: keepPreviousData, // keep showing old data while new page loads
    });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      {/* Show a subtle indicator when background-fetching new page */}
      <div style={{ opacity: isPlaceholderData ? 0.5 : 1 }}>
        {data?.data.map((post) => (
          <article key={post.id}>
            <h3>{post.title}</h3>
          </article>
        ))}
      </div>

      <div>
        <button
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </button>

        <span>
          Page {page} of {data?.totalPages}
        </span>

        <button
          onClick={() => {
            if (!isPlaceholderData && data && page < data.totalPages) {
              setPage((old) => old + 1);
            }
          }}
          disabled={isPlaceholderData || !data || page >= data.totalPages}
        >
          Next
        </button>
      </div>

      {isFetching && <span>Updating...</span>}
    </div>
  );
}
```

**Why `keepPreviousData` matters:**
- Without it, when the page changes, the old data disappears and a loading spinner shows until the new page loads.
- With `keepPreviousData`, the old page remains visible (with reduced opacity or a loading indicator) while the new page fetches in the background.
- This makes pagination feel smooth and prevents layout shifts.

**Prefetching the next page for instant navigation:**

```tsx
import { useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useEffect, useState } from "react";

function PaginatedPostsWithPrefetch() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isPlaceholderData } = useQuery<PaginatedResponse>({
    queryKey: ["posts", "paginated", page],
    queryFn: () => fetchPosts(page),
    placeholderData: keepPreviousData,
  });

  // Prefetch the next page
  useEffect(() => {
    if (data && page < data.totalPages) {
      queryClient.prefetchQuery({
        queryKey: ["posts", "paginated", page + 1],
        queryFn: () => fetchPosts(page + 1),
      });
    }
  }, [data, page, queryClient]);

  // ... rest of the component
}
```

---

## 10. Dependent Queries

**Dependent queries** are queries that depend on the result of another query. They use the `enabled` option to wait until the required data is available.

**Basic dependent query:**

```tsx
interface User {
  id: number;
  name: string;
  teamId: number;
}

interface Team {
  id: number;
  name: string;
  members: string[];
}

function UserTeam({ userId }: { userId: number }) {
  // First query — fetch the user
  const {
    data: user,
    isLoading: isLoadingUser,
  } = useQuery<User>({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
  });

  // Second query — fetch the team, but ONLY after we have the user's teamId
  const {
    data: team,
    isLoading: isLoadingTeam,
  } = useQuery<Team>({
    queryKey: ["team", user?.teamId],
    queryFn: () => fetchTeam(user!.teamId),
    enabled: !!user?.teamId, // only runs when user.teamId is available
  });

  if (isLoadingUser) return <p>Loading user...</p>;
  if (isLoadingTeam) return <p>Loading team...</p>;

  return (
    <div>
      <h2>{user?.name}</h2>
      <p>Team: {team?.name}</p>
      <ul>
        {team?.members.map((member) => (
          <li key={member}>{member}</li>
        ))}
      </ul>
    </div>
  );
}
```

**Chaining multiple dependent queries:**

```tsx
function OrderDetails({ orderId }: { orderId: number }) {
  // Step 1: Fetch the order
  const { data: order } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => fetchOrder(orderId),
  });

  // Step 2: Fetch the customer (depends on order)
  const { data: customer } = useQuery({
    queryKey: ["customer", order?.customerId],
    queryFn: () => fetchCustomer(order!.customerId),
    enabled: !!order?.customerId,
  });

  // Step 3: Fetch the customer's address (depends on customer)
  const { data: address } = useQuery({
    queryKey: ["address", customer?.addressId],
    queryFn: () => fetchAddress(customer!.addressId),
    enabled: !!customer?.addressId,
  });

  // Each query runs only when its dependency is ready
  return (
    <div>
      <p>Order: {order?.id}</p>
      <p>Customer: {customer?.name}</p>
      <p>Address: {address?.street}, {address?.city}</p>
    </div>
  );
}
```

**Conditional fetching (not just dependencies):**

```tsx
function SearchResults({ query }: { query: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: () => searchAPI(query),
    enabled: query.length >= 3, // only search when the user has typed 3+ characters
  });

  if (!query) return <p>Start typing to search...</p>;
  if (query.length < 3) return <p>Type at least 3 characters...</p>;
  if (isLoading) return <p>Searching...</p>;

  return (
    <ul>
      {data?.map((result: { id: number; title: string }) => (
        <li key={result.id}>{result.title}</li>
      ))}
    </ul>
  );
}
```

---

## 11. Query Prefetching

**Prefetching** loads data into the cache before it is needed, making navigation feel instant.

**Prefetch on hover:**

```tsx
import { useQueryClient } from "@tanstack/react-query";

function PostList({ posts }: { posts: Post[] }) {
  const queryClient = useQueryClient();

  const prefetchPost = (postId: number) => {
    queryClient.prefetchQuery({
      queryKey: ["post", postId],
      queryFn: () => fetchPost(postId),
      staleTime: 1000 * 60 * 5, // only prefetch if data is older than 5 minutes
    });
  };

  return (
    <ul>
      {posts.map((post) => (
        <li
          key={post.id}
          onMouseEnter={() => prefetchPost(post.id)}
        >
          <a href={`/posts/${post.id}`}>{post.title}</a>
        </li>
      ))}
    </ul>
  );
}
```

**Prefetch on route navigation (React Router example):**

```tsx
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";

function Navigation() {
  const queryClient = useQueryClient();

  const prefetchDashboard = () => {
    queryClient.prefetchQuery({
      queryKey: ["dashboard", "stats"],
      queryFn: fetchDashboardStats,
    });
    queryClient.prefetchQuery({
      queryKey: ["dashboard", "recent-activity"],
      queryFn: fetchRecentActivity,
    });
  };

  return (
    <nav>
      <Link to="/dashboard" onMouseEnter={prefetchDashboard}>
        Dashboard
      </Link>
    </nav>
  );
}
```

**Prefetch in a loader (React Router v6.4+):**

```tsx
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();

// Route loader — runs before the component renders
export const postLoader = async ({ params }: { params: { postId: string } }) => {
  const postId = Number(params.postId);

  // ensureQueryData returns cached data if available, otherwise fetches
  await queryClient.ensureQueryData({
    queryKey: ["post", postId],
    queryFn: () => fetchPost(postId),
  });

  return null;
};
```

**Prefetch vs ensureQueryData:**
- `prefetchQuery` — Fetches in the background. Does not throw errors. Does not block rendering. Good for "nice to have" prefetching.
- `ensureQueryData` — Returns the data (from cache or fetch). Can be awaited. Good for loaders where you need data before rendering.

**Prefetch for infinite queries:**

```tsx
queryClient.prefetchInfiniteQuery({
  queryKey: ["posts", "infinite"],
  queryFn: ({ pageParam }) => fetchPosts(pageParam),
  initialPageParam: 0,
});
```

---

## 12. React Query DevTools

The DevTools provide a visual interface for inspecting all queries and mutations — their status, cache state, and timing.

**Installation:**

```bash
npm install @tanstack/react-query-devtools
```

**Setup:**

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      {/* DevTools — only included in development builds */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

**Key DevTools options:**
- `initialIsOpen` — Whether the DevTools panel starts open or closed (default: `false`).
- `buttonPosition` — Position of the toggle button: `"bottom-left"`, `"bottom-right"`, `"top-left"`, `"top-right"`.
- `position` — Position of the panel: `"bottom"`, `"top"`, `"left"`, `"right"`.

**What you can see in DevTools:**
- All active queries and their current status (fresh, stale, fetching, inactive).
- The cached data for each query.
- The query key for each query.
- How many observers (components) are subscribed to each query.
- When the data was last fetched.
- Error details for failed queries.
- Manual controls to refetch, invalidate, or remove queries.

**How to use DevTools for debugging:**
- Look for queries in the **stale** state when you expect them to be **fresh** — your `staleTime` might be too short.
- Check if a query has **0 observers** — it is inactive and will be garbage collected after `gcTime`.
- Look for queries that are **stuck in fetching** — your `queryFn` might not be resolving or rejecting.
- Use the **Data Explorer** to inspect the exact shape of cached data.
- Use the **Actions** panel to manually invalidate or refetch a query during development.

**Production builds:**
- By default, React Query DevTools are tree-shaken out of production builds.
- They are only included when `process.env.NODE_ENV === "development"`.
- You do not need to wrap them in a conditional — the library handles this automatically.

**Lazy loading DevTools (for large apps):**

```tsx
import { lazy, Suspense } from "react";

const ReactQueryDevtools = lazy(() =>
  import("@tanstack/react-query-devtools").then((mod) => ({
    default: mod.ReactQueryDevtools,
  }))
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <YourApp />
      <Suspense fallback={null}>
        <ReactQueryDevtools />
      </Suspense>
    </QueryClientProvider>
  );
}
```

---

## 13. React Query vs SWR vs Redux

**React Query (TanStack Query):**
- Purpose-built for **server state** management (fetching, caching, synchronization).
- Rich feature set: mutations, infinite queries, query invalidation, optimistic updates, prefetching.
- Automatic background refetching, retry logic, and deduplication out of the box.
- DevTools included for debugging.
- Larger API surface — more to learn, but more control.
- Framework-agnostic (supports React, Vue, Solid, Svelte, Angular).
- Active community and maintained by Tanner Linsley.
- Bundle size: ~13KB gzipped.

**SWR (by Vercel):**
- Also built for **server state**, created by the Next.js team.
- Simpler API — fewer features but easier to pick up.
- Uses the same stale-while-revalidate strategy.
- Good for simple data fetching needs.
- Mutations are more manual — no built-in `useMutation`, you handle POST/PUT/DELETE yourself and call `mutate()` to revalidate.
- No built-in DevTools.
- Focused primarily on React.
- Lighter weight — ~4KB gzipped.
- Best for: simpler apps, teams already using Next.js, projects where you do not need complex mutation handling.

**Redux (with RTK Query):**
- Originally designed for **client state** — UI state, app state, complex state machines.
- **RTK Query** (part of Redux Toolkit) adds server state management that competes with React Query.
- Steeper learning curve — actions, reducers, slices, middleware, selectors.
- Best when you have complex client state logic (multi-step forms, undo/redo, deeply nested state).
- Redux DevTools are mature and powerful.
- Large ecosystem and community.
- Bundle size: ~11KB gzipped (Redux Toolkit).
- Best for: large apps with complex client state, teams already using Redux.

**When to use each:**
- Use **React Query** when your app is primarily about fetching and displaying server data, and you need robust mutation handling, caching, and synchronization.
- Use **SWR** when you want a lightweight solution for simple data fetching without complex mutations.
- Use **Redux** when you have complex client-side state logic. Pair it with React Query for server state if needed.
- You can combine **React Query + Zustand** (or Jotai) for a lightweight stack: React Query for server state, Zustand for client state.

---

## 14. Best Practices

**Query key conventions:**
- Use an array format with a hierarchical structure: `["entity", id, "sub-entity"]`.
- Put the broadest identifier first: `["users", userId, "posts"]` not `["posts", "by-user", userId]`.
- Include all variables that affect the result: `["posts", { status, page, sort }]`.
- Create query key factories for consistency across the codebase.

```tsx
// query-keys.ts — centralized query key factory
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  list: (filters: UserFilters) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, "detail"] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
};

export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (filters: PostFilters) => [...postKeys.lists(), filters] as const,
  details: () => [...postKeys.all, "detail"] as const,
  detail: (id: number) => [...postKeys.details(), id] as const,
};

// Usage
useQuery({ queryKey: userKeys.detail(userId), queryFn: ... });
queryClient.invalidateQueries({ queryKey: userKeys.lists() });
```

**Error handling:**
- Always check `response.ok` when using `fetch` — React Query does not auto-throw on HTTP errors.
- Use error boundaries for unexpected errors and inline error UI for expected ones.
- Provide user-friendly error messages, not raw server errors.
- Consider using an `onError` global callback on the `QueryClient` for logging or toast notifications.

```tsx
// Global error handler
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Don't retry on 404s
        if (error instanceof Error && error.message.includes("404")) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});
```

**Error boundary integration:**

```tsx
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";

function App() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          onReset={reset}
          fallbackRender={({ resetErrorBoundary, error }) => (
            <div>
              <p>Something went wrong: {error.message}</p>
              <button onClick={resetErrorBoundary}>Try again</button>
            </div>
          )}
        >
          <YourApp />
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

// In the query, enable throwing to the error boundary
useQuery({
  queryKey: ["posts"],
  queryFn: fetchPosts,
  throwOnError: true, // throws to the nearest error boundary
});
```

**Retry logic:**
- Default is 3 retries with exponential backoff.
- Disable retries for mutations that should not be repeated (e.g., payment processing).
- Customize retry based on error type — do not retry 401/403/404 errors.

```tsx
useQuery({
  queryKey: ["data"],
  queryFn: fetchData,
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});

// Disable retry for a specific mutation
useMutation({
  mutationFn: processPayment,
  retry: false,
});
```

**Garbage collection:**
- `gcTime` (default: 5 minutes) controls how long inactive cache data is kept.
- Set a longer `gcTime` for data the user might revisit (e.g., product details, user profiles).
- Set a shorter `gcTime` for data that is rarely revisited or is large in memory.

```tsx
// Keep product data in cache for 30 minutes even when unused
useQuery({
  queryKey: ["product", productId],
  queryFn: () => fetchProduct(productId),
  staleTime: 1000 * 60 * 10, // fresh for 10 minutes
  gcTime: 1000 * 60 * 30, // keep in cache for 30 minutes after last observer unmounts
});
```

**Organize queries into custom hooks:**
- Extract every `useQuery` and `useMutation` into a dedicated hook.
- Colocate the query key, query function, and type definitions in the same file.
- This makes queries reusable, testable, and easy to find.

```tsx
// hooks/usePosts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { postKeys } from "@/lib/query-keys";
import { fetchPosts, createPost, deletePost } from "@/api/posts";
import type { Post, CreatePostInput } from "@/types";

export function usePosts(filters?: PostFilters) {
  return useQuery<Post[]>({
    queryKey: postKeys.list(filters ?? {}),
    queryFn: () => fetchPosts(filters),
    staleTime: 1000 * 60 * 5,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation<Post, Error, CreatePostInput>({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deletePost,
    onSuccess: (_data, postId) => {
      queryClient.removeQueries({ queryKey: postKeys.detail(postId) });
      queryClient.invalidateQueries({ queryKey: postKeys.lists() });
    },
  });
}
```

**Separate API layer from React Query hooks:**
- Keep your `fetch`/`axios` calls in a separate API module.
- Your hooks import these functions and pass them as `queryFn` / `mutationFn`.
- This makes API calls testable independently of React Query.

```tsx
// api/posts.ts — pure API functions, no React Query
export async function fetchPosts(filters?: PostFilters): Promise<Post[]> {
  const params = new URLSearchParams(filters as Record<string, string>);
  const res = await fetch(`/api/posts?${params}`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function createPost(data: CreatePostInput): Promise<Post> {
  const res = await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create post");
  return res.json();
}
```

**Additional best practices:**
- Set sensible `staleTime` defaults globally rather than on every query — `0` is too aggressive for most apps.
- Use `select` to transform data close to where it is consumed, keeping `queryFn` responses generic.
- Do not store server data in React state (`useState`) — let React Query be the single source of truth.
- Use `queryClient.getQueryData()` sparingly — prefer passing data via props or using the same `useQuery` hook (it deduplicates requests automatically).
- Test your hooks with `@testing-library/react` and a custom `QueryClientProvider` wrapper with `retry: false` and `gcTime: Infinity`.

```tsx
// test-utils.tsx — testing wrapper
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: Infinity,
      },
    },
  });
}

export function renderWithClient(ui: React.ReactElement) {
  const testQueryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={testQueryClient}>
      {ui}
    </QueryClientProvider>
  );
}
```

---
