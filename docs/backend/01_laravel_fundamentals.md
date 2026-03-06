# Laravel Fundamentals Guide

A comprehensive guide to Laravel core concepts, architecture, and advanced features.

## Table of Contents

1. [What is Laravel?](#1-what-is-laravel)
2. [What are the main features of Laravel?](#2-what-are-the-main-features-of-laravel)
3. [What is Composer and why is it used in Laravel?](#3-what-is-composer-and-why-is-it-used-in-laravel)
4. [What is Artisan?](#4-what-is-artisan)
5. [What are Laravel Collections?](#5-what-are-laravel-collections)
6. [What is the Service Container?](#6-what-is-the-service-container)
7. [How does Interface Binding work in the Service Container?](#7-how-does-interface-binding-work-in-the-service-container)
8. [What is Coupling and Decoupling?](#8-what-is-coupling-and-decoupling)
9. [What are Service Providers?](#9-what-are-service-providers)
10. [What is IoC (Inversion of Control)?](#10-what-is-ioc-inversion-of-control)
11. [What is Dependency Injection?](#11-what-is-dependency-injection)
12. [What are Facades in Laravel?](#12-what-are-facades-in-laravel)
13. [What is the difference between a Facade and a helper function?](#13-what-is-the-difference-between-a-facade-and-a-helper-function)
14. [What is Laravel Telescope?](#14-what-is-laravel-telescope)
15. [What is Laravel Tinker?](#15-what-is-laravel-tinker)
16. [What are Laravel Events?](#16-what-are-laravel-events)
17. [Difference between Events and Observers](#17-difference-between-events-and-observers)
18. [What are Event Listeners?](#18-what-are-event-listeners)
19. [What are Laravel Queues?](#19-what-are-laravel-queues)
20. [What are Jobs in Laravel?](#20-what-are-jobs-in-laravel)
21. [Difference between sync and queue drivers](#21-difference-between-sync-and-queue-drivers)
22. [What is a queue worker?](#22-what-is-a-queue-worker)
23. [What are failed jobs?](#23-what-are-failed-jobs)
24. [What is Laravel caching?](#24-what-is-laravel-caching)
25. [What are Laravel Contracts?](#25-what-are-laravel-contracts)

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

**Without Service Container (Manual Way):**

You manually create the object using `new`.

```php
class OrderController extends Controller
{
    public function store()
    {
        // ❌ You create the object yourself
        $payment = new PaymentService();
        $payment->charge(100);
    }
}
```

**Problems with this:**
- Controller is tightly coupled to `PaymentService`
- Hard to swap with a different payment provider
- Difficult to test (can't mock `PaymentService`)

**With Service Container (Automatic Way):**

Laravel sees the type-hint, creates the object, and injects it for you.

```php
class OrderController extends Controller
{
    // ✅ Laravel automatically creates and injects PaymentService
    public function store(PaymentService $payment)
    {
        $payment->charge(100);
    }
}
```

**What happens behind the scenes:**
1. Laravel sees `PaymentService` in the method signature
2. It automatically creates a `PaymentService` instance
3. It injects it into your controller
4. You never wrote `new PaymentService()` — Laravel did it for you

**Why this matters:**
- Keeps your code clean and decoupled
- Makes testing easier (you can mock dependencies)
- Allows swapping implementations easily (e.g., switch from Stripe to PayPal)

```php
// Swap implementation without changing controller code
app()->bind(PaymentService::class, PayPalPaymentService::class);
```

---

## 7. How does Interface Binding work in the Service Container?

### Step 1: What is an Interface?

An interface is just a **contract** — it defines what methods a class must have, but contains no real code.

```php
interface PaymentInterface
{
    public function pay($amount);
}
```

This only says: any class that implements me **must** have a `pay()` method.

But an interface has no real code inside it. You cannot create it directly:

```php
new PaymentInterface(); // ❌ This will NOT work
```

It's just a rule.

### Step 2: Real Classes That Implement It

```php
class StripePayment implements PaymentInterface
{
    public function pay($amount)
    {
        // Stripe logic
    }
}

class PaypalPayment implements PaymentInterface
{
    public function pay($amount)
    {
        // Paypal logic
    }
}
```

Now we have real working classes that follow the contract.

### Step 3: The Problem

Imagine your controller type-hints the interface:

```php
class OrderController
{
    public function __construct(PaymentInterface $payment)
    {
        $this->payment = $payment;
    }
}
```

Laravel sees: "This controller needs `PaymentInterface`."

But Laravel gets confused because:
- `PaymentInterface` is **not a real class** — it cannot be created
- Laravel doesn't know whether to use `StripePayment` or `PaypalPayment`

So Laravel needs instructions.

### Step 4: The Solution (Binding)

Inside a Service Provider, you tell Laravel which class to use:

```php
$this->app->bind(
    PaymentInterface::class,
    StripePayment::class
);
```

Now you are telling Laravel: "Whenever someone asks for `PaymentInterface`, give them `StripePayment`."

So when Laravel builds `OrderController`, it will automatically create `new StripePayment()` and inject it.

### Step 5: Why Is This Powerful?

Later you can switch to PayPal by changing **only one line**:

```php
$this->app->bind(
    PaymentInterface::class,
    PaypalPayment::class  // ← Changed only here
);
```

You don't touch your controller at all. This is called the **Dependency Inversion Principle** — your code depends on abstractions (interfaces), not concrete classes.

---

## 8. What is Coupling and Decoupling?

**Coupling** = how strongly one class depends on another class.

### Tight Coupling (Bad)

When a class is directly tied to a specific class:

```php
// ❌ Tight coupling
class OrderController
{
    protected $payment;

    public function __construct()
    {
        $this->payment = new StripePayment();
    }
}
```

**The problem:**
- `OrderController` is directly tied to `StripePayment`
- If you want to switch to PayPal, you **must** change the controller
- The controller is strongly connected to one specific class
- Hard to test — you can't easily swap in a mock

### Loose Coupling / Decoupling (Good)

**Decoupling** = reducing direct dependency between classes by depending on an abstraction (interface) instead of a concrete class.

```php
// ✅ Loose coupling (decoupled)
class OrderController
{
    protected $payment;

    public function __construct(PaymentInterface $payment)
    {
        $this->payment = $payment;
    }
}
```

**What changed:**
- The controller does **not** know about Stripe
- The controller does **not** know about PayPal
- It only knows: "I need something that can process payments"
- Laravel decides which real class to inject

### Comparison

**Tight Coupling:**

- **Depends on** — Concrete class (`StripePayment`)
- **Swap implementation** — Must change class code
- **Testing** — Hard to mock
- **Flexibility** — Low
- **Maintenance** — Changes ripple through code

**Loose Coupling:**

- **Depends on** — Abstraction (`PaymentInterface`)
- **Swap implementation** — Change only the binding
- **Testing** — Easy to mock
- **Flexibility** — High
- **Maintenance** — Changes are isolated

**Rule of thumb:** If you see `new SomeClass()` inside a controller or service, that's a sign of tight coupling. Use dependency injection and interfaces instead.

---

## 9. What are Service Providers?

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

## 10. What is IoC (Inversion of Control)?

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

## 11. What is Dependency Injection?

- Instead of a class creating its own dependencies, they are given to it from the outside.
- The service container automatically provides the needed objects when you type-hint them.
- Makes code cleaner, easier to test, and easier to change.

---

## 12. What are Facades in Laravel?

- Facades let you use Laravel services without manually creating instances.
- Behind the scenes, they use the service container to get the class.
- Makes code cleaner and easier to read.
- Examples: `Cache`, `DB`, `Mail`, `Storage`, etc.

---

## 13. What is the difference between a Facade and a helper function?

- **Facades**: Use a class via the service container; easier to test and mock.
- **Helper functions**: Simple global functions; call things directly; good for quick shortcuts.

---

## 14. What is Laravel Telescope?

- Telescope is a debugging and monitoring tool for Laravel.
- Shows requests, errors, database queries, jobs, and more.
- Helps debug and monitor your app during development.

---

## 15. What is Laravel Tinker?

- Tinker lets you interact with your Laravel app via the command line.
- Useful for testing code, querying the database, and debugging.

---

## 16. What are Laravel Events?

- An event is something that happens in your app (e.g., user registered, order placed).
- Based on the Observer pattern — one event, many listeners.
- Why they're useful:
  - Keep code clean and organized.
  - Avoid putting too much logic in controllers.
  - Easy to add new behavior without changing existing code.

In short: Laravel events let your app react when something happens.

---

## 17. Difference between Events and Observers

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

## 18. What are Event Listeners?

- Event listeners are the code that runs when an event happens.
- **Event** = something happened. Example: User registered.
- **Listener** = what to do when it happens. Example: Send email, log activity.
- Laravel automatically runs all listeners attached to that event.

---

## 19. What are Laravel Queues?

- Queues let you run slow tasks in the background, not during the user request.
- Instead of making the user wait, Laravel responds immediately and processes the task later.
- This makes the app feel faster and smoother.
- Common background tasks: Sending emails, generating reports.
- Laravel supports different queue drivers: Database, Redis.

In short: Queues do heavy work later so users don't wait now.

---

## 20. What are Jobs in Laravel?

- A Job is a class that represents one task your app needs to do.
- You send (dispatch) the job, and Laravel runs it in the background or immediately.
- Jobs are usually used with queues for slow tasks.
- Common examples: Send an email, Process an order, Resize an image, Generate a report.

```php
dispatch(new SomeJob());
```

- You can control which queue it runs on, when it runs (delay), and which connection it uses.

In short: Jobs = the tasks, Queues = where and when they run.

**Dispatch vs Send — What is the difference?**

- **Send** = You are performing the action **immediately and directly**.
  - You are doing the work yourself, right now.
  - Example: You personally deliver a letter to someone's door.

- **Dispatch** = You are **triggering something to be handled somewhere else**.
  - You are not doing the work directly — you hand it off.
  - Example: You drop a letter at the post office — someone else delivers it.

```php
// Send = "I am doing this now."
Mail::send('welcome', $data, function ($message) {
    $message->to('user@example.com');
});
// The email is sent immediately during the request.

// Dispatch = "System, handle this."
dispatch(new SendWelcomeEmail($user));
// The job is pushed to the queue — a worker handles it later.
```

- **Send** → Direct, synchronous, the user waits.
- **Dispatch** → Indirect, asynchronous, the user does not wait.
- In Laravel, you **dispatch** jobs to the queue, and the queue worker **processes** them in the background.

---

## 21. Difference between sync and queue drivers

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

## 22. What is a queue worker?

- A queue worker is a background process that runs queued jobs.
- It watches the queue, takes jobs one by one, and executes them.
- Analogy: Like a helper in your app who quietly works on tasks while you continue using the app.

---

## 23. What are failed jobs?

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

## 24. What is Laravel caching?

- Caching temporarily stores data that your app uses often to make it faster.
- Reduces repeated database queries or heavy calculations.
- Laravel supports many cache backends: file, database, Redis, Memcached, etc.
  - `Cache::put()`: Stores a value for a specified duration.
  - `Cache::forever()`: Stores a value permanently until manually removed.
  - `Cache::remember()`: Retrieves a cached value or executes a callback and caches the result.

**Types of Cache:**

- **File Cache** — Stores data in files on the server disk. Best for local development.
- **Database Cache** — Stores cached data in database tables. Best when Redis is not available.
- **Redis Cache** — Stores data in memory (RAM), very fast. Best for production, high traffic.

---

## 25. What are Laravel Contracts?

- A contract in Laravel is like a promise or rule that says: "Any class that does this service must have these methods."
- It doesn't do the work itself — it just defines what should be done.
- Examples:
  - Mail contract → says `send()` method must exist.

In short: A contract is like a job description. It tells "what the class must do," but not how it does it.
