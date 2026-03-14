# Web Accessibility (a11y)

## 1. What is Web Accessibility?

Building websites usable by everyone, including people with visual, auditory, motor, and cognitive disabilities.

- ~15-20% of the world's population has some form of disability
- Legal requirements: ADA (US), Section 508 (US federal), European Accessibility Act
- Accessible sites have better SEO, usability, and cleaner code

**WCAG Principles (POUR):**
- **Perceivable** — text alternatives, captions, sufficient contrast
- **Operable** — keyboard accessible, no seizure-triggering content
- **Understandable** — readable text, predictable behavior, helpful errors
- **Robust** — valid HTML, compatible with assistive technologies

**WCAG Levels:** A (minimum) → AA (recommended legal standard, 4.5:1 contrast) → AAA (highest, 7:1 contrast)

---

## 2. Semantic HTML

Use the correct HTML element. Screen readers rely on semantic structure to navigate.

- **Heading hierarchy** — Start at `<h1>`, never skip levels, one `<h1>` per page
- **Landmark elements** — `<header>`, `<nav>`, `<main>`, `<aside>`, `<article>`, `<section>`, `<footer>`

```html
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
</main>
```

**Use native interactive elements** — `<button>` not `<div onClick>`, `<a href>` not `<span onClick>`.

```tsx
// Bad: div soup, no semantics
<div className="btn" onClick={handleClick}>Submit</div>

// Good: native button
<button type="submit" onClick={handleClick}>Submit</button>
```

---

## 3. ARIA Roles and Attributes

ARIA supplements HTML. **First rule: do not use ARIA if a native HTML element provides the needed semantics.**

**Key attributes:**
- `aria-label` — accessible name for elements with no visible text
- `aria-labelledby` — points to another element's ID as the label
- `aria-describedby` — points to supplemental descriptive text
- `aria-hidden="true"` — hides decorative elements from screen readers
- `aria-live="polite"` / `"assertive"` — announces dynamic content changes
- `aria-expanded` — indicates open/collapsed state
- `aria-current="page"` — marks current item in navigation

```tsx
// Live region for dynamic updates
const StatusMessage = ({ message }: { message: string }) => (
  <div aria-live="polite" role="status">{message}</div>
);

// Accordion with aria-expanded
const Accordion = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button aria-expanded={isOpen} aria-controls="panel" onClick={() => setIsOpen(!isOpen)}>
        FAQ: How do I reset my password?
      </button>
      <div id="panel" hidden={!isOpen}>
        <p>Go to Settings and click "Reset Password".</p>
      </div>
    </div>
  );
};

// Dialog with proper ARIA
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">{title}</h2>
  {children}
</div>
```

---

## 4. Keyboard Navigation

All interactive elements must be operable with a keyboard. Standard keys: **Tab** (forward), **Shift+Tab** (backward), **Enter/Space** (activate), **Escape** (close), **Arrow keys** (within components).

```css
/* Never remove outline without providing an alternative */
*:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
```

**Skip links** — first focusable element; lets keyboard users skip navigation:

```html
<a href="#main-content" class="skip-link">Skip to main content</a>
<main id="main-content">...</main>
```

```css
.skip-link { position: absolute; top: -40px; left: 0; background: #000; color: #fff; padding: 8px 16px; }
.skip-link:focus { top: 0; }
```

**Focus trapping in modals:**

```tsx
const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      const firstFocusable = modalRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      setTimeout(() => firstFocusable?.focus(), 0);
    } else {
      triggerRef.current?.focus();
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { onClose(); return; }
    if (e.key === "Tab" && modalRef.current) {
      const focusable = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  };

  if (!isOpen) return null;
  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="modal-title"
        onKeyDown={handleKeyDown} onClick={(e) => e.stopPropagation()}>
        <h2 id="modal-title">{title}</h2>
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body
  );
};
```

---

## 5. Color and Contrast

Never rely on color alone — always add text, icons, or patterns.

**WCAG AA minimums:**
- Normal text: **4.5:1** contrast ratio
- Large text (18pt+ or 14pt bold): **3:1**
- UI components and graphics: **3:1**

```html
<!-- Bad: color-only error indicator -->
<input type="text" style="border-color: red;" />

<!-- Good: color + icon + text -->
<input id="email" type="email" aria-invalid="true" aria-describedby="email-error" />
<p id="email-error" role="alert">⚠ Please enter a valid email address.</p>
```

**Tools:** WebAIM Contrast Checker, Chrome DevTools, Lighthouse, axe DevTools

---

## 6. Images and Alt Text

Every `<img>` must have an `alt` attribute:

- **Informative** — describe content concisely
- **Decorative** — use `alt=""` so screen readers skip it
- **Functional** (logo/icon links) — describe action/destination
- **Complex** (charts) — brief alt + longer description via `aria-describedby`

```html
<img src="team-photo.jpg" alt="The engineering team at the 2024 company retreat" />
<a href="/"><img src="logo.svg" alt="Acme Corp - Go to homepage" /></a>
<img src="decorative-divider.svg" alt="" />
```

```tsx
// SVG icons — aria-hidden if decorative
const SearchButton = () => (
  <button aria-label="Search">
    <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M15.5 14h-.79l..." /></svg>
  </button>
);
```

---

## 7. Forms and Accessibility

Every input needs a programmatically associated label.

```html
<!-- Bad: placeholder is not a label -->
<input type="email" placeholder="Email" />

<!-- Good -->
<label for="email">Email</label>
<input id="email" type="email" />
```

**Error handling** — link errors via `aria-describedby`:

```tsx
const FormField = ({ id, label, type = "text", error, required, value, onChange }: FormFieldProps) => {
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id}>
        {label}{required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={id} type={type} value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? errorId : undefined}
        aria-required={required} required={required}
      />
      {error && <p id={errorId} role="alert">{error}</p>}
    </div>
  );
};
```

**Group related inputs** with `<fieldset>` and `<legend>`:

```html
<fieldset>
  <legend>Shipping Method</legend>
  <label><input type="radio" name="shipping" value="standard" /> Standard (5-7 days)</label>
  <label><input type="radio" name="shipping" value="express" /> Express (2-3 days)</label>
</fieldset>
```

---

## 8. Accessible Tabs Component

```tsx
const AccessibleTabs = ({ tabs, ariaLabel }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let next = index;
    if (e.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    else return;
    e.preventDefault();
    setActiveTab(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label={ariaLabel}>
        {tabs.map((tab, i) => (
          <button key={tab.id} ref={(el) => { tabRefs.current[i] = el; }}
            role="tab" id={`tab-${tab.id}`}
            aria-selected={activeTab === i} aria-controls={`panel-${tab.id}`}
            tabIndex={activeTab === i ? 0 : -1}
            onClick={() => setActiveTab(i)} onKeyDown={(e) => handleKeyDown(e, i)}>
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, i) => (
        <div key={tab.id} role="tabpanel" id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`} hidden={activeTab !== i} tabIndex={0}>
          {tab.content}
        </div>
      ))}
    </div>
  );
};
```

---

## 9. Testing Accessibility

```bash
npm install --save-dev eslint-plugin-jsx-a11y
```

```json
// .eslintrc.json
{ "plugins": ["jsx-a11y"], "extends": ["plugin:jsx-a11y/recommended"] }
```

```typescript
// Automated axe testing with Playwright
import AxeBuilder from "@axe-core/playwright";

test("no accessibility violations", async ({ page }) => {
  await page.goto("https://example.com");
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
  expect(results.violations).toEqual([]);
});
```

**Manual testing checklist:**
- Keyboard only: reach every interactive element, visible focus, Escape closes modals
- Screen reader: images described, labels announced, headings navigable, dynamic updates announced
- Visual: contrast 4.5:1+, 200% zoom works, color not sole indicator, focus indicators visible

---

## 10. Quick Checklist

- `<html lang="...">` on every page
- Unique descriptive `<title>` on every page
- One `<h1>` per page, logical heading hierarchy
- All images have `alt` (descriptive or empty for decorative)
- All form inputs have associated labels
- All interactive elements keyboard-accessible with visible focus
- Color contrast meets AA (4.5:1 text, 3:1 large text/UI)
- Skip navigation link present
- ARIA only used when native HTML is insufficient
- Dynamic content announced via `aria-live`
- Modals trap focus and restore it on close
- Errors linked to inputs via `aria-describedby`
- Touch targets at least 44x44px
