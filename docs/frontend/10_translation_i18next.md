# React-i18next Translations Implementation Guide

Complete guide to implementing internationalization (i18n) in React applications using react-i18next.

**Last Updated**: 2026-02-12

---

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Configuration](#configuration)
   - [Basic Setup](#basic-setup)
   - [Configuration Options](#configuration-options)
   - [Importing i18n](#importing-i18n)
4. [File Structure](#file-structure)
   - [Recommended Structure](#recommended-structure)
   - [File Purposes](#file-purposes)
5. [Namespaces](#namespaces)
   - [Understanding Namespaces](#understanding-namespaces)
   - [Using Namespaces](#using-namespaces)
   - [Multiple Namespaces](#multiple-namespaces)
   - [Fallback Order](#fallback-order)
6. [Implementation Patterns](#implementation-patterns)
   - [Basic Usage](#basic-usage)
   - [Interpolation](#interpolation)
   - [Pluralization](#pluralization)
   - [Page Titles](#page-titles)
   - [Toast Notifications](#toast-notifications)
   - [Form Validation](#form-validation)
7. [Adding New Translations](#adding-new-translations)
   - [Adding Translation Keys](#adding-translation-keys)
   - [Adding Namespaces](#adding-namespaces)
   - [Naming Conventions](#naming-conventions)
8. [RTL Support](#rtl-support)
   - [Handling RTL Languages](#handling-rtl-languages)
   - [Checking RTL Status](#checking-rtl-status)
   - [RTL-Aware Styles](#rtl-aware-styles)
   - [RTL Icons](#rtl-icons)
9. [Language Switching](#language-switching)
   - [Programmatic Language Change](#programmatic-language-change)
   - [Getting Current Language](#getting-current-language)
   - [Date Formatting](#date-formatting)
10. [Best Practices](#best-practices)
    - [Key Practices](#key-practices)
    - [Key Structure Guidelines](#key-structure-guidelines)
    - [Common vs Specific Namespace](#common-vs-specific-namespace)
    - [Long Text Handling](#long-text-handling)
    - [API Responses](#api-responses)
11. [Troubleshooting](#troubleshooting)
    - [Common Issues](#common-issues)
    - [Debugging Techniques](#debugging-techniques)
    - [Validation](#validation)
12. [Quick Reference](#quick-reference)
13. [Translation Checklist](#translation-checklist)

---

## Overview

### What is react-i18next?

**react-i18next** is a powerful internationalization framework for React applications built on top of i18next. It provides:

- **Translation Management**: Organize translations by namespaces and languages
- **Dynamic Language Switching**: Change languages without page reload
- **RTL Support**: Built-in support for right-to-left languages
- **Interpolation**: Insert dynamic values into translations
- **Pluralization**: Handle singular/plural forms automatically
- **TypeScript Support**: Full type safety for translation keys

### Key Features

| Feature | Description |
|---------|-------------|
| **Namespaces** | Organize translations by feature or module |
| **Interpolation** | Dynamic values: `{{variable}}` |
| **Pluralization** | Automatic singular/plural handling |
| **RTL Support** | Automatic direction switching for RTL languages |
| **LocalStorage** | Persist user language preference |
| **Fallback** | Fallback to default language if key missing |
| **Lazy Loading** | Load translations on demand |
| **TypeScript** | Full type support |

### Storage

User language preference is stored in **localStorage** under a configurable key (default: `'app-language'`).

---

## Installation

```bash
npm install react-i18next i18next
# or
yarn add react-i18next i18next
# or
pnpm add react-i18next i18next
```

---

## Configuration

### Basic Setup

Configuration is typically placed in `resources/js/locales/locales.ts` (or your project's locale config path).

```javascript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enCommon from './en/common.json';
import arCommon from './ar/common.json';

const resources = {
    en: {
        common: enCommon,
    },
    ar: {
        common: arCommon,
    },
};

const defaultLocale = 'en';
const initialLanguage = localStorage.getItem('app-language') || defaultLocale;

i18n
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: defaultLocale,
        lng: initialLanguage,
        defaultNS: 'common',
        fallbackNS: ['common'],
        interpolation: {
            escapeValue: false, // React already escapes values
        },
    });

export default i18n;
```

### Configuration Options

| Option | Value | Purpose |
|--------|-------|---------|
| `resources` | Object | Translation resources by language |
| `fallbackLng` | `'en'` | Fallback language if key missing |
| `lng` | `'en'` | Initial/current language |
| `defaultNS` | `'common'` | Default namespace |
| `fallbackNS` | `['common']` | Fallback namespaces |
| `escapeValue` | `false` | React handles escaping (prevent double-escaping) |
| `interpolation` | Object | Interpolation configuration |
| `debug` | `false` | Enable debug logging |

### Importing i18n

Import the configured i18n instance in your application:

```javascript
import i18n from '@/locales';
```

**In App Root** (e.g., `main.tsx` or `App.tsx`):

```javascript
import './locales'; // Initialize i18n
```

---

## File Structure

### Recommended Structure

```
resources/js/locales/
├── index.ts              # Main export
├── locales.ts            # i18n configuration
├── en/                   # English translations
│   ├── common.json       # Shared/common translations
│   ├── auth.json         # Authentication translations
│   ├── dashboard.json    # Dashboard translations
│   └── [namespace].json  # Feature-specific translations
├── ar/                   # Arabic translations
│   ├── common.json       # Shared/common translations
│   ├── auth.json         # Authentication translations
│   ├── dashboard.json    # Dashboard translations
│   └── [namespace].json  # Feature-specific translations
└── lang/                 # Additional language utilities
```

### File Purposes

| File | Purpose | Example Content |
|------|---------|-----------------|
| `common.json` | Shared UI elements across all modules | Buttons, labels, generic messages |
| `auth.json` | Authentication pages | Login, register, reset password |
| `dashboard.json` | Dashboard/home pages | Dashboard title, stats, widgets |
| `[feature].json` | Feature-specific translations | User management, settings, reports |

---

## Namespaces

### Understanding Namespaces

**Namespaces** organize translations into logical groups by feature or module, preventing key collisions and improving maintainability.

**Common Namespaces**:

| Namespace | Purpose | Example Keys |
|-----------|---------|--------------|
| `common` | Shared across all modules | `save`, `cancel`, `loading` |
| `auth` | Authentication | `login`, `register`, `forgotPassword` |
| `dashboard` | Dashboard/home | `welcome`, `stats`, `recentActivity` |
| `users` | User management | `userList`, `addUser`, `editUser` |
| `settings` | Application settings | `preferences`, `notifications`, `privacy` |

### Using Namespaces

```javascript
import { useTranslation } from 'react-i18next';

// Use specific namespace
const { t } = useTranslation('dashboard');
console.log(t('title')); // Reads from dashboard.json

// Use common namespace
const { t } = useTranslation('common');
console.log(t('save')); // Reads from common.json
```

### Multiple Namespaces

Access multiple namespaces in one component:

```javascript
const { t } = useTranslation(['dashboard', 'common']);

// Access first namespace (dashboard)
{t('title')}

// Access common namespace explicitly
{t('common:button')}
```

### Fallback Order

If a key is not found, i18n searches in this order:

1. **Requested namespace** (e.g., `dashboard`)
2. **Fallback namespaces** (defined in `fallbackNS` config)

**Example**:

```javascript
// Configuration
fallbackNS: ['common', 'shared']

// Component
const { t } = useTranslation('dashboard');

// Search order for t('save'):
// 1. dashboard.json -> save
// 2. common.json -> save
// 3. shared.json -> save
```

---

## Implementation Patterns

### Basic Usage

```javascript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
    const { t } = useTranslation('dashboard');

    return (
        <div>
            <h1>{t('title')}</h1>
            <p>{t('description')}</p>
            <button>{t('common:save')}</button>
        </div>
    );
};
```

**Translation File** (`en/dashboard.json`):

```json
{
    "title": "Dashboard",
    "description": "Welcome to your dashboard"
}
```

### Interpolation

Insert dynamic values into translations using double curly braces.

**Translation File**:

```json
{
    "welcome": "Welcome, {{name}}!",
    "itemCount": "You have {{count}} items in your cart",
    "lastLogin": "Last login: {{date}} at {{time}}"
}
```

**Component Usage**:

```javascript
const { t } = useTranslation('dashboard');

// Simple interpolation
{t('welcome', { name: 'John' })}
// Output: "Welcome, John!"

// Multiple variables
{t('itemCount', { count: 5 })}
// Output: "You have 5 items in your cart"

// Complex interpolation
{t('lastLogin', { date: '2026-02-12', time: '14:30' })}
// Output: "Last login: 2026-02-12 at 14:30"
```

**Comparison**:

| Pattern | Translation | Usage | Output |
|---------|-------------|-------|--------|
| ✅ **Correct** | `"hello": "Hello {{name}}"` | `t('hello', { name: 'John' })` | "Hello John" |
| ❌ **Wrong** | `"hello": "Hello {name}"` | `t('hello', { name: 'John' })` | "Hello {name}" |

### Pluralization

Handle singular and plural forms automatically.

**Method 1: i18next Plural Suffixes**

```json
{
    "item_one": "{{count}} item",
    "item_other": "{{count}} items"
}
```

```javascript
const { t } = useTranslation();

{t('item', { count: 1 })}  // "1 item"
{t('item', { count: 5 })}  // "5 items"
{t('item', { count: 0 })}  // "0 items"
```

**Method 2: Separate Keys with Conditional Logic**

```json
{
    "item": "item",
    "items": "items"
}
```

```javascript
const { t } = useTranslation();

{t(count === 1 ? 'item' : 'items')}
```

**Plural Forms Comparison**:

| Language | Plural Forms | Example |
|----------|--------------|---------|
| English | 2 (one, other) | 1 item, 2 items |
| Arabic | 6 (zero, one, two, few, many, other) | Complex plural rules |
| Chinese | 1 (other) | No pluralization |

### Page Titles

Use translations in page metadata:

```javascript
import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

const MyPage = () => {
    const { t } = useTranslation('pages');

    return (
        <>
            <Head title={t('myPage.title')} />
            <div>
                <h1>{t('myPage.heading')}</h1>
            </div>
        </>
    );
};
```

**Translation File** (`en/pages.json`):

```json
{
    "myPage": {
        "title": "My Page - App Name",
        "heading": "My Page"
    }
}
```

### Toast Notifications

Translate notification messages:

```javascript
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
    const { t } = useTranslation('messages');

    const handleSave = async () => {
        try {
            await saveData();
            toast.success(t('saveSuccess'));
        } catch (error) {
            toast.error(t('saveError'));
        }
    };

    return <button onClick={handleSave}>{t('common:save')}</button>;
};
```

**Translation File** (`en/messages.json`):

```json
{
    "saveSuccess": "Data saved successfully",
    "saveError": "Failed to save data. Please try again.",
    "deleteSuccess": "Item deleted successfully",
    "deleteError": "Failed to delete item"
}
```

### Form Validation

Translate validation error messages:

```javascript
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

const MyForm = () => {
    const { t } = useTranslation('validation');

    const schema = z.object({
        email: z.string().email(t('invalidEmail')),
        name: z.string().min(2, t('nameTooShort')),
        age: z.number().min(18, t('mustBeAdult')),
    });

    // Form implementation...
};
```

**Translation File** (`en/validation.json`):

```json
{
    "invalidEmail": "Please enter a valid email address",
    "nameTooShort": "Name must be at least 2 characters",
    "mustBeAdult": "You must be 18 or older",
    "required": "This field is required"
}
```

---

## Adding New Translations

### Adding Translation Keys

Follow these steps to add a new translation key:

**Step 1: Add to Primary Language** (e.g., `en/[namespace].json`)

```json
{
    "mySection": {
        "myKey": "My English text",
        "anotherKey": "Another English text"
    }
}
```

**Step 2: Add to Other Languages** (e.g., `ar/[namespace].json`)

```json
{
    "mySection": {
        "myKey": "النص العربي",
        "anotherKey": "نص عربي آخر"
    }
}
```

**Step 3: Use in Component**

```javascript
const { t } = useTranslation('[namespace]');

<div>
    <span>{t('mySection.myKey')}</span>
    <span>{t('mySection.anotherKey')}</span>
</div>
```

### Adding Namespaces

Create a new namespace for a feature:

**Step 1: Create JSON Files**

Create translation files for each language:
- `resources/js/locales/en/newnamespace.json`
- `resources/js/locales/ar/newnamespace.json`

**en/newnamespace.json**:
```json
{
    "title": "New Feature",
    "description": "This is a new feature"
}
```

**ar/newnamespace.json**:
```json
{
    "title": "ميزة جديدة",
    "description": "هذه ميزة جديدة"
}
```

**Step 2: Import in Configuration** (`locales.ts`)

```javascript
import enNewNamespace from './en/newnamespace.json';
import arNewNamespace from './ar/newnamespace.json';
```

**Step 3: Add to Resources Object**

```javascript
const resources = {
    en: {
        common: enCommon,
        newnamespace: enNewNamespace, // Add here
    },
    ar: {
        common: arCommon,
        newnamespace: arNewNamespace, // Add here
    },
};
```

**Step 4: Add to Fallback (Optional)**

```javascript
i18n.use(initReactI18next).init({
    // ...
    fallbackNS: ['common', 'newnamespace'], // Add to fallback
});
```

### Naming Conventions

**Use camelCase with dot notation:**

| Pattern | Example | Status |
|---------|---------|--------|
| ✅ **Correct** | `dashboard.pageTitle` | camelCase + dot notation |
| ✅ **Correct** | `profile.form.firstName` | Nested structure |
| ✅ **Correct** | `messages.saveSuccess` | Clear and descriptive |
| ❌ **Wrong** | `Dashboard.PageTitle` | PascalCase (inconsistent) |
| ❌ **Wrong** | `profile-form-name` | kebab-case (harder to read) |
| ❌ **Wrong** | `profile_form_name` | snake_case (inconsistent) |

**Key Naming Best Practices**:

```json
{
    "✅ Good Structure": {
        "users": {
            "list": {
                "title": "User List",
                "empty": "No users found"
            },
            "form": {
                "firstName": "First Name",
                "lastName": "Last Name",
                "email": "Email Address"
            },
            "messages": {
                "createSuccess": "User created successfully",
                "updateSuccess": "User updated successfully",
                "deleteSuccess": "User deleted successfully"
            }
        }
    }
}
```

---

## RTL Support

### Handling RTL Languages

RTL (Right-to-Left) languages require special handling for text direction and layout.

**Document Direction Setup**:

```javascript
const setDocumentDirection = (lang: string) => {
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    const dir = rtlLanguages.includes(lang) ? 'rtl' : 'ltr';

    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
};

// Call on initialization
setDocumentDirection(i18n.language);

// Call on language change
i18n.on('languageChanged', (lng) => {
    setDocumentDirection(lng);
});
```

**RTL Languages**:

| Language | Code | Direction | Script |
|----------|------|-----------|--------|
| Arabic | `ar` | RTL | Arabic |
| Hebrew | `he` | RTL | Hebrew |
| Persian/Farsi | `fa` | RTL | Persian |
| Urdu | `ur` | RTL | Arabic |
| English | `en` | LTR | Latin |
| Spanish | `es` | LTR | Latin |

### Checking RTL Status

```javascript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
    const { i18n } = useTranslation();
    const isRTL = i18n.dir() === 'rtl';

    return (
        <div className={isRTL ? 'rtl-layout' : 'ltr-layout'}>
            {/* Content */}
        </div>
    );
};
```

### RTL-Aware Styles

**Method 1: Logical CSS Properties (Recommended)**

Use logical properties that automatically adapt to text direction:

```css
/* ✅ Logical properties (automatic RTL support) */
.container {
    padding-inline-start: 1rem;  /* Left in LTR, Right in RTL */
    padding-inline-end: 0.5rem;  /* Right in LTR, Left in RTL */
    margin-inline-start: 2rem;
    border-inline-start: 1px solid #ccc;
}
```

**Logical Property Mapping**:

| Logical Property | LTR Equivalent | RTL Equivalent |
|------------------|----------------|----------------|
| `padding-inline-start` | `padding-left` | `padding-right` |
| `padding-inline-end` | `padding-right` | `padding-left` |
| `margin-inline-start` | `margin-left` | `margin-right` |
| `margin-inline-end` | `margin-right` | `margin-left` |
| `border-inline-start` | `border-left` | `border-right` |
| `inset-inline-start` | `left` | `right` |

**Method 2: Conditional Classes**

```javascript
const { i18n } = useTranslation();
const isRTL = i18n.dir() === 'rtl';

<div className={isRTL ? 'ml-2' : 'mr-2'}>
    {/* Content */}
</div>
```

**Method 3: Tailwind RTL Plugin**

```jsx
// Automatic RTL support with Tailwind
<div className="ps-4 pe-2">         {/* padding-start, padding-end */}
<div className="ms-4 me-2">         {/* margin-start, margin-end */}
<div className="flex flex-row rtl:flex-row-reverse">
```

**Comparison**:

| Method | Pros | Cons |
|--------|------|------|
| ✅ **Logical Properties** | Automatic, clean, standard | Limited browser support (modern browsers only) |
| ✅ **Tailwind** | Easy, automatic | Requires Tailwind CSS |
| ⚠️ **Conditional Classes** | Works everywhere | Verbose, manual |

### RTL Icons

Flip directional icons for RTL languages:

```javascript
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const NavigationButton = () => {
    const { i18n } = useTranslation();
    const isRTL = i18n.dir() === 'rtl';

    return (
        <button>
            Next
            <ArrowRight className={isRTL ? 'rotate-180' : ''} />
        </button>
    );
};
```

**Icons That Should Flip**:

| Icon Type | Should Flip? | Example |
|-----------|--------------|---------|
| ✅ **Arrows** | Yes | `→` becomes `←` |
| ✅ **Chevrons** | Yes | `›` becomes `‹` |
| ✅ **Navigation** | Yes | Back/Forward buttons |
| ❌ **Symbols** | No | ✓ ✗ ⚠️ |
| ❌ **Media Controls** | No | Play ▶ Pause ⏸ |

---

## Language Switching

### Programmatic Language Change

```javascript
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const changeLanguage = (lang: string) => {
        // Change language
        i18n.changeLanguage(lang);

        // Persist to localStorage
        localStorage.setItem('app-language', lang);

        // Update document direction
        const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
        const dir = rtlLanguages.includes(lang) ? 'rtl' : 'ltr';
        document.documentElement.dir = dir;
        document.documentElement.lang = lang;
    };

    return (
        <div className="flex gap-2">
            <button
                onClick={() => changeLanguage('en')}
                className={i18n.language === 'en' ? 'active' : ''}
            >
                English
            </button>
            <button
                onClick={() => changeLanguage('ar')}
                className={i18n.language === 'ar' ? 'active' : ''}
            >
                العربية
            </button>
        </div>
    );
};
```

**Dropdown Language Switcher**:

```javascript
const LanguageDropdown = () => {
    const { i18n, t } = useTranslation('common');

    const languages = [
        { code: 'en', name: 'English', nativeName: 'English' },
        { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
        { code: 'es', name: 'Spanish', nativeName: 'Español' },
    ];

    return (
        <select
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
        >
            {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                    {lang.nativeName}
                </option>
            ))}
        </select>
    );
};
```

### Getting Current Language

```javascript
const { i18n } = useTranslation();

// Current language code
const currentLang = i18n.language; // 'en', 'ar', etc.

// Check if specific language
const isEnglish = i18n.language === 'en';
const isArabic = i18n.language === 'ar';

// Get language display name
const languages = {
    en: 'English',
    ar: 'العربية',
    es: 'Español',
};
const currentLanguageName = languages[i18n.language];
```

### Date Formatting

Format dates according to the current language:

**Using Day.js**:

```javascript
import dayjs from 'dayjs';
import 'dayjs/locale/ar';
import 'dayjs/locale/es';
import { useTranslation } from 'react-i18next';

const DateDisplay = ({ date }) => {
    const { i18n } = useTranslation();

    // Set dayjs locale
    dayjs.locale(i18n.language);

    return (
        <div>
            <p>{dayjs(date).format('DD MMMM YYYY')}</p>
            <p>{dayjs(date).fromNow()}</p>
        </div>
    );
};
```

**Using Intl.DateTimeFormat**:

```javascript
const DateDisplay = ({ date }) => {
    const { i18n } = useTranslation();

    const formatted = new Intl.DateTimeFormat(i18n.language, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date));

    return <p>{formatted}</p>;
};
```

**Date Format Comparison**:

| Language | Format | Example |
|----------|--------|---------|
| English (`en`) | Month DD, YYYY | February 12, 2026 |
| Arabic (`ar`) | DD Month YYYY | ١٢ فبراير ٢٠٢٦ |
| Spanish (`es`) | DD de Month de YYYY | 12 de febrero de 2026 |

---

## Best Practices

### Key Practices

1. **NEVER hardcode user-facing text**
   ```javascript
   // ❌ Wrong
   <button>Save</button>

   // ✅ Correct
   <button>{t('common:save')}</button>
   ```

2. **ALWAYS add keys to ALL language files**
   ```json
   // en/dashboard.json
   { "title": "Dashboard" }

   // ar/dashboard.json
   { "title": "لوحة التحكم" }
   ```

3. **Use descriptive key names**
   ```javascript
   // ❌ Wrong
   t('btn1')
   t('msg')

   // ✅ Correct
   t('saveButton')
   t('successMessage')
   ```

4. **Group related keys logically**
   ```json
   {
       "users": {
           "list": { ... },
           "form": { ... },
           "messages": { ... }
       }
   }
   ```

5. **Keep translations flat when possible**
   ```json
   // ✅ Good (2 levels max)
   {
       "users": {
           "title": "Users",
           "addButton": "Add User"
       }
   }

   // ❌ Too nested
   {
       "pages": {
           "users": {
               "header": {
                   "title": "Users"
               }
           }
       }
   }
   ```

6. **Test all languages after changes**
   - Switch to each language and verify translations appear correctly
   - Check for missing keys
   - Verify RTL layout

7. **Use common namespace for shared elements**
   ```json
   // common.json
   {
       "save": "Save",
       "cancel": "Cancel",
       "delete": "Delete",
       "loading": "Loading..."
   }
   ```

### Key Structure Guidelines

**Hierarchical Structure by Feature**:

```json
{
    "[page]": {
        "pageTitle": "Page Title",
        "pageDescription": "Page description",
        "[component]": {
            "heading": "Component heading",
            "description": "Component description",
            "button": "Button text"
        },
        "messages": {
            "success": "Success message",
            "error": "Error message",
            "warning": "Warning message"
        },
        "form": {
            "fieldLabel": "Field label",
            "fieldPlaceholder": "Field placeholder",
            "fieldError": "Field error message"
        }
    }
}
```

**Example - User Management**:

```json
{
    "users": {
        "pageTitle": "User Management",
        "list": {
            "title": "All Users",
            "empty": "No users found",
            "searchPlaceholder": "Search users..."
        },
        "form": {
            "firstName": "First Name",
            "lastName": "Last Name",
            "email": "Email Address",
            "role": "Role"
        },
        "messages": {
            "createSuccess": "User created successfully",
            "updateSuccess": "User updated successfully",
            "deleteSuccess": "User deleted successfully",
            "deleteConfirm": "Are you sure you want to delete this user?"
        }
    }
}
```

### Common vs Specific Namespace

| Content Type | Namespace | Example |
|--------------|-----------|---------|
| **Button labels** | `common` | Save, Cancel, Submit, Delete |
| **Loading states** | `common` | Loading..., Please wait... |
| **Generic errors** | `common` | An error occurred, Try again |
| **Shared UI elements** | `common` | Close, Open, Expand, Collapse |
| **Form actions** | `common` | Add, Edit, Remove, Clear |
| **Page titles** | Specific | User Management, Dashboard |
| **Feature content** | Specific | User profile form labels |
| **Form labels (module)** | Specific | Product name, Category |
| **Module messages** | Specific | Invoice created, Order shipped |

**Example Structure**:

```json
// common.json - Shared across ALL modules
{
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "confirm": "Confirm",
    "loading": "Loading...",
    "error": "An error occurred",
    "success": "Operation successful"
}

// users.json - User module specific
{
    "pageTitle": "User Management",
    "addUser": "Add User",
    "editUser": "Edit User",
    "form": {
        "firstName": "First Name",
        "lastName": "Last Name"
    },
    "messages": {
        "userCreated": "User created successfully",
        "userDeleted": "User deleted successfully"
    }
}
```

### Long Text Handling

For paragraphs or long text:

```json
{
    "aboutUs": {
        "intro": "We are a company dedicated to providing excellent service.",
        "mission": "Our mission is to deliver quality products that improve lives.",
        "values": "We value integrity, innovation, and customer satisfaction."
    }
}
```

**Best Practices**:
- Break into smaller keys if parts are reusable
- Use interpolation for dynamic parts
- Keep formatting simple (avoid HTML in translations)
- Consider using Markdown for rich text

```javascript
// ✅ Good - Separated for reusability
{t('aboutUs.intro')}
{t('aboutUs.mission')}

// ✅ Good - Interpolation for dynamic parts
{t('aboutUs.welcome', { companyName, year })}

// ❌ Avoid HTML in translations
// Instead of:
"text": "<p>Hello <strong>world</strong></p>"

// Use:
"text": "Hello world"
// And handle formatting in component
```

### API Responses

**Keep translations client-side only.**

```javascript
// ❌ Wrong - Backend returns translated text
API Response: { message: "Usuario creado exitosamente" }

// ✅ Correct - Backend returns message key
API Response: { messageKey: "users.messages.createSuccess" }

// Client translates
const { t } = useTranslation('users');
toast.success(t('messages.createSuccess'));
```

---

## Troubleshooting

### Common Issues

#### Issue 1: Translation Key Shows Instead of Text

**Symptoms**: `"users.title"` displays instead of translated text.

**Possible Causes**:

| Cause | Solution |
|-------|----------|
| Key doesn't exist in JSON file | Add the key to translation file |
| Wrong namespace in `useTranslation()` | Use correct namespace: `useTranslation('users')` |
| JSON syntax error | Validate JSON (missing comma, quote, etc.) |
| Typo in key path | Check spelling: `users.title` vs `user.title` |
| File not imported in config | Import file in `locales.ts` |

**Debug Steps**:

```javascript
// 1. Check if key exists
console.log(i18n.exists('users:title'));

// 2. Check current language
console.log(i18n.language);

// 3. Check loaded resources
console.log(i18n.store.data);

// 4. Try to get translation
console.log(t('users.title'));
```

#### Issue 2: Interpolation Not Working

**Symptoms**: `"Hello {{userName}}"` shows instead of `"Hello John"`.

**Solution**: Variable names must match exactly.

```json
// Translation
{
    "hello": "Hello {{userName}}"
}
```

```javascript
// ✅ Correct - Variable name matches
t('hello', { userName: 'John' })
// Output: "Hello John"

// ❌ Wrong - Variable name doesn't match
t('hello', { name: 'John' })
// Output: "Hello {{userName}}"
```

#### Issue 3: Language Not Persisting After Refresh

**Cause**: localStorage not being set or read properly.

**Solution**: Ensure localStorage operations are correct.

```javascript
// Set on language change
const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('app-language', lang); // Must persist
};

// Read on initialization
const initialLanguage = localStorage.getItem('app-language') || 'en';

i18n.init({
    lng: initialLanguage, // Must read from localStorage
    // ...
});
```

#### Issue 4: RTL Text Not Displaying Correctly

**Possible Causes**:

| Cause | Solution |
|-------|----------|
| Font doesn't support language | Use web-safe or Google Fonts with language support |
| `dir` attribute not set | Set `document.documentElement.dir = 'rtl'` |
| Text encoding issues | Ensure UTF-8 encoding |
| CSS overriding direction | Check for `direction: ltr` in CSS |

**Solution**:

```javascript
// Ensure dir attribute is set
const setDocumentDirection = (lang) => {
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    document.documentElement.dir = rtlLanguages.includes(lang) ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
};

// Call on init and language change
setDocumentDirection(i18n.language);
i18n.on('languageChanged', setDocumentDirection);
```

### Debugging Techniques

**Console Debugging**:

```javascript
const { t, i18n } = useTranslation();

// Check if key exists
console.log('Key exists:', i18n.exists('namespace:section.key'));

// Log current language
console.log('Current language:', i18n.language);

// Log all loaded resources
console.log('Loaded resources:', i18n.store.data);

// Check translation value
console.log('Translation:', t('section.key'));

// Check available languages
console.log('Available languages:', i18n.languages);

// Check loaded namespaces
console.log('Loaded namespaces:', i18n.options.ns);
```

**Enable Debug Mode**:

```javascript
i18n.init({
    debug: true, // Enable debug logging
    // ...
});
```

### Validation

**Validate JSON Syntax**:

```javascript
// In browser console
try {
    JSON.parse(jsonString);
    console.log('Valid JSON');
} catch (e) {
    console.error('Invalid JSON:', e.message);
}
```

**Online Validators**:
- [jsonlint.com](https://jsonlint.com)
- [JSON Formatter](https://jsonformatter.org)

**Check Missing Translations**:

```javascript
// Custom hook to find missing keys
const useMissingTranslations = () => {
    const { i18n } = useTranslation();

    const checkMissingKeys = (namespace) => {
        const enKeys = Object.keys(i18n.store.data.en[namespace] || {});
        const currentKeys = Object.keys(
            i18n.store.data[i18n.language][namespace] || {}
        );

        return enKeys.filter(key => !currentKeys.includes(key));
    };

    return checkMissingKeys;
};
```

---

## Quick Reference

### Import

```javascript
import { useTranslation } from 'react-i18next';
```

### Initialize in Component

```javascript
const { t } = useTranslation('namespace');
const { t, i18n } = useTranslation('namespace');
```

### Basic Usage

```javascript
{t('section.key')}
```

### With Interpolation

```javascript
{t('section.key', { variable: value })}
{t('welcome', { name: 'John', age: 25 })}
```

### With Pluralization

```javascript
{t('item', { count: 5 })}
```

### Multiple Namespaces

```javascript
const { t } = useTranslation(['feature', 'common']);
{t('feature:key')}
{t('common:key')}
```

### Check RTL

```javascript
const isRTL = i18n.dir() === 'rtl';
```

### Change Language

```javascript
i18n.changeLanguage('ar');
localStorage.setItem('app-language', 'ar');
```

### Get Current Language

```javascript
const currentLang = i18n.language;
```

### Check Key Exists

```javascript
const exists = i18n.exists('namespace:key');
```

### Common Methods

| Method | Usage | Example |
|--------|-------|---------|
| `t(key)` | Translate key | `t('save')` |
| `i18n.changeLanguage(lang)` | Change language | `i18n.changeLanguage('ar')` |
| `i18n.language` | Get current language | `'en'`, `'ar'` |
| `i18n.dir()` | Get text direction | `'ltr'`, `'rtl'` |
| `i18n.exists(key)` | Check if key exists | `true`, `false` |
| `i18n.languages` | Get available languages | `['en', 'ar']` |

---

## Translation Checklist

Use this checklist when adding or modifying translations:

- [ ] Key added to primary language JSON file (e.g., `en/[namespace].json`)
- [ ] Key added to **all** other language JSON files (e.g., `ar/[namespace].json`)
- [ ] Keys match **exactly** in all language files (same path)
- [ ] Using correct namespace in component (`useTranslation('[namespace]')`)
- [ ] Tested in **all** supported languages
- [ ] RTL layout verified (if applicable)
- [ ] No hardcoded text remaining in component
- [ ] Interpolation variables match between code and JSON (`{{variableName}}`)
- [ ] JSON files have valid syntax (no trailing commas, proper quotes)
- [ ] Translation keys follow naming convention (camelCase + dot notation)
- [ ] Common elements use `common` namespace
- [ ] Feature-specific content uses appropriate namespace
- [ ] Page titles translated (for SEO and browser tabs)
- [ ] Toast messages translated
- [ ] Form validation errors translated
- [ ] Loading states translated
- [ ] Empty states translated
- [ ] Confirmation dialogs translated

---

## Advanced Topics

### Type Safety with TypeScript

Create typed translation hooks:

```typescript
// types/i18n.d.ts
import 'react-i18next';
import common from '../locales/en/common.json';
import users from '../locales/en/users.json';

declare module 'react-i18next' {
    interface CustomTypeOptions {
        defaultNS: 'common';
        resources: {
            common: typeof common;
            users: typeof users;
        };
    }
}
```

**Usage**:

```typescript
// Now get autocomplete for keys!
const { t } = useTranslation('users');
t('form.firstName'); // ✅ Autocomplete works
t('form.invalid'); // ❌ TypeScript error - key doesn't exist
```

### Lazy Loading Namespaces

Load translation namespaces on demand:

```javascript
// Load namespace dynamically
const loadNamespace = async (namespace) => {
    if (!i18n.hasResourceBundle(i18n.language, namespace)) {
        const translations = await import(`./locales/${i18n.language}/${namespace}.json`);
        i18n.addResourceBundle(i18n.language, namespace, translations.default);
    }
};

// Usage in component
useEffect(() => {
    loadNamespace('dashboard');
}, []);
```

### Context-Specific Translations

Use context for gender or formality:

```json
{
    "friend_male": "He is my friend",
    "friend_female": "She is my friend"
}
```

```javascript
t('friend', { context: user.gender }) // 'male' or 'female'
```

### Nested Translations

Reference other translation keys:

```json
{
    "common": {
        "save": "Save"
    },
    "form": {
        "submitButton": "$t(common.save) Changes"
    }
}
```

Output: "Save Changes"

---

## Resources

### Documentation

- [react-i18next Official Docs](https://react.i18next.com/)
- [i18next Documentation](https://www.i18next.com/)

### Tools

- [i18next Scanner](https://github.com/i18next/i18next-scanner) - Extract translation keys from code
- [BabelEdit](https://www.codeandweb.com/babeledit) - Translation editor
- [Locize](https://locize.com/) - Translation management platform

### Libraries

- [i18next-browser-languageDetector](https://github.com/i18next/i18next-browser-languageDetector) - Automatic language detection
- [i18next-http-backend](https://github.com/i18next/i18next-http-backend) - Load translations from server

---

**Last Updated**: 2026-02-12

**Version**: 2.0

**License**: MIT
