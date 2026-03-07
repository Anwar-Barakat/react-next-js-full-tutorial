# Framer Motion, Service Workers/PWA, and Monorepo Tooling

A comprehensive guide to animating React apps with Framer Motion, building Progressive Web Apps with Service Workers, and managing multi-package projects with monorepo tooling.

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

- Framer Motion is a **production-ready animation library for React**.
- It provides a **declarative API** -- you describe what the animation should look like, not how to execute it frame by frame.
- It is built and maintained by the Framer team, and is the most widely used React animation library.
- It uses **motion components** (`motion.div`, `motion.span`, etc.) as drop-in replacements for HTML elements that can be animated.

**Why use Framer Motion?**

- Simple, readable API compared to raw CSS animations or libraries like GSAP.
- Built-in support for gestures (hover, tap, drag).
- Handles mount/unmount animations with `AnimatePresence`.
- Layout animations with a single `layout` prop.
- Spring physics for natural-feeling motion.
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

- `motion.div` is a regular `<div>` with animation superpowers.
- `initial` -- the starting state when the component mounts.
- `animate` -- the target state to animate toward.
- `transition` -- how the animation behaves (duration, easing, etc.).

---

## 2. Basic Animations

### motion components

- Every HTML and SVG element has a `motion` equivalent: `motion.div`, `motion.button`, `motion.svg`, `motion.path`, etc.
- They accept all the same props as their native counterparts, plus animation props.

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

- Variants let you define **named animation states** and apply them across a component tree.
- They keep animation logic clean and reusable.

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

- The parent passes `initial` and `animate` as variant **names**.
- Children with `variants` automatically inherit those names -- no need to repeat `initial`/`animate` on each child.
- `staggerChildren` creates a cascading animation effect.

---

## 3. Gestures and Interactions

Framer Motion provides built-in gesture detection with zero boilerplate.

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

- `AnimatePresence` enables **exit animations** -- animating components as they are removed from the React tree.
- Without `AnimatePresence`, React immediately removes unmounted components, so there is no chance to animate them out.

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

- Each direct child of `AnimatePresence` **must** have a unique `key` prop.
- When the child is conditionally removed, Framer Motion plays its `exit` animation before removing it from the DOM.

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

- The `layout` prop tells Framer Motion to **automatically animate** any layout change (position, size) of an element.
- Instead of jumping to the new position, the element smoothly transitions there.

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

- `layoutId` lets Framer Motion **animate an element between different components** as if they are the same element.
- This is perfect for tab indicators, card expansions, and hero transitions.

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

- The underline (`layoutId="activeTab"`) smoothly slides from one tab to the next.
- Even though React unmounts and remounts the underline element, Framer Motion treats it as the same element because of the shared `layoutId`.

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

- `Reorder.Group` wraps the list and manages drag-to-reorder logic.
- `Reorder.Item` wraps each draggable item.
- `axis="y"` restricts reordering to the vertical axis (use `"x"` for horizontal).
- Items automatically animate to their new positions when reordered.

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

- `useTransform` maps one motion value range to another.
- It transforms scroll progress into usable animation values.

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

- Listens for changes on a motion value and runs a callback.
- Useful for triggering side effects based on scroll position.

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

- **Animate transforms and opacity** -- these properties are GPU-accelerated and do not trigger layout recalculations. Prefer `x`, `y`, `scale`, `rotate`, `opacity` over `width`, `height`, `top`, `left`.
- **Use `layout` sparingly** -- layout animations are powerful but can be expensive if used on many elements. Apply `layout` only to elements that actually change position or size.
- **Avoid animating expensive properties** -- animating `width`, `height`, `padding`, or `margin` causes the browser to recalculate layout every frame. Use `scale` transforms instead when possible.
- **Use `will-change` carefully** -- Framer Motion handles this internally, so you rarely need to set `will-change` yourself.
- **Use `useReducedMotion`** -- respect users who prefer reduced motion for accessibility.

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

- **Use CSS transitions/animations when:**
  - The animation is simple (hover color change, basic fade).
  - No JavaScript logic is needed.
  - The animation is purely decorative and does not depend on state.
  - Performance is critical and the animation involves only one or two properties.

- **Use Framer Motion when:**
  - You need mount/unmount animations (`AnimatePresence`).
  - The animation depends on React state or props.
  - You need gesture-driven animations (drag, tap, hover with complex behavior).
  - You need layout animations or shared layout transitions.
  - You need spring physics.
  - You need to orchestrate sequences of animations (staggered children, chained animations).

### Organizing animation code

- Define variants in separate objects or files for reuse.
- Create reusable animated wrapper components for common patterns.

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

- A Service Worker is a **JavaScript file that runs in the background**, separate from the web page.
- It acts as a **programmable network proxy** -- it intercepts network requests and decides how to respond (from cache, from network, or a combination).
- It runs on a **separate thread** -- it cannot directly access the DOM, but communicates with pages via `postMessage`.
- It enables **offline support, push notifications, background sync**, and more.

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

### Key facts about Service Workers

- They only work over **HTTPS** (except on `localhost` for development).
- They have a **scope** -- by default, they control all pages at and below their file location.
- They can be **updated** -- when you deploy a new `sw.js`, the browser detects the change and installs the new version.
- The new service worker waits until all tabs using the old one are closed before activating (unless you use `skipWaiting`).
- They **persist** even after the tab is closed -- they wake up when needed.

---

## 9. What is a Progressive Web App (PWA)?

- A PWA is a web application that uses modern web technologies to deliver an **app-like experience**.
- Users can **install** it on their home screen (desktop or mobile) without going through an app store.
- It works **offline** or on poor network connections.
- It can send **push notifications** and run **background tasks**.

### What makes an app a PWA?

A web app is considered a PWA when it has:

- A **Service Worker** -- for offline support and caching.
- A **Web App Manifest** (`manifest.json`) -- metadata that tells the browser how the app should behave when installed.
- **HTTPS** -- served over a secure connection.
- **Responsive design** -- works on all screen sizes.

### manifest.json

- The manifest file provides metadata about your PWA to the browser.
- It controls how the app appears when installed: name, icon, theme color, display mode, etc.

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

**Key manifest fields:**

- `name` -- full name shown on the install prompt and splash screen.
- `short_name` -- shown on the home screen icon.
- `start_url` -- the URL that opens when the user launches the installed app.
- `display` -- controls the app's UI mode:
  - `"standalone"` -- looks like a native app (no browser URL bar).
  - `"fullscreen"` -- takes over the entire screen.
  - `"minimal-ui"` -- has a minimal set of browser UI elements.
  - `"browser"` -- opens in a regular browser tab.
- `theme_color` -- the color of the browser toolbar / status bar.
- `icons` -- icons at different sizes for home screen, splash screen, etc.

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

Service workers give you full control over how network requests are handled. The four most common strategies:

### Cache-First (Cache Falling Back to Network)

- Check the cache first. If the asset is cached, return it. If not, fetch from the network and cache the response.
- **Best for:** static assets that rarely change (images, fonts, CSS, JS bundles).

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

- Try the network first. If the network fails (offline), fall back to the cache.
- **Best for:** content that changes frequently (API data, news feeds, user-generated content).

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

- Return the cached version immediately (fast), then fetch the latest version from the network in the background and update the cache.
- **Best for:** content where speed is more important than freshness (profile pages, settings, non-critical data).

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

- Only serve from the cache. Never hit the network.
- **Best for:** assets that were pre-cached during the install step and will never change for this version of the app.

```js
self.addEventListener("fetch", (event) => {
  event.respondWith(caches.match(event.request));
});
```

### Summary of strategies

- **Cache-first** -- fast, but may serve stale data. Good for static assets.
- **Network-first** -- always tries for fresh data, but slower. Good for dynamic content.
- **Stale-while-revalidate** -- fast like cache-first, but updates in the background. Good for semi-dynamic content.
- **Cache-only** -- fastest, but only works for pre-cached assets.

---

## 11. PWA with Next.js

### next-pwa package

- `next-pwa` is the most popular package for adding PWA support to Next.js applications.
- It automatically generates a service worker using Workbox under the hood.
- It handles caching, precaching, and runtime caching with minimal configuration.

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

**Key configuration options:**

- `dest` -- output directory for the generated service worker (usually `"public"`).
- `register` -- automatically registers the service worker.
- `skipWaiting` -- new service worker activates immediately without waiting.
- `disable` -- disables PWA in development to avoid caching issues.
- `runtimeCaching` -- an array of Workbox routing rules to control how different URLs are cached.

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

- A monorepo is a **single repository that contains multiple projects, packages, or applications**.
- Instead of having one repo per project (polyrepo), everything lives together in one repo.

### Monorepo vs Polyrepo

**Polyrepo (traditional):**

- `repo-1/` -- frontend app
- `repo-2/` -- admin dashboard
- `repo-3/` -- shared UI library
- `repo-4/` -- backend API
- Each has its own `package.json`, CI config, and Git history.
- Sharing code between repos requires publishing to npm.

**Monorepo:**

- One repo, multiple `packages/` or `apps/`:
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
- All code lives together.
- Shared packages are used directly via workspace references -- no publishing needed.

### Why use a monorepo?

- **Code sharing** -- shared UI components, utility functions, and types are imported directly. No need to publish and version them separately.
- **Atomic changes** -- update a shared library and all consuming apps in a single commit and PR.
- **Consistent tooling** -- one ESLint config, one TypeScript config, one CI pipeline for everything.
- **Dependency management** -- shared dependencies are hoisted and deduplicated.
- **Single source of truth** -- no version drift between packages.

### Workspaces

- npm, yarn, and pnpm all support **workspaces** -- the foundation of any monorepo.
- Workspaces let you define multiple packages within a single repo that can reference each other.

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

- **Turborepo** is a high-performance build system for JavaScript and TypeScript monorepos.
- Built by Vercel (the creators of Next.js).
- Its core strength is **intelligent caching** -- it never rebuilds or retests code that has not changed.
- It understands the dependency graph between your packages and runs tasks in the correct order, parallelizing where possible.

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

- This is the **Turborepo configuration file**. It defines **pipelines** -- the tasks Turborepo can run and how they relate to each other.

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

**Key concepts:**

- `dependsOn: ["^build"]` -- the `^` means "run `build` in all **dependency** packages first". If `web` depends on `ui`, then `ui:build` runs before `web:build`.
- `dependsOn: ["build"]` -- without `^`, it means "run `build` in the **same** package first".
- `outputs` -- tells Turborepo which files to cache. On a cache hit, these files are restored from cache instead of being rebuilt.
- `inputs` -- specifies which files to watch for changes. If these files have not changed, the task is skipped (cache hit).
- `cache: false` -- disables caching for this task (used for `dev` servers).
- `persistent: true` -- marks long-running tasks like dev servers that should not block other tasks.

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

- Turborepo creates a **hash** of each task's inputs (source files, dependencies, environment variables).
- If the hash matches a previous run, it **replays the cached output** instead of running the task again.
- Cache hits can save minutes (or hours) on large projects.
- By default, cache is stored locally in `node_modules/.cache/turbo`.
- **Remote caching** (via Vercel) shares the cache across your team and CI -- if a teammate already built the same code, you get the cached result.

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

- **Nx** is a build system and monorepo tool originally created by ex-Googlers at Nrwl.
- Like Turborepo, it provides **caching, task orchestration, and dependency graph analysis**.
- It is more **feature-rich and opinionated** than Turborepo, with built-in code generators, plugins, and an interactive project graph visualization.

### Key features

- **Computation caching** -- same concept as Turborepo: skip work that has already been done.
- **Affected command** -- only runs tasks on projects that were affected by recent code changes.
- **Code generators** -- scaffolding commands to generate components, libraries, and apps.
- **Plugin ecosystem** -- first-party plugins for React, Next.js, Angular, Node, and more.
- **Project graph** -- a visual dependency graph of all projects in the monorepo (run `npx nx graph`).
- **Module boundaries** -- enforces rules about which packages can import from which.

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

- **Turborepo:**
  - Simpler, less configuration.
  - Focuses on task running and caching.
  - Built by Vercel, integrates seamlessly with Vercel deployment.
  - Lighter weight -- easier to adopt in an existing project.
  - No code generators or plugins.

- **Nx:**
  - More features out of the box (generators, plugins, module boundaries, project graph).
  - Steeper learning curve.
  - Better for very large monorepos with many packages.
  - First-party support for Angular (Nx started in the Angular ecosystem).
  - Can feel heavyweight if you only need basic task running.

- **Both:**
  - Support caching (local and remote).
  - Support task pipelines and dependency-aware execution.
  - Work with npm, yarn, and pnpm workspaces.
  - Are open source and free to use.

---

## 15. When to Use a Monorepo

### Benefits

- **Shared code without publishing** -- import shared packages directly without going through npm. Changes to a shared library are immediately available to all consumers.
- **Atomic changes** -- update a shared component and fix all consuming apps in a single PR. No version bumps, no coordinating releases across repos.
- **Consistent tooling** -- one ESLint config, one Prettier config, one TypeScript config. Every project follows the same rules.
- **Simplified CI/CD** -- one pipeline that builds, tests, and deploys everything. Caching makes it fast.
- **Better code review** -- reviewers can see the full impact of a change across all packages in one PR.
- **Easier refactoring** -- rename a function in a shared library and fix all usages in the same commit.

### Drawbacks

- **Repository size** -- the repo grows large over time, which can slow down cloning and operations.
- **Tooling complexity** -- setting up Turborepo or Nx, configuring workspaces, and managing the build pipeline takes effort upfront.
- **CI/CD complexity** -- you need smart filtering (affected/changed detection) to avoid running all tests for every commit.
- **Access control** -- everyone has access to everything. If you need strict code isolation between teams, a monorepo can make that harder.
- **Merge conflicts** -- with many people committing to one repo, merge conflicts are more frequent.
- **Learning curve** -- developers unfamiliar with monorepo tools need to learn new concepts (workspaces, pipelines, caching).

### When a monorepo makes sense

- You have **multiple apps that share code** (web app + admin panel + marketing site all using the same UI library).
- You have a **design system or component library** that multiple projects consume.
- You want to **keep shared TypeScript types** in sync across frontend and backend.
- Your team is **small to medium** and everyone works across multiple packages.
- You want **one CI pipeline** that can build and deploy everything.

### When a monorepo does NOT make sense

- Your projects are **completely unrelated** with no shared code.
- You have **separate teams** that work independently and do not need to coordinate.
- You need **strict access control** -- different teams should not see each other's code.
- Your projects use **different tech stacks** with no shared tooling.
- Your team is unfamiliar with monorepo tooling and the **learning curve** would be too disruptive.

### Making the decision

- Start with a monorepo if you are building multiple related projects from scratch.
- Migrate to a monorepo if you find yourself constantly copying code between repos or publishing internal packages just to share them.
- Stay with polyrepo if your projects are truly independent and sharing code is not a concern.

---
