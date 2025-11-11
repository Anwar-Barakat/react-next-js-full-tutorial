# 20 - Button Component with Typed Props

In this exercise, you'll practice typing props for a React component using TypeScript. You will create a simple Button component with typed props and then use it within a parent component.

## Instructions

### Step 1: Create the Button Component
- Create a `Button.tsx` file.
- Define a `Button` component that accepts the following props:
  - `label`: A string to display as the button's text.
  - `onClick`: A function that gets called when the button is clicked.
  - `disabled`: A boolean to indicate if the button is disabled.

### Step 2: Use the Button Component
- Create a `UsageExample.tsx` component.
- Import and use the `Button` component within `UsageExample.tsx`, passing the appropriate props.
- Create two instances of the `Button` component:
  - One enabled button that displays "Click Me" and shows an alert when clicked.
  - One disabled button that displays "Disabled Button" and should not trigger an alert.

### Step 3: Verify Your Types
- Ensure your TypeScript compiler is not showing any type errors.
- Test the buttons in the browser to ensure they work as expected.
