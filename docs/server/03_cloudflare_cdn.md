# Cloudflare, CDN & Edge Infrastructure Guide

A comprehensive guide covering CDN fundamentals, Cloudflare services, edge computing, and performance optimization for full-stack developers.

## Table of Contents

1. [What is a CDN (Content Delivery Network)?](#1-what-is-a-cdn-content-delivery-network)
2. [What is Cloudflare?](#2-what-is-cloudflare)
3. [How DNS Works with Cloudflare](#3-how-dns-works-with-cloudflare)
4. [SSL/TLS with Cloudflare](#4-ssltls-with-cloudflare)
5. [Cloudflare Caching](#5-cloudflare-caching)
6. [Cloudflare Page Rules & Cache Rules](#6-cloudflare-page-rules--cache-rules)
7. [Cloudflare Security Features](#7-cloudflare-security-features)
8. [Cloudflare Workers](#8-cloudflare-workers)
9. [Cloudflare Pages](#9-cloudflare-pages)
10. [Cloudflare with Laravel](#10-cloudflare-with-laravel)
11. [Cloudflare with Next.js / Vercel](#11-cloudflare-with-nextjs--vercel)
12. [CDN Comparison](#12-cdn-comparison)
13. [Edge Computing](#13-edge-computing)
14. [Performance Optimization with CDN](#14-performance-optimization-with-cdn)
15. [Best Practices](#15-best-practices)

---

## 1. What is a CDN (Content Delivery Network)?

A **CDN** is a network of servers distributed across the globe, designed to deliver content to users from the location closest to them.

**How it works:**

- A CDN places copies of your content on multiple servers (called **edge servers** or **PoPs** — Points of Presence) around the world
- When a user requests your site, the CDN serves the content from the nearest edge server instead of your origin server

**Without CDN:**

- User in Tokyo sends a request to your server in New York
- The request travels across the Pacific Ocean and back
- High latency, slow page loads

**With CDN:**

- User in Tokyo sends a request
- The CDN edge server in Tokyo already has a cached copy
- Content is served locally with minimal latency

**What CDNs cache:**

- Images (PNG, JPG, WebP, SVG)
- CSS stylesheets
- JavaScript files
- Fonts
- Videos and audio files
- Other static assets

**Benefits of using a CDN:**

- **Faster load times** — content is served from a nearby server
- **Reduced server load** — the origin server handles fewer requests
- **Better availability** — if one edge server goes down, others can serve the content
- **DDoS absorption** — distributed infrastructure can absorb large-scale attacks
- **Bandwidth savings** — cached content reduces data transfer from origin

---

## 2. What is Cloudflare?

**Cloudflare** is a web infrastructure company that provides CDN, DNS, security, and performance services. It is much more than a traditional CDN — it is a full security and performance platform.

**How Cloudflare works:**

- Cloudflare acts as a **reverse proxy** between your visitors and your origin server
- All traffic flows through Cloudflare before reaching your server

**Request flow:**

```
User → Cloudflare Edge → Your Origin Server → Cloudflare Edge → User
```

**Key characteristics:**

- Free tier available — generous enough for most personal and small business projects
- Easy to set up — typically takes less than 5 minutes
- No hardware or software to install on your server
- Works with any hosting provider

**Key services Cloudflare provides:**

- **CDN** — caches and serves static content from edge servers
- **DNS** — fast, reliable DNS resolution
- **WAF** — Web Application Firewall to block attacks
- **DDoS Protection** — automatic mitigation of DDoS attacks
- **SSL/TLS** — free SSL certificates and encryption
- **Workers** — serverless functions at the edge
- **Pages** — hosting for static sites and full-stack apps
- **R2** — object storage (S3-compatible, no egress fees)
- **D1** — serverless SQL database at the edge

---

## 3. How DNS Works with Cloudflare

**What is DNS?**

- DNS (Domain Name System) translates human-readable domain names (like `example.com`) into IP addresses (like `93.184.216.34`) that computers use to communicate

**Without Cloudflare:**

- Your domain points directly to your server's IP address
- DNS resolution happens through your registrar's nameservers
- No protection or caching layer

**With Cloudflare:**

- Your domain points to Cloudflare's nameservers
- Cloudflare resolves the DNS and routes traffic through its network
- Your origin server IP is hidden from the public

**Orange Cloud (Proxied) vs Grey Cloud (DNS Only):**

- **Proxied (orange cloud icon):**
  - Traffic flows through Cloudflare's network
  - You get CDN caching, DDoS protection, WAF, and all security features
  - Your origin server IP is hidden
  - Use this for web traffic (HTTP/HTTPS)

- **DNS Only (grey cloud icon):**
  - Cloudflare only resolves the domain to your IP address
  - No CDN, no caching, no security features
  - Your origin server IP is exposed
  - Use this for non-HTTP services (mail servers, FTP, custom TCP)

**Common DNS record types:**

- **A** — maps a domain to an IPv4 address (e.g., `example.com → 93.184.216.34`)
- **AAAA** — maps a domain to an IPv6 address
- **CNAME** — maps a domain to another domain (e.g., `www.example.com → example.com`)
- **MX** — specifies mail servers for the domain
- **TXT** — stores text data (used for SPF, DKIM, domain verification)

**How to set up Cloudflare DNS:**

- Sign up for a Cloudflare account
- Add your domain to Cloudflare
- Cloudflare scans your existing DNS records
- Change your domain's nameservers at your registrar to Cloudflare's nameservers (e.g., `ada.ns.cloudflare.com`, `bob.ns.cloudflare.com`)
- Wait for DNS propagation (usually a few minutes to 24 hours)

---

## 4. SSL/TLS with Cloudflare

**What is SSL/TLS?**

- SSL (Secure Sockets Layer) and TLS (Transport Layer Security) encrypt data transmitted between the browser and the server
- This prevents attackers from intercepting sensitive data (passwords, credit cards, etc.)
- Sites using SSL/TLS show `https://` and a padlock icon in the browser

**Cloudflare SSL Modes:**

- **Off (not recommended):**
  - No encryption at all
  - Never use this — data is transmitted in plain text

- **Flexible:**
  - HTTPS between the user and Cloudflare
  - HTTP (unencrypted) between Cloudflare and your origin server
  - Not recommended for production — your origin traffic is not encrypted
  - Only use temporarily if your server does not support HTTPS

- **Full:**
  - HTTPS between the user and Cloudflare
  - HTTPS between Cloudflare and your origin server
  - The origin server certificate can be self-signed (not validated)
  - Better than Flexible, but not fully secure

- **Full (Strict) — Recommended:**
  - HTTPS everywhere
  - The origin server must have a valid SSL certificate (trusted CA or Cloudflare Origin Certificate)
  - This is the recommended mode for production

**Cloudflare Origin Certificate:**

- A free SSL certificate issued by Cloudflare for your origin server
- Valid for up to 15 years
- Only trusted by Cloudflare (not by browsers directly)
- Perfect for use with Full (Strict) mode
- Install it on your server (Nginx, Apache, etc.)

**Important SSL settings:**

- **Always Use HTTPS** — automatically redirects all HTTP requests to HTTPS
- **HSTS (HTTP Strict Transport Security)** — tells browsers to always use HTTPS for your domain, even if the user types `http://`
- **Automatic HTTPS Rewrites** — fixes mixed content issues by rewriting `http://` URLs in your HTML to `https://`
- **Minimum TLS Version** — set to TLS 1.2 (disable older, insecure versions)

---

## 5. Cloudflare Caching

**How caching works:**

- When a user requests a resource, Cloudflare checks if it has a cached copy at the nearest edge server
- If cached (**cache HIT**), the resource is served directly from the edge — no request to your origin
- If not cached (**cache MISS**), Cloudflare fetches it from your origin, serves it to the user, and stores a copy at the edge for future requests

**What gets cached by default:**

- Images (PNG, JPG, GIF, WebP, SVG, ICO)
- CSS and JavaScript files
- Fonts (WOFF, WOFF2, TTF, EOT)
- PDFs and other downloadable files

**What does NOT get cached by default:**

- HTML pages
- API responses (JSON, XML)
- Any dynamically generated content
- POST/PUT/DELETE requests

**Cache-Control headers:**

- Your origin server uses `Cache-Control` headers to tell Cloudflare (and browsers) how to cache content

```
Cache-Control: public, max-age=31536000
```
- `public` — can be cached by CDN and browser
- `max-age=31536000` — cache for 1 year (in seconds)

```
Cache-Control: no-cache
```
- The cached copy must be revalidated with the origin before each use

```
Cache-Control: no-store
```
- Never cache this response — always fetch from origin

```
Cache-Control: private, no-store
```
- Only the browser can cache it (not the CDN), and do not store it

**Browser TTL vs Edge TTL:**

- **Browser TTL** — how long the user's browser keeps the cached file before checking for updates
- **Edge TTL** — how long Cloudflare's edge servers keep the cached file before fetching a fresh copy from your origin
- You can set these independently — e.g., edge TTL of 1 day, browser TTL of 1 hour

**Purge Cache:**

- When you update files (deploy new CSS, images, etc.), old cached versions may still be served
- Cloudflare provides several purge options:
  - **Purge Everything** — clears the entire cache (use sparingly, causes a temporary spike in origin traffic)
  - **Purge by URL** — clears cache for specific URLs
  - **Purge by Tag** — clears cache for resources tagged with specific Cache-Tag headers
  - **Purge by Prefix** — clears cache for all URLs under a path prefix (e.g., `/static/`)

**Cache Rules:**

- Modern replacement for Page Rules (for caching behavior)
- Set caching behavior per URL pattern, hostname, or other conditions
- Configure edge TTL, browser TTL, cache eligibility, and more

---

## 6. Cloudflare Page Rules & Cache Rules

### Page Rules (Legacy)

Page Rules are the original way to configure Cloudflare behavior per URL pattern. They are still functional but Cloudflare is migrating features to newer, more flexible rule systems.

**Common Page Rule settings:**

- **Always Use HTTPS** — redirect HTTP to HTTPS for matching URLs
- **Cache Level: Cache Everything** — cache all content including HTML (useful for static pages)
- **Browser Cache TTL** — override the browser cache duration for matching URLs
- **Forwarding URLs** — set up 301 or 302 redirects
- **Disable Security** — turn off WAF for specific paths (rarely needed)
- **Bypass Cache** — skip caching entirely for matching URLs

**Limitations:**

- Free plan allows only 3 Page Rules
- Pattern matching is basic (wildcard only)
- One rule can contain limited actions

### Cache Rules (Modern Replacement)

Cache Rules are the modern, more flexible replacement for Page Rules' caching features.

**Advantages over Page Rules:**

- More match criteria — hostname, path, query string, headers, cookies
- Better performance
- More rules available on free plans
- Clearer, more granular control

**Example: Cache everything under `/static/*`**

- Match criteria: URI Path starts with `/static/`
- Action: Set cache eligibility to "Eligible for cache"
- Edge TTL: 1 month
- Browser TTL: 1 week

**Example: Bypass cache for `/api/*`**

- Match criteria: URI Path starts with `/api/`
- Action: Set cache eligibility to "Bypass cache"

**Example: Cache HTML pages for 1 hour**

- Match criteria: URI Path equals `/about` or `/pricing`
- Action: Set cache eligibility to "Eligible for cache"
- Edge TTL: 1 hour
- Browser TTL: 10 minutes

---

## 7. Cloudflare Security Features

### DDoS Protection

- **Automatic and always-on** — no configuration needed
- Absorbs attack traffic at the edge before it reaches your origin server
- Handles volumetric attacks (millions of requests per second)
- Works against Layer 3/4 (network) and Layer 7 (application) attacks
- Free on all plans — including the free tier

### WAF (Web Application Firewall)

- Inspects incoming HTTP requests and blocks malicious ones
- **Managed rulesets:**
  - Cloudflare Managed Ruleset — rules written and maintained by Cloudflare
  - OWASP Core Ruleset — industry-standard rules for common vulnerabilities
- **Blocks common attacks:**
  - SQL Injection (SQLi)
  - Cross-Site Scripting (XSS)
  - Remote File Inclusion (RFI)
  - Cross-Site Request Forgery (CSRF)
- **Custom rules:**
  - Block specific IP addresses
  - Block specific countries or regions
  - Block by user agent string
  - Block requests with suspicious query parameters

### Bot Management

- Distinguishes between good bots and bad bots
- **Good bots (allowed):** Googlebot, Bingbot, social media crawlers
- **Bad bots (blocked/challenged):** scrapers, credential stuffers, spam bots
- **Super Bot Fight Mode** (free plan) — basic bot detection
- **Bot Management** (enterprise) — advanced ML-based detection
- Challenge suspicious visitors with a CAPTCHA or JavaScript challenge

### Rate Limiting

- Limits the number of requests a single IP can make in a given time period
- Protects against brute-force attacks and API abuse
- **Example configurations:**
  - Max 5 login attempts per minute per IP
  - Max 100 API requests per minute per IP
  - Max 20 form submissions per hour per IP
- Actions when limit exceeded: block, challenge, or return a custom response

### Under Attack Mode

- Shows a JavaScript challenge page to all visitors before they can access your site
- Use this only when your site is actively being attacked
- Adds about 5 seconds of delay for legitimate visitors
- Can be enabled with one click in the Cloudflare dashboard
- Turn it off once the attack subsides

### IP Access Rules

- **Allowlist** — always allow specific IPs (your office, your server)
- **Blocklist** — permanently block specific IPs or IP ranges
- **Block entire countries** — if you only serve users in certain regions
- **Challenge** — require a CAPTCHA for specific IPs
- Can be applied at the account level or per zone (domain)

---

## 8. Cloudflare Workers

**What are Workers?**

- Serverless functions that run at the **edge** — at 300+ Cloudflare data centers worldwide
- Execute JavaScript or TypeScript code as close to the user as possible
- No cold starts (unlike traditional serverless functions)
- Respond in milliseconds

**Use cases:**

- URL rewriting and redirects
- A/B testing at the edge
- Adding or modifying HTTP headers
- API gateway and routing
- Authentication and authorization checks
- Modifying HTML responses on the fly
- Geolocation-based content delivery
- Custom error pages

**Basic Worker example:**

```javascript
export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Redirect /old-page to /new-page
    if (url.pathname === '/old-page') {
      return Response.redirect('https://example.com/new-page', 301);
    }

    // Add custom headers
    const response = await fetch(request);
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('X-Custom-Header', 'Hello from Edge');

    return newResponse;
  }
};
```

**Worker with KV storage (key-value store at the edge):**

```javascript
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/config') {
      const value = await env.MY_KV.get('site-config');
      return new Response(value, {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return fetch(request);
  }
};
```

**Developing Workers locally:**

```bash
# Install Wrangler (Cloudflare's CLI)
npm install -g wrangler

# Create a new Worker project
wrangler init my-worker

# Run locally for development
wrangler dev

# Deploy to Cloudflare
wrangler deploy
```

**Pricing:**

- **Free tier:** 100,000 requests per day
- **Paid plan ($5/month):** 10 million requests per month, plus additional usage-based pricing
- KV, Durable Objects, and R2 have their own pricing tiers

---

## 9. Cloudflare Pages

**What is Cloudflare Pages?**

- A platform for deploying static sites and full-stack applications
- Similar to Vercel or Netlify, but built on Cloudflare's global edge network
- Deeply integrated with the rest of the Cloudflare ecosystem

**Features:**

- **Git integration** — connect your GitHub or GitLab repository
- **Automatic deployments** — push to your branch and Pages deploys automatically
- **Preview deployments** — every pull request gets its own preview URL
- **Custom domains** — add your own domain with automatic SSL
- **Framework support** — works with Next.js, Nuxt, Astro, SvelteKit, Remix, and any static site generator
- **Functions** — server-side logic powered by Workers

**Cloudflare Pages vs Vercel vs Netlify:**

- **Cloudflare Pages:**
  - Very generous free tier (unlimited bandwidth, unlimited requests)
  - Global edge network with Workers integration
  - Tight integration with Cloudflare services (R2, D1, KV, etc.)
  - Growing ecosystem and framework support

- **Vercel:**
  - Best-in-class Next.js support (they created Next.js)
  - Excellent developer experience
  - Serverless and edge functions
  - Can get expensive at scale

- **Netlify:**
  - Easy to use, great for JAMstack projects
  - Built-in form handling, identity, and other features
  - Serverless functions
  - Good community and plugin ecosystem

**When to use Cloudflare Pages:**

- You already use Cloudflare for DNS or CDN
- You want free unlimited bandwidth
- You need Workers at the edge for server-side logic
- You want tight integration with Cloudflare services (R2 storage, D1 database, KV)
- You are building a static or hybrid full-stack app

---

## 10. Cloudflare with Laravel

**Typical setup:**

```
User → Cloudflare (CDN + Security) → Nginx → PHP-FPM → Laravel
```

### Getting the Real Client IP

By default, when Cloudflare proxies traffic, your Laravel application sees Cloudflare's IP address instead of the actual visitor's IP. This breaks features like rate limiting, logging, and geo-detection.

**Cloudflare sends the real visitor IP in the `CF-Connecting-IP` header.**

**Configure trusted proxies in Laravel 10:**

```php
// app/Http/Middleware/TrustProxies.php
protected $proxies = '*'; // Trust all proxies (since Cloudflare acts as a proxy)
protected $headers = Request::HEADER_X_FORWARDED_FOR;
```

**Configure trusted proxies in Laravel 11:**

```php
// bootstrap/app.php
->withMiddleware(function (Middleware $middleware) {
    $middleware->trustProxies(at: '*');
})
```

### Nginx Configuration for Cloudflare

Restrict direct access to your server by only allowing Cloudflare's IP ranges:

```nginx
# /etc/nginx/conf.d/cloudflare.conf
# Only allow Cloudflare IPs to connect
# Get the updated list from: https://www.cloudflare.com/ips/

set_real_ip_from 173.245.48.0/20;
set_real_ip_from 103.21.244.0/22;
set_real_ip_from 103.22.200.0/22;
set_real_ip_from 103.31.4.0/22;
set_real_ip_from 141.101.64.0/18;
set_real_ip_from 108.162.192.0/18;
set_real_ip_from 190.93.240.0/20;
set_real_ip_from 188.114.96.0/20;
set_real_ip_from 197.234.240.0/22;
set_real_ip_from 198.41.128.0/17;
set_real_ip_from 162.158.0.0/15;
set_real_ip_from 104.16.0.0/13;
set_real_ip_from 104.24.0.0/14;
set_real_ip_from 172.64.0.0/13;
set_real_ip_from 131.0.72.0/22;

real_ip_header CF-Connecting-IP;
```

### Cache Headers from Laravel

```php
// Cache a static API response for 1 hour
return response()->json($data)
    ->header('Cache-Control', 'public, max-age=3600');

// Cache for 1 day with revalidation
return response()->json($data)
    ->header('Cache-Control', 'public, max-age=86400, must-revalidate');

// Never cache sensitive or user-specific data
return response()->json($userData)
    ->header('Cache-Control', 'no-store, private');
```

---

## 11. Cloudflare with Next.js / Vercel

### If Using Vercel for Hosting

Vercel already has its own CDN and edge network. When combining with Cloudflare:

- **Option 1 (Recommended): DNS Only (Grey Cloud)**
  - Set Cloudflare to DNS-only mode for your Vercel-hosted domain
  - Vercel handles CDN, caching, and SSL
  - No conflicts between the two CDNs

- **Option 2: Proxied (Orange Cloud) with careful configuration**
  - You can use Cloudflare proxied mode, but you must set up cache rules carefully
  - Avoid double-caching and SSL conflicts
  - Useful if you need Cloudflare-specific features (WAF custom rules, Workers, etc.)

### If Self-Hosting Next.js

Cloudflare works great as a CDN and security layer for self-hosted Next.js apps:

- Cache static assets (`/_next/static/`) aggressively with long TTLs
- Bypass cache for API routes (`/api/`) and dynamic pages
- Use Cloudflare Workers for edge middleware if needed

### Next.js Cache Headers Configuration

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        // Never cache API routes
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store' }
        ]
      },
      {
        // Cache Next.js static assets for 1 year (they have content hashes)
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }
        ]
      },
      {
        // Cache public static files for 1 week
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=604800' }
        ]
      }
    ];
  }
};
```

---

## 12. CDN Comparison

### Cloudflare

- **Best for:** overall web security and performance
- **Free tier:** very generous (unlimited bandwidth, basic WAF, DDoS protection)
- **Strengths:** DDoS protection, WAF, Workers (edge compute), DNS, easy setup
- **Weaknesses:** less granular control than some alternatives, limited free plan Page Rules

### AWS CloudFront

- **Best for:** applications already running on AWS
- **Pairs with:** S3, Lambda@Edge, API Gateway
- **Strengths:** deep AWS integration, fine-grained control, pay-as-you-go
- **Weaknesses:** complex configuration, no free tier (pay per request + data transfer)

### Vercel Edge Network

- **Best for:** Next.js applications
- **Strengths:** zero-config CDN, automatic optimization, serverless and edge functions, great DX
- **Weaknesses:** can get expensive at scale, best only with Next.js

### Fastly

- **Best for:** real-time content, instant cache purge
- **Strengths:** VCL configuration language, fastest cache purge (~150ms), real-time streaming
- **Weaknesses:** expensive, steeper learning curve

### Akamai

- **Best for:** enterprise-scale applications
- **Strengths:** largest CDN network, enterprise-grade features, extensive customization
- **Weaknesses:** expensive, complex setup, requires dedicated account management

### When to Use Which

- **Small to medium projects** — Cloudflare (free, easy to set up, great security)
- **Next.js apps** — Vercel (built-in CDN, zero configuration)
- **AWS-heavy infrastructure** — CloudFront (native integration with S3, Lambda, etc.)
- **Enterprise / custom needs** — Fastly or Akamai (maximum control and scale)
- **Multiple services / microservices** — Cloudflare or CloudFront (flexible routing and rules)

---

## 13. Edge Computing

**What is edge computing?**

- Running code at locations **close to the user** instead of in a centralized data center
- The "edge" refers to the outer boundary of a network — the servers closest to end users
- The goal is to reduce latency and provide faster responses

**Edge vs Server vs Serverless:**

- **Traditional Server:**
  - Runs in one location (e.g., a VPS in New York)
  - You manage the server, OS, scaling, and everything
  - Latency increases with geographic distance from the server

- **Serverless (e.g., AWS Lambda):**
  - Cloud provider manages the infrastructure
  - Runs in specific regions (e.g., us-east-1, eu-west-1)
  - Still has regional latency — a Lambda in Virginia is slow for users in Australia
  - May have cold starts (delay when function has not been used recently)

- **Edge (e.g., Cloudflare Workers):**
  - Runs at 300+ locations worldwide
  - Code executes at the location closest to the user
  - Minimal latency regardless of user location
  - No cold starts (code is always warm at the edge)

**Edge computing platforms:**

- **Cloudflare Workers** — JavaScript/TypeScript at 300+ locations, KV storage, Durable Objects
- **Vercel Edge Functions** — edge runtime for Next.js middleware and API routes
- **Deno Deploy** — TypeScript/JavaScript at the edge, built on Deno runtime
- **Netlify Edge Functions** — edge compute powered by Deno, integrated with Netlify

**Use cases for edge computing:**

- **Authentication / authorization checks** — validate tokens at the edge before hitting origin
- **A/B testing** — route users to different variants without origin involvement
- **Geolocation-based content** — serve different content based on user's country or city
- **API rate limiting** — enforce rate limits at the edge to protect your origin
- **URL rewriting and redirects** — handle routing logic at the edge
- **Personalization** — customize responses based on cookies, headers, or geolocation
- **Bot detection** — filter out bad traffic before it reaches your server

---

## 14. Performance Optimization with CDN

### Cache Static Assets with Content Hashing

- Use content hashing (cache busting) in filenames so you can set long cache TTLs
- When the file content changes, the hash changes, and the browser fetches the new version

```
style.abc123.css  → changes to → style.def456.css (when CSS is updated)
app.xyz789.js     → changes to → app.uvw012.js (when JS is updated)
```

- Most build tools (Webpack, Vite, Next.js) do this automatically

### Set Immutable Cache for Hashed Files

```
Cache-Control: public, max-age=31536000, immutable
```

- `immutable` tells the browser not to even check for updates — the file will never change at this URL
- Only use this for files with content hashes in the filename

### Compression

- Cloudflare automatically compresses responses using **Brotli** and **Gzip**
- Brotli provides better compression ratios than Gzip (especially for text-based assets)
- No configuration needed — Cloudflare enables this by default

### HTTP/2 and HTTP/3 (QUIC)

- **HTTP/2** — multiplexing (multiple requests over one connection), header compression, server push
- **HTTP/3 (QUIC)** — built on UDP, faster connection setup, better performance on unreliable networks
- Cloudflare enables both by default — no configuration needed

### Minimize Origin Requests

- Cache HTML pages when possible (for static or semi-static pages)
- Use `stale-while-revalidate` to serve cached content while fetching a fresh copy in the background:

```
Cache-Control: public, max-age=60, stale-while-revalidate=3600
```

- This serves the cached version immediately and updates the cache in the background

### Image Optimization

- **Cloudflare Polish** — automatically compresses images (lossless or lossy) without changing URLs
- **Cloudflare Images** — resize, crop, and optimize images on the fly via URL parameters
- **External alternatives:** Cloudinary, imgix, Bunny Optimizer
- Always serve images in modern formats (WebP, AVIF) when supported by the browser

### Minification

- Cloudflare can automatically minify JavaScript, CSS, and HTML
- Removes whitespace, comments, and unnecessary characters
- Reduces file size and improves load times
- Enable in Cloudflare dashboard under Speed > Optimization

### Early Hints (103)

- Cloudflare can send **103 Early Hints** to the browser before the full response is ready
- The browser starts loading critical resources (CSS, fonts, JS) while waiting for the HTML
- Improves perceived load time significantly
- Enable in Cloudflare dashboard — works automatically once turned on

---

## 15. Best Practices

**SSL/TLS:**

- Always use **Full (Strict)** SSL mode in Cloudflare
- Enable **Always Use HTTPS** to redirect all HTTP traffic
- Install a **Cloudflare Origin Certificate** on your server
- Set minimum TLS version to 1.2

**Caching:**

- Cache static assets aggressively with long TTLs (1 year for hashed files)
- Bypass cache for API routes and dynamic content
- Use **content hashing** (cache busting) for static assets so you can cache indefinitely
- Set appropriate TTLs: long for static assets, short or none for dynamic content
- Test your caching by checking response headers:
  - `CF-Cache-Status: HIT` — served from Cloudflare cache
  - `CF-Cache-Status: MISS` — fetched from origin
  - `CF-Cache-Status: DYNAMIC` — not eligible for caching

**Security:**

- Use rate limiting on login pages and API endpoints
- Enable bot management to block scrapers and credential stuffers
- Configure WAF managed rulesets (Cloudflare + OWASP)
- Use IP Access Rules to allowlist/blocklist as needed

**Server Configuration:**

- Configure **trusted proxies** in Laravel (or your framework) to get real client IPs
- Set up Nginx to only accept traffic from Cloudflare IP ranges
- Keep DNS records **proxied** (orange cloud) unless you have a specific reason not to

**Deployments:**

- Purge cache after deployments — automate with the Cloudflare API or CI/CD pipelines

```bash
# Purge entire cache via Cloudflare API
curl -X POST "https://api.cloudflare.com/client/v4/zones/YOUR_ZONE_ID/purge_cache" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'
```

- Use preview deployments (Cloudflare Pages) to test before going live

**Monitoring:**

- Monitor traffic and performance with **Cloudflare Analytics**
- Set up alerts for DDoS attacks, high error rates, or unusual traffic patterns
- Review WAF logs regularly to identify blocked threats

**Edge Computing:**

- Use Workers for edge logic instead of hitting your origin server
- Keep Worker code lightweight and fast — edge functions should respond in milliseconds
- Use KV or D1 for data that Workers need to access at the edge
