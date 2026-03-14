# HTML & Web Security Guide

Modern HTML, bundlers, and web security fundamentals.

---

## Bundlers & Build Tools

A bundler combines JS, CSS, and assets into optimized files for the browser. It resolves imports, transforms code (SASS → CSS, TS → JS), and minifies output.

### Webpack vs Vite

- **Webpack** — bundle-first; powerful but slow dev server; complex config; large plugin ecosystem
- **Vite** — run-first (native ES modules in dev); instant HMR via esbuild; zero config for most projects

**Use Vite for modern apps. Use Webpack when you need its ecosystem.**

---

## Code Splitting & Build Optimization

```javascript
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

**Vite production config:**

```javascript
export default defineConfig({
  build: {
    minify: 'terser',
    target: 'es2015',
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

**Optimization techniques:** minification, tree shaking, compression (gzip/Brotli), lazy loading, content-hash filenames for caching.

---

## Package Managers

| Tool | Speed | Disk | Lockfile | Notes |
|------|-------|------|----------|-------|
| npm | Slow | High | `package-lock.json` | Comes with Node.js |
| yarn | Fast | High | `yarn.lock` | Parallel installs, workspaces |
| pnpm | Faster | Low | `pnpm-lock.yaml` | Symlinks from global store; blocks phantom deps |
| bun | Fastest | Medium | `bun.lockb` | Also a runtime + bundler + test runner |

**npm vs npx:**
- `npm install prettier` — adds package to project
- `npx prettier --write .` — runs once without installing

---

## Linters and Formatters

- **Linter (ESLint)** — finds bugs and bad patterns
- **Formatter (Prettier)** — fixes code style (indentation, quotes, line length)
- **Biome** — replaces both; written in Rust; 10–100x faster; single config

```bash
# ESLint + Prettier
npm install -D eslint prettier

# Biome (one tool)
npm install -D --save-exact @biomejs/biome
npx @biomejs/biome check --write .
```

```json
// .prettierrc
{ "semi": true, "singleQuote": true, "tabWidth": 2, "printWidth": 80 }
```

**Choose ESLint + Prettier** for maximum plugin ecosystem. **Choose Biome** for speed and simplicity.

---

## Semantic HTML

Use tags that describe content purpose — improves accessibility, SEO, and readability.

```html
<!-- Non-semantic -->
<div class="header"><div class="nav"><div class="link">Home</div></div></div>

<!-- Semantic -->
<header><nav><a href="/">Home</a></nav></header>
<main><article><h1>Title</h1><p>Content</p></article></main>
```

Key tags: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`, `<figure>`, `<time>`, `<details>`

---

## HTML5 APIs

**Geolocation:**

```javascript
navigator.geolocation.getCurrentPosition(
  (pos) => console.log(pos.coords.latitude, pos.coords.longitude),
  (err) => console.error(err.message)
);
```

**Storage:**

```javascript
localStorage.setItem('theme', 'dark');         // persists across tabs/sessions
sessionStorage.setItem('tempData', 'value');   // cleared when tab closes
const theme = localStorage.getItem('theme');
```

**Data Attributes:**

```html
<button data-user-id="123" data-role="admin">Delete User</button>
```

```javascript
const btn = document.querySelector('button');
console.log(btn.dataset.userId);  // "123"
btn.dataset.status = 'active';
```

---

## Script Loading Strategies

```html
<script src="app.js"></script>          <!-- blocks HTML parsing; runs immediately -->
<script defer src="app.js"></script>    <!-- parallel download; runs after HTML parsed; ordered -->
<script async src="app.js"></script>    <!-- parallel download; runs when ready; unordered -->
```

- **defer** — best for most scripts (DOM-dependent code)
- **async** — best for independent scripts (analytics, ads)

---

## XSS (Cross-Site Scripting)

Injects malicious scripts to steal cookies or session data.

```javascript
// Vulnerable
document.getElementById('greeting').innerHTML = `Hello ${getUserInput()}`;

// Safe
document.getElementById('greeting').textContent = getUserInput();

// React — avoid dangerouslySetInnerHTML; sanitize first if needed:
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(dirtyHtml);
```

**Prevention:** escape user input, use `textContent` over `innerHTML`, sanitize with DOMPurify, set CSP headers, use HttpOnly cookies.

---

## CSRF (Cross-Site Request Forgery)

Tricks authenticated users into triggering unwanted actions.

```javascript
// CSRF Token validation
app.post('/transfer', (req, res) => {
  if (req.body.csrf_token !== req.session.csrfToken) {
    return res.status(403).send('Invalid CSRF token');
  }
});

// SameSite Cookies
res.cookie('session', token, { httpOnly: true, secure: true, sameSite: 'strict' });
```

---

## CORS (Cross-Origin Resource Sharing)

Browsers block cross-origin requests by default. The server must opt in via headers.

```javascript
const cors = require('cors');
app.use(cors({ origin: ['https://example.com', 'https://app.example.com'] }));
```

With credentials: set `credentials: 'include'` on fetch and `Access-Control-Allow-Credentials: true` on server; cannot use `*` as origin.

---

## Content Security Policy (CSP)

HTTP header that restricts what content the browser can load — primary XSS mitigation.

```http
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';
```

---

## Secure Cookies

```javascript
res.cookie('session', token, {
  httpOnly: true,      // JS cannot read — blocks XSS cookie theft
  secure: true,        // HTTPS only
  sameSite: 'strict',  // blocks CSRF
  maxAge: 3600000,     // 1 hour
});
```

---

## Input Validation and Sanitization

- **Validation** — check format/type/length; do on both client (UX) and server (security)
- **Sanitization** — strip dangerous content; always server-side

```javascript
// Server-side with express-validator
app.post('/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 8 }),
    body('username').isAlphanumeric().trim().escape()
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  }
);
```

**SQL injection — use parameterized queries:**

```javascript
// Vulnerable
const q = `SELECT * FROM users WHERE id = ${userId}`;

// Safe
db.execute('SELECT * FROM users WHERE id = ?', [userId]);
```

**Best practices:** validate all input (client + server), sanitize HTML with DOMPurify, parameterized queries for SQL, type coercion for NoSQL, whitelist allowed values where possible.
