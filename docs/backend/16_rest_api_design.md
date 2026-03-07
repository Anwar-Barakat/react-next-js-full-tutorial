# REST API Design Best Practices

A comprehensive guide to designing clean, consistent, and scalable REST APIs with practical examples in Laravel and Node.js/Express.

---

## Table of Contents

1. [What is REST API?](#1-what-is-rest-api)
2. [HTTP Methods](#2-http-methods)
3. [HTTP Status Codes](#3-http-status-codes)
4. [API Resource Naming Conventions](#4-api-resource-naming-conventions)
5. [API Versioning](#5-api-versioning)
6. [Pagination Patterns](#6-pagination-patterns)
7. [Filtering, Sorting, and Searching](#7-filtering-sorting-and-searching)
8. [API Authentication Methods](#8-api-authentication-methods)
9. [Request and Response Format](#9-request-and-response-format)
10. [Rate Limiting](#10-rate-limiting)
11. [HATEOAS](#11-hateoas)
12. [Idempotency](#12-idempotency)
13. [API Documentation](#13-api-documentation)
14. [REST API Best Practices Summary](#14-rest-api-best-practices-summary)

---

## 1. What is REST API?

REST (Representational State Transfer) is an **architectural style** for designing networked applications, defined by Roy Fielding in his 2000 doctoral dissertation.

A REST API is an interface that allows clients to communicate with a server over HTTP by performing operations on **resources**.

**Core Principles of REST:**

- **Client-Server Separation** -- the client (frontend, mobile app) and server (backend) are independent; the client does not know how data is stored, and the server does not know how data is displayed.
- **Stateless** -- every request from the client must contain **all the information** the server needs to process it; the server does not store any session state between requests.
- **Resource-Based** -- everything is a resource (user, post, order, product) identified by a unique URI (e.g., `/api/users/42`).
- **Uniform Interface** -- resources are manipulated through a standard set of HTTP methods (GET, POST, PUT, PATCH, DELETE) with consistent conventions.
- **Cacheable** -- responses should define whether they are cacheable so clients and intermediaries can reuse them to improve performance.
- **Layered System** -- the client does not need to know whether it is connected directly to the server or through a load balancer, CDN, or proxy.

**What "stateless" means in practice:**

- The server does not remember previous requests.
- Authentication tokens, pagination info, and filters must be sent with **every** request.
- This makes the API easier to scale horizontally (any server can handle any request).

```
# Each request is self-contained
GET /api/users/42
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Accept: application/json
```

**What "resource-based" means in practice:**

- A resource is any entity or concept in your system (users, posts, orders, invoices).
- Each resource has a unique URI.
- You interact with resources using HTTP methods, not action verbs in the URL.

```
# Correct -- resource-based
GET    /api/users          (list users)
GET    /api/users/42       (get one user)
POST   /api/users          (create a user)
PUT    /api/users/42       (replace a user)
DELETE /api/users/42       (delete a user)

# Wrong -- action-based
GET /api/getUsers
POST /api/createUser
POST /api/deleteUser/42
```

---

## 2. HTTP Methods

HTTP methods (also called verbs) define **what operation** you want to perform on a resource.

### GET -- Retrieve a Resource

- Used to **read** data from the server.
- Should **never** modify data on the server.
- Is **safe** (no side effects) and **idempotent** (same result no matter how many times you call it).
- Can be cached and bookmarked.

```
GET /api/posts          -- list all posts
GET /api/posts/5        -- get post with id 5
GET /api/users/3/posts  -- get all posts by user 3
```

**Laravel:**

```php
Route::get('/posts', [PostController::class, 'index']);
Route::get('/posts/{post}', [PostController::class, 'show']);
```

**Express:**

```js
app.get('/api/posts', postController.index);
app.get('/api/posts/:id', postController.show);
```

### POST -- Create a Resource

- Used to **create** a new resource.
- The request body contains the data for the new resource.
- Not idempotent -- calling it twice creates **two** resources.
- Returns `201 Created` on success.

```
POST /api/posts
Content-Type: application/json

{
  "title": "My New Post",
  "body": "Post content here..."
}
```

**Laravel:**

```php
Route::post('/posts', [PostController::class, 'store']);

// In PostController
public function store(StorePostRequest $request)
{
    $post = Post::create($request->validated());

    return response()->json([
        'message' => 'Post created successfully',
        'data' => $post,
    ], 201);
}
```

**Express:**

```js
app.post('/api/posts', async (req, res) => {
  const post = await Post.create(req.body);

  res.status(201).json({
    message: 'Post created successfully',
    data: post,
  });
});
```

### PUT -- Replace a Resource Entirely

- Used to **replace** a resource completely with new data.
- The request body must contain the **full** resource representation.
- Is idempotent -- calling it multiple times with the same data has the same result.
- If the resource does not exist, it can either create it or return `404`.

```
PUT /api/posts/5
Content-Type: application/json

{
  "title": "Updated Title",
  "body": "Updated body",
  "status": "published"
}
```

**Laravel:**

```php
Route::put('/posts/{post}', [PostController::class, 'update']);

public function update(UpdatePostRequest $request, Post $post)
{
    $post->update($request->validated());

    return response()->json([
        'message' => 'Post updated successfully',
        'data' => $post,
    ]);
}
```

**Express:**

```js
app.put('/api/posts/:id', async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    overwrite: true,
  });

  res.json({
    message: 'Post updated successfully',
    data: post,
  });
});
```

### PATCH -- Partially Update a Resource

- Used to **partially modify** a resource (only the fields you send are updated).
- The request body contains only the fields to change.
- Not necessarily idempotent (depends on implementation).
- Preferred over PUT when you only need to update one or two fields.

```
PATCH /api/posts/5
Content-Type: application/json

{
  "status": "published"
}
```

**Laravel:**

```php
Route::patch('/posts/{post}', [PostController::class, 'update']);

public function update(UpdatePostRequest $request, Post $post)
{
    $post->update($request->validated());

    return response()->json([
        'message' => 'Post updated successfully',
        'data' => $post,
    ]);
}
```

**Express:**

```js
app.patch('/api/posts/:id', async (req, res) => {
  const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.json({
    message: 'Post updated successfully',
    data: post,
  });
});
```

### DELETE -- Remove a Resource

- Used to **delete** a resource.
- Is idempotent -- deleting the same resource twice has the same end result (the resource is gone).
- Typically returns `204 No Content` on success (with no body) or `200 OK` with a confirmation message.

```
DELETE /api/posts/5
```

**Laravel:**

```php
Route::delete('/posts/{post}', [PostController::class, 'destroy']);

public function destroy(Post $post)
{
    $post->delete();

    return response()->json([
        'message' => 'Post deleted successfully',
    ]);
}
```

**Express:**

```js
app.delete('/api/posts/:id', async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);

  res.json({
    message: 'Post deleted successfully',
  });
});
```

### Quick Reference

- **GET** -- Read data, no side effects, safe, idempotent, cacheable.
- **POST** -- Create a new resource, has side effects, NOT idempotent.
- **PUT** -- Replace a resource entirely, idempotent.
- **PATCH** -- Partially update a resource, may not be idempotent.
- **DELETE** -- Remove a resource, idempotent.

---

## 3. HTTP Status Codes

Status codes tell the client **what happened** with their request. They are grouped into five categories.

### 1xx -- Informational

- These indicate that the server received the request and is continuing to process it.
- Rarely used directly in REST APIs.
- **100 Continue** -- the server received the request headers and the client should proceed to send the body.
- **101 Switching Protocols** -- the server is switching to a different protocol (e.g., upgrading to WebSocket).

### 2xx -- Success

- The request was successfully received, understood, and accepted.
- **200 OK** -- the standard success response; used for GET, PUT, PATCH, and DELETE when returning data.
- **201 Created** -- a new resource was successfully created; used after POST requests; should include a `Location` header pointing to the new resource.
- **204 No Content** -- the request succeeded but there is no content to return; commonly used for DELETE or PUT when you do not need to send a response body.

```
# 201 Created with Location header
HTTP/1.1 201 Created
Location: /api/posts/42
Content-Type: application/json

{
  "data": {
    "id": 42,
    "title": "New Post"
  }
}
```

### 3xx -- Redirection

- The client must take additional action to complete the request.
- **301 Moved Permanently** -- the resource has been permanently moved to a new URL; clients should update their bookmarks.
- **302 Found** -- the resource is temporarily at a different URL.
- **304 Not Modified** -- the resource has not changed since the last request; the client can use its cached copy; saves bandwidth.

### 4xx -- Client Errors

- The request contains an error that the **client** needs to fix.
- **400 Bad Request** -- the request body is malformed or missing required fields; the response should explain what is wrong.
- **401 Unauthorized** -- the client is not authenticated; it must provide valid credentials (token, API key, etc.).
- **403 Forbidden** -- the client is authenticated but does not have permission to access this resource.
- **404 Not Found** -- the requested resource does not exist.
- **405 Method Not Allowed** -- the HTTP method is not supported for this endpoint (e.g., DELETE on a read-only resource).
- **409 Conflict** -- the request conflicts with the current state of the resource (e.g., trying to create a resource that already exists, or a version conflict).
- **422 Unprocessable Entity** -- the request body is well-formed JSON but fails validation rules (common in Laravel).
- **429 Too Many Requests** -- the client has exceeded the rate limit; should include `Retry-After` header.

```json
// 422 Validation Error Response
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "title": ["The title must be at least 3 characters."]
  }
}
```

### 5xx -- Server Errors

- Something went wrong on the **server** side; the client did nothing wrong.
- **500 Internal Server Error** -- a generic server error; something unexpected happened.
- **502 Bad Gateway** -- the server acting as a gateway received an invalid response from an upstream server.
- **503 Service Unavailable** -- the server is temporarily unable to handle the request (maintenance, overload); should include `Retry-After` header.
- **504 Gateway Timeout** -- the server acting as a gateway did not receive a timely response from the upstream server.

**Best practices for status codes:**

- Always use the most specific status code that matches the situation.
- Never return `200 OK` with an error message in the body -- use proper 4xx/5xx codes.
- Include helpful error messages in the response body for 4xx errors.
- Never expose internal error details (stack traces, SQL queries) in production 5xx responses.

---

## 4. API Resource Naming Conventions

Good naming conventions make your API intuitive and predictable.

### Use Plural Nouns for Resources

- Resources should always be **plural nouns**, not verbs.
- This represents a collection of entities.

```
# Correct
GET /api/users
GET /api/posts
GET /api/orders

# Wrong -- singular
GET /api/user
GET /api/post
GET /api/order

# Wrong -- verbs
GET /api/getUsers
POST /api/createPost
DELETE /api/removeOrder
```

### Use Nouns, Not Verbs

- The HTTP method already describes the action; the URL should describe the resource.

```
# Correct
POST   /api/users            (the method POST means "create")
DELETE /api/users/42          (the method DELETE means "remove")

# Wrong
POST /api/users/create
POST /api/users/delete/42
GET  /api/users/list
```

### Nesting for Relationships

- Use nesting to represent relationships between resources.
- Keep nesting to a maximum of **two levels deep** to avoid complexity.

```
# Good -- one level of nesting
GET /api/users/42/posts          -- get all posts by user 42
GET /api/posts/5/comments        -- get all comments on post 5

# Acceptable -- two levels
GET /api/users/42/posts/5/comments

# Too deep -- avoid this
GET /api/users/42/posts/5/comments/3/replies/1
# Instead, flatten it:
GET /api/replies/1
```

**Laravel:**

```php
// Nested resource routes
Route::apiResource('users.posts', UserPostController::class);
// Generates:
// GET    /api/users/{user}/posts
// POST   /api/users/{user}/posts
// GET    /api/users/{user}/posts/{post}
// PUT    /api/users/{user}/posts/{post}
// DELETE /api/users/{user}/posts/{post}
```

**Express:**

```js
const router = express.Router({ mergeParams: true });

router.get('/users/:userId/posts', postController.getByUser);
router.post('/users/:userId/posts', postController.createForUser);
```

### Use Kebab-Case for Multi-Word Resources

- Use hyphens (`-`) to separate words, not camelCase or underscores.

```
# Correct
GET /api/blog-posts
GET /api/order-items
GET /api/user-profiles

# Wrong
GET /api/blogPosts
GET /api/order_items
GET /api/UserProfiles
```

### Use Query Parameters for Filtering

- Use query strings for non-resource operations like filtering, sorting, and searching.

```
GET /api/posts?status=published
GET /api/posts?author_id=42&sort=-created_at
GET /api/users?search=anwar&role=admin
```

### General Naming Best Practices

- Always use lowercase letters in URIs.
- Use forward slashes (`/`) to indicate hierarchy.
- Do not use trailing slashes (`/api/users/` should be `/api/users`).
- Use hyphens for readability, never underscores.
- Do not use file extensions in URIs (no `.json` or `.xml`).
- Keep URIs short and meaningful.

---

## 5. API Versioning

As your API evolves, you need versioning to **avoid breaking existing clients** when you make changes.

### URL Path Versioning (Most Common)

- The version is part of the URL path.
- This is the most popular and straightforward approach.

```
GET /api/v1/users
GET /api/v2/users
```

**Pros:**
- Simple to understand and implement.
- Easy to see which version a client is using.
- Easy to route different versions to different controllers.
- Works with any HTTP client.

**Cons:**
- URL changes when the version changes.
- Can lead to code duplication across versions.

**Laravel:**

```php
// routes/api.php
Route::prefix('v1')->group(function () {
    Route::apiResource('users', V1\UserController::class);
    Route::apiResource('posts', V1\PostController::class);
});

Route::prefix('v2')->group(function () {
    Route::apiResource('users', V2\UserController::class);
    Route::apiResource('posts', V2\PostController::class);
});
```

**Express:**

```js
const v1Router = require('./routes/v1');
const v2Router = require('./routes/v2');

app.use('/api/v1', v1Router);
app.use('/api/v2', v2Router);
```

### Header Versioning

- The version is specified in a custom request header.

```
GET /api/users
Accept: application/vnd.myapp.v2+json
```

Or with a custom header:

```
GET /api/users
X-API-Version: 2
```

**Pros:**
- URLs stay clean and do not change between versions.
- Follows the principle of content negotiation.

**Cons:**
- Harder to test (you cannot just paste a URL in a browser).
- Harder to discover which versions are available.
- Requires clients to set custom headers.

**Laravel:**

```php
Route::middleware('api.version:v2')->group(function () {
    Route::apiResource('users', UserController::class);
});

// In a middleware
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

**Express:**

```js
const apiVersionMiddleware = (version) => (req, res, next) => {
  const requestedVersion = req.headers['x-api-version'] || 'v1';

  if (requestedVersion !== version) {
    return res.status(400).json({
      message: `Invalid API version. Expected: ${version}`,
    });
  }

  next();
};

app.use('/api/users', apiVersionMiddleware('v2'), v2UserRoutes);
```

### Query Parameter Versioning

- The version is a query parameter.

```
GET /api/users?version=2
```

**Pros:**
- Easy to switch versions in the browser or Postman.
- URL path stays the same.

**Cons:**
- Query parameters are typically for filtering, not versioning -- this breaks convention.
- Easy to forget the parameter, which may default to an unexpected version.
- Harder to cache (different query strings = different cache entries).

### Which Versioning Strategy to Use?

- **URL path versioning** is recommended for most projects -- it is the simplest and most explicit.
- **Header versioning** is good for public APIs where URL cleanliness matters.
- **Query parameter versioning** is the least recommended but can work for internal APIs.
- Regardless of strategy, always set a default version so clients that do not specify a version still work.
- Only increment the major version when you make **breaking changes** (removing fields, changing response structure, renaming endpoints).

---

## 6. Pagination Patterns

When a resource collection is large, you need pagination to **avoid returning thousands of records** in a single response.

### Offset-Based Pagination

- Uses `offset` (or `skip`) and `limit` to define which slice of data to return.
- The most straightforward approach.

```
GET /api/posts?offset=0&limit=10     -- first 10 posts
GET /api/posts?offset=10&limit=10    -- next 10 posts
GET /api/posts?offset=20&limit=10    -- next 10 posts
```

**Laravel:**

```php
public function index(Request $request)
{
    $limit = $request->query('limit', 10);
    $offset = $request->query('offset', 0);

    $posts = Post::skip($offset)->take($limit)->get();
    $total = Post::count();

    return response()->json([
        'data' => $posts,
        'meta' => [
            'total' => $total,
            'limit' => $limit,
            'offset' => $offset,
        ],
    ]);
}
```

**Express:**

```js
app.get('/api/posts', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  const posts = await Post.find().skip(offset).limit(limit);
  const total = await Post.countDocuments();

  res.json({
    data: posts,
    meta: {
      total,
      limit,
      offset,
    },
  });
});
```

**Pros:**
- Simple to implement and understand.
- Client can jump to any page.

**Cons:**
- Slow on large datasets (the database still has to scan `offset` rows before returning results).
- If data is inserted or deleted between requests, results can shift (duplicates or missing items).

### Page-Based Pagination

- Uses `page` and `per_page` parameters.
- A more user-friendly version of offset-based pagination.

```
GET /api/posts?page=1&per_page=10    -- first page
GET /api/posts?page=2&per_page=10    -- second page
GET /api/posts?page=3&per_page=10    -- third page
```

**Laravel (built-in):**

```php
public function index(Request $request)
{
    $posts = Post::paginate($request->query('per_page', 10));

    return response()->json($posts);
}

// Laravel's paginate() automatically returns:
// {
//   "data": [...],
//   "current_page": 1,
//   "last_page": 5,
//   "per_page": 10,
//   "total": 50,
//   "next_page_url": "/api/posts?page=2",
//   "prev_page_url": null
// }
```

**Express:**

```js
app.get('/api/posts', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.per_page) || 10;
  const skip = (page - 1) * perPage;

  const [posts, total] = await Promise.all([
    Post.find().skip(skip).limit(perPage),
    Post.countDocuments(),
  ]);

  res.json({
    data: posts,
    meta: {
      current_page: page,
      per_page: perPage,
      total,
      last_page: Math.ceil(total / perPage),
    },
  });
});
```

**Pros:**
- Intuitive for clients -- "give me page 3."
- Easy to build UI pagination controls.

**Cons:**
- Same performance issues as offset-based on large datasets.
- Same data-shifting problem.

### Cursor-Based Pagination

- Uses a **cursor** (typically the ID or timestamp of the last item) to fetch the next set of results.
- Ideal for large datasets, real-time feeds, and infinite scroll.

```
GET /api/posts?limit=10                              -- first page
GET /api/posts?limit=10&after=eyJpZCI6MTB9           -- next page (after cursor)
GET /api/posts?limit=10&before=eyJpZCI6MjB9          -- previous page (before cursor)
```

**Laravel:**

```php
public function index(Request $request)
{
    $limit = $request->query('limit', 10);
    $cursor = $request->query('cursor');

    $query = Post::orderBy('id', 'desc');

    if ($cursor) {
        $decodedCursor = json_decode(base64_decode($cursor), true);
        $query->where('id', '<', $decodedCursor['id']);
    }

    $posts = $query->take($limit + 1)->get();

    $hasMore = $posts->count() > $limit;
    $posts = $posts->take($limit);

    $nextCursor = $hasMore
        ? base64_encode(json_encode(['id' => $posts->last()->id]))
        : null;

    return response()->json([
        'data' => $posts,
        'meta' => [
            'next_cursor' => $nextCursor,
            'has_more' => $hasMore,
        ],
    ]);
}
```

**Express:**

```js
app.get('/api/posts', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const cursor = req.query.cursor;

  const query = {};

  if (cursor) {
    const decoded = JSON.parse(Buffer.from(cursor, 'base64').toString());
    query._id = { $lt: decoded.id };
  }

  const posts = await Post.find(query)
    .sort({ _id: -1 })
    .limit(limit + 1);

  const hasMore = posts.length > limit;
  const results = posts.slice(0, limit);

  const nextCursor = hasMore
    ? Buffer.from(JSON.stringify({ id: results[results.length - 1]._id })).toString('base64')
    : null;

  res.json({
    data: results,
    meta: {
      next_cursor: nextCursor,
      has_more: hasMore,
    },
  });
});
```

**Pros:**
- Consistent results even when data is inserted or deleted between requests.
- Much faster on large datasets (uses indexed lookups instead of offset scans).
- Ideal for infinite scroll and real-time feeds.

**Cons:**
- Cannot jump to a specific page ("show me page 5").
- More complex to implement.
- The cursor is opaque to the client.

### When to Use Which?

- **Page-based** -- good for admin dashboards, small-to-medium datasets where users need page numbers.
- **Offset-based** -- good for simple APIs and when clients need precise control over skip/limit.
- **Cursor-based** -- best for large datasets, feeds, timelines, and infinite scroll.

---

## 7. Filtering, Sorting, and Searching

Clients need ways to narrow down, order, and search through large collections.

### Filtering

- Use query parameters that match field names.
- Support multiple filters at the same time.

```
GET /api/posts?status=published
GET /api/posts?status=published&author_id=42
GET /api/posts?category=tech&created_after=2025-01-01
GET /api/users?role=admin&is_active=true
```

**Laravel:**

```php
public function index(Request $request)
{
    $query = Post::query();

    if ($request->has('status')) {
        $query->where('status', $request->query('status'));
    }

    if ($request->has('author_id')) {
        $query->where('author_id', $request->query('author_id'));
    }

    if ($request->has('created_after')) {
        $query->where('created_at', '>=', $request->query('created_after'));
    }

    return response()->json([
        'data' => $query->paginate(10),
    ]);
}
```

**Express:**

```js
app.get('/api/posts', async (req, res) => {
  const filter = {};

  if (req.query.status) filter.status = req.query.status;
  if (req.query.author_id) filter.authorId = req.query.author_id;
  if (req.query.created_after) {
    filter.createdAt = { $gte: new Date(req.query.created_after) };
  }

  const posts = await Post.find(filter).limit(10);

  res.json({ data: posts });
});
```

### Sorting

- Use a `sort` query parameter.
- Prefix with `-` (minus) for descending order.
- Support multiple sort fields separated by commas.

```
GET /api/posts?sort=created_at           -- ascending (oldest first)
GET /api/posts?sort=-created_at          -- descending (newest first)
GET /api/posts?sort=-created_at,title    -- newest first, then alphabetical by title
```

**Laravel:**

```php
public function index(Request $request)
{
    $query = Post::query();

    if ($request->has('sort')) {
        $sortFields = explode(',', $request->query('sort'));

        foreach ($sortFields as $field) {
            if (str_starts_with($field, '-')) {
                $query->orderBy(ltrim($field, '-'), 'desc');
            } else {
                $query->orderBy($field, 'asc');
            }
        }
    }

    return response()->json([
        'data' => $query->paginate(10),
    ]);
}
```

**Express:**

```js
app.get('/api/posts', async (req, res) => {
  let sortObj = {};

  if (req.query.sort) {
    const sortFields = req.query.sort.split(',');

    sortFields.forEach((field) => {
      if (field.startsWith('-')) {
        sortObj[field.substring(1)] = -1;
      } else {
        sortObj[field] = 1;
      }
    });
  }

  const posts = await Post.find().sort(sortObj).limit(10);

  res.json({ data: posts });
});
```

### Searching

- Use a `search` or `q` query parameter for full-text search.
- The server decides which fields to search in.

```
GET /api/posts?search=laravel
GET /api/users?q=anwar
```

**Laravel:**

```php
public function index(Request $request)
{
    $query = Post::query();

    if ($request->has('search')) {
        $search = $request->query('search');

        $query->where(function ($q) use ($search) {
            $q->where('title', 'LIKE', "%{$search}%")
              ->orWhere('body', 'LIKE', "%{$search}%");
        });
    }

    return response()->json([
        'data' => $query->paginate(10),
    ]);
}
```

**Express:**

```js
app.get('/api/posts', async (req, res) => {
  const filter = {};

  if (req.query.search) {
    filter.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { body: { $regex: req.query.search, $options: 'i' } },
    ];
  }

  const posts = await Post.find(filter).limit(10);

  res.json({ data: posts });
});
```

### Combining Everything

```
GET /api/posts?status=published&sort=-created_at&search=javascript&page=2&per_page=20
```

This request says: "Give me the second page of published posts that mention 'javascript', sorted by newest first, with 20 results per page."

---

## 8. API Authentication Methods

Authentication verifies **who** the client is. There are several common methods for REST APIs.

### API Keys

- A unique key assigned to each client/application.
- Sent in a header or query parameter with every request.
- Simple but not very secure for user-level authentication.

```
GET /api/posts
X-API-Key: sk_live_abc123def456
```

**When to use:**
- Server-to-server communication.
- Public APIs with usage tracking.
- When you need to identify the application, not the user.

**Laravel:**

```php
// Middleware to validate API key
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

**Express:**

```js
const validateApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return res.status(401).json({ message: 'API key is required' });
  }

  const key = await ApiKey.findOne({ key: apiKey, isActive: true });

  if (!key) {
    return res.status(401).json({ message: 'Invalid API key' });
  }

  next();
};

app.use('/api', validateApiKey);
```

### Bearer Token (JWT)

- The client authenticates (login) and receives a JSON Web Token (JWT).
- The token is sent in the `Authorization` header with every subsequent request.
- The server validates the token without needing to look up a session.

```
POST /api/login
Content-Type: application/json

{
  "email": "anwar@example.com",
  "password": "secret123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}

# Subsequent requests
GET /api/posts
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**When to use:**
- SPAs (Single Page Applications) and mobile apps.
- Stateless authentication where the server should not store sessions.
- Microservices architectures.

**Laravel (using Sanctum):**

```php
// Login and generate token
public function login(Request $request)
{
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if (!Auth::attempt($credentials)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    $token = $request->user()->createToken('api-token')->plainTextToken;

    return response()->json(['token' => $token]);
}

// Protect routes
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('posts', PostController::class);
});
```

**Express (using jsonwebtoken):**

```js
const jwt = require('jsonwebtoken');

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  });

  res.json({ token });
});

// Middleware to verify token
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

app.use('/api/posts', authenticate, postRoutes);
```

### OAuth 2.0

- A delegation protocol that allows third-party applications to access a user's data **without** knowing the user's password.
- Uses access tokens and refresh tokens.
- Common in "Login with Google/GitHub/Facebook" flows.

**OAuth 2.0 flow (simplified):**
- The client redirects the user to the authorization server (e.g., Google).
- The user logs in and grants permission.
- The authorization server redirects back with an authorization code.
- The client exchanges the code for an access token.
- The client uses the access token to access the API.

```
# Step 1: Redirect user to authorization server
GET https://accounts.google.com/o/oauth2/auth?
  client_id=YOUR_CLIENT_ID&
  redirect_uri=https://yourapp.com/callback&
  response_type=code&
  scope=email profile

# Step 2: Exchange code for token
POST https://oauth2.googleapis.com/token
{
  "code": "AUTHORIZATION_CODE",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_CLIENT_SECRET",
  "redirect_uri": "https://yourapp.com/callback",
  "grant_type": "authorization_code"
}

# Step 3: Use the access token
GET /api/user
Authorization: Bearer ACCESS_TOKEN
```

**When to use:**
- Third-party integrations ("Login with Google").
- When you need to access user data on another service.
- Public APIs that serve many different client applications.

### Session-Based Authentication

- The server creates a session after login and stores a session ID in a cookie.
- The browser automatically sends the cookie with every request.
- Common in traditional server-rendered web applications.

```
POST /login
Content-Type: application/json

{
  "email": "anwar@example.com",
  "password": "secret123"
}

Response:
Set-Cookie: session_id=abc123; HttpOnly; Secure

# Subsequent requests automatically include the cookie
GET /api/posts
Cookie: session_id=abc123
```

**When to use:**
- Traditional server-rendered web apps (Blade, EJS, etc.).
- When the frontend and backend are on the same domain.
- When you need easy CSRF protection.

**When NOT to use:**
- Mobile apps (they do not have cookies).
- SPAs on a different domain (CORS complications).
- Microservices (each service would need access to the session store).

### Which Authentication Method to Choose?

- **API Keys** -- simple server-to-server or public API identification.
- **Bearer Tokens (JWT)** -- SPAs, mobile apps, stateless microservices.
- **OAuth 2.0** -- third-party login, accessing data on another service.
- **Session-Based** -- traditional server-rendered apps on the same domain.

---

## 9. Request and Response Format

Consistent structure across all endpoints makes your API predictable and easy to consume.

### JSON as the Standard Format

- Always use `application/json` as the content type.
- Set the `Content-Type` and `Accept` headers properly.

```
# Request
POST /api/posts
Content-Type: application/json
Accept: application/json

{
  "title": "My Post",
  "body": "Content here..."
}
```

### Successful Response Structure

- Wrap data in a `data` key (the "envelope pattern").
- Include `meta` for pagination and additional info.
- Use consistent key naming (snake_case is most common for JSON APIs).

**Single resource:**

```json
{
  "data": {
    "id": 42,
    "title": "My Post",
    "body": "Content here...",
    "author": {
      "id": 1,
      "name": "Anwar"
    },
    "created_at": "2025-06-15T10:30:00Z",
    "updated_at": "2025-06-15T12:00:00Z"
  }
}
```

**Collection:**

```json
{
  "data": [
    {
      "id": 1,
      "title": "First Post"
    },
    {
      "id": 2,
      "title": "Second Post"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 10,
    "total": 50,
    "last_page": 5
  }
}
```

### Consistent Error Response Format

- Every error response should follow the same structure.
- Include the HTTP status code, a human-readable message, and field-level errors for validation failures.

```json
{
  "error": {
    "code": 422,
    "message": "Validation failed",
    "errors": {
      "title": ["The title field is required."],
      "email": [
        "The email must be a valid email address.",
        "The email has already been taken."
      ]
    }
  }
}
```

**For non-validation errors:**

```json
{
  "error": {
    "code": 404,
    "message": "Post not found"
  }
}
```

**Laravel -- consistent error handling:**

```php
// app/Exceptions/Handler.php or a custom exception handler
class ApiExceptionHandler
{
    public function render($request, Throwable $e)
    {
        if ($e instanceof ModelNotFoundException) {
            return response()->json([
                'error' => [
                    'code' => 404,
                    'message' => 'Resource not found',
                ],
            ], 404);
        }

        if ($e instanceof ValidationException) {
            return response()->json([
                'error' => [
                    'code' => 422,
                    'message' => 'Validation failed',
                    'errors' => $e->errors(),
                ],
            ], 422);
        }

        return response()->json([
            'error' => [
                'code' => 500,
                'message' => 'Internal server error',
            ],
        ], 500);
    }
}
```

**Express -- consistent error handling:**

```js
// Error handling middleware (place at the end of middleware chain)
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    return res.status(422).json({
      error: {
        code: 422,
        message: 'Validation failed',
        errors: err.errors,
      },
    });
  }

  if (err.name === 'CastError' || err.name === 'NotFoundError') {
    return res.status(404).json({
      error: {
        code: 404,
        message: 'Resource not found',
      },
    });
  }

  console.error(err);

  res.status(500).json({
    error: {
      code: 500,
      message: 'Internal server error',
    },
  });
});
```

### The Envelope Pattern -- Pros and Cons

**Why use it (wrap everything in `data`):**
- Consistent structure across all endpoints.
- Easy to add `meta` information (pagination, request ID, etc.) without modifying the main data.
- Clients always know where to find the actual data.

**Why some APIs skip it:**
- Adds an extra nesting level.
- For simple APIs, it may feel like unnecessary boilerplate.
- Some prefer relying on HTTP status codes and headers instead.

**Recommendation:** Use the envelope pattern -- the consistency it provides is worth the small overhead.

### Timestamps

- Always use **ISO 8601** format for dates and times.
- Always use **UTC** timezone.

```json
{
  "created_at": "2025-06-15T10:30:00Z",
  "updated_at": "2025-06-15T12:00:00Z"
}
```

---

## 10. Rate Limiting

Rate limiting protects your API from **abuse, overload, and denial-of-service attacks** by restricting how many requests a client can make in a given time window.

### What is Rate Limiting?

- It sets a maximum number of requests a client can make per time period (e.g., 100 requests per minute).
- When the limit is exceeded, the server responds with `429 Too Many Requests`.
- It protects server resources and ensures fair usage for all clients.

### Rate Limit Response Headers

- **X-RateLimit-Limit** -- the maximum number of requests allowed in the time window.
- **X-RateLimit-Remaining** -- how many requests the client has left.
- **X-RateLimit-Reset** -- the Unix timestamp when the rate limit resets.
- **Retry-After** -- how many seconds the client should wait before trying again (included in 429 responses).

```
# Normal response headers
HTTP/1.1 200 OK
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1718450400

# Rate limited response
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1718450400
Retry-After: 45

{
  "error": {
    "code": 429,
    "message": "Too many requests. Please try again in 45 seconds."
  }
}
```

### Implementation in Laravel

```php
// In RouteServiceProvider or bootstrap
Route::middleware(['throttle:60,1'])->group(function () {
    // 60 requests per 1 minute
    Route::apiResource('posts', PostController::class);
});

// Custom rate limiter in AppServiceProvider
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;

public function boot()
{
    RateLimiter::for('api', function (Request $request) {
        return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
    });

    // Different limits for different endpoints
    RateLimiter::for('uploads', function (Request $request) {
        return Limit::perMinute(10)->by($request->user()->id);
    });
}

// Apply to routes
Route::middleware(['throttle:api'])->group(function () {
    Route::apiResource('posts', PostController::class);
});

Route::middleware(['throttle:uploads'])->group(function () {
    Route::post('/upload', [UploadController::class, 'store']);
});
```

### Implementation in Express

```js
const rateLimit = require('express-rate-limit');

// General rate limiter
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 60, // 60 requests per window
  standardHeaders: true, // sends RateLimit-* headers
  legacyHeaders: true, // sends X-RateLimit-* headers
  message: {
    error: {
      code: 429,
      message: 'Too many requests. Please try again later.',
    },
  },
});

app.use('/api', apiLimiter);

// Stricter limiter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 login attempts per 15 minutes
  message: {
    error: {
      code: 429,
      message: 'Too many login attempts. Please try again later.',
    },
  },
});

app.use('/api/login', authLimiter);
```

### Rate Limiting Best Practices

- Apply different limits to different endpoints (auth endpoints should be stricter).
- Rate limit by authenticated user ID when possible, fall back to IP address.
- Always include rate limit headers in every response so clients can track their usage.
- Return a clear `429` response with `Retry-After` header.
- Consider higher limits for paid/premium API tiers.
- Log rate limit violations for security monitoring.

---

## 11. HATEOAS

HATEOAS stands for **Hypermedia As The Engine Of Application State**. It is one of the constraints of REST that is often overlooked.

### What is HATEOAS?

- The server includes **links** in every response that tell the client what actions or resources are available next.
- The client does not need to hardcode URLs -- it discovers them dynamically from the response.
- Think of it like a web page: you do not type every URL manually; you follow links.

**Without HATEOAS:**

```json
{
  "data": {
    "id": 42,
    "title": "My Post",
    "status": "draft"
  }
}
```

The client must know in advance that to publish this post, it should send `PATCH /api/posts/42`.

**With HATEOAS:**

```json
{
  "data": {
    "id": 42,
    "title": "My Post",
    "status": "draft"
  },
  "links": {
    "self": "/api/posts/42",
    "publish": "/api/posts/42/publish",
    "edit": "/api/posts/42",
    "delete": "/api/posts/42",
    "author": "/api/users/1"
  }
}
```

Now the client knows exactly what actions are available and what URLs to use.

**Collection example with HATEOAS:**

```json
{
  "data": [
    {
      "id": 1,
      "title": "First Post",
      "links": {
        "self": "/api/posts/1"
      }
    },
    {
      "id": 2,
      "title": "Second Post",
      "links": {
        "self": "/api/posts/2"
      }
    }
  ],
  "links": {
    "self": "/api/posts?page=1",
    "next": "/api/posts?page=2",
    "prev": null,
    "first": "/api/posts?page=1",
    "last": "/api/posts?page=5"
  }
}
```

### When to Use HATEOAS

- **Use it** when building public APIs consumed by many different clients.
- **Use it** when the API has complex workflows with conditional actions (e.g., an order can be cancelled only if it is not yet shipped).
- **Skip it** for simple internal APIs where the frontend team controls both client and server.
- **Skip it** when it adds complexity without clear benefits.

### Laravel Example

```php
// In a Resource class
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
                'publish' => $this->status === 'draft'
                    ? route('posts.publish', $this->id)
                    : null,
                'author' => route('users.show', $this->user_id),
            ],
        ];
    }
}
```

### Express Example

```js
app.get('/api/posts/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);

  res.json({
    data: {
      id: post._id,
      title: post.title,
      status: post.status,
    },
    links: {
      self: `/api/posts/${post._id}`,
      edit: `/api/posts/${post._id}`,
      delete: `/api/posts/${post._id}`,
      publish: post.status === 'draft' ? `/api/posts/${post._id}/publish` : null,
      author: `/api/users/${post.authorId}`,
    },
  });
});
```

---

## 12. Idempotency

Idempotency is a property where **performing the same operation multiple times produces the same result** as performing it once.

### Why Idempotency Matters

- Network failures can cause clients to retry requests.
- If a POST request times out, the client does not know if the server processed it or not.
- Without idempotency, retrying could create duplicate resources, charge a customer twice, or send duplicate emails.

### Which HTTP Methods are Idempotent?

- **GET** -- always idempotent; reading data does not change anything.
- **PUT** -- idempotent; replacing a resource with the same data always produces the same result.
- **DELETE** -- idempotent; deleting a resource that is already deleted has no additional effect (the resource remains gone).
- **PATCH** -- NOT guaranteed to be idempotent; depends on the operation (e.g., "increment counter by 1" is not idempotent).
- **POST** -- NOT idempotent; calling POST twice typically creates two resources.

### Idempotency Keys

- An **idempotency key** is a unique identifier sent by the client with a request.
- If the server receives a request with the same idempotency key, it returns the cached response from the first request instead of processing it again.
- This makes non-idempotent operations (like POST) safe to retry.

```
POST /api/payments
Content-Type: application/json
Idempotency-Key: 550e8400-e29b-41d4-a716-446655440000

{
  "amount": 99.99,
  "currency": "USD",
  "customer_id": 42
}
```

**If the client retries with the same `Idempotency-Key`, the server returns the original response without processing the payment again.**

### Laravel Implementation

```php
class IdempotencyMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Only apply to POST requests
        if ($request->method() !== 'POST') {
            return $next($request);
        }

        $idempotencyKey = $request->header('Idempotency-Key');

        if (!$idempotencyKey) {
            return $next($request);
        }

        $cacheKey = "idempotency:{$idempotencyKey}";

        // Check if we already processed this request
        if (Cache::has($cacheKey)) {
            $cached = Cache::get($cacheKey);

            return response()->json(
                $cached['body'],
                $cached['status']
            )->header('X-Idempotent-Replayed', 'true');
        }

        // Process the request
        $response = $next($request);

        // Cache the response for 24 hours
        Cache::put($cacheKey, [
            'body' => $response->getData(true),
            'status' => $response->getStatusCode(),
        ], now()->addHours(24));

        return $response;
    }
}
```

### Express Implementation

```js
const idempotencyMiddleware = async (req, res, next) => {
  if (req.method !== 'POST') return next();

  const idempotencyKey = req.headers['idempotency-key'];

  if (!idempotencyKey) return next();

  const cacheKey = `idempotency:${idempotencyKey}`;

  // Check if we already processed this request (using Redis)
  const cached = await redis.get(cacheKey);

  if (cached) {
    const { body, status } = JSON.parse(cached);
    return res.status(status).set('X-Idempotent-Replayed', 'true').json(body);
  }

  // Capture the original res.json to intercept the response
  const originalJson = res.json.bind(res);

  res.json = (body) => {
    // Cache the response for 24 hours
    redis.set(cacheKey, JSON.stringify({
      body,
      status: res.statusCode,
    }), 'EX', 86400);

    return originalJson(body);
  };

  next();
};

app.use('/api', idempotencyMiddleware);
```

### Best Practices for Idempotency

- Always support idempotency keys for payment and financial endpoints.
- Use UUIDs (v4) as idempotency keys.
- Cache idempotent responses for a reasonable time (24 hours is common).
- Return a header (`X-Idempotent-Replayed: true`) to indicate the response was replayed from cache.
- Only apply idempotency to POST requests (other methods are already idempotent or do not need it).
- Include the idempotency key requirement in your API documentation.

---

## 13. API Documentation

Good documentation is the difference between an API that developers love and one they avoid.

### OpenAPI / Swagger

- **OpenAPI Specification (OAS)** is a standard format for describing REST APIs in JSON or YAML.
- **Swagger** is a set of tools that work with the OpenAPI Specification (Swagger UI, Swagger Editor, Swagger Codegen).
- The specification describes endpoints, request/response formats, authentication methods, and more.

**Basic OpenAPI example:**

```yaml
openapi: 3.0.0
info:
  title: Blog API
  version: 1.0.0
  description: A REST API for managing blog posts

servers:
  - url: https://api.example.com/v1

paths:
  /posts:
    get:
      summary: List all posts
      tags:
        - Posts
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: per_page
          in: query
          schema:
            type: integer
            default: 10
      responses:
        '200':
          description: A list of posts
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/Post'
                  meta:
                    $ref: '#/components/schemas/PaginationMeta'

    post:
      summary: Create a new post
      tags:
        - Posts
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - title
                - body
              properties:
                title:
                  type: string
                  minLength: 3
                  maxLength: 255
                body:
                  type: string
      responses:
        '201':
          description: Post created successfully
        '422':
          description: Validation error

components:
  schemas:
    Post:
      type: object
      properties:
        id:
          type: integer
        title:
          type: string
        body:
          type: string
        created_at:
          type: string
          format: date-time

    PaginationMeta:
      type: object
      properties:
        current_page:
          type: integer
        per_page:
          type: integer
        total:
          type: integer
        last_page:
          type: integer

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

### Laravel -- Auto-Generate Documentation

```php
// Using the scramble package (dedoc/scramble)
// composer require dedoc/scramble

// It automatically generates OpenAPI docs from your routes, controllers,
// form requests, and API resources.
// Visit /docs/api to see the interactive documentation.

// Or using annotations with l5-swagger:
// composer require darkaonline/l5-swagger

/**
 * @OA\Get(
 *     path="/api/posts",
 *     summary="List all posts",
 *     tags={"Posts"},
 *     @OA\Parameter(
 *         name="page",
 *         in="query",
 *         @OA\Schema(type="integer")
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Successful operation"
 *     )
 * )
 */
public function index() { ... }
```

### Express -- Auto-Generate Documentation

```js
// Using swagger-jsdoc and swagger-ui-express
// npm install swagger-jsdoc swagger-ui-express

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog API',
      version: '1.0.0',
    },
    servers: [{ url: 'http://localhost:3000/api' }],
  },
  apis: ['./routes/*.js'], // files with annotations
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// In your route files, add JSDoc annotations:

/**
 * @openapi
 * /posts:
 *   get:
 *     summary: List all posts
 *     tags: [Posts]
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: A list of posts
 */
app.get('/api/posts', postController.index);
```

### Postman

- Postman is a popular tool for **testing** and **documenting** APIs.
- You can create collections of requests, add descriptions, and share them with your team.
- Postman can import OpenAPI specs and generate collections automatically.
- You can publish Postman documentation as a public web page.

**Best practices for Postman documentation:**
- Organize requests into folders by resource.
- Add descriptions and example responses for every endpoint.
- Use environment variables for base URL, tokens, etc.
- Include pre-request scripts that automatically fetch auth tokens.
- Add tests to validate response structure.

### Documentation Best Practices

- Always keep documentation up to date -- outdated docs are worse than no docs.
- Include request and response examples for every endpoint.
- Document error responses, not just success cases.
- Provide authentication instructions and a "getting started" guide.
- Include rate limit information.
- Use interactive documentation (Swagger UI) so developers can test endpoints directly.
- Version your documentation alongside your API.
- Include a changelog so developers know what changed between versions.

---

## 14. REST API Best Practices Summary

**Resource Design:**
- Use plural nouns for resource names (`/users`, `/posts`, `/orders`).
- Use HTTP methods to express actions, not verbs in the URL.
- Keep URLs clean, lowercase, and use hyphens for multi-word resources.
- Limit nesting to two levels deep at most.

**HTTP Standards:**
- Use the correct HTTP method for each operation.
- Return the most specific HTTP status code for each response.
- Never return `200 OK` with an error message in the body.
- Use proper `Content-Type` headers (`application/json`).

**Request/Response:**
- Use a consistent response envelope (`data`, `meta`, `error`).
- Use consistent error response format across all endpoints.
- Use ISO 8601 for dates and UTC for timezone.
- Use snake_case for JSON field names.

**Pagination:**
- Always paginate collection endpoints -- never return unbounded lists.
- Use page-based for simple UIs, cursor-based for large datasets and feeds.
- Include pagination metadata in every paginated response.

**Filtering and Sorting:**
- Use query parameters for filtering, sorting, and searching.
- Support common filter patterns (`?status=active&sort=-created_at`).
- Use `-` prefix for descending sort order.

**Authentication and Security:**
- Use Bearer tokens (JWT) for stateless authentication.
- Never pass tokens or secrets in URL query parameters.
- Always use HTTPS in production.
- Implement rate limiting on all endpoints, stricter on auth endpoints.

**Versioning:**
- Version your API from day one.
- URL path versioning (`/v1/`) is the simplest and most recommended approach.
- Only increment the major version for breaking changes.

**Idempotency:**
- Support idempotency keys for POST endpoints that create resources or trigger actions.
- Always make this available for financial/payment operations.

**Documentation:**
- Document every endpoint with request/response examples.
- Use OpenAPI/Swagger for interactive documentation.
- Include error responses, rate limits, and authentication instructions.
- Keep docs in sync with the actual API.

**General:**
- Be consistent -- whatever conventions you choose, apply them everywhere.
- Design for the consumer -- think about how the frontend or mobile developer will use your API.
- Handle errors gracefully -- always return helpful error messages.
- Log everything -- request IDs, rate limit violations, errors.
- Test your API -- use automated tests to verify every endpoint works correctly.

---

**Further Reading:**
- [REST API Tutorial](https://restfulapi.net/)
- [HTTP Status Codes Reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [OpenAPI Specification](https://spec.openapis.org/oas/latest.html)
- [JSON:API Standard](https://jsonapi.org/)
- [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines)
