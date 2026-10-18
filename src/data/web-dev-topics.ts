import { WebDevTopicMeta } from "@/types/web-dev";

export const WEB_DEV_TOPICS: WebDevTopicMeta[] = [
  {
    id: "javascript-typescript",
    name: "JavaScript & TypeScript",
    shortDescription: "Event loops, closures, async runtimes, type systems, and ESNext paradigms.",
    iconName: "Code2",
  },
  {
    id: "react",
    name: "React",
    shortDescription: "Reconciliation, hooks lifecycle, concurrency, state patterns, and memoization.",
    iconName: "Layers",
  },
  {
    id: "browser-css",
    name: "Browser, HTML & CSS",
    shortDescription: "DOM APIs, accessibility tree, rendering pipeline, layouts, and web standards.",
    iconName: "Globe",
  },
  {
    id: "backend-apis",
    name: "Backend & APIs",
    shortDescription: "REST & GraphQL design, auth flows, idempotency, caching, and microservices.",
    iconName: "Server",
  },
  {
    id: "databases-security",
    name: "Databases & Security",
    shortDescription: "Indexing, SQL queries, connection pooling, OWASP top 10, CORS, and data safety.",
    iconName: "Database",
  },
  {
    id: "performance-testing",
    name: "Performance & Testing",
    shortDescription: "Core Web Vitals, bundle optimization, unit/integration testing, and profiling.",
    iconName: "Gauge",
  },
];
