# Web Performance Guide

## 1. Core Web Vitals

Google's key performance metrics that affect SEO ranking.

| Metric | Measures | Good | Poor |
|---|---|---|---|
| **LCP** | Largest content visible | < 2.5s | > 4.0s |
| **INP** | Interaction responsiveness | < 200ms | > 500ms |
| **CLS** | Visual stability | < 0.1 | > 0.25 |

Other: **TTFB** (< 600ms), **FCP** (< 1.8s), **TBT** (< 200ms).

---

## 2. LCP (Largest Contentful Paint)

Measures when the largest visible element (hero image, heading) renders.

```html
<!-- Prioritize the LCP element -->
<img src="hero.jpg" alt="Hero" width="1200" height="600"
     loading="eager" fetchpriority="high">

<!-- Preload critical resources -->
<link rel="preload" href="hero.jpg" as="image">
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>

<!-- Defer non-critical JavaScript -->
<script src="app.js" defer></script>
```

**Key improvements:** use a CDN, optimize images, reduce TTFB, inline critical CSS.

---

## 3. INP (Interactivity)

Degrades when the main thread is blocked by long JS tasks (> 50ms).

```javascript
// Yield to the browser during heavy processing
async function processData(data) {
  for (let i = 0; i < data.length; i++) {
    processItem(data[i]);
    if (i % 100 === 0) await new Promise(r => setTimeout(r, 0));
  }
}

// Use web workers for CPU-heavy work
const worker = new Worker('compute.js');
worker.postMessage(data);
worker.onmessage = (e) => console.log('Result:', e.data);

// Code-split heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

---

## 4. CLS (Cumulative Layout Shift)

Measures unexpected visual shifts. Target: < 0.1.

```html
<!-- Always set image dimensions -->
<img src="photo.jpg" alt="Photo" width="800" height="600">
```

```css
/* Aspect ratio for responsive containers */
.image-container { aspect-ratio: 16 / 9; }

/* Font display to avoid FOIT */
@font-face { font-family: 'MyFont'; src: url('font.woff2'); font-display: swap; }

/* Animate with transform, not layout properties */
@keyframes slideDown {
  from { transform: translateY(-100px); }
  to   { transform: translateY(0); }
}
```

---

## 5. Measuring Performance

```javascript
// Web Vitals library — send real-user data to analytics
import { getCLS, getINP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric) {
  fetch('/analytics', { method: 'POST', body: JSON.stringify(metric) });
}

getCLS(sendToAnalytics);
getINP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

**Lab tools:** Lighthouse (Chrome DevTools), WebPageTest, PageSpeed Insights.
**Field tools:** Chrome UX Report, Web Vitals library.

---

## 6. Image Optimization

Images are usually the heaviest assets and the primary LCP bottleneck.

**Format guide:** WebP/AVIF for photos, SVG for icons/logos, PNG only when lossless transparency is required.

```html
<!-- Responsive images with WebP + fallback -->
<picture>
  <source srcset="img-400.webp 400w, img-800.webp 800w" type="image/webp">
  <img src="img-800.jpg" alt="Description" width="800" height="600" loading="lazy">
</picture>
```

```jsx
// Next.js — handles format conversion, sizing, and lazy loading automatically
import Image from 'next/image';
<Image src="/photo.jpg" alt="Photo" width={800} height={600} priority />
```

---

## 7. Lazy Loading

```html
<!-- Native lazy loading -->
<img src="photo.jpg" loading="lazy" alt="Photo" width="800" height="600">
<iframe src="https://example.com/embed" loading="lazy" width="560" height="315"></iframe>
```

```jsx
// React component lazy loading
const HeavyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<div>Loading...</div>}>
  <HeavyComponent />
</Suspense>
```

Do not lazy-load above-fold content, hero images, or other critical resources.

---

## 8. Code Splitting & Tree Shaking

**Code splitting** loads only the JS needed per route. **Tree shaking** removes unused exports at build time.

```jsx
// Route-based splitting
const Home      = lazy(() => import('./pages/Home'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Load on interaction
button.addEventListener('click', async () => {
  const { doSomething } = await import('./heavy-module.js');
  doSomething();
});
```

```javascript
// Named imports enable tree shaking
import { add } from './utils.js';  // subtract/multiply excluded from bundle

// Wildcard imports defeat tree shaking
import * as utils from './utils.js';
```

Next.js automatically code-splits by page.

---

## 9. Minification & Compression

- React dev build: 1.3 MB → minified: 42 KB → gzipped: 13 KB
- Brotli compresses ~20% better than gzip

Build tools apply minification automatically: `webpack mode: 'production'`, `vite build`, `next build`.

---

## 10. Caching

```http
Cache-Control: no-cache                       # HTML — always revalidate
Cache-Control: max-age=31536000, immutable    # Hashed assets — cache 1 year
Cache-Control: max-age=60                     # API responses — short cache
Cache-Control: no-store, private              # User-specific content
```

```javascript
// Service Worker — cache-first strategy
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
```

---

## 11. CDN, Prefetching & Preloading

A **CDN** serves assets from an edge server near the user, reducing latency from ~200ms to ~10ms.

```html
<!-- preload: critical resources for the current page -->
<link rel="preload" href="hero.jpg" as="image" fetchpriority="high">
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>

<!-- preconnect: warm up connections to external domains -->
<link rel="preconnect" href="https://fonts.googleapis.com">

<!-- prefetch: load resources for the likely next navigation -->
<link rel="prefetch" href="/about">
```

Next.js `<Link>` prefetches pages automatically when the link enters the viewport.

---

## 12. Critical CSS & Script Loading

**Critical CSS** — inline minimum CSS for above-fold content to eliminate the render-blocking request:

```html
<head>
  <style>/* Inline critical CSS */</style>
  <link rel="preload" href="styles.css" as="style" onload="this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="styles.css"></noscript>
</head>
```

**Script loading attributes:**

```html
<script src="app.js" defer></script>       <!-- parallel download, runs after parse, ordered -->
<script src="analytics.js" async></script> <!-- parallel download, runs immediately, unordered -->
```

Never place a plain `<script>` in `<head>` without defer or async — it blocks HTML parsing.

---

## 13. Bundle Analysis

```javascript
// Next.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});
module.exports = withBundleAnalyzer({});
// Run: ANALYZE=true npm run build
```

---

## 14. Debouncing & Throttling

- **Debounce** — waits until action stops, then fires once. Use for: search input, window resize.
- **Throttle** — fires at most once per interval. Use for: scroll, mouse move.

```javascript
function debounce(fn, delay) {
  let id;
  return (...args) => { clearTimeout(id); id = setTimeout(() => fn(...args), delay); };
}

function throttle(fn, limit) {
  let active;
  return (...args) => {
    if (!active) {
      fn(...args);
      active = true;
      setTimeout(() => active = false, limit);
    }
  };
}
```

---

## 15. Font Optimization

```html
<link rel="preload" href="/fonts/roboto.woff2" as="font" type="font/woff2" crossorigin>
```

```css
@font-face {
  font-family: 'MyFont';
  src: url('font.woff2') format('woff2');
  font-display: swap; /* show fallback immediately, swap when font loads */
}
```

```jsx
// Next.js — automatic subsetting, preloading, and zero layout shift
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'], display: 'swap' });
```

---

## 16. Third-party Script Optimization

```javascript
// Load only during idle time
requestIdleCallback
  ? requestIdleCallback(loadAnalytics)
  : setTimeout(loadAnalytics, 2000);
```

```jsx
// Partytown — run third-party scripts in a web worker
import { Partytown } from '@builder.io/partytown/react';

<Partytown forward={['dataLayer.push']} />
<script type="text/partytown" src="https://www.googletagmanager.com/gtag/js"></script>
```

---

## 17. `fetchpriority`

Fine-tunes browser resource scheduling:

```html
<img src="hero.jpg" fetchpriority="high" alt="Hero">
<img src="footer-logo.jpg" fetchpriority="low" loading="lazy" alt="Logo">
<script src="analytics.js" fetchpriority="low" async></script>
```

Mark only genuinely critical resources as high priority.

---

## 18. Performance Checklist

- **Images** — WebP/AVIF, set dimensions, lazy-load below fold, serve via CDN
- **JavaScript** — code-split by route, tree-shake, defer non-critical, analyze bundle
- **CSS** — inline critical, minify, remove unused, load rest async
- **Fonts** — WOFF2, `font-display: swap`, preload, subset
- **Network** — HTTP/2+, CDN, gzip/brotli, proper `Cache-Control` headers, `preconnect`
- **Rendering** — set image/embed dimensions, use `transform` for animations, debounce/throttle events
- **Third-party** — async/defer, defer until idle or interaction, use facades
- **Monitoring** — track Core Web Vitals, run Lighthouse in CI, use Real User Monitoring (RUM)
