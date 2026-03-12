# Architecture Patterns Guide

Architecture patterns every Laravel backend developer should know.

## Table of Contents

1. [Event-Driven Architecture](#1-event-driven-architecture)
2. [Laravel Event System](#2-laravel-event-system)
3. [Events and Listeners](#3-events-and-listeners)
4. [Async Event Handling with Queues](#4-async-event-handling-with-queues)
5. [When to Use EDA](#5-when-to-use-eda)
6. [Modular Monolith](#6-modular-monolith)
7. [Modular vs Microservices vs Standard Monolith](#7-modular-vs-microservices-vs-standard-monolith)
8. [Module Structure in Laravel](#8-module-structure-in-laravel)
9. [Module Communication](#9-module-communication)
10. [When to Use Modular Monolith](#10-when-to-use-modular-monolith)
11. [Distributed Monolith (Anti-Pattern)](#11-distributed-monolith-anti-pattern)
12. [Repository Pattern](#12-repository-pattern)
13. [Service Layer Pattern](#13-service-layer-pattern)
14. [Action Pattern](#14-action-pattern)
15. [DTO (Data Transfer Object)](#15-dto-data-transfer-object)
16. [CQRS](#16-cqrs)
17. [Clean Architecture](#17-clean-architecture)
18. [Dependency Injection in Laravel](#18-dependency-injection-in-laravel)

---

## 1. Event-Driven Architecture

Components communicate by **producing and consuming events**. The producer fires an event and does not know who handles it.

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

**Without EDA — tightly coupled controller:**
```php
public function register(Request $request) {
    $user = User::create($request->all());
    Mail::to($user)->send(new WelcomeMail());
    Profile::create(['user_id' => $user->id]);
    Notification::send($admin, new NewUser());
}
```

**With EDA — decoupled:**
```php
public function register(Request $request) {
    $user = User::create($request->all());
    event(new UserRegistered($user));  // side effects handled elsewhere
}
```

---

## 2. Laravel Event System

- **Event** — plain PHP class representing something that happened.
- **Listener** — handles an event when it fires.
- **Observer** — fires events on Eloquent model lifecycle automatically.
- **Queue** — runs listeners asynchronously in the background.

```bash
php artisan make:event UserRegistered
php artisan make:listener SendWelcomeEmail --event=UserRegistered
php artisan make:listener CreateUserProfile --event=UserRegistered
```

**Register in `AppServiceProvider` (Laravel 11+):**
```php
public function boot(): void
{
    Event::listen(UserRegistered::class, SendWelcomeEmail::class);
    Event::listen(UserRegistered::class, CreateUserProfile::class);
}
```

---

## 3. Events and Listeners

**Event class:**
```php
class UserRegistered
{
    public function __construct(public readonly User $user) {}
}
```

**Listener classes:**
```php
class SendWelcomeEmail implements ShouldQueue
{
    public function handle(UserRegistered $event): void
    {
        Mail::to($event->user->email)->send(new WelcomeMail($event->user));
    }
}

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
event(new UserRegistered($user));
// or
Event::dispatch(new UserRegistered($user));
```

**Model Observer — auto-fires on Eloquent lifecycle:**
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

## 4. Async Event Handling with Queues

Listeners implementing `ShouldQueue` run in the background — the main request completes immediately.

```php
class SendWelcomeEmail implements ShouldQueue
{
    public string $queue = 'emails';
    public int    $tries = 3;
    public int    $timeout = 30;

    public function handle(UserRegistered $event): void
    {
        Mail::to($event->user->email)->send(new WelcomeMail($event->user));
    }

    public function failed(UserRegistered $event, \Throwable $exception): void
    {
        Log::error("Failed to send welcome email to {$event->user->email}");
    }
}
```

```bash
php artisan queue:work
php artisan queue:work --queue=emails
```

---

## 5. When to Use EDA

**Use when:**
- Multiple things happen after a single action (order placed → email + stock + analytics).
- Side effects must not block the HTTP response.
- You want to add behavior without touching existing code (Open/Closed Principle).

**Avoid when:**
- Only one simple side effect — just call it directly.
- You need strict ordering or transactions across listeners.

---

## 6. Modular Monolith

A single deployable app internally organized into **isolated modules**. Each module owns its models, controllers, services, routes, and migrations. Modules communicate through well-defined interfaces — not direct class calls.

```
Standard Monolith        Modular Monolith               Microservices
─────────────────        ──────────────────────          ──────────────────
app/                     modules/                         users-service/
  Models/                  Users/                         orders-service/
  Controllers/               Models/                      payments-service/
  Services/                  Controllers/
  (everything mixed)         Services/
                             Routes/
                           Orders/
                           Payments/
                           (clean boundaries)
```

---

## 7. Modular vs Microservices vs Standard Monolith

**Standard Monolith:**
- Flat, mixed structure. Weak/no boundaries. Simple. Good for solo/small teams.
- Hard to split later.

**Modular Monolith:**
- Organized modules. Strong enforced boundaries. Events/interfaces for communication.
- Can be shared or per-module DB. Easy to extract modules later.

**Microservices:**
- Separate codebases and deployments. Hard network boundaries. Separate DB per service.
- Independent scaling. High complexity. Large teams.

Modular Monolith = structure of microservices, simplicity of a monolith.

---

## 8. Module Structure in Laravel

```
app/
└── Modules/
    ├── User/
    │   ├── Controllers/UserController.php
    │   ├── Models/User.php
    │   ├── Services/UserService.php
    │   ├── Repositories/UserRepository.php
    │   ├── Events/UserRegistered.php
    │   ├── Listeners/SendWelcomeEmail.php
    │   ├── Requests/StoreUserRequest.php
    │   ├── Resources/UserResource.php
    │   ├── routes.php
    │   └── UserServiceProvider.php
    ├── Order/
    │   └── OrderServiceProvider.php
    └── Payment/
        ├── Services/StripeService.php
        ├── Events/PaymentProcessed.php
        └── PaymentServiceProvider.php
```

**Module Service Provider:**
```php
class UserServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(UserRepositoryInterface::class, UserRepository::class);
    }

    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__ . '/routes.php');
        $this->loadMigrationsFrom(__DIR__ . '/../../database/migrations/user');
        Event::listen(UserRegistered::class, SendWelcomeEmail::class);
    }
}
```

**Register in `config/app.php`:**
```php
'providers' => [
    App\Modules\User\UserServiceProvider::class,
    App\Modules\Order\OrderServiceProvider::class,
    App\Modules\Payment\PaymentServiceProvider::class,
],
```

---

## 9. Module Communication

**Rule:** Modules must NOT import classes directly from other modules.

**Wrong:**
```php
// Order module directly imports User model ❌
use App\Modules\User\Models\User;

class OrderService {
    public function getOrdersByUser(int $userId): Collection {
        $user = User::findOrFail($userId);
        return $user->orders;
    }
}
```

**Correct — via events:**
```php
class OrderService {
    public function placeOrder(int $userId, array $items): Order {
        $order = Order::create(['user_id' => $userId]);
        event(new OrderPlaced($order));
        return $order;
    }
}

// User module listens
class UpdateUserOrderCount {
    public function handle(OrderPlaced $event): void {
        User::where('id', $event->order->user_id)->increment('orders_count');
    }
}
```

**Correct — via interfaces (contracts):**
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
        $user = $this->users->findById($userId);
        return Order::where('user_id', $userId)->get();
    }
}
```

---

## 10. When to Use Modular Monolith

**Use when:**
- App is growing and becoming hard to navigate.
- Teams need clear domain ownership.
- You want to prepare for future microservice extraction.
- You need clean architecture without DevOps overhead.

**Avoid when:**
- App is small and simple — unnecessary structure.
- Parts need to scale independently right now.
- Teams are ready for true microservices.

```
Simple Monolith → Modular Monolith → (optional) Microservices
```

---

## 11. Distributed Monolith (Anti-Pattern)

Multiple services that are tightly coupled and can't work independently — the worst of both worlds. Looks like microservices, behaves like a monolith.

**How it happens:**

- **Shared database** — all services write to the same DB; schema changes break all.
- **Direct synchronous calls** — if one service is down, the chain fails.
- **Shared libraries** — updating requires redeploying all services.
- **Coordinated deploys** — can't deploy one service without others.

**Fixes:**

**1. Each service gets its own database:**
```
Before: Service A, B, C → Shared DB
After:  Service A → DB A | Service B → DB B | Service C → DB C
```

**2. Use message queues instead of direct HTTP calls:**
```php
// Bad — if Service B is down, A fails
$response = Http::post('http://service-b/api/process', $data);

// Good — message waits if B is down
Queue::push(new ProcessOrderEvent($orderData));
```

**3. Split by business domain, not technical layer:**
```
Bad:  Auth Service, Database Service, Notification Service
Good: Order Service (owns orders), Payment Service (owns payments), User Service (owns users)
```

**4. Or go back to a modular monolith** — if services are tightly coupled anyway, a modular monolith gives clean boundaries without the networking complexity.

---

## 12. Repository Pattern

Abstracts data access behind an interface. Controllers and services never call Eloquent directly.

**Step 1 — Interface:**
```php
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

**Step 2 — Eloquent implementation:**
```php
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

**Step 3 — Bind in service provider:**
```php
class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(UserRepositoryInterface::class, EloquentUserRepository::class);
    }
}
```

**Step 4 — Use in controller:**
```php
class UserController extends Controller
{
    public function __construct(private UserRepositoryInterface $users) {}

    public function show(int $id): JsonResponse
    {
        return response()->json($this->users->findById($id));
    }

    public function index(): JsonResponse
    {
        return response()->json($this->users->paginate());
    }
}
```

**Use when:** large app with complex queries, multiple data sources, or need to unit test without a database.
**Skip when:** small CRUD app — Eloquent directly in services is fine.

---

## 13. Service Layer Pattern

Extracts business logic out of controllers into dedicated service classes. Controllers handle HTTP only; services handle business rules.

**Fat controller (bad):**
```php
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
        $order = Order::create(['user_id' => auth()->id(), 'total' => $total - $discount]);

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
            $order = Order::create(['user_id' => $userId, 'total' => $total - $discount, 'discount' => $discount]);

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

---

## 14. Action Pattern

A **single-responsibility class** that does exactly one thing via `__invoke()`. More granular than services — one action = one operation.

```php
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

**In a controller:**
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

**Same action reused in an Artisan command:**
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

**Composing actions:**
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
            $order = Order::create(['user_id' => $user->id, 'total' => $total - $discount]);
            ($this->decrementStock)($cart);
            return $order;
        });

        event(new OrderPlaced($order));
        return $order;
    }
}
```

**Actions vs Services:**
- Single operation → Action.
- Group of related operations → Service.
- Complex orchestration → Service (or compose actions).

---

## 15. DTO (Data Transfer Object)

Typed, immutable objects that carry data between layers. Replaces unstructured arrays with IDE autocomplete and compile-time safety.

**Problem with arrays:**
```php
$data = $request->validated(); // ['naem' => '...'] — typo not caught
$this->userService->create($data);

public function create(array $data): User
{
    $data['name'];  // does this key exist? No IDE help.
}
```

**DTO solution:**
```php
readonly class CreateUserDTO
{
    public function __construct(
        public string $name,
        public string $email,
        public string $password,
        public ?string $phone = null,
    ) {}

    public static function fromRequest(StoreUserRequest $request): self
    {
        return new self(
            name: $request->validated('name'),
            email: $request->validated('email'),
            password: $request->validated('password'),
            phone: $request->validated('phone'),
        );
    }

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

**Usage:**
```php
// Controller
public function store(StoreUserRequest $request): JsonResponse
{
    $dto = CreateUserDTO::fromRequest($request);
    $user = $this->userService->create($dto);
    return response()->json(new UserResource($user), 201);
}

// Service — clear, typed contract
public function create(CreateUserDTO $dto): User
{
    return User::create([
        'name' => $dto->name,      // IDE autocomplete works
        'email' => $dto->email,
        'password' => Hash::make($dto->password),
        'phone' => $dto->phone,
    ]);
}
```

**Use when:** passing data between layers, methods accept 3+ related params, multiple callers pass data to the same service.
**Skip when:** simple CRUD with 1-2 fields or internal one-off helpers.

---

## 16. CQRS

**Command Query Responsibility Segregation** — separates read operations (queries) from write operations (commands).

- **Command** — changes state. Returns nothing or an ID.
- **Query** — reads state. Returns data. Never changes state.

**Command:**
```php
readonly class CreateOrderCommand
{
    public function __construct(
        public int $userId,
        public array $items,
        public string $shippingAddress,
    ) {}
}

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
                Product::where('id', $item['product_id'])->decrement('stock', $item['quantity']);
            }

            event(new OrderPlaced($order));
            return $order->id;
        });
    }
}
```

**Query:**
```php
readonly class GetOrdersForUserQuery
{
    public function __construct(
        public int $userId,
        public ?string $status = null,
        public int $perPage = 15,
    ) {}
}

class GetOrdersForUserHandler
{
    public function handle(GetOrdersForUserQuery $query): LengthAwarePaginator
    {
        return Order::query()
            ->where('user_id', $query->userId)
            ->when($query->status, fn ($q, $status) => $q->where('status', $status))
            ->with(['items.product:id,name,price'])
            ->select(['id', 'total', 'status', 'created_at'])
            ->latest()
            ->paginate($query->perPage);
    }
}
```

**Controller:**
```php
class OrderController extends Controller
{
    public function __construct(
        private CreateOrderHandler $createOrderHandler,
        private GetOrdersForUserHandler $getOrdersHandler,
    ) {}

    public function store(StoreOrderRequest $request): JsonResponse
    {
        $orderId = $this->createOrderHandler->handle(new CreateOrderCommand(
            userId: auth()->id(),
            items: $request->validated('items'),
            shippingAddress: $request->validated('shipping_address'),
        ));

        return response()->json(['order_id' => $orderId], 201);
    }

    public function index(Request $request): JsonResponse
    {
        $orders = $this->getOrdersHandler->handle(new GetOrdersForUserQuery(
            userId: auth()->id(),
            status: $request->query('status'),
        ));

        return OrderResource::collection($orders)->response();
    }
}
```

**Use when:** read-heavy app, complex write logic, different read/write scaling needs.
**Skip when:** simple CRUD, small team, tight deadline.

---

## 17. Clean Architecture

Organizes code into concentric layers where dependencies only point **inward**. Business logic is independent of frameworks and databases.

```
┌────────────────────────────────────────┐
│        Frameworks & Drivers            │
│   (Laravel, Eloquent, HTTP, Queue)     │
│  ┌─────────────────────────────────┐   │
│  │      Interface Adapters         │   │
│  │  (Controllers, Repositories)    │   │
│  │  ┌───────────────────────────┐  │   │
│  │  │  Use Cases (Application)  │  │   │
│  │  │  (Services, Actions)      │  │   │
│  │  │  ┌─────────────────────┐  │  │   │
│  │  │  │  Entities (Domain)  │  │  │   │
│  │  │  │  (Models, Rules)    │  │  │   │
│  │  │  └─────────────────────┘  │  │   │
│  │  └───────────────────────────┘  │   │
│  └─────────────────────────────────┘   │
└────────────────────────────────────────┘
Dependencies point INWARD only
```

**Laravel mapping:**
- **Entities** — domain models, value objects (plain PHP, no Eloquent).
- **Use Cases** — services, actions, command/query handlers.
- **Interface Adapters** — controllers, form requests, API resources, repository implementations.
- **Frameworks & Drivers** — Eloquent, queue, mail, HTTP kernel.

**Structure:**
```
app/
├── Domain/                      # No Laravel dependencies
│   ├── User/
│   │   ├── User.php             # Plain PHP class
│   │   ├── UserEmail.php        # Value object
│   │   └── UserRepositoryInterface.php
│   └── Order/
│       ├── Order.php
│       ├── OrderStatus.php      # Enum
│       └── OrderRepositoryInterface.php
├── Application/                 # Use Cases
│   ├── User/CreateUserUseCase.php
│   └── Order/PlaceOrderUseCase.php
├── Infrastructure/              # Laravel-specific
│   ├── Persistence/
│   │   ├── EloquentUserRepository.php
│   │   └── Models/UserModel.php
│   └── Mail/LaravelMailService.php
└── Http/
    ├── Controllers/
    ├── Requests/
    └── Resources/
```

**Example:**
```php
// Domain — pure PHP, no framework
readonly class UserEmail
{
    public function __construct(public string $value)
    {
        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException("Invalid email: {$value}");
        }
    }
}

// Application — orchestrates business logic
class CreateUserUseCase
{
    public function __construct(private UserRepositoryInterface $userRepo) {}

    public function execute(string $name, string $email, string $password): int
    {
        $emailVO = new UserEmail($email);

        if ($this->userRepo->existsByEmail($emailVO)) {
            throw new UserAlreadyExistsException($email);
        }

        return $this->userRepo->create($name, $emailVO, $password);
    }
}

// Infrastructure — Laravel implementation
class EloquentUserRepository implements UserRepositoryInterface
{
    public function existsByEmail(UserEmail $email): bool
    {
        return UserModel::where('email', $email->value)->exists();
    }

    public function create(string $name, UserEmail $email, string $password): int
    {
        return UserModel::create([
            'name' => $name,
            'email' => $email->value,
            'password' => Hash::make($password),
        ])->id;
    }
}
```

**Use when:** long-lived enterprise app, complex domain (finance, healthcare), potential framework migration.
**Skip when:** small-to-medium CRUD, prototype — standard Laravel MVC with services is sufficient.

---

## 18. Dependency Injection in Laravel

A class receives its dependencies from outside instead of creating them itself. Laravel's Service Container resolves and injects dependencies automatically.

**Without DI:**
```php
class OrderService
{
    public function getShippingCost(Order $order): float
    {
        $calculator = new ShippingCalculator();  // hard-coded, can't swap in tests
        return $calculator->calculate($order);
    }
}
```

**With DI:**
```php
class OrderService
{
    public function __construct(private ShippingCalculatorInterface $calculator) {}

    public function getShippingCost(Order $order): float
    {
        return $this->calculator->calculate($order);
    }
}
```

**Auto-resolution — no binding needed for concrete classes:**
```php
class UserController extends Controller
{
    public function __construct(private UserService $userService) {}
    // Laravel creates UserService (and its dependencies) automatically
}
```

**Binding interfaces to implementations:**
```php
public function register(): void
{
    // New instance each time
    $this->app->bind(PaymentGatewayInterface::class, StripePaymentGateway::class);

    // Same instance for entire app lifecycle
    $this->app->singleton(CartServiceInterface::class, CartService::class);

    // Same instance per request, new per each request
    $this->app->scoped(RequestLoggerInterface::class, RequestLogger::class);
}
```

**Contextual binding — different implementations for different classes:**
```php
$this->app->when(OrderService::class)
    ->needs(PaymentGatewayInterface::class)
    ->give(StripePaymentGateway::class);

$this->app->when(SubscriptionService::class)
    ->needs(PaymentGatewayInterface::class)
    ->give(PaddlePaymentGateway::class);
```

**Binding with closure — for conditional/complex setup:**
```php
$this->app->singleton(PaymentGatewayInterface::class, function ($app) {
    return match(config('payment.default')) {
        'stripe' => new StripePaymentGateway(config('payment.stripe.key')),
        'paddle' => new PaddlePaymentGateway(config('payment.paddle.key')),
        default  => throw new \RuntimeException('Unknown payment provider'),
    };
});
```

**Method injection:**
```php
class ReportController extends Controller
{
    public function __construct(private ReportService $reportService) {}

    public function export(Request $request, PdfExporter $exporter): Response
    {
        $report = $this->reportService->generate($request->query('month'));
        return $exporter->export($report);
    }
}
```

**Swapping in tests:**
```php
class OrderServiceTest extends TestCase
{
    public function test_order_uses_correct_shipping_cost(): void
    {
        $this->app->bind(ShippingCalculatorInterface::class, FakeShippingCalculator::class);

        $service = app(OrderService::class);
        $cost = $service->getShippingCost($order);

        $this->assertEquals(5.00, $cost);
    }
}
```

**Binding types:**
- `bind()` — new instance every time.
- `singleton()` — one instance for the app lifecycle.
- `scoped()` — one instance per request.
- `instance()` — bind an existing object (useful in tests).
- `when()->needs()->give()` — context-specific binding.
