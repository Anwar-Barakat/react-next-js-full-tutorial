# Laravel Validation Guide

A comprehensive guide to request validation in Laravel.

## Table of Contents

1. [What is validation in Laravel?](#1-what-is-validation-in-laravel)
2. [What are validation rules in Laravel?](#2-what-are-validation-rules-in-laravel)
3. [What is Form Request validation?](#3-what-is-form-request-validation)

---

## 1. What is validation in Laravel?

- Validation checks that incoming data meets rules before processing.
- Laravel offers request validation, form requests, and manual validation.
- Helps protect the app from invalid or harmful data.

---

## 2. What are validation rules in Laravel?

- Validation rules define what data is allowed (e.g., `max:255`, `unique:users,email`).
- Validation rules act like guards that check data before it enters the system.
- Can be applied via Form Request classes, the `validate()` method, or the `Validator` facade.
  - **Form Requests**: Best for large/reusable validations; keeps controllers clean.
  - **`validate()`**: Quick validation directly in controllers for small forms.
- Supports custom rules via `php artisan make:rule`.

```php
$request->validate([
    'name'  => 'required|string|max:255',
    'email' => 'required|email|unique:users,email',
    'age'   => 'required|integer|min:18',
]);
```

---

## 3. What is Form Request validation?

- Form Requests are custom classes used to handle validation.
- They move validation logic out of controllers → cleaner code.
- Can also authorize the request (who is allowed).
- Allow custom error messages in one place.

```bash
php artisan make:request StoreUserRequest
```

```php
class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Control access here
    }

    public function rules(): array
    {
        return [
            'name'  => 'required|string|max:255',
            'email' => 'required|email|unique:users',
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'This email is already taken.',
        ];
    }
}
```

```php
// In controller
public function store(StoreUserRequest $request)
{
    // Validation already passed
    User::create($request->validated());
}
```
