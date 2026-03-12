# OAuth 2.0 & JWT Authentication Guide

---

## Table of Contents

1. [Authentication vs Authorization](#1-authentication-vs-authorization)
2. [What is JWT?](#2-what-is-jwt)
3. [JWT Authentication Flow](#3-jwt-authentication-flow)
4. [What is OAuth 2.0?](#4-what-is-oauth-20)
5. [OAuth 2.0 Grant Types](#5-oauth-20-grant-types)
6. [OAuth 2.0 Flow Step by Step](#6-oauth-20-flow-step-by-step)
7. [OpenID Connect (OIDC)](#7-openid-connect-oidc)
8. [JWT vs Session-Based Authentication](#8-jwt-vs-session-based-authentication)
9. [Refresh Token Rotation](#9-refresh-token-rotation)
10. [Token Storage Strategies](#10-token-storage-strategies)
11. [Laravel Sanctum vs Laravel Passport](#11-laravel-sanctum-vs-laravel-passport)
12. [Social Login (Laravel Socialite)](#12-social-login-laravel-socialite)
13. [Security Best Practices](#13-security-best-practices)

---

## 1. Authentication vs Authorization

- **Authentication (AuthN)** — Who are you? Verifies identity. Happens first.
- **Authorization (AuthZ)** — What can you do? Controls access. Happens after auth.

```php
// Authentication
if (Auth::attempt(['email' => $email, 'password' => $password])) { ... }

// Authorization
Gate::define('delete-post', function (User $user, Post $post) {
    return $user->id === $post->user_id;
});
```

---

## 2. What is JWT?

JWT (JSON Web Token) is a signed, self-contained token with three Base64URL-encoded parts: `Header.Payload.Signature`.

**Header:**
```json
{ "alg": "HS256", "typ": "JWT" }
```

**Payload (claims):**
```json
{
  "sub": "1234567890",
  "name": "Anwar",
  "email": "anwar@example.com",
  "role": "admin",
  "iat": 1516239022,
  "exp": 1516242622
}
```

**Signature:**
```
HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)
```

**Key points:**
- JWT is **signed** (tamper-proof) but **NOT encrypted** — anyone can decode the payload.
- Never store passwords or sensitive data in the payload.
- Use JWE (JSON Web Encryption) if the payload must be secret.

---

## 3. JWT Authentication Flow

```
1. Client: POST /api/login → { email, password }
2. Server: validates credentials, generates access_token + refresh_token
3. Client: stores tokens, sends access_token in Authorization header
4. Server: verifies signature on each request — no DB lookup needed
5. Client: when access_token expires, sends refresh_token to get a new one
```

- **Access token** — short-lived (15 min–1 hour). Sent with every request.
- **Refresh token** — long-lived (7–30 days). Used only to issue new access tokens. Store in httpOnly cookie.

**Laravel implementation (`firebase/php-jwt`):**
```php
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate(['email' => 'required|email', 'password' => 'required']);

        if (!Auth::attempt($credentials)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();

        return response()->json([
            'access_token'  => $this->createAccessToken($user),
            'refresh_token' => $this->createRefreshToken($user),
            'token_type'    => 'Bearer',
            'expires_in'    => 3600,
        ]);
    }

    private function createAccessToken(User $user): string
    {
        return JWT::encode([
            'iss'   => config('app.url'),
            'sub'   => $user->id,
            'iat'   => time(),
            'exp'   => time() + 3600,
            'name'  => $user->name,
            'email' => $user->email,
            'role'  => $user->role,
        ], config('app.jwt_secret'), 'HS256');
    }

    private function createRefreshToken(User $user): string
    {
        return JWT::encode([
            'iss'  => config('app.url'),
            'sub'  => $user->id,
            'iat'  => time(),
            'exp'  => time() + (7 * 24 * 3600),
            'type' => 'refresh',
        ], config('app.jwt_refresh_secret'), 'HS256');
    }

    public function refresh(Request $request)
    {
        try {
            $decoded = JWT::decode(
                $request->input('refresh_token'),
                new Key(config('app.jwt_refresh_secret'), 'HS256')
            );

            $user = User::findOrFail($decoded->sub);

            return response()->json([
                'access_token' => $this->createAccessToken($user),
                'token_type'   => 'Bearer',
                'expires_in'   => 3600,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid refresh token'], 401);
        }
    }
}
```

---

## 4. What is OAuth 2.0?

An **authorization framework** that allows a third-party app to obtain limited access to a user's account without knowing their password.

**Key players:**
- **Resource Owner** — the user who owns the data.
- **Client** — the app requesting access.
- **Authorization Server** — authenticates the user and issues tokens (e.g., Google).
- **Resource Server** — holds the protected data (e.g., Google Contacts API).

```
[User] → [App] → redirect → [Google Auth Server]
[Google] → asks user for permission → [User grants]
[Google] → authorization code → [App]
[App] → exchanges code + client_secret → [Google]
[Google] → access_token → [App]
[App] → access_token → [Google API] → user data
```

---

## 5. OAuth 2.0 Grant Types

### Authorization Code (server-side apps)

User is redirected to auth server → receives a short-lived code → server exchanges code + client_secret for tokens. Token never exposed to the browser.

```
[Browser] → redirect → [Auth Server] → auth code → [Browser]
[Browser] → auth code → [Your Server] → code + secret → [Auth Server] → token
```

### Client Credentials (machine-to-machine)

No user involved. Service authenticates with its own credentials.

```php
$response = Http::asForm()->post('https://your-app.com/oauth/token', [
    'grant_type'    => 'client_credentials',
    'client_id'     => config('services.api.client_id'),
    'client_secret' => config('services.api.client_secret'),
    'scope'         => 'read-orders',
]);
$accessToken = $response->json('access_token');
```

### Authorization Code + PKCE (SPAs / mobile apps)

For public clients that can't store a client secret. Client generates a `code_verifier`, hashes it into a `code_challenge`, and proves ownership on token exchange.

```php
$codeVerifier  = bin2hex(random_bytes(32));
$codeChallenge = rtrim(strtr(base64_encode(hash('sha256', $codeVerifier, true)), '+/', '-_'), '=');

// Authorization request
$authUrl = 'https://auth-server.com/authorize?' . http_build_query([
    'response_type'         => 'code',
    'client_id'             => 'your-client-id',
    'redirect_uri'          => 'https://your-app.com/callback',
    'scope'                 => 'openid profile email',
    'code_challenge'        => $codeChallenge,
    'code_challenge_method' => 'S256',
    'state'                 => bin2hex(random_bytes(16)),
]);

// Token exchange
$response = Http::asForm()->post('https://auth-server.com/token', [
    'grant_type'    => 'authorization_code',
    'code'          => $authorizationCode,
    'redirect_uri'  => 'https://your-app.com/callback',
    'client_id'     => 'your-client-id',
    'code_verifier' => $codeVerifier,
]);
```

### Password Grant (deprecated)

Client sends user credentials directly. Avoid — defeats the purpose of OAuth. Being removed in OAuth 2.1.

### Implicit Grant (deprecated)

Token returned in URL fragment. Never use — replaced by PKCE.

---

## 6. OAuth 2.0 Flow Step by Step

```
1. User clicks "Login with Google"
2. App redirects → https://accounts.google.com/o/oauth2/auth?
       response_type=code&client_id=...&redirect_uri=...&scope=openid email profile&state=...
3. Google asks user to grant permission
4. Google redirects back → https://your-app.com/callback?code=AUTH_CODE&state=...
5. Server exchanges code → POST https://oauth2.googleapis.com/token
       { grant_type, code, client_id, client_secret, redirect_uri }
6. Google returns { access_token, refresh_token, id_token }
7. Server fetches user info → GET https://www.googleapis.com/oauth2/v3/userinfo
8. Server finds/creates user, logs them in
```

**Laravel implementation:**
```php
Route::get('/auth/google', [OAuthController::class, 'redirect']);
Route::get('/auth/google/callback', [OAuthController::class, 'callback']);

class OAuthController extends Controller
{
    public function redirect()
    {
        $state = bin2hex(random_bytes(16));
        session(['oauth_state' => $state]);

        return redirect('https://accounts.google.com/o/oauth2/auth?' . http_build_query([
            'response_type' => 'code',
            'client_id'     => config('services.google.client_id'),
            'redirect_uri'  => config('services.google.redirect'),
            'scope'         => 'openid email profile',
            'state'         => $state,
            'access_type'   => 'offline',
            'prompt'        => 'consent',
        ]));
    }

    public function callback(Request $request)
    {
        if ($request->state !== session('oauth_state')) {
            abort(403, 'Invalid state parameter');
        }

        $tokens = Http::asForm()->post('https://oauth2.googleapis.com/token', [
            'grant_type'    => 'authorization_code',
            'code'          => $request->code,
            'client_id'     => config('services.google.client_id'),
            'client_secret' => config('services.google.client_secret'),
            'redirect_uri'  => config('services.google.redirect'),
        ])->json();

        $googleUser = Http::withToken($tokens['access_token'])
            ->get('https://www.googleapis.com/oauth2/v3/userinfo')
            ->json();

        $user = User::updateOrCreate(
            ['email' => $googleUser['email']],
            ['name' => $googleUser['name'], 'google_id' => $googleUser['sub'], 'avatar' => $googleUser['picture'] ?? null]
        );

        Auth::login($user);
        return redirect('/dashboard');
    }
}
```

---

## 7. OpenID Connect (OIDC)

OAuth 2.0 handles **authorization** ("what can this app access?"). OIDC adds **authentication** ("who is this user?") by introducing an **ID Token** — a JWT issued alongside the access token containing identity claims.

```json
{
  "iss": "https://accounts.google.com",
  "sub": "1102547832",
  "aud": "your-client-id",
  "exp": 1616239022,
  "name": "John Doe",
  "email": "john@gmail.com",
  "email_verified": true
}
```

Triggered by including `openid` in the scope. Verify `iss`, `aud`, and `nonce` claims.

```php
$params = ['scope' => 'openid email profile', 'nonce' => $nonce, ...];

$decoded = JWT::decode($tokens['id_token'], new Key($googlePublicKey, 'RS256'));

if ($decoded->nonce !== session('oauth_nonce')) {
    abort(403, 'Invalid nonce');
}
```

---

## 8. JWT vs Session-Based Authentication

**Sessions:**
- Server stores session data (DB/Redis). Client gets an opaque session ID in a cookie.
- Easy to revoke. CSRF protection required. Hard to scale horizontally without shared storage.
- Best for: server-rendered web apps (Blade, Livewire, Inertia).

**JWT:**
- Stateless — no server storage. Any server can verify the token from the signature alone.
- Hard to revoke before expiry (needs a blacklist). Payload is readable. Larger than session cookie.
- Best for: REST APIs, mobile apps, SPAs, microservices.

```php
// Session-based
Auth::attempt(['email' => $email, 'password' => $password]);

// JWT-based
$token = JWTAuth::attempt(['email' => $email, 'password' => $password]);
return response()->json(['token' => $token]);
// Client: Authorization: Bearer <token>
```

---

## 9. Refresh Token Rotation

Every time a refresh token is used, it is **invalidated** and a new one is issued. If a stolen token is reused, the server detects it and revokes the entire token family.

```
Without rotation: attacker and user both hold valid tokens — breach undetected.

With rotation:
  Attacker uses refresh_token_A → gets token_B
  User uses refresh_token_A → FAILS (already used)
  Server revokes all tokens in the family
  Attacker's token_B also revoked → breach contained
```

**Migration:**
```php
Schema::create('refresh_tokens', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->string('token_hash')->unique();
    $table->string('family_id');
    $table->boolean('revoked')->default(false);
    $table->timestamp('expires_at');
    $table->timestamps();
    $table->index(['family_id', 'revoked']);
});
```

**Service:**
```php
class RefreshTokenService
{
    public function issueToken(User $user): string
    {
        $token    = bin2hex(random_bytes(40));
        $familyId = Str::uuid()->toString();

        RefreshToken::create([
            'user_id'    => $user->id,
            'token_hash' => hash('sha256', $token),
            'family_id'  => $familyId,
            'revoked'    => false,
            'expires_at' => now()->addDays(30),
        ]);

        return $token;
    }

    public function rotateToken(string $oldToken): array
    {
        $existing = RefreshToken::where('token_hash', hash('sha256', $oldToken))->first();

        if (!$existing) {
            throw new AuthenticationException('Invalid refresh token.');
        }

        if ($existing->revoked) {
            RefreshToken::where('family_id', $existing->family_id)->update(['revoked' => true]);
            Log::warning('Refresh token reuse detected', ['user_id' => $existing->user_id]);
            throw new AuthenticationException('Token reuse detected. All sessions revoked.');
        }

        if ($existing->expires_at->isPast()) {
            $existing->update(['revoked' => true]);
            throw new AuthenticationException('Refresh token expired.');
        }

        $existing->update(['revoked' => true]);

        $newToken = bin2hex(random_bytes(40));

        RefreshToken::create([
            'user_id'    => $existing->user_id,
            'token_hash' => hash('sha256', $newToken),
            'family_id'  => $existing->family_id,
            'revoked'    => false,
            'expires_at' => now()->addDays(30),
        ]);

        return ['user' => User::find($existing->user_id), 'refresh_token' => $newToken];
    }

    public function revokeAllForUser(int $userId): void
    {
        RefreshToken::where('user_id', $userId)->update(['revoked' => true]);
    }
}
```

---

## 10. Token Storage Strategies

### httpOnly Cookies (recommended for web apps)

JavaScript **cannot** read httpOnly cookies — immune to XSS. Vulnerable to CSRF — mitigate with `SameSite=Strict`.

```php
return response()->json(['message' => 'Logged in'])
    ->cookie('access_token',  $accessToken,  60,          '/', config('app.domain'), true, true, false, 'Strict')
    ->cookie('refresh_token', $refreshToken, 60 * 24 * 30, '/', config('app.domain'), true, true, false, 'Strict');

// Middleware to inject cookie token into Authorization header
class JwtFromCookie
{
    public function handle(Request $request, Closure $next)
    {
        if ($token = $request->cookie('access_token')) {
            $request->headers->set('Authorization', 'Bearer ' . $token);
        }
        return $next($request);
    }
}
```

### localStorage

Immune to CSRF (not sent automatically). **Vulnerable to XSS** — any script on the page can read it.

```javascript
localStorage.setItem('access_token', response.data.access_token);
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;
// Risk: XSS can steal the token
```

### sessionStorage

Same as localStorage but cleared when the tab closes. Still vulnerable to XSS.

**Summary:**
- httpOnly cookies — XSS safe, needs CSRF protection (`SameSite`).
- localStorage — CSRF safe, XSS vulnerable.
- sessionStorage — CSRF safe, XSS vulnerable, cleared on tab close.
- **Recommendation:** httpOnly + Secure + SameSite=Strict cookies for web apps. For cross-domain SPAs, store in memory with silent refresh.

---

## 11. Laravel Sanctum vs Laravel Passport

### Sanctum

Lightweight — simple token issuance and SPA cookie-based auth. No OAuth flows.

```php
// composer require laravel/sanctum
// php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
// php artisan migrate

// Issue token
$token = $user->createToken('mobile-app', ['read-posts', 'create-posts']);
return response()->json(['token' => $token->plainTextToken]);

// Protect routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn(Request $request) => $request->user());
});

// Check abilities
if ($user->tokenCan('create-posts')) { ... }

// Revoke
$user->currentAccessToken()->delete();
$user->tokens()->delete(); // all tokens
```

**SPA cookie-based auth:**
```php
// config/sanctum.php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,localhost:3000,your-spa.com')),
```
```javascript
await axios.get('/sanctum/csrf-cookie');   // step 1
await axios.post('/login', { email, password }); // step 2 — cookie set automatically
await axios.get('/api/user');              // step 3 — cookie sent automatically
```

### Passport

Full OAuth 2.0 server — Authorization Code, Client Credentials, PKCE, scopes, third-party client management.

```php
// composer require laravel/passport
// php artisan passport:install

use Laravel\Passport\HasApiTokens;
class User extends Authenticatable { use HasApiTokens; }

// config/auth.php
'api' => ['driver' => 'passport', 'provider' => 'users'],

// Issue personal access token
$token = $user->createToken('Personal Token', ['read-posts'])->accessToken;

// Scoped routes
Route::middleware(['auth:api', 'scope:create-posts'])->post('/posts', ...);

// Client credentials (machine-to-machine)
Route::middleware('client:read-orders')->get('/api/orders', fn() => Order::all());
```

**Comparison:**
- Sanctum — simple, minimal setup, first-party apps, SPAs, mobile.
- Passport — full OAuth 2.0, third-party client management, authorization code flows.
- **Rule:** Start with Sanctum. Use Passport only when you need to act as an OAuth 2.0 provider.

---

## 12. Social Login (Laravel Socialite)

Handles the entire OAuth flow for Google, GitHub, Facebook, and more.

```bash
composer require laravel/socialite
```

**config/services.php:**
```php
'google' => [
    'client_id'     => env('GOOGLE_CLIENT_ID'),
    'client_secret' => env('GOOGLE_CLIENT_SECRET'),
    'redirect'      => env('GOOGLE_REDIRECT_URI'),
],
'github' => [
    'client_id'     => env('GITHUB_CLIENT_ID'),
    'client_secret' => env('GITHUB_CLIENT_SECRET'),
    'redirect'      => env('GITHUB_REDIRECT_URI'),
],
```

**Migration (supports multiple providers per user):**
```php
Schema::create('social_accounts', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->string('provider');
    $table->string('provider_id');
    $table->string('provider_token')->nullable();
    $table->string('provider_refresh_token')->nullable();
    $table->timestamps();
    $table->unique(['provider', 'provider_id']);
});
```

**Controller:**
```php
Route::get('/auth/{provider}', [SocialAuthController::class, 'redirect'])
    ->whereIn('provider', ['google', 'github', 'facebook']);
Route::get('/auth/{provider}/callback', [SocialAuthController::class, 'callback'])
    ->whereIn('provider', ['google', 'github', 'facebook']);

class SocialAuthController extends Controller
{
    public function redirect(string $provider)
    {
        return Socialite::driver($provider)->redirect();
    }

    public function callback(string $provider)
    {
        try {
            $socialUser = Socialite::driver($provider)->user();
        } catch (\Exception $e) {
            return redirect('/login')->with('error', 'Social login failed.');
        }

        $socialAccount = SocialAccount::where('provider', $provider)
            ->where('provider_id', $socialUser->getId())
            ->first();

        if ($socialAccount) {
            Auth::login($socialAccount->user);
            return redirect('/dashboard');
        }

        $existingUser = User::where('email', $socialUser->getEmail())->first();

        $user = $existingUser ?? User::create([
            'name'              => $socialUser->getName(),
            'email'             => $socialUser->getEmail(),
            'avatar'            => $socialUser->getAvatar(),
            'email_verified_at' => now(),
        ]);

        SocialAccount::create([
            'user_id'                => $user->id,
            'provider'               => $provider,
            'provider_id'            => $socialUser->getId(),
            'provider_token'         => $socialUser->token,
            'provider_refresh_token' => $socialUser->refreshToken,
        ]);

        Auth::login($user);
        return redirect('/dashboard');
    }
}
```

**Socialite user object:** `getId()`, `getName()`, `getEmail()`, `getAvatar()`, `->token`, `->refreshToken`.

**Stateless (for SPAs/APIs):**
```php
$socialUser = Socialite::driver($provider)->stateless()->user();
$token = $user->createToken('social-login')->plainTextToken;
return redirect(config('app.frontend_url') . '/auth/callback?token=' . $token);
```

**Extra scopes:**
```php
return Socialite::driver('google')
    ->scopes(['read-contacts'])
    ->with(['access_type' => 'offline', 'prompt' => 'consent'])
    ->redirect();
```

---

## 13. Security Best Practices

**Token expiry:**
- Access tokens: 15 min–1 hour. Refresh tokens: 7–30 days. Never issue non-expiring tokens.

**HTTPS:**
```php
// app/Providers/AppServiceProvider.php
if (app()->environment('production')) {
    URL::forceScheme('https');
}
```

**CORS — restrict to known origins:**
```php
// config/cors.php
'allowed_origins'    => ['https://your-spa.com'],  // never '*' for authenticated endpoints
'supports_credentials' => true,
```

**JWT validation — check all claims:**
```php
try {
    $decoded = JWT::decode($token, new Key($secret, 'HS256'));

    if ($decoded->iss !== config('app.url')) throw new \Exception('Invalid issuer');
    if ($decoded->aud !== config('app.client_id')) throw new \Exception('Invalid audience');
} catch (ExpiredException $e) {
    return response()->json(['error' => 'Token expired'], 401);
} catch (SignatureInvalidException $e) {
    return response()->json(['error' => 'Invalid signature'], 401);
}
```

**Rate limit auth endpoints:**
```php
Route::middleware('throttle:5,1')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/refresh', [TokenController::class, 'refresh']);
    Route::post('/forgot-password', [PasswordController::class, 'forgot']);
});
```

**Log auth events:**
```php
if (!Auth::attempt($credentials)) {
    Log::warning('Failed login', ['email' => $request->email, 'ip' => $request->ip()]);
    return response()->json(['error' => 'Invalid credentials'], 401);
}
Log::info('Successful login', ['user_id' => Auth::id(), 'ip' => $request->ip()]);
```

**Token blacklist (Redis) for critical revocation:**
```php
class TokenBlacklist
{
    public function blacklist(string $tokenId, int $expiresAt): void
    {
        $ttl = $expiresAt - time();
        if ($ttl > 0) Redis::setex("blacklist:{$tokenId}", $ttl, true);
    }

    public function isBlacklisted(string $tokenId): bool
    {
        return (bool) Redis::get("blacklist:{$tokenId}");
    }
}
```

**Content Security Policy:**
```php
$response->headers->set('Content-Security-Policy', "default-src 'self'; script-src 'self';");
```

**Additional rules:**
- Reject tokens with `alg: none`.
- JWT secrets ≥ 256 bits — generate with `openssl rand -base64 32`.
- Always include and verify `state` parameter in OAuth flows (CSRF protection).
- Revoke all tokens when user changes password or is banned.
