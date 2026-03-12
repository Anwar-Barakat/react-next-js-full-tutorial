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

In-memory key-value store — data lives in RAM, so reads/writes are sub-millisecond.

**Use cases:** caching, sessions, queues, rate limiting, pub/sub, leaderboards.

```bash
SET greeting "Hello, Redis!"
GET greeting              # => "Hello, Redis!"
SET token "abc123" EX 60  # expires in 60 seconds
TTL token                 # => 58
DEL greeting
```

---

## 2. Redis Data Types

### Strings — text, numbers, JSON

```php
$redis->set('user:name', 'Anwar');
$redis->incr('page:views');
$redis->set('user:1', json_encode(['name' => 'Anwar']));
```

### Lists — ordered, push/pop from either end (queues, feeds)

```php
$redis->rPush('queue:emails', 'email_1');
$redis->lPop('queue:emails');          // "email_1" (FIFO)
$redis->lTrim('user:1:feed', 0, 99);   // keep last 100
```

### Sets — unique strings (tags, followers)

```php
$redis->sAdd('post:1:tags', 'php');
$redis->sAdd('post:1:tags', 'php');    // ignored (duplicate)
$redis->sMembers('post:1:tags');       // ["php", "laravel"]
$redis->sInter('post:1:tags', 'post:2:tags'); // common tags
```

### Sorted Sets — scored members, auto-sorted (leaderboards)

```php
$redis->zAdd('leaderboard', 1500, 'player_a');
$redis->zAdd('leaderboard', 2300, 'player_b');
$redis->zRevRange('leaderboard', 0, 2, true); // top players with scores
$redis->zIncrBy('leaderboard', 200, 'player_a');
```

### Hashes — field-value pairs under one key (user objects)

```php
$redis->hMSet('user:1', ['name' => 'Anwar', 'email' => 'anwar@example.com']);
$redis->hGet('user:1', 'name');    // "Anwar"
$redis->hGetAll('user:1');         // all fields
```

---

## 3. Redis as a Cache

```
Request → check Redis (hit → return) / (miss → fetch DB → store in Redis → return)
```

```php
// Cache-aside (lazy loading)
return Cache::remember("product:{$id}", now()->addMinutes(30), function () use ($id) {
    return Product::with('category', 'reviews')->findOrFail($id);
});
```

**Cache invalidation:**

```php
public function update(Request $request, Product $product)
{
    $product->update($request->validated());
    Cache::forget("product:{$product->id}");
}
```

**TTL:**

```php
Cache::put('products:featured', $products, now()->addMinutes(5));
```

---

## 4. Redis with Laravel

**Config (`config/database.php`):**

```php
'redis' => [
    'client'  => env('REDIS_CLIENT', 'phpredis'),
    'default' => ['host' => env('REDIS_HOST', '127.0.0.1'), 'port' => 6379, 'database' => 0],
    'cache'   => ['host' => env('REDIS_HOST', '127.0.0.1'), 'port' => 6379, 'database' => 1],
],
```

**Cache facade:**

```php
Cache::put('key', 'value', now()->addMinutes(10));
Cache::get('key', 'default');
Cache::forget('key');
Cache::pull('key');                    // get then delete
Cache::increment('counter', 5);
Cache::forever('settings', $value);
Cache::add('key', 'value', now()->addMinutes(10)); // only if not exists

Cache::remember('users:active', now()->addHours(1), fn() => User::active()->get());
Cache::rememberForever('app:settings', fn() => Setting::all()->pluck('value', 'key'));
```

**Cache tags** (flush related keys together):

```php
Cache::tags(['products'])->put('products:all', $all, now()->addHours(1));
Cache::tags(['products'])->flush();
```

**Redis directly** (rate limiting, pipelines):

```php
$requests = Redis::incr("rate_limit:user:{$userId}");
if ($requests === 1) Redis::expire("rate_limit:user:{$userId}", 60);
if ($requests > 100) abort(429);

Redis::pipeline(function ($pipe) {
    $pipe->set('key1', 'value1');
    $pipe->set('key2', 'value2');
});
```

---

## 5. Redis for Queues

```env
QUEUE_CONNECTION=redis
```

```php
class SendWelcomeEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $backoff = 60;

    public function __construct(public User $user) {}

    public function handle(): void
    {
        Mail::to($this->user->email)->send(new WelcomeMail($this->user));
    }
}

SendWelcomeEmail::dispatch($user);
SendWelcomeEmail::dispatch($user)->onQueue('emails');
SendWelcomeEmail::dispatch($user)->delay(now()->addMinutes(5));
```

```bash
php artisan queue:work redis
php artisan queue:work redis --queue=high,default,low
```

---

## 6. Redis Pub/Sub

Fire-and-forget broadcast — messages are lost if no subscriber is listening.

**Use cases:** real-time notifications, chat, live dashboards.

```php
// Publish
Redis::publish('notifications', json_encode(['type' => 'new_order', 'message' => 'Order #1234!']));

// Subscribe (blocking)
Redis::subscribe(['notifications'], function (string $message) {
    $data = json_decode($message, true);
});
```

**Laravel Broadcasting:**

```php
class OrderPlaced implements ShouldBroadcast
{
    public function __construct(public Order $order) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel("user.{$this->order->user_id}")];
    }
}

event(new OrderPlaced($order));
```

```javascript
Echo.private(`user.${userId}`).listen('OrderPlaced', (e) => {
    showNotification(`Order #${e.order_id} placed!`);
});
```

---

## 7. Redis Sessions

```env
SESSION_DRIVER=redis
SESSION_LIFETIME=120
```

- **File** — slow, single-server, no auto-expiration.
- **Database** — medium, multi-server, no auto-expiration.
- **Redis** — fast, multi-server, automatic TTL expiration.

```php
session(['cart_id' => $cart->id]);
session('cart_id');
session()->flash('success', 'Added!');
session()->forget('cart_id');
```

---

## 8. Redis vs Memcached

**Redis** — strings, lists, sets, hashes, sorted sets. Persistence, pub/sub, replication. Deep Laravel integration (cache, queues, sessions, broadcasting).

**Memcached** — strings only. No persistence, no pub/sub. Cache only in Laravel.

Use Redis for almost everything. Memcached only for simple high-throughput string caching.

---

## 9. Redis Persistence

**RDB** — snapshots. Fast restarts, some data loss between snapshots.

```conf
save 900 1
save 300 10
save 60 10000
```

**AOF** — logs every write. More durable, slower restarts.

```conf
appendonly yes
appendfsync everysec  # max 1 second of data loss
```

**Use both in production:**

```conf
save 900 1
appendonly yes
appendfsync everysec
```

---

## 10. Redis Best Practices

**Key naming — colon-separated hierarchy:**

```
user:1:profile        cache:products:featured
queue:emails:pending  rate_limit:user:1:api
```

**TTL guidelines:**

```php
Cache::put('dashboard:stats',    $stats,    now()->addMinutes(1));   // fast-changing
Cache::put('products:featured',  $products, now()->addMinutes(30));  // moderate
Cache::put('settings:global',    $settings, now()->addHours(24));    // rarely changes
```

**Memory + security:**

```conf
maxmemory 256mb
maxmemory-policy allkeys-lru

requirepass your_strong_password
bind 127.0.0.1
rename-command FLUSHALL ""
rename-command KEYS ""
```

- Use `SCAN` not `KEYS` — `KEYS` blocks Redis.
- Separate databases for cache, sessions, and queues.
- Use pipelines for multiple commands in one round trip.
