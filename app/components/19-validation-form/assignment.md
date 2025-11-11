# 19 - Form Validation

In this assignment, you will build a sign-up form with real-time validation feedback.

## Requirements:
- Create a `ValidationForm` component.
- The form should have fields for:
  - Username
  - Email
  - Password
  - Confirm Password
- Implement validation logic that checks the inputs when the user submits the form.
- **Username:** Must be at least 8 characters long.
- **Email:** Must be a valid email format (for this exercise, just check if it includes '@').
- **Password:** Must be at least 8 characters long.
- **Confirm Password:** Must match the password.
- Display an error message next to each field that fails validation.
- The border color of each input should change (e.g., to red or green) to indicate whether the input is valid or invalid after submission.
- Use the `useState` hook to manage the form inputs and their validation states (errors and colors).
