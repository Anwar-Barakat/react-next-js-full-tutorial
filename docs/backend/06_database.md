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

An index is a data structure that the database maintains alongside your table to speed up lookups. Without an index, the database must scan every row (**full table scan**). With an index, it jumps directly to matching rows.

**Analogy:** A book's index lets you find "Chapter 5" instantly instead of flipping through every page.

### How Indexes Work Internally

Most databases use a **B-Tree** (balanced tree) structure:

```
                    [M]
                   /   \
              [D, H]    [R, X]
             / | \      / | \
           [A-C][E-G][I-L][N-Q][S-W][Y-Z]
                          ↓
                     Leaf nodes point
                     to actual table rows
```

- **B-Tree** — the default index type. Good for equality (`=`) and range queries (`>`, `<`, `BETWEEN`).
- Lookup time: **O(log n)** — scanning 1 million rows takes ~20 steps instead of 1,000,000.

### Index Types

- **Primary Key** — Auto-created, unique row identifier → `$table->id()`
- **Unique Index** — Ensures no duplicate values → `$table->unique('email')`
- **Regular Index** — Speeds up lookups on frequently queried columns → `$table->index('status')`
- **Composite Index** — Index on multiple columns (order matters) → `$table->index(['user_id', 'created_at'])`
- **Full-Text Index** — Text search across large text fields → `$table->fullText(['title', 'body'])`
- **Partial Index** — Index only rows matching a condition (PostgreSQL) → `WHERE active = true`
- **Expression Index** — Index on computed values (PostgreSQL) → `LOWER(email)`
- **GIN Index** — Generalized Inverted Index — JSONB, arrays, full-text (PostgreSQL) → `USING GIN (metadata)`
- **GiST Index** — Generalized Search Tree — geospatial, range types (PostgreSQL) → `USING GiST (location)`
- **Hash Index** — Equality-only lookups (faster than B-Tree for `=`) → `USING HASH (email)`

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

The **order of columns** in a composite index matters. The index follows the **leftmost prefix rule**.

```php
// Composite index on (user_id, status, created_at)
$table->index(['user_id', 'status', 'created_at']);
```

This index is used for:

```php
// ✅ Uses index (matches left-to-right)
Order::where('user_id', 1)->get();
Order::where('user_id', 1)->where('status', 'paid')->get();
Order::where('user_id', 1)->where('status', 'paid')->where('created_at', '>', now()->subMonth())->get();

// ❌ Does NOT use index (skips user_id)
Order::where('status', 'paid')->get();
Order::where('created_at', '>', now()->subMonth())->get();
Order::where('status', 'paid')->where('created_at', '>', now()->subMonth())->get();
```

**Rule of thumb:** Put the most selective (most unique values) column first, then the next most selective.

### When to Add Indexes

**Add indexes on:**

- Columns in `WHERE` clauses — `where('status', 'active')`
- Columns in `ORDER BY` — `orderBy('created_at')`
- Foreign keys — `user_id`, `post_id` (Laravel adds these automatically with `foreignId`)
- Columns in `JOIN` conditions
- Columns used in `GROUP BY`
- Columns with unique constraints

**Do NOT add indexes on:**

- Tables with very few rows (< 1,000) — full scan is fast enough.
- Columns that change very frequently — indexes slow down writes.
- Columns with very low cardinality (e.g., a `gender` column with only 2 values) — index won't help much.
- Every column — too many indexes slow down `INSERT`, `UPDATE`, `DELETE`.

### Measuring Index Performance

```sql
-- MySQL: EXPLAIN shows how a query uses indexes
EXPLAIN SELECT * FROM orders WHERE user_id = 5 AND status = 'paid';

-- PostgreSQL: EXPLAIN ANALYZE shows actual execution time
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 5 AND status = 'paid';
```

**Key fields to check:**

- `type` (MySQL) — Good: `ref`, `range`, `const` — Bad: `ALL` (full table scan)
- `rows` — Good: low number — Bad: same as total rows
- `Extra` — Good: `Using index` — Bad: `Using filesort`, `Using temporary`
- `Seq Scan` (PostgreSQL) — Good: not present — Bad: present (means no index used)

**Laravel debug:**

```php
// Enable query log
DB::enableQueryLog();

$orders = Order::where('user_id', 5)->where('status', 'paid')->get();

// See the queries
dd(DB::getQueryLog());

// Or use Laravel Debugbar / Telescope for visual query analysis
```

### Index Costs

Indexes are **not free**:

- `SELECT` (read) — Without index: slow (full scan) — With index: fast (index lookup)
- `INSERT` — Without index: fast — With index: slower (must update index)
- `UPDATE` — Without index: fast — With index: slower (must update index)
- `DELETE` — Without index: fast — With index: slower (must update index)
- Disk space — Without index: less — With index: more (index stored separately)

**Balance:** Add indexes for columns you query often. Remove indexes you don't use. Monitor with `EXPLAIN`.

---

## 24. Elasticsearch

### What is Elasticsearch?

Elasticsearch is an open-source, distributed **search and analytics engine** built on Apache Lucene. It stores data as JSON documents and provides near-real-time full-text search.

**Key characteristics:**

- **Full-text search** — advanced text matching with relevance scoring, fuzzy matching, stemming, synonyms.
- **Near-real-time** — documents are searchable within ~1 second of indexing.
- **Distributed** — scales horizontally across multiple nodes.
- **Schema-free** — stores JSON documents (but you should define mappings for production).
- **RESTful API** — all operations via HTTP/JSON.

**When to use Elasticsearch:**

- Full-text search across large datasets (products, articles, logs).
- Autocomplete / search-as-you-type.
- Log aggregation and analysis (ELK stack: Elasticsearch, Logstash, Kibana).
- Analytics and metrics dashboards.
- Geospatial search (find stores near me).

**When NOT to use Elasticsearch:**

- As your primary database — it's not ACID compliant.
- Simple `WHERE` queries on small datasets — use MySQL/PostgreSQL indexes.
- Transactional data — use a relational database.

### Core Concepts

- **Index** (like a Database) — A collection of documents with similar structure
- **Document** (like a Row) — A single JSON record
- **Field** (like a Column) — A key-value pair in a document
- **Mapping** (like a Schema) — Defines field types and how they're indexed
- **Shard** (like a Partition) — A subset of an index distributed across nodes
- **Replica** (like a Read replica) — A copy of a shard for availability and read performance

### Setup with Laravel

**Install Elasticsearch PHP client:**

```bash
composer require elasticsearch/elasticsearch
```

**Configuration (`config/elasticsearch.php`):**

```php
return [
    'hosts' => [
        env('ELASTICSEARCH_HOST', 'http://localhost:9200'),
    ],
    'username' => env('ELASTICSEARCH_USERNAME', null),
    'password' => env('ELASTICSEARCH_PASSWORD', null),
];
```

```env
ELASTICSEARCH_HOST=http://localhost:9200
```

**Service Provider (`app/Providers/ElasticsearchServiceProvider.php`):**

```php
use Elastic\Elasticsearch\ClientBuilder;

class ElasticsearchServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton('elasticsearch', function () {
            return ClientBuilder::create()
                ->setHosts(config('elasticsearch.hosts'))
                ->build();
        });
    }
}
```

### Creating an Index with Mapping

```php
use Elastic\Elasticsearch\Client;

class ProductSearchService
{
    public function __construct(
        private Client $client
    ) {}

    /**
     * Create index with mapping (run once)
     */
    public function createIndex(): void
    {
        $this->client->indices()->create([
            'index' => 'products',
            'body' => [
                'settings' => [
                    'number_of_shards' => 1,
                    'number_of_replicas' => 1,
                    'analysis' => [
                        'analyzer' => [
                            'product_analyzer' => [
                                'type' => 'custom',
                                'tokenizer' => 'standard',
                                'filter' => ['lowercase', 'stop', 'snowball'],
                            ],
                        ],
                    ],
                ],
                'mappings' => [
                    'properties' => [
                        'name' => [
                            'type' => 'text',
                            'analyzer' => 'product_analyzer',
                            'fields' => [
                                'keyword' => ['type' => 'keyword'], // for exact match & sorting
                            ],
                        ],
                        'description' => ['type' => 'text', 'analyzer' => 'product_analyzer'],
                        'price' => ['type' => 'float'],
                        'category' => ['type' => 'keyword'],
                        'tags' => ['type' => 'keyword'],
                        'in_stock' => ['type' => 'boolean'],
                        'created_at' => ['type' => 'date'],
                        'location' => ['type' => 'geo_point'],
                    ],
                ],
            ],
        ]);
    }
}
```

### Indexing Documents

```php
class ProductSearchService
{
    /**
     * Index a single product
     */
    public function indexProduct(Product $product): void
    {
        $this->client->index([
            'index' => 'products',
            'id' => $product->id,
            'body' => [
                'name' => $product->name,
                'description' => $product->description,
                'price' => $product->price,
                'category' => $product->category->name,
                'tags' => $product->tags->pluck('name')->toArray(),
                'in_stock' => $product->stock > 0,
                'created_at' => $product->created_at->toIso8601String(),
            ],
        ]);
    }

    /**
     * Bulk index all products (faster for large datasets)
     */
    public function indexAll(): void
    {
        $params = ['body' => []];

        Product::with('category', 'tags')->chunk(500, function ($products) use (&$params) {
            foreach ($products as $product) {
                $params['body'][] = [
                    'index' => [
                        '_index' => 'products',
                        '_id' => $product->id,
                    ],
                ];
                $params['body'][] = [
                    'name' => $product->name,
                    'description' => $product->description,
                    'price' => $product->price,
                    'category' => $product->category->name,
                    'tags' => $product->tags->pluck('name')->toArray(),
                    'in_stock' => $product->stock > 0,
                    'created_at' => $product->created_at->toIso8601String(),
                ];
            }

            $this->client->bulk($params);
            $params = ['body' => []];
        });
    }

    /**
     * Remove a product from the index
     */
    public function removeProduct(int $productId): void
    {
        $this->client->delete([
            'index' => 'products',
            'id' => $productId,
        ]);
    }
}
```

### Searching

```php
class ProductSearchService
{
    /**
     * Full-text search with filters
     */
    public function search(string $query, array $filters = [], int $page = 1, int $perPage = 20): array
    {
        $body = [
            'from' => ($page - 1) * $perPage,
            'size' => $perPage,
            'query' => [
                'bool' => [
                    // Full-text search across name and description
                    'must' => [
                        'multi_match' => [
                            'query' => $query,
                            'fields' => ['name^3', 'description'], // name has 3x weight
                            'fuzziness' => 'AUTO', // handles typos
                        ],
                    ],
                    'filter' => [],
                ],
            ],
            'highlight' => [
                'fields' => [
                    'name' => new \stdClass(),
                    'description' => new \stdClass(),
                ],
            ],
            'sort' => [
                '_score', // relevance first
                ['created_at' => 'desc'],
            ],
        ];

        // Apply filters
        if (!empty($filters['category'])) {
            $body['query']['bool']['filter'][] = [
                'term' => ['category' => $filters['category']],
            ];
        }

        if (!empty($filters['min_price']) || !empty($filters['max_price'])) {
            $range = [];
            if (!empty($filters['min_price'])) $range['gte'] = $filters['min_price'];
            if (!empty($filters['max_price'])) $range['lte'] = $filters['max_price'];
            $body['query']['bool']['filter'][] = ['range' => ['price' => $range]];
        }

        if (isset($filters['in_stock'])) {
            $body['query']['bool']['filter'][] = [
                'term' => ['in_stock' => $filters['in_stock']],
            ];
        }

        $response = $this->client->search([
            'index' => 'products',
            'body' => $body,
        ]);

        return [
            'total' => $response['hits']['total']['value'],
            'products' => collect($response['hits']['hits'])->map(fn ($hit) => [
                'id' => $hit['_id'],
                'score' => $hit['_score'],
                'highlight' => $hit['highlight'] ?? [],
                ...$hit['_source'],
            ]),
        ];
    }
}
```

### Autocomplete (Search-as-You-Type)

```php
/**
 * Autocomplete suggestions
 */
public function autocomplete(string $query, int $limit = 5): array
{
    $response = $this->client->search([
        'index' => 'products',
        'body' => [
            'size' => $limit,
            'query' => [
                'bool' => [
                    'should' => [
                        // Prefix match (starts with)
                        [
                            'match_phrase_prefix' => [
                                'name' => [
                                    'query' => $query,
                                    'max_expansions' => 10,
                                ],
                            ],
                        ],
                        // Fuzzy match (handles typos)
                        [
                            'fuzzy' => [
                                'name.keyword' => [
                                    'value' => $query,
                                    'fuzziness' => 'AUTO',
                                ],
                            ],
                        ],
                    ],
                ],
            ],
            '_source' => ['name', 'category'],
        ],
    ]);

    return collect($response['hits']['hits'])->map(fn ($hit) => [
        'id' => $hit['_id'],
        'name' => $hit['_source']['name'],
        'category' => $hit['_source']['category'],
    ])->toArray();
}
```

### Aggregations (Faceted Search)

```php
/**
 * Get filter facets (categories, price ranges, etc.)
 */
public function getFacets(string $query): array
{
    $response = $this->client->search([
        'index' => 'products',
        'body' => [
            'size' => 0, // no results, only aggregations
            'query' => [
                'multi_match' => [
                    'query' => $query,
                    'fields' => ['name', 'description'],
                ],
            ],
            'aggs' => [
                'categories' => [
                    'terms' => ['field' => 'category', 'size' => 20],
                ],
                'price_ranges' => [
                    'range' => [
                        'field' => 'price',
                        'ranges' => [
                            ['key' => 'Under $25', 'to' => 25],
                            ['key' => '$25-$50', 'from' => 25, 'to' => 50],
                            ['key' => '$50-$100', 'from' => 50, 'to' => 100],
                            ['key' => 'Over $100', 'from' => 100],
                        ],
                    ],
                ],
                'avg_price' => [
                    'avg' => ['field' => 'price'],
                ],
            ],
        ],
    ]);

    return [
        'categories' => $response['aggregations']['categories']['buckets'],
        'price_ranges' => $response['aggregations']['price_ranges']['buckets'],
        'avg_price' => $response['aggregations']['avg_price']['value'],
    ];
}
```

### Keeping Elasticsearch in Sync

Use model observers to keep Elasticsearch updated when data changes in your database:

```php
class ProductObserver
{
    public function __construct(
        private ProductSearchService $search
    ) {}

    public function created(Product $product): void
    {
        $this->search->indexProduct($product);
    }

    public function updated(Product $product): void
    {
        $this->search->indexProduct($product);
    }

    public function deleted(Product $product): void
    {
        $this->search->removeProduct($product->id);
    }
}

// Register in AppServiceProvider
Product::observe(ProductObserver::class);
```

For high-traffic apps, dispatch index updates to a queue:

```php
class IndexProductJob implements ShouldQueue
{
    public function __construct(public int $productId) {}

    public function handle(ProductSearchService $search): void
    {
        $product = Product::with('category', 'tags')->find($this->productId);
        if ($product) {
            $search->indexProduct($product);
        }
    }
}

// In observer
public function updated(Product $product): void
{
    IndexProductJob::dispatch($product->id);
}
```

### Using with Laravel Scout

Laravel Scout provides a simple driver-based interface for search. Use the Elasticsearch driver for a cleaner API:

```bash
composer require laravel/scout
composer require babenkoivan/elastic-scout-driver
```

```php
// config/scout.php
'driver' => env('SCOUT_DRIVER', 'elastic'),

// In your model
use Laravel\Scout\Searchable;

class Product extends Model
{
    use Searchable;

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

// Search (simple API)
$products = Product::search('wireless headphones')
    ->where('category', 'Electronics')
    ->paginate(20);
```

### Controller and Routes Example

```php
class SearchController extends Controller
{
    public function __construct(
        private ProductSearchService $search
    ) {}

    public function search(Request $request)
    {
        $request->validate([
            'q' => 'required|string|min:1|max:200',
            'category' => 'nullable|string',
            'min_price' => 'nullable|numeric|min:0',
            'max_price' => 'nullable|numeric|min:0',
            'in_stock' => 'nullable|boolean',
            'page' => 'nullable|integer|min:1',
        ]);

        $results = $this->search->search(
            query: $request->input('q'),
            filters: $request->only(['category', 'min_price', 'max_price', 'in_stock']),
            page: $request->input('page', 1),
        );

        return response()->json($results);
    }

    public function autocomplete(Request $request)
    {
        $request->validate(['q' => 'required|string|min:1|max:100']);

        return response()->json(
            $this->search->autocomplete($request->input('q'))
        );
    }
}
```

```php
// routes/api.php
Route::get('/search', [SearchController::class, 'search']);
Route::get('/search/autocomplete', [SearchController::class, 'autocomplete']);
```

### Frontend Search Component

```tsx
import { useState, useEffect, useRef } from 'react';

interface SearchResult {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    score: number;
    highlight: Record<string, string[]>;
}

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState<{ id: string; name: string }[]>([]);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const debounceRef = useRef<NodeJS.Timeout>();

    // Autocomplete on typing
    useEffect(() => {
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }

        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            const res = await fetch(`/api/search/autocomplete?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            setSuggestions(data);
        }, 300); // debounce 300ms
    }, [query]);

    // Full search on submit
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setSuggestions([]);

        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.products);
        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full p-3 border rounded-lg"
                />
                <button type="submit" className="absolute right-2 top-2 bg-blue-600 text-white px-4 py-1 rounded">
                    Search
                </button>

                {suggestions.length > 0 && (
                    <ul className="absolute w-full bg-white border rounded-lg mt-1 shadow-lg z-10">
                        {suggestions.map((s) => (
                            <li
                                key={s.id}
                                onClick={() => { setQuery(s.name); setSuggestions([]); }}
                                className="p-3 hover:bg-gray-100 cursor-pointer"
                            >
                                {s.name}
                            </li>
                        ))}
                    </ul>
                )}
            </form>

            {loading && <p className="mt-4 text-gray-500">Searching...</p>}

            <div className="mt-6 space-y-4">
                {results.map((product) => (
                    <div key={product.id} className="border rounded-lg p-4">
                        <h3 className="font-bold">{product.name}</h3>
                        <p className="text-gray-600 text-sm">{product.category}</p>
                        <p className="text-lg font-semibold mt-1">${product.price.toFixed(2)}</p>
                        {product.highlight?.description && (
                            <p
                                className="text-sm text-gray-500 mt-2"
                                dangerouslySetInnerHTML={{ __html: product.highlight.description[0] }}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
```

### Elasticsearch vs Database Search

**MySQL/PostgreSQL `LIKE`:**
- Speed — Slow on large data
- Fuzzy matching — No
- Relevance scoring — No
- Autocomplete — Manual
- Faceted search — Manual `GROUP BY`
- Synonyms — No
- Scalability — Single server
- Setup complexity — None
- Best for — Small datasets, simple search

**PostgreSQL Full-Text:**
- Speed — Fast
- Fuzzy matching — Limited
- Relevance scoring — Basic
- Autocomplete — Manual
- Faceted search — Manual
- Synonyms — Yes
- Scalability — Single server
- Setup complexity — Low
- Best for — Medium datasets

**Elasticsearch:**
- Speed — Very fast
- Fuzzy matching — Yes (handles typos)
- Relevance scoring — Advanced
- Autocomplete — Built-in
- Faceted search — Built-in aggregations
- Synonyms — Yes
- Scalability — Distributed cluster
- Setup complexity — Medium-High
- Best for — Large datasets, complex search

**Rule of thumb:**
- < 10K records with simple search → use `LIKE` or `WHERE`.
- 10K-1M records with text search → use PostgreSQL full-text search.
- > 1M records or need autocomplete/facets/fuzzy → use Elasticsearch.
