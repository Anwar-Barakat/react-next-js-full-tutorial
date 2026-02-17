# Inertia.js Guide

A comprehensive guide to building modern full-stack apps with Inertia.js, Laravel, and React.

## Table of Contents

1. [What is Inertia.js?](#1-what-is-inertiajs)
2. [How does Inertia work?](#2-how-does-inertia-work)
3. [Inertia vs Traditional API (SPA approach)](#3-inertia-vs-traditional-api-spa-approach)
4. [Setting up Inertia with Laravel and React](#4-setting-up-inertia-with-laravel-and-react)
5. [Pages and Routing](#5-pages-and-routing)
6. [Passing Props from Laravel to React](#6-passing-props-from-laravel-to-react)
7. [Shared Data](#7-shared-data)
8. [Client-Side Navigation with Link](#8-client-side-navigation-with-link)
9. [Forms with Inertia](#9-forms-with-inertia)
10. [File Uploads with Inertia](#10-file-uploads-with-inertia)
11. [Authentication with Inertia](#11-authentication-with-inertia)
12. [Layouts in Inertia](#12-layouts-in-inertia)
13. [useForm Hook](#13-useform-hook)
14. [Flash Messages](#14-flash-messages)
15. [Inertia vs Next.js](#15-inertia-vs-nextjs)

---

## 1. What is Inertia.js?

- Inertia.js is a library that lets you build **single-page applications (SPAs)** using Laravel on the backend and React (or Vue) on the frontend — **without building a separate API**.
- There is no REST API between Laravel and React — Inertia handles the communication automatically.
- You keep Laravel routing, controllers, and middleware, but return React components instead of Blade views.

**What Inertia replaces:**
- Blade templates → React pages.
- JSON API responses → Direct props to React components.
- Axios API calls → Inertia's built-in navigation.

In short: Inertia bridges Laravel and React so they work as one app — no API layer needed.

---

## 2. How does Inertia work?

**First page load:**
1. Browser requests `/dashboard`.
2. Laravel controller renders a full HTML page with the React app embedded.
3. The initial page props are passed as JSON inside the HTML.

**Subsequent navigation:**
1. User clicks a link (via Inertia's `<Link>`).
2. Inertia sends an XHR request with a special header `X-Inertia: true`.
3. Laravel detects it as an Inertia request → returns only JSON (component name + props).
4. Inertia swaps the React component on the client — **no full page reload**.

```
First load:
Browser → GET /dashboard → Laravel → Full HTML + initial props → React mounts

Next navigation:
<Link href="/profile"> → Inertia XHR → Laravel → JSON (component + props) → React swaps component
```

In short: Inertia acts as the bridge — full HTML on first load, JSON on navigation — feels like an SPA without a separate API.

---

## 3. Inertia vs Traditional API (SPA approach)

| Feature | Inertia.js | API + React (Next.js / CRA) |
|---------|-----------|---------------------------|
| **Backend** | Laravel (routes + controllers) | Laravel (API only) |
| **Frontend** | React pages (no router needed) | React + React Router / Next.js |
| **Data fetching** | Props from controller | `fetch` / `axios` API calls |
| **Auth** | Laravel session (cookies) | JWT / Sanctum tokens |
| **SSR** | Optional (Inertia SSR) | Built-in (Next.js) |
| **SEO** | Needs SSR for SEO | Next.js has built-in SSR |
| **Complexity** | Low — one codebase | Higher — two separate systems |
| **Best for** | Internal tools, admin panels, CRUD apps | Public sites needing SEO, complex frontends |

In short: Inertia is simpler and faster to build — great when you don't need SSR or a public API.

---

## 4. Setting up Inertia with Laravel and React

**Backend (Laravel):**

```bash
composer require inertiajs/inertia-laravel
php artisan inertia:middleware
```

Add `HandleInertiaRequests` middleware in `bootstrap/app.php` (Laravel 11+):

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->web(append: [
        \App\Http\Middleware\HandleInertiaRequests::class,
    ]);
})
```

Update `resources/views/app.blade.php` (root template):

```blade
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App</title>
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/pages/{$page['component']}.jsx"])
    @inertiaHead
</head>
<body>
    @inertia
</body>
</html>
```

**Frontend (React):**

```bash
npm install @inertiajs/react
```

`resources/js/app.jsx`:

```jsx
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.jsx', { eager: true });
        return pages[`./pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
```

---

## 5. Pages and Routing

- In Inertia, routing lives entirely on the **Laravel side**.
- React components are called **Pages** — stored in `resources/js/pages/`.
- A controller returns an Inertia response instead of a Blade view.

**Laravel route:**

```php
// routes/web.php
Route::get('/dashboard', [DashboardController::class, 'index']);
Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{user}', [UserController::class, 'show']);
```

**Laravel controller:**

```php
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(): \Inertia\Response
    {
        return Inertia::render('Users/Index', [
            'users' => User::paginate(10),
        ]);
    }

    public function show(User $user): \Inertia\Response
    {
        return Inertia::render('Users/Show', [
            'user' => $user,
        ]);
    }
}
```

**React page** (`resources/js/pages/Users/Index.jsx`):

```jsx
export default function UsersIndex({ users }) {
    return (
        <div>
            <h1>Users</h1>
            {users.data.map(user => (
                <div key={user.id}>{user.name}</div>
            ))}
        </div>
    );
}
```

---

## 6. Passing Props from Laravel to React

- Props are passed as the second argument to `Inertia::render()`.
- They arrive as regular React props — no need for `useEffect` or `fetch`.

```php
// Controller
return Inertia::render('Posts/Show', [
    'post'     => PostResource::make($post),
    'comments' => CommentResource::collection($post->comments),
    'canEdit'  => auth()->user()->can('update', $post),
]);
```

```jsx
// React page
export default function PostShow({ post, comments, canEdit }) {
    return (
        <article>
            <h1>{post.title}</h1>
            <p>{post.content}</p>

            {canEdit && <a href={`/posts/${post.id}/edit`}>Edit</a>}

            <section>
                {comments.map(comment => (
                    <p key={comment.id}>{comment.body}</p>
                ))}
            </section>
        </article>
    );
}
```

**Lazy props** — only evaluated when requested (good for heavy data):

```php
return Inertia::render('Dashboard', [
    'stats'   => Inertia::lazy(fn () => $this->getStats()),
    'reports' => Inertia::lazy(fn () => $this->getReports()),
]);
```

---

## 7. Shared Data

- Shared data is sent with **every** Inertia response — useful for auth user, flash messages, permissions.
- Defined in `app/Http/Middleware/HandleInertiaRequests.php`.

```php
class HandleInertiaRequests extends Middleware
{
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user() ? [
                    'id'   => $request->user()->id,
                    'name' => $request->user()->name,
                    'role' => $request->user()->role,
                ] : null,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error'   => $request->session()->get('error'),
            ],
        ]);
    }
}
```

**Accessing shared data in React:**

```jsx
import { usePage } from '@inertiajs/react';

export default function Navbar() {
    const { auth, flash } = usePage().props;

    return (
        <nav>
            {auth.user ? <span>Hello, {auth.user.name}</span> : <a href="/login">Login</a>}
            {flash.success && <div className="alert-success">{flash.success}</div>}
        </nav>
    );
}
```

---

## 8. Client-Side Navigation with Link

- Use Inertia's `<Link>` instead of `<a>` for client-side navigation (no full page reload).

```jsx
import { Link } from '@inertiajs/react';

export default function Nav() {
    return (
        <nav>
            {/* Client-side navigation */}
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/users">Users</Link>

            {/* With method */}
            <Link href="/logout" method="post" as="button">Logout</Link>

            {/* Replace history entry instead of pushing */}
            <Link href="/search" replace>Search</Link>
        </nav>
    );
}
```

**Programmatic navigation:**

```jsx
import { router } from '@inertiajs/react';

function handleDelete(id) {
    router.delete(`/posts/${id}`, {
        onSuccess: () => console.log('Deleted!'),
        onError:   (errors) => console.log(errors),
    });
}

// Redirect
router.visit('/dashboard');
router.visit('/profile', { method: 'get' });
```

---

## 9. Forms with Inertia

**Using `useForm` hook (recommended):**

```jsx
import { useForm } from '@inertiajs/react';

export default function CreatePost() {
    const { data, setData, post, processing, errors, reset } = useForm({
        title:   '',
        content: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post('/posts', {
            onSuccess: () => reset(),
        });
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <input
                    value={data.title}
                    onChange={e => setData('title', e.target.value)}
                    placeholder="Title"
                />
                {errors.title && <p className="error">{errors.title}</p>}
            </div>

            <div>
                <textarea
                    value={data.content}
                    onChange={e => setData('content', e.target.value)}
                />
                {errors.content && <p className="error">{errors.content}</p>}
            </div>

            <button type="submit" disabled={processing}>
                {processing ? 'Saving...' : 'Save Post'}
            </button>
        </form>
    );
}
```

**Laravel controller (store):**

```php
public function store(Request $request): \Illuminate\Http\RedirectResponse
{
    $validated = $request->validate([
        'title'   => ['required', 'string', 'max:255'],
        'content' => ['required', 'string'],
    ]);

    Post::create([...$validated, 'user_id' => auth()->id()]);

    return redirect()->route('posts.index')->with('success', 'Post created!');
}
```

---

## 10. File Uploads with Inertia

```jsx
import { useForm } from '@inertiajs/react';

export default function AvatarUpload() {
    const { data, setData, post, progress, errors } = useForm({
        avatar: null,
    });

    function handleSubmit(e) {
        e.preventDefault();
        post('/profile/avatar');
    }

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <input
                type="file"
                onChange={e => setData('avatar', e.target.files[0])}
            />

            {/* Upload progress bar */}
            {progress && (
                <progress value={progress.percentage} max="100">
                    {progress.percentage}%
                </progress>
            )}

            {errors.avatar && <p>{errors.avatar}</p>}
            <button type="submit">Upload</button>
        </form>
    );
}
```

---

## 11. Authentication with Inertia

- Inertia uses **Laravel session-based authentication** (cookies) — no tokens needed.
- Protected routes use standard Laravel middleware.

**Routes:**

```php
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
});
```

**Login controller:**

```php
public function login(Request $request): \Illuminate\Http\RedirectResponse
{
    $credentials = $request->validate([
        'email'    => ['required', 'email'],
        'password' => ['required'],
    ]);

    if (Auth::attempt($credentials, $request->boolean('remember'))) {
        $request->session()->regenerate();
        return redirect()->intended('/dashboard');
    }

    return back()->withErrors(['email' => 'Invalid credentials.']);
}
```

**Login page (React):**

```jsx
import { useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email:    '',
        password: '',
        remember: false,
    });

    return (
        <form onSubmit={e => { e.preventDefault(); post('/login'); }}>
            <input
                type="email"
                value={data.email}
                onChange={e => setData('email', e.target.value)}
            />
            {errors.email && <p>{errors.email}</p>}

            <input
                type="password"
                value={data.password}
                onChange={e => setData('password', e.target.value)}
            />

            <button disabled={processing}>Login</button>
        </form>
    );
}
```

---

## 12. Layouts in Inertia

**Persistent layout** — keeps the layout mounted between navigations (preserves state):

```jsx
// resources/js/layouts/AppLayout.jsx
export default function AppLayout({ children }) {
    return (
        <div>
            <nav>...</nav>
            <main>{children}</main>
            <footer>...</footer>
        </div>
    );
}
```

```jsx
// resources/js/pages/Dashboard.jsx
import AppLayout from '@/layouts/AppLayout';

export default function Dashboard({ stats }) {
    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    );
}

// Attach layout to page
Dashboard.layout = (page) => <AppLayout>{page}</AppLayout>;
```

**Default layout for all pages** (in `app.jsx`):

```jsx
import AppLayout from './layouts/AppLayout';

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.jsx', { eager: true });
        const page  = pages[`./pages/${name}.jsx`];
        page.default.layout ??= (page) => <AppLayout>{page}</AppLayout>;
        return page;
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
```

---

## 13. useForm Hook

The `useForm` hook manages form state, submission, validation errors, and loading state:

```jsx
const {
    data,        // Current form values
    setData,     // Update a field: setData('name', 'Anwar')
    errors,      // Validation errors from Laravel
    post,        // Submit POST request
    put,         // Submit PUT request
    patch,       // Submit PATCH request
    delete: destroy, // Submit DELETE request
    processing,  // true while request is in-flight
    progress,    // Upload progress (file uploads)
    reset,       // Reset form to initial values
    clearErrors, // Clear validation errors
    transform,   // Transform data before sending
} = useForm({ name: '', email: '' });

// Transform data before submitting (e.g., add extra fields)
post('/users', {
    transform: (data) => ({
        ...data,
        role: 'user',
    }),
});
```

---

## 14. Flash Messages

**Laravel controller:**

```php
return redirect()->route('posts.index')
    ->with('success', 'Post created successfully!');
```

**Shared in middleware:**

```php
'flash' => [
    'success' => $request->session()->get('success'),
    'error'   => $request->session()->get('error'),
],
```

**React component:**

```jsx
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function FlashMessage() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (flash.success) {
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    if (!visible || !flash.success) return null;

    return (
        <div className="alert alert-success">
            {flash.success}
        </div>
    );
}
```

---

## 15. Inertia vs Next.js

| Feature | Inertia.js | Next.js |
|---------|-----------|---------|
| **Backend** | Laravel (full) | Node.js / any API |
| **Routing** | Laravel routes | File-based routing |
| **Data fetching** | Controller props | `getServerSideProps`, `fetch` |
| **SSR** | Optional plugin | Built-in |
| **SEO** | Needs SSR setup | Excellent built-in SSR |
| **Auth** | Laravel session | Custom (NextAuth, etc.) |
| **API layer** | Not needed | Required |
| **Learning curve** | Low (Laravel devs) | Medium |
| **Best for** | Admin panels, CRUD, internal tools | Public sites, SEO, complex frontends |
| **Real-time** | Laravel Reverb + Echo | Pusher / custom |

**When to use Inertia:**
- You want to keep Laravel as your full framework (routing, auth, middleware).
- Building admin panels, dashboards, or internal tools.
- You don't need SEO or SSR.
- You want to avoid maintaining a separate API.

**When to use Next.js:**
- You need SSR for SEO (public-facing site).
- You need a standalone frontend that may connect to multiple backends.
- You need edge functions, image optimization, or static site generation.
