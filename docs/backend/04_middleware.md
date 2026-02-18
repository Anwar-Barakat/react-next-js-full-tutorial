# Laravel Middleware Guide

A comprehensive guide to middleware, proxies, and request filtering in Laravel.

## Table of Contents

1. [What is middleware in Laravel?](#1-what-is-middleware-in-laravel)
2. [How do you create custom middleware?](#2-how-do-you-create-custom-middleware)
3. [What are the types of middleware in Laravel?](#3-what-are-the-types-of-middleware-in-laravel)
4. [What is "before" middleware?](#4-what-is-before-middleware)
5. [What is "after" middleware?](#5-what-is-after-middleware)
6. [How Laravel decides before vs after](#6-how-laravel-decides-before-vs-after)
7. [What is a Proxy?](#7-what-is-a-proxy)
8. [Why are proxies used?](#8-why-are-proxies-used)
9. [What is Cloudflare?](#9-what-is-cloudflare)

---

## 1. What is middleware in Laravel?

- Middleware is a filter that runs before or after a request reaches your controller.
- It decides if the request is allowed, modified, or blocked.
- Sits between the user request and the controller.
- Common uses: check authentication, check permissions, handle CORS, log requests.

> Middleware = a gate that checks the request before it enters the app.

---

## 2. How do you create custom middleware?

```bash
php artisan make:middleware CheckAge
```

```php
class CheckAge
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->age < 18) {
            return redirect('home');
        }

        return $next($request);
    }
}
```

Register it in `bootstrap/app.php` (Laravel 11+) or `app/Http/Kernel.php` (Laravel 10).

---

## 3. What are the types of middleware in Laravel?

**Global Middleware** — Runs on every request:
- `TrustProxies` – Finds the real IP of the user, even if behind a proxy.
- `HandleCors` – Allows your app to safely accept requests from other websites.
- `PreventRequestsDuringMaintenance` – Stops visitors when the app is in maintenance mode.
- `TrimStrings` – Removes extra spaces from user input.

**Middleware Groups** — A set of middleware applied together to routes:
- `web` group → for normal website pages (handles sessions, CSRF protection, cookies).
  - `StartSession` – Starts the session so you can store/retrieve session data.
  - `VerifyCsrfToken` – Protects forms from cross-site request forgery.
- `api` group → for API routes (limits requests, no sessions).
  - `ThrottleRequests` – Limits the number of requests per minute to prevent abuse.
  - `SubstituteBindings` – Resolves route parameters to models automatically.

**Route Middleware** — Applied to specific routes or route groups.

**In short:**
- `web` → stateful, uses sessions, cookies, CSRF, for web pages.
- `api` → stateless, uses throttling, no sessions, for APIs.

---

## 4. What is "before" middleware?

- Runs before your controller or app logic.
- Used to check or block the request.
- If it fails, the request never reaches the controller.
- Example: `auth` → checks if the user is logged in.

> Like a security guard at the door checking ID before letting you in.

```php
public function handle(Request $request, Closure $next): Response
{
    // Before logic runs here
    if (!auth()->check()) {
        return redirect('login');
    }

    return $next($request); // passes to controller
}
```

---

## 5. What is "after" middleware?

- Runs after the controller has finished.
- Used to modify or log the response.
- The request already succeeded.
- Example: Add security headers to the response.

> Like a security camera recording what happened after you entered.

```php
public function handle(Request $request, Closure $next): Response
{
    $response = $next($request); // controller runs first

    // After logic runs here
    $response->headers->set('X-Content-Type-Options', 'nosniff');

    return $response;
}
```

---

## 6. How Laravel decides before vs after

- It depends on where `$next($request)` is placed in the middleware class.
- **Before middleware** → logic is placed before `$next($request)`.
- **After middleware** → logic is placed after `$next($request)`.

---

## 7. What is a Proxy?

- A proxy is a middleman between a user and a server.
- Your request does not go directly to the website.
- It goes through the proxy first, then to the website.

> You → Proxy → Website → Proxy → You

---

## 8. Why are proxies used?

- Hide your real IP address (privacy & security).
- Cache responses to make websites load faster.
- Filter or block content (schools, companies).

---

## 9. What is Cloudflare?

- Cloudflare is a service that sits between your website and its visitors.
- Visitors connect to Cloudflare, which acts as a proxy to your server.
- It blocks hackers, bots, and DDoS attacks.
- Makes your site faster — saves copies of pages (cache) and serves them from nearby locations.

> User → Cloudflare → Your Server → Cloudflare → User
