# Web Performance - Complete Guide

A comprehensive guide to web performance optimization and Core Web Vitals.

## Table of Contents

1. [What is Web Performance?](#1-what-is-web-performance)
2. [Core Web Vitals](#2-core-web-vitals)
3. [LCP (Largest Contentful Paint)](#3-lcp-largest-contentful-paint)
4. [FID/INP (First Input Delay / Interaction to Next Paint)](#4-fidinp-first-input-delay--interaction-to-next-paint)
5. [CLS (Cumulative Layout Shift)](#5-cls-cumulative-layout-shift)
6. [Other Important Performance Metrics](#6-other-important-performance-metrics)
7. [Measuring Web Performance](#7-measuring-web-performance)
8. [Image Optimization](#8-image-optimization)
9. [Lazy Loading](#9-lazy-loading)
10. [Code Splitting](#10-code-splitting)
11. [Tree Shaking](#11-tree-shaking)
12. [Minification](#12-minification)
13. [Compression (gzip/brotli)](#13-compression-gzipbrotli)
14. [Caching](#14-caching)
15. [CDN (Content Delivery Network)](#15-cdn-content-delivery-network)
16. [Prefetching and Preloading](#16-prefetching-and-preloading)
17. [Critical CSS](#17-critical-css)
18. [Render-blocking Resources](#18-render-blocking-resources)
19. [Bundle Analysis](#19-bundle-analysis)
20. [Debouncing and Throttling](#20-debouncing-and-throttling)
21. [Resource Prioritization](#21-resource-prioritization)
22. [HTTP/2 and HTTP/3](#22-http2-and-http3)
23. [Third-party Script Optimization](#23-third-party-script-optimization)
24. [Font Optimization](#24-font-optimization)
25. [Web Performance Best Practices](#25-web-performance-best-practices)
26. [Summary](#26-summary)

---

## 1. What is Web Performance?

**Web performance** is how fast a website loads and responds to user interactions.

**Why it Matters:**
- **User Experience** - Slow sites frustrate users
- **SEO** - Google ranks faster sites higher
- **Conversions** - Every 100ms delay can decrease conversions by 1%
- **Bounce Rate** - 53% of mobile users leave if page takes > 3 seconds

**Key Measurement Areas:**
- **Loading** - How quickly content appears
- **Interactivity** - How soon users can interact
- **Visual Stability** - How much content shifts during load

**Performance Impact:**

| Delay | Impact |
|-------|--------|
| 100ms | 1% decrease in conversions |
| 1 second | 11% fewer page views |
| 3 seconds | 53% of mobile users bounce |
| 5 seconds | 90% of users abandon |

---

## 2. Core Web Vitals

**Core Web Vitals** are Google's key performance metrics that affect SEO ranking and user experience.

**Three Main Metrics:**

1. **LCP (Largest Contentful Paint)** - Loading performance
2. **FID/INP (First Input Delay / Interaction to Next Paint)** - Interactivity
3. **CLS (Cumulative Layout Shift)** - Visual stability

**Core Web Vitals Thresholds:**

| Metric | Good | Needs Improvement | Poor |
|--------|------|------------------|------|
| **LCP** | < 2.5s | 2.5s - 4.0s | > 4.0s |
| **FID** | < 100ms | 100ms - 300ms | > 300ms |
| **INP** | < 200ms | 200ms - 500ms | > 500ms |
| **CLS** | < 0.1 | 0.1 - 0.25 | > 0.25 |

**Why Core Web Vitals Matter:**
- Used for Google SEO ranking
- Measure real user experience
- Focus on user-centric metrics
- Industry standard for performance

---

## 3. LCP (Largest Contentful Paint)

**LCP** measures when the largest content element becomes visible in the viewport.

**What counts as LCP:**
- Large images
- Video poster images
- Background images (CSS)
- Block-level text elements

**Target**: < 2.5 seconds

### Causes of Slow LCP

- Large, unoptimized images
- Slow server response time (TTFB)
- Render-blocking CSS and JavaScript
- Slow resource load times
- Client-side rendering

### How to Improve LCP

```html
<!-- ✅ 1. Optimize images -->
<img
  src="hero.jpg"
  alt="Hero"
  loading="eager"        <!-- Don't lazy load above-fold -->
  fetchpriority="high"   <!-- Prioritize loading -->
  width="1200"
  height="600"
/>
```

```html
<!-- ✅ 2. Preload critical resources -->
<link rel="preload" href="hero.jpg" as="image">
<link rel="preload" href="critical.css" as="style">
```

```html
<!-- ✅ 3. Optimize fonts -->
<link
  rel="preload"
  href="font.woff2"
  as="font"
  type="font/woff2"
  crossorigin
>
```

```html
<!-- ✅ 4. Defer non-critical JavaScript -->
<script src="app.js" defer></script>
```

**LCP Optimization Strategies:**

| Strategy | Impact | Difficulty |
|----------|--------|------------|
| Use CDN | High | Easy |
| Optimize images | High | Easy |
| Reduce server response time | High | Medium |
| Preload critical resources | Medium | Easy |
| Remove render-blocking resources | High | Medium |
| Implement critical CSS | Medium | Hard |

---

## 4. FID/INP (First Input Delay / Interaction to Next Paint)

**FID** measures the time from when a user first interacts with a page to when the browser responds.

**INP** is more comprehensive, measuring the latency of all interactions throughout the page lifecycle.

**Target**:
- FID < 100ms
- INP < 200ms

### Causes of Poor FID/INP

- Heavy JavaScript execution blocking main thread
- Long tasks (> 50ms) blocking interactivity
- Large JavaScript bundles
- Unoptimized event handlers

### How to Improve FID/INP

```javascript
// ❌ Bad - blocks main thread for long time
function processData(data) {
  data.forEach(item => {
    // Heavy processing synchronously
    processItem(item);
  });
}

// ✅ Good - yields to browser
async function processData(data) {
  for (let i = 0; i < data.length; i++) {
    processItem(data[i]);

    // Yield to browser every 100 items
    if (i % 100 === 0) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
}
```

```javascript
// ✅ Code splitting - load only what's needed
import { lazy } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

```javascript
// ❌ Bad - expensive calculation on every scroll
window.addEventListener('scroll', () => {
  const position = calculateComplexPosition();
  updateUI(position);
});

// ✅ Good - debounced
const debouncedScroll = debounce(() => {
  const position = calculateComplexPosition();
  updateUI(position);
}, 100);

window.addEventListener('scroll', debouncedScroll);
```

```javascript
// ✅ Use web workers for heavy computation
const worker = new Worker('compute.js');
worker.postMessage(data);
worker.onmessage = (e) => {
  console.log('Result:', e.data);
};
```

**FID/INP Optimization Strategies:**

| Strategy | Impact | Difficulty |
|----------|--------|------------|
| Code splitting | High | Medium |
| Debounce/throttle events | High | Easy |
| Use web workers | High | Hard |
| Break up long tasks | High | Medium |
| Reduce JavaScript execution time | High | Medium |

---

## 5. CLS (Cumulative Layout Shift)

**CLS** measures visual stability during page load - how much content unexpectedly shifts.

**Target**: < 0.1

### Causes of CLS

- Images without dimensions
- Ads, embeds, iframes without reserved space
- Dynamically injected content
- Web fonts causing FOIT/FOUT (Flash of Invisible/Unstyled Text)
- Animations that push content

### How to Improve CLS

```html
<!-- ❌ Bad - no dimensions -->
<img src="photo.jpg" alt="Photo">

<!-- ✅ Good - explicit dimensions -->
<img
  src="photo.jpg"
  alt="Photo"
  width="800"
  height="600"
>
```

```css
/* ✅ CSS aspect ratio for responsive images */
.image-container {
  aspect-ratio: 16 / 9;
}
```

```css
/* ✅ Reserve space for ads/embeds */
.ad-slot {
  min-height: 250px;
  background: #f0f0f0;
}
```

```css
/* ✅ Font display strategy */
@font-face {
  font-family: 'MyFont';
  src: url('font.woff2');
  font-display: swap; /* Show fallback, swap when ready */
}
```

```css
/* ❌ Bad - causes layout shift */
.box {
  animation: slideDown 0.3s;
}
@keyframes slideDown {
  from { top: -100px; }
  to { top: 0; }
}

/* ✅ Good - no layout shift */
.box {
  animation: slideDown 0.3s;
}
@keyframes slideDown {
  from { transform: translateY(-100px); }
  to { transform: translateY(0); }
}
```

**CLS Prevention Checklist:**

| Element Type | Solution |
|-------------|----------|
| Images | Set width and height attributes |
| Ads/Embeds | Reserve space with min-height |
| Fonts | Use font-display: swap |
| Dynamic content | Reserve space or use placeholders |
| Animations | Use transform instead of top/left |

---

## 6. Other Important Performance Metrics

Beyond Core Web Vitals, several other metrics help measure performance.

### Performance Metrics Timeline

```
Request → TTFB → FCP → LCP → TTI
   |       |      |      |      |
   |       |      |      |      └─ Fully interactive
   |       |      |      └─ Largest content visible
   |       |      └─ First content visible
   |       └─ Server responds
   └─ Request sent
```

**Metrics Comparison:**

| Metric | What it Measures | Good Threshold | Importance |
|--------|------------------|----------------|------------|
| **TTFB** | Server response time | < 600ms | Server performance |
| **FCP** | First content visible | < 1.8s | Perceived loading |
| **LCP** | Largest content visible | < 2.5s | Loading performance |
| **TTI** | Page fully interactive | < 3.8s | Usability |
| **TBT** | Main thread blocking | < 200ms | Responsiveness |
| **Speed Index** | Visual progress | < 3.4s | User experience |

### TTFB (Time to First Byte)
- Measures server response time
- Affected by server performance, network latency
- Good: < 600ms

### FCP (First Contentful Paint)
- First text/image appears
- Indicates page has started loading
- Good: < 1.8s

### TTI (Time to Interactive)
- Page is fully interactive
- All event handlers registered
- Good: < 3.8s

### TBT (Total Blocking Time)
- Sum of long tasks blocking main thread
- Tasks > 50ms count as blocking
- Good: < 200ms

### Speed Index
- How quickly content becomes visually complete
- Lower is better
- Good: < 3.4s

---

## 7. Measuring Web Performance

Multiple tools and methods to measure web performance.

### Method 1: Chrome DevTools Lighthouse

```bash
1. Open Chrome DevTools (F12)
2. Go to Lighthouse tab
3. Select categories (Performance)
4. Click "Analyze page load"
```

### Method 2: Web Vitals Library

```javascript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Log to console
getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);

// Send to analytics
function sendToAnalytics(metric) {
  const body = JSON.stringify(metric);
  fetch('/analytics', { method: 'POST', body });
}

getCLS(sendToAnalytics);
getLCP(sendToAnalytics);
```

### Method 3: Performance API

```javascript
const perfData = performance.getEntriesByType('navigation')[0];
console.log('TTFB:', perfData.responseStart - perfData.requestStart);
console.log('DOM Load:', perfData.domContentLoadedEventEnd);
console.log('Page Load:', perfData.loadEventEnd);
```

### Method 4: PerformanceObserver

```javascript
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('LCP:', entry.renderTime || entry.loadTime);
  }
});

observer.observe({ entryTypes: ['largest-contentful-paint'] });
```

**Performance Measurement Tools:**

| Tool | Type | Use Case |
|------|------|----------|
| **Lighthouse** | Lab | Development testing |
| **WebPageTest** | Lab | Detailed waterfall analysis |
| **PageSpeed Insights** | Lab + Field | Google's official tool |
| **Chrome UX Report** | Field | Real user data |
| **Web Vitals Library** | Field | Production monitoring |

---

## 8. Image Optimization

Images are often the largest assets on a page. Optimization significantly improves LCP.

### Choose the Right Format

| Format | Best For | Pros | Cons |
|--------|---------|------|------|
| **JPEG** | Photos | Good compression | No transparency |
| **PNG** | Graphics with transparency | Lossless | Large file size |
| **WebP** | Modern format | Smaller, good quality | Limited old browser support |
| **AVIF** | Newest format | Best compression | Very limited support |
| **SVG** | Icons, logos | Scalable, tiny | Only for vector graphics |

### Responsive Images

```html
<picture>
  <source
    srcset="image-small.webp 400w,
            image-medium.webp 800w,
            image-large.webp 1200w"
    type="image/webp"
  >
  <img
    src="image-medium.jpg"
    alt="Description"
    width="800"
    height="600"
    loading="lazy"
  >
</picture>
```

### Lazy Loading

```html
<img
  src="image.jpg"
  loading="lazy"
  alt="Description"
  width="800"
  height="600"
>
```

### Next.js Image Component

```jsx
import Image from 'next/image';

<Image
  src="/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
  priority // For above-fold images
/>
```

**Image Optimization Checklist:**

- Choose appropriate format (WebP/AVIF when possible)
- Compress images (tools: ImageOptim, Squoosh, TinyPNG)
- Use responsive images with srcset
- Lazy load below-fold images
- Set width/height to prevent CLS
- Use CDN for image delivery
- Consider image CDNs (Cloudinary, imgix, Cloudflare Images)

---

## 9. Lazy Loading

**Lazy loading** defers loading of non-critical resources until they're needed.

**Benefits:**
- Reduces initial page load time
- Saves bandwidth
- Improves performance metrics

### Native Lazy Loading

```html
<!-- Images -->
<img
  src="photo.jpg"
  loading="lazy"
  alt="Photo"
  width="800"
  height="600"
>

<!-- iframes -->
<iframe
  src="https://example.com/embed"
  loading="lazy"
  width="560"
  height="315"
></iframe>
```

### JavaScript Lazy Loading with Intersection Observer

```javascript
const images = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      observer.unobserve(img);
    }
  });
});

images.forEach(img => imageObserver.observe(img));
```

### React Lazy Loading Components

```jsx
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

**When NOT to Lazy Load:**
- Above-the-fold content
- Critical resources
- First few images
- Hero images

**Lazy Loading Comparison:**

| Method | Browser Support | Ease of Use | Control |
|--------|----------------|-------------|---------|
| Native `loading="lazy"` | Modern browsers | Very easy | Limited |
| Intersection Observer | All modern browsers | Medium | High |
| React `lazy()` | All (with polyfill) | Easy | Medium |

---

## 10. Code Splitting

**Code splitting** breaks JavaScript into smaller chunks, loading only necessary code for each page.

**Benefits:**
- Reduces initial bundle size
- Improves load time
- Better FID/INP scores

### Route-based Code Splitting

```jsx
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

### Component-based Code Splitting

```jsx
import { lazy, Suspense, useState } from 'react';

const Modal = lazy(() => import('./components/Modal'));

function Page() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <button onClick={() => setShowModal(true)}>
        Open Modal
      </button>

      {showModal && (
        <Suspense fallback={<div>Loading modal...</div>}>
          <Modal onClose={() => setShowModal(false)} />
        </Suspense>
      )}
    </div>
  );
}
```

### Dynamic Import

```javascript
button.addEventListener('click', async () => {
  const module = await import('./heavy-module.js');
  module.doSomething();
});
```

**Next.js Automatic Code Splitting:**
- Each page is automatically code split
- `pages/home.js` → `home.chunk.js`
- `pages/about.js` → `about.chunk.js`

**Code Splitting Strategies:**

| Strategy | When to Use | Impact |
|----------|-------------|--------|
| Route-based | Different pages/routes | High |
| Component-based | Heavy modals, charts | Medium |
| Library splitting | Large dependencies | High |
| Vendor splitting | Third-party libraries | Medium |

---

## 11. Tree Shaking

**Tree shaking** removes unused code from bundles through static analysis.

**Requirements:**
- ES6 modules (import/export)
- Production build mode
- Proper bundler configuration

```javascript
// utils.js - Library file
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export function multiply(a, b) {
  return a * b;
}
```

```javascript
// ❌ Bad - imports everything
import * as utils from './utils.js';
utils.add(2, 3);
// All functions included in bundle

// ✅ Good - imports only what's needed
import { add } from './utils.js';
add(2, 3);
// Only add() included, subtract() and multiply() removed
```

### Package.json Configuration

```json
{
  "sideEffects": false
}
```

Or specify files with side effects:

```json
{
  "sideEffects": ["*.css", "*.scss"]
}
```

**Tree Shaking Comparison:**

| Approach | Bundle Size | Works With |
|----------|------------|------------|
| Import all | Large | CommonJS, ES6 |
| Named imports | Small (with tree shaking) | ES6 only |
| Default imports | Medium | Both |

---

## 12. Minification

**Minification** removes unnecessary characters from code without changing functionality.

**What it removes:**
- Whitespace
- Comments
- Line breaks
- Shortens variable names
- Removes unused code

```javascript
// Original JavaScript (400 bytes)
function calculateTotal(price, quantity, discount) {
  const subtotal = price * quantity;
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal - discountAmount;
  return total;
}

// Minified JavaScript (100 bytes)
function calculateTotal(e,t,n){const a=e*t,l=a*(n/100);return a-l}
```

**File Size Comparison:**

| Version | Size |
|---------|------|
| React (development) | 1.3 MB |
| React (production minified) | 42 KB |
| React (minified + gzipped) | 13 KB |

**Tools:**
- **Terser** - JavaScript minification
- **cssnano** - CSS minification
- **HTMLMinifier** - HTML minification

**Build tools handle this automatically:**
- Webpack: `mode: 'production'`
- Vite: `vite build`
- Next.js: `next build`

---

## 13. Compression (gzip/brotli)

**Compression** reduces file size for transfer over the network.

**Comparison:**

| Compression | Reduction | Browser Support | Speed |
|------------|-----------|----------------|-------|
| None | 0% | All | N/A |
| **gzip** | ~70% | All | Fast |
| **Brotli** | ~20% better than gzip | Modern | Slower encode, faster decode |

### Nginx Configuration

```nginx
# Enable gzip
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;

# Enable Brotli
brotli on;
brotli_types text/plain text/css application/json application/javascript;
```

### Express.js

```javascript
const compression = require('compression');
app.use(compression());
```

### Next.js

```javascript
// next.config.js
module.exports = {
  compress: true // Automatic in production
};
```

**File Size Comparison:**

| Stage | Size | Reduction |
|-------|------|-----------|
| Original | 1000 KB | - |
| Minified | 400 KB | 60% |
| Gzipped | 120 KB | 70% from minified |
| Brotli | 95 KB | 76% from minified |

**What to Compress:**
- ✅ Text files (JS, CSS, HTML, JSON, XML)
- ❌ Images, videos (already compressed)

---

## 14. Caching

**Caching** stores resources to avoid re-downloading on repeat visits.

### Cache-Control Headers

```http
# No caching
Cache-Control: no-store

# Cache but always revalidate
Cache-Control: no-cache

# Cache for 1 hour
Cache-Control: max-age=3600

# Cache for 1 year (immutable assets with hash)
Cache-Control: max-age=31536000, immutable
```

### Caching Strategies

| Resource Type | Strategy | Header |
|--------------|----------|--------|
| HTML | No cache (always fresh) | `no-cache` |
| Hashed assets | Long-term cache | `max-age=31536000, immutable` |
| API responses | Short cache | `max-age=60` |
| User-specific content | No cache | `no-store, private` |

### Service Worker Caching

```javascript
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

**Caching Layers:**

```
Browser Cache
     ↓
CDN Cache
     ↓
Server Cache
     ↓
Database
```

---

## 15. CDN (Content Delivery Network)

**CDN** is a network of servers distributed globally that serves content from the server closest to the user.

### Without CDN

```
User in Tokyo → Origin Server in New York
Latency: ~200ms
```

### With CDN

```
User in Tokyo → CDN Edge Server in Tokyo
Latency: ~10ms
```

**Popular CDNs:**
- Cloudflare
- AWS CloudFront
- Fastly
- Akamai
- Vercel Edge Network
- Cloudinary (images)

### Using CDN

```html
<!-- CDN for libraries -->
<script src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js"></script>

<!-- CDN for images -->
<img src="https://cdn.example.com/images/photo.jpg" alt="Photo">
```

**CDN Benefits:**

| Benefit | Impact |
|---------|--------|
| Faster load times | High |
| Reduced server load | High |
| Better availability | High |
| DDoS protection | Medium |
| Automatic compression | Medium |
| Image optimization | High |

---

## 16. Prefetching and Preloading

Resource hints to optimize loading.

**Comparison:**

| Hint | Priority | When to Use | Example |
|------|----------|-------------|---------|
| **preload** | High | Critical resources for current page | Fonts, hero images, critical CSS |
| **prefetch** | Low | Resources for next page | Next route in SPA |
| **preconnect** | Medium | External domains | APIs, font providers |
| **dns-prefetch** | Low | DNS resolution only | Analytics, ads |

### Preload (Critical Resources)

```html
<link rel="preload" href="critical.css" as="style">
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="hero.jpg" as="image">
```

### Prefetch (Likely Next Page)

```html
<link rel="prefetch" href="/about">
<link rel="prefetch" href="next-page.js">
```

### Preconnect (External Domains)

```html
<link rel="preconnect" href="https://api.example.com">
<link rel="preconnect" href="https://fonts.googleapis.com">
```

### DNS-prefetch (DNS Resolution)

```html
<link rel="dns-prefetch" href="https://analytics.example.com">
```

### React Prefetch on Hover

```jsx
<Link
  to="/about"
  onMouseEnter={() => import('./pages/About')}
>
  About
</Link>
```

### Next.js Automatic Prefetching

```jsx
<Link href="/about">About</Link>
<!-- Automatically prefetches when link is in viewport -->
```

---

## 17. Critical CSS

**Critical CSS** is the minimum CSS needed for above-the-fold content.

**Benefits:**
- Improves FCP and LCP
- Reduces render-blocking
- Better perceived performance

### Implementation

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Inline critical CSS -->
  <style>
    /* Only styles for above-fold content */
    body { margin: 0; font-family: sans-serif; }
    .header { height: 60px; background: white; }
    .hero { height: 500px; background: blue; }
  </style>

  <!-- Load non-critical CSS async -->
  <link
    rel="preload"
    href="styles.css"
    as="style"
    onload="this.onload=null;this.rel='stylesheet'"
  >
  <noscript>
    <link rel="stylesheet" href="styles.css">
  </noscript>
</head>
<body>
  <header class="header">...</header>
  <section class="hero">...</section>
  <!-- Rest of page -->
</body>
</html>
```

**Tools to Extract Critical CSS:**
- Critical
- Critters (used by Angular)
- PurgeCSS
- Webpack CriticalCssPlugin

---

## 18. Render-blocking Resources

Resources that prevent page from rendering until loaded.

### Render-blocking Comparison

| Resource Type | Blocks Rendering | Solution |
|--------------|-----------------|----------|
| CSS in `<head>` | Yes | Inline critical CSS, defer non-critical |
| Synchronous `<script>` | Yes | Use `defer` or `async` |
| JavaScript in `<head>` | Yes | Move to end of `<body>` or use `defer` |
| Images | No | - |

```html
<!-- ❌ Render-blocking CSS -->
<link rel="stylesheet" href="styles.css">

<!-- ✅ Non-blocking CSS (for non-critical) -->
<link
  rel="preload"
  href="styles.css"
  as="style"
  onload="this.rel='stylesheet'"
>

<!-- ❌ Render-blocking JavaScript -->
<script src="app.js"></script>

<!-- ✅ Deferred JavaScript -->
<script src="app.js" defer></script>

<!-- ✅ Async JavaScript -->
<script src="analytics.js" async></script>
```

**defer vs async:**

| Attribute | Download | Execution | Order | Use Case |
|-----------|----------|-----------|-------|----------|
| None | Blocks | Blocks | Sequential | Avoid |
| `defer` | Parallel | After HTML parse | Sequential | App scripts |
| `async` | Parallel | When ready | Random | Analytics, ads |

---

## 19. Bundle Analysis

Visualize and analyze what's in your JavaScript bundles.

### Webpack Bundle Analyzer

```javascript
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
};
```

### Next.js Bundle Analyzer

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

module.exports = withBundleAnalyzer({
  // config
});
```

Run: `ANALYZE=true npm run build`

### Vite Bundle Analyzer

```javascript
// vite.config.js
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  plugins: [
    visualizer({ open: true })
  ]
};
```

**What to Look For:**
- Large dependencies (can you replace with lighter alternatives?)
- Duplicate code (need better code splitting?)
- Unused code (is tree shaking working?)
- Source maps in production (should be removed!)

---

## 20. Debouncing and Throttling

Techniques to reduce function call frequency and improve performance.

**Comparison:**

| Technique | Behavior | Use Case |
|-----------|----------|----------|
| **Debouncing** | Wait until action stops, then execute once | Search input, window resize |
| **Throttling** | Execute at most once per interval | Scroll events, mouse movement |

### Debouncing

```javascript
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Usage - search input
const searchInput = document.querySelector('#search');
const debouncedSearch = debounce((query) => {
  fetch(`/api/search?q=${query}`);
}, 300);

searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});

// Without debounce: API call on every keystroke
// With debounce: API call 300ms after user stops typing
```

### Throttling

```javascript
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Usage - scroll event
const throttledScroll = throttle(() => {
  console.log('Scroll position:', window.scrollY);
}, 100);

window.addEventListener('scroll', throttledScroll);

// Without throttle: Fires 100+ times per second
// With throttle: Fires at most once per 100ms
```

### React Hook

```jsx
import { useCallback } from 'react';
import { debounce } from 'lodash';

function SearchComponent() {
  const handleSearch = useCallback(
    debounce((query) => {
      fetch(`/api/search?q=${query}`);
    }, 300),
    []
  );

  return (
    <input
      type="text"
      onChange={(e) => handleSearch(e.target.value)}
    />
  );
}
```

---

## 21. Resource Prioritization

Control which resources load first using `fetchpriority` attribute.

**Default Browser Priorities:**

| Resource | Priority |
|----------|----------|
| CSS | High |
| Fonts | High |
| Images in viewport | High |
| Scripts | Medium |
| Out-of-viewport images | Low |
| Prefetch resources | Lowest |

### Increase Priority

```html
<!-- Hero image -->
<img
  src="hero.jpg"
  fetchpriority="high"
  alt="Hero"
>

<!-- Critical script -->
<script src="critical.js" fetchpriority="high"></script>
```

### Decrease Priority

```html
<!-- Below-fold image -->
<img
  src="footer-logo.jpg"
  fetchpriority="low"
  loading="lazy"
  alt="Logo"
>

<!-- Analytics script -->
<script src="analytics.js" fetchpriority="low" async></script>
```

### Next.js Image Priority

```jsx
import Image from 'next/image';

<Image
  src="/hero.jpg"
  priority  // High priority, no lazy loading
  alt="Hero"
  width={1200}
  height={600}
/>
```

**Best Practices:**
- High priority: LCP element, critical CSS, critical fonts
- Low priority: Below-fold images, analytics, social widgets
- Don't mark everything as high (defeats the purpose)

---

## 22. HTTP/2 and HTTP/3

Modern HTTP protocols that improve performance.

**Protocol Comparison:**

| Feature | HTTP/1.1 | HTTP/2 | HTTP/3 |
|---------|---------|--------|--------|
| **Transport** | TCP | TCP | QUIC (UDP) |
| **Multiplexing** | No | Yes | Yes |
| **Header compression** | No | Yes | Yes |
| **Server push** | No | Yes | Yes |
| **Connection setup** | Slow | Medium | Fast |
| **Packet loss handling** | Poor | Poor | Good |

### HTTP/2 Benefits

- **Multiplexing** - Multiple requests on one connection
- **Header compression** - Smaller headers (HPACK)
- **Server push** - Server sends resources before requested
- **Stream prioritization** - Important resources first

### HTTP/2 Workarounds (Not Needed)

These optimizations from HTTP/1.1 era are unnecessary:
- Domain sharding
- CSS sprites
- Inline resources
- Concatenated files

### Enable HTTP/2 (Nginx)

```nginx
server {
  listen 443 ssl http2;
  server_name example.com;
  # ... SSL config
}
```

### HTTP/3 (QUIC) Benefits

- Faster connection establishment
- Better packet loss handling
- Connection migration (WiFi ↔ mobile)
- Built-in encryption

**Performance Impact:**
- HTTP/1.1 → HTTP/2: 20-30% faster
- HTTP/2 → HTTP/3: 10-15% faster

---

## 23. Third-party Script Optimization

Third-party scripts (analytics, ads, chat widgets) often slow down sites.

```html
<!-- ❌ Bad - blocking script -->
<script src="https://analytics.com/script.js"></script>

<!-- ✅ Good - async script -->
<script src="https://analytics.com/script.js" async></script>

<!-- ✅ Better - defer script -->
<script src="https://analytics.com/script.js" defer></script>
```

### Load on Interaction

```html
<button onclick="loadAnalytics()">Accept Cookies</button>

<script>
function loadAnalytics() {
  const script = document.createElement('script');
  script.src = 'https://analytics.com/script.js';
  script.async = true;
  document.head.appendChild(script);
}
</script>
```

### Lazy Load on Idle

```javascript
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    loadAnalytics();
  });
} else {
  setTimeout(loadAnalytics, 2000);
}
```

### Partytown (Web Worker)

```jsx
import { Partytown } from '@builder.io/partytown/react';

<Partytown forward={['dataLayer.push']} />

<script
  type="text/partytown"
  src="https://www.googletagmanager.com/gtag/js"
></script>
```

**Common Performance Culprits:**
- Google Analytics / Tag Manager
- Facebook Pixel
- Ad networks
- Live chat widgets
- Social media embeds

**Best Practices:**
- Load async or defer
- Delay non-critical scripts
- Use facades for embeds (YouTube, etc.)
- Monitor impact with Lighthouse
- Consider self-hosting
- Don't load everything on page load

---

## 24. Font Optimization

Web fonts can significantly impact rendering performance.

### font-display Strategies

```css
@font-face {
  font-family: 'MyFont';
  src: url('font.woff2');

  /* Display strategies */
  font-display: auto;      /* Browser default */
  font-display: block;     /* FOIT - hide text, wait for font */
  font-display: swap;      /* FOUT - show fallback, swap when ready */
  font-display: fallback;  /* Brief hide, then fallback */
  font-display: optional;  /* Use only if already cached */
}
```

**font-display Comparison:**

| Strategy | Behavior | Use Case |
|----------|----------|----------|
| `auto` | Browser decides | Default |
| `block` | FOIT - Hide up to 3s | Branding fonts |
| `swap` | FOUT - Always swap | Body text (Recommended) |
| `fallback` | Brief hide, then fallback | Compromise |
| `optional` | Use if cached | Decorative fonts |

### Preload Critical Fonts

```html
<link
  rel="preload"
  href="/fonts/roboto.woff2"
  as="font"
  type="font/woff2"
  crossorigin
>
```

### Google Fonts Optimization

```html
<!-- ❌ Bad - loads all weights and characters -->
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap">

<!-- ✅ Good - subset and specify display -->
<link
  href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap&text=HelloWorld"
  rel="stylesheet"
>
```

### Next.js Font Optimization

```jsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true
});

export default function Layout({ children }) {
  return (
    <html className={inter.className}>
      <body>{children}</body>
    </html>
  );
}
```

### Variable Fonts

```css
@font-face {
  font-family: 'Roboto';
  src: url('roboto-variable.woff2');
  font-weight: 100 900;  /* Supports all weights in one file */
}
```

**Font Optimization Checklist:**
- Use `font-display: swap`
- Preload critical fonts
- Use WOFF2 format (best compression)
- Subset fonts (include only needed characters)
- Limit number of fonts and weights
- Consider system fonts for body text

---

## 25. Web Performance Best Practices

### Performance Checklist

**Images:**
- Use WebP/AVIF format when possible
- Set width and height attributes
- Lazy load below-fold images
- Use responsive images (srcset)
- Compress images appropriately
- Serve from CDN

**JavaScript:**
- Minify and compress
- Code split by route
- Tree shake unused code
- Defer non-critical scripts
- Use dynamic imports
- Analyze bundle size regularly

**CSS:**
- Inline critical CSS
- Minify and compress
- Remove unused CSS
- Load non-critical CSS async
- Avoid `@import` (use `<link>` instead)

**Fonts:**
- Use `font-display: swap`
- Preload critical fonts
- Use WOFF2 format
- Subset fonts
- Limit font variations

**Network:**
- Enable HTTP/2 or HTTP/3
- Use CDN for static assets
- Enable gzip/brotli compression
- Implement proper caching headers
- Preconnect to external domains

**Rendering:**
- Avoid layout shifts (set dimensions)
- Minimize reflows/repaints
- Use CSS containment
- Optimize animations (use `transform`/`opacity`)
- Debounce/throttle expensive operations

**Third-Party:**
- Load async/defer
- Delay non-critical scripts
- Use facades for embeds
- Self-host when possible
- Monitor impact on performance

**Monitoring:**
- Track Core Web Vitals
- Set performance budgets
- Monitor in production
- Run Lighthouse regularly
- Use Real User Monitoring (RUM)

### Optimized Page Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- Critical CSS inlined -->
  <style>
    /* Inline critical above-fold styles */
  </style>

  <!-- Preconnect to external domains -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://api.example.com">

  <!-- Preload critical resources -->
  <link rel="preload" href="hero.jpg" as="image" fetchpriority="high">
  <link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>

  <!-- Non-critical CSS loaded async -->
  <link
    rel="preload"
    href="styles.css"
    as="style"
    onload="this.rel='stylesheet'"
  >
</head>
<body>
  <!-- Above-fold content with dimensions -->
  <img
    src="hero.jpg"
    width="1200"
    height="600"
    alt="Hero"
    fetchpriority="high"
  >

  <!-- Below-fold content lazy loaded -->
  <img
    src="footer.jpg"
    loading="lazy"
    width="800"
    height="400"
    alt="Footer"
  >

  <!-- Scripts deferred to end -->
  <script src="app.js" defer></script>
  <script src="analytics.js" async></script>
</body>
</html>
```

---

## 26. Summary

**Key Takeaways:**

### Core Web Vitals
1. **LCP** - Largest content visible < 2.5s (optimize images, reduce server time)
2. **FID/INP** - Interactivity < 100ms/200ms (code split, optimize JS)
3. **CLS** - Visual stability < 0.1 (set dimensions, reserve space)

### Loading Optimization
1. **Images** - Use modern formats, lazy load, set dimensions
2. **Code Splitting** - Load only what's needed per route
3. **Lazy Loading** - Defer non-critical resources
4. **Tree Shaking** - Remove unused code

### Network Optimization
1. **Minification** - Remove unnecessary characters
2. **Compression** - gzip/Brotli for text files
3. **Caching** - Store resources to avoid re-downloading
4. **CDN** - Serve from closest server to user

### Resource Optimization
1. **Preload** - Critical resources (fonts, hero images)
2. **Prefetch** - Likely next page resources
3. **Critical CSS** - Inline above-fold styles
4. **Render-blocking** - Defer non-critical resources

### JavaScript Optimization
1. **Code Splitting** - Route and component-based
2. **Bundle Analysis** - Identify large dependencies
3. **Debouncing/Throttling** - Reduce function calls
4. **Web Workers** - Offload heavy computation

### Advanced Optimization
1. **HTTP/2/3** - Multiplexing, better performance
2. **Third-party Scripts** - Load async, delay when possible
3. **Fonts** - Use `font-display: swap`, preload, subset
4. **Resource Prioritization** - Use `fetchpriority`

### Measurement Tools
- **Lighthouse** - Lab testing
- **Web Vitals Library** - Production monitoring
- **Chrome DevTools** - Performance profiling
- **PageSpeed Insights** - Google's official tool

**Performance Impact Summary:**

| Optimization | Impact | Effort |
|-------------|--------|--------|
| Image optimization | High | Low |
| Code splitting | High | Medium |
| Minification | High | Low (automatic) |
| Compression | High | Low |
| CDN | High | Low-Medium |
| Caching | High | Medium |
| Critical CSS | Medium | High |
| Font optimization | Medium | Low-Medium |
| Third-party optimization | High | Medium |

**Remember:**
- Every 100ms delay = 1% conversion loss
- 53% of mobile users bounce if page takes > 3s
- Performance is a feature, not a luxury
- Monitor continuously, optimize iteratively
- Set and enforce performance budgets

The best performance optimization is the one you measure and maintain.
