# Frontend Authentication Patterns

Authentication patterns for React, TypeScript, and Next.js.

---

## 1. Frontend Authentication Concepts

- **JWT (token-based):** Signed token sent in `Authorization` header; stateless
- **Session-based:** Session ID stored in a cookie; server maintains session state
- JWT structure: `header.payload.signature` — payload holds `userId`, `role`, `exp`; not encrypted, never store secrets in it
- **Access token:** Short-lived (5–30 min). **Refresh token:** Long-lived (days/weeks) used to obtain new access tokens

**JWT Storage:**

| Option | XSS | CSRF | Notes |
|---|---|---|---|
| `localStorage` | Vulnerable | Immune | Simple, persists across sessions |
| `sessionStorage` | Vulnerable | Immune | Cleared on tab close |
| `httpOnly` cookie | Immune | Mitigated by `SameSite` | **Recommended** |

```typescript
// Server sets httpOnly cookie (Express example)
res.cookie("accessToken", token, {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  maxAge: 15 * 60 * 1000,
  path: "/",
});

// Frontend — browser sends cookie automatically
const response = await fetch("/api/profile", { credentials: "include" });
```

---

## 2. Protected Routes in React

**AuthContext + ProtectedRoute pattern:**

```tsx
// context/AuthContext.tsx
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

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => setUser(data))
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    if (!r.ok) throw new Error("Login failed");
    setUser(await r.json());
  };

  const logout = () => {
    fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
```

```tsx
// components/ProtectedRoute.tsx
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  return <>{children}</>;
};

// App.tsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
</Routes>
```

---

## 3. Protected Routes in Next.js

**Method 1: Middleware (recommended)**

```typescript
// middleware.ts
const protectedRoutes = ["/dashboard", "/profile", "/settings"];
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  if (protectedRoutes.some((r) => pathname.startsWith(r)) && !token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (authRoutes.some((r) => pathname.startsWith(r)) && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/login", "/register"],
};
```

**Method 2: Server-side auth helper**

```typescript
// lib/auth.ts
export async function requireAuth(): Promise<User> {
  const token = (await cookies()).get("accessToken")?.value;
  if (!token) redirect("/login");
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as User;
  } catch {
    redirect("/login");
  }
}

// app/settings/page.tsx
export default async function SettingsPage() {
  const user = await requireAuth(); // redirects if not authenticated
  return <h1>Settings for {user.name}</h1>;
}
```

**Method 3: Layout-level protection (route groups)**

```tsx
// app/(protected)/layout.tsx
export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireAuth();
  return <>{children}</>;
}
// All pages under app/(protected)/ inherit this check automatically
```

---

## 4. Axios Interceptors for Auth

Automatically attach tokens and handle silent token refresh on 401 errors.

```typescript
// services/api.ts
const api = axios.create({ baseURL: process.env.REACT_APP_API_URL, withCredentials: true });

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 with token refresh and request queue
let isRefreshing = false;
let failedQueue: Array<{ resolve: (v: unknown) => void; reject: (r: unknown) => void }> = [];

const processQueue = (error: AxiosError | null, token: string | null) => {
  failedQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token)));
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    if (error.response?.status !== 401 || originalRequest._retry) return Promise.reject(error);

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) throw new Error("No refresh token");
      const { data } = await axios.post(`${api.defaults.baseURL}/auth/refresh`, { refreshToken });
      tokenStorage.setAccessToken(data.accessToken);
      processQueue(null, data.accessToken);
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(originalRequest);
    } catch (err) {
      processQueue(err as AxiosError, null);
      tokenStorage.clearTokens();
      window.location.href = "/login";
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);
```

- `_retry` flag prevents infinite retry loops
- Queue mechanism ensures a single refresh call for concurrent 401s

---

## 5. NextAuth.js (Auth.js)

Supports 50+ OAuth providers, JWT and database sessions, automatic CSRF protection.

```bash
npm install next-auth
```

```typescript
// lib/authOptions.ts
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.API_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });
        const user = await res.json();
        return res.ok && user
          ? { id: user.id, name: user.name, email: user.email, role: user.role }
          : null;
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.role = user.role; token.id = user.id; }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
  pages: { signIn: "/login", error: "/auth/error" },
  secret: process.env.NEXTAUTH_SECRET,
};
```

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions";
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

```tsx
// Client component
const { data: session, status } = useSession();
// status: "loading" | "authenticated" | "unauthenticated"

// Server component / API route
const session = await getServerSession(authOptions);
if (!session) redirect("/login");
```

**Extend session types:**

```typescript
// types/next-auth.d.ts
declare module "next-auth" {
  interface Session {
    user: { id: string; role: string } & DefaultSession["user"];
  }
  interface User { role: string; }
}
```

---

## 6. Role-Based Access Control (RBAC)

Frontend RBAC is for UX only — always enforce roles on the backend too.

```typescript
// lib/permissions.ts
export type Role = "admin" | "editor" | "viewer";
export type Permission = "users:read" | "users:create" | "posts:read" | "posts:create" | "settings:read";

const rolePermissions: Record<Role, Permission[]> = {
  admin: ["users:read","users:create","posts:read","posts:create","settings:read"],
  editor: ["users:read","posts:read","posts:create","settings:read"],
  viewer: ["users:read","posts:read","settings:read"],
};

export const hasPermission = (role: Role, permission: Permission) =>
  rolePermissions[role]?.includes(permission) ?? false;
```

```tsx
// components/Can.tsx — permission-gated rendering
export default function Can({ permission, children, fallback = null }: {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const { user } = useAuth();
  if (!user || !hasPermission(user.role as Role, permission)) return <>{fallback}</>;
  return <>{children}</>;
}

// Usage:
// <Can permission="posts:create"><button>New Post</button></Can>
```

---

## 7. Auth State with Zustand

```typescript
// stores/authStore.ts
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null, accessToken: null, isAuthenticated: false, isLoading: true,
      setAuth: (user, token) =>
        set({ user, accessToken: token, isAuthenticated: true, isLoading: false }),
      clearAuth: () =>
        set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false }),
      checkAuth: async () => {
        try {
          set({ isLoading: true });
          const r = await fetch("/api/auth/me", { credentials: "include" });
          if (r.ok) {
            const { user } = await r.json();
            set({ user, isAuthenticated: true, isLoading: false });
          } else get().clearAuth();
        } catch { get().clearAuth(); }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({ user: s.user, accessToken: s.accessToken, isAuthenticated: s.isAuthenticated }),
    }
  )
);

// Access outside React (e.g. in Axios interceptors):
// useAuthStore.getState().accessToken
```

---

## 8. Logout and Token Cleanup

```typescript
// hooks/useLogout.ts
export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const router = useRouter();
  const queryClient = useQueryClient();

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      sessionStorage.clear();
      clearAuth();
      queryClient.clear();
      router.push("/login");
    }
  };

  return { logout };
}
```

```typescript
// app/api/auth/logout/route.ts
export async function POST() {
  const cookieStore = await cookies();
  const expired = { httpOnly: true, secure: true, sameSite: "lax" as const, maxAge: 0, path: "/" };
  cookieStore.set("accessToken", "", expired);
  cookieStore.set("refreshToken", "", expired);
  return NextResponse.json({ message: "Logged out successfully" });
}
```

---

## 9. Security Best Practices

**Secure cookie flags:**
```typescript
res.cookie("accessToken", token, {
  httpOnly: true,   // Blocks XSS token theft
  secure: true,     // HTTPS only
  sameSite: "lax",  // Blocks CSRF
  maxAge: 900000,   // 15 min
  path: "/",
});
```

**Security headers (`next.config.js`):**
```typescript
module.exports = {
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self';" },
      ],
    }];
  },
};
```

**Additional:**
- Short-lived access tokens (5–15 min) with refresh token rotation
- Rate-limit login endpoints; add account lockout on repeated failures
- Never log tokens or passwords
- Never put tokens in URLs (leak via history, logs, referrer headers)
- If using `dangerouslySetInnerHTML`, sanitize with `DOMPurify.sanitize(html)` first
- Never commit secrets — use `.env` files in `.gitignore`
