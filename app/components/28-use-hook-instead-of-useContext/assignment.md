# React 19 `use` Hook vs. `useContext`

## Objective

This assignment demonstrates the new `use` hook introduced in React 19 as an alternative and often more streamlined way to consume context values compared to the traditional `useContext` hook.

## Background

Before React 19, `useContext` was the standard way to access context within functional components. It allowed components to subscribe to context changes and re-render when the context value updated.

React 19 introduces a new `use` hook, which can be used to read the value of a context directly. The primary difference is that `use` can be called conditionally and inside loops, and it integrates more naturally with React's Suspense for data fetching. When used with context, it simplifies the syntax and can make components cleaner.

## Task

1.  **Define a Context:** Create a simple `ThemeContext` that provides a string value (e.g., 'light' or 'dark').
2.  **Create a Provider Component:** Implement a `ThemeProvider` component that wraps its children and provides a default theme value to the `ThemeContext`.
3.  **Demonstrate `useContext` (Legacy Way):** Create a component (`LegacyThemeDisplay`) that consumes the `ThemeContext` using the `useContext` hook and displays the theme value.
4.  **Demonstrate `use` Hook (React 19 Way):** Create a component (`NewThemeDisplay`) that consumes the `ThemeContext` using the new `use` hook and displays the theme value.
5.  **Integrate and Compare:** Create a main component (`UseHookDemo`) that uses the `ThemeProvider` to wrap both `LegacyThemeDisplay` and `NewThemeDisplay`, allowing for a direct comparison of their implementation and output.

## Expected Output

The application should render both the legacy and new theme display components, each showing the current theme provided by the `ThemeProvider`. This will visually confirm that both methods successfully retrieve the context value.
