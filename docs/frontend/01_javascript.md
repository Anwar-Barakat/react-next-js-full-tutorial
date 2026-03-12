# JavaScript Fundamentals Guide

## Table of Contents

1. [Compiled vs Interpreted Languages](#1-compiled-vs-interpreted-languages)
2. [What is JavaScript?](#2-what-is-javascript)
3. [Data Types](#3-data-types)
4. [Variables (var, let, const)](#4-variables-var-let-const)
5. [Hoisting](#5-hoisting)
6. [Equality Operators (== vs ===)](#6-equality-operators--vs-)
7. [null vs undefined](#7-null-vs-undefined)
8. [Functions](#8-functions)
9. [Function Types](#9-function-types)
10. [Advanced Function Concepts](#10-advanced-function-concepts)
11. [Objects](#11-objects)
12. [Arrays & Iteration](#12-arrays--iteration)
13. [Spread Operator & Destructuring](#13-spread-operator--destructuring)
14. [Asynchronous JavaScript](#14-asynchronous-javascript)
15. [Event Loop & Task Queues](#15-event-loop--task-queues)
16. [Promises & Async/Await](#16-promises--asyncawait)
17. [DOM Manipulation](#17-dom-manipulation)
18. [Prototypal Inheritance](#18-prototypal-inheritance)
19. [Events](#19-events)
20. [Array Methods](#20-array-methods)
21. [Performance Optimization](#21-performance-optimization)
22. [Browser Storage](#22-browser-storage)
23. [HTTP Requests](#23-http-requests)
24. [ES6+ Features](#24-es6-features)
25. [Security](#25-security)
26. [Modules](#26-modules)
27. [Error Handling](#27-error-handling)
28. [Scope & Closures](#28-scope--closures)
29. [Type Coercion](#29-type-coercion)
30. [Best Practices](#30-best-practices)

---

## 1. Compiled vs Interpreted Languages

- **Compiled** — code converted to machine code BEFORE running (C, C++, Rust, Go). Fast, errors caught at compile time, produces binary.
- **Interpreted** — code executed line-by-line at runtime (JavaScript, Python, PHP). Flexible, platform-independent, errors at runtime.
- Modern JS engines (V8) use JIT compilation to bridge the speed gap.

---

## 2. What is JavaScript?

High-level, interpreted, single-threaded, dynamically typed, multi-paradigm language.

- **Runs in:** Browser (V8, SpiderMonkey), Server (Node.js), Mobile (React Native), Desktop (Electron).
- **Can do:** DOM manipulation, event handling, HTTP requests, local storage, calculations.

---

## 3. Data Types

### Primitive Types

Stored directly in memory. Copied by value. Immutable.

- **String** — Text data (e.g., "Hello", 'World')
- **Number** — Integers and decimals (e.g., 42, 3.14)
- **Boolean** — True or false values (e.g., true, false)
- **Undefined** — Variable declared but not assigned (e.g., let x; // undefined)
- **Null** — Intentional absence of value (e.g., let y = null;)
- **Symbol** — Unique identifier, ES6+ (e.g., Symbol('id'))
- **BigInt** — Very large integers, ES11+ (e.g., 123n)

---

### Reference Types (Objects)

Stored as a reference (pointer). Copied by reference. Mutable.

**Types:**
- Object (key-value pairs)
- Array (ordered collection)
- Function (callable object)
- Date (date/time)
- RegExp (pattern matching)
- Map/Set (collections)

```javascript
let obj1 = { name: "Anwar" };
let obj2 = obj1;  // Copy reference, not the object

obj2.name = "Mohammed";
console.log(obj1.name);  // "Mohammed" - same object!
```

- **Primitive** — stores value, copies value, compares value, immutable.
- **Reference** — stores address, copies reference, compares address, mutable.

---

### undefined vs not defined

- **undefined** — Variable declared, no value (e.g., let x; console.log(x); // undefined)
- **not defined** — Variable not declared at all (e.g., console.log(y); // ReferenceError)

---

## 4. Variables (var, let, const)

### var - Function Scope

Function-scoped, can be redeclared, hoisted as `undefined`.

```javascript
function test() {
  var a = 5;
  console.log(a);  // ✅ 5
}
console.log(a);  // ❌ ReferenceError: a is not defined
```

**var ignores block scope:**

```javascript
function testBlock() {
  if (true) {
    var b = 10;
  }
  console.log(b);  // ✅ 10 - still visible outside if block!
}
```

---

### let - Block Scope

Block-scoped, cannot be redeclared, hoisted but not initialized (temporal dead zone).

```javascript
function testLet() {
  if (true) {
    let c = 15;
    console.log(c);  // ✅ 15
  }
  console.log(c);  // ❌ ReferenceError: c is not defined
}
```

---

### const - Block Scope + Immutable Binding

Same as `let` but cannot be reassigned. Must be initialized. The binding is constant, not the value.

```javascript
const obj = { name: "Anwar" };
obj.name = "Ali";  // ✅ Allowed - modifying property
obj = {};  // ❌ Error - reassigning variable
```

**Best practice:** Default to `const`. Use `let` when reassignment is needed. Never use `var`.

---

## 5. Hoisting

JavaScript moves declarations to the top of their scope during compilation. Initializations stay in place.

### var Hoisting

```javascript
console.log(x);  // undefined (not an error)
var x = 5;
console.log(x);  // 5

// What JavaScript actually does:
var x;  // Declaration hoisted, initialized to undefined
console.log(x);  // undefined
x = 5;  // Assignment stays in place
console.log(x);  // 5
```

---

### let/const Hoisting (Temporal Dead Zone)

```javascript
console.log(y);  // ❌ ReferenceError: Cannot access 'y' before initialization
let y = 10;

// What JavaScript does:
// let y;  // Hoisted but NOT initialized (temporal dead zone)
// console.log(y);  // Error - accessing before declaration
// y = 10;
```

**Temporal Dead Zone (TDZ):** The period between entering scope and variable declaration where the variable exists but cannot be accessed.

---

### Function Hoisting

```javascript
// Function declaration - fully hoisted
sayHello();  // ✅ "Hello!" - works before definition

function sayHello() {
  console.log("Hello!");
}

// Function expression - NOT hoisted
sayBye();  // ❌ TypeError: sayBye is not a function

var sayBye = function() {
  console.log("Bye!");
};
```

Function declarations are fully hoisted. Function expressions are not.

---

## 6. Equality Operators (== vs ===)

### == (Loose Equality)

Compares values after type coercion.

```javascript
5 == "5"       // true - string "5" converted to number 5
0 == false     // true - false converted to 0
null == undefined  // true - special case
"" == 0        // true - empty string converted to 0
```

---

### === (Strict Equality)

Compares both value AND type without coercion.

```javascript
5 === "5"      // false - different types
0 === false    // false - different types
null === undefined  // false - different types
5 === 5        // true - same type and value
```

**Best practice:** Always use === to avoid unexpected behavior.

---

### Comparison Table

- **5 == "5"** — == Result: true; === Result: false (type coercion vs strict)
- **0 == false** — == Result: true; === Result: false (false converts to 0)
- **null == undefined** — == Result: true; === Result: false (special case vs strict)
- **[] == false** — == Result: true; === Result: false ([] converts to "" converts to 0)
- **"0" == 0** — == Result: true; === Result: false ("0" converts to 0)

---

## 7. null vs undefined

### undefined

**Definition:** Variable declared but not assigned a value.

**When it occurs:**
- Variable declared without initialization
- Function with no return statement
- Accessing non-existent object property
- Function parameter not provided

```javascript
let x;
console.log(x);  // undefined

function test() {}
console.log(test());  // undefined

const obj = {};
console.log(obj.name);  // undefined
```

---

### null

**Definition:** Intentional absence of value, must be explicitly assigned.

**Use cases:**
- Reset a variable
- Indicate "no object"
- API returns null for missing data

```javascript
let user = null;  // Explicitly no user
```

---

### Comparison

- **Type** — undefined: "undefined"; null: "object" (JavaScript quirk)
- **Meaning** — undefined: Unintentional absence; null: Intentional absence
- **Assignment** — undefined: Automatic by JavaScript; null: Manual by programmer
- **Default value** — undefined: Yes (uninitialized vars); null: No (must assign)

**JavaScript quirk:**

```javascript
typeof undefined  // "undefined"
typeof null       // "object" - historical bug in JavaScript
```

---

## 8. Functions

### Function Declaration

```javascript
function greet(name) {
  return `Hello, ${name}!`;
}

greet("Anwar");  // "Hello, Anwar!"
```

Hoisted — can call before definition.

---

### Function Expression

```javascript
const greet = function(name) {
  return `Hello, ${name}!`;
};

greet("Anwar");  // "Hello, Anwar!"
```

NOT hoisted — must define before calling.

---

### Arrow Functions (ES6+)

```javascript
const greet = (name) => {
  return `Hello, ${name}!`;
};

// Shorter syntax (implicit return):
const greet = name => `Hello, ${name}!`;
```

Shorter syntax, no `this` binding (inherits from parent), no `arguments` object.

---

### Default Parameters

```javascript
function greet(name = "Guest") {
  return `Hello, ${name}!`;
}

greet();         // "Hello, Guest!"
greet("Anwar");  // "Hello, Anwar!"
```

---

### Rest Parameters

```javascript
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

sum(1, 2, 3);     // 6
sum(1, 2, 3, 4, 5);  // 15
```

Collects multiple arguments into an array. Must be last parameter.

---

## 9. Function Types

### Declaration vs Expression Hoisting

- **Hoisting** — Declaration: Fully hoisted; Expression: Variable hoisted, not function
- **Call before def** — Declaration: Yes; Expression: No (error)
- **Name** — Declaration: Required; Expression: Optional
- **Best for** — Declaration: Top-level functions; Expression: Callbacks, methods

**Function Expression with var:**

```javascript
console.log(f);  // undefined (variable hoisted)
f();  // ❌ TypeError: f is not a function

var f = function() {
  console.log("Hello");
};
```

**Function Expression with let/const:**

```javascript
f();  // ❌ ReferenceError: Cannot access 'f' before initialization

const f = function() {
  console.log("Hello");
};
```

---

## 10. Advanced Function Concepts

### Callback Functions

A function passed as an argument to another function, called later.

```javascript
function processData(data, callback) {
  const result = data * 2;
  callback(result);
}

processData(5, function(result) {
  console.log(result);  // 10
});
```

---

### Closures

A function that remembers variables from its outer scope, even after the outer function has returned.

```javascript
function createCounter() {
  let count = 0;  // Private variable

  return function() {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter());  // 1
console.log(counter());  // 2
console.log(counter());  // 3
```

**Use cases:** data privacy, factory functions, event handlers, memoization.

---

### Higher-Order Functions

Takes a function as argument OR returns a function.

```javascript
// Takes function as argument:
function repeat(n, action) {
  for (let i = 0; i < n; i++) {
    action(i);
  }
}

repeat(3, console.log);  // 0, 1, 2

// Returns a function:
function multiplyBy(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = multiplyBy(2);
console.log(double(5));  // 10
```

**Examples:** map, filter, reduce, forEach, setTimeout

---

### Pure Functions

Same input = same output, no side effects. Predictable, testable, cacheable.

```javascript
// Pure function:
function add(a, b) {
  return a + b;
}

// Impure function (side effect):
let total = 0;
function addToTotal(n) {
  total += n;  // Modifies external state
  return total;
}
```

---

### Function Composition

Output of one function becomes input of another.

```javascript
const add = x => x + 1;
const multiply = x => x * 2;

// Manual composition:
const result = multiply(add(5));  // (5 + 1) * 2 = 12

// Composition function:
const compose = (f, g) => x => f(g(x));
const addThenMultiply = compose(multiply, add);
console.log(addThenMultiply(5));  // 12
```

---

## 11. Objects

```javascript
const user = {
  name: "Anwar",
  age: 30,
  isActive: true
};
```

---

### Accessing Properties

```javascript
console.log(user.name);  // "Anwar"
user.age = 31;
```

**Bracket notation** (dynamic keys, special characters):

```javascript
const key = "name";
console.log(user[key]);  // "Anwar"

const person = {
  "first name": "Anwar",
  "last-name": "Barakat"
};
console.log(person["first name"]);  // "Anwar"
```

---

### JSON

Text format for data transfer. Used in APIs, localStorage, config files.

- `JSON.parse('{"name":"Anwar"}')` — string → object.
- `JSON.stringify({name:"Anwar"})` — object → string.

---

### Object Copying

```javascript
const obj1 = { name: "Anwar" };
const obj2 = obj1;  // Same object!
obj2.name = "Ali";
console.log(obj1.name);  // "Ali" - both changed
```

**Solutions:**

- **Spread operator `{...obj}`** — Shallow copy, nested objects are shared
- **Object.assign({}, obj)** — Shallow copy, nested objects are shared
- **JSON.parse(JSON.stringify(obj))** — Deep copy, nested objects are copied
- **structuredClone(obj)** — Deep copy, nested objects are copied

```javascript
// Shallow copy:
const obj2 = { ...obj1 };

// Deep copy:
const obj3 = JSON.parse(JSON.stringify(obj1));
const obj4 = structuredClone(obj1);  // Modern method
```

---

## 12. Arrays & Iteration

### for...in vs for...of

**for...in** - Iterates over object keys (property names).

```javascript
const obj = { a: 1, b: 2, c: 3 };
for (let key in obj) {
  console.log(key);  // "a", "b", "c"
  console.log(obj[key]);  // 1, 2, 3
}
```

**for...of** - Iterates over iterable values (arrays, strings, Map, Set).

```javascript
const arr = [10, 20, 30];
for (let value of arr) {
  console.log(value);  // 10, 20, 30
}
```

**Comparison:**

- **Purpose** — for...in: Object keys; for...of: Iterable values
- **Works with** — for...in: Objects; for...of: Arrays, strings, Map, Set
- **Returns** — for...in: Keys/indices; for...of: Values

---

### Common Array Methods

**Transforming:**

```javascript
// map() - Transform each element, return new array
const doubled = [1, 2, 3].map(x => x * 2);  // [2, 4, 6]

// filter() - Keep elements that pass test
const evens = [1, 2, 3, 4].filter(x => x % 2 === 0);  // [2, 4]

// reduce() - Reduce to single value
const sum = [1, 2, 3].reduce((acc, x) => acc + x, 0);  // 6
```

**Searching:**

```javascript
// find() - First element that matches
const found = [1, 2, 3].find(x => x > 1);  // 2

// findIndex() - Index of first match
const index = [1, 2, 3].findIndex(x => x > 1);  // 1

// includes() - Check if value exists
[1, 2, 3].includes(2);  // true
```

**Flattening:**

```javascript
// flat() - Flatten nested arrays
const nested = [1, [2, [3, 4]]];
nested.flat();      // [1, 2, [3, 4]]
nested.flat(2);     // [1, 2, 3, 4]
nested.flat(Infinity);  // [1, 2, 3, 4]

// flatMap() - Map + flatten
[1, 2].flatMap(x => [x, x * 2]);  // [1, 2, 2, 4]
```

---

### Set - Unique Values

**Set** - A collection that stores unique values (no duplicates).

```javascript
const numbers = [1, 2, 2, 3, 3, 3];
const unique = [...new Set(numbers)];  // [1, 2, 3]

const set = new Set([1, 2, 3]);
set.add(4);      // Add value
set.has(2);      // true
set.delete(2);   // Remove value
set.size;        // 3
```

**Use cases:**
- Remove duplicates from array
- Check membership efficiently
- Store unique items

---

## 13. Spread Operator & Destructuring

### Spread Operator (...)

**Definition:** Splits an array/object into individual elements.

**Arrays:**

```javascript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// Copy array:
const copy = [...arr1];

// Merge arrays:
const merged = [...arr1, ...arr2];  // [1, 2, 3, 4, 5, 6]

// Pass as function arguments:
Math.max(...arr1);  // 3
```

**Objects:**

```javascript
const obj1 = { a: 1, b: 2 };
const obj2 = { c: 3 };

// Copy object:
const copy = { ...obj1 };

// Merge objects:
const merged = { ...obj1, ...obj2 };  // { a: 1, b: 2, c: 3 }

// Override properties:
const updated = { ...obj1, b: 99 };  // { a: 1, b: 99 }
```

---

### Destructuring

**Definition:** Extract values from arrays/objects into variables.

**Array destructuring:**

```javascript
const [first, second, ...rest] = [1, 2, 3, 4, 5];
console.log(first);   // 1
console.log(second);  // 2
console.log(rest);    // [3, 4, 5]

// Skip elements:
const [a, , c] = [1, 2, 3];
console.log(c);  // 3

// Default values:
const [x = 0, y = 0] = [1];
console.log(y);  // 0
```

**Object destructuring:**

```javascript
const user = { name: "Anwar", age: 30, city: "NYC" };

// Extract properties:
const { name, age } = user;
console.log(name);  // "Anwar"

// Rename variables:
const { name: userName } = user;
console.log(userName);  // "Anwar"

// Default values:
const { country = "USA" } = user;
console.log(country);  // "USA"

// Rest properties:
const { name, ...rest } = user;
console.log(rest);  // { age: 30, city: "NYC" }
```

---

## 14. Asynchronous JavaScript

### Synchronous vs Asynchronous

**Synchronous:** Code executes line by line, blocking until complete.

```javascript
console.log("A");
console.log("B");  // Waits for A to finish
console.log("C");  // Waits for B to finish
// Output: A, B, C
```

**Asynchronous:** Code can execute without blocking, allowing other code to run.

```javascript
console.log("A");
setTimeout(() => console.log("B"), 0);
console.log("C");
// Output: A, C, B
```

JavaScript is single-threaded but uses the event loop + Web APIs (setTimeout, fetch) to handle async operations without blocking.

---

**PHP vs JS:** PHP spawns a process per request (blocking). Node.js handles many requests in one process (non-blocking event loop).

---

## 15. Event Loop & Task Queues

### Three Main Parts

**1. Call Stack** — where synchronous code runs (LIFO).

```javascript
function third() { console.log("3"); }
function second() { third(); }
function first() { second(); }
first();

// Call stack:
// third()
// second()
// first()
```

**2. Web APIs** — browser handles async ops (setTimeout, fetch, DOM events).

**3. Queues:**
- **Microtask Queue** — Promises, async/await (HIGH priority).
- **Macrotask Queue** — setTimeout, setInterval, DOM events (LOW priority).

---

### How Event Loop Works

```
1. Run synchronous code (call stack)
2. If async operation → send to Web API
3. Web API completes → callback goes to queue
4. Event loop checks: Is call stack empty?
   → Yes: Take next task from queue
   → No: Wait
5. Microtasks run BEFORE macrotasks
```

**Example:**

```javascript
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");

// Output: A, D, C, B
```

**Execution order:**

```
1. console.log("A") → Call stack → Output: A
2. setTimeout → Web API (scheduled)
3. Promise.resolve → Microtask queue (scheduled)
4. console.log("D") → Call stack → Output: D
5. Call stack empty → Check microtask queue
6. Run Promise callback → Output: C
7. Check macrotask queue → Run setTimeout → Output: B
```

---

### Microtasks vs Macrotasks

- **Microtasks** — HIGH priority. Examples: Promises, async/await, queueMicrotask. Run after current code, before macrotasks
- **Macrotasks** — LOW priority. Examples: setTimeout, setInterval, DOM events. Run after microtasks

Microtasks always drain before the next macrotask runs.

---

## 16. Promises & Async/Await

### Promises

Three states: **pending**, **fulfilled**, **rejected**.

```javascript
const promise = new Promise((resolve, reject) => {
  // Async operation
  if (success) {
    resolve(value);  // Fulfill
  } else {
    reject(error);   // Reject
  }
});
```

```javascript
promise
  .then(result => {
    console.log("Success:", result);
  })
  .catch(error => {
    console.log("Error:", error);
  })
  .finally(() => {
    console.log("Cleanup");  // Always runs
  });
```

---

### Promise Chaining

```javascript
fetch("/api/user")
  .then(response => response.json())
  .then(user => fetch(`/api/posts/${user.id}`))
  .then(response => response.json())
  .then(posts => console.log(posts))
  .catch(error => console.error(error));
```

---

### Promise Methods

**Promise.all()** — wait for all, fail if any fails.

```javascript
const p1 = fetch("/api/users");
const p2 = fetch("/api/posts");

Promise.all([p1, p2])
  .then(([users, posts]) => {
    console.log("Both loaded!");
  })
  .catch(error => {
    console.log("At least one failed");
  });
```

**Promise.race()** — first to settle wins.

```javascript
Promise.race([
  fetch("/api/data"),
  new Promise((_, reject) => setTimeout(() => reject("Timeout"), 5000))
])
  .then(data => console.log("Got data:", data))
  .catch(error => console.log("Error or timeout:", error));
```

**Promise.allSettled()** — wait for all, get results even if some fail.

```javascript
Promise.allSettled([p1, p2])
  .then(results => {
    results.forEach(result => {
      if (result.status === "fulfilled") {
        console.log("Success:", result.value);
      } else {
        console.log("Failed:", result.reason);
      }
    });
  });
```

**Promise.any()** — first to fulfill wins.

```javascript
Promise.any([p1, p2, p3])
  .then(result => console.log("First success:", result))
  .catch(error => console.log("All failed"));
```

---

### Async/Await

Syntactic sugar for Promises. `async` returns a Promise, `await` pauses until it resolves.

```javascript
// Promise version:
function getData() {
  return fetch("/api/user")
    .then(response => response.json())
    .then(user => {
      console.log(user);
      return user;
    })
    .catch(error => console.error(error));
}

// Async/await version:
async function getData() {
  try {
    const response = await fetch("/api/user");
    const user = await response.json();
    console.log(user);
    return user;
  } catch (error) {
    console.error(error);
  }
}
```


---

## 17. DOM Manipulation

Tree of objects representing the HTML document.

```
document
  └── html
      ├── head
      │   └── title
      └── body
          ├── div
          └── p
```

---

### Selecting Elements

```javascript
// By ID:
const el = document.getElementById("myId");

// By class (returns NodeList):
const els = document.getElementsByClassName("myClass");

// By tag (returns NodeList):
const divs = document.getElementsByTagName("div");

// Query selector (first match):
const el = document.querySelector(".myClass");

// Query selector all (returns NodeList):
const els = document.querySelectorAll(".myClass");
```

---

### Creating & Adding Elements

```javascript
// Create element:
const div = document.createElement("div");

// Set content:
div.textContent = "Hello";  // Text only (safe)
div.innerHTML = "<p>Hello</p>";  // HTML (XSS risk)

// Set attributes:
div.id = "myDiv";
div.className = "container";
div.setAttribute("data-id", "123");

// Add to DOM:
document.body.appendChild(div);  // Add as last child
parent.insertBefore(div, referenceNode);  // Add before reference
parent.prepend(div);  // Add as first child
parent.append(div);   // Add as last child
```

---

### Modifying Elements

```javascript
// Change content:
el.textContent = "New text";
el.innerHTML = "<strong>Bold</strong>";

// Change styles:
el.style.color = "red";
el.style.backgroundColor = "blue";

// Change classes:
el.classList.add("active");
el.classList.remove("hidden");
el.classList.toggle("visible");
el.classList.contains("active");  // true/false

// Change attributes:
el.setAttribute("href", "https://example.com");
el.getAttribute("href");
el.removeAttribute("href");
```

---

### Removing Elements

```javascript
// Remove element:
el.remove();  // Modern

// Remove child:
parent.removeChild(child);  // Legacy
```

---

## 18. Prototypal Inheritance

Every object has a hidden link to a prototype. Properties/methods are shared through the prototype chain.

### How It Works

```javascript
const user = { name: "Anwar" };
console.log(user.toString());  // Works! But where is toString()?

// user doesn't have toString() method
// JavaScript looks in user.__proto__ (Object.prototype)
// Finds toString() there and uses it
```

**Prototype chain:**

```
user → user.__proto__ (Object.prototype) → null
```

If property not found on object → look in prototype → look in prototype's prototype → until null.

---

### __proto__ vs prototype

**__proto__** - Lives on actual objects, points to the prototype.

```javascript
const user = { name: "Anwar" };
console.log(user.__proto__ === Object.prototype);  // true
```

**prototype** - Lives on constructor functions, defines the blueprint.

```javascript
function User(name) {
  this.name = name;
}

User.prototype.greet = function() {
  return `Hello, ${this.name}`;
};

const user1 = new User("Anwar");
console.log(user1.greet());  // "Hello, Anwar"
```

**Relationship:**

```
Constructor Function.prototype → Object with shared methods
Instance.__proto__ → Points to Constructor Function.prototype
```

---

### Prototype Chain Example

```javascript
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  return `${this.name} makes a sound`;
};

function Dog(name, breed) {
  Animal.call(this, name);  // Call parent constructor
  this.breed = breed;
}

// Inherit from Animal:
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

// Add Dog-specific method:
Dog.prototype.bark = function() {
  return `${this.name} barks!`;
};

const dog = new Dog("Rex", "Labrador");
console.log(dog.speak());  // "Rex makes a sound" (inherited)
console.log(dog.bark());   // "Rex barks!" (own method)
```

**Lookup chain:**

```
dog → Dog.prototype → Animal.prototype → Object.prototype → null
```

---

## 19. Events

### onclick vs addEventListener

**onclick** — single handler (overrides previous):

```javascript
const btn = document.getElementById("btn");
btn.onclick = function() {
  console.log("Clicked!");
};

// Overrides previous handler:
btn.onclick = function() {
  console.log("New handler");
};
```

**addEventListener** — multiple handlers (preferred):

```javascript
btn.addEventListener("click", function() {
  console.log("Handler 1");
});

btn.addEventListener("click", function() {
  console.log("Handler 2");
});

// Both handlers run
```

---

### Event Bubbling & Capturing

```
1. Capturing phase: Event travels DOWN from window to target
2. Target phase: Event reaches target element
3. Bubbling phase: Event travels UP from target to window
```

**Example:**

```html
<div id="parent">
  <button id="child">Click me</button>
</div>
```

```javascript
// Bubbling (default):
parent.addEventListener("click", () => console.log("Parent"));
child.addEventListener("click", () => console.log("Child"));

// Click child → Output: "Child", "Parent"

// Capturing (useCapture = true):
parent.addEventListener("click", () => console.log("Parent"), true);
child.addEventListener("click", () => console.log("Child"), true);

// Click child → Output: "Parent", "Child"
```

**Stop propagation:**

```javascript
child.addEventListener("click", (event) => {
  event.stopPropagation();  // Prevents bubbling
  console.log("Child");
});
// Now only "Child" logs, parent doesn't receive event
```

---

## 20. Array Methods

### map() vs forEach()

**forEach()** - Executes function for each element, returns undefined.

```javascript
const numbers = [1, 2, 3];
numbers.forEach(n => console.log(n * 2));  // 2, 4, 6
// Returns: undefined
```

**map()** - Transforms each element, returns new array.

```javascript
const numbers = [1, 2, 3];
const doubled = numbers.map(n => n * 2);  // [2, 4, 6]
// Returns: new array
```

**Comparison:**

- **Returns** — forEach(): undefined; map(): New array
- **Purpose** — forEach(): Side effects; map(): Transform data
- **Chaining** — forEach(): No; map(): Yes
- **Use when** — forEach(): console.log, update DOM; map(): Create new array

---

### reduce() Deep Dive

**reduce()** - Reduces array to a single value by applying a function.

**Syntax:**

```javascript
array.reduce((accumulator, currentValue, index, array) => {
  // Return new accumulator value
}, initialValue);
```

**Examples:**

```javascript
// Sum:
const sum = [1, 2, 3, 4].reduce((acc, n) => acc + n, 0);  // 10

// Max:
const max = [3, 1, 4, 1, 5].reduce((max, n) => n > max ? n : max);  // 5

// Group by property:
const users = [
  { name: "Ali", role: "admin" },
  { name: "Sara", role: "user" },
  { name: "Ahmed", role: "admin" }
];

const grouped = users.reduce((acc, user) => {
  const { role } = user;
  if (!acc[role]) acc[role] = [];
  acc[role].push(user);
  return acc;
}, {});

// Result: { admin: [{...}, {...}], user: [{...}] }

// Count occurrences:
const fruits = ["apple", "banana", "apple", "orange", "banana", "apple"];
const counts = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});
// Result: { apple: 3, banana: 2, orange: 1 }
```

---

### String to Array

```javascript
// split():
const str = "hello world";
const words = str.split(" ");  // ["hello", "world"]
const chars = str.split("");   // ["h", "e", "l", "l", "o", " ", "w", ...]

// Array.from():
const chars = Array.from("hello");  // ["h", "e", "l", "l", "o"]

// Spread operator:
const chars = [..."hello"];  // ["h", "e", "l", "l", "o"]
```

---

### Array Max/Min

```javascript
const numbers = [3, 1, 4, 1, 5, 9];

// Using Math.max/min with spread:
const max = Math.max(...numbers);  // 9
const min = Math.min(...numbers);  // 1

// Using reduce:
const max = numbers.reduce((max, n) => n > max ? n : max);
const min = numbers.reduce((min, n) => n < min ? n : min);
```

---

## 21. Performance Optimization

### Debouncing

Wait until user stops, then run. Best for: search input.

```javascript
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);  // Cancel previous timer
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Usage:
const searchInput = document.getElementById("search");
const handleSearch = debounce((event) => {
  console.log("Searching for:", event.target.value);
  // API call here
}, 500);

searchInput.addEventListener("input", handleSearch);
```

---

### Throttling

Limit execution to once per time interval. Best for: scroll, resize.

```javascript
function throttle(func, delay) {
  let lastCall = 0;
  return function(...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func.apply(this, args);
    }
  };
}

// Usage:
const handleScroll = throttle(() => {
  console.log("Scrolling...");
}, 200);

window.addEventListener("scroll", handleScroll);
```

---

### Memoization

Cache function results to avoid redundant calculations.

```javascript
function memoize(fn) {
  const cache = {};
  return function(...args) {
    const key = JSON.stringify(args);
    if (key in cache) {
      return cache[key];  // Return cached result
    }
    const result = fn.apply(this, args);
    cache[key] = result;  // Store result
    return result;
  };
}

// Usage:
const expensiveCalculation = (n) => {
  console.log("Calculating...");
  return n * n;
};

const memoized = memoize(expensiveCalculation);
console.log(memoized(5));  // "Calculating..." → 25
console.log(memoized(5));  // 25 (from cache, no calculation)
```

---

### Lazy Loading

Defer loading resources until needed (images, JS bundles, components).

```html
<img src="placeholder.jpg" data-src="actual-image.jpg" class="lazy">

<script>
const lazyImages = document.querySelectorAll('.lazy');

const imageObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.classList.remove('lazy');
      imageObserver.unobserve(img);
    }
  });
});

lazyImages.forEach(img => imageObserver.observe(img));
</script>
```

---

## 22. Browser Storage

- **localStorage** — persists forever, shared across tabs.
- **sessionStorage** — cleared when tab closes, single tab only.
- Both store strings only, ~5-10MB limit.

```javascript
// Set:
localStorage.setItem("user", "Anwar");
sessionStorage.setItem("token", "abc123");

// Get:
const user = localStorage.getItem("user");  // "Anwar"

// Remove:
localStorage.removeItem("user");

// Clear all:
localStorage.clear();

// Store objects (convert to JSON):
const user = { name: "Anwar", age: 30 };
localStorage.setItem("user", JSON.stringify(user));

// Retrieve objects:
const user = JSON.parse(localStorage.getItem("user"));
```


---

## 23. HTTP Requests

### XMLHttpRequest (Legacy)

```javascript
const xhr = new XMLHttpRequest();
xhr.open("GET", "/api/users");
xhr.onload = function() {
  if (xhr.status === 200) {
    console.log(JSON.parse(xhr.responseText));
  }
};
xhr.send();
```

---

### Fetch API (Modern)

```javascript
// GET request:
fetch("/api/users")
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then(users => console.log(users))
  .catch(error => console.error("Error:", error));

// POST request:
fetch("/api/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ name: "Anwar", age: 30 })
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error("Error:", error));

// Async/await:
async function getUsers() {
  try {
    const response = await fetch("/api/users");
    if (!response.ok) throw new Error("Failed to fetch");
    const users = await response.json();
    console.log(users);
  } catch (error) {
    console.error("Error:", error);
  }
}
```

**Response methods:**
- `response.json()` - Parse JSON
- `response.text()` - Get as text
- `response.blob()` - Get as binary data
- `response.formData()` - Get as FormData

---

### AJAX

Async HTTP requests without page reload. Originally XML, now JSON is standard.

---

## 24. ES6+ Features

### Template Literals

Backtick strings with interpolation and multi-line support.

```javascript
// Variable interpolation:
const name = "Anwar";
const greeting = `Hello, ${name}!`;  // "Hello, Anwar!"

// Expressions:
const price = 10;
const total = `Total: $${price * 2}`;  // "Total: $20"

// Multi-line:
const html = `
  <div>
    <h1>${name}</h1>
    <p>Welcome!</p>
  </div>
`;

// Function calls:
const message = `Result: ${calculateTotal()}`;
```

---

### Optional Chaining (?.)

Safely access nested properties — returns `undefined` instead of throwing.

```javascript
const user = {
  name: "Anwar",
  address: {
    city: "NYC"
  }
};

// Without optional chaining:
const zip = user.address && user.address.zip;  // undefined

// With optional chaining:
const zip = user.address?.zip;  // undefined (no error)
const country = user.address?.country?.code;  // undefined

// Works with methods:
const result = user.getName?.();  // undefined if getName doesn't exist

// Works with arrays:
const first = users?.[0];  // undefined if users is null/undefined
```

---

### Nullish Coalescing (??)

Default only for `null`/`undefined` (not `0`, `""`, `false`).

```javascript
// Problem with OR (||):
const count = 0;
const result = count || 10;  // 10 (treats 0 as falsy)

// Nullish coalescing (??):
const result = count ?? 10;  // 0 (only null/undefined get default)

const name = "";
const displayName = name || "Guest";   // "Guest" (|| treats "" as falsy)
const displayName = name ?? "Guest";   // "" (?? only checks null/undefined)
```

**Comparison:**

- **\|\|** — Provides default for all falsy values (0, "", false, null, undefined). Example (x = 0): x \|\| 10 results in 10
- **??** — Provides default for only null/undefined. Example (x = 0): x ?? 10 results in 0

---

### Logical Operators

**OR (||)** - Returns first truthy value, or last value if all falsy.

```javascript
const a = "" || "default";  // "default"
const b = 0 || 5 || 10;     // 5 (first truthy)
const c = false || null;    // null (all falsy, return last)
```

**AND (&&)** - Returns first falsy value, or last value if all truthy.

```javascript
const a = true && "yes";     // "yes" (all truthy, return last)
const b = 5 && 0 && 10;      // 0 (first falsy)
const c = "hello" && null;   // null (first falsy)

// Common pattern (conditional execution):
user && console.log(user.name);  // Only logs if user exists
```

---

## 25. Security

### XSS (Cross-Site Scripting)

**XSS** - Injection attack where malicious scripts are injected into websites.

**How it happens:**
- User input contains `<script>` tags
- Input is inserted into HTML without sanitization
- Script executes in victim's browser

**Example:**

```javascript
// Vulnerable:
const userInput = '<script>alert("XSS")</script>';
element.innerHTML = userInput;  // Script executes!

// Safe:
element.textContent = userInput;  // Treated as text, not HTML
```

**Prevention:**
- **Escape HTML** - Convert `<` to `&lt;`, `>` to `&gt;`
- **Use textContent** - Instead of innerHTML when possible
- **Validate input** - Reject/sanitize dangerous characters
- **Content Security Policy** - HTTP header restricting script sources
- **Sanitize libraries** - DOMPurify, sanitize-html

---

### CSRF (Cross-Site Request Forgery)

**CSRF** - Attack forcing authenticated users to execute unwanted actions.

**How it happens:**
```
1. User logs into bank.com (gets auth cookie)
2. User visits evil.com (while still logged in)
3. evil.com contains: <img src="https://bank.com/transfer?to=attacker&amount=1000">
4. Browser sends request with user's auth cookie
5. Bank transfers money (thinks it's legitimate request)
```

**Prevention:**
- **CSRF tokens** - Unique token per request, validated server-side
- **SameSite cookies** - Cookie not sent on cross-site requests
- **Verify origin** - Check Referer/Origin headers
- **Re-authentication** - Require password for sensitive actions

---

## 26. Modules

### Named Exports

```javascript
// math.js
export const PI = 3.14159;
export function add(a, b) {
  return a + b;
}
export function subtract(a, b) {
  return a - b;
}

// app.js
import { PI, add, subtract } from "./math.js";
console.log(add(5, 3));  // 8

// Import all as namespace:
import * as Math from "./math.js";
console.log(Math.add(5, 3));  // 8

// Rename imports:
import { add as sum } from "./math.js";
console.log(sum(5, 3));  // 8
```

---

### Default Exports

```javascript
// user.js
export default class User {
  constructor(name) {
    this.name = name;
  }
}

// app.js
import User from "./user.js";  // No braces, any name
const user = new User("Anwar");

// Can combine with named exports:
// user.js
export default class User { }
export const ROLE_ADMIN = "admin";

// app.js
import User, { ROLE_ADMIN } from "./user.js";
```

---

## 27. Error Handling

### try...catch...finally

Handle errors without stopping execution.

```javascript
try {
  // Code that might throw error
  const data = JSON.parse(invalidJSON);
  console.log(data);
} catch (error) {
  // Runs if error occurs
  console.error("Error:", error.message);
} finally {
  // Always runs (optional)
  console.log("Cleanup");
}
```

---

### throw vs return

**return** — normal exit:

```javascript
function divide(a, b) {
  if (b === 0) {
    return null;  // Return null for invalid input
  }
  return a / b;
}

const result = divide(10, 0);  // null
```

**throw** — raises an error, jumps to catch:

```javascript
function divide(a, b) {
  if (b === 0) {
    throw new Error("Division by zero");  // Throw error
  }
  return a / b;
}

try {
  const result = divide(10, 0);  // Throws error
} catch (error) {
  console.error(error.message);  // "Division by zero"
}
```

---

### Custom Errors

```javascript
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

function validateAge(age) {
  if (age < 0) {
    throw new ValidationError("Age cannot be negative");
  }
  if (age > 150) {
    throw new ValidationError("Age cannot exceed 150");
  }
  return true;
}

try {
  validateAge(-5);
} catch (error) {
  if (error instanceof ValidationError) {
    console.log("Validation failed:", error.message);
  } else {
    console.log("Unknown error:", error);
  }
}
```

---

## 28. Scope & Closures

### Scope Types

**Global scope** - Variables accessible everywhere.

```javascript
const globalVar = "I'm global";

function test() {
  console.log(globalVar);  // Accessible
}
```

**Function scope** - Variables accessible only within function.

```javascript
function test() {
  const functionVar = "I'm local";
  console.log(functionVar);  // ✅
}
console.log(functionVar);  // ❌ ReferenceError
```

**Block scope** - Variables (let/const) accessible only within block {}.

```javascript
if (true) {
  const blockVar = "I'm in block";
  console.log(blockVar);  // ✅
}
console.log(blockVar);  // ❌ ReferenceError
```

---

### Lexical Scope

**Lexical scope** - Inner functions have access to outer function variables.

**Key point:** Scope is determined by where functions are DEFINED, not where they're CALLED.

```javascript
function outer() {
  const outerVar = "outer";

  function inner() {
    console.log(outerVar);  // Access outer variable
  }

  inner();  // "outer"
}
```

**Scope chain:** JavaScript looks for variables starting from current scope, then outer scopes.

```javascript
const global = "global";

function outer() {
  const outer = "outer";

  function inner() {
    const inner = "inner";
    console.log(inner);   // inner scope
    console.log(outer);   // outer scope
    console.log(global);  // global scope
  }

  inner();
}
```

---

### Closures (Detailed)

**Closure** - A function that remembers variables from its outer scope, even after outer function has returned.

**Use case 1: Private variables**

```javascript
function createCounter() {
  let count = 0;  // Private variable

  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getCount() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.increment());  // 1
console.log(counter.increment());  // 2
console.log(counter.getCount());   // 2
console.log(counter.count);        // undefined (private!)
```

**Use case 2: Event handlers**

```javascript
function attachHandler(id) {
  const element = document.getElementById(id);
  const color = "red";

  element.addEventListener("click", function() {
    this.style.color = color;  // Closure remembers 'color'
  });
}
```

**Use case 3: Factory functions**

```javascript
function createMultiplier(factor) {
  return function(number) {
    return number * factor;  // Closure remembers 'factor'
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15
```

**Common pitfall (loops):**

```javascript
// Problem:
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i);  // 3, 3, 3 (var is function-scoped)
  }, 100);
}

// Solution 1 (let - block-scoped):
for (let i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i);  // 0, 1, 2
  }, 100);
}

// Solution 2 (closure):
for (var i = 0; i < 3; i++) {
  (function(j) {
    setTimeout(function() {
      console.log(j);  // 0, 1, 2
    }, 100);
  })(i);
}
```

---

## 29. Type Coercion

**Type coercion** - Automatic or manual conversion of values from one type to another.

---

### Implicit Coercion

**Definition:** JavaScript automatically converts types.

```javascript
// String coercion (+ with string):
"5" + 3       // "53" (number → string)
"Hello" + 1   // "Hello1"

// Number coercion (math operators):
"5" - 2       // 3 (string → number)
"10" * "2"    // 20
"10" / "2"    // 5

// Boolean coercion (if, while, logical operators):
if ("hello") { }  // true (truthy)
if (0) { }        // false (falsy)
```

---

### Explicit Coercion

**Definition:** Manual conversion using functions.

```javascript
// To string:
String(123)        // "123"
(123).toString()   // "123"
123 + ""           // "123"

// To number:
Number("123")      // 123
parseInt("123")    // 123
parseFloat("12.5") // 12.5
+"123"             // 123

// To boolean:
Boolean(1)         // true
Boolean(0)         // false
!!1                // true (double negation)
```

---

### Truthy vs Falsy

**Falsy values** - Values that coerce to false in boolean context.

- **false** (Boolean) — Literally false
- **0** (Number) — Zero is falsy
- **-0** (Number) — Negative zero is falsy
- **""** (String) — Empty string is falsy
- **null** (Null) — Absence of value
- **undefined** (Undefined) — No value assigned
- **NaN** (Number) — Not a Number

**Truthy values** - Everything else (including "0", "false", [], {}).

```javascript
// Falsy:
if (0) { }           // Doesn't run
if ("") { }          // Doesn't run
if (null) { }        // Doesn't run

// Truthy:
if ("0") { }         // Runs (string with content)
if ("false") { }     // Runs (string with content)
if ([]) { }          // Runs (object)
if ({}) { }          // Runs (object)
```

---

### NaN (Not a Number)

**NaN** - Special value representing invalid number.

```javascript
// How NaN occurs:
parseInt("hello")    // NaN
0 / 0                // NaN
Math.sqrt(-1)        // NaN

// NaN is not equal to itself:
NaN === NaN          // false (unique property!)

// Check for NaN:
Number.isNaN(NaN)    // true (recommended)
isNaN(NaN)           // true
isNaN("hello")       // true (converts to NaN first)
Number.isNaN("hello") // false (doesn't convert)
```

**Best practice:** Use `Number.isNaN()` (doesn't coerce).

---

## 30. Best Practices

### General

- **Use const by default** - Switch to let only when reassignment needed
- **Avoid var** - Use let/const for block scope
- **Use === instead of ==** - Avoid type coercion bugs
- **Use meaningful names** - `getUserData()` not `gd()`
- **Keep functions small** - One responsibility per function
- **Use async/await** - Cleaner than promise chains
- **Handle errors** - Always use try/catch with async code

---

### Performance

- **Avoid global variables** - Pollutes namespace, hard to maintain
- **Cache DOM queries** - Don't query same element repeatedly
- **Use event delegation** - One listener on parent vs many on children
- **Debounce/throttle** - For frequent events (scroll, input, resize)
- **Lazy load** - Load resources when needed
- **Minimize reflows** - Batch DOM changes

---

### Security

- **Validate user input** - Never trust client input
- **Sanitize HTML** - Prevent XSS attacks
- **Use CSRF tokens** - Prevent CSRF attacks
- **HTTPS only** - Encrypt data in transit
- **Content Security Policy** - Restrict resource loading

---

### Code Organization

- **Use modules** - Split code into files
- **Single responsibility** - Each function does one thing
- **DRY (Don't Repeat Yourself)** - Extract repeated code
- **Comment complex logic** - Explain why, not what
- **Consistent formatting** - Use linter (ESLint)

---

- Organize code with modules
