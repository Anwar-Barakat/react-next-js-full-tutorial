# Redux Toolkit Kanban Board

This assignment focuses on building a simple Kanban-style board using Redux Toolkit for state management and `react-beautiful-dnd` for drag-and-drop functionality.

## Objectives:

1.  **Define Complex State:** Learn to structure a Redux state for a nested data model (boards, columns, cards).
2.  **Implement Drag-and-Drop:** Integrate `react-beautiful-dnd` to enable reordering cards within columns and moving cards between columns.
3.  **Handle State Updates with Redux:** Dispatch Redux actions to update the board state based on drag-and-drop events.
4.  **Create Dynamic UI:** Render columns and cards dynamically from the Redux store.

## Task:

Implement a Kanban board with the following features:

-   **Multiple Columns:** Start with at least three predefined columns (e.g., "To Do", "In Progress", "Done").
-   **Cards:** Each column should contain several cards (tasks). Each card should have a unique ID and content (e.g., task description).
-   **Drag and Drop:**
    -   Users should be able to drag cards to reorder them within the same column.
    -   Users should be able to drag cards from one column to another.
-   **Redux State Management:** All board data (columns and cards) should be managed within a Redux Toolkit slice. Drag-and-drop operations should trigger Redux actions to update this state.

Ensure proper TypeScript typing for the state, actions, and components.