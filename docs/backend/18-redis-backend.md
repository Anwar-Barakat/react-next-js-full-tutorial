# Redis for Backend Developers

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

Redis (**Remote Dictionary Server**) is an in-memory key-value store used as a cache, message broker, queue backend, and session store.

- Stores data in **RAM** — sub-millisecond response times.
- Rich data structures: strings, lists, sets, hashes, sorted sets, streams.
- **Single-threaded** command execution — no race conditions.
- Optional **persistence** to disk.

**Common use cases:** caching, session storage, job queues, rate limiting, pub/sub, leaderboards.

```bash
SET greeting "Hello, Redis!"
GET greeting              # => "Hello, Redis!"
SET token "abc123" EX 60  # expires in 60 seconds
TTL token                 # => 58
DEL greeting
```

```php
$redis = new Redis();
$redis->connect('127.0.0.1', 6379);

$redis->set('greeting', 'Hello, Redis!');
$redis->get('greeting');          // "Hello, Redis!"
$redis->setex('token', 60, 'abc123'); // expires in 60s
$redis->del('greeting');
```

---

## 2. Redis Data Types

### Strings

Holds text, numbers, or serialized data (max 512 MB).

```php
$redis->set('user:name', 'Anwar');
$redis->incr('page:views');         // atomic increment
$redis->incrBy('page:views', 10);

// Store JSON
$redis->set('user:1', json_encode(['name' => 'Anwar']));
```

### Lists

Ordered collections. Push/pop from left (head) or right (tail). Great for queues and activity feeds.

```php
$redis->rPush('queue:emails', 'email_1');
$redis->rPush('queue:emails', 'email_2');
$redis->lPop('queue:emails');               // "email_1" (FIFO)
$redis->lRange('queue:emails', 0, -1);      // all items

// Keep only last 100 items
$redis->lPush('user:1:feed', 'Posted a comment');
$redis->lTrim('user:1:feed', 0, 99);
```

### Sets

Unordered collections of **unique** strings. Supports union, intersection, difference.

```php
$redis->sAdd('post:1:tags', 'php');
$redis->sAdd('post:1:tags', 'laravel');
$redis->sAdd('post:1:tags', 'php');         // ignored (duplicate)
$redis->sMembers('post:1:tags');            // ["php", "laravel"]
$redis->sIsMember('post:1:tags', 'php');    // true

// Intersection
$redis->sInter('post:1:tags', 'post:2:tags'); // common tags
```

### Sorted Sets

Like sets, but each member has a **score**. Auto-sorted by score. Great for leaderboards.

```php
$redis->zAdd('leaderboard', 1500, 'player_a');
$redis->zAdd('leaderboard', 2300, 'player_b');
$redis->zRevRange('leaderboard', 0, 2, true); // top players with scores
$redis->zRevRank('leaderboard', 'player_b');   // 0 (first place)
$redis->zIncrBy('leaderboard', 200, 'player_a');
```

### Hashes

Field-value pairs under a single key. More memory-efficient than separate keys.

```php
$redis->hMSet('user:1', [
    'name'  => 'Anwar',
    'email' => 'anwar@example.com',
    'age'   => 28,
]);
$redis->hGet('user:1', 'name');     // "Anwar"
$redis->hGetAll('user:1');          // all fields
$redis->hIncrBy('user:1', 'age', 1); // 29
```

---

## 3. Redis as a Cache

On a cache hit, data is returned from Redis. On a cache miss, data is fetched from the DB, stored in Redis, then returned.

### TTL (Time to Live)

Always set a TTL to prevent stale data and unbounded memory growth.

```php
$redis->setex('products:featured', 300, json_encode($products)); // 5 min
Cache::put('products:featured', $products, now()->addMinutes(5));
```

### Cache Invalidation

- **TTL** — let cache expire naturally.
- **Manual** — delete the key when data changes.
- **Event-driven** — use model observers to clear cache on create/update/delete.

```php
public function update(Request $request, Product $product)
{
    $product->update($request->validated());
    Cache::forget("product:{$product->id}");
    Cache::forget('products:featured');
}
```

### Cache-Aside Pattern (Lazy Loading)

```php
// Manual approach
$cached = Cache::get("product:{$id}");
if ($cached) return $cached;

$product = Product::with('category', 'reviews')->findOrFail($id);
Cache::put("product:{$id}", $product, now()->addMinutes(30));
return $product;

// Laravel shortcut
return Cache::remember("product:{$id}", now()->addMinutes(30), function () use ($id) {
    return Product::with('category', 'reviews')->findOrFail($id);
});
```

---

## 4. Redis with Laravel

### Configuration

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

### Cache Facade

```php
use Illuminate\Support\Facades\Cache;

Cache::put('key', 'value', now()->addMinutes(10));
Cache::forever('settings:site_name', 'My App');
Cache::get('key');                    // null if not found
Cache::get('key', 'default_value');
Cache::has('key');
Cache::forget('key');
Cache::pull('key');                   // get then delete
Cache::increment('counter', 5);
Cache::add('key', 'value', now()->addMinutes(10)); // only if not exists
```

### `remember` and `rememberForever`

```php
$users = Cache::remember('users:active', now()->addHours(1), function () {
    return User::where('active', true)->with('profile')->get();
});

$settings = Cache::rememberForever('app:settings', function () {
    return Setting::all()->pluck('value', 'key');
});
```

### Cache Tags

Group related entries and flush them together. Only works with Redis/Memcached.

```php
Cache::tags(['products'])->put('products:all', $all, now()->addHours(1));
Cache::tags(['products'])->flush(); // clears all product caches

// Observer pattern
class ProductObserver
{
    public function updated(Product $product): void
    {
        Cache::tags(['products'])->flush();
    }
}
```

### Using Redis Directly

```php
use Illuminate\Support\Facades\Redis;

// Rate limiting
$key = "rate_limit:user:{$userId}";
$requests = Redis::incr($key);
if ($requests === 1) Redis::expire($key, 60);
if ($requests > 100) abort(429, 'Too many requests.');

// Pipeline -- multiple commands in one round trip
Redis::pipeline(function ($pipe) {
    $pipe->set('key1', 'value1');
    $pipe->set('key2', 'value2');
});
```

---

## 5. Redis for Queues

Redis is the most popular Laravel queue driver — fast, reliable, supports delays, retries, and priorities.

### Configuration

```env
QUEUE_CONNECTION=redis
```

### Dispatching Jobs

```php
class SendWelcomeEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(public User $user) {}

    public function handle(): void
    {
        Mail::to($this->user->email)->send(new WelcomeMail($this->user));
    }

    public int $tries = 3;
    public int $backoff = 60;
}

SendWelcomeEmail::dispatch($user);
SendWelcomeEmail::dispatch($user)->onQueue('emails');
SendWelcomeEmail::dispatch($user)->delay(now()->addMinutes(5));
```

### Running the Worker

```bash
php artisan queue:work redis
php artisan queue:work redis --queue=high,default,low  # priority order
php artisan queue:work redis --max-jobs=1000 --memory=128
```

Jobs are pushed onto a Redis **list** (`RPUSH`). Workers pop jobs (`LPOP`/`BLPOP`). Delayed jobs use a **sorted set** with timestamps as scores.

---

## 6. Redis Pub/Sub

Publishers send messages to channels; subscribers listen. Messages are **fire-and-forget** — lost if no one is listening. Unlike queues, pub/sub **broadcasts** to all subscribers.

**Use cases:** real-time notifications, chat, live dashboards, cache invalidation across servers.

```php
// Publish
Redis::publish('notifications', json_encode([
    'type' => 'new_order',
    'message' => 'New order #1234 received!',
]));

// Subscribe (blocking)
Redis::subscribe(['notifications'], function (string $message, string $channel) {
    $data = json_decode($message, true);
    // handle the event
});
```

### Laravel Broadcasting

```php
class OrderPlaced implements ShouldBroadcast
{
    public function __construct(public Order $order) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel("user.{$this->order->user_id}")];
    }

    public function broadcastWith(): array
    {
        return ['order_id' => $this->order->id, 'total' => $this->order->total];
    }
}

event(new OrderPlaced($order));
```

```javascript
// Frontend with Laravel Echo
Echo.private(`user.${userId}`)
    .listen('OrderPlaced', (event) => {
        showNotification(`Order #${event.order_id} placed!`);
    });
```

---

## 7. Redis Sessions

Redis is faster and more scalable than file/database sessions, especially with multiple servers.

```env
SESSION_DRIVER=redis
SESSION_LIFETIME=120
```

- **File** — Slow, single-server only, no auto-expiration, no extra infra.
- **Database** — Medium speed, multi-server, no auto-expiration, no extra infra.
- **Redis** — Fast, multi-server, automatic TTL expiration, requires Redis server.

Session API stays the same regardless of driver:

```php
session(['cart_id' => $cart->id]);
$cartId = session('cart_id');
session()->flash('success', 'Product added!');
session()->forget('cart_id');
```

---

## 8. Redis vs Memcached

**Redis:**
- Data types: strings, lists, sets, hashes, sorted sets, streams.
- Persistence: yes (RDB + AOF).
- Pub/Sub, replication, deep Laravel integration (cache, queues, sessions, broadcasting).

**Memcached:**
- Strings only, no persistence, no pub/sub, no replication.
- Multithreaded, lower memory overhead for simple string caching.
- Laravel integration: cache only.

Choose Redis for most Laravel apps. Choose Memcached for simple, high-throughput string caching only.

---

## 9. Redis Persistence

### RDB Snapshots

Point-in-time snapshots saved to `dump.rdb`. Fast restarts, compact backups, but **data loss between snapshots**.

```conf
save 900 1      # snapshot if 1+ keys changed in 15 min
save 300 10     # snapshot if 10+ keys changed in 5 min
save 60 10000   # snapshot if 10000+ keys changed in 1 min
dbfilename dump.rdb
```

### AOF (Append-Only File)

Logs every write operation. More durable but larger files and slower restarts.

```conf
appendonly yes
appendfsync everysec  # lose at most 1 second of data (recommended)
# "always" = zero loss but slower | "no" = OS decides
```

### Recommended: Use Both

```conf
save 900 1
save 300 10
save 60 10000
appendonly yes
appendfsync everysec
```

- No persistence = all data lost on restart.
- RDB only = data lost since last snapshot.
- AOF `everysec` = max 1 second of data lost.
- AOF `always` = no data loss.

---

## 10. Redis Best Practices

### Key Naming

Use colon-separated hierarchy with consistent prefixes:

```
user:1:profile          post:42:comments:count
cache:products:featured queue:emails:pending
rate_limit:user:1:api   session:abc123
```

### TTL Guidelines

```php
Cache::put('dashboard:stats', $stats, now()->addMinutes(1));     // fast-changing
Cache::put('products:featured', $products, now()->addMinutes(30)); // moderate
Cache::put('settings:global', $settings, now()->addHours(24));     // rarely changes
```

### Memory Management

```conf
maxmemory 256mb
maxmemory-policy allkeys-lru  # evict least recently used (best for caching)
```

### General Tips

- **Use pipelines** for multiple commands to reduce round trips.
- **Use `SCAN` instead of `KEYS`** — `KEYS` blocks Redis.
- **Separate concerns** — different Redis databases for cache, sessions, queues.
- **Secure Redis** — set `requirepass`, bind to `127.0.0.1`, disable dangerous commands.
- **Enable persistent connections** in config: `'persistent' => true`.

```conf
# Security
requirepass your_strong_password
bind 127.0.0.1
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command KEYS ""
```
