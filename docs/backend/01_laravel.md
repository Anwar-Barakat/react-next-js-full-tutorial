# Laravel Fundamentals Guide

A comprehensive guide to Laravel core concepts, architecture, and advanced features.

## Table of Contents

1. [What is Laravel?](#1-what-is-laravel)
2. [What are the main features of Laravel?](#2-what-are-the-main-features-of-laravel)
3. [What is Composer and why is it used in Laravel?](#3-what-is-composer-and-why-is-it-used-in-laravel)
4. [What is Artisan?](#4-what-is-artisan)
5. [What are Laravel Collections?](#5-what-are-laravel-collections)
6. [What is the Service Container?](#6-what-is-the-service-container)
7. [What are Service Providers?](#7-what-are-service-providers)
8. [What is IoC (Inversion of Control)?](#8-what-is-ioc-inversion-of-control)
9. [What is Dependency Injection?](#9-what-is-dependency-injection)
10. [What are Facades in Laravel?](#10-what-are-facades-in-laravel)
11. [What is the difference between a Facade and a helper function?](#11-what-is-the-difference-between-a-facade-and-a-helper-function)
12. [What is Laravel Telescope?](#12-what-is-laravel-telescope)
13. [What is Laravel Tinker?](#13-what-is-laravel-tinker)
14. [What are Laravel Events?](#14-what-are-laravel-events)
15. [Difference between Events and Observers](#15-difference-between-events-and-observers)
16. [What are Event Listeners?](#16-what-are-event-listeners)
17. [What are Laravel Queues?](#17-what-are-laravel-queues)
18. [What are Jobs in Laravel?](#18-what-are-jobs-in-laravel)
19. [Difference between sync and queue drivers](#19-difference-between-sync-and-queue-drivers)
20. [What is a queue worker?](#20-what-is-a-queue-worker)
21. [What are failed jobs?](#21-what-are-failed-jobs)
22. [What is Laravel caching?](#22-what-is-laravel-caching)
23. [What are Laravel Contracts?](#23-what-are-laravel-contracts)

---

## 1. What is Laravel?

- Laravel is a free and open-source PHP framework.
- Follows the MVC (Model–View–Controller) architecture.
- Designed to simplify web development with clean, elegant syntax.
- Includes built-in features such as routing, authentication, sessions, and caching.

---

## 2. What are the main features of Laravel?

- Eloquent ORM for database operations.
- Blade templating engine for clean and reusable views.
- Artisan command-line interface for task automation.
- Database migration and seeding for easy schema management.
- Authentication and authorization built-in.
- Routing system for defining web and API routes.
- Middleware for request filtering and security.
- Queue management for background jobs.
- Task scheduling to automate periodic tasks.
- Built-in testing support for unit and feature tests.

---

## 3. What is Composer and why is it used in Laravel?

- Composer is a dependency management tool for PHP.
- Allows developers to easily install, update, and autoload libraries required for the application.

---

## 4. What is Artisan?

- Artisan is Laravel's built-in command-line interface used to automate common development tasks.
- Allows creating controllers, models, and migrations quickly via commands.

---

## 5. What are Laravel Collections?

- Powerful wrapper objects around arrays that provide chainable methods for manipulating data.
- They give you dozens of helpful methods (like `map`, `filter`, `pluck`, `sum`, `first`, `count`, etc.).
- These methods allow you to transform and work with data easily.

---

## 6. What is the Service Container?

- A tool in Laravel that creates and provides objects to your classes automatically.
- Also called the IoC (Inversion of Control) container.
- If your class depends on an interface, you must tell Laravel which real class to use.

```php
// Example binding
app()->bind(PaymentInterface::class, StripePayment::class);
```

- `app()` → gives access to the service container.
- `bind()` → tells Laravel: "When someone needs `PaymentInterface`, give them `StripePayment`."
- Any time you type-hint `PaymentInterface`, Laravel automatically gives you a `StripePayment` object.

---

## 7. What are Service Providers?

- Service providers tell Laravel what to set up when the app starts.
- They register services and classes for the app to use.
- They live in the `app/Providers` folder.
- Two main methods:
  - `register()` → Add classes to the service container (only registering classes, interfaces, or services).
  - `boot()` → Runs after all providers have been registered. Used for routes, events, observers.
- The place where you tell Laravel which classes should be added to the service container.

**Key distinction:**
- Service Container = a box that holds objects.
- Service Provider = the file that puts objects into the box.

---

## 8. What is IoC (Inversion of Control)?

- IoC is just another name for Laravel's service container.
- Your code does NOT create objects by itself — Laravel creates them for you.

**Before IoC:**
```php
$userService = new UserService(); // You decide how the object is created
```

**With IoC:**
```php
function __construct(protected UserService $userService) {}
// You don't create UserService — Laravel creates it and gives it to you
```

- Control moves from you → Laravel.
- IoC = Laravel creates objects.
- Service Container = where it stores them.
- Service Provider = where you tell Laravel what to create.

---

## 9. What is Dependency Injection?

- Instead of a class creating its own dependencies, they are given to it from the outside.
- The service container automatically provides the needed objects when you type-hint them.
- Makes code cleaner, easier to test, and easier to change.

---

## 10. What are Facades in Laravel?

- Facades let you use Laravel services without manually creating instances.
- Behind the scenes, they use the service container to get the class.
- Makes code cleaner and easier to read.
- Examples: `Cache`, `DB`, `Mail`, `Storage`, etc.

---

## 11. What is the difference between a Facade and a helper function?

- **Facades**: Use a class via the service container; easier to test and mock.
- **Helper functions**: Simple global functions; call things directly; good for quick shortcuts.

---

## 12. What is Laravel Telescope?

- Telescope is a debugging and monitoring tool for Laravel.
- Shows requests, errors, database queries, jobs, and more.
- Helps debug and monitor your app during development.

---

## 13. What is Laravel Tinker?

- Tinker lets you interact with your Laravel app via the command line.
- Useful for testing code, querying the database, and debugging.

---

## 14. What are Laravel Events?

- An event is something that happens in your app (e.g., user registered, order placed).
- Based on the Observer pattern — one event, many listeners.
- Why they're useful:
  - Keep code clean and organized.
  - Avoid putting too much logic in controllers.
  - Easy to add new behavior without changing existing code.

In short: Laravel events let your app react when something happens.

---

## 15. Difference between Events and Observers

- **Events**
  - Used for any action in your app.
  - You fire them manually.
  - Example: `UserRegistered`, `OrderPlaced`.

- **Observers**
  - Used only with Eloquent models.
  - Laravel fires them automatically.
  - Triggered on model actions like: `creating`, `created`, `updating`, `deleted`.

In short: Events tell Laravel something happened. Listeners react to it. Observers do the same but only for models.

---

## 16. What are Event Listeners?

- Event listeners are the code that runs when an event happens.
- **Event** = something happened. Example: User registered.
- **Listener** = what to do when it happens. Example: Send email, log activity.
- Laravel automatically runs all listeners attached to that event.

---

## 17. What are Laravel Queues?

- Queues let you run slow tasks in the background, not during the user request.
- Instead of making the user wait, Laravel responds immediately and processes the task later.
- This makes the app feel faster and smoother.
- Common background tasks: Sending emails, generating reports.
- Laravel supports different queue drivers: Database, Redis.

In short: Queues do heavy work later so users don't wait now.

---

## 18. What are Jobs in Laravel?

- A Job is a class that represents one task your app needs to do.
- You send (dispatch) the job, and Laravel runs it in the background or immediately.
- Jobs are usually used with queues for slow tasks.
- Common examples: Send an email, Process an order, Resize an image, Generate a report.

```php
dispatch(new SomeJob());
```

- You can control which queue it runs on, when it runs (delay), and which connection it uses.

In short: Jobs = the tasks, Queues = where and when they run.

---

## 19. Difference between sync and queue drivers

- **sync**
  - Runs the job immediately.
  - Happens during the same request.
  - User waits.
  - Best for local development & testing.

- **queue**
  - Sends the job to the background.
  - A worker processes it later.
  - User does not wait.
  - Best for production and heavy tasks.
  - Queue drivers examples: `database`, `redis`, `sqs`, `beanstalkd`.

---

## 20. What is a queue worker?

- A queue worker is a background process that runs queued jobs.
- It watches the queue, takes jobs one by one, and executes them.
- Analogy: Like a helper in your app who quietly works on tasks while you continue using the app.

---

## 21. What are failed jobs?

- Failed jobs are jobs that didn't complete successfully because an error occurred.
- Laravel stores them in the `failed_jobs` table for tracking.
- You can retry or delete them manually.

```bash
# Retry all failed jobs
php artisan queue:retry all

# Delete a specific failed job
php artisan queue:forget {id}
```

---

## 22. What is Laravel caching?

- Caching temporarily stores data that your app uses often to make it faster.
- Reduces repeated database queries or heavy calculations.
- Laravel supports many cache backends: file, database, Redis, Memcached, etc.
  - `Cache::put()`: Stores a value for a specified duration.
  - `Cache::forever()`: Stores a value permanently until manually removed.
  - `Cache::remember()`: Retrieves a cached value or executes a callback and caches the result.

**Types of Cache:**

| Type | Description | Best For |
|------|-------------|----------|
| **File Cache** | Stores data in files on the server disk | Local development |
| **Database Cache** | Stores cached data in database tables | When Redis is not available |
| **Redis Cache** | Stores data in memory (RAM), very fast | Production, high traffic |

---

## 23. What are Laravel Contracts?

- A contract in Laravel is like a promise or rule that says: "Any class that does this service must have these methods."
- It doesn't do the work itself — it just defines what should be done.
- Examples:
  - Mail contract → says `send()` method must exist.

In short: A contract is like a job description. It tells "what the class must do," but not how it does it.
