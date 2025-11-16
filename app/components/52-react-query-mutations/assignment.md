# React Query Mutations and Query Invalidation with JSON Server

This assignment builds upon the fundamentals of React Query by exploring how to perform data mutations (Create, Update, Delete) and effectively manage cache invalidation to keep the UI synchronized with the backend.

## Objectives:

1.  **Perform Data Mutations with `useMutation`:** Learn how to use the `useMutation` hook to send POST, PUT/PATCH, and DELETE requests to a backend API.
2.  **Implement Query Invalidation:** Understand how to use `queryClient.invalidateQueries` to automatically refetch relevant data after a successful mutation, ensuring the UI reflects the latest state.
3.  **Explore Optimistic Updates:** Implement optimistic updates for a smoother user experience, where the UI is updated immediately after a mutation request, and then reverted if the request fails.
4.  **Handle Mutation States:** Display loading, error, and success states for mutation operations.

## Task:

Enhance the "posts" application from Assignment 51 to include functionality for creating, updating, and deleting posts.

-   **JSON Server Setup:** Continue using the `db.json` and JSON Server setup from Assignment 51.
-   **Create Post:**
    -   Add a form to create new posts (title and author).
    -   Use `useMutation` to send a POST request to `http://localhost:3000/posts`.
    -   Invalidate the 'posts' query after a successful creation.
-   **Update Post:**
    -   Add an "Edit" button next to each post.
    -   When editing, allow the user to modify the title and/or author.
    -   Use `useMutation` to send a PUT/PATCH request to `http://localhost:3000/posts/:id`.
    -   Invalidate the 'posts' query after a successful update.
-   **Delete Post:**
    -   Add a "Delete" button next to each post.
    -   Use `useMutation` to send a DELETE request to `http://localhost:3000/posts/:id`.
    -   Implement an **optimistic update** for deletion:
        -   Immediately remove the post from the UI.
        -   If the deletion fails, revert the UI change.
        -   Invalidate the 'posts' query after the mutation (whether successful or reverted).
-   **Display States:** Show appropriate loading indicators and error messages for both query and mutation operations.

## Instructions to run JSON Server:

(Same as Assignment 51)
1.  Make sure you have Node.js installed.
2.  Install JSON Server globally: `npm install -g json-server`
3.  Navigate to the root of this project.
4.  Ensure your `db.json` file (from Assignment 51) is in `app/components/51-react-query-json-server/db.json`.
5.  Run JSON Server: `json-server --watch app/components/51-react-query-json-server/db.json --port 3000`
6.  Your API will be available at `http://localhost:3000/posts`.