# TypeScript Fundamentals Guide

A comprehensive guide to TypeScript concepts, types, and best practices for React development.

## Table of Contents

1. [What is TypeScript](#1-what-is-typescript)
2. [Why Use TypeScript](#2-why-use-typescript)
3. [Basic Types](#3-basic-types)
4. [Type Inference](#4-type-inference)
5. [Arrays and Tuples](#5-arrays-and-tuples)
6. [Any vs Unknown](#6-any-vs-unknown)
7. [Type Aliases](#7-type-aliases)
8. [Interfaces](#8-interfaces)
9. [Type vs Interface](#9-type-vs-interface)
10. [Union and Intersection Types](#10-union-and-intersection-types)
11. [Literal Types](#11-literal-types)
12. [Void and Never](#12-void-and-never)
13. [Generics](#13-generics)
14. [Generic Constraints](#14-generic-constraints)
15. [Utility Types](#15-utility-types)
16. [Mapped Types](#16-mapped-types)
17. [Conditional Types](#17-conditional-types)
18. [Type Assertion (Type Casting)](#18-type-assertion-type-casting)
19. [Non-null Assertion Operator](#19-non-null-assertion-operator)
20. [Index Signatures](#20-index-signatures)
21. [Enums](#21-enums)
22. [Enum vs Union Types](#22-enum-vs-union-types)
23. [TypeScript with React](#23-typescript-with-react)
24. [React TypeScript Types](#24-react-typescript-types)
25. [React Event Types](#25-react-event-types)
26. [Typing React Hooks](#26-typing-react-hooks)
27. [tsconfig.json Configuration](#27-tsconfigjson-configuration)
28. [Declaration Files (.d.ts)](#28-declaration-files-dts)
29. [Type Guards](#29-type-guards)
30. [Discriminated Unions](#30-discriminated-unions)
31. [Function Overloads](#31-function-overloads)
32. [Template Literal Types](#32-template-literal-types)
33. [Best Practices](#33-best-practices)
34. [Summary](#34-summary)

---

## 1. What is TypeScript

**TypeScript** is a superset of JavaScript that adds static typing, developed and maintained by Microsoft.

**Key Features:**

- **Static Typing**: Catch errors during development (compile-time)
- **Type Inference**: Automatic type detection
- **Better IDE Support**: Autocomplete, refactoring, intellisense
- **Self-Documenting**: Types serve as inline documentation
- **Gradual Adoption**: Can be added incrementally to existing projects

```typescript
// JavaScript - Runtime error
function greet(name) {
  return `Hello, ${name.toUpperCase()}`;
}
greet(null); // ❌ Runtime error: Cannot read property 'toUpperCase' of null

// TypeScript - Compile-time error
function greet(name: string): string {
  return `Hello, ${name.toUpperCase()}`;
}
greet(null); // ✅ Compile error: Argument of type 'null' is not assignable to parameter of type 'string'
```

---

## 2. Why Use TypeScript

| Benefit | Description | Impact |
|---------|-------------|--------|
| **Type Safety** | Catch errors at compile time | Fewer runtime bugs |
| **Better Tooling** | Autocomplete, intellisense, refactoring | Faster development |
| **Self-Documentation** | Types explain code intent | Easier maintenance |
| **Easier Refactoring** | Confident code changes | Reduced fear of breaking changes |
| **Better for Large Teams** | Shared type contracts | Improved collaboration |
| **Optional** | Gradually adoptable | No big rewrite needed |

**Comparison:**

```typescript
// JavaScript - No type safety
function calculateTotal(price, quantity) {
  return price * quantity;
}

calculateTotal('10', '5'); // '1010' - String concatenation bug!

// TypeScript - Type safety
function calculateTotal(price: number, quantity: number): number {
  return price * quantity;
}

calculateTotal('10', '5'); // ✅ Compile error: Type 'string' is not assignable to type 'number'
```

---

## 3. Basic Types

**Primitive Types:**

| Type | Description | Example |
|------|-------------|---------|
| `string` | Text values | `'hello'`, `"world"`, `` `template` `` |
| `number` | Integers and floats | `42`, `3.14`, `NaN`, `Infinity` |
| `boolean` | True/false values | `true`, `false` |
| `null` | Intentional absence | `null` |
| `undefined` | Not yet assigned | `undefined` |
| `symbol` | Unique identifiers | `Symbol('id')` |
| `bigint` | Large integers | `100n`, `BigInt(100)` |

**Special Types:**

| Type | Description | Use Case |
|------|-------------|----------|
| `any` | Disables type checking | ❌ Avoid if possible |
| `unknown` | Type-safe version of any | ✅ Prefer over `any` |
| `void` | No return value | Functions that don't return |
| `never` | Never returns | Infinite loops, throw errors |

**Examples:**

```typescript
// Primitive types
let name: string = 'Anwar';
let age: number = 25;
let isActive: boolean = true;
let nothing: null = null;
let notDefined: undefined = undefined;
let uniqueId: symbol = Symbol('id');
let bigNumber: bigint = 9007199254740991n;

// Special types
let anything: any = 'hello'; // ❌ Avoid
anything = 42;
anything.foo.bar.baz; // No error, but dangerous

let something: unknown = 'hello'; // ✅ Better
// something.toUpperCase(); // ❌ Error: requires type check
if (typeof something === 'string') {
  something.toUpperCase(); // ✅ Safe after check
}

// void - function returns nothing
function logMessage(msg: string): void {
  console.log(msg);
}

// never - function never returns
function throwError(msg: string): never {
  throw new Error(msg);
}
```

---

## 4. Type Inference

**Type inference** means TypeScript automatically detects types without explicit annotations.

```typescript
// Type inference - TypeScript infers types
let name = 'Anwar'; // inferred as: string
let age = 25; // inferred as: number
let isActive = true; // inferred as: boolean

// Explicit type annotation
let explicitName: string = 'Anwar';
let explicitAge: number = 25;

// Function return type inference
function add(a: number, b: number) {
  return a + b; // inferred return type: number
}

// Array type inference
let numbers = [1, 2, 3]; // inferred as: number[]
let mixed = [1, 'hello', true]; // inferred as: (string | number | boolean)[]

// Object type inference
let user = {
  name: 'Anwar',
  age: 25
};
// inferred as: { name: string; age: number; }
```

**When to Use Explicit Types:**

```typescript
// Use explicit types when:

// 1. Function parameters (always)
function greet(name: string): void {
  console.log(`Hello, ${name}`);
}

// 2. Initialized with no value
let result: number;
result = calculateTotal();

// 3. Union types need clarity
let id: string | number;
id = 123;
id = 'abc';

// 4. Return types for public APIs (good practice)
function getUser(): User | null {
  return null;
}
```

---

## 5. Arrays and Tuples

**Arrays** are collections of same-type elements. **Tuples** are fixed-length arrays with specific types at each position.

```typescript
// Array syntax 1 (preferred)
let numbers: number[] = [1, 2, 3, 4, 5];
let names: string[] = ['Alice', 'Bob', 'Charlie'];

// Array syntax 2 (generic)
let numbers2: Array<number> = [1, 2, 3];
let names2: Array<string> = ['Alice', 'Bob'];

// Mixed-type array
let mixed: (string | number)[] = ['hello', 42, 'world'];

// Array of objects
interface User {
  name: string;
  age: number;
}
let users: User[] = [
  { name: 'Anwar', age: 25 },
  { name: 'Sara', age: 22 }
];

// Tuples - Fixed order and types
let person: [string, number] = ['Anwar', 25];
let rgb: [number, number, number] = [255, 128, 0];
let point: [number, number, string?] = [10, 20]; // Optional third element

// ❌ Wrong - tuple errors
person = [25, 'Anwar']; // Error: wrong order
person = ['Anwar', 25, true]; // Error: too many elements

// Destructuring tuples
const [name, age] = person;

// Tuple with rest elements
type StringNumberBooleans = [string, number, ...boolean[]];
let example: StringNumberBooleans = ['hello', 42, true, false, true];
```

**Array vs Tuple:**

| Feature | Array | Tuple |
|---------|-------|-------|
| Length | Variable | Fixed |
| Types | Homogeneous (same type) | Heterogeneous (mixed types) |
| Order | Not enforced | Strictly enforced |
| Use Case | Lists of similar items | Fixed structure data |

---

## 6. Any vs Unknown

Both `any` and `unknown` can hold any value, but `unknown` is type-safe.

**Comparison:**

| Aspect | any | unknown |
|--------|-----|---------|
| **Type Safety** | ❌ None | ✅ Type-safe |
| **Type Checking** | Disabled | Required before use |
| **Operations** | All allowed | Must narrow type first |
| **Recommendation** | Avoid | Prefer over `any` |

```typescript
// any - No safety (dangerous)
let data: any = 'hello';
data.toUpperCase(); // ✅ Works
data = 123;
data.toUpperCase(); // ❌ Runtime error! No compile-time check

// unknown - Must check first (safe)
let value: unknown = 'hello';

// value.toUpperCase(); // ❌ Compile error: can't use directly

// Type guard required
if (typeof value === 'string') {
  value.toUpperCase(); // ✅ Safe after check
}

// More type guards
function processValue(val: unknown) {
  if (typeof val === 'string') {
    console.log(val.toUpperCase());
  } else if (typeof val === 'number') {
    console.log(val.toFixed(2));
  } else if (Array.isArray(val)) {
    console.log(val.length);
  } else if (val && typeof val === 'object') {
    console.log(Object.keys(val));
  }
}
```

**When to Use:**

```typescript
// Use unknown for:
// 1. User input
function processInput(input: unknown) {
  if (typeof input === 'string') {
    return input.trim();
  }
  throw new Error('Invalid input');
}

// 2. API responses
async function fetchData(url: string): Promise<unknown> {
  const response = await fetch(url);
  return response.json();
}

// 3. Error handling
try {
  // ...
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error(error.message);
  }
}
```

---

## 7. Type Aliases

**Type aliases** create custom type names for reusability and readability.

```typescript
// Basic type alias
type UserID = string | number;
type Age = number;

let id: UserID = 'user-123';
id = 456;

// Object type alias
type User = {
  id: UserID;
  name: string;
  email: string;
  age: Age;
  isActive?: boolean; // Optional property
};

const user: User = {
  id: 1,
  name: 'Anwar',
  email: 'anwar@example.com',
  age: 25
};

// Union type alias
type Status = 'pending' | 'approved' | 'rejected';
type Response = Success | Error;

// Function type alias
type GreetFunction = (name: string) => string;
const greet: GreetFunction = (name) => `Hello, ${name}`;

// Array type alias
type NumberArray = number[];
type StringList = Array<string>;

// Tuple type alias
type Point = [number, number];
type RGB = [number, number, number];

// Complex type alias
type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
  timestamp: Date;
};

type UserResponse = ApiResponse<User>;
```

---

## 8. Interfaces

**Interfaces** define the structure of objects, similar to type aliases but with key differences.

```typescript
// Basic interface
interface User {
  id: number;
  name: string;
  email: string;
  age?: number; // Optional
  readonly createdAt: Date; // Read-only
}

const user: User = {
  id: 1,
  name: 'Anwar',
  email: 'anwar@example.com',
  createdAt: new Date()
};

// user.createdAt = new Date(); // ❌ Error: readonly property

// Extending interfaces
interface Person {
  name: string;
  age: number;
}

interface Employee extends Person {
  employeeId: number;
  department: string;
}

const employee: Employee = {
  name: 'Anwar',
  age: 25,
  employeeId: 1001,
  department: 'IT'
};

// Multiple extends
interface Address {
  street: string;
  city: string;
}

interface Contact extends Person, Address {
  phone: string;
}

// Interface for functions
interface MathOperation {
  (a: number, b: number): number;
}

const add: MathOperation = (a, b) => a + b;

// Interface for classes
interface Drawable {
  draw(): void;
  color: string;
}

class Circle implements Drawable {
  color: string = 'red';

  draw(): void {
    console.log('Drawing circle');
  }
}

// Index signature
interface StringDictionary {
  [key: string]: string;
}

const dict: StringDictionary = {
  name: 'Anwar',
  city: 'Dubai',
  country: 'UAE'
};
```

---

## 9. Type vs Interface

Both can describe object shapes, but have key differences.

**Comparison Table:**

| Feature | Type | Interface |
|---------|------|-----------|
| **Primitives** | ✅ Can define | ❌ Cannot |
| **Union Types** | ✅ Supported | ❌ Not supported |
| **Intersection** | `&` operator | `extends` keyword |
| **Declaration Merging** | ❌ Not supported | ✅ Supported |
| **Computed Properties** | ✅ Supported | ❌ Limited |
| **Performance** | Slightly slower | Slightly faster |
| **Use Case** | Unions, primitives, complex types | Object shapes, classes |

**Examples:**

```typescript
// 1. Declaration Merging (Interface only)
interface User {
  name: string;
}

interface User {
  age: number;
}

// Merged: User has both name and age
const user: User = {
  name: 'Anwar',
  age: 25
};

// 2. Extending vs Intersection
// Interface - extends
interface Admin extends User {
  role: string;
}

// Type - intersection
type User = { name: string; age: number };
type Admin = User & {
  role: string;
};

// 3. Primitives (Type only)
type ID = string | number; // ✅ Works
// interface ID = string | number; // ❌ Error

// 4. Union Types (Type only)
type Status = 'active' | 'inactive'; // ✅ Works
// interface Status = 'active' | 'inactive'; // ❌ Error

// 5. Computed Properties (Type has better support)
type Keys = 'name' | 'age';
type UserFields = {
  [K in Keys]: string;
};

// 6. Tuple (Type preferred)
type Point = [number, number]; // ✅ Preferred
interface IPoint {
  0: number;
  1: number;
  length: 2;
} // ❌ Awkward
```

**When to Use:**

```typescript
// Use Interface for:
// - Object shapes
// - Classes
// - Public APIs (libraries)
// - When declaration merging is needed

interface User {
  id: number;
  name: string;
}

// Use Type for:
// - Union types
// - Intersection types
// - Primitives
// - Mapped types
// - Conditional types
// - Tuples

type Status = 'active' | 'inactive' | 'pending';
type ID = string | number;
type Point = [number, number];
```

---

## 10. Union and Intersection Types

**Union (|)**: Value can be ONE of multiple types (OR).
**Intersection (&)**: Value must have ALL types combined (AND).

```typescript
// Union Type (OR) - can be ONE of these
type ID = string | number;

let userId: ID = 123; // ✅
userId = 'abc-123'; // ✅
// userId = true; // ❌ Error

type Status = 'success' | 'error' | 'loading';
let currentStatus: Status = 'success'; // ✅

// Function with union parameter
function printId(id: string | number) {
  console.log(`ID: ${id}`);
}

// Narrowing union types
function processValue(value: string | number) {
  if (typeof value === 'string') {
    return value.toUpperCase(); // TypeScript knows it's string
  } else {
    return value.toFixed(2); // TypeScript knows it's number
  }
}

// Intersection Type (AND) - must have ALL properties
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
  name: 'Anwar',
  age: 25,
  employeeId: 1001,
  department: 'IT'
};

// Combining intersections
type Address = {
  street: string;
  city: string;
};

type FullEmployee = Person & Employee & Address;

// Union of intersections
type Manager = (Person & Employee) | (Person & Address);
```

**Practical Examples:**

```typescript
// API Response union
type ApiResponse<T> =
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

function handleResponse(response: ApiResponse<User>) {
  if (response.status === 'success') {
    console.log(response.data); // Type narrowed to success
  } else {
    console.error(response.error); // Type narrowed to error
  }
}

// Intersection for mixins
type Timestamped = {
  createdAt: Date;
  updatedAt: Date;
};

type WithTimestamps<T> = T & Timestamped;

type User = {
  id: number;
  name: string;
};

type UserWithTimestamps = WithTimestamps<User>;
```

---

## 11. Literal Types

**Literal types** are exact values, not just general types. More specific than primitive types.

```typescript
// String literals
type Direction = 'north' | 'south' | 'east' | 'west';

let dir: Direction = 'north'; // ✅
// let dir: Direction = 'up'; // ❌ Error

function move(direction: Direction) {
  console.log(`Moving ${direction}`);
}

// Number literals
type DiceRoll = 1 | 2 | 3 | 4 | 5 | 6;
let roll: DiceRoll = 4; // ✅
// let roll: DiceRoll = 7; // ❌ Error

// Boolean literal (rare but possible)
type AlwaysTrue = true;
let value: AlwaysTrue = true; // ✅
// let value: AlwaysTrue = false; // ❌ Error

// Mixed literals
type Success = { status: 200; data: any };
type NotFound = { status: 404; error: string };
type Response = Success | NotFound;

// Const assertions (create literal types)
const config = {
  host: 'localhost',
  port: 3000
} as const;

// config.port = 4000; // ❌ Error: readonly
// Type is: { readonly host: 'localhost'; readonly port: 3000 }

// Without 'as const'
const config2 = {
  host: 'localhost',
  port: 3000
};
// Type is: { host: string; port: number }

// Array with const assertion
const colors = ['red', 'green', 'blue'] as const;
// Type is: readonly ['red', 'green', 'blue']
type Color = typeof colors[number]; // 'red' | 'green' | 'blue'
```

---

## 12. Void and Never

**Void**: Function doesn't return anything (or returns undefined).
**Never**: Function never returns (throws error or infinite loop).

```typescript
// void - No return value
function logMessage(msg: string): void {
  console.log(msg);
  // return undefined; // implicit
}

function updateUI(): void {
  document.title = 'New Title';
  // No return statement
}

// void can return undefined (but not other values)
function doNothing(): void {
  return; // ✅ OK
  // return undefined; // ✅ OK
  // return null; // ❌ Error
  // return 42; // ❌ Error
}

// never - Never completes/returns
function throwError(message: string): never {
  throw new Error(message);
  // Never reaches end - execution stops
}

function infiniteLoop(): never {
  while (true) {
    // Never exits
  }
}

function impossible(value: never): never {
  throw new Error(`Unexpected value: ${value}`);
}

// never in exhaustive checks
type Shape = 'circle' | 'square';

function getArea(shape: Shape): number {
  switch (shape) {
    case 'circle':
      return Math.PI * 10 * 10;
    case 'square':
      return 10 * 10;
    default:
      // If we add a new shape type and forget to handle it,
      // TypeScript will error here
      const exhaustive: never = shape;
      throw new Error(`Unhandled shape: ${exhaustive}`);
  }
}
```

**Void vs Never:**

| Aspect | void | never |
|--------|------|-------|
| **Returns** | Nothing (undefined) | Never returns |
| **Completes** | Function completes | Function never completes |
| **Use Case** | Functions with side effects | Errors, infinite loops |
| **Can assign** | `undefined` | Nothing can be assigned |

---

## 13. Generics

**Generics** allow you to write reusable code that works with multiple types while maintaining type safety.

```typescript
// Basic generic function
function identity<T>(value: T): T {
  return value;
}

const num = identity<number>(42); // number
const str = identity<string>('hello'); // string
const bool = identity(true); // inferred: boolean

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
const firstName = getFirst<string>(['a', 'b']); // string
const firstBool = getFirst([true, false]); // inferred: boolean

// Multiple type parameters
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

const result = pair<string, number>('age', 25); // [string, number]
const result2 = pair('name', 'Anwar'); // inferred: [string, string]

// Generic interfaces
interface Box<T> {
  value: T;
}

const numberBox: Box<number> = { value: 42 };
const stringBox: Box<string> = { value: 'hello' };

// Generic classes
class DataHolder<T> {
  private data: T;

  constructor(data: T) {
    this.data = data;
  }

  getData(): T {
    return this.data;
  }

  setData(data: T): void {
    this.data = data;
  }
}

const holder = new DataHolder<number>(42);
holder.setData(100);

// Generic type alias
type Response<T> = {
  data: T;
  status: number;
  message: string;
};

type UserResponse = Response<User>;
type ProductResponse = Response<Product[]>;

// Default generic parameters
interface Container<T = string> {
  value: T;
}

const stringContainer: Container = { value: 'hello' }; // Uses default
const numberContainer: Container<number> = { value: 42 };
```

---

## 14. Generic Constraints

**Constraints** limit what types can be used with generics using the `extends` keyword.

```typescript
// Constraint: T must have 'length' property
function logLength<T extends { length: number }>(item: T): void {
  console.log(item.length);
}

logLength('hello'); // ✅ string has length
logLength([1, 2, 3]); // ✅ array has length
logLength({ length: 10 }); // ✅ object with length
// logLength(123); // ❌ Error: number has no length

// Constraint: T must extend base type
interface HasId {
  id: number;
}

function getById<T extends HasId>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id);
}

// Constraint: T must be object
function getProperty<T extends object, K extends keyof T>(
  obj: T,
  key: K
): T[K] {
  return obj[key];
}

const user = { name: 'Anwar', age: 25 };
const name = getProperty(user, 'name'); // 'Anwar'
const age = getProperty(user, 'age'); // 25
// const invalid = getProperty(user, 'email'); // ❌ Error

// Multiple constraints
function merge<T extends object, U extends object>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

const merged = merge({ name: 'Anwar' }, { age: 25 });
// Type: { name: string } & { age: number }

// Constraint with type parameter
function create<T extends new (...args: any[]) => any>(
  Constructor: T,
  ...args: any[]
): InstanceType<T> {
  return new Constructor(...args);
}

class Person {
  constructor(public name: string) {}
}

const person = create(Person, 'Anwar'); // Person instance
```

---

## 15. Utility Types

TypeScript provides built-in utility types for common type transformations.

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  password: string;
}

// 1. Partial<T> - All properties optional
type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string; age?: number; password?: string }

function updateUser(id: number, updates: Partial<User>) {
  // Can update any subset of User properties
}

// 2. Required<T> - All properties required
type RequiredUser = Required<PartialUser>;

// 3. Readonly<T> - All properties readonly
type ReadonlyUser = Readonly<User>;
const user: ReadonlyUser = { id: 1, name: 'Anwar', email: 'a@example.com', age: 25, password: 'secret' };
// user.name = 'Sara'; // ❌ Error: readonly

// 4. Pick<T, K> - Select specific properties
type UserPreview = Pick<User, 'id' | 'name'>;
// { id: number; name: string }

type UserSummary = Pick<User, 'name' | 'email'>;

// 5. Omit<T, K> - Remove specific properties
type UserWithoutPassword = Omit<User, 'password'>;
// { id: number; name: string; email: string; age: number }

type PublicUser = Omit<User, 'password' | 'email'>;

// 6. Record<K, T> - Create object type with keys K and values T
type UserRoles = Record<string, boolean>;
const roles: UserRoles = {
  canEdit: true,
  canDelete: false,
  canView: true
};

type Roles = 'admin' | 'user' | 'guest';
type RolePermissions = Record<Roles, boolean>;
const permissions: RolePermissions = {
  admin: true,
  user: false,
  guest: false
};

// 7. Exclude<T, U> - Exclude types from union
type Status = 'success' | 'error' | 'loading' | 'idle';
type ActiveStatus = Exclude<Status, 'idle'>; // 'success' | 'error' | 'loading'

// 8. Extract<T, U> - Extract types from union
type StringOrNumber = string | number | boolean;
type StringsOnly = Extract<StringOrNumber, string>; // string

// 9. NonNullable<T> - Remove null and undefined
type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>; // string

// 10. ReturnType<T> - Get function return type
function getUser() {
  return { id: 1, name: 'Anwar' };
}

type User = ReturnType<typeof getUser>; // { id: number; name: string }

// 11. Parameters<T> - Get function parameter types
function createUser(name: string, age: number) {}

type CreateUserParams = Parameters<typeof createUser>; // [string, number]

// 12. Awaited<T> - Unwrap Promise type
type AsyncUser = Promise<User>;
type UnwrappedUser = Awaited<AsyncUser>; // User
```

---

## 16. Mapped Types

**Mapped types** transform properties of existing types to create new types.

```typescript
// Basic mapped type
type Optional<T> = {
  [P in keyof T]?: T[P];
};

type ReadOnly<T> = {
  readonly [P in keyof T]: T[P];
};

interface User {
  id: number;
  name: string;
  age: number;
}

type OptionalUser = Optional<User>;
// { id?: number; name?: string; age?: number }

// Change all properties to strings
type Stringify<T> = {
  [P in keyof T]: string;
};

type StringUser = Stringify<User>;
// { id: string; name: string; age: string }

// Add prefix to properties
type Getters<T> = {
  [P in keyof T as `get${Capitalize<string & P>}`]: () => T[P];
};

type UserGetters = Getters<User>;
// {
//   getId: () => number;
//   getName: () => string;
//   getAge: () => number;
// }

// Filter properties
type OnlyStrings<T> = {
  [P in keyof T as T[P] extends string ? P : never]: T[P];
};

interface Mixed {
  name: string;
  age: number;
  email: string;
  id: number;
}

type StringProps = OnlyStrings<Mixed>;
// { name: string; email: string }

// Combine transformations
type NullableOptional<T> = {
  [P in keyof T]?: T[P] | null;
};

type FlexibleUser = NullableOptional<User>;
// { id?: number | null; name?: string | null; age?: number | null }
```

---

## 17. Conditional Types

**Conditional types** select types based on conditions using ternary syntax: `T extends U ? X : Y`

```typescript
// Basic conditional type
type IsString<T> = T extends string ? true : false;

type A = IsString<string>; // true
type B = IsString<number>; // false

// Extract array element type
type ArrayElement<T> = T extends (infer U)[] ? U : T;

type StringArray = string[];
type Element = ArrayElement<StringArray>; // string

type NotArray = ArrayElement<number>; // number (not an array)

// NonNullable (built-in example)
type NonNullable<T> = T extends null | undefined ? never : T;

type MaybeString = string | null | undefined;
type DefiniteString = NonNullable<MaybeString>; // string

// Infer return type
type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function getUser() {
  return { id: 1, name: 'Anwar' };
}

type UserType = GetReturnType<typeof getUser>; // { id: number; name: string }

// Flatten nested arrays
type Flatten<T> = T extends Array<infer U> ? Flatten<U> : T;

type NestedArray = string[][][];
type Flat = Flatten<NestedArray>; // string

// Conditional with union types (distributive)
type ToArray<T> = T extends any ? T[] : never;

type StrOrNum = string | number;
type ArrayTypes = ToArray<StrOrNum>; // string[] | number[]

// Complex example: Function or value
type Unwrap<T> = T extends (...args: any[]) => infer R ? R : T;

type FuncType = Unwrap<() => string>; // string
type ValueType = Unwrap<number>; // number
```

---

## 18. Type Assertion (Type Casting)

**Type assertion** tells TypeScript "trust me, I know the type better than you."

```typescript
// Syntax 1: 'as' (recommended)
let value: unknown = 'hello';
let length: number = (value as string).length;

// Syntax 2: angle brackets (not in .tsx files)
let length2: number = (<string>value).length;

// Common use case: DOM elements
const input = document.getElementById('username') as HTMLInputElement;
input.value = 'Anwar'; // ✅ TypeScript knows it's an input

// Without assertion
const div = document.getElementById('username');
// div.value = 'Anwar'; // ❌ Error: value doesn't exist on HTMLElement

// Type assertion with fetch
interface User {
  id: number;
  name: string;
}

async function getUser(): Promise<User> {
  const response = await fetch('/api/user');
  return response.json() as Promise<User>;
}

// Const assertion
const colors = ['red', 'green', 'blue'] as const;
// Type: readonly ['red', 'green', 'blue']

const config = {
  host: 'localhost',
  port: 3000
} as const;
// Type: { readonly host: 'localhost'; readonly port: 3000 }

// Double assertion (use carefully)
let num = 123;
let str = num as unknown as string; // ⚠️ Dangerous - bypasses type system

// Non-null assertion (!)
function getValue(): string | null {
  return 'hello';
}

const value2 = getValue()!; // Assert it's not null
value2.toUpperCase(); // No error, but risky if actually null
```

**When to Use:**

```typescript
// Use type assertion when:

// 1. You know more than TypeScript
const canvas = document.getElementById('canvas') as HTMLCanvasElement;

// 2. Working with third-party libraries without types
const $ = (window as any).$;

// 3. After type narrowing
function processValue(value: string | number) {
  if (typeof value === 'string') {
    const upper = (value as string).toUpperCase(); // Redundant but explicit
  }
}

// 4. Const assertions for literal types
const routes = {
  home: '/',
  about: '/about'
} as const;
```

---

## 19. Non-null Assertion Operator

The **!** operator tells TypeScript "this value is NOT null/undefined" (removes null/undefined from type).

```typescript
// Basic usage
function getValue(): string | null {
  return 'hello';
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
const button = document.getElementById('btn')!;
button.click(); // Assumes button exists

// Optional chaining vs non-null assertion
const user: User | null = getUser();

// Safe: optional chaining
user?.name.toUpperCase();

// Risky: non-null assertion
user!.name.toUpperCase(); // Throws if user is null

// Array access
const numbers = [1, 2, 3];
const first = numbers[0]!; // Assert it exists
const tenth = numbers[10]!; // ⚠️ Dangerous - might be undefined

// With object properties
interface Config {
  apiKey?: string;
}

const config: Config = { apiKey: 'abc123' };
const key = config.apiKey!; // Assert it's defined
```

**When to Use (Carefully):**

```typescript
// Use ! only when:

// 1. You're 100% certain value exists
const container = document.getElementById('root')!; // Root always exists in HTML

// 2. After explicit checks
function processUser(user: User | null) {
  if (!user) throw new Error('User required');

  // Safe to use ! here because we checked above
  const name = user!.name;
}

// 3. Library guarantees
const item = arr.find(x => x.id === id)!; // If you know it must exist

// ⚠️ Avoid using ! - prefer type guards instead
function processValue(value: string | null) {
  // ❌ Bad
  console.log(value!.length);

  // ✅ Good
  if (value) {
    console.log(value.length);
  }
}
```

---

## 20. Index Signatures

**Index signatures** define types for dynamic property names when you don't know them in advance.

```typescript
// Basic index signature
interface StringDictionary {
  [key: string]: string;
}

const dict: StringDictionary = {
  name: 'Anwar',
  city: 'Dubai',
  country: 'UAE'
  // Can add any string key
};

// Number index
interface NumberArray {
  [index: number]: string;
}

const arr: NumberArray = ['a', 'b', 'c'];

// Mixed: specific + dynamic properties
interface User {
  id: number; // Required specific property
  name: string; // Required specific property
  [key: string]: any; // Any additional properties
}

const user: User = {
  id: 1,
  name: 'Anwar',
  age: 25, // ✅ Allowed by index signature
  email: 'a@example.com', // ✅ Allowed
  isActive: true // ✅ Allowed
};

// Readonly index signature
interface ReadonlyDictionary {
  readonly [key: string]: string;
}

const dict2: ReadonlyDictionary = { name: 'Anwar' };
// dict2.name = 'Sara'; // ❌ Error: readonly

// Multiple index signatures
interface MixedDictionary {
  [key: string]: string | number;
  [key: number]: number; // More specific for number keys
}

// Utility type with index signature
type Dictionary<T> = {
  [key: string]: T;
};

const userScores: Dictionary<number> = {
  anwar: 100,
  sara: 95,
  ahmed: 88
};

// Record type (preferred over manual index signature)
type UserScores = Record<string, number>;
const scores: UserScores = {
  anwar: 100,
  sara: 95
};
```

---

## 21. Enums

**Enums** define a set of named constants. Creates both type and runtime value.

```typescript
// Numeric enum (default, starts at 0)
enum Status {
  Pending,    // 0
  Approved,   // 1
  Rejected    // 2
}

let status: Status = Status.Pending;
console.log(status); // 0
console.log(Status[0]); // 'Pending' (reverse mapping)

// Custom numeric values
enum HttpStatus {
  OK = 200,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  ServerError = 500
}

// String enum
enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT'
}

let dir: Direction = Direction.Up;
console.log(dir); // 'UP'

// Computed and constant members
enum FileAccess {
  None,
  Read = 1 << 1,     // 2
  Write = 1 << 2,    // 4
  ReadWrite = Read | Write, // 6
  G = '123'.length   // Computed
}

// Const enum (better performance, no runtime code)
const enum Color {
  Red,
  Green,
  Blue
}

let color: Color = Color.Red; // Inlined to 0 at compile time

// Heterogeneous enum (mixed types - not recommended)
enum BooleanLikeHeterogeneousEnum {
  No = 0,
  Yes = 'YES'
}
```

**Enum Methods:**

```typescript
enum Status {
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
  Pending = 'PENDING'
}

// Get all enum values
const values = Object.values(Status); // ['ACTIVE', 'INACTIVE', 'PENDING']

// Get all enum keys
const keys = Object.keys(Status); // ['Active', 'Inactive', 'Pending']

// Check if value is in enum
function isValidStatus(value: string): value is Status {
  return Object.values(Status).includes(value as Status);
}
```

---

## 22. Enum vs Union Types

Both represent a set of possible values, but work differently.

**Comparison:**

| Feature | Enum | Union Type |
|---------|------|------------|
| **Runtime Presence** | ✅ Exists as object | ❌ Compile-time only |
| **Reverse Mapping** | ✅ Numeric enums only | ❌ No |
| **Bundle Size** | Larger (runtime code) | Smaller (no runtime) |
| **Iteration** | ✅ Can iterate | ❌ Cannot iterate |
| **Flexibility** | Less flexible | More flexible |
| **TypeScript Feature** | Specific to TS | JavaScript compatible |

```typescript
// Enum - creates runtime object
enum Status {
  Active = 'active',
  Inactive = 'inactive'
}

let status: Status = Status.Active;
console.log(Status.Active); // 'active' (exists at runtime)
console.log(Object.keys(Status)); // ['Active', 'Inactive']

// Union Type - compile-time only
type StatusType = 'active' | 'inactive';

let status2: StatusType = 'active';
// console.log(StatusType.active); // ❌ Error: no runtime object

// Enum allows iteration
for (const key in Status) {
  console.log(key, Status[key as keyof typeof Status]);
}

// Union type with const object (best of both)
const StatusValues = {
  Active: 'active',
  Inactive: 'inactive'
} as const;

type Status = typeof StatusValues[keyof typeof StatusValues];
// Status = 'active' | 'inactive'
```

**When to Use:**

```typescript
// Use Enum when:
// - Need runtime values
// - Need reverse mapping
// - Working with numeric constants
enum HttpStatus {
  OK = 200,
  NotFound = 404
}

// Use Union when:
// - Prefer smaller bundles
// - Want compile-time only
// - More flexibility
type Theme = 'light' | 'dark' | 'auto';

// Best of both: Const object + union
const THEME = {
  Light: 'light',
  Dark: 'dark',
  Auto: 'auto'
} as const;

type Theme = typeof THEME[keyof typeof THEME];
```

---

## 23. TypeScript with React

TypeScript provides type safety for React components, props, state, events, and hooks.

```typescript
import { FC, useState, ChangeEvent, FormEvent } from 'react';

// Props interface
interface UserProps {
  name: string;
  age: number;
  email?: string; // Optional
  onUpdate?: (name: string) => void; // Optional function
  children?: React.ReactNode;
}

// Function Component (preferred)
function User({ name, age, email, onUpdate }: UserProps) {
  const [count, setCount] = useState<number>(0);

  const handleClick = () => {
    onUpdate?.(name); // Optional chaining
  };

  return (
    <div>
      <h1>{name}</h1>
      <p>Age: {age}</p>
      {email && <p>Email: {email}</p>}
      <p>Count: {count}</p>
      <button onClick={handleClick}>Update</button>
    </div>
  );
}

// With FC type (less common now)
const UserFC: FC<UserProps> = ({ name, age, email, onUpdate, children }) => {
  return (
    <div>
      <h1>{name}</h1>
      {children}
    </div>
  );
};

// Component with generics
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul>
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

// Usage
interface User {
  id: number;
  name: string;
}

<List<User>
  items={users}
  renderItem={(user) => <span>{user.name}</span>}
/>

// Default props
interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary';
}

function Button({ label, variant = 'primary' }: ButtonProps) {
  return <button className={variant}>{label}</button>;
}
```

---

## 24. React TypeScript Types

Common React TypeScript types for components and elements.

```typescript
import { ReactNode, ReactElement, FC, PropsWithChildren, JSX } from 'react';

// 1. ReactNode - Anything React can render
interface CardProps {
  title: string;
  children: ReactNode; // Can be string, number, element, array, null, etc.
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
  {['a', 'b', 'c']}
</Card>

// 2. ReactElement - Result of JSX (more specific than ReactNode)
interface IconProps {
  icon: ReactElement;
  label: string;
}

const IconButton = ({ icon, label }: IconProps) => (
  <button>
    {icon}
    {label}
  </button>
);

<IconButton icon={<span>📧</span>} label="Email" />

// 3. JSX.Element - Specific type of ReactElement
function Welcome(): JSX.Element {
  return <div>Hello</div>;
}

// 4. FC (FunctionComponent) - Type for function components
const UserProfile: FC<{ name: string }> = ({ name }) => (
  <div>{name}</div>
);

// 5. PropsWithChildren - Props that include children
interface BoxProps {
  color: string;
}

const Box: FC<PropsWithChildren<BoxProps>> = ({ color, children }) => (
  <div style={{ backgroundColor: color }}>
    {children}
  </div>
);

// 6. Component types
type ButtonComponent = React.ComponentType<ButtonProps>;
type ElementType = React.ElementType; // Any valid React element type

// 7. CSSProperties - Inline styles
interface StyledProps {
  style?: React.CSSProperties;
}

const StyledDiv = ({ style }: StyledProps) => (
  <div style={style}>Content</div>
);

// 8. HTML Attributes
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input = ({ label, ...props }: InputProps) => (
  <div>
    <label>{label}</label>
    <input {...props} />
  </div>
);
```

---

## 25. React Event Types

React events have specific TypeScript types imported from React.

```typescript
import {
  ChangeEvent,
  MouseEvent,
  FormEvent,
  KeyboardEvent,
  FocusEvent,
  DragEvent
} from 'react';

function EventsExample() {
  // Input change
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  // Textarea change
  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    console.log(e.target.value);
  };

  // Select change
  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
  };

  // Button click
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    console.log('Clicked at:', e.clientX, e.clientY);
  };

  // Div click (more generic)
  const handleDivClick = (e: MouseEvent<HTMLDivElement>) => {
    console.log('Div clicked');
  };

  // Form submit
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted');
  };

  // Keyboard events
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      console.log('Enter pressed');
    }
  };

  // Focus events
  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    console.log('Input focused');
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    console.log('Input blurred');
  };

  // Drag events
  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    console.log('Dragging');
  };

  return (
    <div>
      <input onChange={handleInputChange} onKeyDown={handleKeyDown} />
      <textarea onChange={handleTextAreaChange} />
      <select onChange={handleSelectChange}>
        <option>Option 1</option>
      </select>
      <button onClick={handleClick}>Click Me</button>
      <div onClick={handleDivClick}>Click div</div>
      <form onSubmit={handleSubmit}>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

// Generic event handler
type EventHandler<T = HTMLElement> = (event: MouseEvent<T>) => void;

interface ButtonProps {
  onClick: EventHandler<HTMLButtonElement>;
  onDivClick: EventHandler<HTMLDivElement>;
}
```

---

## 26. Typing React Hooks

React hooks support generics for type safety.

```typescript
import { useState, useEffect, useRef, useReducer, useContext, useMemo, useCallback } from 'react';

function HooksExample() {
  // 1. useState - Type inference
  const [count, setCount] = useState(0); // inferred as number
  const [name, setName] = useState(''); // inferred as string

  // useState - Explicit type
  const [user, setUser] = useState<User | null>(null);

  // useState - Union type
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // useState - With initial undefined
  const [data, setData] = useState<string>(); // string | undefined

  // 2. useRef - DOM element
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInput = () => {
    inputRef.current?.focus(); // Optional chaining because it might be null
  };

  // useRef - Mutable value
  const timerRef = useRef<number>(0);
  const countRef = useRef<number>(0);

  // 3. useEffect - No special types needed
  useEffect(() => {
    // Effect logic

    return () => {
      // Cleanup
    };
  }, []);

  // 4. useReducer
  type State = { count: number };
  type Action = { type: 'increment' } | { type: 'decrement' } | { type: 'reset' };

  const reducer = (state: State, action: Action): State => {
    switch (action.type) {
      case 'increment':
        return { count: state.count + 1 };
      case 'decrement':
        return { count: state.count - 1 };
      case 'reset':
        return { count: 0 };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, { count: 0 });

  // 5. useContext
  interface ThemeContextType {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
  }

  const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
  const theme = useContext(ThemeContext);

  // 6. useMemo
  const expensiveValue = useMemo<number>(() => {
    return calculateExpensiveValue(count);
  }, [count]);

  // 7. useCallback
  const handleClick = useCallback((id: number) => {
    console.log('Clicked:', id);
  }, []);

  return (
    <div>
      <input ref={inputRef} />
      <button onClick={focusInput}>Focus</button>
      <p>Count: {state.count}</p>
    </div>
  );
}

interface User {
  id: number;
  name: string;
}

function calculateExpensiveValue(n: number): number {
  return n * 2;
}
```

---

## 27. tsconfig.json Configuration

The `tsconfig.json` file configures TypeScript compiler options.

```json
{
  "compilerOptions": {
    // Language and Environment
    "target": "ES2020",              // JavaScript version to compile to
    "lib": ["ES2020", "DOM", "DOM.Iterable"], // Available libraries
    "jsx": "react-jsx",               // JSX support for React 17+
    "module": "ESNext",               // Module system
    "moduleResolution": "bundler",    // Module resolution strategy

    // Type Checking
    "strict": true,                   // Enable all strict checks
    "strictNullChecks": true,         // Null/undefined checking
    "strictFunctionTypes": true,      // Function parameter checking
    "strictBindCallApply": true,      // Bind/call/apply checking
    "strictPropertyInitialization": true,
    "noImplicitAny": true,            // Error on implicit any
    "noImplicitThis": true,           // Error on implicit this
    "alwaysStrict": true,             // Parse in strict mode

    // Additional Checks
    "noUnusedLocals": true,           // Error on unused variables
    "noUnusedParameters": true,       // Error on unused parameters
    "noImplicitReturns": true,        // Error if not all paths return
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true, // Add undefined to index signatures

    // Emit
    "declaration": true,              // Generate .d.ts files
    "declarationMap": true,           // Source maps for .d.ts
    "sourceMap": true,                // Generate .js.map files
    "removeComments": true,           // Strip comments
    "noEmit": true,                   // Don't emit (let bundler handle)

    // Interop Constraints
    "esModuleInterop": true,          // CommonJS/ES6 interop
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "isolatedModules": true,          // Each file as separate module

    // Skip Checking
    "skipLibCheck": true,             // Skip type checking of .d.ts files

    // Path Mapping
    "baseUrl": "./",                  // Base directory for imports
    "paths": {                        // Path aliases
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"]
    },

    // Import Helpers
    "importHelpers": true,            // Import helpers from tslib

    // Experimental
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,

    // Advanced
    "resolveJsonModule": true,        // Import JSON files
    "allowJs": true,                  // Allow JavaScript files
    "checkJs": false                  // Check JavaScript files
  },

  // Files to include
  "include": [
    "src/**/*",
    "src/**/*.tsx",
    "src/**/*.ts"
  ],

  // Files to exclude
  "exclude": [
    "node_modules",
    "dist",
    "build",
    "**/*.spec.ts"
  ],

  // Project references (for monorepos)
  "references": [
    { "path": "./tsconfig.node.json" }
  ]
}
```

---

## 28. Declaration Files (.d.ts)

**Declaration files** contain only type information (no implementation) for JavaScript libraries.

```typescript
// types.d.ts

// Declare module for third-party library
declare module 'my-library' {
  export function doSomething(value: string): number;

  export class MyClass {
    constructor(name: string);
    getName(): string;
    setName(name: string): void;
  }

  export interface Config {
    apiKey: string;
    timeout: number;
  }
}

// Global types
interface Window {
  myCustomProperty: string;
  customFunction(): void;
}

declare const API_URL: string;
declare const VERSION: string;

// Ambient modules for file imports
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.scss' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  import * as React from 'react';
  const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}

declare module '*.json' {
  const value: any;
  export default value;
}

// Global namespace augmentation
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      API_URL: string;
      API_KEY: string;
    }
  }
}

// Module augmentation
declare module 'react' {
  interface HTMLAttributes<T> {
    customAttribute?: string;
  }
}

// Declare library without types
declare module 'untyped-library';

export {};
```

---

## 29. Type Guards

**Type guards** narrow types within conditional blocks.

```typescript
// typeof type guard
function processValue(value: string | number) {
  if (typeof value === 'string') {
    return value.toUpperCase(); // TypeScript knows it's string
  } else {
    return value.toFixed(2); // TypeScript knows it's number
  }
}

// instanceof type guard
class Dog {
  bark() {
    console.log('Woof!');
  }
}

class Cat {
  meow() {
    console.log('Meow!');
  }
}

function handlePet(pet: Dog | Cat) {
  if (pet instanceof Dog) {
    pet.bark(); // TypeScript knows it's Dog
  } else {
    pet.meow(); // TypeScript knows it's Cat
  }
}

// in operator type guard
interface Car {
  drive(): void;
}

interface Boat {
  sail(): void;
}

function operate(vehicle: Car | Boat) {
  if ('drive' in vehicle) {
    vehicle.drive(); // TypeScript knows it's Car
  } else {
    vehicle.sail(); // TypeScript knows it's Boat
  }
}

// Custom type guard function
interface Fish {
  swim(): void;
}

interface Bird {
  fly(): void;
}

function isFish(animal: Fish | Bird): animal is Fish {
  return (animal as Fish).swim !== undefined;
}

function move(animal: Fish | Bird) {
  if (isFish(animal)) {
    animal.swim(); // TypeScript knows it's Fish
  } else {
    animal.fly(); // TypeScript knows it's Bird
  }
}

// Array type guard
function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(item => typeof item === 'string');
}

// Nullish type guard
function processUser(user: User | null | undefined) {
  if (user) {
    console.log(user.name); // TypeScript knows user is not null/undefined
  }
}

// Assertion function (throws if false)
function assertIsDefined<T>(value: T): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error('Value must be defined');
  }
}

function processValue2(value: string | null) {
  assertIsDefined(value);
  // After this point, TypeScript knows value is string (not null)
  console.log(value.toUpperCase());
}
```

---

## 30. Discriminated Unions

**Discriminated unions** (tagged unions) use a common property to narrow types.

```typescript
// API Response discriminated union
interface SuccessResponse {
  status: 'success';
  data: User[];
}

interface ErrorResponse {
  status: 'error';
  error: string;
  code: number;
}

type ApiResponse = SuccessResponse | ErrorResponse;

function handleResponse(response: ApiResponse) {
  // TypeScript narrows based on 'status' discriminant
  if (response.status === 'success') {
    console.log(response.data); // ✅ Access data
    // console.log(response.error); // ❌ Error: doesn't exist
  } else {
    console.log(response.error); // ✅ Access error
    // console.log(response.data); // ❌ Error: doesn't exist
  }
}

// Shape discriminated union
interface Circle {
  kind: 'circle';
  radius: number;
}

interface Square {
  kind: 'square';
  sideLength: number;
}

interface Rectangle {
  kind: 'rectangle';
  width: number;
  height: number;
}

type Shape = Circle | Square | Rectangle;

function getArea(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':
      return Math.PI * shape.radius ** 2;
    case 'square':
      return shape.sideLength ** 2;
    case 'rectangle':
      return shape.width * shape.height;
    default:
      // Exhaustive check
      const _exhaustive: never = shape;
      throw new Error(`Unhandled shape: ${_exhaustive}`);
  }
}

// Redux action discriminated union
interface LoginAction {
  type: 'LOGIN';
  payload: { username: string; password: string };
}

interface LogoutAction {
  type: 'LOGOUT';
}

interface UpdateUserAction {
  type: 'UPDATE_USER';
  payload: Partial<User>;
}

type Action = LoginAction | LogoutAction | UpdateUserAction;

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
  }
}
```

---

## 31. Function Overloads

**Function overloads** provide multiple type signatures for a single function.

```typescript
// Basic overload
function greet(name: string): string;
function greet(firstName: string, lastName: string): string;
function greet(firstName: string, lastName?: string): string {
  if (lastName) {
    return `Hello, ${firstName} ${lastName}`;
  }
  return `Hello, ${firstName}`;
}

greet('Anwar'); // ✅ string
greet('Anwar', 'Barakat'); // ✅ string
// greet('Anwar', 'Middle', 'Barakat'); // ❌ Error

// Overload with different return types
function getValue(key: string): string;
function getValue(key: number): number;
function getValue(key: string | number): string | number {
  if (typeof key === 'string') {
    return 'string value';
  }
  return 42;
}

const strValue = getValue('name'); // string
const numValue = getValue(123); // number

// Array overload
function getLength(arr: string[]): number;
function getLength(arr: number[]): number;
function getLength(arr: any[]): number {
  return arr.length;
}

// Generic with overload
function map<T, U>(arr: T[], fn: (item: T) => U): U[];
function map<T>(arr: T[], fn: (item: T) => boolean): T[];
function map<T, U>(arr: T[], fn: (item: T) => U | boolean): (U | T)[] {
  return arr.map(fn as any);
}
```

---

## 32. Template Literal Types

**Template literal types** build types from string literals.

```typescript
// Basic template literal type
type Greeting = `Hello, ${string}`;

const greeting1: Greeting = 'Hello, Anwar'; // ✅
const greeting2: Greeting = 'Hello, World'; // ✅
// const greeting3: Greeting = 'Hi, Anwar'; // ❌ Error

// Union in template
type Color = 'red' | 'green' | 'blue';
type Size = 'small' | 'medium' | 'large';

type ColoredSize = `${Color}-${Size}`;
// 'red-small' | 'red-medium' | 'red-large' | 'green-small' | ...

// Event names
type EventName = 'click' | 'focus' | 'blur';
type EventHandler = `on${Capitalize<EventName>}`;
// 'onClick' | 'onFocus' | 'onBlur'

// HTTP methods
type Method = 'get' | 'post' | 'put' | 'delete';
type ApiRoute = `/api/${string}`;
type ApiCall = `${Method} ${ApiRoute}`;
// 'get /api/users' | 'post /api/users' | ...

// CSS properties
type CSSProperty = 'margin' | 'padding';
type Direction = 'top' | 'right' | 'bottom' | 'left';
type CSSPropertyWithDirection = `${CSSProperty}-${Direction}`;
// 'margin-top' | 'margin-right' | ... | 'padding-left'

// Extract from template
type EmailAddress = `${string}@${string}.${string}`;

function sendEmail(to: EmailAddress) {
  console.log(`Sending to: ${to}`);
}

sendEmail('anwar@example.com'); // ✅
// sendEmail('invalid-email'); // ❌ Error
```

---

## 33. Best Practices

**TypeScript Best Practices for React Development:**

```typescript
// 1. Enable strict mode
// tsconfig.json: "strict": true

// 2. Avoid 'any', use 'unknown' instead
// ❌ Bad
function process(data: any) {}

// ✅ Good
function process(data: unknown) {
  if (typeof data === 'string') {
    return data.toUpperCase();
  }
}

// 3. Use interfaces for objects, types for unions/intersections
// ✅ Interface for objects
interface User {
  id: number;
  name: string;
}

// ✅ Type for unions
type Status = 'active' | 'inactive' | 'pending';
type ID = string | number;

// 4. Prefer type inference when possible
const name = 'Anwar'; // ✅ Inferred as string
const age: number = 25; // Explicit (unnecessary but OK)

// 5. Use const assertions for literal types
const colors = ['red', 'green', 'blue'] as const;
type Color = typeof colors[number]; // 'red' | 'green' | 'blue'

// 6. Leverage utility types
type PartialUser = Partial<User>;
type UserPreview = Pick<User, 'id' | 'name'>;
type UserWithoutPassword = Omit<User, 'password'>;

// 7. Write custom type guards
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  );
}

// 8. Use discriminated unions
type Result =
  | { success: true; data: string }
  | { success: false; error: string };

// 9. Use non-null assertion (!) sparingly
const element = document.getElementById('root')!; // Only if you're certain

// 10. Keep types simple and readable
// ❌ Bad - too complex
type ComplexType = ((a: string) => number) & { prop: boolean } | string[];

// ✅ Good - broken down
type StringToNumber = (a: string) => number;
type WithProp = { prop: boolean };
type ComplexType = (StringToNumber & WithProp) | string[];

// 11. Use generics for reusable code
function identity<T>(value: T): T {
  return value;
}

// 12. Avoid enums, prefer const objects with unions
// ❌ Enum (adds runtime code)
enum Status {
  Active = 'active',
  Inactive = 'inactive'
}

// ✅ Const object with union (no runtime code)
const STATUS = {
  Active: 'active',
  Inactive: 'inactive'
} as const;
type Status = typeof STATUS[keyof typeof STATUS];

// 13. Use Record for objects with dynamic keys
type UserScores = Record<string, number>;
const scores: UserScores = {
  anwar: 100,
  sara: 95
};

// 14. Properly type React components
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}

// 15. Use satisfies for type checking without widening
const config = {
  host: 'localhost',
  port: 3000
} satisfies Record<string, string | number>;

// config.host is 'localhost' (not string)
// config.port is 3000 (not number)
```

---

## 34. Summary

**TypeScript Core Concepts:**

- **Static Typing**: Catch errors at compile time
- **Type Inference**: Automatic type detection
- **Type Safety**: Prevent runtime type errors
- **Better Tooling**: Enhanced IDE support and autocomplete
- **Self-Documenting**: Types serve as inline documentation

**Essential Type Features:**

- **Basic Types**: string, number, boolean, any, unknown, void, never
- **Complex Types**: Union (|), Intersection (&), Literal types
- **Type Aliases & Interfaces**: Define custom types
- **Generics**: Write reusable, type-safe code
- **Utility Types**: Partial, Pick, Omit, Record, etc.
- **Type Guards**: Narrow types safely

**React with TypeScript:**

- Type props, state, events, and hooks
- Use proper event types (MouseEvent, ChangeEvent, etc.)
- Leverage React TypeScript types (ReactNode, FC, etc.)
- Type custom hooks for reusability

**Best Practices:**

- Enable strict mode in tsconfig.json
- Prefer unknown over any
- Use type inference when possible
- Write custom type guards
- Leverage utility types
- Keep types simple and readable
- Use discriminated unions for complex states
- Properly type React components and hooks

**Next Steps:**

- Master advanced TypeScript patterns
- Practice with real-world projects
- Learn TypeScript with state management (Redux, Zustand)
- Explore TypeScript with Next.js
- Build type-safe APIs with TypeScript
