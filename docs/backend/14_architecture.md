# Architecture Patterns Guide

A comprehensive guide to architecture patterns every Laravel backend developer should know.

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
11. [Repository Pattern](#11-repository-pattern)
12. [Service Layer Pattern](#12-service-layer-pattern)
13. [Action Pattern](#13-action-pattern)
14. [DTO (Data Transfer Object)](#14-dto-data-transfer-object)
15. [CQRS (Command Query Responsibility Segregation)](#15-cqrs-command-query-responsibility-segregation)
16. [Clean Architecture Overview](#16-clean-architecture-overview)
17. [Dependency Injection in Laravel](#17-dependency-injection-in-laravel)

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

- **Event** — A plain PHP class that represents something that happened
- **Listener** — A class that handles an event when it fires
- **Observer** — Automatically fires events based on Eloquent model lifecycle
- **Queue** — Runs listeners asynchronously in the background

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

- **User registers → send welcome email** — ✅ EDA — async listener
- **Order placed → 5 different side effects** — ✅ EDA — multiple listeners
- **Update user name → just save to DB** — ❌ Direct call — EDA is overkill
- **Payment failed → retry + alert + log** — ✅ EDA — async, separate concerns

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

**Standard Monolith:**
- **Deployment** — Single app
- **Code structure** — Flat, mixed
- **Boundaries** — Weak / none
- **Communication** — Direct calls
- **Database** — Shared
- **Scalability** — Scale whole app
- **Complexity** — Low
- **Team size** — Solo / small
- **Migration path** — Hard to split

**Modular Monolith:**
- **Deployment** — Single app
- **Code structure** — Organized modules
- **Boundaries** — Strong (enforced)
- **Communication** — Events / interfaces
- **Database** — Can be shared or per-module
- **Scalability** — Scale whole app
- **Complexity** — Medium
- **Team size** — Small to medium
- **Migration path** — Easy to extract modules

**Microservices:**
- **Deployment** — Multiple services
- **Code structure** — Separate codebases
- **Boundaries** — Hard (network)
- **Communication** — HTTP / gRPC / MQ
- **Database** — Separate per service
- **Scalability** — Scale independently
- **Complexity** — High
- **Team size** — Large / multiple teams
- **Migration path** — Already split

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

---

## 11. Repository Pattern

- The Repository Pattern **abstracts data access** behind an interface.
- Your controllers and services never call Eloquent directly — they depend on a repository interface.
- This makes it easy to **swap implementations** (e.g., Eloquent to API, cache layer, or test doubles).

**Step 1 — Define the interface (contract):**

```php
// app/Repositories/UserRepositoryInterface.php
interface UserRepositoryInterface
{
    public function findById(int $id): ?User;
    public function findByEmail(string $email): ?User;
    public function create(array $data): User;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
    public function paginate(int $perPage = 15): LengthAwarePaginator;
}
```

**Step 2 — Implement it with Eloquent:**

```php
// app/Repositories/EloquentUserRepository.php
class EloquentUserRepository implements UserRepositoryInterface
{
    public function __construct(private User $model) {}

    public function findById(int $id): ?User
    {
        return $this->model->find($id);
    }

    public function findByEmail(string $email): ?User
    {
        return $this->model->where('email', $email)->first();
    }

    public function create(array $data): User
    {
        return $this->model->create($data);
    }

    public function update(int $id, array $data): bool
    {
        return $this->model->where('id', $id)->update($data);
    }

    public function delete(int $id): bool
    {
        return $this->model->destroy($id);
    }

    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->paginate($perPage);
    }
}
```

**Step 3 — Bind in a service provider:**

```php
// app/Providers/RepositoryServiceProvider.php
class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            UserRepositoryInterface::class,
            EloquentUserRepository::class
        );
    }
}
```

**Step 4 — Use in controller or service:**

```php
class UserController extends Controller
{
    public function __construct(private UserRepositoryInterface $users) {}

    public function show(int $id): JsonResponse
    {
        $user = $this->users->findById($id);
        return response()->json($user);
    }

    public function index(): JsonResponse
    {
        return response()->json($this->users->paginate());
    }
}
```

**When to use vs when it's overkill:**

- **Large app with complex queries** — Use it — keeps controllers clean
- **Multiple data sources (DB + API + cache)** — Use it — swap implementations easily
- **Need to unit test without DB** — Use it — mock the interface
- **Small CRUD app with 5 models** — Skip it — Eloquent directly is fine
- **Prototype / MVP** — Skip it — adds unnecessary abstraction

In short: Repository Pattern is valuable in medium-to-large apps where you want testability and data access abstraction. For small apps, using Eloquent directly in services is perfectly fine.

---

## 12. Service Layer Pattern

- The Service Layer **extracts business logic** out of controllers into dedicated service classes.
- Controllers should only handle HTTP concerns (request validation, response formatting).
- Services handle the **"what to do"** — business rules, orchestration, calculations.

**Fat controller (bad):**

```php
// Controller does too much
class OrderController extends Controller
{
    public function store(StoreOrderRequest $request): JsonResponse
    {
        $cart = Cart::where('user_id', auth()->id())->firstOrFail();
        $total = $cart->items->sum(fn ($item) => $item->price * $item->quantity);

        if ($total < 10) {
            return response()->json(['error' => 'Minimum order is $10'], 422);
        }

        $discount = $total > 100 ? $total * 0.1 : 0;
        $finalTotal = $total - $discount;

        $order = Order::create([
            'user_id' => auth()->id(),
            'total' => $finalTotal,
            'discount' => $discount,
        ]);

        foreach ($cart->items as $item) {
            $order->items()->create([...]);
            Product::where('id', $item->product_id)->decrement('stock', $item->quantity);
        }

        $cart->items()->delete();
        Mail::to(auth()->user())->send(new OrderConfirmation($order));

        return response()->json($order, 201);
    }
}
```

**Thin controller + service (good):**

```php
// app/Services/OrderService.php
class OrderService
{
    public function __construct(
        private CartService $cartService,
        private DiscountService $discountService,
    ) {}

    public function placeOrder(int $userId): Order
    {
        $cart = $this->cartService->getCart($userId);
        $total = $this->cartService->calculateTotal($cart);

        if ($total < 10) {
            throw new MinimumOrderException('Minimum order is $10');
        }

        $discount = $this->discountService->calculate($total);

        $order = DB::transaction(function () use ($userId, $cart, $total, $discount) {
            $order = Order::create([
                'user_id' => $userId,
                'total' => $total - $discount,
                'discount' => $discount,
            ]);

            foreach ($cart->items as $item) {
                $order->items()->create([...]);
                Product::where('id', $item->product_id)->decrement('stock', $item->quantity);
            }

            $cart->items()->delete();
            return $order;
        });

        event(new OrderPlaced($order));
        return $order;
    }
}
```

```php
// Controller is now thin
class OrderController extends Controller
{
    public function __construct(private OrderService $orderService) {}

    public function store(StoreOrderRequest $request): JsonResponse
    {
        $order = $this->orderService->placeOrder(auth()->id());
        return response()->json(new OrderResource($order), 201);
    }
}
```

**Fat vs Thin controller comparison:**

**Fat Controller:**
- **Testability** — Hard — must test through HTTP
- **Reusability** — None — logic locked in controller
- **Readability** — Long methods, hard to follow
- **Maintenance** — Changes risk breaking HTTP layer
- **SRP** — Violates SRP

**Thin Controller + Service:**
- **Testability** — Easy — unit test the service directly
- **Reusability** — High — call service from anywhere
- **Readability** — Clear separation of concerns
- **Maintenance** — Business logic isolated from HTTP
- **SRP** — Each class has one responsibility

In short: Move business logic into service classes. Controllers handle HTTP in, services handle logic, events handle side effects.

---

## 13. Action Pattern

- An Action is a **single-responsibility class** that does exactly one thing.
- Popular in the Laravel community (promoted by Freek Van der Berghe / Spatie).
- Uses the `__invoke()` magic method — callable like a function.
- More granular than services: one action = one operation.

**When to use Actions vs Services:**

- **Single operation (create user, send invoice)** — Action: Best fit, Service: Overkill
- **Group of related operations** — Action: Too many classes, Service: Best fit
- **Reusable from controllers, jobs, commands** — Action: Best fit, Service: Also good
- **Complex orchestration of multiple steps** — Action: Combine actions, Service: Best fit

**Example Action:**

```php
// app/Actions/CreateUserAction.php
class CreateUserAction
{
    public function __invoke(array $data): User
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        event(new UserRegistered($user));

        return $user;
    }
}
```

**Using in a controller:**

```php
class RegisterController extends Controller
{
    public function __construct(private CreateUserAction $createUser) {}

    public function store(RegisterRequest $request): JsonResponse
    {
        $user = ($this->createUser)($request->validated());
        return response()->json(new UserResource($user), 201);
    }
}
```

**Using the same action in an Artisan command:**

```php
class CreateUserCommand extends Command
{
    protected $signature = 'user:create {email} {name}';

    public function handle(CreateUserAction $createUser): int
    {
        $user = $createUser([
            'name' => $this->argument('name'),
            'email' => $this->argument('email'),
            'password' => 'temporary-password',
        ]);

        $this->info("User {$user->id} created.");
        return 0;
    }
}
```

**Actions calling other actions (composition):**

```php
class PlaceOrderAction
{
    public function __construct(
        private CalculateOrderTotalAction $calculateTotal,
        private ApplyDiscountAction $applyDiscount,
        private DecrementStockAction $decrementStock,
    ) {}

    public function __invoke(User $user, Cart $cart): Order
    {
        $total = ($this->calculateTotal)($cart);
        $discount = ($this->applyDiscount)($total);

        $order = DB::transaction(function () use ($user, $cart, $total, $discount) {
            $order = Order::create([
                'user_id' => $user->id,
                'total' => $total - $discount,
            ]);
            ($this->decrementStock)($cart);
            return $order;
        });

        event(new OrderPlaced($order));
        return $order;
    }
}
```

In short: Actions are great for single, reusable operations. Use them when a full service class feels like overkill, or when you want to compose small operations together.

---

## 14. DTO (Data Transfer Object)

- A DTO is a **simple object that carries data** between layers (request -> service, service -> response).
- Replaces associative arrays — gives you **type safety, autocompletion, and validation at the type level**.
- In modern PHP (8.1+), use `readonly` classes for immutable DTOs.

**The problem with arrays:**

```php
// Using arrays — no type safety, easy to make typos
$data = $request->validated(); // returns ['naem' => '...'] — typo not caught!
$this->userService->create($data);

// Inside the service — what keys are available? No IDE help.
public function create(array $data): User
{
    $data['name'];  // does this key exist? Who knows.
    $data['email']; // typo won't be caught until runtime.
}
```

**DTO solves this:**

```php
// app/DTOs/CreateUserDTO.php
readonly class CreateUserDTO
{
    public function __construct(
        public string $name,
        public string $email,
        public string $password,
        public ?string $phone = null,
    ) {}

    // Factory method from request
    public static function fromRequest(StoreUserRequest $request): self
    {
        return new self(
            name: $request->validated('name'),
            email: $request->validated('email'),
            password: $request->validated('password'),
            phone: $request->validated('phone'),
        );
    }

    // Factory method from array
    public static function fromArray(array $data): self
    {
        return new self(
            name: $data['name'],
            email: $data['email'],
            password: $data['password'],
            phone: $data['phone'] ?? null,
        );
    }
}
```

**Using the DTO:**

```php
// Controller
class UserController extends Controller
{
    public function __construct(private UserService $userService) {}

    public function store(StoreUserRequest $request): JsonResponse
    {
        $dto = CreateUserDTO::fromRequest($request);
        $user = $this->userService->create($dto);
        return response()->json(new UserResource($user), 201);
    }
}

// Service — clear contract, type-safe
class UserService
{
    public function create(CreateUserDTO $dto): User
    {
        return User::create([
            'name' => $dto->name,       // IDE autocomplete works
            'email' => $dto->email,     // type-checked at compile time
            'password' => Hash::make($dto->password),
            'phone' => $dto->phone,
        ]);
    }
}
```

**DTO vs Array comparison:**

**Array:**
- **Type safety** — None
- **IDE support** — No autocomplete
- **Validation** — Runtime only
- **Documentation** — Must read code/comments
- **Immutability** — Mutable by default
- **Boilerplate** — Less code

**DTO:**
- **Type safety** — Full — PHP enforces types
- **IDE support** — Full autocomplete + refactoring
- **Validation** — Compile-time + runtime
- **Documentation** — Self-documenting via properties
- **Immutability** — `readonly` enforces immutability
- **Boilerplate** — Slightly more code

**When to use DTOs:**
- Passing data between layers (request -> service -> repository).
- When methods accept more than 3 related parameters.
- When multiple callers pass data to the same service method.

**When arrays are fine:**
- Simple CRUD with 1-2 fields.
- Internal helper methods that won't be reused.

In short: DTOs replace unstructured arrays with typed, immutable objects. They make your code self-documenting and catch bugs at compile time instead of runtime.

---

## 15. CQRS (Command Query Responsibility Segregation)

- CQRS **separates read operations (queries) from write operations (commands)** into different models or paths.
- **Command** = changes state (create, update, delete). Returns nothing or an ID.
- **Query** = reads state (list, show, search). Returns data. Never changes state.
- In traditional CRUD, the same model handles both reads and writes. CQRS splits them.

**Why split reads and writes?**
- Reads and writes often have very different performance needs.
- Read models can be optimized (denormalized, cached, indexed differently).
- Write models can focus on business rules and validation.
- You can scale reads and writes independently.

**Simple Laravel implementation:**

```php
// Command — handles a write operation
// app/Commands/CreateOrderCommand.php
readonly class CreateOrderCommand
{
    public function __construct(
        public int $userId,
        public array $items,
        public string $shippingAddress,
    ) {}
}

// Command Handler
// app/Commands/Handlers/CreateOrderHandler.php
class CreateOrderHandler
{
    public function handle(CreateOrderCommand $command): int
    {
        return DB::transaction(function () use ($command) {
            $order = Order::create([
                'user_id' => $command->userId,
                'shipping_address' => $command->shippingAddress,
                'status' => 'pending',
            ]);

            foreach ($command->items as $item) {
                $order->items()->create($item);
                Product::where('id', $item['product_id'])
                    ->decrement('stock', $item['quantity']);
            }

            event(new OrderPlaced($order));
            return $order->id;
        });
    }
}
```

```php
// Query — handles a read operation
// app/Queries/GetOrdersForUserQuery.php
readonly class GetOrdersForUserQuery
{
    public function __construct(
        public int $userId,
        public ?string $status = null,
        public int $perPage = 15,
    ) {}
}

// Query Handler — optimized for reads
// app/Queries/Handlers/GetOrdersForUserHandler.php
class GetOrdersForUserHandler
{
    public function handle(GetOrdersForUserQuery $query): LengthAwarePaginator
    {
        return Order::query()
            ->where('user_id', $query->userId)
            ->when($query->status, fn ($q, $status) => $q->where('status', $status))
            ->with(['items.product:id,name,price'])  // optimized eager loading
            ->select(['id', 'total', 'status', 'created_at'])  // only needed columns
            ->latest()
            ->paginate($query->perPage);
    }
}
```

**Using in a controller:**

```php
class OrderController extends Controller
{
    public function __construct(
        private CreateOrderHandler $createOrderHandler,
        private GetOrdersForUserHandler $getOrdersHandler,
    ) {}

    // Write — uses command
    public function store(StoreOrderRequest $request): JsonResponse
    {
        $orderId = $this->createOrderHandler->handle(
            new CreateOrderCommand(
                userId: auth()->id(),
                items: $request->validated('items'),
                shippingAddress: $request->validated('shipping_address'),
            )
        );

        return response()->json(['order_id' => $orderId], 201);
    }

    // Read — uses query
    public function index(Request $request): JsonResponse
    {
        $orders = $this->getOrdersHandler->handle(
            new GetOrdersForUserQuery(
                userId: auth()->id(),
                status: $request->query('status'),
            )
        );

        return OrderResource::collection($orders)->response();
    }
}
```

**When to use CQRS:**

- **Read-heavy app (dashboard, reporting)** — Use it — optimize reads separately
- **Complex write logic with simple reads** — Use it — keep write path clean
- **Different read/write scaling needs** — Use it — scale independently
- **Simple CRUD app** — Skip it — standard MVC is fine
- **Small team, tight deadline** — Skip it — adds structural overhead

In short: CQRS separates the "ask" from the "do." Start with simple separation in your code structure; you don't need separate databases or event sourcing to benefit from the pattern.

---

## 16. Clean Architecture Overview

- Clean Architecture (by Robert C. Martin) organizes code into **concentric layers** where dependencies point inward.
- Inner layers know nothing about outer layers. Outer layers depend on inner layers.
- The goal: **business logic is independent of frameworks, databases, and UI**.

**The layers (inside out):**

```
┌─────────────────────────────────────────────────┐
│                  Frameworks & Drivers            │
│        (Laravel, Eloquent, HTTP, Queue)          │
│  ┌─────────────────────────────────────────────┐ │
│  │           Interface Adapters                │ │
│  │     (Controllers, Repositories, Presenters) │ │
│  │  ┌───────────────────────────────────────┐  │ │
│  │  │          Use Cases (Application)      │  │ │
│  │  │     (Services, Actions, Commands)     │  │ │
│  │  │  ┌─────────────────────────────────┐  │  │ │
│  │  │  │        Entities (Domain)        │  │  │ │
│  │  │  │   (Models, Value Objects,       │  │  │ │
│  │  │  │    Business Rules)              │  │  │ │
│  │  │  └─────────────────────────────────┘  │  │ │
│  │  └───────────────────────────────────────┘  │ │
│  └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘

Dependency Rule: arrows point INWARD only
```

**How it maps to Laravel:**

- **Entities** — Domain models, value objects, business rules (plain PHP classes, not Eloquent)
- **Use Cases** — Service classes, Actions, Command/Query handlers
- **Interface Adapters** — Controllers, Form Requests, API Resources, Repository implementations
- **Frameworks & Drivers** — Eloquent, Blade, Queue, Mail, HTTP kernel, config

**Example structure:**

```
app/
├── Domain/                          # Entities layer — no Laravel dependencies
│   ├── User/
│   │   ├── User.php                 # Plain PHP class (not Eloquent model)
│   │   ├── UserEmail.php            # Value object
│   │   └── UserRepositoryInterface.php  # Contract (port)
│   └── Order/
│       ├── Order.php
│       ├── OrderStatus.php          # Enum
│       └── OrderRepositoryInterface.php
│
├── Application/                     # Use Cases layer
│   ├── User/
│   │   ├── CreateUserUseCase.php
│   │   └── GetUserUseCase.php
│   └── Order/
│       ├── PlaceOrderUseCase.php
│       └── CancelOrderUseCase.php
│
├── Infrastructure/                  # Frameworks & adapters
│   ├── Persistence/
│   │   ├── EloquentUserRepository.php    # Implements UserRepositoryInterface
│   │   ├── EloquentOrderRepository.php
│   │   └── Models/                       # Eloquent models live here
│   │       ├── UserModel.php
│   │       └── OrderModel.php
│   └── Mail/
│       └── LaravelMailService.php
│
└── Http/                            # Interface Adapters (HTTP)
    ├── Controllers/
    ├── Requests/
    └── Resources/
```

**Practical use case example:**

```php
// Domain layer — pure PHP, no framework
// app/Domain/User/UserEmail.php
readonly class UserEmail
{
    public function __construct(public string $value)
    {
        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException("Invalid email: {$value}");
        }
    }
}

// Application layer — orchestrates business logic
// app/Application/User/CreateUserUseCase.php
class CreateUserUseCase
{
    public function __construct(
        private UserRepositoryInterface $userRepo,
    ) {}

    public function execute(string $name, string $email, string $password): int
    {
        $emailVO = new UserEmail($email);  // validates at domain level

        if ($this->userRepo->existsByEmail($emailVO)) {
            throw new UserAlreadyExistsException($email);
        }

        return $this->userRepo->create($name, $emailVO, $password);
    }
}

// Infrastructure layer — Laravel-specific implementation
// app/Infrastructure/Persistence/EloquentUserRepository.php
class EloquentUserRepository implements UserRepositoryInterface
{
    public function existsByEmail(UserEmail $email): bool
    {
        return UserModel::where('email', $email->value)->exists();
    }

    public function create(string $name, UserEmail $email, string $password): int
    {
        $model = UserModel::create([
            'name' => $name,
            'email' => $email->value,
            'password' => Hash::make($password),
        ]);
        return $model->id;
    }
}
```

**When to use Clean Architecture:**

- **Long-lived enterprise app (5+ years)** — Use it — investment pays off
- **Complex domain logic (finance, healthcare)** — Use it — domain layer stays pure
- **Potential framework migration** — Use it — business logic is framework-free
- **Small-to-medium CRUD app** — Skip it — too much indirection
- **Short-lived project / prototype** — Skip it — standard Laravel is faster

In short: Clean Architecture protects your business logic from framework changes. It's worth the investment for complex, long-lived applications. For typical Laravel CRUD apps, standard MVC with services is sufficient.

---

## 17. Dependency Injection in Laravel

- **Dependency Injection (DI)** means a class receives its dependencies from the outside instead of creating them itself.
- Laravel's **Service Container** (IoC container) automatically resolves and injects dependencies.
- DI makes code testable, flexible, and follows the Dependency Inversion Principle.

**Without DI (bad):**

```php
class OrderService
{
    public function getShippingCost(Order $order): float
    {
        $calculator = new ShippingCalculator();  // hard-coded dependency
        return $calculator->calculate($order);
    }
}
// Cannot swap ShippingCalculator in tests or for different providers.
```

**With DI (good):**

```php
class OrderService
{
    public function __construct(
        private ShippingCalculatorInterface $calculator  // injected
    ) {}

    public function getShippingCost(Order $order): float
    {
        return $this->calculator->calculate($order);
    }
}
// Easy to swap: test double, different provider, etc.
```

### Auto-Resolution

Laravel's container automatically resolves classes that have no interface bindings:

```php
// No binding needed — Laravel auto-resolves concrete classes
class UserController extends Controller
{
    // Laravel creates UserService automatically (and its dependencies, recursively)
    public function __construct(private UserService $userService) {}
}

class UserService
{
    // Laravel creates UserRepository automatically
    public function __construct(private UserRepository $userRepo) {}
}
```

### Binding Interfaces to Implementations

When you type-hint an interface, you must tell Laravel which implementation to use:

```php
// app/Providers/AppServiceProvider.php
public function register(): void
{
    // Basic binding — new instance each time
    $this->app->bind(
        PaymentGatewayInterface::class,
        StripePaymentGateway::class
    );

    // Singleton — same instance throughout the request
    $this->app->singleton(
        CartServiceInterface::class,
        CartService::class
    );

    // Scoped — same instance within a request, new instance for each request
    $this->app->scoped(
        RequestLoggerInterface::class,
        RequestLogger::class
    );
}
```

### Contextual Binding

Different classes can receive different implementations of the same interface:

```php
// app/Providers/AppServiceProvider.php
public function register(): void
{
    // When OrderService needs a payment gateway, give it Stripe
    $this->app->when(OrderService::class)
        ->needs(PaymentGatewayInterface::class)
        ->give(StripePaymentGateway::class);

    // When SubscriptionService needs a payment gateway, give it Paddle
    $this->app->when(SubscriptionService::class)
        ->needs(PaymentGatewayInterface::class)
        ->give(PaddlePaymentGateway::class);
}
```

### Binding with Closures

For complex setup or conditional logic:

```php
$this->app->singleton(PaymentGatewayInterface::class, function ($app) {
    return match(config('payment.default')) {
        'stripe' => new StripePaymentGateway(config('payment.stripe.key')),
        'paddle' => new PaddlePaymentGateway(config('payment.paddle.key')),
        default  => throw new \RuntimeException('Unknown payment provider'),
    };
});
```

### Practical Examples

**Resolving from the container manually (rarely needed):**

```php
// Using the app() helper
$service = app(UserService::class);

// Using the make method
$service = app()->make(UserService::class);

// With parameters
$service = app()->makeWith(ReportGenerator::class, ['month' => 'January']);
```

**Method injection in controllers:**

```php
class ReportController extends Controller
{
    // Constructor injection — available in all methods
    public function __construct(private ReportService $reportService) {}

    // Method injection — resolved per-method
    public function export(Request $request, PdfExporter $exporter): Response
    {
        $report = $this->reportService->generate($request->query('month'));
        return $exporter->export($report);
    }
}
```

**Testing with DI — swap implementations easily:**

```php
class OrderServiceTest extends TestCase
{
    public function test_order_uses_correct_shipping_cost(): void
    {
        // Replace the real implementation with a fake
        $this->app->bind(
            ShippingCalculatorInterface::class,
            FakeShippingCalculator::class
        );

        $service = app(OrderService::class);
        $cost = $service->getShippingCost($order);

        $this->assertEquals(5.00, $cost);
    }
}
```

**DI binding types summary:**

- **`bind()`** — New instance every time. Use when: stateful services, unique per usage
- **`singleton()`** — One instance for app lifecycle. Use when: expensive setup, shared state (config, cache)
- **`scoped()`** — One instance per request. Use when: request-specific state (current user context)
- **`instance()`** — Bind an existing object. Use when: you already have the object (testing)
- **`when()->needs()->give()`** — Context-specific binding. Use when: different classes need different implementations

In short: Laravel's service container handles dependency injection automatically for concrete classes. Use explicit bindings when you need interface-to-implementation mapping, singletons, or contextual resolution. DI is the foundation that makes all other architecture patterns (Repository, Service, Action) work cleanly.
