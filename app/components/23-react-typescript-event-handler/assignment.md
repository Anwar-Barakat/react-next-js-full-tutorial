# 23 - React TypeScript Event Handlers

In this exercise, you'll practice correctly typing event handlers in React with TypeScript for common scenarios like button clicks, input changes, and form submissions.

## Instructions

### Step 1: Click Event Handler
- Create a `ClickEventHandler.tsx` component.
- Add a button to the component.
- Create an `onClick` handler function that accepts an event object.
- Correctly type the event object using `React.MouseEvent<HTMLButtonElement>`.
- The handler should log a message or show an alert when the button is clicked.

### Step 2: Change Event Handler
- Create a `ChangeEventHandler.tsx` component.
- Add an `<input>` field.
- Create an `onChange` handler function that accepts an event object.
- Correctly type the event object using `React.ChangeEvent<HTMLInputElement>`.
- Use `useState` to store the input's value and display it in the component.

### Step 3: Form Submission Event Handler
- Create a `SubmitEventHandler.tsx` component.
- Create a `<form>` with a text input and a submit button.
- Create an `onSubmit` handler function for the form.
- Correctly type the event object using `React.FormEvent<HTMLFormElement>`.
- The handler should prevent the default form submission and log or alert the value from the input field.

### Step 4: Usage Example
- Create a `UsageExample.tsx` component.
- Import and render `ClickEventHandler`, `ChangeEventHandler`, and `SubmitEventHandler` to display all examples.
