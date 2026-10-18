import { WebDevQuestion } from "@/types/web-dev";

export const PERFORMANCE_TESTING_QUESTIONS: WebDevQuestion[] = [
  {
    id: "PT01",
    slug: "investigate-poor-largest-contentful-paint-lcp",
    title: "Investigate and Fix Poor Largest Contentful Paint (LCP) Sub-Part Bottlenecks",
    summary:
      "Deconstruct Largest Contentful Paint into its 4 sub-parts (TTFB, Load Delay, Load Duration, Render Delay) to diagnose web performance regressions.",
    topic: "performance-testing",
    mode: "debug",
    difficulty: "challenge",
    estimatedMinutes: 30,
    tags: ["Performance", "Core Web Vitals", "LCP", "DevTools", "Optimization", "Browser"],
    skillsTested: [
      "Core Web Vitals LCP Sub-Part Breakdown",
      "Chrome DevTools Performance Profiling",
      "Fetch Priority (`fetchpriority='high'`) & Preloading",
      "Eliminating Render-Blocking CSS and JavaScript",
    ],
    scenario:
      "A media publishing platform suffers from a failing Largest Contentful Paint (LCP) of 4.8 seconds on mobile (well above Google's 2.5s 'Good' threshold). The LCP element is identified as the hero banner image `<img class='hero-banner'>`. Using Chrome DevTools Performance panel data, break down the 4 phases of LCP, isolate which sub-parts are causing the 4.8s delay, and implement four targeted optimizations.",
    requirements: [
      "Break down the 4 sub-parts of LCP: Time to First Byte (TTFB), Resource Load Delay, Resource Load Duration, and Element Render Delay.",
      "Diagnose why hiding hero images behind client-side JavaScript (`fetch('/api/hero').then(...)`) causes massive Resource Load Delay.",
      "Implement critical resource preloading (`<link rel='preload' as='image'>`) and `fetchpriority='high'`.",
      "Address render-blocking stylesheets and late-loading web fonts that hold back the Element Render Duration.",
    ],
    starterCode: `<!-- Problematic Implementation causing LCP of 4.8s -->
<head>
  <!-- 1. Render-blocking synchronous script in <head> -->
  <script src="/scripts/analytics-heavy.js"></script>
  <!-- 2. Massive non-critical stylesheet -->
  <link rel="stylesheet" href="/styles/everything.css" />
</head>
<body>
  <!-- 3. Hero image is rendered dynamically via JavaScript! -->
  <div id="hero-container"></div>
  <script>
    fetch('/api/featured-hero')
      .then(res => res.json())
      .then(data => {
        const img = document.createElement('img');
        img.src = data.imageUrl; // Hero image discovery delayed by 2.2 seconds!
        img.loading = 'lazy'; // Anti-pattern on LCP element!
        document.getElementById('hero-container').appendChild(img);
      });
  </script>
</body>`,
    programmingLanguage: "html",
    hints: [
      "The browser's Preload Scanner scans the raw HTML stream to start downloading images before the DOM is even constructed. Dynamically injecting the hero image via JS completely hides it from the Preload Scanner!",
      "Adding `loading='lazy'` to an above-the-fold LCP image tells the browser to delay fetching until layout geometry is calculated, adding 500–1000ms of delay.",
      "Use `fetchpriority='high'` to instruct the network stack to prioritize the hero image ahead of non-critical CSS or subsequent images.",
    ],
    evaluationRubric: [
      {
        criteria: "LCP 4 Sub-Part Breakdown",
        weight: "40%",
        description: "Accurately articulates TTFB, Resource Load Delay, Load Duration, and Render Delay.",
      },
      {
        criteria: "Root Cause Diagnostics",
        weight: "35%",
        description: "Identifies JS-delayed discovery, lazy loading anti-pattern, and render-blocking scripts.",
      },
      {
        criteria: "Targeted Solutions",
        weight: "25%",
        description: "Applies HTML preloading, fetchpriority='high', defer/async scripts, and responsive srcset.",
      },
    ],
    referenceAnswer:
      "### 1. The 4 Sub-Parts of LCP (Google Core Web Vitals):\nAny LCP measurement consists of four sequential phases:\n$$\\text{LCP} = \\text{TTFB} + \\text{Resource Load Delay} + \\text{Resource Load Duration} + \\text{Element Render Delay}$$\n\n1. **Time to First Byte (TTFB)**: Time until browser receives the first byte of HTML from the server.\n2. **Resource Load Delay**: Time between TTFB and when the browser starts requesting the LCP asset.\n3. **Resource Load Duration**: Time spent downloading the asset bytes over the network.\n4. **Element Render Delay**: Time between asset download completion and when the browser finishes painting it (blocked by fonts, JS, or CSS).\n\n### 2. Diagnosis of the Starter Code:\n- **Catastrophic Resource Load Delay (~2,400ms)**: The hero image is hidden inside a client-side `fetch()` call. The browser cannot discover the image URL until HTML parses, `analytics-heavy.js` executes, `fetch()` completes, and DOM node is appended.\n- **`loading='lazy'` on LCP Element**: Instructs the browser to defer the image until layout calculation completes, adding another 600ms.\n- **Render-Blocking CSS/JS in `<head>`**: Synchronous `<script src=\"...\">` stops HTML parsing dead in its tracks.\n\n### 3. The 4 Targeted Fixes (Sub-2s LCP):\n\n```html\n<head>\n  <!-- A. Preconnect to Image CDN Origin -->\n  <link rel=\"preconnect\" href=\"https://images.example.com\" />\n\n  <!-- B. Preload the LCP Image with High Priority -->\n  <link\n    rel=\"preload\"\n    as=\"image\"\n    href=\"/images/hero-1200.webp\"\n    fetchpriority=\"high\"\n    type=\"image/webp\"\n  />\n\n  <!-- C. Defer Non-Critical Scripts -->\n  <script src=\"/scripts/analytics-heavy.js\" defer></script>\n</head>\n<body>\n  <!-- D. Render Image Directly in Server HTML with fetchpriority='high' -->\n  <div id=\"hero-container\">\n    <img\n      src=\"/images/hero-1200.webp\"\n      srcset=\"/images/hero-600.webp 600w, /images/hero-1200.webp 1200w\"\n      sizes=\"(max-width: 768px) 100vw, 1200px\"\n      width=\"1200\"\n      height=\"600\"\n      fetchpriority=\"high\"\n      decoding=\"async\"\n      alt=\"Featured Story\"\n    />\n    <!-- NEVER use loading='lazy' on above-the-fold hero images! -->\n  </div>\n</body>\n```\n\n### Impact:\n- **Resource Load Delay drops to ~0ms**: The browser's Preload Scanner starts downloading image bytes in the first 50ms of page load.\n- **LCP drops from 4.8s to 1.4s** (Entering the green 'Good' threshold).",
    commonMistakes: [
      "Adding `loading='lazy'` to the main above-the-fold hero image.",
      "Optimizing image file compression alone while ignoring massive 2-second JavaScript discovery delays.",
    ],
    followUpQuestion:
      "How do Next.js `<Image />` or modern SSR frameworks automate this under the hood?",
    followUpAnswer:
      "When you add `priority={true}` to a Next.js `<Image priority />`, Next.js automatically injects a `<link rel='preload' as='image' fetchpriority='high'>` tag into the server-rendered `<head>`, serves responsive modern WebP/AVIF formats, and omits `loading='lazy'`.",
    references: [
      {
        title: "web.dev: Optimize Largest Contentful Paint (LCP Breakdown)",
        url: "https://web.dev/optimize-lcp/",
      },
      {
        title: "web.dev: Optimizing resource loading with the Fetch Priority API",
        url: "https://web.dev/fetch-priority/",
      },
    ],
  },
  {
    id: "PT02",
    slug: "testing-pyramid-signup-unit-integration-e2e",
    title: "Architecting a Testing Strategy for User Authentication: Unit, Integration & E2E",
    summary:
      "Design a pragmatic testing pyramid across Unit, Integration, and End-to-End levels to maximize test confidence while avoiding brittle test suites.",
    topic: "performance-testing",
    mode: "explain",
    difficulty: "applied",
    estimatedMinutes: 20,
    tags: ["Testing", "Vitest", "Playwright", "Testing Library", "CI/CD", "Quality"],
    skillsTested: [
      "Testing Pyramid Economics (Speed, Reliability, Cost)",
      "Testing Implementation Details vs User-Observable Behavior",
      "Mocking Boundaries (MSW, Database Transactions)",
      "Flaky Test Mitigation Strategies in E2E Suites",
    ],
    scenario:
      "A startup is implementing a high-stakes User Registration feature with complex password strength rules, email verification, and payment plan selection. The engineering team argues between two extremes: Developer A wants 100% test coverage purely with Unit tests mocking everything. Developer B wants zero unit tests and only browser E2E tests (Playwright). Architect a balanced testing strategy across Unit, Integration, and E2E layers.",
    requirements: [
      "Explain the Testing Pyramid: Compare speed, maintenance cost, and false confidence across Unit, Integration, and E2E tiers.",
      "Define exactly what should be tested at the Unit level (e.g. pure password validation logic, utility regex).",
      "Define what should be tested at the Integration level (e.g. React Testing Library form interaction, API route validation with test DB).",
      "Define the critical smoke paths reserved for End-to-End tests (e.g. happy-path user signup through real headless browser).",
      "Articulate the Testing Library philosophy: 'The more your tests resemble the way your software is used, the more confidence they can give you.'",
    ],
    starterCode: `// Architecture Strategy Proposal:
// Tier 1: Unit Tests (Vitest)
// Tier 2: Integration Tests (React Testing Library + MSW / Supertest)
// Tier 3: End-to-End Tests (Playwright)`,
    programmingLanguage: "typescript",
    hints: [
      "Unit tests are fast and cheap, but 100 passing unit tests with mocked APIs can still fail completely in production if the frontend and backend disagree on a JSON payload field.",
      "End-to-End tests test reality, but running 500 Playwright tests takes 45 minutes on CI, and transient network hiccups create flaky builds.",
      "Integration tests with Mock Service Worker (MSW) or real test databases hit the sweet spot of high confidence and fast execution.",
    ],
    evaluationRubric: [
      {
        criteria: "Testing Pyramid Distribution",
        weight: "40%",
        description: "Accurately partitions responsibilities across unit, integration, and E2E tiers.",
      },
      {
        criteria: "Avoidance of Implementation Details",
        weight: "35%",
        description: "Emphasizes testing user-observable behaviors (getByRole) rather than internal component state or private methods.",
      },
      {
        criteria: "Flakiness & CI Cost Control",
        weight: "25%",
        description: "Articulates strategies to prevent slow, brittle test suites in production pipelines.",
      },
    ],
    referenceAnswer:
      "### The Balanced Testing Strategy for Signup:\n\n```\n          /\\        E2E Tests (Playwright / Cypress)\n         /  \\       5–10% of suite: Critical happy-path user flows\n        /----\\      \n       /      \\     Integration Tests (Testing Library + Supertest / MSW)\n      /        \\    60–70% of suite: Component forms, API endpoints with DB\n     /----------\\   \n    /            \\  Unit Tests (Vitest / Jest)\n   /              \\ 20–30% of suite: Pure math, regex, password rules, utilities\n  /----------------\\\n```\n\n### 1. Unit Tests (Fast & Deterministic - ~1ms per test):\n- **Scope**: Isolated pure functions with complex branches.\n- **What to test**:\n  - `validatePasswordStrength(password)` (special character rules, length checks, entropy).\n  - Form input sanitization and email normalization utilities.\n- **Why avoid mocking everything**: If you unit test a React component by mocking 10 child hooks, you are testing your mocks, not your software.\n\n### 2. Integration Tests (The Sweet Spot - ~50ms per test):\n- **Scope**: Components interacting with user events, or backend routes interacting with a test database.\n- **Frontend (React Testing Library + Mock Service Worker)**:\n  - User types invalid email -> verifies screen reader error `getByRole('alert')` appears.\n  - User submits valid form -> verifies button disables, loading spinner displays, and success message renders.\n  - **Philosophy**: Test through accessible roles (`getByRole('button', { name: /sign up/i })`), never test internal component state `wrapper.state().loading`.\n- **Backend (Supertest + PostgreSQL Docker Test DB)**:\n  - `POST /api/auth/register` with duplicate email returns HTTP 409.\n  - Valid signup creates hashed password in database.\n\n### 3. End-to-End Tests (High Confidence, High Cost - ~3s per test):\n- **Scope**: Headless browser (Playwright) testing real production builds against staging environments.\n- **Reserved for Critical Business Paths**:\n  - User visits `/signup`, fills form, completes email verification link, and arrives at the onboarding dashboard.\n  - Cross-browser validation (Chromium, Firefox, WebKit).",
    commonMistakes: [
      "Testing implementation details (e.g. testing whether a specific private function was called or inspecting component state), which breaks tests during harmless refactoring.",
      "Writing 50 E2E tests for minor field validation errors that could be verified 100x faster in integration tests.",
    ],
    followUpQuestion:
      "Why is Mock Service Worker (MSW) superior to mocking `global.fetch` directly in integration tests?",
    followUpAnswer:
      "MSW intercepts requests at the network layer (Service Worker / node-request level) rather than monkey-patching `window.fetch`. Your application code executes its real HTTP fetching logic unchanged, and you can test actual HTTP status codes, headers, and parsing behavior.",
    references: [
      {
        title: "Martin Fowler: The Practical Test Pyramid",
        url: "https://martinfowler.com/articles/practical-test-pyramid.html",
      },
      {
        title: "Testing Library Guiding Principles",
        url: "https://testing-library.com/docs/guiding-principles/",
      },
    ],
  },
  {
    id: "PT03",
    slug: "diagnose-works-locally-fails-in-production",
    title: "Systematic Debugging: Feature Works Locally but Fails in Production",
    summary:
      "Apply a systematic diagnostic playbook to resolve environmental drift, build bundling discrepancies, CORS/proxy differences, and production data bugs.",
    topic: "performance-testing",
    mode: "debug",
    difficulty: "applied",
    estimatedMinutes: 20,
    tags: ["Debugging", "Production", "DevOps", "CI/CD", "Environment Variables", "Build"],
    skillsTested: [
      "Systematic Elimination Diagnostic Playbook",
      "Environmental Configuration & Secrets Verification",
      "Minification & Bundling Discrepancy Diagnostics",
      "Proxy / CDN / Ingress Header Stripping",
    ],
    scenario:
      "A developer deploys a new feature. In local development (`localhost:3000`), the feature works flawlessly. In production, users click the action button and nothing happens (or an unhandled runtime error appears in Sentry/Datadog). The developer says: 'It works on my machine!' Outline a disciplined, structured 5-step diagnostic process to isolate and resolve the discrepancy without guessing.",
    requirements: [
      "Explain the most common categories of local vs production drift (Environment variables, Minification/Bundler, Case sensitivity in OS filesystems, Proxy/SSL termination, Asynchronous latency).",
      "Detail how case-insensitive macOS/Windows local filesystems hide missing file import errors that crash case-sensitive Linux Docker containers in production.",
      "Explain how code minifiers/terser can rename constructor or class names, breaking reflection or code that checks `fn.name`.",
      "Explain how to safely reproduce the production issue locally using production builds (`npm run build && npm run start`).",
    ],
    starterCode: `// "It works on my machine!"
// Local: macOS / Windows, Node 20, npm run dev (unminified, no proxy)
// Production: Linux Alpine Docker Container, Kubernetes, Nginx Reverse Proxy, Cloudflare CDN, minified build`,
    programmingLanguage: "markdown",
    hints: [
      "Are you testing locally with `npm run dev`? Development uses unminified source code with Fast Refresh; production runs tree-shaking, minification, and bundling with `npm run build`.",
      "Mac and Windows filesystems are case-insensitive (`import './Button'` will resolve `button.tsx`), but production Linux containers are case-sensitive and throw `ModuleNotFound`.",
      "Check environment variables: Is an API URL or secret undefined in production, causing `fetch('undefined/api/...')`?",
    ],
    evaluationRubric: [
      {
        criteria: "Disciplined Diagnostic Playbook",
        weight: "40%",
        description: "Presents a logical deduction process from logs and environment down to network and runtime.",
      },
      {
        criteria: "Environmental & OS Drift Insights",
        weight: "35%",
        description: "Explains case-sensitive Linux vs Mac/Windows filesystems, proxy headers, and undefined env vars.",
      },
      {
        criteria: "Production Build Replication",
        weight: "25%",
        description: "Replicates using `npm run build` and production container parity locally.",
      },
    ],
    referenceAnswer:
      "### The 5-Step 'Works Locally but Fails in Prod' Playbook:\n\n### Step 1: Check Environment Configuration & Secrets\n- **Symptom**: `fetch('undefined/api/users')` or `JWT verification failed`.\n- **Root Cause**: Environment variable names missing from production container, misnamed in AWS Parameter Store, or not prefixed with public framework identifiers (e.g. `NEXT_PUBLIC_` or `VITE_`).\n- **Action**: Check server logs on startup for missing configuration assertions.\n\n### Step 2: Test the Minified Production Build Locally\n- Never debug against `npm run dev`.\n- Run: `npm run build && npm run start` (or build the production Docker image locally).\n- **Common Minification Bugs**:\n  - Code relying on `function.name` or `constructor.name` (Terser/minifiers mangle `class UserSession` into `class e`).\n  - Tree-shaking removing modules that had necessary side-effects.\n\n### Step 3: Inspect Case-Sensitive File Imports (Linux vs Mac/Windows)\n- **Symptom**: `Error: Cannot find module './components/Header'`.\n- **Root Cause**: macOS and Windows filesystems are case-insensitive by default. If the file is named `header.tsx` on disk, `import { Header } from './Header'` works on your MacBook, but **instantly crashes in the production Linux Docker container**.\n- **Prevention**: Enable `\"forceConsistentCasingInFileNames\": true` in `tsconfig.json`.\n\n### Step 4: Network, Proxy, and CORS Differences\n- **Reverse Proxies (Nginx / Cloudflare)**:\n  - Ingress controllers often strip headers (e.g. headers with underscores `auth_token`), limit payload body sizes (`client_max_body_size`), or enforce aggressive 30-second gateway timeouts (`504 Gateway Timeout`).\n  - SSL/HTTPS termination: Mixed content blocks HTTP requests in production that worked on `http://localhost`.\n\n### Step 5: Data Volume & Concurrency (The N+1 Reality)\n- Local development has 3 test records; production has 300,000 records.\n- A query taking 2ms locally hits connection pool limits or triggers an out-of-memory container crash under production load.",
    commonMistakes: [
      "Pushing random code edits directly to production in hopes of fixing it instead of inspecting Sentry/CloudWatch error stack traces.",
      "Assuming Docker completely eliminates differences without testing identical environment variables and data loads.",
    ],
    followUpQuestion:
      "How do Source Maps enable debugging minified production stack traces without exposing intellectual property?",
    followUpAnswer:
      "Upload hidden source maps directly to error monitoring tools (Sentry/Datadog) during your CI/CD build step, and configure your web server to never serve `.map` files to public browser requests. Sentry de-minifies production traces with exact line numbers privately.",
    references: [
      {
        title: "TypeScript Compiler Options: forceConsistentCasingInFileNames",
        url: "https://www.typescriptlang.org/tsconfig/#forceConsistentCasingInFileNames",
      },
      {
        title: "12-Factor App: Dev/Prod Parity",
        url: "https://12factor.net/dev-prod-parity",
      },
    ],
  },
];
