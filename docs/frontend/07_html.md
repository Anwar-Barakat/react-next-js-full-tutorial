# HTML & Web Security Guide

A comprehensive guide to modern HTML, bundlers, and web security fundamentals.

---

## Table of Contents

### Bundlers & Build Tools
1. [What is a Bundler?](#1-what-is-a-bundler)
2. [What is Webpack?](#2-what-is-webpack)
3. [What is Vite?](#3-what-is-vite)
4. [Webpack vs Vite](#4-webpack-vs-vite)
5. [Code Splitting](#5-code-splitting)
6. [Build Optimization](#6-build-optimization)

### HTML Fundamentals
7. [Semantic HTML](#7-semantic-html)
8. [HTML5 APIs](#8-html5-apis)
9. [Data Attributes](#9-data-attributes)
10. [Script Loading Strategies](#10-script-loading-strategies)

### Web Security
11. [XSS (Cross-Site Scripting)](#11-xss-cross-site-scripting)
12. [CSRF (Cross-Site Request Forgery)](#12-csrf-cross-site-request-forgery)
13. [CORS (Cross-Origin Resource Sharing)](#13-cors-cross-origin-resource-sharing)
14. [Content Security Policy (CSP)](#14-content-security-policy-csp)
15. [Secure Cookies](#15-secure-cookies)
16. [Input Validation and Sanitization](#16-input-validation-and-sanitization)
17. [Summary](#17-summary)

---

## Bundlers & Build Tools

## 1. What is a Bundler?

**A bundler** is a tool in web development that combines multiple files into optimized bundles for browsers.

**What it does:**
- Takes lots of separate files (JavaScript, CSS, images, etc.)
- Looks at all the imports and dependencies between them
- Combines them into one or a few optimized files (bundles)
- Organizes many small files into one for faster page loads

**Why bundlers are needed:**
- Browsers don't understand modern module syntax (import/export)
- Too many HTTP requests slow down page load
- Code needs optimization and minification
- Assets need processing (SASS → CSS, TypeScript → JavaScript)

---

## 2. What is Webpack?

**Webpack** is a powerful, configurable bundler - the industry standard for years.

**Key characteristics:**
- You write many files → Webpack packs them together
- Browser gets fewer files, so it loads faster
- Handles: JavaScript, CSS, Images, Fonts

**Core concepts:**

| Concept | Purpose |
|---------|---------|
| **Loaders** | Teach Webpack how to read files (babel-loader, css-loader, file-loader) |
| **Plugins** | Add extra powers (optimize, clean, generate files) |
| **Entry** | Starting point of your application |
| **Output** | Where to put bundled files |

**Characteristics:**
- Strong and powerful
- Complex configuration
- Harder to learn
- Slow development builds
- Great for production optimization

---

## 3. What is Vite?

**Vite** is a modern, fast build tool designed to fix Webpack's slowness.

**Key features:**
- App starts almost instantly
- Updates show immediately when you save files
- Zero configuration for most projects
- Uses native ES modules in development
- Lightning-fast Hot Module Replacement (HMR)

**What makes Vite fast:**
- No bundling in development
- Uses esbuild (written in Go, very fast)
- Only transforms files the browser requests
- Incremental updates

---

## 4. Webpack vs Vite

| Feature | Webpack | Vite |
|---------|---------|------|
| **Approach** | "Bundle first, then run" | "Run first, bundle later" |
| **Dev Server Start** | Slow (bundles everything) | Instant (no bundling) |
| **HMR Speed** | Slow | Instant |
| **Configuration** | Complex | Simple/zero config |
| **Learning Curve** | Steep | Easy |
| **Production Build** | Excellent | Excellent (uses Rollup) |
| **Best For** | Complex setups | Modern apps |

**Webpack approach:**
1. Bundles everything first
2. App starts slow
3. Very powerful
4. Harder to learn

**Vite approach:**
1. Does not bundle in development
2. App starts instantly
3. Very fast
4. Easy to use
5. Browser loads files directly
6. No waiting for a big bundle
7. Only updates the file you changed
8. Vite only does full bundling when you run production build

---

## 5. Code Splitting

**What it is:**
Breaking code into smaller chunks that can be loaded on demand.

**Benefits:**
- Improves initial load time
- Only load necessary code for each page
- Better caching
- Automatic and manual splitting available

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

## HTML Fundamentals

## 7. Semantic HTML

**What it is:**
Using HTML tags that describe content purpose, not just appearance.

**Benefits:**
- Better accessibility
- Improved SEO
- More readable code
- Screen reader friendly
- Self-documenting

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

## 8. HTML5 APIs

**What they are:**
Browser features you can use with JavaScript to build advanced web applications.

**Common HTML5 APIs:**

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

## 9. Data Attributes

**What they are:**
Custom attributes to store extra information on HTML elements.

**Features:**
- Start with `data-` prefix
- Accessible via `dataset` property
- Don't affect styling or behavior unless scripted

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

## 10. Script Loading Strategies

**The problem:**
Browser reads HTML from top to bottom. When it meets a `<script>` tag, it must decide whether to stop and run JavaScript now or continue reading HTML.

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

| Feature | Normal | defer | async |
|---------|--------|-------|-------|
| **HTML parsing** | Blocks | Continues | Continues |
| **When executes** | Immediately | After HTML | When ready |
| **Order guaranteed** | Yes | Yes | No |
| **Best for** | Inline critical code | Most scripts | Analytics, ads |

---

## Web Security

## 11. XSS (Cross-Site Scripting)

**What it is:**
XSS injects malicious scripts into web pages that run in victim's browser.

**What attackers can do:**
- Steal cookies and sessions
- Steal personal data
- Redirect users
- Deface websites

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

## 12. CSRF (Cross-Site Request Forgery)

**What it is:**
CSRF tricks users into performing unwanted actions while authenticated.

**How it works:**
Exploits user's authenticated session - attacker cannot see response, only trigger action.

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

## 13. CORS (Cross-Origin Resource Sharing)

**What it is:**
CORS controls which domains can access your API - a browser security feature.

**Same-origin policy:**
Browser blocks requests between different origins by default.

**What's blocked:**

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

## 14. Content Security Policy (CSP)

**What it is:**
CSP is a security rule that tells the browser what content is allowed to load.

**Purpose:**
- Prevents XSS attacks
- Blocks inline scripts by default
- Adds extra layer of protection

**Where CSP lives:**
- In HTTP headers (best)
- Or in a meta tag in HTML

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

## 15. Secure Cookies

**What they are:**
Cookies store small data (login, session) - secure cookies protect this data.

**Important cookie settings:**

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

**Cookie attributes:**

```javascript
// httpOnly: Prevents JavaScript access
// ✅ Protects against XSS
httpOnly: true

// secure: Only sent over HTTPS
// ✅ Protects against man-in-the-middle
secure: true

// sameSite: Controls cross-site sending
// ✅ Protects against CSRF
sameSite: 'strict'  // Never sent cross-site
sameSite: 'lax'     // Sent with top-level navigation
sameSite: 'none'    // Always sent (requires secure: true)

// maxAge: Expiration time in milliseconds
maxAge: 3600000  // 1 hour

// expires: Expiration date
expires: new Date(Date.now() + 3600000)

// domain: Which domain can access
domain: '.example.com'  // *.example.com can access

// path: Which paths can access
path: '/admin'  // Only /admin/* can access
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

## 16. Input Validation and Sanitization

**What they are:**
- **Validation** - Check if input meets requirements
- **Sanitization** - Clean/remove dangerous content

**Why both are needed:**
- Client-side for UX
- Server-side for security
- Never trust user input

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

---

## 17. Summary

**Key takeaways:**

### Bundlers
1. **Webpack** - Powerful, configurable, slower builds
2. **Vite** - Fast, modern, instant dev server
3. **Code splitting** - Load code on demand for better performance
4. **Build optimization** - Minification, tree shaking, compression

### HTML
1. **Semantic HTML** - Use meaningful tags for better accessibility and SEO
2. **HTML5 APIs** - Geolocation, localStorage, Canvas, Fetch for rich web apps
3. **Data attributes** - Store custom data on elements
4. **Script strategies** - Normal vs defer vs async for optimal loading

### Web Security
1. **XSS** - Escape user input, use DOMPurify, set CSP
2. **CSRF** - Use tokens, SameSite cookies, check Origin
3. **CORS** - Control cross-origin access with headers
4. **CSP** - Define allowed content sources
5. **Secure cookies** - HttpOnly, Secure, SameSite flags
6. **Input validation** - Validate client-side for UX, server-side for security
7. **SQL injection** - Use parameterized queries
8. **Never trust user input** - Always validate and sanitize

**Security principles:**
- Defense in depth - multiple layers of security
- Principle of least privilege - minimum necessary permissions
- Fail securely - errors should not expose sensitive info
- Don't rely on client-side validation alone
- Keep dependencies updated
- Regular security audits

Modern web development requires understanding both performance (bundlers, optimization) and security (XSS, CSRF, input validation) to build fast, secure applications.
