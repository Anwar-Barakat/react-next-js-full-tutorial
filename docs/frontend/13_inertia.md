# Inertia.js Guide

Build SPAs with Laravel + React without a separate API. Laravel handles routing and controllers; Inertia replaces Blade views with React components and manages all XHR communication.

---

## 1. What is Inertia.js?

- No REST API — controllers return React components directly via `Inertia::render()`.
- First load returns full HTML; subsequent navigations send XHR returning only JSON (component + props), swapping the component without a page reload.

**Inertia vs API + React:**

| | Inertia.js | API + React |
|---|---|---|
| Routing | Laravel routes | React Router / Next.js |
| Data fetching | Controller props | `fetch`/`axios` |
| Auth | Laravel session (cookies) | JWT / Sanctum tokens |
| SSR/SEO | Optional plugin | Next.js built-in |
| Best for | Admin panels, CRUD, internal tools | Public SEO-heavy sites |

---

## 2. Setup

**Backend:**

```bash
composer require inertiajs/inertia-laravel
php artisan inertia:middleware
```

Register `HandleInertiaRequests` in `bootstrap/app.php`:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->web(append: [
        \App\Http\Middleware\HandleInertiaRequests::class,
    ]);
})
```

`resources/views/app.blade.php`:

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
<body>@inertia</body>
</html>
```

**Frontend:**

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

## 3. Pages, Routing, and Props

Routing lives entirely on the Laravel side. React components (pages) live in `resources/js/pages/`.

**Controller:**

```php
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('Users/Index', [
            'users'   => User::paginate(10),
            'canEdit' => auth()->user()->can('update', $post),
        ]);
    }
}
```

**React page** (`resources/js/pages/Users/Index.jsx`):

```jsx
export default function UsersIndex({ users, canEdit }) {
    return (
        <div>
            <h1>Users</h1>
            {users.data.map(user => <div key={user.id}>{user.name}</div>)}
        </div>
    );
}
```

Props arrive as regular React props — no `useEffect` or `fetch` needed.

**Lazy props** (evaluated only when explicitly requested):

```php
return Inertia::render('Dashboard', [
    'stats' => Inertia::lazy(fn () => $this->getStats()),
]);
```

---

## 4. Shared Data

Defined in `HandleInertiaRequests::share()` — sent with every response.

```php
public function share(Request $request): array
{
    return array_merge(parent::share($request), [
        'auth'  => ['user' => $request->user()?->only('id', 'name', 'role')],
        'flash' => [
            'success' => $request->session()->get('success'),
            'error'   => $request->session()->get('error'),
        ],
    ]);
}
```

Access in any component via `usePage()`:

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

## 5. Navigation

Use `<Link>` instead of `<a>` for client-side navigation:

```jsx
import { Link, router } from '@inertiajs/react';

// Declarative
<Link href="/dashboard">Dashboard</Link>
<Link href="/logout" method="post" as="button">Logout</Link>

// Programmatic
router.visit('/dashboard');
router.delete(`/posts/${id}`, { onSuccess: () => console.log('Deleted!') });
```

---

## 6. Forms and File Uploads

`useForm` manages form state, submission, validation errors, and loading state:

```jsx
import { useForm } from '@inertiajs/react';

export default function CreatePost() {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '', content: '',
    });

    return (
        <form onSubmit={e => { e.preventDefault(); post('/posts', { onSuccess: () => reset() }); }}>
            <input value={data.title} onChange={e => setData('title', e.target.value)} />
            {errors.title && <p className="error">{errors.title}</p>}

            <textarea value={data.content} onChange={e => setData('content', e.target.value)} />
            {errors.content && <p className="error">{errors.content}</p>}

            <button disabled={processing}>{processing ? 'Saving...' : 'Save'}</button>
        </form>
    );
}
```

**File uploads:**

```jsx
const { data, setData, post, progress } = useForm({ avatar: null });

<form onSubmit={e => { e.preventDefault(); post('/profile/avatar'); }} encType="multipart/form-data">
    <input type="file" onChange={e => setData('avatar', e.target.files[0])} />
    {progress && <progress value={progress.percentage} max="100" />}
    <button>Upload</button>
</form>
```

**`useForm` properties:** `data`/`setData`, `errors`, `post`/`put`/`patch`/`delete`, `processing`, `progress`, `reset`/`clearErrors`.

**Laravel controller (store):**

```php
public function store(Request $request)
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

## 7. Authentication

Inertia uses Laravel session-based auth — no tokens needed.

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
public function login(Request $request)
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

---

## 8. Layouts

Assign a persistent layout so it stays mounted between navigations:

```jsx
// resources/js/layouts/AppLayout.jsx
export default function AppLayout({ children }) {
    return (
        <div>
            <nav>...</nav>
            <main>{children}</main>
        </div>
    );
}

// resources/js/pages/Dashboard.jsx
Dashboard.layout = (page) => <AppLayout>{page}</AppLayout>;
```

**Default layout for all pages** (set in `app.jsx`):

```jsx
page.default.layout ??= (page) => <AppLayout>{page}</AppLayout>;
```

---

## 9. Inertia vs Next.js

| | Inertia.js | Next.js |
|---|---|---|
| Backend | Laravel | Node.js / any API |
| Routing | Laravel routes | File-based |
| Data fetching | Controller props | `getServerSideProps`, `fetch` |
| SSR / SEO | Optional plugin | Built-in, excellent |
| Auth | Laravel session | NextAuth / custom |
| Best for | Admin panels, CRUD, internal tools | Public sites, SEO |

Use **Inertia** for Laravel-centric apps without SSR needs. Use **Next.js** for public-facing sites needing SSR or a decoupled frontend.
