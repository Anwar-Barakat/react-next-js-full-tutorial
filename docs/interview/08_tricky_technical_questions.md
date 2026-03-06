# Tricky Technical Interview Questions

Real-world scenario questions that interviewers ask to test problem-solving and experience. Each question includes why they ask it, step-by-step analysis, and a solution with code.

---

## Table of Contents

1. [How to search 1 million records efficiently?](#1-how-to-search-1-million-records-efficiently)
2. [Your API endpoint is slow — how do you debug it?](#2-your-api-endpoint-is-slow--how-do-you-debug-it)
3. [How to handle large file uploads (100MB+)?](#3-how-to-handle-large-file-uploads-100mb)
4. [Two users update the same record at the same time — what happens?](#4-two-users-update-the-same-record-at-the-same-time--what-happens)
5. [Your database is running out of memory — what do you do?](#5-your-database-is-running-out-of-memory--what-do-you-do)
6. [How to prevent your API from being abused?](#6-how-to-prevent-your-api-from-being-abused)
7. [A background job fails halfway — how to handle it?](#7-a-background-job-fails-halfway--how-to-handle-it)
8. [How to handle pagination for millions of records?](#8-how-to-handle-pagination-for-millions-of-records)
9. [Your cache and database are out of sync — how to fix it?](#9-your-cache-and-database-are-out-of-sync--how-to-fix-it)
10. [How to design a search with filters, sorting, and full-text?](#10-how-to-design-a-search-with-filters-sorting-and-full-text)
11. [A query that worked fine is now slow — what happened?](#11-a-query-that-worked-fine-is-now-slow--what-happened)
12. [How to deploy without downtime?](#12-how-to-deploy-without-downtime)
13. [How to handle N+1 query in a real project?](#13-how-to-handle-n1-query-in-a-real-project)
14. [Your app needs to send 10,000 emails — how?](#14-your-app-needs-to-send-10000-emails--how)
15. [How to store and query hierarchical data (categories)?](#15-how-to-store-and-query-hierarchical-data-categories)
16. [Your React app is slow — where do you look first?](#16-your-react-app-is-slow--where-do-you-look-first)
17. [How to build auto-save without overloading the server?](#17-how-to-build-auto-save-without-overloading-the-server)
18. [If you could redesign useEffect, what would you change?](#18-if-you-could-redesign-useeffect-what-would-you-change)
19. [Your API is failing silently in production — how do you debug?](#19-your-api-is-failing-silently-in-production--how-do-you-debug)
20. [Build a search bar that works offline and syncs when back online](#20-build-a-search-bar-that-works-offline-and-syncs-when-back-online)
21. [React Server Components vs Client Components — your strategy?](#21-react-server-components-vs-client-components--your-strategy)
22. [Micro-frontends in React — when and why?](#22-micro-frontends-in-react--when-and-why)
23. [How do you handle authentication across multiple tabs?](#23-how-do-you-handle-authentication-across-multiple-tabs)
24. [Your form has 20 fields — how do you manage the state?](#24-your-form-has-20-fields--how-do-you-manage-the-state)
25. [How to handle real-time data in React?](#25-how-to-handle-real-time-data-in-react)
26. [What happens when you type a URL in the browser and press Enter?](#26-what-happens-when-you-type-a-url-in-the-browser-and-press-enter)
27. [How to handle image optimization in a web app?](#27-how-to-handle-image-optimization-in-a-web-app)
28. [Your Next.js page takes 5 seconds to load — how do you fix it?](#28-your-nextjs-page-takes-5-seconds-to-load--how-do-you-fix-it)
29. [How do you handle errors gracefully in a full-stack app?](#29-how-do-you-handle-errors-gracefully-in-a-full-stack-app)
30. [Explain the difference between SSR, SSG, ISR, and CSR](#30-explain-the-difference-between-ssr-ssg-isr-and-csr)

---

## 1. How to search 1 million records efficiently?

**Why they ask this:** They want to know if you understand database performance, indexing, and when to use external search tools.

**The problem:**
- A simple `SELECT * FROM products WHERE name LIKE '%laptop%'` on 1 million rows is very slow.
- `LIKE '%keyword%'` cannot use an index because the `%` is at the beginning.
- The database must scan every single row (full table scan).

**Step-by-step analysis:**

**Step 1: Add proper indexes.**
- If you search by exact match or prefix (`LIKE 'laptop%'`), a B-Tree index works.
- If you search with `%keyword%`, the index is useless.

```php
// Migration: add index on searchable columns
$table->index('name');
$table->index('sku');
$table->index(['category_id', 'status']); // composite index
```

**Step 2: Use full-text search (built into MySQL/PostgreSQL).**

```php
// Migration: add full-text index
$table->fullText(['name', 'description']);

// Query using full-text search
$products = Product::whereRaw(
    "MATCH(name, description) AGAINST(? IN BOOLEAN MODE)",
    [$keyword]
)->get();
```

- This is much faster than `LIKE '%keyword%'` because the database builds a special inverted index for text.

**Step 3: Use Elasticsearch for large-scale search.**
- When full-text search is not enough (need fuzzy matching, autocomplete, facets).
- Elasticsearch handles millions of records with sub-second response times.

```php
// Index a product into Elasticsearch
$this->client->index([
    'index' => 'products',
    'id' => $product->id,
    'body' => [
        'name' => $product->name,
        'description' => $product->description,
        'price' => $product->price,
    ],
]);

// Search with fuzzy matching (handles typos)
$results = $this->client->search([
    'index' => 'products',
    'body' => [
        'query' => [
            'multi_match' => [
                'query' => $keyword,
                'fields' => ['name^3', 'description'],
                'fuzziness' => 'AUTO',
            ],
        ],
    ],
]);
```

**Step 4: Cache frequent searches.**

```php
$results = Cache::remember("search:{$keyword}:page:{$page}", 300, function () use ($keyword, $page) {
    return Product::search($keyword)->paginate(20, 'page', $page);
});
```

**Key takeaway:**
- Small dataset (< 10K rows) — `LIKE` with index is fine.
- Medium dataset (10K-1M) — Use full-text search (MySQL FULLTEXT or PostgreSQL tsvector).
- Large dataset (1M+) — Use Elasticsearch.
- Always cache frequent search queries.

In short: Never do `LIKE '%keyword%'` on large tables. Use indexes, full-text search, or Elasticsearch depending on the scale.

---

## 2. Your API endpoint is slow — how do you debug it?

**Why they ask this:** They want to see your debugging process and whether you can identify bottlenecks systematically.

**Step-by-step debugging process:**

**Step 1: Measure first — don't guess.**

```php
// Enable query log to see all database queries
DB::enableQueryLog();

$response = $this->getProducts();

$queries = DB::getQueryLog();
// Check: How many queries? How long did each take?
```

**Step 2: Check for N+1 queries.**

```php
// Bad: 101 queries (1 for users + 100 for profiles)
$users = User::all();
foreach ($users as $user) {
    echo $user->profile->bio; // 1 query per user
}

// Good: 2 queries total
$users = User::with('profile')->get();
```

**Step 3: Check for slow queries.**

```sql
-- MySQL: find queries taking more than 1 second
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 5 AND status = 'paid';
```

- If you see `ALL` (full table scan) in EXPLAIN, you need an index.
- If you see `Using filesort` or `Using temporary`, the query needs optimization.

**Step 4: Check if you're loading too much data.**

```php
// Bad: loads all columns and all rows into memory
$products = Product::all();

// Good: select only needed columns, paginate
$products = Product::select('id', 'name', 'price')
    ->where('active', true)
    ->paginate(20);
```

**Step 5: Move heavy work to a queue.**

```php
// Bad: sending email in the request (user waits 3-5 seconds)
Mail::to($user)->send(new OrderConfirmation($order));

// Good: dispatch to queue (user gets instant response)
SendOrderConfirmation::dispatch($order);
```

**Step 6: Add caching for expensive operations.**

```php
$stats = Cache::remember('dashboard:stats', 600, function () {
    return [
        'total_orders' => Order::count(),
        'revenue' => Order::sum('total'),
        'active_users' => User::where('active', true)->count(),
    ];
});
```

**Debugging tools:**
- **Laravel Telescope** — shows all queries, requests, jobs, exceptions.
- **Laravel Debugbar** — shows query count, time, and memory per request.
- **EXPLAIN ANALYZE** — shows how the database executes a query.
- **Clockwork** — Chrome extension for profiling Laravel apps.

In short: Measure → find N+1 queries → check slow queries with EXPLAIN → reduce data loaded → move heavy work to queues → cache expensive results.

---

## 3. How to handle large file uploads (100MB+)?

**Why they ask this:** They want to know if you understand memory limits, timeouts, and scalable file handling.

**The problem:**
- PHP has a default max upload size of 2MB.
- Uploading 100MB+ in a single request can timeout or run out of memory.
- Storing large files on the web server fills up disk space.

**Solution: Chunked upload + cloud storage.**

**Step 1: Increase PHP limits (not enough alone, but necessary).**

```ini
; php.ini
upload_max_filesize = 200M
post_max_size = 200M
max_execution_time = 300
memory_limit = 256M
```

**Step 2: Use chunked uploads from the frontend.**

```javascript
// Frontend: split file into 5MB chunks and upload sequentially
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

async function uploadFile(file) {
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const uploadId = crypto.randomUUID();

    for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        const formData = new FormData();
        formData.append('chunk', chunk);
        formData.append('chunkIndex', i);
        formData.append('totalChunks', totalChunks);
        formData.append('uploadId', uploadId);
        formData.append('fileName', file.name);

        await fetch('/api/upload/chunk', { method: 'POST', body: formData });
    }

    // Tell server all chunks are uploaded
    await fetch('/api/upload/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uploadId, fileName: file.name }),
    });
}
```

**Step 3: Backend receives chunks and merges them.**

```php
public function uploadChunk(Request $request)
{
    $request->validate([
        'chunk' => 'required|file',
        'chunkIndex' => 'required|integer',
        'totalChunks' => 'required|integer',
        'uploadId' => 'required|string',
    ]);

    $path = storage_path("chunks/{$request->uploadId}");
    if (!is_dir($path)) mkdir($path, 0755, true);

    $request->file('chunk')->move($path, $request->chunkIndex);

    return response()->json(['status' => 'chunk_received']);
}

public function completeUpload(Request $request)
{
    $uploadId = $request->uploadId;
    $chunkDir = storage_path("chunks/{$uploadId}");

    // Merge all chunks into one file
    $finalPath = storage_path("uploads/{$request->fileName}");
    $output = fopen($finalPath, 'wb');

    $chunks = collect(scandir($chunkDir))
        ->filter(fn ($f) => is_numeric($f))
        ->sort();

    foreach ($chunks as $chunk) {
        fwrite($output, file_get_contents("{$chunkDir}/{$chunk}"));
    }
    fclose($output);

    // Clean up chunks
    File::deleteDirectory($chunkDir);

    // Upload to S3 via queue (don't block the response)
    UploadToS3Job::dispatch($finalPath, $request->fileName);

    return response()->json(['status' => 'complete']);
}
```

**Step 4: Use presigned URLs (best approach for production).**

```php
// Generate a presigned URL — the client uploads directly to S3
// Your server never touches the file
$url = Storage::disk('s3')->temporaryUploadUrl(
    "uploads/{$fileName}",
    now()->addMinutes(30)
);

return response()->json(['uploadUrl' => $url]);
```

In short: For production, use presigned URLs so files go directly to S3. For simpler setups, use chunked uploads. Never upload large files in a single request to your web server.

---

## 4. Two users update the same record at the same time — what happens?

**Why they ask this:** They want to know if you understand race conditions and data consistency.

**The problem:**
- User A reads a product with `stock = 10`.
- User B reads the same product with `stock = 10`.
- User A sets `stock = 9` (bought 1).
- User B sets `stock = 9` (bought 1).
- Expected stock: `8`. Actual stock: `9`. One item was "lost".

**Solution 1: Optimistic Locking (recommended for most cases).**

The idea: Don't lock the row. Instead, check if the data changed before saving.

```php
// Migration: add a version column
$table->unsignedInteger('version')->default(0);

// Product model
class Product extends Model
{
    protected $casts = ['version' => 'integer'];
}

// Update with version check
public function purchaseProduct(Product $product, int $quantity): void
{
    $updated = Product::where('id', $product->id)
        ->where('version', $product->version) // only update if version matches
        ->update([
            'stock' => DB::raw("stock - {$quantity}"),
            'version' => DB::raw('version + 1'),
        ]);

    if (!$updated) {
        throw new ConflictException('Product was modified by another user. Please try again.');
    }
}
```

**Solution 2: Pessimistic Locking (for critical operations like payments).**

The idea: Lock the row so no one else can read/write it until you're done.

```php
DB::transaction(function () use ($productId, $quantity) {
    // Lock the row — other queries wait until this transaction finishes
    $product = Product::where('id', $productId)->lockForUpdate()->first();

    if ($product->stock < $quantity) {
        throw new InsufficientStockException();
    }

    $product->decrement('stock', $quantity);

    Order::create([
        'product_id' => $product->id,
        'quantity' => $quantity,
    ]);
});
```

**Solution 3: Atomic operations (simplest for counters).**

```php
// This is safe because it's a single SQL statement — no race condition
$product->decrement('stock', $quantity);

// Equivalent SQL: UPDATE products SET stock = stock - 1 WHERE id = 5
// The database handles the lock internally
```

**When to use which:**
- **Atomic operations** — simple counters (stock, views, likes). Simplest and safest.
- **Optimistic locking** — forms where users edit data (profiles, articles). Low conflict.
- **Pessimistic locking** — critical operations (payments, transfers). High conflict.

In short: For counters, use `decrement()` / `increment()`. For forms, use optimistic locking with a version column. For payments, use `lockForUpdate()` inside a transaction.

---

## 5. Your database is running out of memory — what do you do?

**Why they ask this:** They want to see if you can diagnose and scale database issues.

**Step-by-step approach:**

**Step 1: Find the problem.**

```sql
-- Check which queries are running right now
SHOW PROCESSLIST;

-- Check which queries are slow
SHOW VARIABLES LIKE 'slow_query_log';
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1; -- log queries over 1 second
```

**Step 2: Optimize queries.**

```php
// Bad: loads ALL users into PHP memory
$users = User::all(); // 1 million User objects in memory

// Good: process in chunks (only 500 in memory at a time)
User::chunk(500, function ($users) {
    foreach ($users as $user) {
        // process
    }
});

// Better: use lazy() for even lower memory
User::lazy()->each(function ($user) {
    // process one at a time
});

// Best for read-only: use cursor (single database query, one row at a time in PHP)
foreach (User::cursor() as $user) {
    // process
}
```

**Step 3: Add missing indexes.**

```php
// Find queries without indexes
// Run EXPLAIN on your slowest queries
// Look for "ALL" in the type column — that means full table scan

$table->index('status');
$table->index(['user_id', 'created_at']);
```

**Step 4: Reduce data loaded.**

```php
// Bad: select all columns
Product::all();

// Good: select only what you need
Product::select('id', 'name', 'price')->get();

// For aggregations, don't load models at all
$count = Order::where('status', 'paid')->count();
$revenue = Order::where('status', 'paid')->sum('total');
```

**Step 5: Use read replicas for heavy reads.**

```php
// config/database.php — separate read and write connections
'mysql' => [
    'read' => [
        'host' => ['mysql-read-replica.example.com'],
    ],
    'write' => [
        'host' => ['mysql-primary.example.com'],
    ],
],

// Laravel automatically uses read for SELECT, write for INSERT/UPDATE/DELETE
```

**Step 6: Archive old data.**

```php
// Move old orders to an archive table
DB::table('orders_archive')->insertUsing(
    ['id', 'user_id', 'total', 'created_at'],
    Order::where('created_at', '<', now()->subYears(2))->toBase()
);

Order::where('created_at', '<', now()->subYears(2))->delete();
```

In short: Chunk/cursor for large datasets, add indexes, select only needed columns, use read replicas for heavy reads, and archive old data.

---

## 6. How to prevent your API from being abused?

**Why they ask this:** They want to know if you think about security and protecting your system from abuse.

**Solution 1: Rate limiting.**

```php
// routes/api.php — limit to 60 requests per minute per user
Route::middleware('throttle:60,1')->group(function () {
    Route::get('/products', [ProductController::class, 'index']);
});

// Custom rate limit in RouteServiceProvider
RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
});

// Different limits for different endpoints
RateLimiter::for('search', function (Request $request) {
    return Limit::perMinute(30)->by($request->ip());
});

RateLimiter::for('login', function (Request $request) {
    return Limit::perMinute(5)->by($request->ip()); // strict for login
});
```

**Solution 2: Authentication and authorization.**

```php
// Always require authentication for sensitive endpoints
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/orders', [OrderController::class, 'store']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
});
```

**Solution 3: Input validation (prevent injection attacks).**

```php
public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'quantity' => 'required|integer|min:1|max:100',
    ]);

    // Use validated data only — never use raw $request->input()
    Product::create($validated);
}
```

**Solution 4: IP blocking for repeat offenders.**

```php
// Using Redis to track and block abusive IPs
$key = "abuse:{$request->ip()}";
$count = Redis::incr($key);

if ($count === 1) {
    Redis::expire($key, 3600); // track for 1 hour
}

if ($count > 1000) { // more than 1000 requests per hour
    abort(403, 'Your IP has been temporarily blocked.');
}
```

**Solution 5: CORS configuration.**

```php
// config/cors.php — only allow requests from your frontend
'allowed_origins' => ['https://yourdomain.com'],
'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE'],
'allowed_headers' => ['Content-Type', 'Authorization'],
```

In short: Rate limit all endpoints, authenticate users, validate all input, block abusive IPs, and configure CORS properly.

---

## 7. A background job fails halfway — how to handle it?

**Why they ask this:** They want to know if you understand job reliability and data consistency.

**The problem:**
- A job processes an order: charge the customer, reduce stock, send email.
- The payment succeeds, but the stock update fails.
- Now the customer was charged, but the order is incomplete.

**Solution 1: Use database transactions for related operations.**

```php
class ProcessOrderJob implements ShouldQueue
{
    public int $tries = 3;
    public int $backoff = 60; // wait 60 seconds before retry

    public function handle(): void
    {
        DB::transaction(function () {
            // These succeed together or fail together
            $this->order->update(['status' => 'processing']);
            $this->order->product->decrement('stock', $this->order->quantity);
        });

        // External calls (email, payment) should be outside the transaction
        // because you can't roll back an email
        Mail::to($this->order->user)->send(new OrderConfirmation($this->order));
    }

    public function failed(\Throwable $exception): void
    {
        // Log the failure for investigation
        Log::error("Order {$this->order->id} failed: {$exception->getMessage()}");

        // Notify admin
        Notification::route('mail', 'admin@example.com')
            ->notify(new JobFailedNotification($this->order, $exception));
    }
}
```

**Solution 2: Make jobs idempotent (safe to retry).**

```php
class ChargeCustomerJob implements ShouldQueue
{
    public int $tries = 3;

    public function handle(): void
    {
        // Check if already processed — safe to retry
        if ($this->order->payment_status === 'paid') {
            return; // already done, skip
        }

        $charge = Stripe::charges()->create([
            'amount' => $this->order->total * 100,
            'currency' => 'usd',
            'customer' => $this->order->user->stripe_id,
            'idempotency_key' => "order-{$this->order->id}", // Stripe won't charge twice
        ]);

        $this->order->update([
            'payment_status' => 'paid',
            'transaction_id' => $charge->id,
        ]);
    }
}
```

**Solution 3: Use job chaining for sequential steps.**

```php
// Each job runs only if the previous one succeeded
Bus::chain([
    new ValidateOrderJob($order),
    new ChargeCustomerJob($order),
    new ReduceStockJob($order),
    new SendConfirmationEmailJob($order),
])->catch(function (\Throwable $e) use ($order) {
    $order->update(['status' => 'failed']);
    Log::error("Order chain failed: {$e->getMessage()}");
})->dispatch();
```

In short: Use transactions for database operations, make jobs idempotent (safe to retry), use job chaining for sequential steps, and always log failures.

---

## 8. How to handle pagination for millions of records?

**Why they ask this:** They want to know if you understand why simple pagination breaks at scale.

**The problem with OFFSET:**

```sql
-- Page 1: fast (skip 0 rows)
SELECT * FROM products ORDER BY id LIMIT 20 OFFSET 0;

-- Page 1000: SLOW (database must read and skip 20,000 rows first!)
SELECT * FROM products ORDER BY id LIMIT 20 OFFSET 20000;

-- Page 50000: VERY SLOW (skip 1,000,000 rows)
SELECT * FROM products ORDER BY id LIMIT 20 OFFSET 1000000;
```

- OFFSET tells the database to read rows and throw them away.
- The higher the OFFSET, the slower the query.
- At 1 million offset, the database reads 1 million rows just to skip them.

**Solution: Cursor-based pagination (keyset pagination).**

```php
// Instead of OFFSET, use the last item's ID as a cursor

// First page
$products = Product::orderBy('id')
    ->limit(20)
    ->get();

$lastId = $products->last()->id; // e.g., 20

// Next page: start after the last ID (fast — uses the primary key index)
$products = Product::where('id', '>', $lastId)
    ->orderBy('id')
    ->limit(20)
    ->get();

// This is always fast because `WHERE id > 20` uses the index directly
// No matter if you're on "page 1" or "page 50,000"
```

**Laravel implementation:**

```php
// Controller
public function index(Request $request)
{
    $query = Product::where('active', true)->orderBy('id');

    if ($request->has('cursor')) {
        $query->where('id', '>', $request->cursor);
    }

    $products = $query->limit(20)->get();

    return response()->json([
        'data' => $products,
        'next_cursor' => $products->last()?->id,
        'has_more' => $products->count() === 20,
    ]);
}

// Or use Laravel's built-in cursor pagination
public function index()
{
    return Product::orderBy('id')->cursorPaginate(20);
}
```

**When to use which:**
- **Offset pagination (`paginate()`)** — Small datasets (< 100K rows), admin panels where you need "go to page 50".
- **Cursor pagination (`cursorPaginate()`)** — Large datasets, infinite scroll, APIs. Always fast.

**Trade-off:**
- Cursor pagination is fast but you can't "jump to page 50" — you can only go forward/backward.
- For most user-facing apps (feeds, search results, product listings), cursor pagination is better.

In short: Use `cursorPaginate()` for large datasets. OFFSET gets slower as page number increases. Cursor pagination is always fast because it uses the index.

---

## 9. Your cache and database are out of sync — how to fix it?

**Why they ask this:** Cache invalidation is one of the hardest problems in computer science. They want to see if you have practical strategies.

**The problem:**
- You cache a product's price as $50.
- Someone updates the price to $60 in the database.
- Users still see $50 from the cache.

**Strategy 1: TTL (Time to Live) — simplest approach.**

```php
// Cache for 5 minutes — after that, fresh data is fetched
Cache::put("product:{$id}", $product, now()->addMinutes(5));

// Users see stale data for at most 5 minutes
// Good enough for most cases (product listings, blog posts)
```

**Strategy 2: Manual invalidation — clear cache when data changes.**

```php
public function update(Request $request, Product $product)
{
    $product->update($request->validated());

    // Clear the cache immediately
    Cache::forget("product:{$product->id}");
    Cache::forget('products:featured');

    return response()->json($product);
}
```

**Strategy 3: Event-driven invalidation — automatic and clean.**

```php
class ProductObserver
{
    public function updated(Product $product): void
    {
        Cache::forget("product:{$product->id}");
        Cache::tags(['products'])->flush();
    }

    public function created(Product $product): void
    {
        Cache::tags(['products'])->flush();
    }

    public function deleted(Product $product): void
    {
        Cache::forget("product:{$product->id}");
        Cache::tags(['products'])->flush();
    }
}

// Register in AppServiceProvider
Product::observe(ProductObserver::class);
```

**Strategy 4: Cache-aside with `remember()` — best balance.**

```php
// If cache exists, return it. If not, fetch from DB and cache it.
$product = Cache::remember("product:{$id}", 600, function () use ($id) {
    return Product::findOrFail($id);
});

// When data changes, just forget the key
// Next request will automatically re-fetch from DB and re-cache
Cache::forget("product:{$id}");
```

**Common mistakes:**
- Caching without TTL — data stays stale forever.
- Forgetting to clear cache on update/delete.
- Caching too aggressively — cache only expensive queries, not everything.
- Not using cache tags — makes it hard to clear related caches.

In short: Use TTL as a safety net, clear cache manually on updates, use observers for automatic invalidation, and use `Cache::remember()` for the best balance.

---

## 10. How to design a search with filters, sorting, and full-text?

**Why they ask this:** Search is a common feature that gets complex quickly. They want to see if you can build it efficiently.

**The problem:**
- Users want to search products by name, filter by category and price, sort by relevance or price.
- Each filter combination needs to be fast.
- Adding a new filter shouldn't require rewriting the query.

**Solution: Query builder pattern.**

```php
class ProductSearchService
{
    public function search(array $filters): LengthAwarePaginator
    {
        $query = Product::query()->where('active', true);

        // Full-text search
        if (!empty($filters['keyword'])) {
            $query->whereRaw(
                "MATCH(name, description) AGAINST(? IN BOOLEAN MODE)",
                [$filters['keyword']]
            );
        }

        // Category filter
        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        // Price range filter
        if (!empty($filters['min_price'])) {
            $query->where('price', '>=', $filters['min_price']);
        }
        if (!empty($filters['max_price'])) {
            $query->where('price', '<=', $filters['max_price']);
        }

        // In stock filter
        if (isset($filters['in_stock']) && $filters['in_stock']) {
            $query->where('stock', '>', 0);
        }

        // Sorting
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortDir = $filters['sort_dir'] ?? 'desc';
        $query->orderBy($sortBy, $sortDir);

        return $query->paginate($filters['per_page'] ?? 20);
    }
}
```

**Indexes to support this:**

```php
// Migration: add indexes for filter and sort columns
$table->fullText(['name', 'description']); // for text search
$table->index('category_id');              // for category filter
$table->index('price');                    // for price filter
$table->index('stock');                    // for in-stock filter
$table->index('created_at');              // for default sort
$table->index(['category_id', 'price']);   // composite for combined filter
```

**Controller:**

```php
public function index(Request $request, ProductSearchService $search)
{
    $filters = $request->validate([
        'keyword' => 'nullable|string|max:200',
        'category_id' => 'nullable|integer|exists:categories,id',
        'min_price' => 'nullable|numeric|min:0',
        'max_price' => 'nullable|numeric|min:0',
        'in_stock' => 'nullable|boolean',
        'sort_by' => 'nullable|in:price,created_at,name',
        'sort_dir' => 'nullable|in:asc,desc',
        'per_page' => 'nullable|integer|min:10|max:100',
    ]);

    return response()->json($search->search($filters));
}
```

In short: Build a flexible query builder that applies filters conditionally, add indexes for each filterable/sortable column, and validate all input.

---

## 11. A query that worked fine is now slow — what happened?

**Why they ask this:** They want to see if you can investigate and diagnose production performance issues.

**Common causes and solutions:**

**Cause 1: Table grew — full table scan is now slow.**

```sql
-- This was fine with 1,000 rows, but not with 1,000,000
SELECT * FROM orders WHERE status = 'pending';

-- Fix: add an index
CREATE INDEX idx_orders_status ON orders (status);
```

**Cause 2: Missing index after a schema change.**

```php
// You added a new column and started filtering by it
// But forgot to add an index
$table->string('payment_method'); // no index!

// Users filter by it
Order::where('payment_method', 'stripe')->get(); // full table scan

// Fix
$table->index('payment_method');
```

**Cause 3: N+1 query in a loop.**

```php
// Someone added a new feature that accesses a relationship in a loop
// This was fine with 10 orders, but now there are 10,000
$orders = Order::all();
foreach ($orders as $order) {
    echo $order->user->name; // N+1!
}

// Fix
$orders = Order::with('user')->get();
```

**Cause 4: Query plan changed.**

```sql
-- The database optimizer chose a different execution plan
-- because the data distribution changed

-- Check the current plan
EXPLAIN ANALYZE SELECT * FROM products WHERE category_id = 5 AND price > 100;

-- The optimizer might skip an index if it thinks a full scan is faster
-- This happens when a filter matches too many rows (> 30% of the table)

-- Fix: force the index or restructure the query
SELECT * FROM products FORCE INDEX (idx_category_price) WHERE category_id = 5 AND price > 100;
```

**Cause 5: Lock contention.**

```sql
-- Many concurrent writes are blocking each other
SHOW ENGINE INNODB STATUS;

-- Look for "LATEST DETECTED DEADLOCK" or "lock wait timeout"
```

**Investigation process:**
1. Run `EXPLAIN ANALYZE` on the slow query.
2. Check if indexes exist for the WHERE/ORDER BY columns.
3. Check if the table grew significantly.
4. Check for N+1 in Laravel Telescope or Debugbar.
5. Check for lock contention with `SHOW PROCESSLIST`.

In short: Usually it's a missing index, table growth, or N+1 query. Always start with `EXPLAIN ANALYZE` to see what the database is actually doing.

---

## 12. How to deploy without downtime?

**Why they ask this:** They want to know if you understand production deployment concerns.

**The problem:**
- During deployment, the app is temporarily unavailable.
- Users see errors or loading screens.
- Database migrations can lock tables and break running queries.

**Solution 1: Zero-downtime deployment steps.**

```bash
# 1. Pull new code (app still running old code)
git pull origin main

# 2. Install dependencies
composer install --no-dev --optimize-autoloader

# 3. Run migrations (must be backward-compatible!)
php artisan migrate --force

# 4. Cache config and routes
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 5. Restart workers (gracefully finish current jobs first)
php artisan queue:restart

# 6. Reload PHP-FPM (not restart — reload keeps existing connections)
sudo systemctl reload php8.2-fpm
```

**Solution 2: Backward-compatible migrations.**

```php
// Bad: rename column (breaks old code that's still running)
$table->renameColumn('name', 'full_name');

// Good: add new column, then migrate data, then remove old column in next deploy
// Deploy 1: add new column
$table->string('full_name')->nullable();

// Deploy 2: copy data (run as a job)
DB::statement("UPDATE users SET full_name = name WHERE full_name IS NULL");

// Deploy 3: remove old column (after all code uses full_name)
$table->dropColumn('name');
```

**Solution 3: Laravel maintenance mode (if downtime is acceptable).**

```bash
# Put app in maintenance mode (shows 503 page)
php artisan down --secret="my-secret-token"

# You can still access the app with the secret token
# https://yourdomain.com/my-secret-token

# Deploy...

# Bring app back up
php artisan up
```

In short: Pull code, install dependencies, run backward-compatible migrations, cache config, and reload PHP-FPM. Never rename/drop columns in a single deploy.

---

## 13. How to handle N+1 query in a real project?

**Why they ask this:** N+1 is one of the most common performance issues in Laravel. They want to see if you can detect and fix it.

**What is N+1?**
- You load N records, then for each record, you run 1 extra query to load a relationship.
- 100 users + their profiles = 1 + 100 = 101 queries.

**Detection:**

```php
// Method 1: Laravel Debugbar — shows query count per request
// If you see 100+ queries on a page, it's likely N+1

// Method 2: Prevent lazy loading entirely (throws exception)
// Add to AppServiceProvider
Model::preventLazyLoading(!app()->isProduction());

// Now any lazy-loaded relationship throws an error in development
// This forces you to use eager loading everywhere
```

**Fix: Eager loading with `with()`.**

```php
// Bad: N+1 (101 queries for 100 users)
$users = User::all();
foreach ($users as $user) {
    echo $user->posts->count(); // lazy loads posts for each user
}

// Good: eager loading (2 queries total)
$users = User::with('posts')->get();

// Good: nested eager loading
$users = User::with(['posts.comments', 'profile'])->get();

// Good: eager load with constraints
$users = User::with(['posts' => function ($query) {
    $query->where('published', true)->orderBy('created_at', 'desc');
}])->get();
```

**Fix: `withCount()` when you only need the count.**

```php
// Bad: loads all posts just to count them
$users = User::with('posts')->get();
foreach ($users as $user) {
    echo $user->posts->count(); // loaded 1000 posts just for a number
}

// Good: adds a posts_count column without loading posts
$users = User::withCount('posts')->get();
foreach ($users as $user) {
    echo $user->posts_count; // just a number, no extra query
}
```

**Fix: `load()` for already-loaded models.**

```php
// If you already have a collection and need to add a relationship
$users = User::all();

// Later in the code, you realize you need posts
$users->load('posts'); // single query, not N+1
```

In short: Use `with()` for eager loading, `withCount()` when you only need counts, enable `preventLazyLoading()` in development to catch N+1 early.

---

## 14. Your app needs to send 10,000 emails — how?

**Why they ask this:** They want to know if you understand queues, batching, and rate limiting for bulk operations.

**The problem:**
- Sending 10,000 emails synchronously would take hours and timeout.
- Email providers have rate limits (e.g., 100 emails/second).
- Some emails will fail (invalid address, bounced).

**Solution: Queues + batching + rate limiting.**

**Step 1: Create a mailable and a job.**

```php
class SendPromotionEmail implements ShouldQueue
{
    public int $tries = 3;
    public int $backoff = 60;

    public function __construct(
        public User $user,
        public string $subject,
        public string $content
    ) {}

    public function handle(): void
    {
        Mail::to($this->user->email)->send(
            new PromotionMail($this->subject, $this->content)
        );
    }

    public function failed(\Throwable $exception): void
    {
        Log::error("Email failed for user {$this->user->id}: {$exception->getMessage()}");
    }
}
```

**Step 2: Dispatch in batches.**

```php
public function sendBulkPromotion(string $subject, string $content)
{
    $jobs = User::where('subscribed', true)
        ->chunk(100, function ($users) use ($subject, $content, &$jobs) {
            foreach ($users as $user) {
                $jobs[] = new SendPromotionEmail($user, $subject, $content);
            }
        });

    // Use Laravel batch for tracking progress
    $batch = Bus::batch($jobs)
        ->name('Promotion Email Campaign')
        ->allowFailures() // don't stop if some emails fail
        ->onQueue('emails')
        ->dispatch();

    return $batch->id; // track progress with this ID
}
```

**Step 3: Rate limit the queue worker.**

```php
// In the job
public function middleware(): array
{
    // Process max 50 emails per second
    return [new RateLimited('emails')];
}

// In AppServiceProvider
RateLimiter::for('emails', function ($job) {
    return Limit::perSecond(50);
});
```

**Step 4: Monitor batch progress.**

```php
$batch = Bus::findBatch($batchId);

return [
    'total' => $batch->totalJobs,
    'processed' => $batch->processedJobs(),
    'failed' => $batch->failedJobs,
    'progress' => $batch->progress(), // percentage
    'finished' => $batch->finished(),
];
```

**Step 5: Run dedicated queue workers for emails.**

```bash
# Run a worker dedicated to the emails queue
php artisan queue:work redis --queue=emails --max-jobs=1000 --memory=128

# Run multiple workers for parallel processing
# (use Supervisor in production)
```

In short: Dispatch each email as a queued job, use Laravel batches for tracking, rate limit to respect provider limits, and run dedicated workers.

---

## 15. How to store and query hierarchical data (categories)?

**Why they ask this:** Categories, comments, org charts — hierarchical data is common and tricky to query.

**The problem:**
- Categories can be nested: Electronics > Phones > Smartphones > Android.
- You need to get all children, all parents, or the full tree.
- Simple parent_id queries require recursive calls.

**Approach 1: Adjacency List (simplest, most common).**

```php
// Migration
Schema::create('categories', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->foreignId('parent_id')->nullable()->constrained('categories');
    $table->timestamps();
});

// Model
class Category extends Model
{
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    // Recursive children (all descendants)
    public function allChildren(): HasMany
    {
        return $this->children()->with('allChildren');
    }
}

// Usage
$tree = Category::whereNull('parent_id')->with('allChildren')->get();
```

- **Pros:** Simple, easy to understand, easy to move categories.
- **Cons:** Getting all descendants requires recursive queries (slow for deep trees).

**Approach 2: Materialized Path (good for breadcrumbs).**

```php
// Migration
$table->string('path'); // stores the full path: "1/5/12/45"

// Query all descendants of category 5
Category::where('path', 'like', '%/5/%')->get();

// Query all ancestors (breadcrumb)
$pathIds = explode('/', $category->path);
$ancestors = Category::whereIn('id', $pathIds)->orderByRaw("FIELD(id, " . implode(',', $pathIds) . ")")->get();
```

- **Pros:** Fast reads, easy breadcrumbs, single query for descendants.
- **Cons:** Moving a category requires updating all descendants' paths.

**Approach 3: Recursive CTE (modern SQL, best for PostgreSQL).**

```php
// Get all descendants of category 5 in a single query
$descendants = DB::select("
    WITH RECURSIVE category_tree AS (
        SELECT id, name, parent_id, 0 AS depth
        FROM categories
        WHERE id = ?

        UNION ALL

        SELECT c.id, c.name, c.parent_id, ct.depth + 1
        FROM categories c
        INNER JOIN category_tree ct ON c.parent_id = ct.id
    )
    SELECT * FROM category_tree ORDER BY depth
", [5]);
```

- **Pros:** Single query, works with adjacency list (no extra columns), supports any depth.
- **Cons:** MySQL 8.0+ or PostgreSQL required. More complex SQL.

**Approach 4: Use a Laravel package (recommended for production).**

```bash
composer require staudenmeir/laravel-adjacency-list
```

```php
use Staudenmeir\LaravelAdjacencyList\Eloquent\HasRecursiveRelationships;

class Category extends Model
{
    use HasRecursiveRelationships;
}

// All descendants
$category->descendants;

// All ancestors
$category->ancestors;

// Full tree from root
$tree = Category::tree()->get()->toTree();

// Depth
$category->depth;
```

**When to use which:**
- **Adjacency List** — Simple apps, shallow trees (2-3 levels), easy to move nodes.
- **Materialized Path** — Read-heavy, breadcrumbs, fast descendant queries.
- **Recursive CTE** — When you need flexibility with adjacency list and your DB supports it.
- **Laravel package** — Production apps where you need all operations (ancestors, descendants, tree, depth).

In short: Start with adjacency list (parent_id). If you need fast tree queries, use `staudenmeir/laravel-adjacency-list` package. Use recursive CTE for complex one-off queries.

---

## React & Frontend Tricky Questions

---

## 16. Your React app is slow — where do you look first?

**Why they ask this:** They want to see if you have a systematic debugging process, not just random guessing.

**Step-by-step approach:**

**Step 1: Open React DevTools Profiler.**
- Go to React DevTools → Profiler tab → click "Record" → interact with the app → stop.
- Look for components that re-render too often or take too long.

**Step 2: Check for unnecessary re-renders.**

```tsx
// Bad: parent re-renders → all children re-render even if their props didn't change
function ProductList() {
    const [search, setSearch] = useState('');
    const [products] = useState(initialProducts);

    return (
        <div>
            <input value={search} onChange={(e) => setSearch(e.target.value)} />
            {products.map(p => (
                <ProductCard key={p.id} product={p} /> // re-renders on every keystroke!
            ))}
        </div>
    );
}

// Fix: wrap child component in React.memo
const ProductCard = React.memo(function ProductCard({ product }: { product: Product }) {
    return <div>{product.name} — ${product.price}</div>;
});
// Now ProductCard only re-renders if its "product" prop actually changes
```

**Step 3: Check for expensive calculations on every render.**

```tsx
// Bad: filters 10,000 products on every render
function ProductList({ products, search }: Props) {
    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    ); // runs every render, even if products/search didn't change

    return <ul>{filtered.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}

// Fix: use useMemo to cache the result
function ProductList({ products, search }: Props) {
    const filtered = useMemo(() =>
        products.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase())
        ),
        [products, search] // only recalculate when these change
    );

    return <ul>{filtered.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}
```

**Step 4: Check for large lists — use virtualization.**

```tsx
// Bad: rendering 10,000 items at once
{products.map(p => <ProductCard key={p.id} product={p} />)}

// Fix: use react-window to only render visible items
import { FixedSizeList } from 'react-window';

<FixedSizeList height={600} width="100%" itemCount={products.length} itemSize={80}>
    {({ index, style }) => (
        <div style={style}>
            <ProductCard product={products[index]} />
        </div>
    )}
</FixedSizeList>
// Only renders ~10-15 items instead of 10,000
```

**Step 5: Check bundle size.**

```bash
# See what's making your bundle large
npx next build --analyze
# or
npx source-map-explorer build/static/js/*.js
```

- Lazy load heavy components: `const Chart = lazy(() => import('./Chart'))`
- Remove unused libraries.
- Use tree-shaking friendly imports: `import { debounce } from 'lodash-es'` instead of `import _ from 'lodash'`.

**Step 6: Check network — too many API calls?**
- Use React DevTools Network tab.
- Look for duplicate requests or requests on every keystroke.
- Fix with debouncing, caching (React Query), or moving data fetching to a parent component.

In short: Profiler → fix re-renders with `React.memo` → cache with `useMemo` → virtualize long lists → reduce bundle size → optimize API calls.

---

## 17. How to build auto-save without overloading the server?

**Why they ask this:** They want to see if you understand debouncing, optimistic updates, and network efficiency.

**The problem:**
- User types in a document (like Google Docs).
- You want to save automatically as they type.
- But sending a request on every keystroke = 100+ requests per minute = server overload.

**Solution: Debounce + status indicator.**

```tsx
import { useState, useEffect, useCallback, useRef } from 'react';

type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

function useAutoSave(docId: string, content: string, delay = 1000) {
    const [status, setStatus] = useState<SaveStatus>('saved');
    const timeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        // Don't save on first mount
        if (content === '') return;

        setStatus('unsaved');

        // Clear previous timer
        clearTimeout(timeoutRef.current);

        // Set new timer — only saves after user stops typing for 1 second
        timeoutRef.current = setTimeout(async () => {
            setStatus('saving');
            try {
                await fetch(`/api/docs/${docId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content }),
                });
                setStatus('saved');
            } catch {
                setStatus('error');
            }
        }, delay);

        return () => clearTimeout(timeoutRef.current);
    }, [content, docId, delay]);

    return status;
}

// Usage
function Editor() {
    const [content, setContent] = useState('');
    const status = useAutoSave('doc-123', content);

    return (
        <div>
            <span>{status === 'saved' ? 'Saved' : status === 'saving' ? 'Saving...' : 'Unsaved'}</span>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} />
        </div>
    );
}
```

**Key techniques used:**
- **Debouncing** — waits until the user stops typing for 1 second before saving. Turns 100 keystrokes into 1 API call.
- **Status indicator** — shows the user if their work is saved, saving, or unsaved.
- **Cleanup** — clears the timer if the user keeps typing before the delay is over.

**Advanced: Save on page leave too.**

```tsx
useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if (status === 'unsaved') {
            e.preventDefault(); // shows "Are you sure you want to leave?" dialog
        }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
}, [status]);
```

In short: Debounce saves (wait until user stops typing), show save status to the user, and warn before leaving with unsaved changes.

---

## 18. If you could redesign useEffect, what would you change?

**Why they ask this:** They want to see if you deeply understand React's lifecycle and the pain points of `useEffect`. This tests your ability to think critically about tools you use daily.

**Common problems with useEffect:**

**Problem 1: It does too many things.**
- `useEffect` handles data fetching, subscriptions, DOM manipulation, and cleanup — all in one hook.
- It's hard to read and easy to introduce bugs.

```tsx
// Confusing: is this fetching data? subscribing? setting up a timer?
useEffect(() => {
    fetchUser(id).then(setUser);
    const ws = new WebSocket('/ws');
    ws.onmessage = (e) => setMessages(prev => [...prev, e.data]);
    return () => ws.close();
}, [id]);
```

**Problem 2: Missing or wrong dependencies.**
- Forgetting a dependency causes stale data.
- Adding too many dependencies causes infinite loops.

```tsx
// Bug: count is always 0 because it's captured in the closure
useEffect(() => {
    const interval = setInterval(() => {
        setCount(count + 1); // stale! always 0
    }, 1000);
    return () => clearInterval(interval);
}, []); // count is missing from dependencies

// Fix: use functional update
useEffect(() => {
    const interval = setInterval(() => {
        setCount(prev => prev + 1); // always fresh
    }, 1000);
    return () => clearInterval(interval);
}, []);
```

**Problem 3: Race conditions with data fetching.**

```tsx
// Bug: if user types fast, old responses can arrive after new ones
useEffect(() => {
    fetch(`/api/search?q=${query}`).then(r => r.json()).then(setResults);
}, [query]);

// Fix: use AbortController to cancel old requests
useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/search?q=${query}`, { signal: controller.signal })
        .then(r => r.json())
        .then(setResults)
        .catch(() => {}); // ignore aborted requests
    return () => controller.abort();
}, [query]);
```

**What would I change (good answer for the interview):**

- **Separate hooks for separate concerns:**
  - `useQuery()` for data fetching (React Query already does this).
  - `useSubscription()` for WebSocket/events.
  - `useInterval()` / `useTimeout()` for timers.
  - Keep `useEffect` only for DOM-related side effects.

- **Better dependency tracking** — auto-detect dependencies from the code instead of a manual array.

- **Built-in race condition handling** — automatic cancellation of stale requests when dependencies change.

> **In short:** `useEffect` tries to do everything (fetching, subscriptions, timers, DOM effects) — I would split it into specialized hooks for each use case. In practice, libraries like React Query and custom hooks already solve most of these problems.

---

## 19. Your API is failing silently in production — how do you debug?

**Why they ask this:** They want to see if you can handle production issues when you can't `console.log`.

**Step-by-step approach:**

**Step 1: Add global error handling.**

```tsx
// Wrap your API calls with error tracking
async function apiFetch(url: string, options?: RequestInit) {
    try {
        const res = await fetch(url, options);

        if (!res.ok) {
            const error = await res.text();
            // Send to error tracking service
            reportError({
                url,
                status: res.status,
                error,
                timestamp: new Date().toISOString(),
            });
            throw new Error(`API Error: ${res.status} - ${error}`);
        }

        return res.json();
    } catch (err) {
        reportError({ url, error: (err as Error).message });
        throw err;
    }
}
```

**Step 2: Use React Error Boundaries.**

```tsx
class ErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error?: Error }
> {
    state = { hasError: false, error: undefined };

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        // Send to Sentry, LogRocket, or your logging service
        reportError({ error: error.message, stack: info.componentStack });
    }

    render() {
        if (this.state.hasError) {
            return <div>Something went wrong. Please try again.</div>;
        }
        return this.props.children;
    }
}
```

**Step 3: Use error tracking tools.**
- **Sentry** — captures errors with full stack traces and context.
- **LogRocket** — records user sessions so you can replay what happened.
- **Browser DevTools** → Network tab → filter by errors (4xx, 5xx).

**Step 4: Add health checks.**

```tsx
// Ping the API on app startup to detect issues early
useEffect(() => {
    fetch('/api/health').then(res => {
        if (!res.ok) {
            showBanner('Some features may be unavailable right now.');
        }
    }).catch(() => {
        showBanner('Cannot connect to server. Please check your connection.');
    });
}, []);
```

**Step 5: Check the backend logs.**
- Laravel Telescope or `storage/logs/laravel.log`.
- Check if requests are reaching the server at all (maybe CORS, DNS, or network issue).
- Check if the database is down or slow.

In short: Add global error handling → use Error Boundaries → integrate Sentry/LogRocket → add health checks → always check backend logs. Never let errors fail silently.

---

## 20. Build a search bar that works offline and syncs when back online

**Why they ask this:** They want to see if you understand offline-first architecture, caching, and sync strategies.

**The approach:**
1. Cache search results locally (IndexedDB or localStorage).
2. When offline, search from the local cache.
3. When back online, sync fresh data from the server.

```tsx
import { useState, useEffect } from 'react';

interface Product {
    id: number;
    name: string;
    price: number;
}

// Save data to localStorage (simple approach)
function saveToCache(key: string, data: unknown) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromCache<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

function useOfflineSearch() {
    const [products, setProducts] = useState<Product[]>([]);
    const [query, setQuery] = useState('');
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    // Track online/offline status
    useEffect(() => {
        const goOnline = () => setIsOnline(true);
        const goOffline = () => setIsOnline(false);
        window.addEventListener('online', goOnline);
        window.addEventListener('offline', goOffline);
        return () => {
            window.removeEventListener('online', goOnline);
            window.removeEventListener('offline', goOffline);
        };
    }, []);

    // Fetch products from server or cache
    useEffect(() => {
        if (isOnline) {
            // Online: fetch from server and update cache
            fetch('/api/products')
                .then(r => r.json())
                .then((data: Product[]) => {
                    setProducts(data);
                    saveToCache('products', data); // save for offline use
                })
                .catch(() => {
                    // Server error: fall back to cache
                    const cached = getFromCache<Product[]>('products');
                    if (cached) setProducts(cached);
                });
        } else {
            // Offline: use cached data
            const cached = getFromCache<Product[]>('products');
            if (cached) setProducts(cached);
        }
    }, [isOnline]);

    // Filter locally — works both online and offline
    const results = products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase())
    );

    return { query, setQuery, results, isOnline };
}

// Usage
function SearchBar() {
    const { query, setQuery, results, isOnline } = useOfflineSearch();

    return (
        <div>
            {!isOnline && <span>You are offline — showing cached results</span>}
            <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
            />
            <ul>
                {results.map(p => (
                    <li key={p.id}>{p.name} — ${p.price}</li>
                ))}
            </ul>
        </div>
    );
}
```

**Key concepts:**
- **Cache-first strategy** — always try cache, sync with server when online.
- **`navigator.onLine`** + event listeners to detect connection changes.
- **localStorage** for simple data. Use **IndexedDB** for larger datasets (10MB+).
- For full offline support, consider a **Service Worker** to cache API responses and static files.

In short: Cache data locally, search from cache when offline, sync when back online. Use `navigator.onLine` to detect connection status.

---

## 21. React Server Components vs Client Components — your strategy?

**Why they ask this:** This is a key React/Next.js concept in 2025+. They want to see if you understand the trade-offs.

**Server Components (default in Next.js App Router):**
- Render on the server — HTML is sent to the browser.
- Can directly access database, file system, APIs.
- Zero JavaScript sent to the browser — smaller bundle.
- Cannot use `useState`, `useEffect`, or event handlers.

**Client Components (`'use client'`):**
- Render on the browser — JavaScript runs in the browser.
- Can use hooks (`useState`, `useEffect`, etc.).
- Can handle user interactions (clicks, forms, animations).
- Add to the JavaScript bundle.

**Strategy — use Server Components by default, Client Components only when needed:**

```tsx
// Server Component (default) — no 'use client'
// Good for: static content, data fetching, layouts
async function ProductPage({ params }: { params: { id: string } }) {
    const product = await db.product.findUnique({ where: { id: params.id } });

    return (
        <div>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p>${product.price}</p>

            {/* Only the interactive part is a Client Component */}
            <AddToCartButton productId={product.id} />
        </div>
    );
}
```

```tsx
// Client Component — only for interactive parts
'use client';

function AddToCartButton({ productId }: { productId: string }) {
    const [added, setAdded] = useState(false);

    const handleAdd = async () => {
        await fetch('/api/cart', {
            method: 'POST',
            body: JSON.stringify({ productId }),
        });
        setAdded(true);
    };

    return (
        <button onClick={handleAdd}>
            {added ? 'Added!' : 'Add to Cart'}
        </button>
    );
}
```

**Decision rules:**
- **Use Server Component when:** Displaying data, layouts, pages, text content, images, fetching from database/API.
- **Use Client Component when:** User interaction (clicks, forms), browser APIs (`localStorage`, `window`), hooks (`useState`, `useEffect`), animations, real-time updates.

**Common mistake:**
- Making the whole page `'use client'` because one button needs interactivity.
- Instead: keep the page as Server Component, extract only the interactive part into a small Client Component.

> **In short:** Server Components by default (less JavaScript, faster loads). Only add `'use client'` to the smallest interactive pieces. Think of it as: Server = content, Client = interactions.

---

## 22. Micro-frontends in React — when and why?

**Why they ask this:** They want to see if you understand large-scale frontend architecture and when it's worth the complexity.

**What are micro-frontends?**
- Instead of one big React app, you split it into multiple smaller apps.
- Each app (micro-frontend) is built, deployed, and maintained independently.
- They come together in the browser to look like one app.

> **Analogy:** Like microservices for the backend, but for the frontend. Each team owns a piece of the UI.

**Example structure:**
```
Main App Shell
├── Header (Team A — React)
├── Product Catalog (Team B — React)
├── Shopping Cart (Team C — React)
└── User Profile (Team D — Vue.js)  ← can even use different frameworks
```

**When to use micro-frontends (say YES):**
- **Large organization** — 5+ teams working on the same frontend.
- **Independent deployments** — Team A can deploy without waiting for Team B.
- **Legacy migration** — gradually replacing an old app piece by piece.
- **Different tech stacks** — some teams prefer React, others prefer Vue.

**When NOT to use micro-frontends (say NO):**
- **Small team** (1-5 developers) — the overhead is not worth it.
- **Simple app** — a single React app with good folder structure is enough.
- **No independent deployment need** — if you deploy everything together anyway.
- **Startup / MVP** — focus on speed, not architecture.

**Implementation approaches:**
- **Module Federation (Webpack 5)** — share code between apps at runtime. Most popular approach.
- **iframe** — simplest but limited (no shared state, SEO issues).
- **Web Components** — framework-agnostic, good for mixing React/Vue/Angular.
- **Route-based splitting** — each route loads a different app (e.g., `/products` → Team B's app).

**Trade-offs:**
- **Pros:** Independent teams, independent deployments, smaller codebases, tech flexibility.
- **Cons:** Shared state is hard, inconsistent UI without a design system, more infrastructure, debugging across apps is harder.

> **In short:** Micro-frontends make sense when you have multiple teams that need to deploy independently. For most apps (small to medium), a well-organized single React app is simpler and better. Don't use micro-frontends just because it sounds cool — the complexity cost is real.

---

## 23. How do you handle authentication across multiple tabs?

**Why they ask this:** They want to see if you understand session synchronization and browser storage.

**The problem:**
- User logs in on Tab 1.
- They open Tab 2 — it should also be logged in.
- User logs out on Tab 1 — Tab 2 should also log out.
- If using JWT tokens, all tabs need the same token.

**Solution: Use `localStorage` + `storage` event listener.**

```tsx
// When user logs in — save token to localStorage
function login(token: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
}

// When user logs out — clear and notify other tabs
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
}
```

```tsx
// Listen for changes from OTHER tabs (storage event only fires on other tabs)
useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === 'token') {
            if (!e.newValue) {
                // Token was removed → user logged out from another tab
                window.location.href = '/login';
            } else if (e.newValue !== e.oldValue) {
                // Token changed → user logged in from another tab
                window.location.reload(); // reload to pick up new session
            }
        }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
}, []);
```

**Key points:**
- `localStorage` is shared across all tabs on the same domain.
- The `storage` event only fires on **other** tabs, not the one that made the change.
- For cookies (httpOnly), the server handles session sync automatically — all tabs share the same cookies.

> **In short:** Store auth tokens in `localStorage` so all tabs share them. Listen to the `storage` event to react when another tab logs in or out.

---

## 24. Your form has 20 fields — how do you manage the state?

**Why they ask this:** They want to see if you use proper form management instead of 20 `useState` calls.

**Bad approach: One useState per field.**

```tsx
// 20 useState calls — messy, hard to maintain
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [phone, setPhone] = useState('');
const [address, setAddress] = useState('');
// ... 16 more
```

**Good approach: Use React Hook Form + Zod.**

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define validation schema
const schema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email'),
    phone: z.string().min(10, 'Phone must be at least 10 digits'),
    address: z.string().min(5),
    city: z.string().min(2),
    country: z.string().min(2),
    // ... more fields
});

type FormData = z.infer<typeof schema>;

function RegistrationForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: FormData) => {
        await fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register('name')} placeholder="Name" />
            {errors.name && <span>{errors.name.message}</span>}

            <input {...register('email')} placeholder="Email" />
            {errors.email && <span>{errors.email.message}</span>}

            <input {...register('phone')} placeholder="Phone" />
            {errors.phone && <span>{errors.phone.message}</span>}

            {/* ... more fields */}

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
        </form>
    );
}
```

**Why React Hook Form?**
- **No re-renders** — unlike `useState`, it uses refs internally so the form doesn't re-render on every keystroke.
- **Built-in validation** — works with Zod, Yup, or custom rules.
- **Easy error handling** — errors are organized per field.
- **Small bundle** — lightweight library.

**For very complex forms (multi-step, dynamic fields):**

```tsx
// Multi-step form
const [step, setStep] = useState(1);

return (
    <form onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && <PersonalInfoFields register={register} errors={errors} />}
        {step === 2 && <AddressFields register={register} errors={errors} />}
        {step === 3 && <PaymentFields register={register} errors={errors} />}

        {step > 1 && <button onClick={() => setStep(s => s - 1)}>Back</button>}
        {step < 3 && <button onClick={() => setStep(s => s + 1)}>Next</button>}
        {step === 3 && <button type="submit">Submit</button>}
    </form>
);
```

> **In short:** Use React Hook Form + Zod for forms with many fields. No re-renders, built-in validation, clean error handling. Never use 20 `useState` calls.

---

## 25. How to handle real-time data in React?

**Why they ask this:** Chat apps, notifications, live dashboards — real-time is everywhere. They want to see if you know the options.

**Three approaches:**

**Option 1: Polling (simplest, least efficient).**
- Ask the server every few seconds: "Any new data?"
- Simple to implement but wastes bandwidth and adds server load.

```tsx
useEffect(() => {
    const interval = setInterval(async () => {
        const res = await fetch('/api/notifications');
        const data = await res.json();
        setNotifications(data);
    }, 5000); // every 5 seconds

    return () => clearInterval(interval);
}, []);
```

**When to use:** Low-frequency updates, simple dashboards, when WebSocket is overkill.

---

**Option 2: WebSocket (best for real-time).**
- A persistent connection between client and server.
- Server can push data to the client instantly — no need to ask.

```tsx
useEffect(() => {
    const ws = new WebSocket('wss://yourapi.com/ws');

    ws.onopen = () => console.log('Connected');

    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setMessages(prev => [...prev, message]);
    };

    ws.onclose = () => {
        // Reconnect after 3 seconds
        setTimeout(() => {
            // reconnect logic
        }, 3000);
    };

    return () => ws.close();
}, []);

// Send a message
const sendMessage = (text: string) => {
    ws.send(JSON.stringify({ text, userId: user.id }));
};
```

**When to use:** Chat apps, live notifications, multiplayer games, stock prices.

---

**Option 3: Server-Sent Events (SSE) — one-way real-time.**
- Server pushes data to the client (one direction only).
- Simpler than WebSocket — client just listens.
- Auto-reconnects on connection loss.

```tsx
useEffect(() => {
    const eventSource = new EventSource('/api/events');

    eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setNotifications(prev => [...prev, data]);
    };

    eventSource.onerror = () => {
        // Auto-reconnects by default
    };

    return () => eventSource.close();
}, []);
```

**When to use:** Live feeds, notifications, dashboards (server → client only).

---

**Comparison:**
- **Polling** — Simple, works everywhere, but wastes bandwidth. Use for low-frequency updates.
- **WebSocket** — Two-way real-time, most powerful. Use for chat, games, collaboration.
- **SSE** — One-way (server → client), simpler than WebSocket, auto-reconnects. Use for notifications, feeds.

> **In short:** Use polling for simple cases, WebSocket for two-way real-time (chat), SSE for one-way updates (notifications). Don't use WebSocket when polling is enough.

---

## 26. What happens when you type a URL in the browser and press Enter?

**Why they ask this:** This is one of the most classic interview questions. It tests your understanding of the entire web stack — networking, DNS, HTTP, rendering.

**Step by step (simplified):**

**1. DNS Lookup — "What is the IP address of this website?"**
- Browser checks its cache → OS cache → Router cache → ISP DNS → Root DNS servers.
- Converts `www.google.com` → `142.250.80.46` (an IP address).

**2. TCP Connection — "Let me connect to that server."**
- Browser opens a TCP connection to the server (3-way handshake: SYN → SYN-ACK → ACK).
- If HTTPS, a TLS handshake also happens (exchange encryption keys).

**3. HTTP Request — "Give me this page."**
- Browser sends an HTTP request:
```
GET /search?q=react HTTP/2
Host: www.google.com
User-Agent: Chrome/120
Accept: text/html
Cookie: session=abc123
```

**4. Server Processing — "Let me prepare the response."**
- Server receives the request.
- Routes it to the right controller/handler.
- Queries the database, processes data, builds HTML/JSON.
- Sends back an HTTP response:
```
HTTP/2 200 OK
Content-Type: text/html
Set-Cookie: session=abc123

<!DOCTYPE html>
<html>...
```

**5. Browser Receives Response — "Let me show this to the user."**
- Browser receives the HTML.
- Parses HTML → builds **DOM** (Document Object Model).
- Parses CSS → builds **CSSOM** (CSS Object Model).
- Combines DOM + CSSOM → **Render Tree**.
- Calculates layout (where each element goes on screen).
- Paints pixels on screen.

**6. JavaScript Execution**
- Browser downloads and runs JavaScript files.
- JavaScript can modify the DOM (React does this — virtual DOM → real DOM).
- If it's a React SPA, JavaScript takes over and handles routing client-side.

**7. Page is Ready**
- User sees the page and can interact with it.

> **In short:** DNS (find IP) → TCP connection → HTTP request → Server processes → Browser receives HTML → Parse DOM + CSS → Render → Run JavaScript → Page ready.

---

## 27. How to handle image optimization in a web app?

**Why they ask this:** Images are often 60-80% of a page's total size. Optimizing them is one of the easiest performance wins.

**Problem:**
- Large images slow down page load.
- Unoptimized images waste bandwidth (user downloads a 4000px image but screen is 400px).
- Wrong format — PNG for photos, JPEG for graphics.

**Solution 1: Use Next.js `<Image>` component (easiest).**

```tsx
import Image from 'next/image';

// Next.js automatically:
// - Resizes to the right size
// - Converts to WebP/AVIF (modern, smaller formats)
// - Lazy loads (only loads when visible)
// - Caches on CDN
<Image
    src="/products/laptop.jpg"
    alt="Laptop"
    width={400}
    height={300}
    priority={false}  // lazy load by default
/>
```

**Solution 2: Responsive images with `srcset` (plain HTML).**

```html
<!-- Browser picks the right size based on screen width -->
<img
    srcset="
        /images/product-400w.webp 400w,
        /images/product-800w.webp 800w,
        /images/product-1200w.webp 1200w
    "
    sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
    src="/images/product-800w.webp"
    alt="Product"
    loading="lazy"
/>
```

**Solution 3: Lazy loading (load images only when visible).**

```html
<!-- Native lazy loading — supported by all modern browsers -->
<img src="/photo.jpg" alt="Photo" loading="lazy" />
```

```tsx
// React with Intersection Observer (for more control)
function LazyImage({ src, alt }: { src: string; alt: string }) {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.disconnect();
            }
        });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={ref}>
            {isVisible ? <img src={src} alt={alt} /> : <div className="placeholder" />}
        </div>
    );
}
```

**Best practices:**
- **Use WebP/AVIF** instead of PNG/JPEG — 25-50% smaller with same quality.
- **Lazy load** all images below the fold (not visible on first screen).
- **Set width and height** — prevents layout shift when image loads.
- **Use CDN** (Cloudflare, Vercel, Cloudinary) — serves images from nearest server.
- **Compress images** — tools like TinyPNG, Sharp, or Squoosh.

> **In short:** Use Next.js `<Image>` if possible (handles everything). Otherwise: WebP format, responsive `srcset`, lazy loading, CDN, and always set width/height.

---

## 28. Your Next.js page takes 5 seconds to load — how do you fix it?

**Why they ask this:** They want to see if you understand Next.js rendering strategies and performance optimization.

**Step-by-step debugging:**

**Step 1: Check what's slow — server or client?**
- Open DevTools → Network tab → look at the first HTML response time.
- If HTML takes 4 seconds → **server is slow** (database, API calls).
- If HTML is fast but page still slow → **client is slow** (JavaScript, images, fonts).

**Step 2: Fix slow server rendering.**

```tsx
// Bad: fetching data at request time on every visit
async function ProductPage() {
    const products = await db.product.findMany(); // slow query on every request
    return <ProductList products={products} />;
}

// Fix 1: Use ISR — regenerate page every 60 seconds (not on every request)
export const revalidate = 60; // seconds

async function ProductPage() {
    const products = await db.product.findMany();
    return <ProductList products={products} />;
}

// Fix 2: Use SSG for pages that rarely change
export async function generateStaticParams() {
    const products = await db.product.findMany({ select: { id: true } });
    return products.map(p => ({ id: p.id.toString() }));
}
```

**Step 3: Fix slow database queries.**

```tsx
// Bad: loading everything
const products = await db.product.findMany({
    include: { category: true, reviews: true, images: true },
});

// Fix: only select what the page needs
const products = await db.product.findMany({
    select: { id: true, name: true, price: true, image: true },
    take: 20, // paginate
});
```

**Step 4: Fix large JavaScript bundle.**

```tsx
// Bad: importing a heavy library at the top level
import Chart from 'chart.js'; // 200KB loaded even if user doesn't see the chart

// Fix: lazy load heavy components
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('../components/Chart'), {
    loading: () => <p>Loading chart...</p>,
    ssr: false, // don't render on server
});
```

**Step 5: Fix slow images.**

```tsx
// Bad: unoptimized images
<img src="/hero.png" /> // 5MB PNG, no lazy loading

// Fix: use Next.js Image with priority for above-the-fold
<Image src="/hero.webp" width={1200} height={600} priority />
```

**Step 6: Fix render-blocking fonts.**

```tsx
// next.config.js — preload fonts
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] }); // auto-optimized by Next.js
```

**Quick checklist:**
- Use ISR/SSG instead of SSR when possible.
- Optimize database queries (select only needed fields, add indexes).
- Lazy load heavy components with `dynamic()`.
- Use Next.js `<Image>` for all images.
- Minimize JavaScript bundle (check with `next build --analyze`).
- Use `next/font` for font optimization.

> **In short:** Check if the bottleneck is server or client. For server: optimize queries + use ISR. For client: lazy load components + optimize images + reduce bundle size.

---

## 29. How do you handle errors gracefully in a full-stack app?

**Why they ask this:** Error handling is what separates junior from senior developers. They want to see your strategy for both frontend and backend.

**Backend (Laravel): Consistent error responses.**

```php
// Create a consistent error format for ALL API responses
class ApiController extends Controller
{
    protected function success($data, $message = 'Success', $code = 200)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    protected function error($message, $code = 400, $errors = [])
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $code);
    }
}

// Usage in controller
public function store(Request $request)
{
    try {
        $validated = $request->validate([...]);
        $product = Product::create($validated);
        return $this->success($product, 'Product created', 201);
    } catch (ValidationException $e) {
        return $this->error('Validation failed', 422, $e->errors());
    } catch (\Exception $e) {
        Log::error('Product creation failed: ' . $e->getMessage());
        return $this->error('Something went wrong', 500);
    }
}
```

**Frontend (React): Handle every error state.**

```tsx
type Status = 'idle' | 'loading' | 'success' | 'error';

function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [status, setStatus] = useState<Status>('idle');
    const [error, setError] = useState<string>('');

    const fetchProducts = async () => {
        setStatus('loading');
        try {
            const res = await fetch('/api/products');
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to load products');
            }
            const data = await res.json();
            setProducts(data.data);
            setStatus('success');
        } catch (err) {
            setError((err as Error).message);
            setStatus('error');
        }
    };

    return { products, status, error, fetchProducts };
}

// In the component — handle all states
function ProductList() {
    const { products, status, error, fetchProducts } = useProducts();

    useEffect(() => { fetchProducts(); }, []);

    if (status === 'loading') return <Spinner />;
    if (status === 'error') return (
        <div>
            <p>Error: {error}</p>
            <button onClick={fetchProducts}>Try Again</button>
        </div>
    );
    if (products.length === 0) return <p>No products found.</p>;

    return <ul>{products.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}
```

**Key principles:**
- **Backend:** Always return a consistent JSON format (`success`, `message`, `data/errors`). Never expose raw error messages in production.
- **Frontend:** Always handle loading, success, error, and empty states. Show a "Try Again" button on errors.
- **Validation errors:** Show inline errors next to each field, not a generic "something went wrong."
- **Network errors:** Show a friendly message: "Cannot connect to server. Please check your internet."
- **404 errors:** Show a helpful page, not a blank screen.
- **Logging:** Log all errors server-side (Telescope, Sentry). Never `console.log` in production.

> **In short:** Backend: consistent error format for all APIs. Frontend: handle loading/success/error/empty states for every API call. Log everything server-side. Never show raw error messages to users.

---

## 30. Explain the difference between SSR, SSG, ISR, and CSR

**Why they ask this:** This is a fundamental Next.js question. They want to see if you understand when to use each rendering strategy.

**CSR — Client-Side Rendering:**
- JavaScript runs in the browser and builds the page.
- The server sends an empty HTML + JavaScript bundle.
- The browser downloads JS, executes it, fetches data, then renders the page.
- **Slow first load** (user sees blank page until JS finishes).
- **Good for:** Dashboards, admin panels, apps behind login (no SEO needed).

```tsx
'use client';

// CSR: data fetched in the browser
function Dashboard() {
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetch('/api/stats').then(r => r.json()).then(setStats);
    }, []);

    if (!stats) return <Spinner />;
    return <StatsGrid stats={stats} />;
}
```

---

**SSR — Server-Side Rendering:**
- The server builds the full HTML on **every request**.
- User gets a complete page immediately (fast first paint).
- Server must process every request (higher server cost).
- **Good for:** Pages with user-specific data, real-time data, search results.

```tsx
// SSR: runs on every request (Next.js App Router — no cache)
export const dynamic = 'force-dynamic';

async function SearchResults({ searchParams }: { searchParams: { q: string } }) {
    const results = await db.product.findMany({
        where: { name: { contains: searchParams.q } },
    });
    return <ProductList products={results} />;
}
```

---

**SSG — Static Site Generation:**
- The page is built once at **build time** (during `next build`).
- The same HTML is served to every user — super fast.
- Data doesn't change until you rebuild the app.
- **Good for:** Blog posts, documentation, marketing pages, product pages that rarely change.

```tsx
// SSG: built at build time, same HTML for everyone
async function BlogPost({ params }: { params: { slug: string } }) {
    const post = await db.post.findUnique({ where: { slug: params.slug } });
    return <article>{post.content}</article>;
}

// Tell Next.js which pages to pre-build
export async function generateStaticParams() {
    const posts = await db.post.findMany({ select: { slug: true } });
    return posts.map(post => ({ slug: post.slug }));
}
```

---

**ISR — Incremental Static Regeneration:**
- Like SSG, but the page **automatically rebuilds** in the background after a set time.
- Users always get a fast cached page. After the time expires, the next visitor triggers a rebuild.
- Best of both worlds: fast like SSG + fresh data like SSR.
- **Good for:** E-commerce product pages, news articles, any page that changes occasionally.

```tsx
// ISR: rebuild this page every 60 seconds in the background
export const revalidate = 60;

async function ProductPage({ params }: { params: { id: string } }) {
    const product = await db.product.findUnique({ where: { id: params.id } });
    return <ProductDetail product={product} />;
}
// First visitor gets cached page (fast)
// After 60 seconds, next visitor triggers a rebuild in background
// All visitors after rebuild get the new page
```

---

**Comparison:**

- **CSR** — Built: in browser. Speed: slow first load. Data freshness: always fresh. SEO: bad. Server cost: low. Use for: dashboards, admin panels.
- **SSR** — Built: on server per request. Speed: fast first paint. Data freshness: always fresh. SEO: good. Server cost: high. Use for: search results, user-specific pages.
- **SSG** — Built: at build time once. Speed: fastest. Data freshness: stale until rebuild. SEO: best. Server cost: lowest. Use for: blogs, docs, marketing.
- **ISR** — Built: at build time + background rebuilds. Speed: fast. Data freshness: slightly stale (controlled by revalidate). SEO: good. Server cost: low. Use for: product pages, news, e-commerce.

**Decision guide:**
- Does the page change on every request? → **SSR**
- Does the page rarely change? → **SSG**
- Does the page change occasionally (every few minutes/hours)? → **ISR**
- Is the page behind a login with no SEO needs? → **CSR**

> **In short:** Use SSG for static content, ISR for content that changes occasionally, SSR for real-time/personalized data, CSR for admin panels behind login. In Next.js, ISR is usually the best default choice for most pages.
