01. What is Next.js?

🟣 Next.js is a React framework for building full-stack web applications.
🟣 Built on top of React, adds powerful features.
🟣 Supports multiple rendering strategies (SSR, SSG, CSR, ISR).
🟣 Includes built-in routing, API routes, and optimization.
🟣 Zero configuration needed to get started.
🟣 **Next.js 16** brings Turbopack as the default bundler, Cache Components, and React 19.2 support.

-----------------------------------------

02. Why use Next.js?

🟣 Server-Side Rendering: Better SEO and initial load performance.
🟣 File-Based Routing: No need for react-router configuration.
🟣 Route Handlers: Build backend endpoints in the same project.
🟣 Image Optimization: Automatic image optimization with next/image.
🟣 Code Splitting: Automatic per-page code splitting.
🟣 Built-in CSS/Sass: Support for CSS Modules and Sass.
🟣 Fast Refresh: Instant feedback during development (up to 10x faster with Turbopack).
🟣 Production Ready: Optimized builds out of the box (2-5x faster with Turbopack).
🟣 React Compiler: Automatic memoization without manual optimization.

-----------------------------------------

03. What is Server-Side Rendering (SSR)?

🟣 SSR renders pages on the server for each request.
🟣 HTML is generated on the server and sent to the client.
🟣 Good for SEO and dynamic content.
🟣 Slower than SSG but always fresh data.
🟣 Next.js can pre-render pages before sending them to the browser.
🟣 Both (SSR, SSG) produce HTML, but when and how often they do it is what makes them different.
🟣 SSG -> You make the food before customers arrive — maybe in the morning.
🟣 SSR -> You prepare the meal only when the customer orders it.

************* 🟣🟣🟣 *************
// App Router (Next.js 16) - Server Component with SSR
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

// How it works:
// 1. User requests /user/123
// 2. Server fetches data from API
// 3. Server renders HTML with data
// 4. HTML sent to browser
// 5. React hydrates the page
************* 🟣🟣🟣 *************

🟣 Use SSR when:
   ▫️ Data changes frequently
   ▫️ Content is user-specific
   ▫️ SEO is important with dynamic data
   ▫️ Use fetch() with { cache: "no-store" }

-----------------------------------------

04. What is Static Site Generation (SSG)?

🟣 SSG generates HTML at build time.
🟣 Pages are pre-rendered once and reused for all requests.
🟣 Fastest performance (served from CDN).
🟣 Best for content that doesn't change often.

************* 🟣🟣🟣 *************
// App Router (Next.js 16) - Static Generation
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

// How it works:
// 1. At build time, generateStaticParams returns all possible paths
// 2. getPost runs for each path
// 3. HTML files are generated
// 4. On request, pre-built HTML is served instantly
************* 🟣🟣🟣 *************

🟣 Use SSG when:
   ▫️ Data is static or changes rarely
   ▫️ Same content for all users
   ▫️ Maximum performance needed
   ▫️ Use fetch() with { cache: "force-cache" }

-----------------------------------------

05. What is Incremental Static Regeneration (ISR)?

🟣 ISR combines benefits of SSG and SSR.
🟣 Pages are statically generated but can be updated after build.
🟣 Regenerates pages in the background on a schedule.
🟣 Balances performance with fresh data.

************* 🟣🟣🟣 *************
// App Router (Next.js 16) - ISR with revalidation
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

// Alternative: Use Cache Components (Next.js 16+)
'use cache';
async function getProducts() {
  const res = await fetch('https://api.example.com/products');
  return res.json();
}

export default async function ProductsPage() {
  const products = await getProducts(); // Cached with "use cache"
  return <div>{/* Render products */}</div>;
}

// How ISR works:
// 1. First request: Serve stale page (cached)
// 2. Background: Regenerate page if revalidate time passed
// 3. Next request: Serve newly generated page
// 4. Cycle repeats
************* 🟣🟣🟣 *************

🟣 Use ISR when:
   ▫️ Data changes periodically (not constantly)
   ▫️ You want SSG performance with fresher data
   ▫️ You have many pages but can't rebuild all frequently

-----------------------------------------

06. What is Client-Side Rendering (CSR)?

🟣 CSR renders content in the browser using JavaScript.
🟣 Initial HTML is minimal, JavaScript loads and renders content.
🟣 Same as traditional React apps.
🟣 Poor for SEO but good for dynamic user-specific content.

************* 🟣🟣🟣 *************
// Client Component in Next.js 16
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

// How it works:
// 1. Server sends minimal HTML
// 2. Browser downloads JavaScript
// 3. React hydrates and renders
// 4. Client fetches data
// 5. UI updates
************* 🟣🟣🟣 *************

🟣 Use CSR when:
   ▫️ SEO is not important (dashboards, admin panels)
   ▫️ Content is highly interactive
   ▫️ Data is user-specific and protected

-----------------------------------------

07. What is the difference between SSR, SSG, ISR, and CSR?

🟣 SSR: Rendered on server per request (dynamic, slower).
🟣 SSG: Pre-rendered at build time (static, fastest).
🟣 ISR: Pre-rendered + periodic updates (hybrid).
🟣 CSR: Rendered in browser (no SEO, interactive).

************* 🟣🟣🟣 *************
Feature          | SSR      | SSG      | ISR      | CSR
-----------------|----------|----------|----------|----------
Speed            | Medium   | Fastest  | Fast     | Slow
SEO              | ✅       | ✅       | ✅       | ❌
Fresh Data       | ✅       | ❌       | ⚡       | ✅
Server Cost      | High     | Low      | Low      | Low
Build Time       | None     | Long     | Short    | Short
Use Case         | Dynamic  | Static   | Periodic | Dashboard
************* 🟣🟣🟣 *************

-----------------------------------------

08. What is file-based routing in Next.js?

🟣 Next.js automatically creates routes based on file structure.
🟣 No need to configure react-router.
🟣 Files in app/ directory become routes (App Router is default in Next.js 16).
🟣 Supports dynamic routes with [brackets].

************* 🟣🟣🟣 *************
// App Router structure (Next.js 16 default)
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
  
// Example dynamic route: app/blog/[slug]/page.js
export default async function BlogPost({ params }) {
  const { slug } = await params; // Async params in Next.js 16
  // URL: /blog/my-post
  // params.slug = "my-post"
  return <h1>Blog: {slug}</h1>;
}

// Catch-all route: app/docs/[...slug]/page.js
// Matches: /docs/a, /docs/a/b, /docs/a/b/c
export default async function Docs({ params }) {
  const { slug } = await params;
  // URL: /docs/next/routing/basics
  // params.slug = ["next", "routing", "basics"]
  return <div>{slug.join('/')}</div>;
}
************* 🟣🟣🟣 *************

-----------------------------------------

09. What is the Link component in Next.js?

🟣 Link component enables client-side navigation.
🟣 Prefetches pages for faster navigation (smarter in Next.js 16).
🟣 No full page reload.
🟣 Better performance than <a> tags.

************* 🟣🟣🟣 *************
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
      
      {/* Programmatic navigation (App Router) */}
      'use client';
      import { useRouter } from 'next/navigation';
      const router = useRouter();
      router.push('/dashboard');
      router.refresh(); // New in Next.js 16
    </nav>
  );
}

// Next.js 16 improvements:
// - Layout deduplication: Shared layouts download once
// - Incremental prefetching: Only fetch what's not cached
// - Auto-cancels prefetch when links leave viewport
************* 🟣🟣🟣 *************

-----------------------------------------

10. What are Route Handlers in Next.js?

🟣 Route Handlers are API endpoints in the App Router.
🟣 Files under app/api/ with route.js/ts become API endpoints.
🟣 These run on the server on demand as serverless functions or edge functions.
🟣 You can call them from the frontend using fetch() just like any API.

************* 🟣🟣🟣 *************
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

// app/api/users/[id]/route.js - Dynamic route
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
************* 🟣🟣🟣 *************

-----------------------------------------

11. What is the difference between Pages Router and App Router?

🟣 Pages Router: Original Next.js routing (pages/ directory).
🟣 App Router: New routing system in Next.js 13+ (app/ directory).
🟣 **App Router is the default in Next.js 16**.
🟣 App Router supports React Server Components.
🟣 Both can coexist in same project.

************* 🟣🟣🟣 *************
// Pages Router (legacy)
// pages/blog/[slug].js
export async function getServerSideProps({ params }) {
  const post = await fetchPost(params.slug);
  return { props: { post } };
}

export default function BlogPost({ post }) {
  return <h1>{post.title}</h1>;
}

// App Router (Next.js 16 default)
// app/blog/[slug]/page.js
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
************* 🟣🟣🟣 *************

🟣 App Router advantages:
   ▫️ React Server Components
   ▫️ Streaming and Suspense
   ▫️ Better layouts
   ▫️ Simpler data fetching
   ▫️ Explicit caching with Cache Components

-----------------------------------------

12. What are Server Components and Client Components?

🟣 Server Components: Run only on server, don't ship to browser.
🟣 Client Components: Run on browser, interactive.
🟣 App Router uses Server Components by default.
🟣 Use 'use client' directive for Client Components.
🟣 **React Compiler (stable in Next.js 16) automatically optimizes components**.

************* 🟣🟣🟣 *************
// Server Component (default in App Router)
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

// Client Component
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
************* 🟣🟣🟣 *************

🟣 Server Components can:
   ▫️ Access backend resources directly
   ▫️ Keep sensitive data on server
   ▫️ Reduce bundle size
   ▫️ Fetch data directly

🟣 Client Components can:
   ▫️ Use hooks (useState, useEffect)
   ▫️ Handle browser events
   ▫️ Use browser APIs
   ▫️ Have interactivity

-----------------------------------------

13. What are layouts in App Router?

🟣 Layouts are UI that wrap pages and persist across navigation.
🟣 Don't re-render on route changes.
🟣 Can be nested.
🟣 Defined in layout.js files.
🟣 **Next.js 16 optimizes layouts with deduplication**.

************* 🟣🟣🟣 *************
// app/layout.js - Root layout (required)
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

// app/dashboard/layout.js - Nested layout
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

// Next.js 16 optimization:
// Shared layouts download only once when prefetching multiple URLs
************* 🟣🟣🟣 *************

-----------------------------------------

14. What are loading and error states in App Router?

🟣 loading.js: Shows loading UI while page loads.
🟣 error.js: Shows error UI when something fails.
🟣 Automatically wrap pages with Suspense/ErrorBoundary.

************* 🟣🟣🟣 *************
// app/blog/loading.js - Loading UI
export default function Loading() {
  return <div>Loading blog posts...</div>;
}

// app/blog/error.js - Error UI
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
************* 🟣🟣🟣 *************

-----------------------------------------

15. What is the Image component in Next.js?

🟣 next/image optimizes images automatically.
🟣 Lazy loads images.
🟣 Serves responsive images.
🟣 Converts to modern formats (WebP, AVIF).
🟣 Prevents layout shift.
🟣 **Next.js 16 changes default quality to [75] and adds security restrictions**.

************* 🟣🟣🟣 *************
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

// next.config.js - Configure remote images
module.exports = {
  images: {
    domains: ['example.com'],
    qualities: [50, 75, 100], // Customize (default: [75] in Next.js 16)
    dangerouslyAllowLocalIP: false // Security: blocks local IP by default
  }
};
************* 🟣🟣🟣 *************

-----------------------------------------

16. What is metadata in Next.js?

🟣 Metadata defines page title, description, and meta tags.
🟣 Important for SEO.
🟣 Can be static or dynamic.

************* 🟣🟣🟣 *************
// App Router - app/blog/[slug]/page.js
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
************* 🟣🟣🟣 *************

-----------------------------------------

17. What is proxy.ts in Next.js 16?

🟣 **proxy.ts** is the new name for middleware in Next.js 16 (middleware.ts still works).
🟣 Runs before a request is completed.
🟣 Can modify request/response, redirect, rewrite.
🟣 Runs at edge (fast, globally).
🟣 Common for auth, redirects, A/B testing.

************* 🟣🟣🟣 *************
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

// More examples:
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
************* 🟣🟣🟣 *************

-----------------------------------------

18. What are environment variables in Next.js?

🟣 Environment variables store configuration.
🟣 Defined in .env.local, .env.development, .env.production.
🟣 NEXT_PUBLIC_ prefix exposes to browser.
🟣 Without prefix, only available on server.

************* 🟣🟣🟣 *************
// .env.local
DATABASE_URL=postgresql://localhost:5432/mydb
NEXT_PUBLIC_API_URL=https://api.example.com
API_SECRET_KEY=secret123

// Server-side (Server Components, Route Handlers)
export default async function ServerComponent() {
  const dbUrl = process.env.DATABASE_URL; // ✅ Works
  const apiKey = process.env.API_SECRET_KEY; // ✅ Works
  
  return <div>Server content</div>;
}

// Client-side (components with 'use client')
'use client';
export default function ClientComponent() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL; // ✅ Works
  // const dbUrl = process.env.DATABASE_URL; // ❌ undefined
  
  return <div>{apiUrl}</div>;
}

// Route Handlers
export async function GET() {
  const apiKey = process.env.API_SECRET_KEY; // ✅ Secure, server-only
  return Response.json({ success: true });
}
************* 🟣🟣🟣 *************

🟣 Use NEXT_PUBLIC_ for client-side values.
🟣 Never expose secrets with NEXT_PUBLIC_.

-----------------------------------------

19. What is Cache Components in Next.js 16?

🟣 **Cache Components** is a new explicit caching model in Next.js 16.
🟣 Uses the "use cache" directive to cache pages, components, and functions.
🟣 Replaces implicit caching from previous versions.
🟣 All dynamic code runs at request time by default (opt-in caching).
🟣 Integrates Partial Pre-Rendering (PPR).

************* 🟣🟣🟣 *************
// Enable Cache Components in next.config.js
module.exports = {
  experimental: {
    cacheComponents: true
  }
};

// Cache a function
'use cache';
async function getProducts() {
  const res = await fetch('https://api.example.com/products');
  return res.json();
}

// Cache a component
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

// Traditional approach (still works)
async function getUser(id) {
  const res = await fetch(`https://api.example.com/users/${id}`, {
    next: { revalidate: 3600 } // Revalidate every hour
  });
  return res.json();
}

// Without caching (default in Next.js 16)
async function getLiveData() {
  const res = await fetch('https://api.example.com/live', {
    cache: 'no-store' // Always fresh
  });
  return res.json();
}
************* 🟣🟣🟣 *************

-----------------------------------------

20. What are the new Caching APIs in Next.js 16?

🟣 **revalidateTag()**: Now requires a cacheLife profile for stale-while-revalidate.
🟣 **updateTag()**: New API for read-your-writes semantics in Server Actions.
🟣 **refresh()**: Refreshes the client router from within a Server Action.
🟣 cacheLife and cacheTag are now stable (no unstable_ prefix).

************* 🟣🟣🟣 *************
// revalidateTag() - Stale-while-revalidate
import { revalidateTag } from 'next/cache';

export async function revalidateBlogPosts() {
  // Users get cached data immediately, revalidation happens in background
  revalidateTag('blog-posts', 'max'); // Use built-in profile
  
  // Other profiles: 'hours', 'days'
  // Or custom: revalidateTag('news', { revalidate: 300 })
}

// updateTag() - Immediate updates (Server Actions only)
'use server';
import { updateTag } from 'next/cache';

export async function updateUserProfile(userId, profile) {
  await db.users.update(userId, profile);
  
  // Expire cache and refresh immediately - user sees changes right away
  updateTag(`user-${userId}`);
}

// refresh() - Refresh client router
'use server';
import { refresh } from 'next/cache';

export async function markNotificationAsRead(notificationId) {
  await db.notifications.markAsRead(notificationId);
  
  // Refresh the notification count displayed in the header
  refresh();
}

// When to use which:
// - revalidateTag(): Static content that can tolerate eventual consistency
// - updateTag(): Interactive features where users expect immediate updates
// - refresh(): Update uncached data like live counts or notifications
************* 🟣🟣🟣 *************

-----------------------------------------

21. What is Turbopack in Next.js 16?

🟣 **Turbopack is now the default bundler** in Next.js 16.
🟣 Replaces Webpack for faster builds.
🟣 2-5x faster production builds.
🟣 Up to 10x faster Fast Refresh.
🟣 **Turbopack File System Caching (beta)**: Stores compiler artifacts on disk.

************* 🟣🟣🟣 *************
// Turbopack is enabled by default in Next.js 16
// No configuration needed!

// Build with Turbopack (production)
npm run build

// Dev with Turbopack (default)
npm run dev

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

// Turbopack benefits:
// - Faster startup times for large projects
// - Faster incremental builds
// - Better caching between sessions
// - Optimized for monorepos
************* 🟣🟣🟣 *************

-----------------------------------------

22. What is the React Compiler in Next.js 16?

🟣 **React Compiler is now stable** in Next.js 16.
🟣 Automatically memoizes components.
🟣 Reduces unnecessary re-renders.
🟣 Zero manual code changes (no useMemo/useCallback needed).

************* 🟣🟣🟣 *************
// Enable React Compiler in next.config.js
module.exports = {
  reactCompiler: true // Stable in Next.js 16
};

// Before React Compiler (manual optimization)
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

// With React Compiler (automatic optimization)
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
************* 🟣🟣🟣 *************

-----------------------------------------

23. What is Streaming in App Router?

🟣 Streaming sends UI to client in chunks.
🟣 User sees content progressively as it loads.
🟣 Improves perceived performance.
🟣 Works with Suspense boundaries.

************* 🟣🟣🟣 *************x§    
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

// Result:
// 1. Page shell loads instantly
// 2. UserInfo loads and streams
// 3. UserPosts loads and streams
// Each part renders as soon as ready
************* 🟣🟣🟣 *************

-----------------------------------------

24. What is the useRouter hook?

🟣 useRouter accesses router object in components.
🟣 Enables programmatic navigation.
🟣 Access route info (pathname, query, etc.).
🟣 Different between Pages Router and App Router.

************* 🟣🟣🟣 *************
// App Router - next/navigation (Next.js 16)
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

// Pages Router - next/router (legacy)
import { useRouter } from 'next/router';

export default function Component() {
  const router = useRouter();
  
  console.log(router.pathname); // /blog/[slug]
  console.log(router.query); // { slug: 'my-post' }
  console.log(router.asPath); // /blog/my-post
  
  router.push('/about');
  
  return <div>Content</div>;
}
************* 🟣🟣🟣 *************

-----------------------------------------

25. How do you handle redirects in Next.js?

🟣 Multiple ways to redirect in Next.js.
🟣 Server-side redirects (in components, middleware).
🟣 Client-side redirects (useRouter).
🟣 Permanent vs temporary redirects.

************* 🟣🟣🟣 *************
// Method 1: Server Component redirect
import { redirect } from 'next/navigation';

export default async function UserPage({ params }) {
  const { id } = await params;
  const user = await getUser(id);
  
  if (!user) {
    redirect('/404'); // Server-side redirect
  }
  
  return <div>{user.name}</div>;
}

// Method 2: Middleware/Proxy redirect
// proxy.ts or middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token');
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Method 3: Client-side redirect
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

// Method 4: next.config.js redirects
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
************* 🟣🟣🟣 *************

-----------------------------------------

26. What is the Script component?

🟣 Script component optimizes loading third-party scripts.
🟣 Control when and how scripts load.
🟣 Better performance than regular <script> tags.

************* 🟣🟣🟣 *************
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
************* 🟣🟣🟣 *************

-----------------------------------------

27. What is Font optimization in Next.js?

🟣 next/font automatically optimizes fonts.
🟣 Self-hosts Google Fonts.
🟣 Eliminates external network requests.
🟣 Zero layout shift.

************* 🟣🟣🟣 *************
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

// Use multiple fonts
export default function Page() {
  return (
    <div>
      <h1 className={inter.className}>Heading with Inter</h1>
      <code className={robotoMono.className}>Code with Roboto Mono</code>
    </div>
  );
}

// Local custom font
import localFont from 'next/font/local';

const myFont = localFont({
  src: './fonts/my-font.woff2',
  display: 'swap'
});
************* 🟣🟣🟣 *************

-----------------------------------------

28. How do you deploy Next.js apps?

🟣 Deploy to Vercel (easiest, zero config).
🟣 Deploy to other platforms (Node.js, static hosting).
🟣 Build and start commands.
🟣 **Turbopack makes builds 2-5x faster**.

************* 🟣🟣🟣 *************
// Build commands (uses Turbopack by default in Next.js 16)
npm run build  // Creates optimized production build
npm run start  // Starts production server

// Vercel deployment:
// 1. Push to GitHub
// 2. Import project in Vercel
// 3. Auto-deploys on push

// Other platforms (Node.js)
// 1. npm run build
// 2. npm run start
// 3. Set PORT environment variable

// Requirements for Next.js 16:
// - Node.js 20.9+ (LTS)
// - TypeScript 5.1+ (if using TypeScript)

// Docker deployment
// Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]

// Build Adapters API (alpha) - Custom deployment
module.exports = {
  experimental: {
    adapterPath: require.resolve('./my-adapter.js')
  }
};
************* 🟣🟣🟣 *************

-----------------------------------------

29. What are React 19.2 features in Next.js 16?

🟣 **Next.js 16 ships with React 19.2**.
🟣 View Transitions: Animate elements during navigation.
🟣 useEffectEvent: Extract non-reactive logic from Effects.
🟣 Activity: Render background activity with display: none.

************* 🟣🟣🟣 *************
// View Transitions (React 19.2)
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

// useEffectEvent (React 19.2)
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

// Activity component (React 19.2)
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
************* 🟣🟣🟣 *************

-----------------------------------------

30. What are Next.js 16 best practices?

🟣 Use App Router (default in Next.js 16).
🟣 Prefer Server Components when possible.
🟣 Use Client Components only when needed (interactivity).
🟣 Optimize images with next/image.
🟣 Use next/font for font optimization.
🟣 **Use Cache Components with "use cache" for explicit caching**.
🟣 **Use updateTag() for immediate cache updates in Server Actions**.
🟣 **Enable React Compiler for automatic optimization**.
🟣 Use middleware/proxy.ts for auth and redirects.
🟣 Implement proper error and loading states.

************* 🟣🟣🟣 *************
// ✅ Good practices in Next.js 16

// 1. Server Component by default
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}

// 2. Client Component only when needed
'use client';
export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}

// 3. Use Cache Components for explicit caching
'use cache';
async function getProducts() {
  const res = await fetch('https://api.example.com/products');
  return res.json();
}

// 4. Use updateTag() for immediate updates
'use server';
import { updateTag } from 'next/cache';

export async function updateProfile(userId, data) {
  await db.users.update(userId, data);
  updateTag(`user-${userId}`); // Immediate update
}

// 5. Enable React Compiler
// next.config.js
module.exports = {
  reactCompiler: true
};

// 6. Optimize images
<Image
  src="/photo.jpg"
  alt="Description"
  width={800}
  height={600}
  priority // For above-the-fold images
/>

// 7. Proper error handling
// error.js
'use client';
export default function Error({ error, reset }) {
  return <div>Error: {error.message}</div>;
}

// 8. SEO metadata
export const metadata = {
  title: 'Page Title',
  description: 'Page description'
};

// ❌ Avoid

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
************* 🟣🟣🟣 *************

-----------------------------------------