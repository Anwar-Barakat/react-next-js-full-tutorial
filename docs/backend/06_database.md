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
22. [PostgreSQL vs MySQL](#22-postgresql-vs-mysql)
23. [Database Indexing Deep Dive](#23-database-indexing-deep-dive)
24. [Elasticsearch](#24-elasticsearch)
25. [What is ACID?](#25-what-is-acid)
26. [What is MongoDB?](#26-what-is-mongodb)
27. [MongoDB vs MySQL/PostgreSQL](#27-mongodb-vs-mysqlpostgresql)
28. [Common MongoDB Interview Questions](#28-common-mongodb-interview-questions)

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

**Example 1: A User has one Profile.**

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

// Usage
$user = User::with('profile')->find(1);
echo $user->profile->bio;
echo $user->profile->avatar;
```

**Example 2: An Order has one Payment.**

```php
// Order model
public function payment(): HasOne
{
    return $this->hasOne(Payment::class);
}

// Payment model
public function order(): BelongsTo
{
    return $this->belongsTo(Order::class);
}

// Usage
$order = Order::with('payment')->find(1);
echo $order->payment->status;       // "paid"
echo $order->payment->transaction_id; // "PAY-abc123"
```

In short: One-to-One means one row in table A links to exactly one row in table B.

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

// Usage
$user = User::with('posts')->find(1);
foreach ($user->posts as $post) {
    echo $post->title;
}

// Get posts count
echo $user->posts->count(); // 5

// Get the author of a post
$post = Post::with('user')->find(1);
echo $post->user->name; // "Anwar"
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

// Usage
$user = User::with('roles')->find(1);
foreach ($user->roles as $role) {
    echo $role->name; // "admin", "editor"
}

// Attach a role to a user
$user->roles()->attach($roleId);

// Detach a role
$user->roles()->detach($roleId);

// Sync roles (replace all with these)
$user->roles()->sync([1, 2, 3]);

// Check if user has a role
if ($user->roles->contains('name', 'admin')) {
    // user is admin
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

// Usage
$country = Country::with('posts')->find(1);
foreach ($country->posts as $post) {
    echo $post->title; // posts written by users in this country
}

echo $country->posts->count(); // 42
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

// Video model
public function comments(): MorphMany
{
    return $this->morphMany(Comment::class, 'commentable');
}

// Usage
$post = Post::with('comments')->find(1);
foreach ($post->comments as $comment) {
    echo $comment->body;
}

$video = Video::with('comments')->find(1);
foreach ($video->comments as $comment) {
    echo $comment->body;
}

// Get the parent from a comment
$comment = Comment::find(1);
$parent = $comment->commentable; // returns Post or Video
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

---

## 22. PostgreSQL vs MySQL

### Overview

Both are open-source relational databases. MySQL is the most widely used, PostgreSQL is the most feature-rich.

**MySQL:**
- **Type** — Relational database
- **Owned by** — Oracle (open-source but Oracle controls it)
- **JSON support** — Basic (can store JSON but limited querying)
- **Search inside text** — Basic
- **Maps & locations** — Basic
- **Data types** — Standard (strings, numbers, dates)
- **Best for** — Fast simple reads (blogs, e-commerce, CMS)
- **Default Port** — 3306

**PostgreSQL:**
- **Type** — Advanced relational database (more features than MySQL)
- **Owned by** — Community (fully open-source, no company controls it)
- **JSON support** — Advanced (can store, search, and index JSON data)
- **Search inside text** — Advanced (built-in search engine features)
- **Maps & locations** — Advanced (has PostGIS for maps and GPS data)
- **Data types** — Many extra types (arrays, JSON, UUID, custom types)
- **Best for** — Complex queries, reports, analytics, large apps
- **Default Port** — 5432

### When to Choose MySQL

- Your app is simple — basic CRUD (create, read, update, delete) with simple queries.
- You need fast reads for simple data (like a blog or a small e-commerce site).
- Your hosting only supports MySQL (most shared hosting like cPanel).
- You're using WordPress, Magento, or Laravel (they work with MySQL by default).
- Your team already knows MySQL well.

> **In short:** Choose MySQL when your project is simple and straightforward.

### When to Choose PostgreSQL

- Your app needs complex queries (many joins, reports, analytics).
- You want to store and search JSON data directly in the database.
- You need to search text inside your data (like a search engine) without extra tools.
- You're working with maps or locations (PostgreSQL has PostGIS for that).
- You need strict data rules — PostgreSQL is stricter about keeping your data correct.
- Your app will grow and you need more powerful features later.

> **In short:** Choose PostgreSQL when your project is complex or will grow over time.

### Key Differences in Practice

**JSON handling:**

```sql
-- MySQL: basic JSON
SELECT * FROM products WHERE JSON_EXTRACT(metadata, '$.color') = 'red';

-- PostgreSQL: JSONB with operators and indexing
SELECT * FROM products WHERE metadata->>'color' = 'red';
SELECT * FROM products WHERE metadata @> '{"color": "red"}'; -- containment operator
CREATE INDEX idx_metadata ON products USING GIN (metadata); -- index JSON
```

**Arrays (PostgreSQL only):**

```sql
-- Store and query arrays natively
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title TEXT,
    tags TEXT[]  -- array of strings
);

INSERT INTO posts (title, tags) VALUES ('Laravel Tips', ARRAY['php', 'laravel', 'backend']);

-- Find posts with a specific tag
SELECT * FROM posts WHERE 'laravel' = ANY(tags);

-- Find posts with ALL of these tags
SELECT * FROM posts WHERE tags @> ARRAY['php', 'laravel'];
```

**Full-text search:**

```sql
-- MySQL: basic full-text
ALTER TABLE posts ADD FULLTEXT INDEX ft_content (title, body);
SELECT * FROM posts WHERE MATCH(title, body) AGAINST('laravel tutorial');

-- PostgreSQL: advanced full-text with ranking
SELECT *, ts_rank(search_vector, query) AS rank
FROM posts, plainto_tsquery('english', 'laravel tutorial') query
WHERE search_vector @@ query
ORDER BY rank DESC;
```

**Window functions (both support, PostgreSQL more advanced):**

```sql
-- Get each user's orders with running total
SELECT
    user_id,
    order_id,
    total,
    SUM(total) OVER (PARTITION BY user_id ORDER BY created_at) AS running_total,
    ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at DESC) AS order_rank
FROM orders;
```

### Laravel Configuration

```php
// config/database.php

// MySQL
'mysql' => [
    'driver'    => 'mysql',
    'host'      => env('DB_HOST', '127.0.0.1'),
    'port'      => env('DB_PORT', '3306'),
    'database'  => env('DB_DATABASE', 'laravel'),
    'username'  => env('DB_USERNAME', 'root'),
    'password'  => env('DB_PASSWORD', ''),
    'charset'   => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
    'engine'    => 'InnoDB',
],

// PostgreSQL
'pgsql' => [
    'driver'   => 'pgsql',
    'host'     => env('DB_HOST', '127.0.0.1'),
    'port'     => env('DB_PORT', '5432'),
    'database' => env('DB_DATABASE', 'laravel'),
    'username' => env('DB_USERNAME', 'postgres'),
    'password' => env('DB_PASSWORD', ''),
    'charset'  => 'utf8',
    'schema'   => 'public',
],
```

```env
# .env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=myapp
DB_USERNAME=postgres
DB_PASSWORD=secret
```

### PostgreSQL-Specific Features in Laravel Migrations

```php
// UUID primary key (native in PostgreSQL)
$table->uuid('id')->primary();

// JSONB column (indexed JSON)
$table->jsonb('metadata')->nullable();

// Array column (requires doctrine/dbal or raw)
DB::statement("ALTER TABLE posts ADD COLUMN tags TEXT[]");

// Partial index (PostgreSQL only, use raw SQL)
DB::statement("CREATE INDEX idx_active_users ON users (email) WHERE active = true");

// Expression index
DB::statement("CREATE INDEX idx_lower_email ON users (LOWER(email))");
```

### Bottom Line

- **MySQL** — great default for most web apps, simple, fast reads, huge community.
- **PostgreSQL** — better for complex data, JSON-heavy apps, analytics, geospatial, and when you need advanced features.
- Laravel works with both seamlessly — switching mostly requires changing `DB_CONNECTION` and adjusting a few migrations.

---

## 23. Database Indexing Deep Dive

### What is an Index?

- An index helps the database find data faster — like a table of contents in a book.
- Without an index → the database reads every row to find what you need (slow).
- With an index → the database jumps directly to the right row (fast).

> **Analogy:** Finding a contact in your phone.
> - Without index = scrolling through every name.
> - With index = jumping to the letter "A" and finding "Ahmed" instantly.

### How Indexes Work Internally

- The database builds a tree structure (called **B-Tree**) that organizes your data.
- Instead of checking every row, it follows the tree branches to find the answer quickly.
- For 1 million rows, it only needs ~20 steps instead of 1,000,000.

### Index Types

- **Primary Key** — The main ID of each row, created automatically → `$table->id()`
- **Unique Index** — Makes sure no two rows have the same value → `$table->unique('email')`
- **Regular Index** — Speeds up searches on a column → `$table->index('status')`
- **Composite Index** — Index on multiple columns together (order matters) → `$table->index(['user_id', 'created_at'])`
- **Full-Text Index** — For searching inside long text (articles, descriptions) → `$table->fullText(['title', 'body'])`

### Creating Indexes in Laravel

```php
// In migrations
Schema::create('orders', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained();
    $table->string('status');
    $table->decimal('total', 10, 2);
    $table->timestamps();

    // Single column index
    $table->index('status');

    // Composite index (column order matters!)
    $table->index(['user_id', 'created_at']);

    // Unique index
    $table->unique('order_number');

    // Full-text index (MySQL)
    $table->fullText(['title', 'description']);
});

// Adding index to existing table
Schema::table('users', function (Blueprint $table) {
    $table->index('email');
});

// Dropping an index
Schema::table('users', function (Blueprint $table) {
    $table->dropIndex(['email']); // by column name
    $table->dropIndex('users_email_index'); // by index name
});
```

### Composite Index Rules

- When you create an index on multiple columns, the **order matters**.
- The database uses the index **from left to right** — it must start with the first column.

```php
// Composite index on (user_id, status, created_at)
$table->index(['user_id', 'status', 'created_at']);
```

This index is used for:

```php
// ✅ Uses index (starts from the first column)
Order::where('user_id', 1)->get();
Order::where('user_id', 1)->where('status', 'paid')->get();
Order::where('user_id', 1)->where('status', 'paid')->where('created_at', '>', now()->subMonth())->get();

// ❌ Does NOT use index (skipped user_id — the first column)
Order::where('status', 'paid')->get();
Order::where('created_at', '>', now()->subMonth())->get();
Order::where('status', 'paid')->where('created_at', '>', now()->subMonth())->get();
```

> **Rule:** Always start with the most important column first (the one you filter by most).

### When to Add Indexes

**Add indexes on columns you search or filter by often:**

- Columns in `WHERE` — `where('status', 'active')`
- Columns in `ORDER BY` — `orderBy('created_at')`
- Foreign keys — `user_id`, `post_id` (Laravel adds these automatically)
- Columns you use in `JOIN` or `GROUP BY`

**Do NOT add indexes when:**

- The table is small (less than 1,000 rows) — already fast enough without index.
- The column only has 2-3 different values (like `gender` = male/female) — index won't help much.
- The column changes very often — indexes slow down `INSERT`, `UPDATE`, `DELETE`.
- Don't add indexes on every column — too many indexes = slower writes.

### How to Check if Your Index is Working

Use `EXPLAIN` to see how the database runs your query:

```sql
-- MySQL
EXPLAIN SELECT * FROM orders WHERE user_id = 5 AND status = 'paid';

-- PostgreSQL
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 5 AND status = 'paid';
```

**What to look for:**

- If it says `ALL` (MySQL) or `Seq Scan` (PostgreSQL) → the index is NOT being used (bad).
- If it says `ref`, `range`, or `Using index` → the index IS being used (good).
- Check the `rows` number — if it's very high, the query is scanning too many rows.

**Laravel debug:**

```php
// Enable query log
DB::enableQueryLog();

$orders = Order::where('user_id', 5)->where('status', 'paid')->get();

// See the queries
dd(DB::getQueryLog());

// Or use Laravel Debugbar / Telescope for visual query analysis
```

### Index Trade-offs

- Indexes make **reading faster** but make **writing slower**.
- Every time you insert, update, or delete a row, the database must also update the index.
- Indexes also use extra disk space.

> **In short:** Add indexes on columns you search often. Don't add too many — they slow down writes. Use `EXPLAIN` to check if your indexes are actually being used.

### What is O(n) and O(log n)?

When we talk about indexes, we mention **O(n)** and **O(log n)**. These describe how many steps the database needs to find your data.

**How to read them:**

- **O(n)** → read as "Big O of n" or "Order of n"
- **O(log n)** → read as "Big O of log n" or "Order of log n"
- **O(1)** → read as "Big O of one" (constant time — always 1 step no matter the data size)
- **O(n²)** → read as "Big O of n squared"

The "O" stands for **Order** — it describes how fast the time increases as data grows.

**O(n) — Linear Time (Without Index)**

You have a list of 1,000 names and you're looking for "Ahmed". You start from the first name and check one by one until you find it. In the worst case, you check all 1,000 names.

- 1,000 items → up to 1,000 steps
- 1,000,000 items → up to 1,000,000 steps

More data = more time, directly proportional.

**O(log n) — Logarithmic Time (With Index)**

Now imagine the same 1,000 names but they are **sorted alphabetically**. Instead of checking one by one, you open the middle:

1. Open the middle → "M". Ahmed starts with "A", so go to the left half.
2. Open the middle of the left half → "D". Ahmed is before "D", go left again.
3. Keep cutting in half...

In about **10 steps**, you find Ahmed out of 1,000. Because every step cuts the remaining data in half.

- 1,000 items → ~10 steps
- 1,000,000 items → ~20 steps

More data = barely more time.

**The difference:**

- 10 items → O(n) = 10 steps, O(log n) = 3 steps
- 100 items → O(n) = 100 steps, O(log n) = 7 steps
- 1,000 items → O(n) = 1,000 steps, O(log n) = 10 steps
- 1,000,000 items → O(n) = 1,000,000 steps, O(log n) = 20 steps

> **In short:** O(n) means the database checks every row one by one (slow). O(log n) means it cuts the data in half at each step using the B-Tree structure (fast). That's why indexes make such a huge difference.

---

## 24. Elasticsearch

### What is Elasticsearch?

- Elasticsearch is a **search engine** for your app — like Google but for your own data.
- You type "wireles headphons" (with typos) → it still finds "Wireless Headphones".
- It searches millions of records almost instantly.
- It ranks results by how relevant they are (best match first).

> **Analogy:** MySQL search is like searching for a word in a book by reading every page. Elasticsearch is like having a smart assistant who instantly knows which page to open.

**When to use it:**
- You have a lot of products/articles and need fast search.
- You want autocomplete (suggestions while typing).
- You want search that handles typos.

**When NOT to use it:**
- Small datasets (under 10,000 records) — MySQL/PostgreSQL is enough.
- As your main database — always keep MySQL/PostgreSQL as your primary database.

---

### How It Works (Simple Overview)

1. Your main data lives in MySQL/PostgreSQL (as usual).
2. You **copy** the searchable data to Elasticsearch.
3. When a user searches, you ask Elasticsearch (not MySQL).
4. Elasticsearch returns the results instantly.

```
User types "laptop" → Your App → Elasticsearch → Returns matching products
                                                     ↓
                                        Your App shows results to user
```

---

### Core Concepts

- **Index** = like a table — where your searchable data lives
- **Document** = like a row — one record (stored as JSON)
- **Field** = like a column — a key inside the JSON (name, price, category)
- **Mapping** = like a schema — tells Elasticsearch the type of each field

---

### The Easy Way: Laravel Scout

Laravel Scout is the **simplest way** to add Elasticsearch to your Laravel app. Instead of writing complex Elasticsearch queries, you just use `Product::search('...')`:

**Step 1: Install**

```bash
composer require laravel/scout
composer require babenkoivan/elastic-scout-driver
```

**Step 2: Add `Searchable` to your model**

```php
use Laravel\Scout\Searchable;

class Product extends Model
{
    use Searchable;

    // Tell Scout which fields to send to Elasticsearch
    public function toSearchableArray(): array
    {
        return [
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'category' => $this->category?->name,
            'in_stock' => $this->stock > 0,
        ];
    }
}
```

**Step 3: Search**

```php
// Search for products — that's it!
$products = Product::search('wireless headphones')
    ->where('category', 'Electronics')
    ->paginate(20);
```

**Step 4: Configure `.env`**

```env
SCOUT_DRIVER=elastic
ELASTICSEARCH_HOST=http://localhost:9200
```

> **In short:** With Laravel Scout, you add `use Searchable` to your model, and you get `Product::search()` for free. Scout automatically keeps Elasticsearch in sync when you create, update, or delete products.

---

### Keeping Data in Sync

When you use Laravel Scout, it **automatically** syncs your data:

- You create a product → Scout adds it to Elasticsearch.
- You update a product → Scout updates it in Elasticsearch.
- You delete a product → Scout removes it from Elasticsearch.

No extra code needed — Scout handles it.

---

### Search Controller Example

```php
class SearchController extends Controller
{
    public function search(Request $request)
    {
        $request->validate([
            'q' => 'required|string|min:1|max:200',
        ]);

        $products = Product::search($request->input('q'))->paginate(20);

        return response()->json($products);
    }
}
```

```php
// routes/api.php
Route::get('/search', [SearchController::class, 'search']);
```

---

### When to Use What?

- **Less than 10,000 records** → Use normal `WHERE` / `LIKE` — simple and enough.
- **10,000 to 1 million records** → Use PostgreSQL full-text search — fast, no extra setup.
- **More than 1 million records** or you need autocomplete/typo handling → Use **Elasticsearch**.

**Key differences:**
- **MySQL `LIKE`** — Simple, no setup, slow on big data, no typo handling. Best for small apps.
- **PostgreSQL Full-Text** — Fast, built-in, some advanced features. Best for medium apps.
- **Elasticsearch** — Very fast, handles typos, autocomplete, smart ranking. Best for large apps. Needs extra setup.

> **In short:** Start with normal database search. Move to Elasticsearch only when your data is big or you need smart search features like autocomplete and typo handling.

---

## 25. What is ACID?

ACID is a set of **4 rules** that make sure your database keeps data safe and correct — especially when multiple things happen at the same time.

**A — Atomicity (All or Nothing)**

- A group of operations either **all succeed** or **all fail** together.
- If one step fails, everything is rolled back — no half-done changes.

> **Analogy:** Transferring money from Account A to Account B. Either the money leaves A AND arrives in B, or nothing happens at all. You never lose money in between.

```php
// Laravel example
DB::transaction(function () {
    // Step 1: Take money from sender
    $sender->balance -= 500;
    $sender->save();

    // Step 2: Give money to receiver
    $receiver->balance += 500;
    $receiver->save();
});
// If step 2 fails → step 1 is also undone automatically
```

---

**C — Consistency (Data stays correct)**

- The database always moves from one valid state to another.
- Rules you set (unique emails, positive balances, foreign keys) are always respected.
- No invalid data is ever saved.

> **Analogy:** A bank account can never go below $0 if that's the rule. Even if 100 people try to withdraw at the same time, the database won't allow a negative balance.

---

**I — Isolation (Transactions don't interfere)**

- Multiple transactions running at the same time don't mess with each other.
- Each transaction thinks it's the only one running.
- The final result is the same as if they ran one after another.

> **Analogy:** Two cashiers at a store can serve customers at the same time, but they won't accidentally sell the last item to both customers.

---

**D — Durability (Data is saved permanently)**

- Once a transaction is done (committed), the data is **permanently saved**.
- Even if the server crashes or loses power, the data is still there when it comes back.

> **Analogy:** Once the bank confirms your transfer, the money is moved. Even if the bank's computer crashes right after, your transfer is safe.

---

**Which databases support ACID?**

- **MySQL (InnoDB)** — Yes
- **PostgreSQL** — Yes (always)
- **MongoDB** — Partially (supports ACID for single documents, multi-document transactions added in v4.0+, but not as strong as relational databases)

> **In short:** ACID = your data is always safe, correct, and permanent. This is why relational databases (MySQL, PostgreSQL) are used for important data like payments, orders, and user accounts.

---

## 26. What is MongoDB?

- MongoDB is a **NoSQL** database — it stores data as **JSON-like documents** instead of rows and tables.
- There are no strict schemas — each document can have different fields.
- It's designed for flexibility and speed with large amounts of unstructured data.

**How MongoDB stores data:**

```javascript
// A "document" in MongoDB (like a row in MySQL)
{
    "_id": "64a1b2c3d4e5f6a7b8c9d0e1",
    "name": "Ahmed",
    "email": "ahmed@example.com",
    "age": 28,
    "address": {
        "city": "Dubai",
        "country": "UAE"
    },
    "skills": ["Laravel", "React", "Node.js"]
}
```

**MongoDB terms vs MySQL terms:**

- **Database** → Database (same)
- **Collection** → Table
- **Document** → Row
- **Field** → Column
- **`_id`** → Primary Key (auto-generated)

**Key features:**

- **Flexible schema** — You don't need to define columns first. You can add new fields anytime without migrations.
- **Nested data** — You can store objects inside objects (like `address.city` above). No need for joins.
- **Arrays** — You can store lists directly (like `skills` above).
- **Horizontal scaling** — Easy to split data across multiple servers (sharding).
- **Fast reads/writes** — Great for apps that need high speed with large data.

**When to use MongoDB:**

- Real-time apps (chat, notifications, IoT sensors).
- Apps with data that changes structure often (CMS, product catalogs with different attributes).
- Logging and analytics (storing millions of logs).
- When you need to store nested/complex JSON data naturally.

**When NOT to use MongoDB:**

- Apps that need complex joins between tables (use MySQL/PostgreSQL).
- Apps that need strict data rules and relationships (e-commerce orders, banking).
- When ACID transactions are critical for every operation.

---

## 27. MongoDB vs MySQL/PostgreSQL

**Data structure:**
- **MySQL/PostgreSQL** — Data is in tables with rows and columns. Every row follows the same structure.
- **MongoDB** — Data is in collections with documents (JSON). Each document can have different fields.

**Schema:**
- **MySQL/PostgreSQL** — Fixed schema. You must define columns first using migrations. Changing structure needs a migration.
- **MongoDB** — Flexible schema. No migrations needed. You can add fields anytime.

**Relationships:**
- **MySQL/PostgreSQL** — Uses foreign keys and JOINs to connect tables. Great for related data.
- **MongoDB** — Stores related data inside the document (nested). Avoids JOINs. Bad for complex relationships.

**Joins:**
- **MySQL/PostgreSQL** — Powerful JOINs (INNER, LEFT, RIGHT, etc.). Made for this.
- **MongoDB** — Has `$lookup` (like a JOIN) but it's slower and not recommended for heavy use.

**ACID:**
- **MySQL/PostgreSQL** — Full ACID support. Safe for critical data.
- **MongoDB** — ACID for single documents. Multi-document transactions supported but weaker.

**Scaling:**
- **MySQL/PostgreSQL** — Scales vertically (bigger server). Horizontal scaling is harder.
- **MongoDB** — Scales horizontally easily (add more servers, split data across them).

**Speed:**
- **MySQL/PostgreSQL** — Faster for complex queries with JOINs and aggregations.
- **MongoDB** — Faster for simple reads/writes with large amounts of data.

**Best for:**
- **MySQL/PostgreSQL** — E-commerce, banking, CRM, blogs, any app with structured data and relationships.
- **MongoDB** — Real-time apps, IoT, logging, CMS, apps with flexible or changing data structures.

> **In short:** Use MySQL/PostgreSQL when your data has clear relationships and you need strict rules. Use MongoDB when your data is flexible, nested, or changes structure often.

---

## 28. Common MongoDB Interview Questions

### Q1: What is the difference between SQL and NoSQL?

- **SQL** (MySQL, PostgreSQL) — Stores data in tables with rows and columns. Uses structured query language. Has strict schema. Best for structured, relational data.
- **NoSQL** (MongoDB, Redis, Cassandra) — Stores data in documents, key-value pairs, or graphs. Flexible schema. Best for unstructured or fast-changing data.

---

### Q2: What are the types of NoSQL databases?

- **Document** — Stores JSON-like documents. Example: **MongoDB**.
- **Key-Value** — Stores data as key-value pairs (like a dictionary). Example: **Redis**.
- **Column-family** — Stores data in columns instead of rows. Example: **Cassandra**.
- **Graph** — Stores data as nodes and relationships. Example: **Neo4j**.

---

### Q3: What is a Collection in MongoDB?

- A collection is like a **table** in MySQL.
- It holds a group of documents (records).
- Unlike tables, a collection doesn't enforce a schema — documents inside can have different fields.

---

### Q4: What is a Document in MongoDB?

- A document is like a **row** in MySQL, but stored as JSON.
- Each document has a unique `_id` field (auto-generated if you don't provide one).
- Documents can contain nested objects and arrays.

---

### Q5: How do you do CRUD in MongoDB?

```javascript
// CREATE — insert a new document
db.users.insertOne({
    name: "Ahmed",
    email: "ahmed@example.com",
    age: 28
});

// READ — find documents
db.users.find({ age: { $gte: 18 } });         // find users with age >= 18
db.users.findOne({ email: "ahmed@example.com" }); // find one user

// UPDATE — update a document
db.users.updateOne(
    { email: "ahmed@example.com" },       // filter: which document
    { $set: { age: 29 } }                 // update: what to change
);

// DELETE — remove a document
db.users.deleteOne({ email: "ahmed@example.com" });
```

---

### Q6: What is `$lookup` in MongoDB?

- `$lookup` is like a **JOIN** in MySQL — it lets you combine data from two collections.
- It's part of the aggregation pipeline.

```javascript
// Get orders with user details (like a LEFT JOIN)
db.orders.aggregate([
    {
        $lookup: {
            from: "users",           // the other collection
            localField: "user_id",   // field in orders
            foreignField: "_id",     // field in users
            as: "user"               // name for the result
        }
    }
]);
```

> **Note:** `$lookup` works but is slower than SQL JOINs. If you need many joins, MongoDB might not be the best choice.

---

### Q7: What is Embedding vs Referencing?

Two ways to handle related data in MongoDB:

**Embedding (nested data)** — Store related data inside the document:

```javascript
// User with embedded address — good when data is always read together
{
    "name": "Ahmed",
    "address": {
        "city": "Dubai",
        "country": "UAE"
    }
}
```

**Referencing (like foreign key)** — Store just the ID and look it up:

```javascript
// User with reference to address collection
{
    "name": "Ahmed",
    "address_id": "64a1b2c3..."  // points to another collection
}
```

**When to embed:** Data is read together, rarely changes, and is not too large.
**When to reference:** Data is shared between documents, changes often, or is very large.

---

### Q8: What is the Aggregation Pipeline?

- A way to process and transform data step by step (like a factory assembly line).
- Each step does one thing: filter, group, sort, calculate.

```javascript
// Example: Get total sales per category
db.orders.aggregate([
    { $match: { status: "paid" } },              // Step 1: filter only paid orders
    { $group: {                                    // Step 2: group by category
        _id: "$category",
        totalSales: { $sum: "$amount" },
        count: { $sum: 1 }
    }},
    { $sort: { totalSales: -1 } }                 // Step 3: sort by highest sales
]);
```

---

### Q9: What is Indexing in MongoDB?

- Same concept as MySQL — indexes make queries faster.
- Without index → MongoDB scans every document (slow).
- With index → MongoDB jumps directly to matching documents (fast).

```javascript
// Create an index on the email field
db.users.createIndex({ email: 1 });        // 1 = ascending

// Compound index (multiple fields)
db.users.createIndex({ age: 1, name: 1 });

// Unique index (no duplicate values)
db.users.createIndex({ email: 1 }, { unique: true });
```

---

### Q10: What is Sharding in MongoDB?

- **Sharding** means splitting your data across multiple servers.
- Each server holds a piece of the data (a "shard").
- This lets MongoDB handle very large datasets and high traffic.

> **Analogy:** Instead of one library with all the books, you have 5 libraries — each holds books for certain letters (A-E, F-J, etc.). When someone asks for a book, they go to the right library.

- **When to shard:** Your data is too big for one server, or you have too many requests for one server to handle.
- **Most apps don't need sharding** — a single server can handle millions of documents.

---

### Q11: Can you use MongoDB with Laravel?

Yes, using the `mongodb/laravel-mongodb` package:

```bash
composer require mongodb/laravel-mongodb
```

```php
use MongoDB\Laravel\Eloquent\Model;

class Product extends Model
{
    protected $connection = 'mongodb';
    protected $collection = 'products'; // collection name (like table name)

    protected $fillable = ['name', 'price', 'tags', 'details'];
}

// Use it like normal Eloquent
Product::create([
    'name' => 'Laptop',
    'price' => 999,
    'tags' => ['electronics', 'computers'],
    'details' => [
        'brand' => 'Dell',
        'ram' => '16GB',
    ],
]);

// Query
$products = Product::where('price', '>', 500)->get();
$electronics = Product::where('tags', 'electronics')->get();
```

> **In short:** MongoDB with Laravel works almost the same as MySQL Eloquent. The main difference is you can store arrays and nested objects directly without extra tables.
