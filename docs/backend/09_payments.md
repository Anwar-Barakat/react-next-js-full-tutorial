# Payment Integration Guide

A comprehensive guide to Stripe & MamoPay payment implementation with Laravel + React/TypeScript.

**Last Updated**: March 2026

---

## Table of Contents

1. [Overview](#1-overview)
2. [Stripe Integration](#2-stripe-integration)
   - [2.1 Setup & Configuration](#21-setup--configuration)
   - [2.2 Creating Payment Intent](#22-creating-payment-intent)
   - [2.3 Frontend Payment Form (Stripe)](#23-frontend-payment-form-stripe)
   - [2.4 Payment Verification](#24-payment-verification)
   - [2.5 Webhook Handling (Stripe)](#25-webhook-handling-stripe)
   - [2.6 Subscriptions & Recurring Payments (Laravel Cashier)](#26-subscriptions--recurring-payments-laravel-cashier)
   - [2.7 Checkout Sessions (Stripe Hosted Checkout)](#27-checkout-sessions-stripe-hosted-checkout)
   - [2.8 Refunds](#28-refunds)
   - [2.9 Customer Management](#29-customer-management)
   - [2.10 Invoices](#210-invoices)
   - [2.11 Coupons & Promotions](#211-coupons--promotions)
   - [2.12 Multi-Currency Support](#212-multi-currency-support)
   - [2.13 Error Handling](#213-error-handling)
3. [MamoPay Integration](#3-mamopay-integration)
   - [3.1 Setup & Configuration](#31-setup--configuration)
   - [3.2 Creating Payment Link](#32-creating-payment-link)
   - [3.3 Frontend Payment Form (MamoPay)](#33-frontend-payment-form-mamopay)
   - [3.4 Payment Verification](#34-payment-verification)
   - [3.5 Webhook Handling (MamoPay)](#35-webhook-handling-mamopay)
   - [3.6 Understanding Charges Array](#36-understanding-charges-array)
   - [3.7 Refunds (MamoPay)](#37-refunds-mamopay)
   - [3.8 Payment Link Options](#38-payment-link-options)
   - [3.9 Error Handling (MamoPay)](#39-error-handling-mamopay)
4. [Security Best Practices](#4-security-best-practices)
5. [Testing & Debugging](#5-testing--debugging)
6. [Common Issues & Solutions](#6-common-issues--solutions)
7. [Routes Summary](#7-routes-summary)
8. [Database Migration](#8-database-migration)
9. [Theoretical Questions & Answers](#9-theoretical-questions--answers)
10. [Payment Service Architecture](#10-payment-service-architecture)
11. [Refund Flow (Complete)](#11-refund-flow-complete)
12. [Subscription Management](#12-subscription-management)

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

### 2.6 Subscriptions & Recurring Payments (Laravel Cashier)

Laravel Cashier provides a fluent interface for managing Stripe subscriptions.

**Setup the Billable Trait:**

Add the `Billable` trait to your User model:

```php
<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Cashier\Billable;

class User extends Authenticatable
{
    use Billable;
}
```

Run the Cashier migrations (adds `stripe_id`, `pm_type`, `pm_last_four`, `trial_ends_at` to users table and creates `subscriptions` + `subscription_items` tables):

```bash
php artisan vendor:publish --tag="cashier-migrations"
php artisan migrate
```

**Define Subscription Plans:**

Store plan price IDs from Stripe Dashboard in config (`config/subscription.php`):

```php
<?php

return [
    'plans' => [
        'basic' => [
            'name' => 'Basic',
            'price_id' => env('STRIPE_BASIC_PRICE_ID', 'price_xxx'),
            'features' => ['5 projects', '1 GB storage'],
        ],
        'pro' => [
            'name' => 'Pro',
            'price_id' => env('STRIPE_PRO_PRICE_ID', 'price_yyy'),
            'features' => ['Unlimited projects', '100 GB storage', 'Priority support'],
        ],
        'enterprise' => [
            'name' => 'Enterprise',
            'price_id' => env('STRIPE_ENTERPRISE_PRICE_ID', 'price_zzz'),
            'features' => ['Everything in Pro', 'Dedicated support', 'Custom integrations'],
        ],
    ],
];
```

**Creating Subscriptions:**

Controller (`app/Http/Controllers/SubscriptionController.php`):

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class SubscriptionController extends Controller
{
    /**
     * Show subscription plans page
     */
    public function index(Request $request)
    {
        $user = $request->user();

        return inertia('Subscription/Plans', [
            'plans' => config('subscription.plans'),
            'currentPlan' => $user->subscription('default')?->stripe_price,
            'onTrial' => $user->onTrial('default'),
            'subscribed' => $user->subscribed('default'),
            'intent' => $user->createSetupIntent(),
        ]);
    }

    /**
     * Create a new subscription
     */
    public function store(Request $request)
    {
        $request->validate([
            'plan' => 'required|string|in:basic,pro,enterprise',
            'payment_method' => 'required|string',
        ]);

        $user = $request->user();
        $priceId = config("subscription.plans.{$request->plan}.price_id");

        try {
            // Create or update default payment method
            $user->updateDefaultPaymentMethod($request->payment_method);

            // Create subscription
            $user->newSubscription('default', $priceId)->create($request->payment_method);

            return redirect()->route('subscription.index')
                ->with('success', 'Subscription created successfully!');
        } catch (\Exception $e) {
            Log::error('Subscription creation failed', [
                'user_id' => $user->id,
                'plan' => $request->plan,
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'Failed to create subscription. Please try again.');
        }
    }

    /**
     * Create subscription with trial period
     */
    public function storeWithTrial(Request $request)
    {
        $request->validate([
            'plan' => 'required|string|in:basic,pro,enterprise',
            'payment_method' => 'required|string',
        ]);

        $user = $request->user();
        $priceId = config("subscription.plans.{$request->plan}.price_id");

        $user->newSubscription('default', $priceId)
            ->trialDays(14)
            ->create($request->payment_method);

        return redirect()->route('subscription.index')
            ->with('success', 'Trial started! You will be charged after 14 days.');
    }
}
```

**Checking Subscription Status:**

```php
// Check if user is subscribed
$user->subscribed('default');              // true/false
$user->subscribedToProduct('prod_xxx');    // check specific product
$user->subscribedToPrice('price_xxx');     // check specific price

// Check trial status
$user->onTrial('default');       // on trial?
$user->subscription('default')->onTrial(); // same via subscription

// Check if canceled but still in grace period
$user->subscription('default')->onGracePeriod();  // canceled but active
$user->subscription('default')->canceled();        // has been canceled
$user->subscription('default')->ended();           // canceled and grace ended

// Check recurring status
$user->subscription('default')->recurring();       // active and not on trial
$user->subscription('default')->active();          // active (including trial)
```

**Middleware to protect routes:**

```php
// In routes/web.php
Route::middleware(['auth', 'subscribed:default'])->group(function () {
    Route::get('/premium-feature', [PremiumController::class, 'index']);
});

// Custom middleware (app/Http/Middleware/EnsureSubscribed.php)
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureSubscribed
{
    public function handle(Request $request, Closure $next, string $subscription = 'default')
    {
        if (! $request->user()?->subscribed($subscription)) {
            return redirect()->route('subscription.index')
                ->with('error', 'You need an active subscription to access this feature.');
        }

        return $next($request);
    }
}
```

**Canceling Subscriptions:**

```php
/**
 * Cancel subscription (with grace period)
 */
public function cancel(Request $request)
{
    $request->user()->subscription('default')->cancel();

    // User can still use features until end of billing period
    return back()->with('success', 'Subscription canceled. Access continues until end of billing period.');
}

/**
 * Cancel immediately (no grace period)
 */
public function cancelImmediately(Request $request)
{
    $request->user()->subscription('default')->cancelNow();

    return back()->with('success', 'Subscription canceled immediately.');
}
```

**Resuming Subscriptions (during grace period):**

```php
public function resume(Request $request)
{
    $subscription = $request->user()->subscription('default');

    if ($subscription->onGracePeriod()) {
        $subscription->resume();
        return back()->with('success', 'Subscription resumed!');
    }

    return back()->with('error', 'Cannot resume — grace period has ended.');
}
```

**Swapping Plans:**

```php
public function swap(Request $request)
{
    $request->validate(['plan' => 'required|string|in:basic,pro,enterprise']);

    $newPriceId = config("subscription.plans.{$request->plan}.price_id");

    // Swap plan (prorated by default)
    $request->user()->subscription('default')->swap($newPriceId);

    return back()->with('success', 'Plan changed successfully!');
}

// Swap without prorating
$request->user()->subscription('default')->noProrate()->swap($newPriceId);

// Swap and invoice immediately
$request->user()->subscription('default')->swapAndInvoice($newPriceId);
```

**Subscription Webhooks:**

Add these to your Stripe webhook handler:

```php
// In StripeWebhookController::handle()

// Subscription created
if ($event->type === 'customer.subscription.created') {
    Log::info('Subscription created', [
        'subscription_id' => $event->data->object->id,
        'customer' => $event->data->object->customer,
    ]);
}

// Subscription updated (plan change, renewal)
if ($event->type === 'customer.subscription.updated') {
    $subscription = $event->data->object;
    Log::info('Subscription updated', [
        'status' => $subscription->status,
        'cancel_at_period_end' => $subscription->cancel_at_period_end,
    ]);
}

// Subscription deleted (fully canceled)
if ($event->type === 'customer.subscription.deleted') {
    $subscription = $event->data->object;
    Log::info('Subscription ended', ['id' => $subscription->id]);
}

// Invoice payment failed (dunning)
if ($event->type === 'invoice.payment_failed') {
    $invoice = $event->data->object;
    $customerId = $invoice->customer;

    // Notify user about failed payment
    $user = User::where('stripe_id', $customerId)->first();
    if ($user) {
        $user->notify(new PaymentFailedNotification($invoice));
    }
}
```

**Frontend Subscription Form (`resources/js/components/subscription/SubscriptionForm.tsx`):**

```tsx
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { router } from '@inertiajs/react';

interface Plan {
    name: string;
    price_id: string;
    features: string[];
}

interface Props {
    plans: Record<string, Plan>;
    currentPlan: string | null;
    onTrial: boolean;
    subscribed: boolean;
    intent: { client_secret: string };
    stripeKey: string;
}

function SubscribeForm({ plan, intent }: { plan: string; intent: { client_secret: string } }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setLoading(true);
        setError(null);

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) return;

        const { setupIntent, error: stripeError } = await stripe.confirmCardSetup(
            intent.client_secret,
            { payment_method: { card: cardElement } }
        );

        if (stripeError) {
            setError(stripeError.message ?? 'Setup failed');
            setLoading(false);
            return;
        }

        // Send payment method to backend
        router.post('/subscription', {
            plan,
            payment_method: setupIntent.payment_method,
        }, {
            onFinish: () => setLoading(false),
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement
                options={{
                    style: {
                        base: { fontSize: '16px', color: '#1a1a1a' },
                        invalid: { color: '#dc2626' },
                    },
                }}
            />
            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
            <button
                type="submit"
                disabled={!stripe || loading}
                className="w-full mt-4 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
                {loading ? 'Processing...' : 'Subscribe'}
            </button>
        </form>
    );
}

export default function SubscriptionForm({ plans, currentPlan, onTrial, subscribed, intent, stripeKey }: Props) {
    const [stripePromise] = useState(() => loadStripe(stripeKey));
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

    return (
        <div>
            {onTrial && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                    You are currently on a trial period.
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Object.entries(plans).map(([key, plan]) => (
                    <div
                        key={key}
                        className={`border rounded-lg p-6 cursor-pointer transition ${
                            currentPlan === plan.price_id
                                ? 'border-green-500 bg-green-50'
                                : selectedPlan === key
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-400'
                        }`}
                        onClick={() => setSelectedPlan(key)}
                    >
                        <h3 className="text-xl font-bold">{plan.name}</h3>
                        <ul className="mt-4 space-y-2">
                            {plan.features.map((feature) => (
                                <li key={feature} className="text-gray-600">- {feature}</li>
                            ))}
                        </ul>
                        {currentPlan === plan.price_id && (
                            <span className="inline-block mt-3 text-sm text-green-600 font-medium">Current Plan</span>
                        )}
                    </div>
                ))}
            </div>

            {selectedPlan && selectedPlan !== currentPlan && (
                <div className="mt-8 max-w-md">
                    <h3 className="text-lg font-semibold mb-4">
                        {subscribed ? 'Switch' : 'Subscribe'} to {plans[selectedPlan].name}
                    </h3>
                    <Elements stripe={stripePromise}>
                        <SubscribeForm plan={selectedPlan} intent={intent} />
                    </Elements>
                </div>
            )}
        </div>
    );
}
```

### 2.7 Checkout Sessions (Stripe Hosted Checkout)

Stripe Checkout Sessions redirect the user to a Stripe-hosted payment page. Useful when you want Stripe to handle all UI.

**Creating a Checkout Session:**

```php
<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Stripe\Checkout\Session as StripeCheckoutSession;
use Stripe\Stripe;

class CheckoutSessionController extends Controller
{
    /**
     * Create a Stripe Checkout Session and redirect
     */
    public function create(Order $order)
    {
        Stripe::setApiKey(config('cashier.secret'));

        $session = StripeCheckoutSession::create([
            'payment_method_types' => ['card'],
            'mode' => 'payment', // 'payment', 'subscription', or 'setup'
            'line_items' => [
                [
                    'price_data' => [
                        'currency' => 'usd',
                        'product_data' => [
                            'name' => "Order #{$order->id}",
                            'description' => $order->description ?? 'Payment for your order',
                        ],
                        'unit_amount' => (int) round($order->total * 100),
                    ],
                    'quantity' => 1,
                ],
            ],
            'metadata' => [
                'order_id' => $order->id,
            ],
            'customer_email' => $order->user->email,
            'success_url' => route('payment.checkout.success', $order) . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('payment.checkout.cancel', $order),
        ]);

        // Save session ID
        $order->update(['stripe_checkout_session_id' => $session->id]);

        return inertia('Payment/Checkout', [
            'checkoutUrl' => $session->url,
        ]);
    }

    /**
     * Handle success callback
     */
    public function success(Request $request, Order $order)
    {
        Stripe::setApiKey(config('cashier.secret'));

        $sessionId = $request->query('session_id');
        if (!$sessionId) {
            return redirect()->route('payment.failed', $order);
        }

        $session = StripeCheckoutSession::retrieve($sessionId);

        if ($session->payment_status === 'paid') {
            $order->update([
                'payment_status' => 'paid',
                'paid_at' => now(),
                'transaction_id' => $session->payment_intent,
            ]);

            return redirect()->route('payment.success', $order);
        }

        return redirect()->route('payment.pending', $order);
    }

    /**
     * Handle cancel callback
     */
    public function cancel(Order $order)
    {
        return redirect()->route('payment.failed', $order)
            ->with('error', 'Checkout was canceled.');
    }

    /**
     * Create a Checkout Session for subscription
     */
    public function createSubscription(Request $request)
    {
        Stripe::setApiKey(config('cashier.secret'));

        $session = StripeCheckoutSession::create([
            'payment_method_types' => ['card'],
            'mode' => 'subscription',
            'line_items' => [
                [
                    'price' => $request->price_id, // Stripe Price ID
                    'quantity' => 1,
                ],
            ],
            'customer_email' => $request->user()->email,
            'success_url' => route('subscription.success') . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('subscription.cancel'),
        ]);

        return redirect($session->url);
    }
}
```

**Frontend Redirect (`resources/js/pages/Payment/Checkout.tsx`):**

```tsx
import { useEffect } from 'react';

interface Props {
    checkoutUrl: string;
}

export default function Checkout({ checkoutUrl }: Props) {
    useEffect(() => {
        // Redirect to Stripe Checkout
        window.location.href = checkoutUrl;
    }, [checkoutUrl]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
                <p className="text-gray-600">Redirecting to secure checkout...</p>
            </div>
        </div>
    );
}
```

**Checkout Session vs Payment Intent:**

| Feature | Payment Intent | Checkout Session |
|---------|---------------|-----------------|
| UI | Your own form (Stripe Elements) | Stripe-hosted page |
| Customization | Full control over design | Limited to Stripe's theme |
| Setup complexity | More code, more control | Less code, quick setup |
| Payment methods | You choose what to show | Stripe auto-shows relevant methods |
| Subscriptions | Requires Cashier setup | Built-in mode |
| 3D Secure | Handled by Elements | Handled automatically |
| Best for | Custom checkout experience | Quick implementation, simple flows |

**Webhook for Checkout Session:**

```php
// In StripeWebhookController::handle()
if ($event->type === 'checkout.session.completed') {
    $session = $event->data->object;
    $orderId = $session->metadata->order_id ?? null;

    if ($orderId && $session->payment_status === 'paid') {
        $order = Order::find($orderId);
        if ($order && $order->payment_status !== 'paid') {
            $order->update([
                'payment_status' => 'paid',
                'paid_at' => now(),
                'transaction_id' => $session->payment_intent,
            ]);
        }
    }
}
```

### 2.8 Refunds

**Full Refund:**

```php
<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Refund;
use Stripe\Stripe;

class RefundController extends Controller
{
    /**
     * Full refund
     */
    public function refundFull(Order $order)
    {
        Stripe::setApiKey(config('cashier.secret'));

        if ($order->payment_status !== 'paid') {
            return back()->with('error', 'Order is not paid.');
        }

        try {
            $refund = Refund::create([
                'payment_intent' => $order->stripe_payment_intent_id,
                'reason' => 'requested_by_customer', // or 'duplicate', 'fraudulent'
            ]);

            $order->update([
                'payment_status' => 'refunded',
                'refund_id' => $refund->id,
                'refunded_at' => now(),
            ]);

            Log::info('Full refund processed', [
                'order_id' => $order->id,
                'refund_id' => $refund->id,
            ]);

            return back()->with('success', 'Full refund processed.');
        } catch (\Stripe\Exception\InvalidRequestException $e) {
            Log::error('Refund failed', ['error' => $e->getMessage()]);
            return back()->with('error', 'Refund failed: ' . $e->getMessage());
        }
    }

    /**
     * Partial refund
     */
    public function refundPartial(Request $request, Order $order)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0.01|max:' . $order->total,
            'reason' => 'nullable|string|in:requested_by_customer,duplicate,fraudulent',
        ]);

        Stripe::setApiKey(config('cashier.secret'));

        try {
            $refund = Refund::create([
                'payment_intent' => $order->stripe_payment_intent_id,
                'amount' => (int) round($request->amount * 100), // cents
                'reason' => $request->reason ?? 'requested_by_customer',
            ]);

            // Track partial refund
            $totalRefunded = ($order->refunded_amount ?? 0) + $request->amount;
            $status = $totalRefunded >= $order->total ? 'refunded' : 'partially_refunded';

            $order->update([
                'payment_status' => $status,
                'refunded_amount' => $totalRefunded,
                'refund_id' => $refund->id,
            ]);

            return back()->with('success', "Refunded {$request->amount} successfully.");
        } catch (\Stripe\Exception\InvalidRequestException $e) {
            return back()->with('error', 'Refund failed: ' . $e->getMessage());
        }
    }
}
```

**Refund Status Tracking:**

Add to your migration:

```php
Schema::table('orders', function (Blueprint $table) {
    $table->string('refund_id')->nullable();
    $table->decimal('refunded_amount', 10, 2)->default(0);
    $table->timestamp('refunded_at')->nullable();
});
```

**Handling Refund Webhooks:**

```php
// In StripeWebhookController::handle()

// Refund succeeded
if ($event->type === 'charge.refunded') {
    $charge = $event->data->object;
    $paymentIntentId = $charge->payment_intent;

    $order = Order::where('stripe_payment_intent_id', $paymentIntentId)->first();
    if ($order) {
        $refundedAmount = $charge->amount_refunded / 100;
        $isFullRefund = $charge->refunded; // true if fully refunded

        $order->update([
            'payment_status' => $isFullRefund ? 'refunded' : 'partially_refunded',
            'refunded_amount' => $refundedAmount,
            'refunded_at' => now(),
        ]);
    }
}

// Refund failed
if ($event->type === 'charge.refund.updated') {
    $refund = $event->data->object;
    if ($refund->status === 'failed') {
        Log::error('Refund failed', [
            'refund_id' => $refund->id,
            'failure_reason' => $refund->failure_reason,
        ]);
    }
}
```

**Using Laravel Cashier for Refunds:**

```php
// Refund via Cashier (if using Cashier)
$user = $order->user;

// Refund specific payment
$user->refund($order->transaction_id);

// Partial refund
$user->refund($order->transaction_id, 500); // refund $5.00
```

### 2.9 Customer Management

**Creating Stripe Customers:**

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CustomerController extends Controller
{
    /**
     * Create or retrieve Stripe customer for user
     */
    public function ensureStripeCustomer(Request $request)
    {
        $user = $request->user();

        // Cashier auto-creates customer when needed, but you can do it explicitly:
        if (!$user->hasStripeId()) {
            $user->createAsStripeCustomer([
                'name' => $user->name,
                'email' => $user->email,
                'metadata' => [
                    'user_id' => $user->id,
                ],
            ]);
        }

        return response()->json([
            'stripe_id' => $user->stripe_id,
        ]);
    }

    /**
     * Update customer info on Stripe
     */
    public function updateStripeCustomer(Request $request)
    {
        $user = $request->user();

        $user->updateStripeCustomer([
            'name' => $user->name,
            'email' => $user->email,
            'phone' => $user->phone,
            'address' => [
                'line1' => $user->address,
                'city' => $user->city,
                'country' => $user->country,
            ],
        ]);

        return back()->with('success', 'Billing info updated.');
    }
}
```

**Attaching Payment Methods:**

```php
/**
 * Add a new payment method
 */
public function addPaymentMethod(Request $request)
{
    $request->validate(['payment_method' => 'required|string']);

    $user = $request->user();

    try {
        $user->addPaymentMethod($request->payment_method);
        return back()->with('success', 'Payment method added.');
    } catch (\Exception $e) {
        return back()->with('error', 'Failed to add payment method.');
    }
}

/**
 * Set default payment method
 */
public function setDefaultPaymentMethod(Request $request)
{
    $request->validate(['payment_method' => 'required|string']);

    $user = $request->user();
    $user->updateDefaultPaymentMethod($request->payment_method);

    return back()->with('success', 'Default payment method updated.');
}

/**
 * Remove a payment method
 */
public function removePaymentMethod(Request $request)
{
    $request->validate(['payment_method' => 'required|string']);

    $user = $request->user();
    $paymentMethod = $user->findPaymentMethod($request->payment_method);

    if ($paymentMethod) {
        $paymentMethod->delete();
    }

    return back()->with('success', 'Payment method removed.');
}
```

**Listing Payment Methods:**

```php
/**
 * Get user's payment methods
 */
public function paymentMethods(Request $request)
{
    $user = $request->user();

    $methods = $user->paymentMethods()->map(function ($method) {
        return [
            'id' => $method->id,
            'brand' => $method->card->brand,
            'last4' => $method->card->last_four,
            'exp_month' => $method->card->exp_month,
            'exp_year' => $method->card->exp_year,
            'is_default' => $method->id === $this->defaultPaymentMethod()?->id,
        ];
    });

    $default = $user->defaultPaymentMethod();

    return inertia('Billing/PaymentMethods', [
        'methods' => $methods,
        'defaultMethod' => $default?->id,
    ]);
}
```

**Frontend Payment Methods (`resources/js/components/billing/PaymentMethods.tsx`):**

```tsx
import { router } from '@inertiajs/react';

interface PaymentMethod {
    id: string;
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
    is_default: boolean;
}

interface Props {
    methods: PaymentMethod[];
    defaultMethod: string | null;
}

export default function PaymentMethods({ methods, defaultMethod }: Props) {
    const setDefault = (methodId: string) => {
        router.post('/billing/default-payment-method', { payment_method: methodId });
    };

    const remove = (methodId: string) => {
        if (confirm('Remove this payment method?')) {
            router.delete('/billing/payment-method', { data: { payment_method: methodId } });
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">Payment Methods</h2>
            {methods.length === 0 ? (
                <p className="text-gray-500">No payment methods on file.</p>
            ) : (
                methods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between border rounded p-4">
                        <div>
                            <span className="font-medium capitalize">{method.brand}</span>
                            <span className="ml-2 text-gray-600">**** {method.last4}</span>
                            <span className="ml-2 text-gray-400 text-sm">
                                {method.exp_month}/{method.exp_year}
                            </span>
                            {method.id === defaultMethod && (
                                <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                    Default
                                </span>
                            )}
                        </div>
                        <div className="flex gap-2">
                            {method.id !== defaultMethod && (
                                <button
                                    onClick={() => setDefault(method.id)}
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    Set Default
                                </button>
                            )}
                            <button
                                onClick={() => remove(method.id)}
                                className="text-sm text-red-600 hover:underline"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
```

**Syncing Customer with Local DB:**

```php
// In User model or an observer
use App\Observers\UserObserver;

// AppServiceProvider::boot()
User::observe(UserObserver::class);

// app/Observers/UserObserver.php
<?php

namespace App\Observers;

use App\Models\User;

class UserObserver
{
    public function updated(User $user)
    {
        // Sync changes to Stripe when local user updates
        if ($user->hasStripeId() && ($user->wasChanged('name') || $user->wasChanged('email'))) {
            $user->updateStripeCustomer([
                'name' => $user->name,
                'email' => $user->email,
            ]);
        }
    }
}
```

### 2.10 Invoices

**Generating & Downloading Invoices:**

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    /**
     * List all invoices for user
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $invoices = $user->invoices()->map(function ($invoice) {
            return [
                'id' => $invoice->id,
                'date' => $invoice->date()->toFormattedDateString(),
                'total' => $invoice->total(),
                'status' => $invoice->status,
                'number' => $invoice->number,
            ];
        });

        return inertia('Billing/Invoices', [
            'invoices' => $invoices,
        ]);
    }

    /**
     * Download invoice as PDF
     */
    public function download(Request $request, string $invoiceId)
    {
        return $request->user()->downloadInvoice($invoiceId, [
            'vendor' => config('app.name'),
            'product' => 'Subscription',
            'street' => '123 Main Street',
            'location' => 'Dubai, UAE',
            'phone' => '+971-xxx-xxxx',
        ]);
    }

    /**
     * Preview upcoming invoice (for subscription)
     */
    public function upcoming(Request $request)
    {
        $user = $request->user();

        if (!$user->subscribed('default')) {
            return response()->json(['message' => 'No active subscription'], 404);
        }

        $invoice = $user->upcomingInvoice();

        return response()->json([
            'date' => $invoice->date()->toFormattedDateString(),
            'total' => $invoice->total(),
            'lines' => $invoice->invoiceItems(),
        ]);
    }
}
```

**Invoice Webhooks:**

```php
// In StripeWebhookController::handle()

// Invoice paid (subscription renewal)
if ($event->type === 'invoice.paid') {
    $invoice = $event->data->object;
    Log::info('Invoice paid', [
        'invoice_id' => $invoice->id,
        'customer' => $invoice->customer,
        'amount' => $invoice->amount_paid,
    ]);
}

// Invoice payment failed
if ($event->type === 'invoice.payment_failed') {
    $invoice = $event->data->object;
    $customerId = $invoice->customer;

    $user = \App\Models\User::where('stripe_id', $customerId)->first();
    if ($user) {
        // Send notification
        $user->notify(new \App\Notifications\InvoicePaymentFailed([
            'amount' => $invoice->amount_due / 100,
            'next_attempt' => $invoice->next_payment_attempt
                ? \Carbon\Carbon::createFromTimestamp($invoice->next_payment_attempt)->toFormattedDateString()
                : null,
        ]));
    }
}

// Invoice created (upcoming payment)
if ($event->type === 'invoice.created') {
    $invoice = $event->data->object;
    Log::info('Invoice created', ['id' => $invoice->id, 'total' => $invoice->total]);
}
```

**Sending Invoice Emails:**

```php
// Custom invoice email notification
<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class InvoicePaid extends Notification
{
    public function __construct(
        private string $invoiceId,
        private string $amount,
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $downloadUrl = route('invoices.download', $this->invoiceId);

        return (new MailMessage)
            ->subject('Invoice Paid - ' . config('app.name'))
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line("Your payment of {$this->amount} has been received.")
            ->action('Download Invoice', $downloadUrl)
            ->line('Thank you for your business!');
    }
}
```

**Frontend Invoice List (`resources/js/components/billing/InvoiceList.tsx`):**

```tsx
interface Invoice {
    id: string;
    date: string;
    total: string;
    status: string;
    number: string;
}

interface Props {
    invoices: Invoice[];
}

export default function InvoiceList({ invoices }: Props) {
    const downloadInvoice = (invoiceId: string) => {
        window.open(`/billing/invoices/${invoiceId}/download`, '_blank');
    };

    return (
        <div>
            <h2 className="text-xl font-bold mb-4">Invoices</h2>
            {invoices.length === 0 ? (
                <p className="text-gray-500">No invoices yet.</p>
            ) : (
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="border-b text-left">
                            <th className="py-2">Number</th>
                            <th className="py-2">Date</th>
                            <th className="py-2">Amount</th>
                            <th className="py-2">Status</th>
                            <th className="py-2">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((invoice) => (
                            <tr key={invoice.id} className="border-b">
                                <td className="py-2">{invoice.number}</td>
                                <td className="py-2">{invoice.date}</td>
                                <td className="py-2">{invoice.total}</td>
                                <td className="py-2">
                                    <span className={`text-sm px-2 py-0.5 rounded ${
                                        invoice.status === 'paid'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {invoice.status}
                                    </span>
                                </td>
                                <td className="py-2">
                                    <button
                                        onClick={() => downloadInvoice(invoice.id)}
                                        className="text-blue-600 hover:underline text-sm"
                                    >
                                        Download PDF
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
```

### 2.11 Coupons & Promotions

**Creating Coupons (via Stripe API):**

```php
use Stripe\Coupon;
use Stripe\PromotionCode;
use Stripe\Stripe;

Stripe::setApiKey(config('cashier.secret'));

// Percentage discount coupon
$coupon = Coupon::create([
    'percent_off' => 20,
    'duration' => 'repeating', // 'once', 'repeating', 'forever'
    'duration_in_months' => 3,
    'max_redemptions' => 100,
    'name' => '20% Off for 3 Months',
]);

// Fixed amount discount coupon
$coupon = Coupon::create([
    'amount_off' => 1000, // $10.00
    'currency' => 'usd',
    'duration' => 'once',
    'name' => '$10 Off First Month',
]);

// Create a promotion code (user-facing code)
$promoCode = PromotionCode::create([
    'coupon' => $coupon->id,
    'code' => 'WELCOME20',
    'max_redemptions' => 50,
    'expires_at' => now()->addMonths(3)->timestamp,
]);
```

**Applying Coupons to Subscriptions:**

```php
// Apply coupon when creating subscription
$user->newSubscription('default', $priceId)
    ->withCoupon('coupon_id_here')
    ->create($paymentMethod);

// Apply promotion code
$user->newSubscription('default', $priceId)
    ->withPromotionCode('promo_code_id_here')
    ->create($paymentMethod);

// Apply coupon to existing subscription
$user->subscription('default')->updateStripeSubscription([
    'coupon' => 'coupon_id_here',
]);
```

**Applying One-Time Discounts:**

```php
// Apply coupon to a Checkout Session
$session = StripeCheckoutSession::create([
    'mode' => 'payment',
    'discounts' => [
        ['coupon' => 'coupon_id_here'],
        // OR
        ['promotion_code' => 'promo_code_id_here'],
    ],
    'line_items' => [...],
    'success_url' => '...',
    'cancel_url' => '...',
]);
```

**Validate Promotion Code on Backend:**

```php
/**
 * Validate a promotion code entered by user
 */
public function validatePromoCode(Request $request)
{
    $request->validate(['code' => 'required|string']);

    Stripe::setApiKey(config('cashier.secret'));

    try {
        $promoCodes = PromotionCode::all([
            'code' => $request->code,
            'active' => true,
        ]);

        if ($promoCodes->data && count($promoCodes->data) > 0) {
            $promo = $promoCodes->data[0];
            $coupon = $promo->coupon;

            return response()->json([
                'valid' => true,
                'promo_id' => $promo->id,
                'discount' => $coupon->percent_off
                    ? "{$coupon->percent_off}% off"
                    : '$' . number_format($coupon->amount_off / 100, 2) . ' off',
                'duration' => $coupon->duration,
            ]);
        }

        return response()->json(['valid' => false, 'message' => 'Invalid promotion code.']);
    } catch (\Exception $e) {
        return response()->json(['valid' => false, 'message' => 'Could not validate code.']);
    }
}
```

### 2.12 Multi-Currency Support

**Handling Multiple Currencies:**

```php
// config/payment.php
return [
    'supported_currencies' => ['usd', 'eur', 'gbp', 'aed', 'sar'],

    'default_currency' => env('CASHIER_CURRENCY', 'usd'),

    // Zero-decimal currencies (amount is NOT multiplied by 100)
    'zero_decimal_currencies' => [
        'bif', 'clp', 'djf', 'gnf', 'jpy', 'kmf', 'krw', 'mga',
        'pyg', 'rwf', 'ugx', 'vnd', 'vuv', 'xaf', 'xof', 'xpf',
    ],
];
```

**Currency Helper:**

```php
<?php

namespace App\Helpers;

class CurrencyHelper
{
    /**
     * Convert amount to Stripe's smallest unit
     */
    public static function toStripeAmount(float $amount, string $currency): int
    {
        $zeroDecimal = config('payment.zero_decimal_currencies', []);

        if (in_array(strtolower($currency), $zeroDecimal)) {
            return (int) round($amount); // No multiplication for JPY, etc.
        }

        return (int) round($amount * 100); // Standard: dollars to cents
    }

    /**
     * Convert from Stripe's smallest unit to display amount
     */
    public static function fromStripeAmount(int $amount, string $currency): float
    {
        $zeroDecimal = config('payment.zero_decimal_currencies', []);

        if (in_array(strtolower($currency), $zeroDecimal)) {
            return (float) $amount;
        }

        return $amount / 100;
    }

    /**
     * Format amount for display
     */
    public static function format(float $amount, string $currency): string
    {
        $symbols = [
            'usd' => '$', 'eur' => "\u{20AC}", 'gbp' => "\u{00A3}",
            'aed' => 'AED ', 'sar' => 'SAR ', 'jpy' => "\u{00A5}",
        ];

        $symbol = $symbols[strtolower($currency)] ?? strtoupper($currency) . ' ';
        $zeroDecimal = config('payment.zero_decimal_currencies', []);
        $decimals = in_array(strtolower($currency), $zeroDecimal) ? 0 : 2;

        return $symbol . number_format($amount, $decimals);
    }
}
```

**Using in Payment Intent:**

```php
use App\Helpers\CurrencyHelper;

$currency = $order->currency ?? config('payment.default_currency');

$paymentIntent = PaymentIntent::create([
    'amount' => CurrencyHelper::toStripeAmount($order->total, $currency),
    'currency' => $currency,
    'metadata' => ['order_id' => $order->id],
]);
```

**Currency Conversion Considerations:**

- Stripe does NOT auto-convert currencies. You charge in the currency you specify.
- For multi-currency, store the currency alongside the amount in your `orders` table.
- Use exchange rate APIs (e.g., Open Exchange Rates) if you need conversion.
- Stripe supports 135+ currencies. MamoPay primarily supports AED, USD, EUR, GBP, SAR.

```php
// Migration: add currency column
Schema::table('orders', function (Blueprint $table) {
    $table->string('currency', 3)->default('usd')->after('total');
});
```

### 2.13 Error Handling

**Stripe Exception Types:**

```php
use Stripe\Exception\ApiConnectionException;
use Stripe\Exception\ApiErrorException;
use Stripe\Exception\AuthenticationException;
use Stripe\Exception\CardException;
use Stripe\Exception\IdempotencyException;
use Stripe\Exception\InvalidRequestException;
use Stripe\Exception\RateLimitException;

try {
    $paymentIntent = PaymentIntent::create([...]);
} catch (CardException $e) {
    // Card was declined
    $error = $e->getError();
    $errorCode = $error->code;           // e.g. 'card_declined'
    $declineCode = $error->decline_code; // e.g. 'insufficient_funds'

    return back()->with('error', $this->friendlyCardError($errorCode, $declineCode));

} catch (RateLimitException $e) {
    // Too many requests — retry with backoff
    Log::warning('Stripe rate limit hit');
    return back()->with('error', 'Service is busy. Please try again in a moment.');

} catch (InvalidRequestException $e) {
    // Invalid parameters
    Log::error('Stripe invalid request', ['error' => $e->getMessage()]);
    return back()->with('error', 'Payment configuration error. Please contact support.');

} catch (AuthenticationException $e) {
    // Wrong API key
    Log::critical('Stripe auth failed — check API keys');
    return back()->with('error', 'Payment service error. Please contact support.');

} catch (ApiConnectionException $e) {
    // Network issue
    Log::error('Stripe connection failed', ['error' => $e->getMessage()]);
    return back()->with('error', 'Could not reach payment service. Please try again.');

} catch (ApiErrorException $e) {
    // Generic Stripe error
    Log::error('Stripe API error', ['error' => $e->getMessage()]);
    return back()->with('error', 'Payment error. Please try again.');
}
```

**Common Error Codes and User-Friendly Messages:**

```php
/**
 * Map Stripe error codes to user-friendly messages
 */
private function friendlyCardError(string $code, ?string $declineCode = null): string
{
    $messages = [
        'card_declined' => match ($declineCode) {
            'insufficient_funds' => 'Your card has insufficient funds. Please try another card.',
            'lost_card', 'stolen_card' => 'This card cannot be used. Please contact your bank.',
            'generic_decline' => 'Your card was declined. Please try another payment method.',
            default => 'Your card was declined. Please try another card.',
        },
        'expired_card' => 'Your card has expired. Please use a different card.',
        'incorrect_cvc' => 'The CVC number is incorrect. Please check and try again.',
        'incorrect_number' => 'The card number is incorrect. Please check and try again.',
        'processing_error' => 'An error occurred while processing your card. Please try again.',
        'authentication_required' => 'Your bank requires additional authentication.',
    ];

    return $messages[$code] ?? 'Payment failed. Please try again or use a different payment method.';
}
```

**Retry Logic for Transient Errors:**

```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Stripe\Exception\ApiConnectionException;
use Stripe\Exception\RateLimitException;

class StripeRetry
{
    /**
     * Execute a Stripe API call with retry logic
     */
    public static function execute(callable $callback, int $maxRetries = 3): mixed
    {
        $attempt = 0;

        while (true) {
            try {
                return $callback();
            } catch (RateLimitException | ApiConnectionException $e) {
                $attempt++;
                if ($attempt >= $maxRetries) {
                    Log::error("Stripe call failed after {$maxRetries} retries", [
                        'error' => $e->getMessage(),
                    ]);
                    throw $e;
                }

                // Exponential backoff: 1s, 2s, 4s
                $delay = pow(2, $attempt - 1);
                Log::warning("Stripe retry #{$attempt}, waiting {$delay}s", [
                    'error' => $e->getMessage(),
                ]);
                sleep($delay);
            }
        }
    }
}

// Usage:
$paymentIntent = StripeRetry::execute(fn () => PaymentIntent::create([
    'amount' => 2599,
    'currency' => 'usd',
]));
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

### 3.7 Refunds (MamoPay)

**Full Refund via API:**

```php
<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MamoPayRefundController extends Controller
{
    /**
     * Full refund
     */
    public function refundFull(Order $order)
    {
        if ($order->payment_status !== 'paid') {
            return back()->with('error', 'Order is not paid.');
        }

        $chargeId = $order->transaction_id; // The charge ID from captured payment

        $response = Http::withToken(config('mamopay.api_key'))
            ->post(config('mamopay.base_url') . "/v1/charges/{$chargeId}/refunds");

        if ($response->successful()) {
            $refund = $response->json();

            $order->update([
                'payment_status' => 'refunded',
                'refund_id' => $refund['id'] ?? null,
                'refunded_at' => now(),
            ]);

            Log::info('MamoPay full refund processed', [
                'order_id' => $order->id,
                'charge_id' => $chargeId,
            ]);

            return back()->with('success', 'Full refund processed.');
        }

        Log::error('MamoPay refund failed', [
            'order_id' => $order->id,
            'status' => $response->status(),
            'body' => $response->body(),
        ]);

        return back()->with('error', 'Refund failed. Please try again.');
    }

    /**
     * Partial refund
     */
    public function refundPartial(Request $request, Order $order)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0.01|max:' . $order->total,
        ]);

        $chargeId = $order->transaction_id;

        $response = Http::withToken(config('mamopay.api_key'))
            ->post(config('mamopay.base_url') . "/v1/charges/{$chargeId}/refunds", [
                'amount' => (float) $request->amount,
            ]);

        if ($response->successful()) {
            $totalRefunded = ($order->refunded_amount ?? 0) + $request->amount;
            $status = $totalRefunded >= $order->total ? 'refunded' : 'partially_refunded';

            $order->update([
                'payment_status' => $status,
                'refunded_amount' => $totalRefunded,
            ]);

            return back()->with('success', "Refunded {$request->amount} AED.");
        }

        return back()->with('error', 'Refund failed: ' . $response->json('message', 'Unknown error'));
    }

    /**
     * Check refund status
     */
    public function checkRefundStatus(Order $order)
    {
        $chargeId = $order->transaction_id;

        $response = Http::withToken(config('mamopay.api_key'))
            ->get(config('mamopay.base_url') . "/v1/charges/{$chargeId}");

        if ($response->successful()) {
            $charge = $response->json();

            return response()->json([
                'charge_status' => $charge['status'],
                'refunded' => $charge['refunded'] ?? false,
                'amount_refunded' => $charge['amount_refunded'] ?? 0,
                'refunds' => $charge['refunds'] ?? [],
            ]);
        }

        return response()->json(['error' => 'Could not fetch charge details'], 500);
    }
}
```

### 3.8 Payment Link Options

MamoPay payment links support many configuration parameters for customizing the checkout experience.

**All Available Parameters:**

```php
$response = Http::withToken(config('mamopay.api_key'))
    ->post(config('mamopay.base_url') . '/v1/links', [
        // Required
        'title' => 'Order #123 Payment',        // Link title shown to customer
        'amount' => 99.99,                        // Payment amount
        'amount_currency' => 'AED',               // Currency: AED, USD, EUR, GBP, SAR

        // Redirect URLs
        'return_url' => 'https://yourapp.com/payment/success',
        'failure_return_url' => 'https://yourapp.com/payment/failed',

        // Display options
        'description' => 'Payment for premium package', // Description shown on checkout
        'active' => true,                                // Link active/inactive

        // Customer interaction options
        'enable_message' => true,          // Allow customer to leave a message
        'enable_tips' => false,            // Show tip/gratuity option
        'enable_customer_details' => true, // Collect name, email, phone
        'enable_quantity' => false,        // Allow customer to change quantity
        'enable_tabby' => false,           // Enable Tabby (buy now pay later)

        // Custom data (returned in webhooks/callbacks)
        'custom_data' => [
            'order_id' => 123,
            'user_id' => 456,
        ],

        // Link behavior
        'is_widget' => false, // true = embeddable widget, false = full page

        // Pre-fill customer details
        'first_name' => 'John',
        'last_name' => 'Doe',
        'email' => 'john@example.com',
        'phone' => '+971501234567',
    ]);
```

**Reusable vs One-Time Links:**

```php
// One-time link (deactivates after successful payment)
$response = Http::withToken(config('mamopay.api_key'))
    ->post(config('mamopay.base_url') . '/v1/links', [
        'title' => 'Single Purchase',
        'amount' => 50.00,
        'amount_currency' => 'AED',
        'active' => true,
        // By default, links deactivate after a captured charge
    ]);

// Reusable link (stays active for multiple payments)
// Useful for donations, recurring manual payments, etc.
// Manage via the MamoPay dashboard or deactivate via API
```

**Deactivating a Payment Link:**

```php
// Deactivate a link (prevent further payments)
$linkId = $order->mamopay_link_id;

$response = Http::withToken(config('mamopay.api_key'))
    ->patch(config('mamopay.base_url') . "/v1/links/{$linkId}", [
        'active' => false,
    ]);
```

**Listing Payment Links:**

```php
// Fetch all links with optional filters
$response = Http::withToken(config('mamopay.api_key'))
    ->get(config('mamopay.base_url') . '/v1/links', [
        'page' => 1,
        'per_page' => 25,
    ]);

$links = $response->json();

// Fetch a specific link with its charges
$response = Http::withToken(config('mamopay.api_key'))
    ->get(config('mamopay.base_url') . "/v1/links/{$linkId}");

$link = $response->json();
// $link['charges'] contains all payment attempts
```

### 3.9 Error Handling (MamoPay)

**Common API Error Codes:**

| HTTP Status | Meaning | Typical Cause |
|------------|---------|---------------|
| 400 | Bad Request | Missing/invalid parameters |
| 401 | Unauthorized | Invalid or missing API key |
| 403 | Forbidden | API key lacks permission |
| 404 | Not Found | Link/charge ID does not exist |
| 422 | Unprocessable Entity | Validation error (e.g., invalid currency) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | MamoPay internal error |

**Handling Errors Gracefully:**

```php
<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MamoPayService
{
    private string $baseUrl;
    private string $apiKey;

    public function __construct()
    {
        $this->baseUrl = config('mamopay.base_url');
        $this->apiKey = config('mamopay.api_key');
    }

    /**
     * Create payment link with error handling
     */
    public function createLink(array $params): array
    {
        $response = Http::withToken($this->apiKey)
            ->timeout(30)
            ->retry(3, 1000, function ($exception, $request) {
                // Only retry on connection/server errors, not client errors
                return $exception instanceof \Illuminate\Http\Client\ConnectionException
                    || ($exception instanceof \Illuminate\Http\Client\RequestException
                        && $exception->response->status() >= 500);
            })
            ->post("{$this->baseUrl}/v1/links", $params);

        if ($response->successful()) {
            return ['success' => true, 'data' => $response->json()];
        }

        return $this->handleError($response);
    }

    /**
     * Handle API error responses
     */
    private function handleError($response): array
    {
        $status = $response->status();
        $body = $response->json();

        Log::error('MamoPay API error', [
            'status' => $status,
            'body' => $body,
        ]);

        $message = match ($status) {
            400 => 'Invalid payment request. Please check the details.',
            401 => 'Payment service authentication failed. Please contact support.',
            403 => 'Payment service access denied.',
            404 => 'Payment resource not found.',
            422 => $body['message'] ?? 'Validation error. Please check the payment details.',
            429 => 'Payment service is busy. Please try again in a moment.',
            default => 'Payment service error. Please try again later.',
        };

        return [
            'success' => false,
            'message' => $message,
            'status' => $status,
            'errors' => $body['errors'] ?? [],
        ];
    }

    /**
     * Get link details with error handling
     */
    public function getLink(string $linkId): array
    {
        $response = Http::withToken($this->apiKey)
            ->timeout(15)
            ->get("{$this->baseUrl}/v1/links/{$linkId}");

        if ($response->successful()) {
            return ['success' => true, 'data' => $response->json()];
        }

        return $this->handleError($response);
    }

    /**
     * Refund a charge
     */
    public function refundCharge(string $chargeId, ?float $amount = null): array
    {
        $params = $amount ? ['amount' => $amount] : [];

        $response = Http::withToken($this->apiKey)
            ->timeout(30)
            ->post("{$this->baseUrl}/v1/charges/{$chargeId}/refunds", $params);

        if ($response->successful()) {
            return ['success' => true, 'data' => $response->json()];
        }

        return $this->handleError($response);
    }
}
```

**Using the Service in Controllers:**

```php
use App\Services\MamoPayService;

class MamoPayController extends Controller
{
    public function __construct(
        private MamoPayService $mamoPay
    ) {}

    public function show(Order $order)
    {
        $result = $this->mamoPay->createLink([
            'title' => "Order #{$order->id}",
            'amount' => (float) $order->total,
            'amount_currency' => 'AED',
            'return_url' => route('payment.mamopay.callback', $order),
            'failure_return_url' => route('payment.mamopay.failed', $order),
            'custom_data' => ['order_id' => $order->id],
        ]);

        if (!$result['success']) {
            return back()->with('error', $result['message']);
        }

        $order->update(['mamopay_link_id' => $result['data']['id']]);

        return inertia('Payment/MamoPay', [
            'order' => $order,
            'paymentUrl' => $result['data']['payment_url'],
        ]);
    }
}
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

### Q16: What is a Checkout Session vs Payment Intent?

Both are Stripe objects for collecting payments, but they serve different purposes:

**Payment Intent:**
- Low-level API for custom payment flows
- You build the UI with Stripe Elements
- Full control over design and UX
- You handle payment method collection
- Best for: custom checkout experiences, in-app payments

**Checkout Session:**
- High-level API that redirects to Stripe-hosted page
- Stripe handles the entire UI
- Minimal frontend code needed
- Supports subscriptions and one-time payments in one flow
- Best for: quick setup, simple flows, landing pages

```php
// Payment Intent: you control the UI
$paymentIntent = PaymentIntent::create(['amount' => 2599, 'currency' => 'usd']);
// -> Pass client_secret to your React form with <PaymentElement />

// Checkout Session: Stripe controls the UI
$session = StripeCheckoutSession::create([
    'mode' => 'payment',
    'line_items' => [['price_data' => [...], 'quantity' => 1]],
    'success_url' => '...',
    'cancel_url' => '...',
]);
// -> Redirect user to $session->url
```

### Q17: How do subscriptions work?

Subscriptions automate recurring billing:

1. **Setup**: Create a Product and Price in Stripe Dashboard (e.g., "Pro Plan" at $29/month)
2. **Subscribe**: Customer provides payment method, you create subscription via Cashier
3. **Billing**: Stripe automatically charges the customer on each billing cycle
4. **Webhooks**: You receive events for successful/failed payments, cancellations
5. **Access**: Your app checks `$user->subscribed('default')` to gate features

**Lifecycle:**
- `active` — Customer is paying, access granted
- `trialing` — On trial period, access granted
- `past_due` — Payment failed, Stripe retrying (grace period)
- `canceled` — Canceled but may still be in grace period
- `incomplete` — Initial payment failed (e.g., 3D Secure required)
- `unpaid` — All retry attempts exhausted

With Laravel Cashier:

```php
// Create
$user->newSubscription('default', 'price_xxx')->create($paymentMethod);

// Check
$user->subscribed('default'); // true/false

// Cancel
$user->subscription('default')->cancel(); // grace period
$user->subscription('default')->cancelNow(); // immediate

// Resume (during grace period)
$user->subscription('default')->resume();

// Swap plan
$user->subscription('default')->swap('price_yyy');
```

### Q18: What is SCA (Strong Customer Authentication)?

SCA is a European regulation (part of PSD2) requiring additional authentication for online payments.

**Requirements:**
- Two of three factors: something you **know** (password/PIN), something you **have** (phone/card), something you **are** (fingerprint/face)
- Applies to EU/EEA card payments
- Implemented via 3D Secure 2 (3DS2)

**How Stripe handles it:**
- Stripe automatically triggers 3DS when required
- Payment Intent status becomes `requires_action`
- Frontend Stripe.js shows authentication modal
- After authentication, payment completes or fails

**In your code:**

```php
// Backend: no special code needed — Stripe handles SCA automatically
$paymentIntent = PaymentIntent::create([
    'amount' => 2599,
    'currency' => 'eur',
    'payment_method' => $paymentMethodId,
    'confirmation_method' => 'automatic', // default
]);
```

```tsx
// Frontend: Stripe Elements handles the 3DS popup automatically
const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: { return_url: returnUrl },
});
// If 3DS is required, Stripe.js shows the bank's auth popup automatically
```

**Exemptions** (payments that may skip SCA):
- Low-value transactions (under 30 EUR)
- Trusted beneficiaries (customer whitelisted you)
- Recurring payments (after initial authentication)
- Merchant-initiated transactions

### Q19: How to handle refunds properly?

Best practices for refund handling:

1. **Always verify the order is paid** before attempting a refund
2. **Track refund amounts** — support both full and partial refunds
3. **Use webhooks** to confirm refund status (don't rely on API response alone)
4. **Log everything** — refund disputes are common
5. **Set refund policies** — time limits, eligibility rules

```php
// Refund checklist
public function processRefund(Order $order, float $amount = null)
{
    // 1. Verify order is paid
    if (!in_array($order->payment_status, ['paid', 'partially_refunded'])) {
        throw new \Exception('Order is not eligible for refund.');
    }

    // 2. Verify refund amount
    $maxRefundable = $order->total - ($order->refunded_amount ?? 0);
    $refundAmount = $amount ?? $maxRefundable;
    if ($refundAmount > $maxRefundable) {
        throw new \Exception("Maximum refundable amount is {$maxRefundable}.");
    }

    // 3. Process via provider
    if ($order->stripe_payment_intent_id) {
        return $this->refundStripe($order, $refundAmount);
    }
    if ($order->mamopay_link_id) {
        return $this->refundMamoPay($order, $refundAmount);
    }

    throw new \Exception('No payment provider found for this order.');
}
```

**Refund timeline:**
- Stripe: 5-10 business days to appear on customer's statement
- MamoPay: Varies by bank, typically 5-14 business days
- Always communicate timeline to customer

### Q20: What is Stripe Connect and when to use it?

Stripe Connect is for marketplace/platform businesses where you need to split payments between multiple parties.

**Use cases:**
- Marketplace (like Uber, Airbnb) — you collect payment, split between seller and platform
- SaaS with sub-merchants — each merchant has their own Stripe account
- Crowdfunding — collect funds on behalf of project creators

**Three account types:**
- **Standard**: Merchant has their own Stripe Dashboard (easiest)
- **Express**: Simplified onboarding, limited dashboard access
- **Custom**: Full control, you build all UI (most work)

**Basic flow:**

```php
// 1. Create a connected account
$account = \Stripe\Account::create([
    'type' => 'express',
    'country' => 'US',
    'email' => 'seller@example.com',
]);

// 2. Create onboarding link
$link = \Stripe\AccountLink::create([
    'account' => $account->id,
    'refresh_url' => route('connect.refresh'),
    'return_url' => route('connect.complete'),
    'type' => 'account_onboarding',
]);
// Redirect seller to $link->url

// 3. Create payment with transfer to connected account
$paymentIntent = PaymentIntent::create([
    'amount' => 10000, // $100.00
    'currency' => 'usd',
    'application_fee_amount' => 1500, // $15.00 platform fee
    'transfer_data' => [
        'destination' => $account->id, // connected account
    ],
]);
```

**When NOT to use Stripe Connect:**
- Single-vendor store (use regular Stripe)
- Simple donation collection (use Checkout Sessions)
- Subscription-only SaaS (use Cashier)

---

## 10. Payment Service Architecture

Use the Strategy pattern to support multiple payment providers with a unified interface. This makes it easy to add new providers without modifying existing code.

**Abstract Payment Interface:**

```php
<?php

namespace App\Contracts;

use App\Models\Order;

interface PaymentProviderInterface
{
    /**
     * Create a payment for the given order
     *
     * @return array{success: bool, data: array, redirect_url?: string}
     */
    public function createPayment(Order $order, array $options = []): array;

    /**
     * Verify payment status
     *
     * @return array{status: string, transaction_id: ?string, amount: float}
     */
    public function verifyPayment(Order $order): array;

    /**
     * Process a refund
     *
     * @return array{success: bool, refund_id: ?string}
     */
    public function refund(Order $order, ?float $amount = null): array;

    /**
     * Get the provider name
     */
    public function getName(): string;
}
```

**Stripe Provider Implementation:**

```php
<?php

namespace App\Services\Payment;

use App\Contracts\PaymentProviderInterface;
use App\Helpers\CurrencyHelper;
use App\Models\Order;
use Illuminate\Support\Facades\Log;
use Stripe\PaymentIntent;
use Stripe\Refund;
use Stripe\Stripe;

class StripePaymentProvider implements PaymentProviderInterface
{
    public function __construct()
    {
        Stripe::setApiKey(config('cashier.secret'));
    }

    public function createPayment(Order $order, array $options = []): array
    {
        try {
            $currency = $order->currency ?? config('cashier.currency', 'usd');

            $paymentIntent = PaymentIntent::create([
                'amount' => CurrencyHelper::toStripeAmount($order->total, $currency),
                'currency' => $currency,
                'metadata' => ['order_id' => $order->id],
            ]);

            $order->update(['stripe_payment_intent_id' => $paymentIntent->id]);

            return [
                'success' => true,
                'data' => [
                    'client_secret' => $paymentIntent->client_secret,
                    'payment_intent_id' => $paymentIntent->id,
                ],
            ];
        } catch (\Exception $e) {
            Log::error('Stripe createPayment failed', ['error' => $e->getMessage()]);
            return ['success' => false, 'data' => [], 'error' => $e->getMessage()];
        }
    }

    public function verifyPayment(Order $order): array
    {
        try {
            $paymentIntent = PaymentIntent::retrieve($order->stripe_payment_intent_id);

            return [
                'status' => $paymentIntent->status === 'succeeded' ? 'paid' : $paymentIntent->status,
                'transaction_id' => $paymentIntent->id,
                'amount' => $paymentIntent->amount / 100,
            ];
        } catch (\Exception $e) {
            return ['status' => 'error', 'transaction_id' => null, 'amount' => 0];
        }
    }

    public function refund(Order $order, ?float $amount = null): array
    {
        try {
            $params = ['payment_intent' => $order->stripe_payment_intent_id];
            if ($amount) {
                $currency = $order->currency ?? config('cashier.currency', 'usd');
                $params['amount'] = CurrencyHelper::toStripeAmount($amount, $currency);
            }

            $refund = Refund::create($params);

            return ['success' => true, 'refund_id' => $refund->id];
        } catch (\Exception $e) {
            Log::error('Stripe refund failed', ['error' => $e->getMessage()]);
            return ['success' => false, 'refund_id' => null];
        }
    }

    public function getName(): string
    {
        return 'stripe';
    }
}
```

**MamoPay Provider Implementation:**

```php
<?php

namespace App\Services\Payment;

use App\Contracts\PaymentProviderInterface;
use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MamoPayPaymentProvider implements PaymentProviderInterface
{
    private string $baseUrl;
    private string $apiKey;

    public function __construct()
    {
        $this->baseUrl = config('mamopay.base_url');
        $this->apiKey = config('mamopay.api_key');
    }

    public function createPayment(Order $order, array $options = []): array
    {
        $response = Http::withToken($this->apiKey)
            ->post("{$this->baseUrl}/v1/links", array_merge([
                'title' => "Order #{$order->id}",
                'amount' => (float) $order->total,
                'amount_currency' => $order->currency ?? 'AED',
                'custom_data' => ['order_id' => $order->id],
            ], $options));

        if ($response->successful()) {
            $data = $response->json();
            $order->update(['mamopay_link_id' => $data['id']]);

            return [
                'success' => true,
                'data' => $data,
                'redirect_url' => $data['payment_url'] ?? null,
            ];
        }

        Log::error('MamoPay createPayment failed', ['body' => $response->body()]);
        return ['success' => false, 'data' => [], 'error' => $response->json('message')];
    }

    public function verifyPayment(Order $order): array
    {
        $response = Http::withToken($this->apiKey)
            ->get("{$this->baseUrl}/v1/links/{$order->mamopay_link_id}");

        if ($response->successful()) {
            $data = $response->json();

            foreach ($data['charges'] ?? [] as $charge) {
                if ($charge['status'] === 'captured') {
                    return [
                        'status' => 'paid',
                        'transaction_id' => $charge['id'],
                        'amount' => $data['amount'],
                    ];
                }
            }

            return ['status' => 'unpaid', 'transaction_id' => null, 'amount' => 0];
        }

        return ['status' => 'error', 'transaction_id' => null, 'amount' => 0];
    }

    public function refund(Order $order, ?float $amount = null): array
    {
        $chargeId = $order->transaction_id;
        $params = $amount ? ['amount' => $amount] : [];

        $response = Http::withToken($this->apiKey)
            ->post("{$this->baseUrl}/v1/charges/{$chargeId}/refunds", $params);

        if ($response->successful()) {
            return ['success' => true, 'refund_id' => $response->json('id')];
        }

        Log::error('MamoPay refund failed', ['body' => $response->body()]);
        return ['success' => false, 'refund_id' => null];
    }

    public function getName(): string
    {
        return 'mamopay';
    }
}
```

**Payment Manager (Factory):**

```php
<?php

namespace App\Services\Payment;

use App\Contracts\PaymentProviderInterface;
use App\Models\Order;
use InvalidArgumentException;

class PaymentManager
{
    private array $providers = [];

    public function __construct()
    {
        $this->registerProvider(new StripePaymentProvider());
        $this->registerProvider(new MamoPayPaymentProvider());
    }

    /**
     * Register a payment provider
     */
    public function registerProvider(PaymentProviderInterface $provider): void
    {
        $this->providers[$provider->getName()] = $provider;
    }

    /**
     * Get a specific provider
     */
    public function provider(string $name): PaymentProviderInterface
    {
        if (!isset($this->providers[$name])) {
            throw new InvalidArgumentException("Payment provider '{$name}' is not registered.");
        }

        return $this->providers[$name];
    }

    /**
     * Resolve the correct provider for an order
     */
    public function resolveForOrder(Order $order): PaymentProviderInterface
    {
        if ($order->stripe_payment_intent_id) {
            return $this->provider('stripe');
        }

        if ($order->mamopay_link_id) {
            return $this->provider('mamopay');
        }

        // Default based on config or user preference
        return $this->provider(config('payment.default_provider', 'stripe'));
    }

    /**
     * List all available providers
     */
    public function availableProviders(): array
    {
        return array_keys($this->providers);
    }
}
```

**Register as a Service:**

```php
// app/Providers/PaymentServiceProvider.php
<?php

namespace App\Providers;

use App\Contracts\PaymentProviderInterface;
use App\Services\Payment\PaymentManager;
use App\Services\Payment\StripePaymentProvider;
use Illuminate\Support\ServiceProvider;

class PaymentServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(PaymentManager::class, function () {
            return new PaymentManager();
        });

        // Bind default provider
        $this->app->bind(PaymentProviderInterface::class, function ($app) {
            $defaultProvider = config('payment.default_provider', 'stripe');
            return $app->make(PaymentManager::class)->provider($defaultProvider);
        });
    }
}
```

**Usage in Controllers:**

```php
use App\Services\Payment\PaymentManager;

class UnifiedPaymentController extends Controller
{
    public function __construct(
        private PaymentManager $paymentManager
    ) {}

    public function create(Request $request, Order $order)
    {
        $providerName = $request->input('provider', 'stripe');
        $provider = $this->paymentManager->provider($providerName);

        $result = $provider->createPayment($order, [
            'return_url' => route('payment.callback', $order),
            'failure_return_url' => route('payment.failed', $order),
        ]);

        if (!$result['success']) {
            return back()->with('error', 'Payment creation failed.');
        }

        // Route to the correct frontend based on provider
        $view = $providerName === 'stripe' ? 'Payment/Stripe' : 'Payment/MamoPay';

        return inertia($view, [
            'order' => $order,
            ...$result['data'],
        ]);
    }

    public function verify(Order $order)
    {
        $provider = $this->paymentManager->resolveForOrder($order);
        $result = $provider->verifyPayment($order);

        if ($result['status'] === 'paid') {
            $order->update([
                'payment_status' => 'paid',
                'paid_at' => now(),
                'transaction_id' => $result['transaction_id'],
            ]);
            return redirect()->route('payment.success', $order);
        }

        return redirect()->route('payment.failed', $order);
    }
}
```

**Adding a New Provider:**

To add a new payment provider (e.g., PayPal, Tap Payments):

1. Create a class implementing `PaymentProviderInterface`
2. Register it in `PaymentManager::__construct()` or `PaymentServiceProvider`
3. Add frontend form component
4. Add webhook handler

```php
// Example: adding Tap Payments
class TapPaymentProvider implements PaymentProviderInterface
{
    public function createPayment(Order $order, array $options = []): array { /* ... */ }
    public function verifyPayment(Order $order): array { /* ... */ }
    public function refund(Order $order, ?float $amount = null): array { /* ... */ }
    public function getName(): string { return 'tap'; }
}

// Register in PaymentManager or ServiceProvider
$manager->registerProvider(new TapPaymentProvider());
```

---

## 11. Refund Flow (Complete)

A unified refund handling flow that works across providers.

**Unified Refund Service:**

```php
<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Refund as RefundModel;
use App\Services\Payment\PaymentManager;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RefundService
{
    public function __construct(
        private PaymentManager $paymentManager
    ) {}

    /**
     * Process a refund for any provider
     */
    public function processRefund(
        Order $order,
        ?float $amount = null,
        string $reason = 'requested_by_customer',
        ?int $adminId = null,
    ): RefundModel {
        // Validate
        $this->validateRefundEligibility($order, $amount);

        $refundAmount = $amount ?? ($order->total - ($order->refunded_amount ?? 0));
        $provider = $this->paymentManager->resolveForOrder($order);

        return DB::transaction(function () use ($order, $refundAmount, $reason, $adminId, $provider) {
            // Create refund record
            $refund = RefundModel::create([
                'order_id' => $order->id,
                'amount' => $refundAmount,
                'reason' => $reason,
                'provider' => $provider->getName(),
                'status' => 'pending',
                'processed_by' => $adminId,
            ]);

            // Process with provider
            $result = $provider->refund($order, $refundAmount);

            if ($result['success']) {
                $refund->update([
                    'status' => 'processed',
                    'provider_refund_id' => $result['refund_id'],
                    'processed_at' => now(),
                ]);

                // Update order
                $totalRefunded = ($order->refunded_amount ?? 0) + $refundAmount;
                $order->update([
                    'payment_status' => $totalRefunded >= $order->total ? 'refunded' : 'partially_refunded',
                    'refunded_amount' => $totalRefunded,
                    'refunded_at' => now(),
                ]);

                Log::info('Refund processed', [
                    'order_id' => $order->id,
                    'amount' => $refundAmount,
                    'provider' => $provider->getName(),
                ]);
            } else {
                $refund->update(['status' => 'failed']);
                Log::error('Refund failed', [
                    'order_id' => $order->id,
                    'provider' => $provider->getName(),
                ]);
            }

            return $refund;
        });
    }

    /**
     * Validate refund eligibility
     */
    private function validateRefundEligibility(Order $order, ?float $amount): void
    {
        if (!in_array($order->payment_status, ['paid', 'partially_refunded'])) {
            throw new \Exception('Order is not eligible for refund.');
        }

        $maxRefundable = $order->total - ($order->refunded_amount ?? 0);

        if ($amount && $amount > $maxRefundable) {
            throw new \Exception("Maximum refundable amount is {$maxRefundable}.");
        }

        if ($amount && $amount <= 0) {
            throw new \Exception('Refund amount must be positive.');
        }

        // Optional: enforce refund time limit
        if ($order->paid_at && $order->paid_at->diffInDays(now()) > 180) {
            throw new \Exception('Refund window has expired (180 days).');
        }
    }
}
```

**Refund Model and Migration:**

```php
// Migration
Schema::create('refunds', function (Blueprint $table) {
    $table->id();
    $table->foreignId('order_id')->constrained()->onDelete('cascade');
    $table->decimal('amount', 10, 2);
    $table->string('reason');
    $table->string('provider'); // 'stripe' or 'mamopay'
    $table->string('provider_refund_id')->nullable();
    $table->string('status'); // 'pending', 'processed', 'failed'
    $table->foreignId('processed_by')->nullable()->constrained('users');
    $table->timestamp('processed_at')->nullable();
    $table->timestamps();
});

// Model
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Refund extends Model
{
    protected $fillable = [
        'order_id', 'amount', 'reason', 'provider',
        'provider_refund_id', 'status', 'processed_by', 'processed_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'processed_at' => 'datetime',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function processedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }
}
```

**Admin Refund Controller:**

```php
<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\RefundService;
use Illuminate\Http\Request;

class AdminRefundController extends Controller
{
    public function __construct(
        private RefundService $refundService
    ) {}

    /**
     * Show refund form for an order
     */
    public function create(Order $order)
    {
        $maxRefundable = $order->total - ($order->refunded_amount ?? 0);

        return inertia('Admin/Refund', [
            'order' => $order->load('refunds'),
            'maxRefundable' => $maxRefundable,
        ]);
    }

    /**
     * Process the refund
     */
    public function store(Request $request, Order $order)
    {
        $request->validate([
            'amount' => 'nullable|numeric|min:0.01',
            'reason' => 'required|string|in:requested_by_customer,duplicate,fraudulent,product_issue,other',
        ]);

        try {
            $refund = $this->refundService->processRefund(
                order: $order,
                amount: $request->amount, // null = full refund
                reason: $request->reason,
                adminId: $request->user()->id,
            );

            if ($refund->status === 'processed') {
                return back()->with('success', "Refund of {$refund->amount} processed.");
            }

            return back()->with('error', 'Refund failed. Check logs for details.');
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }
}
```

**Admin Refund UI (`resources/js/pages/Admin/Refund.tsx`):**

```tsx
import { useState } from 'react';
import { router } from '@inertiajs/react';

interface RefundRecord {
    id: number;
    amount: string;
    reason: string;
    status: string;
    processed_at: string | null;
}

interface Order {
    id: number;
    total: number;
    payment_status: string;
    refunded_amount: number | null;
    refunds: RefundRecord[];
}

interface Props {
    order: Order;
    maxRefundable: number;
}

const REASONS = [
    { value: 'requested_by_customer', label: 'Customer Request' },
    { value: 'duplicate', label: 'Duplicate Payment' },
    { value: 'fraudulent', label: 'Fraudulent' },
    { value: 'product_issue', label: 'Product Issue' },
    { value: 'other', label: 'Other' },
];

export default function AdminRefund({ order, maxRefundable }: Props) {
    const [amount, setAmount] = useState<string>(maxRefundable.toFixed(2));
    const [reason, setReason] = useState('requested_by_customer');
    const [loading, setLoading] = useState(false);
    const [isFullRefund, setIsFullRefund] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirm(`Process refund of $${isFullRefund ? maxRefundable.toFixed(2) : amount}?`)) return;

        setLoading(true);
        router.post(`/admin/orders/${order.id}/refund`, {
            amount: isFullRefund ? null : parseFloat(amount),
            reason,
        }, {
            onFinish: () => setLoading(false),
        });
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Refund Order #{order.id}</h1>

            <div className="bg-gray-50 rounded p-4 mb-6">
                <p>Order Total: <strong>${order.total.toFixed(2)}</strong></p>
                <p>Already Refunded: <strong>${(order.refunded_amount ?? 0).toFixed(2)}</strong></p>
                <p>Max Refundable: <strong>${maxRefundable.toFixed(2)}</strong></p>
                <p>Status: <strong>{order.payment_status}</strong></p>
            </div>

            {maxRefundable > 0 ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={isFullRefund}
                                onChange={(e) => setIsFullRefund(e.target.checked)}
                            />
                            Full refund (${maxRefundable.toFixed(2)})
                        </label>
                    </div>

                    {!isFullRefund && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Amount</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                max={maxRefundable}
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="border rounded p-2 w-full"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium mb-1">Reason</label>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="border rounded p-2 w-full"
                        >
                            {REASONS.map((r) => (
                                <option key={r.value} value={r.value}>{r.label}</option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-red-600 text-white py-2 px-6 rounded disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Process Refund'}
                    </button>
                </form>
            ) : (
                <p className="text-gray-500">This order has been fully refunded.</p>
            )}

            {order.refunds.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-lg font-semibold mb-3">Refund History</h2>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b text-left">
                                <th className="py-2">ID</th>
                                <th className="py-2">Amount</th>
                                <th className="py-2">Reason</th>
                                <th className="py-2">Status</th>
                                <th className="py-2">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {order.refunds.map((refund) => (
                                <tr key={refund.id} className="border-b">
                                    <td className="py-2">{refund.id}</td>
                                    <td className="py-2">${refund.amount}</td>
                                    <td className="py-2">{refund.reason}</td>
                                    <td className="py-2">
                                        <span className={`text-sm px-2 py-0.5 rounded ${
                                            refund.status === 'processed'
                                                ? 'bg-green-100 text-green-700'
                                                : refund.status === 'failed'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {refund.status}
                                        </span>
                                    </td>
                                    <td className="py-2">{refund.processed_at ?? '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
```

**Refund Policies:**

Define clear refund rules in your application:

```php
// config/refund.php
return [
    // Maximum days after payment to allow refund
    'window_days' => 180,

    // Allowed reasons
    'reasons' => [
        'requested_by_customer',
        'duplicate',
        'fraudulent',
        'product_issue',
        'other',
    ],

    // Auto-approve refunds under this amount (no admin review)
    'auto_approve_threshold' => 50.00,

    // Require admin approval for refunds above this amount
    'require_approval_above' => 500.00,

    // Maximum number of refunds per order
    'max_refunds_per_order' => 5,
];
```

---

## 12. Subscription Management

Complete subscription lifecycle management with grace periods, failed payment handling (dunning), and plan changes.

**Subscription Lifecycle:**

```
Trial -> Active -> Past Due (retry) -> Active (if retry succeeds)
                                    -> Canceled (if all retries fail)

Active -> Canceled (by user) -> Grace Period -> Ended

Active -> Swap Plan -> Active (new plan, prorated)
```

**Grace Period Handling:**

When a user cancels, they should keep access until their current billing period ends:

```php
<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SubscriptionManagementController extends Controller
{
    /**
     * Show subscription management page
     */
    public function show(Request $request)
    {
        $user = $request->user();
        $subscription = $user->subscription('default');

        $data = [
            'subscribed' => $user->subscribed('default'),
            'onTrial' => $subscription?->onTrial() ?? false,
            'onGracePeriod' => $subscription?->onGracePeriod() ?? false,
            'canceled' => $subscription?->canceled() ?? false,
            'ended' => $subscription?->ended() ?? false,
            'currentPlan' => $subscription?->stripe_price,
            'trialEndsAt' => $subscription?->trial_ends_at?->toDateTimeString(),
            'endsAt' => $subscription?->ends_at?->toDateTimeString(),
            'nextBillingDate' => null,
        ];

        // Get next billing date from Stripe
        if ($subscription && !$subscription->canceled()) {
            try {
                $stripeSubscription = $subscription->asStripeSubscription();
                $data['nextBillingDate'] = \Carbon\Carbon::createFromTimestamp(
                    $stripeSubscription->current_period_end
                )->toDateTimeString();
            } catch (\Exception $e) {
                // Stripe lookup failed, skip
            }
        }

        return inertia('Subscription/Manage', $data);
    }

    /**
     * Cancel with grace period
     */
    public function cancel(Request $request)
    {
        $subscription = $request->user()->subscription('default');

        if (!$subscription || $subscription->canceled()) {
            return back()->with('error', 'No active subscription to cancel.');
        }

        $subscription->cancel();

        return back()->with('success',
            'Subscription canceled. You can still use premium features until ' .
            $subscription->ends_at->toFormattedDateString() . '.'
        );
    }

    /**
     * Resume during grace period
     */
    public function resume(Request $request)
    {
        $subscription = $request->user()->subscription('default');

        if (!$subscription?->onGracePeriod()) {
            return back()->with('error', 'No subscription to resume or grace period has ended.');
        }

        $subscription->resume();

        return back()->with('success', 'Subscription resumed! You will continue to be billed normally.');
    }

    /**
     * Swap to a different plan
     */
    public function swap(Request $request)
    {
        $request->validate([
            'plan' => 'required|string|in:basic,pro,enterprise',
        ]);

        $user = $request->user();
        $subscription = $user->subscription('default');

        if (!$subscription || $subscription->ended()) {
            return back()->with('error', 'No active subscription. Please create a new subscription.');
        }

        $newPriceId = config("subscription.plans.{$request->plan}.price_id");

        // Swap with proration (default)
        $subscription->swap($newPriceId);

        return back()->with('success', 'Plan updated successfully!');
    }
}
```

**Dunning (Failed Payment Retry):**

Stripe automatically retries failed subscription payments. Configure retry logic in your Stripe Dashboard under Settings > Billing > Subscription and emails.

Handle the events in your webhook:

```php
// In StripeWebhookController::handle()

// Payment failed on subscription renewal
if ($event->type === 'invoice.payment_failed') {
    $invoice = $event->data->object;
    $customerId = $invoice->customer;
    $attemptCount = $invoice->attempt_count;

    $user = \App\Models\User::where('stripe_id', $customerId)->first();
    if (!$user) return response('OK', 200);

    Log::warning('Subscription payment failed', [
        'user_id' => $user->id,
        'attempt' => $attemptCount,
        'next_attempt' => $invoice->next_payment_attempt,
    ]);

    // Notify user based on attempt number
    if ($attemptCount === 1) {
        $user->notify(new \App\Notifications\PaymentFailedFirstAttempt());
    } elseif ($attemptCount === 2) {
        $user->notify(new \App\Notifications\PaymentFailedSecondAttempt());
    } elseif ($attemptCount >= 3) {
        $user->notify(new \App\Notifications\PaymentFailedFinalAttempt());
    }
}

// Subscription marked past_due or canceled after failed retries
if ($event->type === 'customer.subscription.updated') {
    $subscription = $event->data->object;

    if ($subscription->status === 'past_due') {
        Log::warning('Subscription past due', ['id' => $subscription->id]);
    }

    if ($subscription->status === 'canceled') {
        Log::info('Subscription canceled by Stripe (retries exhausted)', [
            'id' => $subscription->id,
        ]);
    }
}

// Subscription fully deleted
if ($event->type === 'customer.subscription.deleted') {
    $subscription = $event->data->object;
    $customerId = $subscription->customer;

    $user = \App\Models\User::where('stripe_id', $customerId)->first();
    if ($user) {
        $user->notify(new \App\Notifications\SubscriptionEnded());
    }
}
```

**Payment Failed Notification:**

```php
<?php

namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class PaymentFailedFirstAttempt extends Notification
{
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Payment Failed - Action Required')
            ->greeting('Hello ' . $notifiable->name)
            ->line('We were unable to process your subscription payment.')
            ->line('Please update your payment method to avoid any interruption to your service.')
            ->action('Update Payment Method', route('billing.payment-methods'))
            ->line('We will retry the payment automatically in a few days.');
    }
}
```

**Plan Change Proration:**

When swapping plans mid-cycle, Stripe handles proration:

```php
// Default: prorate (charge/credit the difference)
$subscription->swap($newPriceId);

// No proration (new price starts next cycle)
$subscription->noProrate()->swap($newPriceId);

// Swap and invoice immediately (charge now)
$subscription->swapAndInvoice($newPriceId);

// Example: User is on Basic ($10/mo), swaps to Pro ($29/mo) on day 15 of 30
// Prorated credit: $10 * (15/30) = $5.00 credit
// Prorated charge: $29 * (15/30) = $14.50 charge
// Net charge: $14.50 - $5.00 = $9.50
```

**Frontend Subscription Management (`resources/js/pages/Subscription/Manage.tsx`):**

```tsx
import { router } from '@inertiajs/react';

interface Props {
    subscribed: boolean;
    onTrial: boolean;
    onGracePeriod: boolean;
    canceled: boolean;
    ended: boolean;
    currentPlan: string | null;
    trialEndsAt: string | null;
    endsAt: string | null;
    nextBillingDate: string | null;
}

export default function ManageSubscription({
    subscribed, onTrial, onGracePeriod, canceled, ended,
    currentPlan, trialEndsAt, endsAt, nextBillingDate,
}: Props) {
    const handleCancel = () => {
        if (confirm('Are you sure you want to cancel? You will retain access until the end of your billing period.')) {
            router.post('/subscription/cancel');
        }
    };

    const handleResume = () => {
        router.post('/subscription/resume');
    };

    if (!subscribed && !onGracePeriod) {
        return (
            <div className="max-w-lg mx-auto p-6 text-center">
                <h2 className="text-xl font-bold mb-4">No Active Subscription</h2>
                <p className="text-gray-600 mb-6">Choose a plan to get started.</p>
                <a href="/subscription/plans" className="bg-blue-600 text-white py-2 px-6 rounded">
                    View Plans
                </a>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto p-6">
            <h2 className="text-xl font-bold mb-6">Subscription</h2>

            <div className="border rounded-lg p-6 space-y-4">
                <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className={`font-medium ${
                        onGracePeriod ? 'text-yellow-600' :
                        onTrial ? 'text-blue-600' :
                        subscribed ? 'text-green-600' : 'text-red-600'
                    }`}>
                        {onGracePeriod ? 'Canceled (Grace Period)' :
                         onTrial ? 'Trial' :
                         subscribed ? 'Active' : 'Inactive'}
                    </span>
                </div>

                {onTrial && trialEndsAt && (
                    <div className="flex justify-between">
                        <span className="text-gray-600">Trial ends</span>
                        <span>{new Date(trialEndsAt).toLocaleDateString()}</span>
                    </div>
                )}

                {onGracePeriod && endsAt && (
                    <div className="flex justify-between">
                        <span className="text-gray-600">Access until</span>
                        <span>{new Date(endsAt).toLocaleDateString()}</span>
                    </div>
                )}

                {nextBillingDate && !canceled && (
                    <div className="flex justify-between">
                        <span className="text-gray-600">Next billing</span>
                        <span>{new Date(nextBillingDate).toLocaleDateString()}</span>
                    </div>
                )}

                <hr />

                <div className="flex gap-3">
                    {onGracePeriod ? (
                        <button
                            onClick={handleResume}
                            className="bg-green-600 text-white py-2 px-4 rounded"
                        >
                            Resume Subscription
                        </button>
                    ) : subscribed ? (
                        <>
                            <a
                                href="/subscription/plans"
                                className="bg-blue-600 text-white py-2 px-4 rounded"
                            >
                                Change Plan
                            </a>
                            <button
                                onClick={handleCancel}
                                className="border border-red-600 text-red-600 py-2 px-4 rounded"
                            >
                                Cancel
                            </button>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
```

---

**Official Documentation:**
- [Stripe](https://stripe.com/docs)
- [MamoPay](https://docs.mamopay.com)
- [Laravel Cashier](https://laravel.com/docs/billing)
