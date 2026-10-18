import { WebDevQuestion } from "@/types/web-dev";

export const BROWSER_CSS_QUESTIONS: WebDevQuestion[] = [
  {
    id: "BR01",
    slug: "build-responsive-dashboard-grid-flexbox",
    title: "Build a Responsive Dashboard Layout with Modern CSS Grid and Flexbox",
    summary:
      "Construct a responsive web app layout with collapsible sidebar, sticky header, and auto-fitting widget cards using CSS Grid and Flexbox without horizontal overflow.",
    topic: "browser-css",
    mode: "build",
    difficulty: "foundation",
    estimatedMinutes: 25,
    tags: ["CSS", "HTML", "CSS Grid", "Flexbox", "Responsive Design", "Layout"],
    skillsTested: [
      "CSS Grid Template Areas & Fractional Units (fr)",
      "Flexbox Alignment & Shrink Boundaries",
      "Preventing Horizontal Overflow with minmax(0, 1fr)",
      "Media Query Breakpoint Architecture",
    ],
    scenario:
      "Implement a clean, responsive application shell for an administrative dashboard. The shell requires a sticky top navigation bar (64px height), a persistent sidebar (240px wide on desktop, collapses beneath 768px), and a main content area populated with dynamic metric cards. Cards must automatically wrap from 4 columns on large monitors down to 2 columns on tablets and 1 column on mobile without rigid fixed-pixel widths causing horizontal overflow.",
    requirements: [
      "Use semantic HTML5 elements (`<header>`, `<aside>`, `<main>`, `<section>`).",
      "Implement the main cards grid using `grid-template-columns: repeat(auto-fit, minmax(260px, 1fr))`.",
      "Use `minmax(0, 1fr)` or `min-width: 0` to prevent long unbroken strings or code blocks from expanding grid tracks beyond 100vw.",
      "Make the header `position: sticky; top: 0` with a solid or translucent background preventing bleed-through.",
      "Ensure full mobile responsiveness without any horizontal scrollbars.",
    ],
    starterCode: `<!-- Problematic Layout: Hardcoded pixel widths cause mobile overflow -->
<div class="app-layout">
  <aside class="sidebar">Sidebar Navigation</aside>
  <div class="content-wrapper">
    <header class="header">Dashboard Header</header>
    <main class="main-content">
      <div class="card-grid">
        <div class="card">Metric 1</div>
        <div class="card">Metric 2</div>
        <div class="card">Metric 3</div>
        <div class="card">Metric 4</div>
      </div>
    </main>
  </div>
</div>`,
    programmingLanguage: "html",
    hints: [
      "In CSS Grid, the default minimum size of a grid item is `auto` (not `0`). If content inside is wider than the column, the column stretches and causes horizontal scroll! Use `minmax(0, 1fr)` instead of `1fr`.",
      "Use CSS Grid for the 2D layout (header + sidebar + main) or combined with Flexbox for 1D alignments within cards.",
      "`repeat(auto-fit, minmax(260px, 1fr))` allows cards to expand equally while wrapping naturally without requiring dozens of media queries.",
    ],
    evaluationRubric: [
      {
        criteria: "Zero Horizontal Overflow",
        weight: "40%",
        description: "Layout adapts seamlessly across 320px mobile to 1920px desktop with no horizontal scroll.",
      },
      {
        criteria: "Modern CSS Grid & Flexbox Proficiency",
        weight: "35%",
        description: "Uses auto-fit/auto-fill, minmax, and flexbox alignment idioms effectively.",
      },
      {
        criteria: "Semantic HTML Structure",
        weight: "25%",
        description: "Correctly applies header, aside, and main landmark tags.",
      },
    ],
    referenceAnswer:
      "```html\n<div class=\"app-container\">\n  <header class=\"app-header\">\n    <h1>Analytics Dashboard</h1>\n  </header>\n\n  <div class=\"app-body\">\n    <aside class=\"app-sidebar\">\n      <nav aria-label=\"Main navigation\">\n        <ul>\n          <li><a href=\"#overview\">Overview</a></li>\n          <li><a href=\"#reports\">Reports</a></li>\n          <li><a href=\"#settings\">Settings</a></li>\n        </ul>\n      </nav>\n    </aside>\n\n    <main class=\"app-main\">\n      <div class=\"metrics-grid\">\n        <div class=\"metric-card\"><h3>Revenue</h3><p>$84,200</p></div>\n        <div class=\"metric-card\"><h3>Active Users</h3><p>12,450</p></div>\n        <div class=\"metric-card\"><h3>Conversion</h3><p>3.8%</p></div>\n        <div class=\"metric-card\"><h3>Churn</h3><p>0.4%</p></div>\n      </div>\n    </main>\n  </div>\n</div>\n\n<style>\n  * { box-sizing: border-box; margin: 0; padding: 0; }\n\n  .app-container {\n    min-height: 100vh;\n    display: flex;\n    flex-direction: column;\n    background: #090d16;\n    color: #f1f5f9;\n  }\n\n  .app-header {\n    height: 64px;\n    position: sticky;\n    top: 0;\n    z-index: 20;\n    background: #0f172a;\n    border-bottom: 1px solid #1e293b;\n    display: flex;\n    align-items: center;\n    padding: 0 1.5rem;\n  }\n\n  .app-body {\n    flex: 1;\n    display: grid;\n    grid-template-columns: 240px minmax(0, 1fr);\n  }\n\n  .app-sidebar {\n    background: #0f172a;\n    border-right: 1px solid #1e293b;\n    padding: 1.5rem;\n  }\n\n  .app-main {\n    padding: 1.5rem;\n    min-width: 0; /* Prevents nested content overflow */\n  }\n\n  .metrics-grid {\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));\n    gap: 1.25rem;\n  }\n\n  .metric-card {\n    background: #131d33;\n    border: 1px solid #1e293b;\n    border-radius: 12px;\n    padding: 1.25rem;\n  }\n\n  /* Responsive breakpoint for mobile */\n  @media (max-width: 768px) {\n    .app-body {\n      grid-template-columns: 1fr;\n    }\n    .app-sidebar {\n      border-right: none;\n      border-bottom: 1px solid #1e293b;\n    }\n  }\n</style>\n```",
    commonMistakes: [
      "Using `width: 100vw`, which includes the operating system vertical scrollbar width, causing 15px of horizontal overflow.",
      "Forgetting `min-width: 0` on flex/grid children, causing long strings (e.g. JSON strings) to blow out column widths.",
    ],
    followUpQuestion:
      "What is the difference between `auto-fit` and `auto-fill` in CSS Grid?",
    followUpAnswer:
      "`auto-fill` creates empty virtual column tracks if space is available (leaving blank empty slots on the right), whereas `auto-fit` collapses empty tracks to 0px, expanding the existing cards to stretch across the full available row width.",
    references: [
      {
        title: "MDN: Auto-placement in CSS Grid (auto-fit vs auto-fill)",
        url: "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Auto-placement_in_grid_layout",
      },
      {
        title: "CSS-Tricks: A Complete Guide to CSS Grid",
        url: "https://css-tricks.com/snippets/css/complete-guide-grid/",
      },
    ],
  },
  {
    id: "BR02",
    slug: "build-accessible-signup-form-aria",
    title: "Build an Accessible Signup Form with Native & ARIA Validation",
    summary:
      "Construct a WCAG AA-compliant registration form featuring explicit label associations, aria-describedby error messaging, and keyboard focus states.",
    topic: "browser-css",
    mode: "build",
    difficulty: "applied",
    estimatedMinutes: 25,
    tags: ["HTML", "Accessibility", "WAI-ARIA", "Forms", "CSS"],
    skillsTested: [
      "Accessible Form Controls (`<label for>` association)",
      "Screen Reader Error Announcing (`aria-invalid`, `aria-describedby`)",
      "Native HTML5 Input Types (`email`, `password`, `autocomplete`)",
      "High-Contrast Visible Focus Rings",
    ],
    scenario:
      "Build a user signup form adhering to WCAG 2.1 AA accessibility guidelines. The form includes fields for Full Name, Email, and Password. When client-side validation errors occur (e.g., invalid email), screen reader users must hear the error immediately without loss of focus, and error text must be programmatically linked to the input field.",
    requirements: [
      "Every `<input>` must have an explicit programmatic association with a `<label>` using matching `id` and `for` attributes.",
      "Link validation error messages to the corresponding field using `aria-describedby='field-error-id'`.",
      "Apply `aria-invalid='true'` when a field has failed validation.",
      "Provide appropriate `autocomplete` attributes (`name`, `email`, `new-password`) to assist assistive autofill.",
      "Ensure `:focus-visible` styles have at least a 3:1 contrast ratio against the background.",
    ],
    starterCode: `<!-- Problematic Form: Missing explicit labels and ARIA error bindings -->
<form class="signup-form">
  <div>
    <span>Email Address</span>
    <input type="text" placeholder="Enter email" />
    <span class="error">Please enter a valid email</span>
  </div>
  <button type="submit">Sign Up</button>
</form>`,
    programmingLanguage: "html",
    hints: [
      "Using `<span>` or placeholder text as a label fails accessibility testing because screen readers cannot deterministically identify the control's name.",
      "`aria-describedby` points to the `id` of an element that describes or provides error context for the input.",
      "Always set `novalidate` on `<form>` if implementing custom JavaScript validation, to suppress native browser tooltip clashes.",
    ],
    evaluationRubric: [
      {
        criteria: "Form Label & Input Association",
        weight: "35%",
        description: "Uses explicit `<label for='id'>` pairs for all interactive input fields.",
      },
      {
        criteria: "ARIA Error Announcement",
        weight: "35%",
        description: "Properly synchronizes `aria-invalid` and `aria-describedby` with error containers.",
      },
      {
        criteria: "Autofill & Focus Usability",
        weight: "30%",
        description: "Provides `autocomplete` values and prominent `:focus-visible` rings.",
      },
    ],
    referenceAnswer:
      "```html\n<form id=\"signup-form\" class=\"form-container\" novalidate>\n  <h2>Create an Account</h2>\n\n  <!-- Full Name Field -->\n  <div class=\"form-group\">\n    <label for=\"full-name\">Full Name</label>\n    <input\n      type=\"text\"\n      id=\"full-name\"\n      name=\"name\"\n      autocomplete=\"name\"\n      required\n      aria-required=\"true\"\n    />\n  </div>\n\n  <!-- Email Field (With Error State) -->\n  <div class=\"form-group\">\n    <label for=\"email-input\">Work Email</label>\n    <input\n      type=\"email\"\n      id=\"email-input\"\n      name=\"email\"\n      autocomplete=\"email\"\n      required\n      aria-required=\"true\"\n      aria-invalid=\"true\"\n      aria-describedby=\"email-error email-hint\"\n    />\n    <span id=\"email-hint\" class=\"hint-text\">We will send your verification code here.</span>\n    <span id=\"email-error\" class=\"error-text\" role=\"alert\">\n      Please enter a valid email address (e.g. name@domain.com).\n    </span>\n  </div>\n\n  <!-- Password Field -->\n  <div class=\"form-group\">\n    <label for=\"password-input\">Password</label>\n    <input\n      type=\"password\"\n      id=\"password-input\"\n      name=\"password\"\n      autocomplete=\"new-password\"\n      required\n      aria-required=\"true\"\n      aria-describedby=\"password-hint\"\n    />\n    <span id=\"password-hint\" class=\"hint-text\">Minimum 8 characters with at least one number.</span>\n  </div>\n\n  <button type=\"submit\" class=\"submit-btn\">Create Account</button>\n</form>\n\n<style>\n  .form-group {\n    display: flex;\n    flex-direction: column;\n    gap: 0.35rem;\n    margin-bottom: 1.25rem;\n  }\n  label {\n    font-size: 0.875rem;\n    font-weight: 600;\n    color: #f8fafc;\n  }\n  input {\n    padding: 0.625rem 0.875rem;\n    border-radius: 8px;\n    border: 1px solid #334155;\n    background: #0f172a;\n    color: #f1f5f9;\n  }\n  input:focus-visible {\n    outline: 2px solid #f97316;\n    outline-offset: 2px;\n  }\n  input[aria-invalid=\"true\"] {\n    border-color: #f43f5e;\n  }\n  .hint-text { font-size: 0.75rem; color: #94a3b8; }\n  .error-text { font-size: 0.75rem; color: #fb7185; font-weight: 500; }\n</style>\n```",
    commonMistakes: [
      "Relying on `placeholder` instead of `<label>` (placeholders vanish once typing starts and fail low-vision contrast checks).",
      "Using `outline: none` without providing an alternative focus ring, completely blinding keyboard users.",
    ],
    followUpQuestion:
      "Why is `role='alert'` or `aria-live='assertive'` used on error messages?",
    followUpAnswer:
      "`role='alert'` creates an accessible live region that instructs the screen reader engine to immediately announce the error message to the user, even if the user does not have focus directly placed on the error span.",
    references: [
      {
        title: "W3C WAI: Form Accessibility Tutorials",
        url: "https://www.w3.org/WAI/tutorials/forms/",
      },
      {
        title: "MDN: ARIA aria-describedby",
        url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-describedby",
      },
    ],
  },
  {
    id: "BR03",
    slug: "diagnose-cors-preflight-options-failure",
    title: "Diagnose CORS Preflight (OPTIONS 403/405) Failure Across Origins",
    summary:
      "Investigate Cross-Origin Resource Sharing (CORS) preflight triggers, why browsers issue HTTP OPTIONS requests, and why fixing frontend JS alone cannot resolve it.",
    topic: "browser-css",
    mode: "debug",
    difficulty: "applied",
    estimatedMinutes: 20,
    tags: ["Browser", "Security", "CORS", "HTTP Headers", "Preflight"],
    skillsTested: [
      "Same-Origin Policy (SOP) Enforcement",
      "CORS Preflight Trigger Conditions",
      "Access-Control-Allow-* Header Negotiation",
      "Server-side CORS Middleware Configuration",
    ],
    scenario:
      "A frontend SPA deployed on `https://app.example.com` makes an authenticated `POST` request with `Content-Type: application/json` and an `Authorization: Bearer <token>` header to `https://api.example.com/v1/orders`. The browser console displays: `Access to fetch at 'https://api.example.com/v1/orders' from origin 'https://app.example.com' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: It does not have HTTP ok status (Status 405)`. Explain why changing frontend code alone cannot fix this and implement the correct backend fix.",
    requirements: [
      "Explain the browser's Same-Origin Policy (SOP) and what triggers an automatic preflight `OPTIONS` request.",
      "Explain why custom headers (`Authorization`) and `application/json` disqualify a request from being a 'Simple Request'.",
      "Explain why the server returned 405 Method Not Allowed on the `OPTIONS` request.",
      "Provide the necessary HTTP response headers the backend server must respond with for preflight calls.",
    ],
    starterCode: `// Frontend code on https://app.example.com
fetch("https://api.example.com/v1/orders", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer eyJhbGciOi...",
  },
  body: JSON.stringify({ item: "Widget", quantity: 2 }),
});
// Console Error: Preflight request failed with status 405!`,
    programmingLanguage: "javascript",
    hints: [
      "CORS is a browser security mechanism, not a frontend coding bug. The browser sends an `OPTIONS` request before the actual `POST` to ask the server: 'Is this origin permitted to send these headers?'",
      "If the backend server routing table only defines `router.post('/v1/orders')` without handling `OPTIONS`, the HTTP server returns 405 Method Not Allowed.",
      "The server must respond to `OPTIONS` with status 204 or 200, alongside `Access-Control-Allow-Origin` and `Access-Control-Allow-Headers`.",
    ],
    evaluationRubric: [
      {
        criteria: "SOP & Preflight Mechanics",
        weight: "40%",
        description: "Accurately identifies why Content-Type: application/json and Authorization trigger preflight.",
      },
      {
        criteria: "Root Cause of 405/403",
        weight: "30%",
        description: "Explains that the backend web framework rejected the unhandled OPTIONS method.",
      },
      {
        criteria: "Server-side Resolution",
        weight: "30%",
        description: "Provides the necessary HTTP headers and 204 response for the preflight handler.",
      },
    ],
    referenceAnswer:
      "### Why CORS Preflight Occurs:\nThe browser's **Same-Origin Policy** prohibits a web page on one origin (`https://app.example.com`) from reading responses from a different origin (`https://api.example.com`).\n\nRequests that have custom headers (`Authorization`) or content types other than `text/plain`, `multipart/form-data`, or `application/x-www-form-urlencoded` are **not simple requests**. The browser automatically dispatches an **HTTP `OPTIONS`** preflight request to verify permissions before sending the actual `POST` payload.\n\n### Why 405 Method Not Allowed Occurred:\nThe backend API router had a route for `POST /v1/orders`, but no handler for `OPTIONS /v1/orders`. When the browser sent `OPTIONS`, the web server responded with `405 Method Not Allowed`. Because the preflight did not return HTTP 2xx, the browser aborted the operation before the `POST` was ever dispatched!\n\n### The Correct Backend Fix (Node.js / Express Example):\n```javascript\n// Configure CORS headers on the server\napp.use((req, res, next) => {\n  const allowedOrigins = ['https://app.example.com'];\n  const origin = req.headers.origin;\n\n  if (allowedOrigins.includes(origin)) {\n    res.setHeader('Access-Control-Allow-Origin', origin);\n  }\n\n  res.setHeader(\n    'Access-Control-Allow-Methods',\n    'GET, POST, PUT, DELETE, OPTIONS'\n  );\n  res.setHeader(\n    'Access-Control-Allow-Headers',\n    'Content-Type, Authorization'\n  );\n  res.setHeader('Access-Control-Max-Age', '86400'); // Cache preflight for 24 hours\n\n  // Handle preflight immediately\n  if (req.method === 'OPTIONS') {\n    return res.status(204).end();\n  }\n\n  next();\n});\n```\n\n### Why frontend cannot fix this:\nCORS is enforced by the client browser to protect users from malicious cross-origin forgery. No frontend flag (like `mode: 'no-cors'`) will allow reading JSON data with custom headers across origins.",
    commonMistakes: [
      "Adding `mode: 'no-cors'` in the frontend fetch: This converts the request into an opaque request, which strips custom headers like `Authorization` and prevents reading the JSON response.",
      "Setting `Access-Control-Allow-Origin: *` while passing credentials/cookies (credentials require an explicit origin, not wildcard).",
    ],
    followUpQuestion:
      "What is the purpose of the `Access-Control-Max-Age` header in the preflight response?",
    followUpAnswer:
      "`Access-Control-Max-Age` tells the browser how many seconds it can cache the preflight verification. Caching it (e.g. for 86400 seconds) prevents the browser from sending a redundant `OPTIONS` request before every single subsequent API call, cutting network latency in half.",
    references: [
      {
        title: "MDN: Cross-Origin Resource Sharing (CORS)",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS",
      },
      {
        title: "web.dev: Understanding CORS",
        url: "https://web.dev/articles/cross-origin-resource-sharing",
      },
    ],
  },
  {
    id: "BR04",
    slug: "build-accessible-combobox-listbox",
    title: "Build an Accessible Custom Listbox with WAI-ARIA Keyboard Traversal",
    summary:
      "Implement a fully accessible custom select/listbox component adhering to WAI-ARIA 1.2 specifications with virtual keyboard navigation.",
    topic: "browser-css",
    mode: "build",
    difficulty: "challenge",
    estimatedMinutes: 35,
    tags: ["HTML", "Accessibility", "WAI-ARIA", "Listbox", "Keyboard Navigation", "JavaScript"],
    skillsTested: [
      "WAI-ARIA 1.2 Listbox Specification",
      "Keyboard Interaction (ArrowUp/Down, Home, End, Enter, Space)",
      "Focus Management with `aria-activedescendant`",
      "Scroll Into View Synchronization",
    ],
    scenario:
      "Design and implement a custom replacement for a single-select `<select>` dropdown adhering to the WAI-ARIA Listbox Pattern. The listbox must support opening via Space/Enter/DownArrow, cycling through options with ArrowUp and ArrowDown, jumping to the first/last option via Home/End, committing selections with Space/Enter, and closing on Escape or click outside while keeping focus accessible.",
    requirements: [
      "Structure markup using a toggle button (`aria-haspopup='listbox'`, `aria-expanded`) and a dropdown container (`role='listbox'`).",
      "Render each option with `role='option'`, a unique `id`, and dynamic `aria-selected` state.",
      "Support full keyboard navigation: `ArrowDown`, `ArrowUp`, `Home`, `End`, `Enter`, `Space`, `Escape`, `Tab`.",
      "Maintain active focus via `aria-activedescendant` on the triggering button or input.",
      "Scroll highlighted items into visible view automatically via `Element.scrollIntoView({ block: 'nearest' })`.",
    ],
    starterCode: `// Vanilla JS / TS Custom Listbox Component
export class AccessibleSelect {
  constructor(container, options, onSelect) {
    this.container = container;
    this.options = options; // Array of { value: string, label: string }
    this.onSelect = onSelect;
    this.isOpen = false;
    this.selectedIndex = 0;
    this.activeIndex = -1;
    this.init();
  }

  // TODO: Build accessible DOM structure and attach keyboard/click listeners
}`,
    programmingLanguage: "typescript",
    hints: [
      "Using `aria-activedescendant` allows the `<button>` to keep DOM focus while visually highlighting the active item, which prevents losing focus when navigating on mobile screen readers.",
      "When the user presses `Home`, set `activeIndex = 0`. When pressing `End`, set `activeIndex = options.length - 1`.",
      "Always close the listbox and restore focus to the button when the user presses `Escape` or `Tab`.",
    ],
    evaluationRubric: [
      {
        criteria: "Complete Keyboard Interaction",
        weight: "40%",
        description: "Supports ArrowUp, ArrowDown, Home, End, Enter, Space, Escape, and Tab without focus entrapment.",
      },
      {
        criteria: "ARIA Semantics & Virtual Focus",
        weight: "35%",
        description: "Uses role='listbox', role='option', aria-selected, and aria-activedescendant accurately.",
      },
      {
        criteria: "DOM & Scroll Synchronization",
        weight: "25%",
        description: "Scrolls long lists into view and closes cleanly on click outside.",
      },
    ],
    referenceAnswer:
      "```typescript\ninterface OptionItem {\n  value: string;\n  label: string;\n}\n\nexport class AccessibleSelect {\n  private container: HTMLElement;\n  private options: OptionItem[];\n  private onSelect: (val: string) => void;\n  private button!: HTMLButtonElement;\n  private listbox!: HTMLUListElement;\n  private isOpen = false;\n  private selectedIndex = 0;\n  private activeIndex = -1;\n\n  constructor(container: HTMLElement, options: OptionItem[], onSelect: (val: string) => void) {\n    this.container = container;\n    this.options = options;\n    this.onSelect = onSelect;\n    this.render();\n  }\n\n  private render() {\n    this.container.innerHTML = '';\n    const idPrefix = 'custom-select-' + Math.random().toString(36).substring(2, 7);\n\n    // Button Trigger\n    this.button = document.createElement('button');\n    this.button.type = 'button';\n    this.button.setAttribute('aria-haspopup', 'listbox');\n    this.button.setAttribute('aria-expanded', 'false');\n    this.button.textContent = this.options[this.selectedIndex]?.label || 'Select...';\n    this.button.className = 'select-button';\n\n    // Listbox Container\n    this.listbox = document.createElement('ul');\n    this.listbox.setAttribute('role', 'listbox');\n    this.listbox.className = 'select-listbox hidden';\n    this.listbox.tabIndex = -1;\n\n    this.options.forEach((opt, idx) => {\n      const li = document.createElement('li');\n      li.id = `${idPrefix}-opt-${idx}`;\n      li.setAttribute('role', 'option');\n      li.setAttribute('aria-selected', idx === this.selectedIndex ? 'true' : 'false');\n      li.textContent = opt.label;\n      li.className = 'select-option';\n      li.addEventListener('click', () => this.commitSelection(idx));\n      this.listbox.appendChild(li);\n    });\n\n    this.button.addEventListener('click', () => this.toggle());\n    this.button.addEventListener('keydown', (e) => this.handleKeyDown(e));\n    document.addEventListener('click', (e) => {\n      if (!this.container.contains(e.target as Node)) this.close();\n    });\n\n    this.container.appendChild(this.button);\n    this.container.appendChild(this.listbox);\n  }\n\n  private handleKeyDown(e: KeyboardEvent) {\n    if (!this.isOpen) {\n      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {\n        e.preventDefault();\n        this.open();\n        this.setActive(this.selectedIndex >= 0 ? this.selectedIndex : 0);\n      }\n      return;\n    }\n\n    switch (e.key) {\n      case 'ArrowDown':\n        e.preventDefault();\n        this.setActive(Math.min(this.activeIndex + 1, this.options.length - 1));\n        break;\n      case 'ArrowUp':\n        e.preventDefault();\n        this.setActive(Math.max(this.activeIndex - 1, 0));\n        break;\n      case 'Home':\n        e.preventDefault();\n        this.setActive(0);\n        break;\n      case 'End':\n        e.preventDefault();\n        this.setActive(this.options.length - 1);\n        break;\n      case 'Enter':\n      case ' ':\n        e.preventDefault();\n        if (this.activeIndex >= 0) this.commitSelection(this.activeIndex);\n        break;\n      case 'Escape':\n      case 'Tab':\n        this.close();\n        break;\n    }\n  }\n\n  private setActive(index: number) {\n    this.activeIndex = index;\n    const items = this.listbox.querySelectorAll('li');\n    items.forEach((item, idx) => {\n      item.classList.toggle('active', idx === index);\n    });\n    if (items[index]) {\n      this.button.setAttribute('aria-activedescendant', items[index].id);\n      items[index].scrollIntoView({ block: 'nearest' });\n    }\n  }\n\n  private commitSelection(index: number) {\n    this.selectedIndex = index;\n    this.button.textContent = this.options[index].label;\n    const items = this.listbox.querySelectorAll('li');\n    items.forEach((item, idx) => {\n      item.setAttribute('aria-selected', idx === index ? 'true' : 'false');\n    });\n    this.onSelect(this.options[index].value);\n    this.close();\n    this.button.focus();\n  }\n\n  private open() {\n    this.isOpen = true;\n    this.listbox.classList.remove('hidden');\n    this.button.setAttribute('aria-expanded', 'true');\n  }\n\n  private close() {\n    this.isOpen = false;\n    this.listbox.classList.add('hidden');\n    this.button.setAttribute('aria-expanded', 'false');\n    this.button.removeAttribute('aria-activedescendant');\n  }\n}\n```",
    commonMistakes: [
      "Moving physical DOM focus to `<li>` elements, which causes screen readers to announce options out of context and breaks browser form submission.",
      "Forgetting `Home` and `End` keys, which are mandatory in the W3C listbox specification.",
    ],
    followUpQuestion:
      "When is it better to use a native HTML `<select>` instead of a custom WAI-ARIA listbox?",
    followUpAnswer:
      "Always prefer native `<select>` unless custom branding (like icons, avatar tags, or multi-column option layouts) is strictly required. Native `<select>` provides automatic accessibility, native mobile wheel controls, and zero custom JavaScript maintenance.",
    references: [
      {
        title: "W3C WAI-ARIA Listbox Pattern",
        url: "https://www.w3.org/WAI/ARIA/apg/patterns/listbox/",
      },
      {
        title: "MDN: ARIA listbox role",
        url: "https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/listbox_role",
      },
    ],
  },
  {
    id: "BR05",
    slug: "diagnose-css-specificity-cascade-conflict",
    title: "Diagnose CSS Cascade Conflict and Selector Specificity Overrides",
    summary:
      "Calculate CSS specificity weight (ID, Class, Element) to resolve selector conflicts without resorting to destructive !important overrides.",
    topic: "browser-css",
    mode: "debug",
    difficulty: "foundation",
    estimatedMinutes: 15,
    tags: ["CSS", "Cascade", "Specificity", "Selectors", "Clean Code"],
    skillsTested: [
      "CSS Specificity Calculation (A, B, C Tuple)",
      "Cascade Order of Appearance",
      "CSS @layer (Cascade Layers) Modern Architecture",
      "Refactoring Malicious `!important` Usage",
    ],
    scenario:
      "In a design system, buttons are supposed to turn amber when the `.btn-warning` class is applied. However, on the checkout page, `.btn-warning` buttons stubbornly remain blue. An engineer proposed adding `background-color: #f59e0b !important;`, but this breaks theme customization. Calculate the specificity of conflicting rules, diagnose why the warning style is suppressed, and refactor the CSS cleanly.",
    requirements: [
      "Calculate the exact Specificity tuple `(Inline, ID, Class/Attribute/Pseudo-class, Element/Pseudo-element)` for both selectors.",
      "Explain the role of stylesheet source order when specificity is identical.",
      "Explain why adding `!important` creates specificity wars and maintenance debt.",
      "Provide a clean architectural solution using balanced class specificity or modern CSS `@layer`.",
    ],
    starterCode: `/* Global Component Library */
.btn-warning {
  background-color: #f59e0b;
  color: #ffffff;
}

/* Page-level styles in checkout.css */
#checkout-form .btn {
  background-color: #2563eb; /* Blue button */
  color: #ffffff;
}

<!-- HTML Markup -->
<form id="checkout-form">
  <button class="btn btn-warning">Proceed to Payment</button>
</form>`,
    programmingLanguage: "css",
    hints: [
      "Calculate specificity: An ID selector `#checkout-form` counts as 1 in the second column: `(0, 1, 1, 0)`. A single class `.btn-warning` counts as `(0, 0, 1, 0)`.",
      "No matter how many classes you add (`.btn.btn.btn`), a selector with an ID selector (`1, 0, 0`) will always beat a selector without an ID in standard specificity math.",
      "Avoid qualifying selectors with IDs. If you use CSS `@layer`, layer priority overrides normal specificity between layers.",
    ],
    evaluationRubric: [
      {
        criteria: "Accurate Specificity Calculation",
        weight: "40%",
        description: "Correctly evaluates `(0, 1, 1, 0)` vs `(0, 0, 1, 0)`.",
      },
      {
        criteria: "Clean Architectural Solution",
        weight: "40%",
        description: "Removes unnecessary ID qualifiers or introduces CSS Cascade Layers (`@layer`).",
      },
      {
        criteria: "!important Caveats",
        weight: "20%",
        description: "Explains how `!important` pollutes the cascade and prevents user/theme overrides.",
      },
    ],
    referenceAnswer:
      "### Specificity Breakdown:\n1. `#checkout-form .btn`:\n   - IDs: 1 (`#checkout-form`)\n   - Classes/Attributes: 1 (`.btn`)\n   - Elements: 0\n   - **Specificity**: `(0, 1, 1, 0)` -> Weight **110**\n\n2. `.btn-warning`:\n   - IDs: 0\n   - Classes/Attributes: 1 (`.btn-warning`)\n   - Elements: 0\n   - **Specificity**: `(0, 0, 1, 0)` -> Weight **10**\n\nBecause `(0, 1, 1, 0)` heavily outweighs `(0, 0, 1, 0)`, the blue background wins, regardless of the order they appear in stylesheets.\n\n### Why `!important` is an anti-pattern:\n`!important` moves styles out of the normal cascade into the high-priority important origin. The only way to override an `!important` is with another `!important` with higher specificity, creating a toxic codebase escalation.\n\n### The Clean Solutions:\n\n1. **Eliminate ID Qualifiers from Component Styles (Best Practice)**:\nComponent styles should never depend on ancestor IDs:\n```css\n/* Base component */\n.btn {\n  background-color: #2563eb;\n  color: #ffffff;\n}\n\n/* Variant modifier placed after base class */\n.btn-warning {\n  background-color: #f59e0b;\n}\n```\nWith equal specificity `(0, 0, 1, 0)`, source order determines the winner.\n\n2. **Modern CSS Cascade Layers (`@layer`)**:\n```css\n@layer base, components, utilities;\n\n@layer components {\n  .btn { background-color: #2563eb; }\n}\n\n@layer utilities {\n  .btn-warning { background-color: #f59e0b; }\n}\n```\nStyles in `@layer utilities` automatically override `@layer components`, regardless of internal specificity!",
    commonMistakes: [
      "Assuming ten class selectors can beat one ID selector (in CSS specificity, an ID cannot be overcome by any number of classes).",
      "Believing source order matters when selector specificities are different (source order is only the tie-breaker for identical specificities).",
    ],
    followUpQuestion:
      "How does the CSS `:is()` pseudo-class affect selector specificity compared to `:where()`?",
    followUpAnswer:
      "`:is(selector)` takes the specificity of its most specific argument, whereas `:where(selector)` always has **zero specificity** `(0, 0, 0, 0)`. `:where()` is perfect for design systems to provide default styling that can be easily overridden by consumers.",
    references: [
      {
        title: "MDN: Specificity",
        url: "https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity",
      },
      {
        title: "MDN: Cascade Layers (@layer)",
        url: "https://developer.mozilla.org/en-US/docs/Web/CSS/@layer",
      },
    ],
  },
];
