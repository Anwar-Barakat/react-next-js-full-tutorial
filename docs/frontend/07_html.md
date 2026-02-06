01. What is a bundler?

🟣 A bundler is a tool in web development that:
   ▫️ Takes lots of separate files (JavaScript, CSS, images, etc.)
   ▫️ Looks at all the imports and dependencies between them
   ▫️ Combines them into one or a few optimized files (called bundles) that browsers
   ▫️ Organize many small files into one so faster page loads.


-----------------------------------------

02. What is Webpack?

🟣 Webpack is a tool that prepares your app for the browser
🟣 You write many files → Webpack packs them together
🟣 Browser gets fewer files, so it loads faster
🟣 It knows how to handle: JavaScript, CSS, Images
🟣 Loaders = teach Webpack how to read files
🟣 Plugins = add extra powers (optimize, clean, generate files)
🟣 It is strong, but hard to learn

-----------------------------------------

04. What is Vite?

🟣 Vite is a newer and faster tool
🟣 Made to fix Webpack’s slowness
🟣 App starts almost instantly
🟣 Updates show immediately when you save files
🟣 You usually don’t need configuration
🟣 Zero config for most projects.

-----------------------------------------

05. What is the difference between Webpack and Vite?

🟣 Webpack -> "Bundle first, then run”
   ▫️ Bundles everything first
   ▫️ App starts slow
   ▫️ Very powerful
   ▫️ Harder to learn

🟣 Vite -> “Run first, bundle later”
   ▫️ Does not bundle in development
   ▫️ App starts instantly
   ▫️ Very fast
   ▫️ Easy to use
   ▫️ Browser loads files directly
   ▫️ No waiting for a big bundle
   ▫️ Only updates the file you changed
   ▫️ Vite does NOT bundle your app files into one big file during development.
   ▫️ Transforms only what the browser actually asks for, on demand.
   ▫️ Vite only does full bundling when you run a production build

-----------------------------------------

06. What is code splitting in bundlers?

🟣 Code splitting breaks code into smaller chunks.
🟣 Load only necessary code for each page.
🟣 Improves initial load time.
🟣 Automatic and manual splitting.

************* 🟣🟣🟣 *************
// Manual code splitting with dynamic import
// Button click loads chunk
button.addEventListener('click', async () => {
  const module = await import('./heavy-module.js');
  module.doSomething();
});

// React lazy loading
import { lazy, Suspense } from 'react';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </Suspense>
  );
}

************* 🟣🟣🟣 *************

-----------------------------------------

08. What are build optimization techniques?

🟣 Minification, tree shaking, compression.
🟣 Code splitting, lazy loading.
🟣 Caching with content hashes.
🟣 Bundle analysis and optimization.

************* 🟣🟣🟣 *************

// Vite production optimization
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
************* 🟣🟣🟣 *************

-----------------------------------------

## HTML

09. What is semantic HTML?

🟣 Semantic HTML uses meaningful tags.
🟣 Describes content purpose, not appearance.
🟣 Improves accessibility and SEO.
🟣 Makes code more readable.

************* 🟣🟣🟣 *************
// ❌ Non-semantic HTML
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

// ✅ Semantic HTML
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

// Semantic tags:
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

// Benefits:
// ✅ Better SEO
// ✅ Screen reader friendly
// ✅ More maintainable
// ✅ Self-documenting
************* 🟣🟣🟣 *************

-----------------------------------------

10. What are HTML5 APIs?

🟣 HTML5 APIs are browser features you can use with JavaScript
🟣 They let websites do more advanced things
🟣 They work directly in the browser (no server needed)
🟣 They help websites feel more like real apps
👉 Think of HTML5 APIs as tools the browser gives you.

Common HTML5 APIs
📍 Geolocation API
🟣 Gets the user’s location
🟣 Used for maps, delivery apps, nearby places

💾 Local Storage
🟣 Saves data inside the browser
🟣 Data stays even after refresh
🟣 Used for themes, login info, settings

🎨 Canvas API
🟣 Draw shapes, images, and animations
🟣 Used for games and charts

🌐 Fetch API
🟣 Get data from servers (APIs)
🟣 Replaces old XMLHttpRequest

-----------------------------------------

11. What are data attributes?

🟣 Custom attributes to store extra information.
🟣 Start with data- prefix.
🟣 Accessible via dataset property.
🟣 Don't affect styling or behavior unless scripted.

************* 🟣🟣🟣 *************
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

// JavaScript access
const button = document.querySelector('button');

// Access via dataset
console.log(button.dataset.userId);    // "123"
console.log(button.dataset.role);      // "admin"
console.log(button.dataset.action);    // "delete"

// Set data attribute
button.dataset.status = 'active';

// CSS access
[data-role="admin"] {
  background: gold;
}

[data-status="active"] {
  border: 2px solid green;
}

// React example
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
************* 🟣🟣🟣 *************

-----------------------------------------

12. What is the difference between <script>, <script defer>, and <script async>?

🟣 The browser reads HTML from top to bottom. When it meets a <script> tag, it must decide:
👉 Should I stop and run this JavaScript now, or can I continue reading HTML?
1️⃣ <script> (normal) — STOP and wait
   ▫️ Browser stops reading HTML
   ▫️ Downloads JavaScript
   ▫️ Runs JavaScript
   ▫️ Then continues HTML
   👉 Result: page loads slower, “Stop everything, run JS now!”

2️⃣ <script defer> — Wait until HTML is ready
   ▫️ Browser keeps reading HTML
   ▫️ JavaScript downloads in background
   ▫️ Runs after HTML is finished
   ▫️ Scripts run in order
   👉 Result: fast page + safe DOM access “Finish the page first, then run JS.” 

3️⃣ <script async> — Run whenever it’s ready
   ▫️ Browser keeps reading HTML
   ▫️ JavaScript downloads in background
   ▫️ Runs as soon as it finishes downloading
   ▫️ Order is not guaranteed
   👉 Result: unpredictable timing “Run JS whenever you want.”

-----------------------------------------

## SECURITY

13. What is XSS (Cross-Site Scripting)?

🟣 XSS injects malicious scripts into web pages.
🟣 Attacker's code runs in victim's browser.
🟣 Can steal cookies, sessions, personal data.
🟣 Three types: Stored, Reflected, DOM-based.

************* 🟣🟣🟣 *************
// ❌ Vulnerable code
// User input directly in HTML
const username = getUserInput();
document.getElementById('greeting').innerHTML = `Hello ${username}`;

// Attack: username = "<script>alert('XSS')</script>"
// Result: Script executes

// ✅ Fix: Escape user input
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

const username = getUserInput();
document.getElementById('greeting').innerHTML = `Hello ${escapeHtml(username)}`;

// React (automatic escaping)
function Greeting({ username }) {
  return <div>Hello {username}</div>;
  // React escapes by default
}

// ❌ Still vulnerable in React
function Greeting({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
  // Don't use unless you trust the HTML
}

// Sanitize HTML with DOMPurify
import DOMPurify from 'dompurify';

function SafeHtml({ html }) {
  const clean = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
}

// Types of XSS:

// 1. Stored XSS - saved in database
// User posts: <script>steal()</script>
// Everyone who views it gets attacked

// 2. Reflected XSS - in URL
// URL: /search?q=<script>steal()</script>
// Script executes when URL is visited

// 3. DOM-based XSS - client-side only
location.href = `/?name=${document.querySelector('#name').value}`;

// Prevention:
// ✅ Escape all user input
// ✅ Use textContent instead of innerHTML
// ✅ Sanitize HTML with DOMPurify
// ✅ Set Content-Security-Policy header
// ✅ Use HTTPOnly cookies
************* 🟣🟣🟣 *************

-----------------------------------------

14. What is CSRF (Cross-Site Request Forgery)?

🟣 CSRF tricks user into performing unwanted actions.
🟣 Exploits user's authenticated session.
🟣 Attacker cannot see response, only trigger action.

************* 🟣🟣🟣 *************
// Attack scenario:
// 1. User logs into bank.com
// 2. Visits malicious site evil.com
// 3. evil.com contains:
<form action="https://bank.com/transfer" method="POST">
  <input name="to" value="attacker">
  <input name="amount" value="1000">
</form>
<script>document.forms[0].submit();</script>

// User's browser sends authenticated request to bank.com
// Money transferred without user knowing

// ✅ Prevention: CSRF Token
// Server generates unique token for each session

// Form includes token
<form action="/transfer" method="POST">
  <input type="hidden" name="csrf_token" value="abc123...">
  <input name="to" value="john">
  <input name="amount" value="100">
  <button type="submit">Transfer</button>
</form>

// Server validates token
app.post('/transfer', (req, res) => {
  if (req.body.csrf_token !== req.session.csrfToken) {
    return res.status(403).send('Invalid CSRF token');
  }
  // Process transfer
});

// ✅ SameSite cookies
res.cookie('session', token, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict' // or 'lax'
});

// SameSite values:
// - strict: Cookie not sent with cross-site requests
// - lax: Cookie sent with top-level navigation
// - none: Cookie sent with all requests (requires secure)

// ✅ Check Origin/Referer header
app.post('/transfer', (req, res) => {
  const origin = req.headers.origin;
  if (origin !== 'https://yoursite.com') {
    return res.status(403).send('Invalid origin');
  }
  // Process transfer
});

// Best practices:
// ✅ Use CSRF tokens for state-changing operations
// ✅ Use SameSite cookies
// ✅ Verify Origin/Referer headers
// ✅ Require re-authentication for sensitive actions
// ✅ Use POST for state changes (not GET)
************* 🟣🟣🟣 *************

-----------------------------------------

15. What is CORS (Cross-Origin Resource Sharing)?

🟣 CORS controls which domains can access your API.
🟣 Browser security feature.
🟣 Prevents unauthorized cross-origin requests.
🟣 Server must explicitly allow cross-origin access.

************* 🟣🟣🟣 *************
// Same-origin policy blocks:
// Page at https://example.com
// Cannot fetch from https://api.other.com

// ❌ CORS error
fetch('https://api.other.com/data')
  .then(res => res.json())
  .catch(err => console.error('CORS error'));

// Server must add CORS headers
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

// Manual CORS headers
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

// Preflight request (browser sends OPTIONS first)
// Browser:
OPTIONS /api/data
Origin: https://example.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type

// Server:
Access-Control-Allow-Origin: https://example.com
Access-Control-Allow-Methods: POST
Access-Control-Allow-Headers: Content-Type

// Then actual request:
POST /api/data
Origin: https://example.com

// With credentials (cookies)
fetch('https://api.example.com/data', {
  credentials: 'include'
});

// Server must allow:
Access-Control-Allow-Credentials: true
Access-Control-Allow-Origin: https://specific-domain.com
// (cannot use * with credentials)
************* 🟣🟣🟣 *************

-----------------------------------------

16. What is Content Security Policy (CSP)?

🟣 CSP is a security rule for the browser
🟣 It tells the browser what is allowed to load
🟣 It helps stop hacking scripts (XSS)
🟣 If something is not allowed → browser blocks it
🟣 “Only load files from these places, block everything else.”

👉 Think of CSP as a security guard 🚨
Only trusted scripts, styles, and images are allowed in.

👉 Where CSP lives
🟣 In HTTP headers (best)
🟣 Or in a meta tag in HTML

👉 Why CSP is Important
🟣 Prevents XSS attacks
🟣 Blocks inline scripts by default
🟣 Adds an extra layer of protection

************* 🟣🟣🟣 *************
// CSP header
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com; style-src 'self' 'unsafe-inline'

// Meta tag
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self' https://cdn.example.com"
>

// Directives:

// default-src: Fallback for all resource types
default-src 'self'

// script-src: JavaScript sources
script-src 'self' https://cdn.example.com

// style-src: CSS sources
style-src 'self' 'unsafe-inline'

// img-src: Image sources
img-src 'self' data: https://images.example.com

// font-src: Font sources
font-src 'self' https://fonts.googleapis.com

// connect-src: AJAX, WebSocket, fetch sources
connect-src 'self' https://api.example.com

// Values:

// 'self' - same origin only
// 'none' - block all
// 'unsafe-inline' - allow inline scripts/styles (not recommended)
// 'unsafe-eval' - allow eval() (not recommended)
// https: - allow all HTTPS sources
// https://example.com - specific domain

// Example policy
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';

// Report violations
Content-Security-Policy-Report-Only:
  default-src 'self';
  report-uri /csp-report

// Browser sends violations to /csp-report
************* 🟣🟣🟣 *************

-----------------------------------------

17. What are secure cookies?

🟣 Cookies store small data (login, session)
🟣 Secure cookies protect this data
🟣 They stop hackers from stealing sessions

👉 Think of cookies as ID cards 🪪
Secure cookies lock that ID.

Important Cookie Settings (Easy)
🔒 HttpOnly
JavaScript cannot read the cookie
Protects against XSS
🔐 Secure
Cookie sent only over HTTPS
Protects on public Wi-Fi
🚫 SameSite
Controls cross-site sending
Protects against CSRF

************* 🟣🟣🟣 *************
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

// Cookie attributes:

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

// Example: Auth token
res.cookie('authToken', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

// Delete cookie
res.clearCookie('session');
************* 🟣🟣🟣 *************

-----------------------------------------

18. What is input validation and sanitization?

🟣 Validation: Check if input meets requirements.
🟣 Sanitization: Clean/remove dangerous content.
🟣 Both client-side and server-side needed.
🟣 Never trust user input.

************* 🟣🟣🟣 *************
// Client-side validation (UX)
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

// Server-side validation (security)
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

// Sanitization examples

// HTML sanitization
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(dirtyHtml);

// SQL injection prevention (use parameterized queries)
// ❌ Vulnerable
const query = `SELECT * FROM users WHERE id = ${userId}`;

// ✅ Safe (parameterized)
const query = 'SELECT * FROM users WHERE id = ?';
db.execute(query, [userId]);

// NoSQL injection prevention
// ❌ Vulnerable
User.find({ username: req.body.username });

//