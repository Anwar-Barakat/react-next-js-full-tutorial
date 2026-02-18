# Architecture Patterns Guide

A comprehensive guide to Event-Driven Architecture and Modular Monolith design in Laravel.

## Table of Contents

1. [What is Event-Driven Architecture?](#1-what-is-event-driven-architecture)
2. [How Laravel implements Event-Driven Architecture](#2-how-laravel-implements-event-driven-architecture)
3. [Events and Listeners in Laravel](#3-events-and-listeners-in-laravel)
4. [Asynchronous Event Handling with Queues](#4-asynchronous-event-handling-with-queues)
5. [When to use Event-Driven Architecture](#5-when-to-use-event-driven-architecture)
6. [What is a Modular Monolith?](#6-what-is-a-modular-monolith)
7. [Modular Monolith vs Microservices vs Standard Monolith](#7-modular-monolith-vs-microservices-vs-standard-monolith)
8. [Module Structure in Laravel](#8-module-structure-in-laravel)
9. [Module Communication](#9-module-communication)
10. [When to use Modular Monolith](#10-when-to-use-modular-monolith)

---

## 1. What is Event-Driven Architecture?

- Event-Driven Architecture (EDA) is a design pattern where components communicate by **producing and consuming events**.
- An **event** is something that happened in the system: `UserRegistered`, `OrderPlaced`, `PaymentFailed`.
- The producer (emitter) does not know who listens — it just fires the event.
- Multiple **listeners** can react to the same event independently.

**Key benefit:** Loose coupling — the class that fires the event does not care what happens next.

```
User registers
   ↓
UserRegistered event fired
   ↓
┌──────────────────────────────┐
│  SendWelcomeEmail (listener) │
│  CreateUserProfile (listener)│
│  NotifyAdmin (listener)      │
└──────────────────────────────┘
```

Without EDA:
```php
// Controller doing too many things ❌
public function register(Request $request) {
    $user = User::create($request->all());
    Mail::to($user)->send(new WelcomeMail());     // tightly coupled
    Profile::create(['user_id' => $user->id]);    // tightly coupled
    Notification::send($admin, new NewUser());    // tightly coupled
}
```

With EDA:
```php
// Controller only fires an event ✅
public function register(Request $request) {
    $user = User::create($request->all());
    event(new UserRegistered($user));  // all side effects handled elsewhere
}
```

In short: EDA decouples side effects from the main action — each listener handles one responsibility independently.

---

## 2. How Laravel implements Event-Driven Architecture

Laravel has a first-class event system:

| Component | Role |
|-----------|------|
| **Event** | A plain PHP class that represents something that happened |
| **Listener** | A class that handles an event when it fires |
| **Observer** | Automatically fires events based on Eloquent model lifecycle |
| **Queue** | Runs listeners asynchronously in the background |

**Create an event and listener:**

```bash
php artisan make:event UserRegistered
php artisan make:listener SendWelcomeEmail --event=UserRegistered
php artisan make:listener CreateUserProfile --event=UserRegistered
```

**Register them** in `EventServiceProvider` (Laravel 10) or `AppServiceProvider` (Laravel 11+):

```php
// Laravel 11+ — AppServiceProvider
use App\Events\UserRegistered;
use App\Listeners\SendWelcomeEmail;
use App\Listeners\CreateUserProfile;

public function boot(): void
{
    Event::listen(UserRegistered::class, SendWelcomeEmail::class);
    Event::listen(UserRegistered::class, CreateUserProfile::class);
}
```

---

## 3. Events and Listeners in Laravel

**Event class:**

```php
// app/Events/UserRegistered.php
class UserRegistered
{
    public function __construct(
        public readonly User $user
    ) {}
}
```

**Listener class:**

```php
// app/Listeners/SendWelcomeEmail.php
class SendWelcomeEmail implements ShouldQueue  // run async via queue
{
    public function handle(UserRegistered $event): void
    {
        Mail::to($event->user->email)->send(new WelcomeMail($event->user));
    }
}

// app/Listeners/CreateUserProfile.php
class CreateUserProfile
{
    public function handle(UserRegistered $event): void
    {
        Profile::create(['user_id' => $event->user->id]);
    }
}
```

**Fire the event:**

```php
// In controller, service, or job
event(new UserRegistered($user));

// Or using the Event facade
Event::dispatch(new UserRegistered($user));
```

**Model Observers** — automatically fire events on Eloquent lifecycle:

```php
php artisan make:observer UserObserver --model=User

class UserObserver
{
    public function created(User $user): void
    {
        event(new UserRegistered($user));
    }

    public function deleted(User $user): void
    {
        event(new UserDeleted($user));
    }
}

// Register in AppServiceProvider
User::observe(UserObserver::class);
```

---

## 4. Asynchronous Event Handling with Queues

- Listeners that implement `ShouldQueue` run in the background via the queue system.
- The main request completes immediately — the listener runs later.

```php
class SendWelcomeEmail implements ShouldQueue
{
    public string $queue = 'emails';   // target queue
    public int    $tries = 3;          // retry 3 times on failure
    public int    $timeout = 30;       // timeout in seconds

    public function handle(UserRegistered $event): void
    {
        Mail::to($event->user->email)->send(new WelcomeMail($event->user));
    }

    // What to do if all retries fail
    public function failed(UserRegistered $event, \Throwable $exception): void
    {
        Log::error("Failed to send welcome email to {$event->user->email}");
    }
}
```

**Processing the queue:**

```bash
php artisan queue:work
php artisan queue:work --queue=emails
```

In short: Async listeners keep your HTTP responses fast — heavy work happens in the background.

---

## 5. When to use Event-Driven Architecture

**Use EDA when:**
- Multiple things should happen after a single action (order placed → email + stock update + analytics).
- Side effects should not block the main request.
- You want to add new behavior without touching existing code (Open/Closed Principle).
- You need audit logs, notifications, or webhooks triggered by business events.

**Avoid EDA when:**
- The flow is simple with only one side effect — just call it directly.
- You need strict ordering or transactions across listeners.
- Debugging complexity outweighs the decoupling benefit.

| Scenario | Recommendation |
|----------|---------------|
| User registers → send welcome email | ✅ EDA — async listener |
| Order placed → 5 different side effects | ✅ EDA — multiple listeners |
| Update user name → just save to DB | ❌ Direct call — EDA is overkill |
| Payment failed → retry + alert + log | ✅ EDA — async, separate concerns |

---

## 6. What is a Modular Monolith?

- A **Modular Monolith** is a single deployable application (monolith) that is internally organized into **isolated modules**.
- Each module owns its own models, controllers, services, routes, and migrations.
- Modules communicate through well-defined interfaces — not direct class calls across module boundaries.

**The problem it solves:**
- Standard monolith: all code in one flat structure → becomes a "big ball of mud" as it grows.
- Microservices: separate deployable services → complex networking, DevOps overhead, distributed system challenges.
- Modular Monolith: structure of microservices, simplicity of a monolith.

```
Standard Monolith           Modular Monolith               Microservices
─────────────────          ──────────────────────          ──────────────────
app/                       modules/                         users-service/
  Models/                    Users/                         orders-service/
  Controllers/                 Models/                      payments-service/
  Services/                    Controllers/                 inventory-service/
  (everything mixed)           Services/
                               Routes/
                             Orders/
                             Payments/
                             (clean boundaries)
```

In short: Modular Monolith gives you clean module boundaries without the complexity of microservices.

---

## 7. Modular Monolith vs Microservices vs Standard Monolith

| Feature | Standard Monolith | Modular Monolith | Microservices |
|---------|------------------|-----------------|---------------|
| **Deployment** | Single app | Single app | Multiple services |
| **Code structure** | Flat, mixed | Organized modules | Separate codebases |
| **Boundaries** | Weak / none | Strong (enforced) | Hard (network) |
| **Communication** | Direct calls | Events / interfaces | HTTP / gRPC / MQ |
| **Database** | Shared | Can be shared or per-module | Separate per service |
| **Scalability** | Scale whole app | Scale whole app | Scale independently |
| **Complexity** | Low | Medium | High |
| **Team size** | Solo / small | Small to medium | Large / multiple teams |
| **Migration path** | Hard to split | Easy to extract modules | Already split |

**Modular Monolith is the best of both worlds** — clean architecture without distributed system complexity.

---

## 8. Module Structure in Laravel

A typical module structure in Laravel:

```
app/
└── Modules/
    ├── User/
    │   ├── Controllers/
    │   │   └── UserController.php
    │   ├── Models/
    │   │   └── User.php
    │   ├── Services/
    │   │   └── UserService.php
    │   ├── Repositories/
    │   │   └── UserRepository.php
    │   ├── Events/
    │   │   └── UserRegistered.php
    │   ├── Listeners/
    │   │   └── SendWelcomeEmail.php
    │   ├── Requests/
    │   │   └── StoreUserRequest.php
    │   ├── Resources/
    │   │   └── UserResource.php
    │   ├── routes.php
    │   └── UserServiceProvider.php
    │
    ├── Order/
    │   ├── Controllers/
    │   ├── Models/
    │   ├── Services/
    │   ├── Events/
    │   └── OrderServiceProvider.php
    │
    └── Payment/
        ├── Controllers/
        ├── Services/
        │   ├── StripeService.php
        │   └── MamoPayService.php
        ├── Events/
        │   └── PaymentProcessed.php
        └── PaymentServiceProvider.php
```

**Module Service Provider:**

```php
// app/Modules/User/UserServiceProvider.php
class UserServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            UserRepositoryInterface::class,
            UserRepository::class
        );
    }

    public function boot(): void
    {
        // Load module routes
        $this->loadRoutesFrom(__DIR__ . '/routes.php');

        // Load module migrations
        $this->loadMigrationsFrom(__DIR__ . '/../../database/migrations/user');

        // Register event listeners for this module
        Event::listen(UserRegistered::class, SendWelcomeEmail::class);
    }
}
```

**Register module providers in `config/app.php`:**

```php
'providers' => [
    App\Modules\User\UserServiceProvider::class,
    App\Modules\Order\OrderServiceProvider::class,
    App\Modules\Payment\PaymentServiceProvider::class,
],
```

---

## 9. Module Communication

**Rule:** Modules must NOT directly import classes from other modules.

**Wrong:**
```php
// ❌ Order module directly imports User model from User module
use App\Modules\User\Models\User;

class OrderService {
    public function getOrdersByUser(int $userId): Collection {
        $user = User::findOrFail($userId);  // tight coupling ❌
        return $user->orders;
    }
}
```

**Correct — communicate through events:**

```php
// ✅ Order module fires an event — User module listens
// In Order module
class OrderService {
    public function placeOrder(int $userId, array $items): Order {
        $order = Order::create(['user_id' => $userId, ...]);
        event(new OrderPlaced($order));  // fire event ✅
        return $order;
    }
}

// In User module — listens to the event
class UpdateUserOrderCount {
    public function handle(OrderPlaced $event): void {
        User::where('id', $event->order->user_id)
            ->increment('orders_count');
    }
}
```

**Correct — communicate through interfaces (contracts):**

```php
// Shared contract in app/Contracts/
interface UserServiceInterface {
    public function findById(int $id): ?array;
}

// User module implements it
class UserService implements UserServiceInterface {
    public function findById(int $id): ?array {
        return User::find($id)?->only(['id', 'name', 'email']);
    }
}

// Order module depends only on the interface
class OrderService {
    public function __construct(private UserServiceInterface $users) {}

    public function getOrdersForUser(int $userId): Collection {
        $user = $this->users->findById($userId);  // uses interface ✅
        return Order::where('user_id', $userId)->get();
    }
}
```

---

## 10. When to use Modular Monolith

**Use Modular Monolith when:**
- Your app is growing and becoming hard to navigate.
- You work in a team and need clear ownership of business domains.
- You want to prepare for potential future extraction into microservices.
- You need clean architecture without the DevOps overhead of microservices.

**Avoid Modular Monolith when:**
- The app is small and simple — it adds unnecessary structure.
- Different parts of the system need to scale independently right now.
- Teams are large enough and ready for true microservices.

**Migration path:**

```
Simple Monolith → Modular Monolith → (optional) Microservices

1. Start as a simple Laravel app
2. As domains emerge (User, Order, Payment), organize into modules
3. If a module needs to scale separately or be owned by a different team → extract to a microservice
```

In short: Modular Monolith is the right architecture for most growing Laravel apps — clean boundaries, simple deployment, easy to evolve.
