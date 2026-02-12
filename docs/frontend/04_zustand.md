# Zustand State Management Guide

A comprehensive guide to Zustand, the lightweight state management library for React.

---

## Table of Contents

1. [What is Zustand?](#1-what-is-zustand)
2. [Why use Zustand?](#2-why-use-zustand)
3. [How does Zustand work?](#3-how-does-zustand-work)
4. [Creating a Zustand Store](#4-creating-a-zustand-store)
5. [Using Zustand in Components](#5-using-zustand-in-components)
6. [Updating State](#6-updating-state)
7. [Selecting State Slices](#7-selecting-state-slices)
8. [Avoiding Unnecessary Re-renders](#8-avoiding-unnecessary-re-renders)
9. [Async Logic in Zustand](#9-async-logic-in-zustand)
10. [Zustand Middleware](#10-zustand-middleware)
11. [Persist Middleware](#11-persist-middleware)
12. [Devtools Middleware](#12-devtools-middleware)
13. [Immer Middleware](#13-immer-middleware)
14. [Combining Multiple Middlewares](#14-combining-multiple-middlewares)
15. [TypeScript with Zustand](#15-typescript-with-zustand)
16. [Multiple Stores](#16-multiple-stores)
17. [Resetting State](#17-resetting-state)
18. [Testing Zustand Stores](#18-testing-zustand-stores)
19. [Zustand vs Redux](#19-zustand-vs-redux)
20. [Zustand vs Context API](#20-zustand-vs-context-api)
21. [When to Use Zustand](#21-when-to-use-zustand)
22. [Best Practices](#22-best-practices)
23. [Common Patterns](#23-common-patterns)
24. [Performance Optimization](#24-performance-optimization)
25. [Summary](#25-summary)

---

## 1. What is Zustand?

**Zustand** is a lightweight state management library for React.

**Key characteristics:**
- Uses hooks to manage global state
- No reducers, no actions, no boilerplate
- Small bundle size (less than 1KB)
- Simple and intuitive API
- Works with React 16.8+ (hooks)

**Philosophy:**
Zustand follows a minimalist approach - you create a store with a hook, and components subscribe only to the state they need.

---

## 2. Why use Zustand?

**Advantages:**
- **Very simple API** - easier to learn than Redux
- **Less code** - no actions, reducers, or providers
- **Performance** - components only re-render when their selected state changes
- **TypeScript support** - excellent type inference
- **No context providers** - works without wrapping your app
- **Small bundle size** - minimal impact on app size
- **Flexible** - can be used with or without middleware

**Great for:**
- Small to medium apps
- Rapid prototyping
- Projects where Redux feels like overkill
- Teams new to state management

---

## 3. How does Zustand work?

**Core concepts:**

1. **Store** - A hook that holds state and actions together
2. **Subscription** - Components subscribe only to the state they need
3. **Immutability** - State updates create new objects (like Redux)
4. **Selective re-renders** - Only components using changed state re-render

**Flow:**
```
Create store → Components subscribe → State changes → Only subscribers re-render
```

**Creation:**
Stores are created using the `create()` function from Zustand.

---

## 4. Creating a Zustand Store

**Basic store:**

```javascript
import { create } from 'zustand';

// Create a store
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 })
}));
```

**What's happening:**
- `create()` accepts a function that receives `set` and `get` functions
- `set()` updates the state
- `get()` reads current state (useful in actions)
- Return an object with state and actions

**With get function:**

```javascript
const useStore = create((set, get) => ({
  count: 0,
  increment: () => {
    const currentCount = get().count; // Read current state
    set({ count: currentCount + 1 });
  },
  doubleCount: () => {
    const { count } = get();
    return count * 2;
  }
}));
```

---

## 5. Using Zustand in Components

**Access entire store:**

```javascript
import useStore from './store';

function Counter() {
  const store = useStore(); // ❌ Gets entire store, re-renders on any change

  return (
    <div>
      <p>Count: {store.count}</p>
      <button onClick={store.increment}>+</button>
    </div>
  );
}
```

**Select specific state (recommended):**

```javascript
function Counter() {
  const count = useStore((state) => state.count); // ✅ Only count
  const increment = useStore((state) => state.increment); // ✅ Only increment

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
    </div>
  );
}
```

**Multiple selections:**

```javascript
function Counter() {
  const { count, increment, decrement } = useStore((state) => ({
    count: state.count,
    increment: state.increment,
    decrement: state.decrement
  }));

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}
```

---

## 6. Updating State

**Simple update:**

```javascript
const useStore = create((set) => ({
  count: 0,
  // Direct object
  increment: () => set({ count: 1 })
}));
```

**Update based on previous state:**

```javascript
const useStore = create((set) => ({
  count: 0,
  // Function receives current state
  increment: () => set((state) => ({ count: state.count + 1 }))
}));
```

**Partial updates:**

```javascript
const useStore = create((set) => ({
  user: { name: 'John', age: 30 },
  updateName: (name) => set((state) => ({
    user: { ...state.user, name } // ✅ Spread to preserve other properties
  }))
}));
```

**Replace flag:**

```javascript
const useStore = create((set) => ({
  user: { name: 'John', age: 30 },
  // Replace entire state instead of merging
  resetUser: () => set({ user: { name: '', age: 0 } }, true)
}));
```

---

## 7. Selecting State Slices

**Why select slices:**
Components only re-render when their selected state changes.

**❌ Bad - re-renders on any state change:**

```javascript
function Component() {
  const store = useStore(); // Gets everything
  return <div>{store.user.name}</div>;
}
```

**✅ Good - re-renders only when name changes:**

```javascript
function Component() {
  const name = useStore((state) => state.user.name);
  return <div>{name}</div>;
}
```

**Derived state:**

```javascript
const useStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  }))
}));

// Derive count from items
function ItemCount() {
  const count = useStore((state) => state.items.length);
  return <div>Items: {count}</div>;
}
```

---

## 8. Avoiding Unnecessary Re-renders

**Problem:**
Creating new objects in selectors causes re-renders.

**❌ Bad - creates new object every time:**

```javascript
function Component() {
  const { name, age } = useStore((state) => ({
    name: state.user.name,
    age: state.user.age
  })); // New object every render

  return <div>{name} - {age}</div>;
}
```

**✅ Solution 1 - Use shallow equality:**

```javascript
import { create } from 'zustand';
import { shallow } from 'zustand/shallow';

function Component() {
  const { name, age } = useStore(
    (state) => ({ name: state.user.name, age: state.user.age }),
    shallow // Compare object properties, not reference
  );

  return <div>{name} - {age}</div>;
}
```

**✅ Solution 2 - Select primitives separately:**

```javascript
function Component() {
  const name = useStore((state) => state.user.name);
  const age = useStore((state) => state.user.age);

  return <div>{name} - {age}</div>;
}
```

---

## 9. Async Logic in Zustand

**Async actions:**

Zustand supports async logic directly in actions - no middleware needed.

```javascript
const useStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  fetchUser: async (id) => {
    set({ loading: true, error: null });

    try {
      const res = await fetch(`/api/users/${id}`);
      const user = await res.json();
      set({ user, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  }
}));
```

**Using in component:**

```javascript
function UserProfile({ userId }) {
  const { user, loading, error, fetchUser } = useStore((state) => ({
    user: state.user,
    loading: state.loading,
    error: state.error,
    fetchUser: state.fetchUser
  }));

  useEffect(() => {
    fetchUser(userId);
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>{user?.name}</div>;
}
```

---

## 10. Zustand Middleware

**What is middleware:**
Middleware enhances store behavior by wrapping the `set` function.

**Built-in middleware:**
- `persist` - Saves state to localStorage/sessionStorage
- `devtools` - Redux DevTools integration
- `immer` - Write mutable code that becomes immutable
- `combine` - Combine multiple stores
- `subscribeWithSelector` - Subscribe to specific state changes

**How middleware works:**

```javascript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useStore = create(
  devtools((set) => ({ // Middleware wraps the store
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 }))
  }))
);
```

---

## 11. Persist Middleware

**Purpose:**
Save state to localStorage or sessionStorage.

**Basic usage:**

```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 }))
    }),
    {
      name: 'counter-storage' // Unique name for localStorage key
    }
  )
);
```

**Custom storage:**

```javascript
const useStore = create(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme })
    }),
    {
      name: 'app-theme',
      storage: sessionStorage // Use sessionStorage instead
    }
  )
);
```

**Partial persistence:**

```javascript
const useStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      tempData: null,
      login: (user, token) => set({ user, token })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token
        // tempData not persisted
      })
    }
  )
);
```

**Use cases:**
- Authentication tokens
- User preferences (theme, language)
- Shopping cart data
- Form drafts

---

## 12. Devtools Middleware

**Purpose:**
Integrate with Redux DevTools for debugging.

**Basic usage:**

```javascript
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useStore = create(
  devtools((set) => ({
    count: 0,
    increment: () => set((state) => ({ count: state.count + 1 }), false, 'increment'),
    decrement: () => set((state) => ({ count: state.count - 1 }), false, 'decrement')
  }))
);
```

**With action names:**

```javascript
const useStore = create(
  devtools(
    (set) => ({
      user: null,
      login: (user) => set({ user }, false, 'user/login'),
      logout: () => set({ user: null }, false, 'user/logout')
    }),
    { name: 'UserStore' } // Store name in DevTools
  )
);
```

---

## 13. Immer Middleware

**Problem:**
Updating nested state requires spreading every level.

**❌ Without Immer:**

```javascript
const useStore = create((set) => ({
  user: {
    profile: {
      address: {
        city: 'NYC'
      }
    }
  },
  updateCity: (city) => set((state) => ({
    user: {
      ...state.user,
      profile: {
        ...state.user.profile,
        address: {
          ...state.user.profile.address,
          city
        }
      }
    }
  }))
}));
```

**✅ With Immer - write mutable code:**

```javascript
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

const useStore = create(
  immer((set) => ({
    user: {
      profile: {
        address: {
          city: 'NYC'
        }
      }
    },
    updateCity: (city) => set((state) => {
      state.user.profile.address.city = city; // Looks like mutation, but immutable
    })
  }))
);
```

**Benefits:**
- Shorter, more readable code
- Less chance of mistakes
- Deep updates are simpler

---

## 14. Combining Multiple Middlewares

**Stack middleware:**

```javascript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

const useStore = create(
  devtools(
    persist(
      immer((set) => ({
        count: 0,
        user: null,
        increment: () => set((state) => { state.count += 1; }),
        setUser: (user) => set((state) => { state.user = user; })
      })),
      { name: 'app-storage' }
    ),
    { name: 'AppStore' }
  )
);
```

**Order matters:**
```
devtools → persist → immer → store
```

DevTools wraps everything, persist handles storage, immer handles immutability.

---

## 15. TypeScript with Zustand

**Basic typing:**

```typescript
import { create } from 'zustand';

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

const useStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 })
}));
```

**Separating state and actions:**

```typescript
interface UserState {
  user: User | null;
  token: string | null;
}

interface UserActions {
  login: (user: User, token: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

type UserStore = UserState & UserActions;

const useUserStore = create<UserStore>((set) => ({
  user: null,
  token: null,
  login: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
  updateProfile: (data) => set((state) => ({
    user: state.user ? { ...state.user, ...data } : null
  }))
}));
```

**With middleware:**

```typescript
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface Store {
  count: number;
  increment: () => void;
}

const useStore = create<Store>()(
  devtools(
    persist(
      immer((set) => ({
        count: 0,
        increment: () => set((state) => { state.count += 1; })
      })),
      { name: 'counter' }
    )
  )
);
```

---

## 16. Multiple Stores

**Zustand supports multiple stores:**

```javascript
// stores/userStore.js
export const useUserStore = create((set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null })
}));

// stores/cartStore.js
export const useCartStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  })),
  removeItem: (id) => set((state) => ({
    items: state.items.filter(item => item.id !== id)
  }))
}));

// Component using both stores
function CheckoutPage() {
  const user = useUserStore((state) => state.user);
  const items = useCartStore((state) => state.items);

  return (
    <div>
      <p>User: {user?.name}</p>
      <p>Items: {items.length}</p>
    </div>
  );
}
```

**When to use multiple stores:**
- Different concerns (auth, cart, settings)
- Different persistence strategies
- Different update frequencies
- Clearer separation of concerns

---

## 17. Resetting State

**Reset to initial state:**

```javascript
const initialState = {
  count: 0,
  user: null
};

const useStore = create((set) => ({
  ...initialState,
  increment: () => set((state) => ({ count: state.count + 1 })),
  reset: () => set(initialState)
}));
```

**Reset specific parts:**

```javascript
const useStore = create((set) => ({
  count: 0,
  user: null,
  resetCount: () => set({ count: 0 }),
  resetUser: () => set({ user: null })
}));
```

---

## 18. Testing Zustand Stores

**Test store directly:**

```javascript
import { renderHook, act } from '@testing-library/react';
import { useStore } from './store';

test('increment increases count', () => {
  const { result } = renderHook(() => useStore());

  expect(result.current.count).toBe(0);

  act(() => {
    result.current.increment();
  });

  expect(result.current.count).toBe(1);
});
```

**Reset store between tests:**

```javascript
import { useStore } from './store';

afterEach(() => {
  useStore.setState({ count: 0, user: null });
});
```

---

## 19. Zustand vs Redux

| Feature | Zustand | Redux | Redux Toolkit |
|---------|---------|-------|---------------|
| Boilerplate | Minimal | High | Medium |
| Learning curve | Easy | Steep | Moderate |
| Bundle size | <1KB | ~20KB | ~10KB |
| Setup | One function | Store, reducers, actions | configureStore |
| Async logic | Built-in | Requires middleware | createAsyncThunk |
| DevTools | Optional middleware | Built-in | Built-in |
| Provider | Not needed | Required | Required |
| TypeScript | Excellent | Good | Excellent |
| Best for | Small-medium apps | Large apps | Large apps |

**When to choose Zustand:**
- Simple state management needs
- Want minimal boilerplate
- Small to medium projects
- Rapid prototyping

**When to choose Redux:**
- Large, complex applications
- Need strict structure
- Large teams
- Existing Redux ecosystem

---

## 20. Zustand vs Context API

| Feature | Zustand | Context API |
|---------|---------|-------------|
| Re-renders | Selective | All consumers |
| Performance | Excellent | Can be slow |
| Setup | Simple | Requires Provider |
| Multiple stores | Easy | Multiple contexts |
| Middleware | Yes | No |
| Persistence | Built-in | Custom |
| DevTools | Yes | No |
| Best for | Frequent updates | Infrequent updates |

**Context API re-render problem:**

```javascript
// ❌ Context - all consumers re-render
const AppContext = createContext();

function Provider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');

  return (
    <AppContext.Provider value={{ user, theme, setUser, setTheme }}>
      {children}
    </AppContext.Provider>
  );
}

// This re-renders even if only theme changes
function UserDisplay() {
  const { user } = useContext(AppContext);
  return <div>{user?.name}</div>;
}
```

**✅ Zustand - selective re-renders:**

```javascript
const useStore = create((set) => ({
  user: null,
  theme: 'light',
  setUser: (user) => set({ user }),
  setTheme: (theme) => set({ theme })
}));

// Only re-renders when user changes
function UserDisplay() {
  const user = useStore((state) => state.user);
  return <div>{user?.name}</div>;
}
```

---

## 21. When to Use Zustand

**✅ Good use cases:**
- User authentication state
- Shopping cart
- UI state (modals, sidebars)
- Form data across steps
- User preferences
- Real-time data (chat, notifications)

**❌ Not ideal for:**
- Server state (use React Query, SWR instead)
- Very simple local state (use useState)
- Single component state
- Extremely large apps (consider Redux)

---

## 22. Best Practices

**1. Keep stores focused:**

```javascript
// ✅ Good - focused stores
const useAuthStore = create(...);
const useCartStore = create(...);
const useUIStore = create(...);

// ❌ Bad - everything in one store
const useStore = create(...); // Auth + Cart + UI + everything
```

**2. Use selectors:**

```javascript
// ✅ Good - select only what you need
const count = useStore((state) => state.count);

// ❌ Bad - get entire store
const store = useStore();
```

**3. Avoid derived state in store:**

```javascript
// ❌ Bad - storing derived value
const useStore = create((set, get) => ({
  items: [],
  itemCount: 0, // Derived from items
  addItem: (item) => set((state) => ({
    items: [...state.items, item],
    itemCount: state.items.length + 1
  }))
}));

// ✅ Good - compute in component
const useStore = create((set) => ({
  items: [],
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  }))
}));

function Component() {
  const itemCount = useStore((state) => state.items.length);
}
```

**4. Use TypeScript:**

```typescript
// ✅ Type safety
interface Store {
  count: number;
  increment: () => void;
}

const useStore = create<Store>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 }))
}));
```

---

## 23. Common Patterns

**Pattern 1: Slices pattern (like Redux Toolkit):**

```javascript
const createUserSlice = (set) => ({
  user: null,
  login: (user) => set({ user }),
  logout: () => set({ user: null })
});

const createCartSlice = (set) => ({
  items: [],
  addItem: (item) => set((state) => ({
    items: [...state.items, item]
  }))
});

const useStore = create((set, get) => ({
  ...createUserSlice(set, get),
  ...createCartSlice(set, get)
}));
```

**Pattern 2: Actions outside store:**

```javascript
const useStore = create((set) => ({
  count: 0
}));

// Actions as separate functions
export const increment = () => useStore.setState((state) => ({
  count: state.count + 1
}));

export const decrement = () => useStore.setState((state) => ({
  count: state.count - 1
}));
```

**Pattern 3: Subscriptions:**

```javascript
// Subscribe to changes outside React
useStore.subscribe(
  (state) => state.count,
  (count) => {
    console.log('Count changed:', count);
  }
);
```

---

## 24. Performance Optimization

**1. Use shallow for multiple selections:**

```javascript
import { shallow } from 'zustand/shallow';

const { name, age } = useStore(
  (state) => ({ name: state.name, age: state.age }),
  shallow
);
```

**2. Avoid creating objects in selectors:**

```javascript
// ❌ Creates new object every render
const data = useStore((state) => ({
  name: state.user.name,
  email: state.user.email
}));

// ✅ Select primitives
const name = useStore((state) => state.user.name);
const email = useStore((state) => state.user.email);
```

**3. Batch updates:**

```javascript
const useStore = create((set) => ({
  count: 0,
  name: '',
  batchUpdate: (count, name) => set({ count, name }) // Single update
}));
```

---

## 25. Summary

**Key takeaways:**

1. **Zustand is simple** - minimal boilerplate, easy to learn
2. **Selective subscriptions** - components only re-render when their selected state changes
3. **No providers needed** - just create and use
4. **Async is built-in** - no middleware required for async actions
5. **Middleware available** - persist, devtools, immer for enhanced functionality
6. **TypeScript friendly** - excellent type inference
7. **Great for small-medium apps** - when Redux feels like overkill

**When to use Zustand:**
- Need simple global state management
- Want to avoid Redux boilerplate
- Building small to medium applications
- Need good TypeScript support
- Want built-in persistence

**When to use Redux instead:**
- Very large applications
- Need strict architecture
- Large teams with established patterns
- Complex state interactions
- Existing Redux ecosystem

Zustand provides a sweet spot between useState/Context (too simple) and Redux (too complex) for many applications.
