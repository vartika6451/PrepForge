export interface CoreCSQuestion {
  id: string;
  subject: "Operating Systems" | "DBMS" | "Computer Networks" | "OOP" | "System Design" | "SQL";
  topic: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  explanation: string;
  codeExample?: string;
  keyTakeaways: string[];
  // For SQL practice queries:
  sampleSchema?: string;
  sampleData?: string;
  solutionQuery?: string;
}

export const CORE_CS_QUESTIONS: CoreCSQuestion[] = [
  // --- OPERATING SYSTEMS ---
  {
    id: "cs-os-1",
    subject: "Operating Systems",
    topic: "Processes & Threads",
    title: "Process vs Thread: Memory Model, Context Switching, and IPC",
    difficulty: "Medium",
    question: "Explain the fundamental differences between a process and a thread, focusing on memory allocation, context switching overhead, and inter-process communication.",
    explanation: "A process is an executing program instance with its own private address space (code, data, heap, and open file descriptors). A thread (lightweight process) is the smallest execution unit within a process, sharing the parent process's heap, global variables, and code section, but keeping its own program counter, stack, and register set.\n\nContext Switching: Switching between threads of the same process is significantly faster because the virtual memory address translation tables (TLB - Translation Lookaside Buffer) remain valid. In contrast, switching between processes invalidates the TLB, incurring cache misses.\n\nCommunication: Threads communicate effortlessly via shared memory (though requiring synchronization primitives like mutexes). Processes require OS-mediated Inter-Process Communication (IPC) mechanisms such as pipes, message queues, shared memory segments, or Unix domain sockets.",
    codeExample: `// POSIX Threads (pthreads) in C
#include <pthread.h>
#include <stdio.h>

int shared_counter = 0;
pthread_mutex_t lock;

void* worker(void* arg) {
    pthread_mutex_lock(&lock);
    shared_counter++; // Protected critical section
    pthread_mutex_unlock(&lock);
    return NULL;
}`,
    keyTakeaways: [
      "Processes have isolated virtual memory spaces; threads within the same process share heap, data, and code segments.",
      "Thread context switching avoids TLB flush, making it substantially faster than process switching.",
      "Threads communicate via shared memory; processes require IPC (pipes, sockets, shared memory)."
    ]
  },
  {
    id: "cs-os-2",
    subject: "Operating Systems",
    topic: "Deadlocks & Concurrency",
    title: "Deadlock Conditions & Prevention (Coffman Conditions)",
    difficulty: "Hard",
    question: "What are the four necessary Coffman conditions for a deadlock to occur, and how can resource ordering prevent them?",
    explanation: "A deadlock is a permanent blocking of a set of concurrent processes where each holds a resource and waits for another resource held by another process.\n\nThe 4 Coffman Conditions:\n1. Mutual Exclusion: At least one resource must be held in a non-shareable mode.\n2. Hold and Wait: A process holding at least one resource is waiting to acquire additional resources held by other processes.\n3. No Preemption: Resources cannot be forcibly reclaimed from a process holding them; they must be voluntarily released.\n4. Circular Wait: A closed chain of processes exists such that each process holds at least one resource needed by the next process in the chain.\n\nPrevention via Resource Hierarchy:\nImpose a strict global ordering on all resources (e.g., Resource R1 < R2 < R3). A process may only request resources in strictly ascending order. This mathematically breaks condition #4 (Circular Wait), guaranteeing deadlock freedom.",
    keyTakeaways: [
      "Deadlock requires all 4 Coffman conditions simultaneously: Mutual Exclusion, Hold & Wait, No Preemption, and Circular Wait.",
      "Resource ordering eliminates Circular Wait by forcing all acquisitions to follow a monotonic sequence.",
      "Banker's Algorithm is an avoidance algorithm that tests for safe states before granting resource requests."
    ]
  },
  {
    id: "cs-os-3",
    subject: "Operating Systems",
    topic: "Memory Management",
    title: "Virtual Memory, Paging, and Thrashing",
    difficulty: "Medium",
    question: "How does virtual memory mapping work via page tables, and what causes OS thrashing?",
    explanation: "Virtual memory decouples the process's logical address space from physical RAM. The address is split into Page Number and Page Offset. The CPU Memory Management Unit (MMU) uses the Page Table (accelerated by the hardware TLB cache) to map logical pages to physical frames.\n\nThrashing occurs when the total working set size of all active processes exceeds physical RAM capacity. The OS spends the vast majority of CPU cycles swapping pages in and out of swap disk (page fault handling) rather than executing program instructions. Thrashing can be mitigated by reducing the degree of multiprogramming (suspending processes) or increasing physical RAM.",
    keyTakeaways: [
      "Virtual memory provides process address isolation and allows programs larger than physical memory.",
      "TLB (Translation Lookaside Buffer) acts as a high-speed hardware cache for page table lookups.",
      "Thrashing happens when the page fault frequency becomes overwhelmingly high due to insufficient physical frames."
    ]
  },

  // --- DBMS ---
  {
    id: "cs-db-1",
    subject: "DBMS",
    topic: "Transactions & ACID",
    title: "ACID Properties & Transaction Isolation Levels",
    difficulty: "Hard",
    question: "Define the ACID properties and explain the 4 standard SQL isolation levels with their corresponding read phenomena.",
    explanation: "ACID ensures reliable database transaction processing:\n- Atomicity: All or nothing execution (via write-ahead logs / WAL).\n- Consistency: Transactions transition the DB from one valid state to another, preserving constraints.\n- Isolation: Concurrent transactions do not interfere with each other.\n- Durability: Committed changes survive system crashes.\n\nIsolation Levels & Phenomena:\n1. Read Uncommitted: Suffers from Dirty Reads (reading uncommitted data that may roll back).\n2. Read Committed: Prevents Dirty Reads; suffers from Non-Repeatable Reads (subsequent read in same transaction sees modified values).\n3. Repeatable Read: Prevents Non-Repeatable Reads using MVCC snapshot; can suffer from Phantom Reads (new rows inserted by another transaction).\n4. Serializable: Full logical isolation; transactions appear to run sequentially. Highest overhead.",
    keyTakeaways: [
      "ACID guarantees reliability, implemented via WAL, two-phase locking, and Multi-Version Concurrency Control (MVCC).",
      "PostgreSQL default isolation is Read Committed, using MVCC snapshots for consistent reads.",
      "Serializable isolation guarantees complete freedom from anomalies at the cost of potential transaction rollbacks/retries."
    ]
  },
  {
    id: "cs-db-2",
    subject: "DBMS",
    topic: "Indexing & Query Optimization",
    title: "B-Tree vs Hash Indexing and Composite Index Column Ordering",
    difficulty: "Medium",
    question: "Why are B+ Trees favored over Hash Indexes for relational databases, and how does the Leftmost Prefix Rule impact composite indexes?",
    explanation: "Hash indexes provide O(1) equality lookups (`WHERE id = 5`), but cannot support range queries (`WHERE age BETWEEN 20 AND 30`), inequality operators (`<`, `>`), sorting (`ORDER BY`), or prefix matching (`LIKE 'John%'`).\n\nB+ Trees keep data sorted across balanced leaf nodes connected as a doubly linked list. This supports O(log N) point queries, logarithmic range scans, min/max lookups, and ordered traversals.\n\nComposite Indexes & Leftmost Prefix Rule:\nAn index on `(department_id, salary)` can accelerate:\n- `WHERE department_id = 10`\n- `WHERE department_id = 10 AND salary > 50000`\nHowever, a query filtering solely on `WHERE salary > 50000` CANNOT use the index because the leftmost column is omitted.",
    keyTakeaways: [
      "B+ Trees store all actual record pointers in sorted linked leaf pages, optimizing sequential disk I/O.",
      "Composite index column order must place the most selective equality columns first.",
      "Always verify index utilization using EXPLAIN ANALYZE."
    ]
  },

  // --- COMPUTER NETWORKS ---
  {
    id: "cs-net-1",
    subject: "Computer Networks",
    topic: "Transport Layer Protocols",
    title: "TCP 3-Way Handshake, 4-Way Teardown, and TIME_WAIT State",
    difficulty: "Medium",
    question: "Describe the packet exchange during TCP connection establishment, termination, and the necessity of the TIME_WAIT state.",
    explanation: "TCP 3-Way Handshake (Establishment):\n1. Client -> Server: SYN (seq = x)\n2. Server -> Client: SYN-ACK (seq = y, ack = x + 1)\n3. Client -> Server: ACK (ack = y + 1)\n\nTCP 4-Way Teardown (Termination):\n1. Initiator -> Receiver: FIN (seq = u)\n2. Receiver -> Initiator: ACK (ack = u + 1) — connection half-closed\n3. Receiver -> Initiator: FIN (seq = v)\n4. Initiator -> Receiver: ACK (ack = v + 1)\n\nTIME_WAIT State:\nThe initiator enters TIME_WAIT (typically 2 * MSL = 60-120s) after sending the final ACK. This serves two vital purposes:\n1. Ensures the final ACK was received by the server (if lost, the server retransmits FIN, and the client in TIME_WAIT can re-send ACK).\n2. Allows stray/delayed duplicate packets in the network to expire so they don't corrupt a subsequent socket using the same IP:port tuple.",
    keyTakeaways: [
      "The 3-way handshake synchronizes Initial Sequence Numbers (ISNs) between client and server.",
      "Teardown requires 4 segments because TCP is full-duplex and each direction closes independently.",
      "TIME_WAIT prevents duplicate delayed segments from corrupting future connections on the same port."
    ]
  },
  {
    id: "cs-net-2",
    subject: "Computer Networks",
    topic: "Application Layer & Protocols",
    title: "HTTP/1.1 vs HTTP/2 vs HTTP/3 (QUIC)",
    difficulty: "Hard",
    question: "How does HTTP/2 solve HTTP/1.1 Head-of-Line (HoL) blocking, and why was HTTP/3 rebuilt over UDP?",
    explanation: "HTTP/1.1 introduced persistent connections, but suffered from Application-layer HoL blocking: requests on a single connection had to be answered in FIFO order. Browsers worked around this by opening 6 parallel TCP connections per host.\n\nHTTP/2 solved application HoL blocking by introducing Binary Framing and Multiplexing: multiple logical streams are interleaved concurrently over a single TCP connection. However, it still suffered from Transport-layer (TCP) HoL blocking: if a single packet is dropped, TCP halts all streams on that connection until retransmission succeeds.\n\nHTTP/3 replaces TCP with QUIC (built over UDP). QUIC implements independent packet recovery per stream, native encryption (integrated TLS 1.3), 0-RTT connection resumption, and connection migration across network switches (e.g., Wi-Fi to 5G) using Connection IDs instead of IP tuples.",
    keyTakeaways: [
      "HTTP/1.1 uses text protocols with pipelining or multiple connections.",
      "HTTP/2 multiplexes streams over single TCP, but packet drops stall all streams.",
      "HTTP/3 uses QUIC over UDP, providing true stream independence and 0-RTT handshakes."
    ]
  },

  // --- OOP & DESIGN PATTERNS ---
  {
    id: "cs-oop-1",
    subject: "OOP",
    topic: "Object-Oriented Design",
    title: "The SOLID Principles with Real-World Code Examples",
    difficulty: "Medium",
    question: "Walk through each letter of SOLID with practical software design implications.",
    explanation: "SOLID represents 5 architectural guidelines:\n1. Single Responsibility Principle (SRP): A class should have only one reason to change.\n2. Open/Closed Principle (OCP): Software entities should be open for extension, but closed for modification.\n3. Liskov Substitution Principle (LSP): Subtypes must be substitutable for their base types without altering correctness.\n4. Interface Segregation Principle (ISP): Clients should not be forced to depend on interfaces they do not use.\n5. Dependency Inversion Principle (DIP): High-level modules should depend on abstractions (interfaces), not concrete implementations.",
    codeExample: `// Dependency Inversion Principle (DIP) in TypeScript
interface PaymentGateway {
  charge(amount: number): Promise<boolean>;
}

class StripeGateway implements PaymentGateway {
  async charge(amount: number): Promise<boolean> {
    console.log("Charging $" + amount + " via Stripe");
    return true;
  }
}

class CheckoutService {
  constructor(private gateway: PaymentGateway) {} // Injected abstraction

  async completeOrder(total: number) {
    return this.gateway.charge(total);
  }
}`,
    keyTakeaways: [
      "SRP creates modular, testable units with high cohesion.",
      "OCP is achieved via polymorphism, strategy patterns, and abstraction.",
      "DIP decouples business logic from external frameworks and database drivers."
    ]
  },

  // --- SYSTEM DESIGN ---
  {
    id: "cs-sd-1",
    subject: "System Design",
    topic: "Scalability & Distributed Systems",
    title: "Designing a Distributed Rate Limiter",
    difficulty: "Hard",
    question: "Design a high-throughput, low-latency distributed rate limiter capable of enforcing API quotas (e.g., 100 req/min per user).",
    explanation: "Architecture Components:\n1. Algorithm: Token Bucket or Sliding Window Counter.\n- Token Bucket: Refills tokens at a constant rate; accommodates bursts.\n- Sliding Window Counter: Divides current and previous minute into weighted counts; accurate memory footprint.\n\n2. Storage Layer: Redis in-memory cache with atomic Lua scripts.\nUsing Redis `ZADD`, `ZREMRANGEBYSCORE`, and `ZCARD` or Lua script prevents race conditions between read and increment operations.\n\n3. Edge Deployment: Run rate limiting at API Gateway (e.g., Envoy, Kong, Cloudflare Workers) to reject excess requests before touching backend application clusters.\n\n4. Headers: Return standard headers:\n- `X-RateLimit-Limit: 100`\n- `X-RateLimit-Remaining: 42`\n- `Retry-After: 18` (when HTTP 429 Too Many Requests is returned).",
    keyTakeaways: [
      "Redis Lua scripts ensure atomic rate checking without distributed mutex overhead.",
      "Sliding Window Counter balances precise throttling with low memory usage.",
      "Return HTTP 429 with Retry-After header for well-behaved API clients."
    ]
  },

  // --- SQL PRACTICE QUESTIONS ---
  {
    id: "sql-q-1",
    subject: "SQL",
    topic: "Window Functions",
    title: "Find the Second Highest Salary per Department",
    difficulty: "Medium",
    question: "Write an SQL query to find the employee with the second highest salary in each department. If a department has ties, handle them using DENSE_RANK().",
    explanation: "Use the `DENSE_RANK()` window function partitioned by `department_id` and ordered by `salary DESC`. Filter the ranked results in a Common Table Expression (CTE) or subquery where `rank = 2`.",
    sampleSchema: `CREATE TABLE employees (
  id INT PRIMARY KEY,
  name VARCHAR(50),
  salary DECIMAL(10,2),
  department_id INT
);`,
    sampleData: `INSERT INTO employees VALUES 
(1, 'Alice', 95000, 1),
(2, 'Bob', 90000, 1),
(3, 'Charlie', 85000, 1),
(4, 'David', 110000, 2),
(5, 'Eve', 110000, 2),
(6, 'Frank', 95000, 2);`,
    solutionQuery: `WITH RankedSalaries AS (
  SELECT 
    id, 
    name, 
    salary, 
    department_id,
    DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) as rnk
  FROM employees
)
SELECT id, name, salary, department_id
FROM RankedSalaries
WHERE rnk = 2;`,
    keyTakeaways: [
      "DENSE_RANK() does not skip rank values after ties, unlike RANK().",
      "PARTITION BY splits calculation into independent departmental windows.",
      "Window functions cannot be evaluated directly in WHERE clauses; use CTEs."
    ]
  },
  {
    id: "sql-q-2",
    subject: "SQL",
    topic: "Aggregation & Self-Joins",
    title: "Calculate Consecutive Active Days and Churn",
    difficulty: "Hard",
    question: "Given a table of daily user logins, identify users who logged in for at least 3 consecutive days.",
    explanation: "Group sequential dates by subtracting a sequential row index (`ROW_NUMBER()`) from the login date. If consecutive, `login_date - row_number` produces an identical constant date grouping key.",
    sampleSchema: `CREATE TABLE user_logins (
  user_id INT,
  login_date DATE
);`,
    sampleData: `INSERT INTO user_logins VALUES 
(1, '2026-10-01'),
(1, '2026-10-02'),
(1, '2026-10-03'),
(2, '2026-10-01'),
(2, '2026-10-03');`,
    solutionQuery: `WITH GroupedLogins AS (
  SELECT 
    user_id,
    login_date,
    login_date - (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date)) * INTERVAL '1 day' as grp
  FROM user_logins
)
SELECT user_id, COUNT(*) as streak_days
FROM GroupedLogins
GROUP BY user_id, grp
HAVING COUNT(*) >= 3;`,
    keyTakeaways: [
      "The Date - RowNumber technique is the classic SQL pattern for identifying consecutive sequence islands.",
      "Always deduplicate user logins per date before running sequence calculations."
    ]
  }
];
