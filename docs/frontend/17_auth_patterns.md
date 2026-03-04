# Frontend Authentication Patterns

A comprehensive guide to authentication patterns on the frontend using React, TypeScript, and Next.js.

---

## Table of Contents

1. [What is Frontend Authentication?](#1-what-is-frontend-authentication)
2. [JWT Storage Strategies](#2-jwt-storage-strategies)
3. [Protected Routes in React](#3-protected-routes-in-react)
4. [Protected Routes in Next.js](#4-protected-routes-in-nextjs)
5. [Authentication Flow Step by Step](#5-authentication-flow-step-by-step)
6. [Axios Interceptors for Auth](#6-axios-interceptors-for-auth)
7. [What is NextAuth.js (Auth.js)?](#7-what-is-nextauthjs-authjs)
8. [NextAuth.js Session Management](#8-nextauthjs-session-management)
9. [Role-Based Access Control on Frontend](#9-role-based-access-control-on-frontend)
10. [Auth State Management](#10-auth-state-management)
11. [Logout and Token Cleanup](#11-logout-and-token-cleanup)
12. [Security Best Practices](#12-security-best-practices)

---

## 1. What is Frontend Authentication?

Frontend authentication is the process of verifying a user's identity from the client side and controlling access to pages, components, and API calls based on that identity.

**How it works at a high level:**

- The user submits credentials (email/password, OAuth, etc.) to a backend server.
- The server validates the credentials and returns a **token** or creates a **session**.
- The frontend stores this token/session identifier and includes it in subsequent requests.
- The server checks the token/session on every request to confirm the user is authenticated.

**Tokens vs. Sessions:**

- **Token-based (JWT):**
  - The server issues a JSON Web Token containing encoded user data and a signature.
  - The frontend stores and sends this token with every request (usually in the `Authorization` header).
  - The server verifies the token's signature without needing to look anything up in a database.
  - Stateless -- the server does not need to track active sessions.

- **Session-based:**
  - The server creates a session record (in memory, database, or Redis) and sends back a session ID.
  - The session ID is stored in a cookie and sent automatically with every request.
  - The server looks up the session ID to find the associated user data.
  - Stateful -- the server must maintain session storage.

**What a JWT looks like:**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDAzNjAwfQ.signature
```

- A JWT has three parts separated by dots: **Header**, **Payload**, **Signature**.
- The payload contains claims like `userId`, `email`, `role`, `exp` (expiration).
- The signature ensures the token has not been tampered with.
- JWTs are **not encrypted** -- anyone can decode the payload. Never store secrets in them.

**Key concepts for frontend developers:**

- **Access Token:** A short-lived token (5-30 minutes) used to access protected resources.
- **Refresh Token:** A long-lived token (days/weeks) used to obtain a new access token when it expires.
- **Token Expiration:** Tokens have an `exp` claim. The frontend must handle expired tokens gracefully.
- **Authentication vs. Authorization:** Authentication verifies *who* the user is. Authorization determines *what* they can do.

---

## 2. JWT Storage Strategies

Where you store tokens on the frontend has significant security implications. There are three main options, each with trade-offs.

**Option 1: localStorage**

- Data persists even after the browser is closed.
- Accessible via `window.localStorage.getItem("token")`.
- Capacity of about 5-10 MB per origin.

```typescript
// Storing a token
localStorage.setItem("accessToken", token);

// Reading a token
const token = localStorage.getItem("accessToken");

// Removing a token
localStorage.removeItem("accessToken");
```

- Pros:
  - Simple API, easy to implement.
  - Persists across browser sessions.
  - Not sent automatically with requests (you control when it is sent).

- Cons:
  - **Vulnerable to XSS attacks.** Any JavaScript running on the page can read `localStorage`.
  - If a malicious script is injected (through an npm package, ad script, or input vulnerability), it can steal the token.

**Option 2: sessionStorage**

- Data is cleared when the browser tab is closed.
- Accessible via `window.sessionStorage.getItem("token")`.
- Same API as `localStorage`.

```typescript
// Storing a token
sessionStorage.setItem("accessToken", token);

// Reading a token
const token = sessionStorage.getItem("accessToken");

// Removing a token
sessionStorage.removeItem("accessToken");
```

- Pros:
  - Automatically cleared when the tab closes (limits exposure window).
  - Not shared across tabs (more isolated).

- Cons:
  - **Still vulnerable to XSS** -- same as `localStorage`.
  - The user must log in again when opening a new tab.
  - Poor user experience for multi-tab workflows.

**Option 3: httpOnly Cookies (Recommended)**

- Cookies are set by the server with the `HttpOnly` flag.
- JavaScript **cannot** read `httpOnly` cookies -- they are invisible to `document.cookie`.
- The browser automatically attaches them to every request to the same origin.

```typescript
// Server-side (Express example) -- setting the cookie
res.cookie("accessToken", token, {
  httpOnly: true,   // Not accessible via JavaScript
  secure: true,     // Only sent over HTTPS
  sameSite: "lax",  // CSRF protection
  maxAge: 15 * 60 * 1000, // 15 minutes
  path: "/",
});

// Frontend -- no need to manually attach the token
// The browser sends the cookie automatically
const response = await fetch("/api/profile", {
  credentials: "include", // Required for cross-origin cookies
});
```

- Pros:
  - **Immune to XSS** -- JavaScript cannot access the token.
  - The browser handles sending the cookie automatically.
  - Can be scoped to specific paths and domains.

- Cons:
  - Requires server-side setup to issue and read cookies.
  - Vulnerable to **CSRF attacks** if `SameSite` is not configured properly.
  - Slightly more complex for cross-origin (CORS) setups.
  - Limited to about 4 KB per cookie.

**Summary of security trade-offs:**

- `localStorage` and `sessionStorage` are vulnerable to XSS but immune to CSRF.
- `httpOnly` cookies are immune to XSS but need CSRF protection.
- XSS is generally harder to fully prevent than CSRF, so **httpOnly cookies are the safest default**.
- If you must use `localStorage`, sanitize all user inputs rigorously and use Content Security Policy (CSP) headers.

---

## 3. Protected Routes in React

Protected routes prevent unauthenticated users from accessing certain pages. The standard approach is to wrap routes with a guard component that checks authentication status.

**Basic ProtectedRoute component:**

```tsx
// components/ProtectedRoute.tsx
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login, preserving the intended destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
```

**Using ProtectedRoute in your router:**

```tsx
// App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Home from "./pages/Home";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
```

**The AuthContext pattern:**

```tsx
// context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const userData = await response.json();
    setUser(userData);
  };

  const logout = () => {
    fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
```

**Wrapping your app with AuthProvider:**

```tsx
// main.tsx
import { AuthProvider } from "./context/AuthContext";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
```

**Redirecting back after login:**

```tsx
// pages/Login.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useState, FormEvent } from "react";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Where the user was trying to go before being redirected
  const from = (location.state as { from?: Location })?.from?.pathname || "/dashboard";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      navigate(from, { replace: true }); // Redirect to intended page
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
```

---

## 4. Protected Routes in Next.js

Next.js offers multiple ways to protect routes: middleware, server-side checks in Server Components, and client-side guards. The approach depends on whether you use the App Router or Pages Router.

**Method 1: Middleware (App Router -- Recommended)**

- Middleware runs **before** a request is completed.
- It can check for tokens/sessions and redirect unauthenticated users.
- Runs on the Edge Runtime, so it is fast and applies before any page rendering.

```typescript
// middleware.ts (root of the project)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/profile", "/settings"];

// Routes that should redirect authenticated users (e.g., login page)
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // Check if the current path is protected
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect unauthenticated users to login
  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from login/register
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*", "/login", "/register"],
};
```

**Method 2: Server-side auth checks in Server Components (App Router)**

```tsx
// app/dashboard/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";

interface User {
  id: number;
  name: string;
  email: string;
}

async function getUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) return null;

  try {
    const user = await verifyToken(token);
    return user;
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}
```

**Method 3: Reusable server-side auth helper**

```typescript
// lib/auth.ts
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export async function requireAuth(): Promise<User> {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as User;
    return decoded;
  } catch {
    redirect("/login");
  }
}

export async function verifyToken(token: string): Promise<User | null> {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as User;
    return decoded;
  } catch {
    return null;
  }
}
```

```tsx
// app/settings/page.tsx
import { requireAuth } from "@/lib/auth";

export default async function SettingsPage() {
  const user = await requireAuth(); // Redirects if not authenticated

  return (
    <div>
      <h1>Settings for {user.name}</h1>
      {/* Settings form here */}
    </div>
  );
}
```

**Method 4: Protecting API Routes in Next.js App Router**

```typescript
// app/api/profile/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await verifyToken(token);

  if (!user) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  return NextResponse.json({ user });
}
```

**Method 5: Layout-level protection (App Router)**

```tsx
// app/(protected)/layout.tsx
import { requireAuth } from "@/lib/auth";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth(); // Redirects if not authenticated

  return <>{children}</>;
}
```

- Any page inside the `(protected)` route group inherits this authentication check.
- Folder structure example:
  - `app/(protected)/dashboard/page.tsx`
  - `app/(protected)/profile/page.tsx`
  - `app/(protected)/settings/page.tsx`

---

## 5. Authentication Flow Step by Step

A complete authentication flow involves login, token storage, attaching tokens to requests, refreshing expired tokens, and logout.

**Step 1: User logs in**

```tsx
// services/authService.ts
import api from "./api"; // Axios instance

interface LoginResponse {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>("/auth/login", {
      email,
      password,
    });
    return response.data;
  },

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const response = await api.post("/auth/refresh", { refreshToken });
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },
};
```

**Step 2: Store the token**

```typescript
// utils/tokenStorage.ts

// Option A: localStorage (simpler, less secure)
export const tokenStorage = {
  getAccessToken: (): string | null => {
    return localStorage.getItem("accessToken");
  },

  setAccessToken: (token: string): void => {
    localStorage.setItem("accessToken", token);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem("refreshToken");
  },

  setRefreshToken: (token: string): void => {
    localStorage.setItem("refreshToken", token);
  },

  clearTokens: (): void => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  },
};

// Option B: httpOnly cookies (handled by the server -- no frontend code needed)
// The server sets cookies in the login response, and the browser
// sends them automatically on every request.
```

**Step 3: Attach token to every request**

```typescript
// services/api.ts
import axios from "axios";
import { tokenStorage } from "../utils/tokenStorage";

const api = axios.create({
  baseURL: "https://api.example.com",
  withCredentials: true, // Needed if using cookies
});

// Attach the token to every outgoing request
api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

**Step 4: Handle token expiration and refresh**

```typescript
// When a request fails with 401, try refreshing the token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenStorage.getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token");

        const { accessToken } = await authService.refreshToken(refreshToken);
        tokenStorage.setAccessToken(accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest); // Retry the original request
      } catch {
        tokenStorage.clearTokens();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
```

**Step 5: Logout**

```typescript
const handleLogout = async () => {
  try {
    await authService.logout(); // Tell the server to invalidate the session
  } finally {
    tokenStorage.clearTokens();  // Clear local tokens
    window.location.href = "/login"; // Redirect to login
  }
};
```

**Complete flow diagram (text):**

- User enters credentials and submits the login form.
- Frontend sends `POST /auth/login` with email and password.
- Server validates credentials, generates access token (short-lived) and refresh token (long-lived).
- Server returns tokens (or sets httpOnly cookies).
- Frontend stores the tokens.
- On every API call, the frontend attaches `Authorization: Bearer <token>`.
- If the server responds with 401, the frontend tries to refresh the token using the refresh token.
- If the refresh succeeds, the frontend retries the original request with the new token.
- If the refresh fails, the frontend clears all tokens and redirects to the login page.
- On logout, the frontend calls the server to invalidate the session, clears tokens, and redirects.

---

## 6. Axios Interceptors for Auth

Axios interceptors let you automatically attach tokens to requests and handle authentication errors globally.

**Setting up the Axios instance with interceptors:**

```typescript
// services/api.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "../utils/tokenStorage";

// Extend the config type to include our custom _retry flag
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://api.example.com",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// ─── Request Interceptor ──────────────────────────────────────
// Attaches the Bearer token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ─── Response Interceptor ─────────────────────────────────────
// Handles 401 errors by attempting a token refresh

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // Only handle 401 errors
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If a refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = tokenStorage.getRefreshToken();

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      // Call the refresh endpoint
      const response = await axios.post(
        `${api.defaults.baseURL}/auth/refresh`,
        { refreshToken }
      );

      const { accessToken } = response.data;
      tokenStorage.setAccessToken(accessToken);

      // Process queued requests with the new token
      processQueue(null, accessToken);

      // Retry the original request
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      }
      return api(originalRequest);
    } catch (refreshError) {
      // Refresh failed -- clear everything and redirect to login
      processQueue(refreshError as AxiosError, null);
      tokenStorage.clearTokens();
      window.location.href = "/login";
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
```

**Key points about the interceptor pattern:**

- The **request interceptor** runs before every request and attaches the `Authorization` header.
- The **response interceptor** catches 401 errors and attempts a silent token refresh.
- The `_retry` flag prevents infinite loops (so we do not keep retrying the same failed request).
- The **queue mechanism** handles concurrent requests. If multiple requests fail with 401 at the same time, only one refresh call is made. The others wait and are retried once the new token is available.
- If the refresh itself fails, all queued requests are rejected and the user is redirected to login.

**Using the configured Axios instance:**

```typescript
// No need to worry about tokens -- the interceptor handles it
const fetchProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data;
};

const updateProfile = async (data: { name: string; email: string }) => {
  const response = await api.put("/users/profile", data);
  return response.data;
};
```

---

## 7. What is NextAuth.js (Auth.js)?

NextAuth.js (now also called Auth.js) is an open-source authentication library for Next.js. It handles the complexity of OAuth flows, session management, and user account management.

**Why use NextAuth.js:**

- Built specifically for Next.js (supports both App Router and Pages Router).
- Built-in support for 50+ OAuth providers (Google, GitHub, Facebook, Discord, etc.).
- Handles token rotation, session management, and CSRF protection automatically.
- Supports database sessions and JWT sessions.
- Minimal configuration required to get started.

**Installation:**

```bash
npm install next-auth
```

**Setting up NextAuth.js with App Router:**

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

```typescript
// lib/authOptions.ts
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    // ─── Google OAuth ────────────────────────────────
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ─── GitHub OAuth ────────────────────────────────
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),

    // ─── Credentials (Email/Password) ────────────────
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Replace with your own user lookup logic
        const response = await fetch(
          `${process.env.API_URL}/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          }
        );

        const user = await response.json();

        if (response.ok && user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          };
        }

        return null; // Return null to indicate failed login
      },
    }),
  ],

  // ─── Session Configuration ───────────────────────
  session: {
    strategy: "jwt",         // Use JWT-based sessions
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // ─── JWT Callbacks ───────────────────────────────
  callbacks: {
    async jwt({ token, user }) {
      // First login -- add user data to the token
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      // Make role and id available in the session
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },

  // ─── Custom Pages ────────────────────────────────
  pages: {
    signIn: "/login",      // Custom login page
    error: "/auth/error",  // Custom error page
  },

  // ─── Secret ──────────────────────────────────────
  secret: process.env.NEXTAUTH_SECRET,
};
```

**Environment variables needed:**

```bash
# .env.local
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-key-here

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

**Adding the SessionProvider (required for client-side session access):**

```tsx
// app/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
```

```tsx
// app/layout.tsx
import Providers from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

**Custom login page with multiple providers:**

```tsx
// app/login/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { useState, FormEvent } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const handleCredentialsLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    if (result?.error) {
      setError("Invalid email or password");
    } else if (result?.url) {
      window.location.href = result.url;
    }
  };

  return (
    <div>
      <h1>Sign In</h1>

      {/* OAuth Providers */}
      <button onClick={() => signIn("google", { callbackUrl })}>
        Sign in with Google
      </button>
      <button onClick={() => signIn("github", { callbackUrl })}>
        Sign in with GitHub
      </button>

      <hr />

      {/* Credentials Form */}
      <form onSubmit={handleCredentialsLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Sign in with Email</button>
      </form>
    </div>
  );
}
```

---

## 8. NextAuth.js Session Management

NextAuth.js provides hooks and utilities to access the user session on both the client and server.

**Client-side: useSession hook**

```tsx
// components/Navbar.tsx
"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  // status can be: "loading" | "authenticated" | "unauthenticated"

  if (status === "loading") {
    return <nav>Loading...</nav>;
  }

  return (
    <nav>
      {status === "authenticated" ? (
        <>
          <span>Welcome, {session.user?.name}</span>
          <span>Role: {(session.user as any).role}</span>
          <button onClick={() => signOut({ callbackUrl: "/login" })}>
            Sign Out
          </button>
        </>
      ) : (
        <button onClick={() => signIn()}>Sign In</button>
      )}
    </nav>
  );
}
```

**Server-side: getServerSession**

```tsx
// app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {session.user?.name}</p>
      <p>Email: {session.user?.email}</p>
    </div>
  );
}
```

**Protecting API routes with getServerSession:**

```typescript
// app/api/admin/users/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if ((session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Fetch and return admin data
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}
```

**Client-side route protection with useSession:**

```tsx
// components/AuthGuard.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: string;
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (requiredRole && (session?.user as any)?.role !== requiredRole) {
      router.push("/unauthorized");
    }
  }, [status, session, requiredRole, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return null;
  }

  if (requiredRole && (session?.user as any)?.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
```

**Extending the session type with TypeScript:**

```typescript
// types/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    id: string;
  }
}
```

- After adding these type declarations, you no longer need to cast `session.user as any`.
- `session.user.role` and `session.user.id` are now properly typed.

---

## 9. Role-Based Access Control on Frontend

Role-Based Access Control (RBAC) restricts functionality based on the user's role (e.g., admin, editor, viewer). On the frontend, this means hiding UI elements, disabling actions, and guarding routes.

**Important note:** Frontend RBAC is for **user experience only**. All role checks must also happen on the backend. A user can bypass any frontend restriction using browser dev tools.

**Defining roles and permissions:**

```typescript
// lib/permissions.ts

export type Role = "admin" | "editor" | "viewer";

export type Permission =
  | "users:read"
  | "users:create"
  | "users:update"
  | "users:delete"
  | "posts:read"
  | "posts:create"
  | "posts:update"
  | "posts:delete"
  | "settings:read"
  | "settings:update";

const rolePermissions: Record<Role, Permission[]> = {
  admin: [
    "users:read",
    "users:create",
    "users:update",
    "users:delete",
    "posts:read",
    "posts:create",
    "posts:update",
    "posts:delete",
    "settings:read",
    "settings:update",
  ],
  editor: [
    "users:read",
    "posts:read",
    "posts:create",
    "posts:update",
    "settings:read",
  ],
  viewer: [
    "users:read",
    "posts:read",
    "settings:read",
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p));
}
```

**Component for conditionally rendering based on permission:**

```tsx
// components/Can.tsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import { Permission, Role, hasPermission } from "@/lib/permissions";
import { ReactNode } from "react";

interface CanProps {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

export default function Can({ permission, children, fallback = null }: CanProps) {
  const { user } = useAuth();

  if (!user) return <>{fallback}</>;

  if (!hasPermission(user.role as Role, permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
```

**Using the Can component:**

```tsx
// pages/PostsPage.tsx
import Can from "@/components/Can";

export default function PostsPage() {
  return (
    <div>
      <h1>Posts</h1>

      {/* Only admins and editors can create posts */}
      <Can permission="posts:create">
        <button>Create New Post</button>
      </Can>

      {/* Show a message if the user lacks permission */}
      <Can
        permission="posts:delete"
        fallback={<p>You do not have permission to delete posts.</p>}
      >
        <button>Delete Selected Posts</button>
      </Can>
    </div>
  );
}
```

**Protecting routes by role:**

```tsx
// components/RoleProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Role, Permission, hasPermission } from "@/lib/permissions";
import { ReactNode } from "react";

interface RoleProtectedRouteProps {
  children: ReactNode;
  requiredPermission: Permission;
}

export default function RoleProtectedRoute({
  children,
  requiredPermission,
}: RoleProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasPermission(user!.role as Role, requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
```

**Using role-protected routes:**

```tsx
// App.tsx
<Routes>
  <Route path="/posts" element={
    <RoleProtectedRoute requiredPermission="posts:read">
      <PostsPage />
    </RoleProtectedRoute>
  } />

  <Route path="/admin/users" element={
    <RoleProtectedRoute requiredPermission="users:delete">
      <AdminUsersPage />
    </RoleProtectedRoute>
  } />
</Routes>
```

**Role-based navigation:**

```tsx
// components/Sidebar.tsx
"use client";

import { useAuth } from "@/hooks/useAuth";
import { hasPermission, Role } from "@/lib/permissions";
import Link from "next/link";

export default function Sidebar() {
  const { user } = useAuth();
  const role = user?.role as Role;

  const navItems = [
    { href: "/dashboard", label: "Dashboard", permission: null },
    { href: "/posts", label: "Posts", permission: "posts:read" as const },
    { href: "/posts/new", label: "New Post", permission: "posts:create" as const },
    { href: "/admin/users", label: "Manage Users", permission: "users:delete" as const },
    { href: "/settings", label: "Settings", permission: "settings:update" as const },
  ];

  return (
    <aside>
      <nav>
        <ul>
          {navItems
            .filter((item) =>
              item.permission === null || hasPermission(role, item.permission)
            )
            .map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
        </ul>
      </nav>
    </aside>
  );
}
```

---

## 10. Auth State Management

Authentication state can be managed with React Context, Zustand, or Redux. Each approach has trade-offs in complexity and scalability.

**Option 1: React Context (simplest)**

- Best for small to medium apps.
- No external dependencies.
- Already shown in Section 3 (AuthContext pattern).

```tsx
// Recap of the pattern:
const { user, isAuthenticated, isLoading, login, logout } = useAuth();
```

- Pros:
  - Built into React, no libraries needed.
  - Easy to understand and set up.
  - Works well for simple auth state.

- Cons:
  - Re-renders all consumers when any part of the context changes.
  - Does not have built-in devtools for debugging.
  - Becomes unwieldy if auth state grows complex.

**Option 2: Zustand (recommended for most apps)**

```bash
npm install zustand
```

```typescript
// stores/authStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (user: User, token: string) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,

      setAuth: (user, token) =>
        set({
          user,
          accessToken: token,
          isAuthenticated: true,
          isLoading: false,
        }),

      setLoading: (loading) =>
        set({ isLoading: loading }),

      clearAuth: () =>
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      checkAuth: async () => {
        try {
          set({ isLoading: true });
          const response = await fetch("/api/auth/me", {
            credentials: "include",
          });

          if (response.ok) {
            const data = await response.json();
            set({
              user: data.user,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            get().clearAuth();
          }
        } catch {
          get().clearAuth();
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

**Using Zustand auth store in components:**

```tsx
// components/ProfileButton.tsx
"use client";

import { useAuthStore } from "@/stores/authStore";

export default function ProfileButton() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <a href="/login">Sign In</a>;
  }

  const handleLogout = () => {
    fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    clearAuth();
    window.location.href = "/login";
  };

  return (
    <div>
      <span>{user.name}</span>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
```

- Pros:
  - Minimal boilerplate -- no providers or reducers.
  - Selective re-renders (components only re-render when the specific slice they subscribe to changes).
  - Built-in persistence middleware.
  - Works outside of React (in Axios interceptors, utility functions, etc.).

- Cons:
  - External dependency (though very small -- about 1 KB).
  - Less familiar to developers who primarily know Redux.

**Using Zustand in Axios interceptors (works outside React):**

```typescript
// services/api.ts
import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const api = axios.create({ baseURL: "/api" });

api.interceptors.request.use((config) => {
  // Access Zustand state outside of React
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
```

**Option 3: Redux Toolkit (for large apps already using Redux)**

```bash
npm install @reduxjs/toolkit react-redux
```

```typescript
// store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message);
      }

      return await response.json();
    } catch {
      return rejectWithValue("Network error");
    }
  }
);

export const checkAuth = createAsyncThunk(
  "auth/check",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (!response.ok) {
        return rejectWithValue("Not authenticated");
      }

      return await response.json();
    } catch {
      return rejectWithValue("Network error");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Check auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
```

- Pros:
  - Powerful devtools (Redux DevTools) for debugging.
  - Works well in large apps that already use Redux for other state.
  - `createAsyncThunk` handles loading and error states cleanly.

- Cons:
  - More boilerplate than Context or Zustand.
  - Overkill if auth is the only global state you need.
  - Requires wrapping the app in a `Provider`.

**When to use which:**

- **React Context:** Small apps with simple auth needs. No external dependencies.
- **Zustand:** Medium to large apps. When you want minimal boilerplate and need to access state outside React (e.g., in Axios interceptors).
- **Redux Toolkit:** Large apps that already use Redux. When you need the Redux DevTools ecosystem.

---

## 11. Logout and Token Cleanup

A proper logout must clear all authentication state on the client and (optionally) invalidate the session on the server.

**What a complete logout should do:**

- Notify the server to invalidate the session or refresh token.
- Clear tokens from storage (localStorage, sessionStorage, cookies).
- Clear in-memory auth state (Context, Zustand, Redux).
- Clear any cached user data.
- Redirect the user to the login page.
- Optionally clear sensitive data from browser history.

**Basic logout implementation:**

```typescript
// hooks/useLogout.ts
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export function useLogout() {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const router = useRouter();
  const queryClient = useQueryClient();

  const logout = async () => {
    try {
      // Step 1: Tell the server to invalidate the session
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      // Even if the server call fails, we should still clean up locally
      console.error("Server logout failed:", error);
    } finally {
      // Step 2: Clear tokens from storage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      sessionStorage.clear();

      // Step 3: Clear auth state (Zustand)
      clearAuth();

      // Step 4: Clear cached data (React Query)
      queryClient.clear();

      // Step 5: Redirect to login
      router.push("/login");
    }
  };

  return { logout };
}
```

**Logout with NextAuth.js:**

```tsx
// components/LogoutButton.tsx
"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/login", // Where to redirect after logout
      redirect: true,
    });
  };

  return <button onClick={handleLogout}>Sign Out</button>;
}
```

**Server-side token invalidation:**

```typescript
// app/api/auth/logout/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();

  // Clear the access token cookie
  cookieStore.set("accessToken", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 0, // Expire immediately
    path: "/",
  });

  // Clear the refresh token cookie
  cookieStore.set("refreshToken", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  // Optionally: add the refresh token to a blacklist in your database
  // await db.revokedTokens.create({ data: { token: refreshToken } });

  return NextResponse.json({ message: "Logged out successfully" });
}
```

**Automatic logout on token expiration:**

```typescript
// hooks/useAutoLogout.ts
import { useEffect, useCallback } from "react";
import { useAuthStore } from "@/stores/authStore";
import { jwtDecode } from "jwt-decode";

export function useAutoLogout() {
  const { accessToken, clearAuth } = useAuthStore();

  const checkTokenExpiry = useCallback(() => {
    if (!accessToken) return;

    try {
      const decoded = jwtDecode<{ exp: number }>(accessToken);
      const expiresAt = decoded.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      const timeUntilExpiry = expiresAt - now;

      if (timeUntilExpiry <= 0) {
        // Token already expired
        clearAuth();
        window.location.href = "/login";
        return;
      }

      // Set a timer to log out when the token expires
      const timer = setTimeout(() => {
        clearAuth();
        window.location.href = "/login?reason=session_expired";
      }, timeUntilExpiry);

      return () => clearTimeout(timer);
    } catch {
      // Invalid token -- log out immediately
      clearAuth();
    }
  }, [accessToken, clearAuth]);

  useEffect(() => {
    return checkTokenExpiry();
  }, [checkTokenExpiry]);
}
```

**Logout across all tabs (using storage events):**

```typescript
// hooks/useSyncLogout.ts
import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";

export function useSyncLogout() {
  const clearAuth = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      // When another tab clears auth data, log out this tab too
      if (event.key === "auth-storage" && event.newValue === null) {
        clearAuth();
        window.location.href = "/login";
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [clearAuth]);
}
```

---

## 12. Security Best Practices

Security on the frontend is about minimizing the attack surface and following established patterns to prevent common vulnerabilities.

**XSS (Cross-Site Scripting) Prevention:**

- XSS allows attackers to inject malicious JavaScript into your app, which can steal tokens, session data, and user information.

- **How to prevent it:**
  - Never use `dangerouslySetInnerHTML` with user-provided content.
  - React automatically escapes values rendered in JSX -- do not bypass this.
  - Sanitize any HTML that must be rendered from user input using libraries like `dompurify`.
  - Use Content Security Policy (CSP) headers to restrict which scripts can execute.
  - Avoid storing sensitive tokens in `localStorage` or `sessionStorage`.

```tsx
// BAD: vulnerable to XSS
const Comment = ({ html }: { html: string }) => {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

// GOOD: sanitize first
import DOMPurify from "dompurify";

const Comment = ({ html }: { html: string }) => {
  const sanitized = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
};

// BEST: avoid dangerouslySetInnerHTML entirely when possible
const Comment = ({ text }: { text: string }) => {
  return <div>{text}</div>; // React escapes this automatically
};
```

**CSRF (Cross-Site Request Forgery) Prevention:**

- CSRF tricks a user's browser into making unwanted requests to your server while they are authenticated.

- **How to prevent it:**
  - Use `SameSite=Lax` or `SameSite=Strict` on cookies.
  - Implement CSRF tokens for state-changing requests.
  - Use the `Origin` and `Referer` headers to validate requests on the server.
  - Prefer `Authorization: Bearer` headers over cookies for APIs (Bearer tokens are not sent automatically, so CSRF is not possible).

```typescript
// Next.js middleware to verify CSRF tokens
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (["POST", "PUT", "DELETE", "PATCH"].includes(request.method)) {
    const csrfToken = request.headers.get("x-csrf-token");
    const cookieToken = request.cookies.get("csrf-token")?.value;

    if (!csrfToken || csrfToken !== cookieToken) {
      return NextResponse.json(
        { error: "Invalid CSRF token" },
        { status: 403 }
      );
    }
  }

  return NextResponse.next();
}
```

**Secure Cookie Configuration:**

```typescript
// Every auth cookie should have all of these flags
res.cookie("accessToken", token, {
  httpOnly: true,    // Prevents JavaScript access (blocks XSS token theft)
  secure: true,      // Only sent over HTTPS (blocks man-in-the-middle attacks)
  sameSite: "lax",   // Prevents CSRF (cookie not sent on cross-origin requests)
  maxAge: 900000,    // 15 minutes (short-lived reduces exposure window)
  path: "/",         // Available on all paths
  domain: ".example.com", // Scope to your domain
});
```

- `httpOnly: true` -- The single most important flag. Prevents JavaScript from reading the cookie.
- `secure: true` -- Ensures the cookie is only sent over HTTPS connections.
- `sameSite: "lax"` -- The cookie is sent on same-site requests and top-level navigations. Blocks most CSRF attacks.
- `sameSite: "strict"` -- Even more restrictive. The cookie is never sent on cross-site requests, even on navigation. Can cause usability issues (e.g., clicking a link from an email will not include the cookie).

**HTTPS Everywhere:**

- Always use HTTPS in production. Never serve authenticated pages over HTTP.
- Set `Strict-Transport-Security` (HSTS) headers to force HTTPS.
- Use `secure: true` on all cookies.

```typescript
// next.config.js -- security headers
const securityHeaders = [
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Content-Security-Policy",
    value: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';",
  },
];

module.exports = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};
```

**Additional best practices:**

- **Short-lived access tokens:** Keep access token lifetimes short (5-15 minutes). Use refresh tokens to obtain new ones.
- **Rotate refresh tokens:** Issue a new refresh token every time one is used. Invalidate the old one. This limits the damage if a refresh token is stolen.
- **Token blacklisting:** Maintain a server-side blacklist of revoked tokens for immediate invalidation on logout.
- **Rate limiting:** Implement rate limiting on login endpoints to prevent brute force attacks.
- **Input validation:** Validate all user inputs on both client and server. Never trust client-side validation alone.
- **Dependency auditing:** Regularly run `npm audit` to check for vulnerabilities in your dependencies. A compromised npm package can steal tokens.
- **Environment variables:** Never hardcode secrets (API keys, JWT secrets, OAuth credentials) in your frontend code. Use `.env` files and ensure they are in `.gitignore`.
- **Sensitive data in URLs:** Never put tokens or sensitive data in URL query parameters. They are logged in browser history, server logs, and referrer headers.
- **Logging:** Never log tokens, passwords, or sensitive user data on the client or server.

**Security checklist:**

- Tokens stored in httpOnly cookies (not localStorage).
- All cookies have `httpOnly`, `secure`, and `sameSite` flags.
- HTTPS enforced with HSTS headers.
- CSP headers configured to restrict script sources.
- User input sanitized before rendering as HTML.
- Access tokens are short-lived with refresh token rotation.
- Server validates tokens on every request (never trust the frontend alone).
- `npm audit` run regularly.
- No secrets in client-side code.
- Rate limiting on authentication endpoints.
- Logout properly clears all tokens and server sessions.

---
