# Framer Motion, Service Workers/PWA, and Monorepo Tooling

---

## 1. Framer Motion

Production-ready animation library for React with declarative API, spring physics, and TypeScript support.

```bash
npm install framer-motion
```

### Basic Animations

- `initial` — starting state on mount
- `animate` — target state to animate toward
- `exit` — state when unmounting (requires `AnimatePresence`)
- `transition` — duration, easing, spring settings

```tsx
import { motion } from "framer-motion";

function SlideInCard() {
  return (
    <motion.div
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 200, opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      I slide in from the left.
    </motion.div>
  );
}
```

### Variants

Named animation states for reusable, coordinated animations.

```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

function StaggeredList({ items }: { items: string[] }) {
  return (
    <motion.ul variants={containerVariants} initial="hidden" animate="visible">
      {items.map((item) => (
        <motion.li key={item} variants={itemVariants}>{item}</motion.li>
      ))}
    </motion.ul>
  );
}
```

### Gestures and Interactions

```tsx
function AnimatedButton() {
  return (
    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      Click me
    </motion.button>
  );
}

function RevealOnScroll() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.6 }}
    >
      I appear when scrolled into view
    </motion.div>
  );
}
```

### AnimatePresence

Enables exit animations for components removed from the React tree.

```tsx
function ToggleBox() {
  const [isVisible, setIsVisible] = useState(true);
  return (
    <div>
      <button onClick={() => setIsVisible(!isVisible)}>Toggle</button>
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key="box"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
```

- Each direct child must have a unique `key`
- `mode="wait"` — exit finishes before enter starts

### Layout Animations

`layout` prop automatically animates layout changes. `layoutId` animates an element across different component instances.

```tsx
function AnimatedTabs() {
  const [activeTab, setActiveTab] = useState("Home");
  return (
    <div className="flex gap-4">
      {["Home", "About", "Contact"].map((tab) => (
        <button key={tab} onClick={() => setActiveTab(tab)} className="relative px-4 py-2">
          {tab}
          {activeTab === tab && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
```

### Scroll Animations

```tsx
import { motion, useScroll, useTransform } from "framer-motion";

function ParallaxSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]);

  return (
    <div ref={ref} className="h-screen flex items-center justify-center">
      <motion.div style={{ y, opacity }} className="text-4xl font-bold">
        Parallax Text
      </motion.div>
    </div>
  );
}
```

### Best Practices

- Prefer `x`, `y`, `scale`, `rotate`, `opacity` (GPU-accelerated); avoid `width`, `height`, `padding`, `margin`
- Respect accessibility with `useReducedMotion()`
- Use CSS for simple decorative animations; Framer Motion for state-driven, gesture, or mount/unmount animations

---

## 2. Service Workers and PWA

### Service Worker

A background JavaScript file acting as a programmable network proxy. Enables offline support, push notifications. Requires HTTPS (except localhost).

**Lifecycle:** Register → Install (pre-cache assets) → Activate (clean old caches) → Fetch (intercept requests)

```js
// public/sw.js
const CACHE_NAME = "app-cache-v1";
const STATIC_ASSETS = ["/", "/index.html", "/styles.css", "/app.js"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});
```

```ts
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("/sw.js"));
}
```

### Caching Strategies

| Strategy | Behavior | Best for |
|---|---|---|
| **Cache-First** | Serve cache; fetch on miss | Static assets (images, fonts, CSS/JS) |
| **Network-First** | Fetch first; fall back to cache | Frequently changing data (APIs) |
| **Stale-While-Revalidate** | Serve cache; update in background | Semi-dynamic content |

### PWA Setup

Requires: Service Worker, `manifest.json`, HTTPS, responsive design.

```json
{
  "name": "My React App",
  "short_name": "ReactApp",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#3b82f6",
  "background_color": "#ffffff",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
```

```html
<head>
  <link rel="manifest" href="/manifest.json" />
  <meta name="theme-color" content="#3b82f6" />
  <link rel="apple-touch-icon" href="/icons/icon-192.png" />
</head>
```

### PWA with Next.js (next-pwa)

```bash
npm install next-pwa
```

```ts
// next.config.ts
import withPWA from "next-pwa";

const pwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: "CacheFirst",
      options: { cacheName: "google-fonts", expiration: { maxEntries: 10, maxAgeSeconds: 365 * 24 * 60 * 60 } },
    },
    {
      urlPattern: /^https:\/\/api\.example\.com\/.*/i,
      handler: "NetworkFirst",
      options: { cacheName: "api-cache", expiration: { maxEntries: 50, maxAgeSeconds: 86400 }, networkTimeoutSeconds: 10 },
    },
  ],
});

export default pwaConfig({ reactStrictMode: true });
```

---

## 3. Monorepo Tooling

A single repository containing multiple projects/packages (`apps/` and `packages/`). Shared packages are used directly via workspace references.

**Benefits:** atomic cross-package changes, shared tooling, dependency deduplication.
**Drawbacks:** larger repo, CI complexity, more merge conflicts.

### Workspaces

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
```

```json
// apps/web/package.json
{
  "name": "@myorg/web",
  "dependencies": {
    "@myorg/ui": "workspace:*",
    "@myorg/utils": "workspace:*"
  }
}
```

### Turborepo

High-performance build system by Vercel. Caches task outputs by hashing inputs — never rebuilds unchanged code.

```bash
npx create-turbo@latest my-monorepo
```

```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": { "dependsOn": ["^build"], "outputs": [".next/**", "dist/**"] },
    "lint": { "dependsOn": ["^build"] },
    "test": { "dependsOn": ["build"], "inputs": ["src/**/*.tsx", "src/**/*.ts"] },
    "dev": { "cache": false, "persistent": true }
  }
}
```

- `"^build"` — run `build` in dependency packages first
- `outputs` — files to cache and restore on a cache hit
- `cache: false` — disable caching (e.g. dev servers)

```bash
turbo run build                         # all packages
turbo run build --filter=@myorg/web    # specific package + its dependencies
turbo run test --filter=...[main]      # only packages changed since main
```

### Nx

More feature-rich than Turborepo. Adds code generators, plugin ecosystem, visual project graph, and module boundary enforcement.

```bash
npx create-nx-workspace@latest my-workspace
```

```bash
npx nx build web                # build specific project
npx nx run-many --target=build  # build all projects
npx nx affected --target=test   # test only projects changed since main
npx nx graph                    # visualize the dependency graph
```

**Turborepo vs Nx:**
- Turborepo — simpler, lighter, Vercel-integrated, easy to adopt
- Nx — generators, plugins, module boundaries; better for very large monorepos
- Both — local and remote caching, task pipelines, workspace support
