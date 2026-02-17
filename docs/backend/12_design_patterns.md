# Design Patterns Guide

A comprehensive guide to software design patterns and their use in PHP and Laravel.

## Table of Contents

1. [What is the Repository Pattern?](#1-what-is-the-repository-pattern)
2. [What is the Service Pattern?](#2-what-is-the-service-pattern)
3. [Difference between Service and Repository](#3-difference-between-service-and-repository)
4. [What is the Factory Pattern?](#4-what-is-the-factory-pattern)
5. [What is the Singleton Pattern?](#5-what-is-the-singleton-pattern)
6. [What is the Observer Pattern?](#6-what-is-the-observer-pattern)
7. [What is the Builder Pattern?](#7-what-is-the-builder-pattern)
8. [What is the Adapter Pattern?](#8-what-is-the-adapter-pattern)
9. [What is the Facade Pattern?](#9-what-is-the-facade-pattern)
10. [What is the Strategy Pattern?](#10-what-is-the-strategy-pattern)
11. [What is the Command Pattern?](#11-what-is-the-command-pattern)
12. [What is the Dependency Injection Pattern?](#12-what-is-the-dependency-injection-pattern)
13. [What is the MVC Pattern?](#13-what-is-the-mvc-pattern)
14. [What is the Decorator Pattern?](#14-what-is-the-decorator-pattern)
15. [What is the Chain of Responsibility Pattern?](#15-what-is-the-chain-of-responsibility-pattern)
16. [Design Pattern Categories](#16-design-pattern-categories)

---

## 1. What is the Repository Pattern?

- The Repository Pattern creates a layer between your application logic and the database.
- Instead of writing Eloquent queries directly in controllers or services, you put all database logic inside a Repository class.
- Controllers call the repository, not the database directly.

**Benefits:**
- Separates data access logic from business logic.
- Easy to swap databases or use a mock in tests.
- Keeps controllers clean.

```php
// Interface
interface UserRepositoryInterface {
    public function findById(int $id): ?User;
    public function create(array $data): User;
    public function update(int $id, array $data): bool;
    public function delete(int $id): bool;
}

// Implementation
class UserRepository implements UserRepositoryInterface {
    public function findById(int $id): ?User {
        return User::find($id);
    }

    public function create(array $data): User {
        return User::create($data);
    }

    public function update(int $id, array $data): bool {
        return User::where('id', $id)->update($data);
    }

    public function delete(int $id): bool {
        return User::destroy($id);
    }
}

// Bind in AppServiceProvider
app()->bind(UserRepositoryInterface::class, UserRepository::class);

// Usage in controller
class UserController extends Controller {
    public function __construct(private UserRepositoryInterface $users) {}

    public function show(int $id): JsonResponse {
        $user = $this->users->findById($id);
        return response()->json($user);
    }
}
```

In short: Repository separates database queries from business logic, making code clean and testable.

---

## 2. What is the Service Pattern?

- The Service Pattern puts business logic into a dedicated Service class instead of inside controllers.
- Controllers stay thin — they only receive requests and return responses.
- Services handle all complex operations.

**Benefits:**
- Controllers stay small and readable.
- Business logic is reusable across controllers, jobs, and commands.
- Easier to test in isolation.

```php
class OrderService {
    public function __construct(
        private OrderRepository $orders,
        private PaymentGateway $payment,
        private UserMailer $mailer,
    ) {}

    public function placeOrder(User $user, array $items): Order {
        $order = $this->orders->create([
            'user_id' => $user->id,
            'total'   => $this->calculateTotal($items),
        ]);

        $this->payment->charge($order->total);
        $this->mailer->sendOrderConfirmation($user, $order);

        return $order;
    }

    private function calculateTotal(array $items): float {
        return collect($items)->sum(fn ($item) => $item['price'] * $item['qty']);
    }
}

// Controller stays thin
class OrderController extends Controller {
    public function __construct(private OrderService $service) {}

    public function store(Request $request): JsonResponse {
        $order = $this->service->placeOrder(auth()->user(), $request->items);
        return response()->json($order, 201);
    }
}
```

In short: Services hold business logic so controllers stay thin and focused on HTTP concerns only.

---

## 3. Difference between Service and Repository

| | Repository | Service |
|-|------------|---------|
| **Purpose** | Database access | Business logic |
| **Contains** | Queries, CRUD | Rules, workflows, calculations |
| **Talks to** | Database / Eloquent | Repositories, external APIs |
| **Example** | `UserRepository::findById()` | `OrderService::placeOrder()` |

```
Request → Controller → Service → Repository → Database
```

- **Repository** → "How do I get/save data?"
- **Service** → "What should happen with that data?"

In short: Repositories handle data access; Services handle what to do with that data.

---

## 4. What is the Factory Pattern?

- The Factory Pattern creates objects without exposing the creation logic to the caller.
- Instead of using `new ClassName()` everywhere, you delegate creation to a factory.
- The factory decides which class to create based on input.

```php
interface Notification {
    public function send(string $message): void;
}

class EmailNotification implements Notification {
    public function send(string $message): void { echo "Email: $message"; }
}

class SmsNotification implements Notification {
    public function send(string $message): void { echo "SMS: $message"; }
}

class NotificationFactory {
    public static function make(string $type): Notification {
        return match ($type) {
            'email' => new EmailNotification(),
            'sms'   => new SmsNotification(),
            default => throw new \InvalidArgumentException("Unknown type: $type"),
        };
    }
}

// Usage
$notification = NotificationFactory::make('email');
$notification->send('Your order is ready!');
```

**Laravel uses the Factory Pattern in:**
- Model Factories (`User::factory()->create()`)
- `Storage::disk()` — creates the correct disk driver
- `Cache::store()` — creates the correct cache driver

In short: Factory Pattern centralizes object creation so the caller doesn't need to know which class to instantiate.

---

## 5. What is the Singleton Pattern?

- The Singleton Pattern ensures that only **one instance** of a class exists throughout the application.
- All parts of the app share the same instance.

```php
class Logger {
    private static ?Logger $instance = null;
    private array $logs = [];

    private function __construct() {} // Prevent direct instantiation

    public static function getInstance(): static {
        if (static::$instance === null) {
            static::$instance = new static();
        }
        return static::$instance;
    }

    public function log(string $message): void {
        $this->logs[] = $message;
    }
}

// Always returns the same instance
$logger = Logger::getInstance();
$logger->log('User logged in');
```

**Laravel's Singleton:**
```php
// Register as singleton in a service provider
app()->singleton(Logger::class, function () {
    return new Logger('app.log');
});

// Every resolve returns the same instance
$logger1 = app(Logger::class);
$logger2 = app(Logger::class);
// $logger1 === $logger2 → true
```

**Good use cases:** Config manager, Logger, Cache manager, Database connection.

In short: Singleton ensures only one shared instance of a class exists — useful for shared resources.

---

## 6. What is the Observer Pattern?

- The Observer Pattern lets objects (observers) automatically react when another object (subject) changes state.
- The subject notifies all registered observers whenever an event occurs.
- Loose coupling — the subject does not need to know who is observing.

```php
// Laravel Observer
class UserObserver {
    public function created(User $user): void {
        // Fires automatically after a user is created
        Mail::to($user)->send(new WelcomeMail());
    }

    public function deleted(User $user): void {
        // Fires automatically after a user is deleted
        Log::info("User {$user->id} was deleted.");
    }
}

// Register the observer
User::observe(UserObserver::class);

// Now every User::create() automatically triggers UserObserver::created()
User::create(['name' => 'Anwar', 'email' => 'anwar@example.com']);
```

**Laravel also uses this pattern in:**
- Eloquent model events (`creating`, `created`, `updating`, `deleted`, etc.)
- Laravel Events & Listeners system.

In short: Observers react automatically to model events — no need to call them manually.

---

## 7. What is the Builder Pattern?

- The Builder Pattern constructs complex objects step by step.
- Instead of one huge constructor with many parameters, you chain methods to set options.
- Allows creating different variations of an object using the same construction process.

```php
// Without Builder — messy constructor
$query = new Query('users', true, 'name', 'asc', 10, 1);

// With Builder — fluent and readable
class QueryBuilder {
    private string $table;
    private ?string $orderBy = null;
    private string $direction = 'asc';
    private int $limit = 15;

    public function from(string $table): static {
        $this->table = $table;
        return $this;
    }

    public function orderBy(string $column, string $direction = 'asc'): static {
        $this->orderBy = $column;
        $this->direction = $direction;
        return $this;
    }

    public function limit(int $limit): static {
        $this->limit = $limit;
        return $this;
    }

    public function build(): string {
        $sql = "SELECT * FROM {$this->table}";
        if ($this->orderBy) {
            $sql .= " ORDER BY {$this->orderBy} {$this->direction}";
        }
        return $sql . " LIMIT {$this->limit}";
    }
}

// Fluent chaining
$query = (new QueryBuilder())
    ->from('users')
    ->orderBy('name', 'asc')
    ->limit(10)
    ->build();
```

**Laravel uses the Builder Pattern in:**
- Eloquent query builder: `User::where()->orderBy()->paginate()`
- Mail builder: `Mail::to()->cc()->send()`
- HTTP client: `Http::withHeaders()->timeout()->get()`

In short: Builder Pattern creates complex objects step by step using a fluent, readable interface.

---

## 8. What is the Adapter Pattern?

- The Adapter Pattern allows two incompatible interfaces to work together.
- It acts as a translator between two classes that cannot work directly with each other.
- Wraps an existing class with a new interface.

```php
// Third-party SMS library with its own interface
class TwilioSms {
    public function sendTextMessage(string $to, string $body): void {
        echo "Twilio sending to $to: $body";
    }
}

// Your application expects this interface
interface SmsGateway {
    public function send(string $phone, string $message): void;
}

// Adapter wraps TwilioSms to match SmsGateway interface
class TwilioAdapter implements SmsGateway {
    public function __construct(private TwilioSms $twilio) {}

    public function send(string $phone, string $message): void {
        $this->twilio->sendTextMessage($phone, $message);
    }
}

// Your code only knows SmsGateway — not Twilio
class NotificationService {
    public function __construct(private SmsGateway $sms) {}

    public function notify(string $phone, string $message): void {
        $this->sms->send($phone, $message);
    }
}

// Wire it together
$service = new NotificationService(new TwilioAdapter(new TwilioSms()));
$service->notify('+1234567890', 'Your order is ready!');
```

In short: Adapter Pattern makes incompatible interfaces work together without modifying either class.

---

## 9. What is the Facade Pattern?

- The Facade Pattern provides a simple interface to a complex system or subsystem.
- It hides the complexity behind a clean, easy-to-use API.
- Does not change the underlying functionality — just simplifies access.

```php
// Complex subsystem — logging involves many steps
class FileHandler {
    public function open(string $path): resource { /* ... */ }
    public function write(resource $handle, string $data): void { /* ... */ }
    public function close(resource $handle): void { /* ... */ }
}

class LogFormatter {
    public function format(string $level, string $message): string {
        return "[{$level}] " . date('Y-m-d H:i:s') . " - {$message}";
    }
}

// Facade simplifies access
class Log {
    private static FileHandler $handler;
    private static LogFormatter $formatter;

    public static function info(string $message): void {
        // Internally coordinates the subsystem
        $formatted = static::$formatter->format('INFO', $message);
        $handle    = static::$handler->open('app.log');
        static::$handler->write($handle, $formatted);
        static::$handler->close($handle);
    }
}

// Simple to use
Log::info('User logged in');
```

**Laravel Facades:**
- `Cache::get('key')` — hides the cache manager complexity.
- `DB::table('users')->get()` — hides the database connection complexity.
- `Route::get('/home', ...)` — hides the router complexity.

In short: Facade provides a simple interface to a complex system — easy to use without knowing the internals.

---

## 10. What is the Strategy Pattern?

- The Strategy Pattern defines a family of algorithms, puts each one in a separate class, and makes them interchangeable.
- The caller chooses which strategy to use at runtime.
- Avoids large `if/else` or `switch` blocks for choosing behavior.

```php
interface SortStrategy {
    public function sort(array $data): array;
}

class BubbleSort implements SortStrategy {
    public function sort(array $data): array {
        // Bubble sort logic
        return $data;
    }
}

class QuickSort implements SortStrategy {
    public function sort(array $data): array {
        // Quick sort logic
        return $data;
    }
}

class Sorter {
    public function __construct(private SortStrategy $strategy) {}

    public function sort(array $data): array {
        return $this->strategy->sort($data);
    }
}

// Switch strategy at runtime
$sorter = new Sorter(new QuickSort());
$result = $sorter->sort([3, 1, 4, 1, 5]);

// Easy to swap strategy
$sorter = new Sorter(new BubbleSort());
```

**Laravel uses Strategy Pattern in:**
- Cache drivers: file, redis, database — swap without changing code.
- Mail drivers: SMTP, Mailgun, SES — configurable via `.env`.
- Queue drivers: sync, database, redis — interchangeable.

In short: Strategy Pattern lets you swap algorithms or behaviors at runtime without changing the calling code.

---

## 11. What is the Command Pattern?

- The Command Pattern encapsulates an action (or request) as an object.
- It separates the sender from the receiver — the sender does not need to know how the action is performed.
- Supports: queuing, logging, and undoing operations.

```php
interface Command {
    public function execute(): void;
}

class CreateOrderCommand implements Command {
    public function __construct(
        private User $user,
        private array $items,
        private OrderService $service
    ) {}

    public function execute(): void {
        $this->service->placeOrder($this->user, $this->items);
    }
}

class CommandBus {
    public function dispatch(Command $command): void {
        $command->execute();
    }
}

// Usage
$command = new CreateOrderCommand($user, $items, $orderService);
$bus = new CommandBus();
$bus->dispatch($command);
```

**Laravel uses the Command Pattern in:**
- Artisan commands (`php artisan make:model`).
- Queued Jobs (`dispatch(new ProcessPayment($order))`).

In short: Command Pattern wraps actions as objects — making them queueable, loggable, and decoupled from the caller.

---

## 12. What is the Dependency Injection Pattern?

- Dependency Injection (DI) means providing a class with its dependencies from the outside instead of creating them inside.
- Promotes loose coupling, testability, and flexibility.
- Laravel's Service Container automatically resolves and injects dependencies.

```php
// ❌ Without DI — tightly coupled
class UserController {
    private UserService $service;

    public function __construct() {
        $this->service = new UserService(new UserRepository(), new UserMailer());
    }
}

// ✅ With DI — loosely coupled
class UserController extends Controller {
    public function __construct(private UserService $service) {
        // Laravel automatically injects UserService with all its own dependencies
    }

    public function index(): JsonResponse {
        return response()->json($this->service->getAllUsers());
    }
}
```

**Types of Dependency Injection:**

| Type | How |
|------|-----|
| **Constructor Injection** | Via `__construct()` (most common) |
| **Method Injection** | Via method parameters |
| **Property Injection** | Via public properties (less common) |

In short: DI gives a class what it needs from outside — makes code testable, flexible, and decoupled.

---

## 13. What is the MVC Pattern?

- MVC (Model–View–Controller) separates the app into three layers, each with a clear responsibility.

| Layer | Responsibility | Laravel Example |
|-------|---------------|-----------------|
| **Model** | Data & database logic | `User`, `Post` (Eloquent models) |
| **View** | Display / UI | Blade templates, JSON responses |
| **Controller** | Handles requests, connects M and V | `UserController` |

```
Browser → Request → Router → Controller → Model → Database
                                       ↓
                                     View → Response → Browser
```

**Why MVC matters:**
- Separation of concerns — each layer has one job.
- Easier to maintain and test.
- Multiple developers can work on different layers simultaneously.

In short: MVC splits your app into data (Model), display (View), and logic (Controller) for clean, organized code.

---

## 14. What is the Decorator Pattern?

- The Decorator Pattern adds new behavior to an object **dynamically** without modifying its class.
- Wraps an existing object and adds extra functionality.
- Follows the Open/Closed Principle — you extend behavior without changing existing code.

```php
interface Logger {
    public function log(string $message): void;
}

class FileLogger implements Logger {
    public function log(string $message): void {
        file_put_contents('app.log', $message . PHP_EOL, FILE_APPEND);
    }
}

// Decorator adds timestamps without changing FileLogger
class TimestampLogger implements Logger {
    public function __construct(private Logger $logger) {}

    public function log(string $message): void {
        $timestamped = '[' . date('Y-m-d H:i:s') . '] ' . $message;
        $this->logger->log($timestamped); // Delegates to the wrapped logger
    }
}

// Stack decorators
$logger = new TimestampLogger(new FileLogger());
$logger->log('User logged in');
// Output: [2024-01-01 12:00:00] User logged in
```

**Laravel uses the Decorator Pattern in:**
- Middleware — each middleware wraps the request/response and adds behavior.
- HTTP Client — `Http::withHeaders()->withToken()->timeout()->get()`.

In short: Decorator Pattern adds behavior to objects by wrapping them — no inheritance needed.

---

## 15. What is the Chain of Responsibility Pattern?

- The Chain of Responsibility Pattern passes a request through a chain of handlers.
- Each handler decides to either process the request or pass it to the next handler.
- Decouples the sender from the receiver — you don't know which handler will process it.

```php
abstract class Handler {
    private ?Handler $next = null;

    public function setNext(Handler $handler): Handler {
        $this->next = $handler;
        return $handler;
    }

    public function handle(Request $request): ?Response {
        if ($this->next) {
            return $this->next->handle($request);
        }
        return null;
    }
}

class AuthMiddleware extends Handler {
    public function handle(Request $request): ?Response {
        if (!$request->user()) {
            return response()->json(['error' => 'Unauthenticated'], 401);
        }
        return parent::handle($request); // Pass to next handler
    }
}

class RateLimitMiddleware extends Handler {
    public function handle(Request $request): ?Response {
        if ($this->isRateLimited($request)) {
            return response()->json(['error' => 'Too many requests'], 429);
        }
        return parent::handle($request); // Pass to next handler
    }

    private function isRateLimited(Request $request): bool { return false; }
}
```

**Laravel uses this pattern in:**
- **Middleware pipeline** — each middleware handles or passes the request to the next.
- **Exception handler** — handlers check if they can handle the exception or pass it on.

In short: Chain of Responsibility passes a request through a chain — each handler decides to process it or pass it on.

---

## 16. Design Pattern Categories

Design patterns are grouped into four main categories:

| Category | Purpose | Examples |
|----------|---------|---------|
| **Creational** | How objects are created | Factory, Singleton, Builder |
| **Structural** | How objects are composed | Adapter, Decorator, Facade |
| **Behavioral** | How objects communicate | Observer, Strategy, Command, Chain of Responsibility |
| **Architectural** | How the whole system is organized | MVC, Repository, Service |

**Creational Patterns** — Object creation:
- **Factory**: Creates objects without specifying the exact class.
- **Singleton**: Ensures only one instance exists.
- **Builder**: Constructs complex objects step by step.

**Structural Patterns** — Object composition:
- **Adapter**: Makes incompatible interfaces work together.
- **Decorator**: Adds behavior to objects dynamically.
- **Facade**: Provides a simple interface to a complex system.

**Behavioral Patterns** — Object communication:
- **Observer**: Objects react to events automatically.
- **Strategy**: Swappable algorithms at runtime.
- **Command**: Encapsulates actions as objects.
- **Chain of Responsibility**: Passes requests through a chain of handlers.

**Architectural Patterns** — System structure:
- **MVC**: Separates data, UI, and logic.
- **Repository**: Separates data access from business logic.
- **Service**: Separates business logic from controllers.

In short: Creational patterns create objects, Structural patterns compose them, Behavioral patterns coordinate communication, and Architectural patterns organize the whole system.
