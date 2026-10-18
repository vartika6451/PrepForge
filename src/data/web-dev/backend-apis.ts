import { WebDevQuestion } from "@/types/web-dev";

export const BACKEND_APIS_QUESTIONS: WebDevQuestion[] = [
  {
    id: "BE01",
    slug: "debug-api-200-blank-render",
    title: "Investigate API Returning HTTP 200 OK while UI Renders Empty",
    summary:
      "Systematically diagnose full-stack discrepancies when an API returns HTTP 200 OK with unexpected payload nesting, falsy data, or serialization mismatches.",
    topic: "backend-apis",
    mode: "debug",
    difficulty: "foundation",
    estimatedMinutes: 20,
    tags: ["Backend", "APIs", "REST", "JSON", "Debugging", "Full Stack"],
    skillsTested: [
      "Systematic Full-Stack Network Inspection",
      "API Payload Envelope vs Raw Array Discrepancies",
      "Conditional Rendering Edge Cases (e.g. `items.length && ...`)",
      "Content-Type Headers & JSON Parsing Verification",
    ],
    scenario:
      "A product team reports a high-priority bug: the user dashboard reports '0 transactions' and renders completely blank, yet the browser Network tab shows `GET /api/transactions` completed with `HTTP 200 OK`. The frontend developer blames the backend, and the backend developer blames the frontend. Walk through a systematic diagnostic process to identify the root cause across the boundary without making assumptions.",
    requirements: [
      "Inspect the exact HTTP response headers (`Content-Type`, `Content-Length`) and raw JSON response body.",
      "Identify common payload envelope mismatches (e.g. backend returning `{ data: { items: [...] } }` while frontend expects `response.json()` to be an array).",
      "Diagnose React conditional rendering gotchas (such as `count && <Component />` evaluating to `0` or rendering blank).",
      "Outline a contract-testing / schema validation solution (e.g. Zod or OpenAPI) that prevents this class of failure.",
    ],
    starterCode: `// Frontend Code
async function loadTransactions() {
  const res = await fetch("/api/transactions");
  const data = await res.json();
  // Expects array:
  setTransactions(data);
}

// React JSX
return (
  <div>
    {transactions.length && (
      <ul>{transactions.map(t => <li key={t.id}>{t.title}</li>)}</ul>
    )}
  </div>
);

// Backend Code (Node.js)
app.get("/api/transactions", async (req, res) => {
  const result = await db.getTransactions();
  // Backend wrapped payload in an envelope:
  res.status(200).json({ status: "success", data: result });
});`,
    programmingLanguage: "typescript",
    hints: [
      "Check the Network tab preview: Is the root JSON value an array `[...]` or an object `{...}`?",
      "In JavaScript, what happens when you do `[].length && <Component />`? The expression evaluates to the number `0`, which React renders directly onto the screen!",
      "If the frontend does `transactions.map(...)` on an object `{ status: 'success', data: [...] }`, it throws `TypeError: transactions.map is not a function`.",
    ],
    evaluationRubric: [
      {
        criteria: "Systematic Diagnostic Methodology",
        weight: "40%",
        description: "Examines Network tab payload, HTTP headers, console exceptions, and component state systematically.",
      },
      {
        criteria: "Envelope & React Rendering Analysis",
        weight: "35%",
        description: "Identifies object envelope mismatch and React `0 && JSX` falsy number rendering bug.",
      },
      {
        criteria: "Contract Testing & Defensive Typing",
        weight: "25%",
        description: "Recommends TypeScript interfaces, runtime Zod validation, and OpenAPI contracts.",
      },
    ],
    referenceAnswer:
      "### Systematic 4-Step Diagnosis:\n\n1. **Inspect Raw HTTP Payload**:\n   - Check the **Network Tab -> Response**.\n   - **The Discrepancy**: The backend returned an envelope `{ status: 'success', data: [...] }`. The frontend expected `data` to be a raw array `[...]`. As a result, `transactions` was set to an object, causing `transactions.length` to be `undefined`.\n\n2. **React Falsy Number Rendering Bug**:\n   - Notice the JSX expression: `{transactions.length && <Component />}`.\n   - In JavaScript, if `transactions` is empty `[]`, `0 && <Component />` evaluates to the primitive number **`0`**!\n   - React does not ignore `0` (unlike `false` or `null`); it literally renders the number `0` to the screen.\n\n3. **Content-Type & Header Verification**:\n   - Ensure the server sends `Content-Type: application/json; charset=utf-8`. If the server sends `text/html`, some client libraries fail silently.\n\n### The Fix:\n\n**Frontend Alignment**:\n```tsx\nasync function loadTransactions() {\n  try {\n    const res = await fetch('/api/transactions');\n    if (!res.ok) throw new Error(`HTTP error ${res.status}`);\n    const json = await res.json();\n    // Defensive extraction\n    const list = Array.isArray(json) ? json : json.data ?? [];\n    setTransactions(list);\n  } catch (err) {\n    setError(err.message);\n  }\n}\n\n// Safe JSX boolean conversion:\nreturn (\n  <div>\n    {transactions.length > 0 ? (\n      <ul>{transactions.map(t => <li key={t.id}>{t.title}</li>)}</ul>\n    ) : (\n      <p>No transactions found.</p>\n    )}\n  </div>\n);\n```\n\n**Prevention**:\nAdopt shared TypeScript types and runtime validation (Zod) generated from an OpenAPI/Swagger contract.",
    commonMistakes: [
      "Assuming HTTP 200 means the response data is automatically formatted correctly.",
      "Writing `{items.length && <List />}` instead of `{items.length > 0 && <List />}` or a ternary expression.",
    ],
    followUpQuestion:
      "How would a 304 Not Modified status code cause a similar blank screen if the client cache has corrupted local storage?",
    followUpAnswer:
      "If the browser sends `If-None-Match` and the server responds with 304, the browser serves bytes from its HTTP cache. If that cached payload was corrupted or intercepted, subsequent reloads will continue serving the broken response until the cache is invalidated or hard-refreshed.",
    references: [
      {
        title: "React Docs: Conditional Rendering (Caveats with &&)",
        url: "https://react.dev/learn/conditional-rendering#logical-and-operator-",
      },
      {
        title: "REST API Design: JSON Response Envelopes",
        url: "https://restfulapi.net/json-data-binding/",
      },
    ],
  },
  {
    id: "BE02",
    slug: "implement-cursor-based-pagination-api",
    title: "Design and Implement Cursor-Based Pagination for Real-Time Feeds",
    summary:
      "Build a robust cursor pagination API in Node.js/SQL that ensures deterministic ordering and avoids offset pagination skips and duplicates.",
    topic: "backend-apis",
    mode: "build",
    difficulty: "challenge",
    estimatedMinutes: 30,
    tags: ["Backend", "APIs", "Pagination", "SQL", "Database Indexing", "Node.js"],
    skillsTested: [
      "Offset vs Cursor Pagination Analysis",
      "Deterministic Multi-Column Ordering",
      "Base64 Cursor Encoding & Decoding",
      "Composite Index Optimization",
    ],
    scenario:
      "You are designing the activity feed API for a high-traffic social app. Users scroll down infinitely as new posts are continuously inserted at the top. With traditional `OFFSET / LIMIT` pagination, when 5 new posts are created while a user is on page 1, navigating to page 2 causes the user to see 5 duplicate items that were shoved down from page 1. Implement a cursor-based pagination endpoint that provides stable, drift-free pagination.",
    requirements: [
      "Explain the 'missing/duplicate items' and $O(N)$ database scan degradation of `OFFSET` pagination.",
      "Design a stable cursor encoding the sort tuple: `(created_at, id)`.",
      "Implement the query logic using `WHERE (created_at, id) < (cursor_created_at, cursor_id)` with `LIMIT K + 1` to compute `hasNextPage`.",
      "Encode the cursor in opaque URL-safe Base64.",
      "Specify the exact composite database index required for $O(\\log N)$ index seeking.",
    ],
    starterCode: `// Cursor Pagination Endpoint Handler
export async function getFeedPosts(limit: number = 20, cursor?: string) {
  // TODO: Decode cursor, query database using index seek, and compute nextCursor
  return {
    items: [],
    pageInfo: {
      nextCursor: null,
      hasNextPage: false,
    },
  };
}`,
    programmingLanguage: "typescript",
    hints: [
      "`created_at` timestamps are not guaranteed to be unique under high write concurrency! You MUST combine `(created_at, id)` as a tiebreaker to make ordering deterministic.",
      "Fetch `limit + 1` records: If the query returns 21 records when limit is 20, you know `hasNextPage = true`. Pop the 21st record before returning.",
      "Base64-encode the JSON `{ createdAt, id }` so the frontend treats the cursor as an opaque token.",
    ],
    evaluationRubric: [
      {
        criteria: "Deterministic Cursor Design",
        weight: "40%",
        description: "Uses composite tuple (created_at, id) guaranteeing stable ordering even with identical timestamps.",
      },
      {
        criteria: "HasNextPage & Slice Implementation",
        weight: "35%",
        description: "Fetches limit + 1 and extracts nextCursor cleanly without extra COUNT(*) queries.",
      },
      {
        criteria: "Database Indexing Specification",
        weight: "25%",
        description: "Identifies required composite index `CREATE INDEX idx_posts_feed ON posts (created_at DESC, id DESC)`.",
      },
    ],
    referenceAnswer:
      "```typescript\nimport { Buffer } from 'buffer';\n\ninterface CursorPayload {\n  createdAt: string;\n  id: string;\n}\n\nfunction encodeCursor(payload: CursorPayload): string {\n  return Buffer.from(JSON.stringify(payload)).toString('base64url');\n}\n\nfunction decodeCursor(cursor: string): CursorPayload | null {\n  try {\n    return JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'));\n  } catch {\n    return null;\n  }\n}\n\nexport async function getFeedPosts(limit = 20, cursor?: string) {\n  const safeLimit = Math.min(Math.max(1, limit), 100);\n  const parsedCursor = cursor ? decodeCursor(cursor) : null;\n\n  // SQL Query using Row Values Comparison\n  // Requires: CREATE INDEX idx_posts_feed ON posts (created_at DESC, id DESC);\n  const query = `\n    SELECT id, title, created_at\n    FROM posts\n    WHERE ($1::timestamp IS NULL OR (created_at, id) < ($1, $2))\n    ORDER BY created_at DESC, id DESC\n    LIMIT $3;\n  `;\n\n  // We fetch safeLimit + 1 to check if there is a next page\n  const rows = await db.query(query, [\n    parsedCursor?.createdAt ?? null,\n    parsedCursor?.id ?? null,\n    safeLimit + 1,\n  ]);\n\n  const hasNextPage = rows.length > safeLimit;\n  const items = hasNextPage ? rows.slice(0, safeLimit) : rows;\n\n  const lastItem = items[items.length - 1];\n  const nextCursor = hasNextPage && lastItem\n    ? encodeCursor({ createdAt: lastItem.created_at, id: lastItem.id })\n    : null;\n\n  return {\n    items,\n    pageInfo: {\n      nextCursor,\n      hasNextPage,\n    },\n  };\n}\n```\n\n### Why Cursor Pagination Outperforms Offset:\n- **No Drift**: Newly inserted posts at the top do not shift the cursor pointer.\n- **Performance**: `OFFSET 50000` forces the database to read 50,020 rows off disk and discard 50,000. Cursor pagination uses index seeking directly to the cursor row ($O(\\log N)$).",
    commonMistakes: [
      "Using `created_at` alone without an `id` tie-breaker: If 3 posts share the exact same timestamp millisecond, pagination skips items.",
      "Running `SELECT COUNT(*) FROM posts` on every request, which destroys database CPU on million-row tables.",
    ],
    followUpQuestion:
      "What is the primary drawback of cursor pagination compared to offset pagination?",
    followUpAnswer:
      "Cursor pagination does not support jumping directly to arbitrary pages (e.g. 'Jump directly to page 47') or calculating the exact total number of pages without an expensive full-table scan.",
    references: [
      {
        title: "Slack Engineering: Evolving API Pagination at Slack",
        url: "https://slack.engineering/evolving-api-pagination-at-slack/",
      },
      {
        title: "Use The Index, Luke: Paging Through Results",
        url: "https://use-the-index-luke.com/no-offset",
      },
    ],
  },
  {
    id: "BE03",
    slug: "prevent-duplicate-orders-idempotency-keys",
    title: "Prevent Duplicate Order Charges with Idempotency Keys and Distributed Locks",
    summary:
      "Architect safe, idempotent payment and checkout endpoints that eliminate double charges during network retries and concurrent client requests.",
    topic: "backend-apis",
    mode: "explain",
    difficulty: "challenge",
    estimatedMinutes: 25,
    tags: ["Backend", "Distributed Systems", "Idempotency", "Payments", "PostgreSQL", "Transactions"],
    skillsTested: [
      "Idempotency Key Protocol Design",
      "Database Transactional Locking",
      "Concurrent Request De-duplication",
      "Cached Response Replay Semantics",
    ],
    scenario:
      "In a high-volume checkout flow, a customer clicks 'Pay $100'. Due to mobile packet loss, the client's browser experiences a timeout and automatically retries the HTTP `POST /api/orders` request after 5 seconds. Meanwhile, the first request actually reached the server and started charging the card. Design a production-grade idempotency system that prevents double charges and returns the identical response to retried requests.",
    requirements: [
      "Define HTTP header `Idempotency-Key` contract (client-generated UUIDv4).",
      "Design a dedicated database storage schema for idempotency records (`key`, `user_id`, `status`, `response_code`, `response_body`, `locked_at`).",
      "Handle high-concurrency race conditions: What happens if Request 1 and Request 2 arrive at different server pods at the exact same millisecond?",
      "Explain the three lifecycle states: `IN_PROGRESS`, `SUCCESS`, and `FAILED`.",
      "Explain what status code to return while the first request is still being processed.",
    ],
    starterCode: `// POST /api/orders
export async function createOrder(req: Request, res: Response) {
  const idempotencyKey = req.headers["idempotency-key"] as string;
  // TODO: Design idempotent processing architecture
}`,
    programmingLanguage: "typescript",
    hints: [
      "Use PostgreSQL's atomic `INSERT INTO idempotency_keys (...) ON CONFLICT (key) DO NOTHING` to guarantee that only ONE worker wins the race to process.",
      "If the record is already `SUCCESS`, immediately replay the cached HTTP status and JSON response body without executing payment logic.",
      "If the record is still `IN_PROGRESS`, return HTTP 409 Conflict with a `Retry-After: 2` header.",
    ],
    evaluationRubric: [
      {
        criteria: "Concurrency Race Condition Mitigation",
        weight: "40%",
        description: "Uses database atomic constraints or row-level locks preventing parallel execution.",
      },
      {
        criteria: "Response Replay & Schema Design",
        weight: "35%",
        description: "Stores and replays exact response headers and payload for verified idempotency keys.",
      },
      {
        criteria: "Conflict & Failure Recovery",
        weight: "25%",
        description: "Handles in-progress collisions (HTTP 409) and rolls back failed payments safely.",
      },
    ],
    referenceAnswer:
      "### Architectural Blueprint:\n\n1. **Client Contract**:\n   The client generates a unique UUIDv4 per intent and sends:\n   `Idempotency-Key: e8a264a2-7491-4e4b-97e3-bb2b12345678`.\n\n2. **Database Schema**:\n```sql\nCREATE TABLE idempotency_records (\n  key VARCHAR(255) PRIMARY KEY,\n  user_id VARCHAR(255) NOT NULL,\n  status VARCHAR(32) NOT NULL, -- 'IN_PROGRESS', 'SUCCESS', 'FAILED'\n  response_code INT,\n  response_body JSONB,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n  expires_at TIMESTAMP WITH TIME ZONE NOT NULL\n);\n```\n\n3. **Execution Flow**:\n   - **Step A (Atomic Lock)**: The server executes:\n     ```sql\n     INSERT INTO idempotency_records (key, user_id, status, expires_at)\n     VALUES ($1, $2, 'IN_PROGRESS', NOW() + INTERVAL '5 minutes')\n     ON CONFLICT (key) DO NOTHING\n     RETURNING key;\n     ```\n   - **Step B (Evaluate Conflict)**:\n     - If a row was returned: This request won the lock! Proceed to payment.\n     - If no row was returned: Another request arrived first. Read the existing record:\n       - If `status == 'SUCCESS'`: Return cached `response_code` and `response_body` immediately.\n       - If `status == 'IN_PROGRESS'`: Return `HTTP 409 Conflict` (or `HTTP 425 Too Early`) with `Retry-After: 2`.\n       - If `status == 'FAILED'`: Allow retry by resetting the record or return the previous error.\n   - **Step C (Complete & Cache)**:\n     Once the payment gateway confirms charge:\n     ```sql\n     UPDATE idempotency_records\n     SET status = 'SUCCESS', response_code = 201, response_body = $2\n     WHERE key = $1;\n     ```",
    commonMistakes: [
      "Performing `SELECT * FROM records WHERE key = $1` before `INSERT`: This is a classic Time-of-Check to Time-of-Use (TOCTOU) race condition that fails under concurrency.",
      "Returning a generic error on duplicate requests, which breaks client retries.",
    ],
    followUpQuestion:
      "What if the client sends the same Idempotency-Key but with a completely different payload (e.g. changing amount from $100 to $500)?",
    followUpAnswer:
      "Hash the incoming request payload (`sha256(req.body)`) and store it alongside the key. If a request arrives with an existing key but a mismatched payload hash, reject immediately with `HTTP 422 Unprocessable Entity: Idempotency Key Reused with Mismatched Parameters`.",
    references: [
      {
        title: "Stripe Docs: Designing Robust Systems with Idempotency",
        url: "https://stripe.com/docs/api/idempotent_requests",
      },
      {
        title: "IETF RFC: The Idempotency-Key HTTP Header Field",
        url: "https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-idempotency-key-header",
      },
    ],
  },
  {
    id: "BE04",
    slug: "design-rate-limiting-auth-endpoints",
    title: "Design Rate Limiting and Brute-Force Defenses for Authentication APIs",
    summary:
      "Implement rate limiting strategies (Token Bucket / Sliding Window) on sensitive endpoints to protect against credential stuffing while avoiding shared-IP lockouts.",
    topic: "backend-apis",
    mode: "explain",
    difficulty: "applied",
    estimatedMinutes: 20,
    tags: ["Backend", "Security", "Rate Limiting", "Redis", "Authentication", "OWASP"],
    skillsTested: [
      "Sliding Window vs Fixed Window Counter Algorithms",
      "Distributed Rate Limiting via Redis Atomic Scripts",
      "Multi-Tiered Rate Limiting (IP + Account Identifier)",
      "Standard HTTP 429 Headers (Retry-After, X-RateLimit-*)",
    ],
    scenario:
      "A banking API's `/api/auth/login` endpoint is targeted by a credential stuffing botnet cycling through millions of stolen password combinations. If you rate limit strictly by client IP address, hundreds of legitimate employees behind a corporate NAT gateway share the same public IP and get locked out. Design a robust, multi-tier rate limiting architecture.",
    requirements: [
      "Compare the Fixed Window Counter algorithm with the Sliding Window Counter algorithm in Redis.",
      "Design a dual-key rate limit: Tier 1 (IP address) + Tier 2 (Username/Account identifier).",
      "Explain the standard HTTP response when a limit is exceeded (`HTTP 429 Too Many Requests`, `Retry-After`).",
      "Address distributed deployments: Explain why in-memory Node process limits fail across multiple container instances.",
    ],
    starterCode: `// Express / Node Rate Limiter Concept
// Why is in-memory 'Map<string, number>' broken in a cluster of 8 container pods?
const failedAttempts = new Map<string, number>();

export async function loginHandler(req: Request, res: Response) {
  // TODO: Design distributed rate limiting strategy
}`,
    programmingLanguage: "typescript",
    hints: [
      "In Kubernetes / multi-pod environments, request 1 hits Pod A, request 2 hits Pod B. In-memory Maps do not share state across processes!",
      "A Redis Sliding Window using a Sorted Set (`ZADD` with millisecond timestamps and `ZREMRANGEBYSCORE`) provides precision without window boundary reset spikes.",
      "Rate limit by IP to prevent volumetric network floods, but rate limit by `username` with exponential backoff to prevent account targeted brute-forcing.",
    ],
    evaluationRubric: [
      {
        criteria: "Sliding Window Algorithm Proficiency",
        weight: "40%",
        description: "Explains sliding window advantage over fixed window resets at minute boundaries.",
      },
      {
        criteria: "Distributed State Management (Redis)",
        weight: "35%",
        description: "Justifies centralized Redis store with atomic Lua scripts or pipelines.",
      },
      {
        criteria: "Account & NAT Corporate IP Protection",
        weight: "25%",
        description: "Designs composite keys (IP + normalized username) avoiding collateral lockout of corporate networks.",
      },
    ],
    referenceAnswer:
      "### 1. Why In-Memory Rate Limiting Fails in Production:\nIn distributed cloud environments (Kubernetes, AWS ECS), incoming requests are load-balanced across multiple Node.js instances. An in-memory `Map` only tracks attempts on a single pod, allowing attackers to multiply their attempt rate by the number of pods. Rate limits **must reside in a centralized, low-latency store (Redis)**.\n\n### 2. Algorithm: Sliding Window Log / Counter:\n- **Fixed Window Flaw**: If the limit is 10 requests/minute, an attacker sends 10 requests at 00:59 and 10 requests at 01:00, successfully executing 20 attempts in 2 seconds.\n- **Sliding Window Counter**: Maintains a Redis Sorted Set (`ZSET`) where score is timestamp in milliseconds. When a request arrives:\n  1. Remove expired timestamps: `ZREMRANGEBYSCORE key 0 (now - windowMs)`\n  2. Count remaining attempts: `ZCARD key`\n  3. If count >= limit, reject with `HTTP 429`.\n  4. Otherwise: `ZADD key now now` with a TTL.\n\n### 3. Dual-Tier Identification Strategy:\n- **Tier 1 (Volumetric IP Defense)**: 50 requests per minute per IP address. Prevents broad automated DDoS.\n- **Tier 2 (Account Protection)**: 5 failed attempts per 15 minutes per **normalized username/email** regardless of IP. Prevents distributed botnets attacking a single user from 1,000 distinct rotating residential proxies.\n- **Corporate NAT Relief**: Even if 500 legitimate users share an office IP, they log into different accounts, so they never hit the Tier 2 account threshold.\n\n### 4. HTTP 429 Protocol Contract:\n```http\nHTTP/1.1 429 Too Many Requests\nRetry-After: 300\nX-RateLimit-Limit: 5\nX-RateLimit-Remaining: 0\nX-RateLimit-Reset: 1718900000\nContent-Type: application/json\n\n{\n  \"error\": \"Too many login attempts. Please try again in 5 minutes.\"\n}\n```",
    commonMistakes: [
      "Relying solely on IP address, which penalizes mobile carriers and universities sharing single public gateway IPs.",
      "Failing to normalize email addresses (e.g. `User@domain.com` vs `user@domain.com`), allowing attackers to bypass account limits.",
    ],
    followUpQuestion:
      "How do attackers abuse `X-Forwarded-For` headers to bypass IP rate limits, and how do you prevent it?",
    followUpAnswer:
      "An attacker can spoof `X-Forwarded-For: 1.2.3.4` in their request headers. If your application blindly trusts `req.headers['x-forwarded-for']`, the attacker bypasses the limiter. You must configure Express `app.set('trust proxy', 1)` so the framework only reads the client IP appended by your trusted edge load balancer (AWS ALB / Cloudflare).",
    references: [
      {
        title: "OWASP: Blocking Brute Force Attacks",
        url: "https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html#prevent-brute-force-attacks",
      },
      {
        title: "IETF RFC 6585: Status Code 429 Too Many Requests",
        url: "https://datatracker.ietf.org/doc/html/rfc6585#section-4",
      },
    ],
  },
  {
    id: "BE05",
    slug: "why-cpu-intensive-sync-js-blocks-nodejs",
    title: "Why CPU-Bound Synchronous Operations Freeze Node.js Servers",
    summary:
      "Examine the single-threaded Node.js event loop model, why synchronous compute freezes concurrent HTTP traffic, and how to offload heavy workloads.",
    topic: "backend-apis",
    mode: "explain",
    difficulty: "applied",
    estimatedMinutes: 20,
    tags: ["Node.js", "Event Loop", "Performance", "worker_threads", "libuv"],
    skillsTested: [
      "Single-Threaded Call Stack vs libuv Worker Pool",
      "Event Loop Starvation Mechanisms",
      "Offloading Compute via worker_threads / Clustering",
      "Async I/O Non-blocking Distinctions",
    ],
    scenario:
      "A Node.js backend handles 5,000 active WebSocket connections and lightweight database queries effortlessly. However, when an admin requests a PDF report generation containing complex cryptographic signatures and image rasterization in pure synchronous JS, every other active user's connection completely freezes: incoming HTTP requests time out and WebSocket heartbeats disconnect. Explain why this happens despite Node's asynchronous reputation, and describe two production architectures to fix it.",
    requirements: [
      "Explain the architecture of Node.js: single-threaded V8 JavaScript execution versus libuv thread pool for I/O.",
      "Explain event loop starvation: Why does a 4-second CPU loop prevent Node from answering lightweight ping requests?",
      "Detail Solution A: Node.js `worker_threads` module for intra-process parallelism.",
      "Detail Solution B: Dedicated background task queue (BullMQ / RabbitMQ) for out-of-process job processing.",
    ],
    starterCode: `// Problematic endpoint in Express app
app.get("/api/export-pdf", (req, res) => {
  // Synchronous CPU-intensive loop blocks the entire event loop!
  const pdfBytes = generateHeavyReportSync();
  res.type("application/pdf").send(pdfBytes);
});`,
    programmingLanguage: "typescript",
    hints: [
      "Node.js is asynchronous for I/O operations (sockets, file descriptors, network calls) because the OS kernel or libuv manages them without consuming JS main thread cycles.",
      "JavaScript execution itself runs on a SINGLE thread. While a synchronous `while(true)` or cryptographic loop is executing, the event loop cannot pick up any new events or callbacks.",
      "To prevent blocking the main thread, CPU work must run on a separate OS thread or independent worker process.",
    ],
    evaluationRubric: [
      {
        criteria: "Event Loop Architecture Comprehension",
        weight: "40%",
        description: "Accurately articulates difference between asynchronous I/O and synchronous CPU computation.",
      },
      {
        criteria: "Starvation Mechanism Explanation",
        weight: "30%",
        description: "Explains why timers, network packets, and socket heartbeats are held in OS buffers until JS yields.",
      },
      {
        criteria: "Practical Remediation Strategies",
        weight: "30%",
        description: "Details `worker_threads` and asynchronous job queues (BullMQ/Redis) effectively.",
      },
    ],
    referenceAnswer:
      "### Why Node.js Freezes on Heavy CPU Tasks:\nNode.js uses a **single-threaded execution model** for JavaScript code (running on the V8 engine). Its famous high scalability applies to **I/O-bound tasks** (network requests, database queries, file streaming), where the operating system kernel (epoll/kqueue) or libuv thread pool manages the waiting in the background without occupying the main thread.\n\nHowever, when a request executes a heavy synchronous CPU computation (e.g. image processing, JSON parsing of a 100MB file, regex backtracking, or cryptographic hashing):\n- The computation occupies the **one and only Call Stack**.\n- The Event Loop cannot advance to check incoming network sockets, drain the microtask queue, or process WebSocket heartbeats.\n- All other 5,000 connected users sit in the OS TCP backlog queue until the synchronous computation yields.\n\n### Two Production Architectures to Fix This:\n\n1. **In-Process: `worker_threads` (Ideal for CPU operations < 2s)**:\n   Node's native `worker_threads` module spawns real OS threads sharing memory via `ArrayBuffer` / `SharedArrayBuffer`:\n   ```typescript\n   import { Worker } from 'worker_threads';\n\n   export function generatePdfAsync(data: unknown): Promise<Buffer> {\n     return new Promise((resolve, reject) => {\n       const worker = new Worker('./pdf-worker.js', { workerData: data });\n       worker.on('message', resolve);\n       worker.on('error', reject);\n     });\n   }\n   ```\n   The main event loop stays responsive at 60 FPS while the PDF compiles on a separate CPU core.\n\n2. **Out-of-Process: Asynchronous Job Queue (Best for Heavy Jobs > 5s)**:\n   Decouple HTTP request handling from execution using a message queue (BullMQ + Redis):\n   - User calls `POST /api/export-pdf`.\n   - Server creates a job, pushes it to Redis, and returns `HTTP 202 Accepted` with `{ jobId: '123' }` in 5ms.\n   - A separate worker process (autoscaled independently) executes the task and saves the PDF to S3.",
    commonMistakes: [
      "Wrapping synchronous code in `new Promise((resolve) => { ... })` thinking it makes the code run in a background thread (promises are simply asynchronous notifications, they do NOT create threads!).",
      "Using `setImmediate` slicing for massive multi-second computations instead of proper worker threads.",
    ],
    followUpQuestion:
      "Why is `JSON.parse()` on very large strings a common denial-of-service vector in Node APIs?",
    followUpAnswer:
      "`JSON.parse()` is completely synchronous and blocking! Parsing a 50MB malicious JSON payload locks the main thread for 400–800ms, during which zero other requests can be served.",
    references: [
      {
        title: "Node.js Guide: Don't Block the Event Loop (or the Worker Pool)",
        url: "https://nodejs.org/en/docs/guides/dont-block-the-event-loop/",
      },
      {
        title: "Node.js Docs: worker_threads",
        url: "https://nodejs.org/api/worker_threads.html",
      },
    ],
  },
  {
    id: "BE06",
    slug: "implement-rest-endpoint-zod-validation",
    title: "Implement a Production REST Endpoint with Request Validation and RFC 7807 Errors",
    summary:
      "Build a resilient Express/Node.js endpoint featuring schema validation, standard HTTP status codes, and RFC 7807 Problem Details structured error payloads.",
    topic: "backend-apis",
    mode: "build",
    difficulty: "applied",
    estimatedMinutes: 25,
    tags: ["Backend", "REST", "Zod", "Validation", "Node.js", "Error Handling"],
    skillsTested: [
      "Runtime Schema Validation with Zod",
      "RFC 7807 Problem Details for HTTP APIs",
      "Appropriate HTTP Status Codes (201, 400, 422, 500)",
      "Centralized Error Handling Middleware",
    ],
    scenario:
      "Implement a production-grade `POST /api/v1/projects` REST endpoint in TypeScript. The endpoint must strictly validate the incoming JSON body using Zod (verifying title length, valid email team lead, budget constraints), return `HTTP 201 Created` with a `Location` header on success, and return standardized `RFC 7807 Problem Details` with `HTTP 422 Unprocessable Entity` containing per-field error details upon validation failure.",
    requirements: [
      "Define a Zod validation schema with descriptive validation constraints.",
      "Return `HTTP 201 Created` and `Location: /api/v1/projects/:id` header on successful creation.",
      "On validation failure, return `HTTP 422 Unprocessable Entity` with `Content-Type: application/problem+json`.",
      "Format validation errors following RFC 7807: `{ type, title, status, detail, invalidParams }`.",
      "Ensure unexpected database crashes trigger a safe `HTTP 500` error without leaking stack traces.",
    ],
    starterCode: `import express, { Request, Response } from "express";
import { z } from "zod";

const app = express();
app.use(express.json());

// TODO: Define schema and implement POST /api/v1/projects handler
export { app };`,
    programmingLanguage: "typescript",
    hints: [
      "Use `schema.safeParse(req.body)` to capture validation issues without needing messy try/catch blocks.",
      "In RFC 7807, include an `invalidParams` array indicating `{ name: 'field_name', reason: 'message' }`.",
      "Always set `res.setHeader('Content-Type', 'application/problem+json')` for RFC 7807 error responses.",
    ],
    evaluationRubric: [
      {
        criteria: "Schema Validation Robustness",
        weight: "35%",
        description: "Uses Zod effectively with boundary checks and clean type inference.",
      },
      {
        criteria: "RFC 7807 Compliance",
        weight: "40%",
        description: "Structures error responses following standard problem details schema.",
      },
      {
        criteria: "REST Best Practices (Status & Headers)",
        weight: "25%",
        description: "Returns 201 with Location header; uses 422 for semantic validation errors.",
      },
    ],
    referenceAnswer:
      "```typescript\nimport express, { Request, Response, NextFunction } from 'express';\nimport { z } from 'zod';\n\nconst createProjectSchema = z.object({\n  title: z.string().min(3, 'Title must be at least 3 characters').max(100),\n  leadEmail: z.string().email('Must be a valid lead email address'),\n  budget: z.number().positive('Budget must be greater than zero'),\n  tags: z.array(z.string()).min(1, 'At least one tag is required'),\n});\n\ntype CreateProjectInput = z.infer<typeof createProjectSchema>;\n\nconst router = express.Router();\n\nrouter.post('/api/v1/projects', async (req: Request, res: Response, next: NextFunction) => {\n  const parseResult = createProjectSchema.safeParse(req.body);\n\n  if (!parseResult.success) {\n    const invalidParams = parseResult.error.issues.map((issue) => ({\n      name: issue.path.join('.'),\n      reason: issue.message,\n    }));\n\n    res.setHeader('Content-Type', 'application/problem+json');\n    return res.status(422).json({\n      type: 'https://api.example.com/errors/validation-failed',\n      title: 'Invalid Request Parameters',\n      status: 422,\n      detail: 'One or more fields failed validation checks.',\n      invalidParams,\n    });\n  }\n\n  try {\n    const projectData: CreateProjectInput = parseResult.data;\n    const newProject = await db.projects.create({\n      id: 'proj_' + Math.random().toString(36).substring(2, 9),\n      ...projectData,\n      createdAt: new Date(),\n    });\n\n    res.setHeader('Location', `/api/v1/projects/${newProject.id}`);\n    return res.status(201).json(newProject);\n  } catch (error) {\n    next(error);\n  }\n});\n\n// Centralized Internal Error Handler (Hides Stack Trace in Prod)\nrouter.use((err: Error, req: Request, res: Response, next: NextFunction) => {\n  console.error('[Internal Error]:', err);\n  res.setHeader('Content-Type', 'application/problem+json');\n  res.status(500).json({\n    type: 'https://api.example.com/errors/internal-server-error',\n    title: 'Internal Server Error',\n    status: 500,\n    detail: 'An unexpected error occurred on the server. Please contact support.',\n  });\n});\n\nexport { router };\n```",
    commonMistakes: [
      "Using `HTTP 200 OK` for creation instead of `HTTP 201 Created` with a `Location` header.",
      "Returning raw database exceptions in `res.status(500).json(err)`, leaking internal database schema and credentials to attackers.",
    ],
    followUpQuestion:
      "What is the difference between `HTTP 400 Bad Request` and `HTTP 422 Unprocessable Entity` in modern API design?",
    followUpAnswer:
      "`400 Bad Request` denotes syntax errors (e.g. malformed JSON that cannot be parsed), whereas `422 Unprocessable Entity` denotes syntactically valid JSON whose fields violate semantic business rules (e.g. invalid email format or negative budget).",
    references: [
      {
        title: "IETF RFC 7807: Problem Details for HTTP APIs",
        url: "https://datatracker.ietf.org/doc/html/rfc7807",
      },
      {
        title: "Zod: TypeScript-first schema validation",
        url: "https://zod.dev/",
      },
    ],
  },
  {
    id: "BE07",
    slug: "diagnose-stale-api-cache-headers",
    title: "Diagnose Stale API Data Caused by Misconfigured HTTP Cache-Control",
    summary:
      "Investigate how caching intermediaries, browser heuristics, and missing Cache-Control headers serve outdated JSON data across server/client boundaries.",
    topic: "backend-apis",
    mode: "debug",
    difficulty: "applied",
    estimatedMinutes: 20,
    tags: ["Backend", "HTTP", "Caching", "Cache-Control", "ETag", "CDN"],
    skillsTested: [
      "HTTP Cache-Control Directives (`no-cache`, `no-store`, `private`, `max-age`)",
      "Heuristic Caching in Web Browsers",
      "ETag & Conditional Validation (`If-None-Match`, 304)",
      "CDN & Reverse Proxy Shared Caching Invalidation",
    ],
    scenario:
      "Users report that updating their profile avatar or email address shows old data when they refresh the page. The backend updates the database row instantly, and direct `curl` requests return fresh data. However, users in Chrome and Safari continue to see stale profile data for up to 10 minutes. Inspect the server response headers below, diagnose the caching flaw, and configure the correct HTTP cache headers.",
    requirements: [
      "Explain how browsers apply 'Heuristic Caching' when an API response omits an explicit `Cache-Control` header.",
      "Explain the critical difference between `Cache-Control: no-cache` versus `Cache-Control: no-store`.",
      "Explain the danger of returning sensitive user data without the `private` directive when behind a shared reverse proxy (Cloudflare/CDN).",
      "Implement a correct caching policy for authenticated user data using `ETag` and conditional validation.",
    ],
    starterCode: `// Problematic Server Headers on GET /api/user/profile
// Response headers:
// HTTP/1.1 200 OK
// Date: Mon, 18 Oct 2026 12:00:00 GMT
// Last-Modified: Mon, 18 Oct 2026 10:00:00 GMT
// Content-Type: application/json
// (Notice: Cache-Control is completely missing!)`,
    programmingLanguage: "http",
    hints: [
      "When `Cache-Control` is missing but `Last-Modified` is present, RFC 7234 allows browsers to heuristically cache the response for 10% of the elapsed time (often minutes or hours)!",
      "`no-cache` does NOT mean 'do not cache' — it means 'you may store this in cache, but you MUST revalidate with the server (using ETag) before using it'.",
      "`no-store` instructs all caches (browser and CDN) to never write the response bytes to disk or memory.",
    ],
    evaluationRubric: [
      {
        criteria: "Heuristic Caching Diagnosis",
        weight: "40%",
        description: "Explains how browsers calculate heuristic freshness lifetimes when Cache-Control is omitted.",
      },
      {
        criteria: "no-cache vs no-store Precision",
        weight: "35%",
        description: "Accurately articulates revalidation semantics of no-cache vs strict prohibition of no-store.",
      },
      {
        criteria: "Shared CDN / Privacy Protection",
        weight: "25%",
        description: "Uses `private` directive preventing CDNs from serving user A's profile data to user B.",
      },
    ],
    referenceAnswer:
      "### 1. The Root Cause: Heuristic Freshness\nUnder RFC 7234 (HTTP Caching Specification), if a response omits `Cache-Control` and `Expires`, but includes `Last-Modified`, the browser is permitted to calculate a **heuristic freshness lifetime**:\n$$\\text{Freshness} = (\\text{Date} - \\text{Last-Modified}) \\times 10\\%$$\nIn the starter code, the document was modified 2 hours ago. The browser caches the JSON response locally for 12 minutes! When the user refreshes, Chrome loads the profile directly from disk cache without making a network request.\n\n### 2. `no-cache` vs `no-store`:\n- **`no-cache`**: The response CAN be stored in cache. However, before serving it, the client **must revalidate** with the server using `If-None-Match` (ETag). If unchanged, the server returns 304 with 0 body bytes.\n- **`no-store`**: The response MUST NOT be saved anywhere (disk, memory, or proxy). It forces a fresh download on every single request.\n\n### 3. The `private` Directive:\nIf sensitive authenticated data is returned without `private`, an intermediate shared proxy (Cloudflare, NGINX CDN) could cache User A's profile and accidentally serve it to User B.\n\n### Recommended Configurations:\n\n**For Highly Sensitive / Dynamic User APIs**:\n```http\nCache-Control: private, no-store, max-age=0\nPragma: no-cache\n```\n\n**For Dynamic Data with ETag Revalidation (Bandwidth Efficient)**:\n```http\nCache-Control: private, no-cache\nETag: W/\"33a64df551425fcc3e71f\"\n```\nWhen the client requests again, it sends `If-None-Match: W/\"33a64df551425fcc3e71f\"`. If the profile has not changed, the server returns `304 Not Modified`, saving server bandwidth while keeping data fresh.",
    commonMistakes: [
      "Assuming `Cache-Control: no-cache` prevents caching completely (it only forces revalidation; `no-store` is required to prevent storage).",
      "Omitting `private` on authenticated endpoints, resulting in CDN cache leaks.",
    ],
    followUpQuestion:
      "What is `Cache-Control: stale-while-revalidate` and when should it be used?",
    followUpAnswer:
      "`stale-while-revalidate=60` tells the browser: 'Serve cached data instantly to the user for zero-latency UI rendering, but simultaneously fire an asynchronous background request to fetch fresh data and update the cache for next time.' It is ideal for public catalogs and documentation.",
    references: [
      {
        title: "MDN: Cache-Control HTTP Headers",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control",
      },
      {
        title: "web.dev: Prevent unnecessary network requests with the HTTP Cache",
        url: "https://web.dev/http-cache/",
      },
    ],
  },
];
