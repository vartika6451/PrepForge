import { InterviewQuestion } from "@/types";

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  // JavaScript Questions
  {
    id: "iq-js-1",
    slug: "closures-in-javascript",
    title: "What is a Closure, and how is it used in production JavaScript?",
    technologySlug: "javascript",
    topic: "Closures",
    difficulty: "Medium",
    explanation:
      "A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). In JavaScript, every function retains access to the scope in which it was declared, even when that function is invoked outside of its original lexical scope.\n\nIn production, closures are used for data privacy (encapsulating state that cannot be touched from outside), function currying and partial application, memoization caches, and factory functions.",
    codeExample: `function createRateLimiter(maxCalls: number, windowMs: number) {
  let callTimestamps: number[] = []; // Enclosed private state

  return function attemptCall(): boolean {
    const now = Date.now();
    // Prune timestamps older than windowMs
    callTimestamps = callTimestamps.filter(time => now - time < windowMs);

    if (callTimestamps.length < maxCalls) {
      callTimestamps.push(now);
      return true; // Allowed
    }
    return false; // Rate limited
  };
}

const limiter = createRateLimiter(3, 1000);
console.log(limiter()); // true
console.log(limiter()); // true
console.log(limiter()); // true
console.log(limiter()); // false (rate limited)`,
    outputPrediction: "true\ntrue\ntrue\nfalse",
    keyTakeaways: [
      "Functions preserve references to outer variables, not static value copies.",
      "Variables are kept in heap memory as long as the inner closure function is referenced.",
      "Beware of accidental memory leaks if long-lived closures capture large outer data structures."
    ],
    relatedQuestionSlugs: ["event-loop-microtasks-macrotasks", "debouncing-and-throttling"]
  },
  {
    id: "iq-js-2",
    slug: "event-loop-microtasks-macrotasks",
    title: "Explain the JavaScript Event Loop, Microtasks, and Macrotasks",
    technologySlug: "javascript",
    topic: "Event Loop",
    difficulty: "Hard",
    explanation:
      "JavaScript is single-threaded, with a call stack, a heap, a microtask queue (Promises, queueMicrotask, MutationObserver), and a macrotask/task queue (setTimeout, setInterval, setImmediate, I/O).\n\nWhen the call stack empties, the event loop drains the entire microtask queue before fetching the next macrotask. Any microtask scheduled while processing microtasks is executed in the same iteration, which can starve macrotasks if an infinite microtask chain is created.",
    codeExample: `console.log("1: Synchronous start");

setTimeout(() => {
  console.log("2: Macrotask (setTimeout)");
}, 0);

Promise.resolve()
  .then(() => {
    console.log("3: Microtask 1");
  })
  .then(() => {
    console.log("4: Microtask 2");
  });

console.log("5: Synchronous end");`,
    outputPrediction: `1: Synchronous start
5: Synchronous end
3: Microtask 1
4: Microtask 2
2: Macrotask (setTimeout)`,
    keyTakeaways: [
      "Synchronous code in the call stack runs first to completion.",
      "Microtasks (Promise callbacks) run immediately after call stack empties and before any macrotask.",
      "All microtasks must finish before the browser renders or processes the next macrotask."
    ],
    relatedQuestionSlugs: ["closures-in-javascript", "promises-vs-async-await"]
  },
  {
    id: "iq-js-3",
    slug: "debouncing-and-throttling",
    title: "Implement Debounce and Throttle from scratch and explain their differences",
    technologySlug: "javascript",
    topic: "Performance & Polyfills",
    difficulty: "Medium",
    explanation:
      "Debounce delays the invocation of a function until a specified period of silence has elapsed since the last time it was called. It is ideal for search auto-complete inputs or window resizing.\n\nThrottle limits the maximum rate of invocation, ensuring the function runs at most once in a specified time window, regardless of how many times the trigger occurs. It is ideal for scroll handlers, infinite feeds, or mouse tracking.",
    codeExample: `// Debounce implementation
function debounce<T extends (...args: any[]) => void>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return function (...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}

// Throttle implementation
function throttle<T extends (...args: any[]) => void>(fn: T, limit: number) {
  let inThrottle = false;
  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}`,
    outputPrediction: "Debounce triggers only after typing pauses; Throttle triggers steadily every X milliseconds.",
    keyTakeaways: [
      "Debounce resets its internal timer on every invocation.",
      "Throttle locks invocation until a cooldown duration passes.",
      "Both rely on closures to store the timer/cooldown state across calls."
    ],
    relatedQuestionSlugs: ["closures-in-javascript"]
  },
  {
    id: "iq-js-4",
    slug: "this-keyword-binding-rules",
    title: "How does the 'this' keyword work in JavaScript, and what are its 4 binding rules?",
    technologySlug: "javascript",
    topic: "The this keyword",
    difficulty: "Medium",
    explanation:
      "The value of 'this' is determined at call-time (execution context), not declaration-time (except for arrow functions):\n\n1. Default Binding: In non-strict mode, global object (window/global); in strict mode, undefined.\n2. Implicit Binding: When a function is called as an object method (obj.fn()), 'this' points to obj.\n3. Explicit Binding: Using .call(), .apply(), or .bind() explicitly specifies the context.\n4. New Binding: When invoked with the 'new' keyword, 'this' refers to the newly instantiated instance.\n\nArrow functions do NOT have their own 'this'; they inherit it lexically from their enclosing scope.",
    codeExample: `const obj = {
  name: "PrepForge",
  regularFn() {
    console.log("regular:", this.name);
  },
  arrowFn: () => {
    console.log("arrow:", this?.name);
  }
};

obj.regularFn(); // "regular: PrepForge"
obj.arrowFn();   // "arrow: undefined" (or global)

const detached = obj.regularFn;
detached(); // undefined (in strict mode)`
  ,
    outputPrediction: `regular: PrepForge
arrow: undefined
TypeError: Cannot read properties of undefined (reading 'name')`,
    keyTakeaways: [
      "Arrow functions cannot be bound with .call, .apply, or .bind; their this is strictly lexical.",
      "Detaching a method loses implicit binding, reverting to default binding (undefined in strict mode).",
      "Function constructors with 'new' override implicit and explicit bindings."
    ],
    relatedQuestionSlugs: ["prototypes-and-prototypal-inheritance"]
  },
  {
    id: "iq-js-5",
    slug: "prototypes-and-prototypal-inheritance",
    title: "How does Prototypal Inheritance work in JavaScript vs Classical OOP?",
    technologySlug: "javascript",
    topic: "Prototypes and Inheritance",
    difficulty: "Medium",
    explanation:
      "JavaScript does not have traditional classes underneath. Classes introduced in ES6 are syntactic sugar over prototypal delegation. Every JavaScript object has an internal slot called [[Prototype]] (accessible via Object.getPrototypeOf(obj) or __proto__).\n\nWhen a property or method is accessed on an object and is not found on that instance, the JS engine traverses up the prototype chain until it finds the property or reaches null (Object.prototype.__proto__ is null).",
    codeExample: `function Developer(name: string) {
  this.name = name;
}

Developer.prototype.code = function () {
  return \`\${this.name} is building features\`;
};

const dev = new (Developer as any)("Vartika");

console.log(dev.hasOwnProperty("name")); // true (own property)
console.log(dev.hasOwnProperty("code")); // false (inherited on prototype)
console.log(dev.code()); // "Vartika is building features"
console.log(Object.getPrototypeOf(dev) === Developer.prototype); // true`,
    outputPrediction: `true
false
Vartika is building features
true`,
    keyTakeaways: [
      "Prototypes enable memory sharing: all instances share the exact same method function instance on Developer.prototype.",
      "The prototype chain lookup is dynamic: modifying the prototype updates all instances immediately.",
      "Object.create(proto) allows direct prototype link establishment without invoking a constructor."
    ],
    relatedQuestionSlugs: ["this-keyword-binding-rules"]
  },

  // Node.js Questions
  {
    id: "iq-node-1",
    slug: "nodejs-event-loop-phases",
    title: "Detail the 6 phases of the Node.js libuv Event Loop and process.nextTick()",
    technologySlug: "nodejs",
    topic: "Event Loop and Asynchronous Operations",
    difficulty: "Hard",
    explanation:
      "Node.js event loop runs on libuv and cycles through 6 distinct phases in order:\n\n1. Timers: executes callbacks scheduled by setTimeout() and setInterval().\n2. Pending Callbacks: executes I/O callbacks deferred to the next loop iteration (e.g., system errors like ECONNREFUSED).\n3. Idle, Prepare: internal libuv use only.\n4. Poll: retrieves new I/O events, executes I/O callbacks, and blocks waiting for connections when appropriate.\n5. Check: executes callbacks registered via setImmediate().\n6. Close Callbacks: executes close events like socket.on('close').\n\nprocess.nextTick() is not part of the event loop proper; its queue is processed immediately after the current operation completes, regardless of the active phase.",
    codeExample: `setImmediate(() => {
  console.log("1: setImmediate (Check phase)");
});

setTimeout(() => {
  console.log("2: setTimeout (Timers phase)");
}, 0);

process.nextTick(() => {
  console.log("3: process.nextTick (Microtask boundary)");
});

Promise.resolve().then(() => {
  console.log("4: Promise microtask");
});`,
    outputPrediction: `3: process.nextTick (Microtask boundary)
4: Promise microtask
2: setTimeout (Timers phase)
1: setImmediate (Check phase)`,
    keyTakeaways: [
      "process.nextTick() fires before Promise microtasks, and microtasks fire before advancing to the next event loop phase.",
      "Inside an I/O cycle (e.g. fs.readFile), setImmediate() always executes before setTimeout(fn, 0).",
      "Recursive process.nextTick() can starve the event loop entirely, preventing any I/O from occurring."
    ],
    relatedQuestionSlugs: ["event-loop-microtasks-macrotasks", "streams-and-backpressure-in-nodejs"]
  },
  {
    id: "iq-node-2",
    slug: "streams-and-backpressure-in-nodejs",
    title: "How do Node.js Streams work, and how do you handle Backpressure?",
    technologySlug: "nodejs",
    topic: "Streams and Buffers",
    difficulty: "Hard",
    explanation:
      "Streams are collections of data that might not be available all at once and fit into memory sequentially. The 4 types are: Readable, Writable, Duplex, and Transform.\n\nBackpressure occurs when the consumer (Writable stream) is slower than the producer (Readable stream). If not regulated, unconsumed chunks accumulate in RAM, leading to memory bloat or out-of-memory crashes.\n\nBackpressure handling is achieved when writable.write(chunk) returns false (internal buffer reached highWaterMark). The readable stream should pause, listen for the 'drain' event on the writable, and resume reading only when drained.",
    codeExample: `import { createReadStream, createWriteStream } from "fs";
import { pipeline } from "stream/promises";

// Safe production pattern using stream pipeline
async function copyLargeFile(source: string, destination: string) {
  try {
    await pipeline(
      createReadStream(source),       // Fast producer
      createWriteStream(destination)  // Automatically coordinates backpressure & drain
    );
    console.log("Transfer finished without memory spikes.");
  } catch (err) {
    console.error("Stream pipeline failed:", err);
  }
}`,
    outputPrediction: "Transfer finished without memory spikes.",
    keyTakeaways: [
      "Use pipeline() from 'stream/promises' instead of .pipe() because pipeline guarantees cleanup and proper error forwarding.",
      "Default highWaterMark is 16KB for object mode and 64KB for byte streams.",
      "Backpressure coordination prevents Node.js processes from crashing on gigabyte-scale data transfers."
    ],
    relatedQuestionSlugs: ["nodejs-event-loop-phases"]
  },
  {
    id: "iq-node-3",
    slug: "worker-threads-vs-cluster-module",
    title: "Compare Worker Threads vs Cluster Module in Node.js for high concurrency",
    technologySlug: "nodejs",
    topic: "Worker Threads and Clustering",
    difficulty: "Hard",
    explanation:
      "The Cluster module forks the Node.js process into multiple separate operating system processes (one per CPU core) that share the same server port via OS socket sharing. Each worker has its own independent V8 instance, memory heap, and event loop. Processes communicate via IPC.\n\nWorker Threads ('worker_threads' module) spawn multiple threads within the same single OS process. They share the same process memory space and can share memory directly using SharedArrayBuffer without serialization overhead.\n\nRule of thumb: Use Cluster for horizontal scaling of I/O-bound web servers; use Worker Threads for CPU-bound computations (image processing, crypto hashing, complex sorting).",
    codeExample: `// Worker Thread example for CPU-intensive task
import { Worker, isMainThread, parentPort, workerData } from "worker_threads";

if (isMainThread) {
  const worker = new Worker(__filename, { workerData: { n: 42 } });
  worker.on("message", result => console.log("Calculated in background thread:", result));
} else {
  // Compute CPU heavy Fibonacci
  function fib(n: number): number {
    return n <= 1 ? n : fib(n - 1) + fib(n - 2);
  }
  const result = fib(workerData.n);
  parentPort?.postMessage(result);
}`,
    outputPrediction: "Calculated in background thread: 267914296",
    keyTakeaways: [
      "Cluster scales across cores for I/O requests with zero shared state.",
      "Worker Threads prevent CPU-intensive calculations from blocking the main thread event loop.",
      "SharedArrayBuffer with Atomics enables lock-free shared memory access between Worker Threads."
    ],
    relatedQuestionSlugs: ["nodejs-event-loop-phases"]
  },

  // React Questions
  {
    id: "iq-react-1",
    slug: "react-fiber-reconciliation-architecture",
    title: "How does React Fiber reconciliation work, and why was it introduced?",
    technologySlug: "react",
    topic: "Fiber Architecture",
    difficulty: "Hard",
    explanation:
      "The original React Stack reconciler was synchronous and recursive. Once a render started, it could not be interrupted, which dropped frames and made interfaces sluggish during heavy updates.\n\nReact Fiber is a reimplementation of the reconciler. Each React element is represented as a Fiber node in a singly linked tree (child, sibling, return pointers). This allows React to break rendering work into units of work that can be paused, prioritized, aborted, or resumed between browser animation frames (via Concurrent Mode / requestIdleCallback).",
    codeExample: `// Conceptual representation of a Fiber node structure
interface FiberNode {
  tag: number;              // Component type (Function, Host, etc.)
  key: string | null;
  stateNode: any;           // DOM node or class instance
  child: FiberNode | null;  // First child
  sibling: FiberNode | null;// Next sibling
  return: FiberNode | null; // Parent fiber
  pendingProps: any;
  memoizedState: any;       // Linked list of hook states
  lanes: number;            // Priority bitmask
  alternate: FiberNode | null; // Work-in-progress fiber link (double buffering)
}`,
    outputPrediction: "Fiber tree uses a double-buffering algorithm (current vs work-in-progress) before committing to DOM.",
    keyTakeaways: [
      "Fiber enables time-slicing and interruptible rendering.",
      "Double buffering: changes are prepared in the workInProgress tree and swapped in a single synchronous commit phase.",
      "Hooks are stored as a singly linked list inside fiber.memoizedState."
    ],
    relatedQuestionSlugs: ["react-server-components-vs-client-components"]
  },
  {
    id: "iq-react-2",
    slug: "useeffect-vs-uselayouteffect",
    title: "What is the difference between useEffect and useLayoutEffect?",
    technologySlug: "react",
    topic: "Hooks Lifecycle",
    difficulty: "Medium",
    explanation:
      "useEffect runs asynchronously after the browser paints screen changes. It does not block painting, making it optimal for data fetching, timers, and non-visual side effects.\n\nuseLayoutEffect runs synchronously immediately after DOM mutations but BEFORE the browser paints. It blocks visual paint, making it essential when measuring DOM dimensions (getBoundingClientRect) or adjusting scroll position to prevent visual flickering.",
    codeExample: `import { useState, useLayoutEffect, useRef } from "react";

function Tooltip({ targetRect }: { targetRect: DOMRect }) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    // Read DOM layout and recalculate synchronously BEFORE browser paints
    if (tooltipRef.current) {
      const height = tooltipRef.current.offsetHeight;
      setPosition({
        top: targetRect.top - height - 8,
        left: targetRect.left
      });
    }
  }, [targetRect]);

  return <div ref={tooltipRef} style={{ position: "fixed", ...position }}>Tooltip</div>;
}`,
    outputPrediction: "useLayoutEffect eliminates layout flicker by updating state before the browser paints pixels.",
    keyTakeaways: [
      "99% of side effects should use useEffect to keep rendering responsive.",
      "useLayoutEffect is reserved for layout measurements that immediately mutate state or DOM.",
      "In SSR (Server Side Rendering), useLayoutEffect produces warnings because server has no DOM."
    ],
    relatedQuestionSlugs: ["react-fiber-reconciliation-architecture"]
  },

  // Next.js Questions
  {
    id: "iq-next-1",
    slug: "react-server-components-vs-client-components",
    title: "How do React Server Components (RSC) work in Next.js App Router?",
    technologySlug: "nextjs",
    topic: "React Server Components",
    difficulty: "Medium",
    explanation:
      "In Next.js App Router, components are React Server Components by default. RSCs execute exclusively on the server and never ship their JavaScript bundles to the browser client. They can directly query databases, read the filesystem, and use heavy node libraries with zero client bundle impact.\n\nClient Components (declared with 'use client') are rendered on the server during SSR for initial HTML, then hydrated on the client with interactivity (useState, useEffect, event handlers). They represent leaves in the component tree.",
    codeExample: `// app/users/page.tsx (Server Component - 0 KB client JS)
import prisma from "@/lib/prisma";
import UserCardClient from "./UserCardClient";

export default async function UsersPage() {
  // Direct database query on server without an API route
  const users = await prisma.user.findMany();

  return (
    <div>
      <h1>Verified Users</h1>
      {users.map(user => (
        <UserCardClient key={user.id} user={user} />
      ))}
    </div>
  );
}`,
    outputPrediction: "Database query runs on server; client receives clean HTML and minimal interactive JS.",
    keyTakeaways: [
      "Server Components cannot use hooks (useState, useEffect) or browser event listeners.",
      "Client Components cannot import Server Components directly; they must receive them as children or props.",
      "RSC serialization uses a specialized JSON-like streaming format rather than plain HTML."
    ],
    relatedQuestionSlugs: ["react-fiber-reconciliation-architecture"]
  },

  // PostgreSQL & SQL Questions
  {
    id: "iq-pg-1",
    slug: "b-tree-vs-gin-indexes-postgresql",
    title: "When should you use B-Tree vs GIN (Generalized Inverted) indexes in PostgreSQL?",
    technologySlug: "postgresql",
    topic: "Database Indexing & Performance",
    difficulty: "Medium",
    explanation:
      "B-Tree is the default PostgreSQL index. It stores balanced hierarchical tree nodes suitable for equality (=) and range queries (<, <=, >, >=, BETWEEN) on scalar types like integers, timestamps, and strings.\n\nGIN (Generalized Inverted Index) is designed for composite values containing multiple internal elements, such as JSONB documents, arrays, full-text search (tsvector), and trigram similarity searches. Instead of indexing entire rows, GIN indexes each individual key/element within the item pointing back to the matching rows.",
    codeExample: `-- B-Tree index for scalar lookup
CREATE INDEX idx_users_email ON users(email);

-- GIN index for JSONB attribute searching
CREATE INDEX idx_products_attributes ON products USING GIN (attributes jsonb_path_ops);

-- Query benefiting from GIN:
EXPLAIN ANALYZE
SELECT * FROM products 
WHERE attributes @> '{"category": "electronics", "inStock": true}';`,
    outputPrediction: "Bitmap Index Scan using idx_products_attributes instead of Seq Scan over millions of rows.",
    keyTakeaways: [
      "B-Tree is ideal for single-value scalar comparisons and sorting (ORDER BY).",
      "GIN is ideal for multi-value types (JSONB, Arrays, Text Search) with containment operators (@>).",
      "GIN indexes have higher update/write overhead than B-Tree, so use fastupdate for high-write tables."
    ],
    relatedQuestionSlugs: ["system-design-database-sharding-vs-partitioning"]
  },

  // System Design Questions
  {
    id: "iq-sys-1",
    slug: "rate-limiter-algorithms-system-design",
    title: "Design a Distributed Rate Limiter: Compare Token Bucket vs Sliding Window Log",
    technologySlug: "system-design",
    topic: "Distributed Algorithms",
    difficulty: "Hard",
    explanation:
      "A rate limiter restricts the number of requests a client can make in a given period to prevent DDoS, abuse, and cascading service failures.\n\n1. Token Bucket: A central bucket holds tokens up to capacity C and refills at rate R tokens/sec. Each request consumes 1 token. It handles bursts gracefully and uses minimal memory (stores only timestamp and token count in Redis).\n\n2. Sliding Window Log: Logs exact timestamps in a Redis Sorted Set (ZSET). Counts entries within the sliding window [now - window, now]. Highly accurate with zero boundary edge-case issues, but consumes more memory per user.",
    codeExample: `// Token Bucket Lua script executed atomically in Redis
local key = KEYS[1]
local capacity = tonumber(ARGV[1])
local refill_rate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])

local data = redis.call("HMGET", key, "tokens", "last_updated")
local tokens = tonumber(data[1]) or capacity
local last_updated = tonumber(data[2]) or now

-- Calculate refilled tokens
local delta = math.max(0, now - last_updated)
tokens = math.min(capacity, tokens + delta * refill_rate)

if tokens >= 1 then
  redis.call("HMSET", key, "tokens", tokens - 1, "last_updated", now)
  return 1 -- Allowed
else
  return 0 -- Rejected
end`,
    outputPrediction: "Atomic Redis Lua script prevents race conditions between distributed API servers.",
    keyTakeaways: [
      "Use Redis with Lua scripts to guarantee atomicity in distributed multi-server environments.",
      "Token Bucket is preferred in high-throughput systems due to O(1) space efficiency.",
      "Return standard HTTP headers: 429 Too Many Requests, Retry-After, X-RateLimit-Remaining."
    ],
    relatedQuestionSlugs: ["debouncing-and-throttling"]
  }
];
