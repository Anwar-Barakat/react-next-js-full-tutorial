# Assignment: Styling Components in React

In this exercise, you'll learn how to apply styles using different methods in React components, including inline styles, style objects, and React Icons.

## Step 1: Create a StyledCard Component with Inline Styles

Create a new file called `StyledCard.tsx`.
Inside this file, create a functional component called `StyledCard`.
Use inline styles to style the component:
- Set the background color to light blue.
- Set padding to 20px.
- Set border radius to 10px.
- Set text color to dark blue.
Render a `<div>` with a title and description inside it.

## Step 2: Create a ProfileCard Component with Separate Style Object

Create a new file called `ProfileCard.tsx`.
Inside this file, create a functional component called `ProfileCard`.
Define a `styles` object to hold the CSS properties:
- Set the background color to light gray.
- Set padding to 15px.
- Set border radius to 8px.
- Set text color to black.
Apply the `styles` object to the `<div>` using the `style` attribute.
Render a `<div>` with a title and description inside it.

## Step 3: Create an IconComponent Using React Icons

Install `react-icons` if you haven't already:
```bash
npm install react-icons
```
Create a new file called `IconComponent.tsx`.
Inside this file, create a functional component called `IconComponent`.
Import an icon from `react-icons`, such as `FaBeer` from `react-icons/fa`.
Style the icon using inline styles:
- Set the font size to 30px.
- Set the color to gold.
Render the icon with a title.

## Step 4: Render All Components in `app/page.tsx`

In your `app/page.tsx` file, import the `StyledCard`, `ProfileCard`, and `IconComponent` components.
Inside the `Home` component's return statement, render all three components.
