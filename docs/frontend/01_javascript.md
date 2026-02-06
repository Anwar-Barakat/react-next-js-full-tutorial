01. What is the difference between interpreted and compiled languages?

🟣 Compiled Language
    ▫️ Code is converted into machine code BEFORE running.
    ▫️ Uses a compiler (e.g., C, C++, Rust).
    ▫️ Result: fast performance.
    ▫️ Errors found during compilation.
🟣 Interpreted Language
    ▫️ Code is read and executed line-by-line WHILE running.
    ▫️ Uses an interpreter (e.g., JavaScript, Python, PHP).
    ▫️ Result: easier to test/debug but slower than compiled.
    ▫️ Errors show at runtime.

-----------------------------------------

02. What is the Javascript Language?

🟣 JavaScript is a high-level, interpreted programming language.
🟣 Used for creating interactive and dynamic web content.
🟣 Runs in the browser and on servers (Node.js).
🟣 Supports object-oriented, functional, and imperative programming styles.

-----------------------------------------

03. What are data types in JavaScript?

🟣 Primitive types: String, Number, Boolean, Undefined, Null, Symbol, BigInt
    ▫️ Stored directly in memory.
    ▫️ When you copy them, you copy the value itself.
🟣 Non-Primitive, Reference Types or Complex types: Object (includes Arrays, Functions, Dates, Map / Set)
    ▫️ Stored as a reference (pointer) — not the actual data.
    ▫️ When you copy them, you copy the reference, not the value.

************* 🟣🟣🟣 *************
let obj1 = { name: "Anwar" };
let obj2 = obj1;
obj1 does not store the object directly.
It stores a reference (a pointer) to a place in memory where the real object lives.
When you assign obj2 = obj1, you are copying that pointer, not the actual object.
obj1 → points to the object in memory
obj2 → points to the SAME object in memory
If you change the object through either variable:
obj2.name = "Mohammed";
console.log(obj1.name);  // "Mohammed"
Copying the reference means both variables share the same object in memory, so changing one affects the other.
************* 🟣🟣🟣 *************

🟣 JavaScript is dynamically typed (variables can hold any type).
🟣 undefined: Variable declared but not assigned value.
🟣 not defined: Variable not declared at all (ReferenceError).


-----------------------------------------

04. What is the difference between var, let, and const?

🟣 var: Function-scoped, can be redeclared and updated, hoisted.
🟣 let: Block-scoped, can be updated but not redeclared, hoisted but not initialized.
🟣 const: Block-scoped, cannot be updated or redeclared, must be initialized.
🟣 Scope = where a variable lives and where you can use it.
🟣 Think of scope like rooms in a house: 
    ▫️ If you put something in the kitchen, you can only use it inside the kitchen.
    ▫️ If you put something in the house entrance, you can see it from any room.
🟣 var — function scope
    ▫️ If you declare var inside a function, it only exists in that function.
    ▫️ Outside the function, you cannot use it.
    ▫️ function test() { var a = 5; console.log(a); // ✅ 5 } console.log(a);   // ❌ Error: a is not defined
    ▫️ Block scope (ignored)
    ▫️ If you declare var inside a block { } like if or for, it does NOT stay inside the block.
    ▫️ function testBlock() { if (true) { var b = 10; } console.log(b); // ✅ 10 — still visible here }
🟣 let — block scope
    ▫️ If you create a let inside an if, you cannot use it outside the if.   
    ▫️ If you create it inside a loop, you cannot use it outside the loop.   
    ▫️ It stays in its room only.   
🟣 const — block scope + cannot change
    ▫️ const is the same as let (same scope), but with one extra rule: You cannot change the value once created.
    📌 const = block-scoped + read-only

-----------------------------------------

05. What is hoisting in JavaScript?

🟣 Hoisting moves variable and function declarations to the top of their scope.
🟣 Variables declared with var are hoisted and initialized with undefined.
🟣 let and const are hoisted but not initialized (temporal dead zone).
🟣 Function declarations are fully hoisted.

-----------------------------------------

06. What is the difference between == and ===?

🟣 == (loose equality): Compares values after type coercion.
🟣 === (strict equality): Compares both value and type without coercion.
🟣 Always prefer === to avoid unexpected behavior. (null == undefined  // true)

-----------------------------------------

07. What is null vs undefined?

🟣 undefined: Variable declared but not assigned a value.
🟣 null: Intentional absence of value, must be explicitly assigned.
🟣 typeof undefined is "undefined", typeof null is "object" (JavaScript quirk).

-----------------------------------------

08. What is a function in JavaScript?

🟣 A function is a reusable block of code that performs a specific task.
🟣 Can be declared using function declaration, expression, or arrow syntax.
🟣 Functions can accept parameters and return values.
🟣 Default parameters provide default values for function parameters.
🟣 Used when argument is undefined or not provided.

-----------------------------------------

09. What is the difference between function declaration and function expression?

🟣 Function declaration: Hoisted, can be called before definition.
🟣 Function expression: Not hoisted, must be defined before calling.
🟣 When you do something like const f = function() { … } (or let f = …, or var f = …), you are creating a variable (named f) and assigning a function as its value. That is a function expression. 
🟣 In that case, the variable declaration (i.e. “there is a f variable”) is hoisted — but its value (the function) is not hoisted. Meaning: before the assignment line, f exists (depending on var/let/const), but it has no function assigned yet. 
🟣 If you use var f = function() {…}: f is hoisted and initialized to undefined. So if you try to call f() before the assignment, you get a TypeError (because undefined is not a function). 
🟣 If you use let f = function() {…} or const f = function() {…}: the variable f is hoisted at compile-time, but you cannot access it before the line where it’s defined — doing so produces a ReferenceError (because of the “temporal dead zone”).

-----------------------------------------

10. What are arrow, callback, clouser, highter order, pure, composition functions?

🟣 Arrow functions are a shorter syntax for writing functions (ES6+).
🟣 Cannot be used as constructors.
🟣 A callback is simply a function that you pass as an argument to another function — so that the other function can call (“call back”) your function later.
🟣 A closure is a function that remembers the variables around it, even after those variables should normally be gone (A closure remembers its outer variables).
🟣 A higher order function that takes another function as an argument or returns a function.
🟣 A pure function that always returns the same output for the same input. (doesn't modify external state)
🟣 A composition function is combining multiple functions to create a new function (Output of one function becomes input of another.)


-----------------------------------------

11. What is an object in JavaScript?

🟣 An object is a collection of key-value pairs.
🟣 Keys are strings (or Symbols), values can be any data type.
🟣 Dot notation: Use when the property name is a simple word
🟣 Bracket notation: Use when the property name is not simple or is dynamic like (object["first name"])
🟣 JSON.parse() => It takes a JSON string and turns it back into a real JavaScript object.
🟣 JSON.stringify() => It converts a JavaScript object into a JSON string..
🟣 Object Copy => JSON.parse(JSON.stringify(obj))

🟣 for..in → object keys
🟣 for..of → array values / iterable values

************* 🟣🟣🟣 *************
const obj = { a: 1, b: 2 };
for (let key in obj) {
  console.log(key); // "a", "b"
}

const arr = [10, 20, 30];
for (let value of arr) {
  console.log(value); // 10, 20, 30
}
************* 🟣🟣🟣 *************

-----------------------------------------

12. What is the spread operator?

🟣 The spread operator splits the array into individual elements. And It copies the object’s key–value pairs into a new object.
🟣 Used for copying arrays/objects, merging, and passing arguments.

-----------------------------------------

13. What is destructuring?

🟣 Destructuring extracts values from arrays or objects into variables.

-----------------------------------------

14. What is synchronous vs asynchronous code?

🟣 Synchronous: Code executes line by line, blocking until complete.
🟣 Asynchronous: Code can execute without blocking, allowing other code to run.
🟣 JavaScript is single-threaded but can handle async operations.

-----------------------------------------

15. What “Single-Threaded” means ?

🟣 It means JavaScript can execute only one command at a time on one main thread (like a one-lane road).
🟣 Promises & async/await do NOT add extra threads.
🟣 They just allow JavaScript to do other work while waiting, instead of blocking the main thread.
🟣 Each PHP request (like a page load or API call) is handled by one process (or one thread) on the server.
🟣 For enhance main threaded: Use Queues for Background Jobs - Use Laravel Octane
🟣 Laravel Octane is a performance package that makes your Laravel application super fast by keeping it running in memory instead of starting a new PHP process for each request. so Your app is loaded once, and the workers handle multiple requests without restarting.

-----------------------------------------

16. What is a Promise?

🟣 A Promise represents the eventual completion or failure of an async operation.
🟣 Has three states: pending, fulfilled, rejected.
🟣 Provides .then() for success and .catch() for errors.
🟣 async/await is syntactic sugar for working with Promises.
🟣 async functions always return a Promise.
🟣 await pauses execution until Promise resolves.

-----------------------------------------

17. What is the event loop?

🟣 The event loop manages the execution of code, events, and callbacks.
🟣 The event loop is like a traffic controller for JavaScript.
🟣 Because JavaScript is single-threaded, it must follow a system to handle slow tasks without freezing.
🟣 There are 3 main parts:
    ▫️ (A) Call Stack: Where normal code runs (top → bottom).
    ▫️ (B) Web APIs: Browser or Node.js handles (setTimeout, fetch, database calls, DOM Events)
    ▫️ (C) Queues: Where completed async tasks
🟣 How it works: 
    ▫️ Step 1 — JS runs your normal code (Everything goes on the call stack).
    ▫️ Step 2 — If you call an async operation, like setTimeout or fetch → they are sent to Web APIs.
    ▫️ Step 3 — When Web API finishes, it puts the callback into a queue.
    ▫️ Step 4 — Event loop watches: If the call stack is empty → take next task from queue

************* 🟣🟣🟣 *************
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");
// A -> D -> C -> B
1️⃣ Microtasks Queue: like Promises (.then, async/await) 👉 They run BEFORE setTimeout — always.
2️⃣ Macrotasks  Queue: setTimeout, setInterval, DOM events 👉 They run AFTER microtasks.
************* 🟣🟣🟣 *************

-----------------------------------------

18. What is the DOM?

🟣 DOM (Document Object Model) is a programming interface for HTML documents.
🟣 Represents the page structure as a tree of objects.
🟣 JavaScript can manipulate the DOM to change content, structure, and style.
🟣 createElement(): Creates a new element.
🟣 appendChild(): Adds element as last child.
🟣 insertBefore(): Inserts element before a reference node.
🟣 textContent / innerHTML: Sets content of element.

-----------------------------------------

19. What is prototypal inheritance?

🟣 Every JavaScript object has a hidden link to another object called its prototype.
🟣 This prototype provides shared properties and methods to the object.
🟣 Think of it like inheritance: “If the object doesn’t have the property, look at its prototype.”
🟣 Example: const user = { name: "Anwar" }; console.log(user.toString());  👉 You never wrote toString() => Because user inherits from Object.prototype

🟣 The prototype chain is the system JavaScript uses to look up properties and methods when they aren't found on an object directly.
🟣 Think of it like inheritance levels: Searching in the object -> prototype -> Object.proptotype

🟣 __proto__: Lives on the actual object, It is the object’s link to that blueprint
🟣 prototype: Lives on the constructor, It is the blueprint

-----------------------------------------

20. What is the difference between onclick and addEventListener() in JavaScript?

🟣 onclick: Only one function can be attached - Adding a new one removes the old one.
🟣 addEventListener(): You can attach multiple functions to the same event - All of them will run.

-----------------------------------------

21. What is the difference between map() and forEach()?

🟣 map(): Creates and returns a new array with transformed elements.
🟣 forEach(): Executes a function for each element, returns undefined.
🟣 Use map() when you need a new array, forEach() for side effects.

-----------------------------------------

23. What is debouncing and throttling?

🟣 Debouncing: ➡️ Wait until the user stops doing something… THEN run the function.
🟣 If the user keeps triggering the event repeatedly, the function does NOT run until they stop for a moment.
🟣 Throttling: Limits function execution to once per time interval.
🟣 Used to optimize performance for frequent events (scroll, resize, input).

-----------------------------------------

24. What are template literals?

🟣 Template literals use backticks (`) + It is ES6+ Features.
🟣 Support multi-line strings and embedded expressions.
🟣 Optional chaining (?.): Safely access nested properties without errors.
🟣 Nullish coalescing (??): Provides default only for null/undefined (not for 0, "", false).
🟣 OR Operator (||): Returns the first value that is truthy.
🟣 AND operator (&&): Returns the first falsy value, or the last value if all are truthy.


-----------------------------------------

25. What are template literals?

🟣 Template literals use backticks (`) + It is ES6+ Features.
🟣 Support multi-line strings and embedded expressions.

-----------------------------------------

26. What are classes in JavaScript?

🟣 A class is basically a blueprint (template) for creating objects.
🟣 The classes has A constructor — a special method for setting up new objects with initial values. 
🟣 Methods — functions that will belong to every object created by that class. 

-----------------------------------------

27. How do you remove duplicates from an array? 

🟣 A Set is a built-in object that stores unique values — no duplicates allowed.
🟣 Use Set (most common and efficient).
🟣 It can hold any type of value: primitives (numbers, strings), objects, even other Sets.

-----------------------------------------

28. Array notices:  

🟣 A Set is a built-in object that stores unique values — no duplicates allowed.
🟣 A Set can hold any type of value: primitives (numbers, strings), objects, even other Sets.
🟣 Use split() to convert string -> array.
🟣 Use Math.max() with spread operator or reduce(). (Math.max(...numbers) - numbers.reduce((max, n) => n > max ? n : max))
🟣 numbers.flat(): Flattens nested arrays to specified depth (nested.flat(Infinity))
🟣 numbers.flatMap(): Maps and flattens result in one step (numbers.flatMap(x => [x, x * 2]))
🟣 Array reduce(): Can perform complex transformations and aggregations.
const sum = [1, 2, 3].reduce((acc, x) => acc + x, 0); // acc depending on the type of init value type

-----------------------------------------

29. What is try...catch in JavaScript?

🟣 try...catch handles errors without stopping code execution.
🟣 try block contains code that might throw an error.
🟣 catch block executes if an error occurs.
🟣 finally block (optional) always executes regardless of error.

-----------------------------------------

30. What is the difference between throw and return?

🟣 throw: Stops execution and raises an error.
🟣 return: Exits function and returns a value.
🟣 throw can be caught with try...catch.

-----------------------------------------

31. What is scope in JavaScript?

🟣 Scope determines the accessibility of variables.
🟣 Global scope: Variables accessible everywhere.
🟣 Function scope: Variables accessible only within function.
🟣 Block scope: Variables (let/const) accessible only within block {}.
🟣 Lexical scope means inner functions have access to outer function variables.
🟣 Scope is determined by where functions are defined, not where they're called.
🟣 JavaScript looks for variables starting from current scope, then outer scopes.

-----------------------------------------

32. What is type coercion?

🟣 Type coercion is automatic conversion of values from one type to another.
🟣 Implicit coercion: Automatic conversion by JavaScript.
🟣 Explicit coercion: Manual conversion using functions (Number(), String(), ...).
Your friend yawns a lot → He is implicitly telling you he is tired (without saying it).
Your friend says, “I am tired.” → This is explicit.

-----------------------------------------

33. What are truthy and falsy values?

🟣 Falsy values: false, 0, -0, "", null, undefined, NaN.
🟣 Truthy values: Everything else (including "0", "false", [], {}).
🟣 Use Number.isNaN() (recommended) or isNaN().


-----------------------------------------

34. Performance

🟣 Memoization => Caching function results to avoid redundant calculations.
✔️ Redundant = unnecessary repetition
✔️ Frequently = happening often
🟣 Lazy loading => Deferring loading of resources until they're needed.

-----------------------------------------

35. What is localStorage and sessionStorage?

🟣 localStorage: Stores data persistently (no expiration).
🟣 sessionStorage: Stores data for session duration only.
🟣 Both localStorage and sessionStorage store key-value pairs as strings in the browser. The main differences are:
    ▫️ localStorage → Data persists even after you close the browser.
    ▫️ sessionStorage → Data lasts only for the browser tab/session; it is cleared

-----------------------------------------

36. What is the Fetch API?

🟣 Modern way to make HTTP requests in JavaScript.
🟣 Returns a Promise for handling async operations.
🟣 Replaces older XMLHttpRequest.
🟣 XMLHttpRequest (XHR) is a JavaScript object that lets your web page talk to a server and get or send data without reloading the page.
    ▫️ AJAX = technique for asynchronous requests.
    ▫️ XML = data format, optional in AJAX.
    ▫️ Today, most developers use JSON because it’s easier to work with in JavaScript.
    ▫️ JSON is smaller, faster, easier, and more compatible with JavaScript → that’s why XML is rarely used today.

-----------------------------------------++

38. What are regular expressions (RegEx)?

🟣 Regex (Regular Expression) = a pattern used to find, match, or replace text in strings.
🟣 Regex is a “search pattern” for text that lets you check, find, or change parts of a string.
🟣 test(): Tests if pattern exists in string (returns boolean) -> like: emailPattern.test(email)
🟣 match(): Returns matches as array -> like: text.match(phonePattern)
🟣 replace(): Replaces matched text -> text.replace(phonePattern, "XXX-XXX-XXXX")
🟣 search(): Returns index of first match.
🟣 The common RegEx patterns are: Email validation, phone numbers, URLs, dates.

-----------------------------------------

39. What is XSS (Cross-Site Scripting)?

🟣 Injection attack where malicious scripts are injected into websites.
🟣 Prevention: Sanitize user input, escape HTML (input value has scripts), use Content Security Policy.

-----------------------------------------

40. What is CSRF (Cross-Site Request Forgery)?

🟣 Attack forcing users to execute unwanted actions on authenticated site.
🟣 Prevention: Use CSRF tokens, SameSite cookies, verify origin.
    ▫️ Named export: can export multiple items, must import using the same name.
    ▫️ Default export: only one per module, can import with anay name.


-----------------------------------------

41. What are modules in JavaScript (ES Modules)?

🟣 Modules allow you to split code into separate files.
🟣 Each module can export variables, functions, or classes and import them in other files.
🟣 Helps organize code and avoid global scope pollution.
🟣 Named export: can export multiple items, must import using the same name.
🟣 Default export: only one per module, can import with any name.

-----------------------------------------

42. What are microtasks vs macrotasks?

🟣 Microtasks → Small, high-priority tasks executed immediately after the current code finishes, before anything else.
🟣 Macrotasks → Larger, lower-priority tasks, Executed after microtasks, one at a time (setTimeout, setInterval, DOM events) 
🟣 Why Promise runs before setTimeout
    ▫️ JavaScript finishes the current synchronous code.
    ▫️ Then it executes all microtasks in the microtask queue.
    ▫️ After the microtask queue is empty, it moves to macrotasks.

-----------------------------------------

44. What are practical use cases for closures?

🟣 Closures allow functions to remember and use data even after the outer function is gone.
🟣 Encapsulation (private variables): Closures let you create private data that can’t be accessed directly from outside.

-----------------------------------------
