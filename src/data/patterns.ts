import { Pattern } from "@/types";

export const PATTERNS: Pattern[] = [
  {
    id: "pat-1",
    slug: "arrays-and-hashing",
    name: "Arrays and Hashing",
    category: "Core Patterns",
    difficultyLevel: "Beginner",
    sortOrder: 1,
    description:
      "Leverage contiguous memory arrays and constant-time average hash lookups to track frequencies, detect duplicates, and achieve O(1) membership checks.",
    recognitionHints: [
      "Problem requires verifying frequency counts, anagrams, or duplicates",
      "Finding pairs or complements summing to a target value (e.g., Target - x)",
      "When brute force involves nested O(N^2) searches over unsorted elements",
      "Trade space for time to achieve linear O(N) runtime"
    ],
    commonApproaches: [
      "Use HashSets for instant existence checks and deduplication",
      "Use HashMaps (frequency counters) to pair keys with occurrences",
      "Prefix Hash/Array for cumulative totals and sub-array condition checks",
      "Bucket sorting for frequency-bounded collections"
    ],
    commonMistakes: [
      "Forgetting hash collision implications or non-primitive object hashing keys",
      "Excessive memory allocation inside tight loops",
      "Failing to consider duplicate numbers when mapping indices"
    ],
    tags: ["Hash Table", "Frequency Counter", "Lookup", "Linear Scan"]
  },
  {
    id: "pat-2",
    slug: "two-pointers",
    name: "Two Pointers",
    category: "Core Patterns",
    difficultyLevel: "Beginner",
    sortOrder: 2,
    description:
      "Traverse linear collections from opposite ends or at synchronized speeds to search pairs, partition in-place, or evaluate symmetry in O(N) time and O(1) space.",
    recognitionHints: [
      "Input array or string is sorted, or sorting beforehand is permissible",
      "Searching for two or three elements satisfying an equation (e.g., target sum)",
      "In-place array manipulation without allocating auxiliary buffers",
      "Palindrome string verification or bidirectional scanning"
    ],
    commonApproaches: [
      "Left and Right pointers moving towards each other based on comparison conditions",
      "Left and Right pointers initialized at opposite ends to squeeze the search boundary",
      "Fast and slow pointers for partitioning (e.g., Dutch National Flag or partition logic)"
    ],
    commonMistakes: [
      "Incorrect while loop termination (left < right vs left <= right)",
      "Infinite loops from missing pointer increment/decrement on conditional branches",
      "Failing to skip duplicate values when enumerating all unique pairs/triplets"
    ],
    tags: ["Sorted Arrays", "Bidirectional", "In-Place", "O(1) Space"]
  },
  {
    id: "pat-3",
    slug: "sliding-window",
    name: "Sliding Window",
    category: "Core Patterns",
    difficultyLevel: "Intermediate",
    sortOrder: 3,
    description:
      "Maintain a dynamic or fixed sub-range window over sequential data to compute contiguous sub-array sums, unique substring counts, or bounding criteria.",
    recognitionHints: [
      "Problem asks for the longest/shortest contiguous substring or subarray meeting a condition",
      "Targeting contiguous elements of a fixed size K (e.g., maximum sum subarray of size K)",
      "Tracking characters, frequencies, or values within an active running range"
    ],
    commonApproaches: [
      "Fixed-size window: expand right until size K, then slide both left and right simultaneously",
      "Dynamic window: expand right until invalid, then shrink left until valid again (or vice versa)",
      "Track window state using a frequency map or accumulator variable"
    ],
    commonMistakes: [
      "Using sliding window on arrays with negative numbers for sum constraints (use prefix sum with hash map instead)",
      "Not updating window state properly when incrementing the left pointer",
      "Off-by-one errors when calculating window size (right - left + 1)"
    ],
    tags: ["Subarrays", "Substrings", "Contiguous", "Dynamic Window"]
  },
  {
    id: "pat-4",
    slug: "fast-and-slow-pointers",
    name: "Fast and Slow Pointers",
    category: "Core Patterns",
    difficultyLevel: "Intermediate",
    sortOrder: 4,
    description:
      "Advance pointers at different relative speeds (usually 1x and 2x) across linked structures to detect cyclic loops or locate midpoint elements.",
    recognitionHints: [
      "Cycle detection in singly linked lists or state transition sequences",
      "Finding the middle node of a linked list in a single pass without knowing length",
      "Finding the start of a cycle or repetitive number series (Floyd's Tortoise and Hare)"
    ],
    commonApproaches: [
      "Initialize slow = head and fast = head (or head.next)",
      "Advance slow by 1 step, fast by 2 steps while fast && fast.next exist",
      "For cycle start: reset one pointer to head upon collision, step both by 1 until they meet again"
    ],
    commonMistakes: [
      "Null pointer dereference by checking fast.next before checking fast",
      "Mishandling even vs odd length lists when splitting at the midpoint",
      "Assuming cycle presence when fast simply reaches null"
    ],
    tags: ["Floyd's Algorithm", "Linked List", "Cycle Detection", "Midpoint"]
  },
  {
    id: "pat-5",
    slug: "binary-search",
    name: "Binary Search",
    category: "Core Patterns",
    difficultyLevel: "Intermediate",
    sortOrder: 5,
    description:
      "Repeatedly divide search ranges in half to achieve logarithmic O(log N) lookup in sorted domains, rotated arrays, or monotonic answer spaces.",
    recognitionHints: [
      "Input is sorted, partially sorted (rotated), or possesses monotonic behavior",
      "Finding the first or last occurrence of a condition",
      "Optimization problems where you can verify a feasibility predicate (Binary Search on Answer Space)"
    ],
    commonApproaches: [
      "Standard iterative template with mid = left + Math.floor((right - left) / 2) to prevent overflow",
      "Left-bound search: narrow right when predicate is satisfied",
      "Binary search on answer range [min_possible, max_possible] paired with a greedy checker function"
    ],
    commonMistakes: [
      "Integer overflow from (left + right) / 2 in non-JS languages or large bigints",
      "Infinite loop when updating pointers (e.g., using left = mid instead of left = mid + 1)",
      "Incorrect boundary check (left <= right vs left < right)"
    ],
    tags: ["Logarithmic", "Divide & Conquer", "Rotated Array", "Optimization"]
  },
  {
    id: "pat-6",
    slug: "linked-lists",
    name: "Linked Lists",
    category: "Data Structure Patterns",
    difficultyLevel: "Beginner",
    sortOrder: 6,
    description:
      "Manipulate non-contiguous node references, reverse chains, reorder segments, and merge sequences in-place with dummy head pointers.",
    recognitionHints: [
      "Sequences where in-place re-linking is required without allocating new nodes",
      "Reversing all or part of a linked chain",
      "Merging multiple sorted linked lists or rearranging odd/even nodes"
    ],
    commonApproaches: [
      "Use a Sentinel / Dummy Node before the head to eliminate edge-case conditionals for head mutations",
      "Standard 3-pointer reversal: prev, curr, nextTemp",
      "Recursion for reversal and structural traversal"
    ],
    commonMistakes: [
      "Losing reference to the remaining chain before updating curr.next",
      "Creating accidental memory cycles by failing to terminate the final node with null",
      "Edge cases: empty list, single node list, two-node list"
    ],
    tags: ["Pointers", "In-Place", "Sentinel Node", "Reversal"]
  },
  {
    id: "pat-7",
    slug: "stacks-and-queues",
    name: "Stacks and Queues",
    category: "Data Structure Patterns",
    difficultyLevel: "Intermediate",
    sortOrder: 7,
    description:
      "Apply LIFO and FIFO ordering to solve expression parsing, nested structures, monotonic range lookups, and buffer simulations.",
    recognitionHints: [
      "Matching nested brackets, parentheses, or hierarchical tags",
      "Finding the Next Greater Element or Next Smaller Element (Monotonic Stack)",
      "Sliding window maximum or minimum (Monotonic Deque)",
      "Expression evaluation and reverse Polish notation"
    ],
    commonApproaches: [
      "Monotonic Stack: maintain elements in strictly ascending or descending order by popping candidates",
      "Stack pairing for parenthesis validation and tag closing",
      "Queue for BFS traversal and breadth-first scheduling"
    ],
    commonMistakes: [
      "Popping from an empty stack without checking size/length",
      "Storing values instead of indices in monotonic stacks when distances are required",
      "Using array shift() in JavaScript for heavy queue operations (O(N) operation instead of O(1) ring buffer/linked list)"
    ],
    tags: ["LIFO", "FIFO", "Monotonic Stack", "Expression Parsing"]
  },
  {
    id: "pat-8",
    slug: "intervals",
    name: "Intervals",
    category: "Core Patterns",
    difficultyLevel: "Intermediate",
    sortOrder: 8,
    description:
      "Sort and scan range tuples [start, end] to merge overlapping time blocks, detect schedule conflicts, and compute non-overlapping coverage.",
    recognitionHints: [
      "Input consists of time ranges, calendar meetings, or bounding segments [start, end]",
      "Problems asking for merging intervals, finding intersections, or minimum meeting rooms",
      "Determining maximum simultaneous overlap"
    ],
    commonApproaches: [
      "Sort intervals by start time in ascending order",
      "Compare curr.start with prev.end to detect overlap; if overlapping, update prev.end = max(prev.end, curr.end)",
      "Line Sweep / Chronological Event Points: separate starts (+1) and ends (-1) and sweep across time"
    ],
    commonMistakes: [
      "Sorting by end time instead of start time when standard merge is needed",
      "Forgetting inclusive boundary condition (start <= end vs start < end)",
      "Mutating input array directly without shallow clone"
    ],
    tags: ["Range", "Scheduling", "Sweep-Line", "Sorting"]
  },
  {
    id: "pat-9",
    slug: "trees-and-bst",
    name: "Trees and Binary Search Trees",
    category: "Data Structure Patterns",
    difficultyLevel: "Intermediate",
    sortOrder: 9,
    description:
      "Traverse and modify hierarchical tree nodes using DFS (pre, in, post-order) and BFS level-order to evaluate balance, symmetry, and BST invariants.",
    recognitionHints: [
      "Hierarchical data structure with parent-child links without cycles",
      "Binary Search Tree condition: left.val < root.val < right.val for all subtree nodes",
      "Computing tree height, diameter, lowest common ancestor (LCA), or path sums"
    ],
    commonApproaches: [
      "DFS Recursive post-order traversal to calculate subtree properties bottom-up",
      "BFS with a queue to process level-by-level (Level Order Traversal)",
      "BST In-Order traversal: visits nodes in strictly sorted ascending order"
    ],
    commonMistakes: [
      "Only comparing immediate children in BST validation instead of propagating min and max bounds",
      "Missing null base case in recursive functions",
      "Stack overflow on heavily skewed trees (degraded to linked lists)"
    ],
    tags: ["DFS", "BFS", "Recursion", "Binary Tree", "In-Order"]
  },
  {
    id: "pat-10",
    slug: "graphs-and-traversal",
    name: "Graphs and Graph Traversal",
    category: "Advanced Techniques",
    difficultyLevel: "Advanced",
    sortOrder: 10,
    description:
      "Explore interconnected networks of vertices and edges using Depth-First Search, Breadth-First Search, and shortest-path heuristics.",
    recognitionHints: [
      "Grid matrix representations (islands, mazes, coordinates)",
      "Finding connected components, reachability, or shortest distance in unweighted graph",
      "Cycle detection in directed and undirected networks"
    ],
    commonApproaches: [
      "Adjacency list representation using Map or array of arrays",
      "Visited set or in-place matrix mutation to prevent endless cycle re-visiting",
      "BFS with queue for finding the unweighted shortest path level by level",
      "DFS for exhaustive path finding and connected component identification"
    ],
    commonMistakes: [
      "Forgetting to mark nodes as visited before pushing them to the queue in BFS (leads to duplicate queue entries and exponential memory)",
      "Out-of-bounds index errors when scanning 4-directional matrix neighbors (up, down, left, right)",
      "Confusing directed graph cycle detection (3 colors/states) with undirected (parent pointer)"
    ],
    tags: ["Matrix", "BFS", "DFS", "Shortest Path", "Connected Components"]
  },
  {
    id: "pat-11",
    slug: "heaps-and-priority-queues",
    name: "Heaps and Priority Queues",
    category: "Data Structure Patterns",
    difficultyLevel: "Intermediate",
    sortOrder: 11,
    description:
      "Maintain partial orderings over streaming or static data to retrieve minimum or maximum elements in O(log K) insertion time.",
    recognitionHints: [
      "Finding the K-th largest or K-th smallest elements",
      "Top K frequent elements or streaming median calculation",
      "Merging K sorted lists or continuously scheduling tasks by priority"
    ],
    commonApproaches: [
      "Min-heap of size K to find the K-th largest element (root holds answer)",
      "Max-heap of size K to find the K-th smallest element",
      "Two heaps (Max-heap for lower half, Min-heap for upper half) for running median"
    ],
    commonMistakes: [
      "Using full sort O(N log N) when Heap can do O(N log K)",
      "Inverting comparator logic in custom priority queues",
      "JavaScript lack of built-in PriorityQueue (requires implementing array-based binary heap)"
    ],
    tags: ["Top-K", "Min-Heap", "Max-Heap", "Streaming Data"]
  },
  {
    id: "pat-12",
    slug: "backtracking",
    name: "Backtracking",
    category: "Advanced Techniques",
    difficultyLevel: "Advanced",
    sortOrder: 12,
    description:
      "Systematically explore combinatorial solution spaces, building candidate answers incrementally and pruning branches that violate constraints.",
    recognitionHints: [
      "Generating all permutations, combinations, subsets, or valid partitions",
      "Constraint satisfaction puzzles like N-Queens, Sudoku solver, or Word Search",
      "Exhaustive decision tree exploration where partial solutions can be pruned early"
    ],
    commonApproaches: [
      "Recursive decision function: choose -> explore -> un-choose (undo action)",
      "Pass candidate path and index to avoid duplicate combinations",
      "Pruning conditions to terminate branches early before recursive descent"
    ],
    commonMistakes: [
      "Pushing the mutable array reference to the result without making a deep copy / slice",
      "Forgetting to undo the choice state during the backtrack step",
      "Not sorting input first when handling duplicate elements in subsets/permutations"
    ],
    tags: ["Combinations", "Permutations", "Subsets", "Pruning"]
  },
  {
    id: "pat-13",
    slug: "greedy-algorithms",
    name: "Greedy Algorithms",
    category: "Core Patterns",
    difficultyLevel: "Intermediate",
    sortOrder: 13,
    description:
      "Make locally optimal choices at each decision step with the guarantee that the local optimum yields a globally optimal solution.",
    recognitionHints: [
      "Optimization problems where past decisions don't affect future choices (Optimal Substructure + Greedy Choice Property)",
      "Gas station circuit, jump game, task scheduler, fractional knapsack",
      "Maximizing profit or minimizing resources through sorting and linear scanning"
    ],
    commonApproaches: [
      "Sort elements by utility ratio or boundary criteria",
      "Keep track of running maximum reach or minimum required resources",
      "Prove greedy choice property by contradiction or induction"
    ],
    commonMistakes: [
      "Applying greedy approach to dynamic programming problems where local optimum misses global maximum",
      "Failing to sort items before applying the greedy heuristic",
      "Not handling edge cases where multiple identical choices exist"
    ],
    tags: ["Locally Optimal", "Sorting", "Optimization", "Jump Game"]
  },
  {
    id: "pat-14",
    slug: "dynamic-programming",
    name: "Dynamic Programming",
    category: "Advanced Techniques",
    difficultyLevel: "Advanced",
    sortOrder: 14,
    description:
      "Break complex optimization problems into overlapping subproblems, memoizing or tabulating intermediate states to prevent redundant re-computation.",
    recognitionHints: [
      "Problem exhibits optimal substructure and overlapping subproblems",
      "Questions asking for count of ways, minimum cost, maximum value, or true/false feasibility",
      "Input is an array, matrix, or string where brute force recursion explodes exponentially"
    ],
    commonApproaches: [
      "Top-Down with Memoization: standard recursion enhanced with cache/memo object",
      "Bottom-Up Tabulation: 1D or 2D array iteratively built from base cases",
      "Space Optimization: compress DP array to variables when state only depends on previous row"
    ],
    commonMistakes: [
      "Incorrect base case definitions leading to corrupted DP state tables",
      "Allocating full 2D array when only the previous row is needed",
      "Off-by-one errors in state sizing (e.g., dp array size N vs N + 1)"
    ],
    tags: ["Memoization", "Tabulation", "State Machine", "Optimal Substructure"]
  },
  {
    id: "pat-15",
    slug: "tries",
    name: "Tries",
    category: "Data Structure Patterns",
    difficultyLevel: "Intermediate",
    sortOrder: 15,
    description:
      "Structure string characters into prefix trees for prefix lookups, autocomplete suggestions, and dictionary word searches.",
    recognitionHints: [
      "Dictionary lookups with common prefixes",
      "Autocomplete, spell checkers, or word search on grid with a lexicon",
      "Longest common prefix or bitwise Trie for maximum XOR calculations"
    ],
    commonApproaches: [
      "TrieNode class containing a children map/array and an isEndOfWord boolean flag",
      "Insert: traverse characters creating new nodes as needed, mark end flag",
      "Search: follow character pointers; return true only if final node is marked isEndOfWord"
    ],
    commonMistakes: [
      "Allocating fixed 26-element arrays when characters include uppercase, numbers, or symbols",
      "Returning true for prefix search instead of checking isEndOfWord on exact searches",
      "High memory consumption without node pruning"
    ],
    tags: ["Prefix Tree", "Strings", "Autocomplete", "Dictionary"]
  },
  {
    id: "pat-16",
    slug: "bit-manipulation",
    name: "Bit Manipulation",
    category: "Core Patterns",
    difficultyLevel: "Intermediate",
    sortOrder: 16,
    description:
      "Manipulate individual binary bits using AND, OR, XOR, NOT, and shift operators for constant time arithmetic, masking, and parity checks.",
    recognitionHints: [
      "Problems involving binary representations, counting set bits (Hamming weight)",
      "Finding unique numbers where others appear twice (XOR cancels duplicates)",
      "Subset generation using bitmasks (2^N states mapped to integers)"
    ],
    commonApproaches: [
      "XOR properties: x ^ x = 0 and x ^ 0 = x",
      "Brian Kernighan’s algorithm: n & (n - 1) clears the lowest set bit in O(1)",
      "Bitmasking: (1 << i) sets or inspects the i-th bit"
    ],
    commonMistakes: [
      "Operator precedence: bitwise operators have lower precedence than arithmetic/comparison operators",
      "Signed 32-bit integer overflow in JavaScript bitwise operations (which treat numbers as 32-bit signed integers)",
      "Shifting beyond word width (e.g., 1 << 32 in 32-bit architectures)"
    ],
    tags: ["Bitmask", "XOR", "Binary", "Low-Level"]
  },
  {
    id: "pat-17",
    slug: "union-find",
    name: "Union-Find",
    category: "Advanced Techniques",
    difficultyLevel: "Advanced",
    sortOrder: 17,
    description:
      "Track partitioned disjoint sets with near constant-time Find and Union operations using path compression and union by rank.",
    recognitionHints: [
      "Determining dynamic connectivity between pairs of nodes",
      "Cycle detection in undirected graphs",
      "Counting total number of connected components or Kruskal's Minimum Spanning Tree"
    ],
    commonApproaches: [
      "DisjointSet class with parent[] and rank[] (or size[]) arrays",
      "Find with Path Compression: root = find(parent[x]); parent[x] = root; return root;",
      "Union by Rank: attach shallower tree under deeper tree root to maintain balanced depth"
    ],
    commonMistakes: [
      "Omitting path compression, causing find operations to degrade to O(N)",
      "Forgetting to check if parents are already equal before unioning (which increments component count incorrectly)",
      "Applying Union-Find directly to directed graphs (only suitable for undirected connectivity)"
    ],
    tags: ["Disjoint Set", "Path Compression", "Graph Connectivity", "Kruskal"]
  },
  {
    id: "pat-18",
    slug: "topological-sorting",
    name: "Topological Sorting",
    category: "Advanced Techniques",
    difficultyLevel: "Advanced",
    sortOrder: 18,
    description:
      "Order directed acyclic graph (DAG) vertices linearly such that for every directed edge u -> v, u appears before v.",
    recognitionHints: [
      "Tasks with prerequisite dependencies (e.g., Course Schedule, Build System order)",
      "Detecting cycles in a directed graph (if sorted output contains fewer nodes than total)",
      "Evaluating dependencies in spreadsheets or compilation targets"
    ],
    commonApproaches: [
      "Kahn's Algorithm (BFS): calculate in-degrees; enqueue nodes with in-degree 0; decrement neighbors",
      "DFS with 3-state coloring: unvisited (0), visiting (1), visited (2); push to result stack on backtrack",
      "Compare result length with total node count to confirm cycle-free DAG"
    ],
    commonMistakes: [
      "Failing to detect cycles (Kahn's algorithm produces partial sequence when a cycle is present)",
      "Mishandling disconnected graph components with multiple sources",
      "Inverting edge direction (prerequisites pointing to targets vs targets pointing to prerequisites)"
    ],
    tags: ["DAG", "Dependencies", "Kahn's Algorithm", "Course Schedule"]
  }
];
