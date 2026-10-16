import { Technology } from "@/types";

export const TECHNOLOGIES: Technology[] = [
  {
    id: "tech-js",
    slug: "javascript",
    name: "JavaScript",
    category: "Languages",
    sortOrder: 1,
    iconName: "Code2",
    colorClass: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    tagline: "The foundation of web applications and full-stack runtime engineering.",
    description:
      "Deep dive into JavaScript runtime execution: asynchronous event loop microtask queuing, lexical scope, prototypal inheritance, memory garbage collection, and modern ESNext features."
  },
  {
    id: "tech-ts",
    slug: "typescript",
    name: "TypeScript",
    category: "Languages",
    sortOrder: 2,
    iconName: "FileCode",
    colorClass: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    tagline: "Type-safe JavaScript at production scale.",
    description:
      "Master static typing, generics, discriminated unions, utility types, conditional types, template literals, and robust compile-time contract definitions for web applications."
  },
  {
    id: "tech-react",
    slug: "react",
    name: "React",
    category: "Frontend",
    sortOrder: 3,
    iconName: "Atom",
    colorClass: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    tagline: "Declarative, component-driven user interface engineering.",
    description:
      "Understand fiber reconciliation, hooks internals, state batching, server components, render lifecycles, memoization boundaries, and concurrent rendering architectures."
  },
  {
    id: "tech-nextjs",
    slug: "nextjs",
    name: "Next.js",
    category: "Frontend",
    sortOrder: 4,
    iconName: "Globe",
    colorClass: "text-zinc-200 bg-zinc-500/10 border-zinc-500/20",
    tagline: "The full-stack React framework with App Router & Server Components.",
    description:
      "Learn App Router conventions, React Server Components (RSC), streaming SSR, Server Actions, route handlers, partial prerendering (PPR), Turbopack, and edge caching."
  },
  {
    id: "tech-nodejs",
    slug: "nodejs",
    name: "Node.js",
    category: "Backend",
    sortOrder: 5,
    iconName: "Server",
    colorClass: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    tagline: "High-throughput asynchronous server-side runtime powered by V8.",
    description:
      "Grasp libuv architecture, event loop phases, Streams & Buffers, EventEmitter, Worker Threads, clustering, memory leaks, child processes, and resilient microservice design."
  },
  {
    id: "tech-express",
    slug: "express",
    name: "Express.js",
    category: "Backend",
    sortOrder: 6,
    iconName: "Cpu",
    colorClass: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    tagline: "Fast, unopinionated, minimalist web framework for Node.js.",
    description:
      "Build secure RESTful API layers, composable middleware pipelines, centralized error handling systems, authentication flows, rate limiting, and request validation."
  },
  {
    id: "tech-postgresql",
    slug: "postgresql",
    name: "PostgreSQL and SQL",
    category: "Data & Systems",
    sortOrder: 7,
    iconName: "Database",
    colorClass: "text-sky-400 bg-sky-500/10 border-sky-500/20",
    tagline: "Advanced relational database engineering and ACID transactions.",
    description:
      "Master relational modeling, B-Tree and GIN indexing strategies, EXPLAIN ANALYZE query planning, transaction isolation levels, connection pooling, and Prisma ORM integration."
  },
  {
    id: "tech-git",
    slug: "git",
    name: "Git and GitHub",
    category: "DevOps & Tools",
    sortOrder: 8,
    iconName: "GitBranch",
    colorClass: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    tagline: "Distributed version control, collaborative workflows, and CI/CD.",
    description:
      "Master content-addressable storage (blobs, trees, commits), interactive rebasing, merge conflict resolution, trunk-based development, GitHub Actions pipelines, and release flows."
  },
  {
    id: "tech-system-design",
    slug: "system-design",
    name: "System Design",
    category: "Data & Systems",
    sortOrder: 9,
    iconName: "Layers",
    colorClass: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    tagline: "Architecting reliable, scalable, high-availability distributed systems.",
    description:
      "Learn load balancing, horizontal scalability, CAP theorem trade-offs, caching strategies (Redis), message queues (Kafka/RabbitMQ), database sharding, and fault tolerance."
  }
];
