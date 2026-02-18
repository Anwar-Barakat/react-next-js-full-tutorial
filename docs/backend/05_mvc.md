# Laravel MVC Guide

A comprehensive guide to the MVC architecture, models, views, and controllers in Laravel.

## Table of Contents

1. [Explain the MVC architecture in Laravel](#1-explain-the-mvc-architecture-in-laravel)
2. [What is a Model in Laravel?](#2-what-is-a-model-in-laravel)
3. [What is the purpose of $fillable and $guarded?](#3-what-is-the-purpose-of-fillable-and-guarded)
4. [What is Mass Assignment?](#4-what-is-mass-assignment)
5. [What are Controllers in Laravel?](#5-what-are-controllers-in-laravel)
6. [What is a Resource Controller?](#6-what-is-a-resource-controller)
7. [What is the Blade Templating Engine?](#7-what-is-the-blade-templating-engine)
8. [What are Views in Laravel?](#8-what-are-views-in-laravel)
9. [What are Accessors in Laravel?](#9-what-are-accessors-in-laravel)
10. [Difference between Accessors and Mutators](#10-difference-between-accessors-and-mutators)
11. [What are Query Scopes?](#11-what-are-query-scopes)
12. [What is soft deleting?](#12-what-is-soft-deleting)
13. [How do you include soft deleted records in queries?](#13-how-do-you-include-soft-deleted-records-in-queries)

---

## 1. Explain the MVC architecture in Laravel

**MVC = Model – View – Controller** — a way to organize code so everything has a clear job.

- **Model (Data)**
  - Talks to the database.
  - Gets, saves, updates data.
  - Example: `User`, `Post`.
  - "I handle the data."

- **View (UI)**
  - Shows data to the user.
  - Built with Blade in Laravel.
  - Example: HTML pages.
  - "I display the data."

- **Controller (Brain)**
  - Receives the request from the user.
  - Uses the Model to get data.
  - Sends data to the View.
  - "I connect everything."

In short: MVC separates data, logic, and UI so your Laravel app is clean, organized, and easy to maintain.

---

## 2. What is a Model in Laravel?

- A Model is a PHP class that represents a table in the database.
- It uses Eloquent ORM to work with the database easily.
- Each model usually matches one table.

> "The model talks to the database for you."

```php
class User extends Model
{
    protected $fillable = ['name', 'email', 'password'];
}
```

---

## 3. What is the purpose of $fillable and $guarded?

- They protect your model from unwanted data when using mass assignment (like `Model::create()`).

**`$fillable`**
- Lists the fields that are allowed to be saved.
- Anything not listed is blocked.
- Safer and recommended.

```php
protected $fillable = ['name', 'email', 'password'];
```

**`$guarded`**
- Lists the fields that are NOT allowed to be saved.
- Everything else is allowed.
- `$guarded = []` means all fields are allowed (not safe for sensitive data).

```php
protected $guarded = ['is_admin'];
```

In short: `$fillable` allows specific fields, `$guarded` blocks specific fields — both protect your model from unsafe data.

---

## 4. What is Mass Assignment?

- Mass assignment is when Laravel fills a model using an array of data at once.

```php
User::create($request->all());
```

- Why it can be dangerous: if not protected, a user could send extra fields like `is_admin`.
- How Laravel protects you:
  - Laravel blocks mass assignment by default.
  - You must allow fields using `$fillable`.

In short: Mass assignment saves many fields at once, and `$fillable` protects your app from saving unsafe data.

---

## 5. What are Controllers in Laravel?

- Controllers are PHP classes that handle what should happen when a request comes in.
- They receive the request, run the logic, and return a response.
- What they return: a view (HTML page), JSON (for APIs), or a redirect.

In short: Controllers decide what your app does when a user visits a page or sends data.

---

## 6. What is a Resource Controller?

- A resource controller is a controller made to handle CRUD operations for one model (like posts).
- Laravel gives you ready-made methods so you don't write everything manually.

```bash
php artisan make:controller PostController --resource
```

| Method | URI | Action |
|--------|-----|--------|
| GET | `/posts` | `index` |
| GET | `/posts/create` | `create` |
| POST | `/posts` | `store` |
| GET | `/posts/{post}` | `show` |
| GET | `/posts/{post}/edit` | `edit` |
| PUT/PATCH | `/posts/{post}` | `update` |
| DELETE | `/posts/{post}` | `destroy` |

In short: A resource controller is a shortcut that gives you all CRUD methods for a model in one controller.

---

## 7. What is the Blade Templating Engine?

- Blade is Laravel's tool for building HTML views with dynamic data.
- It lets you use PHP logic in views in a clean and readable way.
- Blade files end with `.blade.php`.

```blade
{{-- Display data --}}
{{ $name }}

{{-- Conditionals --}}
@if ($user->isAdmin())
    <p>Admin</p>
@endif

{{-- Loops --}}
@foreach ($posts as $post)
    <p>{{ $post->title }}</p>
@endforeach

{{-- Include partials --}}
@include('partials.navbar')

{{-- Extend a layout --}}
@extends('layouts.app')
@section('content')
    <p>Page content</p>
@endsection
```

In short: Blade is Laravel's way to build clean, dynamic HTML pages easily.

---

## 8. What are Views in Laravel?

- Views are the files that contain the HTML shown to the user.
- Stored in `resources/views`.
- Most views use Blade and end with `.blade.php`.
- Controllers return views using the `view()` helper.

**Passing data to views:**

```php
// Using an array
view('profile', ['name' => $name]);

// Using with()
view('profile')->with('name', $name);

// Using compact()
view('profile', compact('name', 'user'));
```

In short: Views are responsible for displaying data to the user in Laravel.

---

## 9. What are Accessors in Laravel?

- Accessors let you change how a model attribute looks when you read it.
- They do not change the value in the database, only the displayed value.
- You can also create virtual attributes that don't exist in the database.

```php
// Laravel 10+
use Illuminate\Database\Eloquent\Casts\Attribute;

protected function fullName(): Attribute
{
    return Attribute::make(
        get: fn () => $this->first_name . ' ' . $this->last_name,
    );
}
```

What accessors are used for:
- Format names or dates.
- Combine fields.
- Calculate values.

In short: Accessors control how model data looks when you read it, not how it's stored.

---

## 10. Difference between Accessors and Mutators

- **Accessors**
  - Work when you **read** data from the model.
  - Change how the value looks when you access it.

- **Mutators**
  - Work when you **save** data to the model.
  - Change the value before it is stored in the database.

```php
protected function password(): Attribute
{
    return Attribute::make(
        get: fn ($value) => strtoupper($value),       // Accessor
        set: fn ($value) => bcrypt($value),            // Mutator
    );
}
```

In short: Accessors format data when reading, mutators format data when saving.

---

## 11. What are Query Scopes?

- Query scopes are reusable query filters you define inside Eloquent models.
- They help keep queries clean, readable, and reusable.

**Types:**
- **Local Scopes**: Used manually when needed.
- **Global Scopes**: Applied automatically to all queries.

```php
// Local scope
public function scopeActive(Builder $query): void
{
    $query->where('active', true);
}

// Usage
User::active()->get();

// Global scope (applied automatically)
protected static function booted(): void
{
    static::addGlobalScope('active', fn (Builder $builder) =>
        $builder->where('active', true)
    );
}
```

In short: Query scopes let you reuse common database query logic easily.

---

## 12. What is soft deleting?

- Soft deleting means records are not permanently removed from the database.
- Laravel adds a `deleted_at` timestamp instead of deleting the row.
- Soft-deleted records are hidden from normal queries.
- You can restore them later if needed.

```php
use Illuminate\Database\Eloquent\SoftDeletes;

class Post extends Model
{
    use SoftDeletes;
}

// Soft delete
$post->delete(); // Sets deleted_at

// Restore
$post->restore();
```

In short: Soft delete hides data instead of deleting it permanently.

---

## 13. How do you include soft deleted records in queries?

- `withTrashed()` → Gets all records, including deleted ones.
- `onlyTrashed()` → Gets only soft-deleted records.

```php
Post::withTrashed()->get();   // All records
Post::onlyTrashed()->get();   // Only deleted records
```

In short: `withTrashed()` shows everything, `onlyTrashed()` shows only deleted records.
