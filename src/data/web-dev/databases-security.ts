import { WebDevQuestion } from "@/types/web-dev";

export const DATABASES_SECURITY_QUESTIONS: WebDevQuestion[] = [
  {
    id: "DS01",
    slug: "why-store-passwords-with-argon2-bcrypt",
    title: "Why Passwords Require Memory-Hard Hashing (Argon2/bcrypt) vs Fast Hashes",
    summary:
      "Understand why cryptographic algorithms like SHA-256 or AES are dangerous for passwords, and how memory-hard KDFs defend against GPU rainbow table attacks.",
    topic: "databases-security",
    mode: "explain",
    difficulty: "foundation",
    estimatedMinutes: 20,
    tags: ["Security", "Cryptography", "Argon2", "bcrypt", "OWASP", "Passwords"],
    skillsTested: [
      "Cryptographic Hashes vs Key Derivation Functions (KDFs)",
      "GPU / ASIC Hardware Parallelization Resistance",
      "Salt Randomization vs Rainbow Tables",
      "Work Factor / Work Tuning (Memory & Time Costs)",
    ],
    scenario:
      "A developer stores passwords by doing `sha256(password + salt)` or encrypting them using reversible `AES-256`. In a technical security review, explain why fast cryptographic hashes (SHA-256, MD5) and reversible encryption are fundamentally unsuitable for password storage, and explain how modern memory-hard algorithms like Argon2id and bcrypt neutralize GPU brute-force attacks.",
    requirements: [
      "Explain the fatal flaw of reversible encryption: The existence of an encryption key that can be compromised.",
      "Explain why SHA-256 is designed to be blindingly fast, and how modern consumer GPUs compute billions of SHA-256 hashes per second.",
      "Explain the role of a cryptographically secure random salt in defeating pre-computed Rainbow Tables.",
      "Explain how memory-hardness (Argon2id) and adjustable work factors (bcrypt cost factor) slow down offline dictionary attacks.",
    ],
    starterCode: `// INSECURE EXAMPLES:
// Flaw 1: Fast general-purpose hash
const hash = crypto.createHash("sha256").update(password + salt).digest("hex");

// Flaw 2: Reversible encryption
const encrypted = aes256Encrypt(password, SECRET_KEY);`,
    programmingLanguage: "javascript",
    hints: [
      "SHA-256 was created for integrity checking of files and blocks; speed is a feature for SHA-256, but speed is a catastrophic vulnerability for password hashes.",
      "Modern Nvidia/AMD graphics cards contain thousands of arithmetic cores capable of calculating billions of SHA-256 hashes per second.",
      "Argon2id forces each hash calculation to allocate substantial RAM (e.g. 64MB of memory), which starves GPU memory and makes parallel attacks economically and physically infeasible.",
    ],
    evaluationRubric: [
      {
        criteria: "Fast Hashes vs KDFs Vulnerability Analysis",
        weight: "40%",
        description: "Explains how high throughput on GPUs enables offline brute force on SHA-256.",
      },
      {
        criteria: "Salt Mechanics & Rainbow Tables",
        weight: "30%",
        description: "Articulates how salts prevent identical hashes and precomputed lookup table attacks.",
      },
      {
        criteria: "Memory-Hardness & Work Factors (Argon2 / bcrypt)",
        weight: "30%",
        description: "Explains configurable work factor and memory-hardness principles in Argon2id.",
      },
    ],
    referenceAnswer:
      "### 1. The Fatal Flaw of Reversible Encryption (AES):\nReversible encryption requires an encryption key. If an attacker gains read access to the database (SQL injection, leaked backup) and finds the server environment key, **every single user password across the entire database is decrypted in cleartext instantly**.\n\n### 2. Why Fast Hashes (SHA-256, SHA-3) Fail for Passwords:\n- SHA-256 was engineered for file verification and digital signatures. It is designed to be **as fast as possible**.\n- Modern GPUs contain thousands of compute cores. A single modern GPU rig can compute **over 10 billion SHA-256 hashes per second**.\n- If an attacker steals a database of salted SHA-256 hashes, an 8-character alphanumeric password can be brute-forced offline in a matter of hours.\n\n### 3. The Role of Salting:\nA salt is a cryptographically random byte sequence (e.g. 16 bytes) generated uniquely for each user and stored alongside the hash:\n- Defeats **Rainbow Tables** (pre-computed dictionary hash tables).\n- Ensures that two users with the exact same password (`Password123`) have completely different stored hashes.\n\n### 4. Why Use Argon2id or bcrypt:\nPassword-storage algorithms are **slow by design**:\n- **Adjustable Work Factor (Time Cost)**: You can configure the calculation to take ~250ms on the server. For a legitimate user logging in once, 250ms is imperceptible. For an attacker testing 100 million guesses, 250ms per guess makes the attack take years.\n- **Memory-Hardness (Argon2id - OWASP Winner)**: Argon2id requires a configurable amount of physical RAM (e.g. 64MB per hash). A GPU with 16GB of VRAM can only run 256 parallel attempts instead of millions, neutralizing custom ASIC and GPU cracker rigs.",
    commonMistakes: [
      "Assuming a hardcoded global 'pepper' replaces unique per-user salts.",
      "Believing that hashing with SHA-256 1,000 times in a loop is equivalent to a certified KDF like Argon2id.",
    ],
    followUpQuestion:
      "What should a system do if modern hardware becomes faster and the existing bcrypt cost factor becomes too easy?",
    followUpAnswer:
      "Increase the cost factor in configuration. In your login verification route, check `bcrypt.needsRehash(storedHash, newCost)`. If true, re-hash the user's password with the higher cost factor upon their next successful login and update the database row seamlessly.",
    references: [
      {
        title: "OWASP: Password Storage Cheat Sheet",
        url: "https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html",
      },
      {
        title: "IETF RFC 9106: Argon2 Password-Hashing Function",
        url: "https://datatracker.ietf.org/doc/html/rfc9106",
      },
    ],
  },
  {
    id: "DS02",
    slug: "compare-cookie-sessions-vs-jwt-auth",
    title: "Compare HttpOnly Cookie Sessions vs Stateless JWT Tokens",
    summary:
      "Evaluate trade-offs between server-side cookie sessions and client-side JWTs across revocation, XSS/CSRF security, horizontal scalability, and storage.",
    topic: "databases-security",
    mode: "explain",
    difficulty: "applied",
    estimatedMinutes: 20,
    tags: ["Security", "Authentication", "JWT", "Cookies", "Sessions", "CSRF", "XSS"],
    skillsTested: [
      "Server-side State vs Stateless Token Architecture",
      "Secure Cookie Directives (`HttpOnly`, `Secure`, `SameSite`)",
      "Immediate Session Revocation Mechanisms",
      "XSS vs CSRF Vulnerability Surface Trade-offs",
    ],
    scenario:
      "An engineering team is debating how to implement user authentication for a SaaS platform. Engineer A advocates storing stateless JWTs in browser `localStorage`. Engineer B advocates using session identifiers stored in `HttpOnly, Secure, SameSite=Lax` cookies backed by Redis. Compare both architectures in detail, covering revocation, XSS, CSRF, and horizontal scalability.",
    requirements: [
      "Compare storage location vulnerability: `localStorage` (vulnerable to XSS extraction) versus `HttpOnly` cookies (inaccessible to JavaScript).",
      "Detail the defense against Cross-Site Request Forgery (CSRF) when using cookies (`SameSite=Lax/Strict`, Anti-CSRF tokens).",
      "Explain the revocation dilemma: How do you immediately invalidate a compromised JWT before its expiration timestamp?",
      "Summarize the trade-offs regarding horizontal scaling and database round trips.",
    ],
    starterCode: `// Architecture A: JWT in localStorage
localStorage.setItem("access_token", token);
// Header: Authorization: Bearer <token>

// Architecture B: HttpOnly Cookie Session
// Set-Cookie: session_id=xyz; HttpOnly; Secure; SameSite=Lax; Path=/`,
    programmingLanguage: "typescript",
    hints: [
      "Any script injected via an XSS vulnerability (e.g. from an npm package or unsanitized markdown) can read all data inside `localStorage`.",
      "`HttpOnly` cookies cannot be read by JavaScript `document.cookie`, preventing token exfiltration.",
      "If a user's laptop is stolen or an admin bans an employee, a truly stateless JWT remains valid until its `exp` claim expires unless a centralized blacklist is checked on every request.",
    ],
    evaluationRubric: [
      {
        criteria: "XSS vs CSRF Threat Modeling",
        weight: "40%",
        description: "Accurately analyzes how HttpOnly mitigates token theft while requiring CSRF protection.",
      },
      {
        criteria: "Revocation Trade-off Analysis",
        weight: "35%",
        description: "Explains why stateless JWTs cannot be instantly revoked without a centralized database/Redis check.",
      },
      {
        criteria: "Cookie Security Directives Understanding",
        weight: "25%",
        description: "Articulates `HttpOnly`, `Secure`, and `SameSite=Lax/Strict` configurations.",
      },
    ],
    referenceAnswer:
      "### Comprehensive Authentication Comparison:\n\n| Criteria | Cookie-Based Sessions | Stateless JWT in `localStorage` |\n| :--- | :--- | :--- |\n| **Storage Location** | Browser cookie jar (`HttpOnly`) | Browser `localStorage` / `sessionStorage` |\n| **XSS Vulnerability** | **Protected**: JS cannot read the cookie. | **High Risk**: Any XSS payload can steal the token via `localStorage.getItem()`. |\n| **CSRF Vulnerability** | Requires `SameSite=Lax` or Anti-CSRF tokens. | Immune to CSRF (custom headers not sent automatically by browser). |\n| **Revocation** | **Instant**: Delete session row from Redis/DB. | **Impossible without shared state**: Token is valid until `exp` expires. |\n| **Scalability** | Requires shared session store (Redis) lookup. | Zero database lookups (validated via cryptographic signature). |\n| **Payload Size** | Lightweight (UUID session ID ~32 bytes). | Heavy (Header + Payload + Signature ~500–1000 bytes per request). |\n\n### Why Storing JWTs in `localStorage` is an Anti-Pattern:\n`localStorage` has zero access controls against JavaScript running in the same origin. A single malicious npm dependency or cross-site scripting flaw allows attackers to exfiltrate tokens and impersonate users indefinitely.\n\n### Recommended Best Practice Architecture:\n1. **Use `HttpOnly, Secure, SameSite=Lax` cookies** for web applications.\n2. **Short-lived access tokens (15 mins) + Refresh tokens in HttpOnly cookies** for hybrid architectures.\n3. **Modern `SameSite=Lax`** protects against 99% of top-level CSRF attacks while allowing seamless navigation from search engines.",
    commonMistakes: [
      "Believing JWTs are encrypted (JWTs are merely signed and base64-encoded; anyone can read their contents).",
      "Using JWTs to 'avoid database lookups' but then having to query the database anyway to check if the user is banned or their permissions changed.",
    ],
    followUpQuestion:
      "What is the difference between `SameSite=Lax` and `SameSite=Strict`?",
    followUpAnswer:
      "`SameSite=Strict` never sends the cookie on any cross-site request (even if the user clicks a link from Google to your site, they appear logged out until second click). `SameSite=Lax` allows safe top-level `GET` navigations from external sites while blocking cross-site `POST`/`PUT` requests.",
    references: [
      {
        title: "OWASP: Cross-Site Request Forgery Prevention Cheat Sheet",
        url: "https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html",
      },
      {
        title: "MDN: Using HTTP cookies",
        url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies",
      },
    ],
  },
  {
    id: "DS03",
    slug: "fix-broken-object-level-authorization-bola",
    title: "Diagnose and Fix Broken Object-Level Authorization (BOLA / IDOR)",
    summary:
      "Find and eliminate Broken Object-Level Authorization (OWASP API Security #1) where authenticated users manipulate resource IDs to access foreign data.",
    topic: "databases-security",
    mode: "debug",
    difficulty: "applied",
    estimatedMinutes: 20,
    tags: ["Security", "OWASP", "Authorization", "BOLA", "IDOR", "PostgreSQL"],
    skillsTested: [
      "Authentication vs Authorization Distinctions",
      "OWASP API Security #1 (BOLA / IDOR)",
      "Database Row-Level Ownership Verification",
      "Tenant Isolation in REST Endpoints",
    ],
    scenario:
      "An invoice management API endpoint `GET /api/invoices/:id` correctly verifies that the user is logged in via a valid JWT token (`req.user.id`). However, security penetration testers discover that User A (id: `usr_123`) can view User B's confidential invoice by simply changing the URL from `/api/invoices/inv_1` to `/api/invoices/inv_2`. Inspect the code below, explain the vulnerability, and refactor it with strict ownership authorization.",
    requirements: [
      "Identify the Broken Object-Level Authorization (BOLA / IDOR) vulnerability in the controller query.",
      "Explain why verifying authentication (is user logged in?) is not the same as verifying authorization (does user own this object?).",
      "Refactor the database query to enforce ownership directly in the SQL/ORM `WHERE` clause.",
      "Return appropriate status codes: Return `HTTP 404 Not Found` (to avoid leaking resource existence) instead of `403 Forbidden`.",
    ],
    starterCode: `// VULNERABLE CONTROLLER (GET /api/invoices/:id)
export async function getInvoiceHandler(req: Request, res: Response) {
  // req.user is populated by auth middleware
  const currentUserId = req.user.id;
  const invoiceId = req.params.id;

  // BUG: Fetches by invoiceId without checking currentUserId ownership!
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
  });

  if (!invoice) {
    return res.status(404).json({ error: "Invoice not found" });
  }

  // Sensitive financial data returned to unauthorized user!
  return res.json(invoice);
}`,
    programmingLanguage: "typescript",
    hints: [
      "The query filters solely by `where: { id: invoiceId }`. It never checks `userId: currentUserId` or organization tenancy.",
      "An attacker can write a simple loop iterating over integer IDs or UUIDs to scrape every customer's financial records.",
      "Query for `{ id: invoiceId, userId: currentUserId }` so the database query itself guarantees tenant isolation.",
    ],
    evaluationRubric: [
      {
        criteria: "BOLA / IDOR Vulnerability Diagnosis",
        weight: "40%",
        description: "Accurately explains failure to enforce object-level ownership checks against authenticated identity.",
      },
      {
        criteria: "Database Query Refactoring",
        weight: "40%",
        description: "Enforces tenant/user ownership in the database WHERE clause.",
      },
      {
        criteria: "Information Leakage Mitigation (404 vs 403)",
        weight: "20%",
        description: "Explains why returning 404 prevents ID enumeration attacks.",
      },
    ],
    referenceAnswer:
      "### The Vulnerability: BOLA / IDOR\nThis is **OWASP API Security Top 10 #1: Broken Object Level Authorization (BOLA)** (also known as Insecure Direct Object References or IDOR).\n- The endpoint verified that the caller had a valid JWT (**Authentication**).\n- However, it never verified if the authenticated user has permission to access the specific invoice record (**Authorization**).\n- Any authenticated user can enumerate or guess `invoiceId` values and read confidential financial documents belonging to any other user in the database.\n\n### The Correct Implementation:\n\nEnforce ownership directly in the database query:\n```typescript\nexport async function getInvoiceHandler(req: Request, res: Response) {\n  const currentUserId = req.user.id;\n  const invoiceId = req.params.id;\n\n  // Query enforces both record ID and ownership\n  const invoice = await prisma.invoice.findFirst({\n    where: {\n      id: invoiceId,\n      userId: currentUserId, // Or organizationId if multi-tenant team\n    },\n  });\n\n  if (!invoice) {\n    // Return 404 rather than 403 to prevent attackers from discovering\n    // whether a foreign invoice ID exists.\n    return res.status(404).json({\n      error: 'Invoice not found',\n    });\n  }\n\n  return res.json(invoice);\n}\n```\n\n### Why return 404 instead of 403:\nIf you return `403 Forbidden`, the attacker learns that `inv_99` exists in your database and belongs to someone else. Returning `404 Not Found` makes unauthorized records appear non-existent, shutting down resource enumeration.",
    commonMistakes: [
      "Relying on client-side UI to hide unauthorized invoice links while leaving the REST endpoint wide open.",
      "Using predictable incremental auto-increment IDs (`/invoices/1`, `/invoices/2`) without UUIDv4 or NanoID, making automated enumeration trivial.",
    ],
    followUpQuestion:
      "How do Role-Based Access Control (RBAC) and Organization tenancy (multi-tenant teams) complicate this logic?",
    followUpAnswer:
      "In team environments, an invoice belongs to an `organizationId`. The authorization check must query if the user has an active `Membership` in that `organizationId` with a role (e.g. `billing_viewer` or `admin`) that possesses the `invoice:read` permission.",
    references: [
      {
        title: "OWASP: API Security Top 10 - API1:2023 Broken Object Level Authorization",
        url: "https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/",
      },
      {
        title: "PortSwigger Web Security Academy: Insecure Direct Object References (IDOR)",
        url: "https://portswigger.net/web-security/access-control/idor",
      },
    ],
  },
  {
    id: "DS04",
    slug: "investigate-slow-sql-query-b-tree-indexes",
    title: "Analyze Slow SQL Queries with EXPLAIN ANALYZE and B-Tree Indexes",
    summary:
      "Analyze query execution plans, diagnose sequential table scans (Seq Scan), and design high-performance B-Tree composite indexes in PostgreSQL.",
    topic: "databases-security",
    mode: "explain",
    difficulty: "applied",
    estimatedMinutes: 20,
    tags: ["Databases", "SQL", "PostgreSQL", "Indexing", "Performance", "EXPLAIN ANALYZE"],
    skillsTested: [
      "PostgreSQL EXPLAIN ANALYZE Execution Plans",
      "Sequential Scan vs Index Scan / Index Only Scan",
      "B-Tree Composite Index Column Ordering (Equality then Range)",
      "Write Amplification & Index Overhead Trade-offs",
    ],
    scenario:
      "An orders lookup query `SELECT * FROM orders WHERE user_id = $1 AND status = 'COMPLETED' ORDER BY created_at DESC LIMIT 10` is taking 3,200ms in production across 8 million rows. Inspect the execution plan, explain what `Seq Scan` and `Sort Method` indicate, and design the optimal composite index to reduce execution time to under 5ms.",
    requirements: [
      "Interpret the output of `EXPLAIN (ANALYZE, BUFFERS)`: Sequential Scan, Heap Blocks Read, and Memory/Disk Sort.",
      "Design the optimal composite B-Tree index: specify column order `(user_id, status, created_at DESC)` and explain why column order is critical.",
      "Explain the performance difference between an `Index Scan` and an `Index Only Scan`.",
      "Discuss the trade-offs of database indexes: disk consumption, memory cache pressure, and write amplification on `INSERT`/`UPDATE`.",
    ],
    starterCode: `-- Execution Plan:
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM orders
WHERE user_id = 'usr_42' AND status = 'COMPLETED'
ORDER BY created_at DESC
LIMIT 10;

-- Plan Output:
-- Limit  (cost=125430.12..125430.15 rows=10 width=128) (actual time=3240.12..3240.14)
--   ->  Sort  (cost=125430.12..125450.00 rows=7940 width=128) (actual time=3240.10)
--         Sort Key: created_at DESC
--         Sort Method: external merge  Disk: 4200kB
--         ->  Seq Scan on orders  (cost=0.00..124800.00 rows=7940 width=128) (actual time=0.04..3180.20)
--               Filter: ((user_id = 'usr_42') AND (status = 'COMPLETED'))
--               Rows Removed by Filter: 7992060
-- Planning Time: 0.15 ms
-- Execution Time: 3241.50 ms`,
    programmingLanguage: "sql",
    hints: [
      "`Seq Scan on orders ... Rows Removed by Filter: 7,992,060`: The database read all 8 million rows off storage into memory because no index supported this search.",
      "`Sort Method: external merge Disk: 4200kB`: PostgreSQL did not have an index ordered by `created_at`, so it dumped the filtered rows to disk to sort them!",
      "The Golden Rule of Composite Indexes: **Equality columns first, then Range/Sort columns** (`user_id, status, created_at DESC`).",
    ],
    evaluationRubric: [
      {
        criteria: "Execution Plan Reading",
        weight: "40%",
        description: "Accurately interprets Seq Scan disk reading and external merge sort overhead.",
      },
      {
        criteria: "Composite Index Ordering",
        weight: "40%",
        description: "Applies 'Equality columns first, Sort/Range second' rule accurately.",
      },
      {
        criteria: "Index Overhead & Write Trade-offs",
        weight: "20%",
        description: "Articulates impact on write throughput (INSERT/UPDATE/DELETE) and buffer cache.",
      },
    ],
    referenceAnswer:
      "### 1. Diagnosis of Execution Plan:\n- **`Seq Scan on orders (Rows Removed: 7,992,060)`**: Because there was no index matching the filter, the database had to perform a full sequential scan, reading all 8,000,000 order records off disk. This alone took **3,180ms**.\n- **`Sort Method: external merge Disk: 4200kB`**: Because the data was not already presorted by index, PostgreSQL had to buffer all matching rows and perform an expensive disk-based merge sort to satisfy `ORDER BY created_at DESC LIMIT 10`.\n\n### 2. The Optimal Composite Index:\n```sql\nCREATE INDEX idx_orders_user_status_created \nON orders (user_id, status, created_at DESC);\n```\n\n### Why Column Order Matters (The ESR Rule):\n1. **Equality columns (`user_id, status`) come FIRST**: The B-Tree immediately navigates to the branch matching `user_id = 'usr_42' AND status = 'COMPLETED'` in $O(\\log N)$ time.\n2. **Sort column (`created_at DESC`) comes LAST**: Within that exact branch, the index leaves are **already ordered by `created_at DESC`**. PostgreSQL reads the first 10 index pointers and **immediately stops**! No sorting required (**Zero-Sort Plan**).\n\n### Results After Index:\n- Plan switches to: `Limit -> Index Scan using idx_orders_user_status_created`.\n- Execution time drops from **3,241ms to 0.4ms** (an 8,000x speedup).\n\n### 3. Index Trade-offs:\n- **Write Amplification**: Every `INSERT`, `UPDATE`, or `DELETE` on the `orders` table now requires updating this B-Tree index structure.\n- **Storage & RAM Pressure**: Indexes take disk space and must fit into the PostgreSQL `shared_buffers` memory pool for optimal performance.",
    commonMistakes: [
      "Creating three separate single-column indexes: `CREATE INDEX (user_id)`, `CREATE INDEX (status)`, and `CREATE INDEX (created_at)`. PostgreSQL either uses Bitmap Index Scan or picks just one, leaving the other operations un-optimized.",
      "Putting `created_at` first in the composite index: A B-Tree cannot jump to specific `user_id` values if the tree is sorted primarily by timestamp.",
    ],
    followUpQuestion:
      "What is a 'Partial Index' in PostgreSQL and how could it optimize this query if `status = 'COMPLETED'` represents 95% of queries?",
    followUpAnswer:
      "Create `CREATE INDEX idx_orders_active ON orders (user_id, created_at DESC) WHERE status = 'COMPLETED';`. This partial index completely excludes other statuses, cutting index disk size and memory consumption by 80% while accelerating completed queries.",
    references: [
      {
        title: "PostgreSQL Docs: Using EXPLAIN",
        url: "https://www.postgresql.org/docs/current/using-explain.html",
      },
      {
        title: "Use The Index, Luke: The Anatomy of an Index",
        url: "https://use-the-index-luke.com/sql/anatomy",
      },
    ],
  },
  {
    id: "DS05",
    slug: "diagnose-n-plus-one-query-orm-loop",
    title: "Diagnose and Resolve N+1 Query Cascade in Relational ORMs",
    summary:
      "Identify the N+1 database round-trip anti-pattern in ORM query loops, quantify network latency cascades, and refactor using batch joins.",
    topic: "databases-security",
    mode: "debug",
    difficulty: "applied",
    estimatedMinutes: 20,
    tags: ["Databases", "SQL", "ORM", "Prisma", "Performance", "N+1 Problem"],
    skillsTested: [
      "N+1 Query Anti-Pattern Recognition",
      "Eager Loading vs Lazy Relational Fetching",
      "Network Latency Multipliers on DB Connections",
      "SQL JOIN and Batch `WHERE IN` Refactoring",
    ],
    scenario:
      "In a social app endpoint `GET /api/feed`, loading 50 posts works cleanly in development with 2 posts. However, in staging with 50 posts, the endpoint triggers 101 separate SQL database queries and takes 3.8 seconds. Inspect the code, explain the N+1 query loop, and rewrite it using Prisma eager loading and raw SQL joins to reduce queries from 101 to 1.",
    requirements: [
      "Identify the 1 initial query + N queries executed inside the JavaScript iteration loop.",
      "Calculate the impact of database network round trip time (e.g. 50 orders × 20ms network latency = 1,000ms idle socket wait).",
      "Refactor the code using Prisma's relational `include` API.",
      "Provide the equivalent single raw SQL query using `LEFT JOIN` and JSON aggregation.",
    ],
    starterCode: `// GET /api/feed (Buggy Implementation)
export async function getFeed(userId: string) {
  // Query 1: Fetch 50 posts
  const posts = await prisma.post.findMany({
    where: { authorId: userId },
    take: 50,
  });

  // BUG: N+1 sequential loop queries
  const enrichedPosts = [];
  for (const post of posts) {
    const author = await prisma.user.findUnique({
      where: { id: post.authorId },
    });
    const comments = await prisma.comment.findMany({
      where: { postId: post.id },
    });
    enrichedPosts.push({ ...post, author, comments });
  }

  return enrichedPosts;
}`,
    programmingLanguage: "typescript",
    hints: [
      "Count queries: 1 initial query + 50 queries for authors + 50 queries for comments = 101 total queries.",
      "Prisma supports eager loading: `prisma.post.findMany({ include: { author: true, comments: true } })`.",
      "In raw SQL, you can combine tables using `LEFT JOIN` or `json_agg()` in PostgreSQL.",
    ],
    evaluationRubric: [
      {
        criteria: "N+1 Mathematical Calculation",
        weight: "35%",
        description: "Accurately calculates total round trips (1 + 2N) and socket latency overhead.",
      },
      {
        criteria: "ORM Eager Loading Refactoring",
        weight: "35%",
        description: "Replaces loop with Prisma `include`.",
      },
      {
        criteria: "SQL JOIN / Aggregation Proficiency",
        weight: "30%",
        description: "Demonstrates relational `LEFT JOIN` or batching mechanism.",
      },
    ],
    referenceAnswer:
      "### The Problem: N+1 Database Round Trips\nFor 50 posts, the loop triggers:\n- 1 query to fetch posts\n- 50 queries for `author`\n- 50 queries for `comments`\nTotal: **101 round trips to the database**!\n\nEven with a fast database query time (0.5ms), if the network round trip latency between the app server and database is 15ms:\n$$101 \\times 15\\text{ms} = 1,515\\text{ms}$$\nThe server wastes 1.5 seconds purely waiting on network packet hops across socket connections!\n\n### Solution 1: Prisma Eager Loading (`include`):\nPrisma executes eager loading using either a single join or efficient batched `WHERE IN` queries behind the scenes:\n```typescript\nexport async function getFeed(userId: string) {\n  return prisma.post.findMany({\n    where: { authorId: userId },\n    take: 50,\n    include: {\n      author: {\n        select: { id: true, name: true, avatarUrl: true },\n      },\n      comments: {\n        take: 10,\n        orderBy: { createdAt: 'desc' },\n      },\n    },\n  });\n}\n```\nQueries drop from **101 down to 2-3 queries**, reducing latency from 3,800ms to <30ms.\n\n### Solution 2: Raw SQL with JSON Aggregation (1 Single Query):\n```sql\nSELECT \n  p.id, p.content, p.created_at,\n  json_build_object('id', u.id, 'name', u.name) AS author,\n  COALESCE(json_agg(c.*) FILTER (WHERE c.id IS NOT NULL), '[]') AS comments\nFROM posts p\nJOIN users u ON u.id = p.author_id\nLEFT JOIN comments c ON c.post_id = p.id\nWHERE p.author_id = $1\nGROUP BY p.id, u.id\nLIMIT 50;\n```",
    commonMistakes: [
      "Wrapping the loop in `Promise.all(posts.map(...))` thinking concurrency fixes the problem (it fires 100 queries at the exact same millisecond, exhausting database connection pool limits).",
      "Fetching the entire `author` table into Node.js memory and doing client-side joining.",
    ],
    followUpQuestion:
      "How does the DataLoader pattern solve this problem in GraphQL resolvers?",
    followUpAnswer:
      "DataLoader collects all individual ID lookups requested during a single tick of the event loop, batches them into a single `SELECT * FROM users WHERE id IN (1, 2, 3...)` query, and distributes the results back to the individual awaiting promises, preventing resolver N+1 cascades.",
    references: [
      {
        title: "Prisma Docs: Relation queries & Eager loading",
        url: "https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries",
      },
      {
        title: "GraphQL: DataLoader Specification",
        url: "https://github.com/graphql/dataloader",
      },
    ],
  },
];
