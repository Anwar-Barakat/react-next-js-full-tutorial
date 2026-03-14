# Next.js Framework Guide

Next.js is a full-stack React framework with SSR, SSG, ISR, file-based routing, API routes, and built-in optimization.

---

## 1. Rendering Strategies

| Strategy | Speed | SEO | Data freshness | Use case |
|---|---|---|---|---|
| SSR | Medium | Excellent | Always fresh | Dynamic content |
| SSG | Fastest | Excellent | Build time | Static content |
| ISR | Fast | Excellent | Periodic | Periodic updates |
| CSR | Slow initial | Poor | Always fresh | Dashboards |

**SSR** — `cache: 'no-store'` forces per-request rendering:

```javascript
async function getUser(id) {
  const res = await fetch(`https://api.example.com/users/${id}`, { cache: 'no-store' });
  return res.json();
}

export default async function UserPage({ params }) {
  const { id } = await params;
  const user = await getUser(id);
  return <div><h1>{user.name}</h1><p>{user.email}</p></div>;
}
```

**SSG** — `cache: 'force-cache'` + `generateStaticParams` pre-builds all paths:

```javascript
export async function generateStaticParams() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());
  return posts.map(post => ({ slug: post.slug }));
}

export default async function BlogPost({ params }) {
  const { slug } = await params;
  const post = await fetch(`https://api.example.com/posts/${slug}`, {
    cache: 'force-cache'
  }).then(r => r.json());
  return <article><h1>{post.title}</h1><p>{post.content}</p></article>;
}
```

**ISR** — `next: { revalidate: N }` regenerates pages on a schedule:

```javascript
const res = await fetch(`https://api.example.com/products/${id}`, {
  next: { revalidate: 60 } // Revalidate every 60 seconds
});
```

**CSR** — `'use client'` + `useEffect` for browser-only rendering:

```javascript
'use client';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  useEffect(() => { fetch('/api/dashboard').then(r => r.json()).then(setData); }, []);
  if (!data) return <p>Loading...</p>;
  return <div>{data.content}</div>;
}
```

---

## 2. File-Based Routing

Routes are derived from the `app/` directory structure automatically.

```
app/
  page.js                → /
  about/page.js          → /about
  blog/[slug]/page.js    → /blog/:slug  (dynamic)
  docs/[...slug]/page.js → /docs/a/b/c  (catch-all)
```

```javascript
// Dynamic route — app/blog/[slug]/page.js
export default async function BlogPost({ params }) {
  const { slug } = await params;
  return <h1>Blog: {slug}</h1>;
}
```

---

## 3. Link Component and Navigation

```javascript
import Link from 'next/link';

export default function Nav() {
  return (
    <nav>
      <Link href="/about">About</Link>
      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
    </nav>
  );
}
```

Programmatic navigation with `useRouter` (App Router):

```javascript
'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export default function Component() {
  const router = useRouter();
  router.push('/about');     // Navigate
  router.replace('/login');  // No history entry
  router.refresh();          // Refresh current route
  return <div />;
}
```

---

## 4. Route Handlers (API Routes)

Files at `app/api/**/route.js` become serverless API endpoints.

```javascript
// app/api/users/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  const users = await db.getUsers();
  return NextResponse.json(users);
}

export async function POST(request) {
  const body = await request.json();
  const user = await db.createUser(body);
  return NextResponse.json(user, { status: 201 });
}
```

```javascript
// app/api/users/[id]/route.js
export async function GET(request, { params }) {
  const { id } = await params;
  const user = await db.getUser(id);
  if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(user);
}
```

---

## 5. Server Components and Client Components

- **Server Components** (default): run on server only, no JS sent to browser, can access backend directly
- **Client Components** (`'use client'`): run in browser, support hooks and interactivity

```javascript
// Server Component — fetch data directly
export default async function BlogPage() {
  const posts = await fetch('https://api.example.com/posts').then(r => r.json());
  return (
    <div>
      {posts.map(post => <article key={post.id}><h2>{post.title}</h2></article>)}
    </div>
  );
}
```

```javascript
// Client Component — interactivity only
'use client';
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```

---

## 6. Layouts

`layout.js` wraps child pages and persists across navigation.

```javascript
// app/layout.js — root layout (required)
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header><nav>Navigation</nav></header>
        <main>{children}</main>
        <footer>Footer</footer>
      </body>
    </html>
  );
}
```

```javascript
// app/dashboard/layout.js — nested layout
export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard">
      <aside>Sidebar</aside>
      <div className="content">{children}</div>
    </div>
  );
}
```

---

## 7. Loading and Error States

`loading.js` and `error.js` automatically wrap pages with Suspense/ErrorBoundary.

```javascript
// app/blog/loading.js
export default function Loading() { return <div>Loading...</div>; }

// app/blog/error.js
'use client';
export default function Error({ error, reset }) {
  return (
    <div>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

---

## 8. Image Component

Automatic lazy loading, responsive sizing, WebP/AVIF conversion, no layout shift.

```javascript
import Image from 'next/image';

<Image src="/profile.jpg" alt="Profile" width={500} height={500} priority />

// Fill container
<div style={{ position: 'relative', width: '100%', height: '400px' }}>
  <Image src="/banner.jpg" alt="Banner" fill style={{ objectFit: 'cover' }} />
</div>
```

---

## 9. Metadata

```javascript
// Static metadata
export const metadata = { title: 'My Page', description: 'Description' };

// Dynamic metadata
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, images: [post.image] }
  };
}
```

---

## 10. Middleware

Runs at the edge before a request completes — redirect, rewrite, or modify headers.

```javascript
// middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token');
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ['/dashboard/:path*', '/admin/:path*'] };
```

---

## 11. Environment Variables

- `.env.local` / `.env.development` / `.env.production`
- `NEXT_PUBLIC_` prefix exposes a variable to the browser; all others are server-only

```bash
DATABASE_URL=postgresql://localhost:5432/mydb
NEXT_PUBLIC_API_URL=https://api.example.com
API_SECRET_KEY=secret123
```

```javascript
// Server Component or Route Handler
const dbUrl = process.env.DATABASE_URL;         // ✅
// Client Component
const apiUrl = process.env.NEXT_PUBLIC_API_URL; // ✅
// process.env.DATABASE_URL in Client Component  // ❌ undefined
```

---

## 12. Streaming

Send UI to the client in chunks using `<Suspense>`.

```javascript
import { Suspense } from 'react';

export default async function UserPage({ params }) {
  const { id } = await params;
  return (
    <div>
      <Suspense fallback={<div>Loading user...</div>}>
        <UserInfo userId={id} />
      </Suspense>
      <Suspense fallback={<div>Loading posts...</div>}>
        <UserPosts userId={id} />
      </Suspense>
    </div>
  );
}
```

---

## 13. Script Component and Font Optimization

```javascript
import Script from 'next/script';
<Script src="https://example.com/analytics.js" strategy="lazyOnload" />
// Strategies: "beforeInteractive" | "afterInteractive" (default) | "lazyOnload"
```

```javascript
// app/layout.js
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'], display: 'swap' });

export default function RootLayout({ children }) {
  return <html lang="en" className={inter.className}><body>{children}</body></html>;
}
```

---

## 14. Redirects

**Server Component:**

```javascript
import { redirect } from 'next/navigation';

export default async function Page({ params }) {
  const { id } = await params;
  const user = await getUser(id);
  if (!user) redirect('/404');
  return <div>{user.name}</div>;
}
```

**Config-based:**

```javascript
// next.config.js
module.exports = {
  async redirects() {
    return [{ source: '/old-blog/:slug', destination: '/blog/:slug', permanent: true }];
  }
};
```

---

## 15. Deployment

```bash
npm run build   # Optimized production build
npm run start   # Start production server
```

- **Vercel**: push to GitHub, import project — auto-deploys on every push, zero config
- **Node.js server**: `npm run build && npm run start`, set `PORT` env var

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

## 16. Best Practices

- Default to Server Components; add `'use client'` only for interactivity or hooks
- Always `await params` in dynamic routes: `const { id } = await params`
- Use `<Image>` instead of `<img>` for automatic optimization
- Use `<Link>` instead of `<a>` for client-side navigation
- Use `loading.js` and `error.js` for automatic Suspense/ErrorBoundary wrapping
- Keep secrets out of `NEXT_PUBLIC_` env vars — they are exposed to the browser
- Add `priority` to above-the-fold images to prevent LCP delays
