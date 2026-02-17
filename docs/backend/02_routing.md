# Laravel Routing Guide

A comprehensive guide to routing, requests, and the HTTP lifecycle in Laravel.

## Table of Contents

1. [What is routing in Laravel?](#1-what-is-routing-in-laravel)
2. [What are named routes in Laravel?](#2-what-are-named-routes-in-laravel)
3. [Difference between Route::get() and Route::post()](#3-difference-between-routeget-and-routepost)
4. [What is a Request in Laravel?](#4-what-is-a-request-in-laravel)
5. [How do you retrieve input data from a request?](#5-how-do-you-retrieve-input-data-from-a-request)
6. [What is HTTP (Hypertext Transfer Protocol)?](#6-what-is-http-hypertext-transfer-protocol)
7. [Difference between input() and query()](#7-difference-between-input-and-query)
8. [What is redirecting in Laravel?](#8-what-is-redirecting-in-laravel)
9. [What is flashing data to the session?](#9-what-is-flashing-data-to-the-session)
10. [What are route parameters?](#10-what-are-route-parameters)
11. [Difference between required and optional route parameters](#11-difference-between-required-and-optional-route-parameters)
12. [What are route groups?](#12-what-are-route-groups)
13. [What is route prefixing?](#13-what-is-route-prefixing)
14. [What is route model binding?](#14-what-is-route-model-binding)
15. [What is implicit vs explicit route model binding?](#15-what-is-implicit-vs-explicit-route-model-binding)
16. [What is rate limiting in Laravel?](#16-what-is-rate-limiting-in-laravel)
17. [What is the request lifecycle?](#17-what-is-the-request-lifecycle)

---

## 1. What is routing in Laravel?

- Routing determines how your app responds to HTTP requests.
- Routes are defined in `routes/web.php` (web) and `routes/api.php` (API) and map to a controller, action, or closure.

---

## 2. What are named routes in Laravel?

- Named routes let you give a route a name for easy reference.
- Makes generating URLs and redirects easier without hardcoding paths.
- Use the `route()` helper to reference the route anywhere in the app.

```php
Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

// Using the named route
return redirect()->route('dashboard');
$url = route('dashboard');
```

---

## 3. Difference between Route::get() and Route::post()

- `Route::get()` → Handles GET requests (used to retrieve or show data).
- `Route::post()` → Handles POST requests (used to submit or create data).

---

## 4. What is a Request in Laravel?

- The Request object holds information about the current HTTP request.
- An HTTP request is sent by a client (browser/app) to the server to get data or perform an action.
- It includes the method, URL, headers, query parameters, body, and cookies.
- Laravel's Request object makes it easy to access this data.

---

## 5. How do you retrieve input data from a request?

- `input('key')` → Get a specific input value.
- `all()` → Get all request data.
- `has('key')` → Check if a value exists.
- `query('key')` → Get data from the URL query string.
- `only([...])` → Get only selected fields.
- `except([...])` → Get all except selected fields.
- `method()` → Get the HTTP method (GET, POST).

---

## 6. What is HTTP (Hypertext Transfer Protocol)?

- HTTP is the protocol used for communication between a client and a server.
- It works using request → response:
  - Client sends a request (GET, POST, etc.).
  - Server sends back data (HTML, JSON, files).
- Requests and responses include headers, body, cookies, and status codes.

---

## 7. Difference between input() and query()

- `input()` → Gets data from any source (form, JSON, URL).
- `query()` → Gets data only from the URL query string. Use when you specifically want URL parameters.

```php
$request->input('name');   // form, JSON, or URL
$request->query('sort');   // URL only: ?sort=asc
```

---

## 8. What is redirecting in Laravel?

- Redirecting sends the user to another page or route.
- Use `redirect()` or the `Redirect` facade.
- You can redirect to a URL, a named route, or the previous page.
- You can also add flash messages for notifications.

```php
return redirect('/home');
return redirect()->route('dashboard');
return redirect()->back()->with('success', 'Saved!');
```

---

## 9. What is flashing data to the session?

- Flashing data means saving data in the session for one request only.
- Commonly used for success, error, or info messages.
- The data is automatically removed after it is shown once.

```php
session()->flash('message', 'Profile updated!');
// or
return redirect()->route('home')->with('message', 'Profile updated!');
```

---

## 10. What are route parameters?

- Route parameters are dynamic values taken from the URL.
- They are defined using curly braces `{}` in routes.
- Laravel automatically sends them to the controller method.

```php
Route::get('/users/{id}', [UserController::class, 'show']);
Route::get('/products/{product:slug}', [ProductController::class, 'show']);
```

---

## 11. Difference between required and optional route parameters

- **Required** route parameters must be present in the URL, otherwise the route will not match.

```php
Route::get('/posts/{id}', [PostController::class, 'show']);
```

- **Optional** route parameters are marked with `?` and may be omitted.
- Optional parameters must have a default value in the controller method.

```php
Route::get('/users/{name?}', [UserController::class, 'show']);

public function show($name = 'Guest') { ... }
```

---

## 12. What are route groups?

- Route groups let you apply the same settings to many routes at once.
- You can share middleware, URL prefix, and namespaces.
- Keeps routes clean, organized, and avoids repeating code.

```php
Route::middleware(['auth'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'index']);
    Route::get('/users', [AdminController::class, 'users']);
});
```

---

## 13. What is route prefixing?

- Route prefixing adds the same URL segment to multiple routes.
- Usually used to group related routes together.
- Very useful for APIs, admin panels, or versioning.

```php
Route::prefix('api/v1')->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/posts', [PostController::class, 'index']);
});
```

---

## 14. What is route model binding?

- Route model binding automatically provides a model instance to your route.
- Laravel finds the model based on the route parameter.
- Removes the need to manually query the database for the model.

```php
// Without binding
Route::get('/users/{id}', function ($id) {
    $user = User::findOrFail($id);
});

// With binding (automatic)
Route::get('/users/{user}', function (User $user) {
    return $user;
});
```

---

## 15. What is implicit vs explicit route model binding?

- **Implicit**: Laravel automatically finds the model using the type-hinted parameter name.

```php
Route::get('/users/{user}', fn (User $user) => $user);
```

- **Explicit**: You define how Laravel should resolve the model in `RouteServiceProvider` or using `Route::bind()`.

```php
Route::bind('user', function ($value) {
    return User::where('username', $value)->firstOrFail();
});
```

---

## 16. What is rate limiting in Laravel?

- Rate limiting controls how many requests a user can make in a set time.
- Helps prevent abuse and protects the server from overload (like DDoS attacks).
- Applied to routes using middleware.

```php
Route::middleware(['throttle:60,1'])->group(function () {
    Route::get('/api/data', [DataController::class, 'index']);
});
```

---

## 17. What is the request lifecycle?

1. **Client → `public/index.php`** — Entry point, loaded first.
2. **App bootstraps** — Autoload + create app instance.
3. **HTTP Kernel runs** — Middleware stack starts.
4. **Global middleware runs** — (TrustProxies, HandleCors, TrimStrings, etc.)
5. **Route middleware runs** — (Auth, Role, Permissions, etc.) — if all pass, continue.
6. **Router finds matching route.**
7. **Controller (or route closure) executes your logic.**
8. **Response is sent back to client.**
