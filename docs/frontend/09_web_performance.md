01. What is web performance?

🟣 Web performance is how fast a website loads and responds.
🟣 Affects user experience, SEO, and conversions.
🟣 Measured by various metrics (load time, interactivity, visual stability).
🟣 Poor performance leads to higher bounce rates.
🟣 Every 100ms delay can decrease conversions by 1%.

-----------------------------------------

02. What are Core Web Vitals?

🟣 Core Web Vitals are Google's key performance metrics.
🟣 Three main metrics: LCP, FID (INP), CLS.
🟣 Used for SEO ranking.
🟣 Focus on user experience.

************* 🟣🟣🟣 *************
Core Web Vitals:

1. LCP (Largest Contentful Paint)
   ▫️ Measures loading performance
   ▫️ Time until largest content element is visible
   ▫️ Good: < 2.5s
   ▫️ Needs improvement: 2.5s - 4s
   ▫️ Poor: > 4s

2. FID (First Input Delay) / INP (Interaction to Next Paint)
   ▫️ Measures interactivity
   ▫️ Time from user interaction to browser response
   ▫️ FID Good: < 100ms
   ▫️ INP Good: < 200ms
   ▫️ INP is replacing FID

3. CLS (Cumulative Layout Shift)
   ▫️ Measures visual stability
   ▫️ How much content shifts during loading
   ▫️ Good: < 0.1
   ▫️ Needs improvement: 0.1 - 0.25
   ▫️ Poor: > 0.25
************* 🟣🟣🟣 *************

-----------------------------------------

03. What is LCP (Largest Contentful Paint)?

🟣 LCP measures when the largest content element becomes visible.
🟣 Usually the hero image, heading, or video.
🟣 Good LCP: under 2.5 seconds.

************* 🟣🟣🟣 *************
/* What causes slow LCP */
// - Large images
// - Slow server response
// - Render-blocking resources (CSS, JS)
// - Slow resource load times

/* How to improve LCP */

// 1. Optimize images
<img
  src="hero.jpg"
  alt="Hero"
  loading="eager"        // Don't lazy load above-fold
  fetchpriority="high"   // Prioritize loading
  width="1200"
  height="600"
/>

// 2. Use CDN
// Serve static assets from CDN closer to users

// 3. Preload critical resources
<link rel="preload" href="hero.jpg" as="image">
<link rel="preload" href="styles.css" as="style">

// 4. Minimize server response time
// - Use caching
// - Optimize database queries
// - Use faster hosting

// 5. Remove render-blocking resources
// - Inline critical CSS
// - Defer non-critical JavaScript
<script src="app.js" defer></script>

// 6. Optimize fonts
<link
  rel="preload"
  href="font.woff2"
  as="font"
  type="font/woff2"
  crossorigin
>
************* 🟣🟣🟣 *************

-----------------------------------------

04. What is FID/INP (First Input Delay / Interaction to Next Paint)?

🟣 FID: Time from first interaction to browser response.
🟣 INP: More comprehensive, measures all interactions.
🟣 Good FID: under 100ms, Good INP: under 200ms.
🟣 Affected by JavaScript execution.

************* 🟣🟣🟣 *************
/* What causes poor FID/INP */
// - Heavy JavaScript execution
// - Long tasks blocking main thread
// - Large bundles
// - Unoptimized event handlers

/* How to improve FID/INP */

// 1. Break up long tasks
// Bad - blocks for 100ms
function processData(data) {
  data.forEach(item => {
    // Heavy processing
  });
}

// Good - yields to browser
async function processData(data) {
  for (let i = 0; i < data.length; i++) {
    processItem(data[i]);
    
    // Yield to browser every 50ms
    if (i % 100 === 0) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
}

// 2. Code splitting
// Load only what's needed
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// 3. Optimize event handlers
// Bad - expensive calculation on every scroll
window.addEventListener('scroll', () => {
  const position = calculateComplexPosition();
  updateUI(position);
});

// Good - debounced
const debouncedScroll = debounce(() => {
  const position = calculateComplexPosition();
  updateUI(position);
}, 100);
window.addEventListener('scroll', debouncedScroll);

// 4. Use web workers for heavy computation
const worker = new Worker('compute.js');
worker.postMessage(data);
worker.onmessage = (e) => {
  console.log('Result:', e.data);
};

// 5. Minimize third-party scripts
// Load non-critical scripts async/defer
************* 🟣🟣🟣 *************

-----------------------------------------

05. What is CLS (Cumulative Layout Shift)?

🟣 CLS measures visual stability during page load.
🟣 How much content shifts unexpectedly.
🟣 Good CLS: under 0.1.
🟣 Caused by elements loading without reserved space.

************* 🟣🟣🟣 *************
/* What causes CLS */
// - Images without dimensions
// - Ads/embeds/iframes without dimensions
// - Dynamically injected content
// - Web fonts causing FOIT/FOUT
// - Animations that push content

/* How to improve CLS */

// 1. Always set image dimensions
// Bad
<img src="photo.jpg" alt="Photo">

// Good
<img
  src="photo.jpg"
  alt="Photo"
  width="800"
  height="600"
>

// CSS aspect ratio
.image-container {
  aspect-ratio: 16 / 9;
}

// 2. Reserve space for ads/embeds
.ad-slot {
  min-height: 250px;
  background: #f0f0f0;
}

// 3. Use font-display for web fonts
@font-face {
  font-family: 'MyFont';
  src: url('font.woff2');
  font-display: swap; /* or optional */
}

// 4. Avoid inserting content above existing content
// Bad - pushes content down
<div id="banner"></div>
<div id="content">...</div>

// Good - use fixed positioning or placeholder
<div id="banner" style="position: absolute; top: 0;"></div>
<div id="content" style="margin-top: 80px;">...</div>

// 5. Use transform for animations (not top/left)
// Bad - causes layout shift
.box {
  animation: slideDown 0.3s;
}
@keyframes slideDown {
  from { top: -100px; }
  to { top: 0; }
}

// Good - no layout shift
.box {
  animation: slideDown 0.3s;
}
@keyframes slideDown {
  from { transform: translateY(-100px); }
  to { transform: translateY(0); }
}
************* 🟣🟣🟣 *************

-----------------------------------------

06. What are other important performance metrics?

🟣 TTFB (Time to First Byte): Server response time.
🟣 FCP (First Contentful Paint): First content visible.
🟣 TTI (Time to Interactive): Page fully interactive.
🟣 TBT (Total Blocking Time): How long main thread blocked.
🟣 Speed Index: How quickly content is visually displayed.

************* 🟣🟣🟣 *************
Performance Metrics Timeline:

Request → TTFB → FCP → LCP → TTI
   |       |      |      |      |
   |       |      |      |      └─ Fully interactive
   |       |      |      └─ Largest content visible
   |       |      └─ First content visible
   |       └─ Server responds
   └─ Request sent

TTFB (Time to First Byte)
▫️ Good: < 600ms
▫️ Measures server performance

FCP (First Contentful Paint)
▫️ Good: < 1.8s
▫️ First text/image appears

TTI (Time to Interactive)
▫️ Good: < 3.8s
▫️ Page is fully interactive

TBT (Total Blocking Time)
▫️ Good: < 200ms
▫️ Sum of long tasks blocking main thread

Speed Index
▫️ Good: < 3.4s
▫️ How quickly content becomes visible
************* 🟣🟣🟣 *************

-----------------------------------------

07. How do you measure web performance?

🟣 Browser DevTools (Performance, Lighthouse).
🟣 Web Vitals JavaScript library.
🟣 Real User Monitoring (RUM).
🟣 Synthetic testing tools.

************* 🟣🟣🟣 *************
// Method 1: Chrome DevTools
// Open DevTools → Lighthouse → Run audit

// Method 2: Web Vitals library
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

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

// Method 3: Performance API
const perfData = performance.getEntriesByType('navigation')[0];
console.log('TTFB:', perfData.responseStart - perfData.requestStart);
console.log('DOM Load:', perfData.domContentLoadedEventEnd);
console.log('Page Load:', perfData.loadEventEnd);

// Method 4: PerformanceObserver
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log('LCP:', entry.renderTime || entry.loadTime);
  }
});
observer.observe({ entryTypes: ['largest-contentful-paint'] });

// Tools:
// - Google Lighthouse
// - WebPageTest
// - GTmetrix
// - PageSpeed Insights
// - Chrome User Experience Report
************* 🟣🟣🟣 *************

-----------------------------------------

08. What is image optimization?

🟣 Images are often the largest assets.
🟣 Optimize format, size, and loading.
🟣 Can significantly improve LCP.

************* 🟣🟣🟣 *************
/* Image optimization techniques */

// 1. Choose right format
// - JPEG: Photos
// - PNG: Graphics with transparency
// - WebP: Modern format, smaller, quality
// - AVIF: Newest, best compression
// - SVG: Icons, logos

// 2. Compress images
// Use tools: ImageOptim, Squoosh, TinyPNG

// 3. Responsive images
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

// 4. Lazy loading
<img
  src="image.jpg"
  loading="lazy"
  alt="Description"
  width="800"
  height="600"
>

// 5. Use CDN with image optimization
// Cloudflare Images, imgix, Cloudinary

// 6. Set dimensions to prevent CLS
<img
  src="photo.jpg"
  width="800"
  height="600"
  alt="Photo"
>

// 7. Use next/image (Next.js)
import Image from 'next/image';

<Image
  src="/photo.jpg"
  alt="Photo"
  width={800}
  height={600}
  priority // For above-fold images
/>
************* 🟣🟣🟣 *************

-----------------------------------------

09. What is lazy loading?

🟣 Lazy loading defers loading of non-critical resources.
🟣 Load resources when they're about to enter viewport.
🟣 Improves initial load time.
🟣 Native browser support for images and iframes.

************* 🟣🟣🟣 *************
// Native lazy loading
<img
  src="photo.jpg"
  loading="lazy"
  alt="Photo"
  width="800"
  height="600"
>

<iframe
  src="https://example.com/embed"
  loading="lazy"
  width="560"
  height="315"
></iframe>

// JavaScript lazy loading with Intersection Observer
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

// React lazy loading components
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}

// Don't lazy load:
// - Above-the-fold content
// - Critical resources
// - First few images
************* 🟣🟣🟣 *************

-----------------------------------------

10. What is code splitting?

🟣 Code splitting breaks JavaScript into smaller chunks.
🟣 Load only necessary code for each page.
🟣 Reduces initial bundle size.
🟣 Improves load time and FID/INP.

************* 🟣🟣🟣 *************
// Route-based code splitting (React Router)
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

// Component-based code splitting
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

// Next.js automatic code splitting
// Each page is automatically code split
// pages/home.js → home.chunk.js
// pages/about.js → about.chunk.js

// Dynamic import
button.addEventListener('click', async () => {
  const module = await import('./heavy-module.js');
  module.doSomething();
});
************* 🟣🟣🟣 *************

-----------------------------------------

11. What is tree shaking?

🟣 Tree shaking removes unused code from bundles.
🟣 Only includes code that's actually used.
🟣 Reduces bundle size.
🟣 Works with ES6 modules.

************* 🟣🟣🟣 *************
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

// app.js - Only import what you need
import { add } from './utils.js';

const result = add(2, 3);
// subtract and multiply are NOT included in bundle

// ❌ Bad - imports everything
import * as utils from './utils.js';
utils.add(2, 3);

// ✅ Good - imports only what's needed
import { add } from './utils.js';
add(2, 3);

// Tree shaking requirements:
// - Use ES6 modules (import/export)
// - Configure bundler properly
// - Avoid side effects
// - Use production build

// package.json - mark as side-effect free
{
  "sideEffects": false
}

// Or specify files with side effects
{
  "sideEffects": ["*.css", "*.scss"]
}
************* 🟣🟣🟣 *************

-----------------------------------------

12. What is minification?

🟣 Minification removes unnecessary characters from code.
🟣 Reduces file size without changing functionality.
🟣 Applies to JavaScript, CSS, and HTML.
🟣 Should be done in production builds.

************* 🟣🟣🟣 *************
// Original JavaScript
function calculateTotal(price, quantity, discount) {
  const subtotal = price * quantity;
  const discountAmount = subtotal * (discount / 100);
  const total = subtotal - discountAmount;
  return total;
}

// Minified JavaScript
function calculateTotal(e,t,n){const a=e*t,l=a*(n/100);return a-l}

// What minification does:
// - Removes whitespace
// - Removes comments
// - Shortens variable names
// - Removes unnecessary semicolons

// Tools:
// - Terser (JavaScript)
// - cssnano (CSS)
// - HTMLMinifier (HTML)

// Build tools do this automatically:
// - Webpack: mode: 'production'
// - Vite: vite build
// - Next.js: next build

// Example savings:
// React (development): 1.3 MB
// React (production minified): 42 KB
// React (production minified + gzipped): 13 KB
************* 🟣🟣🟣 *************

-----------------------------------------

13. What is compression (gzip/brotli)?

🟣 Compression reduces file size for transfer.
🟣 Server compresses, browser decompresses.
🟣 Gzip: Standard, ~70% reduction.
🟣 Brotli: Better, ~20% smaller than gzip.

************* 🟣🟣🟣 *************
// Server configuration examples

// Nginx - Enable gzip
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;

// Nginx - Enable Brotli
brotli on;
brotli_types text/plain text/css application/json application/javascript;

// Express.js
const compression = require('compression');
app.use(compression());

// Next.js (automatic in production)
module.exports = {
  compress: true
};

// Check compression in browser
// DevTools → Network → Size column
// Size: 100 KB (1 MB uncompressed)

// File size comparison:
// Original: 1000 KB
// Minified: 400 KB
// Gzipped: 120 KB
// Brotli: 95 KB

// When to use:
// ✅ Compress: Text files (JS, CSS, HTML, JSON, XML)
// ❌ Don't compress: Images, videos (already compressed)
************* 🟣🟣🟣 *************

-----------------------------------------

14. What is caching?

🟣 Caching stores resources to avoid re-downloading.
🟣 Browser cache, CDN cache, server cache.
🟣 Significantly improves repeat visits.
🟣 Controlled by HTTP headers.

************* 🟣🟣🟣 *************
// Cache-Control header
// No caching
Cache-Control: no-store

// Cache but revalidate
Cache-Control: no-cache

// Cache for 1 hour
Cache-Control: max-age=3600

// Cache for 1 year (immutable assets)
Cache-Control: max-age=31536000, immutable

// Cache strategies

// 1. Versioned/hashed assets (aggressive caching)
// app.abc123.js
Cache-Control: max-age=31536000, immutable

// 2. HTML (no cache, always fresh)
Cache-Control: no-cache

// 3. API responses (short cache)
Cache-Control: max-age=60

// Service Worker caching
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

// Next.js automatic caching
// _next/static/* cached for 1 year
// public/* cached based on your config

// CDN caching
// Cloudflare, AWS CloudFront, Fastly
// Cache static assets at edge locations worldwide
************* 🟣🟣🟣 *************

-----------------------------------------

15. What is a CDN (Content Delivery Network)?

🟣 CDN is a network of servers distributed globally.
🟣 Serves content from server closest to user.
🟣 Reduces latency and improves load times.
🟣 Handles traffic spikes better.

************* 🟣🟣🟣 *************
// Without CDN
User in Tokyo → Server in New York (200ms)

// With CDN
User in Tokyo → CDN server in Tokyo (10ms)

// Popular CDNs:
// - Cloudflare
// - AWS CloudFront
// - Fastly
// - Akamai
// - Vercel Edge Network

// Using CDN for libraries
<script src="https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js">
</script>

// Using CDN for images
<img src="https://cdn.example.com/images/photo.jpg">

// Next.js with Vercel automatically uses CDN

// Benefits:
// ✅ Faster load times
// ✅ Reduced server load
// ✅ Better availability
// ✅ DDoS protection
// ✅ Automatic compression
// ✅ Image optimization
************* 🟣🟣🟣 *************

-----------------------------------------

16. What is prefetching and preloading?

🟣 Prefetch: Load resources likely needed soon (low priority).
🟣 Preload: Load critical resources immediately (high priority).
🟣 Preconnect: Establish early connections to domains.
🟣 DNS-prefetch: Resolve DNS early.

************* 🟣🟣🟣 *************
// Preload - critical resources
<link rel="preload" href="critical.css" as="style">
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="hero.jpg" as="image">

// Prefetch - likely next page
<link rel="prefetch" href="/about">
<link rel="prefetch" href="next-page.js">

// Preconnect - external domains
<link rel="preconnect" href="https://api.example.com">
<link rel="preconnect" href="https://fonts.googleapis.com">

// DNS-prefetch - resolve DNS only
<link rel="dns-prefetch" href="https://analytics.example.com">

// When to use what:

// Preload: Critical resources for current page
// - Above-fold images
// - Critical CSS
// - Web fonts
<link rel="preload" href="critical.css" as="style">

// Prefetch: Resources for next page
// - Next route in SPA
// - Likely user navigation
<link rel="prefetch" href="/dashboard.js">

// Preconnect: External APIs/fonts
<link rel="preconnect" href="https://fonts.googleapis.com">

// React - prefetch on hover
<Link
  to="/about"
  onMouseEnter={() => import('./pages/About')}
>
  About
</Link>

// Next.js automatic prefetching
<Link href="/about">About</Link>
// Automatically prefetches in viewport
************* 🟣🟣🟣 *************

-----------------------------------------

17. What is Critical CSS?

🟣 Critical CSS is styles needed for above-the-fold content.
🟣 Inline critical CSS in <head>.
🟣 Load rest of CSS asynchronously.
🟣 Improves FCP and LCP.

************* 🟣🟣🟣 *************
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

// Tools to extract critical CSS:
// - Critical
// - Critters
// - PurgeCSS

// Next.js with styled-jsx (automatic)
import { ServerStyleSheet } from 'styled-components';

// Webpack plugin
new CriticalCssPlugin({
  base: 'dist/',
  src: 'index.html',
  dest: 'index.html',
  inline: true,
  minify: true
});
************* 🟣🟣🟣 *************

-----------------------------------------

18. What is render-blocking resources?

🟣 Resources that prevent page from rendering until loaded.
🟣 CSS and synchronous JavaScript block rendering.
🟣 Delay FCP and LCP.
🟣 Should be minimized or deferred.

************* 🟣🟣🟣 *************
// ❌ Render-blocking CSS
<link rel="stylesheet" href="styles.css">
<!-- Page waits for CSS before rendering -->

// ✅ Non-blocking CSS (for non-critical)
<link
  rel="preload"
  href="styles.css"
  as="style"
  onload="this.rel='stylesheet'"
>

// ❌ Render-blocking JavaScript
<script src="app.js"></script>
<!-- Page waits for JS to download and execute -->

// ✅ Deferred JavaScript
<script src="app.js" defer></script>
<!-- Downloads in parallel, executes after HTML parsed -->

// ✅ Async JavaScript
<script src="analytics.js" async></script>
<!-- Downloads in parallel, executes immediately when ready -->

// defer vs async:
// defer: Maintains order, executes after DOM ready
// async: No order guarantee, executes ASAP

// Best practices:
<head>
  <!-- Critical CSS inlined -->
  <style>/* critical styles */</style>
  
  <!-- Preload fonts -->
  <link rel="preload" href="font.woff2" as="font" crossorigin>
</head>
<body>
  <!-- Content -->
  
  <!-- Scripts at end with defer -->
  <script src="app.js" defer></script>
</body>
************* 🟣🟣🟣 *************

-----------------------------------------

19. What is bundle analysis?

🟣 Bundle analysis shows what's in your JavaScript bundles.
🟣 Identifies large dependencies.
🟣 Helps find optimization opportunities.
🟣 Visualizes bundle composition.

************* 🟣🟣🟣 *************
// Webpack Bundle Analyzer
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  plugins: [
    new BundleAnalyzerPlugin()
  ]
};

// Run: npm run build
// Opens interactive treemap visualization

// Next.js bundle analyzer
// npm install @next/bundle-analyzer

// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

module.exports = withBundleAnalyzer({
  // config
});

// Run: ANALYZE=true npm run build

// Vite bundle analyzer
// npm install rollup-plugin-visualizer

// vite.config.js
import { visualizer } from 'rollup-plugin-visualizer';

export default {
  plugins: [
    visualizer({ open: true })
  ]
};

// What to look for:
// - Large dependencies (can you replace?)
// - Duplicate code (shared chunks?)
// - Unused code (tree shaking working?)
// - Source maps in production (remove!)
************* 🟣🟣🟣 *************

-----------------------------------------

21. What is debouncing and throttling for performance?

🟣 Debouncing: Wait until user stops action, then execute.
🟣 Throttling: Execute at most once per time interval.
🟣 Both reduce function calls and improve performance.
🟣 Common for scroll, resize, input events.

************* 🟣🟣🟣 *************
// Debouncing - search input
function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Usage
const searchInput = document.querySelector('#search');
const debouncedSearch = debounce((query) => {
  fetch(`/api/search?q=${query}`);
}, 300);

searchInput.addEventListener('input', (e) => {
  debouncedSearch(e.target.value);
});

// Without debounce: API call on every keystroke
// With debounce: API call 300ms after user stops typing

// Throttling - scroll event
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

// Usage
const throttledScroll = throttle(() => {
  console.log('Scroll position:', window.scrollY);
}, 100);

window.addEventListener('scroll', throttledScroll);

// Without throttle: Fires 100+ times per second
// With throttle: Fires at most once per 100ms

// React hook
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

// When to use:
// Debounce: Search input, window resize, form validation
// Throttle: Scroll events, mouse movement, animations
************* 🟣🟣🟣 *************

-----------------------------------------

22. What is resource prioritization?

🟣 Browsers prioritize resources (High, Medium, Low).
🟣 Can manually control with fetchpriority attribute.
🟣 Affects what loads first.
🟣 Improves LCP and user experience.

************* 🟣🟣🟣 *************
// Default priorities (Chrome):
// High: CSS, fonts, images in viewport
// Medium: Scripts, out-of-viewport images
// Low: Prefetch resources

// Increase priority - Hero image
<img
  src="hero.jpg"
  fetchpriority="high"
  alt="Hero"
>

// Decrease priority - Below-fold image
<img
  src="footer-logo.jpg"
  fetchpriority="low"
  loading="lazy"
  alt="Logo"
>

// Script priority
<script src="critical.js" fetchpriority="high"></script>
<script src="analytics.js" fetchpriority="low" async></script>

// Preload with priority
<link rel="preload" href="font.woff2" as="font" fetchpriority="high">

// Next.js Image priority
import Image from 'next/image';

<Image
  src="/hero.jpg"
  priority  // High priority, no lazy loading
  alt="Hero"
  width={1200}
  height={600}
/>

// Resource hints
<link rel="preconnect" href="https://fonts.googleapis.com">  // High
<link rel="dns-prefetch" href="https://analytics.com">       // Low
<link rel="prefetch" href="/next-page.js">                   // Lowest

// Best practices:
// ✅ High priority: LCP element, critical CSS, critical fonts
// ✅ Low priority: Below-fold images, analytics, social widgets
// ❌ Don't mark everything as high priority (defeats purpose)
************* 🟣🟣🟣 *************

-----------------------------------------

23. What is HTTP/2 and HTTP/3?

🟣 HTTP/2: Multiplexing, header compression, server push.
🟣 HTTP/3: Built on QUIC (UDP), faster connections.
🟣 Both improve performance over HTTP/1.1.
🟣 No code changes needed (server config only).

************* 🟣🟣🟣 *************
// HTTP/1.1 limitations:
// - One request per connection
// - Head-of-line blocking
// - Large headers repeated

// HTTP/2 benefits:
// ✅ Multiplexing - multiple requests on one connection
// ✅ Header compression - smaller headers
// ✅ Server push - server sends resources before requested
// ✅ Stream prioritization

// HTTP/1.1 workarounds (not needed in HTTP/2):
// - Domain sharding
// - CSS sprites
// - Inline resources
// - Concatenated files

// Enable HTTP/2 (Nginx)
server {
  listen 443 ssl http2;
  server_name example.com;
  # ... SSL config
}

// HTTP/3 (QUIC) benefits:
// ✅ Faster connection establishment
// ✅ Better packet loss handling
// ✅ Connection migration (WiFi to mobile)
// ✅ Built-in encryption

// Check protocol in DevTools
// Network tab → Protocol column
// h2 = HTTP/2
// h3 = HTTP/3

// Performance impact:
// HTTP/1.1 → HTTP/2: 20-30% faster
// HTTP/2 → HTTP/3: 10-15% faster
************* 🟣🟣🟣 *************

-----------------------------------------

26. What is third-party script optimization?

🟣 Third-party scripts (analytics, ads) slow down sites.
🟣 Load non-critical scripts asynchronously.
🟣 Defer or lazy load when possible.
🟣 Monitor their impact.

************* 🟣🟣🟣 *************
// ❌ Bad - blocking script
<script src="https://analytics.com/script.js"></script>

// ✅ Good - async script
<script src="https://analytics.com/script.js" async></script>

// ✅ Better - defer script
<script src="https://analytics.com/script.js" defer></script>

// ✅ Best - load on interaction
<button onclick="loadAnalytics()">Accept Cookies</button>

<script>
function loadAnalytics() {
  const script = document.createElement('script');
  script.src = 'https://analytics.com/script.js';
  script.async = true;
  document.head.appendChild(script);
}
</script>

// Lazy load on idle
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => {
    loadAnalytics();
  });
} else {
  setTimeout(loadAnalytics, 2000);
}

// Partytown - run third-party scripts in web worker
import { Partytown } from '@builder.io/partytown/react';

<Partytown
  forward={['dataLayer.push']}
/>

<script type="text/partytown" src="https://www.googletagmanager.com/gtag/js">
</script>

// Self-host third-party scripts
// Download and serve from your domain
// Better control, faster, more privacy

// Common culprits:
// - Google Analytics / Tag Manager
// - Facebook Pixel
// - Ad networks
// - Live chat widgets
// - Social media embeds

// Best practices:
// ✅ Load async or defer
// ✅ Delay non-critical scripts
// ✅ Use facades for embeds (YouTube, etc.)
// ✅ Monitor impact with Lighthouse
// ✅ Consider self-hosting
// ❌ Don't load everything on page load
************* 🟣🟣🟣 *************

-----------------------------------------

27. What is font optimization?

🟣 Web fonts can slow down rendering.
🟣 Optimize loading and display strategy.
🟣 Use font-display property.
🟣 Subset fonts to include only needed characters.

************* 🟣🟣🟣 *************
// font-display strategies
@font-face {
  font-family: 'MyFont';
  src: url('font.woff2');
  
  /* Display strategies */
  font-display: auto;      /* Browser default */
  font-display: block;     /* Hide text, wait for font (FOIT) */
  font-display: swap;      /* Show fallback, swap when ready (FOUT) */
  font-display: fallback;  /* Brief hide, then fallback */
  font-display: optional;  /* Use only if cached */
}

// ✅ Recommended: swap
@font-face {
  font-family: 'Roboto';
  src: url('roboto.woff2');
  font-display: swap;
}

// Preload critical fonts
<link
  rel="preload"
  href="/fonts/roboto.woff2"
  as="font"
  type="font/woff2"
  crossorigin
>

// Font subsetting - include only needed characters
// Use tools: glyphhanger, fonttools

// Google Fonts optimization
// ❌ Bad - loads all weights and characters
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap">

// ✅ Good - subset and specify display
<link
  href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap&text=HelloWorld"
  rel="stylesheet"
>

// Next.js font optimization
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

// Variable fonts (one file, multiple weights)
@font-face {
  font-family: 'Roboto';
  src: url('roboto-variable.woff2');
  font-weight: 100 900;  /* Supports all weights */
}

// Best practices:
// ✅ Use font-display: swap
// ✅ Preload critical fonts
// ✅ Use WOFF2 format (best compression)
// ✅ Subset fonts
// ✅ Limit number of fonts and weights
// ✅ Consider system fonts for body text
************* 🟣🟣🟣 *************

-----------------------------------------

30. What are web performance best practices?

🟣 Optimize images and use modern formats.
🟣 Minimize and compress assets.
🟣 Use CDN for static assets.
🟣 Implement caching strategies.
🟣 Code split and lazy load.
🟣 Eliminate render-blocking resources.
🟣 Optimize fonts.
🟣 Reduce third-party scripts.
🟣 Monitor performance continuously.
🟣 Set and enforce performance budgets.

************* 🟣🟣🟣 *************
// ✅ Performance Checklist

/* Images */
✅ Use WebP/AVIF format
✅ Set width and height attributes
✅ Lazy load below-fold images
✅ Use responsive images (srcset)
✅ Compress images
✅ Use CDN for images

/* JavaScript */
✅ Minify and compress
✅ Code split by route
✅ Tree shake unused code
✅ Defer non-critical scripts
✅ Use dynamic imports
✅ Analyze bundle size

/* CSS */
✅ Inline critical CSS
✅ Minify and compress
✅ Remove unused CSS
✅ Load non-critical CSS async

/* Fonts */
✅ Use font-display: swap
✅ Preload critical fonts
✅ Use WOFF2 format
✅ Subset fonts

/* Network */
✅ Enable HTTP/2 or HTTP/3
✅ Use CDN
✅ Enable gzip/brotli compression
✅ Implement caching headers
✅ Preconnect to external domains

/* Rendering */
✅ Avoid layout shifts (set dimensions)
✅ Minimize reflows/repaints
✅ Use CSS containment
✅ Optimize animations (use transform)

/* Third-Party */
✅ Load async/defer
✅ Delay non-critical scripts
✅ Use facades for embeds
✅ Self-host when possible

/* Monitoring */
✅ Track Core Web Vitals
✅ Set performance budgets
✅ Monitor in production
✅ Run Lighthouse regularly

// Example optimized page structure
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  
  <!-- Critical CSS inlined -->
  <style>/* critical styles */</style>
  
  <!-- Preconnect to external domains -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  
  <!-- Preload critical resources -->
  <link rel="preload" href="hero.jpg" as="image">
  <link rel="preload" href="font.woff2" as="font" crossorigin>
  
  <!-- Non-critical CSS -->
  <link rel="preload" href="styles.css" as="style"
        onload="this.rel='stylesheet'">
</head>
<body>
  <!-- Content with proper dimensions -->
  <img src="hero.jpg" width="1200" height="600" alt="Hero">
  
  <!-- Lazy load below-fold images -->
  <img src="footer.jpg" loading="lazy" width="800" height="400">
  
  <!-- Scripts deferred -->
  <script src="app.js" defer></script>
  <script src="analytics.js" async></script>
</body>
</html>
************* 🟣🟣🟣 *************

-----------------------------------------