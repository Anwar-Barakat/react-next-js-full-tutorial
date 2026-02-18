# Laravel Notifications & Broadcasting Guide

A comprehensive guide to notifications, broadcasting, WebSockets, and real-time features in Laravel.

## Table of Contents

1. [What are Laravel Notifications?](#1-what-are-laravel-notifications)
2. [What notification channels does Laravel support?](#2-what-notification-channels-does-laravel-support)
3. [Difference between Mail and Notification](#3-difference-between-mail-and-notification)
4. [What is Laravel Broadcasting?](#4-what-is-laravel-broadcasting)
5. [What are channels in Laravel broadcasting?](#5-what-are-channels-in-laravel-broadcasting)
6. [What is Laravel Echo?](#6-what-is-laravel-echo)
7. [What are WebSockets?](#7-what-are-websockets)
8. [What is Laravel Reverb?](#8-what-is-laravel-reverb)
9. [Setting up Laravel Reverb](#9-setting-up-laravel-reverb)
10. [Laravel Reverb vs Pusher](#10-laravel-reverb-vs-pusher)

---

## 1. What are Laravel Notifications?

- Notifications are a way to inform users about something that happened in your app.
- Instead of writing separate logic for email, SMS, or database messages, Laravel provides one unified system.
- The same message can be sent:
  - As an email.
  - As an SMS.
  - As an in-app notification.
  - As a Slack message (for admins).

**Why notifications are useful:**
- Clean & organized code.
- Same message, multiple channels.
- Easy to manage and scale.
- Great for user experience.

```bash
php artisan make:notification OrderShipped
```

```php
// Sending a notification
$user->notify(new OrderShipped($order));
```

In short: Laravel notifications let you send messages via email, database, and real-time channels using one simple system.

---

## 2. What notification channels does Laravel support?

| Channel | Description |
|---------|-------------|
| `mail` | Sends an email |
| `database` | Stores in DB for in-app notifications |
| `broadcast` | Real-time via WebSockets |
| `vonage` / `nexmo` | SMS messages |
| `slack` | Slack messages |
| Custom | Any custom channel |

**Example: When a user places an order:**
- Email → Order confirmation.
- Database → In-app notification.
- Broadcast → Live update on dashboard.

In short: Laravel supports multiple notification channels from one system.

---

## 3. Difference between Mail and Notification

- **Mail**
  - Used only to send emails.
  - You design a Mailable class for one purpose: email.
  - Best when: you only need email, the message logic is email-specific.

- **Notification**
  - Used to send the same message to multiple channels.
  - One notification can be sent via: Email, Database, SMS, Slack, Broadcast.

```php
// Mail - email only
Mail::to($user)->send(new WelcomeMail());

// Notification - multiple channels
$user->notify(new WelcomeNotification());
// Can deliver via email AND store in database AND send SMS
```

- ✅ Use **Mail** → if you only need email.
- ✅ Use **Notification** → if you may need more than one channel now or later.

---

## 4. What is Laravel Broadcasting?

- Broadcasting lets your server send events in real time to the browser or other clients.
- It uses WebSockets so clients can receive updates without refreshing the page.
- Works with services like Pusher, Ably, Redis (Laravel Reverb), etc.

```php
// Broadcast an event
broadcast(new OrderStatusUpdated($order))->toOthers();
```

In short: Laravel broadcasting sends real-time events from the server to the frontend using WebSockets.

---

## 5. What are channels in Laravel broadcasting?

- Channels decide who is allowed to receive a broadcasted event.
- They act like rooms where events are sent, and users can listen only if allowed.

**Types of channels:**

| Channel | Who Can Listen | Example Use |
|---------|---------------|-------------|
| **Public** | Anyone | Live public notifications |
| **Private** | Authenticated users only | Private notifications |
| **Presence** | Authenticated users + shows who is online | Chat rooms |

In short: Channels control who can hear real-time events — everyone, logged-in users, or logged-in users with presence info.

---

## 6. What is Laravel Echo?

- Laravel Echo is a JavaScript library that listens to real-time events sent from Laravel.
- It connects your frontend to Laravel broadcasting using WebSockets.
- Makes real-time features easy without writing complex WebSocket code.

**Flow:**
```
🖥️ Laravel (server) → sends event
🌐 WebSocket (bridge)
📱 Echo (frontend) → listens and reacts instantly
```

**What Echo does:**
- Subscribes to channels (public, private, presence).
- Listens for broadcasted events.
- Automatically handles authentication for private channels.

```javascript
import Echo from 'laravel-echo';

Echo.channel('orders')
    .listen('OrderShipped', (event) => {
        console.log('Order shipped!', event.order);
    });

// Private channel
Echo.private(`orders.${userId}`)
    .listen('OrderUpdated', (event) => {
        updateOrderStatus(event.order);
    });
```

In short: Laravel Echo lets your frontend hear Laravel events in real time using WebSockets.

---

## 7. What are WebSockets?

- WebSockets create a permanent connection between the browser and the server.
- This connection stays open, so both sides can send data anytime.

**Unlike HTTP:**
- ❌ HTTP = request → response → close (one-way, short-lived).
- ✅ WebSocket = open → talk continuously (two-way, persistent).

**Enables real-time updates without refreshing the page.**

**Examples:** Chats, Dashboards, Live Notifications, Collaborative editing.

In short: WebSockets allow instant, real-time communication between server and client without repeated requests.

---

## 8. What is Laravel Reverb?

- **Laravel Reverb** is Laravel's own first-party WebSocket server — built and maintained by the Laravel team.
- It replaces third-party services like Pusher or Ably for real-time broadcasting.
- Runs on your own server — no external subscription or API keys needed.
- Fully compatible with the existing Laravel broadcasting system and Laravel Echo.
- Built on ReactPHP for high performance and designed to handle thousands of connections.

**Why Reverb was created:**
- Pusher and Ably are paid external services.
- Reverb is free, self-hosted, and seamlessly integrated into Laravel's ecosystem.

**What Reverb does:**
1. Laravel fires a broadcast event → Reverb receives it.
2. Reverb pushes the event to all connected clients over WebSockets.
3. Laravel Echo (frontend) receives the event and updates the UI.

```
Laravel fires event → Reverb WebSocket server → Laravel Echo (browser) → UI updates
```

In short: Laravel Reverb is a self-hosted, first-party WebSocket server that powers real-time broadcasting without needing Pusher or Ably.

---

## 9. Setting up Laravel Reverb

**Install Reverb:**

```bash
php artisan install:broadcasting
# Selects Reverb as the broadcast driver and installs everything needed
```

Or manually:

```bash
composer require laravel/reverb
php artisan reverb:install
```

**`.env` configuration:**

```env
BROADCAST_CONNECTION=reverb

REVERB_APP_ID=my-app-id
REVERB_APP_KEY=my-app-key
REVERB_APP_SECRET=my-app-secret
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=http

# Frontend (Vite / Echo)
VITE_REVERB_APP_KEY="${REVERB_APP_KEY}"
VITE_REVERB_HOST="${REVERB_HOST}"
VITE_REVERB_PORT="${REVERB_PORT}"
VITE_REVERB_SCHEME="${REVERB_SCHEME}"
```

**Start the Reverb server:**

```bash
php artisan reverb:start
php artisan reverb:start --host=0.0.0.0 --port=8080
php artisan reverb:start --debug   # verbose output
```

**Frontend (Laravel Echo with Reverb):**

```bash
npm install --save-dev laravel-echo pusher-js
```

`resources/js/echo.js`:

```javascript
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'reverb',
    key:         import.meta.env.VITE_REVERB_APP_KEY,
    wsHost:      import.meta.env.VITE_REVERB_HOST,
    wsPort:      import.meta.env.VITE_REVERB_PORT ?? 80,
    wssPort:     import.meta.env.VITE_REVERB_PORT ?? 443,
    forceTLS:    (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
});

// Listen to a channel
window.Echo.channel('orders')
    .listen('OrderShipped', (event) => {
        console.log('Order shipped!', event.order);
    });
```

**Production with Supervisor (keep Reverb running):**

```ini
[program:reverb]
command=php /var/www/html/artisan reverb:start --host=0.0.0.0 --port=8080
autostart=true
autorestart=true
user=www-data
```

---

## 10. Laravel Reverb vs Pusher

| Feature | Laravel Reverb | Pusher |
|---------|---------------|--------|
| **Cost** | Free (self-hosted) | Paid after free tier |
| **Hosting** | Your own server | External cloud service |
| **Setup** | `php artisan install:broadcasting` | API keys + SDK |
| **Performance** | High (ReactPHP) | Very high (managed) |
| **Scaling** | Manual (horizontal scaling possible) | Automatic |
| **Laravel integration** | First-party, native | Official adapter |
| **Maintenance** | You manage the server | Pusher manages it |
| **Best for** | Full control, no external dependency | Quick setup, managed service |

```php
// config/broadcasting.php — switching is just a config change
'default' => env('BROADCAST_CONNECTION', 'reverb'),

// Reverb connection
'reverb' => [
    'driver'  => 'reverb',
    'key'     => env('REVERB_APP_KEY'),
    'secret'  => env('REVERB_APP_SECRET'),
    'app_id'  => env('REVERB_APP_ID'),
    'options' => [
        'host'   => env('REVERB_HOST', '0.0.0.0'),
        'port'   => env('REVERB_PORT', 8080),
        'scheme' => env('REVERB_SCHEME', 'http'),
    ],
],
```

In short: Reverb = free, self-hosted, full control. Pusher = managed service, easier to scale but has cost at volume.
