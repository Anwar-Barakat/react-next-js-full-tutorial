# React with TypeScript Project 1: Profile Page Layout

## Objective

To build a responsive profile page layout using React and TypeScript, incorporating a sidebar, a profile section with dynamic image uploads, and a tabbed content area. This project will demonstrate component composition, state management, event handling, and integration with external libraries (React Icons) within a TypeScript environment.

## Components Overview

The project will consist of the following main components:

1.  **`App.tsx`**: The main entry point that orchestrates the layout, rendering the `Sidebar` and `Profile` components.
2.  **`Sidebar.tsx`**: A fixed-position sidebar containing navigation icons.
3.  **`Profile.tsx`**: The main content area displaying a user's profile, including a banner image, profile picture, user information, and a tabbed content section. It will also feature dynamic image upload functionality for the banner and profile picture.
4.  **`Tabs.tsx`**: A component responsible for rendering a tabbed interface. It will manage the active tab state and display corresponding content.
5.  **`Card.tsx`**: A reusable card component used to display content within the tabs (e.g., for "Home", "Projects", "Courses" tabs).
6.  **`About.tsx`**: A simple component displaying "About Me" information.
7.  **`Contact.tsx`**: A component displaying contact links with social media icons.

## Key Features to Implement

*   **Component Composition:** Demonstrate how to break down a complex UI into smaller, reusable components.
*   **State Management:** Use `useState` for managing UI states, such as the active tab in `Tabs.tsx` and image URLs in `Profile.tsx`.
*   **Event Handling:** Implement `onChange` handlers for file inputs to allow users to upload banner and profile images.
*   **React Icons Integration:** Utilize `react-icons` for various UI elements.
*   **TypeScript Usage:** Define interfaces for component props (`CardProps`, `ThemeContextType` if applicable) to ensure type safety.
*   **Tailwind CSS:** Apply Tailwind CSS classes for styling to achieve a modern and responsive design.
*   **"use client" Directive:** Mark interactive components as client components in Next.js to enable client-side features like hooks and event handlers.

## Task Breakdown

1.  **Create `App.tsx`**: Set up the main layout.
2.  **Create `Sidebar.tsx`**: Implement the fixed sidebar with navigation icons.
3.  **Create `Card.tsx`**: Define the reusable card component.
4.  **Create `About.tsx`**: Implement the About content.
5.  **Create `Contact.tsx`**: Implement the Contact section with social links.
6.  **Create `Tabs.tsx`**: Implement the tabbed navigation and content display, using `Card`, `About`, and `Contact` components.
7.  **Create `Profile.tsx`**: Implement the main profile section, integrating dynamic image uploads and the `Tabs` component.
8.  **Create `index.js`**: Export the main `App` component.
9.  **Integrate into `app/page.tsx`**: Update the main page to render the `App` component.

## Expected Outcome

A functional and visually appealing profile page that demonstrates various React and TypeScript concepts, with interactive elements for image uploads and tab navigation.
