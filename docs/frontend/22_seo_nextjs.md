# SEO Optimizations in Next.js

---

## 1. Metadata API

Use the `Metadata` export in `layout.tsx` or `page.tsx`. Use `title.template` in the root layout:

```tsx
// app/layout.tsx
export const metadata: Metadata = {
  title: { default: "Your Name - Developer", template: "%s | Your Name" },
  description: "Portfolio showcasing web applications built with React and Next.js.",
}

// app/about/page.tsx
export const metadata: Metadata = {
  title: "About", // Renders: "About | Your Name"
}
```

- Titles: under 60 characters, unique per page, most important keyword first.
- Descriptions: 120–160 characters, unique per page, include keywords naturally.

---

## 2. Open Graph & Twitter Cards

```tsx
export const metadata: Metadata = {
  openGraph: {
    title: "Your Name - Full Stack Developer",
    description: "Portfolio showcasing scalable web applications.",
    url: "https://yourdomain.com",
    siteName: "Your Name Portfolio",
    locale: "en_US",
    type: "website",
    images: [{ url: "https://yourdomain.com/og-image.png", width: 1200, height: 630, alt: "Portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@yourhandle",
    images: ["https://yourdomain.com/og-image.png"],
  },
}
```

Use **1200x630px** OG images. For dynamic OG images, use `ImageResponse` from `next/og`:

```tsx
// app/api/og/route.tsx
import { ImageResponse } from "next/og"

export async function GET(request: Request) {
  const title = new URL(request.url).searchParams.get("title") ?? "Default Title"
  return new ImageResponse(
    <div style={{ fontSize: 48, background: "white", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {title}
    </div>,
    { width: 1200, height: 630 },
  )
}
```

---

## 3. Sitemap & Robots

**Sitemap** — `app/sitemap.ts`:

```tsx
import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://yourdomain.com"
  return [
    { url: base, lastModified: new Date(), changeFrequency: "monthly", priority: 1.0 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  ]
}
```

- Never include anchor links (`/#about`) — they are not crawlable pages.
- Priority: 1.0 homepage, 0.8 main pages, 0.5 secondary.

**Robots** — `app/robots.ts`:

```tsx
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/admin/"] },
    sitemap: "https://yourdomain.com/sitemap.xml",
  }
}
```

---

## 4. Canonical URLs

Prevents duplicate content across multiple URLs (trailing slash, query params, www vs non-www):

```tsx
// Static
export const metadata: Metadata = { alternates: { canonical: "https://yourdomain.com" } }

// Dynamic route
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return { alternates: { canonical: `https://yourdomain.com/projects/${id}` } }
}
```

---

## 5. Structured Data (JSON-LD)

Enables rich results in search (star ratings, breadcrumbs, FAQs):

```tsx
export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Your Name",
    url: "https://yourdomain.com",
    jobTitle: "Full Stack Developer",
    sameAs: ["https://github.com/yourusername", "https://linkedin.com/in/yourusername"],
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* page content */}
    </>
  )
}
```

Other schema types: `WebSite`, `BreadcrumbList`, `Article`, `FAQPage`.

---

## 6. Dynamic Metadata

```tsx
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const project = await getProject(id)
  if (!project) return { title: "Project Not Found" }
  return {
    title: project.title,
    description: project.description,
    openGraph: { title: project.title, images: project.image ? [{ url: project.image }] : [] },
    alternates: { canonical: `https://yourdomain.com/projects/${id}` },
  }
}

// Pre-render all known project pages at build time
export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ id: p.id }))
}
```

---

## 7. Performance & SEO

Page speed is a direct ranking factor:

- Load analytics and third-party scripts with `strategy="afterInteractive"` via `next/script`.
- Use dynamic imports for heavy client components.
- Render SEO-critical content in Server Components — client-side-only content is invisible to crawlers.

```tsx
// Cache static assets
async headers() {
  return [{ source: "/_next/static/(.*)", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] }]
}
```

---

## 8. Image SEO

```tsx
<Image src="/hero.png" alt="Tripz dashboard showing booking workflow" width={800} height={450} priority placeholder="blur" blurDataURL="data:image/..." />
```

- Informative images: specific alt text with keywords.
- Decorative images: `alt=""`.
- File names should be descriptive: `tripz-booking-dashboard.png`, not `screenshot.png`.

---

## 9. Security Headers & SEO

HTTPS is a ranking signal. Configure in `next.config.ts`:

```tsx
async headers() {
  return [{
    source: "/(.*)",
    headers: [
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    ],
  }]
}
```

---

## 10. i18n & SEO

Always set `<html lang="en">`. Use `hreflang` to tell search engines which language versions exist:

```tsx
export const metadata: Metadata = {
  alternates: {
    canonical: "https://yourdomain.com",
    languages: { en: "https://yourdomain.com/en", ar: "https://yourdomain.com/ar" },
  },
}
```

URL structure preference: **subdirectory** (`/en/`, `/ar/`) > subdomain > separate domain.

---

## 11. Web Vitals & Common Mistakes

**Core Web Vitals** (Google ranking factors):
- LCP < 2.5s — largest element load time
- INP < 200ms — interaction responsiveness
- CLS < 0.1 — layout shift score

**Common mistakes to avoid:**
- Anchor links in sitemaps (`/#about`) — not crawlable.
- SEO-critical content in `useEffect`/client components — use Server Components.
- Blocking `/_next/` in robots.txt — crawlers need CSS/JS to render.
- Missing alt text on images.

---

## Quick Checklist

- [ ] Unique title and description metadata on every page
- [ ] Open Graph and Twitter card tags configured
- [ ] `sitemap.ts` submitted to Search Console
- [ ] `robots.ts` allows crawling of all public pages
- [ ] Canonical URLs on all pages
- [ ] JSON-LD structured data for key entities
- [ ] `next/image` with descriptive alt text, `priority` on LCP image
- [ ] Third-party scripts load with `afterInteractive`
- [ ] Security headers configured (HSTS, X-Content-Type-Options)
- [ ] One `<h1>` per page, semantic HTML landmarks
- [ ] Core Web Vitals monitored
