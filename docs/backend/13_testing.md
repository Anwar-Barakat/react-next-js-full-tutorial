# PHP Testing Guide

A comprehensive guide to testing Laravel applications with PHPUnit and Pest PHP.

## Table of Contents

1. [What is PHPUnit?](#1-what-is-phpunit)
2. [What is Pest PHP?](#2-what-is-pest-php)
3. [Difference between PHPUnit and Pest](#3-difference-between-phpunit-and-pest)
4. [Setting up Pest in Laravel](#4-setting-up-pest-in-laravel)
5. [Test Structure](#5-test-structure)
6. [Writing Assertions](#6-writing-assertions)
7. [Testing with the Database](#7-testing-with-the-database)
8. [Testing HTTP Requests](#8-testing-http-requests)
9. [Testing API Endpoints](#9-testing-api-endpoints)
10. [Authentication in Tests](#10-authentication-in-tests)
11. [Mocking and Faking](#11-mocking-and-faking)
12. [Testing Queues, Mail, and Events](#12-testing-queues-mail-and-events)
13. [Higher Order Tests in Pest](#13-higher-order-tests-in-pest)
14. [Running Tests](#14-running-tests)

---

## 1. What is PHPUnit?

- PHPUnit is the standard testing framework for PHP.
- Laravel ships with PHPUnit pre-configured and ready to use.
- Tests are written as classes that extend `TestCase`.
- Each test is a method prefixed with `test` or annotated with `@test`.

```php
// tests/Feature/UserTest.php
class UserTest extends TestCase
{
    public function test_user_can_be_created(): void
    {
        $user = User::factory()->create();

        $this->assertNotNull($user->id);
        $this->assertDatabaseHas('users', ['email' => $user->email]);
    }
}
```

In short: PHPUnit is the traditional PHP testing framework — class-based, verbose, but very powerful.

---

## 2. What is Pest PHP?

- Pest is a testing framework built on top of PHPUnit with a cleaner, simpler syntax.
- You write tests as functions (`it()` / `test()`) instead of methods inside classes.
- Supports all PHPUnit features — it is PHPUnit underneath.
- Designed to make testing more enjoyable and readable.

```php
// tests/Feature/UserTest.php (Pest)
it('can create a user', function () {
    $user = User::factory()->create();

    expect($user->id)->not->toBeNull();
    expect($user->email)->toBeString();
});
```

In short: Pest is a modern, cleaner wrapper around PHPUnit — same power, better syntax.

---

## 3. Difference between PHPUnit and Pest

| Feature | PHPUnit | Pest |
|---------|---------|------|
| Syntax | Class + methods | Functions (`it`, `test`) |
| Assertions | `$this->assert*()` | `expect()->to*()` (fluent) |
| Readability | Verbose | Clean and readable |
| Setup/Teardown | `setUp()` / `tearDown()` | `beforeEach()` / `afterEach()` |
| Grouping | Class per group | `describe()` blocks |
| Built on | Native | PHPUnit underneath |
| Laravel support | Native | First-class via `pestphp/pest-plugin-laravel` |

```php
// PHPUnit style
public function test_user_email_is_unique(): void
{
    User::factory()->create(['email' => 'test@example.com']);
    $this->assertDatabaseCount('users', 1);
}

// Pest style
it('has a unique email', function () {
    User::factory()->create(['email' => 'test@example.com']);
    expect(User::count())->toBe(1);
});
```

In short: Same result, different style — Pest reads like plain English, PHPUnit is more traditional.

---

## 4. Setting up Pest in Laravel

```bash
# Install Pest with the Laravel plugin
composer require pestphp/pest --dev --with-all-dependencies
composer require pestphp/pest-plugin-laravel --dev

# Initialize Pest (creates Pest.php config file)
php artisan pest:install
```

**`tests/Pest.php`** — the global config file:

```php
<?php

// All Feature tests extend the base Laravel TestCase
uses(Tests\TestCase::class)->in('Feature');

// All Unit tests use basic TestCase
uses(Tests\TestCase::class)->in('Unit');

// Global trait — apply RefreshDatabase to all Feature tests
uses(RefreshDatabase::class)->in('Feature');
```

**Create a test:**

```bash
php artisan make:test UserTest          # PHPUnit style
php artisan make:test UserTest --pest   # Pest style
```

---

## 5. Test Structure

**Pest test file structure:**

```php
<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

// describe() groups related tests
describe('User', function () {

    // beforeEach runs before every test in this group
    beforeEach(function () {
        $this->user = User::factory()->create();
    });

    it('has a name', function () {
        expect($this->user->name)->toBeString();
    });

    it('has an email', function () {
        expect($this->user->email)->toContain('@');
    });

    it('can be soft deleted', function () {
        $this->user->delete();
        expect(User::count())->toBe(0);
        expect(User::withTrashed()->count())->toBe(1);
    });
});
```

**PHPUnit style:**

```php
class UserTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }

    public function test_has_a_name(): void
    {
        $this->assertIsString($this->user->name);
    }
}
```

---

## 6. Writing Assertions

**Pest `expect()` API (fluent):**

```php
// Values
expect($value)->toBe(42);           // strict equality (===)
expect($value)->toEqual('hello');   // loose equality (==)
expect($value)->toBeTrue();
expect($value)->toBeFalse();
expect($value)->toBeNull();
expect($value)->not->toBeNull();

// Strings
expect($string)->toContain('hello');
expect($string)->toStartWith('Hello');
expect($string)->toEndWith('world');
expect($string)->toBeString();

// Numbers
expect($number)->toBeGreaterThan(5);
expect($number)->toBeLessThan(100);
expect($number)->toBeInt();
expect($number)->toBeFloat();

// Arrays
expect($array)->toHaveCount(3);
expect($array)->toContain('apple');
expect($array)->toHaveKey('name');
expect($array)->toMatchArray(['name' => 'Anwar']);

// Laravel-specific
expect($model)->toBeInstanceOf(User::class);
```

**PHPUnit assertions:**

```php
$this->assertTrue($condition);
$this->assertFalse($condition);
$this->assertNull($value);
$this->assertNotNull($value);
$this->assertEquals('expected', $actual);
$this->assertSame('expected', $actual);   // strict
$this->assertCount(3, $array);
$this->assertInstanceOf(User::class, $model);
$this->assertStringContainsString('hello', $string);
```

---

## 7. Testing with the Database

**`RefreshDatabase`** — Resets the database between every test (uses transactions — fast):

```php
// In Pest.php (global)
uses(RefreshDatabase::class)->in('Feature');

// Or per test file
uses(RefreshDatabase::class);

it('creates a user in the database', function () {
    User::factory()->create(['name' => 'Anwar', 'email' => 'anwar@test.com']);

    // Assert row exists in DB
    $this->assertDatabaseHas('users', [
        'name'  => 'Anwar',
        'email' => 'anwar@test.com',
    ]);
});

it('deletes a user from the database', function () {
    $user = User::factory()->create();
    $user->delete();

    $this->assertDatabaseMissing('users', ['id' => $user->id]);
    $this->assertDatabaseCount('users', 0);
});
```

**Using Factories:**

```php
it('returns all posts for a user', function () {
    $user = User::factory()
        ->has(Post::factory()->count(3))
        ->create();

    expect($user->posts)->toHaveCount(3);
});
```

---

## 8. Testing HTTP Requests

Laravel provides a fluent HTTP testing API to simulate browser requests:

```php
it('shows the home page', function () {
    $response = $this->get('/');

    $response->assertStatus(200);
    $response->assertSee('Welcome');
});

it('redirects unauthenticated users', function () {
    $response = $this->get('/dashboard');

    $response->assertRedirect('/login');
});

it('stores a new post', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post('/posts', [
        'title'   => 'My First Post',
        'content' => 'Hello World!',
    ]);

    $response->assertRedirect('/posts');
    $this->assertDatabaseHas('posts', ['title' => 'My First Post']);
});
```

**Common HTTP assertions:**

```php
$response->assertStatus(200);
$response->assertOk();              // 200
$response->assertCreated();         // 201
$response->assertNoContent();       // 204
$response->assertNotFound();        // 404
$response->assertForbidden();       // 403
$response->assertUnauthorized();    // 401
$response->assertRedirect('/url');
$response->assertSee('text');
$response->assertDontSee('text');
$response->assertViewIs('posts.index');
$response->assertViewHas('posts');
```

---

## 9. Testing API Endpoints

```php
it('returns a list of posts as JSON', function () {
    Post::factory()->count(5)->create();

    $response = $this->getJson('/api/posts');

    $response->assertOk()
             ->assertJsonCount(5, 'data')
             ->assertJsonStructure([
                 'data' => [
                     '*' => ['id', 'title', 'content', 'created_at'],
                 ],
             ]);
});

it('creates a post via API', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user, 'sanctum')
                     ->postJson('/api/posts', [
                         'title'   => 'Test Post',
                         'content' => 'Test Content',
                     ]);

    $response->assertCreated()
             ->assertJsonPath('data.title', 'Test Post');
});

it('returns validation errors', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user, 'sanctum')
                     ->postJson('/api/posts', []);

    $response->assertUnprocessable()        // 422
             ->assertJsonValidationErrors(['title', 'content']);
});
```

**JSON assertions:**

```php
$response->assertJson(['key' => 'value']);        // Partial match
$response->assertExactJson(['key' => 'value']);    // Exact match
$response->assertJsonPath('data.user.name', 'Anwar');
$response->assertJsonCount(5, 'data');
$response->assertJsonStructure(['data' => ['id', 'name']]);
$response->assertJsonMissing(['password']);
```

---

## 10. Authentication in Tests

```php
// Act as a specific user
it('shows dashboard to authenticated user', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
         ->get('/dashboard')
         ->assertOk();
});

// Act as a user with Sanctum (API)
it('fetches user profile via API', function () {
    $user = User::factory()->create();

    $this->actingAs($user, 'sanctum')
         ->getJson('/api/user')
         ->assertOk()
         ->assertJsonPath('name', $user->name);
});

// Test that guests are blocked
it('blocks guests from dashboard', function () {
    $this->get('/dashboard')->assertRedirect('/login');
});

// Test that guests cannot access API
it('blocks unauthenticated API requests', function () {
    $this->getJson('/api/user')->assertUnauthorized();
});

// Pest shorthand with beforeEach
beforeEach(function () {
    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

it('can access profile', function () {
    $this->get('/profile')->assertOk();
});
```

---

## 11. Mocking and Faking

Laravel provides built-in fakes so you never actually send emails, dispatch jobs, or fire events during tests:

```php
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;

// Fake emails — nothing gets sent
it('sends a welcome email on registration', function () {
    Mail::fake();

    $user = User::factory()->create();
    $user->notify(new WelcomeMail());

    Mail::assertSent(WelcomeMail::class, function ($mail) use ($user) {
        return $mail->hasTo($user->email);
    });
});

// Fake queues — jobs are not dispatched
it('dispatches a job when order is placed', function () {
    Queue::fake();

    $this->actingAs(User::factory()->create())
         ->postJson('/api/orders', [...]);

    Queue::assertPushed(ProcessOrderJob::class);
});

// Fake events — events are not fired
it('fires OrderPlaced event', function () {
    Event::fake();

    Order::factory()->create();

    Event::assertDispatched(OrderPlaced::class);
});

// Fake HTTP client — no real HTTP calls
it('calls the payment API', function () {
    Http::fake([
        'api.stripe.com/*' => Http::response(['status' => 'success'], 200),
    ]);

    $result = app(PaymentService::class)->charge(100);

    expect($result)->toBe(true);
    Http::assertSent(fn ($request) => $request->url() === 'https://api.stripe.com/v1/charges');
});

// Fake storage — no real files written
it('uploads a profile image', function () {
    Storage::fake('public');

    $file = UploadedFile::fake()->image('avatar.jpg');
    $this->actingAs(User::factory()->create())
         ->post('/profile/avatar', ['avatar' => $file]);

    Storage::disk('public')->assertExists('avatars/' . $file->hashName());
});
```

---

## 12. Testing Queues, Mail, and Events

```php
// Assert a notification was sent to a user
it('notifies user when order ships', function () {
    Notification::fake();

    $user  = User::factory()->create();
    $order = Order::factory()->create(['user_id' => $user->id]);

    $order->markAsShipped();

    Notification::assertSentTo($user, OrderShipped::class);
});

// Assert nothing was sent
it('does not send duplicate emails', function () {
    Mail::fake();

    User::factory()->create();

    Mail::assertNothingSent();
});

// Assert a job was pushed to a specific queue
it('pushes payment job to high-priority queue', function () {
    Queue::fake();

    ProcessPayment::dispatch($order)->onQueue('high');

    Queue::assertPushedOn('high', ProcessPayment::class);
});
```

---

## 13. Higher Order Tests in Pest

Pest allows chaining tests and using shared datasets:

```php
// Dataset — run the same test with multiple inputs
it('validates required fields', function (string $field) {
    $user = User::factory()->create();

    $this->actingAs($user)
         ->postJson('/api/posts', [$field => ''])
         ->assertJsonValidationErrors([$field]);

})->with(['title', 'content', 'category']);

// Shared state with beforeEach
beforeEach(function () {
    $this->admin = User::factory()->state(['role' => 'admin'])->create();
    $this->actingAs($this->admin);
});

it('can create a post')->todo();  // Placeholder for future test
it('can delete a post')->todo();

// Skip a test
it('can export to CSV', function () {
    // ...
})->skip('CSV export not implemented yet');
```

---

## 14. Running Tests

```bash
# Run all tests
php artisan test

# Run with Pest directly
./vendor/bin/pest

# Run a specific file
php artisan test tests/Feature/UserTest.php

# Run tests matching a name
php artisan test --filter="can create a user"

# Run only a specific group/describe
./vendor/bin/pest --group=users

# Run in parallel (faster)
php artisan test --parallel

# Show coverage report
php artisan test --coverage

# Stop on first failure
php artisan test --stop-on-failure

# Run only unit tests
php artisan test --testsuite=Unit

# Run only feature tests
php artisan test --testsuite=Feature
```

**Test types:**

| Type | Location | Purpose |
|------|----------|---------|
| **Unit** | `tests/Unit/` | Test a single class or method in isolation |
| **Feature** | `tests/Feature/` | Test a full flow (HTTP, DB, auth together) |
