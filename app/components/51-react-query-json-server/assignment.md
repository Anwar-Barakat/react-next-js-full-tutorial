# React Query Fundamentals with JSON Server

This assignment focuses on understanding and implementing the core concepts of React Query for data fetching, caching, and synchronization, using JSON Server as a mock API.

## Objectives:

1.  **Set up JSON Server:** Learn how to quickly spin up a local REST API for development and testing.
2.  **Install and Configure React Query:** Integrate `@tanstack/react-query` into a React application.
3.  **Fetch Data with `useQuery`:** Use the `useQuery` hook to fetch data from the JSON Server.
4.  **Handle Query States:** Display loading, error, and success states for data fetching.
5.  **Basic Caching:** Observe how React Query automatically caches fetched data.

## Task:

Implement a simple application that fetches and displays a list of "posts" or "todos" from a JSON Server.

-   **JSON Server Setup:** Create a `db.json` file with an array of sample posts/todos.
-   **React Query Integration:**
    -   Set up `QueryClient` and `QueryClientProvider`.
    -   Create a component that uses `useQuery` to fetch data from your JSON Server endpoint (e.g., `http://localhost:3000/posts`).
    -   Display a loading indicator while data is being fetched.
    -   Display an error message if the fetch fails.
    -   Render the list of fetched items upon successful data retrieval.

## Instructions to run JSON Server:

1.  Make sure you have Node.js installed.
2.  Install JSON Server globally: `npm install -g json-server`
3.  Navigate to the root of this project.
4.  Create a `db.json` file in the `app/components/51-react-query-json-server` directory with your sample data.
5.  Run JSON Server: `json-server --watch app/components/51-react-query-json-server/db.json --port 3000`
6.  Your API will be available at `http://localhost:3000/posts` (or `/todos` depending on your `db.json` structure).