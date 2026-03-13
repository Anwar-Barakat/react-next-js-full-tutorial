# Redux State Management Guide

Redux and Redux Toolkit for predictable state management in JavaScript apps.

---

## Table of Contents

1. [State Management in React](#1-state-management-in-react)
2. [What is Redux?](#2-what-is-redux)
3. [Core Parts of Redux](#3-core-parts-of-redux)
4. [Pure Functions in Redux](#4-pure-functions-in-redux)
5. [Why is Redux Predictable?](#5-why-is-redux-predictable)
6. [Problems Redux Solves](#6-problems-redux-solves)
7. [Connecting React with Redux](#7-connecting-react-with-redux)
8. [Redux Thunk](#8-redux-thunk)
9. [Redux vs Context API](#9-redux-vs-context-api)
10. [What is Redux Toolkit (RTK)?](#10-what-is-redux-toolkit-rtk)
11. [Creating a Slice with Redux Toolkit](#11-creating-a-slice-with-redux-toolkit)
12. [Async Logic with createAsyncThunk](#12-async-logic-with-createasyncthunk)
13. [Configuring the Store](#13-configuring-the-store)
14. [Using Redux in Components](#14-using-redux-in-components)
15. [Redux Toolkit Query (RTK Query)](#15-redux-toolkit-query-rtk-query)
16. [What Happens When You Dispatch?](#16-what-happens-when-you-dispatch)
17. [Is Redux Synchronous or Asynchronous?](#17-is-redux-synchronous-or-asynchronous)
18. [Project Structure](#18-project-structure)
19. [Redux vs Zustand](#19-redux-vs-zustand)
20. [When NOT to Use Redux](#20-when-not-to-use-redux)
21. [TypeScript with Redux](#21-typescript-with-redux)
22. [Redux DevTools](#22-redux-devtools)
23. [Redux Middleware](#23-redux-middleware)
24. [Testing Redux](#24-testing-redux)
25. [Best Practices](#25-best-practices)
26. [Common Patterns](#26-common-patterns)
27. [Performance Optimization](#27-performance-optimization)
28. [Migration from Redux to RTK](#28-migration-from-redux-to-rtk)

---

## 1. State Management in React

- **useState** — Component-level; simple state (forms, toggles)
- **useReducer** — Component-level; complex state logic with multiple sub-values
- **Context API** — Cross-component tree; infrequent updates (theme, auth)
- **Redux** — Global; complex, frequently changing state in large apps
- **Zustand** — Global; simpler alternative to Redux for small-medium apps
- **MobX** — Global; observable state

---

## 2. What is Redux?

**Redux** is a global state management library for JavaScript apps. It is framework agnostic (React, Angular, Vue, vanilla JS).

**Three principles:**
1. **Single source of truth** - One store for entire app
2. **State is read-only** - Only way to change state is dispatching actions
3. **Changes made with pure functions** - Reducers must be pure

**Why use it:** centralized state, avoid prop drilling, predictable state flow, time-travel debugging, middleware ecosystem.

---

## 3. Core Parts of Redux

### Store

Centralized object holding your entire app's state. You never change state directly; changes always go through Redux.

```javascript
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer
  }
});
```

### Actions

A plain JavaScript object describing **what happened**. Always has a `type` field (string) and optional `payload` for data.

```javascript
// Action object
const action = {
  type: 'INCREMENT',
  payload: 5
};

// Action creator (function that returns an action)
const increment = (amount) => ({
  type: 'INCREMENT',
  payload: amount
});
```

### Reducers

A pure function that decides **how the state changes**. Takes current state and action, returns new state. Must be pure (no side effects, no mutations).

```javascript
// Reducer function
function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + action.payload };
    case 'DECREMENT':
      return { count: state.count - action.payload };
    default:
      return state;
  }
}
```

### Dispatch

Store method that sends actions into the Redux system to trigger state updates.

```javascript
// Dispatching an action
store.dispatch({ type: 'INCREMENT', payload: 1 });

// Or with action creator
store.dispatch(increment(1));
```

**Can you dispatch inside reducers?**
❌ No. Reducers must be pure - no side effects, no dispatching.

---

## 4. Pure Functions in Redux

A pure function always returns the same output for the same input and has no side effects. Reducers must be pure:

### ❌ No Side Effects

```javascript
// ❌ Bad - API call (side effect)
function reducer(state, action) {
  fetch('/api/data'); // Side effect
  return state;
}

// ❌ Bad - Date.now() (not predictable)
function reducer(state, action) {
  return {
    ...state,
    timestamp: Date.now() // Different every time
  };
}

// ❌ Bad - Math.random() (not predictable)
function reducer(state, action) {
  return {
    ...state,
    id: Math.random() // Different every time
  };
}

// ❌ Bad - logging (side effect)
function reducer(state, action) {
  console.log('Action:', action); // Side effect
  return state;
}
```

### ❌ No Mutations

```javascript
// ❌ Bad - mutating state
function reducer(state, action) {
  state.count++; // Mutates state
  return state;
}

// ❌ Bad - mutating array
function reducer(state, action) {
  state.items.push(action.payload); // Mutates array
  return state;
}

// ❌ Bad - mutating object
function reducer(state, action) {
  state.user.name = action.payload; // Mutates object
  return state;
}
```

### ✅ Correct - Pure Reducers

```javascript
// ✅ Good - returns new state
function reducer(state, action) {
  return {
    ...state,
    count: state.count + 1
  };
}

// ✅ Good - returns new array
function reducer(state, action) {
  return {
    ...state,
    items: [...state.items, action.payload]
  };
}

// ✅ Good - returns new object
function reducer(state, action) {
  return {
    ...state,
    user: {
      ...state.user,
      name: action.payload
    }
  };
}
```

Pure reducers enable time-travel debugging, predictable behavior, easy testing, and state persistence.

---

## 5. Why is Redux Predictable?

1. **State changes only through reducers** - No direct state mutation
2. **Reducers are pure** - Same input always produces same output
3. **One-way data flow** - Unidirectional

```
Action → Dispatch → Middleware → Reducer → Store Update → UI Re-render
```

---

## 6. Problems Redux Solves

### Problem 1: Deep Prop Drilling

**❌ Without Redux:**

```javascript
function App() {
  const [user, setUser] = useState(null);

  return <Layout user={user} setUser={setUser} />;
}

function Layout({ user, setUser }) {
  return <Sidebar user={user} setUser={setUser} />;
}

function Sidebar({ user, setUser }) {
  return <UserProfile user={user} setUser={setUser} />;
}

function UserProfile({ user, setUser }) {
  return <div>{user.name}</div>;
}
```

**✅ With Redux:**

```javascript
function App() {
  return <Layout />;
}

function Layout() {
  return <Sidebar />;
}

function Sidebar() {
  return <UserProfile />;
}

function UserProfile() {
  const user = useSelector((state) => state.user);
  return <div>{user.name}</div>;
}
```

### Problem 2: Complex Shared State

Managing state shared across many components becomes difficult without Redux.

### Problem 3: Difficult Data Flow in Large Apps

In large apps, tracking where state changes occur becomes complex. Redux provides clear, traceable data flow.

---

## 7. Connecting React with Redux

**Three main hooks:**

### Provider

Wraps your app and provides the store to all components.

```javascript
import { Provider } from 'react-redux';
import { store } from './store';

function App() {
  return (
    <Provider store={store}>
      <YourApp />
    </Provider>
  );
}
```

### useSelector()

A hook to access Redux state inside a component.

```javascript
import { useSelector } from 'react-redux';

function Counter() {
  const count = useSelector((state) => state.counter.count);
  const user = useSelector((state) => state.user);

  return <div>Count: {count}</div>;
}
```

**Selectors are functions** that extract specific pieces of state.

### useDispatch()

A hook that returns the dispatch function to send actions.

```javascript
import { useDispatch } from 'react-redux';
import { increment, decrement } from './counterSlice';

function Counter() {
  const dispatch = useDispatch();

  return (
    <div>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
    </div>
  );
}
```

---

## 8. Redux Thunk

Middleware for async actions. Actions must be plain objects, so you cannot dispatch async functions directly.

**❌ Without Thunk:**

```javascript
// This doesn't work
dispatch(async () => {
  const res = await fetch('/api/user');
  const user = await res.json();
  return { type: 'SET_USER', payload: user };
});
```

**✅ With Thunk:**

```javascript
// Thunk action creator - returns a function
const fetchUser = (id) => {
  return async (dispatch, getState) => {
    dispatch({ type: 'FETCH_USER_PENDING' });

    try {
      const res = await fetch(`/api/users/${id}`);
      const user = await res.json();
      dispatch({ type: 'FETCH_USER_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'FETCH_USER_ERROR', payload: error.message });
    }
  };
};

// Usage
dispatch(fetchUser(123));
```

**Note:** Redux Toolkit has a better way - `createAsyncThunk`.

---

## 9. Redux vs Context API

- **Setup** — Redux: More complex; Context API: Simple
- **Boilerplate** — Redux: High (RTK reduces it); Context API: Low
- **Performance** — Redux: Optimized; Context API: Can be slow
- **Re-renders** — Redux: Selective; Context API: All consumers
- **DevTools** — Redux: Excellent; Context API: None
- **Middleware** — Redux: Yes; Context API: No
- **Async logic** — Redux: Built-in (Thunk, RTK); Context API: Custom
- **Best for** — Redux: Large apps, complex logic; Context API: Simple state sharing

**Use Redux** for large apps, complex state, debugging tools, middleware. **Use Context** for simple sharing, infrequent updates (theme, locale), small apps.

---

## 10. What is Redux Toolkit (RTK)?

The official, recommended way to write Redux logic. Solves classic Redux pain points (boilerplate, verbosity, easy mistakes).

**RTK provides:**
- `configureStore` - Simplified store setup
- `createSlice` - Combines actions + reducer (replaces manual action types, creators, switch statements)
- `createAsyncThunk` - Async actions (built-in Thunk)
- `createEntityAdapter` - Normalized state
- RTK Query - Data fetching and caching
- Immer built-in (write "mutable" code that stays immutable)
- Automatic TypeScript types

**Immer integration:**

```javascript
// Classic Redux - manual immutability
return { ...state, count: state.count + 1 };

// Redux Toolkit with Immer - looks mutable
state.count += 1; // Immer makes this immutable
```

RTK automatically converts "mutable" code into immutable updates.

---

## 11. Creating a Slice with Redux Toolkit

A slice bundles reducer logic + actions for one section of state.

```javascript
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter', // Used to generate action types

  initialState: {
    count: 0
  },

  reducers: {
    // Action creators are auto-generated
    increment: (state) => {
      state.count += 1; // Looks like mutation, but Immer makes it immutable
    },

    decrement: (state) => {
      state.count -= 1;
    },

    incrementByAmount: (state, action) => {
      state.count += action.payload;
    },

    reset: (state) => {
      state.count = 0;
    }
  }
});

// Export action creators
export const { increment, decrement, incrementByAmount, reset } = counterSlice.actions;

// Export reducer
export default counterSlice.reducer;
```

**What createSlice generates:**

```javascript
// Action creators (auto-generated)
increment() // { type: 'counter/increment' }
decrement() // { type: 'counter/decrement' }
incrementByAmount(5) // { type: 'counter/incrementByAmount', payload: 5 }

// Reducer function (handles all actions)
counterSlice.reducer
```

---

## 12. Async Logic with createAsyncThunk

Helper for async API logic with automatic loading states.

**Manual approach (verbose):**

```javascript
// Manual approach - lots of boilerplate
const fetchUserPending = () => ({ type: 'FETCH_USER_PENDING' });
const fetchUserSuccess = (user) => ({ type: 'FETCH_USER_SUCCESS', payload: user });
const fetchUserError = (error) => ({ type: 'FETCH_USER_ERROR', payload: error });

// Thunk
const fetchUser = (id) => async (dispatch) => {
  dispatch(fetchUserPending());
  try {
    const user = await api.getUser(id);
    dispatch(fetchUserSuccess(user));
  } catch (error) {
    dispatch(fetchUserError(error.message));
  }
};
```

**✅ With createAsyncThunk:**

```javascript
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Create async thunk - automatically creates 3 actions
export const fetchUser = createAsyncThunk(
  'users/fetchUser', // Action type prefix
  async (userId, thunkAPI) => {
    const response = await fetch(`/api/users/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    return response.json(); // This becomes action.payload
  }
);

// Slice handles the auto-generated actions
const userSlice = createSlice({
  name: 'user',

  initialState: {
    user: null,
    loading: false,
    error: null
  },

  reducers: {
    // Regular synchronous actions
  },

  extraReducers: (builder) => {
    builder
      // pending action
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // fulfilled action
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      // rejected action
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default userSlice.reducer;
```

RTK automatically creates 3 action types: `users/fetchUser/pending`, `users/fetchUser/fulfilled`, `users/fetchUser/rejected`.

**Using in component:**

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { fetchUser } from './userSlice';

function UserProfile({ userId }) {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUser(userId));
  }, [userId, dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>{user?.name}</div>;
}
```

---

## 13. Configuring the Store

```javascript
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';
import userReducer from './userSlice';
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    cart: cartReducer
  },

  // Middleware is automatically included (Thunk, DevTools, etc.)
  // You can add more middleware if needed
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger),

  // DevTools enabled by default in development
  devTools: process.env.NODE_ENV !== 'production'
});

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

`configureStore` automatically combines reducers, adds Thunk middleware, enables DevTools, and adds development checks (immutability, serializability).

---

## 14. Using Redux in Components

```javascript
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount } from './counterSlice';

function Counter() {
  // Select state
  const count = useSelector((state) => state.counter.count);

  // Get dispatch
  const dispatch = useDispatch();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(increment())}>+</button>
      <button onClick={() => dispatch(decrement())}>-</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
    </div>
  );
}
```

**Multiple selectors:**

```javascript
function Dashboard() {
  const user = useSelector((state) => state.user.user);
  const count = useSelector((state) => state.counter.count);
  const items = useSelector((state) => state.cart.items);

  const dispatch = useDispatch();

  return <div>{/* Use state */}</div>;
}
```

**Derived state:**

```javascript
function CartTotal() {
  // Compute total from items
  const total = useSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  );

  return <div>Total: ${total}</div>;
}
```

**Memoized selectors (Reselect):**

```javascript
import { createSelector } from '@reduxjs/toolkit';

// Memoized selector - only recomputes when items change
const selectCartTotal = createSelector(
  (state) => state.cart.items,
  (items) => items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

function CartTotal() {
  const total = useSelector(selectCartTotal);
  return <div>Total: ${total}</div>;
}
```

---

## 15. Redux Toolkit Query (RTK Query)

Data-fetching and caching tool built into RTK. Replaces manual Thunk API calls, loading states, and cache management.

- **Client State** (Redux) — UI state, user inputs, local preferences
- **Server State** (RTK Query) — API data, external data, cached data

**Creating an API:**

```javascript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),

  endpoints: (builder) => ({
    // Query - for GET requests
    getUsers: builder.query({
      query: () => '/users'
    }),

    getUser: builder.query({
      query: (id) => `/users/${id}`
    }),

    // Mutation - for POST/PUT/DELETE
    createUser: builder.mutation({
      query: (newUser) => ({
        url: '/users',
        method: 'POST',
        body: newUser
      })
    }),

    updateUser: builder.mutation({
      query: ({ id, ...patch }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: patch
      })
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE'
      })
    })
  })
});

// Auto-generated hooks
export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation
} = apiSlice;
```

**Using in components:**

```javascript
import { useGetUsersQuery, useCreateUserMutation } from './apiSlice';

function UsersList() {
  // Query hook - auto-fetches, caches, refetches
  const { data: users, isLoading, isError, error } = useGetUsersQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {users.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}

function CreateUserForm() {
  const [createUser, { isLoading }] = useCreateUserMutation();

  const handleSubmit = async (userData) => {
    try {
      await createUser(userData).unwrap();
      alert('User created!');
    } catch (error) {
      alert('Failed to create user');
    }
  };

  return <form onSubmit={handleSubmit}>{/* Form fields */}</form>;
}
```

**RTK Query handles:** automatic caching, background refetching, loading states, error handling, optimistic updates, cache invalidation, and polling.

---

## 16. What Happens When You Dispatch?

```
1. You call dispatch(action)
   ↓
2. Action goes through middleware (if any)
   ↓
3. Reducer receives action and current state
   ↓
4. Reducer computes new state
   ↓
5. Redux updates store with new state
   ↓
6. Subscribers (UI components) are notified
   ↓
7. Components using changed state re-render
```

**Example:**

```javascript
// 1. Dispatch action
dispatch(increment());

// 2. Middleware (Thunk, Logger, etc.) process it

// 3. Reducer receives action
function counterReducer(state = { count: 0 }, action) {
  if (action.type === 'counter/increment') {
    return { count: state.count + 1 }; // 4. Compute new state
  }
  return state;
}

// 5. Store updates with new state
// 6. Components subscribed to count are notified
// 7. They re-render with new count
```

**Can you dispatch inside reducers?**
❌ No. Reducers must be pure. Dispatching is a side effect.

**Where to dispatch:**
- ✅ Components (event handlers)
- ✅ Middleware
- ✅ Thunks
- ❌ Reducers

---

## 17. Is Redux Synchronous or Asynchronous?

**Redux itself is synchronous.**

Dispatch → Reducer → Store update happens immediately and synchronously.

**Async logic is handled by middleware:**

Without middleware:

```javascript
// ❌ This doesn't work
dispatch(async () => {
  const data = await fetch('/api');
  return { type: 'SET_DATA', payload: data };
});
```

With Thunk middleware:

```javascript
// ✅ Thunk handles async
const fetchData = () => async (dispatch) => {
  const data = await fetch('/api').then(r => r.json());
  dispatch({ type: 'SET_DATA', payload: data });
};

dispatch(fetchData());
```

With RTK createAsyncThunk:

```javascript
// ✅ RTK handles async
const fetchData = createAsyncThunk('data/fetch', async () => {
  const response = await fetch('/api');
  return response.json();
});

dispatch(fetchData());
```

---

## 18. Project Structure

**Feature-based structure (recommended):**

```
src/
  features/
    counter/
      counterSlice.js
      Counter.jsx
    user/
      userSlice.js
      userAPI.js
      UserProfile.jsx
    cart/
      cartSlice.js
      Cart.jsx
      CartItem.jsx
  app/
    store.js
    hooks.js
  App.jsx
```

**Slice structure:**

```
features/user/
  userSlice.js        - Slice with reducers
  userAPI.js          - API functions
  userSelectors.js    - Reusable selectors
  UserProfile.jsx     - Components
  UserList.jsx
```

**Shared store configuration:**

```javascript
// app/store.js
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import userReducer from '../features/user/userSlice';
import cartReducer from '../features/cart/cartSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
    cart: cartReducer
  }
});
```

---

## 19. Redux vs Zustand

- **Boilerplate** — Redux (RTK): Medium; Zustand: Minimal
- **Learning curve** — Redux (RTK): Moderate; Zustand: Easy
- **Structure** — Redux (RTK): Strict; Zustand: Flexible
- **Best for** — Redux (RTK): Large apps; Zustand: Small-medium apps
- **Async logic** — Redux (RTK): createAsyncThunk; Zustand: Built-in
- **Provider** — Redux (RTK): Required; Zustand: Not required
- **DevTools** — Redux (RTK): Built-in; Zustand: Middleware
- **Middleware** — Redux (RTK): Extensive; Zustand: Limited
- **TypeScript** — Redux (RTK): Excellent; Zustand: Excellent

**Use Redux** for large apps, complex business logic, strict structure, extensive middleware. **Use Zustand** for simpler state, rapid development, smaller teams, minimal setup.

---

## 20. When NOT to Use Redux

**Don't use Redux when:**

1. **Small apps** - useState or Context is enough
2. **Little shared state** - Local state is simpler
3. **Simple CRUD apps** - RTK Query might suffice without full Redux
4. **Learning React** - Focus on React first, add Redux later

**Alternatives:**
- **useState** - Local component state
- **useReducer** - Complex local state
- **Context API** - Simple global state
- **Zustand** - Simpler global state
- **React Query** - Server state only

---

## 21. TypeScript with Redux

**Typed store:**

```typescript
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer
  }
});

// Infer types from store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

**Typed hooks:**

```typescript
// app/hooks.ts
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Typed versions of hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

**Typed slice:**

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
  count: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: CounterState = {
  count: 0,
  status: 'idle'
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.count += action.payload;
    }
  }
});

export const { increment, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
```

**Using typed hooks:**

```typescript
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { increment, incrementByAmount } from './counterSlice';

function Counter() {
  const count = useAppSelector((state) => state.counter.count);
  const dispatch = useAppDispatch();

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

## 22. Redux DevTools

View dispatched actions, inspect state, time-travel debug, see state diffs, and replay actions. Automatically enabled in RTK:

```javascript
const store = configureStore({
  reducer: rootReducer,
  // DevTools automatically enabled in development
  devTools: process.env.NODE_ENV !== 'production'
});
```

**Tabs:** Action (dispatched actions), State (current state), Diff (what changed), Jump (time travel), Export/Import (save/restore).

---

## 23. Redux Middleware

Code that runs between dispatching an action and reaching the reducer. Common: Thunk (async, built into RTK), Logger, Saga (complex async flows), Observable (RxJS).

**Custom middleware:**

```javascript
const loggerMiddleware = (store) => (next) => (action) => {
  console.log('Dispatching:', action);
  const result = next(action);
  console.log('Next state:', store.getState());
  return result;
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggerMiddleware)
});
```

---

## 24. Testing Redux

**Test reducer:**

```javascript
import counterReducer, { increment, decrement } from './counterSlice';

test('should handle increment', () => {
  const previousState = { count: 0 };
  expect(counterReducer(previousState, increment())).toEqual({ count: 1 });
});

test('should handle decrement', () => {
  const previousState = { count: 1 };
  expect(counterReducer(previousState, decrement())).toEqual({ count: 0 });
});
```

**Test async thunk:**

```javascript
import { fetchUser } from './userSlice';

test('should fetch user', async () => {
  const dispatch = jest.fn();
  const getState = jest.fn();

  await fetchUser(1)(dispatch, getState, undefined);

  expect(dispatch).toHaveBeenCalledWith({ type: 'users/fetchUser/pending' });
  // More assertions...
});
```

**Test with React Testing Library:**

```javascript
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Counter from './Counter';
import counterReducer from './counterSlice';

test('renders counter', () => {
  const store = configureStore({
    reducer: { counter: counterReducer }
  });

  render(
    <Provider store={store}>
      <Counter />
    </Provider>
  );

  expect(screen.getByText(/count: 0/i)).toBeInTheDocument();
});
```

---

## 25. Best Practices

**1. Use Redux Toolkit**

```javascript
// ✅ Use RTK
import { createSlice } from '@reduxjs/toolkit';

// ❌ Avoid classic Redux
const INCREMENT = 'INCREMENT';
const increment = () => ({ type: INCREMENT });
```

**2. Feature-based file structure**

```javascript
// ✅ Good - organized by feature
features/
  user/
    userSlice.js
  cart/
    cartSlice.js
```

**3. Normalize complex state**

```javascript
// ✅ Good - normalized
{
  users: {
    byId: { 1: { id: 1, name: 'John' } },
    allIds: [1]
  }
}

// ❌ Bad - nested
{
  posts: [
    { id: 1, author: { id: 1, name: 'John' } }
  ]
}
```

**4. Use createAsyncThunk for async**

```javascript
// ✅ Good
export const fetchUser = createAsyncThunk('users/fetch', async (id) => {
  const response = await api.getUser(id);
  return response.data;
});
```

**5. Avoid putting non-serializable values in state**

```javascript
// ❌ Bad
{
  user: new User(),
  callback: () => {},
  date: new Date()
}

// ✅ Good
{
  user: { id: 1, name: 'John' },
  timestamp: Date.now()
}
```

---

## 26. Common Patterns

**Pattern 1: Loading states**

```javascript
const slice = createSlice({
  name: 'data',
  initialState: {
    data: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});
```

**Pattern 2: Normalized state**

```javascript
import { createEntityAdapter } from '@reduxjs/toolkit';

const usersAdapter = createEntityAdapter();

const usersSlice = createSlice({
  name: 'users',
  initialState: usersAdapter.getInitialState(),
  reducers: {
    userAdded: usersAdapter.addOne,
    usersReceived: usersAdapter.setAll
  }
});
```

**Pattern 3: Optimistic updates**

```javascript
const slice = createSlice({
  name: 'todos',
  initialState: [],
  reducers: {
    todoAdded: (state, action) => {
      state.push({ ...action.payload, status: 'pending' });
    }
  },
  extraReducers: (builder) => {
    builder.addCase(createTodo.fulfilled, (state, action) => {
      const index = state.findIndex(t => t.tempId === action.payload.tempId);
      state[index] = { ...action.payload, status: 'saved' };
    });
  }
});
```

---

## 27. Performance Optimization

**1. Use Reselect for derived state:**

```javascript
import { createSelector } from '@reduxjs/toolkit';

const selectItems = (state) => state.cart.items;

const selectTotal = createSelector(
  [selectItems],
  (items) => items.reduce((sum, item) => sum + item.price, 0)
);
```

**2. Split selectors:**

```javascript
// ❌ Bad - re-renders on any cart change
const cart = useSelector((state) => state.cart);

// ✅ Good - re-renders only when items change
const items = useSelector((state) => state.cart.items);
```

**3. Use shallowEqual:**

```javascript
import { shallowEqual, useSelector } from 'react-redux';

const { name, email } = useSelector(
  (state) => ({ name: state.user.name, email: state.user.email }),
  shallowEqual
);
```

---

## 28. Migration from Redux to RTK

**Classic Redux:**

```javascript
// constants
const INCREMENT = 'counter/increment';

// action creators
const increment = () => ({ type: INCREMENT });

// reducer
function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case INCREMENT:
      return { count: state.count + 1 };
    default:
      return state;
  }
}
```

**Redux Toolkit:**

```javascript
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { count: 0 },
  reducers: {
    increment: (state) => {
      state.count += 1;
    }
  }
});

export const { increment } = counterSlice.actions;
export default counterSlice.reducer;
```

