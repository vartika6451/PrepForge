import { WebDevQuestion } from "@/types/web-dev";

export const REACT_QUESTIONS: WebDevQuestion[] = [
  {
    id: "RE01",
    slug: "react-strict-mode-double-effects-cleanup",
    title: "Why React Strict Mode Runs Effects Twice and How Cleanup Functions",
    summary:
      "Understand React 18+ StrictMode development remounting, why effects mount, unmount, and remount, and how to write resilient setup/cleanup pairs.",
    topic: "react",
    mode: "explain",
    difficulty: "foundation",
    estimatedMinutes: 15,
    tags: ["React", "StrictMode", "useEffect", "Lifecycle", "Cleanup"],
    skillsTested: [
      "React StrictMode Development Invariants",
      "Symmetric Effect Setup and Teardown",
      "Concurrent React Architecture Preparation",
      "Distinguishing Dev-Only Behavior from Production",
    ],
    scenario:
      "A junior developer notices in their browser console that `useEffect` logs twice when loading a page in development (`npm run dev`). Confused, they attempt to stop it by adding an `isMounted` ref or removing `<React.StrictMode>`. In a technical interview, explain why React deliberately introduces this behavior, what catastrophic bugs it is designed to surface, and what a correct setup/cleanup pattern looks like.",
    requirements: [
      "Explain React Strict Mode's intentional 'mount -> unmount -> remount' lifecycle in development.",
      "Explain the future React features (Offscreen API / Activity, preservation of state across tab transitions) that require effects to be resilient to re-mounting.",
      "Provide concrete examples of broken effects that lack proper cleanup (e.g., event listeners, WebSocket connections, audio players).",
      "Explain why disabling StrictMode or using hacky 'run once' ref flags hides real memory leaks and synchronization bugs.",
    ],
    starterCode: `import React, { useEffect } from "react";

export function ChatRoom({ roomId }: { roomId: string }) {
  useEffect(() => {
    // Problematic effect without cleanup
    console.log("Connecting to room:", roomId);
    const connection = createChatConnection(roomId);
    connection.connect();
  }, [roomId]);

  return <div>Connected to {roomId}</div>;
}`,
    programmingLanguage: "tsx",
    hints: [
      "StrictMode only doubles effect execution in development. In a production build (`npm run build`), effects execute only once per mount.",
      "Ask yourself: If React unmounts your component and remounts it a second later with the exact same props and state, does your component resume cleanly or leak resources?",
      "Every setup code block in `useEffect` should have a symmetrical mirror in its returned cleanup function.",
    ],
    evaluationRubric: [
      {
        criteria: "Strict Mode Rationale",
        weight: "40%",
        description: "Accurately articulates that StrictMode tests component resilience to unmounting and remounting for concurrent features.",
      },
      {
        criteria: "Symmetric Cleanup Pattern",
        weight: "40%",
        description: "Provides correct cleanup implementation (e.g. `connection.disconnect()`, `abort()`, `removeEventListener()`).",
      },
      {
        criteria: "Production vs Dev Understanding",
        weight: "20%",
        description: "Clarifies that double invocation is strictly a development-only check with zero production overhead.",
      },
    ],
    referenceAnswer:
      "### Why React Strict Mode Double-Invokes Effects:\nStarting in React 18, in development mode with `<React.StrictMode>`, React deliberately runs:\n1. **Component Mount** (Initial setup)\n2. **Component Unmount** (Cleanup test)\n3. **Component Remount** (Second setup)\n\n### The Core Objective:\nReact is preparing applications for future concurrent features (such as the `<Activity>` / Offscreen component), where React can hide an off-screen tab or view, unmount its DOM/effects to save resources, and remount it later while preserving its internal state.\n\nIf an effect connects to a WebSocket, adds an event listener, starts an animation, or allocates an audio context without a corresponding cleanup function, the component leaves dangling memory leaks and duplicate socket connections when remounted.\n\n### Correct Pattern (Symmetrical Cleanup):\n```tsx\nuseEffect(() => {\n  const connection = createChatConnection(roomId);\n  connection.connect();\n\n  // Symmetrical cleanup mirror:\n  return () => {\n    connection.disconnect();\n  };\n}, [roomId]);\n```\n\nWhen Strict Mode mounts -> unmounts -> remounts:\n- Mount: Connects socket #1.\n- Unmount: Disconnects socket #1.\n- Remount: Connects socket #2.\nResult: Exactly 1 active connection, 0 leaks.",
    commonMistakes: [
      "Using a `hasRun = useRef(false)` hack to prevent the second effect from firing, which breaks component behavior when the user legitimately navigates away and back.",
      "Removing `<React.StrictMode>` from the app root rather than fixing the missing cleanup logic.",
      "Believing that this double execution occurs in production users' browsers.",
    ],
    followUpQuestion:
      "How should you handle data fetching with `fetch()` under StrictMode so that aborted requests don't show error banners?",
    followUpAnswer:
      "Use `AbortController` in the cleanup function. When StrictMode unmounts, `controller.abort()` cancels the initial request. In the `.catch(err)` handler, check `if (err.name === 'AbortError') return;` to ignore the expected cancellation cleanly.",
    references: [
      {
        title: "React Docs: Synchronizing with Effects (How to handle Effect firing twice)",
        url: "https://react.dev/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development",
      },
      {
        title: "React Docs: StrictMode Reference",
        url: "https://react.dev/reference/react/StrictMode",
      },
    ],
  },
  {
    id: "RE02",
    slug: "fix-race-condition-search-dropdown",
    title: "Fix Asynchronous Race Condition in React Live Search",
    summary:
      "Diagnose and resolve out-of-order API responses overwriting current search state using AbortController and cleanup cancellation.",
    topic: "react",
    mode: "debug",
    difficulty: "applied",
    estimatedMinutes: 20,
    tags: ["React", "Race Conditions", "AbortController", "useEffect", "Async Data"],
    skillsTested: [
      "Asynchronous State Synchronization",
      "Network Race Condition Diagnostics",
      "AbortController Integration with fetch",
      "Suppressing AbortError in Effect Handlers",
    ],
    scenario:
      "Users report that when rapidly typing into a live customer search box (e.g. searching 'Chicago' immediately after 'Austin'), the dropdown briefly displays 'Chicago' results, but a split-second later flashes and displays 'Austin' results. The component code is shown below. Diagnose the exact race condition and rewrite the effect to guarantee results never display out of order.",
    requirements: [
      "Identify the asynchronous timing variance causing out-of-order state updates.",
      "Use `AbortController` to cancel active in-flight requests when the query changes or component unmounts.",
      "Safely catch and suppress `DOMException: AbortError` so aborted network cancellations do not trigger error toasts.",
      "Ensure loading state reflects active operations accurately.",
    ],
    starterCode: `import React, { useState, useEffect } from "react";

export function UserSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // BUG: Requests may resolve out of order!
    fetch(\`/api/users?q=\${encodeURIComponent(query)}\`)
      .then((res) => res.json())
      .then((data) => {
        setResults(data.items);
        setIsLoading(false);
      });
  }, [query]);

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {isLoading && <span>Loading...</span>}
      <ul>{results.map((r, i) => <li key={i}>{r}</li>)}</ul>
    </div>
  );
}`,
    programmingLanguage: "tsx",
    hints: [
      "Network latency is not constant. Query A ('Austin') might take 600ms over the wire while Query B ('Chicago') takes 100ms.",
      "When the user finishes typing 'Chicago', Query B resolves first. When Query A finally arrives at 600ms, its callback runs and overwrites state.",
      "Pass `{ signal: controller.signal }` to `fetch()` and call `controller.abort()` in the cleanup return function.",
    ],
    evaluationRubric: [
      {
        criteria: "Network Race Condition Diagnosis",
        weight: "35%",
        description: "Accurately attributes bug to asynchronous out-of-order promise resolution rather than React state batching.",
      },
      {
        criteria: "AbortController Implementation",
        weight: "45%",
        description: "Properly initializes controller, attaches signal, and aborts previous request in effect cleanup.",
      },
      {
        criteria: "AbortError Handling",
        weight: "20%",
        description: "Distinguishes between genuine network failures and intentional AbortError.",
      },
    ],
    referenceAnswer:
      "### Root Cause:\nHTTP requests are asynchronous and independent. If Request 1 (for 'Austin') takes 450ms and Request 2 (for 'Chicago') takes 90ms, Request 2 settles first. When Request 1 finally settles, its `.then()` closure executes and overwrites the state with stale 'Austin' data.\n\n### The Fix:\n```tsx\nuseEffect(() => {\n  if (!query.trim()) {\n    setResults([]);\n    setIsLoading(false);\n    return;\n  }\n\n  const controller = new AbortController();\n  setIsLoading(true);\n\n  fetch(`/api/users?q=${encodeURIComponent(query)}`, {\n    signal: controller.signal,\n  })\n    .then((res) => {\n      if (!res.ok) throw new Error('Search failed');\n      return res.json();\n    })\n    .then((data) => {\n      setResults(data.items);\n      setIsLoading(false);\n    })\n    .catch((err: Error) => {\n      // Crucial: Ignore intentional aborts\n      if (err.name === 'AbortError') return;\n      console.error(err);\n      setIsLoading(false);\n    });\n\n  return () => {\n    controller.abort();\n  };\n}, [query]);\n```",
    commonMistakes: [
      "Relying solely on `debounce` without request cancellation (debouncing reduces frequency, but latency spikes can still cause out-of-order arrivals).",
      "Failing to catch `AbortError`, which triggers unhandled rejection warnings in console.",
    ],
    followUpQuestion:
      "What is the alternative 'boolean flag' cleanup pattern if an API client library does not support `AbortController`?",
    followUpAnswer:
      "Declare `let isCurrent = true;` inside the effect. In the cleanup function, set `isCurrent = false;`. Inside `.then()`, check `if (!isCurrent) return;` before calling `setResults()`. While this does not cancel the network bytes, it reliably prevents stale state updates.",
    references: [
      {
        title: "React Docs: Fetching Data inside Effects",
        url: "https://react.dev/learn/synchronizing-with-effects#fetching-data",
      },
      {
        title: "MDN: AbortController",
        url: "https://developer.mozilla.org/en-US/docs/Web/API/AbortController",
      },
    ],
  },
  {
    id: "RE03",
    slug: "eliminate-redundant-useeffect-derived-state",
    title: "Eliminate Redundant useEffect for Synchronous Derived State",
    summary:
      "Refactor anti-pattern effects that mirror props into state, eliminating cascading re-renders, visual flashes, and state desynchronization.",
    topic: "react",
    mode: "debug",
    difficulty: "applied",
    estimatedMinutes: 20,
    tags: ["React", "Derived State", "useEffect", "Performance", "Clean Code"],
    skillsTested: [
      "Derived State Computation During Render",
      "Eliminating Cascading Re-Renders",
      "useMemo Appropriate Application",
      "Single Source of Truth Principles",
    ],
    scenario:
      "In a shopping cart component, the developer stored `items`, `totalPrice`, and `formattedTotal` all in separate `useState` variables, and used a `useEffect` to synchronize `totalPrice` whenever `items` changes. This triggers an extra render pass on every cart update and causes layout flickers. Refactor the component to eliminate the redundant effect and calculate derived state properly.",
    requirements: [
      "Explain why synchronizing state via `useEffect` causes a cascading two-pass render.",
      "Identify the synchronization bugs that arise when derived state is stored in separate state variables.",
      "Refactor the code to compute derived state synchronously during render.",
      "Explain when `useMemo` is actually necessary versus simple inline computation.",
    ],
    starterCode: `import React, { useState, useEffect } from "react";

interface Item { id: string; name: string; price: number; quantity: number }

export function CartSummary({ items }: { items: Item[] }) {
  // ANTI-PATTERN: Redundant state variables
  const [total, setTotal] = useState(0);
  const [discountedTotal, setDiscountedTotal] = useState(0);

  useEffect(() => {
    // Causes extra render cycle after items prop changes!
    const calculatedTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotal(calculatedTotal);
    setDiscountedTotal(calculatedTotal > 100 ? calculatedTotal * 0.9 : calculatedTotal);
  }, [items]);

  return (
    <div>
      <p>Subtotal: \${total}</p>
      <p>Final Total: \${discountedTotal}</p>
    </div>
  );
}`,
    programmingLanguage: "tsx",
    hints: [
      "If a value can be calculated from existing props or state, do not put it in state!",
      "When you call `setState` inside an effect triggered by a prop change, React must complete the first render with stale values, commit it to DOM, and then immediately fire a second render with the new total.",
      "For simple arithmetic like `reduce` over small arrays, inline calculation during render takes microseconds and avoids all synchronization bugs.",
    ],
    evaluationRubric: [
      {
        criteria: "Anti-Pattern Articulation",
        weight: "40%",
        description: "Explains the two-pass render cost and desynchronization risks of state-mirroring effects.",
      },
      {
        criteria: "Clean Derived State Refactoring",
        weight: "40%",
        description: "Calculates total and discountedTotal directly in render body without useState or useEffect.",
      },
      {
        criteria: "useMemo Cost-Benefit Analysis",
        weight: "20%",
        description: "Accurately judges when memoization overhead is justified (thousands of items) vs unwarranted.",
      },
    ],
    referenceAnswer:
      "### Why Redundant Effects Hurt Applications:\n1. **Cascading Two-Pass Renders**: React renders the component with old `total`, paints to screen, executes the effect, triggers `setTotal()`, and immediately renders a second time. This causes UI flashes.\n2. **State De-synchronization**: Between the first and second render, child components receive mismatched props (e.g. new items, but old total).\n\n### The Refactored Solution (Calculate During Render):\n```tsx\nexport function CartSummary({ items }: { items: Item[] }) {\n  // Computed synchronously in the same render pass!\n  const total = items.reduce(\n    (sum, item) => sum + item.price * item.quantity,\n    0\n  );\n  const discountedTotal = total > 100 ? total * 0.9 : total;\n\n  return (\n    <div>\n      <p>Subtotal: ${total.toFixed(2)}</p>\n      <p>Final Total: ${discountedTotal.toFixed(2)}</p>\n    </div>\n  );\n}\n```\n\n### When is `useMemo` needed?\nOnly if the array contains thousands of complex items or involves expensive computation. In this scenario (standard cart with ~20 items), `useMemo` has more memory overhead than the negligible cost of `reduce`.",
    commonMistakes: [
      "Thinking `useEffect` is required whenever props change.",
      "Wrapping every simple arithmetic calculation in `useMemo`, adding needless dependency array comparison overhead.",
    ],
    followUpQuestion:
      "What is the recommended React pattern if you genuinely need to reset an entire form's state when a selected user changes?",
    followUpAnswer:
      "Do not use `useEffect` with `setFormState`. Instead, pass a unique `key` prop to the form component: `<UserForm key={userId} user={user} />`. When `userId` changes, React automatically unmounts the old instance and mounts a fresh component with clean state.",
    references: [
      {
        title: "React Docs: You Might Not Need an Effect",
        url: "https://react.dev/learn/you-might-not-need-an-effect",
      },
      {
        title: "React Docs: Resetting all state when a prop changes",
        url: "https://react.dev/learn/you-might-not-need-an-effect#resetting-all-state-when-a-prop-changes",
      },
    ],
  },
  {
    id: "RE04",
    slug: "debug-unstable-keys-reordered-list",
    title: "Debug Unstable Keys Causing Corrupted State in Reordered Lists",
    summary:
      "Investigate how using array indices as React keys causes component state mismatch and DOM input corruption when items are sorted or deleted.",
    topic: "react",
    mode: "debug",
    difficulty: "applied",
    estimatedMinutes: 20,
    tags: ["React", "Reconciliation", "Keys", "Virtual DOM", "Debugging"],
    skillsTested: [
      "React Fiber Reconciliation Algorithm",
      "Key Stability & Identity Association",
      "Uncontrolled State Leakage in Dynamic Lists",
      "Stable Key Strategies",
    ],
    scenario:
      "A task list allows users to reorder items and type individual notes into an uncontrolled text `<input>` beside each task. When the user moves the top task down or deletes the first task, the user's typed notes stay in the top position instead of moving with the task! Inspect the code below, explain why React misplaces the input values, and implement the correct fix.",
    requirements: [
      "Explain how React's reconciliation diffing algorithm uses `key` to match previous and next Virtual DOM trees.",
      "Demonstrate why using array index (`key={index}`) tricks React into associating the first DOM input with the new first task.",
      "Refactor the component to use a stable, unique identifier.",
      "Explain why `key={Math.random()}` is even worse than array index.",
    ],
    starterCode: `import React, { useState } from "react";

interface Task { id: string; title: string }

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "t1", title: "Review PR #402" },
    { id: "t2", title: "Deploy Staging" },
    { id: "t3", title: "Write Documentation" },
  ]);

  const removeFirst = () => {
    setTasks((prev) => prev.slice(1));
  };

  return (
    <div>
      <button onClick={removeFirst}>Delete Top Task</button>
      <ul>
        {tasks.map((task, index) => (
          // BUG: Using array index as key!
          <li key={index}>
            <span>{task.title}</span>
            <input type="text" placeholder="Type personal note..." />
          </li>
        ))}
      </ul>
    </div>
  );
}`,
    programmingLanguage: "tsx",
    hints: [
      "React keys do not just silence console warnings; they provide persistent identity across renders.",
      "When task at index 0 ('Review PR') is removed, the remaining task ('Deploy Staging') becomes index 0.",
      "Because React sees `key={0}` in both renders, it assumes the first item was simply updated in-place rather than replaced, preserving the existing DOM `<input>` element and its internal state.",
    ],
    evaluationRubric: [
      {
        criteria: "Reconciliation Mechanics",
        weight: "40%",
        description: "Accurately articulates how Fiber diffing matches keys by position when index is used.",
      },
      {
        criteria: "Stable Key Fix",
        weight: "40%",
        description: "Changes key to unique persistent ID (`key={task.id}`) preserving state association.",
      },
      {
        criteria: "Random Key Dangers",
        weight: "20%",
        description: "Explains that `Math.random()` forces full DOM destruction and recreation on every single render.",
      },
    ],
    referenceAnswer:
      "### Why the Bug Occurs:\nReact uses `key` to determine whether a DOM element should be preserved, moved, or destroyed during reconciliation.\n\nWhen using `key={index}`:\n1. Initial render:\n   - Position 0: `key=0`, Task 'Review PR'\n   - Position 1: `key=1`, Task 'Deploy Staging'\n2. After deleting 'Review PR':\n   - Position 0: `key=0`, Task 'Deploy Staging'\n3. React compares `key=0` in both trees. It concludes: *'The item with key=0 still exists! It just changed its text from Review PR to Deploy Staging.'*\n4. Therefore, React keeps the existing DOM `<li>` and `<input>` nodes at position 0 intact. The user's typed input note remains glued to position 0.\n\n### The Fix:\nBind `key` to a persistent, immutable identifier from the data:\n```tsx\n<ul>\n  {tasks.map((task) => (\n    <li key={task.id}>\n      <span>{task.title}</span>\n      <input type=\\\"text\\\" placeholder=\\\"Type personal note...\\\" />\n    </li>\n  ))}\n</ul>\n```\n\n### Why `Math.random()` is even worse:\nGenerating a new key on every render (`key={Math.random()}`) forces React to treat every element as completely brand new. It destroys and rebuilds the DOM nodes on every keystroke, causing loss of focus, dropped cursor positions, and terrible performance.",
    commonMistakes: [
      "Believing keys are only needed to avoid console warnings.",
      "Using composite keys with array index (`key=\\${task.id}-\\${index}`), which still shifts when items are inserted or removed.",
    ],
    followUpQuestion:
      "When is it acceptable to use array indices as keys?",
    followUpAnswer:
      "Only when the list is purely static (never filtered, sorted, or reordered) AND items in the list do not maintain any internal or uncontrolled state.",
    references: [
      {
        title: "React Docs: Rendering Lists & Keeping list items in order with keys",
        url: "https://react.dev/learn/rendering-lists#keeping-list-items-in-order-with-key",
      },
      {
        title: "Robin Pokorny: Index as a key is an anti-pattern",
        url: "https://robinpokorny.medium.com/index-as-a-key-is-an-anti-pattern-e0349aece318",
      },
    ],
  },
  {
    id: "RE05",
    slug: "fix-controlled-uncontrolled-input-warning",
    title: "Fix 'Component Changing an Uncontrolled Input to Be Controlled' Warning",
    summary:
      "Diagnose React's controlled vs uncontrolled input warnings caused by undefined initial values, and implement resilient form state handling.",
    topic: "react",
    mode: "debug",
    difficulty: "foundation",
    estimatedMinutes: 15,
    tags: ["React", "Forms", "Controlled Components", "Debugging", "HTML Input"],
    skillsTested: [
      "Controlled vs Uncontrolled DOM Form Elements",
      "Initial State Fallbacks (Empty String vs undefined)",
      "Async Form Data Hydration",
      "React Form Warnings Resolution",
    ],
    scenario:
      "While editing a user profile form, the console outputs: `Warning: A component is changing an uncontrolled input to be controlled. This is likely caused by the value changing from undefined to a defined value, which should not happen.` The profile editor loads asynchronous user data from an API. Diagnose why React triggers this warning and rewrite the form state initialization to ensure it remains strictly controlled.",
    requirements: [
      "Explain the exact difference between a controlled input (`value !== undefined`) and an uncontrolled input (`value === undefined`).",
      "Demonstrate how initial asynchronous loading state defaults to `undefined`, triggering React's warning.",
      "Implement a default fallback pattern (e.g. `value={user?.name ?? ''}`) ensuring inputs never receive `undefined`.",
      "Show how to handle loading state cleanly before rendering the form fields.",
    ],
    starterCode: `import React, { useState, useEffect } from "react";

interface UserProfile { name: string; email: string }

export function ProfileForm() {
  const [user, setUser] = useState<UserProfile | undefined>(undefined);

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);

  return (
    <form>
      {/* WARNING: user?.name is initially undefined! */}
      <input
        type="text"
        value={user?.name}
        onChange={(e) => setUser(prev => prev ? { ...prev, name: e.target.value } : undefined)}
      />
    </form>
  );
}`,
    programmingLanguage: "tsx",
    hints: [
      "In React, passing `value={undefined}` tells React: 'This is an uncontrolled input; let the browser DOM manage its own value.'",
      "When the API resolves 200ms later and `user.name` becomes a string, React detects a transition from uncontrolled to controlled, which is forbidden.",
      "A controlled input must ALWAYS have a defined value (such as an empty string `''`).",
    ],
    evaluationRubric: [
      {
        criteria: "Root Cause Accuracy",
        weight: "40%",
        description: "Accurately articulates the semantic difference between `value={undefined}` and `value={''}` in React.",
      },
      {
        criteria: "Controlled Fallback Solution",
        weight: "40%",
        description: "Implements `user?.name ?? ''` or guards the form with an explicit loading state.",
      },
      {
        criteria: "Form State Architecture",
        weight: "20%",
        description: "Demonstrates clean separation between async fetching state and local form editing state.",
      },
    ],
    referenceAnswer:
      "### Why React Throws This Warning:\n- In React, an `<input>` is **uncontrolled** when `value` is `undefined` or omitted (the DOM node holds its own internal buffer).\n- An `<input>` is **controlled** when `value` is provided as a string or number.\n- When `user` is initially `undefined`, `<input value={user?.name} />` evaluates to `<input value={undefined} />`. React treats it as uncontrolled.\n- Once the API response arrives, `user.name` becomes `'Alex'`. React suddenly sees a controlled input, triggering the warning because switching control paradigms mid-lifecycle leads to input state glitches.\n\n### Two Clean Solutions:\n\n1. **Provide an Empty String Fallback (`?? ''`)**:\n```tsx\n<input\n  type=\"text\"\n  value={user?.name ?? ''}\n  onChange={(e) =>\n    setUser((prev) => ({ ...prev, name: e.target.value } as UserProfile))\n  }\n/>\n```\n\n2. **Render a Loading Spinner Until Data Arrives (Better UX)**:\n```tsx\nif (!user) {\n  return <div>Loading profile...</div>;\n}\n\nreturn (\n  <form>\n    <input\n      type=\"text\"\n      value={user.name}\n      onChange={(e) => setUser({ ...user, name: e.target.value })}\n    />\n  </form>\n);\n```",
    commonMistakes: [
      "Using `null` instead of `''` (passing `null` still produces a React warning in certain versions).",
      "Assuming `defaultValue` fixes controlled inputs (mixing `defaultValue` and `value` creates conflicting behaviors).",
    ],
    followUpQuestion:
      "When should you intentionally use an uncontrolled input with a `ref` instead of controlled state?",
    followUpAnswer:
      "For large forms with simple submit handlers that don't need real-time validation or instant UI masking. Reading values via `new FormData(e.currentTarget)` or `useRef` avoids re-rendering the component on every single keystroke.",
    references: [
      {
        title: "React Docs: Controlled vs Uncontrolled Components",
        url: "https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable",
      },
      {
        title: "React Docs: Sharing State Between Components",
        url: "https://react.dev/learn/sharing-state-between-components",
      },
    ],
  },
  {
    id: "RE06",
    slug: "build-accessible-modal-dialog",
    title: "Build an Accessible Modal Dialog with Focus Trap and Portal",
    summary:
      "Implement a fully accessible React modal component with createPortal, keyboard focus trapping, Escape key dismissal, and backdrop click outside.",
    topic: "react",
    mode: "build",
    difficulty: "challenge",
    estimatedMinutes: 35,
    tags: ["React", "Accessibility", "WAI-ARIA", "createPortal", "Focus Trap", "DOM"],
    skillsTested: [
      "React `createPortal` for Top-Layer Rendering",
      "Keyboard Focus Trap (Tab & Shift+Tab Traversal)",
      "WAI-ARIA Dialog Semantics (`role='dialog'`, `aria-modal`)",
      "Restoring Previous Focus on Modal Close",
    ],
    scenario:
      "Implement a production-grade accessible Modal Dialog component in React adhering to the W3C WAI-ARIA Modal pattern. The modal must render into a DOM portal (`document.body`), lock background page scrolling while open, trap keyboard `Tab` focus strictly within the dialog, dismiss upon pressing `Escape` or clicking the backdrop, and return focus to the previously active element upon closing.",
    requirements: [
      "Render markup via `createPortal` to prevent z-index and overflow clipping issues.",
      "Trap keyboard focus so `Tab` on the last focusable element wraps to the first, and `Shift+Tab` on the first wraps to the last.",
      "Listen for the `Escape` key to close the modal.",
      "Restore focus to the triggering element (`document.activeElement`) when the modal closes.",
      "Apply proper ARIA roles: `role='dialog'`, `aria-modal='true'`, and `aria-labelledby`.",
    ],
    starterCode: `import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // TODO: Implement portal, keyboard trap, scroll lock, and focus restoration
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h2>{title}</h2>
        {children}
      </div>
    </div>
  );
}`,
    programmingLanguage: "tsx",
    hints: [
      "Save `const previousActiveElement = useRef<HTMLElement | null>(null)` on mount to restore focus on unmount.",
      "Query all focusable elements inside the modal: `button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])`.",
      "Apply `document.body.style.overflow = 'hidden'` while the modal is open, and reset it in the cleanup function.",
    ],
    evaluationRubric: [
      {
        criteria: "Keyboard Focus Trapping",
        weight: "40%",
        description: "Focus cycles strictly between first and last focusable elements via Tab / Shift+Tab.",
      },
      {
        criteria: "Focus Restoration & Lifecycle",
        weight: "35%",
        description: "Captures triggering element and restores focus upon modal dismissal without throwing errors.",
      },
      {
        criteria: "WAI-ARIA Compliance & Portal",
        weight: "25%",
        description: "Uses `createPortal`, `role='dialog'`, `aria-modal='true'`, and backdrop click detection.",
      },
    ],
    referenceAnswer:
      "```tsx\nimport React, { useEffect, useRef } from 'react';\nimport { createPortal } from 'react-dom';\n\ninterface ModalProps {\n  isOpen: boolean;\n  onClose: () => void;\n  title: string;\n  children: React.ReactNode;\n}\n\nexport function Modal({ isOpen, onClose, title, children }: ModalProps) {\n  const modalRef = useRef<HTMLDivElement>(null);\n  const previousActiveElement = useRef<HTMLElement | null>(null);\n\n  useEffect(() => {\n    if (!isOpen) return;\n\n    // 1. Save currently focused element\n    previousActiveElement.current = document.activeElement as HTMLElement;\n\n    // 2. Lock body scroll\n    const originalOverflow = document.body.style.overflow;\n    document.body.style.overflow = 'hidden';\n\n    // 3. Focus first element inside modal\n    const focusableSelector =\n      'button, [href], input, select, textarea, [tabindex]:not([tabindex=\"-1\"])';\n    const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(focusableSelector);\n    if (focusableElements && focusableElements.length > 0) {\n      focusableElements[0].focus();\n    }\n\n    // 4. Keyboard trap and Escape handler\n    const handleKeyDown = (e: KeyboardEvent) => {\n      if (e.key === 'Escape') {\n        onClose();\n        return;\n      }\n      if (e.key === 'Tab' && focusableElements && focusableElements.length > 0) {\n        const first = focusableElements[0];\n        const last = focusableElements[focusableElements.length - 1];\n\n        if (e.shiftKey && document.activeElement === first) {\n          e.preventDefault();\n          last.focus();\n        } else if (!e.shiftKey && document.activeElement === last) {\n          e.preventDefault();\n          first.focus();\n        }\n      }\n    };\n\n    document.addEventListener('keydown', handleKeyDown);\n\n    return () => {\n      document.removeEventListener('keydown', handleKeyDown);\n      document.body.style.overflow = originalOverflow;\n      // Restore focus to previous element\n      previousActiveElement.current?.focus();\n    };\n  }, [isOpen, onClose]);\n\n  if (!isOpen || typeof document === 'undefined') return null;\n\n  return createPortal(\n    <div\n      className=\"fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4\"\n      onClick={(e) => {\n        if (e.target === e.currentTarget) onClose();\n      }}\n    >\n      <div\n        ref={modalRef}\n        role=\"dialog\"\n        aria-modal=\"true\"\n        aria-labelledby=\"modal-title\"\n        className=\"w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 p-6 text-white shadow-2xl\"\n      >\n        <h2 id=\"modal-title\" className=\"text-lg font-bold mb-4\">{title}</h2>\n        <div>{children}</div>\n      </div>\n    </div>,\n    document.body\n  );\n}\n```",
    commonMistakes: [
      "Forgetting to restore focus on close, leaving keyboard-only users stranded at the top of the webpage.",
      "Allowing Tab key to escape into the underlying background page while the modal is open.",
      "Rendering the modal inside an `overflow: hidden` parent container instead of using `createPortal` to `document.body`.",
    ],
    followUpQuestion:
      "How does the native HTML `<dialog>` element simplify this in modern browsers?",
    followUpAnswer:
      "Modern HTML `<dialog>` with `dialogRef.current.showModal()` automatically handles top-layer rendering, backdrop styling (`::backdrop`), native focus trapping, and Escape key dismissal natively without custom JS event listeners.",
    references: [
      {
        title: "W3C WAI-ARIA Modal Dialog Pattern",
        url: "https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/",
      },
      {
        title: "MDN: React createPortal",
        url: "https://react.dev/reference/react-dom/createPortal",
      },
    ],
  },
  {
    id: "RE07",
    slug: "build-paginated-data-list-component",
    title: "Build a Resilient Paginated Data List Component",
    summary:
      "Build a reusable React table/list component with stateful page navigation, skeleton loading, empty state, and error recovery.",
    topic: "react",
    mode: "build",
    difficulty: "applied",
    estimatedMinutes: 25,
    tags: ["React", "Pagination", "Component Design", "UI States", "TypeScript"],
    skillsTested: [
      "Stateful Pagination Window Calculation",
      "Defensive Component Rendering (Loading/Empty/Error/Success)",
      "Disabled State & Boundary Guards",
      "Reusable Generic Prop Modeling",
    ],
    scenario:
      "Design a robust, reusable `<DataList />` component in TypeScript that accepts a list of items, renders a customizable row, and manages pagination controls. The component must gracefully display a loading skeleton while fetching, an informative empty state when the array is empty, an error state with a 'Retry' action if fetching fails, and disable 'Previous'/'Next' buttons at boundary limits.",
    requirements: [
      "Support generic items (`<DataList<T> />`) with a `renderItem: (item: T) => React.ReactNode` render prop.",
      "Compute `totalPages = Math.ceil(totalCount / pageSize)` correctly.",
      "Disable 'Previous' on page 1 and 'Next' on the last page.",
      "Provide distinct UI for 4 mutually exclusive states: Loading, Error, Empty, and Populated.",
    ],
    starterCode: `import React from "react";

interface DataListProps<T> {
  items: T[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  isLoading: boolean;
  error?: string | null;
  onPageChange: (newPage: number) => void;
  onRetry?: () => void;
  renderItem: (item: T) => React.ReactNode;
}

export function DataList<T>({
  items,
  totalCount,
  currentPage,
  pageSize,
  isLoading,
  error,
  onPageChange,
  onRetry,
  renderItem,
}: DataListProps<T>) {
  // TODO: Implement loading, error, empty, items list, and pagination controls
  return null;
}`,
    programmingLanguage: "tsx",
    hints: [
      "Calculate `totalPages = Math.max(1, Math.ceil(totalCount / pageSize))` to prevent dividing by zero or having 0 total pages.",
      "Handle error first, then loading, then empty (`items.length === 0`), then data list.",
      "Ensure clicking Previous when `currentPage <= 1` is prevented both via `disabled` attribute and in the click handler.",
    ],
    evaluationRubric: [
      {
        criteria: "Complete State Coverage",
        weight: "40%",
        description: "Accurately renders Loading, Error, Empty, and Populated states without visual overlapping.",
      },
      {
        criteria: "Boundary & Math Correctness",
        weight: "35%",
        description: "Prevents navigating past page boundaries; computes page counts accurately.",
      },
      {
        criteria: "TypeScript Generics & Accessibility",
        weight: "25%",
        description: "Uses clean generic typing `<T>` and accessible button attributes.",
      },
    ],
    referenceAnswer:
      "```tsx\nimport React from 'react';\n\ninterface DataListProps<T> {\n  items: T[];\n  totalCount: number;\n  currentPage: number;\n  pageSize: number;\n  isLoading: boolean;\n  error?: string | null;\n  onPageChange: (newPage: number) => void;\n  onRetry?: () => void;\n  renderItem: (item: T, index: number) => React.ReactNode;\n}\n\nexport function DataList<T>({\n  items,\n  totalCount,\n  currentPage,\n  pageSize,\n  isLoading,\n  error,\n  onPageChange,\n  onRetry,\n  renderItem,\n}: DataListProps<T>) {\n  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));\n\n  if (error) {\n    return (\n      <div className=\"p-8 text-center rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-200\">\n        <p className=\"font-medium\">Failed to load data: {error}</p>\n        {onRetry && (\n          <button\n            onClick={onRetry}\n            className=\"mt-3 px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold\"\n          >\n            Retry\n          </button>\n        )}\n      </div>\n    );\n  }\n\n  if (isLoading) {\n    return (\n      <div className=\"space-y-3\">\n        {[1, 2, 3].map((n) => (\n          <div key={n} className=\"h-14 rounded-xl bg-slate-800/40 animate-pulse\" />\n        ))}\n      </div>\n    );\n  }\n\n  if (items.length === 0) {\n    return (\n      <div className=\"p-8 text-center rounded-xl border border-slate-800 bg-slate-900/40 text-slate-400\">\n        No records found matching your criteria.\n      </div>\n    );\n  }\n\n  return (\n    <div className=\"space-y-4\">\n      <div className=\"space-y-2\">{items.map(renderItem)}</div>\n\n      <div className=\"flex items-center justify-between pt-4 border-t border-slate-800 text-xs font-mono text-slate-400\">\n        <span>\n          Page {currentPage} of {totalPages} ({totalCount} total items)\n        </span>\n\n        <div className=\"flex items-center gap-2\">\n          <button\n            onClick={() => onPageChange(currentPage - 1)}\n            disabled={currentPage <= 1}\n            className=\"px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed\"\n          >\n            Previous\n          </button>\n          <button\n            onClick={() => onPageChange(currentPage + 1)}\n            disabled={currentPage >= totalPages}\n            className=\"px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed\"\n          >\n            Next\n          </button>\n        </div>\n      </div>\n    </div>\n  );\n}\n```",
    commonMistakes: [
      "Calculating `totalPages = totalCount / pageSize` without `Math.ceil`, resulting in fractional page counts (e.g. page 4.2).",
      "Displaying the empty state while `isLoading: true` is still active, causing jarring UI content flicker.",
    ],
    followUpQuestion:
      "How would you integrate URL query parameter synchronization (`?page=2`) so users can bookmark and share paginated results?",
    followUpAnswer:
      "Use Next.js `useSearchParams()` to read `page` on load, and in `onPageChange`, call `router.push('?page=' + newPage)` to push a browser history entry.",
    references: [
      {
        title: "React Docs: Thinking in React (State placement)",
        url: "https://react.dev/learn/thinking-in-react",
      },
    ],
  },
  {
    id: "RE08",
    slug: "diagnose-unnecessary-renders-memoization-tradeoffs",
    title: "Diagnose Unnecessary Re-Renders and the Cost of React.memo",
    summary:
      "Profile React rendering bottlenecks, evaluate shallow prop equality comparisons, and justify when React.memo, useMemo, and useCallback are worth their overhead.",
    topic: "react",
    mode: "explain",
    difficulty: "challenge",
    estimatedMinutes: 25,
    tags: ["React", "Performance", "React.memo", "useMemo", "useCallback", "Profiling"],
    skillsTested: [
      "React Render Lifecycle & Component Re-executing",
      "Shallow Prop Equality Comparisons (`Object.is`)",
      "Performance Cost of Over-Memoization",
      "Effective Usage of React DevTools Profiler",
    ],
    scenario:
      "A software team encounters performance latency on a large data table. An engineer proposes wrapping every single component in `React.memo`, every function in `useCallback`, and every primitive calculation in `useMemo`. Explain how to use the React DevTools Profiler to diagnose whether re-renders are actually causing performance degradation, and justify why indiscriminate memoization can degrade performance.",
    requirements: [
      "Explain the standard React rendering behavior: When a parent renders, all child components re-render by default regardless of props.",
      "Explain how `React.memo` works (shallow comparison of props) and why passing inline object literals `style={{ color: 'red' }}` or inline arrows `onClick={() => ...}` breaks memoization.",
      "Detail the overhead costs of memoization (allocating closures, dependency array checks, memory storage).",
      "Provide a clear checklist for when memoization is legitimately beneficial.",
    ],
    starterCode: `// Proposed team pattern: Memoize everything!
const ExpensiveRow = React.memo(({ user, onSelect }: { user: User; onSelect: (id: string) => void }) => {
  return <div onClick={() => onSelect(user.id)}>{user.name}</div>;
});

export function ParentTable({ users }: { users: User[] }) {
  // Notice: onSelect is an inline function recreated on every render!
  return (
    <div>
      {users.map(u => (
        <ExpensiveRow key={u.id} user={u} onSelect={(id) => console.log(id)} />
      ))}
    </div>
  );
}`,
    programmingLanguage: "tsx",
    hints: [
      "Re-rendering in React is simply executing JavaScript functions; it does NOT mean the real browser DOM was modified unless the returned JSX diffed.",
      "If a component renders in 0.05 milliseconds, running prop comparisons on every render takes MORE CPU time than just letting the component re-render.",
      "`React.memo` is only effective when props are referentially identical across renders.",
    ],
    evaluationRubric: [
      {
        criteria: "Reconciliation vs DOM Mutation Clarity",
        weight: "35%",
        description: "Distinguishes between virtual component re-rendering and expensive DOM mutations.",
      },
      {
        criteria: "Mechanics of React.memo Breakdown",
        weight: "35%",
        description: "Explains how unstable inline function/object references invalidate shallow equality.",
      },
      {
        criteria: "Pragmatic Profiling Justification",
        weight: "30%",
        description: "Uses React DevTools Profiler metrics (render duration, commit phase) to guide optimization.",
      },
    ],
    referenceAnswer:
      "### 1. Re-render vs DOM Repaint:\nA common misconception is that a component re-rendering means the browser re-paints the DOM. In reality:\n- **Render phase**: React calls your component function to obtain a new Virtual DOM tree. This is pure JS in memory and typically takes fractions of a millisecond.\n- **Commit phase**: React compares the new tree with the old tree. **Only if there are differences does React touch the real DOM.**\n\n### 2. The Hidden Cost of Indiscriminate Memoization:\nWrapping everything in `React.memo` is NOT free:\n- **Prop Comparison Overhead**: React must run `Object.is` comparisons on every single prop on every render pass.\n- **Unstable References Invalidate Memoization**: In the starter code, `<ExpensiveRow onSelect={(id) => ...} />` creates a new function reference every time `ParentTable` renders. `React.memo` checks props, sees that `prevProps.onSelect !== nextProps.onSelect`, and **re-renders anyway**! You paid the cost of prop comparison AND still re-rendered!\n- **Memory Footprint**: `useCallback` and `useMemo` allocate memory for dependency arrays and cached closures.\n\n### 3. When Memoization IS Justified:\n1. The component is measurably slow (e.g. >10ms in the React Profiler with thousands of DOM nodes, SVG charts, or complex trees).\n2. The component re-renders frequently with the **exact same props**.\n3. The props are primitives or properly stabilized with `useCallback` / `useMemo`.\n4. It is passed as a dependency to other hooks (e.g. `useEffect(..., [stabilizedCallback])`).",
    commonMistakes: [
      "Assuming re-renders are inherently bugs; re-rendering is how React guarantees that the UI reflects state.",
      "Applying `React.memo` to a component while passing unstable inline objects `options={{ count: 10 }}` or arrow callbacks.",
    ],
    followUpQuestion:
      "How can component composition (e.g. moving state down or lifting content up via `children`) eliminate re-renders without any memoization?",
    followUpAnswer:
      "If a parent has a counter that updates frequently, move the counter state into a localized child component. Alternatively, pass expensive sub-trees as `children`: since `children` comes from the grandparent, its JSX element reference remains identical, so React skips re-rendering it without `React.memo`.",
    references: [
      {
        title: "React Docs: React.memo",
        url: "https://react.dev/reference/react/memo",
      },
      {
        title: "Kent C. Dodds: When to useMemo and useCallback",
        url: "https://kentcdodds.com/blog/usememo-and-usecallback",
      },
    ],
  },
];
