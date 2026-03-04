# Redis for Backend Developers

A comprehensive guide to Redis concepts, data types, caching strategies, and practical usage with PHP/Laravel.

---

## Table of Contents

1. [What is Redis?](#1-what-is-redis)
2. [Redis Data Types](#2-redis-data-types)
3. [Redis as a Cache](#3-redis-as-a-cache)
4. [Redis with Laravel](#4-redis-with-laravel)
5. [Redis for Queues](#5-redis-for-queues)
6. [Redis Pub/Sub](#6-redis-pubsub)
7. [Redis Sessions](#7-redis-sessions)
8. [Redis vs Memcached](#8-redis-vs-memcached)
9. [Redis Persistence](#9-redis-persistence)
10. [Redis Best Practices](#10-redis-best-practices)

---

## 1. What is Redis?

Redis stands for **Remote Dictionary Server**. It is an open-source, **in-memory data structure store** used as a database, cache, message broker, and streaming engine.

**Key characteristics:**

- Stores all data **in memory (RAM)**, making it extremely fast (sub-millisecond response times).
- Works as a **key-value store** -- you set a key and retrieve its value.
- Supports **rich data structures** beyond simple strings (lists, sets, hashes, sorted sets, streams).
- Is **single-threaded** for command execution, which avoids race conditions and keeps things simple.
- Offers optional **persistence** to disk so data can survive restarts.
- Written in C and available on Linux, macOS, and Windows (via WSL or Docker).

**Common use cases:**

- **Caching** -- store frequently accessed database query results to reduce load.
- **Session storage** -- keep user sessions in memory for fast access across multiple servers.
- **Job queues** -- power background job processing (Laravel queues, Sidekiq, Bull).
- **Real-time features** -- leaderboards, rate limiting, counters, pub/sub messaging.
- **Full-page caching** -- cache entire HTML pages for high-traffic sites.

**Basic example (Redis CLI):**

```bash
# Set a key
SET greeting "Hello, Redis!"

# Get a key
GET greeting
# => "Hello, Redis!"

# Set a key with a 60-second expiration
SET token "abc123" EX 60

# Check remaining time to live
TTL token
# => 58

# Delete a key
DEL greeting
```

**Basic example (PHP with phpredis extension):**

```php
$redis = new Redis();
$redis->connect('127.0.0.1', 6379);

// Set and get a value
$redis->set('greeting', 'Hello, Redis!');
echo $redis->get('greeting'); // "Hello, Redis!"

// Set with expiration (60 seconds)
$redis->setex('token', 60, 'abc123');

// Check if a key exists
$redis->exists('greeting'); // true

// Delete a key
$redis->del('greeting');
```

---

## 2. Redis Data Types

Redis is more than a simple key-value store. It supports **multiple data structures**, each suited for different problems.

### Strings

- The most basic Redis data type.
- Can hold text, numbers, or serialized data (JSON, binary).
- Maximum size is **512 MB** per string value.
- Supports atomic increment/decrement for counters.

```php
// Simple string
$redis->set('user:name', 'Anwar');
$redis->get('user:name'); // "Anwar"

// Numeric counter
$redis->set('page:views', 0);
$redis->incr('page:views');    // 1
$redis->incrBy('page:views', 10); // 11
$redis->decr('page:views');    // 10

// Store JSON
$user = json_encode(['name' => 'Anwar', 'email' => 'anwar@example.com']);
$redis->set('user:1', $user);
$data = json_decode($redis->get('user:1'), true);
```

### Lists

- Ordered collections of strings (like arrays).
- Elements are ordered by **insertion order**.
- You can push/pop from the **left (head)** or **right (tail)**.
- Useful for queues, recent activity feeds, and message logs.

```php
// Push items to the right (end of list)
$redis->rPush('queue:emails', 'email_1');
$redis->rPush('queue:emails', 'email_2');
$redis->rPush('queue:emails', 'email_3');

// Pop from the left (front of list) -- FIFO queue behavior
$redis->lPop('queue:emails'); // "email_1"

// Get all items in the list (0 to -1 means start to end)
$redis->lRange('queue:emails', 0, -1);
// => ["email_2", "email_3"]

// Get the length of the list
$redis->lLen('queue:emails'); // 2

// Recent activity feed -- keep only the last 100 items
$redis->lPush('user:1:feed', 'Posted a comment');
$redis->lTrim('user:1:feed', 0, 99); // Keep only first 100
```

### Sets

- Unordered collections of **unique** strings.
- No duplicates allowed -- adding the same value twice has no effect.
- Support **set operations** like union, intersection, and difference.
- Useful for tags, unique visitors, mutual friends.

```php
// Add members to a set
$redis->sAdd('post:1:tags', 'php');
$redis->sAdd('post:1:tags', 'laravel');
$redis->sAdd('post:1:tags', 'redis');
$redis->sAdd('post:1:tags', 'php'); // Ignored -- already exists

// Get all members
$redis->sMembers('post:1:tags');
// => ["php", "laravel", "redis"]

// Check if a member exists
$redis->sIsMember('post:1:tags', 'php'); // true

// Count members
$redis->sCard('post:1:tags'); // 3

// Set intersection -- find common tags between two posts
$redis->sAdd('post:2:tags', 'php');
$redis->sAdd('post:2:tags', 'javascript');
$redis->sInter('post:1:tags', 'post:2:tags');
// => ["php"]

// Track unique visitors
$redis->sAdd('page:home:visitors', 'user_1');
$redis->sAdd('page:home:visitors', 'user_2');
$redis->sAdd('page:home:visitors', 'user_1'); // Ignored
$redis->sCard('page:home:visitors'); // 2
```

### Sorted Sets

- Like sets, but each member has an associated **score** (a floating-point number).
- Members are **automatically sorted by score** (lowest to highest).
- No duplicate members, but scores can be the same.
- Useful for leaderboards, ranking systems, priority queues.

```php
// Add members with scores (score, member)
$redis->zAdd('leaderboard', 1500, 'player_a');
$redis->zAdd('leaderboard', 2300, 'player_b');
$redis->zAdd('leaderboard', 1800, 'player_c');

// Get top players (highest score first) -- index 0 to 2
$redis->zRevRange('leaderboard', 0, 2);
// => ["player_b", "player_c", "player_a"]

// Get top players with scores
$redis->zRevRange('leaderboard', 0, 2, true);
// => ["player_b" => 2300, "player_c" => 1800, "player_a" => 1500]

// Get a player's rank (0-based, highest first)
$redis->zRevRank('leaderboard', 'player_b'); // 0 (first place)

// Increment a player's score
$redis->zIncrBy('leaderboard', 200, 'player_a');
// player_a now has 1700

// Get members within a score range
$redis->zRangeByScore('leaderboard', 1600, 2000);
// => ["player_a", "player_c"]
```

### Hashes

- A collection of **field-value pairs** stored under a single key.
- Think of it as a **mini object or dictionary** inside a key.
- More memory-efficient than storing multiple separate keys.
- Useful for storing objects like user profiles, product details, settings.

```php
// Set individual fields
$redis->hSet('user:1', 'name', 'Anwar');
$redis->hSet('user:1', 'email', 'anwar@example.com');
$redis->hSet('user:1', 'age', 28);

// Set multiple fields at once
$redis->hMSet('user:2', [
    'name'  => 'Sara',
    'email' => 'sara@example.com',
    'age'   => 25,
]);

// Get a single field
$redis->hGet('user:1', 'name'); // "Anwar"

// Get all fields and values
$redis->hGetAll('user:1');
// => ["name" => "Anwar", "email" => "anwar@example.com", "age" => "28"]

// Check if a field exists
$redis->hExists('user:1', 'email'); // true

// Increment a numeric field
$redis->hIncrBy('user:1', 'age', 1); // 29

// Delete a field
$redis->hDel('user:1', 'age');
```

---

## 3. Redis as a Cache

Caching is the **most common use case** for Redis. The idea is to store the result of expensive operations in memory so you can return it instantly on subsequent requests.

**How caching works:**

- A request comes in for some data (e.g., a list of products).
- The application checks Redis first -- this is called a **cache hit** if the data is found.
- If the data is **not** in Redis (a **cache miss**), the application fetches it from the database, stores it in Redis, and then returns it.
- Future requests for the same data are served directly from Redis (microseconds instead of milliseconds).

### TTL (Time to Live)

- Every cached key should have a **TTL** -- the number of seconds before Redis automatically deletes it.
- Without TTL, cached data can become **stale** (outdated) and consume memory indefinitely.
- Choose TTL based on how frequently your data changes.

```php
// Cache a value for 5 minutes (300 seconds)
$redis->setex('products:featured', 300, json_encode($products));

// Cache with a TTL using Laravel
Cache::put('products:featured', $products, now()->addMinutes(5));

// Check remaining TTL
$redis->ttl('products:featured'); // => 287 (seconds remaining)
```

### Cache Invalidation

- **Cache invalidation** is the process of removing or updating stale cache data.
- This is one of the hardest problems in computer science -- you must ensure cached data reflects the current state of the database.

**Common strategies:**

- **Time-based expiration (TTL)** -- let the cache expire naturally after a set duration.
- **Manual invalidation** -- explicitly delete the cache key when the underlying data changes.
- **Event-driven invalidation** -- use model events or observers to clear cache when data is created, updated, or deleted.

```php
// Manual invalidation in Laravel
// When a product is updated, clear its cache
public function update(Request $request, Product $product)
{
    $product->update($request->validated());

    // Clear the specific product cache
    Cache::forget("product:{$product->id}");

    // Clear the product list cache
    Cache::forget('products:featured');

    return response()->json($product);
}
```

### Cache-Aside Pattern (Lazy Loading)

- The most common caching pattern.
- The application is responsible for reading from and writing to the cache.
- Data is loaded into the cache **only when requested** (lazy).

```php
// Cache-Aside Pattern
public function getProduct(int $id): Product
{
    $cacheKey = "product:{$id}";

    // Step 1: Check the cache
    $cached = Cache::get($cacheKey);

    if ($cached) {
        return $cached; // Cache hit -- return immediately
    }

    // Step 2: Cache miss -- fetch from database
    $product = Product::with('category', 'reviews')->findOrFail($id);

    // Step 3: Store in cache for future requests
    Cache::put($cacheKey, $product, now()->addMinutes(30));

    return $product;
}

// Laravel shortcut -- the "remember" method does all three steps
public function getProduct(int $id): Product
{
    return Cache::remember("product:{$id}", now()->addMinutes(30), function () use ($id) {
        return Product::with('category', 'reviews')->findOrFail($id);
    });
}
```

---

## 4. Redis with Laravel

Laravel has **first-class support for Redis** through the `Cache` facade, direct Redis connections, and integrations with queues, sessions, and broadcasting.

### Configuration

- Laravel supports two Redis client libraries: **phpredis** (C extension, faster) and **predis** (pure PHP, easier to install).
- Configuration lives in `config/database.php` under the `redis` key.

```php
// config/database.php
'redis' => [
    'client' => env('REDIS_CLIENT', 'phpredis'),

    'default' => [
        'host'     => env('REDIS_HOST', '127.0.0.1'),
        'password' => env('REDIS_PASSWORD', null),
        'port'     => env('REDIS_PORT', 6379),
        'database' => env('REDIS_DB', 0),
    ],

    'cache' => [
        'host'     => env('REDIS_HOST', '127.0.0.1'),
        'password' => env('REDIS_PASSWORD', null),
        'port'     => env('REDIS_PORT', 6379),
        'database' => env('REDIS_CACHE_DB', 1),
    ],
],
```

```env
# .env
CACHE_DRIVER=redis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

### Cache Facade

- The `Cache` facade provides a clean, unified API for caching regardless of the driver.
- When `CACHE_DRIVER=redis`, all `Cache` calls go through Redis automatically.

```php
use Illuminate\Support\Facades\Cache;

// Store a value
Cache::put('key', 'value', now()->addMinutes(10));

// Store forever (no expiration)
Cache::forever('settings:site_name', 'My App');

// Retrieve a value (returns null if not found)
$value = Cache::get('key');

// Retrieve with a default value
$value = Cache::get('key', 'default_value');

// Check if a key exists
if (Cache::has('key')) {
    // Key exists and is not null
}

// Remove a key
Cache::forget('key');

// Retrieve and delete (get then forget)
$value = Cache::pull('key');

// Increment / Decrement
Cache::increment('counter');
Cache::increment('counter', 5);
Cache::decrement('counter');

// Store if not already present
Cache::add('key', 'value', now()->addMinutes(10));
// Returns true if stored, false if key already exists
```

### The `remember` and `rememberForever` Methods

- These combine the cache-aside pattern into a single, clean call.
- If the key exists, return it. If not, execute the closure, store the result, and return it.

```php
// Remember for a specific duration
$users = Cache::remember('users:active', now()->addHours(1), function () {
    return User::where('active', true)
        ->with('profile')
        ->get();
});

// Remember forever (until manually cleared)
$settings = Cache::rememberForever('app:settings', function () {
    return Setting::all()->pluck('value', 'key');
});
```

### Cache Tags

- Cache tags let you **group related cache entries** and flush them all at once.
- Only available with drivers that support tags (Redis and Memcached -- **not** the file or database driver).

```php
// Store cache entries with tags
Cache::tags(['products', 'featured'])->put('products:featured', $products, now()->addHours(1));
Cache::tags(['products'])->put('products:all', $allProducts, now()->addHours(1));
Cache::tags(['users'])->put('users:active', $activeUsers, now()->addMinutes(30));

// Retrieve tagged cache entries
$featured = Cache::tags(['products', 'featured'])->get('products:featured');

// Flush all cache entries tagged with "products"
Cache::tags(['products'])->flush();
// This clears both "products:featured" and "products:all"
// But "users:active" is NOT affected

// Practical example -- clear product caches when a product is updated
class ProductObserver
{
    public function updated(Product $product): void
    {
        Cache::tags(['products'])->flush();
    }

    public function created(Product $product): void
    {
        Cache::tags(['products'])->flush();
    }

    public function deleted(Product $product): void
    {
        Cache::tags(['products'])->flush();
    }
}
```

### The `forget` Method

- Removes a specific key from the cache.
- Use it for targeted invalidation when you know exactly which key to clear.

```php
// Remove a specific cache key
Cache::forget('user:1:profile');

// Remove within a tag group
Cache::tags(['users'])->forget('user:1:profile');

// Common pattern -- clear cache in a controller
public function update(Request $request, Post $post)
{
    $post->update($request->validated());

    Cache::forget("post:{$post->id}");
    Cache::forget("post:{$post->id}:comments");
    Cache::tags(['posts'])->flush();

    return response()->json($post);
}
```

### Using Redis Directly (Beyond Caching)

- You can interact with Redis directly for operations that go beyond simple caching.

```php
use Illuminate\Support\Facades\Redis;

// Direct string operations
Redis::set('key', 'value');
Redis::get('key');

// Rate limiting example
$key = "rate_limit:user:{$userId}";
$requests = Redis::incr($key);

if ($requests === 1) {
    Redis::expire($key, 60); // Set TTL on first request
}

if ($requests > 100) {
    abort(429, 'Too many requests.');
}

// Using Redis hashes directly
Redis::hMSet("user:{$userId}", [
    'last_seen'  => now()->toDateTimeString(),
    'ip_address' => $request->ip(),
]);

// Pipeline -- send multiple commands in one round trip
Redis::pipeline(function ($pipe) {
    $pipe->set('key1', 'value1');
    $pipe->set('key2', 'value2');
    $pipe->set('key3', 'value3');
});
```

---

## 5. Redis for Queues

Laravel's queue system allows you to **defer time-consuming tasks** (sending emails, processing images, generating reports) to be handled in the background. Redis is the most popular queue driver for Laravel.

**Why use Redis for queues:**

- Extremely fast -- pushing and popping jobs is a sub-millisecond operation.
- Reliable -- supports delayed jobs, retries, and priority queues.
- Built into Laravel -- no additional services needed beyond Redis itself.
- Supports multiple queues with different priorities.

### Configuration

```php
// config/queue.php
'connections' => [
    'redis' => [
        'driver'      => 'redis',
        'connection'  => 'default',
        'queue'       => env('REDIS_QUEUE', 'default'),
        'retry_after' => 90, // seconds before a job is retried if not acknowledged
        'block_for'   => null,
    ],
],
```

```env
# .env
QUEUE_CONNECTION=redis
```

### Dispatching Jobs

```php
// Create a job
php artisan make:job SendWelcomeEmail

// app/Jobs/SendWelcomeEmail.php
class SendWelcomeEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public User $user
    ) {}

    public function handle(): void
    {
        Mail::to($this->user->email)->send(new WelcomeMail($this->user));
    }

    // Number of times the job may be attempted
    public int $tries = 3;

    // Number of seconds to wait before retrying
    public int $backoff = 60;
}

// Dispatch the job
SendWelcomeEmail::dispatch($user);

// Dispatch to a specific queue
SendWelcomeEmail::dispatch($user)->onQueue('emails');

// Dispatch with a delay
SendWelcomeEmail::dispatch($user)->delay(now()->addMinutes(5));
```

### Running the Queue Worker

```bash
# Process jobs on the default queue
php artisan queue:work redis

# Process jobs on a specific queue
php artisan queue:work redis --queue=emails

# Process jobs with priority (high first, then default)
php artisan queue:work redis --queue=high,default,low

# Limit the number of jobs processed before the worker restarts
php artisan queue:work redis --max-jobs=1000

# Limit memory usage
php artisan queue:work redis --memory=128
```

### How Redis Queues Work Internally

- When you dispatch a job, Laravel serializes it and pushes it onto a **Redis list** (using `RPUSH`).
- The queue worker continuously pops jobs from the list (using `LPOP` or `BLPOP`).
- Delayed jobs are stored in a **Redis sorted set** where the score is the timestamp when the job should become available.
- Failed jobs can be stored in a `failed_jobs` database table or retried automatically.

```php
// Monitor your queues
php artisan queue:monitor redis:default,redis:emails

// Retry failed jobs
php artisan queue:retry all

// Clear all jobs from a queue
php artisan queue:clear redis --queue=default
```

---

## 6. Redis Pub/Sub

**Pub/Sub** (Publish/Subscribe) is a messaging pattern where senders (publishers) send messages to channels without knowing who will receive them, and receivers (subscribers) listen on channels without knowing who is sending.

**How it works:**

- A **subscriber** listens on one or more channels, waiting for messages.
- A **publisher** sends a message to a specific channel.
- Redis delivers the message to **all subscribers** currently listening on that channel.
- Messages are **fire-and-forget** -- if no one is listening, the message is lost.
- This is different from queues -- pub/sub broadcasts to all subscribers, while a queue delivers each message to one worker.

**Use cases:**

- **Real-time notifications** -- notify all connected users when something happens.
- **Chat applications** -- broadcast messages to all participants in a chat room.
- **Live dashboards** -- push updates to monitoring dashboards in real time.
- **Cache invalidation across servers** -- tell all application servers to clear a specific cache entry.
- **Event broadcasting** -- Laravel's broadcasting system uses Redis pub/sub under the hood.

### Basic Pub/Sub with Redis CLI

```bash
# Terminal 1 -- Subscribe to a channel
SUBSCRIBE chat:general

# Terminal 2 -- Publish a message
PUBLISH chat:general "Hello, everyone!"

# Terminal 1 receives:
# 1) "message"
# 2) "chat:general"
# 3) "Hello, everyone!"
```

### Pub/Sub with PHP

```php
// Publisher -- send a message
Redis::publish('notifications', json_encode([
    'type'    => 'new_order',
    'message' => 'New order #1234 received!',
    'user_id' => 42,
]));

// Subscriber -- listen for messages (this blocks)
Redis::subscribe(['notifications'], function (string $message, string $channel) {
    $data = json_decode($message, true);

    match ($data['type']) {
        'new_order'  => handleNewOrder($data),
        'new_user'   => handleNewUser($data),
        default      => logger()->info("Unknown event: {$data['type']}"),
    };
});
```

### Laravel Broadcasting with Redis

- Laravel's event broadcasting uses Redis pub/sub to send real-time events to a WebSocket server (like Laravel Echo with Soketi, Pusher, or Laravel Reverb).

```php
// config/broadcasting.php
'connections' => [
    'redis' => [
        'driver'     => 'redis',
        'connection' => 'default',
    ],
],
```

```env
# .env
BROADCAST_DRIVER=redis
```

```php
// Create a broadcastable event
class OrderPlaced implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Order $order
    ) {}

    // The channel to broadcast on
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("user.{$this->order->user_id}"),
        ];
    }

    // The data to send with the event
    public function broadcastWith(): array
    {
        return [
            'order_id' => $this->order->id,
            'total'    => $this->order->total,
            'status'   => $this->order->status,
        ];
    }
}

// Dispatch the event
event(new OrderPlaced($order));
```

```javascript
// Frontend -- listen with Laravel Echo
Echo.private(`user.${userId}`)
    .listen('OrderPlaced', (event) => {
        console.log('New order:', event.order_id);
        showNotification(`Order #${event.order_id} placed!`);
    });
```

---

## 7. Redis Sessions

By default, Laravel stores sessions in **files** on disk. Redis is a faster and more scalable alternative, especially when running multiple application servers behind a load balancer.

**Why store sessions in Redis:**

- **Speed** -- reading session data from memory is much faster than reading from disk or a database.
- **Shared across servers** -- all application servers can access the same Redis instance, ensuring session data is available regardless of which server handles the request.
- **Automatic expiration** -- Redis TTL automatically cleans up expired sessions without a garbage collection process.
- **Scalability** -- Redis handles millions of keys without performance degradation.

### Configuration

```env
# .env
SESSION_DRIVER=redis
SESSION_LIFETIME=120
REDIS_HOST=127.0.0.1
```

```php
// config/session.php
'driver'     => env('SESSION_DRIVER', 'redis'),
'lifetime'   => env('SESSION_LIFETIME', 120), // minutes
'connection' => env('SESSION_CONNECTION', null), // uses default Redis connection
```

### Sessions in Redis -- File vs Database vs Redis

**File sessions:**

- Stored in `storage/framework/sessions/`.
- Work fine for single-server setups.
- Cannot be shared across multiple servers.
- Require periodic garbage collection to clean up expired session files.
- No additional infrastructure needed.

**Database sessions:**

- Stored in a `sessions` database table.
- Can be shared across servers (all servers connect to the same database).
- Slower than Redis because every session read/write is a database query.
- Put additional load on your database.
- Easy to query and inspect session data.

**Redis sessions:**

- Stored in Redis memory.
- Can be shared across servers.
- Extremely fast reads and writes.
- Automatic expiration via TTL (no garbage collection needed).
- Requires a Redis server to be running.
- Session data is lost if Redis restarts without persistence enabled.

### How It Works in Practice

```php
// Sessions work the same way regardless of the driver
// Store data in the session
session(['cart_id' => $cart->id]);
session()->put('locale', 'en');

// Retrieve data
$cartId = session('cart_id');
$locale = session('locale', 'en'); // with default

// Flash data (available only for the next request)
session()->flash('success', 'Product added to cart!');

// Remove data
session()->forget('cart_id');

// Clear the entire session
session()->flush();
```

Behind the scenes, when using Redis, Laravel stores each session as a Redis key like `laravel_cache:session_abc123` with the session data serialized and a TTL matching the session lifetime.

---

## 8. Redis vs Memcached

Both Redis and Memcached are in-memory data stores used for caching, but they differ significantly in features and capabilities.

**Redis advantages:**

- Supports **rich data types** (strings, lists, sets, sorted sets, hashes, streams).
- Offers **persistence** -- data can be saved to disk and restored after a restart.
- Supports **pub/sub messaging** for real-time communication.
- Has built-in **replication** (master-replica) for high availability.
- Supports **Lua scripting** for complex atomic operations.
- Provides **transactions** (MULTI/EXEC) to execute multiple commands atomically.
- Supports **TTL on individual keys** with flexible expiration.
- Can function as a **message broker** and **queue** (not just a cache).
- Offers **Redis Cluster** for automatic data sharding across multiple nodes.

**Memcached advantages:**

- **Simpler** -- fewer features means less complexity and easier to operate.
- **Multithreaded** -- can take advantage of multiple CPU cores out of the box.
- **Lower memory overhead per key** for simple string caching use cases.
- Slightly faster for **pure key-value string caching** at very high throughput.
- More **predictable memory usage** -- uses a slab allocator that avoids fragmentation.
- Mature and battle-tested for its core use case (simple caching).

**When to choose Redis:**

- You need data structures beyond simple key-value strings.
- You need persistence (data must survive restarts).
- You need pub/sub, queues, or real-time features.
- You are using Laravel (which has deep Redis integration for caching, queues, sessions, and broadcasting).
- You want one tool that handles caching, queues, and sessions.

**When to choose Memcached:**

- You only need simple key-value string caching.
- You need to scale caching across many CPU cores on a single machine.
- You want the simplest possible caching layer with minimal configuration.
- Your caching data is ephemeral and you do not care about persistence.

**Bottom line:**

- For most Laravel and modern web applications, **Redis is the better choice** because of its versatility and deep framework integration.
- Memcached is still a solid option if you have a narrow, high-throughput caching use case and do not need Redis's extra features.

---

## 9. Redis Persistence

By default, Redis stores everything in memory. If the Redis process crashes or the server restarts, **all data is lost** unless persistence is configured.

Redis offers **two persistence mechanisms** that can be used independently or together.

### RDB Snapshots (Redis Database)

- Creates a **point-in-time snapshot** of the entire dataset and saves it to a binary file (`dump.rdb`).
- Snapshots are taken at configured intervals (e.g., every 5 minutes if at least 100 keys changed).
- The snapshot process uses `fork()` to create a child process, so the main Redis process continues serving requests without interruption.
- Produces a single compact file that is easy to back up and transfer.

**RDB configuration:**

```conf
# redis.conf

# Save a snapshot if at least 1 key changed in 900 seconds (15 minutes)
save 900 1

# Save if at least 10 keys changed in 300 seconds (5 minutes)
save 300 10

# Save if at least 10000 keys changed in 60 seconds
save 60 10000

# The filename for the RDB snapshot
dbfilename dump.rdb

# The directory where the snapshot is stored
dir /var/lib/redis
```

**RDB pros:**

- Compact single-file backups.
- Fast restarts -- loading an RDB file is faster than replaying an AOF log.
- Minimal performance impact during normal operations.

**RDB cons:**

- **Data loss risk** -- if Redis crashes between snapshots, all changes since the last snapshot are lost.
- For example, if you snapshot every 5 minutes and Redis crashes 4 minutes after the last snapshot, you lose 4 minutes of data.

### AOF (Append-Only File)

- Logs **every write operation** to a file (`appendonly.aof`).
- When Redis restarts, it replays the AOF log to reconstruct the dataset.
- More durable than RDB because you can configure it to sync after every write.

**AOF configuration:**

```conf
# redis.conf

# Enable AOF
appendonly yes

# The filename for the AOF log
appendfilename "appendonly.aof"

# Sync policy:
# "always"    -- sync after every write (safest, slowest)
# "everysec"  -- sync once per second (good balance -- recommended)
# "no"        -- let the OS decide when to sync (fastest, least safe)
appendfsync everysec
```

**AOF pros:**

- Much more durable -- with `appendfsync everysec`, you lose at most 1 second of data.
- With `appendfsync always`, you lose zero data (but performance suffers).
- The AOF file is human-readable and can be inspected or edited.

**AOF cons:**

- AOF files are **larger** than RDB snapshots.
- Restarts are **slower** because Redis must replay the entire log.
- Can require periodic **rewriting** (compaction) to keep the file size manageable.

### Using Both Together (Recommended for Production)

- Enable **both RDB and AOF** for the best combination of durability and fast recovery.
- Redis will use the AOF file to restore data on restart (since it is more complete).
- The RDB snapshot serves as a backup and can be used for disaster recovery.

```conf
# redis.conf -- recommended production settings
save 900 1
save 300 10
save 60 10000

appendonly yes
appendfsync everysec
```

**When data is lost:**

- **No persistence** -- all data is lost on any restart or crash.
- **RDB only** -- data written since the last snapshot is lost.
- **AOF with `everysec`** -- at most 1 second of writes is lost.
- **AOF with `always`** -- no data is lost (but write performance is reduced).
- **Hardware failure** -- if the disk fails, both RDB and AOF files are lost. Use replication to another server for true high availability.

---

## 10. Redis Best Practices

### Key Naming Conventions

- Use a **colon-separated hierarchy** to organize keys (e.g., `user:1:profile`, `post:42:comments`).
- Keep key names **descriptive but concise** -- avoid excessively long keys.
- Use a consistent **prefix** for your application to avoid collisions when sharing a Redis instance (e.g., `myapp:user:1`).
- Use **singular nouns** for resources (e.g., `user:1`, not `users:1`).
- Separate concerns with different **database numbers** or **prefixes** (e.g., cache in db 1, sessions in db 2).

```php
// Good key naming
"user:1:profile"
"post:42:comments:count"
"cache:products:featured"
"queue:emails:pending"
"session:abc123"
"rate_limit:user:1:api"

// Bad key naming
"u1"              // Too cryptic
"user_profile_1"  // Inconsistent separator
"mydata"          // Not descriptive
"a very long key name that describes everything in detail" // Too long
```

### TTL (Time to Live)

- **Always set a TTL** on cache keys to prevent stale data and unbounded memory growth.
- Choose TTL values based on how frequently the underlying data changes.
- Use shorter TTLs for rapidly changing data (seconds to minutes).
- Use longer TTLs for rarely changing data (hours to days).
- Monitor cache hit rates to tune TTL values.

```php
// Rapidly changing data -- short TTL
Cache::put('dashboard:stats', $stats, now()->addMinutes(1));

// Moderately changing data -- medium TTL
Cache::put('products:featured', $products, now()->addMinutes(30));

// Rarely changing data -- long TTL
Cache::put('settings:global', $settings, now()->addHours(24));

// Static data that only changes on deploy
Cache::rememberForever('app:version', fn () => config('app.version'));
```

### Memory Management

- Monitor Redis memory usage with `INFO memory` or `redis-cli info memory`.
- Set a **maxmemory** limit to prevent Redis from consuming all available RAM.
- Configure an **eviction policy** so Redis knows what to do when memory is full.

```conf
# redis.conf

# Limit Redis to 256 MB of memory
maxmemory 256mb

# Eviction policies:
# "noeviction"       -- return errors when memory limit is reached (default)
# "allkeys-lru"      -- evict least recently used keys (recommended for caching)
# "volatile-lru"     -- evict LRU keys that have a TTL set
# "allkeys-random"   -- evict random keys
# "volatile-random"  -- evict random keys that have a TTL set
# "volatile-ttl"     -- evict keys with the shortest TTL first

maxmemory-policy allkeys-lru
```

```php
// Monitor memory usage in your application
$info = Redis::info('memory');
$usedMemory = $info['used_memory_human'];        // e.g., "128.50M"
$maxMemory  = $info['maxmemory_human'];           // e.g., "256.00M"
$peakMemory = $info['used_memory_peak_human'];    // e.g., "200.75M"
```

### Connection Pooling

- Creating a new Redis connection for every request is expensive.
- Use **persistent connections** or a **connection pool** to reuse connections.
- Laravel manages connections automatically, but you should be aware of the configuration.

```php
// config/database.php -- enable persistent connections
'redis' => [
    'client' => 'phpredis',

    'default' => [
        'host'       => env('REDIS_HOST', '127.0.0.1'),
        'port'       => env('REDIS_PORT', 6379),
        'password'   => env('REDIS_PASSWORD', null),
        'database'   => env('REDIS_DB', 0),
        'persistent' => true, // Reuse connections across requests
    ],
],
```

### General Best Practices

- **Use pipelines** for multiple commands -- send them all at once instead of one at a time to reduce network round trips.
- **Avoid large keys** -- storing huge serialized objects (multi-MB) causes slowdowns. Break them into smaller keys if needed.
- **Use `SCAN` instead of `KEYS`** -- the `KEYS` command blocks Redis while scanning the entire keyspace. `SCAN` is non-blocking and iterates incrementally.
- **Separate concerns** -- use different Redis databases or instances for caching, sessions, and queues so flushing the cache does not destroy sessions.
- **Monitor with Redis CLI** -- use `MONITOR` for debugging, `SLOWLOG` to find slow commands, and `INFO` for general health.
- **Secure your Redis instance** -- set a strong password with `requirepass`, bind to `127.0.0.1` (not `0.0.0.0`), and disable dangerous commands in production.

```php
// Pipeline -- much faster than individual commands
Redis::pipeline(function ($pipe) use ($users) {
    foreach ($users as $user) {
        $pipe->hMSet("user:{$user->id}", [
            'name'  => $user->name,
            'email' => $user->email,
        ]);
        $pipe->expire("user:{$user->id}", 3600);
    }
});

// Use SCAN instead of KEYS to find keys matching a pattern
$cursor = null;
$keys = [];
do {
    [$cursor, $results] = Redis::scan($cursor, ['match' => 'user:*', 'count' => 100]);
    $keys = array_merge($keys, $results);
} while ($cursor);
```

```conf
# redis.conf -- security settings
requirepass your_strong_password_here
bind 127.0.0.1

# Disable dangerous commands
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command KEYS ""
rename-command CONFIG ""
```

---
