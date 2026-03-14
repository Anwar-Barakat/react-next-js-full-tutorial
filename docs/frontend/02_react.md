# React Fundamentals Guide

---

## 1. Core Concepts

- **Component-Based** — Reusable, encapsulated UI pieces with their own state
- **Virtual DOM** — In-memory copy of the real DOM; React diffs and patches only changed parts
- **JSX** — Syntax extension compiled to `React.createElement()` calls
- **Unidirectional Data Flow** — Data flows parent → child via props
- **Hooks** — Use state and lifecycle in functional components (no classes needed)

**JSX rules:** single root element, `{}` for JS expressions, camelCase attributes, self-close empty tags.

```jsx
// JSX compiles to React.createElement
<h1 className="title">Hello</h1>
// → React.createElement('h1', { className: 'title' }, 'Hello')
```

---

## 2. Components, Props & State

```jsx
function UserCard({ name, age, onAction, children }) {
  const [isActive, setIsActive] = useState(true);

  return (
    <div className="card">
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <button onClick={() => setIsActive(!isActive)}>
        {isActive ? 'Active' : 'Inactive'}
      </button>
      <button onClick={onAction}>Action</button>
      {children}
    </div>
  );
}
```

**Props** are read-only and passed from parent to child. **State** is mutable data owned by the component.

**State rules:**

```jsx
// Never mutate state directly
setUser({ ...user, age: 26 });       // ✅ new object
user.age = 26; setUser(user);         // ❌ same reference

// Use functional update when new state depends on previous
setCount(prev => prev + 1);           // ✅
setCount(count + 1);                  // ❌ stale closure risk
```

---

## 3. Event Handling

```jsx
function EventExamples() {
  return (
    <div>
      <button onClick={handleClick}>Click</button>
      <button onClick={() => handleClick(42)}>With arg</button>
      <input onChange={e => console.log(e.target.value)} />

      <form onSubmit={e => { e.preventDefault(); /* handle */ }}>
        <div onClick={() => console.log('parent')}>
          <button onClick={e => { e.stopPropagation(); }}>Child only</button>
        </div>
      </form>
    </div>
  );
}
```

---

## 4. Conditional & List Rendering

```jsx
function Examples({ isLoggedIn, role, items }) {
  if (!isLoggedIn) return <Login />;

  return (
    <div>
      {isLoggedIn ? <Dashboard /> : <Guest />}
      {role === 'admin' && <AdminPanel />}

      {/* Lists — always use stable unique keys */}
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

Avoid using array indexes as keys — they break with reordering/filtering.

---

## 5. Form Handling

**Controlled** (recommended) — React state drives the value.

```jsx
function ControlledForm() {
  const [form, setForm] = useState({ username: '', agree: false });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  return (
    <form onSubmit={e => { e.preventDefault(); console.log(form); }}>
      <input name="username" value={form.username} onChange={handleChange} />
      <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
}
```

For complex forms, prefer **React Hook Form + Zod** (see section 18).

---

## 6. React Hooks

**Rules:** call only at top level, only inside React functions or custom hooks.

| Hook | Purpose |
|---|---|
| `useState` | Component state |
| `useEffect` | Side effects, lifecycle |
| `useContext` | Read shared context |
| `useRef` | DOM access / mutable value |
| `useReducer` | Complex state logic |
| `useMemo` | Cache expensive calculations |
| `useCallback` | Stable callback references |

---

## 7. useEffect

```jsx
// Mount only
useEffect(() => { fetchUser(); }, []);

// On dependency change
useEffect(() => { document.title = `Count: ${count}`; }, [count]);

// Cleanup (runs before unmount or before re-run)
useEffect(() => {
  const timer = setInterval(() => console.log('tick'), 1000);
  return () => clearInterval(timer);
}, []);
```

---

## 8. useRef

Persists a value across renders without triggering re-renders.

```jsx
function RefExamples() {
  const inputRef = useRef(null);      // DOM access
  const renderCount = useRef(0);      // render counter (no re-render)

  const [count, setCount] = useState(0);
  const prevCount = useRef();
  useEffect(() => { prevCount.current = count; }, [count]);

  return (
    <div>
      <input ref={inputRef} />
      <button onClick={() => inputRef.current.focus()}>Focus</button>
      <p>Prev: {prevCount.current} | Current: {count}</p>
    </div>
  );
}
```

---

## 9. useReducer

For complex state with multiple related actions.

```jsx
const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD':    return { todos: [...state.todos, { id: Date.now(), text: action.payload, done: false }] };
    case 'TOGGLE': return { todos: state.todos.map(t => t.id === action.payload ? { ...t, done: !t.done } : t) };
    case 'DELETE': return { todos: state.todos.filter(t => t.id !== action.payload) };
    default:       return state;
  }
};

function TodoApp() {
  const [state, dispatch] = useReducer(reducer, { todos: [] });

  return (
    <div>
      <button onClick={() => dispatch({ type: 'ADD', payload: 'New task' })}>Add</button>
      {state.todos.map(t => (
        <div key={t.id}>
          <span onClick={() => dispatch({ type: 'TOGGLE', payload: t.id })}>{t.text}</span>
          <button onClick={() => dispatch({ type: 'DELETE', payload: t.id })}>Delete</button>
        </div>
      ))}
    </div>
  );
}
```

---

## 10. useMemo & useCallback

```jsx
// useMemo — cache a computed VALUE
const total = useMemo(
  () => items.reduce((sum, item) => sum + item.price, 0) * multiplier,
  [items, multiplier]
);

// useCallback — cache a FUNCTION reference
const addItem = useCallback((item) => {
  setItems(prev => [...prev, item]);
}, []);

// React.memo — skip re-render if props unchanged
const Child = React.memo(({ onAdd }) => (
  <button onClick={() => onAdd('x')}>Add</button>
));
```

Only use these when there is a measurable performance problem.

---

## 11. useContext

```jsx
const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState('light');
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Header />
    </ThemeContext.Provider>
  );
}

function Header() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <header className={theme}>
      <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
        Toggle
      </button>
    </header>
  );
}
```

---

## 12. Custom Hooks

Reusable functions encapsulating hook logic. Must start with `use`.

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url)
      .then(r => r.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}
```

---

## 13. Performance Optimization

- **Prevent re-renders** — `React.memo`, `useMemo`, `useCallback`
- **Large bundles** — Code splitting with `React.lazy` + `Suspense`
- **Long lists** — Virtualization with `react-window`

```jsx
const Dashboard = lazy(() => import('./Dashboard'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard />
    </Suspense>
  );
}
```

---

## 14. Higher-Order Components (HOC)

A function that wraps a component to add behaviour. Custom hooks are often a simpler modern alternative.

```jsx
function withAuth(Component) {
  return function WithAuth(props) {
    const { user } = useContext(AuthContext);
    if (!user) return <Navigate to="/login" />;
    return <Component {...props} user={user} />;
  };
}

const ProtectedPage = withAuth(Dashboard);
```

---

## 15. React Router

```jsx
import { BrowserRouter, Routes, Route, Link, NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
        <Link to="/users">Users</Link>
      </nav>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="users/:id" element={<UserDetail />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

function Layout() {
  return <><nav /><Outlet /></>;  // child routes render at <Outlet />
}

function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  return <button onClick={() => navigate('/users')}>Back — user {id}</button>;
}

// Protected route
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}
```

---

## 16. React Hook Form + Zod

```bash
npm install react-hook-form zod @hookform/resolvers
```

```jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  username: z.string().min(3, 'Min 3 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6),
  confirmPassword: z.string()
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

type FormData = z.infer<typeof schema>;

function SignupForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  return (
    <form onSubmit={handleSubmit(async (data) => { await submit(data); reset(); })}>
      <input {...register('username')} placeholder="Username" />
      {errors.username && <span>{errors.username.message}</span>}

      <input {...register('email')} type="email" placeholder="Email" />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register('password')} type="password" />
      <input {...register('confirmPassword')} type="password" />
      {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

---

## 17. Error Boundaries, Fragments & Portals

**Error Boundaries** — catch render errors in children; must be class components.

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { console.error(error, info); }
  render() {
    return this.state.hasError ? <h1>Something went wrong.</h1> : this.props.children;
  }
}
```

**Fragments** — group elements without extra DOM nodes: `<>...</>` or `<React.Fragment key={id}>`.

**Portals** — render into a DOM node outside the React root:

```jsx
import { createPortal } from 'react-dom';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.getElementById('modal-root')
  );
}
```

---

## Best Practices

- Prefer function components with hooks over class components
- Keep components small and focused on a single responsibility
- Lift state to the nearest common ancestor
- Use unique, stable keys in lists — never array index when list can reorder
- Never mutate state directly; always create new objects/arrays
- Use functional updates (`prev => ...`) when new state depends on previous
- Memoize (`React.memo`, `useMemo`, `useCallback`) only when you have a measured performance problem
- Prefer React Hook Form + Zod for non-trivial forms
- Always clean up subscriptions, timers, and event listeners in `useEffect` cleanup
