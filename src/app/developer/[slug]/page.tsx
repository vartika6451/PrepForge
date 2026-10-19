import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import {
  getTechnologies,
  getTechnologyBySlug,
  getResourcesForTech,
  getPaidCoursesForTech,
  getInterviewQuestionsForTech,
  getProjectsForTech,
} from "@/lib/data";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const technologies = getTechnologies();
  return technologies.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const tech = getTechnologyBySlug(slug);

  if (!tech) {
    return {
      title: "Technology Not Found | PrepForge",
    };
  }

  return {
    title: `${tech.name} Learning Roadmap, Interview Questions & Resources`,
    description: tech.description,
  };
}

// Stage generator for each technology
function getTechRoadmapStages(techSlug: string) {
  switch (techSlug) {
    case "javascript":
      return [
        {
          stage: "Beginner",
          title: "Language Core & Syntactic Fundamentals",
          skills: [
            "Primitives, Objects, Arrays, and Memory References",
            "Functions, Arrow Functions, and Lexical Scope",
            "DOM Tree querying and event listener delegation",
            "ES6+ Array methods (map, filter, reduce, find)",
          ],
        },
        {
          stage: "Intermediate",
          title: "Asynchronous Runtime & Prototype Delegation",
          skills: [
            "Event Loop, Microtask Queue vs Macrotasks",
            "Promises, async/await, and unhandled rejection handling",
            "Prototypal inheritance and the 'this' keyword binding rules",
            "Debounce, Throttle, and Custom Polyfills",
          ],
        },
        {
          stage: "Advanced",
          title: "V8 Engine Internals, Memory & Metaprogramming",
          skills: [
            "Garbage Collection, Mark-and-Sweep, and memory leak profiling",
            "Generators, Iterators, and Symbol protocols",
            "Proxy, Reflect, and WeakMap encapsulation",
            "Web Workers and SharedArrayBuffer concurrency",
          ],
        },
      ];
    case "typescript":
      return [
        {
          stage: "Beginner",
          title: "Basic Annotations & Interfaces",
          skills: [
            "Type annotations, interfaces vs type aliases",
            "Union & Intersection types",
            "Function signatures and optional properties",
            "Strict mode tsconfig configuration",
          ],
        },
        {
          stage: "Intermediate",
          title: "Generics & Discriminated Unions",
          skills: [
            "Generic functions, classes, and constraints (extends)",
            "Discriminated Unions for exhaustive pattern matching",
            "Type Narrowing (typeof, instanceof, user-defined type guards)",
            "Built-in utility types: Pick, Omit, Partial, Record, ReturnType",
          ],
        },
        {
          stage: "Advanced",
          title: "Conditional Types & Type-Level Programming",
          skills: [
            "Conditional types and the 'infer' keyword",
            "Template literal types and recursive tuple transformations",
            "Key remapping with 'as' in mapped types",
            "Developing published library declaration packages (.d.ts)",
          ],
        },
      ];
    case "react":
      return [
        {
          stage: "Beginner",
          title: "Component Tree & Declarative State",
          skills: [
            "JSX compilation, props, and unidirectional data flow",
            "useState, useEffect, and component render cycles",
            "Controlled form elements and event handlers",
            "Lifting state up and component composition",
          ],
        },
        {
          stage: "Intermediate",
          title: "Custom Hooks, Portals & Performance",
          skills: [
            "useMemo, useCallback, and React.memo rendering boundaries",
            "useRef for DOM measurements and mutable instance variables",
            "React Portals, Context API, and compound component patterns",
            "Client-side routing and error boundaries (componentDidCatch)",
          ],
        },
        {
          stage: "Advanced",
          title: "Fiber Reconciler & Concurrent Mode",
          skills: [
            "Fiber architecture, time-slicing, and lane priorities",
            "useTransition, useDeferredValue for responsive inputs",
            "React Server Components vs Client Components boundaries",
            "Suspense for data fetching and streaming hydration",
          ],
        },
      ];
    case "nextjs":
      return [
        {
          stage: "Beginner",
          title: "App Router Fundamentals & File Conventions",
          skills: [
            "app/ folder structure: page.tsx, layout.tsx, loading.tsx, not-found.tsx",
            "Static generation (SSG) vs Dynamic Rendering",
            "Link navigation and image optimization via next/image",
            "CSS Modules and Tailwind CSS integration",
          ],
        },
        {
          stage: "Intermediate",
          title: "Server Actions, Route Handlers & Forms",
          skills: [
            "Server Actions for direct database mutations with useActionState",
            "Route Handlers (GET/POST/DELETE) with NextRequest/NextResponse",
            "Dynamic routes, parallel routes (@slot), and intercepting routes",
            "Metadata API and dynamic Open Graph tag generation",
          ],
        },
        {
          stage: "Advanced",
          title: "Caching Tiers, PPR & Edge Deployment",
          skills: [
            "Next.js 4-tier caching architecture (Data Cache, Full Route Cache, Router Cache)",
            "Incremental Static Regeneration (ISR) and revalidateTag",
            "Partial Prerendering (PPR) with experimental React Compiler",
            "Edge runtime middleware for geo-routing and authentication",
          ],
        },
      ];
    case "nodejs":
      return [
        {
          stage: "Beginner",
          title: "Core Modules & Asynchronous Patterns",
          skills: [
            "Node.js architecture and V8 vs libuv integration",
            "Built-in modules: path, fs, os, and process",
            "CommonJS (require) vs ES Modules (import)",
            "Command-line arguments and environment variable parsing",
          ],
        },
        {
          stage: "Intermediate",
          title: "Streams, Buffers & EventEmitter",
          skills: [
            "Readable, Writable, Duplex, and Transform streams",
            "Stream backpressure regulation with highWaterMark and drain",
            "Buffer binary manipulation and memory footprint analysis",
            "EventEmitter event-driven pub/sub design patterns",
          ],
        },
        {
          stage: "Advanced",
          title: "Libuv Phases, Concurrency & Profiling",
          skills: [
            "6 Phases of libuv Event Loop: Timers, Poll, Check, Close",
            "Process clustering for multi-core socket sharing",
            "worker_threads for CPU-bound tasks and SharedArrayBuffer",
            "Heap dump profiling and native C++ addon bindings",
          ],
        },
      ];
    case "express":
      return [
        {
          stage: "Beginner",
          title: "HTTP Routing & Middleware Basics",
          skills: [
            "Express application lifecycle and req/res objects",
            "Route parameters, query strings, and body parsers",
            "Static file serving and basic CORS headers",
            "Modular router mounting via express.Router()",
          ],
        },
        {
          stage: "Intermediate",
          title: "Middleware Pipelines, Security & Zod Validation",
          skills: [
            "Composable middleware chaining and next() propagation",
            "Zod request validation for body, query, and params",
            "Security headers with Helmet and express-rate-limit",
            "Centralized error handling middleware (err, req, res, next)",
          ],
        },
        {
          stage: "Advanced",
          title: "Production Architecture & Microservices",
          skills: [
            "JWT access/refresh token rotation with httpOnly cookies",
            "RFC 7807 Problem Details structured error responses",
            "Connection pooling integration with PostgreSQL and Redis",
            "Automated integration testing with Supertest and Vitest",
          ],
        },
      ];
    case "postgresql":
      return [
        {
          stage: "Beginner",
          title: "Relational Modeling & Core SQL",
          skills: [
            "Tables, primary keys, foreign keys, and unique constraints",
            "CRUD operations: SELECT, INSERT, UPDATE, DELETE",
            "JOIN operations: INNER, LEFT, RIGHT, FULL OUTER",
            "Aggregation functions: GROUP BY, HAVING, COUNT, SUM",
          ],
        },
        {
          stage: "Intermediate",
          title: "Indexes, Transactions & Constraints",
          skills: [
            "B-Tree indexing fundamentals and compound index column order",
            "ACID transactions: BEGIN, COMMIT, ROLLBACK",
            "Transaction isolation levels: Read Committed vs Serializable",
            "Common Table Expressions (WITH CTE) and Window Functions",
          ],
        },
        {
          stage: "Advanced",
          title: "Query Optimization & High Concurrency",
          skills: [
            "EXPLAIN ANALYZE execution plan breakdown and cost estimation",
            "GIN indexes for JSONB documents and full-text search",
            "Table range partitioning and Row-Level Security (RLS)",
            "Connection pool sizing with PgBouncer and vacuum maintenance",
          ],
        },
      ];
    case "git":
      return [
        {
          stage: "Beginner",
          title: "Version Tracking & Working Trees",
          skills: [
            "Git storage model: Working directory, Staging area, Git repository",
            "git init, add, commit, status, and diff inspection",
            "Branching basics: git branch, checkout, switch",
            "Remote synchronization: git clone, push, pull, and fetch",
          ],
        },
        {
          stage: "Intermediate",
          title: "Branch Strategies & Conflict Resolution",
          skills: [
            "Merge vs Rebase trade-offs and best practices",
            "Resolving merge conflicts and three-way diff inspection",
            "Interactive rebasing (git rebase -i) for commit squashing",
            "Stashing, cherry-picking, and git reflog recovery",
          ],
        },
        {
          stage: "Advanced",
          title: "Git Internals & CI/CD Automation",
          skills: [
            "Content-addressable storage: Blobs, Trees, Commits, and Annotated Tags",
            "Detached HEAD state and git reset soft vs mixed vs hard",
            "Trunk-based development and GitHub pull request workflows",
            "GitHub Actions CI/CD pipelines, secret handling, and release tags",
          ],
        },
      ];
    default:
      // system-design
      return [
        {
          stage: "Beginner",
          title: "Scalability Principles & Basic Architecture",
          skills: [
            "Vertical vs Horizontal scaling trade-offs",
            "Load balancers: Round Robin, Least Connections, IP Hash",
            "DNS resolution, reverse proxies (Nginx/HAProxy)",
            "Stateless web tiers and session storage",
          ],
        },
        {
          stage: "Intermediate",
          title: "Caching, Databases & Asynchronous Queues",
          skills: [
            "Redis/Memcached: Cache-Aside, Write-Through, Write-Behind",
            "Database replication: Master-Slave vs Multi-Master topologies",
            "Message queues: RabbitMQ and Kafka for decoupling services",
            "CAP theorem, PACELC theorem, and eventual consistency",
          ],
        },
        {
          stage: "Advanced",
          title: "Distributed Coordination & Partitioning",
          skills: [
            "Consistent Hashing for distributed cache node clusters",
            "Database sharding strategies: Range-based vs Hash-based",
            "Distributed rate limiting with Token Bucket & Redis Lua scripts",
            "Idempotency keys, distributed locks (Redlock), and circuit breakers",
          ],
        },
      ];
  }
}

export default async function TechnologyDetailPage(props: PageProps) {
  const { slug } = await props.params;
  const tech = getTechnologyBySlug(slug);

  if (!tech) {
    notFound();
  }

  const freeResources = getResourcesForTech(slug);
  const paidCourses = getPaidCoursesForTech(slug);
  const interviewQuestions = getInterviewQuestionsForTech(slug);
  const projects = getProjectsForTech(slug);
  const roadmapStages = getTechRoadmapStages(slug);

  return (
    <div className="min-h-screen bg-[#AAA7A3] text-[#272624]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 space-y-16">
        {/* Breadcrumb Navigation */}
        <nav
          className="flex items-center gap-2 text-xs font-mono text-[#383431]"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-[#272624] transition">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#5A5652]" />
          <Link href="/developer" className="hover:text-[#272624] transition">
            Developer Hub
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#5A5652]" />
          <span className="text-[#A34823] font-semibold">{tech.name}</span>
        </nav>

        {/* Header Banner */}
        <div className="p-8 rounded-3xl border border-[#99958E] bg-[#CFCCC6] space-y-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs px-2.5 py-1 rounded-full font-mono font-medium border border-[#A34823]/30 bg-[#C9A28E]/40 text-[#A34823]">
              {tech.category}
            </span>
            <div className="flex items-center gap-3 text-xs text-[#383431] font-mono">
              <span>{freeResources.length} Free Guides</span>
              <span>•</span>
              <span>{interviewQuestions.length} Interview Qs</span>
              <span>•</span>
              <span>{projects.length} Projects</span>
            </div>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#272624] tracking-tight">
              {tech.name} Masterclass
            </h1>
            <p className="text-lg text-[#A34823] font-medium mt-2">
              {tech.tagline}
            </p>
            <p className="text-sm text-[#383431] mt-2 max-w-3xl leading-relaxed">
              {tech.description}
            </p>
          </div>

          {/* Quick jump nav anchors */}
          <div className="flex flex-wrap gap-2 pt-4 border-t border-[#99958E] text-xs">
            <a
              href="#roadmap"
              className="px-3 py-1.5 rounded-lg bg-[#BBB7B0] text-[#272624] hover:bg-[#A59B9F] border border-[#99958E] transition"
            >
              A. Roadmap
            </a>
            <a
              href="#free-resources"
              className="px-3 py-1.5 rounded-lg bg-[#BBB7B0] text-[#272624] hover:bg-[#A59B9F] border border-[#99958E] transition"
            >
              B. Free Resources ({freeResources.length})
            </a>
            <a
              href="#paid-courses"
              className="px-3 py-1.5 rounded-lg bg-[#BBB7B0] text-[#272624] hover:bg-[#A59B9F] border border-[#99958E] transition"
            >
              C. Paid Courses ({paidCourses.length})
            </a>
            <a
              href="#interview-questions"
              className="px-3 py-1.5 rounded-lg bg-[#BBB7B0] text-[#272624] hover:bg-[#A59B9F] border border-[#99958E] transition"
            >
              D. Interview Questions ({interviewQuestions.length})
            </a>
            <a
              href="#projects"
              className="px-3 py-1.5 rounded-lg bg-[#BBB7B0] text-[#272624] hover:bg-[#A59B9F] border border-[#99958E] transition"
            >
              E. Projects ({projects.length})
            </a>
          </div>
        </div>

        {/* SECTION A: LEARNING ROADMAP */}
        <section id="roadmap" className="space-y-6 scroll-mt-20">
          <div className="border-b border-[#99958E] pb-4">
            <span className="text-xs font-mono text-[#A34823] uppercase tracking-wider font-semibold">
              Section A
            </span>
            <h2 className="text-2xl font-bold text-[#272624] mt-1">
              Structured Learning Roadmap
            </h2>
            <p className="text-xs text-[#383431] mt-1">
              Progress through {tech.name} mastery from basic syntax to production architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roadmapStages.map((st, idx) => (
              <div
                key={st.stage}
                className="p-6 rounded-2xl border border-[#99958E] bg-[#CFCCC6] space-y-4 relative shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase bg-[#BBB7B0] text-[#A34823] border border-[#99958E]">
                    Level 0{idx + 1}
                  </span>
                  <span className="text-xs font-mono text-[#383431]">{st.stage}</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#272624]">{st.title}</h3>
                </div>

                <ul className="space-y-2 text-xs text-[#383431]">
                  {st.skills.map((skill, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#A34823] mt-0.5 shrink-0" />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION B: FREE LEARNING RESOURCES */}
        <section id="free-resources" className="space-y-6 scroll-mt-20">
          <div className="border-b border-[#99958E] pb-4">
            <span className="text-xs font-mono text-[#A34823] uppercase tracking-wider font-semibold">
              Section B
            </span>
            <h2 className="text-2xl font-bold text-[#272624] mt-1">
              Free Official Documentation &amp; Curated Tutorials ({freeResources.length})
            </h2>
            <p className="text-xs text-[#383431] mt-1">
              Authoritative industry references, official handbooks, and interactive sandbox guides.
            </p>
          </div>

          {freeResources.length === 0 ? (
            <p className="text-xs text-[#383431] py-6">Official documentation links being verified.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {freeResources.map((res) => (
                <div
                  key={res.id}
                  className="p-6 rounded-2xl border border-[#99958E] bg-[#CFCCC6] hover:bg-[#BBB7B0] transition flex flex-col justify-between space-y-4 shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono text-[#A34823] bg-[#C9A28E]/40 border border-[#A34823]/30">
                        {res.resourceType}
                      </span>
                      <span className="text-[10px] font-mono text-[#383431]">
                        {res.level}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#272624]">
                      {res.title}
                    </h3>

                    <p className="text-xs text-[#383431] leading-relaxed">
                      {res.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#99958E] flex items-center justify-between text-xs">
                    <span className="text-[#383431] font-mono text-[11px] truncate max-w-[160px]">
                      {res.provider}
                    </span>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-[#A34823] hover:underline"
                    >
                      <span>Visit Resource</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SECTION C: PAID COURSES */}
        <section id="paid-courses" className="space-y-6 scroll-mt-20">
          <div className="border-b border-[#99958E] pb-4">
            <span className="text-xs font-mono text-[#A34823] uppercase tracking-wider font-semibold">
              Section C
            </span>
            <h2 className="text-2xl font-bold text-[#272624] mt-1">
              Verified Paid Courses ({paidCourses.length})
            </h2>
            <p className="text-xs text-[#383431] mt-1">
              Top-rated commercial instruction from recognized industry authors with verified course scopes.
            </p>
          </div>

          {paidCourses.length === 0 ? (
            <div className="p-6 rounded-2xl border border-[#99958E] bg-[#CFCCC6] text-[#383431] text-xs">
              Free official documentation is currently recommended as the primary source for {tech.name}.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {paidCourses.map((c) => (
                <div
                  key={c.id}
                  className="p-6 rounded-2xl border border-[#99958E] bg-[#CFCCC6] hover:bg-[#BBB7B0] transition flex flex-col justify-between space-y-4 shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-[#A34823] bg-[#C9A28E]/40 border border-[#A34823]/30 px-2.5 py-0.5 rounded-full font-medium">
                        {c.pricingCategory} • {c.level}
                      </span>
                      <span className="text-xs font-mono text-[#383431]">{c.provider}</span>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-[#272624]">{c.title}</h3>
                      <p className="text-xs text-[#383431] mt-1">
                        Instructor: <strong className="text-[#272624]">{c.instructor}</strong>
                      </p>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-mono text-[#383431] uppercase font-semibold">
                        Coverage Highlights:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {c.topicCoverage.map((topic) => (
                          <span
                            key={topic}
                            className="text-[10px] px-2 py-0.5 rounded bg-[#BBB7B0] text-[#272624] border border-[#99958E] font-mono"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#99958E] flex justify-end">
                    <a
                      href={c.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#A34823] hover:bg-[#8F3D1C] transition cursor-pointer"
                    >
                      <span>View Official Course Page</span>
                      <ExternalLink className="w-3.5 h-3.5 text-white" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SECTION D: INTERVIEW QUESTIONS */}
        <section id="interview-questions" className="space-y-6 scroll-mt-20">
          <div className="border-b border-[#99958E] pb-4">
            <span className="text-xs font-mono text-[#A34823] uppercase tracking-wider font-semibold">
              Section D
            </span>
            <h2 className="text-2xl font-bold text-[#272624] mt-1">
              Frequently Asked Interview Questions ({interviewQuestions.length})
            </h2>
            <p className="text-xs text-[#383431] mt-1">
              Deep-dive technical questions organized by topic with original explanations and code snippets.
            </p>
          </div>

          {interviewQuestions.length === 0 ? (
            <div className="p-6 rounded-2xl border border-[#99958E] bg-[#CFCCC6] text-[#383431] text-xs">
              Interview questions for {tech.name} are currently being added. Explore other topics in the Interview Questions directory.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {interviewQuestions.map((iq) => (
                <Link
                  key={iq.id}
                  href={`/interview-questions/${iq.technologySlug}/${iq.slug}`}
                  className="group p-6 rounded-2xl border border-[#99958E] bg-[#CFCCC6] hover:bg-[#BBB7B0] hover:border-[#A34823]/50 transition flex flex-col justify-between space-y-4 shadow-sm"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[#A34823] uppercase font-semibold">
                        {iq.topic}
                      </span>
                      <span className="text-[#5A5652]">•</span>
                      <DifficultyBadge difficulty={iq.difficulty} />
                    </div>

                    <h3 className="text-base font-bold text-[#272624] group-hover:text-[#A34823] transition">
                      {iq.title}
                    </h3>

                    <p className="text-xs text-[#383431] line-clamp-3 leading-relaxed">
                      {iq.explanation}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#99958E] flex items-center justify-between text-xs text-[#383431] font-mono">
                    <span>{iq.keyTakeaways.length} Key Takeaways</span>
                    <span className="text-[#A34823] group-hover:translate-x-1 transition flex items-center gap-1 font-sans font-medium">
                      Read Explanation <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* SECTION E: PROJECTS */}
        <section id="projects" className="space-y-6 scroll-mt-20">
          <div className="border-b border-[#99958E] pb-4">
            <span className="text-xs font-mono text-[#A34823] uppercase tracking-wider font-semibold">
              Section E
            </span>
            <h2 className="text-2xl font-bold text-[#272624] mt-1">
              Applied Portfolio Projects ({projects.length})
            </h2>
            <p className="text-xs text-[#383431] mt-1">
              Real-world software projects that put {tech.name} into practice with concrete implementation milestones.
            </p>
          </div>

          {projects.length === 0 ? (
            <div className="p-6 rounded-2xl border border-[#99958E] bg-[#CFCCC6] text-[#383431] text-xs">
              Visit the Project Lab to explore multi-technology full-stack blueprints.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((proj) => (
                <Link
                  key={proj.id}
                  href={`/projects/${proj.slug}`}
                  className="group p-6 rounded-2xl border border-[#99958E] bg-[#CFCCC6] hover:bg-[#BBB7B0] hover:border-[#A34823]/50 transition flex flex-col justify-between space-y-4 shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-[#A34823] font-medium">
                        {proj.category}
                      </span>
                      <DifficultyBadge difficulty={proj.difficulty} />
                    </div>

                    <h3 className="text-base font-bold text-[#272624] group-hover:text-[#A34823] transition">
                      {proj.title}
                    </h3>

                    <p className="text-xs text-[#383431] line-clamp-3 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#99958E] flex items-center justify-between text-xs text-[#383431]">
                    <span>{proj.milestones.length} Implementation Phases</span>
                    <span className="text-[#A34823] group-hover:translate-x-1 transition flex items-center gap-1 font-medium">
                      View Blueprint <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Back button */}
        <div className="pt-8 border-t border-[#99958E] flex justify-between items-center text-xs">
          <Link
            href="/developer"
            className="inline-flex items-center gap-1.5 text-[#383431] hover:text-[#272624] transition font-medium"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span>Back to Web Development Hub</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
