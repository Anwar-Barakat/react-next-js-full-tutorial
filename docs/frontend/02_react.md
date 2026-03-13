# React Fundamentals Guide

A comprehensive guide to React concepts, patterns, and best practices.

## Table of Contents

1. [What is ReactJS](#1-what-is-reactjs)
2. [Main Features of React](#2-main-features-of-react)
3. [JSX (JavaScript XML)](#3-jsx-javascript-xml)
4. [React vs ReactDOM](#4-react-vs-reactdom)
5. [Virtual DOM](#5-virtual-dom)
6. [React Components](#6-react-components)
7. [Props in React](#7-props-in-react)
8. [Props vs State](#8-props-vs-state)
9. [State in React](#9-state-in-react)
10. [Event Handling](#10-event-handling)
11. [Event Methods (preventDefault & stopPropagation)](#11-event-methods-preventdefault--stoppropagation)
12. [Conditional Rendering](#12-conditional-rendering)
13. [List Rendering and Keys](#13-list-rendering-and-keys)
14. [Form Handling](#14-form-handling)
15. [React Hooks Overview](#15-react-hooks-overview)
16. [useEffect Hook](#16-useeffect-hook)
17. [useState Hook](#17-usestate-hook)
18. [useContext Hook](#18-usecontext-hook)
19. [useRef Hook](#19-useref-hook)
20. [useReducer Hook](#20-usereducer-hook)
21. [useMemo Hook](#21-usememo-hook)
22. [useCallback Hook](#22-usecallback-hook)
23. [Custom Hooks](#23-custom-hooks)
24. [Component Lifecycle](#24-component-lifecycle)
25. [Code Splitting and Lazy Loading](#25-code-splitting-and-lazy-loading)
26. [React Performance Optimization](#26-react-performance-optimization)
27. [Prop Drilling](#27-prop-drilling)
28. [Higher-Order Components (HOC)](#28-higher-order-components-hoc)
29. [React Router](#29-react-router)
30. [React Hook Form + Zod](#30-react-hook-form--zod)
31. [State Types in React](#31-state-types-in-react)
32. [Error Boundaries](#32-error-boundaries)
33. [React Fragments](#33-react-fragments)
34. [React Portals](#34-react-portals)
35. [StrictMode](#35-strictmode)
36. [Reconciliation Process](#36-reconciliation-process)

---

## 1. What is ReactJS

JavaScript library for building UIs (Facebook/Meta). Component-based, declarative, virtual DOM, unidirectional data flow, platform agnostic (React Native for mobile).

```jsx
// Simple React component
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// Usage
<Welcome name="Anwar" />
```

---

## 2. Main Features of React

- **Component-Based** — Encapsulated components that manage their own state. Benefit: Reusability, maintainability
- **Virtual DOM** — Lightweight copy of the real DOM. Benefit: Performance optimization
- **JSX** — Syntax extension that looks like HTML. Benefit: Intuitive component structure
- **Unidirectional Data Flow** — Data flows from parent to child. Benefit: Predictable state management
- **Declarative** — Describe UI state, React updates DOM. Benefit: Less imperative code
- **React Hooks** — Use state and lifecycle without classes. Benefit: Simpler component logic

---

## 3. JSX (JavaScript XML)

**JSX** is a syntax extension for JavaScript that looks like HTML but gets compiled to `React.createElement()` calls.

**JSX Rules:**

```jsx
// 1. Must return single parent element
function Component() {
  return (
    <div>
      <h1>Title</h1>
      <p>Content</p>
    </div>
  );
}

// 2. Use {} to embed JavaScript expressions
function Greeting({ name }) {
  const time = new Date().getHours();
  const greeting = time < 12 ? 'Good morning' : 'Good afternoon';

  return <h1>{greeting}, {name.toUpperCase()}!</h1>;
}

// 3. Use camelCase for attributes
<div className="container" onClick={handleClick}>
  <input type="text" onChange={handleChange} />
</div>

// 4. Self-closing tags for elements without children
<img src="photo.jpg" alt="Photo" />
<input type="text" />
<br />
```

**JSX Compilation:**

```jsx
// JSX
<h1 className="title">Hello</h1>

// Compiled to
React.createElement('h1', { className: 'title' }, 'Hello')
```

---

## 4. React vs ReactDOM

- **Purpose** — React: Core library for creating components. ReactDOM: Renders components to the DOM
- **Platform** — React: Platform-agnostic. ReactDOM: Web-specific
- **Functions** — React: `createElement`, `useState`, `useEffect`. ReactDOM: `render`, `createRoot`, `hydrate`
- **Usage** — React: Define component logic. ReactDOM: Mount components to browser DOM

**Example:**

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';

// React - Create component
function App() {
  return <h1>Hello, World!</h1>;
}

// ReactDOM - Render to DOM
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

---

## 5. Virtual DOM

Lightweight in-memory copy of the real DOM. On state change: new Virtual DOM → diff with previous → update only changed parts in real DOM.

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  // When count changes:
  // 1. New Virtual DOM created with updated count
  // 2. React diffs: only the <p> text changed
  // 3. React updates only that text node in real DOM

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

---

## 6. React Components

Reusable pieces of UI that accept props and return React elements. Function components (modern, with hooks) are preferred over class components.

```jsx
function UserCard({ name, age }) {
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    console.log('Component mounted');
    return () => console.log('Component unmounted');
  }, []);

  return (
    <div className="card">
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <button onClick={() => setIsActive(!isActive)}>
        {isActive ? 'Active' : 'Inactive'}
      </button>
    </div>
  );
}
```

**Component Lifecycle Phases:**

1. **Mounting**: Component appears for the first time
   ```jsx
   useEffect(() => {
     console.log('Mounted');
   }, []);
   ```

2. **Updating**: Component re-renders when data changes
   ```jsx
   useEffect(() => {
     console.log('Count updated');
   }, [count]);
   ```

3. **Unmounting**: Component is removed from screen
   ```jsx
   useEffect(() => {
     return () => {
       console.log('Unmounted - cleanup');
     };
   }, []);
   ```

**Component Composition:**

```jsx
// Small components
function Avatar({ src }) {
  return <img src={src} alt="Avatar" />;
}

function UserName({ name }) {
  return <h3>{name}</h3>;
}

// Composed component
function UserProfile({ user }) {
  return (
    <div className="profile">
      <Avatar src={user.avatar} />
      <UserName name={user.name} />
    </div>
  );
}
```

---

## 7. Props in React

Read-only arguments passed from parent to child. Any data type (strings, numbers, objects, functions). Cannot be modified by the receiving component.

```jsx
// Parent passes props
function App() {
  const handleClick = () => console.log('Clicked');

  return (
    <UserCard
      name="Anwar"
      age={25}
      isAdmin={true}
      hobbies={['coding', 'reading']}
      onAction={handleClick}
    />
  );
}

// Child receives props
function UserCard({ name, age, isAdmin, hobbies, onAction }) {
  return (
    <div>
      <h2>{name}</h2>
      <p>Age: {age}</p>
      {isAdmin && <span>Admin</span>}
      <ul>
        {hobbies.map((hobby, index) => (
          <li key={index}>{hobby}</li>
        ))}
      </ul>
      <button onClick={onAction}>Click Me</button>
    </div>
  );
}
```

**Props.children:**

```jsx
// Wrapper component using children
function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}

// Usage
<Card>
  <h2>Title</h2>
  <p>Content</p>
</Card>
```

---

## 8. Props vs State

- **Source** — Props: Passed from parent component. State: Managed within component
- **Mutability** — Props: Read-only, immutable. State: Can be changed with setState/useState
- **Ownership** — Props: Owned by parent. State: Owned by component
- **Re-render** — Props: Parent change triggers re-render. State: State change triggers re-render
- **Access** — Props: Via function parameters or this.props. State: Via useState hook or this.state

**Example:**

```jsx
function Parent() {
  const [theme, setTheme] = useState('light');

  return (
    <Child theme={theme} /> // Props passed to child
  );
}

function Child({ theme }) {
  const [count, setCount] = useState(0); // Local state

  // theme is props (cannot change)
  // count is state (can change)

  return (
    <div className={theme}>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

---

## 9. State in React

**State** is data that changes over time within a component. When state changes, the component re-renders.

**State with useState:**

```jsx
function Counter() {
  // [currentValue, updateFunction]
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

**State Rules:**

1. **Never mutate state directly**:
   ```jsx
   // ❌ Wrong - Direct mutation
   function WrongComponent() {
     const [user, setUser] = useState({ name: 'Anwar', age: 25 });

     const updateAge = () => {
       user.age = 26; // ❌ Don't mutate
       setUser(user); // Won't trigger re-render (same reference)
     };
   }

   // ✅ Correct - Create new object
   function CorrectComponent() {
     const [user, setUser] = useState({ name: 'Anwar', age: 25 });

     const updateAge = () => {
       setUser({ ...user, age: 26 }); // ✅ New object
     };
   }
   ```

2. **Functional updates for dependent state**:
   ```jsx
   // ❌ Wrong - May use stale state
   setCount(count + 1);
   setCount(count + 1); // Uses same old count value

   // ✅ Correct - Use previous state
   setCount(prev => prev + 1);
   setCount(prev => prev + 1); // Uses updated value
   ```

3. **Initialize with any value**:
   ```jsx
   const [text, setText] = useState('');
   const [count, setCount] = useState(0);
   const [isOpen, setIsOpen] = useState(false);
   const [items, setItems] = useState([]);
   const [user, setUser] = useState(null);
   const [data, setData] = useState(() => expensiveComputation());
   ```

---

## 10. Event Handling

React events are named using **camelCase** and passed as functions (not strings).

**Event Handling Patterns:**

```jsx
function EventExamples() {
  const [text, setText] = useState('');

  // Method 1: Direct handler
  const handleClick = () => {
    console.log('Clicked!');
  };

  // Method 2: Handler with event object
  const handleChange = (event) => {
    setText(event.target.value);
  };

  // Method 3: Handler with parameters
  const handleButtonClick = (id) => {
    console.log('Button', id, 'clicked');
  };

  return (
    <div>
      {/* ✅ Correct - pass function reference */}
      <button onClick={handleClick}>Click Me</button>

      {/* ❌ Wrong - calls function immediately */}
      <button onClick={handleClick()}>Wrong</button>

      {/* Input with onChange */}
      <input value={text} onChange={handleChange} />

      {/* Inline arrow function */}
      <button onClick={() => console.log('Inline')}>Inline</button>

      {/* With parameters */}
      <button onClick={() => handleButtonClick(1)}>Button 1</button>
      <button onClick={() => handleButtonClick(2)}>Button 2</button>
    </div>
  );
}
```

**Common React Events:**

- **`onClick`** — Button, div clicks. Event type: `MouseEvent`
- **`onChange`** — Input, select, textarea changes. Event type: `ChangeEvent`
- **`onSubmit`** — Form submission. Event type: `FormEvent`
- **`onFocus`** — Element gains focus. Event type: `FocusEvent`
- **`onBlur`** — Element loses focus. Event type: `FocusEvent`
- **`onKeyDown`** — Key pressed. Event type: `KeyboardEvent`
- **`onMouseEnter`** — Mouse enters element. Event type: `MouseEvent`

---

## 11. Event Methods (preventDefault & stopPropagation)

**preventDefault()**: Prevents default browser behavior (form submit, link navigation).

**stopPropagation()**: Stops event from bubbling up to parent elements.

```jsx
function EventMethods() {
  // preventDefault - stop form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Don't reload page
    console.log('Form submitted');
  };

  // stopPropagation - prevent parent handler
  const handleChildClick = (e) => {
    e.stopPropagation(); // Don't trigger parent click
    console.log('Child clicked');
  };

  const handleParentClick = () => {
    console.log('Parent clicked');
  };

  return (
    <div>
      {/* preventDefault example */}
      <form onSubmit={handleSubmit}>
        <input type="text" />
        <button type="submit">Submit</button>
      </form>

      {/* stopPropagation example */}
      <div onClick={handleParentClick} style={{ padding: '20px', background: 'lightgray' }}>
        Parent
        <button onClick={handleChildClick}>
          Child (won't trigger parent)
        </button>
      </div>
    </div>
  );
}
```

**Event Bubbling:**

When an event happens on a child element, it automatically "travels up" and triggers the same event on all parent elements (from child → parent → grandparent).

---

## 12. Conditional Rendering

Render based on conditions using JS operators.

```jsx
function ConditionalExamples({ isLoggedIn, role, items }) {
  // 1. if/else (early return)
  if (!isLoggedIn) {
    return <Login />;
  }

  // 2. Ternary operator
  return (
    <div>
      <h1>{isLoggedIn ? 'Welcome back!' : 'Please login'}</h1>

      {/* 3. Logical && (render if true) */}
      {isLoggedIn && <Dashboard />}

      {/* 4. Logical && with multiple elements */}
      {role === 'admin' && (
        <>
          <AdminPanel />
          <Settings />
        </>
      )}

      {/* 5. Switch-like with object */}
      {{
        admin: <AdminView />,
        user: <UserView />,
        guest: <GuestView />
      }[role]}

      {/* 6. Null to render nothing */}
      {items.length === 0 ? <EmptyState /> : null}
    </div>
  );
}
```

---

## 13. List Rendering and Keys

Use `map()` to render lists. Each item needs a unique `key` prop so React can track changes efficiently.

```jsx
function ListExamples() {
  const users = [
    { id: 1, name: 'Anwar', age: 25 },
    { id: 2, name: 'Sara', age: 22 },
    { id: 3, name: 'Ahmed', age: 28 }
  ];

  return (
    <div>
      {/* ✅ Correct - Use unique ID as key */}
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.name} - {user.age} years old
          </li>
        ))}
      </ul>

      {/* ❌ Avoid - Using index as key (problematic with reordering) */}
      <ul>
        {users.map((user, index) => (
          <li key={index}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

Use unique IDs from data, not array indexes (breaks with reordering/filtering).

---

## 14. Form Handling

**Controlled** (React state controls value, recommended) vs **Uncontrolled** (DOM controls value, via ref).

```jsx
function ControlledForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    age: '',
    country: '',
    agree: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
      />

      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />

      <select name="country" value={formData.country} onChange={handleChange}>
        <option value="">Select Country</option>
        <option value="uae">UAE</option>
        <option value="usa">USA</option>
      </select>

      <label>
        <input
          type="checkbox"
          name="agree"
          checked={formData.agree}
          onChange={handleChange}
        />
        I agree to terms
      </label>

      <button type="submit">Submit</button>
    </form>
  );
}
```

**Uncontrolled Component:**

```jsx
function UncontrolledForm() {
  const usernameRef = useRef(null);
  const emailRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({
      username: usernameRef.current.value,
      email: emailRef.current.value
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" ref={usernameRef} placeholder="Username" />
      <input type="email" ref={emailRef} placeholder="Email" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## 15. React Hooks Overview

Built-in functions for state and lifecycle in functional components.

**Rules:**

1. **Only call at top level** (not inside loops, conditions, or nested functions)
2. **Only call in React functions** (components or custom hooks)
3. **Custom hooks must start with "use"**

**Common React Hooks:**

- **`useState`** — Add state to component. Returns: `[state, setState]`
- **`useEffect`** — Side effects, lifecycle. Returns: Cleanup function
- **`useContext`** — Access context value. Returns: Context value
- **`useRef`** — Store mutable value, DOM access. Returns: Ref object
- **`useReducer`** — Complex state logic. Returns: `[state, dispatch]`
- **`useMemo`** — Memoize expensive calculations. Returns: Memoized value
- **`useCallback`** — Memoize function definitions. Returns: Memoized function
- **`useLayoutEffect`** — Synchronous effects before paint. Returns: Cleanup function

---

## 16. useEffect Hook

Run code after render (data fetching, subscriptions, timers, DOM manipulation).

**Dependency Patterns:**

```jsx
function EffectExamples() {
  const [count, setCount] = useState(0);
  const [user, setUser] = useState(null);

  // 1. Run after every render
  useEffect(() => {
    console.log('Runs after every render');
  });

  // 2. Run once on mount (empty array)
  useEffect(() => {
    console.log('Mounted - runs once');
    fetchUser();
  }, []);

  // 3. Run when dependencies change
  useEffect(() => {
    console.log('Count changed:', count);
    document.title = `Count: ${count}`;
  }, [count]);

  // 4. Cleanup function (runs before unmount or before re-run)
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Tick');
    }, 1000);

    // Cleanup
    return () => {
      clearInterval(timer);
      console.log('Cleanup: timer stopped');
    };
  }, []);

  // 5. Multiple dependencies
  useEffect(() => {
    if (user && count > 5) {
      console.log('User and count condition met');
    }
  }, [user, count]);
}
```

**useEffect vs useLayoutEffect:**

- **Timing** — useEffect: After browser paint. useLayoutEffect: Before browser paint
- **Blocking** — useEffect: Non-blocking. useLayoutEffect: Blocks visual updates
- **Use Case** — useEffect: Data fetching, subscriptions. useLayoutEffect: DOM measurements, layout fixes
- **User Experience** — useEffect: Sees UI first, then effect runs. useLayoutEffect: No flicker, but slower initial render

```jsx
// useEffect - Non-blocking (most common)
useEffect(() => {
  // Runs after DOM is painted
  fetchData();
}, []);

// useLayoutEffect - Blocks render (rare cases)
useLayoutEffect(() => {
  // Runs before DOM is painted
  const width = elementRef.current.offsetWidth;
  setDimensions({ width });
}, []);
```

---

## 17. useState Hook

**useState** adds state (data that changes) to functional components.

**useState Patterns:**

```jsx
function StateExamples() {
  // 1. Primitive state
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // 2. Object state
  const [user, setUser] = useState({
    name: 'Anwar',
    age: 25,
    email: 'anwar@example.com'
  });

  // Update object (immutable)
  const updateUser = () => {
    setUser(prev => ({
      ...prev,
      age: prev.age + 1
    }));
  };

  // 3. Array state
  const [items, setItems] = useState(['apple', 'banana']);

  // Add item
  const addItem = (item) => {
    setItems(prev => [...prev, item]);
  };

  // Remove item
  const removeItem = (index) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  // 4. Lazy initialization (expensive computation)
  const [data, setData] = useState(() => {
    const stored = localStorage.getItem('data');
    return stored ? JSON.parse(stored) : [];
  });

  // 5. Functional update (when new state depends on previous)
  const increment = () => {
    setCount(prev => prev + 1);
  };
}
```

---

## 18. useContext Hook

Access shared data (global state) without passing props through every level.

```jsx
// 1. Create context
const ThemeContext = createContext();

// 2. Provider component
function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Header />
      <Main />
      <Footer />
    </ThemeContext.Provider>
  );
}

// 3. Consume context with useContext
function Header() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <header className={theme}>
      <h1>My App</h1>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>
    </header>
  );
}

// Deep nested component - no prop drilling needed
function Button() {
  const { theme } = useContext(ThemeContext);
  return <button className={theme}>Click</button>;
}
```

Common uses: theme, auth, language/localization, global settings.

---

## 19. useRef Hook

**useRef** stores a value that persists between renders WITHOUT causing re-renders when changed.

**useRef Use Cases:**

```jsx
function RefExamples() {
  // 1. Access DOM elements
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus();
  };

  // 2. Store previous value
  const [count, setCount] = useState(0);
  const prevCountRef = useRef();

  useEffect(() => {
    prevCountRef.current = count;
  }, [count]);

  const prevCount = prevCountRef.current;

  // 3. Store timer ID
  const timerRef = useRef(null);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      console.log('Tick');
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
  };

  // 4. Track render count (doesn't trigger re-render)
  const renderCount = useRef(0);
  renderCount.current++;

  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus Input</button>

      <p>Current count: {count}</p>
      <p>Previous count: {prevCount}</p>

      <p>Render count: {renderCount.current}</p>
    </div>
  );
}
```

**useState vs useRef:**

- **Triggers re-render** — useState: Yes. useRef: No
- **Persists between renders** — useState: Yes. useRef: Yes
- **Use for** — useState: UI data. useRef: Non-UI data, DOM access
- **Update** — useState: Asynchronous. useRef: Synchronous

---

## 20. useReducer Hook

Manages complex state with multiple actions (like a mini Redux).

```jsx
// 1. Define reducer function
const counterReducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return { count: state.count + 1 };
    case 'DECREMENT':
      return { count: state.count - 1 };
    case 'RESET':
      return { count: 0 };
    case 'SET':
      return { count: action.payload };
    default:
      return state;
  }
};

// 2. Use in component
function Counter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>
      <button onClick={() => dispatch({ type: 'SET', payload: 10 })}>Set to 10</button>
    </div>
  );
}
```

**Complex State Example:**

```jsx
const todoReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, { id: Date.now(), text: action.payload, done: false }]
      };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload ? { ...todo, done: !todo.done } : todo
        )
      };
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload)
      };
    default:
      return state;
  }
};

function TodoApp() {
  const [state, dispatch] = useReducer(todoReducer, { todos: [] });

  // Use dispatch with actions
}
```

**useState vs useReducer:**

- **Simple state** — useState: Yes. useReducer: No
- **Multiple related values** — useState: No. useReducer: Yes
- **Complex updates** — useState: No. useReducer: Yes
- **State depends on previous** — useState: Yes. useReducer: Yes
- **Many actions** — useState: No. useReducer: Yes

---

## 21. useMemo Hook

**useMemo** memoizes (caches) expensive calculation results to avoid recalculating on every render.

**useMemo Pattern:**

```jsx
function ExpensiveComponent({ items, multiplier }) {
  // ❌ Without useMemo - recalculates every render
  const total = items.reduce((sum, item) => sum + item.price, 0) * multiplier;

  // ✅ With useMemo - only recalculates when dependencies change
  const total = useMemo(() => {
    console.log('Calculating total...');
    return items.reduce((sum, item) => sum + item.price, 0) * multiplier;
  }, [items, multiplier]);

  return <div>Total: ${total}</div>;
}
```

**React.memo (Component Memoization):**

```jsx
// Memoize entire component - only re-renders if props change
const ExpensiveChild = React.memo(function ExpensiveChild({ data }) {
  console.log('Child rendered');
  return <div>{data}</div>;
});

function Parent() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState('hello');

  // Child won't re-render when count changes (data didn't change)
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <ExpensiveChild data={data} />
    </div>
  );
}
```

**Custom Comparison Function:**

```jsx
const MemoizedComponent = React.memo(
  MyComponent,
  (prevProps, nextProps) => {
    // Return true if props are equal (skip re-render)
    return prevProps.id === nextProps.id;
  }
);
```

---

## 22. useCallback Hook

**useCallback** memoizes (caches) function definitions to prevent creating new functions on every render.

**useCallback Pattern:**

```jsx
function CallbackExample() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);

  // ❌ Without useCallback - new function every render
  const addItem = (item) => {
    setItems(prev => [...prev, item]);
  };

  // ✅ With useCallback - same function reference
  const addItem = useCallback((item) => {
    setItems(prev => [...prev, item]);
  }, []); // Only recreate if dependencies change

  // With dependency
  const incrementAndAdd = useCallback((item) => {
    setItems(prev => [...prev, item]);
    setCount(prev => prev + 1);
  }, [count]); // Recreate when count changes

  return (
    <div>
      <ExpensiveChild onAdd={addItem} />
    </div>
  );
}

// Child component memoized with React.memo
const ExpensiveChild = React.memo(({ onAdd }) => {
  console.log('Child rendered');
  return <button onClick={() => onAdd('new item')}>Add</button>;
});
```

**useMemo vs useCallback:**

```jsx
// useMemo - Returns the VALUE
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

// useCallback - Returns the FUNCTION
const memoizedFunction = useCallback(() => doSomething(a, b), [a, b]);

// Equivalence
const memoizedFunction = useMemo(() => () => doSomething(a, b), [a, b]);
```

- **`useMemo`** — Returns: Memoized value. Use case: Expensive calculations
- **`useCallback`** — Returns: Memoized function. Use case: Passing callbacks to optimized children

---

## 23. Custom Hooks

**Custom hooks** are reusable functions that contain hook logic. They must start with "use" prefix.

**Custom Hook Examples:**

```jsx
// 1. useFetch - Data fetching hook
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

// Usage
function UserProfile({ userId }) {
  const { data: user, loading, error } = useFetch(`/api/users/${userId}`);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{user.name}</div>;
}

// 2. useLocalStorage - Sync state with localStorage
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// Usage
function Settings() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current: {theme}
    </button>
  );
}

// 3. useWindowSize - Track window dimensions
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

// Usage
function ResponsiveComponent() {
  const { width } = useWindowSize();
  return <div>Width: {width}px</div>;
}
```

---

## 24. Component Lifecycle

Three phases: **Mounting** (created → `useEffect(() => {}, [])`), **Updating** (re-render → `useEffect(() => {}, [deps])`), **Unmounting** (removed → cleanup function).

```jsx
function LifecycleComponent() {
  const [count, setCount] = useState(0);

  // 1. Mount - runs once when component appears
  useEffect(() => {
    console.log('Component mounted');

    // Fetch data, set up subscriptions, etc.
    fetchData();

    // 2. Unmount - cleanup when component disappears
    return () => {
      console.log('Component unmounted');
      // Cleanup: cancel requests, remove listeners, etc.
    };
  }, []);

  // 3. Update - runs when count changes
  useEffect(() => {
    console.log('Count updated:', count);
    document.title = `Count: ${count}`;
  }, [count]);

  // 4. Every render - runs after every render
  useEffect(() => {
    console.log('Component rendered');
  });

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

**Class Component Lifecycle (Legacy):**

```jsx
class LifecycleClass extends React.Component {
  // Mount
  componentDidMount() {
    console.log('Mounted');
  }

  // Update
  componentDidUpdate(prevProps, prevState) {
    if (this.state.count !== prevState.count) {
      console.log('Count updated');
    }
  }

  // Unmount
  componentWillUnmount() {
    console.log('Unmounted');
  }

  render() {
    return <div>{this.state.count}</div>;
  }
}
```

---

## 25. Code Splitting and Lazy Loading

Split app into smaller chunks that load on demand using `React.lazy` and `Suspense`.

```jsx
import React, { lazy, Suspense } from 'react';

// 1. Lazy load components
const Dashboard = lazy(() => import('./Dashboard'));
const Profile = lazy(() => import('./Profile'));
const Settings = lazy(() => import('./Settings'));

function App() {
  const [page, setPage] = useState('dashboard');

  return (
    <div>
      <nav>
        <button onClick={() => setPage('dashboard')}>Dashboard</button>
        <button onClick={() => setPage('profile')}>Profile</button>
        <button onClick={() => setPage('settings')}>Settings</button>
      </nav>

      {/* 2. Wrap lazy components in Suspense */}
      <Suspense fallback={<div>Loading...</div>}>
        {page === 'dashboard' && <Dashboard />}
        {page === 'profile' && <Profile />}
        {page === 'settings' && <Settings />}
      </Suspense>
    </div>
  );
}
```

**Route-Based Code Splitting:**

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading page...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

Vite automatically splits chunks on dynamic imports.

---

## 26. React Performance Optimization

- **Unnecessary re-renders** → `React.memo`, `useMemo`, `useCallback`
- **Large bundle** → Code splitting with `React.lazy`
- **Expensive calculations** → `useMemo`
- **Large lists** → Virtualization (`react-window`)

```jsx
// 1. React.memo - Prevent unnecessary re-renders
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{data}</div>;
});

// 2. useMemo - Cache expensive calculations
function DataTable({ items }) {
  const sortedItems = useMemo(() => {
    return items.sort((a, b) => a.value - b.value);
  }, [items]);

  return <table>{/* render sortedItems */}</table>;
}

// 3. useCallback - Memoize callbacks
function Parent() {
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []);

  return <Child onClick={handleClick} />;
}

// 4. Virtualization - Large lists
import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>{items[index]}</div>
  );

  return (
    <FixedSizeList
      height={400}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}

// 5. Lazy initialization
const [state, setState] = useState(() => {
  // Expensive computation only runs once
  return expensiveComputation();
});

// 6. Code splitting
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

---

## 27. Prop Drilling

Passing props through components that don't need them, just to reach a deeply nested component.

```jsx
// Props passed through multiple levels
function App() {
  const [user, setUser] = useState({ name: 'Anwar' });

  return <Layout user={user} setUser={setUser} />;
}

function Layout({ user, setUser }) {
  // Layout doesn't use user, just passes it down
  return <Header user={user} setUser={setUser} />;
}

function Header({ user, setUser }) {
  // Header doesn't use user, just passes it down
  return <UserMenu user={user} setUser={setUser} />;
}

function UserMenu({ user, setUser }) {
  // Finally used here!
  return <div>{user.name}</div>;
}
```

**Solutions:**

```jsx
// Solution 1: Context API
const UserContext = createContext();

function App() {
  const [user, setUser] = useState({ name: 'Anwar' });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Layout />
    </UserContext.Provider>
  );
}

function UserMenu() {
  const { user } = useContext(UserContext);
  return <div>{user.name}</div>;
}

// Solution 2: Component Composition
function App() {
  const [user, setUser] = useState({ name: 'Anwar' });

  return (
    <Layout>
      <Header>
        <UserMenu user={user} setUser={setUser} />
      </Header>
    </Layout>
  );
}

// Solution 3: State Management Libraries
// Redux, Zustand, Jotai, Recoil, etc.
```

---

## 28. Higher-Order Components (HOC)

Function that takes a component and returns a new component with added behavior.

```jsx
// HOC that adds loading state
function withLoading(Component) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) {
      return <div>Loading...</div>;
    }
    return <Component {...props} />;
  };
}

// HOC that adds authentication check
function withAuth(Component) {
  return function WithAuthComponent(props) {
    const { user } = useContext(AuthContext);

    if (!user) {
      return <Navigate to="/login" />;
    }

    return <Component {...props} user={user} />;
  };
}

// Usage
const UserList = ({ users }) => (
  <ul>
    {users.map(user => <li key={user.id}>{user.name}</li>)}
  </ul>
);

const UserListWithLoading = withLoading(UserList);
const ProtectedUserList = withAuth(withLoading(UserList));

// Use enhanced component
<UserListWithLoading isLoading={loading} users={users} />
```

**Modern Alternative — Custom Hooks (simpler):**

```jsx
// Instead of HOC
function useAuth() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  return user;
}

// Usage (simpler than HOC)
function UserList() {
  const user = useAuth(); // More intuitive than HOC
  // ...
}
```

---

## 29. React Router

Client-side navigation for SPAs.

```jsx
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/users">Users</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**Navigation Methods:**

```jsx
// 1. Link component
<Link to="/about">About</Link>

// 2. NavLink (adds 'active' class)
<NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>
  About
</NavLink>

// 3. Programmatic navigation
function LoginForm() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // After successful login
    navigate('/dashboard');
  };
}

// 4. URL parameters
function UserDetail() {
  const { id } = useParams();
  return <div>User ID: {id}</div>;
}

// 5. Navigate component (declarative redirect)
function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
```

**Nested Routes:**

```jsx
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="users" element={<Users />}>
          <Route index element={<UserList />} />
          <Route path=":id" element={<UserDetail />} />
        </Route>
      </Route>
    </Routes>
  );
}

function Layout() {
  return (
    <div>
      <nav>{/* navigation */}</nav>
      <Outlet /> {/* Child routes render here */}
    </div>
  );
}
```

---

## 30. React Hook Form + Zod

Efficient form state with minimal re-renders + schema validation with type inference.

```bash
npm install react-hook-form zod @hookform/resolvers
```

**Basic Example:**

```jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// 1. Define Zod schema
const userSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Must be 18 or older'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

// 2. Infer TypeScript type from schema
type UserFormData = z.infer<typeof userSchema>;

// 3. Use in component
function UserForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: '',
      email: '',
      age: 18,
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      reset(); // Clear form
    } catch (error) {
      console.error(error);
    }
  };

  // Watch field value
  const password = watch('password');

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input
          {...register('username')}
          placeholder="Username"
        />
        {errors.username && <span>{errors.username.message}</span>}
      </div>

      <div>
        <input
          {...register('email')}
          type="email"
          placeholder="Email"
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div>
        <input
          {...register('age', { valueAsNumber: true })}
          type="number"
          placeholder="Age"
        />
        {errors.age && <span>{errors.age.message}</span>}
      </div>

      <div>
        <input
          {...register('password')}
          type="password"
          placeholder="Password"
        />
        {errors.password && <span>{errors.password.message}</span>}
      </div>

      <div>
        <input
          {...register('confirmPassword')}
          type="password"
          placeholder="Confirm Password"
        />
        {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

---

## 31. State Types in React

**Three Categories of State:**

- **Local State** — Scope: Single component. Use case: Component-specific data. Solutions: `useState`, `useReducer`
- **Cross-Component State** — Scope: Parent to Children. Use case: Shared between related components. Solutions: Props, Context API
- **App-Wide State** — Scope: Entire application. Use case: Global data needed everywhere. Solutions: Context API, Redux, Zustand

**Examples:**

```jsx
// 1. Local State
function Counter() {
  const [count, setCount] = useState(0); // Only used here
  return <div>{count}</div>;
}

// 2. Cross-Component State (Props)
function Parent() {
  const [user, setUser] = useState(null);

  return (
    <>
      <Header user={user} />
      <Profile user={user} onUpdate={setUser} />
    </>
  );
}

// 3. App-Wide State (Context)
const AppContext = createContext();

function App() {
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState(null);

  return (
    <AppContext.Provider value={{ theme, setTheme, user, setUser }}>
      <Router />
    </AppContext.Provider>
  );
}

// Any component can access app-wide state
function AnyComponent() {
  const { theme, user } = useContext(AppContext);
  return <div className={theme}>{user?.name}</div>;
}
```

---

## 32. Error Boundaries

Catch JS errors in child components and display fallback UI. Class components only.

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state to show fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to error reporting service
    console.error('Error caught:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong.</h1>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

**Catches:** render methods, lifecycle methods, constructors.
**Doesn't catch:** event handlers (use try-catch), async code, SSR, errors in the boundary itself.

---

## 33. React Fragments

Group multiple elements without adding extra DOM nodes.

```jsx
// ❌ Without Fragment - adds unnecessary div
function List() {
  return (
    <div>
      <li>Item 1</li>
      <li>Item 2</li>
    </div>
  );
}

// ✅ With Fragment - no extra DOM node
function List() {
  return (
    <>
      <li>Item 1</li>
      <li>Item 2</li>
    </>
  );
}

// Long syntax (when you need key prop)
function List({ items }) {
  return (
    <>
      {items.map(item => (
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </>
  );
}
```

---

## 34. React Portals

Render children into a DOM node outside the parent hierarchy (modals, tooltips, dropdowns).

```jsx
import { createPortal } from 'react-dom';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  // Render into #modal-root instead of parent
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

// HTML
// <div id="root"></div>
// <div id="modal-root"></div>

// Usage
function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <h2>Modal Content</h2>
        <p>This renders outside the root div!</p>
      </Modal>
    </div>
  );
}
```

---

## 35. StrictMode

Development tool that highlights potential problems (unsafe lifecycles, deprecated APIs, unexpected side effects).

```jsx
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

Only runs in development. Intentionally double-invokes component functions, state initializers, and effects to detect side effects.

---

## 36. Reconciliation Process

Algorithm React uses to diff Virtual DOM trees and update only changed parts in the real DOM.

```jsx
// 1. Different element types → Replace entire tree
// Old
<div><Counter /></div>

// New
<span><Counter /></span>
// Counter unmounts and remounts

// 2. Same element type → Update attributes only
// Old
<div className="old" />

// New
<div className="new" />
// Only className updates

// 3. Keys identify elements in lists
// Without keys (index used)
{items.map((item, index) => <Item key={index} {...item} />)}
// Problem: Reordering causes unnecessary re-renders

// With proper keys
{items.map(item => <Item key={item.id} {...item} />)}
// Solution: React tracks by stable ID
```

```jsx
// ❌ Bad - Using index (breaks with reordering)
items.map((item, index) => <li key={index}>{item}</li>)

// ✅ Good - Using unique ID
items.map(item => <li key={item.id}>{item.name}</li>)
```
