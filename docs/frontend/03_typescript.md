# TypeScript Fundamentals Guide

A reference guide to TypeScript types and best practices for React development.

---

## 1. Basic Types

- **Primitives:** `string`, `number`, `boolean`, `null`, `undefined`, `symbol`, `bigint`
- **Special:** `any` (avoid), `unknown` (safe alternative to any), `void` (no return), `never` (never returns)

```typescript
let name: string = 'Anwar';
let age: number = 25;
let isActive: boolean = true;

// unknown requires narrowing before use
let value: unknown = 'hello';
if (typeof value === 'string') {
  value.toUpperCase(); // ✅ safe after check
}

// void — no return value
function log(msg: string): void { console.log(msg); }

// never — never returns
function fail(msg: string): never { throw new Error(msg); }
```

---

## 2. Type Inference

TypeScript infers types automatically — annotate only when necessary.

```typescript
let name = 'Anwar';       // string
let age = 25;             // number
let nums = [1, 2, 3];    // number[]

// Always annotate function parameters; return types on public APIs
function getUser(): User | null { return null; }
```

---

## 3. Arrays and Tuples

```typescript
let numbers: number[] = [1, 2, 3];
let mixed: (string | number)[] = ['hello', 42];

// Tuples — fixed length, specific types per position
let person: [string, number] = ['Anwar', 25];
let point: [number, number, string?] = [10, 20]; // optional third element

const [personName, personAge] = person; // destructuring
```

---

## 4. Type Aliases and Interfaces

**Type aliases** — unions, primitives, tuples, mapped/conditional types.
**Interfaces** — object shapes, class contracts, supports declaration merging and `extends`.

```typescript
// Type alias
type ID = string | number;
type Status = 'pending' | 'approved' | 'rejected';
type ApiResponse<T> = { data: T; status: number; message: string };

// Interface
interface User {
  id: number;
  name: string;
  email?: string;           // optional
  readonly createdAt: Date; // read-only
}

// Extending interfaces
interface Employee extends User {
  employeeId: number;
  department: string;
}

// Declaration merging (interfaces only)
interface User { age: number; } // merged into existing User

// Type intersection (equivalent of extends for types)
type Admin = User & { role: string };
```

---

## 5. Union and Intersection Types

- **Union (`|`)** — value is ONE of multiple types
- **Intersection (`&`)** — value has ALL properties combined

```typescript
type ID = string | number;

function processValue(value: string | number) {
  if (typeof value === 'string') return value.toUpperCase();
  return value.toFixed(2);
}

// Intersection
type Staff = { name: string; age: number } & { employeeId: number; department: string };

// Practical: discriminated API response
type ApiResult<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };
```

---

## 6. Literal Types and Const Assertions

```typescript
type Direction = 'north' | 'south' | 'east' | 'west';
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;

// as const — narrows to literal types, makes object readonly
const config = { host: 'localhost', port: 3000 } as const;
// Type: { readonly host: 'localhost'; readonly port: 3000 }

const colors = ['red', 'green', 'blue'] as const;
type Color = typeof colors[number]; // 'red' | 'green' | 'blue'
```

---

## 7. Generics

Reusable code that preserves type safety across multiple types.

```typescript
function getFirst<T>(arr: T[]): T { return arr[0]; }

// Multiple type parameters
function pair<T, U>(first: T, second: U): [T, U] { return [first, second]; }

// Generic interface with default
interface Container<T = string> { value: T; }

// Generic type alias
type Response<T> = { data: T; status: number; message: string };
```

---

## 8. Generic Constraints

```typescript
// T must have a length property
function logLength<T extends { length: number }>(item: T): void {
  console.log(item.length);
}

// T must be an object, K must be a key of T
function getProperty<T extends object, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: 'Anwar', age: 25 };
const name = getProperty(user, 'name'); // 'Anwar'
```

---

## 9. Utility Types

```typescript
interface User { id: number; name: string; email: string; age: number; password: string; }

type PartialUser  = Partial<User>;              // all optional
type RequiredUser = Required<PartialUser>;       // all required
type ReadonlyUser = Readonly<User>;              // all readonly
type UserPreview  = Pick<User, 'id' | 'name'>;  // select properties
type SafeUser     = Omit<User, 'password'>;      // remove properties
type RoleMap      = Record<'admin' | 'user' | 'guest', boolean>;

type ActiveStatus = Exclude<'success' | 'error' | 'idle', 'idle'>; // remove from union
type StringsOnly  = Extract<string | number | boolean, string>;     // keep from union
type Defined      = NonNullable<string | null | undefined>;         // remove null/undefined

type UserReturn   = ReturnType<typeof getUser>;    // function return type
type CreateParams = Parameters<typeof createUser>; // function param types
type Resolved     = Awaited<Promise<User>>;        // unwrap Promise
```

---

## 10. Mapped and Conditional Types

```typescript
// Mapped type — transform all properties
type Stringify<T> = { [P in keyof T]: string };

// Add getters via key remapping
type Getters<T> = {
  [P in keyof T as `get${Capitalize<string & P>}`]: () => T[P];
};

// Filter properties by value type
type OnlyStrings<T> = {
  [P in keyof T as T[P] extends string ? P : never]: T[P];
};

// Conditional type — T extends U ? X : Y
type IsString<T> = T extends string ? true : false;

// infer — extract inner type
type ArrayElement<T> = T extends (infer U)[] ? U : T;
type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;
```

---

## 11. Type Assertion and Non-null Assertion

```typescript
// Type assertion — use when you know more than TypeScript
const input = document.getElementById('username') as HTMLInputElement;
input.value = 'Anwar';

// Const assertion
const routes = { home: '/', about: '/about' } as const;

// Non-null assertion (!) — use sparingly, prefer type guards
const container = document.getElementById('root')!; // asserts not null

// Prefer type guards over !
function process(value: string | null) {
  if (value) console.log(value.length); // ✅ safe
}
```

---

## 12. Index Signatures and Enums

```typescript
// Index signature — dynamic property names
interface StringDictionary { [key: string]: string; }

// Record is preferred for most use cases
type UserScores = Record<string, number>;

// String enum
enum Direction { Up = 'UP', Down = 'DOWN', Left = 'LEFT', Right = 'RIGHT' }

// Prefer const object + union over enums (no runtime overhead)
const STATUS = { Active: 'active', Inactive: 'inactive' } as const;
type Status = typeof STATUS[keyof typeof STATUS]; // 'active' | 'inactive'
```

---

## 13. Type Guards and Discriminated Unions

```typescript
// typeof / instanceof / in
function processValue(value: string | number) {
  if (typeof value === 'string') return value.toUpperCase();
  return value.toFixed(2);
}

// Custom type guard
function isUser(value: unknown): value is User {
  return typeof value === 'object' && value !== null && 'id' in value && 'name' in value;
}

// Discriminated union — common field narrows the type
interface SuccessResponse { status: 'success'; data: User[] }
interface ErrorResponse   { status: 'error';   error: string; code: number }
type ApiResponse = SuccessResponse | ErrorResponse;

function handleResponse(response: ApiResponse) {
  if (response.status === 'success') {
    console.log(response.data);  // ✅ data available
  } else {
    console.log(response.error); // ✅ error available
  }
}

// Exhaustive switch with never
type Shape = { kind: 'circle'; radius: number } | { kind: 'square'; sideLength: number };

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle': return Math.PI * shape.radius ** 2;
    case 'square': return shape.sideLength ** 2;
    default:
      const _: never = shape;
      throw new Error(`Unhandled shape: ${_}`);
  }
}
```

---

## 14. TypeScript with React

```typescript
// Props interface
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  children?: React.ReactNode;
}

function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return <button className={variant} onClick={onClick}>{label}</button>;
}

// Generic component
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return <ul>{items.map((item, i) => <li key={i}>{renderItem(item)}</li>)}</ul>;
}

// Extend HTML attributes
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input = ({ label, ...props }: InputProps) => (
  <div><label>{label}</label><input {...props} /></div>
);
```

**Common React types:**

| Type | Use |
|------|-----|
| `ReactNode` | Anything React can render (string, element, null, array…) |
| `ReactElement` | Result of JSX (more specific) |
| `FC<Props>` | Function component type |
| `PropsWithChildren<P>` | Props that include `children` |
| `React.CSSProperties` | Inline style object |
| `React.ComponentType<P>` | Any component (class or function) |

---

## 15. React Event Types

```typescript
function Form() {
  const handleChange  = (e: React.ChangeEvent<HTMLInputElement>)   => console.log(e.target.value);
  const handleClick   = (e: React.MouseEvent<HTMLButtonElement>)   => console.log(e.clientX);
  const handleSubmit  = (e: React.FormEvent<HTMLFormElement>)      => { e.preventDefault(); };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') { /* ... */ } };

  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} onKeyDown={handleKeyDown} />
      <button onClick={handleClick}>Submit</button>
    </form>
  );
}
```

---

## 16. Typing React Hooks

```typescript
// useState
const [count, setCount]   = useState(0);                                // inferred: number
const [user, setUser]     = useState<User | null>(null);                // explicit
const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

// useRef
const inputRef = useRef<HTMLInputElement>(null);
inputRef.current?.focus();

// useReducer
type State  = { count: number };
type Action = { type: 'increment' } | { type: 'decrement' } | { type: 'reset' };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'increment': return { count: state.count + 1 };
    case 'decrement': return { count: state.count - 1 };
    case 'reset':     return { count: 0 };
  }
};

const [state, dispatch] = useReducer(reducer, { count: 0 });

// useContext
interface ThemeContextType { theme: 'light' | 'dark'; toggleTheme: () => void; }
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// useMemo / useCallback
const value   = useMemo<number>(() => compute(count), [count]);
const handler = useCallback((id: number) => console.log(id), []);
```

---

## 17. Template Literal Types

```typescript
type EventName    = 'click' | 'focus' | 'blur';
type EventHandler = `on${Capitalize<EventName>}`; // 'onClick' | 'onFocus' | 'onBlur'

type Method   = 'get' | 'post' | 'put' | 'delete';
type ApiRoute = `${Method} /api/${string}`;

// CSS direction utilities
type CSSProp = 'margin' | 'padding';
type Dir     = 'top' | 'right' | 'bottom' | 'left';
type CSSDir  = `${CSSProp}-${Dir}`; // 'margin-top' | 'padding-left' | …
```

---

## 18. Function Overloads

```typescript
// Multiple signatures, one implementation
function getValue(key: string): string;
function getValue(key: number): number;
function getValue(key: string | number): string | number {
  return typeof key === 'string' ? 'string value' : 42;
}

const strValue = getValue('name'); // string
const numValue = getValue(123);    // number
```

---

## 19. tsconfig.json (Key Options)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noEmit": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "baseUrl": "./",
    "paths": { "@/*": ["src/*"] }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## 20. Declaration Files (.d.ts)

```typescript
// Declare an untyped third-party module
declare module 'my-library' {
  export function doSomething(value: string): number;
}

// Ambient file imports
declare module '*.svg' {
  import * as React from 'react';
  const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// Extend global types
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      API_URL: string;
    }
  }
}

export {};
```

---

## 21. Best Practices

- Enable `"strict": true` in tsconfig — catches the most bugs.
- Prefer `unknown` over `any`; narrow with type guards before using.
- Use `interface` for object shapes, `type` for unions, intersections, and mapped types.
- Prefer `const` objects with union types over `enum` (no runtime overhead).
- Use `as const` to derive literal union types from arrays or objects.
- Leverage utility types (`Partial`, `Pick`, `Omit`, `Record`, `ReturnType`, etc.) instead of rewriting types.
- Use discriminated unions for state machines and API responses.
- Write custom type guard functions (`value is T`) when `typeof`/`instanceof` is insufficient.
- Use `!` (non-null assertion) only when you can guarantee the value exists; prefer explicit checks.
- Use `satisfies` to validate a value against a type without widening it.
- Keep complex types broken into named intermediate types for readability.
- Always type React component props with an interface; use `React.ReactNode` for flexible children.
