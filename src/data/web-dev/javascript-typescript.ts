import { WebDevQuestion } from "@/types/web-dev";

export const JAVASCRIPT_TYPESCRIPT_QUESTIONS: WebDevQuestion[] = [
  {
    id: "JS01",
    slug: "predict-execution-order-event-loop-microtasks",
    title: "Predict Event Loop Execution Order: Microtasks vs Macrotasks",
    summary:
      "Analyze asynchronous JavaScript execution order across the synchronous call stack, Promise microtask queue, async/await coroutines, and timer macrotasks.",
    topic: "javascript-typescript",
    mode: "explain",
    difficulty: "foundation",
    estimatedMinutes: 15,
    tags: ["JavaScript", "Event Loop", "Microtasks", "Promises", "Async/Await", "V8"],
    skillsTested: [
      "Event Loop Phase Traversal",
      "Microtask vs Task (Macrotask) Queue Priority",
      "Async/Await Desugaring to Microtasks",
      "Call Stack Non-blocking Behavior",
    ],
    scenario:
      "During a technical interview, you are presented with the following code snippet containing synchronous logs, a `setTimeout` timer, a resolved `Promise`, and an `async` function. The interviewer asks you to predict the exact console output sequence, explain what happens in the V8 runtime at each step, and explain why microtasks take precedence over macrotasks.",
    requirements: [
      "State the exact console output in sequential order from top to bottom.",
      "Explain the runtime lifecycle of synchronous code execution on the call stack.",
      "Distinguish between the Microtask Queue (Promise jobs, queueMicrotask) and the Task/Macrotask Queue (setTimeout, I/O).",
      "Describe how evaluating an `await` expression transforms the remainder of an async function into a microtask callback.",
      "Explain why the JavaScript runtime drains the entire microtask queue before rendering or fetching the next task.",
    ],
    starterCode: `console.log("1: Script start");

setTimeout(() => {
  console.log("2: setTimeout 0ms");
}, 0);

async function checkAsync() {
  console.log("3: checkAsync start");
  await null;
  console.log("4: checkAsync post-await");
}

checkAsync();

Promise.resolve()
  .then(() => {
    console.log("5: Promise then 1");
  })
  .then(() => {
    console.log("6: Promise then 2");
  });

console.log("7: Script end");`,
    programmingLanguage: "javascript",
    hints: [
      "Code inside an async function runs synchronously until the first `await` keyword is encountered.",
      "When `await` evaluates (even with a primitive like `null`), the remainder of the async function is packaged as a microtask callback.",
      "The event loop will not pick up the `setTimeout` callback until the call stack is completely empty and ALL pending microtasks (including chained microtasks) have finished.",
    ],
    evaluationRubric: [
      {
        criteria: "Correct Execution Sequence",
        weight: "35%",
        description: "Accurately predicts the output: 1 -> 3 -> 7 -> 4 -> 5 -> 6 -> 2.",
      },
      {
        criteria: "Microtask Queue Mechanics",
        weight: "35%",
        description: "Explains that the event loop drains all microtasks (including microtasks enqueued by running microtasks) before yielding to macrotasks.",
      },
      {
        criteria: "Async/Await Desugaring",
        weight: "20%",
        description: "Explains that `await null` wraps the subsequent lines in a microtask scheduled via Promise.resolve(null).then().",
      },
      {
        criteria: "Clarity of Technical Communication",
        weight: "10%",
        description: "Uses precise runtime terms (Call Stack, Web APIs, Task Queue, Microtask Queue).",
      },
    ],
    referenceAnswer:
      "### Output Sequence:\n1. `1: Script start`\n2. `3: checkAsync start`\n3. `7: Script end`\n4. `4: checkAsync post-await`\n5. `5: Promise then 1`\n6. `6: Promise then 2`\n7. `2: setTimeout 0ms`\n\n### Step-by-Step Runtime Walkthrough:\n1. **Synchronous Pass (Call Stack)**:\n   - `console.log('1: Script start')` executes immediately.\n   - `setTimeout(..., 0)` registers a timer with the browser/Node host environment. The host queues its callback in the **Macrotask Queue** once the timer expires.\n   - `checkAsync()` is invoked synchronously. `console.log('3: checkAsync start')` runs immediately.\n   - Execution reaches `await null`. The JS engine packages the remainder of `checkAsync` as a microtask (`Promise.resolve(null).then(...)`) and yields control back to the caller.\n   - `Promise.resolve().then(...)` queues its first `.then` callback into the **Microtask Queue**.\n   - `console.log('7: Script end')` executes synchronously.\n   - The synchronous call stack is now completely empty.\n\n2. **Microtask Queue Drain**:\n   - The event loop inspects the Microtask Queue. It contains: `[checkAsync continuation, Promise then 1]`.\n   - Dequeues `checkAsync continuation`: logs `4: checkAsync post-await`.\n   - Dequeues `Promise then 1`: logs `5: Promise then 1`. Its return value schedules `Promise then 2` at the end of the Microtask Queue.\n   - Dequeues `Promise then 2`: logs `6: Promise then 2`.\n   - Microtask Queue is now empty.\n\n3. **Macrotask Processing**:\n   - The event loop now moves to the Macrotask Queue and dequeues the expired timer callback: logs `2: setTimeout 0ms`.",
    commonMistakes: [
      "Thinking `setTimeout(..., 0)` runs before microtasks because its timer is set to 0 milliseconds.",
      "Assuming calling an async function immediately runs the whole function asynchronously in a background thread.",
      "Believing that `Promise then 2` gets delayed until after the `setTimeout` callback.",
    ],
    followUpQuestion:
      "What would happen if a microtask recursively schedules another microtask via `queueMicrotask()`?",
    followUpAnswer:
      "Because the event loop guarantees that the microtask queue must be completely drained before picking up the next macrotask or performing DOM reflow/painting, an infinite microtask loop completely starves macrotasks, I/O events, and UI rendering, locking up the thread indefinitely.",
    references: [
      {
        title: "MDN: In-Depth JavaScript Event Loop & Microtasks",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop",
      },
      {
        title: "HTML Living Standard: Event Loops & Task Queues",
        url: "https://html.spec.whatwg.org/multipage/webappapis.html#event-loops",
      },
    ],
  },
  {
    id: "JS02",
    slug: "diagnose-stale-closure-event-handlers",
    title: "Diagnose Stale Closure Bug in Event Listeners and Callbacks",
    summary:
      "Identify how lexical scoping and persistent closures capture outdated variable bindings inside long-lived event listeners and asynchronous callbacks.",
    topic: "javascript-typescript",
    mode: "debug",
    difficulty: "applied",
    estimatedMinutes: 20,
    tags: ["JavaScript", "Closures", "Lexical Scope", "Event Handlers", "Debugging"],
    skillsTested: [
      "Lexical Scope & Function Closures",
      "Long-lived Callback Reference Retention",
      "Mutable References vs Primitive Rebinding",
      "Refactoring Stale Event Listeners",
    ],
    scenario:
      "A developer builds a live timer tool. The user can start a timer and increment a 'multiplier' setting via a button. However, when the 1-second interval fires, it always computes points using the initial multiplier (`1`), even if the user clicked the button to increase the multiplier to `5`. Diagnose why the closure captures the stale value and fix it.",
    requirements: [
      "Explain the lexical environment created when `startTimer()` was called.",
      "Identify why `multiplier` inside `setInterval` never reflects later reassignments of outer primitive state.",
      "Provide a clean fix using mutable container references, closure re-instantiation, or function arguments.",
      "Verify the solution avoids memory leaks and cleans up intervals on teardown.",
    ],
    starterCode: `function createScoreTracker() {
  let multiplier = 1;
  let score = 0;
  let intervalId = null;

  function setMultiplier(newMultiplier) {
    multiplier = newMultiplier;
    console.log("Multiplier updated to:", multiplier);
  }

  function startTimer() {
    // BUG: The interval callback closes over 'multiplier'
    if (intervalId) return;

    intervalId = setInterval(() => {
      score += 10 * multiplier;
      console.log(\`Tick -> Current score: \${score} (using multiplier \${multiplier})\`);
    }, 1000);
  }

  function stopTimer() {
    clearInterval(intervalId);
    intervalId = null;
  }

  return { setMultiplier, startTimer, stopTimer };
}`,
    programmingLanguage: "javascript",
    hints: [
      "In JavaScript, functions retain a reference to their parent lexical environment, not an isolated snapshot of primitives — BUT check if a handler in frameworks like React creates a fresh function while an older subscription retains the old closure.",
      "If the event listener was registered once with an immutable copy or stale React state, the handler is stuck looking at the render scope in which it was created.",
      "In vanilla JS, `let multiplier` within the same scope is shared, but if `startTimer` is called repeatedly or bound to a snapshot, it loses synchronization.",
    ],
    evaluationRubric: [
      {
        criteria: "Root Cause Diagnosis",
        weight: "40%",
        description: "Accurately articulates how closures bind to lexical environments and how stale closures occur in long-lived event listeners.",
      },
      {
        criteria: "Clean Architectural Solution",
        weight: "40%",
        description: "Implements a robust fix using ref objects, dynamic state lookups, or clean teardown/re-subscription.",
      },
      {
        criteria: "Memory Leak Prevention",
        weight: "20%",
        description: "Ensures timer teardown and removes redundant listeners on disposal.",
      },
    ],
    referenceAnswer:
      "### Diagnosis:\nA closure is the combination of a function bundled together with references to its surrounding lexical state. In asynchronous callbacks and event listeners, a stale closure occurs when a function retains a reference to an earlier environment record while the application has moved on to newer state.\n\nIn UI frameworks like React, this frequently happens when `useEffect` has an empty dependency array `[]`: the callback captures the initial state variable (e.g. `count = 0`), and subsequent re-renders create new closures that the running timer never receives.\n\n### The Fix (Mutable Container or Callback Ref):\nIn vanilla JS or React, keep a mutable container reference (such as an object property or `useRef`) or query the current state dynamically:\n\n```javascript\nfunction createScoreTracker() {\n  const state = {\n    multiplier: 1,\n    score: 0,\n    intervalId: null,\n  };\n\n  function setMultiplier(newMultiplier) {\n    state.multiplier = newMultiplier;\n  }\n\n  function startTimer() {\n    if (state.intervalId) return;\n    state.intervalId = setInterval(() => {\n      state.score += 10 * state.multiplier;\n      console.log(`Score: ${state.score} (multiplier: ${state.multiplier})`);\n    }, 1000);\n  }\n\n  function stopTimer() {\n    clearInterval(state.intervalId);\n    state.intervalId = null;\n  }\n\n  return { setMultiplier, startTimer, stopTimer };\n}\n```\nBy reading properties off `state`, the timer always accesses the live property value on the shared heap object.",
    commonMistakes: [
      "Assuming `setInterval` creates a clone of the primitive variable at interval definition time (it closes over the binding, but re-renders in component architectures swap bindings).",
      "Fixing the issue by clearing and restarting the timer on every state update, which restarts the 1-second countdown continuously and prevents ticks from firing.",
    ],
    followUpQuestion:
      "How does this exact stale closure issue manifest in React's `useEffect` hook, and how does the `useRef` pattern resolve it?",
    followUpAnswer:
      "In React, each render has its own props and state. If an effect registers an event listener with `[]` dependencies, its closure is locked into the initial render's scope. By storing the latest value in a `useRef` container (whose `.current` property is mutable and persists across renders), the listener reads `latestRef.current` without needing to re-bind.",
    references: [
      {
        title: "MDN: Closures in JavaScript",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures",
      },
      {
        title: "Overreacted: Making setInterval Declarative with React Hooks",
        url: "https://overreacted.io/making-setinterval-declarative-with-react-hooks/",
      },
    ],
  },
  {
    id: "JS03",
    slug: "promise-all-vs-allsettled-concurrent-dashboard",
    title: "Promise Concurrency Strategies: Promise.all vs Promise.allSettled",
    summary:
      "Compare failure behavior, circuit-breaking, and UI resiliency when coordinating parallel asynchronous network requests for composite dashboards.",
    topic: "javascript-typescript",
    mode: "explain",
    difficulty: "applied",
    estimatedMinutes: 20,
    tags: ["JavaScript", "Promises", "Async", "Concurrency", "Error Handling"],
    skillsTested: [
      "Promise.all Fail-Fast Semantics",
      "Promise.allSettled Inspection",
      "Partial Degradation UI Strategies",
      "Sequential vs Concurrent Latency Analysis",
    ],
    scenario:
      "You are designing the data loading layer for a developer analytics dashboard that displays three independent widgets: User Account Details, Monthly Invoices, and System Incident Alerts. Each endpoint has different failure rates and response latencies. Explain whether you should use `Promise.all`, `Promise.allSettled`, or sequential `await` calls, and how the UI should handle partial network failures.",
    requirements: [
      "Explain the 'fail-fast' abort behavior of `Promise.all` and why it may be undesirable for independent dashboard widgets.",
      "Explain the settled status objects returned by `Promise.allSettled` (`status: 'fulfilled' | 'rejected'`).",
      "Compare total network completion latency between sequential `await` requests versus concurrent execution.",
      "Provide a recommended implementation that renders successful widgets while displaying localized error states for failed requests.",
    ],
    starterCode: `// Which strategy should power this dashboard loader?
async function loadDashboard(userId: string) {
  // Option A: Sequential awaits
  // Option B: Promise.all([fetchUser, fetchInvoices, fetchAlerts])
  // Option C: Promise.allSettled([fetchUser, fetchInvoices, fetchAlerts])
}`,
    programmingLanguage: "typescript",
    hints: [
      "If the 'System Incident Alerts' service fails with HTTP 500, does the user still need to see their Account Details and Invoices?",
      "In `Promise.all`, if one promise rejects, the returned promise immediately rejects with that error, ignoring the outcomes of the other promises.",
      "Sequential awaits run in series ($T_1 + T_2 + T_3$), whereas concurrent execution takes approximately $\\max(T_1, T_2, T_3)$.",
    ],
    evaluationRubric: [
      {
        criteria: "Promise.all vs allSettled Trade-offs",
        weight: "40%",
        description: "Clear articulation that Promise.all fails fast and discards other results, while allSettled enables partial degradation.",
      },
      {
        criteria: "Performance Reasoning (Sequential vs Parallel)",
        weight: "30%",
        description: "Explains latency differences and highlights when sequential requests are necessary (dependent inputs) versus wasteful.",
      },
      {
        criteria: "Robust Error Handling Pattern",
        weight: "30%",
        description: "Demonstrates pattern matching on `result.status === 'fulfilled'` vs `'rejected'`.",
      },
    ],
    referenceAnswer:
      "### Recommendation: `Promise.allSettled` for Independent Widgets\nFor an analytics dashboard where widgets are independent, **`Promise.allSettled`** is the superior strategy.\n\n### Comparison Analysis:\n1. **`Promise.all` (Fail-Fast)**:\n   - Fires all requests concurrently.\n   - **Drawback**: If 2 of 3 requests succeed in 100ms, but the third fails at 120ms with a 500 error, `Promise.all` immediately rejects. The whole dashboard enters an error screen, hiding valid user data.\n   - **When to use**: When all requests are interdependent and the operation cannot proceed without every piece of data (e.g., initiating a multi-leg payment transaction).\n\n2. **`Promise.allSettled` (Resilient Concurrency)**:\n   - Fires all requests concurrently.\n   - Never rejects; waits for all promises to finish and returns an array of result descriptors (`{ status: 'fulfilled', value }` or `{ status: 'rejected', reason }`).\n   - Enables **graceful degradation**: the UI can render Account Details and Invoices while showing a 'Failed to load alerts' retry widget.\n\n3. **Sequential `await`**:\n   - Latency equals sum of all requests ($T_{total} = T_1 + T_2 + T_3$).\n   - **When to use**: When request B requires data from request A (e.g. `const user = await getUser(); const org = await getOrg(user.orgId);`).\n\n```typescript\nasync function loadDashboard(userId: string) {\n  const [userResult, invoicesResult, alertsResult] = await Promise.allSettled([\n    fetchUserData(userId),\n    fetchInvoices(userId),\n    fetchSystemAlerts(),\n  ]);\n\n  return {\n    user: userResult.status === 'fulfilled' ? userResult.value : null,\n    invoices: invoicesResult.status === 'fulfilled' ? invoicesResult.value : [],\n    alerts: alertsResult.status === 'fulfilled' ? alertsResult.value : [],\n    errors: {\n      user: userResult.status === 'rejected' ? userResult.reason : null,\n      invoices: invoicesResult.status === 'rejected' ? invoicesResult.reason : null,\n      alerts: alertsResult.status === 'rejected' ? alertsResult.reason : null,\n    },\n  };\n}\n```",
    commonMistakes: [
      "Using `Promise.all` and wrapping each individual promise in its own `.catch()` without realizing that `Promise.allSettled` was standardized natively for this exact purpose.",
      "Running independent requests sequentially, tripling dashboard load time.",
      "Assuming `Promise.all` cancels in-flight HTTP requests when one rejects (network requests continue running unless aborted with `AbortController`).",
    ],
    followUpQuestion:
      "How would you integrate `AbortController` so that navigating away from the dashboard cancels all in-flight requests simultaneously?",
    followUpAnswer:
      "Instantiate a single `const controller = new AbortController()`, pass `{ signal: controller.signal }` to all three fetch calls, and call `controller.abort()` in the page cleanup function.",
    references: [
      {
        title: "MDN: Promise.allSettled()",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled",
      },
      {
        title: "MDN: Promise.all()",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all",
      },
    ],
  },
  {
    id: "JS04",
    slug: "implement-debounce-with-cancellation",
    title: "Implement Debounce Function with Immediate Invocation and Cancellation",
    summary:
      "Build a robust TypeScript debounce utility featuring configurable delay, leading/trailing execution flags, and a .cancel() teardown method.",
    topic: "javascript-typescript",
    mode: "build",
    difficulty: "applied",
    estimatedMinutes: 25,
    tags: ["JavaScript", "TypeScript", "Debounce", "Timers", "Higher-Order Functions"],
    skillsTested: [
      "Higher-Order Functions & Closures",
      "Timer Management (setTimeout / clearTimeout)",
      "Cancellation Method Exposure",
      "TypeScript Generics & Function Parameter Inference",
    ],
    scenario:
      "Implement a production-grade `debounce` utility in TypeScript. The function delays invoking the target callback until after `delayMs` milliseconds have elapsed since the last call. The returned function must include a `.cancel()` method to clear pending timers (critical for cleaning up on component unmount) and support an optional `immediate` flag.",
    requirements: [
      "Accept any function signature with generic parameters and maintain `this` context.",
      "Reset timer if invoked repeatedly within the delay window.",
      "Support `cancel()` method on the returned debounced function to abort pending executions.",
      "Support `immediate` (leading-edge) execution option.",
      "Ensure proper TypeScript types without `any`.",
    ],
    starterCode: `export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delayMs: number,
  immediate: boolean = false
) {
  // TODO: Implement timer tracking, cancellation, and execution
}`,
    programmingLanguage: "typescript",
    hints: [
      "Store a `timerId: ReturnType<typeof setTimeout> | null` variable in the closure.",
      "To attach a `.cancel` method to a function, assign a property to the returned function object: `debounced.cancel = () => ...`.",
      "If `immediate` is true, invoke immediately if no timer is active, but still set a timer to prevent re-invocation until silence occurs.",
    ],
    evaluationRubric: [
      {
        criteria: "Timer Resetting & Execution Correctness",
        weight: "40%",
        description: "Correctly resets timeout on repeated calls and fires only after quiet period.",
      },
      {
        criteria: "Cancellation Implementation",
        weight: "30%",
        description: "Attaches a working `.cancel()` method that prevents pending calls from firing.",
      },
      {
        criteria: "TypeScript Typing & Edge Cases",
        weight: "30%",
        description: "Strong generic typing preserving argument types, return types, and immediate edge case handling.",
      },
    ],
    referenceAnswer:
      "```typescript\ntype DebouncedFunction<T extends (...args: unknown[]) => void> = {\n  (...args: Parameters<T>): void;\n  cancel: () => void;\n};\n\nexport function debounce<T extends (...args: unknown[]) => void>(\n  fn: T,\n  delayMs: number,\n  immediate = false\n): DebouncedFunction<T> {\n  let timerId: ReturnType<typeof setTimeout> | null = null;\n\n  const debounced = function (this: unknown, ...args: Parameters<T>) {\n    const context = this;\n    const shouldCallNow = immediate && !timerId;\n\n    if (timerId !== null) {\n      clearTimeout(timerId);\n    }\n\n    timerId = setTimeout(() => {\n      timerId = null;\n      if (!immediate) {\n        fn.apply(context, args);\n      }\n    }, delayMs);\n\n    if (shouldCallNow) {\n      fn.apply(context, args);\n    }\n  };\n\n  debounced.cancel = () => {\n    if (timerId !== null) {\n      clearTimeout(timerId);\n      timerId = null;\n    }\n  };\n\n  return debounced as DebouncedFunction<T>;\n}\n```\n\n### Usage Example:\n```typescript\nconst onSearch = debounce((query: string) => {\n  console.log('Searching for:', query);\n}, 300);\n\nonSearch('cat');\nonSearch('catch');\n// If unmounting before 300ms:\nonSearch.cancel();\n```",
    commonMistakes: [
      "Failing to clear the previous `timerId` before scheduling a new one, causing all invocations to fire.",
      "Losing the `this` context when the debounced function is invoked as an object method.",
      "Not setting `timerId = null` when the timer expires, breaking subsequent immediate invocations.",
    ],
    followUpQuestion:
      "What is the key functional difference between `debounce` and `throttle`?",
    followUpAnswer:
      "`debounce` clusters multiple rapid events into a single call after a period of quiet (great for search inputs and resize events), whereas `throttle` guarantees execution at a regulated maximum frequency, firing at most once every interval (great for scroll handlers and continuous animations).",
    references: [
      {
        title: "lodash: debounce documentation",
        url: "https://lodash.com/docs/4.17.15#debounce",
      },
      {
        title: "CSS-Tricks: Debouncing and Throttling Explained",
        url: "https://css-tricks.com/debouncing-throttling-explained-examples/",
      },
    ],
  },
  {
    id: "JS05",
    slug: "diagnose-shallow-copy-nested-mutation",
    title: "Diagnose Unexpected Mutation from Shallow Object Cloning",
    summary:
      "Investigate how spread syntax and Object.assign create shallow copies that share nested object references, leading to unintended side effects.",
    topic: "javascript-typescript",
    mode: "debug",
    difficulty: "foundation",
    estimatedMinutes: 15,
    tags: ["JavaScript", "Object References", "Immutability", "Shallow Copy", "Debugging"],
    skillsTested: [
      "Primitive vs Reference Values",
      "Shallow Copy Mechanics (Spread & Object.assign)",
      "Deep Cloning Techniques (structuredClone)",
      "Defensive Immutability",
    ],
    scenario:
      "In a user management dashboard, editing a draft profile inadvertently mutates the original user settings in memory before the user clicks 'Save'. The developer used `const draft = { ...user }` believing it was fully cloned. Explain the root cause of this mutation and implement a safe, modern solution.",
    requirements: [
      "Explain the difference between copying primitive properties versus reference pointers in nested objects.",
      "Show how modifying `draft.permissions.canEdit = false` mutates the `user` object.",
      "Demonstrate modern, native deep-cloning using `structuredClone()`.",
      "Discuss trade-offs of `JSON.parse(JSON.stringify(obj))` (Dates, undefined, functions, circular references).",
    ],
    starterCode: `const originalUser = {
  id: "usr_100",
  name: "Alex",
  permissions: {
    role: "editor",
    canEdit: true,
  },
};

// Developer attempts to clone for a draft
const draftUser = { ...originalUser };

// Modifying the draft
draftUser.name = "Jordan"; // Works safely (primitive)
draftUser.permissions.canEdit = false; // BUG: Modifies originalUser as well!

console.log("Original canEdit:", originalUser.permissions.canEdit); // false!`,
    programmingLanguage: "javascript",
    hints: [
      "The spread operator `{ ...obj }` only creates a shallow clone. Properties at the first level are copied by value, but nested objects are copied by reference.",
      "Both `originalUser.permissions` and `draftUser.permissions` point to the exact same memory address in the JS heap.",
      "Modern browsers and Node 17+ support the global native `structuredClone()` algorithm.",
    ],
    evaluationRubric: [
      {
        criteria: "Reference vs Primitive Memory Model",
        weight: "40%",
        description: "Accurately explains that spread operator shallowly copies pointer addresses for nested objects.",
      },
      {
        criteria: "Correct Fix Implementation",
        weight: "40%",
        description: "Demonstrates `structuredClone()` or nested spread `{ ...user, permissions: { ...user.permissions } }`.",
      },
      {
        criteria: "Awareness of Serialization Gotchas",
        weight: "20%",
        description: "Explains limitations of JSON serialize/deserialize (strips undefined, corrupts Dates, breaks on circular references).",
      },
    ],
    referenceAnswer:
      "### Cause of Bug:\nIn JavaScript, objects and arrays are reference types stored on the heap. When using the object spread operator `const draft = { ...original }`, the engine creates a new top-level object, but only copies references for nested objects. Therefore, `draft.permissions` and `original.permissions` point to the **exact same memory reference**.\n\n### Modern Solutions:\n\n1. **Native `structuredClone()` (Recommended)**:\n```javascript\nconst draftUser = structuredClone(originalUser);\ndraftUser.permissions.canEdit = false;\n\nconsole.log(originalUser.permissions.canEdit); // true (Untouched!)\n```\n`structuredClone` is built into modern browsers and Node 17+. It handles nested objects, arrays, `Date` objects, `RegExp`, `Map`, `Set`, and circular references natively.\n\n2. **Manual Shallow Nesting (Idiomatic for Redux/State)**:\n```javascript\nconst draftUser = {\n  ...originalUser,\n  permissions: {\n    ...originalUser.permissions,\n    canEdit: false,\n  },\n};\n```\n\n3. **Why avoid `JSON.parse(JSON.stringify(obj))`**:\n- Converts `Date` objects to ISO strings instead of retaining Date instances.\n- Omits `undefined`, `Function`, and `Symbol` values.\n- Throws `TypeError` on circular references.\n- Converts `NaN` and `Infinity` to `null`.",
    commonMistakes: [
      "Assuming `Object.assign({}, obj)` performs deep copying.",
      "Recommending `JSON.parse(JSON.stringify(obj))` without mentioning its data loss caveats with Dates and undefined.",
    ],
    followUpQuestion:
      "How does `Object.freeze()` interact with nested objects?",
    followUpAnswer:
      "`Object.freeze()` is also shallow! It only makes top-level properties read-only. Nested objects remain mutable unless you perform a recursive 'deepFreeze'.",
    references: [
      {
        title: "MDN: structuredClone()",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone",
      },
      {
        title: "MDN: Spread syntax (...)",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax",
      },
    ],
  },
  {
    id: "JS06",
    slug: "implement-event-delegation-dynamic-list",
    title: "Implement Event Delegation for Dynamically Appended Elements",
    summary:
      "Leverage DOM event bubbling and Element.closest() to manage user interactions on dynamic list items without attaching redundant per-element listeners.",
    topic: "javascript-typescript",
    mode: "build",
    difficulty: "applied",
    estimatedMinutes: 20,
    tags: ["JavaScript", "DOM", "Event Delegation", "Event Bubbling", "Performance"],
    skillsTested: [
      "DOM Event Propagation (Capture, Target, Bubble)",
      "Event Delegation Architecture",
      "Element.closest() Traversal",
      "Memory Footprint & Cleanup Optimization",
    ],
    scenario:
      "In a high-throughput project management board, tasks are dynamically added, removed, and re-ordered via WebSockets. Attaching separate `click` listeners to every newly created task item causes memory bloat and requires manual listener cleanup. Implement an event delegation architecture on the parent container that efficiently handles 'Delete', 'Complete', and 'Edit' actions, even for elements appended after initialization.",
    requirements: [
      "Attach only a single event listener to the parent container element.",
      "Identify the clicked action using HTML `data-*` attributes and `Element.closest()`.",
      "Handle clicks on nested SVG icons or spans inside buttons accurately.",
      "Ensure clicking outside of valid buttons is ignored without throwing errors.",
    ],
    starterCode: `<!-- HTML Structure -->
<ul id="task-list" class="task-list">
  <!-- Tasks are appended dynamically here -->
</ul>

<script>
export function setupTaskDelegation(containerElement, onAction) {
  // TODO: Attach single event listener to containerElement
  // onAction callback signature: (actionType: 'delete' | 'complete' | 'edit', taskId: string) => void
}
</script>`,
    programmingLanguage: "javascript",
    hints: [
      "When a user clicks on an `<svg>` or `<span>` inside a `<button>`, `event.target` is the inner icon, not the button itself.",
      "Use `event.target.closest('[data-action]')` to traverse up the DOM tree to find the nearest interactive button element.",
      "Check `containerElement.contains(actionButton)` to guarantee the match belongs to this container.",
    ],
    evaluationRubric: [
      {
        criteria: "Bubbling & Event Target Resolution",
        weight: "40%",
        description: "Uses `e.target.closest()` properly to handle nested children clicks inside buttons.",
      },
      {
        criteria: "Efficiency & Boundary Checking",
        weight: "35%",
        description: "Verifies the target is inside the container and extracts dataset parameters cleanly.",
      },
      {
        criteria: "Cleanup & Extensibility",
        weight: "25%",
        description: "Returns an unbind cleanup function to prevent memory leaks if container is detached.",
      },
    ],
    referenceAnswer:
      "```javascript\nexport function setupTaskDelegation(containerElement, onAction) {\n  if (!containerElement) return () => {};\n\n  const handleClick = (event) => {\n    // Find the nearest button with a data-action attribute\n    const targetButton = event.target.closest('[data-action]');\n\n    // If click was outside any registered action button, ignore\n    if (!targetButton || !containerElement.contains(targetButton)) {\n      return;\n    }\n\n    // Find the enclosing task item\n    const taskItem = targetButton.closest('[data-task-id]');\n    const taskId = taskItem ? taskItem.dataset.taskId : null;\n    const actionType = targetButton.dataset.action;\n\n    if (actionType && taskId) {\n      onAction(actionType, taskId);\n    }\n  };\n\n  containerElement.addEventListener('click', handleClick);\n\n  // Return cleanup function to detach listener when needed\n  return () => {\n    containerElement.removeEventListener('click', handleClick);\n  };\n}\n```\n\n### HTML Markup Example:\n```html\n<ul id=\"task-list\">\n  <li data-task-id=\"task_42\">\n    <span>Implement Auth</span>\n    <button data-action=\"complete\">\n      <svg><!-- Check icon --></svg>\n      Complete\n    </button>\n    <button data-action=\"delete\">\n      <svg><!-- Trash icon --></svg>\n      Delete\n    </button>\n  </li>\n</ul>\n```",
    commonMistakes: [
      "Using `event.target.dataset.action` directly: If the button contains an SVG or span, `event.target` will be the SVG/span, where `dataset.action` is `undefined`.",
      "Binding event listeners inside the function that renders each individual task, creating hundreds of unneeded listeners.",
      "Forgetting to return a cleanup removal function, leading to detached DOM memory leaks in single-page apps.",
    ],
    followUpQuestion:
      "Do all DOM events bubble up to parent elements?",
    followUpAnswer:
      "No! Certain events like `focus`, `blur`, `mouseenter`, and `mouseleave` do not bubble. To delegate focus events, you can use `focusin` and `focusout` (which do bubble) or attach the listener in the capturing phase (`{ capture: true }`).",
    references: [
      {
        title: "MDN: Event Bubbling and Event Delegation",
        url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#event_delegation",
      },
      {
        title: "MDN: Element.closest()",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/Element/closest",
      },
    ],
  },
  {
    id: "JS07",
    slug: "implement-async-task-runner-concurrency-limit",
    title: "Implement an Async Task Runner with Configurable Concurrency Pool",
    summary:
      "Design an asynchronous execution queue that throttles promise-returning tasks to at most N simultaneous workers while preserving order.",
    topic: "javascript-typescript",
    mode: "build",
    difficulty: "challenge",
    estimatedMinutes: 30,
    tags: ["JavaScript", "TypeScript", "Concurrency", "Promises", "Async Queue", "Pool"],
    skillsTested: [
      "Custom Promise Orchestration",
      "Concurrency Limiting (Throttling Workers)",
      "Error Isolation & Output Order Preservation",
      "Dynamic Task Enqueuing",
    ],
    scenario:
      "A batch image upload service receives 500 file upload tasks. If the client launches all 500 uploads at once with `Promise.all()`, browser socket limits choke and the backend server crashes from socket exhaustion. Build an `asyncPool` concurrency runner in TypeScript that processes tasks with a maximum concurrency limit $K$ (e.g., $K=4$), guarantees returned results match the input array order, and properly propagates task rejections.",
    requirements: [
      "Accept `tasks: (() => Promise<T>)[]` and `concurrency: number`.",
      "At no point should more than `concurrency` tasks be in-flight simultaneously.",
      "When one task finishes, the next pending task from the queue starts immediately.",
      "Preserve output index mapping: the result at index $i$ must correspond to `tasks[i]`.",
      "Cleanly reject the master promise if any task rejects (or support fail-safe error recording).",
    ],
    starterCode: `export async function asyncPool<T>(
  concurrency: number,
  tasks: (() => Promise<T>)[]
): Promise<T[]> {
  // TODO: Run tasks with at most 'concurrency' active simultaneously
  // Return array of results in the original task order
}`,
    programmingLanguage: "typescript",
    hints: [
      "Pre-allocate a `results: T[] = new Array(tasks.length)` array to place values at their exact original indices.",
      "Maintain a shared `nextIndex = 0` counter and spawn `concurrency` worker loops that pull the next available task.",
      "Each worker runs `while (nextIndex < tasks.length)`: grabs the index, increments `nextIndex`, awaits the task, and records the result.",
    ],
    evaluationRubric: [
      {
        criteria: "Strict Concurrency Adherence",
        weight: "40%",
        description: "Guarantees no more than `concurrency` tasks run concurrently at any given timestamp.",
      },
      {
        criteria: "Result Ordering & Integrity",
        weight: "35%",
        description: "Results array matches input tasks ordering regardless of individual task execution duration.",
      },
      {
        criteria: "Rejection & Edge Cases Handling",
        weight: "25%",
        description: "Handles empty task lists, concurrency >= tasks.length, and rejects cleanly on worker failure.",
      },
    ],
    referenceAnswer:
      "```typescript\nexport async function asyncPool<T>(\n  concurrency: number,\n  tasks: (() => Promise<T>)[]\n): Promise<T[]> {\n  if (tasks.length === 0) return [];\n  \n  const results: T[] = new Array(tasks.length);\n  let currentIndex = 0;\n  const limit = Math.max(1, Math.min(concurrency, tasks.length));\n\n  // Worker function pulling from shared task queue\n  async function worker(): Promise<void> {\n    while (currentIndex < tasks.length) {\n      const taskIndex = currentIndex++;\n      const task = tasks[taskIndex];\n      results[taskIndex] = await task();\n    }\n  }\n\n  // Spawn worker pool\n  const workers = Array.from({ length: limit }, () => worker());\n  await Promise.all(workers);\n\n  return results;\n}\n```\n\n### Why this architecture is optimal:\n1. **Zero Busy-Waiting**: Workers await the next available task; when one finishes, that worker immediately pulls the next item.\n2. **Deterministic Indexing**: Fast-resolving tasks later in the array do not displace earlier tasks.\n3. **Fail-Fast Error Handling**: If any task throws an unhandled rejection, `await task()` throws, rejecting the worker's promise, which triggers `Promise.all(workers)` rejection immediately.",
    commonMistakes: [
      "Using `chunk(tasks, concurrency)` with sequential `Promise.all` passes: If 3 tasks finish in 50ms and 1 takes 5000ms, the other 3 workers sit completely idle waiting for the slowest task before starting the next batch.",
      "Appending to `results.push(data)`: Fast tasks complete out of order, corrupting the return array index mapping.",
    ],
    followUpQuestion:
      "How would you enhance this runner to support dynamically adding new tasks while the pool is already running?",
    followUpAnswer:
      "Refactor the worker loop into an event-driven task queue with an `enqueue(task)` method. Workers wait on an internal Promise or queue condition when the buffer is empty, waking up when new tasks are pushed.",
    references: [
      {
        title: "p-limit npm package architecture",
        url: "https://github.com/sindresorhus/p-limit",
      },
      {
        title: "MDN: Promise.all()",
        url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all",
      },
    ],
  },
  {
    id: "JS08",
    slug: "typescript-discriminated-unions-api-state",
    title: "Model API Async State with TypeScript Discriminated Unions",
    summary:
      "Leverage TypeScript tagged/discriminated unions to eliminate impossible component states and enforce type-safe UI rendering.",
    topic: "javascript-typescript",
    mode: "build",
    difficulty: "applied",
    estimatedMinutes: 20,
    tags: ["TypeScript", "Discriminated Unions", "Type Safety", "State Modeling", "React"],
    skillsTested: [
      "Discriminated (Tagged) Union Modeling",
      "Eliminating Impossible States",
      "Exhaustiveness Checking with `never`",
      "Type Narrowing in Conditional Blocks",
    ],
    scenario:
      "A junior developer models network state using optional flags: `{ isLoading: boolean, data?: User, error?: Error }`. This anti-pattern permits impossible states (e.g. `isLoading: true` while `error` is present and `data` is populated). Refactor this into an elegant TypeScript discriminated union and write a type-safe rendering function that uses exhaustive pattern matching with the `never` type.",
    requirements: [
      "Define an `AsyncData<T>` discriminated union with states: `'idle'`, `'loading'`, `'success'`, and `'error'`.",
      "Ensure `'success'` strictly contains non-nullable `data: T` and `'error'` strictly contains `error: Error`.",
      "Demonstrate compile-time type narrowing where accessing `.data` inside `'loading'` produces a TypeScript compile error.",
      "Implement an exhaustive switch statement with a `never` fallback check.",
    ],
    starterCode: `// Problematic model: allows impossible states
interface BadAsyncState<T> {
  isLoading: boolean;
  data?: T;
  error?: Error;
}

// TODO: Refactor into a discriminated union
export type AsyncState<T> = any;

export function renderUserStatus(state: AsyncState<{ name: string }>): string {
  // TODO: Implement exhaustive type-safe pattern matching
  return "";
}`,
    programmingLanguage: "typescript",
    hints: [
      "A discriminated union uses a common literal property (the discriminator/tag), such as `status: 'idle' | 'loading' | 'success' | 'error'`.",
      "TypeScript's control flow analysis narrows the type within `switch (state.status)` branches automatically.",
      "To verify compile-time exhaustiveness, assign `const _exhaustiveCheck: never = state;` in the default case.",
    ],
    evaluationRubric: [
      {
        criteria: "Discriminated Union Schema",
        weight: "40%",
        description: "Models distinct type variants sharing a discriminator property (`status`).",
      },
      {
        criteria: "Exhaustiveness Checking (`never`)",
        weight: "35%",
        description: "Demonstrates compile-time guarantee preventing unhandled state variants.",
      },
      {
        criteria: "Type Narrowing Correctness",
        weight: "25%",
        description: "Ensures data is only accessible on success and error is only accessible on error.",
      },
    ],
    referenceAnswer:
      "```typescript\nexport type AsyncState<T> =\n  | { status: 'idle' }\n  | { status: 'loading' }\n  | { status: 'success'; data: T }\n  | { status: 'error'; error: Error };\n\nexport function renderUserStatus(state: AsyncState<{ name: string }>): string {\n  switch (state.status) {\n    case 'idle':\n      return 'Please click to load user.';\n    case 'loading':\n      return 'Loading user profile...';\n    case 'success':\n      // TypeScript guarantees state.data exists and is { name: string }\n      return `Welcome back, ${state.data.name}!`;\n    case 'error':\n      // TypeScript guarantees state.error exists\n      return `Failed to load: ${state.error.message}`;\n    default: {\n      // Exhaustive checking: if a new state variant is added to AsyncState,\n      // this line fails at compile time!\n      const _unhandled: never = state;\n      throw new Error(`Unhandled state: ${JSON.stringify(_unhandled)}`);\n    }\n  }\n}\n```\n\n### Why this prevents production bugs:\nWith the old `{ isLoading, data, error }` model, there are $2^1 \\times 2 \\times 2 = 8$ potential state combinations, 4 of which are contradictory (e.g. `isLoading: false, data: undefined, error: undefined`). Discriminated unions make invalid states unrepresentable in the type system.",
    commonMistakes: [
      "Using optional fields within the union variants (`data?: T`), which still forces consumers to use non-null assertions `state.data!`.",
      "Forgetting the exhaustive `never` check, so when an `'idle'` state is added later, existing render functions silently fail at runtime.",
    ],
    followUpQuestion:
      "How would you represent a state that allows displaying stale cached data while background re-fetching (`status: 'revalidating'`) is in progress?",
    followUpAnswer:
      "Add a variant: `| { status: 'revalidating'; data: T }`. This enforces that revalidation only occurs when previous successful data already exists, while keeping the discriminator clean.",
    references: [
      {
        title: "TypeScript Handbook: Discriminated Unions",
        url: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions",
      },
      {
        title: "Kent C. Dodds: How to use React Context effectively (State modeling)",
        url: "https://kentcdodds.com/blog/how-to-use-react-context-effectively",
      },
    ],
  },
];
