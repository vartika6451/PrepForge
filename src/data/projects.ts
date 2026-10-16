import { Project } from "@/types";

export const PROJECTS: Project[] = [
  // 1. JavaScript
  {
    id: "proj-1",
    slug: "custom-kanban-board-engine",
    title: "Vanilla Drag-and-Drop Task Engine",
    description: "Build an accessible, keyboard-navigable Kanban workflow board with native HTML5 Drag and Drop API and zero third-party dependencies.",
    difficulty: "Beginner",
    category: "JavaScript",
    technologySlugs: ["javascript"],
    problemSolved: "Enables developers to grasp complex DOM events, coordinate tracking, event delegation, and persistent localStorage state without UI framework abstractions.",
    coreFeatures: [
      "Custom drag handles and drag preview animations using native DragEvent",
      "Dynamic column reordering and card sorting with drop boundary indicators",
      "Full keyboard navigation support (Space to pick up, Arrow keys to reposition, Enter to drop)",
      "Instant state persistence with localStorage serialization and schema migration"
    ],
    milestones: [
      {
        phase: "Phase 1: Foundation",
        title: "DOM Structure and Semantic Markup",
        tasks: ["Build accessible column layout", "Implement card template rendering", "Set up persistent storage helper"]
      },
      {
        phase: "Phase 2: Drag Logic",
        title: "Native Drag and Drop Pipeline",
        tasks: ["Handle dragstart, dragover, dragleave, and drop events", "Calculate dynamic insertion indices", "Add CSS dropzone indicator states"]
      },
      {
        phase: "Phase 3: Accessibility & Polish",
        title: "Keyboard Operability & State Sync",
        tasks: ["Implement WAI-ARIA live regions for screen readers", "Support full keyboard movement", "Add export/import JSON capability"]
      }
    ],
    skillsLearned: ["HTML5 Drag & Drop API", "DOM manipulation & event delegation", "WAI-ARIA accessibility", "Client-side state synchronization"],
    stretchGoals: ["Undo/Redo command stack with Ctrl+Z", "Column color coding and task search filter"],
    referenceLinks: [
      { title: "MDN HTML Drag and Drop API", url: "https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API" },
      { title: "W3C ARIA Authoring Practices Guide (APG)", url: "https://www.w3.org/WAI/ARIA/apg/" }
    ]
  },

  // 2. JavaScript / DOM
  {
    id: "proj-2",
    slug: "browser-audio-visualizer-dsp",
    title: "Web Audio Synthesizer & Spectrum Visualizer",
    description: "An in-browser digital audio workstation featuring waveform synthesis, biquad filter nodes, and a 60fps Canvas audio spectrum analyzer.",
    difficulty: "Intermediate",
    category: "JavaScript",
    technologySlugs: ["javascript"],
    problemSolved: "Teaches digital signal processing fundamentals, Web Audio API graph connections, and high-performance Canvas 2D rendering loops.",
    coreFeatures: [
      "Multi-waveform oscillator (sine, square, sawtooth, triangle) with pitch control",
      "Real-time Fast Fourier Transform (FFT) frequency spectrum analyzer via AnalyserNode",
      "Lowpass and highpass biquad filters with dynamic resonance adjustment",
      "Interactive piano keyboard supporting both mouse clicks and PC keyboard keys"
    ],
    milestones: [
      {
        phase: "Phase 1",
        title: "Audio Graph Setup",
        tasks: ["Initialize AudioContext on user gesture", "Connect Oscillator -> GainNode -> Destination", "Implement start/stop frequency triggers"]
      },
      {
        phase: "Phase 2",
        title: "DSP & Filters",
        tasks: ["Attach BiquadFilterNode to graph", "Wire interactive slider controls", "Implement ADSR envelope attack/decay curves"]
      },
      {
        phase: "Phase 3",
        title: "Canvas Visualization",
        tasks: ["Connect AnalyserNode with 2048 FFT size", "Implement requestAnimationFrame render loop", "Draw gradient frequency bar spectrum"]
      }
    ],
    skillsLearned: ["Web Audio API graph nodes", "requestAnimationFrame rendering", "Canvas 2D context drawing", "Digital signal frequency analysis"],
    stretchGoals: ["Microphone input mode with pitch detection", "Record and download audio as WAV buffer"],
    referenceLinks: [
      { title: "MDN Web Audio API", url: "https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API" }
    ]
  },

  // 3. TypeScript
  {
    id: "proj-3",
    slug: "type-safe-rest-client-generator",
    title: "Type-Safe Schema Validator & REST Client SDK",
    description: "A lightweight TypeScript library that converts OpenAPI or JSON schemas into runtime-validated, fully typed HTTP clients.",
    difficulty: "Intermediate",
    category: "TypeScript",
    technologySlugs: ["typescript"],
    problemSolved: "Eliminates runtime contract mismatches between backend microservices and frontend client SDKs using compile-time inference and Zod schemas.",
    coreFeatures: [
      "Generic HTTP client with compile-time query params and response body inference",
      "Automatic runtime validation against Zod schemas on inbound payloads",
      "Custom interceptor middleware pipeline for Bearer auth and telemetry",
      "Detailed typed error hierarchies (NetworkError, ValidationError, ApiError)"
    ],
    milestones: [
      {
        phase: "Phase 1",
        title: "Generic Type Architecture",
        tasks: ["Define EndpointDefinition interface with generics", "Implement request typing for Path, Query, and Body", "Create strict TypeScript build target"]
      },
      {
        phase: "Phase 2",
        title: "Fetch Wrapper & Middleware",
        tasks: ["Implement native fetch wrapper with retries", "Build middleware interceptor chain", "Handle JSON parsing with safety bounds"]
      },
      {
        phase: "Phase 3",
        title: "Zod Schema Integration & Packaging",
        tasks: ["Wire Zod safeParse to HTTP responses", "Return Discriminated Union Result<T, E>", "Publish as dual ESM/CJS npm package"]
      }
    ],
    skillsLearned: ["Advanced TypeScript Generics", "Type Narrowing & Conditional Types", "Zod Schema Validation", "NPM package structure"],
    stretchGoals: ["Automatic TypeScript declaration generation from Swagger JSON", "Exponential backoff retry policy"],
    referenceLinks: [
      { title: "TypeScript Handbook Generics", url: "https://www.typescriptlang.org/docs/handbook/2/generics.html" },
      { title: "Zod Documentation", url: "https://zod.dev" }
    ]
  },

  // 4. React
  {
    id: "proj-4",
    slug: "design-system-component-library",
    title: "Accessible UI Design System with Radix Primitives",
    description: "An enterprise-grade component library including Dialog, Select, Accordion, and Data Table built with Tailwind and keyboard-first accessibility.",
    difficulty: "Intermediate",
    category: "React",
    technologySlugs: ["react", "typescript"],
    problemSolved: "Solves common accessibility issues, focus-trapping bugs, and styling inconsistencies across multi-team engineering organizations.",
    coreFeatures: [
      "Compound component patterns (Dialog.Root, Dialog.Trigger, Dialog.Content)",
      "Strict WAI-ARIA compliance: focus trapping, Escape dismissal, and arrow key traversal",
      "Virtual scrolling support for rendering 10,000+ row data tables without lag",
      "Comprehensive Storybook documentation and automated interaction tests"
    ],
    milestones: [
      {
        phase: "Phase 1",
        title: "Tokens and Core Elements",
        tasks: ["Establish design tokens (colors, spacing, typography)", "Build polymorphic Button, Badge, and Input components", "Configure Storybook and Tailwind"]
      },
      {
        phase: "Phase 2",
        title: "Complex Modal & Dropdown Primitives",
        tasks: ["Implement React Portal mounting", "Build useFocusTrap and useClickOutside custom hooks", "Construct compound Modal and Dropdown"]
      },
      {
        phase: "Phase 3",
        title: "Data Table with Virtualization",
        tasks: ["Build sorting, multi-column filtering, and pagination", "Integrate lightweight virtualization row windowing", "Write axe-core automated a11y tests"]
      }
    ],
    skillsLearned: ["Compound Components pattern", "React Portals & Focus Trapping", "Radix UI Primitives", "Automated Accessibility Auditing"],
    stretchGoals: ["Animated transitions with Framer Motion", "Figma token synchronization CLI"],
    referenceLinks: [
      { title: "React Dev Documentation", url: "https://react.dev" },
      { title: "Radix UI Primitives", url: "https://www.radix-ui.com/primitives" }
    ]
  },

  // 5. Next.js
  {
    id: "proj-5",
    slug: "headless-documentation-engine",
    title: "Next.js Full-Stack Developer Documentation Engine",
    description: "A documentation platform featuring MDX compilation, syntax highlighting, Algolia-style instant search, and dynamic OG card generation.",
    difficulty: "Intermediate",
    category: "Next.js",
    technologySlugs: ["nextjs", "react", "typescript"],
    problemSolved: "Provides a high-performance content platform that loads instantaneously, generates automatic Table of Contents, and achieves 100/100 Lighthouse SEO.",
    coreFeatures: [
      "App Router with static generation (SSG) and Incremental Static Regeneration (ISR)",
      "MDX processing with syntax highlighting (Shiki), copy buttons, and code sandboxes",
      "Automated heading hierarchy extraction for interactive table of contents",
      "Edge-based Open Graph image generator via @vercel/og"
    ],
    milestones: [
      {
        phase: "Phase 1",
        title: "Content Pipeline",
        tasks: ["Set up filesystem-based MDX loader with gray-matter", "Configure Shiki dual-theme syntax highlighting", "Generate static params for documentation paths"]
      },
      {
        phase: "Phase 2",
        title: "Navigation & Search UI",
        tasks: ["Build sidebar with nested collapsible categories", "Create client-side fuzzy search indexing", "Implement active scroll spy for Table of Contents"]
      },
      {
        phase: "Phase 3",
        title: "SEO & Edge Dynamic OG",
        tasks: ["Implement Next.js Metadata API and canonical tags", "Build dynamic edge route for social banner generation", "Audit Lighthouse Performance & Accessibility"]
      }
    ],
    skillsLearned: ["Next.js App Router conventions", "MDX & Abstract Syntax Tree (rehype/remark)", "Edge runtime OG image generation", "SEO and Structured Data"],
    stretchGoals: ["Feedback widget with GitHub Discussions integration", "Multi-version documentation switching"],
    referenceLinks: [
      { title: "Next.js App Router Docs", url: "https://nextjs.org/docs" },
      { title: "Shiki Syntax Highlighter", url: "https://shiki.style" }
    ]
  },

  // 6. Node.js
  {
    id: "proj-6",
    slug: "realtime-log-aggregator-cli",
    title: "High-Throughput Log Aggregator & Streaming CLI",
    description: "A streaming log ingestion daemon built with Node.js Streams, readline buffers, and WebSocket push for real-time log monitoring.",
    difficulty: "Advanced",
    category: "Node.js",
    technologySlugs: ["nodejs", "typescript"],
    problemSolved: "Handles massive server log files without out-of-memory errors by utilizing backpressure-safe Node.js streams and worker thread filtering.",
    coreFeatures: [
      "Zero-copy chunked file ingestion via fs.createReadStream with regulated backpressure",
      "Worker Thread pool for non-blocking regex filtering and JSON log parsing",
      "WebSocket server broadcasting parsed log lines to connected dashboard clients",
      "Interactive terminal UI built with Blessed / Ink displaying real-time metrics"
    ],
    milestones: [
      {
        phase: "Phase 1",
        title: "Stream Pipeline",
        tasks: ["Create custom Transform stream for log parsing", "Implement backpressure check with highWaterMark regulation", "Handle abrupt file termination and rotation"]
      },
      {
        phase: "Phase 2",
        title: "Worker Threads & Concurrency",
        tasks: ["Spawn Worker Thread pool for heavy regex parsing", "Implement thread task queue and message dispatching", "Benchmark throughput against single-threaded parsing"]
      },
      {
        phase: "Phase 3",
        title: "Streaming Server & CLI Output",
        tasks: ["Build WebSocket broadcaster with client subscription filters", "Implement terminal dashboard showing RPS and error rate", "Add integration tests with mock log generators"]
      }
    ],
    skillsLearned: ["Node.js Streams & Pipeline API", "Handling Stream Backpressure", "worker_threads multithreading", "WebSockets and binary protocols"],
    stretchGoals: ["Log compaction and gzip archive rotation", "Prometheus metrics exporter endpoint"],
    referenceLinks: [
      { title: "Node.js Streams Documentation", url: "https://nodejs.org/api/stream.html" },
      { title: "Node.js Worker Threads", url: "https://nodejs.org/api/worker_threads.html" }
    ]
  },

  // 7. Express.js & Node.js
  {
    id: "proj-7",
    slug: "scalable-rest-api-with-jwt-rbac",
    title: "Enterprise REST API with Role-Based Access Control",
    description: "A production-ready Express API with JWT refresh token rotation, Zod request validation, rate limiting, and structured logging.",
    difficulty: "Intermediate",
    category: "Node.js",
    technologySlugs: ["express", "nodejs", "postgresql"],
    problemSolved: "Demonstrates secure backend architecture, mitigating common OWASP vulnerabilities like CSRF, XSS, broken object level authorization, and token theft.",
    coreFeatures: [
      "Access token (short-lived) and Refresh token (httpOnly cookie) rotation with family revocation",
      "Granular RBAC middleware (Admin, Editor, Member) with declarative route guards",
      "Zod middleware validating req.body, req.query, and req.params with descriptive errors",
      "Centralized error handling with RFC 7807 Problem Details response formatting"
    ],
    milestones: [
      {
        phase: "Phase 1",
        title: "Authentication & Cryptography",
        tasks: ["Implement Argon2 password hashing", "Set up JWT sign/verify with RSA or HMAC secrets", "Build refresh token rotation with database tracking"]
      },
      {
        phase: "Phase 2",
        title: "Middleware Pipeline & Validation",
        tasks: ["Build generic validateRequest(schema) middleware", "Configure Helmet, CORS, and express-rate-limit", "Implement role-based authorization decorator"]
      },
      {
        phase: "Phase 3",
        title: "Persistence & Logging",
        tasks: ["Connect Prisma with PostgreSQL connection pooling", "Set up Winston/Pino structured JSON logger with correlation IDs", "Write end-to-end Supertest test suite"]
      }
    ],
    skillsLearned: ["JWT Refresh Token Rotation", "Role-Based Access Control (RBAC)", "Express Middleware Pipelines", "OWASP Security Hardening"],
    stretchGoals: ["OAuth2 GitHub & Google social sign-in integration", "Audit log logging to PostgreSQL"],
    referenceLinks: [
      { title: "OWASP REST Security Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html" },
      { title: "Express.js Routing Guide", url: "https://expressjs.com/en/guide/routing.html" }
    ]
  },

  // 8. PostgreSQL & Full Stack
  {
    id: "proj-8",
    slug: "multi-tenant-ecommerce-inventory-db",
    title: "Multi-Tenant E-Commerce Inventory & Order System",
    description: "An ACID-compliant relational schema featuring pessimistic locking, inventory reservation timeouts, and audit ledger triggers.",
    difficulty: "Advanced",
    category: "Full Stack",
    technologySlugs: ["postgresql", "nodejs", "typescript"],
    problemSolved: "Prevents overselling during high-concurrency flash sales through database transaction isolation, SELECT FOR UPDATE locking, and atomic stock debits.",
    coreFeatures: [
      "Atomic checkout transactions with SELECT FOR UPDATE to prevent race-condition overselling",
      "Automatic cart reservation expiry using scheduled background workers and PostgreSQL status triggers",
      "Partitioned order tables by timestamp (monthly range partitioning) for fast analytical queries",
      "Multi-tenant isolation using PostgreSQL Row-Level Security (RLS) policies"
    ],
    milestones: [
      {
        phase: "Phase 1",
        title: "Schema Design & Constraints",
        tasks: ["Design normalized 3NF schema (tenants, products, variants, inventory, orders)", "Establish foreign key cascade rules and check constraints", "Implement Row-Level Security (RLS) policies"]
      },
      {
        phase: "Phase 2",
        title: "Concurrent Checkout Transactions",
        tasks: ["Write raw SQL / Prisma transaction with Serializable or Read Committed + Row Lock", "Implement inventory reservation with 15-minute expiration timestamp", "Bench test with simulated 100 concurrent checkout requests"]
      },
      {
        phase: "Phase 3",
        title: "Performance & Partitioning",
        tasks: ["Add table range partitioning on orders table", "Create composite B-Tree indexes and analyze with EXPLAIN ANALYZE", "Set up connection pool tuning with PgBouncer"]
      }
    ],
    skillsLearned: ["PostgreSQL Transaction Isolation Levels", "Row-Level Security (RLS)", "Pessimistic vs Optimistic Locking", "EXPLAIN ANALYZE Performance Tuning"],
    stretchGoals: ["Materialized views for daily sales analytics with cron refresh", "Event notification triggers using LISTEN / NOTIFY"],
    referenceLinks: [
      { title: "PostgreSQL Explicit Locking", url: "https://www.postgresql.org/docs/current/explicit-locking.html" },
      { title: "PostgreSQL Row Security Policies", url: "https://www.postgresql.org/docs/current/ddl-rowsecurity.html" }
    ]
  },

  // 9. Full Stack
  {
    id: "proj-9",
    slug: "collaborative-markdown-workspace",
    title: "Real-Time Collaborative Markdown Workspace",
    description: "A collaborative document workspace with presence avatars, live cursor tracking, conflict-free replicated data types (CRDTs), and WebSocket synchronization.",
    difficulty: "Advanced",
    category: "Full Stack",
    technologySlugs: ["react", "nextjs", "nodejs", "typescript"],
    problemSolved: "Allows multiple remote teammates to write and edit documents simultaneously without overwriting changes or suffering sync desynchronization.",
    coreFeatures: [
      "Peer-to-peer or server-mediated CRDT text synchronization using Yjs or Automerge",
      "Live user presence showing colored cursors, selection highlights, and active teammate avatars",
      "Offline-first support: edits made while disconnected merge cleanly upon reconnection",
      "Version history snapshot timeline with visual diffing"
    ],
    milestones: [
      {
        phase: "Phase 1",
        title: "Editor & Local State",
        tasks: ["Integrate ProseMirror or CodeMirror markdown editor", "Set up local Yjs Doc and text binding", "Implement markdown preview panel"]
      },
      {
        phase: "Phase 2",
        title: "WebSocket Sync Server",
        tasks: ["Build Node.js WebSocket synchronization server with y-websocket", "Handle authentication and room-based channel routing", "Persist Yjs binary updates to PostgreSQL blob column"]
      },
      {
        phase: "Phase 3",
        title: "Awareness & Reconnection",
        tasks: ["Broadcast cursor positions and user profile metadata via awareness protocol", "Implement reconnection backoff with offline IndexedDB fallback", "Build document snapshot diff viewer"]
      }
    ],
    skillsLearned: ["CRDT fundamentals (Conflict-free Replicated Data Types)", "WebSocket state protocols", "IndexedDB offline caching", "ProseMirror/CodeMirror integration"],
    stretchGoals: ["Voice room presence using WebRTC audio mesh", "Export to styled PDF and Hugo markdown"],
    referenceLinks: [
      { title: "Yjs CRDT Framework", url: "https://yjs.dev" },
      { title: "CodeMirror 6 Architecture", url: "https://codemirror.net" }
    ]
  },

  // 10. AI Applications
  {
    id: "proj-10",
    slug: "retrieval-augmented-code-assistant",
    title: "RAG Documentation Q&A & Code Assistant",
    description: "An AI-powered technical assistant that answers developer questions with precise citations from custom documentation sets using vector embeddings.",
    difficulty: "Advanced",
    category: "AI Applications",
    technologySlugs: ["nextjs", "typescript", "postgresql"],
    problemSolved: "Eliminates AI hallucinations by grounding responses strictly within indexed technical documentation and linking users to source paragraphs.",
    coreFeatures: [
      "Document ingestion pipeline: markdown chunking with token overlap and metadata tracking",
      "Vector similarity search using PostgreSQL pgvector extension and cosine similarity",
      "Streaming LLM responses via Server-Sent Events (SSE) with clickable source citations",
      "Token usage telemetry, conversation history memory, and rate limiting"
    ],
    milestones: [
      {
        phase: "Phase 1",
        title: "Ingestion & Embedding",
        tasks: ["Build recursive text splitter for markdown headers and code blocks", "Generate embeddings using OpenAI or open-source embedding models", "Store vectors in PostgreSQL using pgvector extension"]
      },
      {
        phase: "Phase 2",
        title: "Retrieval & Query Pipeline",
        tasks: ["Implement cosine distance query: SELECT * ORDER BY embedding <=> query_vector", "Apply reciprocal rank fusion and threshold filtering", "Construct structured system prompt with retrieved context snippets"]
      },
      {
        phase: "Phase 3",
        title: "Streaming UI & Telemetry",
        tasks: ["Build streaming Next.js route handler with ReadableStream", "Render streaming markdown with syntax-highlighted code on client", "Add citation popovers linking directly to original documentation URLs"]
      }
    ],
    skillsLearned: ["pgvector & Vector Database indexing", "RAG (Retrieval-Augmented Generation) pipeline", "Streaming Server-Sent Events (SSE)", "Prompt engineering & chunking strategies"],
    stretchGoals: ["Hybrid search combining pgvector with PostgreSQL full-text search (BM25)", "User feedback thumbs up/down evaluation loop"],
    referenceLinks: [
      { title: "pgvector Extension Documentation", url: "https://github.com/pgvector/pgvector" },
      { title: "Vercel AI SDK Documentation", url: "https://sdk.vercel.ai/docs" }
    ]
  },

  // 11. Git & DevOps
  {
    id: "proj-11",
    slug: "custom-git-implementation-in-ts",
    title: "Mini-Git: Content-Addressable Storage Engine",
    description: "A functional Git CLI clone in TypeScript implementing SHA-1 hashing, blob objects, trees, commits, branching, and commit logs.",
    difficulty: "Advanced",
    category: "TypeScript",
    technologySlugs: ["typescript", "nodejs", "git"],
    problemSolved: "Demystifies how Git stores versions internally, moving beyond memorized commands to understanding directed acyclic graphs of hash objects.",
    coreFeatures: [
      "Core plumbing commands: hash-object, cat-file, write-tree, commit-tree",
      "Porcelain commands: init, add, commit, branch, checkout, and log",
      "Zlib compression of loose object files inside custom .minigit directory",
      "Branch pointer management via HEAD and refs/heads files"
    ],
    milestones: [
      {
        phase: "Phase 1",
        title: "Object Store & Hashing",
        tasks: ["Implement SHA-1 hashing and loose object header formatting", "Write zlib compressed object files to disk", "Build cat-file to decompress and inspect blobs"]
      },
      {
        phase: "Phase 2",
        title: "Trees & Commits",
        tasks: ["Construct Tree objects representing directory file structures", "Create Commit objects linking author, timestamp, tree hash, and parent hash", "Implement staging area index file parser"]
      },
      {
        phase: "Phase 3",
        title: "Branches & Log Traversal",
        tasks: ["Manage symbolic HEAD reference and branch files", "Implement log command by traversing parent commit hashes backwards", "Add checkout command to rebuild working directory from tree"]
      }
    ],
    skillsLearned: ["Content-addressable file storage", "Zlib data compression", "DAG (Directed Acyclic Graph) traversal", "CLI argument parsing with Node.js"],
    stretchGoals: ["3-way merge conflict detection", "Packfile creation and indexing"],
    referenceLinks: [
      { title: "Git Internals - Git Objects", url: "https://git-scm.com/book/en/v2/Git-Internals-Git-Objects" }
    ]
  },

  // 12. Full Stack
  {
    id: "proj-12",
    slug: "distributed-job-queue-dashboard",
    title: "BullMQ-Style Distributed Background Job Worker",
    description: "A resilient job queue processing delayed jobs, retries with exponential backoff, dead-letter queues, and a real-time monitoring dashboard.",
    difficulty: "Intermediate",
    category: "Full Stack",
    technologySlugs: ["nodejs", "typescript", "react"],
    problemSolved: "Enables applications to offload slow tasks (emails, video transcoding, PDF generation) from HTTP request cycles without losing jobs on server crashes.",
    coreFeatures: [
      "Job lifecycle management (waiting, active, completed, failed, delayed)",
      "Automatic retry with configurable exponential backoff and jitter",
      "Dead Letter Queue (DLQ) for inspecting poisoned jobs that exhaust retries",
      "Live metrics dashboard showing job processing rate, failure rates, and concurrency"
    ],
    milestones: [
      {
        phase: "Phase 1",
        title: "Queue Engine Core",
        tasks: ["Design Job interface and status state machine", "Implement atomic job popping with Redis or database locks", "Support priority weighting and delayed scheduling"]
      },
      {
        phase: "Phase 2",
        title: "Worker Process & Failure Handling",
        tasks: ["Build multi-concurrent worker processor loop", "Implement retry policy with exponential backoff equation", "Move failed jobs to dead-letter storage upon threshold exceed"]
      },
      {
        phase: "Phase 3",
        title: "Admin Dashboard UI",
        tasks: ["Build React management dashboard with real-time stats", "Add job retry and job purge actions", "Create job payload and stack trace viewer"]
      }
    ],
    skillsLearned: ["Asynchronous worker queue patterns", "Exponential backoff algorithms", "Dead letter queue failure management", "Real-time process telemetry"],
    stretchGoals: ["Job deduplication by custom unique ID", "Graceful worker shutdown handling SIGTERM"],
    referenceLinks: [
      { title: "BullMQ Guide & Patterns", url: "https://docs.bullmq.io" }
    ]
  },

  // 13. React
  {
    id: "proj-13",
    slug: "interactive-form-builder-engine",
    title: "No-Code Dynamic Form Builder with Schema Export",
    description: "A drag-and-drop form construction tool with conditional visibility logic, input masking, live validation, and JSON Schema export.",
    difficulty: "Beginner",
    category: "React",
    technologySlugs: ["react", "typescript"],
    problemSolved: "Allows non-technical teams to create complex multi-step forms with dynamic field dependencies without needing developer deployment cycles.",
    coreFeatures: [
      "Visual field palette (text, number, date, select, checkbox, file upload)",
      "Rule engine for conditional display (e.g., show Field B only if Field A equals 'Yes')",
      "Live preview simulator with instant validation using React Hook Form & Zod",
      "One-click export to standard JSON Schema and clean React component code"
    ],
    milestones: [
      {
        phase: "Phase 1",
        title: "Form Schema Definition",
        tasks: ["Define FieldConfig and FormSchema TypeScript interfaces", "Build field properties editor (label, placeholder, required, validation)", "Set up centralized form state context"]
      },
      {
        phase: "Phase 2",
        title: "Drag and Drop Builder Canvas",
        tasks: ["Build reorderable canvas using lightweight drag-and-drop", "Implement field selection and property panel synchronization", "Add undo/redo history stack"]
      },
      {
        phase: "Phase 3",
        title: "Rule Engine & Code Generation",
        tasks: ["Implement conditional visibility evaluator", "Generate dynamic Zod validation schema on the fly", "Export clean copy-pasteable React component JSX"]
      }
    ],
    skillsLearned: ["React Hook Form dynamic registration", "Dynamic Zod schema generation", "State machine for condition evaluation", "Code generation from AST/JSON"],
    stretchGoals: ["Multi-step wizard layout with progress indicators", "Webhook submission endpoint testing"],
    referenceLinks: [
      { title: "React Hook Form Docs", url: "https://react-hook-form.com" },
      { title: "JSON Schema Specification", url: "https://json-schema.org" }
    ]
  },

  // 14. Next.js & Full Stack
  {
    id: "proj-14",
    slug: "developer-portfolio-cms-platform",
    title: "Headless Developer Portfolio with Analytics",
    description: "A fast personal developer site with dynamic project showcases, blog with RSS feed, and privacy-focused server-side analytics.",
    difficulty: "Beginner",
    category: "Next.js",
    technologySlugs: ["nextjs", "react", "typescript"],
    problemSolved: "Empowers engineers to present their real software work, code metrics, and articles with instant performance and zero third-party tracking scripts.",
    coreFeatures: [
      "Dynamic GitHub repository integration pulling stars, forks, and recent commit activity",
      "Static blog with syntax highlighting, reading time calculation, and RSS XML feed",
      "Server-side privacy analytics collecting pageviews without cookies or IP addresses",
      "Dark/Light theme toggle with zero layout shift and CSS variables"
    ],
    milestones: [
      {
        phase: "Phase 1",
        title: "Layout and Theming",
        tasks: ["Create sleek developer theme with Tailwind CSS", "Build responsive navbar, hero section, and project cards", "Configure theme provider without flash of unstyled content"]
      },
      {
        phase: "Phase 2",
        title: "Dynamic Integrations",
        tasks: ["Fetch GitHub API with Next.js ISR (revalidate: 3600)", "Build MDX blog engine with reading time calculator", "Generate sitemap.xml and rss.xml dynamically"]
      },
      {
        phase: "Phase 3",
        title: "Server Analytics & Optimization",
        tasks: ["Implement Next.js Route Handler recording lightweight view events", "Display aggregate project view counters", "Audit Lighthouse Score to achieve 100/100 across all 4 metrics"]
      }
    ],
    skillsLearned: ["Next.js Incremental Static Regeneration (ISR)", "GitHub REST API integration", "RSS and Sitemap generation", "Lighthouse optimization"],
    stretchGoals: ["Interactive terminal emulator Easter egg in hero", "Newsletter subscription with Resend API"],
    referenceLinks: [
      { title: "Next.js Route Handlers", url: "https://nextjs.org/docs/app/building-your-application/routing/route-handlers" }
    ]
  },

  // 15. AI Applications
  {
    id: "proj-15",
    slug: "ai-prompt-evaluator-playground",
    title: "AI Prompt Optimization & Regression Testing Studio",
    description: "A test bench for evaluating LLM prompt variations side-by-side, benchmarking latency, token costs, and automated assertion criteria.",
    difficulty: "Intermediate",
    category: "AI Applications",
    technologySlugs: ["typescript", "react", "nextjs"],
    problemSolved: "Brings software engineering discipline and automated regression testing to prompt engineering, preventing degradation when modifying system instructions.",
    coreFeatures: [
      "Side-by-side multi-model or multi-prompt execution matrix",
      "Automated assertions: string contains, JSON schema validity, regex match, and semantic similarity",
      "Token usage and pricing calculator across different model tiers",
      "Test suite export and CI/CD integration script"
    ],
    milestones: [
      {
        phase: "Phase 1",
        title: "Evaluation Matrix UI",
        tasks: ["Build split-view comparison workspace", "Configure prompt variable interpolation syntax (e.g., {{input}})", "Set up model parameter sliders (temperature, top_p, max_tokens)"]
      },
      {
        phase: "Phase 2",
        title: "Execution Engine",
        tasks: ["Implement parallel API runner with rate limiting", "Measure response latency and calculate token costs", "Handle stream responses side-by-side"]
      },
      {
        phase: "Phase 3",
        title: "Assertion Suite & Reports",
        tasks: ["Build rule-based validator engine", "Display pass/fail indicators and scorecards", "Generate CSV and Markdown evaluation reports"]
      }
    ],
    skillsLearned: ["LLM API orchestration", "Prompt templating & token metrics", "Automated regression testing concepts", "Split-screen parallel UI design"],
    stretchGoals: ["LLM-as-a-judge automated grading", "Git-like prompt version history diffing"],
    referenceLinks: [
      { title: "OpenAI API Documentation", url: "https://platform.openai.com/docs" }
    ]
  },

  // 16. Full Stack
  {
    id: "proj-16",
    slug: "url-shortener-analytics-service",
    title: "High-Performance URL Shortener & Click Stream Analytics",
    description: "A scalable URL shortening engine with Base62 encoding, Redis caching, geographic click tracking, and QR code generation.",
    difficulty: "Beginner",
    category: "Full Stack",
    technologySlugs: ["nodejs", "postgresql", "react"],
    problemSolved: "Demonstrates core system design principles: Base62 hashing vs auto-increment IDs, high-throughput redirect caching, and asynchronous clickstream logging.",
    coreFeatures: [
      "Base62 encoding algorithm converting unique sequence IDs to short 7-character slugs",
      "Sub-10ms redirects via Redis caching of active short links",
      "Asynchronous click analytics logging (referrer, device type, country, timestamp)",
      "Interactive SVG QR code generator with downloadable high-res PNGs"
    ],
    milestones: [
      {
        phase: "Phase 1",
        title: "Encoding & Database Schema",
        tasks: ["Implement Base62 encoder/decoder in TypeScript", "Design PostgreSQL schema for links and click_events", "Handle custom alias collision checking"]
      },
      {
        phase: "Phase 2",
        title: "High-Speed Redirects & Caching",
        tasks: ["Build Express redirect handler with HTTP 301/302 status codes", "Add Redis cache lookaside layer with TTL", "Emit click event asynchronously without blocking redirect"]
      },
      {
        phase: "Phase 3",
        title: "Analytics Dashboard",
        tasks: ["Build frontend dashboard with Recharts click timeline", "Break down clicks by browser, device, and top referrers", "Integrate canvas QR code generation"]
      }
    ],
    skillsLearned: ["Base62 encoding & bijection mapping", "Cache-Aside pattern with Redis", "Asynchronous event logging", "HTTP 301 vs 302 redirect mechanics"],
    stretchGoals: ["Expiring links with password protection", "Custom domain routing with CNAME support"],
    referenceLinks: [
      { title: "System Design: Design a URL Shortener", url: "https://github.com/donnemartin/system-design-primer" }
    ]
  }
];
