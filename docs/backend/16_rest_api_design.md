# REST API Design Best Practices

A practical guide to designing clean REST APIs with examples in Laravel and Node.js/Express.

---

## Table of Contents

1. [What is REST API?](#1-what-is-rest-api)
2. [HTTP Methods](#2-http-methods)
3. [HTTP Status Codes](#3-http-status-codes)
4. [Resource Naming Conventions](#4-resource-naming-conventions)
5. [API Versioning](#5-api-versioning)
6. [Pagination Patterns](#6-pagination-patterns)
7. [Filtering, Sorting, and Searching](#7-filtering-sorting-and-searching)
8. [API Authentication Methods](#8-api-authentication-methods)
9. [Request and Response Format](#9-request-and-response-format)
10. [Rate Limiting](#10-rate-limiting)
11. [HATEOAS](#11-hateoas)
12. [Idempotency](#12-idempotency)
13. [API Documentation](#13-api-documentation)
14. [Best Practices Summary](#14-best-practices-summary)

---

## 1. What is REST API?

REST (Representational State Transfer) is an **architectural style** for APIs over HTTP. Every entity is a **resource** with a unique URI.

**Core principles:**
- **Stateless** — each request contains all info needed; no server-side sessions.
- **Resource-based** — URIs identify resources, HTTP methods define actions.
- **Uniform interface** — consistent conventions across all endpoints.
- **Cacheable** — responses declare whether they can be cached.

```
# Resource-based (correct)
GET    /api/users          → list users
GET    /api/users/42       → get one user
POST   /api/users          → create a user
PUT    /api/users/42       → replace a user
DELETE /api/users/42       → delete a user

# Action-based (wrong)
GET /api/getUsers
POST /api/createUser
POST /api/deleteUser/42
```

---

## 2. HTTP Methods

### GET — Read data

Safe, idempotent, cacheable. Never modifies data.

```
GET /api/posts          → list all posts
GET /api/posts/5        → get post with id 5
GET /api/users/3/posts  → get all posts by user 3
```

**Laravel:**
```php
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{post}', [PostController::class, 'show']);
```

### POST — Create a resource

Not idempotent. Returns `201 Created`.

```
POST /api/posts
Content-Type: application/json
{ "title": "My New Post", "body": "Content..." }
```

**Laravel:**
```php
Route::post('/posts', [PostController::class, 'store']);

public function store(StorePostRequest $request)
{
    $post = Post::create($request->validated());
    return response()->json(['data' => $post], 201);
}
```

### PUT — Replace a resource entirely

Idempotent. Full resource must be sent in the body.

```
PUT /api/posts/5
{ "title": "Updated Title", "body": "Updated body", "status": "published" }
```

**Laravel:**
```php
Route::put('/posts/{post}', [PostController::class, 'update']);

public function update(UpdatePostRequest $request, Post $post)
{
    $post->update($request->validated());
    return response()->json(['data' => $post]);
}
```

### PATCH — Partially update a resource

Only send fields to change. Preferred over PUT for partial updates.

```
PATCH /api/posts/5
{ "status": "published" }
```

**Laravel:**
```php
Route::patch('/posts/{post}', [PostController::class, 'update']);
```

### DELETE — Remove a resource

Idempotent. Returns `204 No Content` or `200 OK` with message.

```
DELETE /api/posts/5
```

**Laravel:**
```php
Route::delete('/posts/{post}', [PostController::class, 'destroy']);

public function destroy(Post $post)
{
    $post->delete();
    return response()->json(['message' => 'Post deleted successfully']);
}
```

### Quick Reference

- **GET** — Read, safe, idempotent, cacheable.
- **POST** — Create, NOT idempotent.
- **PUT** — Full replace, idempotent.
- **PATCH** — Partial update.
- **DELETE** — Remove, idempotent.

---

## 3. HTTP Status Codes

**2xx — Success:**
- `200 OK` — Standard success (GET, PUT, PATCH, DELETE).
- `201 Created` — Resource created (POST). Include `Location` header.
- `204 No Content` — Success with no body (DELETE).

**3xx — Redirection:**
- `301 Moved Permanently` — Resource at new URL permanently.
- `304 Not Modified` — Use cached copy.

**4xx — Client Errors:**
- `400 Bad Request` — Malformed request.
- `401 Unauthorized` — Not authenticated.
- `403 Forbidden` — Authenticated but no permission.
- `404 Not Found` — Resource doesn't exist.
- `409 Conflict` — Conflict with current state.
- `422 Unprocessable Entity` — Validation failed (common in Laravel).
- `429 Too Many Requests` — Rate limit exceeded.

```json
// 422 Validation Error
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "title": ["The title must be at least 3 characters."]
  }
}
```

**5xx — Server Errors:**
- `500 Internal Server Error` — Unexpected server failure.
- `503 Service Unavailable` — Temporary downtime.

**Rules:**
- Use the most specific code for the situation.
- Never return `200 OK` with an error in the body.
- Never expose stack traces or SQL in production 5xx responses.

---

## 4. Resource Naming Conventions

- **Plural nouns** — `/users`, `/posts`, `/orders` (not `/user`, `/getUsers`).
- **Nouns, not verbs** — the HTTP method IS the verb.
- **Lowercase kebab-case** — `/blog-posts`, `/order-items` (not `/blogPosts`).
- **No trailing slashes** — `/api/users` not `/api/users/`.
- **No file extensions** — no `.json` or `.xml` in URIs.

**Nesting for relationships (max 2 levels):**

```
GET /api/users/42/posts          → posts by user 42
GET /api/posts/5/comments        → comments on post 5

# Too deep — flatten instead
GET /api/users/42/posts/5/comments/3/replies/1  ← avoid
GET /api/replies/1                               ← better
```

**Laravel nested routes:**
```php
Route::apiResource('users.posts', UserPostController::class);
// Generates: GET/POST /api/users/{user}/posts
//            GET/PUT/DELETE /api/users/{user}/posts/{post}
```

**Query parameters for filtering:**
```
GET /api/posts?status=published
GET /api/users?search=anwar&role=admin
```

---

## 5. API Versioning

### URL Path Versioning (recommended)

```
GET /api/v1/users
GET /api/v2/users
```

**Laravel:**
```php
Route::prefix('v1')->group(function () {
    Route::apiResource('users', V1\UserController::class);
    Route::apiResource('posts', V1\PostController::class);
});

Route::prefix('v2')->group(function () {
    Route::apiResource('users', V2\UserController::class);
    Route::apiResource('posts', V2\PostController::class);
});
```

### Header Versioning

```
GET /api/users
X-API-Version: 2
```

**Laravel:**
```php
class ApiVersion
{
    public function handle(Request $request, Closure $next, string $version)
    {
        $requestedVersion = $request->header('X-API-Version', 'v1');

        if ($requestedVersion !== $version) {
            abort(400, "Invalid API version. Expected: {$version}");
        }

        return $next($request);
    }
}
```

**Rules:**
- URL path versioning is simplest and most explicit — use it for most projects.
- Only increment the major version for **breaking changes** (removed fields, restructured responses).
- Always set a default version so unversioned requests still work.

---

## 6. Pagination Patterns

### Offset-based

```
GET /api/posts?offset=0&limit=10
GET /api/posts?offset=10&limit=10
```

**Laravel:**
```php
public function index(Request $request)
{
    $posts = Post::skip($request->query('offset', 0))
                 ->take($request->query('limit', 10))
                 ->get();

    return response()->json([
        'data' => $posts,
        'meta' => ['total' => Post::count(), 'limit' => $limit, 'offset' => $offset],
    ]);
}
```

- Simple but slow on large datasets (full offset scan).
- Can skip/duplicate items if data changes between pages.

### Page-based

```
GET /api/posts?page=1&per_page=10
```

**Laravel (built-in):**
```php
public function index(Request $request)
{
    return response()->json(Post::paginate($request->query('per_page', 10)));
    // Automatically returns: data, current_page, last_page, per_page, total, next_page_url
}
```

### Cursor-based (recommended for large datasets)

```
GET /api/posts?limit=10
GET /api/posts?limit=10&after=eyJpZCI6MTB9
```

**Laravel:**
```php
public function index(Request $request)
{
    $limit = $request->query('limit', 10);
    $cursor = $request->query('cursor');

    $query = Post::orderBy('id', 'desc');

    if ($cursor) {
        $decoded = json_decode(base64_decode($cursor), true);
        $query->where('id', '<', $decoded['id']);
    }

    $posts = $query->take($limit + 1)->get();
    $hasMore = $posts->count() > $limit;
    $posts = $posts->take($limit);

    return response()->json([
        'data' => $posts,
        'meta' => [
            'next_cursor' => $hasMore ? base64_encode(json_encode(['id' => $posts->last()->id])) : null,
            'has_more' => $hasMore,
        ],
    ]);
}
```

- Consistent results even when data changes between requests.
- Best for infinite scroll, feeds, and timelines.
- Cannot jump to a specific page.

**When to use which:**
- Page-based — admin dashboards, small-to-medium datasets.
- Offset-based — simple APIs needing precise skip/limit control.
- Cursor-based — large datasets, feeds, infinite scroll.

---

## 7. Filtering, Sorting, and Searching

### Filtering

```
GET /api/posts?status=published&author_id=42&created_after=2025-01-01
```

**Laravel:**
```php
public function index(Request $request)
{
    $query = Post::query();

    if ($request->has('status')) $query->where('status', $request->query('status'));
    if ($request->has('author_id')) $query->where('author_id', $request->query('author_id'));
    if ($request->has('created_after')) $query->where('created_at', '>=', $request->query('created_after'));

    return response()->json(['data' => $query->paginate(10)]);
}
```

### Sorting

Use `-` prefix for descending. Comma-separated for multiple fields.

```
GET /api/posts?sort=created_at          → ascending
GET /api/posts?sort=-created_at         → descending
GET /api/posts?sort=-created_at,title   → newest first, then by title
```

**Laravel:**
```php
if ($request->has('sort')) {
    foreach (explode(',', $request->query('sort')) as $field) {
        $dir = str_starts_with($field, '-') ? 'desc' : 'asc';
        $query->orderBy(ltrim($field, '-'), $dir);
    }
}
```

### Searching

```
GET /api/posts?search=laravel
```

**Laravel:**
```php
if ($request->has('search')) {
    $search = $request->query('search');
    $query->where(fn($q) => $q->where('title', 'LIKE', "%{$search}%")->orWhere('body', 'LIKE', "%{$search}%"));
}
```

### Combined example

```
GET /api/posts?status=published&sort=-created_at&search=javascript&page=2&per_page=20
```

---

## 8. API Authentication Methods

### API Keys

Sent in a header. Good for server-to-server or identifying an application.

```
GET /api/posts
X-API-Key: sk_live_abc123def456
```

**Laravel:**
```php
class ValidateApiKey
{
    public function handle(Request $request, Closure $next)
    {
        $apiKey = $request->header('X-API-Key');

        if (!$apiKey || !ApiKey::where('key', $apiKey)->where('is_active', true)->exists()) {
            return response()->json(['message' => 'Invalid API key'], 401);
        }

        return $next($request);
    }
}
```

### Bearer Token (JWT / Sanctum)

Client logs in, receives a token, sends it with every request. Stateless.

```
POST /api/login  →  { "token": "eyJhbGci..." }

GET /api/posts
Authorization: Bearer eyJhbGci...
```

**Laravel (Sanctum):**
```php
public function login(Request $request)
{
    $credentials = $request->validate(['email' => 'required|email', 'password' => 'required']);

    if (!Auth::attempt($credentials)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    return response()->json(['token' => $request->user()->createToken('api-token')->plainTextToken]);
}

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('posts', PostController::class);
});
```

**Use for:** SPAs, mobile apps, microservices.

### OAuth 2.0

Delegation protocol for third-party access ("Login with Google/GitHub"). Uses authorization codes exchanged for access tokens.

**Use for:** Social login, accessing data on another service, public APIs.

### Session-Based

Server creates a session after login, stores it in a cookie. Browser sends cookie automatically.

**Use for:** Traditional server-rendered apps on the same domain.
**Avoid for:** Mobile apps, cross-domain SPAs, microservices.

**Summary:**
- API Keys — server-to-server or public API identification.
- Bearer Tokens (JWT) — SPAs, mobile, stateless microservices.
- OAuth 2.0 — third-party login, accessing external service data.
- Session-Based — traditional server-rendered apps.

---

## 9. Request and Response Format

Always use `application/json`. Wrap data in a `data` envelope.

**Single resource:**
```json
{
  "data": {
    "id": 42,
    "title": "My Post",
    "author": { "id": 1, "name": "Anwar" },
    "created_at": "2025-06-15T10:30:00Z"
  }
}
```

**Collection:**
```json
{
  "data": [
    { "id": 1, "title": "First Post" },
    { "id": 2, "title": "Second Post" }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 10,
    "total": 50,
    "last_page": 5
  }
}
```

**Error response:**
```json
{
  "error": {
    "code": 422,
    "message": "Validation failed",
    "errors": {
      "title": ["The title field is required."],
      "email": ["The email must be a valid email address."]
    }
  }
}
```

**Laravel error handler:**
```php
class ApiExceptionHandler
{
    public function render($request, Throwable $e)
    {
        if ($e instanceof ModelNotFoundException) {
            return response()->json(['error' => ['code' => 404, 'message' => 'Resource not found']], 404);
        }

        if ($e instanceof ValidationException) {
            return response()->json(['error' => ['code' => 422, 'message' => 'Validation failed', 'errors' => $e->errors()]], 422);
        }

        return response()->json(['error' => ['code' => 500, 'message' => 'Internal server error']], 500);
    }
}
```

**Rules:**
- Use snake_case for JSON field names.
- Always use ISO 8601 + UTC for timestamps: `"2025-06-15T10:30:00Z"`.
- Consistent `data`/`meta`/`error` envelope across all endpoints.

---

## 10. Rate Limiting

Restricts requests per time window. Returns `429 Too Many Requests` when exceeded.

**Response headers:**
- `X-RateLimit-Limit` — max requests in window.
- `X-RateLimit-Remaining` — requests left.
- `X-RateLimit-Reset` — Unix timestamp for reset.
- `Retry-After` — seconds to wait (in 429 responses).

```
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
Retry-After: 45
{ "error": { "code": 429, "message": "Too many requests. Try again in 45 seconds." } }
```

**Laravel:**
```php
// Simple throttle
Route::middleware(['throttle:60,1'])->group(function () {
    Route::apiResource('posts', PostController::class);
});

// Custom rate limiters
RateLimiter::for('api', fn(Request $request) =>
    Limit::perMinute(60)->by($request->user()?->id ?: $request->ip())
);

RateLimiter::for('uploads', fn(Request $request) =>
    Limit::perMinute(10)->by($request->user()->id)
);

Route::middleware(['throttle:api'])->group(fn() => Route::apiResource('posts', PostController::class));
Route::middleware(['throttle:uploads'])->group(fn() => Route::post('/upload', [UploadController::class, 'store']));
```

**Rules:**
- Auth endpoints should have stricter limits than general endpoints.
- Rate limit by user ID when authenticated, fall back to IP.
- Always include rate limit headers in every response.
- Log rate limit violations for security monitoring.

---

## 11. HATEOAS

HATEOAS (Hypermedia As The Engine Of Application State) — server includes links in responses telling the client what actions/resources are available next.

**Without HATEOAS:** client must hardcode all URLs.

**With HATEOAS:**
```json
{
  "data": { "id": 42, "title": "My Post", "status": "draft" },
  "links": {
    "self": "/api/posts/42",
    "publish": "/api/posts/42/publish",
    "edit": "/api/posts/42",
    "delete": "/api/posts/42",
    "author": "/api/users/1"
  }
}
```

**Collection pagination links:**
```json
{
  "data": [...],
  "links": {
    "self": "/api/posts?page=1",
    "next": "/api/posts?page=2",
    "prev": null,
    "first": "/api/posts?page=1",
    "last": "/api/posts?page=5"
  }
}
```

**Laravel Resource:**
```php
class PostResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'status' => $this->status,
            'links' => [
                'self' => route('posts.show', $this->id),
                'edit' => route('posts.update', $this->id),
                'delete' => route('posts.destroy', $this->id),
                'publish' => $this->status === 'draft' ? route('posts.publish', $this->id) : null,
                'author' => route('users.show', $this->user_id),
            ],
        ];
    }
}
```

Use HATEOAS for public APIs with complex workflows. Skip it for simple internal APIs.

---

## 12. Idempotency

**Idempotent** = performing the same operation multiple times produces the same result.

- **GET, PUT, DELETE** — idempotent.
- **POST, PATCH** — NOT guaranteed idempotent.

**Idempotency keys** make POST safe to retry. Client sends a unique key; if the server already processed that key, it returns the cached response.

```
POST /api/payments
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000
{ "amount": 99.99, "currency": "USD", "customer_id": 42 }
```

**Laravel:**
```php
class IdempotencyMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->method() !== 'POST') return $next($request);

        $idempotencyKey = $request->header('Idempotency-Key');
        if (!$idempotencyKey) return $next($request);

        $cacheKey = "idempotency:{$idempotencyKey}";

        if (Cache::has($cacheKey)) {
            $cached = Cache::get($cacheKey);
            return response()->json($cached['body'], $cached['status'])
                             ->header('X-Idempotent-Replayed', 'true');
        }

        $response = $next($request);

        Cache::put($cacheKey, [
            'body' => $response->getData(true),
            'status' => $response->getStatusCode(),
        ], now()->addHours(24));

        return $response;
    }
}
```

**Rules:**
- Always support idempotency keys for payment/financial endpoints.
- Use UUID v4 as idempotency keys.
- Cache responses for 24 hours.
- Return `X-Idempotent-Replayed: true` when replaying from cache.

---

## 13. API Documentation

### OpenAPI / Swagger

Standard format (JSON/YAML) for describing REST APIs.

```yaml
openapi: 3.0.0
info:
  title: Blog API
  version: 1.0.0
servers:
  - url: https://api.example.com/v1
paths:
  /posts:
    get:
      summary: List all posts
      parameters:
        - name: page
          in: query
          schema: { type: integer, default: 1 }
        - name: per_page
          in: query
          schema: { type: integer, default: 10 }
      responses:
        '200':
          description: A list of posts
    post:
      summary: Create a post
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              required: [title, body]
              properties:
                title: { type: string }
                body: { type: string }
      responses:
        '201': { description: Post created }
        '422': { description: Validation error }
components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

**Laravel (auto-generate with Scramble):**
```bash
composer require dedoc/scramble
# Visit /docs/api for interactive documentation — no annotations needed
```

**Rules:**
- Keep documentation in sync with the actual API.
- Document every endpoint including error responses.
- Include authentication instructions and a getting started guide.
- Use interactive docs (Swagger UI) so developers can test endpoints.
- Version docs alongside the API, include a changelog.

---

## 14. Best Practices Summary

**Resource design:**
- Plural nouns for resource names (`/users`, `/posts`).
- HTTP methods for actions, not verbs in URLs.
- Lowercase, kebab-case URIs, max 2 levels of nesting.

**HTTP standards:**
- Correct method and most specific status code for every operation.
- Never `200 OK` with an error body.
- Proper `Content-Type: application/json` headers.

**Request/Response:**
- Consistent envelope: `data`, `meta`, `error`.
- ISO 8601 + UTC for all timestamps.
- snake_case for JSON field names.

**Pagination:**
- Always paginate collections — never return unbounded lists.
- Page-based for simple UIs, cursor-based for large datasets.

**Filtering/Sorting:**
- Query parameters for all filtering, sorting, searching.
- `-` prefix for descending sort.

**Auth and security:**
- Bearer tokens for stateless auth; never pass tokens in URL query params.
- Always HTTPS in production.
- Rate limit all endpoints; stricter on auth endpoints.

**Versioning:**
- URL path versioning from day one.
- Only increment major version for breaking changes.

**Idempotency:**
- Idempotency keys for POST endpoints that create resources or trigger actions.
- Required for payment/financial operations.

**Documentation:**
- OpenAPI/Swagger for interactive docs.
- Document errors, rate limits, and auth.
- Keep docs in sync with the API.
