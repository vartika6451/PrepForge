import { DSAQuestion } from "@/types";

export const DSA_QUESTIONS: DSAQuestion[] = [
  // Arrays and Hashing
  {
    id: "q-1",
    slug: "two-sum",
    title: "Two Sum",
    externalUrl: "https://leetcode.com/problems/two-sum/",
    platform: "LeetCode",
    difficulty: "Easy",
    editorialNote: "Store complement (target - num) in a hash map to achieve single-pass O(N) lookup.",
    patternSlugs: ["arrays-and-hashing"],
    recommendedOrder: 1
  },
  {
    id: "q-2",
    slug: "contains-duplicate",
    title: "Contains Duplicate",
    externalUrl: "https://leetcode.com/problems/contains-duplicate/",
    platform: "LeetCode",
    difficulty: "Easy",
    editorialNote: "Use a hash set to detect duplicate entries in O(N) time and O(N) space.",
    patternSlugs: ["arrays-and-hashing"],
    recommendedOrder: 2
  },
  {
    id: "q-3",
    slug: "valid-anagram",
    title: "Valid Anagram",
    externalUrl: "https://leetcode.com/problems/valid-anagram/",
    platform: "LeetCode",
    difficulty: "Easy",
    editorialNote: "Compare character frequency tables or fixed 26-element integer arrays.",
    patternSlugs: ["arrays-and-hashing"],
    recommendedOrder: 3
  },
  {
    id: "q-4",
    slug: "group-anagrams",
    title: "Group Anagrams",
    externalUrl: "https://leetcode.com/problems/group-anagrams/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Sort individual words or hash 26-character frequency signatures as HashMap keys.",
    patternSlugs: ["arrays-and-hashing"],
    recommendedOrder: 4
  },
  {
    id: "q-5",
    slug: "top-k-frequent-elements",
    title: "Top K Frequent Elements",
    externalUrl: "https://leetcode.com/problems/top-k-frequent-elements/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Calculate frequency counts then use bucket sort by frequency index to avoid O(N log N) sorting.",
    patternSlugs: ["arrays-and-hashing", "heaps-and-priority-queues"],
    recommendedOrder: 5
  },
  {
    id: "q-6",
    slug: "product-of-array-except-self",
    title: "Product of Array Except Self",
    externalUrl: "https://leetcode.com/problems/product-of-array-except-self/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Accumulate prefix products in left pass and suffix products in right pass without division in O(1) extra space.",
    patternSlugs: ["arrays-and-hashing"],
    recommendedOrder: 6
  },

  // Two Pointers
  {
    id: "q-7",
    slug: "valid-palindrome",
    title: "Valid Palindrome",
    externalUrl: "https://leetcode.com/problems/valid-palindrome/",
    platform: "LeetCode",
    difficulty: "Easy",
    editorialNote: "Advance left and right pointers while filtering out alphanumeric characters in-place.",
    patternSlugs: ["two-pointers"],
    recommendedOrder: 1
  },
  {
    id: "q-8",
    slug: "two-sum-ii-input-array-is-sorted",
    title: "Two Sum II - Input Array Is Sorted",
    externalUrl: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "With sorted input, adjust left and right pointers based on whether sum is less or greater than target.",
    patternSlugs: ["two-pointers", "binary-search"],
    recommendedOrder: 2
  },
  {
    id: "q-9",
    slug: "3sum",
    title: "3Sum",
    externalUrl: "https://leetcode.com/problems/3sum/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Sort the array, fix the first element, and run two pointers on the remaining segment. Take care to skip duplicates.",
    patternSlugs: ["two-pointers"],
    recommendedOrder: 3
  },
  {
    id: "q-10",
    slug: "container-with-most-water",
    title: "Container With Most Water",
    externalUrl: "https://leetcode.com/problems/container-with-most-water/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Initialize bounds at opposite ends and greedily move the pointer with smaller height inward.",
    patternSlugs: ["two-pointers", "greedy-algorithms"],
    recommendedOrder: 4
  },
  {
    id: "q-11",
    slug: "trapping-rain-water",
    title: "Trapping Rain Water",
    externalUrl: "https://leetcode.com/problems/trapping-rain-water/",
    platform: "LeetCode",
    difficulty: "Hard",
    editorialNote: "Maintain running maxLeft and maxRight pointers converging inwards to compute trapped volume in O(1) space.",
    patternSlugs: ["two-pointers", "stacks-and-queues"],
    recommendedOrder: 5
  },

  // Sliding Window
  {
    id: "q-12",
    slug: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    externalUrl: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
    platform: "LeetCode",
    difficulty: "Easy",
    editorialNote: "Track minimum buy price seen so far and calculate prospective profit on each incoming day.",
    patternSlugs: ["sliding-window", "two-pointers"],
    recommendedOrder: 1
  },
  {
    id: "q-13",
    slug: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    externalUrl: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Expand right pointer and maintain a hash map of last seen indices to jump left pointer forward past duplicates.",
    patternSlugs: ["sliding-window"],
    recommendedOrder: 2
  },
  {
    id: "q-14",
    slug: "longest-repeating-character-replacement",
    title: "Longest Repeating Character Replacement",
    externalUrl: "https://leetcode.com/problems/longest-repeating-character-replacement/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Window is valid if (windowLength - maxFrequency) <= k. Shrink left pointer only when invalid.",
    patternSlugs: ["sliding-window"],
    recommendedOrder: 3
  },
  {
    id: "q-15",
    slug: "permutation-in-string",
    title: "Permutation in String",
    externalUrl: "https://leetcode.com/problems/permutation-in-string/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Fixed-size sliding window of length s1 over s2 comparing character match counts in O(N).",
    patternSlugs: ["sliding-window", "arrays-and-hashing"],
    recommendedOrder: 4
  },
  {
    id: "q-16",
    slug: "minimum-window-substring",
    title: "Minimum Window Substring",
    externalUrl: "https://leetcode.com/problems/minimum-window-substring/",
    platform: "LeetCode",
    difficulty: "Hard",
    editorialNote: "Expand right to satisfy all required character counts, then contract left to minimize window while preserving validity.",
    patternSlugs: ["sliding-window"],
    recommendedOrder: 5
  },

  // Fast and Slow Pointers
  {
    id: "q-17",
    slug: "linked-list-cycle",
    title: "Linked List Cycle",
    externalUrl: "https://leetcode.com/problems/linked-list-cycle/",
    platform: "LeetCode",
    difficulty: "Easy",
    editorialNote: "Floyd's algorithm: slow advances 1 step, fast advances 2. Collision verifies cyclic reference.",
    patternSlugs: ["fast-and-slow-pointers", "linked-lists"],
    recommendedOrder: 1
  },
  {
    id: "q-18",
    slug: "middle-of-the-linked-list",
    title: "Middle of the Linked List",
    externalUrl: "https://leetcode.com/problems/middle-of-the-linked-list/",
    platform: "LeetCode",
    difficulty: "Easy",
    editorialNote: "When fast pointer reaches the end, slow pointer is positioned exactly at midpoint.",
    patternSlugs: ["fast-and-slow-pointers", "linked-lists"],
    recommendedOrder: 2
  },
  {
    id: "q-19",
    slug: "linked-list-cycle-ii",
    title: "Linked List Cycle II",
    externalUrl: "https://leetcode.com/problems/linked-list-cycle-ii/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Upon fast and slow collision, reset one pointer to head. Moving both at 1x speed meets at cycle entrance.",
    patternSlugs: ["fast-and-slow-pointers", "linked-lists"],
    recommendedOrder: 3
  },
  {
    id: "q-20",
    slug: "find-the-duplicate-number",
    title: "Find the Duplicate Number",
    externalUrl: "https://leetcode.com/problems/find-the-duplicate-number/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Model array values as node pointers (i -> nums[i]) to identify cycle entry without modifying array in O(1) space.",
    patternSlugs: ["fast-and-slow-pointers", "binary-search"],
    recommendedOrder: 4
  },

  // Binary Search
  {
    id: "q-21",
    slug: "binary-search",
    title: "Binary Search",
    externalUrl: "https://leetcode.com/problems/binary-search/",
    platform: "LeetCode",
    difficulty: "Easy",
    editorialNote: "Canonical O(log N) lookup template over sorted array checking mid against target.",
    patternSlugs: ["binary-search"],
    recommendedOrder: 1
  },
  {
    id: "q-22",
    slug: "search-a-2d-matrix",
    title: "Search a 2D Matrix",
    externalUrl: "https://leetcode.com/problems/search-a-2d-matrix/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Map flat index [0..M*N - 1] to matrix coordinates (row = mid / cols, col = mid % cols).",
    patternSlugs: ["binary-search"],
    recommendedOrder: 2
  },
  {
    id: "q-23",
    slug: "koko-eating-bananas",
    title: "Koko Eating Bananas",
    externalUrl: "https://leetcode.com/problems/koko-eating-bananas/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Binary search on answer speed range [1..max(piles)] verifying feasibility predicate in O(N log M).",
    patternSlugs: ["binary-search"],
    recommendedOrder: 3
  },
  {
    id: "q-24",
    slug: "search-in-rotated-sorted-array",
    title: "Search in Rotated Sorted Array",
    externalUrl: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Determine which half is uniformly sorted (left to mid vs mid to right) to decide which partition contains target.",
    patternSlugs: ["binary-search"],
    recommendedOrder: 4
  },
  {
    id: "q-25",
    slug: "find-minimum-in-rotated-sorted-array",
    title: "Find Minimum in Rotated Sorted Array",
    externalUrl: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Compare nums[mid] with nums[right] to determine whether inflection point is in left or right half.",
    patternSlugs: ["binary-search"],
    recommendedOrder: 5
  },

  // Linked Lists
  {
    id: "q-26",
    slug: "reverse-linked-list",
    title: "Reverse Linked List",
    externalUrl: "https://leetcode.com/problems/reverse-linked-list/",
    platform: "LeetCode",
    difficulty: "Easy",
    editorialNote: "Standard iterative 3-pointer swap (prev, curr, nextTemp) in O(N) time and O(1) space.",
    patternSlugs: ["linked-lists"],
    recommendedOrder: 1
  },
  {
    id: "q-27",
    slug: "merge-two-sorted-lists",
    title: "Merge Two Sorted Lists",
    externalUrl: "https://leetcode.com/problems/merge-two-sorted-lists/",
    platform: "LeetCode",
    difficulty: "Easy",
    editorialNote: "Create a dummy head node and iteratively attach the smaller node from either list.",
    patternSlugs: ["linked-lists"],
    recommendedOrder: 2
  },
  {
    id: "q-28",
    slug: "reorder-list",
    title: "Reorder List",
    externalUrl: "https://leetcode.com/problems/reorder-list/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Find middle using fast/slow pointers, reverse the second half, then interleave nodes alternate-style.",
    patternSlugs: ["linked-lists", "fast-and-slow-pointers"],
    recommendedOrder: 3
  },
  {
    id: "q-29",
    slug: "remove-nth-node-from-end-of-list",
    title: "Remove Nth Node From End of List",
    externalUrl: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Advance fast pointer by N nodes, then step slow and fast concurrently until fast reaches tail.",
    patternSlugs: ["linked-lists", "two-pointers"],
    recommendedOrder: 4
  },
  {
    id: "q-30",
    slug: "merge-k-sorted-lists",
    title: "Merge k Sorted Lists",
    externalUrl: "https://leetcode.com/problems/merge-k-sorted-lists/",
    platform: "LeetCode",
    difficulty: "Hard",
    editorialNote: "Repeatedly merge pairs of lists divide-and-conquer style or insert active heads into a Min-Heap.",
    patternSlugs: ["linked-lists", "heaps-and-priority-queues"],
    recommendedOrder: 5
  },

  // Stacks and Queues
  {
    id: "q-31",
    slug: "valid-parentheses",
    title: "Valid Parentheses",
    externalUrl: "https://leetcode.com/problems/valid-parentheses/",
    platform: "LeetCode",
    difficulty: "Easy",
    editorialNote: "Push expected closing brackets onto stack and pop for matching validation in O(N).",
    patternSlugs: ["stacks-and-queues"],
    recommendedOrder: 1
  },
  {
    id: "q-32",
    slug: "min-stack",
    title: "Min Stack",
    externalUrl: "https://leetcode.com/problems/min-stack/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Store pairs [val, currentMin] or maintain a parallel minStack to retrieve minimum in O(1).",
    patternSlugs: ["stacks-and-queues"],
    recommendedOrder: 2
  },
  {
    id: "q-33",
    slug: "daily-temperatures",
    title: "Daily Temperatures",
    externalUrl: "https://leetcode.com/problems/daily-temperatures/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Monotonic decreasing stack storing indices. Pop and compute distance when a warmer temperature arrives.",
    patternSlugs: ["stacks-and-queues"],
    recommendedOrder: 3
  },
  {
    id: "q-34",
    slug: "evaluate-reverse-polish-notation",
    title: "Evaluate Reverse Polish Notation",
    externalUrl: "https://leetcode.com/problems/evaluate-reverse-polish-notation/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Operands pushed to stack; operators pop top two numbers and push calculated result back.",
    patternSlugs: ["stacks-and-queues"],
    recommendedOrder: 4
  },
  {
    id: "q-35",
    slug: "largest-rectangle-in-histogram",
    title: "Largest Rectangle in Histogram",
    externalUrl: "https://leetcode.com/problems/largest-rectangle-in-histogram/",
    platform: "LeetCode",
    difficulty: "Hard",
    editorialNote: "Monotonic increasing stack. When height drops, pop and compute maximum rectangle area bounded by popped height.",
    patternSlugs: ["stacks-and-queues"],
    recommendedOrder: 5
  },

  // Intervals
  {
    id: "q-36",
    slug: "merge-intervals",
    title: "Merge Intervals",
    externalUrl: "https://leetcode.com/problems/merge-intervals/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Sort intervals by start time. Merge overlapping intervals where current start is <= previous end.",
    patternSlugs: ["intervals"],
    recommendedOrder: 1
  },
  {
    id: "q-37",
    slug: "insert-interval",
    title: "Insert Interval",
    externalUrl: "https://leetcode.com/problems/insert-interval/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Insert into sorted list in 3 phases: non-overlapping left intervals, merged overlapping span, and remaining right intervals.",
    patternSlugs: ["intervals"],
    recommendedOrder: 2
  },
  {
    id: "q-38",
    slug: "non-overlapping-intervals",
    title: "Non-overlapping Intervals",
    externalUrl: "https://leetcode.com/problems/non-overlapping-intervals/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Greedy scheduling: sort by end time and count how many intervals can fit without collision.",
    patternSlugs: ["intervals", "greedy-algorithms"],
    recommendedOrder: 3
  },
  {
    id: "q-39",
    slug: "meeting-rooms-ii",
    title: "Meeting Rooms II",
    externalUrl: "https://leetcode.com/problems/meeting-rooms-ii/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Chronological sweep line with +1 for start times and -1 for end times, tracking peak concurrent meetings.",
    patternSlugs: ["intervals", "heaps-and-priority-queues"],
    recommendedOrder: 4
  },

  // Trees and BST
  {
    id: "q-40",
    slug: "invert-binary-tree",
    title: "Invert Binary Tree",
    externalUrl: "https://leetcode.com/problems/invert-binary-tree/",
    platform: "LeetCode",
    difficulty: "Easy",
    editorialNote: "Recursively swap left and right subtrees at each node in post-order or pre-order DFS.",
    patternSlugs: ["trees-and-bst"],
    recommendedOrder: 1
  },
  {
    id: "q-41",
    slug: "maximum-depth-of-binary-tree",
    title: "Maximum Depth of Binary Tree",
    externalUrl: "https://leetcode.com/problems/maximum-depth-of-binary-tree/",
    platform: "LeetCode",
    difficulty: "Easy",
    editorialNote: "1 + max(dfs(node.left), dfs(node.right)) with null base case returning 0.",
    patternSlugs: ["trees-and-bst"],
    recommendedOrder: 2
  },
  {
    id: "q-42",
    slug: "validate-binary-search-tree",
    title: "Validate Binary Search Tree",
    externalUrl: "https://leetcode.com/problems/validate-binary-search-tree/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Recursively enforce lower and upper bound ranges: validate(node, minBound, maxBound).",
    patternSlugs: ["trees-and-bst"],
    recommendedOrder: 3
  },
  {
    id: "q-43",
    slug: "lowest-common-ancestor-of-a-binary-search-tree",
    title: "Lowest Common Ancestor of a Binary Search Tree",
    externalUrl: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Leverage BST property: if both values are greater, branch right; if both smaller, branch left; otherwise current node is LCA.",
    patternSlugs: ["trees-and-bst"],
    recommendedOrder: 4
  },
  {
    id: "q-44",
    slug: "binary-tree-level-order-traversal",
    title: "Binary Tree Level Order Traversal",
    externalUrl: "https://leetcode.com/problems/binary-tree-level-order-traversal/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "BFS queue traversal capturing queue.length at the start of each level iteration.",
    patternSlugs: ["trees-and-bst", "stacks-and-queues"],
    recommendedOrder: 5
  },

  // Graphs and Traversal
  {
    id: "q-45",
    slug: "number-of-islands",
    title: "Number of Islands",
    externalUrl: "https://leetcode.com/problems/number-of-islands/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Iterate grid and trigger DFS/BFS sink to mark connected land cells '0' upon encountering '1'.",
    patternSlugs: ["graphs-and-traversal"],
    recommendedOrder: 1
  },
  {
    id: "q-46",
    slug: "clone-graph",
    title: "Clone Graph",
    externalUrl: "https://leetcode.com/problems/clone-graph/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "DFS/BFS with a HashMap mapping original nodes to cloned nodes to avoid cycles.",
    patternSlugs: ["graphs-and-traversal"],
    recommendedOrder: 2
  },
  {
    id: "q-47",
    slug: "pacific-atlantic-water-flow",
    title: "Pacific Atlantic Water Flow",
    externalUrl: "https://leetcode.com/problems/pacific-atlantic-water-flow/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Reverse BFS/DFS starting from ocean boundaries climbing uphill; intersection of visited sets is the solution.",
    patternSlugs: ["graphs-and-traversal"],
    recommendedOrder: 3
  },
  {
    id: "q-48",
    slug: "course-schedule",
    title: "Course Schedule",
    externalUrl: "https://leetcode.com/problems/course-schedule/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Detect cycles in directed graph using Kahn's in-degree queue or 3-state DFS coloring.",
    patternSlugs: ["graphs-and-traversal", "topological-sorting"],
    recommendedOrder: 4
  },

  // Dynamic Programming
  {
    id: "q-49",
    slug: "climbing-stairs",
    title: "Climbing Stairs",
    externalUrl: "https://leetcode.com/problems/climbing-stairs/",
    platform: "LeetCode",
    difficulty: "Easy",
    editorialNote: "Fibonacci transition dp[i] = dp[i-1] + dp[i-2] solved with 2 rolling variables in O(1) space.",
    patternSlugs: ["dynamic-programming"],
    recommendedOrder: 1
  },
  {
    id: "q-50",
    slug: "coin-change",
    title: "Coin Change",
    externalUrl: "https://leetcode.com/problems/coin-change/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Unbounded knapsack style: dp[a] = min(dp[a], 1 + dp[a - c]) initialized with infinity.",
    patternSlugs: ["dynamic-programming"],
    recommendedOrder: 2
  },
  {
    id: "q-51",
    slug: "longest-increasing-subsequence",
    title: "Longest Increasing Subsequence",
    externalUrl: "https://leetcode.com/problems/longest-increasing-subsequence/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "O(N^2) dynamic programming or O(N log N) patience sorting with binary search.",
    patternSlugs: ["dynamic-programming", "binary-search"],
    recommendedOrder: 3
  },
  {
    id: "q-52",
    slug: "word-break",
    title: "Word Break",
    externalUrl: "https://leetcode.com/problems/word-break/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "1D boolean table where dp[i] is true if any prefix dp[j] is true and wordDict contains substring s[j..i].",
    patternSlugs: ["dynamic-programming"],
    recommendedOrder: 4
  },

  // Backtracking
  {
    id: "q-53",
    slug: "subsets",
    title: "Subsets",
    externalUrl: "https://leetcode.com/problems/subsets/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Generate power set recursively: at each index, decide whether to include or exclude the current element.",
    patternSlugs: ["backtracking"],
    recommendedOrder: 1
  },
  {
    id: "q-54",
    slug: "combination-sum",
    title: "Combination Sum",
    externalUrl: "https://leetcode.com/problems/combination-sum/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Elements may be used repeatedly: branch on including candidate (stay on same index) vs skipping to next.",
    patternSlugs: ["backtracking"],
    recommendedOrder: 2
  },
  {
    id: "q-55",
    slug: "permutations",
    title: "Permutations",
    externalUrl: "https://leetcode.com/problems/permutations/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Backtrack using a boolean visited array or in-place swapping to build length-N permutations in O(N!).",
    patternSlugs: ["backtracking"],
    recommendedOrder: 3
  },
  {
    id: "q-56",
    slug: "word-search",
    title: "Word Search",
    externalUrl: "https://leetcode.com/problems/word-search/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "2D matrix DFS backtracking: temporarily mask visited grid cell '#' and unmask upon return.",
    patternSlugs: ["backtracking", "graphs-and-traversal"],
    recommendedOrder: 4
  },

  // Tries
  {
    id: "q-57",
    slug: "implement-trie-prefix-tree",
    title: "Implement Trie (Prefix Tree)",
    externalUrl: "https://leetcode.com/problems/implement-trie-prefix-tree/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Implement insert, search, and startsWith using linked TrieNode objects with character children dictionaries.",
    patternSlugs: ["tries"],
    recommendedOrder: 1
  },
  {
    id: "q-58",
    slug: "design-add-and-search-words-data-structure",
    title: "Design Add and Search Words Data Structure",
    externalUrl: "https://leetcode.com/problems/design-add-and-search-words-data-structure/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Wildcard '.' triggers recursive DFS across all valid child branches in the Trie.",
    patternSlugs: ["tries", "backtracking"],
    recommendedOrder: 2
  },

  // Heaps
  {
    id: "q-59",
    slug: "kth-largest-element-in-an-array",
    title: "Kth Largest Element in an Array",
    externalUrl: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Maintain Min-Heap of size K. After all elements processed, heap root contains Kth largest element in O(N log K).",
    patternSlugs: ["heaps-and-priority-queues"],
    recommendedOrder: 1
  },
  {
    id: "q-60",
    slug: "find-median-from-data-stream",
    title: "Find Median from Data Stream",
    externalUrl: "https://leetcode.com/problems/find-median-from-data-stream/",
    platform: "LeetCode",
    difficulty: "Hard",
    editorialNote: "Balance two heaps: Max-Heap for lower numbers and Min-Heap for higher numbers, maintaining size difference <= 1.",
    patternSlugs: ["heaps-and-priority-queues"],
    recommendedOrder: 2
  },

  // Greedy
  {
    id: "q-61",
    slug: "jump-game",
    title: "Jump Game",
    externalUrl: "https://leetcode.com/problems/jump-game/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Greedily track maximum reachable index seen so far in linear O(N) scan.",
    patternSlugs: ["greedy-algorithms"],
    recommendedOrder: 1
  },
  {
    id: "q-62",
    slug: "gas-station",
    title: "Gas Station",
    externalUrl: "https://leetcode.com/problems/gas-station/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "If total gas >= total cost, solution exists. If current tank drops below 0, reset candidate starting station to i + 1.",
    patternSlugs: ["greedy-algorithms"],
    recommendedOrder: 2
  },

  // Bit Manipulation
  {
    id: "q-63",
    slug: "single-number",
    title: "Single Number",
    externalUrl: "https://leetcode.com/problems/single-number/",
    platform: "LeetCode",
    difficulty: "Easy",
    editorialNote: "XOR all elements together; matching pairs cancel to 0 (a ^ a = 0), leaving the unique element.",
    patternSlugs: ["bit-manipulation"],
    recommendedOrder: 1
  },
  {
    id: "q-64",
    slug: "number-of-1-bits",
    title: "Number of 1 Bits",
    externalUrl: "https://leetcode.com/problems/number-of-1-bits/",
    platform: "LeetCode",
    difficulty: "Easy",
    editorialNote: "Brian Kernighan’s algorithm: n = n & (n - 1) clears lowest set bit in each iteration until n is 0.",
    patternSlugs: ["bit-manipulation"],
    recommendedOrder: 2
  },
  {
    id: "q-65",
    slug: "counting-bits",
    title: "Counting Bits",
    externalUrl: "https://leetcode.com/problems/counting-bits/",
    platform: "LeetCode",
    difficulty: "Easy",
    editorialNote: "DP bit transition: dp[i] = dp[i >> 1] + (i & 1) calculates set bit counts for [0..n] in linear O(N).",
    patternSlugs: ["bit-manipulation", "dynamic-programming"],
    recommendedOrder: 3
  },

  // Union-Find
  {
    id: "q-66",
    slug: "number-of-provinces",
    title: "Number of Provinces",
    externalUrl: "https://leetcode.com/problems/number-of-provinces/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Disjoint set union by rank: start with N provinces and decrement count on each successful union.",
    patternSlugs: ["union-find", "graphs-and-traversal"],
    recommendedOrder: 1
  },
  {
    id: "q-67",
    slug: "redundant-connection",
    title: "Redundant Connection",
    externalUrl: "https://leetcode.com/problems/redundant-connection/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Iterate edges and attempt union: if find(u) == find(v), edge connects an already connected component and creates a cycle.",
    patternSlugs: ["union-find"],
    recommendedOrder: 2
  },

  // Topological Sorting
  {
    id: "q-68",
    slug: "course-schedule-ii",
    title: "Course Schedule II",
    externalUrl: "https://leetcode.com/problems/course-schedule-ii/",
    platform: "LeetCode",
    difficulty: "Medium",
    editorialNote: "Kahn's algorithm: enqueue nodes with in-degree 0; track processed order; return empty array if cycle detected.",
    patternSlugs: ["topological-sorting", "graphs-and-traversal"],
    recommendedOrder: 1
  },
  {
    id: "q-69",
    slug: "alien-dictionary",
    title: "Alien Dictionary",
    externalUrl: "https://leetcode.com/problems/alien-dictionary/",
    platform: "LeetCode",
    difficulty: "Hard",
    editorialNote: "Compare adjacent words to extract character ordering edges, build DAG, and run topological sort.",
    patternSlugs: ["topological-sorting"],
    recommendedOrder: 2
  }
];
