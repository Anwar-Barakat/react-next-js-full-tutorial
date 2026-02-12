# Next.js Framework Guide

A comprehensive guide to Next.js 16 - The React Framework for Production.

---

## Table of Contents

1. [What is Next.js?](#1-what-is-nextjs)
2. [Why use Next.js?](#2-why-use-nextjs)
3. [Server-Side Rendering (SSR)](#3-server-side-rendering-ssr)
4. [Static Site Generation (SSG)](#4-static-site-generation-ssg)
5. [Incremental Static Regeneration (ISR)](#5-incremental-static-regeneration-isr)
6. [Client-Side Rendering (CSR)](#6-client-side-rendering-csr)
7. [Rendering Strategies Comparison](#7-rendering-strategies-comparison)
8. [File-Based Routing](#8-file-based-routing)
9. [Link Component](#9-link-component)
10. [Route Handlers (API Routes)](#10-route-handlers-api-routes)
11. [Pages Router vs App Router](#11-pages-router-vs-app-router)
12. [Server Components and Client Components](#12-server-components-and-client-components)
13. [Layouts](#13-layouts)
14. [Loading and Error States](#14-loading-and-error-states)
15. [Image Component](#15-image-component)
16. [Metadata](#16-metadata)
17. [Proxy (Middleware)](#17-proxy-middleware)
18. [Environment Variables](#18-environment-variables)
19. [Cache Components (Next.js 16)](#19-cache-components-nextjs-16)
20. [Caching APIs (Next.js 16)](#20-caching-apis-nextjs-16)
21. [Turbopack (Next.js 16)](#21-turbopack-nextjs-16)
22. [React Compiler (Next.js 16)](#22-react-compiler-nextjs-16)
23. [Streaming](#23-streaming)
24. [useRouter Hook](#24-userouter-hook)
25. [Redirects](#25-redirects)
26. [Script Component](#26-script-component)
27. [Font Optimization](#27-font-optimization)
28. [Deployment](#28-deployment)
29. [React 19.2 Features](#29-react-192-features)
30. [Best Practices](#30-best-practices)
31. [Summary](#31-summary)

---

## 1. What is Next.js?

**Next.js** is a React framework for building full-stack web applications.

**Key characteristics:**
- Built on top of React with powerful features
- Supports multiple rendering strategies (SSR, SSG, CSR, ISR)
- Includes built-in routing, API routes, and optimization
- Zero configuration needed to get started
- **Next.js 16** brings Turbopack as default bundler, Cache Components, and React 19.2 support

**What it adds to React:**
- Server-side rendering
- Static site generation
- File-based routing system
- API routes
- Image optimization
- Font optimization
- Code splitting
- Fast Refresh

---

## 2. Why use Next.js?

**Advantages:**

| Feature | Benefit |
|---------|---------|
| **Server-Side Rendering** | Better SEO and initial load performance |
| **File-Based Routing** | No need for react-router configuration |
| **Route Handlers** | Build backend endpoints in same project |
| **Image Optimization** | Automatic image optimization with next/image |
| **Code Splitting** | Automatic per-page code splitting |
| **Built-in CSS/Sass** | Support for CSS Modules and Sass |
| **Fast Refresh** | Instant feedback during development (10x faster with Turbopack) |
| **Production Ready** | Optimized builds out of the box (2-5x faster with Turbopack) |
| **React Compiler** | Automatic memoization without manual optimization |

---

## 3. Server-Side Rendering (SSR)

**What is SSR:**
SSR renders pages on the server for each request.

**How it works:**
- HTML is generated on the server
- Sent to the client
- Good for SEO and dynamic content
- Slower than SSG but always fresh data

**Analogy:**
- **SSG** - You make the food before customers arrive (in the morning)
- **SSR** - You prepare the meal only when the customer orders it

**Next.js 16 App Router Example:**

```javascript
// app/user/[id]/page.js
async function getUser(id) {
  const res = await fetch(`https://api.example.com/users/${id}`, {
    cache: 'no-store' // Force SSR - always fetch fresh
  });
  return res.json();
}

export default async function UserPage({ params }) {
  const { id } = await params; // Async params in Next.js 16
  const user = await getUser(id);

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

**Flow:**
1. User requests `/user/123`
2. Server fetches data from API
3. Server renders HTML with data
4. HTML sent to browser
5. React hydrates the page

**When to use SSR:**
- Data changes frequently
- Content is user-specific
- SEO is important with dynamic data
- Use `fetch()` with `{ cache: "no-store" }`

---

## 4. Static Site Generation (SSG)

**What is SSG:**
SSG generates HTML at build time.

**How it works:**
- Pages are pre-rendered once
- Reused for all requests
- Fastest performance (served from CDN)
- Best for content that doesn't change often

**Next.js 16 App Router Example:**

```javascript
// app/blog/[slug]/page.js
async function getPost(slug) {
  const res = await fetch(`https://api.example.com/posts/${slug}`, {
    cache: 'force-cache' // Force static generation
  });
  return res.json();
}

export default async function BlogPost({ params }) {
  const { slug } = await params; // Async params in Next.js 16
  const post = await getPost(slug);

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}

// For dynamic routes, use generateStaticParams
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then(res => res.json());

  return posts.map((post) => ({
    slug: post.slug
  }));
}
```

**Flow:**
1. At build time, `generateStaticParams` returns all possible paths
2. `getPost` runs for each path
3. HTML files are generated
4. On request, pre-built HTML is served instantly

**When to use SSG:**
- Data is static or changes rarely
- Same content for all users
- Maximum performance needed
- Use `fetch()` with `{ cache: "force-cache" }`

---

## 5. Incremental Static Regeneration (ISR)

**What is ISR:**
ISR combines benefits of SSG and SSR - pages are statically generated but can be updated after build.

**How it works:**
- Regenerates pages in the background on a schedule
- Balances performance with fresh data

**Next.js 16 App Router Example:**

```javascript
// app/product/[id]/page.js
async function getProduct(id) {
  const res = await fetch(`https://api.example.com/products/${id}`, {
    next: { revalidate: 60 } // Revalidate every 60 seconds
  });
  return res.json();
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  return (
    <div>
      <h1>{product.name}</h1>
      <p>${product.price}</p>
    </div>
  );
}
```

**Alternative - Cache Components (Next.js 16+):**

```javascript
'use cache';
async function getProducts() {
  const res = await fetch('https://api.example.com/products');
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts(); // Cached with "use cache"
  return <div>{/* Render products */}</div>;
}
```

**ISR Flow:**
1. First request: Serve stale page (cached)
2. Background: Regenerate page if revalidate time passed
3. Next request: Serve newly generated page
4. Cycle repeats

**When to use ISR:**
- Data changes periodically (not constantly)
- You want SSG performance with fresher data
- You have many pages but can't rebuild all frequently

---

## 6. Client-Side Rendering (CSR)

**What is CSR:**
CSR renders content in the browser using JavaScript.

**How it works:**
- Initial HTML is minimal
- JavaScript loads and renders content
- Same as traditional React apps
- Poor for SEO but good for dynamic user-specific content

**Next.js 16 Client Component:**

```javascript
'use client';

import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return <div>{data.content}</div>;
}
```

**Flow:**
1. Server sends minimal HTML
2. Browser downloads JavaScript
3. React hydrates and renders
4. Client fetches data
5. UI updates

**When to use CSR:**
- SEO is not important (dashboards, admin panels)
- Content is highly interactive
- Data is user-specific and protected

---

## 7. Rendering Strategies Comparison

| Feature | SSR | SSG | ISR | CSR |
|---------|-----|-----|-----|-----|
| **Speed** | Medium | Fastest | Fast | Slow |
| **SEO** | ✅ Excellent | ✅ Excellent | ✅ Excellent | ❌ Poor |
| **Fresh Data** | ✅ Always | ❌ Build time only | ⚡ Periodic | ✅ Always |
| **Server Cost** | High | Low | Low | Low |
| **Build Time** | None | Long | Short | Short |
| **Use Case** | Dynamic content | Static content | Periodic updates | Dashboards |

**When to use each:**
- **SSR** - User dashboards, personalized pages, real-time data
- **SSG** - Marketing sites, blogs, documentation
- **ISR** - E-commerce products, news sites
- **CSR** - Admin panels, interactive tools (no SEO needed)

---

## 8. File-Based Routing

**What it is:**
Next.js automatically creates routes based on file structure - no need to configure react-router.

**App Router structure (Next.js 16 default):**

```
app/
  page.js               → /
  about/
    page.js             → /about
  blog/
    page.js             → /blog
    [slug]/
      page.js           → /blog/:slug (dynamic)
  users/
    [id]/
      profile/
        page.js         → /users/:id/profile
  [...slug]/
    page.js             → /any/nested/path (catch-all)
```

**Dynamic route example:**

```javascript
// app/blog/[slug]/page.js
export default async function BlogPost({ params }) {
  const { slug } = await params; // Async params in Next.js 16
  // URL: /blog/my-post
  // params.slug = "my-post"
  return <h1>Blog: {slug}</h1>;
}
```

**Catch-all route example:**

```javascript
// app/docs/[...slug]/page.js
// Matches: /docs/a, /docs/a/b, /docs/a/b/c
export default async function Docs({ params }) {
  const { slug } = await params;
  // URL: /docs/next/routing/basics
  // params.slug = ["next", "routing", "basics"]
  return <div>{slug.join('/')}</div>;
}
```

---

## 9. Link Component

**Purpose:**
Enable client-side navigation with prefetching.

**Features:**
- Prefetches pages for faster navigation (smarter in Next.js 16)
- No full page reload
- Better performance than `<a>` tags

**Basic usage:**

```javascript
import Link from 'next/link';

export default function Nav() {
  return (
    <nav>
      {/* Basic link */}
      <Link href="/about">About</Link>

      {/* Dynamic route */}
      <Link href={`/blog/${post.slug}`}>
        {post.title}
      </Link>

      {/* External link (uses regular <a>) */}
      <a href="https://example.com" target="_blank" rel="noopener">
        External
      </a>
    </nav>
  );
}
```

**Programmatic navigation:**

```javascript
'use client';
import { useRouter } from 'next/navigation';

export default function Component() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/dashboard');
    router.refresh(); // New in Next.js 16
  };

  return <button onClick={handleClick}>Go to Dashboard</button>;
}
```

**Next.js 16 improvements:**
- Layout deduplication: Shared layouts download once
- Incremental prefetching: Only fetch what's not cached
- Auto-cancels prefetch when links leave viewport

---

## 10. Route Handlers (API Routes)

**What they are:**
API endpoints in the App Router - serverless functions that run on the server on demand.

**Location:**
Files under `app/api/` with `route.js/ts` become API endpoints.

**Basic example:**

```javascript
// app/api/users/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  const users = await db.getUsers();
  return NextResponse.json(users);
}

export async function POST(request) {
  const body = await request.json();
  const user = await db.createUser(body);
  return NextResponse.json(user, { status: 201 });
}
```

**Dynamic route:**

```javascript
// app/api/users/[id]/route.js
export async function GET(request, { params }) {
  const { id } = await params; // Async params in Next.js 16
  const user = await db.getUser(id);

  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(user);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  await db.deleteUser(id);
  return NextResponse.json({ success: true });
}
```

**Calling from frontend:**

```javascript
// Client component
async function fetchUsers() {
  const res = await fetch('/api/users');
  const users = await res.json();
  return users;
}
```

---

## 11. Pages Router vs App Router

**Pages Router:**
- Original Next.js routing (pages/ directory)
- Legacy approach

**App Router:**
- New routing system in Next.js 13+ (app/ directory)
- **Default in Next.js 16**
- Supports React Server Components
- Both can coexist in same project

**Comparison:**

```javascript
// Pages Router (legacy) - pages/blog/[slug].js
export async function getServerSideProps({ params }) {
  const post = await fetchPost(params.slug);
  return { props: { post } };
}

export default function BlogPost({ post }) {
  return <h1>{post.title}</h1>;
}

// App Router (Next.js 16 default) - app/blog/[slug]/page.js
async function getPost(slug) {
  const res = await fetch(`https://api.example.com/posts/${slug}`, {
    cache: 'no-store'
  });
  return res.json();
}

export default async function BlogPost({ params }) {
  const { slug } = await params; // Async params
  const post = await getPost(slug); // Server Component
  return <h1>{post.title}</h1>;
}
```

**App Router advantages:**
- React Server Components
- Streaming and Suspense
- Better layouts
- Simpler data fetching
- Explicit caching with Cache Components

---

## 12. Server Components and Client Components

**Server Components:**
- Run only on server, don't ship to browser
- Can access backend resources directly
- Reduce bundle size

**Client Components:**
- Run on browser, interactive
- Use 'use client' directive
- Can use hooks (useState, useEffect)

**React Compiler (stable in Next.js 16) automatically optimizes components.**

**Server Component (default):**

```javascript
async function getBlogPosts() {
  const res = await fetch('https://api.example.com/posts');
  return res.json();
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
        </article>
      ))}
    </div>
  );
}
```

**Client Component:**

```javascript
'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  // React Compiler automatically optimizes this
  // No need for useMemo or useCallback
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

**What Server Components can do:**
- Access backend resources directly
- Keep sensitive data on server
- Reduce bundle size
- Fetch data directly

**What Client Components can do:**
- Use hooks (useState, useEffect)
- Handle browser events
- Use browser APIs
- Have interactivity

---

## 13. Layouts

**What they are:**
UI that wraps pages and persists across navigation - don't re-render on route changes.

**Features:**
- Can be nested
- Defined in `layout.js` files
- **Next.js 16 optimizes layouts with deduplication**

**Root layout (required):**

```javascript
// app/layout.js
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav>Navigation</nav>
        </header>
        <main>{children}</main>
        <footer>Footer</footer>
      </body>
    </html>
  );
}
```

**Nested layout:**

```javascript
// app/dashboard/layout.js
export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard">
      <aside>Sidebar</aside>
      <div className="content">
        {children}
      </div>
    </div>
  );
}

// app/dashboard/page.js
export default function DashboardPage() {
  return <h1>Dashboard</h1>;
}

// URL: /dashboard renders:
// RootLayout → DashboardLayout → DashboardPage
```

**Next.js 16 optimization:**
Shared layouts download only once when prefetching multiple URLs.

---

## 14. Loading and Error States

**Loading UI:**
`loading.js` shows loading UI while page loads.

**Error UI:**
`error.js` shows error UI when something fails.

**They automatically wrap pages with Suspense/ErrorBoundary.**

**Loading state:**

```javascript
// app/blog/loading.js
export default function Loading() {
  return <div>Loading blog posts...</div>;
}
```

**Error state:**

```javascript
// app/blog/error.js
'use client'; // Error boundaries must be Client Components

export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

**Page that uses them:**

```javascript
// app/blog/page.js
async function getPosts() {
  const res = await fetch('https://api.example.com/posts');
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

export default async function BlogPage() {
  const posts = await getPosts(); // If slow → loading.js shows
                                  // If fails → error.js shows
  return <div>{/* Render posts */}</div>;
}
```

---

## 15. Image Component

**Purpose:**
Optimize images automatically.

**Features:**
- Lazy loads images
- Serves responsive images
- Converts to modern formats (WebP, AVIF)
- Prevents layout shift
- **Next.js 16 changes default quality to [75] and adds security restrictions**

**Usage:**

```javascript
import Image from 'next/image';

export default function Profile() {
  return (
    <div>
      {/* Local image */}
      <Image
        src="/profile.jpg"
        alt="Profile picture"
        width={500}
        height={500}
        priority // Load immediately (above fold)
      />

      {/* Remote image */}
      <Image
        src="https://example.com/photo.jpg"
        alt="Photo"
        width={800}
        height={600}
        loading="lazy" // Default
      />

      {/* Fill container */}
      <div style={{ position: 'relative', width: '100%', height: '400px' }}>
        <Image
          src="/banner.jpg"
          alt="Banner"
          fill
          style={{ objectFit: 'cover' }}
        />
      </div>
    </div>
  );
}
```

**Configuration:**

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['example.com'],
    qualities: [50, 75, 100], // Customize (default: [75] in Next.js 16)
    dangerouslyAllowLocalIP: false // Security: blocks local IP by default
  }
};
```

---

## 16. Metadata

**Purpose:**
Define page title, description, and meta tags for SEO.

**Can be static or dynamic.**

**Dynamic metadata:**

```javascript
// app/blog/[slug]/page.js
export async function generateMetadata({ params }) {
  const { slug } = await params; // Async params in Next.js 16
  const post = await getPost(slug);

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.image]
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt
    }
  };
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  return <article>{post.content}</article>;
}
```

---

## 17. Proxy (Middleware)

**What it is:**
**proxy.ts** is the new name for middleware in Next.js 16 (middleware.ts still works).

**Purpose:**
Runs before a request is completed - can modify request/response, redirect, rewrite.

**Features:**
- Runs at edge (fast, globally)
- Common for auth, redirects, A/B testing

**Example:**

```javascript
// proxy.ts (Next.js 16) or middleware.ts (legacy name)
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Check authentication
  const token = request.cookies.get('token');

  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Add custom header
  const response = NextResponse.next();
  response.headers.set('x-custom-header', 'value');

  return response;
}

// Configure which paths to run on
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*']
};
```

**More examples:**

```javascript
export function middleware(request) {
  // Rewrite (change destination without changing URL)
  if (request.nextUrl.pathname === '/old-blog') {
    return NextResponse.rewrite(new URL('/blog', request.url));
  }

  // Redirect
  if (request.nextUrl.pathname === '/old-page') {
    return NextResponse.redirect(new URL('/new-page', request.url));
  }
}
```

---

## 18. Environment Variables

**Purpose:**
Store configuration securely.

**Files:**
- `.env.local` - Local development
- `.env.development` - Development
- `.env.production` - Production

**NEXT_PUBLIC_ prefix:**
Exposes variable to browser.

**Example:**

```bash
# .env.local
DATABASE_URL=postgresql://localhost:5432/mydb
NEXT_PUBLIC_API_URL=https://api.example.com
API_SECRET_KEY=secret123
```

**Server-side usage:**

```javascript
// Server Components, Route Handlers
export default async function ServerComponent() {
  const dbUrl = process.env.DATABASE_URL; // ✅ Works
  const apiKey = process.env.API_SECRET_KEY; // ✅ Works

  return <div>Server content</div>;
}
```

**Client-side usage:**

```javascript
// components with 'use client'
'use client';
export default function ClientComponent() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL; // ✅ Works
  // const dbUrl = process.env.DATABASE_URL; // ❌ undefined

  return <div>{apiUrl}</div>;
}
```

**Route Handlers:**

```javascript
export async function GET() {
  const apiKey = process.env.API_SECRET_KEY; // ✅ Secure, server-only
  return Response.json({ success: true });
}
```

**Important:**
- Use `NEXT_PUBLIC_` for client-side values
- Never expose secrets with `NEXT_PUBLIC_`

---

## 19. Cache Components (Next.js 16)

**What it is:**
New explicit caching model in Next.js 16.

**Features:**
- Uses "use cache" directive to cache pages, components, and functions
- Replaces implicit caching from previous versions
- All dynamic code runs at request time by default (opt-in caching)
- Integrates Partial Pre-Rendering (PPR)

**Configuration:**

```javascript
// Enable in next.config.js
module.exports = {
  experimental: {
    cacheComponents: true
  }
};
```

**Cache a function:**

```javascript
'use cache';
async function getProducts() {
  const res = await fetch('https://api.example.com/products');
  return res.json();
}
```

**Cache a component:**

```javascript
'use cache';
export default async function ProductList() {
  const products = await getProducts();
  return (
    <div>
      {products.map(p => (
        <div key={p.id}>{p.name}</div>
      ))}
    </div>
  );
}
```

**Traditional approach (still works):**

```javascript
async function getUser(id) {
  const res = await fetch(`https://api.example.com/users/${id}`, {
    next: { revalidate: 3600 } // Revalidate every hour
  });
  return res.json();
}
```

**Without caching (default in Next.js 16):**

```javascript
async function getLiveData() {
  const res = await fetch('https://api.example.com/live', {
    cache: 'no-store' // Always fresh
  });
  return res.json();
}
```

---

## 20. Caching APIs (Next.js 16)

**New APIs:**

### revalidateTag()

Now requires a cacheLife profile for stale-while-revalidate.

```javascript
import { revalidateTag } from 'next/cache';

export async function revalidateBlogPosts() {
  // Users get cached data immediately, revalidation happens in background
  revalidateTag('blog-posts', 'max'); // Use built-in profile

  // Other profiles: 'hours', 'days'
  // Or custom: revalidateTag('news', { revalidate: 300 })
}
```

### updateTag()

New API for read-your-writes semantics in Server Actions.

```javascript
'use server';
import { updateTag } from 'next/cache';

export async function updateUserProfile(userId, profile) {
  await db.users.update(userId, profile);

  // Expire cache and refresh immediately - user sees changes right away
  updateTag(`user-${userId}`);
}
```

### refresh()

Refreshes the client router from within a Server Action.

```javascript
'use server';
import { refresh } from 'next/cache';

export async function markNotificationAsRead(notificationId) {
  await db.notifications.markAsRead(notificationId);

  // Refresh the notification count displayed in the header
  refresh();
}
```

**When to use which:**
- **revalidateTag()** - Static content that can tolerate eventual consistency
- **updateTag()** - Interactive features where users expect immediate updates
- **refresh()** - Update uncached data like live counts or notifications

---

## 21. Turbopack (Next.js 16)

**What it is:**
**Turbopack is now the default bundler** in Next.js 16.

**Features:**
- Replaces Webpack for faster builds
- 2-5x faster production builds
- Up to 10x faster Fast Refresh
- **Turbopack File System Caching (beta)** - Stores compiler artifacts on disk

**Usage:**

```bash
# Turbopack is enabled by default in Next.js 16
# No configuration needed!

# Build with Turbopack (production)
npm run build

# Dev with Turbopack (default)
npm run dev
```

**Configuration:**

```javascript
// Enable filesystem caching (beta) in next.config.js
module.exports = {
  experimental: {
    turbo: {
      resolveAlias: {
        // Custom alias configuration
      }
    }
  }
};
```

**Benefits:**
- Faster startup times for large projects
- Faster incremental builds
- Better caching between sessions
- Optimized for monorepos

---

## 22. React Compiler (Next.js 16)

**What it is:**
**React Compiler is now stable** in Next.js 16.

**Features:**
- Automatically memoizes components
- Reduces unnecessary re-renders
- Zero manual code changes (no useMemo/useCallback needed)

**Enable:**

```javascript
// next.config.js
module.exports = {
  reactCompiler: true // Stable in Next.js 16
};
```

**Before React Compiler (manual optimization):**

```javascript
'use client';
import { useState, useMemo, useCallback } from 'react';

export default function ProductList({ products }) {
  const [filter, setFilter] = useState('');

  // Manual memoization
  const filteredProducts = useMemo(() => {
    return products.filter(p => p.name.includes(filter));
  }, [products, filter]);

  const handleClick = useCallback((id) => {
    console.log('Clicked:', id);
  }, []);

  return <div>{/* render */}</div>;
}
```

**With React Compiler (automatic optimization):**

```javascript
'use client';
import { useState } from 'react';

export default function ProductList({ products }) {
  const [filter, setFilter] = useState('');

  // React Compiler automatically optimizes this
  const filteredProducts = products.filter(p => p.name.includes(filter));

  const handleClick = (id) => {
    console.log('Clicked:', id);
  };

  return <div>{/* render */}</div>;
}
```

---

## 23. Streaming

**What it is:**
Streaming sends UI to client in chunks - user sees content progressively as it loads.

**Features:**
- Improves perceived performance
- Works with Suspense boundaries

**Example:**

```javascript
import { Suspense } from 'react';

// Slow component
async function UserPosts({ userId }) {
  const posts = await fetch(`/api/users/${userId}/posts`);
  return <PostsList posts={posts} />;
}

// Fast component
async function UserInfo({ userId }) {
  const user = await fetch(`/api/users/${userId}`);
  return <div>{user.name}</div>;
}

// Page with streaming
export default async function UserPage({ params }) {
  const { id } = await params;

  return (
    <div>
      {/* Shows immediately */}
      <Suspense fallback={<div>Loading user...</div>}>
        <UserInfo userId={id} />
      </Suspense>

      {/* Streams in when ready */}
      <Suspense fallback={<div>Loading posts...</div>}>
        <UserPosts userId={id} />
      </Suspense>
    </div>
  );
}
```

**Result:**
1. Page shell loads instantly
2. UserInfo loads and streams
3. UserPosts loads and streams
4. Each part renders as soon as ready

---

## 24. useRouter Hook

**Purpose:**
Access router object in components for programmatic navigation.

**Different between Pages Router and App Router.**

**App Router (Next.js 16):**

```javascript
'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function Component() {
  const router = useRouter();
  const pathname = usePathname(); // /blog/my-post
  const searchParams = useSearchParams(); // URLSearchParams

  const search = searchParams.get('q'); // Get query param

  // Navigate
  router.push('/about');
  router.replace('/login'); // No history entry
  router.back();
  router.refresh(); // Refresh current route (stable in Next.js 16)
  router.prefetch('/blog'); // Prefetch route

  return <div>Content</div>;
}
```

**Pages Router (legacy):**

```javascript
import { useRouter } from 'next/router';

export default function Component() {
  const router = useRouter();

  console.log(router.pathname); // /blog/[slug]
  console.log(router.query); // { slug: 'my-post' }
  console.log(router.asPath); // /blog/my-post

  router.push('/about');

  return <div>Content</div>;
}
```

---

## 25. Redirects

**Multiple ways to redirect:**

**Method 1: Server Component redirect**

```javascript
import { redirect } from 'next/navigation';

export default async function UserPage({ params }) {
  const { id } = await params;
  const user = await getUser(id);

  if (!user) {
    redirect('/404'); // Server-side redirect
  }

  return <div>{user.name}</div>;
}
```

**Method 2: Middleware/Proxy redirect**

```javascript
// proxy.ts or middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token');

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
```

**Method 3: Client-side redirect**

```javascript
'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Protected() {
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  return <div>Protected Content</div>;
}
```

**Method 4: next.config.js redirects**

```javascript
module.exports = {
  async redirects() {
    return [
      {
        source: '/old-blog/:slug',
        destination: '/blog/:slug',
        permanent: true // 301 redirect
      }
    ];
  }
};
```

---

## 26. Script Component

**Purpose:**
Optimize loading third-party scripts.

**Control when and how scripts load.**

**Usage:**

```javascript
import Script from 'next/script';

export default function Page() {
  return (
    <>
      {/* Load after page is interactive */}
      <Script
        src="https://example.com/script.js"
        strategy="afterInteractive" // Default
      />

      {/* Load before page is interactive */}
      <Script
        src="https://example.com/critical.js"
        strategy="beforeInteractive"
      />

      {/* Load when browser is idle */}
      <Script
        src="https://example.com/analytics.js"
        strategy="lazyOnload"
      />

      {/* Inline script */}
      <Script id="inline-script">
        {`console.log('Hello from Next.js');`}
      </Script>

      {/* With callback */}
      <Script
        src="https://example.com/library.js"
        onLoad={() => console.log('Script loaded')}
        onError={(e) => console.error('Script failed', e)}
      />
    </>
  );
}
```

---

## 27. Font Optimization

**Purpose:**
Automatically optimize fonts.

**Features:**
- Self-hosts Google Fonts
- Eliminates external network requests
- Zero layout shift

**Usage:**

```javascript
// app/layout.js
import { Inter, Roboto_Mono } from 'next/font/google';

// Google Font
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap'
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: '400'
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

**Use multiple fonts:**

```javascript
export default function Page() {
  return (
    <div>
      <h1 className={inter.className}>Heading with Inter</h1>
      <code className={robotoMono.className}>Code with Roboto Mono</code>
    </div>
  );
}
```

**Local custom font:**

```javascript
import localFont from 'next/font/local';

const myFont = localFont({
  src: './fonts/my-font.woff2',
  display: 'swap'
});
```

---

## 28. Deployment

**Easiest: Vercel (zero config)**

**Other platforms: Node.js, static hosting**

**Build commands (uses Turbopack by default in Next.js 16):**

```bash
npm run build  # Creates optimized production build
npm run start  # Starts production server
```

**Vercel deployment:**
1. Push to GitHub
2. Import project in Vercel
3. Auto-deploys on push

**Other platforms (Node.js):**
1. `npm run build`
2. `npm run start`
3. Set PORT environment variable

**Requirements for Next.js 16:**
- Node.js 20.9+ (LTS)
- TypeScript 5.1+ (if using TypeScript)

**Docker deployment:**

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 29. React 19.2 Features

**Next.js 16 ships with React 19.2.**

### View Transitions

Animate elements during navigation.

```javascript
'use client';
import { startTransition } from 'react';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const router = useRouter();

  const handleNavigate = () => {
    // Enable View Transitions API
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        startTransition(() => {
          router.push('/about');
        });
      });
    } else {
      router.push('/about');
    }
  };

  return <button onClick={handleNavigate}>About</button>;
}
```

### useEffectEvent

Extract non-reactive logic from Effects.

```javascript
'use client';
import { useState, useEffect, useEffectEvent } from 'react';

export default function Chat({ roomId }) {
  const [messages, setMessages] = useState([]);

  // Extract non-reactive logic
  const onMessage = useEffectEvent((msg) => {
    setMessages(msgs => [...msgs, msg]);
  });

  useEffect(() => {
    const connection = connectToChat(roomId);
    connection.on('message', onMessage);
    return () => connection.disconnect();
  }, [roomId]); // onMessage not in deps

  return <div>{/* render messages */}</div>;
}
```

### Activity Component

Render background activity with display: none.

```javascript
import { Activity } from 'react';

export default function Page() {
  return (
    <div>
      <MainContent />
      {/* Hidden but maintains state */}
      <Activity mode="hidden">
        <BackgroundProcess />
      </Activity>
    </div>
  );
}
```

---

## 30. Best Practices

**1. Use App Router (default in Next.js 16)**

**2. Prefer Server Components when possible**

```javascript
// ✅ Good - Server Component by default
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

**3. Use Client Components only when needed**

```javascript
// ✅ Good - Client Component only for interactivity
'use client';
export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

**4. Use Cache Components for explicit caching**

```javascript
'use cache';
async function getProducts() {
  const res = await fetch('https://api.example.com/products');
  return res.json();
}
```

**5. Use updateTag() for immediate cache updates**

```javascript
'use server';
import { updateTag } from 'next/cache';

export async function updateProfile(userId, data) {
  await db.users.update(userId, data);
  updateTag(`user-${userId}`); // Immediate update
}
```

**6. Enable React Compiler**

```javascript
// next.config.js
module.exports = {
  reactCompiler: true
};
```

**7. Optimize images**

```javascript
<Image
  src="/photo.jpg"
  alt="Description"
  width={800}
  height={600}
  priority // For above-the-fold images
/>
```

**8. Proper error handling**

```javascript
// error.js
'use client';
export default function Error({ error, reset }) {
  return <div>Error: {error.message}</div>;
}
```

**9. SEO metadata**

```javascript
export const metadata = {
  title: 'Page Title',
  description: 'Page description'
};
```

**❌ Avoid:**

```javascript
// Don't use Client Components unnecessarily
'use client';
export default function StaticContent() {
  return <div>Static text</div>; // Should be Server Component
}

// Don't use regular <img> tags
<img src="/photo.jpg" /> // Use next/image instead

// Don't forget to await params
export default function Page({ params }) {
  const { id } = params; // ❌ Wrong in Next.js 16
  const { id } = await params; // ✅ Correct
}
```

---

## 31. Summary

**Key takeaways:**

1. **Next.js 16 uses Turbopack by default** - 2-5x faster builds, 10x faster Fast Refresh
2. **App Router is the standard** - Server Components, better layouts, simpler data fetching
3. **Multiple rendering strategies** - SSR, SSG, ISR, CSR - choose based on needs
4. **Cache Components for explicit caching** - "use cache" directive for control
5. **React Compiler is stable** - Automatic optimization without manual memoization
6. **Server Components by default** - Use Client Components only when needed
7. **Built-in optimizations** - Images, fonts, code splitting all automatic
8. **New caching APIs** - updateTag() for immediate updates, revalidateTag() for eventual consistency

**Rendering strategy guide:**
- **SSR** - Dynamic, user-specific content
- **SSG** - Static marketing sites, blogs
- **ISR** - E-commerce, periodic updates
- **CSR** - Dashboards, no SEO needed

**Next.js 16 improvements:**
- Turbopack default bundler (faster builds)
- React Compiler stable (auto-optimization)
- Cache Components (explicit caching)
- React 19.2 (View Transitions, useEffectEvent, Activity)
- Async params requirement
- proxy.ts (new middleware name)

Next.js 16 provides a powerful, production-ready framework for building modern React applications with excellent performance and developer experience.
