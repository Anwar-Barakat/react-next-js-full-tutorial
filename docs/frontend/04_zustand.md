01. What is Zustand?

🟣 A lightweight state management library for React.
🟣 Uses hooks to manage global state.
🟣 No reducers, no actions, no boilerplate.

-----------------------------------------

02. Why use Zustand?

🟣 Very simple API.
🟣 Less code than Redux.
🟣 Easy to learn and maintain.
🟣 Great for small to medium apps.

-----------------------------------------

03. How does Zustand work?

🟣 Zustand Store -> A hook that holds state and actions together.
🟣 You create a store using a hook "Created using create()."
🟣 Components subscribe only to the state they need.
🟣 When state changes, only subscribed components re-render.
🟣 You can read the state in Zustand -> By calling the store hook inside a component. "const count = useStore(state => state.count)"
🟣 Does Zustand support async logic?

-----------------------------------------

04. Zustand vs Redux, RTK — difference?

🟣 Zustand → minimal, simple, less boilerplate.
🟣 Redux → structured, predictable, large apps.
🟣 Zustand doesn’t need reducers or actions.

🟣 Zustand → fast development, small/medium apps.
🟣 RTK → large apps, complex business logic, strict structure.

-----------------------------------------

05. Zustand vs Context API?

🟣 Zustand avoids unnecessary re-renders.
🟣 Context re-renders all consumers by default.
🟣 Zustand is better for frequently changing state.

-----------------------------------------

06. Does Zustand support async logic?

🟣 ✅ Yes.
🟣 Async logic can be written directly in actions.
fetchUser: async () => {
  const res = await fetch('/api/user');
  set({ user: await res.json() });
}

-----------------------------------------

07. Does Zustand support middleware?

🟣 ✅ Yes. Zustand supports middleware that enhances store behavior.
🟣 Examples: persist, devtools, immer.
🟣 persist -> A middleware that saves state to localStorage or sessionStorage "Useful for auth, theme, cart".
🟣 immer -> A middleware that lets you write state updates using mutable syntax, while Zustand (with Immer) still keeps the state immutable under the hood. 
    ❌ Without Immer (must manually copy) Every nested level needs copying.
    set((state) => ({
        user: {
            ...state.user,
            name: 'Alice'
        }
    }))
    ✅ With Immer (looks like mutation)
    set((state) => {
        state.user.name = 'Alice'
    })
    ✔ You avoid spreading nested objects manually
    ✔ Code becomes shorter & easier to read
    ✔ Less chance of accidently mutating state wrongly
    ✔ Deep or complex updates are simpler ✨

-----------------------------------------

08. How does Zustand avoid unnecessary re-renders?

🟣 Components subscribe only to selected state.
🟣 Re-render happens only if selected value changes.

-----------------------------------------

09. Does Zustand replace Redux?

🟣 Not always.
🟣 Zustand is simpler but less opinionated.
🟣 Redux is better for very large teams/apps.
🟣 No Provider needed for Zustand (unlike Redux).

-----------------------------------------