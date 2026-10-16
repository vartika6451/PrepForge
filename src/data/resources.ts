import { LearningResource, PaidCourse } from "@/types";

export const FREE_RESOURCES: LearningResource[] = [
  // JavaScript
  {
    id: "res-js-mdn",
    slug: "mdn-javascript-guide",
    title: "MDN Web Docs: JavaScript Guide & Reference",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    technologySlug: "javascript",
    resourceType: "Documentation",
    provider: "Mozilla Developer Network",
    level: "All Levels",
    pricingCategory: "Free",
    description: "The authoritative industry reference covering JavaScript language specs, standard built-in objects, and API details.",
    verificationStatus: "Verified Official",
    lastVerifiedAt: "2025-01-15"
  },
  {
    id: "res-js-javascript-info",
    slug: "the-modern-javascript-tutorial",
    title: "javascript.info — The Modern JavaScript Tutorial",
    url: "https://javascript.info",
    technologySlug: "javascript",
    resourceType: "Guide",
    provider: "javascript.info (Ilya Kantor)",
    level: "All Levels",
    pricingCategory: "Free",
    description: "Deep, comprehensive walkthrough of core concepts: closures, event loop, prototypes, promises, and DOM manipulation.",
    verificationStatus: "Curated Resource",
    lastVerifiedAt: "2025-01-20"
  },
  {
    id: "res-js-fireship",
    slug: "javascript-fireship-deep-dive",
    title: "JavaScript in 100 Seconds & Practical Concepts",
    url: "https://www.youtube.com/@Fireship",
    technologySlug: "javascript",
    resourceType: "YouTube",
    provider: "Fireship",
    level: "Beginner",
    pricingCategory: "Free",
    description: "High-density conceptual breakdowns of the JS runtime, event loop, and modern syntax patterns.",
    verificationStatus: "Curated Resource",
    lastVerifiedAt: "2025-02-01"
  },

  // TypeScript
  {
    id: "res-ts-handbook",
    slug: "official-typescript-handbook",
    title: "Official TypeScript Handbook",
    url: "https://www.typescriptlang.org/docs/handbook/intro.html",
    technologySlug: "typescript",
    resourceType: "Documentation",
    provider: "Microsoft TypeScript Team",
    level: "All Levels",
    pricingCategory: "Free",
    description: "The definitive guide to TypeScript's type system, narrowing, generics, conditional types, and tsconfig settings.",
    verificationStatus: "Verified Official",
    lastVerifiedAt: "2025-01-10"
  },
  {
    id: "res-ts-matt-pocock",
    slug: "total-typescript-beginner-tutorial",
    title: "Total TypeScript Beginners Tutorial & Tips",
    url: "https://www.totaltypescript.com/tutorials",
    technologySlug: "typescript",
    resourceType: "Interactive",
    provider: "Matt Pocock",
    level: "Beginner",
    pricingCategory: "Free",
    description: "Free interactive repository exercises covering type annotations, generics, and union manipulations.",
    verificationStatus: "Curated Resource",
    lastVerifiedAt: "2025-01-18"
  },

  // React
  {
    id: "res-react-docs",
    slug: "react-official-documentation",
    title: "React.dev: The Official React Documentation",
    url: "https://react.dev",
    technologySlug: "react",
    resourceType: "Documentation",
    provider: "React Core Team",
    level: "All Levels",
    pricingCategory: "Free",
    description: "Interactive documentation with live sandboxes, deep dives into state, effects, hooks, and component lifecycle.",
    verificationStatus: "Verified Official",
    lastVerifiedAt: "2025-01-12"
  },
  {
    id: "res-react-freecodecamp",
    slug: "react-course-for-beginners",
    title: "Full React Course — freeCodeCamp",
    url: "https://www.freecodecamp.org/news/learn-react-free-handbook/",
    technologySlug: "react",
    resourceType: "Guide",
    provider: "freeCodeCamp",
    level: "Beginner",
    pricingCategory: "Free",
    description: "Comprehensive step-by-step handbook building components, forms, state management, and real UI flows.",
    verificationStatus: "Curated Resource",
    lastVerifiedAt: "2025-01-25"
  },

  // Next.js
  {
    id: "res-next-docs",
    slug: "nextjs-app-router-docs",
    title: "Next.js Official Documentation (App Router)",
    url: "https://nextjs.org/docs",
    technologySlug: "nextjs",
    resourceType: "Documentation",
    provider: "Vercel",
    level: "All Levels",
    pricingCategory: "Free",
    description: "Full guide to App Router, Server Components, Streaming, Server Actions, Caching, and Metadata API.",
    verificationStatus: "Verified Official",
    lastVerifiedAt: "2025-01-15"
  },
  {
    id: "res-next-learn",
    slug: "nextjs-interactive-learn-course",
    title: "Next.js Learn: Interactive Full-Stack Course",
    url: "https://nextjs.org/learn",
    technologySlug: "nextjs",
    resourceType: "Interactive",
    provider: "Vercel",
    level: "Beginner",
    pricingCategory: "Free",
    description: "Interactive tutorial building the official Acme Financial dashboard using PostgreSQL, authentication, and Server Actions.",
    verificationStatus: "Verified Official",
    lastVerifiedAt: "2025-01-20"
  },

  // Node.js
  {
    id: "res-node-docs",
    slug: "nodejs-official-documentation",
    title: "Node.js Official Documentation & Guides",
    url: "https://nodejs.org/en/docs",
    technologySlug: "nodejs",
    resourceType: "Documentation",
    provider: "OpenJS Foundation",
    level: "All Levels",
    pricingCategory: "Free",
    description: "In-depth reference for core modules: fs, path, http, stream, crypto, cluster, and worker_threads.",
    verificationStatus: "Verified Official",
    lastVerifiedAt: "2025-01-14"
  },
  {
    id: "res-node-eventloop",
    slug: "nodejs-event-loop-guide",
    title: "The Node.js Event Loop, Timers, and process.nextTick()",
    url: "https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick",
    technologySlug: "nodejs",
    resourceType: "Guide",
    provider: "Node.js Learn Team",
    level: "Intermediate",
    pricingCategory: "Free",
    description: "Detailed official architecture document explaining the phases of libuv's event loop and microtask execution.",
    verificationStatus: "Verified Official",
    lastVerifiedAt: "2025-02-02"
  },

  // Express.js
  {
    id: "res-express-docs",
    slug: "express-official-guide",
    title: "Express.js Official Documentation & Routing Guide",
    url: "https://expressjs.com",
    technologySlug: "express",
    resourceType: "Documentation",
    provider: "OpenJS Foundation",
    level: "Beginner",
    pricingCategory: "Free",
    description: "Standard guides for middleware execution, error handling pipelines, routing parameters, and security best practices.",
    verificationStatus: "Verified Official",
    lastVerifiedAt: "2025-01-18"
  },

  // PostgreSQL
  {
    id: "res-postgres-docs",
    slug: "postgresql-official-docs",
    title: "PostgreSQL 16/17 Official Documentation",
    url: "https://www.postgresql.org/docs/",
    technologySlug: "postgresql",
    resourceType: "Documentation",
    provider: "PostgreSQL Global Development Group",
    level: "All Levels",
    pricingCategory: "Free",
    description: "Comprehensive manual for relational schema design, indexes, isolation levels, window functions, and query optimization.",
    verificationStatus: "Verified Official",
    lastVerifiedAt: "2025-01-11"
  },
  {
    id: "res-postgres-tutorial",
    slug: "postgres-tutorial-site",
    title: "PostgreSQL Tutorial",
    url: "https://www.postgresqltutorial.com",
    technologySlug: "postgresql",
    resourceType: "Guide",
    provider: "PostgreSQLTutorial.com",
    level: "Beginner",
    pricingCategory: "Free",
    description: "Step-by-step practical guides from fundamental SELECT queries to subqueries, CTEs, and triggers.",
    verificationStatus: "Curated Resource",
    lastVerifiedAt: "2025-01-22"
  },

  // Git & GitHub
  {
    id: "res-git-progit",
    slug: "pro-git-book",
    title: "Pro Git (2nd Edition) by Scott Chacon & Ben Straub",
    url: "https://git-scm.com/book/en/v2",
    technologySlug: "git",
    resourceType: "Guide",
    provider: "Git SCM Official Book",
    level: "All Levels",
    pricingCategory: "Free",
    description: "The complete, freely available book on Git internals, branching models, rebasing, and distributed repository administration.",
    verificationStatus: "Verified Official",
    lastVerifiedAt: "2025-01-08"
  },

  // System Design
  {
    id: "res-sys-primer",
    slug: "system-design-primer",
    title: "The System Design Primer (Donne Martin)",
    url: "https://github.com/donnemartin/system-design-primer",
    technologySlug: "system-design",
    resourceType: "Guide",
    provider: "GitHub Open Source (Donne Martin)",
    level: "Intermediate",
    pricingCategory: "Free",
    description: "The definitive open-source study repository for scalable system design, CAP theorem, caching, sharding, and interview frameworks.",
    verificationStatus: "Curated Resource",
    lastVerifiedAt: "2025-02-05"
  }
];

export const PAID_COURSES: PaidCourse[] = [
  {
    id: "course-js-jonas",
    slug: "complete-javascript-course-jonas",
    title: "The Complete JavaScript Course: From Zero to Expert!",
    technologySlug: "javascript",
    provider: "Udemy",
    instructor: "Jonas Schmedtmann",
    topicCoverage: ["Modern JavaScript", "DOM Manipulation", "OOP & Prototypes", "Async/Await", "Forkify Project Architecture"],
    level: "All Levels",
    pricingCategory: "Paid",
    officialUrl: "https://www.udemy.com/course/the-complete-javascript-course/"
  },
  {
    id: "course-ts-totalts",
    slug: "total-typescript-pro-essentials",
    title: "Total TypeScript: Core & Advanced Workshops",
    technologySlug: "typescript",
    provider: "Total TypeScript",
    instructor: "Matt Pocock",
    topicCoverage: ["Type Transformations", "Generics", "Advanced Patterns", "Discriminated Unions", "Library Typing"],
    level: "Advanced",
    pricingCategory: "Paid",
    officialUrl: "https://www.totaltypescript.com"
  },
  {
    id: "course-react-epicreact",
    slug: "epic-react-kent-c-dodds",
    title: "Epic React",
    technologySlug: "react",
    provider: "EpicWeb / Kent C. Dodds",
    instructor: "Kent C. Dodds",
    topicCoverage: ["React Fundamentals", "Hooks In-Depth", "Performance Tuning", "Testing with React Testing Library", "Suspense"],
    level: "Intermediate",
    pricingCategory: "Paid",
    officialUrl: "https://epicreact.dev"
  },
  {
    id: "course-node-max",
    slug: "nodejs-complete-guide-academind",
    title: "NodeJS - The Complete Guide (MVC, REST APIs, GraphQL, Deno)",
    technologySlug: "nodejs",
    provider: "Udemy / Academind",
    instructor: "Maximilian Schwarzmüller",
    topicCoverage: ["Node Basics", "Express Middleware", "SQL & NoSQL Integration", "Authentication & JWT", "File Uploads & Streams"],
    level: "All Levels",
    pricingCategory: "Paid",
    officialUrl: "https://www.udemy.com/course/nodejs-the-complete-guide/"
  },
  {
    id: "course-sys-bytebytego",
    slug: "bytebytego-system-design-interview",
    title: "System Design Interview Course & Visual Diagrams",
    technologySlug: "system-design",
    provider: "ByteByteGo",
    instructor: "Alex Xu",
    topicCoverage: ["Rate Limiter Design", "Distributed Message Queues", "Key-Value Stores", "Unique ID Generation", "Consistent Hashing"],
    level: "Intermediate",
    pricingCategory: "Subscription",
    officialUrl: "https://bytebytego.com"
  }
];
