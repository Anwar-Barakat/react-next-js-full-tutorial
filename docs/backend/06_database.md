# Laravel Database Guide

A comprehensive guide to Eloquent ORM, migrations, relationships, and database operations in Laravel.

## Table of Contents

1. [What is a Migration in Laravel?](#1-what-is-a-migration-in-laravel)
2. [What is Eloquent ORM?](#2-what-is-eloquent-orm)
3. [What is a Database Seeder?](#3-what-is-a-database-seeder)
4. [What are Factories in Laravel?](#4-what-are-factories-in-laravel)
5. [What are Eloquent Relationships?](#5-what-are-eloquent-relationships)
6. [One-to-One Relationship](#6-one-to-one-relationship)
7. [One-to-Many Relationship](#7-one-to-many-relationship)
8. [Many-to-Many Relationship](#8-many-to-many-relationship)
9. [Has-Many-Through Relationship](#9-has-many-through-relationship)
10. [Polymorphic Relationship](#10-polymorphic-relationship)
11. [What is Eager Loading?](#11-what-is-eager-loading)
12. [What is the N+1 Query Problem?](#12-what-is-the-n1-query-problem)
13. [What is Lazy Loading?](#13-what-is-lazy-loading)
14. [Difference between create() and save()](#14-difference-between-create-and-save)
15. [Difference between get() and all()](#15-difference-between-get-and-all)
16. [What is the find() method?](#16-what-is-the-find-method)
17. [Difference between delete() and forceDelete()](#17-difference-between-delete-and-forcedelete)
18. [What is the whereHas() method?](#18-what-is-the-wherehas-method)
19. [Difference between with() and whereHas()](#19-difference-between-with-and-wherehas)
20. [What are database transactions?](#20-what-are-database-transactions)
21. [What are database indexes?](#21-what-are-database-indexes)

---

## 1. What is a Migration in Laravel?

- Migrations are files that define database structure changes.
- They act like version control for the database.
- Used to create, update, or delete tables and columns.
- Help keep the database consistent across all environments (local, staging, production).

```php
Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->string('email')->unique();
    $table->timestamps();
});
```

In short: Migrations let you manage database changes in an organized and safe way.

---

## 2. What is Eloquent ORM?

- Eloquent is Laravel's way to work with the database using PHP classes.
- Each database table is represented by a Model.
- Lets you query, insert, update, and delete data easily.
- Makes database code clean and readable.

In short: Eloquent lets you work with database tables as PHP objects instead of raw SQL.

---

## 3. What is a Database Seeder?

- Seeder inserts initial or demo data into the database automatically.
- Helps quickly set up testing or development environments.
- Often used with factories to generate large amounts of fake data.

```php
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::factory(100)->create();
    }
}
```

In short: Seeders populate the database with default or test data automatically.

---

## 4. What are Factories in Laravel?

- Factories create fake data for models, mainly for testing or seeding.
- Use the Faker library to generate realistic values (names, emails, dates, etc.).
- Save time by automatically generating data instead of inserting manually.

```php
class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name'  => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
        ];
    }
}

// Usage
User::factory(50)->create();
```

In short: Factories generate realistic test or seed data for models automatically.

---

## 5. What are Eloquent Relationships?

- Eloquent relationships define how database tables are connected.
- Laravel provides different types: one-to-one, one-to-many, many-to-many, and more.

In short: Eloquent relationships link database tables and simplify data access.

---

## 6. One-to-One Relationship

- One record in a table matches exactly one record in another table.
- Use `hasOne()` and `belongsTo()` in models.
- Example: A User has one Profile.

```php
// User model
public function profile(): HasOne
{
    return $this->hasOne(Profile::class);
}

// Profile model
public function user(): BelongsTo
{
    return $this->belongsTo(User::class);
}
```

---

## 7. One-to-Many Relationship

- One record in a table links to many records in another table.
- Use `hasMany()` and `belongsTo()` in models.
- Example: A User has many Posts.

```php
// User model
public function posts(): HasMany
{
    return $this->hasMany(Post::class);
}

// Post model
public function user(): BelongsTo
{
    return $this->belongsTo(User::class);
}
```

---

## 8. Many-to-Many Relationship

- Multiple records in one table link to multiple records in another table.
- Uses a pivot table to store relationships.
- Use `belongsToMany()` in both models.
- Example: Users have many Roles, and Roles have many Users.

```php
// User model
public function roles(): BelongsToMany
{
    return $this->belongsToMany(Role::class);
}

// Role model
public function users(): BelongsToMany
{
    return $this->belongsToMany(User::class);
}
```

---

## 9. Has-Many-Through Relationship

- Lets a model access records in a distant table through an intermediate table.
- Use `hasManyThrough()` in the parent model.
- Example: A Country has many Posts through Users (Country → Users → Posts).

```php
// Country model
public function posts(): HasManyThrough
{
    return $this->hasManyThrough(Post::class, User::class);
}
```

---

## 10. Polymorphic Relationship

- Lets different models share a common relationship (e.g., comments, images).
- Uses `morphOne`, `morphMany`, or `morphTo` methods.
- Example: A Post and a Video can both have many Comments.

```php
// Comment model
public function commentable(): MorphTo
{
    return $this->morphTo();
}

// Post model
public function comments(): MorphMany
{
    return $this->morphMany(Comment::class, 'commentable');
}
```

---

## 11. What is Eager Loading?

- Loads related models together with the main model to avoid multiple queries.
- Prevents the N+1 query problem in relationships.

```php
// Without eager loading (N+1 problem)
$users = User::all();
foreach ($users as $user) {
    echo $user->profile->bio; // 1 query per user
}

// With eager loading (1 query total)
$users = User::with('profile')->get();
```

---

## 12. What is the N+1 Query Problem?

- Happens when you load a list of records, then load a related record inside a loop.
- Results in 1 query for the main data + N extra queries for relationships.
- Causes slow performance with large data.

**Example:**
- Get 100 users → 1 query
- Get profile for each user inside a loop → 100 queries
- Total = 101 queries ❌

**Fix: Use `with()` for eager loading.**

---

## 13. What is Lazy Loading?

- Lazy loading means relationships are loaded only when you access them.
- It is the default behavior in Eloquent.
- Can cause N+1 query problems if used inside loops.
- Useful when the relationship is not always needed.

In short: Lazy loading loads related data only when you ask for it.

---

## 14. Difference between create() and save()

- **`create()`** — All at once
  - Creates and saves a model in one step.
  - Uses mass assignment.
  - Requires `$fillable` (or `$guarded`) to be set.

```php
User::create(['name' => 'Anwar', 'email' => 'anwar@example.com']);
```

- **`save()`** — Step by step
  - Saves a model after setting values manually.
  - Can be used for new or existing models.

```php
$user = new User();
$user->name = 'Anwar';
$user->email = 'anwar@example.com';
$user->save();
```

In short: `create()` is one-step creation, `save()` is manual and flexible.

---

## 15. Difference between get() and all()

- **`all()`**
  - Gets all records from the table.
  - Cannot be filtered.

- **`get()`**
  - Retrieves records after applying conditions.
  - Can be used with `where()`, `orderBy()`, etc.

```php
User::all();                                  // all records
User::where('active', true)->orderBy('name')->get(); // filtered
```

In short: `all()` gets everything, `get()` gets filtered results.

---

## 16. What is the find() method?

- `find()` gets a record by its primary key.
- Returns one model or `null` if not found.
- Can accept multiple IDs and return a collection.
- `findOrFail()` returns the record or throws a 404 error if not found.

```php
User::find(1);           // returns User or null
User::findOrFail(1);     // returns User or throws 404
User::find([1, 2, 3]);   // returns collection of users
```

In short: `find()` gives `null`, `findOrFail()` gives a 404 error.

---

## 17. Difference between delete() and forceDelete()

- **`delete()`**
  - Does not remove the row from the database (when using `SoftDeletes`).
  - Just sets `deleted_at` timestamp.
  - Data can be restored later.
  - Safe option.

- **`forceDelete()`**
  - Permanently removes the row from the database.
  - Cannot be restored.
  - Ignores `deleted_at`.

In short: `delete()` hides the record, `forceDelete()` destroys it forever.

---

## 18. What is the whereHas() method?

- `whereHas()` is used to filter models based on related models.
- Returns only records that have a relationship matching certain conditions.
- Very useful for filtering based on conditions on relationships.

```php
// Get users who have at least one published post
$users = User::whereHas('posts', function (Builder $query) {
    $query->where('published', true);
})->get();
```

In short: "Give me records that have related data matching this rule."

---

## 19. Difference between with() and whereHas()

- **`with()`** → Load related data
  - Used for eager loading relationships.
  - Does NOT filter the main results.
  - Helps reduce N+1 queries.

- **`whereHas()`** → Filter by related data
  - Used to filter the main query based on relationship conditions.
  - Returns only models that match the relationship rule.

```php
// with() - loads posts, but doesn't filter users
User::with('posts')->get();

// whereHas() - only users who have published posts
User::whereHas('posts', fn ($q) => $q->where('published', true))->get();

// Combined: filter AND load
User::whereHas('posts')->with('posts')->get();
```

---

## 20. What are database transactions?

- A database transaction is a way to run multiple database actions as one safe unit.
- Either everything succeeds, or nothing is saved.

> Think of it like "all or nothing."

```php
DB::transaction(function () {
    $order = Order::create([...]);
    $order->items()->createMany([...]);
    $order->payment()->create([...]);
});
// If any step fails, everything is rolled back
```

In short: Database transactions guarantee that multiple operations succeed together or fail together — no broken data.

---

## 21. What are database indexes?

- Indexes help the database find data faster.
- They work like a table of contents in a book.
  - Without index → scan every row.
  - With index → jump directly to the right row.

```php
// Adding an index in a migration
$table->index('email');
$table->unique('email');
$table->index(['user_id', 'created_at']); // composite index
```

- Imagine a phone contacts list:
  - ❌ No index: Scroll through every name to find "Ahmed".
  - ✅ With index: Jump directly to the "A" section.

> Index columns that are searched or filtered often, not everything.
