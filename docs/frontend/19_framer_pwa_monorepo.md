# Framer Motion, Service Workers/PWA, and Monorepo Tooling

Framer Motion animations, PWA with Service Workers, and monorepo tooling.

---

## Table of Contents

1. [What is Framer Motion?](#1-what-is-framer-motion)
2. [Basic Animations](#2-basic-animations)
3. [Gestures and Interactions](#3-gestures-and-interactions)
4. [AnimatePresence](#4-animatepresence)
5. [Layout Animations](#5-layout-animations)
6. [Scroll Animations](#6-scroll-animations)
7. [Framer Motion Best Practices](#7-framer-motion-best-practices)
8. [What is a Service Worker?](#8-what-is-a-service-worker)
9. [What is a Progressive Web App (PWA)?](#9-what-is-a-progressive-web-app-pwa)
10. [Caching Strategies](#10-caching-strategies)
11. [PWA with Next.js](#11-pwa-with-nextjs)
12. [What is a Monorepo?](#12-what-is-a-monorepo)
13. [Turborepo](#13-turborepo)
14. [Nx](#14-nx)
15. [When to Use a Monorepo](#15-when-to-use-a-monorepo)

---

## 1. What is Framer Motion?

- **Production-ready animation library for React** with a declarative API.
- Uses **motion components** (`motion.div`, `motion.span`, etc.) as drop-in replacements for HTML elements.
- Built-in gestures, mount/unmount animations (`AnimatePresence`), layout animations, and spring physics.
- Fully typed with TypeScript.

**Installation:**

```bash
npm install framer-motion
```

**Quick example:**

```tsx
import { motion } from "framer-motion";

function FadeInBox() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-blue-500 p-8 rounded-lg"
    >
      I fade in!
    </motion.div>
  );
}
```

- `initial` -- starting state on mount.
- `animate` -- target state to animate toward.
- `transition` -- how the animation behaves (duration, easing, etc.).

---

## 2. Basic Animations

### motion components

- Every HTML/SVG element has a `motion` equivalent that accepts all native props plus animation props.

```tsx
import { motion } from "framer-motion";

// motion.div replaces <div>
<motion.div animate={{ x: 100 }}>Slides right</motion.div>

// motion.button replaces <button>
<motion.button whileHover={{ scale: 1.1 }}>Hover me</motion.button>

// motion.ul / motion.li for lists
<motion.ul>
  <motion.li animate={{ opacity: 1 }}>Item</motion.li>
</motion.ul>
```

### initial, animate, and exit

- `initial` -- defines the state **before** the animation starts (on mount).
- `animate` -- defines the **target** state the component animates to.
- `exit` -- defines the state the component animates to **when it unmounts** (requires `AnimatePresence`).

```tsx
import { motion } from "framer-motion";

function SlideInCard() {
  return (
    <motion.div
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 200, opacity: 0 }}
      className="card"
    >
      I slide in from the left and slide out to the right.
    </motion.div>
  );
}
```

### Animatable properties

- **Position:** `x`, `y` (translate), `rotate`, `rotateX`, `rotateY`, `rotateZ`
- **Scale:** `scale`, `scaleX`, `scaleY`
- **Opacity:** `opacity`
- **Size:** `width`, `height`
- **Colors:** `backgroundColor`, `color`, `borderColor`
- **Border radius:** `borderRadius`
- **Box shadow:** `boxShadow`

### transition options

- `duration` -- how long the animation takes (in seconds).
- `delay` -- wait before starting the animation.
- `ease` -- easing curve: `"linear"`, `"easeIn"`, `"easeOut"`, `"easeInOut"`, or a custom cubic bezier array.
- `type: "spring"` -- uses spring physics instead of duration-based easing.
- `stiffness`, `damping`, `mass` -- control spring behavior.
- `repeat` -- how many times to repeat (`Infinity` for looping).
- `repeatType` -- `"loop"`, `"reverse"`, or `"mirror"`.

```tsx
import { motion } from "framer-motion";

function SpringBox() {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      className="w-24 h-24 bg-green-500 rounded-xl"
    />
  );
}

function PulsingDot() {
  return (
    <motion.div
      animate={{ scale: [1, 1.2, 1] }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="w-4 h-4 bg-red-500 rounded-full"
    />
  );
}
```

### Variants

- **Named animation states** applied across a component tree for clean, reusable animation logic.

```tsx
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // each child animates 0.1s after the previous
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

function StaggeredList({ items }: { items: string[] }) {
  return (
    <motion.ul
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map((item) => (
        <motion.li key={item} variants={itemVariants}>
          {item}
        </motion.li>
      ))}
    </motion.ul>
  );
}
```

- Children with `variants` automatically inherit parent variant names.
- `staggerChildren` creates a cascading animation effect.

---

## 3. Gestures and Interactions

### whileHover

- Applies animation styles **while the pointer is over** the element.

```tsx
import { motion } from "framer-motion";

function HoverCard() {
  return (
    <motion.div
      whileHover={{
        scale: 1.05,
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
      }}
      transition={{ type: "spring", stiffness: 300 }}
      className="p-6 bg-white rounded-xl cursor-pointer"
    >
      Hover over me
    </motion.div>
  );
}
```

### whileTap

- Applies animation styles **while the element is being pressed**.

```tsx
import { motion } from "framer-motion";

function AnimatedButton() {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg"
    >
      Click me
    </motion.button>
  );
}
```

### whileDrag and drag

- `drag` enables drag behavior on any motion component.
- `whileDrag` applies styles while dragging.
- `dragConstraints` limits how far the element can be dragged.
- `dragElastic` controls how much the element can be dragged outside constraints (0 = none, 1 = full).
- `dragSnapToOrigin` snaps the element back to its original position when released.

```tsx
import { motion } from "framer-motion";
import { useRef } from "react";

function DraggableCard() {
  const constraintsRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={constraintsRef} className="w-96 h-96 bg-gray-100 rounded-xl">
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.2}
        whileDrag={{ scale: 1.1, cursor: "grabbing" }}
        className="w-24 h-24 bg-purple-500 rounded-lg cursor-grab"
      />
    </div>
  );
}
```

- `drag="x"` restricts dragging to the horizontal axis only.
- `drag="y"` restricts dragging to the vertical axis only.
- `drag` (without a value) allows dragging in both directions.

### whileFocus and whileInView

```tsx
import { motion } from "framer-motion";

function FocusInput() {
  return (
    <motion.input
      whileFocus={{ scale: 1.02, borderColor: "#3b82f6" }}
      className="border-2 border-gray-300 p-3 rounded-lg outline-none"
      placeholder="Focus me"
    />
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

- `whileInView` triggers animation when the element enters the viewport.
- `viewport.once` -- if `true`, the animation only plays once and does not reverse when scrolling away.
- `viewport.amount` -- how much of the element must be visible before triggering (0 to 1).

---

## 4. AnimatePresence

- `AnimatePresence` enables **exit animations** for components removed from the React tree (React normally removes them immediately).

### Basic usage

```tsx
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

function ToggleBox() {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div>
      <button onClick={() => setIsVisible(!isVisible)}>Toggle</button>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            key="box"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="w-32 h-32 bg-blue-500 rounded-lg mt-4"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
```

- Each direct child **must** have a unique `key`. On removal, Framer Motion plays the `exit` animation before unmounting.

### mode prop

- `mode="wait"` -- waits for the exiting component to finish animating **before** the entering component starts.
- `mode="sync"` (default) -- entering and exiting components animate simultaneously.
- `mode="popLayout"` -- removes the exiting element from the layout flow immediately.

```tsx
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface Tab {
  id: string;
  label: string;
  content: string;
}

const tabs: Tab[] = [
  { id: "home", label: "Home", content: "Welcome home!" },
  { id: "about", label: "About", content: "About us page." },
  { id: "contact", label: "Contact", content: "Get in touch." },
];

function TabSwitcher() {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div>
      <div className="flex gap-2">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab)}>
            {tab.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="mt-4 p-4"
        >
          {activeTab.content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
```

### Notification list with exit animations

```tsx
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface Notification {
  id: number;
  message: string;
}

function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = () => {
    const newNotif: Notification = {
      id: Date.now(),
      message: `Notification at ${new Date().toLocaleTimeString()}`,
    };
    setNotifications((prev) => [...prev, newNotif]);
  };

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div>
      <button onClick={addNotification}>Add Notification</button>
      <div className="mt-4 space-y-2">
        <AnimatePresence>
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              transition={{ type: "spring", damping: 25 }}
              className="p-3 bg-green-100 rounded-lg flex justify-between"
            >
              <span>{notif.message}</span>
              <button onClick={() => removeNotification(notif.id)}>
                Dismiss
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
```

---

## 5. Layout Animations

- The `layout` prop **automatically animates** any layout change (position, size) with smooth transitions.

### Basic layout animation

```tsx
import { motion } from "framer-motion";
import { useState } from "react";

function ExpandableCard() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      onClick={() => setIsExpanded(!isExpanded)}
      className="bg-white rounded-xl p-4 cursor-pointer"
      style={{
        width: isExpanded ? 400 : 200,
        height: isExpanded ? 300 : 100,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.h2 layout="position">Click to expand</motion.h2>
    </motion.div>
  );
}
```

- `layout` -- animates both position and size changes.
- `layout="position"` -- only animates position changes, not size.
- `layout="size"` -- only animates size changes, not position.

### Shared layout animations with layoutId

- `layoutId` **animates an element between different components** as if they are the same element (tab indicators, card expansions, hero transitions).

```tsx
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const tabs = ["Home", "About", "Contact"];

function AnimatedTabs() {
  const [activeTab, setActiveTab] = useState("Home");

  return (
    <div className="flex gap-4 relative">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className="relative px-4 py-2"
        >
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

- Despite React unmounting/remounting the underline, Framer Motion treats elements with the same `layoutId` as one continuous element.

### Animated list reordering

```tsx
import { AnimatePresence, motion, Reorder } from "framer-motion";
import { useState } from "react";

function ReorderableList() {
  const [items, setItems] = useState(["Item 1", "Item 2", "Item 3", "Item 4"]);

  return (
    <Reorder.Group axis="y" values={items} onReorder={setItems}>
      {items.map((item) => (
        <Reorder.Item
          key={item}
          value={item}
          className="p-4 mb-2 bg-white rounded-lg shadow cursor-grab"
          whileDrag={{
            scale: 1.05,
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
          }}
        >
          {item}
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}
```

- `Reorder.Group` manages drag-to-reorder logic; `Reorder.Item` wraps each draggable item.
- `axis="y"` restricts to vertical (use `"x"` for horizontal). Items auto-animate to new positions.

---

## 6. Scroll Animations

### useScroll

- `useScroll` returns **motion values** that track scroll progress.
- `scrollYProgress` -- a value from 0 to 1 representing how far the page (or an element) has been scrolled.
- `scrollY` -- the raw scroll position in pixels.

```tsx
import { motion, useScroll, useTransform } from "framer-motion";

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      style={{
        scaleX: scrollYProgress,
        transformOrigin: "left",
      }}
      className="fixed top-0 left-0 right-0 h-1 bg-blue-500 z-50"
    />
  );
}
```

### useTransform

- Maps one motion value range to another (e.g., scroll progress to opacity or position).

```tsx
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

function ParallaxSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

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

- `target` -- tracks scroll progress relative to a specific element (instead of the whole page).
- `offset` -- defines when tracking starts and ends:
  - `"start end"` -- starts when the element's top reaches the viewport bottom.
  - `"end start"` -- ends when the element's bottom reaches the viewport top.

### useMotionValueEvent

- Listens for changes on a motion value and runs a callback (e.g., side effects on scroll).

```tsx
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";

function ScrollDirectionDetector() {
  const { scrollY } = useScroll();
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (previous !== undefined && latest > previous) {
      setScrollDirection("down");
    } else {
      setScrollDirection("up");
    }
  });

  return <div>Scrolling: {scrollDirection}</div>;
}
```

### Scroll-triggered reveal animation

```tsx
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

function ScrollRevealSection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "start 0.3"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [80, 0]);

  return (
    <motion.div ref={ref} style={{ opacity, y }}>
      {children}
    </motion.div>
  );
}
```

---

## 7. Framer Motion Best Practices

### Performance tips

- **Prefer transforms and opacity** (`x`, `y`, `scale`, `rotate`, `opacity`) -- GPU-accelerated, no layout recalculation. Avoid animating `width`, `height`, `padding`, `margin`.
- **Use `layout` sparingly** -- only on elements that actually change position or size.
- **`will-change`** -- Framer Motion handles this internally.
- **Use `useReducedMotion`** -- respect accessibility preferences.

```tsx
import { motion, useReducedMotion } from "framer-motion";

function AccessibleAnimation() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
    >
      Accessible content
    </motion.div>
  );
}
```

### When to use CSS vs Framer Motion

- **CSS** -- simple, decorative animations (hover color, basic fade) with no state dependency.
- **Framer Motion** -- mount/unmount animations, state-driven animations, gestures, layout transitions, spring physics, orchestrated sequences.

### Organizing animation code

- Extract variants to separate files; create reusable animated wrapper components.

```tsx
import { motion, type Variants } from "framer-motion";

// animations/fadeIn.ts
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// components/FadeIn.tsx
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
}

function FadeIn({ children, delay = 0 }: FadeInProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
```

---

## 8. What is a Service Worker?

- A **background JavaScript file** that acts as a programmable network proxy, intercepting requests and deciding how to respond.
- Runs on a separate thread (no DOM access; communicates via `postMessage`).
- Enables **offline support, push notifications, and background sync**.

### Service Worker lifecycle

- **Registration** -- your app registers the service worker file with the browser.
- **Install** -- the browser downloads and installs the service worker. This is where you typically **pre-cache** static assets.
- **Activate** -- the service worker takes control. Old caches from previous versions can be cleaned up here.
- **Fetch** -- once active, the service worker intercepts every network request from pages under its scope.

```tsx
// register-sw.ts
export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js");
        console.log("SW registered:", registration.scope);
      } catch (error) {
        console.error("SW registration failed:", error);
      }
    });
  }
}
```

### Basic service worker file

```js
// public/sw.js

const CACHE_NAME = "app-cache-v1";
const STATIC_ASSETS = ["/", "/index.html", "/styles.css", "/app.js"];

// Install event -- pre-cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting(); // activate immediately
});

// Activate event -- clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim(); // take control of all open tabs
});

// Fetch event -- serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    })
  );
});
```

### Key facts

- **HTTPS only** (except `localhost`).
- **Scoped** to their file location and below.
- **Auto-updated** when a new `sw.js` is deployed; new version waits for old tabs to close (unless `skipWaiting` is used).
- **Persist** after tab close -- wake up when needed.

---

## 9. What is a Progressive Web App (PWA)?

A web app that delivers an **app-like experience** -- installable, works offline, supports push notifications. Requires:

- **Service Worker** -- offline support and caching.
- **Web App Manifest** (`manifest.json`) -- install behavior metadata.
- **HTTPS** and **responsive design**.

### manifest.json

- Controls how the app appears when installed (name, icon, theme color, display mode).

```json
{
  "name": "My React App",
  "short_name": "ReactApp",
  "description": "A full-featured React progressive web app",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

- `name` / `short_name` -- install prompt and home screen label.
- `start_url` -- URL opened on launch.
- `display` -- `"standalone"` (no URL bar), `"fullscreen"`, `"minimal-ui"`, or `"browser"`.
- `theme_color` -- toolbar/status bar color.
- `icons` -- icons at different sizes.

### Linking the manifest

```html
<head>
  <link rel="manifest" href="/manifest.json" />
  <meta name="theme-color" content="#3b82f6" />
  <link rel="apple-touch-icon" href="/icons/icon-192.png" />
</head>
```

---

## 10. Caching Strategies

Four common strategies for handling network requests in service workers.

### Cache-First (Cache Falling Back to Network)

- Serve from cache; fall back to network on miss. **Best for** static assets (images, fonts, CSS, JS).

```js
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(event.request).then((response) => {
        const responseClone = response.clone();
        caches.open("dynamic-cache").then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      });
    })
  );
});
```

### Network-First (Network Falling Back to Cache)

- Try network first; fall back to cache on failure. **Best for** frequently changing content (API data, feeds).

```js
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        caches.open("dynamic-cache").then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
```

### Stale-While-Revalidate

- Serve cached version immediately; update cache from network in background. **Best for** semi-dynamic content.

```js
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request).then((response) => {
        const responseClone = response.clone();
        caches.open("dynamic-cache").then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      });
      return cached || networkFetch;
    })
  );
});
```

### Cache-Only

- Serve only from cache. **Best for** pre-cached assets that never change within a version.

```js
self.addEventListener("fetch", (event) => {
  event.respondWith(caches.match(event.request));
});
```

---

## 11. PWA with Next.js

### next-pwa package

- Auto-generates a Workbox-based service worker with caching, precaching, and runtime caching.

**Installation:**

```bash
npm install next-pwa
```

### Configuration

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
      options: {
        cacheName: "google-fonts",
        expiration: {
          maxEntries: 10,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
      },
    },
    {
      urlPattern: /^https:\/\/api\.example\.com\/.*/i,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 24 * 60 * 60, // 1 day
        },
        networkTimeoutSeconds: 10,
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "image-cache",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
        },
      },
    },
  ],
});

const nextConfig = {
  reactStrictMode: true,
};

export default pwaConfig(nextConfig);
```

- `dest` -- service worker output directory (usually `"public"`).
- `register` -- auto-register the service worker.
- `skipWaiting` -- activate new worker immediately.
- `disable` -- disable in development.
- `runtimeCaching` -- Workbox routing rules for URL caching.

### Adding the manifest to Next.js

Create `public/manifest.json`:

```json
{
  "name": "My Next.js PWA",
  "short_name": "NextPWA",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#0070f3",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

Add the manifest link in your layout:

```tsx
// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Next.js PWA",
  description: "A progressive web app built with Next.js",
  manifest: "/manifest.json",
  themeColor: "#0070f3",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NextPWA",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### Online/offline detection in React

```tsx
"use client";

import { useEffect, useState } from "react";

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
}

function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black text-center py-2 z-50">
      You are offline. Some features may be unavailable.
    </div>
  );
}
```

---

## 12. What is a Monorepo?

A **single repository containing multiple projects/packages**. Instead of one repo per project (polyrepo), everything lives together with shared dependencies.

### Monorepo vs Polyrepo

- **Polyrepo**: separate repos per project; sharing code requires publishing to npm.
- **Monorepo**: one repo with `apps/` and `packages/`; shared packages used directly via workspace references.
  ```
  my-monorepo/
    apps/
      web/          # main frontend
      admin/        # admin dashboard
      api/          # backend
    packages/
      ui/           # shared UI components
      utils/        # shared utilities
      config/       # shared ESLint/TS config
    package.json
    turbo.json
  ```

### Why use a monorepo?

- **Code sharing** -- import shared packages directly, no publishing needed.
- **Atomic changes** -- update shared library + all consumers in one PR.
- **Consistent tooling** -- one ESLint/TS/CI config for everything.
- **Dependency deduplication** -- no version drift between packages.

### Workspaces

- npm, yarn, and pnpm all support **workspaces** -- multiple packages within one repo that reference each other.

```json
// root package.json (using pnpm)
{
  "name": "my-monorepo",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint"
  }
}
```

```yaml
# pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
```

- Packages reference each other in their `package.json`:

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

- `workspace:*` tells the package manager to resolve the dependency from the local workspace, not from npm.

---

## 13. Turborepo

- High-performance build system by Vercel for JS/TS monorepos.
- **Intelligent caching** -- never rebuilds unchanged code. Understands dependency graphs and parallelizes tasks.

### Setup

```bash
# Create a new Turborepo project
npx create-turbo@latest my-monorepo

# Or add Turborepo to an existing monorepo
npm install turbo --save-dev
```

A typical project structure:

```
my-monorepo/
  apps/
    web/
      package.json       # name: "@myorg/web"
      next.config.ts
      src/
    admin/
      package.json       # name: "@myorg/admin"
      src/
  packages/
    ui/
      package.json       # name: "@myorg/ui"
      src/
        Button.tsx
        index.ts
    utils/
      package.json       # name: "@myorg/utils"
      src/
        formatDate.ts
        index.ts
    tsconfig/
      base.json
      nextjs.json
      react-library.json
  turbo.json
  package.json
  pnpm-workspace.yaml
```

### turbo.json

- Defines **pipelines** -- tasks and their relationships.

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["build"],
      "inputs": ["src/**/*.tsx", "src/**/*.ts", "test/**/*.ts"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "type-check": {
      "dependsOn": ["^build"]
    }
  }
}
```

- `dependsOn: ["^build"]` -- `^` = run `build` in dependency packages first.
- `dependsOn: ["build"]` -- without `^` = run `build` in the same package first.
- `outputs` -- files to cache/restore on cache hit.
- `inputs` -- files to watch; unchanged = cache hit.
- `cache: false` -- disable caching (e.g., `dev` servers).
- `persistent: true` -- long-running tasks that should not block others.

### Running tasks

```bash
# Run build in all packages
turbo run build

# Run dev in all packages
turbo run dev

# Run build only in the web app (and its dependencies)
turbo run build --filter=@myorg/web

# Run lint in all packages except admin
turbo run lint --filter=!@myorg/admin

# Run test only in packages that changed since main
turbo run test --filter=...[main]
```

### Caching

- Hashes task inputs; replays cached output on match. Local cache in `node_modules/.cache/turbo`.
- **Remote caching** (via Vercel) shares cache across team and CI.

```bash
# Enable remote caching with Vercel
npx turbo login
npx turbo link
```

### Shared package example

```tsx
// packages/ui/src/Button.tsx
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseStyles = "font-medium rounded-lg transition-colors";

  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

```tsx
// packages/ui/src/index.ts
export { Button } from "./Button";
```

```tsx
// apps/web/src/app/page.tsx
import { Button } from "@myorg/ui";

export default function Home() {
  return (
    <div className="p-8">
      <h1>Welcome</h1>
      <Button variant="primary" size="lg">
        Get Started
      </Button>
      <Button variant="secondary">Learn More</Button>
    </div>
  );
}
```

---

## 14. Nx

- Build system and monorepo tool by Nrwl. More **feature-rich and opinionated** than Turborepo, with caching, code generators, plugins, and project graph visualization.
- **Affected command** -- only runs tasks on projects changed by recent commits.
- **Code generators** -- scaffold components, libraries, and apps.
- **Plugin ecosystem** -- first-party support for React, Next.js, Angular, Node.
- **Project graph** -- visual dependency graph (`npx nx graph`).
- **Module boundaries** -- enforce import rules between packages.

### Basic setup

```bash
# Create a new Nx workspace
npx create-nx-workspace@latest my-workspace

# Add Nx to an existing monorepo
npx nx@latest init
```

### nx.json

```json
{
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["{projectRoot}/dist"],
      "cache": true
    },
    "test": {
      "cache": true
    },
    "lint": {
      "cache": true
    }
  },
  "defaultBase": "main"
}
```

### Running tasks

```bash
# Run build for a specific project
npx nx build web

# Run build for all projects
npx nx run-many --target=build

# Run tests only for affected projects (changed since main)
npx nx affected --target=test

# Visualize the project graph
npx nx graph
```

### Nx vs Turborepo

- **Turborepo** -- simpler, lighter, Vercel-integrated. No generators/plugins. Easy to adopt.
- **Nx** -- more features (generators, plugins, module boundaries, project graph). Steeper curve. Better for very large monorepos.
- **Both** -- caching (local + remote), task pipelines, npm/yarn/pnpm workspaces, open source.

---

## 15. When to Use a Monorepo

### Drawbacks

- **Repo size** grows large; slows cloning.
- **Tooling/CI complexity** -- upfront setup effort; need affected/changed detection.
- **Access control** -- everyone sees everything; harder to isolate teams.
- **Merge conflicts** more frequent with many contributors.

### Good fit

- Multiple apps sharing code, design systems, or TypeScript types.
- Small-to-medium teams working across packages.

### Poor fit

- Unrelated projects with no shared code.
- Separate independent teams or strict access control requirements.
- Different tech stacks with no shared tooling.

---
