# 22 - Form Using useRef

In this exercise, you'll practice using the `useRef` hook to access and manage form input values in a React component with TypeScript. This approach is an alternative to controlling every input with `useState`.

## Instructions

### Step 1: Create the Form Component
- Create a `FormWithRef.tsx` file.
- Define a functional component that will contain a form.

### Step 2: Set Up Refs
- Inside the component, create `ref` objects for each form input (e.g., name, email, password) using `useRef`. Make sure to type them correctly (e.g., `useRef<HTMLInputElement>(null)`).

### Step 3: Build the Form
- Create a form with input fields for name, email, and password.
- Attach the corresponding `ref` to each input element.
- Add a submit button.

### Step 4: Handle Form Submission
- Create a `handleSubmit` function that will be triggered when the form is submitted.
- Inside `handleSubmit`, prevent the default form submission behavior.
- Access the values of the inputs using the `ref` objects (e.g., `nameRef.current?.value`).
- Store the submitted data in a `useState` variable to display it below the form.

### Step 5: Display Submitted Data
- Below the form, display the name, email, and password from the state variable that holds the submitted data.
- Initially, this area will be empty. After the form is submitted, it should show the values entered by the user.
