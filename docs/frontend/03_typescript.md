01. What is TypeScript?

🟣 TypeScript is a superset of JavaScript that adds static typing.
🟣 Developed and maintained by Microsoft.
🟣 Helps catch errors during development (before runtime).
🟣 Provides better IDE support (autocomplete, refactoring).
🟣 Makes code more maintainable and self-documenting.

-----------------------------------------

02. Why use TypeScript?

🟣 Type Safety: Catch errors at compile time, not runtime.
🟣 Better Tooling: Autocomplete, intellisense, refactoring.
🟣 Self-Documentation: Types serve as documentation.
🟣 Easier Refactoring: Confident code changes.
🟣 Better for Large Teams: Reduces bugs, improves collaboration.
🟣 Optional: Can be adopted gradually.

-----------------------------------------

03. What are the basic types in TypeScript?

🟣 Primitive Types:
   ▫️ string → Text values
   ▫️ number → Integers and floats
   ▫️ boolean → true/false
   ▫️ null → Intentional absence
   ▫️ undefined → Not yet assigned
   ▫️ symbol → Unique identifiers
   ▫️ bigint → Large integers

🟣 Special Types:
   ▫️ any → Disables type checking (avoid if possible)
   ▫️ unknown → Type-safe version of any
   ▫️ void → No return value (functions)
   ▫️ never → Never returns (infinite loop, throw error)

-----------------------------------------

04. What is type inference?

🟣 TypeScript automatically detects the type without explicit annotation.
🟣 You don't always need to write types manually.
🟣 TypeScript is smart enough to figure it out.

************* 🟣🟣🟣 *************
// Type inference
let name = "Anwar"; // TypeScript infers: string
let age = 25; // TypeScript infers: number

// Explicit type
let name: string = "Anwar";
let age: number = 25;
************* 🟣🟣🟣 *************

-----------------------------------------

05. What are arrays and tuples in TypeScript?

🟣 Arrays: Collection of same-type elements.
🟣 Tuples: Fixed-length array with specific types at each position.

************* 🟣🟣🟣 *************
// Arrays
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ["Ali", "Sara"];

// Tuples (fixed order and types)
let user: [string, number] = ["Anwar", 25];
let rgb: [number, number, number] = [255, 0, 128];

// ❌ Wrong
user = [25, "Anwar"]; // Error: wrong order
user = ["Anwar", 25, true]; // Error: extra element
************* 🟣🟣🟣 *************

-----------------------------------------

06. What is the difference between 'any' and 'unknown'?

🟣 any: Disables all type checking (dangerous).
🟣 unknown: Type-safe, requires type checking before use.
🟣 Always prefer unknown over any.

************* 🟣🟣🟣 *************
// any - no safety
let data: any = "hello";
data.toUpperCase(); // ✅ Works
data = 123;
data.toUpperCase(); // ❌ Runtime error!

// unknown - must check first
let value: unknown = "hello";
// value.toUpperCase(); // ❌ Error: can't use directly

if (typeof value === "string") {
  value.toUpperCase(); // ✅ Safe after check
}
************* 🟣🟣🟣 *************

-----------------------------------------

07. What are Type Aliases?

🟣 Type aliases create custom type names.
🟣 Use type keyword.
🟣 Can represent primitives, unions, intersections, objects, etc.
🟣 Makes complex types reusable and readable.

-----------------------------------------

08. What are Interfaces?

🟣 Interfaces define the structure of objects.
🟣 Similar to type aliases but with key differences.
🟣 Can be extended and merged.
🟣 Primarily used for object shapes.

-----------------------------------------

09. What is the difference between Type and Interface?

🟣 Both can describe object shapes.
🟣 Key differences:

************* 🟣🟣🟣 *************
// 1. Declaration Merging (Interface only)
interface User {
  name: string;
}
interface User {
  age: number;
}
// Merged: User has both name and age

// 2. Extending
interface Admin extends User {
  role: string;
}

type Admin = User & {
  role: string;
};

// 3. Primitives (Type only)
type ID = string | number; // ✅ Works
// interface ID = string | number; // ❌ Error

// 4. Union Types (Type only)
type Status = "active" | "inactive"; // ✅ Works
// interface Status = "active" | "inactive"; // ❌ Error
************* 🟣🟣🟣 *************

🟣 When to use:
   ▫️ Interface → For object shapes, classes, public APIs
   ▫️ Type → For unions, primitives, complex types

-----------------------------------------

10. What are Union and Intersection Types?

🟣 Union (|): Value can be ONE of multiple types (OR).
🟣 Intersection (&): Value must have ALL types combined (AND).

************* 🟣🟣🟣 *************
// Union Type (OR)
type ID = string | number;
let userId: ID = 123; // ✅
userId = "abc"; // ✅

type Status = "success" | "error" | "loading";
let currentStatus: Status = "success"; // ✅

// Intersection Type (AND)
type Person = {
  name: string;
  age: number;
};

type Employee = {
  employeeId: number;
  department: string;
};

type Staff = Person & Employee; // Must have ALL properties

const staff: Staff = {
  name: "Anwar",
  age: 25,
  employeeId: 1001,
  department: "IT"
};
************* 🟣🟣🟣 *************

-----------------------------------------

11. What are Literal Types?

🟣 Literal types are exact values, not just types.
🟣 More specific than general types.
🟣 Often used with unions for specific options.

************* 🟣🟣🟣 *************
// String literals
type Direction = "north" | "south" | "east" | "west";
let dir: Direction = "north"; // ✅
// let dir: Direction = "up"; // ❌ Error

// Number literals
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
let roll: DiceRoll = 4; // ✅

// Boolean literal (rare but possible)
type AlwaysTrue = true;
************* 🟣🟣🟣 *************

-----------------------------------------

13. What is 'void' and 'never'?

🟣 void: Function doesn't return anything (or returns undefined).
🟣 never: Function never returns (throws error or infinite loop).

************* 🟣🟣🟣 *************
// void - no return value
function logMessage(msg: string): void {
  console.log(msg);
  // return undefined; // implicit
}

// never - never completes
function throwError(message: string): never {
  throw new Error(message);
  // Never reaches end
}

function infiniteLoop(): never {
  while (true) {
    // Never exits
  }
}
************* 🟣🟣🟣 *************

-----------------------------------------

14. What are Generics?

🟣 Generics allow you to write reusable code that works with multiple types.
🟣 Think of them as "type variables" or "type parameters".
🟣 Makes functions, classes, and interfaces flexible.
🟣 Maintains type safety while being reusable.

************* 🟣🟣🟣 *************
// Without generics (repetitive)
function getFirstString(arr: string[]): string {
  return arr[0];
}
function getFirstNumber(arr: number[]): number {
  return arr[0];
}

// With generics (reusable)
function getFirst<T>(arr: T[]): T {
  return arr[0];
}

const firstNum = getFirst<number>([1, 2, 3]); // number
const firstName = getFirst<string>(["a", "b"]); // string
const firstBool = getFirst([true, false]); // inferred: boolean

// Multiple generics
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const result = pair<string, number>("age", 25); // [string, number]
************* 🟣🟣🟣 *************

-----------------------------------------

15. What are Generic Constraints?

🟣 Constraints limit what types can be used with generics.
🟣 Use extends keyword to add constraints.
🟣 Ensures generic types have certain properties or methods.

************* 🟣🟣🟣 *************
// Constraint: T must have 'length' property
function logLength<T extends { length: number }>(item: T): void {
  console.log(item.length);
}

logLength("hello"); // ✅ string has length
logLength([1, 2, 3]); // ✅ array has length
// logLength(123); // ❌ Error: number has no length

// Constraint: T must be an object
function getProperty<T extends object, K extends keyof T>(
  obj: T,
  key: K
): T[K] {
  return obj[key];
}

const user = { name: "Anwar", age: 25 };
const name = getProperty(user, "name"); // "Anwar"
// const invalid = getProperty(user, "email"); // ❌ Error
************* 🟣🟣🟣 *************

-----------------------------------------

18. What are Utility Types?
     

************* 🟣🟣🟣 *************
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Partial<T> - All properties optional
type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; age?: number; }

// Required<T> - All properties required
type RequiredUser = Required<PartialUser>;

// Readonly<T> - All properties readonly
type ReadonlyUser = Readonly<User>;

// Pick<T, K> - Select specific properties
type UserPreview = Pick<User, "id" | "name">;
// { id: number; name: string; }

// Omit<T, K> - Remove specific properties
type UserWithoutEmail = Omit<User, "email">;
// { id: number; name: string; age: number; }

// Record<K, T> - Create object type with keys K and values T
type UserRoles = Record<string, boolean>;
// { [key: string]: boolean; }

type Roles = "admin" | "user" | "guest";
type RolePermissions = Record<Roles, boolean>;
// { admin: boolean; user: boolean; guest: boolean; }
************* 🟣🟣🟣 *************

-----------------------------------------

19. What are Mapped Types?

🟣 Mapped types transform properties of existing types.
🟣 Create new types based on old types.
🟣 Use in syntax to iterate over properties.

************* 🟣🟣🟣 *************
// Make all properties optional
type Optional<T> = {
  [P in keyof T]?: T[P];
};

// Make all properties readonly
type ReadOnly<T> = {
  readonly [P in keyof T]: T[P];
};

// Change all properties to strings
type Stringify<T> = {
  [P in keyof T]: string;
};

interface User {
  id: number;
  name: string;
  age: number;
}

type StringUser = Stringify<User>;
// { id: string; name: string; age: string; }
************* 🟣🟣🟣 *************

-----------------------------------------

20. What are Conditional Types?

🟣 Conditional types select types based on conditions.
🟣 Use extends keyword with ternary syntax.
🟣 Pattern: T extends U ? X : Y

************* 🟣🟣🟣 *************
// Basic conditional type
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false

// Extract array element type
type ArrayElement<T> = T extends (infer U)[] ? U : T;

type StringArray = string[];
type Element = ArrayElement<StringArray>; // string

// NonNullable utility (built-in example)
type NonNullable<T> = T extends null | undefined ? never : T;

type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>; // string
************* 🟣🟣🟣 *************

-----------------------------------------

21. What is Type Assertion (Type Casting)?

🟣 Type assertion tells TypeScript "trust me, I know the type".
🟣 Doesn't change runtime behavior (no actual conversion).
🟣 Two syntaxes: as or angle brackets.
🟣 Use when you know more than TypeScript.

************* 🟣🟣🟣 *************
// Syntax 1: 'as' (recommended)
let value: unknown = "hello";
let length: number = (value as string).length;

// Syntax 2: angle brackets (not in .tsx files)
let length2: number = (<string>value).length;

// Common use case: DOM elements
const input = document.getElementById("username") as HTMLInputElement;
input.value = "Anwar"; // ✅ TypeScript knows it's an input

// Without assertion
const div = document.getElementById("username");
// div.value = "Anwar"; // ❌ Error: value doesn't exist on HTMLElement

// Double assertion (use carefully)
let num = 123;
let str = num as unknown as string; // ⚠️ Dangerous
************* 🟣🟣🟣 *************

-----------------------------------------

22. What is Non-null Assertion Operator (!)?

🟣 The ! operator tells TypeScript "this value is NOT null/undefined".
🟣 Removes null and undefined from the type.
🟣 Use when you're certain the value exists.
🟣 Be careful: wrong usage can cause runtime errors.

************* 🟣🟣🟣 *************
function getValue(): string | null {
  return "hello";
}

// Without !
const value = getValue();
// console.log(value.toUpperCase()); // ❌ Error: might be null

if (value) {
  console.log(value.toUpperCase()); // ✅ Safe
}

// With ! (non-null assertion)
const value2 = getValue();
console.log(value2!.toUpperCase()); // ✅ Compiles, but risky!

// Common with DOM
const button = document.getElementById("btn")!;
button.click(); // Assumes button exists
************* 🟣🟣🟣 *************

-----------------------------------------

23. What are Index Signatures?

🟣 Index signatures define types for dynamic property names.
🟣 Used when you don't know property names in advance.
🟣 Allows adding properties with any name.

************* 🟣🟣🟣 *************
// Basic index signature
interface StringDictionary {
  [key: string]: string;
}

const dict: StringDictionary = {
  name: "Anwar",
  city: "Dubai",
  country: "UAE"
  // Can add any string key
};

// Number index
interface NumberArray {
  [index: number]: string;
}

const arr: NumberArray = ["a", "b", "c"];

// Mixed: specific + dynamic properties
interface User {
  id: number; // Required specific property
  name: string; // Required specific property
  [key: string]: any; // Any additional properties
}

const user: User = {
  id: 1,
  name: "Anwar",
  age: 25, // ✅ Allowed by index signature
  email: "a@email.com" // ✅ Allowed
};
************* 🟣🟣🟣 *************

-----------------------------------------

24. What are Enums in TypeScript?

🟣 Enums define a set of named constants.
🟣 Makes code more readable and maintainable.
🟣 Can be numeric or string-based.
🟣 Creates both type and value (unlike type/interface).

************* 🟣🟣🟣 *************
// Numeric enum (default)
enum Status {
  Pending,    // 0
  Approved,   // 1
  Rejected    // 2
}

let status: Status = Status.Pending;
console.log(status); // 0

// String enum
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT"
}

let dir: Direction = Direction.Up;
console.log(dir); // "UP"

// Custom values
enum HttpStatus {
  OK = 200,
  BadRequest = 400,
  NotFound = 404,
  ServerError = 500
}

// Const enum (better performance, no runtime code)
const enum Color {
  Red,
  Green,
  Blue
}

let color: Color = Color.Red;
************* 🟣🟣🟣 *************

-----------------------------------------

25. What is the difference between Enum and Union Types?

🟣 Both represent a set of possible values, but they work differently.

************* 🟣🟣🟣 *************
// Enum - creates runtime object
enum Status {
  Active = "active",
  Inactive = "inactive"
}

let status: Status = Status.Active;
console.log(Status.Active); // "active" (exists at runtime)

// Union Type - compile-time only
type StatusType = "active" | "inactive";

let status2: StatusType = "active";
// console.log(StatusType.active); // ❌ Error: no runtime object
************* 🟣🟣🟣 *************

🟣 When to use:
   ▫️ Enum → When you need runtime values, reverse mapping
   ▫️ Union → Lighter, no runtime code, more flexible

-----------------------------------------

28. What is TypeScript with React?

🟣 TypeScript provides type safety for React components.
🟣 Types props, state, events, refs, and hooks.
🟣 Catches errors before runtime.

************* 🟣🟣🟣 *************
import { FC, useState, ChangeEvent } from 'react';

// Props interface
interface UserProps {
  name: string;
  age: number;
  email?: string; // Optional
  onUpdate?: (name: string) => void; // Optional function
}

// Function Component with FC (FunctionComponent)
const User: FC<UserProps> = ({ name, age, email, onUpdate }) => {
  const [count, setCount] = useState<number>(0);
  
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  
  return (
    <div>
      <h1>{name}</h1>
      <p>Age: {age}</p>
      <input onChange={handleChange} />
    </div>
  );
};

// Or without FC (more common now)
function User2(props: UserProps) {
  return <div>{props.name}</div>;
}
************* 🟣🟣🟣 *************

-----------------------------------------

29. What are common React TypeScript types?

🟣 ReactNode: Anything React can render (elements, strings, numbers, null).
🟣 ReactElement: Result of JSX (more specific than ReactNode).
🟣 JSX.Element: Specific type of ReactElement.
🟣 FC (FunctionComponent): Type for function components.
🟣 PropsWithChildren: Props that include children.

************* 🟣🟣🟣 *************
import { ReactNode, FC, PropsWithChildren } from 'react';

// ReactNode - accepts any renderable content
interface CardProps {
  title: string;
  children: ReactNode;
}

const Card = ({ title, children }: CardProps) => (
  <div>
    <h2>{title}</h2>
    {children}
  </div>
);

// Usage
<Card title="Welcome">
  <p>Some text</p>
  <button>Click</button>
  {123}
  {null}
</Card>

// PropsWithChildren helper
interface BoxProps {
  color: string;
}

const Box: FC<PropsWithChildren<BoxProps>> = ({ color, children }) => (
  <div style={{ backgroundColor: color }}>
    {children}
  </div>
);
************* 🟣🟣🟣 *************

-----------------------------------------

30. What are React Event Types?

🟣 React events have specific TypeScript types.
🟣 Import from React, not DOM.
🟣 Generic with element type: ChangeEvent<HTMLInputElement>.

************* 🟣🟣🟣 *************
import { ChangeEvent, MouseEvent, FormEvent } from 'react';

function Form() {
  // Input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  
  // Textarea change
  const handleTextArea = (e: ChangeEvent<HTMLTextAreaElement>) => {
    console.log(e.target.value);
  };
  
  // Select change
  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
  };
  
  // Button click
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    console.log("Clicked");
  };
  
  // Form submit
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted");
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input onChange={handleChange} />
      <textarea onChange={handleTextArea} />
      <select onChange={handleSelect}>
        <option>Option 1</option>
      </select>
      <button onClick={handleClick}>Submit</button>
    </form>
  );
}
************* 🟣🟣🟣 *************

-----------------------------------------

31. How do you type React hooks?

🟣 useState, useEffect, useRef, etc., all support generics.
🟣 TypeScript can often infer types automatically.
🟣 Provide generics when inference isn't enough.

************* 🟣🟣🟣 *************
import { useState, useEffect, useRef } from 'react';

function Component() {
  // useState - inferred as number
  const [count, setCount] = useState(0);
  
  // useState - explicit type
  const [user, setUser] = useState<User | null>(null);
  
  // useState - with initial undefined
  const [data, setData] = useState<string>();
  
  // useRef - DOM element
  const inputRef = useRef<HTMLInputElement>(null);
  
  // useRef - mutable value
  const timerRef = useRef<number>(0);
  
  // useEffect - no return value needed
  useEffect(() => {
    // Effect logic
  }, []);
  
  // useEffect - with cleanup
  useEffect(() => {
    const timer = setTimeout(() => {}, 1000);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);
  
  return <input ref={inputRef} />;
}

interface User {
  id: number;
  name: string;
}
************* 🟣🟣🟣 *************

-----------------------------------------

32. What is the 'tsconfig.json' file?

🟣 Configuration file for TypeScript compiler.
🟣 Defines compiler options and project settings.
🟣 Determines how TypeScript behaves.

************* 🟣🟣🟣 *************
{
  "compilerOptions": {
    "target": "ES2020",              // JavaScript version to compile to
    "module": "ESNext",               // Module system
    "lib": ["ES2020", "DOM"],         // Available libraries
    "jsx": "react-jsx",               // JSX support for React
    "strict": true,                   // Enable all strict checks
    "strictNullChecks": true,         // Strict null checking
    "esModuleInterop": true,          // CommonJS/ES6 interop
    "skipLibCheck": true,             // Skip type checking of declaration files
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",       // Module resolution strategy
    "resolveJsonModule": true,        // Import JSON files
    "isolatedModules": true,          // Each file as separate module
    "noEmit": true,                   // Don't emit JS files (Vite/Babel handles it)
    "baseUrl": "./",                  // Base directory for imports
    "paths": {                        // Path aliases
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],                 // Files to include
  "exclude": ["node_modules", "dist"] // Files to exclude
}
************* 🟣🟣🟣 *************

-----------------------------------------

33. What are Declaration Files (.d.ts)?

🟣 Files that contain only type information.
🟣 Used to provide types for JavaScript libraries.
🟣 Don't contain implementation, only declarations.
🟣 File extension: .d.ts

************* 🟣🟣🟣 *************
// types.d.ts
declare module 'my-js-library' {
  export function doSomething(value: string): number;
  export class MyClass {
    constructor(name: string);
    getName(): string;
  }
}

// Global types
interface Window {
  myCustomProperty: string;
}

declare const API_URL: string;

// Ambient module
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.png' {
  const value: string;
  export default value;
}
************* 🟣🟣🟣 *************

-----------------------------------------

35. What are Best Practices for TypeScript?

🟣 Enable strict mode in tsconfig.json.
🟣 Avoid any, use unknown instead.
🟣 Use interfaces for objects, types for unions/intersections.
🟣 Prefer type inference when possible.
🟣 Use const assertions for literal types.
🟣 Leverage utility types (Partial, Pick, Omit, etc.).
🟣 Write custom type guards for complex types.
🟣 Use non-null assertion (!) sparingly.
🟣 Keep types simple and readable.
🟣 Use generics for reusable code.

************* 🟣🟣🟣 *************
// ✅ Good practices
const user = {
  name: "Anwar",
  age: 25
} as const; // Const assertion for literal types

type Status = "active" | "inactive"; // Union for specific values

interface User {
  id: number;
  name: string;
}

function getUser(id: number): User | null {
  // ...
}

// ❌ Avoid
let data: any; // Too loose
let value = something as any as string; // Double assertion
************* 🟣🟣🟣 *************

-----------------------------------------