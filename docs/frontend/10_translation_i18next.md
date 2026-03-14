# React-i18next Translations Implementation Guide

Implementing i18n in React with react-i18next.

---

## Installation

```bash
npm install react-i18next i18next
```

---

## Configuration

Place in `resources/js/locales/locales.ts`:

```javascript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enCommon from './en/common.json';
import arCommon from './ar/common.json';

const resources = {
    en: { common: enCommon },
    ar: { common: arCommon },
};

const initialLanguage = localStorage.getItem('app-language') || 'en';

i18n.use(initReactI18next).init({
    resources,
    fallbackLng: 'en',
    lng: initialLanguage,
    defaultNS: 'common',
    fallbackNS: ['common'],
    interpolation: { escapeValue: false },
});

export default i18n;
```

Key options: `fallbackLng` (fallback language), `defaultNS` (default namespace), `escapeValue: false` (React handles escaping), `debug: true` (enable during development).

Import in app root to initialize:

```javascript
import './locales';
```

---

## File Structure

```
resources/js/locales/
├── locales.ts            # i18n configuration
├── en/
│   ├── common.json       # Shared UI (buttons, labels, errors)
│   ├── auth.json         # Authentication pages
│   └── [namespace].json  # Feature-specific translations
└── ar/
    ├── common.json
    ├── auth.json
    └── [namespace].json
```

Use `common.json` for elements shared across all modules (save, cancel, loading, generic errors). Use feature namespaces for page titles, module-specific labels and messages.

---

## Namespaces

```javascript
import { useTranslation } from 'react-i18next';

// Single namespace
const { t } = useTranslation('dashboard');
t('title'); // reads from dashboard.json

// Multiple namespaces — prefix to disambiguate
const { t } = useTranslation(['dashboard', 'common']);
t('title');         // dashboard namespace (first)
t('common:save');   // explicit namespace prefix
```

Fallback order when a key is missing: requested namespace → `fallbackNS` list (e.g., `common`).

---

## Implementation Patterns

### Basic Usage

```javascript
const { t } = useTranslation('dashboard');

return (
    <div>
        <h1>{t('title')}</h1>
        <button>{t('common:save')}</button>
    </div>
);
```

### Interpolation

```json
{ "welcome": "Welcome, {{name}}!", "itemCount": "You have {{count}} items" }
```

```javascript
t('welcome', { name: 'John' })    // "Welcome, John!"
t('itemCount', { count: 5 })      // "You have 5 items"
```

### Pluralization

```json
{ "item_one": "{{count}} item", "item_other": "{{count}} items" }
```

```javascript
t('item', { count: 1 })  // "1 item"
t('item', { count: 5 })  // "5 items"
```

English has 2 plural forms (`one`, `other`); Arabic has 6 (`zero`, `one`, `two`, `few`, `many`, `other`).

### Toast Notifications & Form Validation

```javascript
// Toast
const { t } = useTranslation('messages');
toast.success(t('saveSuccess'));

// Zod validation
const { t } = useTranslation('validation');
const schema = z.object({
    email: z.string().email(t('invalidEmail')),
    name: z.string().min(2, t('nameTooShort')),
});
```

---

## Adding New Translations

1. Add keys to each language JSON file:

```json
// en/users.json
{ "list": { "title": "User List", "empty": "No users found" } }

// ar/users.json
{ "list": { "title": "قائمة المستخدمين", "empty": "لا يوجد مستخدمون" } }
```

2. For a new namespace, register in `locales.ts`:

```javascript
import enUsers from './en/users.json';
import arUsers from './ar/users.json';

const resources = {
    en: { common: enCommon, users: enUsers },
    ar: { common: arCommon, users: arUsers },
};
```

3. Use in component: `const { t } = useTranslation('users');`

**Naming conventions**: camelCase keys, dot notation for nesting (`users.list.title`). Keep nesting to 2 levels max. Never hardcode user-facing text.

---

## RTL Support

Set document direction on init and on every language change:

```javascript
const setDocumentDirection = (lang: string) => {
    const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
    document.documentElement.dir = rtlLanguages.includes(lang) ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
};

setDocumentDirection(i18n.language);
i18n.on('languageChanged', setDocumentDirection);
```

**Styles** — use CSS logical properties for automatic RTL support:

```css
.container {
    padding-inline-start: 1rem;  /* left in LTR, right in RTL */
    margin-inline-start: 2rem;
}
```

Or use Tailwind logical utilities: `ps-4`, `pe-2`, `ms-4`, `me-2`.

---

## Language Switching

```javascript
const { i18n } = useTranslation();

const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('app-language', lang);
    const dir = ['ar', 'he', 'fa', 'ur'].includes(lang) ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
};
```

**Date formatting:**

```javascript
new Intl.DateTimeFormat(i18n.language, { year: 'numeric', month: 'long', day: 'numeric' })
    .format(new Date(date));
```

---

## Troubleshooting

| Issue | Check |
|---|---|
| Key shows instead of text | Key exists in JSON, correct namespace, valid JSON, file imported in `locales.ts` |
| Interpolation not working | Variable name matches exactly (`{{userName}}` → `{ userName: ... }`) |
| Language resets on refresh | `localStorage.setItem` on change; `localStorage.getItem` used in `lng` init |
| RTL text broken | `dir` attribute set on `<html>`, font supports language |

**Debugging:**

```javascript
console.log(i18n.exists('namespace:section.key')); // key exists?
console.log(i18n.language);                         // current language
```

Enable `debug: true` in `i18n.init()` for verbose console output.

---

## TypeScript Type Safety

```typescript
// types/i18n.d.ts
import 'react-i18next';
import common from '../locales/en/common.json';
import users from '../locales/en/users.json';

declare module 'react-i18next' {
    interface CustomTypeOptions {
        defaultNS: 'common';
        resources: { common: typeof common; users: typeof users };
    }
}
```

Keys are now autocompleted and type-checked.

---

## Resources

- [react-i18next Docs](https://react.i18next.com/)
- [i18next Docs](https://www.i18next.com/)
- [i18next Scanner](https://github.com/i18next/i18next-scanner) — extract keys from source code
