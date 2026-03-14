# CSS - Complete Guide

## 1. CSS Box Model

Every element is a box: **Content → Padding → Border → Margin**.

```css
/* border-box: width includes padding and border (use this) */
*, *::before, *::after { box-sizing: border-box; }

.box {
  width: 200px;   /* Total width stays 200px */
  padding: 20px;
  border: 2px solid;
  margin: 10px;
}
```

- **content-box** (default): total width = width + padding + border
- **border-box**: total width = width (padding/border are inside)

---

## 2. Specificity

Higher specificity wins. Order (low to high):

1. Element (`p`, `div`) — 1 pt
2. Class / attribute / pseudo-class (`.class`, `[attr]`, `:hover`) — 10 pts
3. ID (`#id`) — 100 pts
4. Inline styles — 1000 pts
5. `!important` — overrides all

Avoid `!important` and ID selectors; keep specificity low with classes.

---

## 3. CSS Units

| Unit | Relative to | Best for |
|------|-------------|----------|
| `px` | Fixed | Borders, small elements |
| `%` | Parent element | Widths, layouts |
| `em` | Parent font-size | Component spacing |
| `rem` | Root font-size | Font sizes, consistent spacing |
| `vw`/`vh` | Viewport | Full-screen sections |

**Rule of thumb**: `rem` for font sizes, `px` for borders, `%`/viewport units for layouts.

```css
html { font-size: 16px; }

/* em compounds through nesting — avoid for font sizes */
.child  { font-size: 2em; }   /* relative to parent */

/* rem is always relative to root — predictable */
.any    { font-size: 1.5rem; } /* 24px, always */
```

---

## 4. Flexbox

One-dimensional layout (row or column).

```css
.container {
  display: flex;
  flex-direction: row;            /* row | column | row-reverse */
  flex-wrap: wrap;
  justify-content: space-between; /* main axis */
  align-items: center;            /* cross axis */
  gap: 16px;
}

.item { flex: 1; align-self: flex-end; order: 2; }
```

Common patterns:

```css
/* Center anything */
.center { display: flex; justify-content: center; align-items: center; }

/* Nav bar */
.nav { display: flex; justify-content: space-between; align-items: center; }
```

---

## 5. CSS Grid

Two-dimensional layout (rows and columns simultaneously).

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

/* Named areas */
.layout {
  grid-template-areas:
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 200px 1fr;
}
.header  { grid-area: header; }
.sidebar { grid-area: sidebar; }

/* Responsive grid */
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}
```

Items can span: `grid-column: span 2;` / `grid-row: span 2;`

**Flexbox vs Grid:**
- **Flexbox**: 1D; use for navbars, button groups, centering
- **Grid**: 2D; use for page layouts, dashboards, galleries
- Combine: Grid for page structure, Flexbox inside grid cells

---

## 6. CSS Positioning

```css
.static   { position: static; }                       /* Normal flow (default) */
.relative { position: relative; top: 10px; }           /* Offset from normal position */
.absolute { position: absolute; top: 0; right: 0; }    /* Relative to nearest positioned ancestor */
.fixed    { position: fixed; top: 0; width: 100%; }    /* Relative to viewport, never scrolls */
.sticky   { position: sticky; top: 20px; }             /* Relative until threshold, then fixed */
```

`z-index` controls stacking order; only works on non-`static` elements.

---

## 7. CSS Selectors

```css
p { }                      /* element */
.class { }                 /* class */
input[type="text"] { }     /* attribute */
a[href^="https"] { }       /* starts with */

div p { }                  /* descendant */
div > p { }                /* direct child */
h1 + p { }                 /* adjacent sibling */

/* Pseudo-classes (:) — states */
a:hover { }
li:nth-child(odd) { }
p:not(.special) { }

/* Pseudo-elements (::) — parts of element */
p::before { content: "→ "; }
p::after  { content: " ←"; }
input::placeholder { color: #999; }
```

---

## 8. CSS Variables (Custom Properties)

```css
:root {
  --primary: #007bff;
  --spacing: 16px;
}

.button {
  background: var(--primary);
  padding: var(--spacing);
  color: var(--text-color, black); /* fallback value */
}

/* Scoped overrides */
.dark-theme { --primary: #0d6efd; }
```

```js
// Change at runtime
document.documentElement.style.setProperty('--primary', 'red');
```

---

## 9. Responsive Design

Mobile-first: base styles for mobile, add `min-width` queries for larger screens.

```css
/* Mobile (base — no query) */
.container { width: 100%; padding: 10px; }

/* Tablet */
@media (min-width: 768px) { .container { width: 750px; padding: 20px; } }

/* Desktop */
@media (min-width: 1024px) { .container { width: 1000px; } }

img { max-width: 100%; height: auto; }
```

---

## 10. Animations and Transitions

```css
/* Transitions — animate on state change */
.button {
  background: blue;
  transition: background 0.3s ease;
}
.button:hover { background: red; }
```

```css
/* Animations — keyframe-based, auto-triggered */
@keyframes slideIn {
  from { transform: translateX(-100%); opacity: 0; }
  to   { transform: translateX(0);     opacity: 1; }
}

.element { animation: slideIn 1s ease forwards; }
```

- **Transitions**: simple, triggered by state change
- **Animations**: complex, self-starting, full keyframe control

**CSS Transforms** — GPU-accelerated, don't affect document flow:

```css
.box {
  transform: translateX(50px) rotate(45deg) scale(1.5);
}

/* Classic centering */
.centered {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}
```

---

## 11. CSS Modules

Locally-scoped styles — class names are auto-hashed to prevent conflicts.

```css
/* Button.module.css */
.button  { background: blue; padding: 10px 20px; }
.primary { background: #007bff; }
```

```jsx
import styles from './Button.module.css';
import clsx from 'clsx';

<button className={clsx(styles.button, styles.primary)}>Click</button>
```

---

## 12. Tailwind CSS

Utility-first framework: compose designs with pre-built classes directly in HTML.

```html
<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
  Click me
</button>

<!-- Responsive -->
<div class="w-full md:w-1/2 lg:w-1/3">

<!-- Dark mode -->
<div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
```

- **Pros**: fast development, no naming conflicts, tiny production bundle
- **Cons**: verbose HTML, class-name learning curve

---

## 13. CSS-in-JS

Write CSS inside JavaScript, scoped to components.

```js
import styled from 'styled-components';

const Button = styled.button`
  background: ${props => props.primary ? 'blue' : 'gray'};
  color: white;
  padding: 10px 20px;
  &:hover { background: darkblue; }
`;

<Button primary>Primary</Button>
```

- **Pros**: component-scoped, dynamic via props, no class conflicts
- **Cons**: runtime overhead, requires JS to render styles

---

## 14. Hiding Elements

| Property | Takes space | Clickable | Screen reader | Animatable |
|---|---|---|---|---|
| `display: none` | No | No | No | No |
| `visibility: hidden` | Yes | No | No | Yes |
| `opacity: 0` | Yes | Yes | Yes | Yes |

---

## 15. CSS Preprocessors (Sass)

```scss
$primary: #007bff;

.nav {
  background: white;
  a {
    color: $primary;
    &:hover { color: darken($primary, 10%); }
  }
}

@mixin flex-center {
  display: flex; justify-content: center; align-items: center;
}
.box { @include flex-center; }
```

Modern CSS supports variables and nesting natively. Sass remains useful for mixins and utility functions.

---

## 16. CSS Performance

- Animate `transform` and `opacity` — GPU-accelerated, no layout recalculation
- Avoid animating `top`/`left`/`width`/`height` — triggers layout and paint
- Use `will-change: transform` before animating; remove after with `will-change: auto`
- Inline critical CSS; load the rest async; minify; remove unused CSS with PurgeCSS

---

## 17. Modern CSS Reset

```css
*, *::before, *::after { box-sizing: border-box; }
* { margin: 0; padding: 0; }
body { line-height: 1.5; -webkit-font-smoothing: antialiased; }
img, picture, video, canvas, svg { display: block; max-width: 100%; }
input, button, textarea, select { font: inherit; }
```

---

## 18. BEM Methodology

Naming convention: `block__element--modifier`.

```css
.card { }                    /* Block */
.card__header { }            /* Element */
.card__button--primary { }   /* Modifier */
```

Keeps specificity low, self-documenting, avoids naming conflicts.

---

## 19. Best Practices

- Use semantic class names (`.product-card` not `.big-blue`)
- Keep specificity low — prefer classes over IDs; avoid `!important`
- Avoid inline styles
- Use CSS variables for colors, spacing, and border radii
- Write mobile-first with `min-width` media queries
- Apply `box-sizing: border-box` globally
- Use `rem` for font sizes, `px` for borders
