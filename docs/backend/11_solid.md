# SOLID Principles Guide

A comprehensive guide to SOLID principles and related PHP/Laravel concepts.

## Table of Contents

1. [What are the SOLID Principles?](#1-what-are-the-solid-principles)
2. [What are Traits in PHP?](#2-what-are-traits-in-php)
3. [Difference between == and === for objects](#3-difference-between--and--for-objects)
4. [Single Responsibility Principle (SRP)](#4-single-responsibility-principle-srp)
5. [Open/Closed Principle (OCP)](#5-openclosed-principle-ocp)
6. [Liskov Substitution Principle (LSP)](#6-liskov-substitution-principle-lsp)
7. [Interface Segregation Principle (ISP)](#7-interface-segregation-principle-isp)
8. [Dependency Inversion Principle (DIP)](#8-dependency-inversion-principle-dip)

---

## 1. What are the SOLID Principles?

- SOLID is a set of five principles that help you write clean, maintainable, and scalable object-oriented code.
- Each letter stands for one principle.

| Letter | Principle | Short Meaning |
|--------|-----------|---------------|
| **S** | Single Responsibility | One class = one job |
| **O** | Open/Closed | Open to extend, closed to modify |
| **L** | Liskov Substitution | Child classes must work as their parent |
| **I** | Interface Segregation | Don't force classes to implement unused methods |
| **D** | Dependency Inversion | Depend on abstractions, not concrete classes |

In short: SOLID principles guide you to write code that is easy to understand, extend, and maintain.

---

## 2. What are Traits in PHP?

- A **Trait** is a reusable block of code that can be shared between classes without using inheritance.
- PHP only supports single inheritance, so Traits solve the problem of sharing code between multiple unrelated classes.
- Use the `use` keyword inside a class to include a trait.

```php
trait Timestamps {
    public function getCreatedAt(): string {
        return $this->created_at->format('Y-m-d');
    }
}

class Post {
    use Timestamps;
}

class Comment {
    use Timestamps;
}

$post = new Post();
$post->getCreatedAt(); // Works in Post

$comment = new Comment();
$comment->getCreatedAt(); // Works in Comment too
```

**Laravel uses traits extensively:**
- `HasFactory` → adds factory support to models.
- `SoftDeletes` → adds soft delete support to models.
- `Notifiable` → allows sending notifications to users.

In short: Traits let you share methods between multiple classes without using inheritance.

---

## 3. Difference between == and === for objects

| Operator | Checks | Objects |
|----------|--------|---------|
| `==` | Same property values | True if same class and equal properties |
| `===` | Same instance in memory | True only if the exact same object |

```php
class Point {
    public function __construct(
        public int $x,
        public int $y
    ) {}
}

$a = new Point(1, 2);
$b = new Point(1, 2);
$c = $a;

var_dump($a == $b);  // true  — same class, same values
var_dump($a === $b); // false — different instances in memory
var_dump($a === $c); // true  — same instance (reference)
```

In short: `==` compares values, `===` compares identity (same object in memory).

---

## 4. Single Responsibility Principle (SRP)

- A class should have only **one reason to change** — only one job or responsibility.
- If a class does too many things, changes in one part can break another part.

```php
// ❌ Violates SRP — one class does too many things
class UserService {
    public function createUser(array $data): User { ... }
    public function sendWelcomeEmail(User $user): void { ... }
    public function generatePdfReport(User $user): void { ... }
}

// ✅ Follows SRP — each class has one job
class UserService {
    public function createUser(array $data): User { ... }
}

class UserMailer {
    public function sendWelcomeEmail(User $user): void { ... }
}

class UserReportGenerator {
    public function generatePdfReport(User $user): void { ... }
}
```

In short: One class = one job. If a class has multiple responsibilities, split it.

---

## 5. Open/Closed Principle (OCP)

- A class should be **open for extension** but **closed for modification**.
- You should be able to add new behavior without changing existing code.
- Use interfaces or abstract classes to allow extension.

```php
// ❌ Violates OCP — you must edit this class to add a new payment method
class PaymentProcessor {
    public function process(string $type, float $amount): void {
        if ($type === 'stripe') {
            // Stripe logic
        } elseif ($type === 'paypal') {
            // PayPal logic
        }
        // Adding a new method requires modifying this class ❌
    }
}

// ✅ Follows OCP — add new payment methods without modifying existing code
interface PaymentGateway {
    public function charge(float $amount): bool;
}

class StripeGateway implements PaymentGateway {
    public function charge(float $amount): bool { /* Stripe */ return true; }
}

class PayPalGateway implements PaymentGateway {
    public function charge(float $amount): bool { /* PayPal */ return true; }
}

// New payment method? Just add a new class — no changes to existing code ✅
class MamoPayGateway implements PaymentGateway {
    public function charge(float $amount): bool { /* MamoPay */ return true; }
}

class PaymentProcessor {
    public function process(PaymentGateway $gateway, float $amount): void {
        $gateway->charge($amount);
    }
}
```

In short: Extend behavior by adding new classes, not by editing existing ones.

---

## 6. Liskov Substitution Principle (LSP)

- A child class must be **substitutable** for its parent class without breaking the program.
- If you replace a parent object with a child object, the code should still work correctly.
- Child classes should follow the same behavior contract as their parent.

```php
// ❌ Violates LSP — child breaks the expected behavior
class Bird {
    public function fly(): void {
        echo 'Flying';
    }
}

class Penguin extends Bird {
    public function fly(): void {
        throw new \Exception('Penguins cannot fly!'); // ❌ Breaks parent contract
    }
}

// ✅ Follows LSP — redesign the hierarchy
interface Flyable {
    public function fly(): void;
}

class Sparrow implements Flyable {
    public function fly(): void { echo 'Flying'; }
}

class Penguin {
    public function swim(): void { echo 'Swimming'; }
    // No fly() — not forced to implement what it cannot do ✅
}
```

In short: A child class must honor the behavior contract of its parent — substituting one for the other should not break things.

---

## 7. Interface Segregation Principle (ISP)

- A class should **not be forced to implement methods it does not use**.
- Large, general interfaces should be split into smaller, specific ones.
- Each interface should serve one specific purpose.

```php
// ❌ Violates ISP — one big interface forces all classes to implement everything
interface Worker {
    public function work(): void;
    public function eat(): void;
    public function sleep(): void;
}

class Robot implements Worker {
    public function work(): void { echo 'Working'; }
    public function eat(): void { /* Robots don't eat — forced to implement */ }
    public function sleep(): void { /* Robots don't sleep — forced to implement */ }
}

// ✅ Follows ISP — split into small, focused interfaces
interface Workable {
    public function work(): void;
}

interface Eatable {
    public function eat(): void;
}

interface Sleepable {
    public function sleep(): void;
}

class Human implements Workable, Eatable, Sleepable {
    public function work(): void { echo 'Working'; }
    public function eat(): void { echo 'Eating'; }
    public function sleep(): void { echo 'Sleeping'; }
}

class Robot implements Workable {
    public function work(): void { echo 'Working'; }
    // Only implements what it needs ✅
}
```

In short: Design small, focused interfaces. Don't force classes to implement methods they will never use.

---

## 8. Dependency Inversion Principle (DIP)

- High-level classes should **not depend on low-level classes**.
- Both should depend on **abstractions** (interfaces or abstract classes).
- The detail (implementation) depends on the abstraction, not the other way around.

```php
// ❌ Violates DIP — high-level class depends directly on a low-level class
class OrderService {
    private StripePayment $payment;

    public function __construct() {
        $this->payment = new StripePayment(); // Tightly coupled ❌
    }

    public function checkout(float $amount): void {
        $this->payment->charge($amount);
    }
}

// ✅ Follows DIP — both depend on an abstraction
interface PaymentGateway {
    public function charge(float $amount): bool;
}

class StripePayment implements PaymentGateway {
    public function charge(float $amount): bool { return true; }
}

class PayPalPayment implements PaymentGateway {
    public function charge(float $amount): bool { return true; }
}

class OrderService {
    public function __construct(
        private PaymentGateway $payment // Depends on abstraction ✅
    ) {}

    public function checkout(float $amount): void {
        $this->payment->charge($amount);
    }
}

// Laravel Service Container handles the binding
app()->bind(PaymentGateway::class, StripePayment::class);
```

**In Laravel:**
- Contracts (interfaces) define behavior.
- The Service Container resolves which implementation to inject.
- You can swap implementations without changing high-level code.

In short: Depend on interfaces, not concrete classes — makes your code flexible and easy to test.
