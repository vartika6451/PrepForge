import { Roadmap } from "@/types";

export const ROADMAPS: Roadmap[] = [
  {
    id: "rm-fullstack",
    slug: "full-stack-developer-roadmap",
    title: "Full-Stack Software Engineer Career Track",
    targetRole: "Full-Stack Engineer (Frontend, Backend & Systems)",
    summary:
      "A complete end-to-end curriculum connecting core JavaScript/TypeScript proficiency, modern React & Next.js full-stack development, PostgreSQL database modeling, resilient Node.js backends, and deployment architectures.",
    estimatedDuration: "24 Weeks",
    stages: [
      {
        stage: 1,
        title: "Language Mastery & Programming Models",
        description: "Master JavaScript internals, TypeScript strict typing, memory models, and async concurrency.",
        duration: "Weeks 1–4",
        focusItems: [
          "Lexical scope, closures, prototype delegation, and the 'this' keyword",
          "Event loop execution: call stack, microtasks, macrotasks, and promise chaining",
          "TypeScript type narrowing, generics, discriminated unions, and utility types",
          "Git branch management, trunk-based development, and rebase strategies"
        ],
        targetTechnologies: ["javascript", "typescript", "git"],
        targetPatterns: ["arrays-and-hashing", "two-pointers"],
        targetProjects: ["custom-kanban-board-engine", "type-safe-rest-client-generator"]
      },
      {
        stage: 2,
        title: "Modern Frontend Architecture & Component Systems",
        description: "Build robust, accessible user interfaces with React, state machines, and Next.js App Router.",
        duration: "Weeks 5–10",
        focusItems: [
          "React component lifecycles, custom hooks, and Fiber reconciliation",
          "Accessible UI primitives, WAI-ARIA, keyboard navigation, and focus trapping",
          "Next.js App Router: React Server Components, Streaming SSR, and Server Actions",
          "Data fetching strategies, client-side caching, and bundle optimization"
        ],
        targetTechnologies: ["react", "nextjs"],
        targetPatterns: ["sliding-window", "stacks-and-queues"],
        targetProjects: ["design-system-component-library", "headless-documentation-engine"]
      },
      {
        stage: 3,
        title: "Backend Engineering & Relational Databases",
        description: "Design high-throughput server backends, secure APIs, and performant relational schemas.",
        duration: "Weeks 11–16",
        focusItems: [
          "Node.js streams, buffers, backpressure, and worker thread concurrency",
          "REST API design with Express, JWT authentication, and RBAC authorization",
          "PostgreSQL schema normalization, ACID transactions, locking, and B-Tree/GIN indexing",
          "Prisma ORM integration, connection pooling, and database migrations"
        ],
        targetTechnologies: ["nodejs", "express", "postgresql"],
        targetPatterns: ["fast-and-slow-pointers", "binary-search", "intervals"],
        targetProjects: ["scalable-rest-api-with-jwt-rbac", "multi-tenant-ecommerce-inventory-db"]
      },
      {
        stage: 4,
        title: "Distributed Systems & Production Deployment",
        description: "Scale services with caching, asynchronous worker queues, WebSockets, and cloud pipelines.",
        duration: "Weeks 17–24",
        focusItems: [
          "Horizontal scaling, reverse proxies, and load balancer algorithms",
          "Redis caching strategies: Cache-Aside, Write-Through, and Token Bucket rate limiters",
          "Real-time bidirectional synchronization with WebSockets and CRDTs",
          "CI/CD pipelines with GitHub Actions, Docker containers, and Vercel edge deployment"
        ],
        targetTechnologies: ["system-design"],
        targetPatterns: ["trees-and-bst", "graphs-and-traversal", "dynamic-programming"],
        targetProjects: ["collaborative-markdown-workspace", "distributed-job-queue-dashboard"]
      }
    ]
  },
  {
    id: "rm-frontend",
    slug: "frontend-specialist-roadmap",
    title: "Frontend Engineering Specialist",
    targetRole: "Senior Frontend Engineer / UI Architect",
    summary:
      "Deep dive into client-side runtime performance, browser rendering engines, React internals, state management paradigms, and design system engineering.",
    estimatedDuration: "16 Weeks",
    stages: [
      {
        stage: 1,
        title: "Browser Internals & Modern JavaScript",
        description: "Understand the Critical Rendering Path, DOM tree construction, layout, paint, and composite stages.",
        duration: "Weeks 1–4",
        focusItems: [
          "DOM painting lifecycle and requestAnimationFrame synchronization",
          "Event bubbling, capturing, and delegation optimization",
          "Web Audio API, Canvas 2D rendering, and hardware acceleration",
          "JavaScript engine optimizations (Hidden classes, inline caches)"
        ],
        targetTechnologies: ["javascript", "typescript"],
        targetPatterns: ["arrays-and-hashing", "two-pointers"],
        targetProjects: ["browser-audio-visualizer-dsp"]
      },
      {
        stage: 2,
        title: "Design Systems & Component Architecture",
        description: "Build atomic, accessible, and themeable UI libraries using Radix primitives and Tailwind CSS.",
        duration: "Weeks 5–10",
        focusItems: [
          "Compound components and polymorphism in TypeScript React",
          "WAI-ARIA guidelines, focus trapping, and screen reader announcements",
          "Virtual scrolling algorithms for infinite data feeds",
          "Automated visual regression testing with Storybook and Playwright"
        ],
        targetTechnologies: ["react", "typescript"],
        targetPatterns: ["sliding-window", "stacks-and-queues"],
        targetProjects: ["design-system-component-library", "interactive-form-builder-engine"]
      },
      {
        stage: 3,
        title: "Full-Stack React & Next.js App Router",
        description: "Master React Server Components, streaming SSR, partial prerendering, and SEO optimization.",
        duration: "Weeks 11–16",
        focusItems: [
          "Server Components vs Client Components boundaries",
          "Next.js caching tiers: Data Cache, Full Route Cache, Router Cache",
          "Core Web Vitals tuning: LCP, INP, and CLS performance optimization",
          "Static generation (SSG), ISR, and Edge Runtime middleware"
        ],
        targetTechnologies: ["nextjs", "react"],
        targetPatterns: ["trees-and-bst"],
        targetProjects: ["headless-documentation-engine", "developer-portfolio-cms-platform"]
      }
    ]
  },
  {
    id: "rm-backend",
    slug: "backend-systems-roadmap",
    title: "Backend & Systems Engineer",
    targetRole: "Backend Engineer / Distributed Systems Specialist",
    summary:
      "Specialized journey through high-concurrency Node.js servers, SQL schema design, query optimization, streaming data pipelines, and distributed system architectures.",
    estimatedDuration: "18 Weeks",
    stages: [
      {
        stage: 1,
        title: "Runtime Architecture & Asynchronous I/O",
        description: "Master Node.js internals, libuv event loop phases, and backpressure-regulated streams.",
        duration: "Weeks 1–5",
        focusItems: [
          "Libuv event loop phases: Timers, Poll, Check, and Close callbacks",
          "Zero-copy chunked processing with Node.js Streams and Pipelines",
          "Multithreading with worker_threads and process clustering",
          "Buffer allocations, garbage collection tuning, and memory leak profiling"
        ],
        targetTechnologies: ["nodejs", "typescript"],
        targetPatterns: ["stacks-and-queues", "fast-and-slow-pointers"],
        targetProjects: ["realtime-log-aggregator-cli"]
      },
      {
        stage: 2,
        title: "API Design, Security & Relational Databases",
        description: "Engineer resilient REST services and production-grade PostgreSQL databases.",
        duration: "Weeks 6–11",
        focusItems: [
          "Express middleware chaining, RFC 7807 error responses, and Zod input validation",
          "JWT refresh token rotation and Role-Based Access Control (RBAC)",
          "PostgreSQL query execution plans with EXPLAIN ANALYZE and B-Tree/GIN indexes",
          "ACID transactions, locking semantics, and Row-Level Security (RLS)"
        ],
        targetTechnologies: ["express", "postgresql"],
        targetPatterns: ["intervals", "binary-search"],
        targetProjects: ["scalable-rest-api-with-jwt-rbac", "multi-tenant-ecommerce-inventory-db"]
      },
      {
        stage: 3,
        title: "Distributed Systems & Asynchronous Architectures",
        description: "Scale services with message queues, caching, rate limiting, and event-driven patterns.",
        duration: "Weeks 12–18",
        focusItems: [
          "Redis caching patterns, eviction policies, and atomic Lua script rate limiters",
          "Asynchronous worker queues with retry jitter and dead letter queues",
          "CAP theorem, eventual consistency, and idempotent API operations",
          "Database horizontal partitioning, sharding, and read replica topologies"
        ],
        targetTechnologies: ["system-design"],
        targetPatterns: ["heaps-and-priority-queues", "topological-sorting"],
        targetProjects: ["distributed-job-queue-dashboard", "url-shortener-analytics-service"]
      }
    ]
  },
  {
    id: "rm-dsa",
    slug: "dsa-interview-mastery-roadmap",
    title: "DSA & Algorithmic Interview Mastery",
    targetRole: "Coding Interview Preparation (FAANG & Tier-1 Tech)",
    summary:
      "A systematic pattern-based curriculum covering all 18 major problem-solving paradigms from linear data structures to dynamic programming, backtracking, and graph algorithms.",
    estimatedDuration: "14 Weeks",
    stages: [
      {
        stage: 1,
        title: "Linear Structures & Two-Pointer Patterns",
        description: "Build strong pattern recognition for linear collections, hash tables, and bidirectional pointers.",
        duration: "Weeks 1–3",
        focusItems: [
          "Arrays and Hashing: frequency mapping, anagram grouping, prefix sums",
          "Two Pointers: sorted array pair finding, container volume, 3Sum",
          "Sliding Window: fixed vs dynamic windows, longest substrings, minimum window",
          "Fast and Slow Pointers: Floyd's cycle detection, midpoint evaluation"
        ],
        targetPatterns: ["arrays-and-hashing", "two-pointers", "sliding-window", "fast-and-slow-pointers"],
        targetProjects: ["custom-kanban-board-engine"]
      },
      {
        stage: 2,
        title: "Logarithmic Search, Linked Lists & Monotonic Stacks",
        description: "Master logarithmic divide-and-conquer, in-place node operations, and stack orders.",
        duration: "Weeks 4–7",
        focusItems: [
          "Binary Search: rotated sorted arrays, binary search on answer spaces",
          "Linked Lists: in-place reversals, dummy head sentinels, merging k lists",
          "Stacks and Queues: monotonic stacks, next greater elements, histogram rectangles",
          "Intervals: sorting start times, overlapping intervals, sweep line algorithms"
        ],
        targetPatterns: ["binary-search", "linked-lists", "stacks-and-queues", "intervals"]
      },
      {
        stage: 3,
        title: "Trees, Graphs & Priority Queues",
        description: "Navigate recursive hierarchy, matrix grids, shortest paths, and streaming top-k elements.",
        duration: "Weeks 8–11",
        focusItems: [
          "Binary Trees and BSTs: post-order DFS, BFS level-order, LCA algorithms",
          "Graphs: BFS shortest paths, DFS connected components, matrix island sinking",
          "Heaps and Priority Queues: min/max heap invariants, streaming median",
          "Topological Sorting & Union-Find: DAG task ordering, cycle detection"
        ],
        targetPatterns: ["trees-and-bst", "graphs-and-traversal", "heaps-and-priority-queues", "union-find", "topological-sorting"]
      },
      {
        stage: 4,
        title: "Exhaustive Search & Dynamic Programming",
        description: "Solve complex combinatorial decision trees and overlapping subproblem optimizations.",
        duration: "Weeks 12–14",
        focusItems: [
          "Backtracking: subsets, combinations, permutations, word search pruning",
          "Greedy Algorithms: jump game reachability, interval scheduling",
          "Dynamic Programming: 1D state transitions, knapsack variations, LIS, space compression",
          "Bit Manipulation & Tries: prefix matching, bitwise masking, XOR tricks"
        ],
        targetPatterns: ["backtracking", "greedy-algorithms", "dynamic-programming", "tries", "bit-manipulation"]
      }
    ]
  }
];
