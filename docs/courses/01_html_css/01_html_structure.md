# HTML Structure

Learn the foundation of web development: HTML (HyperText Markup Language). Understand document structure, semantic elements, and how to build accessible web pages.

---

## Learning Objectives

- Understand what HTML is and its role in web development
- Learn HTML document structure and syntax
- Master semantic HTML5 elements
- Create forms with various input types
- Build accessible web pages
- Use proper HTML best practices

---

## Prerequisites

- Text editor (VS Code) installed
- Web browser installed
- Basic understanding of how websites work

---

## What is HTML?

**HTML** (HyperText Markup Language) is the **skeleton** of web pages.

Think of a house:
- **HTML** = Structure (walls, roof, doors, windows)
- **CSS** = Decoration (paint, furniture, style)
- **JavaScript** = Functionality (electricity, plumbing, automation)

HTML is NOT a programming language - it's a **markup language** that structures content.

---

## HTML Document Structure

### Basic HTML Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My First Web Page</title>
</head>
<body>
  <h1>Hello, World!</h1>
  <p>This is my first web page.</p>
</body>
</html>
```

### Breaking It Down

**`<!DOCTYPE html>`**
- Declares this is an HTML5 document
- Must be the first line
- Not case-sensitive

**`<html lang="en">`**
- Root element of the page
- `lang="en"` = English language (important for accessibility)

**`<head>`**
- Contains metadata (not displayed on page)
- Includes title, styles, scripts, meta tags

**`<meta charset="UTF-8">`**
- Character encoding (supports all languages and emojis)

**`<meta name="viewport"...>`**
- Makes page responsive on mobile devices

**`<title>`**
- Page title (shows in browser tab)
- Important for SEO

**`<body>`**
- Contains visible content
- Everything users see goes here

---

## HTML Syntax

### Elements

```html
<tagname>Content</tagname>
```

- **Opening tag**: `<tagname>`
- **Content**: Text or other elements
- **Closing tag**: `</tagname>`

### Self-Closing Elements

Some elements don't have content:

```html
<img src="image.jpg" alt="Description">
<br>
<hr>
<input type="text">
```

### Attributes

```html
<tagname attribute="value">Content</tagname>
```

Examples:
```html
<img src="logo.png" alt="Company Logo" width="200">
<a href="https://example.com" target="_blank">Link</a>
<p class="highlight" id="intro">Text</p>
```

Common attributes:
- `class` - CSS class name(s)
- `id` - Unique identifier
- `style` - Inline CSS
- `title` - Tooltip text
- `src` - Source URL (images, scripts)
- `href` - Hyperlink URL

---

## Semantic HTML5 Elements

**Semantic** = meaningful tags that describe their content

### Why Semantic HTML?

✅ Better accessibility (screen readers)
✅ Improved SEO
✅ Easier to read and maintain
✅ Clear document structure

### Semantic Layout Elements

```html
<header>
  <nav>
    <ul>
      <li><a href="#home">Home</a></li>
      <li><a href="#about">About</a></li>
    </ul>
  </nav>
</header>

<main>
  <article>
    <h1>Article Title</h1>
    <p>Article content...</p>
  </article>

  <aside>
    <h2>Related Content</h2>
  </aside>
</main>

<footer>
  <p>&copy; 2026 Company Name</p>
</footer>
```

**`<header>`** - Page or section header
**`<nav>`** - Navigation links
**`<main>`** - Main content (one per page)
**`<article>`** - Self-contained content
**`<section>`** - Thematic grouping
**`<aside>`** - Sidebar or related content
**`<footer>`** - Page or section footer

### vs Non-Semantic (Avoid)

```html
<!-- Bad: Non-semantic -->
<div id="header">
  <div id="nav">...</div>
</div>
<div id="main">...</div>
<div id="footer">...</div>

<!-- Good: Semantic -->
<header>
  <nav>...</nav>
</header>
<main>...</main>
<footer>...</footer>
```

---

## Text Elements

### Headings

```html
<h1>Main Heading (Most Important)</h1>
<h2>Sub Heading</h2>
<h3>Sub-Sub Heading</h3>
<h4>Level 4</h4>
<h5>Level 5</h5>
<h6>Level 6 (Least Important)</h6>
```

**Best Practices**:
- Use only ONE `<h1>` per page
- Don't skip levels (h1 → h2 → h3, not h1 → h3)
- Use for structure, not styling

### Paragraphs & Text

```html
<p>This is a paragraph.</p>

<strong>Bold text (important)</strong>
<em>Italic text (emphasized)</em>

<br> <!-- Line break -->
<hr> <!-- Horizontal rule -->

<blockquote>
  "This is a quotation."
</blockquote>

<code>console.log('inline code')</code>

<pre>
  Preformatted text
  preserves    spaces
  and line breaks
</pre>
```

---

## Links

```html
<!-- External link -->
<a href="https://example.com">Visit Example</a>

<!-- Opens in new tab -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  External Link
</a>

<!-- Link to email -->
<a href="mailto:hello@example.com">Email Us</a>

<!-- Link to phone -->
<a href="tel:+1234567890">Call Us</a>

<!-- Anchor link (same page) -->
<a href="#section-id">Jump to Section</a>

<!-- Download link -->
<a href="document.pdf" download>Download PDF</a>
```

---

## Images

```html
<!-- Basic image -->
<img src="photo.jpg" alt="Description of image">

<!-- With dimensions -->
<img src="logo.png" alt="Company Logo" width="200" height="100">

<!-- Responsive image -->
<img src="photo.jpg" alt="Description" style="max-width: 100%; height: auto;">

<!-- Figure with caption -->
<figure>
  <img src="photo.jpg" alt="Sunset">
  <figcaption>Beautiful sunset at the beach</figcaption>
</figure>
```

**Important**: Always include `alt` attribute for accessibility!

---

## Lists

### Unordered List (Bullets)

```html
<ul>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
</ul>
```

### Ordered List (Numbered)

```html
<ol>
  <li>Step one</li>
  <li>Step two</li>
  <li>Step three</li>
</ol>
```

### Description List

```html
<dl>
  <dt>HTML</dt>
  <dd>HyperText Markup Language</dd>

  <dt>CSS</dt>
  <dd>Cascading Style Sheets</dd>
</dl>
```

### Nested Lists

```html
<ul>
  <li>Frontend
    <ul>
      <li>HTML</li>
      <li>CSS</li>
      <li>JavaScript</li>
    </ul>
  </li>
  <li>Backend
    <ul>
      <li>PHP</li>
      <li>Laravel</li>
    </ul>
  </li>
</ul>
```

---

## Forms

### Basic Form

```html
<form action="/submit" method="POST">
  <label for="username">Username:</label>
  <input type="text" id="username" name="username" required>

  <label for="email">Email:</label>
  <input type="email" id="email" name="email" required>

  <button type="submit">Submit</button>
</form>
```

### Input Types

```html
<!-- Text inputs -->
<input type="text" placeholder="Enter text">
<input type="email" placeholder="email@example.com">
<input type="password" placeholder="Password">
<input type="tel" placeholder="Phone number">
<input type="url" placeholder="https://example.com">
<input type="search" placeholder="Search...">

<!-- Numbers and dates -->
<input type="number" min="1" max="100">
<input type="range" min="0" max="100" step="10">
<input type="date">
<input type="time">
<input type="datetime-local">

<!-- Selections -->
<input type="checkbox" id="agree" name="agree">
<input type="radio" name="gender" value="male"> Male
<input type="radio" name="gender" value="female"> Female

<input type="file" accept="image/*">
<input type="color">

<!-- Buttons -->
<button type="submit">Submit</button>
<button type="reset">Reset</button>
<button type="button">Click Me</button>
```

### Select Dropdown

```html
<label for="country">Country:</label>
<select id="country" name="country">
  <option value="">Select a country</option>
  <option value="us">United States</option>
  <option value="uk">United Kingdom</option>
  <option value="ca">Canada</option>
</select>
```

### Textarea

```html
<label for="message">Message:</label>
<textarea id="message" name="message" rows="5" cols="30">
  Default text here
</textarea>
```

### Complete Form Example

```html
<form action="/register" method="POST">
  <fieldset>
    <legend>Personal Information</legend>

    <label for="name">Full Name:</label>
    <input type="text" id="name" name="name" required>

    <label for="email">Email:</label>
    <input type="email" id="email" name="email" required>

    <label for="dob">Date of Birth:</label>
    <input type="date" id="dob" name="dob">
  </fieldset>

  <fieldset>
    <legend>Preferences</legend>

    <label>
      <input type="checkbox" name="newsletter" value="yes">
      Subscribe to newsletter
    </label>

    <label for="interests">Interests:</label>
    <select id="interests" name="interests" multiple>
      <option value="tech">Technology</option>
      <option value="sports">Sports</option>
      <option value="music">Music</option>
    </select>
  </fieldset>

  <button type="submit">Register</button>
</form>
```

---

## Tables

```html
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Age</th>
      <th>City</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>John Doe</td>
      <td>30</td>
      <td>New York</td>
    </tr>
    <tr>
      <td>Jane Smith</td>
      <td>25</td>
      <td>London</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td colspan="3">Total: 2 people</td>
    </tr>
  </tfoot>
</table>
```

---

## Hands-On Exercise

Create a simple "About Me" webpage with:

1. Proper HTML5 structure
2. Header with your name
3. Navigation menu (placeholder links)
4. Main content with:
   - Your photo (placeholder image)
   - About section (paragraph)
   - Skills list (unordered)
   - Contact form (name, email, message)
5. Footer with copyright

**Starter Code**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>About Me</title>
</head>
<body>
  <!-- Your code here -->
</body>
</html>
```

---

## Assignment

**Objective**: Build a personal portfolio homepage using semantic HTML

**Requirements**:
1. Proper HTML5 document structure
2. Semantic elements (header, nav, main, section, article, footer)
3. At least 3 sections (About, Projects, Contact)
4. Navigation menu with anchor links to sections
5. At least 2 images with proper alt text
6. A contact form with validation
7. A table displaying your skills
8. Proper use of headings hierarchy

**Submission**: HTML file and screenshot

**Evaluation Criteria**:
- Correct HTML structure (20%)
- Semantic elements used properly (20%)
- Form implemented correctly (20%)
- Accessibility (alt text, labels) (15%)
- Code organization and indentation (15%)
- Creativity and completeness (10%)

---

## Common Mistakes & Troubleshooting

**Mistake 1**: Forgetting closing tags
```html
<!-- Wrong -->
<p>Text
<p>More text</p>

<!-- Right -->
<p>Text</p>
<p>More text</p>
```

**Mistake 2**: Missing `alt` attribute on images
```html
<!-- Wrong -->
<img src="photo.jpg">

<!-- Right -->
<img src="photo.jpg" alt="Descriptive text">
```

**Mistake 3**: Not associating labels with inputs
```html
<!-- Wrong -->
<label>Name</label>
<input type="text">

<!-- Right -->
<label for="name">Name</label>
<input type="text" id="name">
```

---

## Summary

- HTML structures web content using **elements** and **attributes**
- Use **semantic HTML5** elements for better accessibility and SEO
- Always include proper **document structure** (DOCTYPE, html, head, body)
- **Forms** collect user input with various input types
- **Images** need `alt` text for accessibility
- **Links** connect pages and resources

---

## Next Steps

1. ✅ Practice building HTML pages
2. → Proceed to [CSS Fundamentals](./02_css_fundamentals.md)
3. → Validate your HTML with [W3C Validator](https://validator.w3.org/)

---

## Additional Resources

- [MDN HTML Basics](https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/HTML_basics)
- [HTML Reference](https://htmlreference.io/)
- [W3C HTML Validator](https://validator.w3.org/)
- [HTML Deep Dive](/docs/frontend/07_html.md)

---

**HTML is the foundation. Master it well! 📝**
