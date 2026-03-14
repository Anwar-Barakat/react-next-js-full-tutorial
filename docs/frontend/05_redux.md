# Redux State Management Guide

Redux and Redux Toolkit for predictable state management in JavaScript apps.

---

## 1. State Management Options

- **useState / useReducer** — Component-level state
- **Context API** — Simple cross-component sharing (theme, auth); no built-in performance optimisation
- **Redux** — Global, complex, frequently changing state; large apps
- **Zustand** — Simpler global state for small-medium apps

---

## 2. What is Redux?

Framework-agnostic global state library. Three principles:

1. **Single source of truth** — one store
2. **State is read-only** — change only via dispatched actions
3. **Pure reducers** — same input always produces same output

Data flow: `Action → Dispatch → Middleware → Reducer → Store → UI`

---

## 3. Core Concepts

### Store

```javascript
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: { counter: counterReducer, user: userReducer }
});
```

### Actions & Reducers

```javascript
function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT': return { count: state.count + action.payload };
    default: return state;
  }
}
```

Reducers must be pure — no API calls, no mutations:

```javascript
// ❌ Mutates state
state.count++;

// ✅ Returns new state
return { ...state, count: state.count + 1 };
```

### Dispatch

```javascript
store.dispatch({ type: 'INCREMENT', payload: 1 });
```

---

## 4. Connecting React with Redux

```javascript
import { Provider } from 'react-redux';
import { store } from './app/store';

root.render(<Provider store={store}><App /></Provider>);
```

```javascript
import { useSelector, useDispatch } from 'react-redux';

function Counter() {
  const count = useSelector((state) => state.counter.count);
  const dispatch = useDispatch();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
    </div>
  );
}
```

---

## 5. Redux Toolkit (RTK)

The official, recommended way to write Redux. Eliminates boilerplate via:

- `configureStore` — simplified store setup with DevTools and Thunk included
- `createSlice` — combines action creators + reducer in one place; uses Immer
- `createAsyncThunk` — async actions with automatic pending/fulfilled/rejected states
- RTK Query — built-in data fetching and caching

### createSlice

```javascript
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { count: 0 },
  reducers: {
    increment: (state) => { state.count += 1; },      // Immer handles immutability
    decrement: (state) => { state.count -= 1; },
    incrementByAmount: (state, action) => { state.count += action.payload; }
  }
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
```

### createAsyncThunk

```javascript
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchUser = createAsyncThunk('users/fetchUser', async (userId) => {
  const response = await fetch(`/api/users/${userId}`);
  return response.json();
});

const userSlice = createSlice({
  name: 'user',
  initialState: { user: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => { state.loading = true; })
      .addCase(fetchUser.fulfilled, (state, action) => { state.loading = false; state.user = action.payload; })
      .addCase(fetchUser.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });
  }
});
```

---

## 6. RTK Query

Built-in data-fetching and caching layer.

```javascript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getUsers:   builder.query({ query: () => '/users' }),
    createUser: builder.mutation({ query: (body) => ({ url: '/users', method: 'POST', body }) }),
  })
});

export const { useGetUsersQuery, useCreateUserMutation } = apiSlice;
```

```javascript
function UsersList() {
  const { data: users, isLoading, isError } = useGetUsersQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

RTK Query handles: automatic caching, background refetching, polling, optimistic updates, and cache invalidation.

---

## 7. TypeScript with Redux

```typescript
// app/store.ts
export const store = configureStore({ reducer: { counter: counterReducer } });
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

```typescript
// app/hooks.ts — use these instead of raw hooks
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

```typescript
const counterSlice = createSlice({
  name: 'counter',
  initialState: { count: 0 } as { count: number },
  reducers: {
    increment: (state) => { state.count += 1; },
    incrementByAmount: (state, action: PayloadAction<number>) => { state.count += action.payload; }
  }
});
```

---

## 8. Redux vs Context API vs Zustand

| | Redux (RTK) | Context API | Zustand |
|---|---|---|---|
| Boilerplate | Medium | Low | Minimal |
| DevTools | Built-in | None | Middleware |
| Performance | Selective re-renders | All consumers | Selective |
| Async | createAsyncThunk | Custom | Built-in |
| Best for | Large apps | Infrequent updates | Small-medium apps |

- Use Redux for large apps, complex business logic, and time-travel debugging.
- Use Context for simple sharing (theme, locale) with infrequent updates.
- Use Zustand for rapid development with minimal setup.

---

## 9. Testing

```javascript
// Test reducer directly
import counterReducer, { increment } from './counterSlice';

test('handles increment', () => {
  expect(counterReducer({ count: 0 }, increment())).toEqual({ count: 1 });
});
```

```javascript
// Test with React Testing Library
test('renders counter', () => {
  const store = configureStore({ reducer: { counter: counterReducer } });
  render(<Provider store={store}><Counter /></Provider>);
  expect(screen.getByText(/count: 0/i)).toBeInTheDocument();
});
```

---

## 10. Project Structure & Best Practices

**Feature-based structure (recommended):**

```
src/
  app/
    store.ts
    hooks.ts
  features/
    counter/
      counterSlice.ts
      Counter.tsx
    user/
      userSlice.ts
      UserProfile.tsx
```

**Best practices:**

- Always use Redux Toolkit — avoid hand-written action constants and switch reducers
- Keep only serialisable values in state (no `Date`, class instances, functions)
- Use `createAsyncThunk` for all async operations
- Use `createSelector` (Reselect) for expensive derived state
- Select the minimum slice of state needed to prevent over-rendering:

```javascript
// ❌ Re-renders on any cart change
const cart = useSelector((state) => state.cart);

// ✅ Re-renders only when items change
const items = useSelector((state) => state.cart.items);
```

- Use `createEntityAdapter` for collections to get normalised state and built-in CRUD helpers
