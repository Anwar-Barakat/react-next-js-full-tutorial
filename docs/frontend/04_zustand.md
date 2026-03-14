# Zustand State Management Guide

Lightweight, hooks-based state management for React. No providers, no boilerplate, <1KB.

---

## Creating a Store

`set()` merges state; `get()` reads current state inside actions.

```javascript
import { create } from 'zustand';

const useStore = create((set, get) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
  doubleCount: () => get().count * 2
}));
```

**Partial / nested updates:**

```javascript
const useStore = create((set) => ({
  user: { name: 'John', age: 30 },
  updateName: (name) => set((state) => ({ user: { ...state.user, name } }))
}));
```

---

## Using Zustand in Components

Always select only what you need — prevents re-renders on unrelated state changes.

```javascript
// ❌ Re-renders on any state change
const store = useStore();

// ✅ Re-renders only when count changes
const count = useStore((state) => state.count);
const increment = useStore((state) => state.increment);
```

When selecting multiple values, use `shallow` to avoid new-object re-renders:

```javascript
import { shallow } from 'zustand/shallow';

const { name, age } = useStore(
  (state) => ({ name: state.user.name, age: state.user.age }),
  shallow
);
```

---

## Async Logic

Async actions work directly — no middleware required.

```javascript
const useStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  fetchUser: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/users/${id}`);
      set({ user: await res.json(), loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  }
}));
```

---

## Middleware

Built-in middleware: `persist`, `devtools`, `immer`, `subscribeWithSelector`.

### Persist

```javascript
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set) => ({ count: 0, increment: () => set((s) => ({ count: s.count + 1 })) }),
    {
      name: 'counter-storage',
      partialize: (state) => ({ count: state.count }) // persist only specific keys
    }
  )
);
```

### Devtools

```javascript
import { devtools } from 'zustand/middleware';

const useStore = create(
  devtools(
    (set) => ({
      user: null,
      login: (user) => set({ user }, false, 'user/login'),
      logout: () => set({ user: null }, false, 'user/logout')
    }),
    { name: 'UserStore' }
  )
);
```

### Immer

Simplifies deeply nested updates with mutable-looking syntax.

```javascript
import { immer } from 'zustand/middleware/immer';

const useStore = create(
  immer((set) => ({
    user: { profile: { address: { city: 'NYC' } } },
    updateCity: (city) => set((state) => { state.user.profile.address.city = city; })
  }))
);
```

### Combining Middleware

```javascript
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

const useStore = create(
  devtools(
    persist(
      immer((set) => ({
        count: 0,
        increment: () => set((state) => { state.count += 1; })
      })),
      { name: 'app-storage' }
    ),
    { name: 'AppStore' }
  )
);
// Order: devtools → persist → immer → store
```

---

## TypeScript

Separate state and action types for clarity.

```typescript
import { create } from 'zustand';

interface UserState {
  user: User | null;
  token: string | null;
}

interface UserActions {
  login: (user: User, token: string) => void;
  logout: () => void;
}

const useUserStore = create<UserState & UserActions>((set) => ({
  user: null,
  token: null,
  login: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null })
}));
```

With middleware, add an extra `()` after `create`:

```typescript
const useStore = create<Store>()(devtools(persist(immer((set) => ({ ... })), { name: 'x' })));
```

---

## Multiple Stores, Slices & Reset

**Separate stores by domain:**

```javascript
export const useUserStore = create((set) => ({ user: null, login: (u) => set({ user: u }) }));
export const useCartStore = create((set) => ({
  items: [],
  addItem: (item) => set((s) => ({ items: [...s.items, item] }))
}));
```

**Slices pattern** (combine related state into one store):

```javascript
const createUserSlice = (set) => ({ user: null, login: (u) => set({ user: u }) });
const createCartSlice = (set) => ({ items: [], addItem: (item) => set((s) => ({ items: [...s.items, item] })) });

const useStore = create((set, get) => ({
  ...createUserSlice(set, get),
  ...createCartSlice(set, get)
}));
```

**Resetting state:**

```javascript
const initialState = { count: 0, user: null };

const useStore = create((set) => ({
  ...initialState,
  increment: () => set((s) => ({ count: s.count + 1 })),
  reset: () => set(initialState)
}));
```

---

## Testing

```javascript
import { renderHook, act } from '@testing-library/react';
import { useStore } from './store';

test('increment increases count', () => {
  const { result } = renderHook(() => useStore());
  act(() => result.current.increment());
  expect(result.current.count).toBe(1);
});

afterEach(() => {
  useStore.setState({ count: 0, user: null }); // reset between tests
});
```

---

## When to Use Zustand

**Good for:** auth state, shopping cart, UI state (modals, sidebars), multi-step forms, user preferences, real-time data.

**Not ideal for:** server state (use React Query/SWR), single-component local state (use `useState`), very large apps (consider Redux Toolkit).

---

## Best Practices

- Keep stores domain-focused — one store per concern (auth, cart, UI)
- Always use selectors; never consume the entire store in a component
- Use `shallow` when selecting multiple values at once
- Name devtools actions (`false, 'slice/action'`) for readable DevTools history
- Prefer `persist` + `partialize` over persisting the entire store

---

## Zustand vs Alternatives

| | Zustand | Redux Toolkit | Context API |
|---|---|---|---|
| Bundle size | <1KB | ~10KB | 0 |
| Boilerplate | Minimal | Medium | Low |
| Selective re-renders | Yes | Yes | No |
| Provider required | No | Yes | Yes |
| Built-in async | Yes | createAsyncThunk | No |
| Best for | Small–medium apps | Large apps | Infrequent updates |
