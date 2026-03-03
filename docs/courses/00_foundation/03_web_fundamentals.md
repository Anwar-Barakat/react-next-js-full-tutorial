# Web Fundamentals

Understand how the web works before you start building for it. This lecture covers the core concepts that underpin all web development.

---

## Learning Objectives

- Understand how the internet and web work
- Learn about client-server architecture
- Understand HTTP requests and responses
- Learn about URLs, domains, and DNS
- Understand web browsers and rendering
- Know the difference between frontend and backend
- Understand APIs and web services

---

## Prerequisites

- Basic computer literacy
- Web browser installed
- Curiosity about how websites work

---

## How Did We Get Here?

### The Internet (1960s-1980s)

- Created by US Department of Defense (ARPANET)
- Network of computers connected globally
- Uses TCP/IP protocol to communicate
- Think of it as the **infrastructure** (like roads)

### The World Wide Web (1989)

- Created by Tim Berners-Lee at CERN
- System for sharing documents over the internet
- Introduced HTML, HTTP, and URLs
- Think of it as **one service** running on the internet (like cars on roads)

**Key Point**: Internet ≠ Web
- **Internet**: The network infrastructure
- **Web**: One application that runs on the internet (along with email, file transfer, etc.)

---

## Client-Server Architecture

### The Basic Model

```
┌─────────┐                    ┌─────────┐
│ CLIENT  │ ─────Request────>  │ SERVER  │
│(Browser)│                     │ (Web)   │
│         │ <────Response──     │         │
└─────────┘                     └─────────┘
```

### The Client (Frontend)

**What**: Your web browser (Chrome, Firefox, Safari)

**Role**:
- Requests web pages from servers
- Displays content to users
- Executes JavaScript code
- Handles user interactions

**Technologies**:
- HTML (structure)
- CSS (styling)
- JavaScript (interactivity)

### The Server (Backend)

**What**: A computer that hosts websites and applications

**Role**:
- Receives requests from clients
- Processes business logic
- Accesses databases
- Returns responses (HTML, JSON, etc.)

**Technologies**:
- PHP, Python, Node.js, Ruby, Java
- Databases (MySQL, PostgreSQL, MongoDB)
- Web servers (Apache, NGINX)

---

## HTTP: The Language of the Web

### What is HTTP?

**HTTP** (HyperText Transfer Protocol) is how clients and servers communicate.

Think of it as a **conversation protocol**:
- Client: "Can I have the homepage?"
- Server: "Here's the HTML for the homepage"

### HTTPS

**HTTPS** = HTTP + **S**ecurity (SSL/TLS encryption)
- Encrypts data between client and server
- Prevents eavesdropping
- Required for secure sites (login, payments)
- Look for the 🔒 padlock in browser

### HTTP Methods (Verbs)

Different types of requests:

**GET** - Retrieve data
```
GET /products
"Show me all products"
```

**POST** - Create new data
```
POST /products
"Create a new product with this data"
```

**PUT** - Update existing data
```
PUT /products/42
"Update product #42 with this data"
```

**DELETE** - Remove data
```
DELETE /products/42
"Delete product #42"
```

**Others**: PATCH (partial update), HEAD, OPTIONS

### HTTP Status Codes

Responses include status codes:

**2xx - Success** ✅
- `200 OK` - Request successful
- `201 Created` - New resource created

**3xx - Redirection** ↪️
- `301 Moved Permanently` - Resource moved
- `302 Found` - Temporary redirect

**4xx - Client Errors** ❌
- `400 Bad Request` - Invalid request
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - No permission
- `404 Not Found` - Resource doesn't exist

**5xx - Server Errors** 💥
- `500 Internal Server Error` - Server crashed
- `502 Bad Gateway` - Upstream server error
- `503 Service Unavailable` - Server overloaded

### Request & Response Example

**Request**:
```http
GET /api/users/42 HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0
Accept: application/json
```

**Response**:
```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 82

{
  "id": 42,
  "name": "John Doe",
  "email": "john@example.com"
}
```

---

## URLs: Web Addresses

### Anatomy of a URL

```
https://www.example.com:443/path/to/page?id=42&sort=asc#section

│     │ │   │         │ │   │          │            │       │
│     │ │   │         │ │   │          │            │       └─ Fragment (anchor)
│     │ │   │         │ │   │          │            └─ Query string
│     │ │   │         │ │   │          └─ Path
│     │ │   │         │ │   └─ Port (optional, default 80/443)
│     │ │   │         │ └─ Domain
│     │ │   │         └─ Subdomain
│     │ │   └─ Top-level domain (TLD)
│     │ └─ Protocol
└─────┴─ Scheme
```

### Components Explained

**Protocol**: `https://`
- How to access the resource
- `http://`, `https://`, `ftp://`, etc.

**Domain**: `example.com`
- Human-readable address
- Maps to IP address via DNS

**Subdomain**: `www` or `api` or `blog`
- Optional prefix to domain
- Can point to different servers

**Port**: `:443` (usually hidden)
- HTTP default: 80
- HTTPS default: 443
- Custom: `:3000`, `:8080`, etc.

**Path**: `/path/to/page`
- Location of resource on server
- Like folders on your computer

**Query String**: `?id=42&sort=asc`
- Parameters passed to server
- Format: `?key=value&key2=value2`

**Fragment**: `#section`
- Scrolls to specific part of page
- Not sent to server

---

## DNS: The Internet's Phone Book

### How DNS Works

1. You type: `www.example.com`
2. Browser asks DNS: "What's the IP address?"
3. DNS responds: `93.184.216.34`
4. Browser connects to that IP address

```
www.example.com  ─DNS Lookup→  93.184.216.34
(Human-friendly)                (Computer-friendly)
```

### IP Addresses

**IPv4**: `192.168.1.1`
- 4 numbers (0-255) separated by dots
- Running out of addresses

**IPv6**: `2001:0db8:85a3:0000:0000:8a2e:0370:7334`
- Longer format
- Solves IPv4 shortage

---

## How Browsers Work

### The Rendering Process

```
1. User enters URL
   ↓
2. DNS Lookup (domain → IP)
   ↓
3. HTTP Request sent to server
   ↓
4. Server processes request
   ↓
5. Server returns HTML response
   ↓
6. Browser parses HTML
   ↓
7. Browser requests CSS, JS, images
   ↓
8. Browser constructs DOM (Document Object Model)
   ↓
9. Browser applies CSS styles
   ↓
10. Browser executes JavaScript
   ↓
11. Page is rendered on screen
```

### Browser Components

**Rendering Engine**
- Chrome/Edge: Blink
- Firefox: Gecko
- Safari: WebKit

**JavaScript Engine**
- Chrome/Edge: V8
- Firefox: SpiderMonkey
- Safari: JavaScriptCore

**DevTools**
- Inspect HTML/CSS
- Debug JavaScript
- Monitor network requests
- Essential for development!

---

## Frontend vs Backend vs Full-Stack

### Frontend (Client-Side)

**What users see and interact with**

**Responsibilities**:
- User interface (UI)
- User experience (UX)
- Presentation logic
- Client-side validation
- Interactivity

**Technologies**:
- HTML, CSS, JavaScript
- React, Vue, Angular
- Tailwind, Bootstrap

**Example**:
- Displaying a login form
- Validating email format before submitting
- Showing error messages in red

### Backend (Server-Side)

**What users don't see**

**Responsibilities**:
- Business logic
- Database operations
- Authentication/Authorization
- API endpoints
- Server-side validation
- Security

**Technologies**:
- PHP, Python, Node.js, Ruby, Java
- Laravel, Django, Express
- MySQL, PostgreSQL, MongoDB

**Example**:
- Checking if email exists in database
- Hashing passwords
- Creating session tokens
- Sending emails

### Full-Stack

**Both frontend AND backend**

A full-stack developer can:
- Build complete applications independently
- Understand the entire system
- Make better architectural decisions
- **This is what you're learning in this course!**

---

## Static vs Dynamic Websites

### Static Websites

**Definition**: Same content for everyone, doesn't change without editing files

**Example**: Portfolio, blog (without CMS)

**How it works**:
```
Client requests page → Server sends HTML file → Done
```

**Pros**:
- Fast (no server processing)
- Simple hosting
- Secure (no database)

**Cons**:
- No user-specific content
- Can't have user accounts
- Hard to update at scale

### Dynamic Websites

**Definition**: Content generated on-the-fly based on database, user, time, etc.

**Example**: Facebook, Twitter, e-commerce

**How it works**:
```
Client requests page
  → Server runs code
    → Queries database
      → Generates HTML
        → Sends to client
```

**Pros**:
- User-specific content
- Real-time updates
- User accounts and authentication
- Scalable content management

**Cons**:
- Slower (server processing)
- More complex
- Requires database

---

## APIs: Application Programming Interfaces

### What is an API?

An **interface** that allows different software to communicate.

**Real-world analogy**: A restaurant menu
- You don't need to know how food is cooked (backend)
- You just order from the menu (API)
- Kitchen prepares and returns food (response)

### REST APIs

**REST** (Representational State Transfer) is the most common API architecture for web services.

**RESTful endpoints** example:
```
GET    /api/users           # Get all users
GET    /api/users/42        # Get user #42
POST   /api/users           # Create new user
PUT    /api/users/42        # Update user #42
DELETE /api/users/42        # Delete user #42
```

### JSON: Data Format

**JSON** (JavaScript Object Notation) is how APIs typically send data:

```json
{
  "id": 42,
  "name": "John Doe",
  "email": "john@example.com",
  "active": true,
  "roles": ["user", "admin"]
}
```

Why JSON?
- Human-readable
- Lightweight
- Supported by all languages
- Easy to parse

---

## Web Hosting & Deployment

### Where Websites Live

**Shared Hosting**
- Share server with other sites
- Cheap ($5-10/month)
- Good for small sites
- Example: Bluehost, HostGator

**VPS (Virtual Private Server)**
- Your own virtual server
- More control
- Medium price ($20-50/month)
- Example: DigitalOcean, Linode

**Cloud Hosting**
- Scalable infrastructure
- Pay per use
- Complex but powerful
- Example: AWS, Google Cloud, Azure

**Managed Platforms**
- Easy deployment
- Built-in features
- Medium cost
- Example: Vercel, Netlify, Heroku

---

## Security Basics

### HTTPS (SSL/TLS)

- Encrypt data in transit
- Prevent man-in-the-middle attacks
- Required for production sites

### Authentication vs Authorization

**Authentication**: "Who are you?"
- Login with username/password
- Verify identity

**Authorization**: "What are you allowed to do?"
- Check permissions
- Role-based access

### Common Security Threats

**SQL Injection**
- Malicious SQL queries
- **Prevention**: Use prepared statements

**XSS (Cross-Site Scripting)**
- Inject malicious JavaScript
- **Prevention**: Sanitize user input

**CSRF (Cross-Site Request Forgery)**
- Trick users into unwanted actions
- **Prevention**: Use CSRF tokens

**DDoS (Distributed Denial of Service)**
- Overwhelm server with requests
- **Prevention**: Rate limiting, CDN

---

## Performance Concepts

### Latency
Time for data to travel from server to client

**Reduce with**:
- CDN (Content Delivery Network)
- Closer servers
- HTTP/2

### Bandwidth
Amount of data transferred

**Reduce with**:
- Image compression
- Minification (CSS/JS)
- Gzip compression

### Caching
Storing copies of data for faster access

**Types**:
- Browser cache
- CDN cache
- Server cache (Redis)
- Database cache

---

## Developer Tools (Browser DevTools)

### Essential Tabs

**Elements**
- Inspect HTML structure
- View/edit CSS in real-time

**Console**
- View JavaScript errors
- Run JavaScript code
- See console.log() output

**Network**
- View all HTTP requests
- See response times
- Debug API calls

**Application**
- View cookies
- Check LocalStorage
- Inspect service workers

**Sources**
- Debug JavaScript
- Set breakpoints
- Step through code

### Opening DevTools

- **Chrome/Edge**: F12 or Cmd+Option+I (Mac) / Ctrl+Shift+I (Windows)
- **Firefox**: F12 or Cmd+Option+I (Mac) / Ctrl+Shift+I (Windows)
- **Safari**: Cmd+Option+I (enable Developer menu first)

---

## Hands-On Exercise

### Inspect a Real Website

1. Go to any website (e.g., github.com)
2. Open DevTools (F12)
3. **Elements Tab**:
   - Hover over HTML elements
   - Edit text content
   - Change CSS styles
4. **Network Tab**:
   - Refresh the page
   - See all requests
   - Find the slowest resource
5. **Console Tab**:
   - Type: `document.title`
   - Type: `alert("Hello World")`
6. Find answers:
   - How many HTTP requests?
   - Total page size?
   - Load time?
   - What JavaScript libraries are used?

---

## Assignment

**Objective**: Understand how the web works through exploration

**Tasks**:

1. **URL Analysis**: Break down this URL into all its components:
   ```
   https://shop.example.com:8080/products/shoes?color=blue&size=10#reviews
   ```

2. **HTTP Methods**: Match each action to the correct HTTP method:
   - Viewing a product page
   - Creating a new account
   - Updating your profile
   - Deleting a comment

3. **DevTools Exploration**: Pick 3 different websites and for each:
   - Open DevTools → Network tab
   - Refresh the page
   - Find:
     - Number of requests
     - Total page size
     - Largest file
     - Response time
   - Screenshot the Network tab

4. **Frontend vs Backend**: List 5 examples each of frontend and backend tasks

5. **Research**: Write a short paragraph (5-10 sentences) explaining:
   - How a web page loads (from typing URL to seeing content)

**Submission**: Document with answers and screenshots

**Evaluation Criteria**:
- Correct URL breakdown (20%)
- HTTP methods correctly matched (20%)
- DevTools analysis complete (30%)
- Clear understanding of frontend/backend (15%)
- Accurate explanation of page loading (15%)

---

## Common Mistakes & Troubleshooting

**Confusion 1**: Internet vs Web
- **Remember**: Internet is infrastructure, Web runs on it

**Confusion 2**: Client vs Server
- **Remember**: Client requests, Server responds

**Confusion 3**: Frontend vs Backend
- **Remember**: Frontend = what you see, Backend = what you don't

**Confusion 4**: HTTP methods
- **Remember**: GET = read, POST = create, PUT = update, DELETE = delete

---

## Summary

- **Internet** = global network infrastructure
- **Web** = one service running on the internet
- **Client-Server** = request-response model
- **HTTP** = protocol for web communication
- **URLs** = web addresses with multiple components
- **DNS** = translates domains to IP addresses
- **Frontend** = what users see (HTML/CSS/JS)
- **Backend** = server logic and databases
- **APIs** = interfaces for software communication
- **Full-Stack** = both frontend and backend

---

## Next Steps

1. ✅ Understand these core concepts
2. ✅ Complete the assignment
3. → Proceed to [Module 1: HTML & CSS](../01_html_css/01_html_structure.md)
4. → Explore DevTools regularly when browsing
5. → Start thinking about how websites work

---

## Additional Resources

- [How the Web Works - MDN](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/How_the_Web_works)
- [HTTP: The Protocol Every Web Developer Must Know](https://code.tutsplus.com/tutorials/http-the-protocol-every-web-developer-must-know-part-1--net-31177)
- [What Happens When You Type a URL](https://github.com/alex/what-happens-when)
- [HTTP Status Codes](https://httpstatuses.com/)
- [REST API Tutorial](https://restfulapi.net/)
- [Chrome DevTools Docs](https://developer.chrome.com/docs/devtools/)

---

**Now you understand how the web works! Ready to start building. 🌐**
