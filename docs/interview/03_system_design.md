# System Design & Live Coding Interview Guide

A comprehensive guide covering system design interview questions and live coding preparation for full-stack developers (**Laravel + Reverb + React / Inertia**).

> **Stack note:** Backend examples use Laravel (PHP) + Reverb (WebSocket). Frontend examples use React + TypeScript. For Inertia.js, data flows via `Inertia::render()` on the backend and `usePage()` / `router.visit()` on the frontend — no separate API needed.

---

## Table of Contents

### System Design Questions
1. [How to Approach a System Design Question?](#1-how-to-approach-a-system-design-question)
2. [Design a URL Shortener (like bit.ly)](#2-design-a-url-shortener-like-bitly)
3. [Design a Real-Time Chat Application](#3-design-a-real-time-chat-application)
4. [Design a News Feed / Timeline](#4-design-a-news-feed--timeline)
5. [Design an E-Commerce System](#5-design-an-e-commerce-system)
6. [Design a Notification System](#6-design-a-notification-system)
7. [Common System Design Concepts](#7-common-system-design-concepts)

### Live Coding Prep
8. [Common JavaScript Coding Challenges](#8-common-javascript-coding-challenges)
9. [Array and String Problems](#9-array-and-string-problems)
10. [React Coding Challenges](#10-react-coding-challenges)
11. [Live Coding Tips](#11-live-coding-tips)

---

## System Design Questions

---

## 1. How to Approach a System Design Question?

System design interviews test your ability to think at scale, make trade-offs, and communicate clearly. Follow this step-by-step framework every time.

**Step 1: Clarify Requirements (3-5 minutes)**
- Ask what the system needs to do (functional requirements)
- Ask what the system should NOT do (out of scope)
- Clarify who the users are and how they will use it
- Ask about expected scale: How many users? How many requests per second?
- Ask about read-heavy vs write-heavy workload
- Example questions: "Should the URL shortener support custom aliases?" or "Do we need real-time delivery or is eventual consistency okay?"

**Step 2: Estimate Scale (2-3 minutes)**
- Estimate daily active users (DAU)
- Estimate requests per second (RPS) — both reads and writes
- Estimate storage needs: How much data per record? How many records per day/year?
- Estimate bandwidth: data in vs data out
- These numbers guide your architecture decisions
- Example: 100M DAU, 10:1 read-to-write ratio, 500 bytes per record = ~50GB/day storage

**Step 3: Design High-Level Architecture (5-8 minutes)**
- Draw the main components: client, load balancer, web servers, database, cache, CDN
- Show how data flows from the user to the backend and back
- Identify the core API endpoints (REST or GraphQL)
- Choose your database type: relational (PostgreSQL/MySQL) vs NoSQL (MongoDB/DynamoDB)
- Keep it simple first — you can add complexity later

**Step 4: Deep Dive into Components (10-15 minutes)**
- Pick the most important or complex component and go deeper
- Discuss database schema design (tables, columns, indexes)
- Discuss how caching works and what you cache
- Discuss how you handle failures (retries, dead letter queues, circuit breakers)
- Discuss how you ensure data consistency
- This is where you show depth of knowledge

**Step 5: Discuss Trade-offs (3-5 minutes)**
- Every design has trade-offs — the interviewer wants to hear you reason about them
- SQL vs NoSQL: consistency vs flexibility
- Caching: speed vs stale data
- Synchronous vs asynchronous processing
- Consistency vs availability (CAP theorem)
- Monolith vs microservices
- Always explain WHY you chose one approach over another

**Common Mistakes to Avoid:**
- Jumping into the solution without clarifying requirements
- Over-engineering from the start
- Ignoring scale and just describing a small app
- Not discussing trade-offs
- Forgetting about failure scenarios

---

## 2. Design a URL Shortener (like bit.ly)

This is one of the most common system design questions. It tests your knowledge of hashing, databases, caching, and scaling.

**Functional Requirements:**
- Given a long URL, generate a short unique URL
- When a user visits the short URL, redirect to the original long URL
- Short URLs should expire after a configurable time (optional)
- Users can optionally create custom short URLs
- Track click analytics (number of clicks, location, device)

**Non-Functional Requirements:**
- The system should be highly available (redirects should never fail)
- Redirect latency should be very low (under 100ms)
- Short URLs should not be predictable (for security)
- The system should handle 100M+ URLs and 10K+ redirects per second

**Database Schema:**

```
urls table:
- id (bigint, primary key, auto-increment)
- short_code (varchar(7), unique, indexed)
- original_url (text, not null)
- user_id (bigint, nullable, foreign key)
- expires_at (timestamp, nullable)
- created_at (timestamp)
- click_count (bigint, default 0)
```

**Hashing Approach:**
- Use Base62 encoding (a-z, A-Z, 0-9) to generate a 7-character code
- 62^7 = ~3.5 trillion possible combinations — more than enough
- Option A: Hash the URL with MD5/SHA-256, then take the first 7 characters in Base62
- Option B: Use an auto-incrementing ID and convert it to Base62
- Option C: Generate a random 7-character Base62 string and check for collisions
- Option B is simplest and guarantees no collisions, but URLs are predictable
- Option A can have collisions — handle them by appending a counter and re-hashing

```typescript
// Base62 encoding from numeric ID
function encodeBase62(num: number): string {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  while (num > 0) {
    result = chars[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result.padStart(7, "0");
}

// Generate short URL from auto-increment ID
function createShortUrl(id: number): string {
  const shortCode = encodeBase62(id);
  return `https://short.ly/${shortCode}`;
}
```

**Redirect Flow:**
- User visits `https://short.ly/abc1234`
- Load balancer routes to a web server
- Web server checks Redis cache for the short code
- If cache hit: return 301/302 redirect immediately
- If cache miss: query the database, store result in cache, return redirect
- Use HTTP 301 (permanent redirect) if SEO matters, or 302 (temporary redirect) if you want to track every click

```typescript
// Redirect endpoint (Express/Next.js API route)
async function handleRedirect(shortCode: string): Promise<string | null> {
  // Step 1: Check cache
  const cached = await redis.get(`url:${shortCode}`);
  if (cached) return cached;

  // Step 2: Query database
  const record = await db.query(
    "SELECT original_url FROM urls WHERE short_code = ? AND (expires_at IS NULL OR expires_at > NOW())",
    [shortCode]
  );

  if (!record) return null;

  // Step 3: Update cache (expire after 1 hour)
  await redis.setex(`url:${shortCode}`, 3600, record.original_url);

  // Step 4: Increment click count asynchronously
  await messageQueue.publish("click_events", { shortCode, timestamp: Date.now() });

  return record.original_url;
}
```

**Scaling Considerations:**
- Use Redis as a caching layer — most URLs are read frequently, so cache hit ratio will be high
- Partition the database by short code (consistent hashing) to distribute load
- Use a separate analytics service with a message queue (Kafka) to process click events asynchronously
- Deploy servers in multiple regions with a global load balancer for low latency
- Use a CDN for serving the redirect if possible
- Rate limit URL creation to prevent abuse

---

## 3. Design a Real-Time Chat Application

This tests your knowledge of WebSockets, message storage, real-time systems, and scaling stateful connections.

**Functional Requirements:**
- Users can send one-on-one messages in real time
- Users can create and participate in group chats
- Messages are delivered in order and persisted
- Users can see who is online/offline
- Users can see "typing..." indicators
- Message read receipts (delivered, read)
- Support for images and files (optional)

**Non-Functional Requirements:**
- Messages should be delivered in under 500ms
- The system should support millions of concurrent connections
- Messages should never be lost
- The system should work across mobile and web clients
- Message history should be available on any device

**WebSocket vs Polling:**
- **Long Polling:** Client holds request open until new data arrives. Simple but wastes server resources.
- **Server-Sent Events (SSE):** Server pushes data one-way (server → client). Not ideal for chat.
- **WebSocket:** Full-duplex, persistent connection. Best for real-time chat.
- **Recommendation:** Use WebSocket for messages and typing. Use REST for message history and profiles.

**In Your Stack — Laravel + Reverb:**

```php
// 1. Broadcasting Event: app/Events/MessageSent.php
class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets;

    public function __construct(public Message $message) {}

    public function broadcastOn(): array
    {
        return [new PrivateChannel('chat.' . $this->message->chat_id)];
    }

    public function broadcastAs(): string
    {
        return 'message.sent';
    }
}

// 2. ChatController — send message & broadcast
class ChatController extends Controller
{
    public function store(Request $request, Chat $chat): JsonResponse
    {
        $request->validate(['content' => 'required|string|max:1000']);

        $message = $chat->messages()->create([
            'user_id' => auth()->id(),
            'content' => $request->content,
        ]);

        broadcast(new MessageSent($message))->toOthers();

        return response()->json($message, 201);
    }
}

// 3. Typing indicator — broadcast without saving
class TypingController extends Controller
{
    public function typing(Request $request, Chat $chat): JsonResponse
    {
        broadcast(new UserTyping($chat->id, auth()->id()))->toOthers();
        return response()->json(['status' => 'ok']);
    }
}
```

```tsx
// React frontend — Laravel Echo + Reverb
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Configure Echo to use Reverb (in bootstrap.js or app.ts)
window.Pusher = Pusher;
const echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
});

// Listen for messages in a chat component
function ChatWindow({ chatId }: { chatId: number }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        const channel = echo.private(`chat.${chatId}`);

        channel
            .listen('.message.sent', (e: { message: Message }) => {
                setMessages(prev => [...prev, e.message]);
            })
            .listenForWhisper('typing', () => {
                setIsTyping(true);
                setTimeout(() => setIsTyping(false), 2000);
            });

        return () => echo.leave(`chat.${chatId}`);
    }, [chatId]);

    const sendTyping = () => {
        echo.private(`chat.${chatId}`).whisper('typing', {});
    };

    return (/* render messages + typing indicator */);
}
```

**Message Storage:**
- Use a relational database (PostgreSQL) for structured data: users, chats, chat_members
- Use a NoSQL database (Cassandra or DynamoDB) for messages — optimized for time-series writes and reads
- Messages are partitioned by chat_id and sorted by timestamp
- Index on (chat_id, created_at) for efficient message history queries
- Store media files (images, videos) in object storage (S3) and save the URL in the message record

**Online Status:**
- When a user connects via WebSocket, mark them as online in Redis with a TTL (e.g., 60 seconds)
- The client sends a heartbeat every 30 seconds to refresh the TTL
- If the TTL expires, the user is considered offline
- Use Redis Pub/Sub to broadcast status changes to users who are viewing a contact list

**Scaling:**
- WebSocket connections are stateful, so you cannot simply add more servers behind a load balancer
- Use a sticky session or connection routing layer that maps each user to a specific server
- Use Redis Pub/Sub or Kafka to relay messages between servers when sender and recipient are on different servers
- Horizontal scaling: each server handles ~50K-100K WebSocket connections
- Use connection gateways (like API Gateway for WebSocket) to manage connections at scale
- Separate the chat service (real-time) from the history service (REST API for fetching old messages)

---

## 4. Design a News Feed / Timeline

This tests your understanding of data fan-out, caching, ranking algorithms, and read-heavy systems.

**Functional Requirements:**
- Users can create posts (text, images, videos)
- Users follow other users
- Each user sees a personalized feed of posts from people they follow
- Feed is sorted by relevance (not just chronological)
- Users can like, comment, and share posts
- Feed supports pagination (infinite scroll)

**Non-Functional Requirements:**
- Feed should load in under 200ms
- System should handle 500M+ users
- Feed should feel "fresh" — new posts appear quickly
- The system must be highly available

**Fan-Out on Write vs Fan-Out on Read:**

- **Fan-Out on Write (Push Model):**
  - When a user creates a post, immediately push it to the feed cache of every follower
  - Pros: Feed reads are extremely fast (just read from cache)
  - Cons: Expensive for users with millions of followers (celebrity problem)
  - Cons: Wasted work if many followers never check their feed
  - Best for: Users with a small-to-medium number of followers

- **Fan-Out on Read (Pull Model):**
  - When a user opens their feed, query the posts from all the people they follow in real time
  - Pros: No wasted work; only compute when the user requests
  - Cons: Feed reads are slow because you need to query many sources and merge/sort
  - Best for: Users who follow a small number of people, or celebrity posts

- **Hybrid Approach (Recommended):**
  - For normal users (< 10K followers): use fan-out on write (push)
  - For celebrities (> 10K followers): use fan-out on read (pull)
  - When a user opens their feed, merge the pre-computed feed with any celebrity posts fetched on-the-fly
  - This is the approach used by Twitter/X and Instagram

```typescript
// Fan-out on write: when a user creates a post
async function createPost(userId: string, content: string) {
  // 1. Save post to database
  const post = await db.posts.create({ userId, content, createdAt: new Date() });

  // 2. Get the follower count
  const followerCount = await db.followers.count({ followingId: userId });

  if (followerCount < 10000) {
    // 3a. Fan-out on write for normal users
    const followers = await db.followers.findAll({ followingId: userId });
    for (const follower of followers) {
      await redis.zadd(`feed:${follower.followerId}`, Date.now(), JSON.stringify(post));
      // Trim feed to keep only the latest 1000 posts
      await redis.zremrangebyrank(`feed:${follower.followerId}`, 0, -1001);
    }
  } else {
    // 3b. Celebrity — skip fan-out, will be pulled on read
    await redis.sadd("celebrity_users", userId);
  }

  return post;
}

// Fetch feed: merge pre-computed feed with celebrity posts
async function getFeed(userId: string, page: number, pageSize: number) {
  const start = page * pageSize;
  const end = start + pageSize - 1;

  // 1. Get pre-computed feed from cache
  const cachedFeed = await redis.zrevrange(`feed:${userId}`, start, end);
  const feedPosts = cachedFeed.map((item: string) => JSON.parse(item));

  // 2. Get celebrity posts (fan-out on read)
  const followedCelebrities = await getFollowedCelebrities(userId);
  const celebrityPosts = await db.posts.findAll({
    where: { userId: { in: followedCelebrities } },
    orderBy: { createdAt: "desc" },
    limit: pageSize,
  });

  // 3. Merge and sort by timestamp (or ranking score)
  const merged = [...feedPosts, ...celebrityPosts]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, pageSize);

  return merged;
}
```

**Caching:**
- Each user's feed is cached as a sorted set in Redis (sorted by timestamp or ranking score)
- Cache the latest 1000 posts per user
- Use a TTL on the feed cache to ensure freshness (e.g., 24 hours)
- Cache popular posts and user profiles separately to reduce database load
- Use a CDN to serve images and video thumbnails

**Ranking:**
- A simple chronological feed is the baseline
- Add a ranking score based on: recency, engagement (likes, comments, shares), relationship strength (how often you interact with this person), content type preference
- Use a lightweight ML model or a scoring formula to compute the ranking score
- Example formula: `score = recency_weight * recency + engagement_weight * engagement + relationship_weight * relationship`
- Recompute scores periodically or on feed fetch

---

## 5. Design an E-Commerce System

This is a very practical question, especially for Laravel + React developers who build real-world applications.

**Functional Requirements:**
- Users can browse a product catalog with categories and search
- Users can add products to a shopping cart
- Users can checkout and pay (credit card, PayPal, etc.)
- Order management: users see order history, admins manage orders
- Inventory management: track stock levels
- Product reviews and ratings

**Non-Functional Requirements:**
- Handle flash sales and traffic spikes (Black Friday)
- Payments must be secure and reliable (PCI compliance)
- Inventory counts must be accurate (no overselling)
- The system should be available 99.9% of the time
- Search should be fast and relevant

**Product Catalog:**
- Store products in a relational database (PostgreSQL/MySQL)
- Use Elasticsearch or Laravel Scout for fast full-text search with filters
- Cache frequently viewed products in Redis
- Use a CDN to serve product images

**Cart:**
- For logged-in users: store in database (persists across devices)
- For guests: store in session or localStorage
- Use optimistic updates on the frontend

**Checkout Flow:**
1. User reviews cart and enters address
2. System calculates totals
3. Creates pending order, reserves inventory
4. Processes payment via Stripe
5. Webhook confirms — order status → confirmed
6. Payment failure → release inventory

**Payment Integration:**
- Never handle raw card data — use Stripe SDKs
- Use Stripe Payment Intents (SCA-compliant)
- Use webhooks for asynchronous payment status updates
- Use idempotency keys to prevent double charges

**In Your Stack — Laravel + Stripe:**

```php
// CartController.php
class CartController extends Controller
{
    public function add(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($request->product_id);
        abort_if($product->stock < $request->quantity, 422, 'Out of stock');

        $cart = Cart::firstOrCreate(['user_id' => auth()->id()]);

        $cart->items()->updateOrCreate(
            ['product_id' => $product->id],
            ['quantity'   => DB::raw('quantity + ' . $request->quantity), 'price' => $product->price]
        );

        return response()->json($cart->load('items.product'));
    }
}

// CheckoutController.php — Stripe + atomic inventory
class CheckoutController extends Controller
{
    public function store(CheckoutRequest $request): JsonResponse
    {
        $order = DB::transaction(function () {
            $cart = Cart::with('items.product')
                        ->where('user_id', auth()->id())
                        ->firstOrFail();

            // Atomic stock decrement — prevents overselling
            foreach ($cart->items as $item) {
                $updated = Product::where('id', $item->product_id)
                                  ->where('stock', '>=', $item->quantity)
                                  ->decrement('stock', $item->quantity);

                abort_if($updated === 0, 422, "{$item->product->name} is out of stock");
            }

            return Order::create([
                'user_id' => auth()->id(),
                'total'   => $cart->total,
                'status'  => 'payment_pending',
            ]);
        });

        $intent = \Stripe\PaymentIntent::create([
            'amount'   => $order->total * 100,
            'currency' => 'usd',
            'metadata' => ['order_id' => $order->id],
        ]);

        $order->update(['stripe_payment_intent_id' => $intent->id]);

        return response()->json(['client_secret' => $intent->client_secret]);
    }
}

// StripeWebhookController.php
class StripeWebhookController extends Controller
{
    public function handle(Request $request): Response
    {
        $event = \Stripe\Webhook::constructEvent(
            $request->getContent(),
            $request->header('Stripe-Signature'),
            config('services.stripe.webhook_secret')
        );

        match ($event->type) {
            'payment_intent.succeeded' => $this->handleSuccess($event->data->object),
            'payment_intent.payment_failed' => $this->handleFailed($event->data->object),
            default => null,
        };

        return response('', 200);
    }

    private function handleSuccess(object $intent): void
    {
        $order = Order::where('stripe_payment_intent_id', $intent->id)->firstOrFail();
        $order->update(['status' => 'confirmed']);
        $order->user->notify(new OrderConfirmed($order));
    }

    private function handleFailed(object $intent): void
    {
        $order = Order::where('stripe_payment_intent_id', $intent->id)->firstOrFail();
        $order->update(['status' => 'payment_failed']);

        // Release reserved inventory
        foreach ($order->items as $item) {
            Product::where('id', $item->product_id)->increment('stock', $item->quantity);
        }
    }
}
```

**Order Management:**
- Order statuses: pending -> payment_pending -> confirmed -> processing -> shipped -> delivered -> completed
- Each status change creates an event in an order_events table (audit trail)
- Admins can view, filter, and manage orders through a dashboard
- Users can view their order history and track shipment status
- Use a state machine pattern to enforce valid status transitions

**Inventory — Preventing Overselling:**
- Use database-level atomic operations: `UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?`
- If the affected row count is 0, the product is out of stock
- For flash sales: pre-load stock counts into Redis and use `DECR` for atomic decrements (much faster than database)
- Use distributed locks (Redis SETNX) for checkout operations on high-demand items

---

## 6. Design a Notification System

This tests your understanding of multi-channel delivery, queue-based processing, and user preferences.

**Functional Requirements:**
- Send notifications via multiple channels: push notifications, email, SMS, and in-app
- Users can configure notification preferences (which channels, which event types)
- Notifications should be delivered reliably and in order
- Users can view notification history in-app
- Support for real-time in-app notifications
- Rate limiting to prevent notification spam

**Non-Functional Requirements:**
- Handle millions of notifications per day
- Delivery latency: in-app < 1 second, push < 5 seconds, email < 1 minute, SMS < 1 minute
- No duplicate notifications
- System should be fault-tolerant (if email service is down, retry later)

**Channels:**
- **Push Notifications:** Use Firebase Cloud Messaging (FCM) for Android/web, Apple Push Notification Service (APNs) for iOS. Store device tokens per user.
- **Email:** Use a transactional email service (SendGrid, AWS SES, Mailgun). Use templates for consistent formatting.
- **SMS:** Use Twilio or AWS SNS. Expensive, so use only for critical notifications (OTP, security alerts).
- **In-App:** Store in a notifications table. Deliver in real time via WebSocket. Show unread count badge.

**Queue-Based Processing:**

**In Your Stack — Laravel Notifications + Queue + Reverb:**

```php
// app/Notifications/OrderConfirmed.php
class OrderConfirmed extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Order $order) {}

    // Define channels — can be per-user based on preferences
    public function via(object $notifiable): array
    {
        return ['mail', 'database', 'broadcast'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Order Confirmed — #' . $this->order->id)
            ->line('Your order has been confirmed.')
            ->action('View Order', url('/orders/' . $this->order->id));
    }

    // Stored in notifications table (in-app)
    public function toArray(object $notifiable): array
    {
        return [
            'order_id' => $this->order->id,
            'status'   => 'confirmed',
            'message'  => 'Your order has been confirmed.',
        ];
    }

    // Broadcast in real time via Reverb
    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'order_id' => $this->order->id,
            'message'  => 'Order confirmed!',
        ]);
    }
}

// Send notification (queued automatically via ShouldQueue)
$user->notify(new OrderConfirmed($order));

// Send to many users
Notification::send($users, new BulkPromo($promo));

// Mark as read
$user->unreadNotifications->markAsRead();
```

```tsx
// React — listen for real-time notifications via Reverb
function NotificationBell({ userId }: { userId: number }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unread, setUnread] = useState(0);

    useEffect(() => {
        // Laravel auto-creates a private channel per user for notifications
        const channel = echo.private(`App.Models.User.${userId}`);

        channel.notification((notification: Notification) => {
            setNotifications(prev => [notification, ...prev]);
            setUnread(prev => prev + 1);
        });

        return () => echo.leave(`App.Models.User.${userId}`);
    }, [userId]);

    return (
        <button>
            Bell {unread > 0 && <span>{unread}</span>}
        </button>
    );
}
```

```php
// Rate limiting — prevent notification spam
// In AppServiceProvider.php or a Job middleware
RateLimiter::for('notifications', function (object $job) {
    return Limit::perHour(10)->by($job->notifiable->id);
});
```

**User Preferences:**
- Allow users to choose which event types they want notifications for (e.g., marketing: off, security: all channels)
- Allow users to choose preferred channels per event type
- Store preferences in a user_notification_preferences table
- Always send security-critical notifications (password reset, suspicious login) regardless of preferences
- Provide a global "mute all" option and quiet hours

**Reliability and Retry:**
- Use a message queue (RabbitMQ, Kafka, or AWS SQS) with acknowledgment-based delivery
- If a worker fails to process a notification, the queue retries automatically
- Set a maximum retry count (e.g., 3 retries with exponential backoff)
- After max retries, move the failed notification to a dead letter queue for manual review
- Use idempotency: before sending, check if this notification was already sent (by unique notification ID)

---

## 7. Common System Design Concepts

These concepts come up in almost every system design interview. Know them well.

**Load Balancing:**
- Distributes incoming traffic across multiple servers to prevent any single server from being overwhelmed
- Types: Round Robin (simple rotation), Least Connections (send to the server with fewest active connections), IP Hash (consistent routing based on client IP), Weighted (send more traffic to more powerful servers)
- Tools: Nginx, HAProxy, AWS ALB/ELB, Cloudflare
- Health checks: the load balancer regularly pings servers and stops routing to unhealthy ones
- Layer 4 (TCP) vs Layer 7 (HTTP) load balancing — Layer 7 can make smarter decisions based on URL, headers, cookies

**Caching:**
- Store frequently accessed data in a fast storage layer to reduce database load
- **Redis:** In-memory key-value store. Use for session storage, rate limiting, leaderboards, real-time counters, caching database queries. Supports data structures (strings, lists, sets, sorted sets, hashes).
- **CDN (Content Delivery Network):** Serves static assets (images, CSS, JS) from edge servers close to the user. Tools: Cloudflare, AWS CloudFront, Vercel Edge Network.
- **Application-level cache:** Cache API responses, computed results, or database queries in memory (Node.js Map, LRU cache).
- Cache invalidation strategies: TTL (time-to-live), write-through (update cache on every write), write-behind (batch updates), cache-aside (app manages the cache).
- Cache invalidation is one of the hardest problems in computer science — always think about stale data.

**Database Sharding:**
- Split a large database into smaller pieces (shards) distributed across multiple servers
- Each shard holds a subset of the data (e.g., users A-M on shard 1, N-Z on shard 2)
- Sharding key: the field used to determine which shard a record goes to (e.g., user_id, region)
- Horizontal sharding: split rows across servers (most common)
- Vertical sharding: split columns/tables across servers (less common)
- Challenges: cross-shard queries are expensive, rebalancing shards when data grows unevenly, maintaining referential integrity
- Use consistent hashing to minimize data movement when adding/removing shards

**Horizontal vs Vertical Scaling:**
- **Vertical Scaling (Scale Up):** Add more CPU, RAM, or disk to a single server. Simpler but has a hardware limit. Good for databases.
- **Horizontal Scaling (Scale Out):** Add more servers. More complex but virtually unlimited. Good for stateless web servers and API servers.
- Most real-world systems use both: scale up the database and scale out the application servers
- Stateless services are easy to scale horizontally; stateful services (WebSocket, sessions) require sticky sessions or shared state (Redis)

**Message Queues:**
- Decouple producers (services that create work) from consumers (services that process work)
- Enable asynchronous processing: the producer does not wait for the consumer to finish
- **RabbitMQ:** Traditional message broker. Supports routing, priority queues, and acknowledgments. Good for task queues and microservice communication.
- **Kafka:** Distributed event streaming platform. Designed for high throughput and durability. Messages are persisted to disk. Good for event-driven architectures, logging, and real-time data pipelines.
- Key concepts: topics/queues, producers, consumers, consumer groups, acknowledgments, dead letter queues
- Use cases: sending emails, processing payments, generating reports, syncing data between services

**CAP Theorem Simplified:**
- In a distributed system, you can only guarantee two out of three properties:
  - **C (Consistency):** Every read returns the most recent write. All nodes see the same data at the same time.
  - **A (Availability):** Every request gets a response (even if it might be stale data).
  - **P (Partition Tolerance):** The system continues to work even if network communication between nodes is lost.
- Since network partitions are unavoidable in distributed systems, the real choice is between **CP** and **AP**:
  - **CP (Consistency + Partition Tolerance):** During a partition, the system may refuse some requests to maintain consistency. Example: banking systems, inventory management.
  - **AP (Availability + Partition Tolerance):** During a partition, the system stays available but may return stale data. Example: social media feeds, DNS.
- In practice, most systems choose eventual consistency (AP) for most features and strong consistency (CP) only where it matters (payments, inventory).

**Database Indexing:**
- An index is a data structure (usually B-tree or hash) that speeds up data retrieval at the cost of slower writes and extra storage
- Without an index, the database must scan every row (full table scan) — O(n)
- With an index, the database can find data in O(log n) — dramatically faster for large tables
- Index the columns you frequently query: WHERE clauses, JOIN conditions, ORDER BY columns
- Composite index: an index on multiple columns — order matters (leftmost prefix rule)
- Too many indexes slow down INSERT/UPDATE operations because each index must be updated
- Use EXPLAIN/ANALYZE to see how the database executes a query and whether it uses an index

```sql
-- Creating indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at DESC);

-- Composite index usage
-- This query uses the index:
SELECT * FROM orders WHERE user_id = 123 ORDER BY created_at DESC;

-- This query does NOT use the composite index (missing leftmost column):
SELECT * FROM orders WHERE created_at > '2025-01-01';
```

---

## Live Coding Prep

---

## 8. Common JavaScript Coding Challenges

These are the most frequently asked coding challenges in JavaScript interviews. Practice until you can write them from memory.

**Implement Debounce:**
- Debounce delays the execution of a function until after a specified time has passed since the last call
- Use case: search input — only send API request after the user stops typing

```typescript
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    // Clear the previous timer
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    // Set a new timer
    timeoutId = setTimeout(() => {
      func.apply(this, args);
      timeoutId = null;
    }, delay);
  };
}

// Usage
const debouncedSearch = debounce((query: string) => {
  console.log("Searching for:", query);
  // API call here
}, 300);

debouncedSearch("h");
debouncedSearch("he");
debouncedSearch("hel");
debouncedSearch("hello"); // Only this one executes after 300ms
```

**Implement Throttle:**
- Throttle ensures a function is called at most once every specified interval
- Use case: scroll events, resize events, rate limiting button clicks

```typescript
function throttle<T extends (...args: any[]) => any>(
  func: T,
  interval: number
): (...args: Parameters<T>) => void {
  let lastCallTime = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;

    if (timeSinceLastCall >= interval) {
      // Enough time has passed — execute immediately
      lastCallTime = now;
      func.apply(this, args);
    } else if (!timeoutId) {
      // Schedule execution for the remaining time
      timeoutId = setTimeout(() => {
        lastCallTime = Date.now();
        func.apply(this, args);
        timeoutId = null;
      }, interval - timeSinceLastCall);
    }
  };
}

// Usage
const throttledScroll = throttle(() => {
  console.log("Scroll event processed");
}, 200);

window.addEventListener("scroll", throttledScroll);
```

**Flatten an Array:**
- Convert a nested array into a single-level array

```typescript
// Recursive approach
function flatten<T>(arr: (T | T[])[]): T[] {
  const result: T[] = [];

  for (const item of arr) {
    if (Array.isArray(item)) {
      result.push(...flatten(item));
    } else {
      result.push(item);
    }
  }

  return result;
}

// Iterative approach using a stack
function flattenIterative<T>(arr: (T | T[])[]): T[] {
  const stack = [...arr];
  const result: T[] = [];

  while (stack.length > 0) {
    const item = stack.pop()!;
    if (Array.isArray(item)) {
      stack.push(...item);
    } else {
      result.push(item);
    }
  }

  return result.reverse();
}

// Usage
console.log(flatten([1, [2, [3, [4]], 5]])); // [1, 2, 3, 4, 5]

// Built-in (know this exists, but interviewers want you to implement it)
// [1, [2, [3]]].flat(Infinity)
```

**Deep Clone an Object:**
- Create a true copy of an object, including nested objects and arrays

```typescript
function deepClone<T>(obj: T): T {
  // Handle null, undefined, and primitives
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  // Handle Date
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  // Handle Array
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as T;
  }

  // Handle RegExp
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags) as T;
  }

  // Handle Object
  const cloned = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }

  return cloned;
}

// Usage
const original = {
  name: "John",
  address: { city: "NYC", zip: "10001" },
  hobbies: ["reading", "coding"],
  birthDate: new Date("1990-01-01"),
};

const cloned = deepClone(original);
cloned.address.city = "LA";
console.log(original.address.city); // "NYC" — original is unchanged

// Quick alternative (loses functions, dates, regex):
// JSON.parse(JSON.stringify(obj))

// Modern alternative:
// structuredClone(obj)
```

**Implement Promise.all:**
- Takes an array of promises and returns a single promise that resolves when all input promises resolve, or rejects if any one rejects

```typescript
function promiseAll<T>(promises: Promise<T>[]): Promise<T[]> {
  return new Promise((resolve, reject) => {
    // Handle empty array
    if (promises.length === 0) {
      resolve([]);
      return;
    }

    const results: T[] = new Array(promises.length);
    let resolvedCount = 0;

    promises.forEach((promise, index) => {
      // Wrap in Promise.resolve to handle non-promise values
      Promise.resolve(promise)
        .then((value) => {
          results[index] = value; // Maintain order
          resolvedCount++;

          if (resolvedCount === promises.length) {
            resolve(results);
          }
        })
        .catch((error) => {
          reject(error); // Reject immediately on first failure
        });
    });
  });
}

// Usage
async function example() {
  const results = await promiseAll([
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3),
  ]);
  console.log(results); // [1, 2, 3]

  try {
    await promiseAll([
      Promise.resolve(1),
      Promise.reject("Error!"),
      Promise.resolve(3),
    ]);
  } catch (error) {
    console.log(error); // "Error!"
  }
}
```

---

## 9. Array and String Problems

These problems test your understanding of algorithms, data structures, and JavaScript fundamentals.

**Reverse a String:**

```typescript
// Method 1: Built-in
function reverseString(str: string): string {
  return str.split("").reverse().join("");
}

// Method 2: Two pointers (in-place for array)
function reverseStringInPlace(chars: string[]): void {
  let left = 0;
  let right = chars.length - 1;

  while (left < right) {
    [chars[left], chars[right]] = [chars[right], chars[left]];
    left++;
    right--;
  }
}

// Method 3: Iterative
function reverseStringLoop(str: string): string {
  let result = "";
  for (let i = str.length - 1; i >= 0; i--) {
    result += str[i];
  }
  return result;
}

console.log(reverseString("hello")); // "olleh"
```

**Find Duplicates in an Array:**

```typescript
// Method 1: Using Set
function findDuplicates<T>(arr: T[]): T[] {
  const seen = new Set<T>();
  const duplicates = new Set<T>();

  for (const item of arr) {
    if (seen.has(item)) {
      duplicates.add(item);
    } else {
      seen.add(item);
    }
  }

  return Array.from(duplicates);
}

// Method 2: Using frequency map
function findDuplicatesMap<T>(arr: T[]): T[] {
  const frequency = new Map<T, number>();

  for (const item of arr) {
    frequency.set(item, (frequency.get(item) || 0) + 1);
  }

  return Array.from(frequency.entries())
    .filter(([_, count]) => count > 1)
    .map(([item]) => item);
}

console.log(findDuplicates([1, 2, 3, 2, 4, 5, 1])); // [2, 1]
```

**Two Sum:**
- Given an array of numbers and a target, find two numbers that add up to the target

```typescript
// O(n) solution using a hash map
function twoSum(nums: number[], target: number): [number, number] | null {
  const map = new Map<number, number>(); // value -> index

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }

    map.set(nums[i], i);
  }

  return null;
}

console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1] (because 2 + 7 = 9)
console.log(twoSum([3, 2, 4], 6));      // [1, 2] (because 2 + 4 = 6)
```

**Anagram Check:**
- Two strings are anagrams if they contain the same characters in different order

```typescript
// Method 1: Sort and compare
function isAnagram(str1: string, str2: string): boolean {
  if (str1.length !== str2.length) return false;

  const sorted1 = str1.toLowerCase().split("").sort().join("");
  const sorted2 = str2.toLowerCase().split("").sort().join("");

  return sorted1 === sorted2;
}

// Method 2: Character frequency (O(n), no sorting)
function isAnagramOptimal(str1: string, str2: string): boolean {
  if (str1.length !== str2.length) return false;

  const charCount = new Map<string, number>();

  for (const char of str1.toLowerCase()) {
    charCount.set(char, (charCount.get(char) || 0) + 1);
  }

  for (const char of str2.toLowerCase()) {
    const count = charCount.get(char);
    if (!count) return false;
    charCount.set(char, count - 1);
  }

  return true;
}

console.log(isAnagram("listen", "silent")); // true
console.log(isAnagram("hello", "world"));   // false
```

**Palindrome Check:**
- A string that reads the same forward and backward

```typescript
// Method 1: Simple
function isPalindrome(str: string): boolean {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  return cleaned === cleaned.split("").reverse().join("");
}

// Method 2: Two pointers (more efficient, no extra string creation)
function isPalindromeOptimal(str: string): boolean {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  let left = 0;
  let right = cleaned.length - 1;

  while (left < right) {
    if (cleaned[left] !== cleaned[right]) return false;
    left++;
    right--;
  }

  return true;
}

console.log(isPalindrome("racecar"));              // true
console.log(isPalindrome("A man, a plan, a canal: Panama")); // true
console.log(isPalindrome("hello"));                 // false
```

---

## 10. React Coding Challenges

These are the most common React live coding challenges. You need to build them quickly and cleanly.

**Build a Todo App:**

```tsx
import { useState } from "react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");

  const addTodo = () => {
    const text = input.trim();
    if (!text) return;

    setTodos((prev) => [
      ...prev,
      { id: Date.now(), text, completed: false },
    ]);
    setInput("");
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") addTodo();
  };

  return (
    <div>
      <h1>Todo App</h1>

      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a todo..."
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            <span
              style={{
                textDecoration: todo.completed ? "line-through" : "none",
              }}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>

      <p>
        {todos.filter((t) => !t.completed).length} of {todos.length} remaining
      </p>
    </div>
  );
}
```

**Build a Search with Debounce:**

```tsx
import { useState, useEffect, useCallback } from "react";

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

interface User {
  id: number;
  name: string;
  email: string;
}

export default function SearchWithDebounce() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    async function fetchResults() {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/users/search?q=${encodeURIComponent(debouncedQuery)}`,
          { signal: controller.signal }
        );
        const data = await response.json();
        setResults(data);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return; // Request was cancelled — ignore
        }
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();

    // Cleanup: abort the request if the query changes before it completes
    return () => controller.abort();
  }, [debouncedQuery]);

  return (
    <div>
      <h1>User Search</h1>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users..."
      />

      {loading && <p>Loading...</p>}

      <ul>
        {results.map((user) => (
          <li key={user.id}>
            {user.name} — {user.email}
          </li>
        ))}
      </ul>

      {!loading && debouncedQuery && results.length === 0 && (
        <p>No results found.</p>
      )}
    </div>
  );
}
```

**Build a Counter with Hooks:**

```tsx
import { useState, useReducer, useCallback } from "react";

// Version 1: Simple counter with useState
export function SimpleCounter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>Simple Counter: {count}</h2>
      <button onClick={() => setCount((prev) => prev - 1)}>-</button>
      <button onClick={() => setCount(0)}>Reset</button>
      <button onClick={() => setCount((prev) => prev + 1)}>+</button>
    </div>
  );
}

// Version 2: Advanced counter with useReducer
type CounterAction =
  | { type: "increment" }
  | { type: "decrement" }
  | { type: "reset" }
  | { type: "set"; payload: number };

interface CounterState {
  count: number;
  history: number[];
}

function counterReducer(state: CounterState, action: CounterAction): CounterState {
  switch (action.type) {
    case "increment":
      return {
        count: state.count + 1,
        history: [...state.history, state.count + 1],
      };
    case "decrement":
      return {
        count: state.count - 1,
        history: [...state.history, state.count - 1],
      };
    case "reset":
      return { count: 0, history: [...state.history, 0] };
    case "set":
      return {
        count: action.payload,
        history: [...state.history, action.payload],
      };
    default:
      return state;
  }
}

export function AdvancedCounter() {
  const [state, dispatch] = useReducer(counterReducer, {
    count: 0,
    history: [0],
  });

  return (
    <div>
      <h2>Advanced Counter: {state.count}</h2>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
      <button onClick={() => dispatch({ type: "reset" })}>Reset</button>
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <p>History: {state.history.join(" -> ")}</p>
    </div>
  );
}
```

**Implement Infinite Scroll:**

```tsx
import { useState, useEffect, useRef, useCallback } from "react";

interface Post {
  id: number;
  title: string;
  body: string;
}

export default function InfiniteScroll() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Fetch posts for the current page
  const fetchPosts = useCallback(async (pageNum: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/posts?page=${pageNum}&limit=10`
      );
      const data: Post[] = await response.json();

      if (data.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => [...prev, ...data]);
      }
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch when page changes
  useEffect(() => {
    fetchPosts(page);
  }, [page, fetchPosts]);

  // IntersectionObserver callback ref for the last element
  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;

      // Disconnect previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      // Create new observer
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setPage((prev) => prev + 1);
          }
        },
        { threshold: 1.0 }
      );

      // Observe the last element
      if (node) {
        observerRef.current.observe(node);
      }
    },
    [loading, hasMore]
  );

  return (
    <div>
      <h1>Posts</h1>

      {posts.map((post, index) => {
        const isLast = index === posts.length - 1;
        return (
          <div
            key={post.id}
            ref={isLast ? lastPostRef : null}
            style={{
              padding: "16px",
              marginBottom: "8px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </div>
        );
      })}

      {loading && <p>Loading more posts...</p>}
      {!hasMore && <p>No more posts to load.</p>}
    </div>
  );
}
```

---

## 11. Live Coding Tips

These tips will help you perform well during a live coding interview, whether it is on a whiteboard, shared screen, or online coding platform.

**Read the Problem Carefully:**
- Read the problem statement at least twice before writing any code
- Identify the inputs and outputs clearly
- Ask clarifying questions: "Can the input be empty?", "Can there be negative numbers?", "Is the input sorted?"
- Restate the problem in your own words to confirm understanding
- Write down the examples given and trace through them manually

**Think Out Loud:**
- The interviewer wants to see your thought process, not just the final answer
- Explain your approach before writing code: "I am thinking of using a hash map to track seen values..."
- Narrate what you are doing as you write: "Here I am iterating through the array and checking if the complement exists in the map..."
- If you are stuck, say so: "I am considering two approaches — let me think about which one is better..."
- Silence makes the interviewer nervous — keep talking

**Start with Brute Force, Then Optimize:**
- Always start with the simplest solution, even if it is O(n^2)
- Say: "Let me start with a brute force approach, and then we can optimize."
- Once the brute force works, analyze its time and space complexity
- Then improve: "We can reduce this from O(n^2) to O(n) by using a hash map instead of nested loops."
- This shows the interviewer you can think incrementally and understand complexity

**Handle Edge Cases:**
- Always consider and mention edge cases before or after writing your solution
- Common edge cases to check:
  - Empty input (empty string, empty array, null/undefined)
  - Single element
  - All elements are the same
  - Very large input (performance)
  - Negative numbers or zero
  - Duplicate values
  - Already sorted input
- Add checks for edge cases at the beginning of your function:

```typescript
function solve(arr: number[]): number {
  // Edge cases
  if (!arr || arr.length === 0) return 0;
  if (arr.length === 1) return arr[0];

  // Main logic
  // ...
}
```

**Test Your Solution:**
- After writing the code, walk through it with the given examples step by step
- Use a small example and trace the values of each variable at each step
- Check your edge cases mentally or by running them
- Look for off-by-one errors (common in loops and index access)
- Check for typos and missing return statements
- If using the two-pointer technique, make sure the pointers do not cross
- Example walkthrough: "For input [2, 7, 11, 15] with target 9: i=0, nums[0]=2, complement=7, map is empty so we add {2:0}. i=1, nums[1]=7, complement=2, map has 2 at index 0, so we return [0, 1]."

**General Best Practices:**
- Keep your code clean and well-structured — use meaningful variable names
- Write small helper functions if the logic is getting complex
- Use TypeScript types when possible — it shows attention to detail
- Know the time and space complexity of your solution and be ready to explain it
- Practice coding without an IDE (no autocomplete) to simulate real interview conditions
- If you make a mistake, do not panic — say "Let me fix that" and correct it calmly
- At the end, summarize: "This solution is O(n) time and O(n) space because we use a hash map with at most n entries."

---

**Final Advice:**
- Practice 2-3 system design problems end to end — draw diagrams, think about scale, discuss trade-offs
- Practice 10-15 coding problems until you can solve them fluently
- Do mock interviews with friends or use platforms like Pramp, Interviewing.io, or LeetCode
- For system design, read about real-world architectures (how Netflix, Twitter, Uber handle scale)
- For live coding, the goal is not perfection — it is clear thinking, good communication, and correct solutions
