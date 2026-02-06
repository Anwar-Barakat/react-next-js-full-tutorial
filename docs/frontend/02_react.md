01. What is ReactJS

🟣 React is a JavaScript library for building user interfaces.
🟣 Developed and maintained by Facebook (Meta).
🟣 Focuses on building reusable UI components.
🟣 Uses a virtual DOM for efficient updates.
🟣 Follows a component-based architecture.
🟣 Can be used for web (React) and mobile (React Native).

-----------------------------------------

02. What are the main features of React?

🟣 Component-Based: Build encapsulated components that manage their own state.
🟣 Virtual DOM: Minimizes direct DOM manipulation for better performance.
🟣 JSX: Syntax extension that looks like HTML in JavaScript.
🟣 Unidirectional Data Flow: Data flows from parent to child components.
🟣 Declarative: Describe what UI should look like, React handles the how.
🟣 React Hooks: Use state and lifecycle features without classes.
Encapsulated = keeps its own data and rules inside, safe from outside interference.

-----------------------------------------

03. What is JSX?

🟣 JSX (JavaScript XML) is a syntax extension for JavaScript.
🟣 Looks like HTML but is actually JavaScript.
🟣 Gets compiled to React.createElement() calls.
🟣 Must return a single parent element.
🟣 Use {} to embed JavaScript expressions.

-----------------------------------------

04. What is the difference between React and ReactDOM?

🟣 React: Core library for creating components and managing state.
🟣 ReactDOM: Package for rendering React components to the DOM.
🟣 React is platform-agnostic (can target web, mobile, VR).
🟣 ReactDOM is specifically for web browsers.

-----------------------------------------

05. What is the Virtual DOM?

🟣 Virtual DOM is a lightweight copy of the real DOM kept in memory.
🟣 React compares Virtual DOM with previous version (diffing).
🟣 Updates only the changed parts in the real DOM (reconciliation).
🟣 Makes updates faster and more efficient.

-----------------------------------------

06. What are React components?

🟣 Components are independent, reusable pieces of UI.
🟣 Accept inputs called "props" and return React elements.
🟣 Two types: Function Components and Class Components.
🟣 Function components are simpler and more common (with hooks).
🟣 Components can be nested inside other components.
🟣 A component has a lifecycle:
   ▫️ Mounting – when the component appears for the first time
   ▫️ Updating – when its data changes and it re-renders
   ▫️ Unmounting – when the component is removed from the screen
🟣 React gives us “lifecycle methods” (or hooks) to run code at each stage.
🟣 Hooks replaced lifecycle methods:
   ▫️ useEffect(() => {...}, []) → mount
   ▫️ useEffect(() => {...}, [value]) → update
   ▫️ useEffect(() => {...}) return () => {...} → unmount

🟣 Component Composition: Putting small components together to build a bigger component.

-----------------------------------------

07. What are props in React?

🟣 Props (properties) are arguments passed to components.
🟣 Props are read-only (immutable).
🟣 Flow from parent to child (one-way data flow).
🟣 Can pass any data type: strings, numbers, objects, functions, etc.
🟣 Access props as function parameters or this.props in classes.

-----------------------------------------

08. What is the difference between props and state?

🟣 Props: Data passed from parent, read-only, cannot be modified by component.
🟣 State: Data managed within component, can be changed using setState/useState.
🟣 Props are external data, State is internal data.
🟣 Changing props → component re-renders. 
🟣 Changing state → component re-renders.
🟣 props.children contains the content between component's opening and closing tags.
🟣 Allows components to wrap other components or elements.
🟣 Useful for creating wrapper/container components.

-----------------------------------------

09. What is the difference between props and state?

🟣 Props: Data passed from parent, read-only, cannot be modified by component.
🟣 State: Data managed within component, can be changed using setState/useState.
🟣 Props are external data, State is internal data.
🟣 Changing props → component re-renders. 
🟣 Changing state → component re-renders.
🟣 props.children contains the content between component's opening and closing tags.
🟣 Allows components to wrap other components or elements.
🟣 Example: A layout is a wrapper component, it surrounds your page and displays the page inside it using props.children.

-----------------------------------------

10. What is state in React?

🟣 State is data that changes over time within a component.
🟣 Managed using useState hook (function components) or this.state (class components).
🟣 When state changes, component re-renders.
🟣 State is private to the component (cannot be accessed from outside).
🟣 useState is a hook that adds state to function components.
🟣 Returns an array: [currentValue, updateFunction].
🟣 Update function replaces the old value with new value.
🟣 Can initialize with any value: primitive, object, array, function.
🟣 Never mutate state directly (use setter function).
🟣 For objects/arrays, create new copy (use spread operator).
🟣 Use functional update when new state depends on previous state.

************* 🟣🟣🟣 *************
function Wrong() {
   const [user, setUser] = useState({ name: 'Anwar', age: 25 });
}
const updateAge = () => {
    user.age = 26; // ❌ Don't mutate directly
    setUser(user); // Won't trigger re-render (same object reference)
};
************* 🟣🟣🟣 *************

-----------------------------------------

11. How do you handle events in React?

🟣 Events in React are named using camelCase (onClick, onChange).
🟣 Pass function reference, not function call.
🟣 Use arrow functions or bind to pass parameters.
🟣 Event object is passed automatically to handler.

************* 🟣🟣🟣 *************
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
************* 🟣🟣🟣 *************

-----------------------------------------

12. What is event.preventDefault() and event.stopPropagation()?

🟣 preventDefault(): Prevents default browser behavior (form submit, link navigation).
🟣 stopPropagation(): Stops event from bubbling up to parent elements.
🟣 Use preventDefault() for forms, stopPropagation() to prevent parent handlers.

✔ What is bubbling?
When an event happens on a child element, it automatically “travels up” and triggers the same event on all its parent elements.

-----------------------------------------

13. How do you conditionally render components in React?

🟣 Use JavaScript conditional operators: if/else, ternary, logical &&.
🟣 Return null to render nothing.
🟣 Can conditionally render elements or entire components.

-----------------------------------------

13. How do you conditionally render components in React?

🟣 Use JavaScript conditional operators: if/else, ternary, logical &&.
🟣 Return null to render nothing.
🟣 Can conditionally render elements or entire components.
🟣 Use JavaScript map() to transform array into array of React elements.
🟣 Each item must have a unique key prop.
🟣 Keys help React identify which items changed, added, or removed.
🟣 Keys should be stable, unique, and not change between renders.
🟣 Best practice: Use unique IDs from your data.
🟣 Avoid using array index as key (can cause issues with reordering).

-----------------------------------------

14. How do you handle forms in React?

🟣 Controlled Components: React state controls input values.
🟣 Controlled gives you full control and validation.
🟣 Controlled components are generally preferred in React.
🟣 Controlled components are recommended (React manages the data).
🟣 Uncontrolled Components: DOM controls input values (use refs).
🟣 Uncontrolled components store their own state in the DOM (like traditional HTML).
🟣 Uncontrolled is simpler for basic forms.
🟣 Use ref to access DOM values when needed.

-----------------------------------------

15. What are React Hooks?

🟣 React Hooks are built-in functions that let you use state and lifecycle features inside functional components.
🟣 Start with "use" (useState, useEffect, useContext, etc.).
🟣 Rules: Only call at top level, only in React functions.
🟣 Cannot be called inside loops, conditions, or nested functions.

-----------------------------------------

16. What is useEffect hook?

🟣 useEffect is a React Hook that lets you run code when your component changes.
🟣 Think of it like: "Do something after React renders the UI."
🟣 Second argument (dependency array) controls when it runs.
🟣 Return cleanup function for unmounting.
✔ Run code when the component first loads (mount)
✔ Run code when some data changes (update)
✔ Run cleanup code when the component is removed (unmount)

🟣 No array: Effect runs after every render.
🟣 Empty array []: Effect runs once (mount only).
🟣 With dependencies [a, b]: Effect runs when a or b changes.
🟣 Always include all values from component scope that effect uses.

Difference between useEffect and useLayoutEffect in React
1- useEffect: 
🟣 Runs after the UI is shown on the screen
🟣 Does not block rendering 
🟣 Best for: Data fetching, API calls, subscription.
🟣 User sees the UI first, then the effect runs

2- useLayoutEffect
🟣 Runs before the UI is shown
🟣 Blocks rendering until it finishes
🟣 Best for: Measuring DOM size/position, Fixing layout before paint 
🟣 User does not see flicker

useEffect → UI renders ➜ effect runs
useLayoutEffect → effect runs ➜ UI renders

Use useEffect in most cases
Use useLayoutEffect only when UI layout must be correct before display

-----------------------------------------

17. What is useState?

🟣 useState is a React Hook that lets you add state (data that changes) to a functional component.
🟣 Think of it as: “A variable that makes the component re-render when it changes.”

Handling reconciliation: 
🟣 When React state changes, it creates a new Virtual DOM tree and compares it to the previous Virtual DOM (). 
🟣 Only the parts that changed are then updated in the real DOM, making updates efficient. 

-----------------------------------------

18. What is useContext hook?

🟣 useContext is a React Hook that lets you access shared data (global state) without passing props through every component.
🟣 Think of it as: “A way to avoid prop-drilling.”
🟣 Common uses: theme, user authentication, language settings.

-----------------------------------------

19. What is useRef hook?

🟣 useRef is a React Hook that stores a value without causing the component to re-render.
🟣 Think of it as: “A box where you can keep something, and changing it does NOT refresh the UI.”
🟣 What can useRef do?
   ▫️ Keep values between renders
   ▫️ Access DOM elements
   ▫️ Store timers, previous values, counters, etc.
   ▫️ Avoid re-rendering when the value changes

-----------------------------------------

20. What is useReducer hook?

🟣 useReducer is a React Hook used to manage more complex state logic.
🟣 It works like a small version of Redux inside a component.  
🟣 Think of it as: “useState, but more organized when the state has many actions or many values.”

-----------------------------------------

21. What is the useMemo hook?

🟣 useMemo memoizes (caches) expensive calculation results in each render.
🟣 Only recalculates when dependencies change.
🟣 Returns memoized value.
🟣 Think of it as: “useMemo prevents expensive calculations from running every time.”

🟣 React.memo is a higher-order component that memoizes component.
🟣 Prevents re-render if props haven't changed “Don’t re-render this component unless its props change.”
🟣 Does shallow comparison of props by default.
🟣 Can provide custom comparison function.
🟣 Similar to PureComponent for class components.

-----------------------------------------

22. What is useCallback hook?

🟣 useCallback memoizes (caches) function definitions.
🟣 Returns memoized function.
🟣 Prevents creating new function on every render.
🟣 Useful when passing callbacks to optimized child components.

************* 🟣🟣🟣 *************
// useMemo vs useCallback
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]); // Returns VALUE
const memoizedFunction = useCallback(() => doSomething(a, b), [a, b]); // Returns FUNCTION
************* 🟣🟣🟣 *************

-----------------------------------------

23. What are custom hooks?

🟣 Custom hooks are reusable functions that contain hook logic.
🟣 Must start with "use" prefix (useCustomName).
🟣 Can call other hooks inside them.
🟣 Share stateful logic between components without changing component hierarchy.
🟣 Better than render props or HOCs for code reuse.
   
-----------------------------------------

24. What are custom hooks?

🟣 Custom hooks are reusable functions that contain hook logic.
🟣 Must start with "use" prefix (useCustomName).
🟣 Can call other hooks inside them.
🟣 Share stateful logic between components without changing component hierarchy.
🟣 Better than render props or HOCs for code reuse.

-----------------------------------------

25. What is component lifecycle in React?

🟣 Lifecycle is the series of phases a component goes through.
🟣 Mounting: Component is created and inserted into DOM.
🟣 Updating: Component re-renders due to state/props changes.
🟣 Unmounting: Component is removed from DOM.
🟣 In function components, useEffect handles all lifecycle phases.

-----------------------------------------

26. What is code splitting and lazy loading?

🟣 Code Splitting → Split the app into pieces.
🟣 Lazy Loading → Load the piece only when needed.
🟣 React.lazy() → Lazy load a component.
🟣 Suspense → Show something while waiting for that component to load.
🟣 React.lazy loads components only when needed → smaller initial bundle. 
🟣 Suspense shows a fallback UI while lazy chunks load.
🟣 Vite automatically splits chunks on dynamic imports and lets you fine-tune with manualChunks.  
🟣 Sometimes the index in the loop make a wrong re-render for the component.

-----------------------------------------

27. What are common React performance issues and solutions?

🟣 Issue 1: Unnecessary re-renders.
   ▫️ Solution: Use React.memo, useMemo, useCallback.
🟣 Issue 2: Large bundle size.
   ▫️ Solution: Code splitting with React.lazy.
🟣 Issue 3: Expensive calculations on every render.
   ▫️ Solution: Use useMemo to cache results.
🟣 Issue 4: Creating new functions in render.
   ▫️ Solution: Use useCallback or define outside component.
🟣 Issue 5: Large lists without virtualization.
   ▫️ Solution: Use react-window or react-virtualized.

-----------------------------------------

29. What is prop drilling and how to avoid it?

🟣 Prop drilling is passing props through multiple levels of components.
🟣 Makes code harder to maintain and components tightly coupled.
🟣 Solutions: Context API, Component Composition, State Management Libraries.

-----------------------------------------

30. What are Higher-Order Components (HOC)?

🟣 A HOC is just a function that takes a component and wraps it with extra behavior, then returns a new component.
🟣 Used for reusing component logic.
🟣 Naming convention: withSomething (e.g., withAuth, withLoading).
🟣 Don't mutate original component, return new one.
🟣 Less common now due to hooks, but still seen in older codebases.

-----------------------------------------

31. What is React Router?

🟣 React Router is a library for handling navigation in React apps.
🟣 Enables single-page applications with multiple "pages".
🟣 Uses URL to determine which components to show.
🟣 Main components: BrowserRouter, Route, Link, Navigate.

-----------------------------------------

32. React Hook Form + Zod ?

🟣 React Hook Form (RHF) manages form state efficiently
🟣 few re-renders, fast performance, and easy handlers like: errors, watch, handleSubmit, reset, isValid
🟣 Zod lets you define a schema for your form data with validations and automatically infers TypeScript types.
🟣 Together they create clean, maintainable, and robust forms with centralized validation logic. 

-----------------------------------------

33. What are state types in React

🟣 Local State: it is for one component and accessing within the same component
🟣 Cross Component State: they are the data passed from parent component to child using props  
🟣 App Wite State: we need data in multiple place and we use (Redux, Context API)

-----------------------------------------