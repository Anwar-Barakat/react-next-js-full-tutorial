# Payment Integration Guide

A comprehensive guide to Stripe & MamoPay payment implementation with Laravel + React/TypeScript.

**Last Updated**: January 2025

---

## Table of Contents

1. [Overview](#1-overview)
2. [Stripe Integration](#2-stripe-integration)
   - [2.1 Setup & Configuration](#21-setup--configuration)
   - [2.2 Creating Payment Intent](#22-creating-payment-intent)
   - [2.3 Frontend Payment Form (Stripe)](#23-frontend-payment-form-stripe)
   - [2.4 Payment Verification](#24-payment-verification)
   - [2.5 Webhook Handling (Stripe)](#25-webhook-handling-stripe)
3. [MamoPay Integration](#3-mamopay-integration)
   - [3.1 Setup & Configuration](#31-setup--configuration)
   - [3.2 Creating Payment Link](#32-creating-payment-link)
   - [3.3 Frontend Payment Form (MamoPay)](#33-frontend-payment-form-mamopay)
   - [3.4 Payment Verification](#34-payment-verification)
   - [3.5 Webhook Handling (MamoPay)](#35-webhook-handling-mamopay)
   - [3.6 Understanding Charges Array](#36-understanding-charges-array)
4. [Security Best Practices](#4-security-best-practices)
5. [Testing & Debugging](#5-testing--debugging)
6. [Common Issues & Solutions](#6-common-issues--solutions)
7. [Routes Summary](#7-routes-summary)
8. [Database Migration](#8-database-migration)
9. [Theoretical Questions & Answers](#9-theoretical-questions--answers)

---

## 1. Overview

This document covers payment integration using:
- **Stripe**: International payments (cards, Apple Pay, Google Pay)
- **MamoPay**: UAE-focused payments (local cards, Apple Pay)

**Payment Flow:**
1. User initiates payment on frontend
2. Backend creates payment intent/link
3. User completes payment on secure form
4. Payment provider redirects to callback URL
5. Backend verifies payment status
6. Order status updated accordingly

---

## 2. Stripe Integration

### 2.1 Setup & Configuration

Install Laravel Cashier:

```bash
composer require laravel/cashier
php artisan vendor:publish --tag="cashier-migrations"
php artisan migrate
```

Environment Variables (`.env`):

```
STRIPE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_SECRET=sk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
CASHIER_CURRENCY=usd
CASHIER_CURRENCY_LOCALE=en_US
```

### 2.2 Creating Payment Intent

Controller (`app/Http/Controllers/Payment/StripeController.php`):

```php
<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\PaymentIntent;
use Stripe\Stripe;

class StripeController extends Controller
{
    /**
     * Show payment page
     */
    public function show(Order $order)
    {
        Stripe::setApiKey(config('cashier.secret'));

        // Check if already paid
        if ($order->payment_status === 'paid') {
            return redirect()->route('payment.success', $order);
        }

        // Create payment intent
        $paymentIntent = PaymentIntent::create([
            'amount' => (int) round($order->total * 100), // cents
            'currency' => config('cashier.currency', 'usd'),
            'metadata' => [
                'order_id' => $order->id,
            ],
        ]);

        // Save payment intent ID
        $order->update([
            'stripe_payment_intent_id' => $paymentIntent->id,
        ]);

        return inertia('Payment/Stripe', [
            'order' => $order,
            'clientSecret' => $paymentIntent->client_secret,
            'publishableKey' => config('cashier.key'),
            'returnUrl' => route('payment.stripe.callback', $order),
        ]);
    }

    /**
     * Handle callback after payment
     */
    public function callback(Request $request, Order $order)
    {
        Stripe::setApiKey(config('cashier.secret'));

        $paymentIntentId = $request->query('payment_intent');

        if (!$paymentIntentId) {
            return redirect()->route('payment.failed', $order)
                ->with('error', 'Invalid payment');
        }

        // Get payment intent from Stripe
        $paymentIntent = PaymentIntent::retrieve($paymentIntentId);

        // Check status
        if ($paymentIntent->status === 'succeeded') {
            $order->update([
                'payment_status' => 'paid',
                'paid_at' => now(),
                'transaction_id' => $paymentIntent->id,
            ]);

            return redirect()->route('payment.success', $order);
        }

        if ($paymentIntent->status === 'processing') {
            $order->update(['payment_status' => 'processing']);
            return redirect()->route('payment.pending', $order);
        }

        if ($paymentIntent->status === 'requires_payment_method') {
            return redirect()->route('payment.failed', $order)
                ->with('error', 'Payment failed. Please try again.');
        }

        return redirect()->route('payment.failed', $order);
    }
}
```

### 2.3 Frontend Payment Form (Stripe)

React Component (`resources/js/components/payment/StripePaymentForm.tsx`):

```tsx
import { useState, useEffect } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';

interface Props {
    clientSecret: string;
    publishableKey: string;
    returnUrl: string;
}

function CheckoutForm({ returnUrl }: { returnUrl: string }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        setError(null);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: returnUrl },
        });

        if (error) {
            setError(error.message ?? 'Payment failed');
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <button
                type="submit"
                disabled={!stripe || loading}
                className="w-full mt-4 py-3 bg-blue-600 text-white rounded disabled:opacity-50"
            >
                {loading ? 'Processing...' : 'Pay Now'}
            </button>
        </form>
    );
}

export default function StripePaymentForm({ clientSecret, publishableKey, returnUrl }: Props) {
    const [stripePromise] = useState(() => loadStripe(publishableKey));

    if (!clientSecret) return <p>Loading...</p>;

    return (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm returnUrl={returnUrl} />
        </Elements>
    );
}
```

### 2.4 Payment Verification

Simple verification in callback (already shown above).

Key points:
- Always verify payment_intent matches order
- Check payment status from Stripe API
- Update order only after verification

```php
// In callback method
$paymentIntent = PaymentIntent::retrieve($paymentIntentId);

// Verify it belongs to this order
if ($order->stripe_payment_intent_id !== $paymentIntentId) {
    return redirect()->route('payment.failed', $order);
}

// Verify amount
$expectedAmount = (int) round($order->total * 100);
if ($paymentIntent->amount !== $expectedAmount) {
    Log::error('Amount mismatch', [
        'expected' => $expectedAmount,
        'received' => $paymentIntent->amount,
    ]);
    return redirect()->route('payment.failed', $order);
}

// Process based on status
if ($paymentIntent->status === 'succeeded') {
    $order->update([
        'payment_status' => 'paid',
        'paid_at' => now(),
    ]);
}
```

### 2.5 Webhook Handling (Stripe)

Controller (`app/Http/Controllers/Webhook/StripeWebhookController.php`):

```php
<?php

namespace App\Http\Controllers\Webhook;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Webhook;

class StripeWebhookController extends Controller
{
    public function handle(Request $request)
    {
        // Verify signature
        try {
            $event = Webhook::constructEvent(
                $request->getContent(),
                $request->header('Stripe-Signature'),
                config('cashier.webhook.secret')
            );
        } catch (\Exception $e) {
            return response('Invalid signature', 400);
        }

        // Handle event
        if ($event->type === 'payment_intent.succeeded') {
            $paymentIntent = $event->data->object;
            $orderId = $paymentIntent->metadata->order_id ?? null;

            if ($orderId) {
                $order = Order::find($orderId);
                if ($order && $order->payment_status !== 'paid') {
                    $order->update([
                        'payment_status' => 'paid',
                        'paid_at' => now(),
                        'transaction_id' => $paymentIntent->id,
                    ]);
                }
            }
        }

        if ($event->type === 'payment_intent.payment_failed') {
            $paymentIntent = $event->data->object;
            $orderId = $paymentIntent->metadata->order_id ?? null;

            if ($orderId) {
                Order::where('id', $orderId)->update(['payment_status' => 'failed']);
            }
        }

        return response('OK', 200);
    }
}
```

Routes (`routes/api.php`):

```php
Route::post('/webhooks/stripe', [StripeWebhookController::class, 'handle']);
```

Exclude from CSRF (`app/Http/Middleware/VerifyCsrfToken.php`):

```php
protected $except = [
    'api/webhooks/*',
];
```

---

## 3. MamoPay Integration

### 3.1 Setup & Configuration

Environment Variables (`.env`):

```
MAMOPAY_API_KEY=your_api_key_here
MAMOPAY_BASE_URL=https://sandbox.mamopay.com
MAMOPAY_WEBHOOK_SECRET=your_webhook_secret
```

Config (`config/mamopay.php`):

```php
<?php

return [
    'api_key' => env('MAMOPAY_API_KEY'),
    'base_url' => env('MAMOPAY_BASE_URL', 'https://sandbox.mamopay.com'),
    'webhook_secret' => env('MAMOPAY_WEBHOOK_SECRET'),
];
```

### 3.2 Creating Payment Link

Controller (`app/Http/Controllers/Payment/MamoPayController.php`):

```php
<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MamoPayController extends Controller
{
    /**
     * Show payment page
     */
    public function show(Order $order)
    {
        // Check if already paid
        if ($order->payment_status === 'paid') {
            return redirect()->route('payment.success', $order);
        }

        // Create payment link
        $response = Http::withToken(config('mamopay.api_key'))
            ->post(config('mamopay.base_url') . '/v1/links', [
                'title' => "Order #{$order->id}",
                'amount' => (float) $order->total,
                'amount_currency' => 'AED',
                'return_url' => route('payment.mamopay.callback', $order),
                'failure_return_url' => route('payment.mamopay.failed', $order),
                'custom_data' => ['order_id' => $order->id],
            ]);

        if (!$response->successful()) {
            Log::error('MamoPay link creation failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);
            return back()->with('error', 'Payment service unavailable');
        }

        $data = $response->json();

        // Save link ID
        $order->update(['mamopay_link_id' => $data['id']]);

        return inertia('Payment/MamoPay', [
            'order' => $order,
            'paymentUrl' => $data['payment_url'],
        ]);
    }

    /**
     * Handle callback after payment
     */
    public function callback(Request $request, Order $order)
    {
        // Get payment link details
        $response = Http::withToken(config('mamopay.api_key'))
            ->get(config('mamopay.base_url') . '/v1/links/' . $order->mamopay_link_id);

        if (!$response->successful()) {
            return redirect()->route('payment.failed', $order);
        }

        $data = $response->json();

        // Check charges for successful payment
        foreach ($data['charges'] ?? [] as $charge) {
            if ($charge['status'] === 'captured') {
                $order->update([
                    'payment_status' => 'paid',
                    'paid_at' => now(),
                    'transaction_id' => $charge['id'],
                ]);
                return redirect()->route('payment.success', $order);
            }
        }

        return redirect()->route('payment.failed', $order)
            ->with('error', 'Payment not completed');
    }

    /**
     * Handle failure redirect
     */
    public function failed(Order $order)
    {
        return redirect()->route('payment.failed', $order)
            ->with('error', 'Payment was not completed');
    }
}
```

### 3.3 Frontend Payment Form (MamoPay)

React Component (`resources/js/components/payment/MamoPayForm.tsx`):

```tsx
import { useEffect, useState, useRef } from 'react';

interface Props {
    paymentUrl: string;
    orderTotal: number;
    currency?: string;
}

export default function MamoPayForm({ paymentUrl, orderTotal, currency = 'AED' }: Props) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const checkInterval = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!paymentUrl) {
            setError('Payment URL not provided');
            setLoading(false);
            return;
        }

        // Set data-src BEFORE loading script
        const container = document.getElementById('mamo-checkout');
        if (container) {
            container.setAttribute('data-src', paymentUrl);
        }

        // Remove existing script if any
        const existingScript = document.querySelector('script[src*="checkout-inline"]');
        if (existingScript) existingScript.remove();

        // Load MamoPay SDK
        const script = document.createElement('script');
        script.src = 'https://assets.mamopay.com/stable/checkout-inline-2.0.0.min.js';
        script.async = true;

        script.onload = () => {
            // Trigger SDK initialization
            window.dispatchEvent(new Event('load'));

            // Wait for iframe
            checkInterval.current = setInterval(() => {
                const iframe = document.getElementById('iframe-mamo-checkout');
                if (iframe) {
                    clearInterval(checkInterval.current!);
                    setLoading(false);
                    iframe.style.width = '100%';
                    iframe.style.minHeight = '600px';
                    iframe.style.border = 'none';
                }
            }, 200);

            // Timeout after 15s
            setTimeout(() => {
                if (loading) {
                    clearInterval(checkInterval.current!);
                    setError('Payment form failed to load');
                    setLoading(false);
                }
            }, 15000);
        };

        script.onerror = () => {
            setError('Failed to load payment SDK');
            setLoading(false);
        };

        document.body.appendChild(script);

        return () => {
            if (checkInterval.current) clearInterval(checkInterval.current);
            const s = document.querySelector('script[src*="checkout-inline"]');
            if (s) s.remove();
        };
    }, [paymentUrl]);

    if (error) {
        return (
            <div className="p-4 bg-red-50 text-red-600 rounded">
                {error}
                <button onClick={() => window.location.reload()} className="ml-4 underline">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="relative min-h-[500px]">
            {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white">
                    <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4" />
                    <p>Loading payment form...</p>
                    <p className="text-gray-400 text-sm">{currency} {orderTotal.toFixed(2)}</p>
                </div>
            )}
            <div
                id="mamo-checkout"
                data-src={paymentUrl}
                style={{ opacity: loading ? 0 : 1 }}
            />
        </div>
    );
}
```

### 3.4 Payment Verification

Simple verification (already in callback above).

Key points:
- Fetch payment link details from MamoPay API
- Loop through charges array to find `captured` status
- One link can have multiple charge attempts (retries)

```php
// Get link details
$response = Http::withToken(config('mamopay.api_key'))
    ->get(config('mamopay.base_url') . '/v1/links/' . $order->mamopay_link_id);

$data = $response->json();

// Loop through charges to find successful payment
foreach ($data['charges'] ?? [] as $charge) {
    if ($charge['status'] === 'captured') {
        // Payment successful!
        $order->update([
            'payment_status' => 'paid',
            'paid_at' => now(),
            'transaction_id' => $charge['id'],
        ]);
        break;
    }
}
```

### 3.5 Webhook Handling (MamoPay)

Controller (`app/Http/Controllers/Webhook/MamoPayWebhookController.php`):

```php
<?php

namespace App\Http\Controllers\Webhook;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MamoPayWebhookController extends Controller
{
    public function handle(Request $request)
    {
        // Verify signature (optional but recommended)
        $secret = config('mamopay.webhook_secret');
        if ($secret) {
            $signature = $request->header('X-Mamo-Signature');
            $expected = hash_hmac('sha256', $request->getContent(), $secret);
            if (!hash_equals($expected, $signature ?? '')) {
                return response('Invalid signature', 401);
            }
        }

        $payload = $request->all();
        $event = $payload['event'] ?? '';
        $data = $payload['data'] ?? [];

        Log::info('MamoPay webhook', ['event' => $event]);

        // Handle charge captured
        if ($event === 'charge.captured') {
            $linkId = $data['link_id'] ?? null;
            if ($linkId) {
                $order = Order::where('mamopay_link_id', $linkId)->first();
                if ($order && $order->payment_status !== 'paid') {
                    $order->update([
                        'payment_status' => 'paid',
                        'paid_at' => now(),
                        'transaction_id' => $data['id'] ?? $data['charge_id'] ?? null,
                    ]);
                }
            }
        }

        // Handle charge failed
        if ($event === 'charge.failed') {
            $linkId = $data['link_id'] ?? null;
            if ($linkId) {
                Order::where('mamopay_link_id', $linkId)
                    ->where('payment_status', '!=', 'paid')
                    ->update(['payment_status' => 'failed']);
            }
        }

        return response('OK', 200);
    }
}
```

Routes (`routes/api.php`):

```php
Route::post('/webhooks/mamopay', [MamoPayWebhookController::class, 'handle']);
```

### 3.6 Understanding Charges Array

**Why charges is an array:**
- One payment link can have multiple charge attempts
- User tries card → fails → tries again → succeeds
- Each attempt creates a new charge in the array

Example MamoPay Response:

```json
{
    "id": "MB-LINK-xxx",
    "amount": 100.00,
    "status": "inactive",
    "achieved": true,
    "charges": [
        {
            "id": "PAY-aaa",
            "status": "failed",
            "failure_reason": "card_declined"
        },
        {
            "id": "PAY-bbb",
            "status": "captured"
        }
    ]
}
```

**Correct** — loop through all:

```php
foreach ($data['charges'] as $charge) {
    if ($charge['status'] === 'captured') {
        // Found successful payment!
        return true;
    }
}
```

**Wrong** — only check first/last:

```php
// Wrong! Misses retries
if ($data['charges'][0]['status'] === 'captured') { }

// Wrong! Might check pending after captured
$last = end($data['charges']);
if ($last['status'] === 'captured') { }
```

---

## 4. Security Best Practices

1. **Never Trust Client-Side Data**
   - Always verify payment on backend
   - Don't rely solely on redirect parameters
   - Use webhooks as source of truth

2. **Verify Payment Amounts**
   - Compare paid amount with order total
   - Prevent partial payment attacks

3. **Idempotency**
   - Check if order already paid before updating
   - Handle duplicate webhooks gracefully

4. **Secure Webhook Endpoints**
   - Verify signatures
   - Use HTTPS only

5. **Secure API Keys**
   - Store in `.env` (never commit)
   - Use separate keys for test/production

6. **Logging**
   - Log payment events
   - Don't log card numbers/CVV

---

## 5. Testing & Debugging

**Stripe Test Cards:**
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0000 0000 3220`
- Insufficient funds: `4000 0000 0000 9995`

**MamoPay Test Mode:**
- Use sandbox environment (`MAMOPAY_BASE_URL=https://sandbox.mamopay.com`)
- Test cards in MamoPay dashboard

**Testing Webhooks Locally:**

```bash
# Stripe CLI
stripe listen --forward-to localhost:8000/api/webhooks/stripe

# ngrok for MamoPay
ngrok http 8000
# Set webhook URL: https://xxx.ngrok.io/api/webhooks/mamopay
```

---

## 6. Common Issues & Solutions

**Issue: Payment success but order not updated**
- Check webhook logs
- Verify webhook signature config
- Ensure order lookup works

**Issue: MamoPay iframe not loading**
- Set `data-src` BEFORE loading script
- Check browser console for CSP errors
- Verify payment URL is valid

**Issue: Stripe 3D Secure not returning**
- Verify `return_url` is absolute URL
- Check URL whitelisted in Stripe dashboard

**Issue: Duplicate charges**
- Check payment status before processing
- Use idempotency keys (Stripe)

**Issue: Webhook timeout**
- Return 200 quickly
- Process heavy tasks in queue

---

## 7. Routes Summary

```php
// routes/web.php
Route::middleware(['auth'])->group(function () {
    // Stripe
    Route::get('/payment/{order}/stripe', [StripeController::class, 'show'])
        ->name('payment.stripe');
    Route::get('/payment/{order}/stripe/callback', [StripeController::class, 'callback'])
        ->name('payment.stripe.callback');

    // MamoPay
    Route::get('/payment/{order}/mamopay', [MamoPayController::class, 'show'])
        ->name('payment.mamopay');
    Route::get('/payment/{order}/mamopay/callback', [MamoPayController::class, 'callback'])
        ->name('payment.mamopay.callback');
    Route::get('/payment/{order}/mamopay/failed', [MamoPayController::class, 'failed'])
        ->name('payment.mamopay.failed');

    // Result pages
    Route::get('/payment/{order}/success', [PaymentController::class, 'success'])
        ->name('payment.success');
    Route::get('/payment/{order}/failed', [PaymentController::class, 'failed'])
        ->name('payment.failed');
    Route::get('/payment/{order}/pending', [PaymentController::class, 'pending'])
        ->name('payment.pending');
});

// routes/api.php (webhooks)
Route::post('/webhooks/stripe', [StripeWebhookController::class, 'handle']);
Route::post('/webhooks/mamopay', [MamoPayWebhookController::class, 'handle']);
```

---

## 8. Database Migration

```php
// Add to orders table
Schema::table('orders', function (Blueprint $table) {
    $table->string('payment_status')->default('pending');
    $table->string('transaction_id')->nullable();
    $table->string('stripe_payment_intent_id')->nullable();
    $table->string('mamopay_link_id')->nullable();
    $table->timestamp('paid_at')->nullable();
});
```

---

## 9. Theoretical Questions & Answers

### Q1: What is a Payment Intent?

A Payment Intent is an object that represents your intent to collect payment from a customer. It tracks the lifecycle of the payment process.

- Created on your server before payment
- Contains amount, currency, and metadata
- Has a `client_secret` used by frontend to complete payment
- Status changes: `requires_payment_method` → `requires_confirmation` → `requires_action` → `processing` → `succeeded/failed`

### Q2: What is a Client Secret?

The `client_secret` is a unique key that allows your frontend to complete the payment without exposing your secret API key.

- Generated when you create a Payment Intent
- Passed to frontend to initialize Stripe Elements
- Allows frontend to confirm payment securely
- Should never be logged or stored permanently

### Q3: Why do we need Webhooks?

Webhooks are essential because:

1. **Redirects can fail** — User closes browser, network issues
2. **Async payments** — Bank transfers, 3D Secure can take time
3. **Source of truth** — Webhooks come directly from payment provider
4. **Reliability** — Even if user never returns, you get notified

> Rule: Never trust only the redirect. Always verify via webhook.

### Q4: What is 3D Secure (3DS)?

3D Secure is an additional authentication layer for card payments.

- User redirected to bank's page to verify identity
- Reduces fraud and chargebacks
- Required in EU (SCA — Strong Customer Authentication)
- Status becomes `requires_action` when 3DS is needed

### Q5: What is Idempotency?

Idempotency means the same request produces the same result, no matter how many times it's executed.

**Why it matters:**
- Webhook delivered twice? Order should only be marked paid once
- Network retry? Should not create duplicate charges

**How to implement:**
- Check if order already paid before updating
- Use idempotency keys with Stripe API calls

### Q6: Publishable Key vs Secret Key?

Two types of API keys with different purposes:

**Publishable Key (`pk_xxx`):**
- Safe to use in frontend/browser
- Can only create tokens and confirm payments
- Cannot read sensitive data

**Secret Key (`sk_xxx`):**
- Server-side only, NEVER expose to frontend
- Can do anything: refunds, read customer data
- Store in `.env`, never commit to git

### Q7: Why multiply amount by 100?

Payment providers use the smallest currency unit to avoid floating point errors.

- USD: cents (100 cents = $1.00)
- AED: fils (100 fils = 1 AED)
- JPY: no decimal (100 JPY = 100 JPY)

Example: `$25.99` → `2599` cents

```php
// Wrong: float can cause precision issues
'amount' => 25.99

// Right: integer, no precision loss
'amount' => 2599
```

### Q8: What is a Webhook Signature?

A cryptographic signature that proves the webhook came from the real payment provider, not an attacker.

**How it works:**
1. Provider creates hash of payload + secret
2. Hash sent in request header
3. You recreate hash with your secret
4. If they match, webhook is authentic

Without verification, anyone could send fake "payment succeeded" webhooks.

### Q9: Why is MamoPay charges an array?

One payment link can have multiple payment attempts:

**Scenario:**
1. User tries Card A → Declined (charge 1: failed)
2. User tries Card B → Declined (charge 2: failed)
3. User tries Card C → Success (charge 3: captured)

Result: charges array has 3 items

You must loop through ALL charges to find if ANY succeeded. Checking only first or last charge will miss successful retries.

### Q10: What is PCI Compliance?

PCI DSS (Payment Card Industry Data Security Standard) are rules for handling card data securely.

By using Stripe Elements / MamoPay iframe:
- Card numbers never touch your server
- Entered directly into provider's secure form
- You only receive tokens, not actual card data
- Greatly reduces your compliance burden

### Q11: Callback vs Webhook — What's the difference?

**Callback (Redirect):**
- User redirected to your URL after payment
- Happens in user's browser
- Can fail if user closes browser
- Use for: showing success page to user

**Webhook:**
- Server-to-server HTTP request
- Happens in background
- Reliable, retries on failure
- Use for: updating database, sending emails

> Best practice: Use BOTH. Callback for UX, webhook for reliability.

### Q12: What payment statuses should I track?

Common payment statuses:

| Status | Description |
|--------|-------------|
| `pending` | Payment initiated, waiting for action |
| `processing` | Payment being processed (bank transfers) |
| `paid` | Payment successful |
| `failed` | Payment failed |
| `canceled` | Payment canceled by user |
| `refunded` | Payment refunded |

Stripe PaymentIntent statuses: `requires_payment_method`, `requires_confirmation`, `requires_action` (3D Secure), `processing`, `succeeded`, `canceled`

### Q13: What is a Payment Link (MamoPay)?

A payment link is a hosted checkout page created via API.

**Flow:**
1. Create link via API with amount
2. Get `payment_url` back
3. Embed in iframe or redirect user
4. User pays on MamoPay's hosted page
5. User redirected back to your site
6. Verify payment via API or webhook

**Benefits:**
- No need to handle card data
- MamoPay handles all UI
- Multiple payment attempts on same link

### Q14: Why return 200 quickly in webhooks?

Payment providers have timeout limits (usually 5–30 seconds).

If you don't respond in time:
- Provider thinks webhook failed
- They retry (causing duplicate processing)
- After many retries, may disable your webhook

**Best practice:**
1. Validate webhook immediately
2. Return `200 OK`
3. Queue heavy tasks (emails, inventory) for background processing

### Q15: Test Mode vs Live Mode?

Payment providers have two environments:

**Test/Sandbox Mode:**
- Fake money, no real charges
- Use test API keys (`pk_test_`, `sk_test_`)
- Use test card numbers
- For development and testing

**Live/Production Mode:**
- Real money, real charges
- Use live API keys (`pk_live_`, `sk_live_`)
- Real card numbers
- For production only

> Never use test keys in production or live keys in development.

---

**Official Documentation:**
- [Stripe](https://stripe.com/docs)
- [MamoPay](https://docs.mamopay.com)
- [Laravel Cashier](https://laravel.com/docs/billing)
