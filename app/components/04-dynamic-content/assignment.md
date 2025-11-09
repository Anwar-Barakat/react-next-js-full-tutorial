# Assignment: Using Dynamic Content with {} in JSX

In this exercise, you'll learn how to inject dynamic data into JSX using curly braces `{}`.

## Step 1: Create a Greeting Component

Create a new file called `Greeting.tsx`.
Inside this file, create a functional component named `Greeting`.
The `Greeting` component should return a `<div>` containing:
- A `<h1>` element that dynamically displays a greeting message.
- A `<p>` element that dynamically displays the current date.
Use JavaScript expressions inside `{}` to dynamically render the following:
- A `name` variable containing a name, such as "John".
- A `new Date()` object to display the current date.

## Step 2: Create a ProductInfo Component

Create a new file called `ProductInfo.tsx`.
Inside this file, create a functional component named `ProductInfo`.
The `ProductInfo` component should return a `<div>` that dynamically displays product details:
- Use a `product` object that contains the following properties:
    - `name`: "Laptop"
    - `price`: 1200
    - `availability`: "In stock"
- Display the product name, price, and availability using `{}`.

## Step 3: Render Components in `app/page.tsx`

In your `app/page.tsx` file, import the `Greeting` and `ProductInfo` components.
Inside the `Home` component's return statement, render both components.
