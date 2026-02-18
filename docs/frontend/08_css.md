# CSS - Complete Guide

A comprehensive guide to CSS styling, layouts, and modern CSS techniques.

## Table of Contents

1. [What is CSS?](#1-what-is-css)
2. [CSS Box Model](#2-css-box-model)
3. [Margin vs Padding](#3-margin-vs-padding)
4. [CSS Specificity](#4-css-specificity)
5. [CSS Units](#5-css-units)
6. [em vs rem](#6-em-vs-rem)
7. [Flexbox](#7-flexbox)
8. [CSS Grid](#8-css-grid)
9. [Flexbox vs Grid](#9-flexbox-vs-grid)
10. [CSS Positioning](#10-css-positioning)
11. [z-index](#11-z-index)
12. [CSS Selectors](#12-css-selectors)
13. [Pseudo-classes and Pseudo-elements](#13-pseudo-classes-and-pseudo-elements)
14. [CSS Cascade](#14-css-cascade)
15. [CSS Variables (Custom Properties)](#15-css-variables-custom-properties)
16. [Responsive Design](#16-responsive-design)
17. [Animations and Transitions](#17-animations-and-transitions)
18. [CSS Transforms](#18-css-transforms)
19. [CSS Modules](#19-css-modules)
20. [Tailwind CSS](#20-tailwind-css)
21. [CSS-in-JS](#21-css-in-js)
22. [BEM Methodology](#22-bem-methodology)
23. [display: none vs visibility: hidden](#23-display-none-vs-visibility-hidden)
24. [block vs inline vs inline-block](#24-block-vs-inline-vs-inline-block)
25. [CSS Preprocessors](#25-css-preprocessors)
26. [Mobile-first Design](#26-mobile-first-design)
27. [Grid vs Flexbox for Layouts](#27-grid-vs-flexbox-for-layouts)
28. [CSS Performance Optimizations](#28-css-performance-optimizations)
29. [Reset vs Normalize CSS](#29-reset-vs-normalize-css)
30. [CSS Best Practices](#30-css-best-practices)
31. [Summary](#31-summary)

---

## 1. What is CSS?

**CSS (Cascading Style Sheets)** is a stylesheet language used to style HTML elements. It separates content from presentation, allowing you to control layout, colors, fonts, spacing, and animations.

**Three ways to add CSS:**
- **Inline**: `<div style="color: red;">`
- **Internal**: `<style>` tag in HTML `<head>`
- **External**: Separate `.css` file linked with `<link>`

**Key Concept**: CSS follows cascade rules based on specificity and inheritance.

```css
/* External CSS - styles.css */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
}

h1 {
  color: #333;
  font-size: 32px;
}
```

```html
<!-- Link external CSS -->
<link rel="stylesheet" href="styles.css">
```

---

## 2. CSS Box Model

The **box model** describes how elements take up space. Every element is a rectangular box with four areas:

1. **Content**: Actual content (text, image)
2. **Padding**: Space between content and border
3. **Border**: Line around padding
4. **Margin**: Space outside border (between elements)

### Box Sizing

```css
.box {
  width: 200px;
  height: 100px;
  padding: 20px;      /* Space inside */
  border: 2px solid;  /* Border line */
  margin: 10px;       /* Space outside */
}

/* Total width = width + padding-left + padding-right + border-left + border-right */
/* 200 + 20 + 20 + 2 + 2 = 244px */
```

```css
/* ❌ content-box (default) - padding/border add to width */
.box-1 {
  box-sizing: content-box;
  width: 200px;
  padding: 20px;
  /* Total width = 244px */
}

/* ✅ border-box - width includes padding and border */
.box-2 {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  /* Total width stays 200px */
}
```

**Comparison Table:**

| Property | content-box (default) | border-box |
|----------|----------------------|------------|
| Width calculation | Content only | Content + padding + border |
| Total width | width + padding + border | Always equals width |
| Best for | Legacy code | Modern layouts |

---

## 3. Margin vs Padding

**Padding**: Space inside element (between content and border).
**Margin**: Space outside element (between elements).

**Key Differences:**
- Padding shows element's background, margin doesn't
- Margins can collapse, padding doesn't

```css
.element {
  padding: 20px;  /* ✅ Space inside, background extends */
  margin: 20px;   /* ✅ Space outside, background doesn't extend */
}

/* Margin collapsing */
.box-1 { margin-bottom: 20px; }
.box-2 { margin-top: 30px; }
/* Space between them = 30px (larger margin), NOT 50px */

/* Padding never collapses */
.box {
  padding-top: 20px;
  padding-bottom: 20px;
}
/* Total padding = 40px */
```

**Comparison Table:**

| Feature | Padding | Margin |
|---------|---------|--------|
| Location | Inside element | Outside element |
| Background | Shows element's background | Transparent |
| Collapsing | Never collapses | Can collapse vertically |
| Negative values | Not allowed | Allowed |

---

## 4. CSS Specificity

**Specificity** determines which CSS rule applies when multiple rules target the same element. Higher specificity wins.

**Specificity hierarchy** (low to high):
1. **Element selectors** (1 point): `div`, `p`, `h1`
2. **Class selectors** (10 points): `.class`, `[attribute]`, `:hover`
3. **ID selectors** (100 points): `#id`
4. **Inline styles** (1000 points): `style="..."`
5. **!important** (overrides everything)

```css
/* Specificity examples */
p { color: blue; }                    /* 1 point */
.text { color: green; }               /* 10 points - wins over p */
#main { color: red; }                 /* 100 points - wins over .text */
div.text { color: yellow; }           /* 11 points (1 + 10) */
#main .text { color: purple; }        /* 110 points (100 + 10) - wins */
```

```html
<p style="color: orange">Text</p>     <!-- 1000 points - wins over all -->
```

```css
/* ❌ Avoid !important */
p { color: blue !important; }  /* Overrides everything, hard to maintain */

/* ✅ Best practice: Avoid !important and IDs, use classes */
.text-primary { color: blue; }
```

**Specificity Calculation Table:**

| Selector | Inline | IDs | Classes/Attributes/Pseudo-classes | Elements | Total |
|----------|--------|-----|----------------------------------|----------|-------|
| `p` | 0 | 0 | 0 | 1 | 0,0,0,1 |
| `.text` | 0 | 0 | 1 | 0 | 0,0,1,0 |
| `#main` | 0 | 1 | 0 | 0 | 0,1,0,0 |
| `#main .text p` | 0 | 1 | 1 | 1 | 0,1,1,1 |

---

## 5. CSS Units

**Absolute units**: Fixed size, don't change.
- `px`: Pixels
- `cm`, `mm`, `in`: Physical units

**Relative units**: Relative to something else.
- `%`: Percentage of parent
- `em`: Relative to parent font-size
- `rem`: Relative to root font-size
- `vw`, `vh`: Viewport width/height
- `vmin`, `vmax`: Smaller/larger of vw or vh

```css
/* Pixels - fixed */
.box { width: 200px; }

/* Percentage - relative to parent */
.child { width: 50%; } /* 50% of parent width */

/* em - relative to parent font-size */
.parent { font-size: 16px; }
.child {
  font-size: 2em;   /* 32px (16 * 2) */
  padding: 1em;     /* 32px (uses own font-size) */
}

/* rem - relative to root (html) font-size */
html { font-size: 16px; }
.element {
  font-size: 2rem;  /* 32px (16 * 2) */
  padding: 1rem;    /* 16px (always relative to root) */
}

/* Viewport units */
.hero {
  width: 100vw;     /* 100% of viewport width */
  height: 100vh;    /* 100% of viewport height */
}

.responsive { font-size: 5vw; } /* 5% of viewport width */
```

**Best practice**: Use `rem` for font sizes, `px` for borders, `%` or viewport units for layouts.

**Comparison Table:**

| Unit | Type | Relative to | Best for |
|------|------|-------------|----------|
| `px` | Absolute | Fixed | Borders, small elements |
| `%` | Relative | Parent element | Widths, responsive layouts |
| `em` | Relative | Parent font-size | Spacing within components |
| `rem` | Relative | Root font-size | Font sizes, consistent spacing |
| `vw/vh` | Relative | Viewport | Full-screen sections |

---

## 6. em vs rem

**em**: Relative to parent element's font-size (can compound).
**rem**: Relative to root (html) font-size (consistent).

`rem` is more predictable and easier to maintain.

```css
html { font-size: 16px; }

/* ❌ em - compounds (can be confusing) */
.parent {
  font-size: 20px;
}
.child {
  font-size: 2em;  /* 40px (20 * 2) */
}
.grandchild {
  font-size: 1.5em; /* 60px (40 * 1.5) - compounds! */
}

/* ✅ rem - consistent (recommended) */
.element-1 { font-size: 2rem; }  /* 32px (16 * 2) */
.element-2 { font-size: 1.5rem; } /* 24px (16 * 1.5) */
/* Always relative to root, no compounding */
```

**Comparison Table:**

| Feature | em | rem |
|---------|-----|-----|
| Relative to | Parent font-size | Root font-size |
| Compounding | Yes | No |
| Predictability | Less predictable | More predictable |
| Use case | Component-specific spacing | Global font sizing |
| Best for | Padding/margin within component | Font sizes, consistent spacing |

---

## 7. Flexbox

**Flexbox** is a one-dimensional layout system that arranges items in rows or columns. Great for aligning and distributing space.

**Main concepts**: flex container and flex items.

```css
/* Flex Container */
.container {
  display: flex;

  /* Direction */
  flex-direction: row;        /* Default: left to right */
  flex-direction: column;     /* Top to bottom */
  flex-direction: row-reverse; /* Right to left */

  /* Wrap */
  flex-wrap: nowrap;          /* Default: single line */
  flex-wrap: wrap;            /* Multiple lines */

  /* Main axis alignment (horizontal in row) */
  justify-content: flex-start;  /* Default */
  justify-content: center;      /* Center items */
  justify-content: space-between; /* Space between items */
  justify-content: space-around;  /* Space around items */
  justify-content: space-evenly;  /* Equal space */

  /* Cross axis alignment (vertical in row) */
  align-items: stretch;       /* Default: fill height */
  align-items: flex-start;    /* Top */
  align-items: center;        /* Center */
  align-items: flex-end;      /* Bottom */

  /* Multiple lines alignment */
  align-content: center;

  /* Gap between items */
  gap: 10px;
  gap: 10px 20px;            /* row-gap column-gap */
}

/* Flex Items */
.item {
  flex-grow: 1;     /* Grow to fill space */
  flex-shrink: 1;   /* Shrink if needed */
  flex-basis: 200px; /* Initial size */

  /* Shorthand */
  flex: 1;          /* flex-grow: 1, flex-shrink: 1, flex-basis: 0 */
  flex: 1 1 auto;   /* grow shrink basis */

  /* Self alignment */
  align-self: center; /* Override container's align-items */

  /* Order */
  order: 2;         /* Default is 0 */
}
```

**Common Flexbox Patterns:**

```css
/* ✅ Center content horizontally and vertically */
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* ✅ Navigation bar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* ✅ Equal-width columns */
.columns {
  display: flex;
}

.column {
  flex: 1;  /* Each column takes equal space */
}
```

---

## 8. CSS Grid

**CSS Grid** is a two-dimensional layout system that works with rows and columns simultaneously. Best for complex layouts.

**Main concepts**: grid container and grid items.

```css
/* Grid Container */
.container {
  display: grid;

  /* Define columns */
  grid-template-columns: 200px 1fr 1fr;  /* 3 columns */
  grid-template-columns: repeat(3, 1fr); /* 3 equal columns */
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* Responsive */

  /* Define rows */
  grid-template-rows: 100px auto 100px;
  grid-template-rows: repeat(3, 1fr);

  /* Gap */
  gap: 20px;
  gap: 20px 10px;  /* row-gap column-gap */

  /* Alignment */
  justify-items: center;  /* Horizontal alignment of items */
  align-items: center;    /* Vertical alignment of items */
  justify-content: center; /* Horizontal alignment of grid */
  align-content: center;   /* Vertical alignment of grid */
}

/* Grid Items */
.item {
  /* Span columns */
  grid-column: 1 / 3;      /* Start at 1, end at 3 (span 2) */
  grid-column: span 2;     /* Span 2 columns */

  /* Span rows */
  grid-row: 1 / 3;
  grid-row: span 2;

  /* Shorthand */
  grid-area: 1 / 1 / 3 / 3; /* row-start / col-start / row-end / col-end */
}

/* Named Grid Areas */
.container {
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }
```

**Common Grid Patterns:**

```css
/* ✅ Responsive card grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

/* ✅ Page layout */
.page {
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: 60px 1fr 40px;
  min-height: 100vh;
}
```

---

## 9. Flexbox vs Grid

**Flexbox**: One-dimensional (row OR column).
**Grid**: Two-dimensional (row AND column).

Use Flexbox for simple layouts, Grid for complex layouts.

```css
/* ❌ Flexbox for complex 2D layout (harder to maintain) */
.navbar {
  display: flex;
  flex-direction: row;
}

/* ✅ Grid for complex 2D layout (better) */
.page-layout {
  display: grid;
  grid-template-columns: 200px 1fr; /* Sidebar + Main */
  grid-template-rows: 60px 1fr 40px; /* Header + Content + Footer */
}
```

**When to use what:**
- **Flexbox**: Navigation bars, button groups, centering items, card content
- **Grid**: Page layouts, complex card layouts, dashboards, photo galleries

**Comparison Table:**

| Feature | Flexbox | Grid |
|---------|---------|------|
| Dimensions | 1D (row or column) | 2D (rows and columns) |
| Content flow | Content-first | Layout-first |
| Best for | Components, simple layouts | Page layouts, complex layouts |
| Learning curve | Easier | Steeper |
| Browser support | Excellent | Excellent (modern) |
| Alignment | One axis at a time | Both axes simultaneously |

---

## 10. CSS Positioning

The **position** property controls how elements are positioned.

**Five values**: `static`, `relative`, `absolute`, `fixed`, `sticky`.

```css
/* static - default, normal flow */
.box { position: static; }

/* relative - relative to normal position */
.box {
  position: relative;
  top: 10px;    /* Move 10px down from normal position */
  left: 20px;   /* Move 20px right from normal position */
}

/* absolute - relative to nearest positioned ancestor */
.parent { position: relative; }
.child {
  position: absolute;
  top: 0;       /* 0px from parent's top */
  right: 0;     /* 0px from parent's right */
}

/* fixed - relative to viewport */
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;  /* Stays at top even when scrolling */
}

/* sticky - switches between relative and fixed */
.sidebar {
  position: sticky;
  top: 20px;    /* Sticks 20px from top when scrolling */
}
```

**Comparison Table:**

| Position | Relative to | Affects layout | Scrolls | Common use |
|----------|-------------|----------------|---------|------------|
| `static` | Normal flow | Yes | Yes | Default |
| `relative` | Normal position | Yes | Yes | Minor adjustments |
| `absolute` | Positioned ancestor | No | Yes | Overlays, tooltips |
| `fixed` | Viewport | No | No | Fixed headers, modals |
| `sticky` | Normal flow / Viewport | Yes / No | Partially | Sticky headers |

---

## 11. z-index

**z-index** controls the stacking order of positioned elements. Higher z-index appears on top.

**Important**: Only works with positioned elements (not `static`). Creates stacking contexts.

```css
/* ✅ z-index with positioned elements */
.box-1 {
  position: relative;
  z-index: 1;    /* Behind box-2 */
}

.box-2 {
  position: relative;
  z-index: 2;    /* On top */
}

/* ❌ z-index doesn't work with static position */
.box-3 {
  position: static;
  z-index: 999;  /* No effect, position is static */
}

/* Stacking context example */
.parent {
  position: relative;
  z-index: 1;
}

.child {
  position: relative;
  z-index: 9999; /* Still behind elements with parent z-index > 1 */
}
```

**Key Concepts:**
- `z-index` only works on positioned elements (`relative`, `absolute`, `fixed`, `sticky`)
- Creates a stacking context
- Children can't escape parent's stacking context
- Higher values appear on top

---

## 12. CSS Selectors

**Selectors** target HTML elements to apply styles.

**Types**: element, class, ID, attribute, pseudo-class, pseudo-element.

```css
/* Element selector */
p { color: blue; }

/* Class selector */
.text { color: green; }

/* ID selector */
#main { color: red; }

/* Attribute selector */
input[type="text"] { border: 1px solid; }
a[href^="https"] { color: green; }  /* Starts with */
a[href$=".pdf"] { color: red; }     /* Ends with */
a[href*="google"] { color: blue; }  /* Contains */

/* Descendant selector (space) */
div p { color: blue; }  /* All p inside div */

/* Child selector (>) */
div > p { color: blue; } /* Direct children only */

/* Adjacent sibling (+) */
h1 + p { margin-top: 0; } /* p immediately after h1 */

/* General sibling (~) */
h1 ~ p { color: gray; }  /* All p after h1 */

/* Multiple selectors */
h1, h2, h3 { color: navy; }

/* Grouping */
.btn.primary { }  /* Element with both classes */
div.container { } /* div with class container */
```

**Selector Specificity Table:**

| Selector | Type | Specificity | Example |
|----------|------|-------------|---------|
| `*` | Universal | 0 | `* { margin: 0; }` |
| `element` | Type | 1 | `p { }` |
| `.class` | Class | 10 | `.text { }` |
| `#id` | ID | 100 | `#main { }` |
| `[attribute]` | Attribute | 10 | `[type="text"]` |

---

## 13. Pseudo-classes and Pseudo-elements

**Pseudo-classes**: Select elements in a specific state (`:` - single colon).
**Pseudo-elements**: Style specific parts of elements (`::` - double colon).

```css
/* Pseudo-classes (single colon :) */
a:hover { color: red; }           /* Mouse over */
a:active { color: blue; }         /* Being clicked */
a:visited { color: purple; }      /* Already visited */
input:focus { border: 2px solid; } /* Has focus */
input:disabled { opacity: 0.5; }  /* Disabled state */
li:first-child { font-weight: bold; } /* First child */
li:last-child { border: none; }   /* Last child */
li:nth-child(2) { color: red; }   /* 2nd child */
li:nth-child(odd) { background: #f0f0f0; } /* Odd items */
li:nth-child(3n) { color: blue; } /* Every 3rd item */
p:not(.special) { color: gray; }  /* Not matching selector */

/* Pseudo-elements (double colon ::) */
p::first-line { font-weight: bold; }  /* First line */
p::first-letter { font-size: 2em; }   /* First letter */

p::before {
  content: "→ ";    /* Insert content before */
  color: blue;
}

p::after {
  content: " ←";    /* Insert content after */
  color: red;
}

::selection {
  background: yellow;  /* Text selection style */
  color: black;
}

input::placeholder {
  color: #999;      /* Placeholder text style */
}
```

**Comparison Table:**

| Type | Syntax | Purpose | Example |
|------|--------|---------|---------|
| Pseudo-class | `:` | Style element states | `:hover`, `:focus`, `:first-child` |
| Pseudo-element | `::` | Style element parts | `::before`, `::after`, `::first-line` |

---

## 14. CSS Cascade

The **cascade** determines which styles apply when there are conflicts.

**Order of importance** (highest to lowest):
1. `!important` declarations
2. Inline styles
3. IDs
4. Classes, attributes, pseudo-classes
5. Elements, pseudo-elements
6. If equal specificity, last rule wins

```css
/* Example of cascade */
p { color: blue; }        /* Specificity: 1 */
.text { color: green; }   /* Specificity: 10 - wins over p */
p.text { color: red; }    /* Specificity: 11 - wins over .text */
#main p { color: purple; } /* Specificity: 101 - highest, wins */

/* If same specificity, last one wins */
.text { color: green; }
.text { color: red; }  /* ✅ This wins (comes last) */
```

**Cascade Order:**

1. User agent (browser) styles
2. User styles
3. Author styles (your CSS)
4. Author `!important`
5. User `!important`
6. User agent `!important`

---

## 15. CSS Variables (Custom Properties)

**CSS variables** store reusable values. Defined with `--` prefix, accessed with `var()` function.

Can be scoped and inherited.

```css
/* Define variables */
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --spacing: 16px;
  --font-size-large: 24px;
}

/* Use variables */
.button {
  background-color: var(--primary-color);
  padding: var(--spacing);
  font-size: var(--font-size-large);
}

/* Fallback value */
.text {
  color: var(--text-color, black); /* black if --text-color not defined */
}

/* Scoped variables */
.dark-theme {
  --primary-color: #0d6efd;
  --background: #212529;
}

.light-theme {
  --primary-color: #007bff;
  --background: #ffffff;
}
```

```javascript
// Change variables with JavaScript
document.documentElement.style.setProperty('--primary-color', 'red');
```

**Benefits of CSS Variables:**
- Dynamic (can change with JavaScript)
- Inherit down the DOM tree
- Can be scoped to specific elements
- Great for theming
- Better than Sass variables for runtime changes

---

## 16. Responsive Design

**Responsive design** adapts layout to different screen sizes using media queries, flexible layouts, and images.

**Mobile-first approach** is recommended.

```css
/* Media queries */
/* ✅ Mobile first approach (recommended) */
.container {
  width: 100%;
  padding: 10px;
}

/* Tablet (768px and up) */
@media (min-width: 768px) {
  .container {
    width: 750px;
    padding: 20px;
  }
}

/* Desktop (1024px and up) */
@media (min-width: 1024px) {
  .container {
    width: 1000px;
  }
}

/* Large desktop (1440px and up) */
@media (min-width: 1440px) {
  .container {
    width: 1200px;
  }
}
```

**Common breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1023px
- Desktop: 1024px - 1439px
- Large: 1440px+

```css
/* Media query features */
@media (max-width: 767px) { }        /* Max width */
@media (orientation: landscape) { }  /* Landscape */
@media (orientation: portrait) { }   /* Portrait */
@media print { }                     /* Print styles */

/* ✅ Responsive images */
img {
  max-width: 100%;
  height: auto;
}
```

---

## 17. Animations and Transitions

**Transitions**: Animate property changes smoothly.
**Animations**: More complex, reusable animations with keyframes.

### Transitions

```css
/* ✅ Transitions - simple property changes */
.button {
  background: blue;
  transition: background 0.3s ease;  /* property duration timing-function */
}

.button:hover {
  background: red;  /* Animates smoothly */
}

/* Multiple properties */
.box {
  transition: all 0.3s ease;  /* All properties */
  /* Or specific: */
  transition: width 0.3s, height 0.5s, opacity 0.2s;
}

/* Timing functions */
transition: all 0.3s linear;      /* Constant speed */
transition: all 0.3s ease;        /* Slow start/end */
transition: all 0.3s ease-in;     /* Slow start */
transition: all 0.3s ease-out;    /* Slow end */
transition: all 0.3s ease-in-out; /* Slow start and end */
```

### Animations

```css
/* ✅ Animations - complex, keyframe-based */
@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Or with percentages */
@keyframes bounce {
  0% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0); }
}

.element {
  animation: slideIn 1s ease forwards;
  /* animation: name duration timing-function fill-mode */
}

/* Animation properties */
.box {
  animation-name: bounce;
  animation-duration: 2s;
  animation-timing-function: ease;
  animation-delay: 0.5s;
  animation-iteration-count: infinite;  /* or number */
  animation-direction: alternate;       /* normal, reverse, alternate */
  animation-fill-mode: forwards;        /* Keep end state */
  animation-play-state: running;        /* or paused */

  /* Shorthand */
  animation: bounce 2s ease 0.5s infinite alternate forwards;
}
```

**Comparison Table:**

| Feature | Transitions | Animations |
|---------|-------------|------------|
| Complexity | Simple | Complex |
| Trigger | State change (hover, focus) | Automatic or on-demand |
| Keyframes | No | Yes |
| Reusable | No | Yes |
| Control | Limited | Full control |

---

## 18. CSS Transforms

**Transforms** modify element position, size, rotation, and skew without affecting document flow.

Better performance than animating position/size.

```css
/* 2D Transforms */
.box {
  transform: translateX(50px);        /* Move right 50px */
  transform: translateY(30px);        /* Move down 30px */
  transform: translate(50px, 30px);   /* Move right 50px, down 30px */

  transform: rotate(45deg);           /* Rotate 45 degrees */
  transform: scale(1.5);              /* Scale to 150% */
  transform: scale(2, 0.5);           /* Scale X by 2, Y by 0.5 */
  transform: scaleX(2);               /* Scale width only */

  transform: skew(10deg);             /* Skew */
  transform: skewX(10deg);            /* Skew horizontally */

  /* ✅ Multiple transforms */
  transform: translate(50px, 30px) rotate(45deg) scale(1.5);
}

/* 3D Transforms */
.box {
  transform: translateZ(50px);        /* Move toward viewer */
  transform: translate3d(50px, 30px, 20px);

  transform: rotateX(45deg);          /* Rotate on X axis */
  transform: rotateY(45deg);          /* Rotate on Y axis */
  transform: rotateZ(45deg);          /* Same as rotate() */
  transform: rotate3d(1, 1, 0, 45deg);

  transform: scale3d(2, 2, 2);
}

/* Transform origin (pivot point) */
.box {
  transform-origin: center center;    /* Default */
  transform-origin: top left;
  transform-origin: 50% 50%;
  transform-origin: 0 0;
}

/* Perspective (for 3D) */
.parent {
  perspective: 1000px;
}

.child {
  transform: rotateY(45deg);
}
```

**Common Transform Patterns:**

```css
/* ✅ Center element */
.centered {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* ✅ Card flip on hover */
.card {
  transition: transform 0.6s;
}

.card:hover {
  transform: rotateY(180deg);
}
```

---

## 19. CSS Modules

**CSS Modules** scope styles locally to components, preventing naming conflicts. Class names are automatically unique.

Common in React projects.

```css
/* Button.module.css */
.button {
  background: blue;
  padding: 10px 20px;
  border-radius: 4px;
}

.primary {
  background: #007bff;
}

.secondary {
  background: #6c757d;
}
```

```javascript
// Button.jsx
import styles from './Button.module.css';

export default function Button() {
  return (
    <button className={styles.button}>
      Click me
    </button>
  );
}

// Multiple classes
<button className={`${styles.button} ${styles.primary}`}>
  Primary Button
</button>

// Or with clsx library
import clsx from 'clsx';

<button className={clsx(styles.button, styles.primary)}>
  Primary Button
</button>
```

**Compiled output** - unique class names:
```css
/* .Button_button__2Rk3a { ... } */
/* .Button_primary__1Hj9s { ... } */
```

**Benefits:**
- No naming conflicts
- Component-scoped styles
- Dead code elimination
- Explicit dependencies

---

## 20. Tailwind CSS

**Tailwind** is a utility-first CSS framework that provides pre-built utility classes. Build designs without writing custom CSS.

Highly customizable and responsive.

```css
/* ❌ Traditional CSS */
.button {
  background-color: blue;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  font-weight: bold;
}
```

```html
<!-- ✅ Tailwind equivalent -->
<button class="bg-blue-500 text-white px-4 py-2 rounded font-bold">
  Click me
</button>
```

**Common Tailwind classes:**

```html
<!-- Layout -->
<div class="flex justify-center items-center">
<div class="grid grid-cols-3 gap-4">

<!-- Spacing -->
<div class="m-4">    <!-- margin: 1rem -->
<div class="p-4">    <!-- padding: 1rem -->
<div class="mx-auto"> <!-- margin-left/right: auto -->

<!-- Typography -->
<p class="text-lg font-bold text-gray-700">
<h1 class="text-3xl font-semibold">

<!-- Colors -->
<div class="bg-blue-500 text-white">
<div class="bg-red-100 text-red-800">

<!-- Responsive -->
<div class="w-full md:w-1/2 lg:w-1/3">
<!-- Full width on mobile, half on tablet, third on desktop -->

<!-- Hover states -->
<button class="bg-blue-500 hover:bg-blue-700">

<!-- Dark mode -->
<div class="bg-white dark:bg-gray-800">
```

**Pros:**
- Fast development
- No naming conflicts
- Consistent design system
- Small production bundle (with purge)

**Cons:**
- HTML can get verbose
- Learning curve for class names
- Less semantic HTML

---

## 21. CSS-in-JS

**CSS-in-JS** writes CSS directly in JavaScript. Styles are scoped to components and can use JavaScript logic.

**Popular libraries**: styled-components, Emotion.

```javascript
// ✅ styled-components
import styled from 'styled-components';

const Button = styled.button`
  background: ${props => props.primary ? 'blue' : 'gray'};
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: ${props => props.size === 'large' ? '18px' : '14px'};

  &:hover {
    background: darkblue;
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
  }
`;

// Usage
<Button primary>Primary Button</Button>
<Button size="large">Large Button</Button>

// ✅ Emotion
import { css } from '@emotion/react';

const buttonStyle = css`
  background: blue;
  color: white;
  padding: 10px 20px;
`;

<button css={buttonStyle}>Click me</button>

// Extending styles
const PrimaryButton = styled(Button)`
  background: blue;
  font-weight: bold;
`;
```

**Benefits:**
- Component-scoped styles
- Dynamic styling with props
- No class name conflicts
- Dead code elimination
- Full power of JavaScript

**Drawbacks:**
- Runtime overhead
- Larger bundle size
- Learning curve
- Requires JavaScript to render styles

---

## 22. BEM Methodology

**BEM** stands for Block Element Modifier - a naming convention for CSS classes.

Makes code more maintainable and understandable.

**Structure**: `block__element--modifier`

```css
/* Block - standalone component */
.button { }

/* Element - part of block */
.button__icon { }
.button__text { }

/* Modifier - variation of block or element */
.button--primary { }
.button--large { }
.button__icon--small { }
```

```html
<!-- HTML structure -->
<button class="button button--primary">
  <span class="button__icon"></span>
  <span class="button__text">Click me</span>
</button>

<div class="card">
  <div class="card__header">
    <h3 class="card__title">Title</h3>
  </div>
  <div class="card__body">
    <p class="card__text">Content</p>
  </div>
  <div class="card__footer">
    <button class="card__button card__button--primary">Action</button>
  </div>
</div>
```

**Benefits:**
- Clear structure
- Avoids naming conflicts
- Self-documenting
- Easy to understand relationships
- Low specificity

---

## 23. display: none vs visibility: hidden

Three ways to hide elements with different behaviors:

```css
/* ❌ display: none - removes from layout */
.box {
  display: none;  /* Element removed, no space taken */
}
// Cannot interact, not read by screen readers

/* ⚠️ visibility: hidden - hides but keeps space */
.box {
  visibility: hidden;  /* Element hidden, space remains */
}
// Cannot interact, not read by screen readers

/* ⚠️ opacity: 0 - invisible but interactive */
.box {
  opacity: 0;  /* Element invisible, space remains */
}
// Can still interact (click, hover), read by screen readers
```

**Example:**

```html
<div class="box" style="display: none;">A</div>
<div class="box" style="visibility: hidden;">B</div>
<div class="box" style="opacity: 0;">C</div>
<div class="box">D</div>

<!-- Layout: [   ][   ]D  (A removed, B and C take space, D visible) -->
```

**Comparison Table:**

| Property | Takes space | Clickable | Screen readers | Transitions | Use case |
|----------|-------------|-----------|----------------|-------------|----------|
| `display: none` | No | No | No | No | Toggle visibility |
| `visibility: hidden` | Yes | No | No | Yes | Hide but maintain layout |
| `opacity: 0` | Yes | Yes | Yes | Yes | Fade animations |

---

## 24. block vs inline vs inline-block

**block**: Full width, stacks vertically, can set width/height.
**inline**: Only content width, flows with text, cannot set width/height.
**inline-block**: Inline flow but can set width/height.

```css
/* ✅ block elements */
div, p, h1, section {
  display: block;
  width: 100%;         /* Full width */
  /* Can set width and height */
}

/* ⚠️ inline elements */
span, a, strong, em {
  display: inline;
  /* Cannot set width and height */
  /* Margin/padding only affect horizontal */
}

/* ✅ inline-block elements */
.box {
  display: inline-block;
  width: 200px;        /* Can set width */
  height: 100px;       /* Can set height */
  /* Flows like inline but behaves like block */
}
```

**Example:**

```html
<div style="display: block; width: 200px;">Block</div>
<div style="display: block; width: 200px;">Block</div>
<!-- Each on new line -->

<span style="display: inline;">Inline</span>
<span style="display: inline;">Inline</span>
<!-- On same line -->

<div style="display: inline-block; width: 100px;">IB</div>
<div style="display: inline-block; width: 100px;">IB</div>
<!-- On same line, but with width -->
```

**Comparison Table:**

| Display | New line | Width/Height | Vertical margin/padding | Use case |
|---------|----------|--------------|------------------------|----------|
| `block` | Yes | Yes | Yes | Containers, sections |
| `inline` | No | No | No | Text, links |
| `inline-block` | No | Yes | Yes | Buttons, badges |

---

## 25. CSS Preprocessors

**Preprocessors** extend CSS with features like variables, nesting, and mixins. Compile to regular CSS.

**Popular**: Sass, Less, Stylus.

**Note**: Modern CSS has many built-in features (variables, calc, etc.).

```scss
/* Sass/SCSS features */

// Variables
$primary-color: #007bff;
$font-size: 16px;

.button {
  background: $primary-color;
  font-size: $font-size;
}

// Nesting
.nav {
  background: white;

  ul {
    list-style: none;

    li {
      display: inline-block;

      a {
        color: black;

        &:hover {
          color: blue;
        }
      }
    }
  }
}

// Mixins (reusable styles)
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

.box {
  @include flex-center;
  height: 100px;
}

// Functions
@function calculate-rem($px) {
  @return #{$px / 16}rem;
}

.text {
  font-size: calculate-rem(24);  // 1.5rem
}

// Partials and imports
@import 'variables';
@import 'mixins';
@import 'components/button';
```

**Sass vs Modern CSS:**

| Feature | Sass | Modern CSS |
|---------|------|------------|
| Variables | `$var` | `--var` (CSS Custom Properties) |
| Nesting | Yes | Yes (CSS Nesting Module) |
| Mixins | Yes | No (use CSS variables) |
| Functions | Yes | Limited (`calc()`, `clamp()`) |
| Imports | `@import` | `@import` (deprecated), `@layer` |

---

## 26. Mobile-first Design

**Mobile-first design**: Design for mobile devices first, then enhance for larger screens.

Uses `min-width` media queries. Better performance on mobile and forces focus on essential content.

```css
/* ✅ Mobile-first approach (recommended) */

/* Base styles - mobile (no media query) */
.container {
  width: 100%;
  padding: 10px;
  font-size: 14px;
}

/* Tablet and up */
@media (min-width: 768px) {
  .container {
    width: 750px;
    padding: 20px;
    font-size: 16px;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .container {
    width: 1000px;
    font-size: 18px;
  }
}
```

```css
/* ❌ Desktop-first approach (not recommended) */

/* Base styles - desktop */
.container {
  width: 1000px;
  padding: 30px;
  font-size: 18px;
}

/* Tablet and down */
@media (max-width: 1023px) {
  .container {
    width: 750px;
    padding: 20px;
    font-size: 16px;
  }
}

/* Mobile and down */
@media (max-width: 767px) {
  .container {
    width: 100%;
    padding: 10px;
    font-size: 14px;
  }
}
```

**Why Mobile-first:**
- Majority of users on mobile
- Forces focus on essential content
- Progressive enhancement
- Better performance (mobile loads less CSS)

---

## 27. Grid vs Flexbox for Layouts

**Use Grid for**: Page layouts, complex 2D layouts.
**Use Flexbox for**: Components, 1D layouts (nav, cards).

They can work together.

```css
/* ✅ Grid - Page layout (2D) */
.page {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
  grid-template-columns: 200px 1fr 1fr;
  grid-template-rows: 60px 1fr 40px;
  min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.footer { grid-area: footer; }

/* ✅ Flexbox - Navigation (1D) */
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.nav-links {
  display: flex;
  gap: 20px;
}

/* ✅ Combined - Card grid with flex items */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.card {
  display: flex;           /* Flex inside grid item */
  flex-direction: column;
  padding: 20px;
}

.card-footer {
  margin-top: auto;        /* Push to bottom */
}
```

**Decision Matrix:**

| Scenario | Use |
|----------|-----|
| Navigation bar | Flexbox |
| Page layout | Grid |
| Card list | Grid (container) + Flexbox (cards) |
| Button group | Flexbox |
| Dashboard | Grid |
| Centering content | Flexbox |
| Photo gallery | Grid |

---

## 28. CSS Performance Optimizations

Optimize CSS for better performance and faster page loads.

```css
/* ❌ Expensive selectors (avoid) */
* { }                    /* Universal selector */
div div div p { }        /* Deeply nested */
[class*="icon"] { }      /* Complex attribute */

/* ✅ Efficient selectors */
.text { }                /* Class selector */
#header { }              /* ID selector */

/* ✅ Use transform instead of position changes */
/* Better performance - GPU accelerated */
.box {
  transform: translateX(100px);
}

/* ❌ Worse performance - triggers layout */
.box {
  left: 100px;
}

/* ✅ Use will-change for animations */
.animated {
  will-change: transform, opacity;
}

/* Remove after animation */
.animated.done {
  will-change: auto;
}

/* ✅ Use contain property */
.widget {
  contain: layout style paint;  /* Isolates from rest of page */
}
```

**Performance Best Practices:**

1. **Critical CSS**: Inline critical CSS in `<head>`, load rest asynchronously
2. **Minify and compress**: Use build tools to minify, enable gzip/brotli
3. **Remove unused CSS**: Use PurgeCSS or similar tools
4. **Avoid expensive properties**: `box-shadow`, `border-radius`, filters on large elements
5. **Use CSS containment**: Isolate components with `contain` property
6. **Optimize animations**: Use `transform` and `opacity` (GPU-accelerated)

**Properties Performance:**

| Property | Performance | Why |
|----------|-------------|-----|
| `transform` | Fast | GPU-accelerated |
| `opacity` | Fast | GPU-accelerated |
| `width/height` | Slow | Triggers layout |
| `top/left` | Slow | Triggers layout |
| `box-shadow` | Medium | Painting overhead |
| `color` | Fast | Paint only |

---

## 29. Reset vs Normalize CSS

**Reset CSS**: Removes all default browser styles (blank slate).
**Normalize CSS**: Makes default styles consistent across browsers (preserves useful defaults).

```css
/* ❌ CSS Reset - removes everything */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

h1, h2, h3, h4, h5, h6 {
  font-size: inherit;
  font-weight: inherit;
}

/* ✅ Normalize CSS - makes consistent */
// Keeps useful defaults
// Makes h1 consistent across browsers
// Preserves accessibility features
```

**Modern approach** - combination of both:

```css
/* ✅ Modern CSS reset */
*,
*::before,
*::after {
  box-sizing: border-box;
}

* {
  margin: 0;
  padding: 0;
}

body {
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

input, button, textarea, select {
  font: inherit;
}
```

**Comparison Table:**

| Feature | Reset CSS | Normalize CSS | Modern Reset |
|---------|-----------|---------------|--------------|
| Approach | Remove all styles | Preserve useful defaults | Selective reset |
| File size | Small | Medium | Small |
| Accessibility | May break | Preserves | Preserves |
| Browser consistency | High | High | High |
| Starting point | Blank slate | Styled baseline | Styled baseline |

---

## 30. CSS Best Practices

Follow these best practices for maintainable, performant CSS.

```css
/* ✅ Good practices */

/* 1. Semantic naming */
.product-card { }
.user-profile { }
.navigation-menu { }

/* 2. Low specificity */
.button { }
.button--primary { }

/* 3. CSS variables for theming */
:root {
  --color-primary: #007bff;
  --spacing-unit: 8px;
  --border-radius: 4px;
}

.button {
  background: var(--color-primary);
  padding: calc(var(--spacing-unit) * 2);
  border-radius: var(--border-radius);
}

/* 4. Mobile-first */
.container { width: 100%; }
@media (min-width: 768px) { .container { width: 750px; } }

/* 5. Accessible CSS */
.skip-link {
  position: absolute;
  left: -9999px;
}

.skip-link:focus {
  left: 0;
  z-index: 9999;
}
```

```css
/* ❌ Avoid */

/* Non-semantic naming */
.big-blue { }      /* Describes appearance, not purpose */
.box1 { }          /* Meaningless */

/* High specificity */
div#main .container .box .text { }  /* Too specific */

/* !important everywhere */
.text { color: red !important; }

/* Inline styles */
<div style="color: red; font-size: 20px;">  /* Hard to maintain */
```

**CSS File Organization:**

1. Variables
2. Base/Reset
3. Layout
4. Components
5. Utilities

**Best Practices Checklist:**

- Use semantic and meaningful class names
- Follow a methodology (BEM, OOCSS, SMACSS)
- Avoid `!important` unless absolutely necessary
- Use CSS variables for theming
- Mobile-first responsive design
- Keep specificity low
- Organize and structure CSS files
- Use modern layout methods (Flexbox, Grid)
- Optimize for performance
- Write accessible CSS
- Comment complex code
- Use consistent naming conventions
- Validate CSS
- Test across browsers

---

## 31. Summary

**Key takeaways:**

### Core Concepts
1. **Box Model** - Content, padding, border, margin; use `box-sizing: border-box`
2. **Specificity** - Inline (1000) > IDs (100) > Classes (10) > Elements (1); avoid `!important`
3. **Cascade** - Order matters; last rule wins if equal specificity
4. **Units** - Use `rem` for fonts, `px` for borders, `%` or viewport units for layouts

### Layout Systems
1. **Flexbox** - One-dimensional layout (rows or columns); great for components
2. **Grid** - Two-dimensional layout (rows and columns); perfect for page layouts
3. **Positioning** - `static`, `relative`, `absolute`, `fixed`, `sticky`; use `z-index` for stacking
4. **Responsive Design** - Mobile-first with `min-width` media queries

### Styling Techniques
1. **Selectors** - Element, class, ID, attribute, pseudo-class (`:hover`), pseudo-element (`::before`)
2. **Variables** - CSS Custom Properties (`--color`) for dynamic, themeable styles
3. **Transitions** - Smooth property changes on state change
4. **Animations** - Complex keyframe-based animations with full control
5. **Transforms** - Modify position, rotation, scale; GPU-accelerated

### Modern CSS Approaches
1. **CSS Modules** - Scoped styles, unique class names, no conflicts
2. **Tailwind CSS** - Utility-first framework, rapid development
3. **CSS-in-JS** - Styles in JavaScript, component-scoped, dynamic
4. **BEM** - Block Element Modifier naming convention for clarity

### Performance & Best Practices
1. **Performance** - Use `transform`/`opacity` for animations, avoid expensive selectors, minify CSS
2. **Reset/Normalize** - Use modern reset for consistent cross-browser baseline
3. **Mobile-first** - Design for mobile, enhance for desktop
4. **Organization** - Follow methodology (BEM), use semantic names, keep specificity low
5. **Accessibility** - Focus states, skip links, screen reader support

### Comparison Tables Summary

**Box Model:**
- `content-box`: Width = content only
- `border-box`: Width = content + padding + border ✅

**Units:**
- `px`: Absolute, fixed
- `em`: Relative to parent (compounds)
- `rem`: Relative to root (consistent) ✅
- `%`: Relative to parent
- `vw/vh`: Relative to viewport

**Flexbox vs Grid:**
- Flexbox: 1D (row or column) - components, navigation
- Grid: 2D (rows and columns) - page layouts, complex grids

**Position:**
- `static`: Default, normal flow
- `relative`: Relative to normal position
- `absolute`: Relative to positioned ancestor
- `fixed`: Relative to viewport (stays on scroll)
- `sticky`: Relative + fixed (sticks on scroll)

**Display:**
- `block`: Full width, stacks vertically
- `inline`: Content width, flows with text
- `inline-block`: Inline flow, can set dimensions

**Hiding Elements:**
- `display: none`: Removed from layout, no space
- `visibility: hidden`: Hidden, space remains
- `opacity: 0`: Invisible, interactive, space remains

**Modern CSS in 2024+:**
- Use CSS Grid and Flexbox for layouts
- CSS Variables for theming
- Mobile-first responsive design
- CSS Modules or utility frameworks (Tailwind)
- Performance-first: `transform`, `opacity`, containment
- Semantic class names (BEM or similar)
- Avoid `!important` and high specificity
