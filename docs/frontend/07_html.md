# HTML & Web Security Guide

Modern HTML, bundlers, and web security fundamentals.

---

## Table of Contents

### Bundlers & Build Tools
1. [What is a Bundler?](#1-what-is-a-bundler)
2. [What is Webpack?](#2-what-is-webpack)
3. [What is Vite?](#3-what-is-vite)
4. [Webpack vs Vite](#4-webpack-vs-vite)
5. [Code Splitting](#5-code-splitting)
6. [Build Optimization](#6-build-optimization)
7. [Package Managers: npm vs npx vs yarn vs pnpm vs bun](#7-package-managers-npm-vs-npx-vs-yarn-vs-pnpm-vs-bun)
8. [Linters and Formatters: ESLint, Prettier, and Biome](#8-linters-and-formatters-eslint-prettier-and-biome)

### HTML Fundamentals
9. [Semantic HTML](#9-semantic-html)
10. [HTML5 APIs](#10-html5-apis)
11. [Data Attributes](#11-data-attributes)
12. [Script Loading Strategies](#12-script-loading-strategies)

### Web Security
13. [XSS (Cross-Site Scripting)](#13-xss-cross-site-scripting)
14. [CSRF (Cross-Site Request Forgery)](#14-csrf-cross-site-request-forgery)
15. [CORS (Cross-Origin Resource Sharing)](#15-cors-cross-origin-resource-sharing)
16. [Content Security Policy (CSP)](#16-content-security-policy-csp)
17. [Secure Cookies](#17-secure-cookies)
18. [Input Validation and Sanitization](#18-input-validation-and-sanitization)

---

## Bundlers & Build Tools

## 1. What is a Bundler?

A tool that combines multiple files (JS, CSS, images) into optimized bundles for browsers.

- Resolves imports and dependencies between files
- Combines them into fewer optimized files for faster page loads
- Handles asset processing (SASS → CSS, TypeScript → JavaScript)
- Minifies and optimizes code

---

## 2. What is Webpack?

**Webpack** is a powerful, configurable bundler - the industry standard for years. Complex configuration but excellent production optimization.

**Core concepts:**

- **Loaders** — Teach Webpack how to read files (babel-loader, css-loader, file-loader)
- **Plugins** — Add extra powers (optimize, clean, generate files)
- **Entry** — Starting point of your application
- **Output** — Where to put bundled files

---

## 3. What is Vite?

**Vite** is a modern, fast build tool designed to fix Webpack's slowness. Zero configuration for most projects.

- Uses native ES modules in development (no bundling)
- Lightning-fast HMR via esbuild (written in Go)
- Only transforms files the browser requests
- Instant app startup

---

## 4. Webpack vs Vite

- **Approach** — Webpack: "Bundle first, then run"; Vite: "Run first, bundle later"
- **Dev Server Start** — Webpack: Slow (bundles everything); Vite: Instant (no bundling)
- **HMR Speed** — Webpack: Slow; Vite: Instant
- **Configuration** — Webpack: Complex; Vite: Simple/zero config
- **Learning Curve** — Webpack: Steep; Vite: Easy
- **Production Build** — Webpack: Excellent; Vite: Excellent (uses Rollup)
- **Best For** — Webpack: Complex setups; Vite: Modern apps

---

## 5. Code Splitting

Breaking code into smaller chunks loaded on demand, improving initial load time and caching.

**Manual code splitting:**

```javascript
// Dynamic import - loads chunk on demand
button.addEventListener('click', async () => {
  const module = await import('./heavy-module.js');
  module.doSomething();
});
```

**React lazy loading:**

```javascript
import { lazy, Suspense } from 'react';

// Lazy load component
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}
```

**Route-based splitting:**

```javascript
// Each route is a separate chunk
const routes = [
  {
    path: '/dashboard',
    component: lazy(() => import('./Dashboard'))
  },
  {
    path: '/profile',
    component: lazy(() => import('./Profile'))
  }
];
```

---

## 6. Build Optimization

**Common optimization techniques:**

### Minification
Remove whitespace, shorten variable names, remove comments.

### Tree Shaking
Remove unused code from bundles.

### Compression
Gzip or Brotli compress files.

### Code Splitting
Load code on demand.

### Lazy Loading
Defer loading of non-critical resources.

### Caching
Use content hashes in filenames for better caching.

**Vite production optimization:**

```javascript
// vite.config.js
export default defineConfig({
  build: {
    // Minify
    minify: 'terser',

    // Target modern browsers
    target: 'es2015',

    // Source maps
    sourcemap: false,

    // Chunk size warnings
    chunkSizeWarningLimit: 500,

    // Rollup options
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'utils': ['lodash', 'axios']
        }
      }
    }
  }
});
```

---

## 7. Package Managers: npm vs npx vs yarn vs pnpm vs bun

### npm (Node Package Manager)

**The default** package manager that comes with Node.js.

```bash
# Install all dependencies from package.json
npm install

# Add a package as dependency
npm install axios

# Add a package as dev dependency
npm install --save-dev eslint

# Install a package globally
npm install -g typescript

# Run a script defined in package.json
npm run dev

# Remove a package
npm uninstall axios
```

- Comes pre-installed with Node.js
- Uses `package-lock.json` for deterministic installs
- Largest registry of open-source packages
- Sequential installation (slower than alternatives)

### npx (Node Package Execute)

**npx is NOT a package manager** - it's a package runner that comes with npm (v5.2+).

**Purpose:** Run packages without installing them globally.

```bash
# Without npx - must install globally first
npm install -g create-react-app
create-react-app my-app

# With npx - runs directly without global install
npx create-react-app my-app

# Run a specific version
npx typescript@5.0 --version

# Run a locally installed package
npx eslint .

# Run one-time commands
npx prisma init
npx shadcn-ui@latest add button
```

### yarn

**Created by Facebook** as a faster, more reliable alternative to npm.

```bash
# Install all dependencies
yarn

# Add a package
yarn add axios

# Add a dev dependency
yarn add --dev eslint

# Add a global package
yarn global add typescript

# Run a script
yarn dev

# Remove a package
yarn remove axios
```

- Uses `yarn.lock` for deterministic installs
- Parallel installation (faster than npm)
- Workspaces support for monorepos
- Plug'n'Play (PnP) mode eliminates `node_modules`
- Offline caching of downloaded packages

### pnpm (Performant npm)

**The most disk-efficient** package manager.

```bash
# Install all dependencies
pnpm install

# Add a package
pnpm add axios

# Add a dev dependency
pnpm add -D eslint

# Add a global package
pnpm add -g typescript

# Run a script
pnpm dev

# Remove a package
pnpm remove axios
```

- Uses a global content-addressable store (packages stored once on disk)
- Symlinks packages instead of copying them
- Strict dependency resolution (prevents phantom dependencies)
- Built-in monorepo support with workspaces

**How pnpm saves disk space:**

```
# npm/yarn: each project copies packages
project-a/node_modules/lodash/  (1.5MB)
project-b/node_modules/lodash/  (1.5MB)  ← duplicate
project-c/node_modules/lodash/  (1.5MB)  ← duplicate

# pnpm: stores once, symlinks everywhere
~/.pnpm-store/lodash/           (1.5MB)  ← single copy
project-a/node_modules/lodash → symlink
project-b/node_modules/lodash → symlink
project-c/node_modules/lodash → symlink
```

### bun

**An all-in-one** JavaScript runtime and toolkit (not just a package manager).

```bash
# Install all dependencies
bun install

# Add a package
bun add axios

# Add a dev dependency
bun add --dev eslint

# Add a global package
bun add -g typescript

# Run a script
bun run dev

# Remove a package
bun remove axios

# Run a JavaScript/TypeScript file directly
bun run index.ts
```

- Written in Zig (extremely fast)
- Runtime + package manager + bundler + test runner in one tool
- Native TypeScript and JSX support (no transpiler needed)
- Compatible with npm packages and `node_modules`
- Uses `bun.lockb` (binary lockfile for speed)

### Comparison

- **Install speed** — npm: Slow; yarn: Fast; pnpm: Faster; bun: Fastest
- **Disk usage** — npm: High; yarn: High; pnpm: Low; bun: Medium
- **Lockfile** — npm: `package-lock.json`; yarn: `yarn.lock`; pnpm: `pnpm-lock.yaml`; bun: `bun.lockb`
- **Monorepo support** — npm: Basic (workspaces); yarn: Good; pnpm: Excellent; bun: Good
- **Comes with** — npm: Node.js; yarn: Separate install; pnpm: Separate install; bun: Separate install
- **Phantom deps** — npm: Allowed; yarn: Allowed; pnpm: Blocked; bun: Allowed
- **Offline mode** — npm: Limited; yarn: Yes; pnpm: Yes; bun: Yes
- **Also a runtime** — npm: No; yarn: No; pnpm: No; bun: Yes

### npm vs npx - Key Difference

```bash
# npm INSTALLS packages
npm install prettier          # Adds to project
npm install -g prettier       # Adds globally

# npx RUNS packages (without permanent install)
npx prettier --write .        # Runs once, no install needed
```

**Simple rule:**
- **npm** = "I want this package in my project" (install)
- **npx** = "I want to run this command once" (execute)

---

## 8. Linters and Formatters: ESLint, Prettier, and Biome

- **Linter** — Finds bugs and bad patterns (unused variables, missing imports, wrong logic)
- **Formatter** — Fixes code style automatically (indentation, quotes, semicolons, line length)

### ESLint (Linter)

The most popular JS/TS linter. Highly configurable with plugins (React, TypeScript, Next.js, etc.).

```bash
npm install -D eslint
npx eslint --init
```

```javascript
// eslint.config.js
export default [
  {
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'prefer-const': 'error',
    },
  },
];
```

### Prettier (Formatter)

The most popular code formatter. Supports JS, TS, CSS, HTML, JSON, Markdown, and more.

```bash
npm install -D prettier
npx prettier --write .
```

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80
}
```

### Biome (Linter + Formatter in One)

Replaces both ESLint and Prettier. Written in Rust (10-100x faster). One tool, simpler configuration.

```bash
npm install -D --save-exact @biomejs/biome
npx @biomejs/biome init
```

```json
// biome.json
{
  "formatter": {
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 80
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  }
}
```

```bash
# Lint and format in one command
npx @biomejs/biome check --write .
```

### ESLint + Prettier vs Biome

**ESLint + Prettier (traditional):**
- Two separate tools — linter and formatter.
- Large ecosystem of plugins (React, TypeScript, Next.js, Tailwind, etc.).
- Slower — runs JavaScript to analyze code.
- Requires configuration to avoid conflicts between ESLint and Prettier.
- The industry standard for years.

**Biome (modern):**
- One tool — linter and formatter combined.
- Written in Rust — much faster.
- Fewer plugins available (still growing).
- Zero configuration to start.
- No conflicts — formatting and linting are unified.
- Growing rapidly in adoption.

---

## HTML Fundamentals

## 9. Semantic HTML

Using HTML tags that describe content purpose, not just appearance. Improves accessibility, SEO, and code readability.

**Non-semantic vs Semantic:**

```html
<!-- ❌ Non-semantic HTML -->
<div class="header">
  <div class="nav">
    <div class="link">Home</div>
  </div>
</div>
<div class="content">
  <div class="article">
    <div class="title">Title</div>
    <div class="text">Content</div>
  </div>
</div>

<!-- ✅ Semantic HTML -->
<header>
  <nav>
    <a href="/">Home</a>
  </nav>
</header>
<main>
  <article>
    <h1>Title</h1>
    <p>Content</p>
  </article>
</main>
```

**Semantic tags:**

```html
<header>     <!-- Page or section header -->
<nav>        <!-- Navigation links -->
<main>       <!-- Main content -->
<article>    <!-- Self-contained content -->
<section>    <!-- Thematic grouping -->
<aside>      <!-- Sidebar content -->
<footer>     <!-- Page or section footer -->
<figure>     <!-- Image with caption -->
<figcaption> <!-- Caption for figure -->
<time>       <!-- Date/time -->
<mark>       <!-- Highlighted text -->
<details>    <!-- Expandable content -->
<summary>    <!-- Summary for details -->
```

---

## 10. HTML5 APIs

Browser APIs accessible via JavaScript for building advanced web applications.

### Geolocation API
Get the user's location.

```javascript
navigator.geolocation.getCurrentPosition(
  (position) => {
    console.log('Latitude:', position.coords.latitude);
    console.log('Longitude:', position.coords.longitude);
  },
  (error) => {
    console.error('Error:', error.message);
  }
);
```

**Use cases:** Maps, delivery apps, nearby places

### Local Storage
Save data inside the browser - persists after refresh.

```javascript
// Save data
localStorage.setItem('theme', 'dark');
localStorage.setItem('user', JSON.stringify({ name: 'John' }));

// Read data
const theme = localStorage.getItem('theme');
const user = JSON.parse(localStorage.getItem('user'));

// Remove data
localStorage.removeItem('theme');

// Clear all
localStorage.clear();
```

**Use cases:** Themes, login info, settings, preferences

### Session Storage
Similar to localStorage but clears when tab closes.

```javascript
sessionStorage.setItem('tempData', 'value');
const data = sessionStorage.getItem('tempData');
```

### Canvas API
Draw shapes, images, and animations.

```javascript
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// Draw rectangle
ctx.fillStyle = 'blue';
ctx.fillRect(10, 10, 100, 50);

// Draw circle
ctx.beginPath();
ctx.arc(75, 75, 50, 0, Math.PI * 2);
ctx.fill();
```

**Use cases:** Games, charts, image manipulation

### Fetch API
Get data from servers (modern replacement for XMLHttpRequest).

```javascript
fetch('https://api.example.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

// Async/await
async function getData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

---

## 11. Data Attributes

Custom attributes (prefixed with `data-`) to store extra information on HTML elements. Accessible via the `dataset` property.

**Usage:**

```html
<!-- HTML with data attributes -->
<button
  data-user-id="123"
  data-role="admin"
  data-action="delete"
>
  Delete User
</button>

<div
  data-product-id="456"
  data-price="99.99"
  data-category="electronics"
>
  Product
</div>
```

**JavaScript access:**

```javascript
const button = document.querySelector('button');

// Access via dataset
console.log(button.dataset.userId);    // "123"
console.log(button.dataset.role);      // "admin"
console.log(button.dataset.action);    // "delete"

// Set data attribute
button.dataset.status = 'active';
```

**CSS access:**

```css
[data-role="admin"] {
  background: gold;
}

[data-status="active"] {
  border: 2px solid green;
}
```

**React example:**

```javascript
function UserCard({ user }) {
  return (
    <div
      data-user-id={user.id}
      data-role={user.role}
      onClick={(e) => {
        const id = e.currentTarget.dataset.userId;
        console.log('User ID:', id);
      }}
    >
      {user.name}
    </div>
  );
}
```

---

## 12. Script Loading Strategies

Controls how the browser handles `<script>` tags relative to HTML parsing.

### Regular `<script>` - STOP and wait

```html
<script src="script.js"></script>
```

**Flow:**
1. Browser stops reading HTML
2. Downloads JavaScript
3. Runs JavaScript
4. Then continues HTML

**Result:** Page loads slower.

### `<script defer>` - Wait until HTML is ready

```html
<script defer src="script.js"></script>
```

**Flow:**
1. Browser keeps reading HTML
2. JavaScript downloads in background
3. Runs after HTML is finished
4. Scripts run in order

**Result:** Fast page + safe DOM access.

**Best for:** Scripts that need the full DOM.

### `<script async>` - Run whenever it's ready

```html
<script async src="script.js"></script>
```

**Flow:**
1. Browser keeps reading HTML
2. JavaScript downloads in background
3. Runs as soon as it finishes downloading
4. Order is not guaranteed

**Result:** Unpredictable timing.

**Best for:** Independent scripts (analytics, ads).

**Comparison:**

- **HTML parsing** — Normal: Blocks; defer: Continues; async: Continues
- **When executes** — Normal: Immediately; defer: After HTML; async: When ready
- **Order guaranteed** — Normal: Yes; defer: Yes; async: No
- **Best for** — Normal: Inline critical code; defer: Most scripts; async: Analytics, ads

---

## Web Security

## 13. XSS (Cross-Site Scripting)

Injects malicious scripts into web pages that run in victim's browser. Can steal cookies/sessions, personal data, redirect users, or deface websites.

**Three types:**

### 1. Stored XSS
Script saved in database, affects everyone who views it.

**Example:**
User posts comment: `<script>steal()</script>` → Everyone who views the comment gets attacked.

### 2. Reflected XSS
Script in URL, executes when URL is visited.

**Example:**
URL: `/search?q=<script>steal()</script>`

### 3. DOM-based XSS
Client-side only, manipulates DOM.

**Vulnerable code:**

```javascript
// ❌ Vulnerable - user input directly in HTML
const username = getUserInput();
document.getElementById('greeting').innerHTML = `Hello ${username}`;

// Attack: username = "<script>alert('XSS')</script>"
// Result: Script executes
```

**Prevention:**

```javascript
// ✅ Fix: Escape user input
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

const username = getUserInput();
document.getElementById('greeting').innerHTML = `Hello ${escapeHtml(username)}`;
```

**React (automatic escaping):**

```javascript
// ✅ React escapes by default
function Greeting({ username }) {
  return <div>Hello {username}</div>;
}

// ❌ Still vulnerable if you use dangerouslySetInnerHTML
function Greeting({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
  // Don't use unless you trust the HTML
}
```

**Sanitize HTML with DOMPurify:**

```javascript
import DOMPurify from 'dompurify';

function SafeHtml({ html }) {
  const clean = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}
```

**Prevention checklist:**
- ✅ Escape all user input
- ✅ Use `textContent` instead of `innerHTML`
- ✅ Sanitize HTML with DOMPurify
- ✅ Set Content-Security-Policy header
- ✅ Use HTTPOnly cookies

---

## 14. CSRF (Cross-Site Request Forgery)

Tricks users into performing unwanted actions while authenticated. Exploits the user's session -- the attacker cannot see the response, only trigger the action.

**Attack scenario:**

```html
<!-- User visits evil.com while logged into bank.com -->
<!-- evil.com contains: -->
<form action="https://bank.com/transfer" method="POST">
  <input name="to" value="attacker">
  <input name="amount" value="1000">
</form>
<script>document.forms[0].submit();</script>

<!-- User's browser sends authenticated request to bank.com -->
<!-- Money transferred without user knowing -->
```

**Prevention Method 1: CSRF Token**

```html
<!-- Form includes token -->
<form action="/transfer" method="POST">
  <input type="hidden" name="csrf_token" value="abc123...">
  <input name="to" value="john">
  <input name="amount" value="100">
  <button type="submit">Transfer</button>
</form>
```

```javascript
// Server validates token
app.post('/transfer', (req, res) => {
  if (req.body.csrf_token !== req.session.csrfToken) {
    return res.status(403).send('Invalid CSRF token');
  }
  // Process transfer
});
```

**Prevention Method 2: SameSite Cookies**

```javascript
res.cookie('session', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict' // or 'lax'
});
```

**SameSite values:**
- **strict** - Cookie not sent with cross-site requests
- **lax** - Cookie sent with top-level navigation
- **none** - Cookie sent with all requests (requires `secure`)

**Prevention Method 3: Check Origin/Referer**

```javascript
app.post('/transfer', (req, res) => {
  const origin = req.headers.origin;
  if (origin !== 'https://yoursite.com') {
    return res.status(403).send('Invalid origin');
  }
  // Process transfer
});
```

**Best practices:**
- ✅ Use CSRF tokens for state-changing operations
- ✅ Use SameSite cookies
- ✅ Verify Origin/Referer headers
- ✅ Require re-authentication for sensitive actions
- ✅ Use POST for state changes (not GET)

---

## 15. CORS (Cross-Origin Resource Sharing)

A browser security feature controlling which domains can access your API. Browsers block cross-origin requests by default (same-origin policy).

```javascript
// Page at https://example.com
// Cannot fetch from https://api.other.com

// ❌ CORS error
fetch('https://api.other.com/data')
  .then(res => res.json())
  .catch(err => console.error('CORS error'));
```

**Server must add CORS headers:**

```javascript
// Express.js
const cors = require('cors');

// Allow all origins
app.use(cors());

// Allow specific origin
app.use(cors({
  origin: 'https://example.com'
}));

// Allow multiple origins
app.use(cors({
  origin: ['https://example.com', 'https://app.example.com']
}));
```

**Manual CORS headers:**

```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://example.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
```

**Preflight request:**

Browser sends OPTIONS request first for certain requests.

```
Browser:
OPTIONS /api/data
Origin: https://example.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type

Server:
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: POST
Access-Control-Allow-Headers: Content-Type

Then actual request:
POST /api/data
Origin: https://example.com
```

**With credentials (cookies):**

```javascript
// Client
fetch('https://api.example.com/data', {
  credentials: 'include'
});

// Server must allow
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: https://specific-domain.com
// (cannot use * with credentials)
```

---

## 16. Content Security Policy (CSP)

A security header that tells the browser what content sources are allowed to load, preventing XSS attacks. Can be set via HTTP header (preferred) or meta tag.

**CSP header:**

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com; style-src 'self' 'unsafe-inline'
```

**Meta tag:**

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self' https://cdn.example.com"
>
```

**Common directives:**

```http
# Default fallback for all resource types
default-src 'self'

# JavaScript sources
script-src 'self' https://cdn.example.com

# CSS sources
style-src 'self' 'unsafe-inline'

# Image sources
img-src 'self' data: https://images.example.com

# Font sources
font-src 'self' https://fonts.googleapis.com

# AJAX, WebSocket, fetch sources
connect-src 'self' https://api.example.com
```

**CSP values:**

```
'self'           - Same origin only
'none'           - Block all
'unsafe-inline'  - Allow inline scripts/styles (not recommended)
'unsafe-eval'    - Allow eval() (not recommended)
https:           - Allow all HTTPS sources
https://example.com - Specific domain
```

**Example policy:**

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';
```

**Report violations:**

```http
Content-Security-Policy-Report-Only:
  default-src 'self';
  report-uri /csp-report
```

Browser sends violations to `/csp-report` for monitoring.

---

## 17. Secure Cookies

Cookie attributes that protect stored session/login data.

### HttpOnly
JavaScript cannot read the cookie - protects against XSS.

```javascript
res.cookie('session', token, {
  httpOnly: true
});
```

### Secure
Cookie sent only over HTTPS - protects on public Wi-Fi.

```javascript
res.cookie('session', token, {
  secure: true
});
```

### SameSite
Controls cross-site sending - protects against CSRF.

```javascript
res.cookie('session', token, {
  sameSite: 'strict'  // Never sent cross-site
  // sameSite: 'lax'  // Sent with top-level navigation
  // sameSite: 'none' // Always sent (requires secure: true)
});
```

**Secure cookie example:**

```javascript
// ❌ Insecure cookie
document.cookie = 'session=abc123';

// ✅ Secure cookie (server-side)
res.cookie('session', token, {
  httpOnly: true,    // Cannot be accessed by JavaScript
  secure: true,      // Only sent over HTTPS
  sameSite: 'strict', // Not sent with cross-site requests
  maxAge: 3600000,   // 1 hour
  domain: '.example.com',
  path: '/'
});
```

**Example: Auth token**

```javascript
res.cookie('authToken', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

// Delete cookie
res.clearCookie('session');
```

---

## 18. Input Validation and Sanitization

- **Validation** -- Check if input meets requirements
- **Sanitization** -- Clean/remove dangerous content

Both are needed: client-side for UX, server-side for security. Never trust user input.

**Client-side validation (UX):**

```javascript
function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validatePassword(password) {
  return password.length >= 8 &&
         /[A-Z]/.test(password) &&
         /[a-z]/.test(password) &&
         /[0-9]/.test(password);
}
```

**Server-side validation (security):**

```javascript
const { body, validationResult } = require('express-validator');

app.post('/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('username').isAlphanumeric().trim().escape()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Process registration
  }
);
```

**HTML sanitization:**

```javascript
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(dirtyHtml);
```

**SQL injection prevention:**

```javascript
// ❌ Vulnerable
const query = `SELECT * FROM users WHERE id = ${userId}`;

// ✅ Safe (parameterized queries)
const query = 'SELECT * FROM users WHERE id = ?';
db.execute(query, [userId]);

// Or with named parameters
const query = 'SELECT * FROM users WHERE id = :id';
db.execute(query, { id: userId });
```

**NoSQL injection prevention:**

```javascript
// ❌ Vulnerable
User.find({ username: req.body.username });

// If req.body.username = { $ne: null }, returns all users

// ✅ Safe - validate input type
User.find({
  username: String(req.body.username)
});

// Or use schema validation
const schema = Joi.object({
  username: Joi.string().alphanum().required()
});
```

**Command injection prevention:**

```javascript
// ❌ Vulnerable
const exec = require('child_process').exec;
exec(`ping ${userInput}`);

// If userInput = "8.8.8.8; rm -rf /", runs both commands

// ✅ Safe - validate and sanitize
const { execFile } = require('child_process');
execFile('ping', [userInput], (error, stdout) => {
  // execFile doesn't allow shell injection
});
```

**Best practices:**
- ✅ Validate all user input (client + server)
- ✅ Sanitize HTML with DOMPurify
- ✅ Use parameterized queries for SQL
- ✅ Validate types for NoSQL
- ✅ Never trust client-side validation alone
- ✅ Whitelist allowed inputs when possible
- ✅ Escape output based on context (HTML, SQL, shell)

