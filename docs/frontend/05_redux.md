01. What are different ways to manage state in React?

🟣 Local State: useState, useReducer (component-level).
🟣 Context API: Share state across component tree.
🟣 Redux: Centralized state management library.
🟣 Zustand: Lightweight alternative to Redux.

-----------------------------------------

02. What is Redux and why we use it?

🟣 In Redux (the state-management library for React)
🟣 A global state management library for JavaScript apps.
🟣 Stores shared data in a single centralized store.
🟣 To manage shared or complex state.
🟣 Avoid prop drilling.
🟣 Predictable state flow.

-----------------------------------------

03. What are the main parts of Redux?

🟣 Store
   ▫️ Holds all of your app’s state in one place.
   ▫️ A centralized object that contains your entire app’s state.
   ▫️ You don’t change state directly — changes always go through Redux.
🟣 Actions
   ▫️ What it is: A plain JavaScript object that describes what happened.
   ▫️ Not a method or function — just data.
   ▫️ Always has a type field (string), e.g. { type: "INCREMENT" }.
   ▫️ It doesn’t change state by itself. It just describes an event. 
   👉 Think of an action like a “news report” saying: “User clicked +1.” 
   ▫️ Actions = “what happened”
🟣 Reducers
   ▫️ What it is: A pure function (not a method on store) that decides how state changes.
   ▫️ Reducers = “decide how the state changes”
🟣 Dispatch
   ▫️ What it is: A method (function) from the Redux store.
   ▫️ Only job: Send actions into the Redux system.
   ▫️ When you do store.dispatch(action), you are telling Redux: “Here’s what happened — go update the state.”
   ▫️ Dispatch = “tell Redux what happened”

-----------------------------------------

04. What is a pure function in Redux?

🟣 A pure function takes input and returns output.
🟣 Same input always produces the same output.
🟣 Does not change anything outside the function.

🟣 In Redux, a reducer must be pure, which means:
❌ No side effects
   ▫️ No API calls
   ▫️ No Date.now() or Math.random()
   ▫️ No logging, DOM access, or external mutations
❌ No mutations
   ▫️ The reducer must not modify existing state (objects, arrays, variables).
🟣 State is updated only by returning a NEW state, not by editing the old one.
👉 This is required because Redux depends on predictable and traceable state changes.

-----------------------------------------

05. Why is Redux predictable?

🟣 State changes only happen through reducers.
🟣 Reducers are pure.
🟣 State flow is one-direction (one-way data flow).

-----------------------------------------

06. What problems does Redux solve?

🟣 Deep prop drilling
🟣 Complex shared state
🟣 Difficult data flow in large apps

-----------------------------------------

07. How do you connect React with Redux?

🟣 Provider → wraps app
🟣 useSelector() → read state
🟣 useSelector() → A hook to access Redux state inside a component.
🟣 useDispatch() → send actions
🟣 useDispatch() → A hook that returns the dispatch function to send actions.

-----------------------------------------

08. What is Redux Thunk?

🟣 Middleware for async actions.
🟣 Allows dispatching functions (for API calls).

-----------------------------------------

09. What is the difference between Redux and Context API?

🟣 Context → simple sharing
🟣 Redux → full state management system
🟣 Redux is better for large apps, complex logic, debugging.

-----------------------------------------

10. What is Redux Toolkit (RTK)?

🟣 In classic Redux: You must manually return a NEW object every time.
return { ...state, count: state.count + 1 }
state.count += 1  // ❌ mutation
🟣 In Redux Toolkit: you can write → state.count += 1
🟣 RTK will automatically convert that into a correct immutable update.
🟣 Because RTK uses a library called Immer that watches your code and prevents real mutations.
💡 You write mutable code → RTK turns it into immutable code safely.
🟣 RTK automatically creates: 
   ▫️ pending action
   ▫️ fulfilled action
   ▫️ rejected action
🟣 Less code, fewer mistakes, cleaner logic.
🟣 Because classic Redux is:
   ❌ too much boilerplate
   ❌ too many files
   ❌ too easy to make mistakes
   ❌ too strict and verbose
   ❌ annoying for beginners

-----------------------------------------

11. What are:

🟣 createSlice: 
   ▫️ Creates actions + reducer in one place.
   ▫️ Reduces boilerplate.
🟣 createAsyncThunk: 
   ▫️ Helper for writing async API logic.
   ▫️ Automatically handles loading, success, error states.
🟣 immutability in Redux: 
   ▫️ You never mutate state directly.
   ▫️ You always return a new object/array.
🟣 slice
   ▫️ A section of Redux state.
   ▫️ Contains reducer logic + actions together.
   ▫️ Created using createSlice().

-----------------------------------------

12. What is the difference between Redux and Zustand?

🟣 Redux → structured, predictable, large apps
🟣 Zustand → small, simple, minimal state library

-----------------------------------------

13. What is the difference between Redux and Zustand?

🟣 Redux → structured, predictable, large apps
🟣 Zustand → small, simple, minimal state library

-----------------------------------------

14. When should you NOT use Redux?

🟣 Small apps
🟣 Apps without much shared state
🟣 When Context or Zustand is enough

-----------------------------------------

15. What is Redux Toolkit Query (RTK Query)?

🟣 A data-fetching and caching tool built into RTK.
🟣 Handles loading, caching, refetching automatically.
🟣 Often replaces Redux Thunk for API calls.
🟣 Redux → client state (UI, theme, auth).
🟣 RTK Query → server state (API data).
🟣 RTK Query reduces boilerplate for fetching.
🟣 Server state → data from API (users, posts).
🟣 Client state → UI state (theme, modal, auth).
🟣 Redux handles both, but RTK Query is best for server state.

-----------------------------------------

16. What happens when you dispatch an action?

🟣 You call dispatch(action)
   ▫️ This tells the Redux store that something happened and you want the state updated. 
   ▫️ Can you dispatch actions inside reducers? ❌ No, Reducers must be pure. 
🟣 The action goes through middleware (if any are applied)
   ▫️ Redux middleware wrap the store’s dispatch function.
🟣 The reducer receives the action and current state.
   ▫️ Reducers compute a new state based on the action.
   ▫️ They must be pure (no side effects or mutations).
🟣 Redux updates the store with the new state: The old state is replaced with the new state the reducer returned. 
🟣 Subscribers (e.g., UI) are notified and may re-render

dispatch(action) → middleware → reducer → store update → UI re-renders

-----------------------------------------

17. Is Redux synchronous or asynchronous?

🟣 Redux itself is synchronous.
🟣 Async logic is handled by middleware (Thunk).

-----------------------------------------

18. How do you structure a Redux project?

🟣 Feature-based folders
🟣 Each feature has its own slice
🟣 Shared store configuration

-----------------------------------------