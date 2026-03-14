# JavaScript Fundamentals Guide

## 1. Language Basics

- **Compiled** — converted to machine code before running (C++, Rust). Fast, errors at compile time.
- **Interpreted** — executed line-by-line (JS, Python). Flexible, errors at runtime.
- Modern JS engines (V8) use JIT compilation. JS is single-threaded, dynamically typed, multi-paradigm.
- Runs in: Browser, Node.js, React Native, Electron.

---

## 2. Data Types

**Primitives** — stored by value, immutable: `String`, `Number`, `Boolean`, `undefined`, `null`, `Symbol`, `BigInt`

**Reference types** — stored by reference, mutable: `Object`, `Array`, `Function`, `Map`, `Set`

```javascript
let obj1 = { name: "Anwar" };
let obj2 = obj1;        // Copies reference, not the object
obj2.name = "Ali";
console.log(obj1.name); // "Ali" — same object
```

- `typeof null` → `"object"` (historical JS bug)
- **undefined** — declared but not assigned. **null** — intentional absence (manual).

---

## 3. Variables

| Keyword | Scope | Hoisting | Redeclarable |
|---------|-------|----------|--------------|
| `var` | function | `undefined` | yes |
| `let` | block | TDZ error | no |
| `const` | block | TDZ error | no |

```javascript
const obj = { name: "Anwar" };
obj.name = "Ali";  // ✅ Mutating a property is allowed
obj = {};          // ❌ Reassigning the binding is not
```

**Rule:** Default to `const`. Use `let` when reassignment is needed. Never use `var`.

---

## 4. Hoisting

```javascript
// var — hoisted as undefined
console.log(x);  // undefined
var x = 5;

// let/const — hoisted but in Temporal Dead Zone (TDZ)
console.log(y);  // ❌ ReferenceError
let y = 10;

// Function declarations — fully hoisted
sayHello();  // ✅ Works before definition
function sayHello() { console.log("Hello!"); }

// Function expressions — NOT hoisted
sayBye();    // ❌ TypeError
var sayBye = function() { console.log("Bye!"); };
```

---

## 5. Equality & Type Coercion

```javascript
// == performs type coercion — avoid
5 == "5"           // true
null == undefined  // true

// === strict, no coercion — always prefer this
5 === "5"          // false
```

**Falsy values:** `false`, `0`, `-0`, `""`, `null`, `undefined`, `NaN`
**Truthy:** everything else, including `"0"`, `"false"`, `[]`, `{}`

```javascript
NaN === NaN           // false (NaN is never equal to itself)
Number.isNaN(NaN)     // true  (use this, not isNaN())
```

---

## 6. Functions

```javascript
// Declaration — hoisted, callable before definition
function greet(name = "Guest") {
  return `Hello, ${name}!`;
}

// Arrow function — shorter syntax, no own `this`
const greet = (name = "Guest") => `Hello, ${name}!`;

// Rest parameters
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

// Closure — inner function remembers outer scope after outer has returned
function createCounter() {
  let count = 0;
  return () => ++count;
}
const counter = createCounter();
counter(); // 1
counter(); // 2

// Higher-order — takes or returns a function
function multiplyBy(factor) {
  return (number) => number * factor;
}
const double = multiplyBy(2);
double(5); // 10
```

---

## 7. Scope

- **Global** — accessible everywhere
- **Function** — accessible only within the function
- **Block** — `let`/`const` inside `{}`

Scope is determined where functions are **defined** (lexical scope), not where they are called.

```javascript
// Classic loop pitfall with var
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 3, 3, 3
}

// Fix: use let (block-scoped per iteration)
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100); // 0, 1, 2
}
```

---

## 8. Objects

```javascript
const user = { name: "Anwar", age: 30 };

// Dot notation vs bracket notation (use brackets for dynamic keys)
user.name;
user["name"];

// Copying
const shallow = { ...user };          // Spread — shallow copy
const deep = structuredClone(user);   // Deep copy (modern)

// JSON
JSON.stringify({ name: "Anwar" });    // object → string
JSON.parse('{"name":"Anwar"}');       // string → object
```

---

## 9. Arrays & Iteration

```javascript
// for...in — object keys; for...of — iterable values
for (let key in { a: 1, b: 2 }) { }    // "a", "b"
for (let val of [10, 20, 30]) { }       // 10, 20, 30

// Transforming
[1, 2, 3].map(x => x * 2);                    // [2, 4, 6]
[1, 2, 3, 4].filter(x => x % 2 === 0);        // [2, 4]
[1, 2, 3].reduce((acc, x) => acc + x, 0);     // 6

// Searching
[1, 2, 3].find(x => x > 1);       // 2
[1, 2, 3].includes(2);            // true

// Flattening & unique values
[1, [2, [3]]].flat(Infinity);             // [1, 2, 3]
const unique = [...new Set([1, 2, 2, 3])]; // [1, 2, 3]
```

**forEach vs map:** `forEach` returns `undefined` — use for side effects. `map` returns a new array — use for transformation.

---

## 10. Spread & Destructuring

```javascript
// Spread — expand into individual elements
const merged = [...arr1, ...arr2];
const updated = { ...obj, b: 99 };   // Override property b

// Array destructuring
const [first, , third, ...rest] = [1, 2, 3, 4, 5];

// Object destructuring — extract, rename, default, rest
const { name, age = 25, name: userName, ...remaining } = user;
```

---

## 11. Asynchronous JavaScript & Concurrency Model

JS is single-threaded with a non-blocking event loop. Four key parts:

1. **Call Stack** — executes synchronous code (LIFO)
2. **Web APIs** — browser handles async tasks (setTimeout, fetch)
3. **Microtask Queue** — Promises/async-await (**HIGH** priority)
4. **Macrotask Queue** — setTimeout, DOM events (**LOW** priority)

Microtasks always drain completely before the next macrotask runs.

```javascript
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");
// Output: A, D, C, B
```

---

## 12. Promises & Async/Await

```javascript
// async/await — preferred over .then() chains
async function getUsers() {
  try {
    const response = await fetch("/api/users");
    if (!response.ok) throw new Error("Failed");
    return await response.json();
  } catch (error) {
    console.error(error);
  } finally {
    console.log("Done"); // Always runs
  }
}
```

`async` always returns a Promise. `await` pauses execution until the Promise settles.

---

## 13. DOM Manipulation

```javascript
// Selecting
document.getElementById("id");
document.querySelector(".class");      // First match
document.querySelectorAll(".class");   // All matches (NodeList)

// Creating & modifying
const div = document.createElement("div");
div.textContent = "Safe text";         // XSS-safe
div.classList.add("active");
div.setAttribute("data-id", "123");
document.body.appendChild(div);
el.remove();
```

---

## 14. Events

```javascript
// addEventListener — preferred (supports multiple handlers)
btn.addEventListener("click", handler);
btn.removeEventListener("click", handler);

child.addEventListener("click", (e) => {
  e.stopPropagation(); // Prevent bubbling up
  e.preventDefault();  // Prevent default browser action
});
```

---

## 15. Prototypal Inheritance

Every object has a hidden `__proto__` link. Property lookup walks the chain until `null`.

```javascript
function Animal(name) { this.name = name; }
Animal.prototype.speak = function() { return `${this.name} speaks`; };

function Dog(name) { Animal.call(this, name); }
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.bark = function() { return `${this.name} barks!`; };

const dog = new Dog("Rex");
dog.speak(); // "Rex speaks" (inherited from Animal)
```

---

## 16. ES6+ Features

```javascript
// Template literals
const msg = `Hello, ${name}! Total: $${price * qty}`;

// Optional chaining — returns undefined instead of throwing
const zip = user?.address?.zip;

// Nullish coalescing — default only for null/undefined, not 0 or ""
const count = 0;
count || 10;  // 10 (|| treats 0 as falsy)
count ?? 10;  // 0 (?? only triggers on null/undefined)
```

---

## 17. Modules

```javascript
// Named exports/imports
export const PI = 3.14;
export function add(a, b) { return a + b; }

import { PI, add } from "./math.js";
import * as MathUtils from "./math.js";

// Default export/import (no braces, any name)
export default class User { constructor(name) { this.name = name; } }
import User from "./user.js";
```

---

## 18. Error Handling

```javascript
try {
  const data = JSON.parse(badInput);
} catch (error) {
  console.error(error.message);
} finally {
  console.log("Always runs");
}

// Custom errors
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}
```

---

## 19. Performance Optimization

```javascript
// Debounce — run only after user stops (best for: search input)
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Throttle — run at most once per interval (best for: scroll, resize)
function throttle(fn, delay) {
  let last = 0;
  return (...args) => {
    if (Date.now() - last >= delay) { last = Date.now(); fn(...args); }
  };
}
```

---

## 20. Browser Storage & HTTP

```javascript
// localStorage — persists forever; sessionStorage — clears when tab closes
localStorage.setItem("user", JSON.stringify({ name: "Anwar" }));
const user = JSON.parse(localStorage.getItem("user"));

// Fetch API
async function postData(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}
```

---

## 21. Security

**XSS:** Use `textContent` not `innerHTML`, sanitize with DOMPurify, set CSP headers.

**CSRF:** Use CSRF tokens validated server-side, set `SameSite=Strict` on cookies.

---

## 22. Best Practices

- Use `const` by default; `let` only when reassignment is needed; never `var`
- Always use `===` instead of `==`
- Prefer `async/await` over `.then()` chains; always wrap in `try/catch`
- Use `Number.isNaN()` not `isNaN()`
- Use `textContent` over `innerHTML` to prevent XSS
- Debounce/throttle frequent event handlers (scroll, input, resize)
- Avoid global variables; split code into ES modules
