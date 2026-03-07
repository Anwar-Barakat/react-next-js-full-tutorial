# Web Accessibility (a11y) - Complete Guide

A comprehensive guide to web accessibility for frontend developers using React, TypeScript, and modern HTML.

## Table of Contents

1. [What is Web Accessibility (a11y)?](#1-what-is-web-accessibility-a11y)
2. [WCAG Guidelines](#2-wcag-guidelines)
3. [Semantic HTML for Accessibility](#3-semantic-html-for-accessibility)
4. [ARIA Roles and Attributes](#4-aria-roles-and-attributes)
5. [Keyboard Navigation](#5-keyboard-navigation)
6. [Color and Contrast](#6-color-and-contrast)
7. [Images and Alt Text](#7-images-and-alt-text)
8. [Forms and Accessibility](#8-forms-and-accessibility)
9. [Accessible Components in React](#9-accessible-components-in-react)
10. [Screen Readers](#10-screen-readers)
11. [Testing Accessibility](#11-testing-accessibility)
12. [Accessibility Best Practices](#12-accessibility-best-practices)

---

## 1. What is Web Accessibility (a11y)?

- **Web accessibility** (often abbreviated as **a11y** -- "a", 11 letters, "y") means designing and building websites that everyone can use, including people with disabilities.
- Disabilities include visual, auditory, motor, cognitive, speech, and neurological impairments.
- Accessibility also benefits users with temporary impairments (broken arm), situational limitations (bright sunlight), and aging populations.

**Why Accessibility Matters:**

- Roughly **15-20% of the world's population** lives with some form of disability.
- An inaccessible site excludes a significant portion of potential users and customers.
- Accessible websites have better SEO, improved usability for all users, and cleaner code.
- It is the ethical and inclusive approach to building software.

**Legal Requirements:**

- **ADA (Americans with Disabilities Act)** -- Applies to businesses operating in the United States. Courts have ruled that websites are "places of public accommodation."
- **Section 508** -- Requires US federal agencies and contractors to make digital content accessible.
- **European Accessibility Act (EAA)** -- Requires digital products and services in EU member states to be accessible.
- **AODA (Accessibility for Ontarians with Disabilities Act)** -- Canadian province-level accessibility law.
- **EN 301 549** -- European standard for accessibility requirements for ICT products and services.
- Lawsuits for inaccessible websites have increased significantly. In 2023, over 4,600 web accessibility lawsuits were filed in the US alone.

**Key Takeaway:**

- Accessibility is not optional. It is a legal requirement in many jurisdictions and a moral responsibility for all developers.

---

## 2. WCAG Guidelines

- **WCAG (Web Content Accessibility Guidelines)** is an international standard published by the W3C (World Wide Web Consortium).
- WCAG provides a shared set of guidelines for making web content accessible.
- The current widely adopted version is **WCAG 2.1**, with **WCAG 2.2** published in October 2023.

**WCAG Conformance Levels:**

- **Level A** -- The minimum level of accessibility. Addresses the most basic barriers.
  - Example: All images have alt text. All form fields have labels.
- **Level AA** -- The recommended target for most websites and the legal standard in many countries.
  - Example: Text has a contrast ratio of at least 4.5:1. Content is resizable to 200% without loss of functionality.
- **Level AAA** -- The highest level. Not required for entire sites, but useful for specific critical content.
  - Example: Text has a contrast ratio of at least 7:1. Sign language interpretation for audio content.

**The Four Principles (POUR):**

- Every WCAG guideline falls under one of four principles:

- **1. Perceivable** -- Information and UI must be presentable in ways users can perceive.
  - Provide text alternatives for non-text content (images, video, audio).
  - Provide captions and transcripts for multimedia.
  - Content should be adaptable (different layouts) without losing meaning.
  - Content should be distinguishable (sufficient contrast, resizable text).

- **2. Operable** -- UI components and navigation must be operable by all users.
  - All functionality must be available from a keyboard.
  - Users should have enough time to read and use content.
  - Content should not cause seizures (no flashing more than 3 times per second).
  - Users should be able to navigate, find content, and determine where they are.

- **3. Understandable** -- Information and UI operation must be understandable.
  - Text should be readable and understandable.
  - Content should appear and operate in predictable ways.
  - Users should be helped to avoid and correct mistakes (error handling in forms).

- **4. Robust** -- Content must be robust enough to work with current and future technologies.
  - Content should be compatible with assistive technologies (screen readers, magnifiers).
  - Valid HTML markup is essential for correct interpretation.
  - ARIA attributes should be used correctly when native HTML is not sufficient.

---

## 3. Semantic HTML for Accessibility

- **Semantic HTML** means using the correct HTML element for the correct purpose.
- Screen readers and assistive technologies rely on semantic structure to understand and navigate content.
- Using a `<div>` or `<span>` for everything destroys meaning and breaks accessibility.

**Correct Heading Hierarchy:**

- Headings (`<h1>` through `<h6>`) create a document outline that screen reader users navigate by.
- Always start with `<h1>` and do not skip levels.
- There should be only one `<h1>` per page.

```html
<!-- Bad: Skipped heading levels, used for styling -->
<h1>My Website</h1>
<h4>About Us</h4>
<h2>Contact</h2>

<!-- Good: Proper hierarchy -->
<h1>My Website</h1>
  <h2>About Us</h2>
    <h3>Our Team</h3>
    <h3>Our Mission</h3>
  <h2>Contact</h2>
    <h3>Email Us</h3>
```

**Landmark Elements:**

- Landmarks allow screen reader users to jump directly to major sections of a page.

- **`<header>`** -- Introductory content, typically containing the site logo and navigation.
- **`<nav>`** -- A section containing navigation links.
- **`<main>`** -- The primary content of the page. There should be only one per page.
- **`<aside>`** -- Content tangentially related to the main content (sidebars, related links).
- **`<article>`** -- A self-contained piece of content that could stand alone (blog post, news article, comment).
- **`<section>`** -- A thematic grouping of content, typically with a heading.
- **`<footer>`** -- Footer content, typically containing copyright, links, contact info.

```html
<!-- Bad: No semantic structure -->
<div class="header">
  <div class="nav">
    <a href="/">Home</a>
    <a href="/about">About</a>
  </div>
</div>
<div class="content">
  <div class="article">
    <div class="title">Blog Post Title</div>
    <div class="text">Content here...</div>
  </div>
  <div class="sidebar">Related links...</div>
</div>
<div class="footer">Copyright 2024</div>

<!-- Good: Semantic HTML -->
<header>
  <nav aria-label="Main navigation">
    <a href="/">Home</a>
    <a href="/about">About</a>
  </nav>
</header>
<main>
  <article>
    <h1>Blog Post Title</h1>
    <p>Content here...</p>
  </article>
  <aside aria-label="Related links">
    Related links...
  </aside>
</main>
<footer>
  <p>Copyright 2024</p>
</footer>
```

**Semantic HTML in React:**

```tsx
// Bad: Div soup
const Page: React.FC = () => {
  return (
    <div className="page">
      <div className="top-bar">
        <div className="links">
          <span onClick={goHome}>Home</span>
        </div>
      </div>
      <div className="body">
        <div className="post">
          <div className="post-title">Title</div>
          <div className="post-body">Body</div>
        </div>
      </div>
    </div>
  );
};

// Good: Semantic elements
const Page: React.FC = () => {
  return (
    <>
      <header>
        <nav aria-label="Main navigation">
          <a href="/">Home</a>
        </nav>
      </header>
      <main>
        <article>
          <h1>Title</h1>
          <p>Body</p>
        </article>
      </main>
    </>
  );
};
```

**Use Native Interactive Elements:**

- Always prefer native HTML elements over custom implementations.
- `<button>` instead of `<div onClick>` -- provides keyboard support, focus, and role automatically.
- `<a href>` instead of `<span onClick>` -- provides navigation semantics.
- `<input>`, `<select>`, `<textarea>` instead of custom-built form controls.

```tsx
// Bad: Custom "button" with no accessibility
<div className="btn" onClick={handleClick}>
  Submit
</div>

// Good: Native button element
<button type="submit" onClick={handleClick}>
  Submit
</button>
```

---

## 4. ARIA Roles and Attributes

- **ARIA (Accessible Rich Internet Applications)** is a set of attributes that supplement HTML to communicate meaning and behavior to assistive technologies.
- **First rule of ARIA**: Do not use ARIA if a native HTML element already provides the semantics you need.
- ARIA does not change behavior or appearance. It only changes how assistive technologies interpret an element.

**Common ARIA Attributes:**

- **`aria-label`** -- Provides an accessible name for an element that has no visible text.

```html
<!-- Icon-only button needs aria-label -->
<button aria-label="Close dialog">
  <svg><!-- X icon --></svg>
</button>

<!-- Search input with no visible label -->
<input type="search" aria-label="Search articles" />
```

- **`aria-labelledby`** -- Points to the ID of another element that serves as the label. Overrides other labeling mechanisms.

```html
<h2 id="billing-heading">Billing Address</h2>
<form aria-labelledby="billing-heading">
  <label for="street">Street</label>
  <input id="street" type="text" />
</form>
```

- **`aria-describedby`** -- Points to the ID of an element that provides additional descriptive text.

```html
<label for="password">Password</label>
<input
  id="password"
  type="password"
  aria-describedby="password-hint"
/>
<p id="password-hint">Must be at least 8 characters with one number.</p>
```

- **`aria-hidden="true"`** -- Hides an element from assistive technologies while keeping it visually visible.

```html
<!-- Decorative icon hidden from screen readers -->
<span aria-hidden="true">🔒</span>
<span>Secure checkout</span>
```

- **`aria-live`** -- Announces dynamic content changes to screen readers. Values: `polite`, `assertive`, `off`.
  - `polite` -- Announces when the user is idle (most common).
  - `assertive` -- Interrupts immediately (use sparingly, for urgent alerts).

```tsx
const StatusMessage: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div aria-live="polite" role="status">
      {message}
    </div>
  );
};

// Usage: When message changes, screen readers announce the new text
<StatusMessage message="3 results found" />
```

- **`aria-expanded`** -- Indicates whether a collapsible section is currently expanded or collapsed.

```tsx
const Accordion: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        aria-expanded={isOpen}
        aria-controls="panel-content"
        onClick={() => setIsOpen(!isOpen)}
      >
        FAQ: How do I reset my password?
      </button>
      <div id="panel-content" hidden={!isOpen}>
        <p>Go to Settings and click "Reset Password".</p>
      </div>
    </div>
  );
};
```

- **`aria-current`** -- Indicates the current item in a set (e.g., current page in navigation).

```html
<nav aria-label="Main navigation">
  <a href="/" aria-current="page">Home</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</nav>
```

**Common ARIA Roles:**

- **`role="button"`** -- Use when a non-button element must act as a button (prefer native `<button>` instead).
- **`role="dialog"`** -- Identifies a dialog/modal window.
- **`role="alert"`** -- Announces urgent messages immediately (equivalent to `aria-live="assertive"`).
- **`role="alertdialog"`** -- A dialog that contains an alert message and requires user action.
- **`role="navigation"`** -- Identifies a navigation section (same as `<nav>`).
- **`role="status"`** -- A live region for advisory info (equivalent to `aria-live="polite"`).
- **`role="tablist"`, `role="tab"`, `role="tabpanel"`** -- Used together for tab interfaces.
- **`role="presentation"` / `role="none"`** -- Removes semantic meaning from an element.

```tsx
// Alert role announces immediately to screen readers
const Alert: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div role="alert">
      {message}
    </div>
  );
};

// Dialog role with proper labeling
const Dialog: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <div role="dialog" aria-labelledby="dialog-title" aria-modal="true">
      <h2 id="dialog-title">{title}</h2>
      {children}
    </div>
  );
};
```

---

## 5. Keyboard Navigation

- All interactive elements must be operable with a keyboard alone.
- Many users cannot use a mouse due to motor disabilities, visual impairments, or personal preference.
- Standard keyboard interactions: **Tab** (move forward), **Shift+Tab** (move backward), **Enter/Space** (activate), **Escape** (close/cancel), **Arrow keys** (navigate within components).

**Focus Management:**

- Focus should follow a logical reading order.
- Focus should be visible -- never remove the default outline without providing an alternative.
- After dynamic actions (opening modals, deleting items), move focus to a logical location.

```css
/* Bad: Removing focus outline with no replacement */
*:focus {
  outline: none;
}

/* Good: Custom focus styles */
*:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
```

**tabIndex:**

- `tabIndex={0}` -- Adds a non-interactive element to the tab order (use sparingly).
- `tabIndex={-1}` -- Makes an element programmatically focusable but removes it from the tab order.
- **Never use `tabIndex` values greater than 0.** This overrides the natural tab order and creates confusion.

```tsx
// tabIndex={-1}: Focusable via JavaScript, but not via Tab key
const Heading: React.FC = () => {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Move focus to heading after navigation
    headingRef.current?.focus();
  }, []);

  return (
    <h1 ref={headingRef} tabIndex={-1}>
      Page Title
    </h1>
  );
};
```

**Focus Trapping in Modals:**

- When a modal is open, focus must stay inside the modal.
- Tab should cycle through focusable elements within the modal only.
- Pressing Escape should close the modal.
- When the modal closes, focus should return to the element that triggered it.

```tsx
import { useEffect, useRef, useCallback } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Save the element that had focus before the modal opened
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
  }, [isOpen]);

  // Focus the modal when it opens
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const firstFocusable = modalRef.current.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus();
    }
  }, [isOpen]);

  // Return focus when modal closes
  useEffect(() => {
    return () => {
      previousFocusRef.current?.focus();
    };
  }, []);

  // Trap focus inside the modal
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key !== "Tab" || !modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    },
    [onClose]
  );

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title">{title}</h2>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};
```

**Skip Links:**

- A skip link allows keyboard users to skip repetitive navigation and jump directly to the main content.
- It should be the very first focusable element on the page.
- It is visually hidden until focused.

```html
<!-- Skip link as the first element in <body> -->
<a href="#main-content" class="skip-link">
  Skip to main content
</a>

<header>
  <nav><!-- Long navigation menu --></nav>
</header>

<main id="main-content">
  <!-- Page content -->
</main>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px 16px;
  z-index: 100;
  transition: top 0.2s;
}

.skip-link:focus {
  top: 0;
}
```

```tsx
// Skip link component in React
const SkipLink: React.FC = () => {
  return (
    <a href="#main-content" className="skip-link">
      Skip to main content
    </a>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <SkipLink />
      <header>
        <nav aria-label="Main navigation">
          {/* Navigation links */}
        </nav>
      </header>
      <main id="main-content">{children}</main>
      <footer>{/* Footer content */}</footer>
    </>
  );
};
```

---

## 6. Color and Contrast

- **Color contrast** is the difference in brightness between foreground text and its background.
- Low contrast text is difficult or impossible to read for users with low vision, color blindness, or anyone in a bright or dim environment.
- **Never rely on color alone** to convey information. Always supplement color with text, icons, or patterns.

**WCAG Contrast Ratios:**

- **Level AA (recommended minimum):**
  - Normal text (below 18pt / 24px): contrast ratio of at least **4.5:1**
  - Large text (18pt / 24px bold, or 24pt / 32px regular): contrast ratio of at least **3:1**
  - UI components and graphical objects: at least **3:1**

- **Level AAA (enhanced):**
  - Normal text: contrast ratio of at least **7:1**
  - Large text: contrast ratio of at least **4.5:1**

**Do Not Rely on Color Alone:**

```html
<!-- Bad: Color is the only indicator of an error -->
<input type="text" style="border-color: red;" />

<!-- Good: Color + icon + text message -->
<div>
  <label for="email">Email</label>
  <input
    id="email"
    type="email"
    aria-invalid="true"
    aria-describedby="email-error"
    style="border-color: red;"
  />
  <p id="email-error" role="alert" style="color: red;">
    ⚠ Please enter a valid email address.
  </p>
</div>
```

```tsx
// Bad: Only color distinguishes status
const StatusBadge: React.FC<{ status: "success" | "error" }> = ({ status }) => {
  return (
    <span style={{ color: status === "success" ? "green" : "red" }}>
      ●
    </span>
  );
};

// Good: Color + text + icon
const StatusBadge: React.FC<{ status: "success" | "error" }> = ({ status }) => {
  return (
    <span
      style={{ color: status === "success" ? "green" : "red" }}
      role="status"
    >
      {status === "success" ? "✓ Success" : "✗ Error"}
    </span>
  );
};
```

**Tools to Check Contrast:**

- **WebAIM Contrast Checker** (webaim.org/resources/contrastchecker) -- Enter foreground and background colors to check the ratio.
- **Chrome DevTools** -- Inspect an element, look at the color picker, and it shows the contrast ratio.
- **Lighthouse** -- Built into Chrome DevTools, flags contrast issues automatically.
- **axe DevTools** -- Browser extension that identifies contrast failures.
- **Stark** -- Figma and browser plugin for designers and developers.
- **Color Oracle** -- Desktop application that simulates color blindness.

**Accessible Color Palette Tips:**

- Test your color combinations with a contrast checker before using them.
- Avoid pure gray text on white backgrounds (e.g., `#999` on `#fff` is only 2.85:1 -- fails AA).
- Use underlines or other visual indicators for links, not just color differences.
- Provide a high-contrast mode or dark mode option when possible.
- Test with color blindness simulators (protanopia, deuteranopia, tritanopia).

---

## 7. Images and Alt Text

- The `alt` attribute provides a text alternative for images, read aloud by screen readers.
- Every `<img>` element must have an `alt` attribute. The content of that attribute depends on the image's purpose.

**When and How to Use Alt Text:**

- **Informative images** -- Describe the content and function of the image concisely.
- **Decorative images** -- Use an empty `alt=""` so screen readers skip them entirely.
- **Functional images** (logos, icons that are links) -- Describe the action or destination, not the image appearance.
- **Complex images** (charts, graphs, diagrams) -- Provide a brief alt text and a longer description nearby or via `aria-describedby`.

**Informative vs. Decorative Images:**

```html
<!-- Informative: Describes what the image shows -->
<img src="team-photo.jpg" alt="The engineering team at the 2024 company retreat" />

<!-- Functional: Describes the link destination -->
<a href="/">
  <img src="logo.svg" alt="Acme Corp - Go to homepage" />
</a>

<!-- Decorative: Empty alt, screen readers skip it -->
<img src="decorative-divider.svg" alt="" />

<!-- Decorative via aria-hidden (alternative approach) -->
<img src="background-pattern.png" alt="" aria-hidden="true" />
```

**Complex Images:**

```html
<!-- Chart with brief alt and detailed description -->
<figure>
  <img
    src="revenue-chart.png"
    alt="Revenue chart showing growth from Q1 to Q4 2024"
    aria-describedby="chart-description"
  />
  <figcaption id="chart-description">
    Revenue grew from $2M in Q1 to $5M in Q4 2024, with the
    largest increase occurring between Q2 ($2.5M) and Q3 ($4M).
  </figcaption>
</figure>
```

**Images in React:**

```tsx
// Informative image component
interface ImageProps {
  src: string;
  alt: string;
  isDecorative?: boolean;
}

const AccessibleImage: React.FC<ImageProps> = ({
  src,
  alt,
  isDecorative = false,
}) => {
  if (isDecorative) {
    return <img src={src} alt="" aria-hidden="true" />;
  }

  return <img src={src} alt={alt} />;
};

// Usage
<AccessibleImage src="/hero.jpg" alt="Developer working on accessibility improvements" />
<AccessibleImage src="/wave-pattern.svg" alt="" isDecorative />
```

**Alt Text Best Practices:**

- Keep alt text concise -- typically under 125 characters.
- Do not start with "Image of..." or "Picture of..." -- screen readers already announce it as an image.
- Describe the content and purpose, not the visual appearance (unless appearance is relevant).
- If the image contains text, include that text in the alt attribute.
- For icon fonts or SVG icons, use `aria-label` on the parent element or `aria-hidden="true"` if decorative.

```tsx
// SVG icon with accessible label
const SearchIcon: React.FC = () => (
  <button aria-label="Search">
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M15.5 14h-.79l..." />
    </svg>
  </button>
);

// Decorative SVG icon
const DecorativeIcon: React.FC = () => (
  <svg aria-hidden="true" role="presentation" viewBox="0 0 24 24">
    <path d="M12 2L2 7l10 5..." />
  </svg>
);
```

---

## 8. Forms and Accessibility

- Forms are one of the most critical areas for accessibility.
- Every form input must have a programmatically associated label.
- Error messages must be clearly communicated to all users, including screen reader users.

**Labels:**

- Every input needs a `<label>` element with a `for` attribute matching the input's `id`.
- Placeholder text is **not** a substitute for a label. Placeholders disappear on input and have poor contrast.

```html
<!-- Bad: No label, only placeholder -->
<input type="email" placeholder="Email" />

<!-- Bad: Label not associated with input -->
<label>Email</label>
<input type="email" />

<!-- Good: Label properly associated -->
<label for="email">Email</label>
<input id="email" type="email" />

<!-- Good: Wrapping input in label (implicit association) -->
<label>
  Email
  <input type="email" />
</label>
```

**Error Messages:**

- Error messages must be associated with their input using `aria-describedby`.
- Use `aria-invalid="true"` to indicate the field has an error.
- Move focus to the first field with an error after form submission.
- Announce errors to screen readers using `role="alert"` or `aria-live`.

```tsx
interface FormFieldProps {
  id: string;
  label: string;
  type?: string;
  error?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
}

const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = "text",
  error,
  required = false,
  value,
  onChange,
}) => {
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? errorId : undefined}
        aria-required={required}
        required={required}
      />
      {error && (
        <p id={errorId} role="alert" className="error-message">
          {error}
        </p>
      )}
    </div>
  );
};
```

**Required Fields:**

- Use the `required` attribute on inputs.
- Use `aria-required="true"` for screen readers.
- Visually indicate required fields with an asterisk (*) and explain the convention.
- Do not rely on color alone to indicate required fields.

```html
<p>Fields marked with <span aria-hidden="true">*</span> are required.</p>

<label for="name">
  Name <span aria-hidden="true">*</span>
</label>
<input id="name" type="text" required aria-required="true" />
```

**Fieldset and Legend:**

- Use `<fieldset>` and `<legend>` to group related inputs (e.g., radio buttons, checkboxes, address fields).
- The `<legend>` acts as a label for the entire group.

```html
<fieldset>
  <legend>Shipping Method</legend>

  <label>
    <input type="radio" name="shipping" value="standard" />
    Standard (5-7 days)
  </label>

  <label>
    <input type="radio" name="shipping" value="express" />
    Express (2-3 days)
  </label>

  <label>
    <input type="radio" name="shipping" value="overnight" />
    Overnight (1 day)
  </label>
</fieldset>
```

**Focus on Error (Form Submission):**

```tsx
const ContactForm: React.FC = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!nameRef.current?.value) {
      newErrors.name = "Name is required.";
    }
    if (!emailRef.current?.value) {
      newErrors.email = "Email is required.";
    }

    setErrors(newErrors);

    // Focus the first field with an error
    if (newErrors.name) {
      nameRef.current?.focus();
    } else if (newErrors.email) {
      emailRef.current?.focus();
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {Object.keys(errors).length > 0 && (
        <div role="alert">
          <p>Please fix the following errors:</p>
          <ul>
            {Object.values(errors).map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <label htmlFor="name">Name</label>
      <input
        ref={nameRef}
        id="name"
        type="text"
        aria-invalid={!!errors.name}
        aria-describedby={errors.name ? "name-error" : undefined}
        required
      />
      {errors.name && <p id="name-error">{errors.name}</p>}

      <label htmlFor="email">Email</label>
      <input
        ref={emailRef}
        id="email"
        type="email"
        aria-invalid={!!errors.email}
        aria-describedby={errors.email ? "email-error" : undefined}
        required
      />
      {errors.email && <p id="email-error">{errors.email}</p>}

      <button type="submit">Submit</button>
    </form>
  );
};
```

---

## 9. Accessible Components in React

**Accessible Button:**

- Use the native `<button>` element whenever possible.
- If you must use a different element, add `role="button"`, `tabIndex={0}`, and keyboard event handlers.

```tsx
// Good: Native button
const Button: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}> = ({ onClick, children, disabled = false }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-disabled={disabled}
    >
      {children}
    </button>
  );
};

// If you absolutely must use a non-button element (avoid this when possible)
const CustomButton: React.FC<{
  onClick: () => void;
  children: React.ReactNode;
}> = ({ onClick, children }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
};
```

**Accessible Modal (Dialog):**

```tsx
import { useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const AccessibleModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;

      // Prevent background scrolling
      document.body.style.overflow = "hidden";

      // Focus the first focusable element
      const timer = setTimeout(() => {
        const firstFocusable = modalRef.current?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        firstFocusable?.focus();
      }, 0);

      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = "";
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    },
    [onClose]
  );

  if (!isOpen) return null;

  return createPortal(
    <div
      className="modal-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onKeyDown={handleKeyDown}
        onClick={(e) => e.stopPropagation()}
        className="modal-content"
      >
        <h2 id="modal-title">{title}</h2>
        {children}
        <button onClick={onClose} aria-label="Close dialog">
          Close
        </button>
      </div>
    </div>,
    document.body
  );
};
```

**Accessible Dropdown Menu:**

```tsx
import { useState, useRef, useEffect } from "react";

interface DropdownItem {
  label: string;
  onClick: () => void;
}

interface DropdownProps {
  label: string;
  items: DropdownItem[];
}

const AccessibleDropdown: React.FC<DropdownProps> = ({ label, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (isOpen && activeIndex >= 0) {
      const activeItem = listRef.current?.children[activeIndex] as HTMLElement;
      activeItem?.focus();
    }
  }, [isOpen, activeIndex]);

  const handleButtonKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setIsOpen(true);
        setActiveIndex(0);
        break;
      case "ArrowUp":
        e.preventDefault();
        setIsOpen(true);
        setActiveIndex(items.length - 1);
        break;
    }
  };

  const handleItemKeyDown = (e: React.KeyboardEvent, index: number) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((index + 1) % items.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((index - 1 + items.length) % items.length);
        break;
      case "Escape":
        setIsOpen(false);
        setActiveIndex(-1);
        buttonRef.current?.focus();
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        items[index].onClick();
        setIsOpen(false);
        buttonRef.current?.focus();
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(items.length - 1);
        break;
    }
  };

  return (
    <div className="dropdown">
      <button
        ref={buttonRef}
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) setActiveIndex(0);
        }}
        onKeyDown={handleButtonKeyDown}
      >
        {label}
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          role="menu"
          aria-label={label}
        >
          {items.map((item, index) => (
            <li
              key={index}
              role="menuitem"
              tabIndex={activeIndex === index ? 0 : -1}
              onKeyDown={(e) => handleItemKeyDown(e, index)}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
                buttonRef.current?.focus();
              }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

**Accessible Tabs:**

```tsx
import { useState, useRef } from "react";

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  ariaLabel: string;
}

const AccessibleTabs: React.FC<TabsProps> = ({ tabs, ariaLabel }) => {
  const [activeTab, setActiveTab] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let newIndex = index;

    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        newIndex = (index + 1) % tabs.length;
        break;
      case "ArrowLeft":
        e.preventDefault();
        newIndex = (index - 1 + tabs.length) % tabs.length;
        break;
      case "Home":
        e.preventDefault();
        newIndex = 0;
        break;
      case "End":
        e.preventDefault();
        newIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    setActiveTab(newIndex);
    tabRefs.current[newIndex]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label={ariaLabel}>
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => { tabRefs.current[index] = el; }}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={activeTab === index}
            aria-controls={`panel-${tab.id}`}
            tabIndex={activeTab === index ? 0 : -1}
            onClick={() => setActiveTab(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={activeTab !== index}
          tabIndex={0}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
};

// Usage
const App: React.FC = () => {
  const tabs: Tab[] = [
    { id: "overview", label: "Overview", content: <p>Overview content</p> },
    { id: "features", label: "Features", content: <p>Features content</p> },
    { id: "pricing", label: "Pricing", content: <p>Pricing content</p> },
  ];

  return <AccessibleTabs tabs={tabs} ariaLabel="Product information" />;
};
```

**Accessible Tooltip:**

```tsx
import { useState, useRef } from "react";

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipId = useRef(`tooltip-${Math.random().toString(36).slice(2)}`);

  return (
    <span
      className="tooltip-wrapper"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      <span aria-describedby={isVisible ? tooltipId.current : undefined}>
        {children}
      </span>

      {isVisible && (
        <span
          id={tooltipId.current}
          role="tooltip"
          className="tooltip-content"
        >
          {text}
        </span>
      )}
    </span>
  );
};

// Usage
<Tooltip text="This action cannot be undone">
  <button>Delete Account</button>
</Tooltip>
```

---

## 10. Screen Readers

- A **screen reader** is assistive technology that reads the content of a screen aloud or outputs it to a braille display.
- Screen readers rely on semantic HTML, ARIA attributes, and the accessibility tree to interpret the page.
- The **accessibility tree** is a simplified version of the DOM that contains only the information relevant to assistive technologies.

**Popular Screen Readers:**

- **VoiceOver** -- Built into macOS and iOS. Free. Activated with Cmd+F5 on Mac.
- **NVDA (NonVisual Desktop Access)** -- Free, open-source screen reader for Windows.
- **JAWS (Job Access With Speech)** -- Commercial screen reader for Windows. Industry standard in enterprise.
- **TalkBack** -- Built into Android devices.
- **Narrator** -- Built into Windows 10/11.

**How Screen Readers Navigate:**

- By headings (H key jumps to next heading).
- By landmarks (D key in NVDA, rotor in VoiceOver).
- By links (K key or Tab key).
- By form elements (F key).
- By reading line-by-line (arrow keys).
- By reading entire page (read-all command).

**Testing with VoiceOver (macOS):**

- Turn on: **Cmd + F5** (or System Preferences > Accessibility > VoiceOver).
- Navigate: Use **VO keys (Control + Option)** + arrow keys.
- Read current element: **VO + A** (read all from current position).
- Open Rotor (landmark/heading navigation): **VO + U**.
- Tab through interactive elements: **Tab** key.
- Interact with element: **VO + Space**.

**Testing with NVDA (Windows):**

- Download free from nvaccess.org.
- Navigate by headings: **H** key.
- Navigate by landmarks: **D** key.
- List all headings: **NVDA + F7**.
- Stop speech: **Control**.
- Read current line: **NVDA + L**.

**Common Screen Reader Issues:**

- **Missing alt text on images** -- Screen reader reads the filename instead, which is meaningless.
- **Missing form labels** -- Screen reader announces "edit text" with no context.
- **Non-semantic HTML** -- `<div>` and `<span>` elements are ignored; content structure is lost.
- **Incorrect heading hierarchy** -- Users cannot navigate by headings effectively.
- **Dynamic content not announced** -- Content added via JavaScript is not announced without `aria-live`.
- **Focus not managed** -- After opening a modal, focus stays behind the overlay.
- **Inaccessible custom components** -- Dropdowns, date pickers, and tabs built without ARIA or keyboard support.

**Testing Checklist for Screen Readers:**

- Can you navigate the page using only headings?
- Are all images described (or properly marked as decorative)?
- Are all form fields labeled correctly?
- Are error messages announced when they appear?
- Can you navigate and operate the page with Tab and arrow keys?
- Are modals and popups properly announced?
- Does focus move logically through the page?
- Is dynamic content (loading states, notifications) announced?

---

## 11. Testing Accessibility

**Lighthouse Audit:**

- Built into Chrome DevTools (Audits tab / Lighthouse tab).
- Provides an accessibility score from 0 to 100.
- Identifies specific issues with links to WCAG guidelines.
- Run in Incognito mode for more accurate results (extensions can interfere).

```bash
# Run Lighthouse from the command line
npx lighthouse https://example.com --only-categories=accessibility --output=html --output-path=./report.html

# Run Lighthouse CI in your pipeline
npm install -g @lhci/cli
lhci autorun --collect.url=https://example.com
```

**axe DevTools:**

- Browser extension by Deque Systems (available for Chrome, Firefox, Edge).
- Identifies accessibility violations, incomplete checks, and best practices.
- Provides detailed descriptions and fix suggestions.
- Can be integrated into automated tests.

```bash
# Install axe-core for automated testing
npm install --save-dev @axe-core/react

# Or install axe for Playwright/Cypress
npm install --save-dev axe-core @axe-core/playwright
```

```tsx
// Integrate axe-core with React (development only)
import React from "react";

if (process.env.NODE_ENV === "development") {
  import("@axe-core/react").then((axe) => {
    axe.default(React, 1000);
    // Logs accessibility violations to the browser console
  });
}
```

```typescript
// Automated axe testing with Playwright
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("homepage should have no accessibility violations", async ({ page }) => {
  await page.goto("https://example.com");

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});

test("form page should have no critical violations", async ({ page }) => {
  await page.goto("https://example.com/contact");

  const results = await new AxeBuilder({ page })
    .include("#contact-form")
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();

  expect(results.violations).toEqual([]);
});
```

**eslint-plugin-jsx-a11y:**

- ESLint plugin that catches accessibility issues in JSX at compile time.
- Catches missing alt text, missing labels, invalid ARIA attributes, and more.
- Integrates directly into your IDE for real-time feedback.

```bash
# Install
npm install --save-dev eslint-plugin-jsx-a11y
```

```json
// .eslintrc.json
{
  "plugins": ["jsx-a11y"],
  "extends": ["plugin:jsx-a11y/recommended"],
  "rules": {
    "jsx-a11y/anchor-is-valid": "error",
    "jsx-a11y/alt-text": "error",
    "jsx-a11y/label-has-associated-control": "error",
    "jsx-a11y/no-autofocus": "warn",
    "jsx-a11y/no-noninteractive-element-interactions": "warn",
    "jsx-a11y/click-events-have-key-events": "error",
    "jsx-a11y/no-static-element-interactions": "error"
  }
}
```

- Common issues caught by eslint-plugin-jsx-a11y:
  - `<img>` without `alt` attribute.
  - `<a>` without `href` or with `href="#"`.
  - Click handlers on non-interactive elements without keyboard handlers.
  - `<input>` without associated `<label>`.
  - Invalid ARIA roles or attributes.
  - `autoFocus` attribute (can disorient screen reader users).

**Manual Testing Checklist:**

- **Keyboard-only navigation:**
  - Can you reach every interactive element with Tab?
  - Can you activate buttons and links with Enter and Space?
  - Is there a visible focus indicator on every interactive element?
  - Can you dismiss modals and menus with Escape?
  - Does the tab order follow a logical sequence?

- **Screen reader testing:**
  - Are all images described or marked decorative?
  - Are all form fields announced with their labels?
  - Are headings used correctly and navigable?
  - Are dynamic updates (toasts, alerts, loading states) announced?
  - Are custom components (tabs, accordions, dropdowns) understandable?

- **Visual testing:**
  - Does text meet contrast ratio requirements (4.5:1 for normal text)?
  - Can the page be zoomed to 200% without losing content or functionality?
  - Is information conveyed by more than just color?
  - Are focus indicators clearly visible?

- **Content testing:**
  - Are link texts descriptive (not "click here" or "read more")?
  - Is the page language set (`<html lang="en">`)?
  - Are page titles unique and descriptive?
  - Do error messages clearly explain what went wrong and how to fix it?

---

## 12. Accessibility Best Practices

**Common Issues and Fixes:**

- **Issue: Missing page language**
  - Fix: Add `lang` attribute to the `<html>` element.
  - `<html lang="en">` tells screen readers which language to use for pronunciation.

- **Issue: Missing or non-descriptive page titles**
  - Fix: Every page should have a unique, descriptive `<title>`.
  - Bad: `<title>Page</title>`
  - Good: `<title>Contact Us - Acme Corp</title>`

- **Issue: Vague link text**
  - Fix: Write descriptive link text that makes sense out of context.
  - Bad: `<a href="/report">Click here</a>`
  - Good: `<a href="/report">Download the 2024 annual report</a>`

- **Issue: Missing form labels**
  - Fix: Every input must have an associated `<label>` with a matching `for`/`id`.
  - Use `aria-label` only when a visible label is not possible.

- **Issue: Images without alt text**
  - Fix: Add descriptive `alt` text to informative images and `alt=""` to decorative images.

- **Issue: No visible focus indicator**
  - Fix: Never remove `:focus` styles. Use `:focus-visible` for a keyboard-only focus ring.

- **Issue: Inaccessible custom controls**
  - Fix: Use native HTML elements (`<button>`, `<select>`, `<input>`) whenever possible. Add ARIA roles and keyboard handlers when custom components are necessary.

- **Issue: Auto-playing media**
  - Fix: Never auto-play audio or video. If auto-play is necessary, provide controls to pause and mute.

- **Issue: Content only visible on hover**
  - Fix: Ensure hover content is also accessible on focus and via keyboard. Use `:focus-within` in CSS.

- **Issue: Missing skip navigation link**
  - Fix: Add a "Skip to main content" link as the first focusable element.

- **Issue: Time-limited content**
  - Fix: Allow users to extend or disable time limits. Provide at least 20 seconds to respond before timeout.

- **Issue: Dynamic content not announced**
  - Fix: Use `aria-live="polite"` for non-urgent updates and `aria-live="assertive"` for urgent alerts.

- **Issue: Missing error summary on form submission**
  - Fix: Display an error summary at the top of the form with links to each errored field. Set focus to the summary or first error field.

- **Issue: Non-responsive design**
  - Fix: Ensure content is usable at 320px width (mobile) and up to 400% zoom without horizontal scrolling (WCAG 2.1 Reflow criterion).

**Quick Reference Checklist:**

- Every page has `<html lang="...">` set.
- Every page has a unique, descriptive `<title>`.
- There is exactly one `<h1>` per page, and headings follow a logical hierarchy.
- All images have appropriate `alt` attributes.
- All form inputs have associated labels.
- All interactive elements are keyboard-accessible.
- Focus indicators are visible on all interactive elements.
- Color contrast meets WCAG AA requirements (4.5:1 for text, 3:1 for large text and UI).
- Color is not the sole means of conveying information.
- Skip navigation link is present.
- ARIA is used correctly and only when native HTML is insufficient.
- Dynamic content changes are announced via `aria-live` regions.
- Modals trap focus and return focus on close.
- Error messages are associated with form fields via `aria-describedby`.
- Content is readable and functional at 200% zoom.
- Video content has captions; audio content has transcripts.
- No content flashes more than 3 times per second.
- Links have descriptive text (no "click here").
- Touch targets are at least 44x44 pixels.

---
