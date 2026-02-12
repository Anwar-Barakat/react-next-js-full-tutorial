# Redux State Management Guide

A comprehensive guide to Redux and Redux Toolkit for predictable state management in JavaScript applications.

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
29. [Summary](#29-summary)

---

## 1. State Management in React

**Different ways to manage state in React:**

| Method | Scope | Use Case |
|--------|-------|----------|
| **useState** | Component-level | Local component state |
| **useReducer** | Component-level | Complex local state logic |
| **Context API** | Cross-component tree | Infrequent updates (theme, auth) |
| **Redux** | Global | Complex, frequently changing state |
| **Zustand** | Global | Simple global state |
| **MobX** | Global | Observable state |

**When to use each:**
- **useState** - Simple component state (forms, toggles)
- **useReducer** - Complex state logic with multiple sub-values
- **Context API** - Passing data through component tree without prop drilling
- **Redux** - Large apps with complex state interactions
- **Zustand** - Simpler alternative to Redux for small-medium apps

---

## 2. What is Redux?

**Redux** is a global state management library for JavaScript apps.

**Key characteristics:**
- **Centralized state** - All app state in a single store
- **Predictable** - State changes follow strict patterns
- **Debuggable** - Time-travel debugging with DevTools
- **Framework agnostic** - Works with React, Angular, Vue, vanilla JS

**Why use Redux:**
- Manage shared or complex state
- Avoid prop drilling
- Predictable state flow
- Time-travel debugging
- Middleware ecosystem

**Philosophy:**
Redux follows three principles:
1. **Single source of truth** - One store for entire app
2. **State is read-only** - Only way to change state is dispatching actions
3. **Changes made with pure functions** - Reducers must be pure

---

## 3. Core Parts of Redux

### Store

**What it is:**
A centralized object that contains your entire app's state.

**Characteristics:**
- Single store for entire application
- You don't change state directly
- Changes always go through Redux

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

**What it is:**
A plain JavaScript object that describes **what happened**.

**Characteristics:**
- Not a method or function - just data
- Always has a `type` field (string)
- Optional `payload` field for data
- Doesn't change state by itself

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

**Think of actions as "news reports":**
- "User clicked +1"
- "Form was submitted"
- "API request succeeded"

### Reducers

**What it is:**
A pure function that decides **how the state changes**.

**Characteristics:**
- Takes current state and action
- Returns new state
- Must be pure (no side effects)
- Must not mutate state

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

**Reducers = "decide how the state changes"**

### Dispatch

**What it is:**
A method from the Redux store that sends actions into the Redux system.

**Purpose:**
Tell Redux "here's what happened - go update the state."

```javascript
// Dispatching an action
store.dispatch({ type: 'INCREMENT', payload: 1 });

// Or with action creator
store.dispatch(increment(1));
```

**Dispatch = "tell Redux what happened"**

**Can you dispatch inside reducers?**
❌ No. Reducers must be pure - no side effects, no dispatching.

---

## 4. Pure Functions in Redux

**What is a pure function:**
A function that:
1. Takes input and returns output
2. Same input always produces same output
3. Does not change anything outside the function

**In Redux, reducers must be pure:**

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

**Why purity matters:**
Redux depends on predictable and traceable state changes. Pure reducers enable:
- Time-travel debugging
- Predictable behavior
- Easy testing
- State persistence

---

## 5. Why is Redux Predictable?

**Three reasons:**

1. **State changes only through reducers** - No direct state mutation
2. **Reducers are pure** - Same input always produces same output
3. **One-way data flow** - Unidirectional data flow

**Data flow:**

```
Action → Dispatch → Middleware → Reducer → Store Update → UI Re-render
```

**Benefits:**
- Easy to trace bugs
- State changes are explicit
- Time-travel debugging
- Easy to test

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

**What is Redux Thunk:**
Middleware for async actions in Redux.

**Problem:**
Actions must be plain objects. You can't dispatch async functions.

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

| Feature | Redux | Context API |
|---------|-------|-------------|
| Setup | More complex | Simple |
| Boilerplate | High (RTK reduces it) | Low |
| Performance | Optimized | Can be slow |
| Re-renders | Selective | All consumers |
| DevTools | Excellent | None |
| Middleware | Yes | No |
| Async logic | Built-in (Thunk, RTK) | Custom |
| Best for | Large apps, complex logic | Simple state sharing |

**When to use Redux:**
- Large applications
- Complex state interactions
- Need debugging tools
- Need middleware
- Team prefers strict structure

**When to use Context:**
- Simple state sharing
- Infrequent updates (theme, locale)
- Small applications
- No complex logic

---

## 10. What is Redux Toolkit (RTK)?

**Redux Toolkit** is the official, recommended way to write Redux logic.

**Why Redux Toolkit exists:**

Classic Redux problems:
- ❌ Too much boilerplate
- ❌ Too many files
- ❌ Too easy to make mistakes
- ❌ Too strict and verbose
- ❌ Annoying for beginners

**RTK solutions:**
- ✅ Less code with `createSlice`
- ✅ Immer built-in (write "mutable" code)
- ✅ Automatic action creators
- ✅ Built-in Thunk support
- ✅ Automatic TypeScript types

**Classic Redux vs RTK:**

| Classic Redux | Redux Toolkit |
|---------------|---------------|
| Action types constants | Auto-generated |
| Action creators | Auto-generated |
| Switch statements | `createSlice` |
| Manual immutability | Immer (looks mutable) |
| Separate files | One slice file |
| Redux Thunk separate | Built-in |

**RTK includes:**
- `configureStore` - Simplified store setup
- `createSlice` - Combines actions + reducer
- `createAsyncThunk` - Async actions
- `createEntityAdapter` - Normalized state
- RTK Query - Data fetching and caching

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

**What is a slice:**
A section of Redux state containing reducer logic + actions together.

**Creating a slice:**

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

**Benefits:**
- Less boilerplate
- Actions and reducer in one place
- Automatic action creators
- Immer for immutability
- TypeScript support

---

## 12. Async Logic with createAsyncThunk

**Purpose:**
Helper for writing async API logic with automatic loading states.

**Problem with manual async:**

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

**What createAsyncThunk auto-generates:**

RTK automatically creates 3 action types:
- `users/fetchUser/pending` - When the async function starts
- `users/fetchUser/fulfilled` - When promise resolves successfully
- `users/fetchUser/rejected` - When promise rejects

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

**Benefits:**
- Less code
- Fewer mistakes
- Automatic loading states
- Clear action types

---

## 13. Configuring the Store

**With Redux Toolkit:**

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

**What configureStore does automatically:**
- Combines reducers
- Adds Thunk middleware
- Enables Redux DevTools
- Adds development checks (immutability, serializability)

---

## 14. Using Redux in Components

**Basic usage:**

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

**What is RTK Query:**
A data-fetching and caching tool built into RTK.

**Purpose:**
Handles loading, caching, refetching automatically for API data.

**What it replaces:**
- Redux Thunk for API calls
- Manual loading states
- Manual cache management

**Client state vs Server state:**

| Client State | Server State |
|--------------|--------------|
| UI state (theme, modal) | Data from API (users, posts) |
| User inputs | External data |
| Local preferences | Cached data |
| Redux | RTK Query |

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

**RTK Query handles:**
- Automatic caching
- Background refetching
- Loading states
- Error handling
- Optimistic updates
- Cache invalidation

**Benefits:**
- Less boilerplate than manual fetching
- Automatic cache management
- Reduces need for client state
- Built-in polling and refetching

---

## 16. What Happens When You Dispatch?

**Flow:**

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

| Feature | Redux (RTK) | Zustand |
|---------|-------------|---------|
| Boilerplate | Medium | Minimal |
| Learning curve | Moderate | Easy |
| Structure | Strict | Flexible |
| Best for | Large apps | Small-medium apps |
| Async logic | createAsyncThunk | Built-in |
| Provider | Required | Not required |
| DevTools | Built-in | Middleware |
| Middleware | Extensive | Limited |
| TypeScript | Excellent | Excellent |

**Redux is better for:**
- Large applications
- Complex business logic
- Strict structure needed
- Team collaboration
- Extensive middleware needs

**Zustand is better for:**
- Simpler state needs
- Rapid development
- Less boilerplate
- Smaller teams
- Minimal setup

---

## 20. When NOT to Use Redux

**Don't use Redux when:**

1. **Small apps** - useState or Context is enough
2. **Apps without much shared state** - Local state is simpler
3. **Simple CRUD apps** - RTK Query might be enough without full Redux
4. **Learning React** - Focus on React first, add Redux later

**Signs you might not need Redux:**
- Most state is local to components
- Few components share state
- No complex state interactions
- Team finds it too complex

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

**What it provides:**
- View all actions dispatched
- Inspect state after each action
- Time-travel debugging
- State diff view
- Action replay

**Automatically enabled in RTK:**

```javascript
const store = configureStore({
  reducer: rootReducer,
  // DevTools automatically enabled in development
  devTools: process.env.NODE_ENV !== 'production'
});
```

**Features:**
- **Action tab** - See all dispatched actions
- **State tab** - Inspect current state
- **Diff tab** - See what changed
- **Jump to action** - Travel back in time
- **Export/Import** - Save and restore state

---

## 23. Redux Middleware

**What is middleware:**
Code that runs between dispatching an action and reaching the reducer.

**Common middleware:**
- **Thunk** - Async logic (built into RTK)
- **Logger** - Log actions and state
- **Saga** - Complex async flows
- **Observable** - RxJS integration

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

---

## 29. Summary

**Key takeaways:**

1. **Redux provides predictable state** - Single source of truth, strict patterns
2. **Use Redux Toolkit** - Modern Redux with less boilerplate
3. **Actions describe events** - "what happened", not "what to do"
4. **Reducers must be pure** - No side effects, no mutations
5. **One-way data flow** - Actions → Reducer → Store → UI
6. **createSlice simplifies Redux** - Less code, automatic action creators
7. **createAsyncThunk for async** - Handles loading states automatically
8. **RTK Query for API data** - Caching and fetching built-in

**When to use Redux:**
- Large applications
- Complex state interactions
- Need strict structure
- Team collaboration
- Extensive debugging needs

**When to use alternatives:**
- Small apps (useState, useReducer)
- Simple global state (Context, Zustand)
- Only server state (React Query, SWR)
- Rapid prototyping (Zustand)

Redux with Redux Toolkit provides a powerful, scalable state management solution for complex React applications.
