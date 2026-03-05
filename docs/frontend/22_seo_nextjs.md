# SEO Optimizations in Next.js

A comprehensive guide to Search Engine Optimization techniques in Next.js App Router.

---

## Table of Contents

1. [Metadata API](#1-metadata-api)
2. [Open Graph & Twitter Cards](#2-open-graph--twitter-cards)
3. [Sitemap Generation](#3-sitemap-generation)
4. [Robots Configuration](#4-robots-configuration)
5. [Canonical URLs](#5-canonical-urls)
6. [Structured Data (JSON-LD)](#6-structured-data-json-ld)
7. [Dynamic Metadata](#7-dynamic-metadata)
8. [Performance & SEO](#8-performance--seo)
9. [Image SEO](#9-image-seo)
10. [Security Headers & SEO](#10-security-headers--seo)
11. [Accessibility & SEO](#11-accessibility--seo)
12. [i18n & SEO](#12-i18n--seo)
13. [Web Vitals as Ranking Factors](#13-web-vitals-as-ranking-factors)
14. [Common Mistakes](#14-common-mistakes)

---

## 1. Metadata API

Next.js App Router provides a built-in `Metadata` API for defining page-level SEO tags.

### Static Metadata (layout.tsx or page.tsx)

```tsx
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Your Name - Full Stack Developer",
  description: "Portfolio showcasing web applications built with React, Next.js, and more.",
  keywords: ["Full Stack Developer", "React", "Next.js", "Portfolio"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
}
```

### Template-Based Titles

Use `title.template` in the root layout so child pages inherit a consistent format:

```tsx
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: "Your Name - Developer",
    template: "%s | Your Name",
  },
}

// app/about/page.tsx
export const metadata: Metadata = {
  title: "About", // Renders: "About | Your Name"
}
```

### Title Best Practices

- Keep titles under **60 characters** (Google truncates longer titles).
- Put the most important keyword first.
- Make each page title unique.
- Use `template` to maintain brand consistency without repeating yourself.

### Description Best Practices

- Keep descriptions between **120-160 characters**.
- Include a clear call to action or value proposition.
- Make each page description unique.
- Include relevant keywords naturally (not keyword-stuffed).

---

## 2. Open Graph & Twitter Cards

Open Graph tags control how your pages appear when shared on social media.

```tsx
export const metadata: Metadata = {
  openGraph: {
    title: "Your Name - Full Stack Developer",
    description: "Portfolio showcasing scalable web applications.",
    url: "https://yourdomain.com",
    siteName: "Your Name Portfolio",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://yourdomain.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Your Name Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Name - Full Stack Developer",
    description: "Portfolio showcasing scalable web applications.",
    creator: "@yourhandle",
    images: ["https://yourdomain.com/og-image.png"],
  },
}
```

### OG Image Best Practices

- Use **1200x630px** for optimal display across platforms.
- Keep text large and readable (it will be shown as a thumbnail).
- Next.js can generate OG images dynamically using `ImageResponse` from `next/og`.

### Dynamic OG Images

```tsx
// app/api/og/route.tsx
import { ImageResponse } from "next/og"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get("title") ?? "Default Title"

  return new ImageResponse(
    (
      <div style={{
        fontSize: 48, background: "white", width: "100%", height: "100%",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {title}
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
```

---

## 3. Sitemap Generation

Next.js supports automatic sitemap generation via `app/sitemap.ts`.

```tsx
// app/sitemap.ts
import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://yourdomain.com"

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ]

  // Dynamic pages (e.g., projects)
  const projects = getProjects()
  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  return [...staticPages, ...projectPages]
}
```

### Important Rules

- **Do NOT include anchor links** (e.g., `/#about`, `/#contact`) -- search engines cannot crawl them as separate pages.
- Only include URLs that resolve to distinct pages.
- Set appropriate `priority` values: 1.0 for homepage, 0.8 for main pages, 0.5 for secondary.
- Submit your sitemap to Google Search Console and Bing Webmaster Tools.

---

## 4. Robots Configuration

Control crawler behavior with `app/robots.ts`:

```tsx
// app/robots.ts
import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/"],
    },
    sitemap: "https://yourdomain.com/sitemap.xml",
  }
}
```

### Per-Page Robot Directives

```tsx
export const metadata: Metadata = {
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}
```

- **`max-image-preview: "large"`** — Allows Google to show large image previews
- **`max-snippet: -1`** — No limit on text snippet length
- **`max-video-preview: -1`** — No limit on video preview length
- **`noindex`** — Don't show this page in search results
- **`nofollow`** — Don't follow links on this page

---

## 5. Canonical URLs

Canonical URLs prevent duplicate content issues when the same page is accessible via multiple URLs.

```tsx
export const metadata: Metadata = {
  alternates: {
    canonical: "https://yourdomain.com",
  },
}
```

For dynamic pages:

```tsx
// app/projects/[id]/page.tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return {
    alternates: {
      canonical: `https://yourdomain.com/projects/${id}`,
    },
  }
}
```

### When You Need Canonical URLs

- Same content accessible with and without trailing slash (`/about` vs `/about/`).
- Same content with different query parameters (`/products` vs `/products?sort=price`).
- Same content on `www` and non-`www` versions.
- Same content on HTTP and HTTPS.
- Pagination pages that show overlapping content.

---

## 6. Structured Data (JSON-LD)

Structured data helps search engines understand your content and enables rich results (star ratings, breadcrumbs, FAQs in search results).

### Person Schema (Portfolio)

```tsx
export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Your Name",
    url: "https://yourdomain.com",
    jobTitle: "Full Stack Developer",
    sameAs: [
      "https://github.com/yourusername",
      "https://linkedin.com/in/yourusername",
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* page content */}
    </>
  )
}
```

### WebSite Schema

```tsx
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Your Name Portfolio",
  url: "https://yourdomain.com",
  description: "Full Stack Developer Portfolio",
  author: {
    "@type": "Person",
    name: "Your Name",
  },
}
```

### Breadcrumb Schema

```tsx
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://yourdomain.com" },
    { "@type": "ListItem", position: 2, name: "Projects", item: "https://yourdomain.com/projects" },
    { "@type": "ListItem", position: 3, name: "Tripz" },
  ],
}
```

### Article Schema (Blog Posts)

```tsx
const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: post.title,
  description: post.excerpt,
  author: { "@type": "Person", name: "Your Name" },
  datePublished: post.createdAt,
  dateModified: post.updatedAt,
  image: post.coverImage,
}
```

### FAQ Schema (Enables FAQ Rich Results)

```tsx
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What technologies do you use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Laravel, React, TypeScript, Next.js, and PostgreSQL.",
      },
    },
  ],
}
```

### Testing Structured Data

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema.org Validator](https://validator.schema.org/)

---

## 7. Dynamic Metadata

For dynamic routes, use `generateMetadata`:

```tsx
// app/projects/[id]/page.tsx
import type { Metadata } from "next"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const project = await getProject(id)

  if (!project) {
    return { title: "Project Not Found" }
  }

  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.image ? [{ url: project.image }] : [],
    },
    alternates: {
      canonical: `https://yourdomain.com/projects/${id}`,
    },
  }
}
```

### Static Params for Pre-rendering

```tsx
export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((project) => ({ id: project.id }))
}
```

This pre-renders all known project pages at build time for faster loading and better crawlability.

---

## 8. Performance & SEO

Page speed is a direct Google ranking factor. For detailed performance optimization techniques, see [09_web_performance.md](./09_web_performance.md).

### SEO-Specific Performance Tips

**Script loading** -- use `next/script` to avoid blocking rendering:

```tsx
import Script from "next/script"

<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
  strategy="afterInteractive"
/>
```

- **`beforeInteractive`** — Loads before hydration, use for critical scripts (polyfills)
- **`afterInteractive`** — Loads after hydration, use for analytics, chat widgets
- **`lazyOnload`** — Loads during idle time, use for low-priority scripts
- **`worker`** — Loads in a web worker, use for heavy computation

**Cache headers** for static assets:

```tsx
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: "/_next/static/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ]
  },
}
```

**Reduce JavaScript bundle:**

- Use dynamic imports for heavy components: `const Heavy = dynamic(() => import("./Heavy"))`
- Avoid importing entire libraries -- use tree-shakeable imports.
- Client-side-only content is invisible to crawlers -- use Server Components for SEO-critical content.

**CSS animation performance:**

```css
.animate-blob {
  animation: blob 7s infinite;
  will-change: transform;
  contain: layout style;
}
```

---

## 9. Image SEO

For technical image optimization with `next/image`, see [06_next.md](./06_next.md) section 15. This section focuses on the SEO-specific aspects.

### Alt Text Guidelines

- **Informative image** (e.g., project screenshot) — `"Tripz dashboard showing booking workflow"`
- **Decorative image** (e.g., background gradient) — `""` (empty alt)
- **Functional image** (e.g., search icon button) — `"Search"`
- **Complex image** (e.g., chart/diagram) — Detailed description or link to long description

**Rules:**
- Be descriptive and specific -- not `"image"` or `"photo"`.
- Include keywords naturally, but don't keyword-stuff.
- Keep under 125 characters.
- Use empty `alt=""` only for purely decorative images.

### Image File Names

```
project-screenshot.png           // Bad - not descriptive
tripz-booking-dashboard-2024.png // Good - descriptive with keywords
```

### LCP Image Optimization

The Largest Contentful Paint (LCP) image should load as fast as possible:

```tsx
<Image
  src="/hero-image.png"
  alt="Descriptive text"
  width={800}
  height={450}
  priority        // Preloads the image (use for above-the-fold LCP image)
  placeholder="blur"
  blurDataURL="data:image/..."
/>
```

- Only use `priority` on the single largest above-the-fold image.
- All other images should use default lazy loading.

---

## 10. Security Headers & SEO

For general web security concepts (XSS, CSRF, CSP), see [07_html.md](./07_html.md) sections 13-18. This section covers the SEO impact.

### Why Security Affects SEO

- **HTTPS is a ranking signal** -- HSTS enforces it.
- Sites flagged as unsafe get warning interstitials that tank click-through rates.
- CSP prevents XSS attacks that could inject spam/malware.
- Google deranks sites with security issues.

### SEO-Relevant Security Headers

```tsx
// next.config.ts
async headers() {
  return [
    {
      source: "/(.*)",
      headers: [
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
      ],
    },
  ]
}
```

- **`Strict-Transport-Security`** — Forces HTTPS -- ranking signal
- **`X-Content-Type-Options`** — Prevents MIME sniffing attacks
- **`X-Frame-Options`** — Prevents clickjacking (your content in others' iframes)
- **`Referrer-Policy`** — Controls what URL info is sent to other sites
- **`Permissions-Policy`** — Disables unnecessary browser APIs

---

## 11. Accessibility & SEO

For detailed accessibility patterns, see [18_accessibility.md](./18_accessibility.md). This section covers where accessibility directly impacts SEO.

### Why Accessibility = Better SEO

- Search engines rely on semantic HTML to understand page structure -- the same structure screen readers use.
- Google uses heading hierarchy to determine content relevance.
- Alt text is used by both screen readers and image search.
- Good keyboard navigation correlates with logical content flow.

### SEO-Critical Accessibility Patterns

**Heading hierarchy** -- every page must have exactly one `<h1>`, then sequential `<h2>`, `<h3>`:

```tsx
<h1>Tripz - Educational Travel Platform</h1>     // Only one per page
  <h2>Features</h2>
    <h3>Booking System</h3>
    <h3>Payment Integration</h3>
  <h2>Tech Stack</h2>
```

**Skip navigation** -- helps both screen readers and crawlers:

```tsx
<a href="#main" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

**Semantic landmarks** -- search engines use these to identify page sections:

```tsx
<header>  // Site header
<nav>     // Navigation
<main>    // Primary content (most important for SEO)
<article> // Self-contained content (blog posts, projects)
<aside>   // Related content (sidebar)
<footer>  // Site footer
```

---

## 12. i18n & SEO

For i18n implementation with react-i18next, see [10_translation_i18next.md](./10_translation_i18next.md). This section covers SEO-specific i18n requirements.

### HTML Lang Attribute

```tsx
<html lang="en" dir="ltr">
```

Always set the correct `lang` attribute -- Google uses it to serve the right language version.

### Hreflang Tags

Tell search engines which language versions exist:

```tsx
export const metadata: Metadata = {
  alternates: {
    canonical: "https://yourdomain.com",
    languages: {
      "en": "https://yourdomain.com/en",
      "ar": "https://yourdomain.com/ar",
    },
  },
}
```

### URL Structure for Multi-Language

- **Subdirectory** (e.g., `yourdomain.com/en/`, `yourdomain.com/ar/`) — Best -- shared domain authority
- **Subdomain** (e.g., `en.yourdomain.com`, `ar.yourdomain.com`) — OK -- treated as separate sites
- **Separate domain** (e.g., `yourdomain.com`, `yourdomain.ae`) — OK -- for country-specific targeting
- **Query parameter** (e.g., `yourdomain.com?lang=ar`) — Bad -- Google doesn't recommend

**Subdirectory is recommended** -- it keeps all SEO authority on one domain.

### RTL Considerations

```css
[dir="rtl"] body {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
```

---

## 13. Web Vitals as Ranking Factors

For detailed Web Vitals measurement and optimization, see [09_web_performance.md](./09_web_performance.md) sections 2-7. This section explains their direct SEO impact.

### Core Web Vitals (Google Ranking Factors)

- **LCP** — Good: < 2.5s, Poor: > 4.0s. Measures how fast the largest element loads
- **INP** — Good: < 200ms, Poor: > 500ms. Measures how responsive the page is to clicks
- **CLS** — Good: < 0.1, Poor: > 0.25. Measures how much the layout shifts unexpectedly

### How Google Uses Web Vitals

- Pages with good Core Web Vitals get a **ranking boost** over pages with poor vitals.
- Google collects real-user data via the **Chrome User Experience Report (CrUX)**.
- You can see your site's vitals in **Google Search Console > Core Web Vitals**.
- Web Vitals are a **tiebreaker** -- if two pages have equal content relevance, the faster one ranks higher.

### Monitoring

```tsx
// app/layout.tsx
import { Analytics } from "@vercel/analytics/next"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Key Tools

- **Google Search Console** — Real-user CrUX data for your site
- **PageSpeed Insights** — Lab + field data for any URL
- **Lighthouse (Chrome DevTools)** — Lab data with specific recommendations
- **Vercel Analytics** — Real-user performance data for Vercel-hosted sites

---

## 14. Common Mistakes

### Anchor Links in Sitemaps

```
https://yourdomain.com/#about    // Bad - not a crawlable page
https://yourdomain.com/about     // Good - separate page
```

### Missing or Duplicate Metadata

```tsx
// Bad - same title on every page
export const metadata = { title: "My Site" }

// Good - unique titles per page using template
// layout.tsx
export const metadata = { title: { default: "My Site", template: "%s | My Site" } }
// about/page.tsx
export const metadata = { title: "About" } // => "About | My Site"
```

### Client-Side Only Content

Content rendered only inside `useEffect` or `useState` is **invisible to crawlers**:

```tsx
// Bad - SEO-critical content rendered client-side only
const [products, setProducts] = useState([])
useEffect(() => {
  fetch("/api/products").then(r => r.json()).then(setProducts)
}, [])

// Good - use Server Components or generateStaticParams
export default async function Page() {
  const products = await getProducts() // runs on server
  return <ProductList products={products} />
}
```

### Blocking Search Engines from CSS/JS

```
# robots.txt - Don't do this
Disallow: /_next/
```

Search engines need access to CSS and JS to render your pages correctly.

### Hydration Mismatches (CLS Impact)

```tsx
// Bad - causes hydration mismatch and layout shift
const [theme, setTheme] = useState(localStorage.getItem("theme"))

// Good - hydrate with default, sync in useEffect
const [theme, setTheme] = useState("dark")
useEffect(() => {
  const saved = localStorage.getItem("theme")
  if (saved) setTheme(saved)
}, [])
```

### Missing Alt Text

```tsx
<img src="photo.jpg" />                                    // Bad
<Image src="photo.jpg" alt="Team meeting at the office" /> // Good
```

### Not Using Server-Side Rendering for SEO Pages

```tsx
// Bad - client component for a page that needs SEO
"use client"
export default function ProductPage() { ... }

// Good - server component (default in App Router)
export default async function ProductPage() {
  const product = await getProduct(id) // server-side data fetching
  return <ProductDetails product={product} />
}
```

---

## Quick Checklist

- [ ] Metadata defined for all pages (title, description, keywords)
- [ ] Open Graph and Twitter card tags configured
- [ ] `sitemap.ts` generates valid sitemap with no anchor links
- [ ] `robots.ts` allows crawling of important pages
- [ ] Canonical URLs set for all pages
- [ ] JSON-LD structured data for key entities
- [ ] `next/image` used with descriptive alt text
- [ ] `next/font` with `display: "swap"`
- [ ] Analytics loaded with `afterInteractive` strategy
- [ ] Security headers configured (HSTS, X-Content-Type-Options)
- [ ] Semantic HTML with proper heading hierarchy
- [ ] Core Web Vitals monitored
- [ ] No client-side-only rendering of SEO-critical content
- [ ] Sitemap submitted to Google Search Console

---

## Resources

- [Next.js Metadata Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Google Search Central](https://developers.google.com/search/docs)
- [Web Vitals](https://web.dev/vitals/)
- [Schema.org](https://schema.org/)
- [Rich Results Test](https://search.google.com/test/rich-results)

---

## Related Docs

- [Web Performance](./09_web_performance.md) -- Core Web Vitals, image/font optimization, caching
- [Next.js Guide](./06_next.md) -- SSR/SSG/ISR, next/image, next/font, metadata basics
- [Accessibility](./18_accessibility.md) -- Semantic HTML, ARIA, heading hierarchy
- [HTML & Security](./07_html.md) -- CSP, XSS prevention, security headers
- [i18n with react-i18next](./10_translation_i18next.md) -- Translation setup, RTL support
