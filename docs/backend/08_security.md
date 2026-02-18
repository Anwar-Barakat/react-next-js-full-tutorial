# Laravel Security Guide

A comprehensive guide to security, authentication, and authorization in Laravel.

## Table of Contents

1. [What is the purpose of the .env file?](#1-what-is-the-purpose-of-the-env-file)
2. [What is the config directory used for?](#2-what-is-the-config-directory-used-for)
3. [What is a DDoS attack?](#3-what-is-a-ddos-attack)
4. [What is CSRF Protection?](#4-what-is-csrf-protection)
5. [How does Laravel handle CSRF in SPAs?](#5-how-does-laravel-handle-csrf-in-spas)
6. [What is the @csrf directive?](#6-what-is-the-csrf-directive)
7. [What are Laravel Policies?](#7-what-are-laravel-policies)
8. [Difference between Gates and Policies](#8-difference-between-gates-and-policies)
9. [What is Laravel Sanctum?](#9-what-is-laravel-sanctum)
10. [What are API Resources in Laravel?](#10-what-are-api-resources-in-laravel)
11. [Difference between Resource and ResourceCollection](#11-difference-between-resource-and-resourcecollection)
12. [How do you secure a Laravel application?](#12-how-do-you-secure-a-laravel-application)
13. [What is Role-Based Access Control (RBAC)?](#13-what-is-role-based-access-control-rbac)
14. [Implementing RBAC in Laravel](#14-implementing-rbac-in-laravel)

---

## 1. What is the purpose of the .env file?

- `.env` is used to store configuration values that depend on the environment your app is running in.
- It keeps sensitive data out of the codebase, such as:
  - Database username & password.
  - API keys.
  - App environment (local, production).
- Each environment can have its own `.env` file without changing the code.
- Laravel reads these values using the `env()` helper or `config()`.
- The file is never committed to Git to avoid leaking secrets.

In short: `.env` separates sensitive and environment-specific settings from your application code.

---

## 2. What is the config directory used for?

- The `config` directory holds all the configuration files for your Laravel app.
- Each file groups related settings in a clear, organized way:
  - `app.php` → General app settings.
  - `database.php` → Database connections.
  - `mail.php` → Email settings.
  - `filesystems.php` → Storage (local, S3, etc.).
- You can read these values using the `config()` helper anywhere in your code.

```php
config('app.name');        // "Laravel"
config('database.default'); // "mysql"
```

In short: The `config` directory stores organized settings that shape how the Laravel app behaves.

---

## 3. What is a DDoS attack?

- A **Distributed Denial of Service** attack floods a website with fake traffic from many computers at once.
- This overloads the server, making it slow or completely unavailable.
- Analogy: Hundreds of fake customers block a store entrance — real customers can't get in.

**Protection:**
- Use DDoS protection services (Cloudflare, AWS Shield).
- Apply rate limiting.
- Use CDNs to distribute traffic.
- Increase server capacity.

In short: A DDoS attack clogs your site with fake requests, stopping real users from accessing it.

---

## 4. What is CSRF Protection?

- CSRF (Cross-Site Request Forgery) stops attackers from tricking a user into performing unwanted actions on a website they're logged into.
- Laravel automatically creates a CSRF token for each user session.
- Forms must include the `@csrf` directive or a hidden `_token` input.
- Laravel checks the token to ensure the request comes from your app, not an attacker.

In short: CSRF protection makes sure requests are really from your users, not hackers.

---

## 5. How does Laravel handle CSRF in SPAs?

- SPAs (React, Inertia, Next.js) don't use Blade forms, so `@csrf` is not used.
- Instead, Laravel protects SPAs using cookies + headers.

**Flow:**
1. Laravel sends a CSRF token as a cookie (`XSRF-TOKEN`) — usually when you call `/sanctum/csrf-cookie`.
2. Browser stores the cookie automatically.
3. Frontend sends the token in request headers (`X-XSRF-TOKEN`) for POST, PUT, DELETE requests.
4. Laravel verifies the token — if valid → request allowed; if missing or invalid → 419 error.

```javascript
// With Axios (auto-reads XSRF-TOKEN cookie)
axios.defaults.withCredentials = true;

// With Fetch (manual)
const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];

fetch('/api/data', {
    method: 'POST',
    headers: { 'X-XSRF-TOKEN': token },
});
```

---

## 6. What is the @csrf directive?

- `@csrf` is a Blade directive that adds a hidden CSRF token field inside HTML forms.
- This token proves that the form request came from your own website, not from an attacker.
- Required for all non-GET requests: POST, PUT, PATCH, DELETE.
- If the token is missing or invalid → Laravel rejects the request (419 error).

```blade
<form method="POST" action="/profile">
    @csrf
    <input type="text" name="name" />
    <button type="submit">Save</button>
</form>
```

In short: `@csrf` protects your forms by adding a secret token that Laravel verifies to block fake or malicious requests.

---

## 7. What are Laravel Policies?

- Policies are special classes that contain authorization rules for a specific model.
- They decide who is allowed to do what (e.g., update, delete) with that model.
- Each policy maps to one model and keeps permission logic organized.

```bash
php artisan make:policy PostPolicy --model=Post
```

```php
class PostPolicy
{
    public function update(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }
}
```

```php
// In controller
$this->authorize('update', $post);
```

In short: Policies define model-specific permissions so you can control what actions a user is allowed to perform.

---

## 8. Difference between Gates and Policies

- **Gates**
  - Used for simple permission checks.
  - Not tied to a specific model.
  - Usually defined as single rules.
  - Example: Is this user an admin?

```php
Gate::define('access-admin', fn (User $user) => $user->is_admin);
Gate::allows('access-admin'); // true or false
```

- **Policies**
  - Used for model-specific permissions.
  - One policy per model (User, Post, Order, etc.).
  - Organizes rules like: Can the user view this post? Can the user update this order?

**In short:**
- Gates → simple, global rules.
- Policies → detailed rules for specific models.

---

## 9. What is Laravel Sanctum?

- Laravel Sanctum is a simple authentication system for SPAs (React, Vue, Inertia, Next.js), mobile apps, and API-based applications.

**Two authentication styles:**

| Style | Best For | How |
|-------|----------|-----|
| **Cookie-based auth** | SPAs (same domain) | Session cookies + CSRF |
| **API token auth** | Mobile apps, external APIs | Bearer token in header |

**Why Sanctum is popular:**
- Very simple to use.
- No OAuth complexity (unlike Passport).
- Built-in CSRF protection for SPAs.
- Officially recommended by Laravel for most apps.

```php
// Generate a token for mobile/API
$token = $user->createToken('mobile-app')->plainTextToken;

// Protect routes
Route::middleware('auth:sanctum')->get('/user', fn (Request $request) => $request->user());
```

- **Sanctum** → simple apps, SPAs, mobile.
- **Passport** → complex OAuth systems.

In short: Laravel Sanctum is a lightweight authentication system for SPAs and APIs using cookies or API tokens to securely identify users.

---

## 10. What are API Resources in Laravel?

- API Resources are used to control how your data is returned as JSON.
- They act as a middle layer between your Eloquent models and the API response.
- Instead of returning models directly, you return formatted, clean JSON.

```bash
php artisan make:resource UserResource
```

```php
class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'    => $this->id,
            'name'  => $this->name,
            'email' => $this->email,
        ];
    }
}

// In controller
return new UserResource($user);
return UserResource::collection($users);
```

In short: API Resources transform Laravel models into structured JSON responses.

---

## 11. Difference between Resource and ResourceCollection

- **Resource**
  - Transforms one single model into JSON.
  - Used when returning a single record.

```php
return new UserResource($user);
```

- **ResourceCollection**
  - Transforms multiple models (a collection) into JSON.
  - Used when returning lists.
  - Allows adding extra data like pagination info or meta data.

```php
return UserResource::collection($users);

// Custom collection with meta
class UserCollection extends ResourceCollection
{
    public function toArray(Request $request): array
    {
        return [
            'data' => $this->collection,
            'meta' => ['total' => $this->collection->count()],
        ];
    }
}
```

- Resource → One item.
- ResourceCollection → List of items.

---

## 12. How do you secure a Laravel application?

| Practice | Why |
|----------|-----|
| **Keep Laravel & packages updated** | Fixes security bugs and vulnerabilities. |
| **Use HTTPS** | Encrypts data between users and the server. |
| **Enable CSRF protection** | Prevents attackers from submitting fake requests. |
| **Validate & sanitize input** | Stops bad or malicious data from entering the system. |
| **Use proper auth & authorization** | Ensures users can only do what they're permitted. |
| **Protect against SQL Injection & XSS** | Eloquent ORM + Blade auto-escaping (`{{ }}`) handle this. |
| **Enable rate limiting** | Blocks abuse and brute-force attacks. |
| **Handle errors safely** | Never show stack traces in production (`APP_DEBUG=false`). |
| **Store secrets in .env** | Never commit API keys or passwords to Git. |

In short: Laravel security relies on validation, authentication, authorization, CSRF protection, HTTPS, rate limiting, and safe configuration using environment variables.

---

## 13. What is Role-Based Access Control (RBAC)?

- **RBAC** is a permission system where access to resources is controlled based on a user's **role**.
- Instead of assigning permissions directly to users, you assign roles, and roles carry permissions.
- A user can have one or multiple roles (e.g., `admin`, `editor`, `viewer`).

**How it works:**

```
User → has Role(s) → Role has Permission(s) → Permission allows Action
```

**Example:**

| Role | Permissions |
|------|------------|
| `admin` | create, read, update, delete, manage users |
| `editor` | create, read, update posts |
| `viewer` | read posts only |

**Why RBAC matters:**
- Scalable — add roles without changing code.
- Maintainable — update a role's permissions and all users with that role are updated.
- Auditable — clear visibility of who can do what.

In short: RBAC controls access by assigning roles to users, and permissions to roles — not directly to users.

---

## 14. Implementing RBAC in Laravel

**Option 1: Manual RBAC (database-driven)**

```bash
# Migrations
php artisan make:migration create_roles_table
php artisan make:migration create_permissions_table
php artisan make:migration create_role_user_table
php artisan make:migration create_permission_role_table
```

```php
// Role model
class Role extends Model
{
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class);
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }
}

// User model — add role relationship
class User extends Authenticatable
{
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }

    public function hasRole(string $role): bool
    {
        return $this->roles()->where('name', $role)->exists();
    }

    public function hasPermission(string $permission): bool
    {
        return $this->roles()
            ->whereHas('permissions', fn ($q) => $q->where('name', $permission))
            ->exists();
    }
}
```

**Define Gates from roles:**

```php
// In AppServiceProvider::boot()
public function boot(): void
{
    Gate::before(function (User $user, string $ability) {
        if ($user->hasRole('admin')) {
            return true;  // Admin bypasses all checks
        }
    });

    Gate::define('edit-post', fn (User $user) =>
        $user->hasPermission('edit-post')
    );

    Gate::define('delete-post', fn (User $user) =>
        $user->hasPermission('delete-post')
    );
}
```

**Use in controllers:**

```php
public function update(Request $request, Post $post): JsonResponse
{
    $this->authorize('edit-post');  // Uses Gate
    // or
    if (!auth()->user()->hasRole('editor')) {
        abort(403, 'Forbidden');
    }

    $post->update($request->validated());
    return response()->json($post);
}
```

**Option 2: Spatie Laravel Permission (recommended)**

The most popular RBAC package for Laravel:

```bash
composer require spatie/laravel-permission
php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
php artisan migrate
```

```php
// Add trait to User model
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasRoles;
}
```

```php
// Create roles and permissions
$admin  = Role::create(['name' => 'admin']);
$editor = Role::create(['name' => 'editor']);

Permission::create(['name' => 'edit posts']);
Permission::create(['name' => 'delete posts']);
Permission::create(['name' => 'publish posts']);

$admin->givePermissionTo(['edit posts', 'delete posts', 'publish posts']);
$editor->givePermissionTo(['edit posts']);

// Assign role to user
$user->assignRole('editor');
$user->assignRole(['editor', 'viewer']);
```

```php
// Check roles and permissions
$user->hasRole('admin');
$user->hasAnyRole(['admin', 'editor']);
$user->hasPermissionTo('edit posts');

// In middleware
Route::middleware(['auth', 'role:admin'])->group(function () {
    Route::get('/admin', [AdminController::class, 'index']);
});

Route::middleware(['auth', 'permission:edit posts'])->group(function () {
    Route::put('/posts/{post}', [PostController::class, 'update']);
});
```

**Blade directives with Spatie:**

```blade
@role('admin')
    <a href="/admin">Admin Panel</a>
@endrole

@can('edit posts')
    <button>Edit Post</button>
@endcan
```

In short: RBAC assigns roles to users and permissions to roles — Spatie Laravel Permission is the standard Laravel package for implementing it.
