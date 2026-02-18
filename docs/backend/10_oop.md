# Object-Oriented Programming (OOP) Guide

A comprehensive guide to OOP concepts and how they apply in PHP and Laravel.

## Table of Contents

1. [What is Object-Oriented Programming?](#1-what-is-object-oriented-programming)
2. [Difference between a Class and an Object](#2-difference-between-a-class-and-an-object)
3. [What are the four pillars of OOP?](#3-what-are-the-four-pillars-of-oop)
4. [What is Encapsulation?](#4-what-is-encapsulation)
5. [What is Inheritance?](#5-what-is-inheritance)
6. [What is Polymorphism?](#6-what-is-polymorphism)
7. [What is Abstraction?](#7-what-is-abstraction)
8. [Difference between an Abstract Class and an Interface](#8-difference-between-an-abstract-class-and-an-interface)
9. [What are Access Modifiers?](#9-what-are-access-modifiers)
10. [What is Method Overriding?](#10-what-is-method-overriding)
11. [What is Method Overloading?](#11-what-is-method-overloading)
12. [What are Constructor and Destructor?](#12-what-are-constructor-and-destructor)
13. [What is the static keyword?](#13-what-is-the-static-keyword)
14. [Difference between self and $this](#14-difference-between-self-and-this)
15. [What is the final keyword?](#15-what-is-the-final-keyword)
16. [What is Composition over Inheritance?](#16-what-is-composition-over-inheritance)
17. [What is Dependency Injection?](#17-what-is-dependency-injection)
18. [Difference between include, require, include_once, and require_once](#18-difference-between-include-require-include_once-and-require_once)
19. [What is a Namespace in PHP?](#19-what-is-a-namespace-in-php)
20. [What is Autoloading in PHP?](#20-what-is-autoloading-in-php)
21. [How does Laravel use OOP concepts?](#21-how-does-laravel-use-oop-concepts)
22. [Difference between bind() and singleton() in Laravel](#22-difference-between-bind-and-singleton-in-laravel)

---

## 1. What is Object-Oriented Programming?

- OOP is a programming style where code is organized into objects that contain both data and functions.
- Example: A car is an object.
  - Data: color, brand, speed.
  - Actions: drive, brake, stop.

---

## 2. Difference between a Class and an Object

- A **class** is a blueprint that defines properties and methods.
- An **object** is an actual instance created from that class.

```php
// Class (blueprint)
class Car {
    public string $color;
    public function drive(): void { echo 'Driving'; }
}

// Object (instance)
$car = new Car();
$car->color = 'Red';
$car->drive();
```

In short: One class can be used to create many objects, each with different data.

---

## 3. What are the four pillars of OOP?

- **Encapsulation**: Keeps data and methods together and hides internal details.
- **Inheritance**: Allows a class to reuse and extend another class.
- **Polymorphism**: Same method name, different behavior depending on the object.
- **Abstraction**: Shows only important features and hides complex logic.

---

## 4. What is Encapsulation?

- Wrapping data and methods together and controlling access to that data.
- Protects internal data so it cannot be changed directly from outside the class.
- Achieved using access modifiers: `private`, `protected`, and `public`.

```php
class BankAccount {
    private float $balance = 0;

    public function deposit(float $amount): void {
        $this->balance += $amount;
    }

    public function getBalance(): float {
        return $this->balance;
    }
}

$account = new BankAccount();
$account->deposit(100);
echo $account->getBalance(); // 100
// $account->balance = 9999; // ❌ Not allowed
```

---

## 5. What is Inheritance?

- Allows a child class to reuse properties and methods from a parent class.
- Write common code once in a parent class and reuse it in child classes.
- Use the `extends` keyword.
- Reduces code duplication and improves reusability.

```php
class Animal {
    public function breathe(): void { echo 'Breathing'; }
}

class Dog extends Animal {
    public function bark(): void { echo 'Woof!'; }
}

$dog = new Dog();
$dog->breathe(); // inherited
$dog->bark();    // own method
```

All Eloquent models inherit from the `Model` class to use database features.

---

## 6. What is Polymorphism?

- One method name with different behaviors, depending on the object.
- The same action works differently for different objects.

**Method Overriding** (most common):

```php
class Shape {
    public function area(): float { return 0; }
}

class Circle extends Shape {
    public function area(): float { return pi() * $this->radius ** 2; }
}

class Rectangle extends Shape {
    public function area(): float { return $this->width * $this->height; }
}
```

In short: One interface, multiple implementations — makes code flexible and easy to extend.

---

## 7. What is Abstraction?

- Hiding complex implementation details and showing only the necessary features.
- Focus on **what** an object does, not **how** it does it.
- Achieved using abstract classes and interfaces.
- You cannot create an object directly from an abstract class.

```php
abstract class Payment {
    abstract public function charge(float $amount): bool;

    public function logPayment(float $amount): void {
        Log::info("Payment of {$amount} processed");
    }
}

class StripePayment extends Payment {
    public function charge(float $amount): bool {
        // Stripe-specific logic
        return true;
    }
}
```

---

## 8. Difference between an Abstract Class and an Interface

| Feature | Abstract Class | Interface |
|---------|---------------|-----------|
| Methods | Can have implemented methods | Only method signatures (no implementation) |
| Properties | Can have properties | Cannot have properties |
| Constructor | Can have a constructor | Cannot have a constructor |
| Extend/Implement | A class can extend **one** | A class can implement **multiple** |
| Method visibility | Any visibility | Always `public` |

```php
// Abstract class
abstract class Animal {
    public string $name; // property allowed
    abstract public function speak(): string;
    public function breathe(): void { echo 'breathing'; } // implemented
}

// Interface
interface Flyable {
    public function fly(): void; // only signature
}

class Bird extends Animal implements Flyable {
    public function speak(): string { return 'tweet'; }
    public function fly(): void { echo 'flapping wings'; }
}
```

---

## 9. What are Access Modifiers?

- Access modifiers control who can access class properties and methods.

| Modifier | Accessible From | Use Case |
|----------|----------------|----------|
| `public` | Anywhere | API methods |
| `private` | Same class only | Internal helper methods |
| `protected` | Class + child classes | Methods children may use |

Default in PHP: `public` (if no modifier is specified).

---

## 10. What is Method Overriding?

- When a child class redefines a method from its parent class.
- Rules: same method name, same parameters, same or higher visibility.
- Purpose: customize behavior for the child class while keeping the same interface.

```php
class BaseController {
    public function index(): Response {
        return response('Base');
    }
}

class UserController extends BaseController {
    public function index(): Response { // Overriding parent
        return response('Users');
    }
}
```

---

## 11. What is Method Overloading?

- Multiple methods with the same name but different parameters.
- PHP does not support traditional method overloading like Java or C++.
- Alternatives in PHP:
  - Use default parameters.
  - Use variable-length arguments (`...$args`).

```php
// Using default parameters (PHP alternative)
public function find(int $id, bool $orFail = false): ?User {
    return $orFail ? User::findOrFail($id) : User::find($id);
}
```

---

## 12. What are Constructor and Destructor?

- **Constructor (`__construct`)**: Runs automatically when an object is created. Used to initialize data or set up resources.
- **Destructor (`__destruct`)**: Runs when an object is destroyed. Used to clean up resources like closing connections.

```php
class DatabaseConnection {
    private PDO $connection;

    public function __construct(string $dsn) {
        $this->connection = new PDO($dsn); // set up
    }

    public function __destruct() {
        $this->connection = null; // clean up
    }
}
```

---

## 13. What is the static keyword?

- `static` defines properties and methods that belong to the **class itself**, not to any object.
- Access from outside: `ClassName::$property` or `ClassName::method()`.
- Access from inside: `self::$property` or `self::method()`.

```php
class Counter {
    public static int $count = 0;

    public static function increment(): void {
        self::$count++;
    }
}

Counter::increment();
echo Counter::$count; // 1
```

`User::find()` or `Cache::get()` — static methods on facades.

---

## 14. Difference between self and $this

| | `$this` | `self` |
|-|---------|--------|
| Refers to | Current **object instance** | Current **class** |
| Needs object? | Yes | No |
| Used for | Non-static members | Static members |

```php
class Example {
    public string $name = 'Anwar';
    public static string $type = 'admin';

    public function show(): void {
        echo $this->name;    // instance property
        echo self::$type;    // static property
    }
}
```

---

## 15. What is the final keyword?

- The `final` keyword prevents a class from being extended or a method from being overridden.

```php
final class Config {
    // Cannot be extended
}

class BaseService {
    final public function connect(): void {
        // Cannot be overridden in child classes
    }
}
```

**Purpose:**
- Protect critical functionality.
- Ensure security.
- Prevent unwanted changes in business logic.

---

## 16. What is Composition over Inheritance?

- **Composition**: A class has a dependency (object) instead of inheriting from it.
- **Dependency Injection in Laravel**: You inject dependencies (objects) into a class via the constructor or method, instead of making your class extend another class.

```php
// Inheritance (tight coupling)
class ReportService extends PdfGenerator { ... }

// Composition (loose coupling - preferred)
class ReportService {
    public function __construct(private PdfGenerator $generator) {}
}
```

Laravel's dependency injection is an example of composition because a class uses other classes as dependencies rather than inheriting from them.

---

## 17. What is Dependency Injection?

- DI means giving a class its dependencies from outside instead of creating them inside the class.
- A class uses other classes, but does not create them itself.

**Why it's used:**
- Loose coupling.
- Easier testing (you can inject mocks).
- Flexible and maintainable code.

```php
// ❌ Without DI (tight coupling)
class OrderService {
    private $stripe;
    public function __construct() {
        $this->stripe = new StripePayment(); // creates own dependency
    }
}

// ✅ With DI (loose coupling)
class OrderService {
    public function __construct(private PaymentInterface $payment) {}
}
```

Laravel's Service Container automatically injects dependencies into controllers, jobs, and services.

---

## 18. Difference between include, require, include_once, and require_once

| Statement | File Missing | Load Multiple Times |
|-----------|-------------|---------------------|
| `include` | Warning only, continues | Yes |
| `require` | Fatal error, stops | Yes |
| `include_once` | Warning only, continues | No (loads once) |
| `require_once` | Fatal error, stops | No (loads once) |

- `require` → Critical files (config, core classes).
- `include` → Optional files (templates, views).
- `*_once` → Prevent redeclaration errors.

---

## 19. What is a Namespace in PHP?

- A way to organize and group related code like classes, interfaces, and functions.
- Helps avoid name conflicts and keeps code well organized.

```php
// Define
namespace App\Models;

class User { ... }

// Import
use App\Models\User;
$user = new User();

// Full path
$user = new \App\Models\User();
```

---

## 20. What is Autoloading in PHP?

- Classes are loaded automatically when needed, without writing `require` or `include`.
- How it works:
  - Follows the PSR-4 standard.
  - Namespaces map to folder paths.
  - Composer handles autoloading.
  - Laravel uses Composer autoloading, so you never manually include class files.

```json
// composer.json
{
    "autoload": {
        "psr-4": {
            "App\\": "app/"
        }
    }
}
```

---

## 21. How does Laravel use OOP concepts?

- **Models**: Use inheritance (`extends Model`) and traits (`HasFactory`, `SoftDeletes`).
- **Controllers**: Use inheritance and dependency injection.
- **Middleware**: Wraps requests (Decorator pattern).
- **Service Container**: Implements Dependency Injection.
- **Facades**: Static-looking access to underlying objects.
- **Contracts (Interfaces)**: Define service behavior.
- **Events & Listeners**: Observer pattern.
- **Collections**: Fluent interface and method chaining.

---

## 22. Difference between bind() and singleton() in Laravel

| Method | Creates | Use When |
|--------|---------|----------|
| `bind()` | New instance every time | API clients, temporary services |
| `singleton()` | One shared instance | Config, cache, logger |

```php
// New instance each time
app()->bind(PaymentInterface::class, StripePayment::class);

// Same instance always
app()->singleton(Logger::class, function () {
    return new Logger('app.log');
});
```
