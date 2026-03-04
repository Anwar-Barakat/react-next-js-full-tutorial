# Algorithms & Data Structures for Coding Interviews

A comprehensive guide covering Big O notation, data structures, algorithms, and common interview problems with TypeScript solutions.

---

## Table of Contents

1. [What is an Algorithm?](#1-what-is-an-algorithm)
2. [Big O Notation and Time Complexity](#2-big-o-notation-and-time-complexity)
3. [Space Complexity](#3-space-complexity)
4. [Arrays and Strings](#4-arrays-and-strings)
5. [Hash Maps and Sets](#5-hash-maps-and-sets)
6. [Stacks](#6-stacks)
7. [Queues](#7-queues)
8. [Linked Lists](#8-linked-lists)
9. [Trees and Binary Search Trees](#9-trees-and-binary-search-trees)
10. [Graphs](#10-graphs)
11. [Two Pointers Technique](#11-two-pointers-technique)
12. [Sliding Window](#12-sliding-window)
13. [Binary Search](#13-binary-search)
14. [Sorting Algorithms](#14-sorting-algorithms)
15. [Recursion](#15-recursion)
16. [Dynamic Programming](#16-dynamic-programming)
17. [Breadth-First Search (BFS)](#17-breadth-first-search-bfs)
18. [Depth-First Search (DFS)](#18-depth-first-search-dfs)
19. [Common Interview Problems with Solutions](#19-common-interview-problems-with-solutions)
20. [Tips for Solving Algorithm Problems](#20-tips-for-solving-algorithm-problems)

---

## Foundations

---

## 1. What is an Algorithm?

- An **algorithm** is a step-by-step set of instructions to solve a specific problem.
- Think of it like a **recipe** — it takes inputs (ingredients), follows steps, and produces an output (a dish).
- Every piece of code you write is an algorithm — some are just more efficient than others.

**Why algorithms matter in interviews:**
- Companies test algorithms to see how you **think** and **solve problems**.
- They reveal your ability to write **efficient** code, not just code that works.
- Two solutions can produce the same result, but one might be 1000x faster.

> **Simple analogy:** Finding a word in a dictionary.
> - Bad algorithm: Read every word from page 1 until you find it (slow).
> - Good algorithm: Open to the middle, decide if the word is before or after, repeat (fast — this is binary search).

---

## 2. Big O Notation and Time Complexity

- **Big O** describes how the performance of an algorithm changes as the input size grows.
- It answers: "If I give this function 10 items vs 10 million items, how much slower will it get?"
- We always measure the **worst case** scenario.
- We **drop constants** and **lower-order terms** — O(2n + 5) simplifies to O(n).

**Common Big O complexities (from fastest to slowest):**

- **O(1) — Constant** — Time doesn't change with input size. Example: accessing an array element by index.
- **O(log n) — Logarithmic** — Halves the problem each step. Example: binary search. Very fast even for large inputs.
- **O(n) — Linear** — Time grows directly with input. Example: looping through an array once.
- **O(n log n) — Linearithmic** — Common in efficient sorting algorithms. Example: merge sort, quick sort (average).
- **O(n²) — Quadratic** — Nested loops. Example: bubble sort, comparing every pair. Gets slow fast.
- **O(2ⁿ) — Exponential** — Doubles with each additional input. Example: recursive fibonacci without memoization. Very slow.
- **O(n!) — Factorial** — Grows absurdly fast. Example: generating all permutations. Almost never acceptable.

**Growth comparison with n = 1000:**
- O(1) → 1 operation
- O(log n) → ~10 operations
- O(n) → 1,000 operations
- O(n log n) → ~10,000 operations
- O(n²) → 1,000,000 operations
- O(2ⁿ) → more than atoms in the universe

**How to calculate Big O from code:**

```typescript
// O(1) — constant
function getFirst(arr: number[]): number {
  return arr[0]; // one operation, always
}

// O(n) — linear
function findMax(arr: number[]): number {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) { // loops n times
    if (arr[i] > max) max = arr[i];
  }
  return max;
}

// O(n²) — quadratic
function hasDuplicate(arr: number[]): boolean {
  for (let i = 0; i < arr.length; i++) {       // n times
    for (let j = i + 1; j < arr.length; j++) {  // n times
      if (arr[i] === arr[j]) return true;
    }
  }
  return false;
}
```

**Rules for calculating Big O:**
- **Drop constants** — O(3n) → O(n)
- **Drop non-dominant terms** — O(n² + n) → O(n²)
- **Different inputs = different variables** — two arrays → O(n * m), not O(n²)
- **Sequential steps add** — O(n) + O(m) = O(n + m)
- **Nested steps multiply** — O(n) inside O(m) = O(n * m)

---

## 3. Space Complexity

- **Space complexity** measures how much **extra memory** your algorithm uses as input grows.
- We care about **auxiliary space** — the extra memory beyond the input itself.
- There's often a **trade-off** between time and space — you can make things faster by using more memory.

**Examples:**

```typescript
// O(1) space — uses fixed extra memory
function sum(arr: number[]): number {
  let total = 0; // just one variable
  for (const num of arr) {
    total += num;
  }
  return total;
}

// O(n) space — creates a new array of size n
function double(arr: number[]): number[] {
  const result: number[] = []; // grows with input
  for (const num of arr) {
    result.push(num * 2);
  }
  return result;
}

// O(n) space — recursive call stack grows with input
function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1); // each call adds to the stack
}
```

**Time-space trade-off example:**

```typescript
// Approach 1: O(n²) time, O(1) space — check every pair
function hasDuplicateSlow(arr: number[]): boolean {
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) return true;
    }
  }
  return false;
}

// Approach 2: O(n) time, O(n) space — use a Set for instant lookup
function hasDuplicateFast(arr: number[]): boolean {
  const seen = new Set<number>();
  for (const num of arr) {
    if (seen.has(num)) return true;
    seen.add(num);
  }
  return false;
}
```

> **In short:** Approach 2 uses more memory (a Set) but is much faster. In interviews, faster is usually preferred unless the interviewer specifically asks about space constraints.

---

## Data Structures

---

## 4. Arrays and Strings

- An **array** is an ordered collection of elements stored in contiguous memory.
- A **string** is essentially an array of characters.
- Arrays are the most fundamental data structure — most interview problems involve them.

**Common operations and their time complexities:**

- **Access by index** — O(1) — `arr[5]` is instant
- **Search (unsorted)** — O(n) — must check each element
- **Search (sorted)** — O(log n) — can use binary search
- **Insert at end** — O(1) amortized — `arr.push()`
- **Insert at beginning** — O(n) — `arr.unshift()` shifts everything
- **Delete at end** — O(1) — `arr.pop()`
- **Delete at beginning** — O(n) — `arr.shift()` shifts everything

**Common array interview patterns:**

```typescript
// Reverse a string
function reverseString(s: string): string {
  return s.split('').reverse().join('');
}

// Reverse in-place (array of characters)
function reverseInPlace(chars: string[]): void {
  let left = 0;
  let right = chars.length - 1;
  while (left < right) {
    [chars[left], chars[right]] = [chars[right], chars[left]];
    left++;
    right--;
  }
}

// Check if a string is a palindrome
function isPalindrome(s: string): boolean {
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0;
  let right = cleaned.length - 1;
  while (left < right) {
    if (cleaned[left] !== cleaned[right]) return false;
    left++;
    right--;
  }
  return true;
}

// Remove duplicates from sorted array (in-place)
function removeDuplicates(nums: number[]): number {
  if (nums.length === 0) return 0;
  let slow = 0;
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }
  return slow + 1;
}
```

---

## 5. Hash Maps and Sets

- A **hash map** (also called hash table, dictionary) stores **key-value pairs** with O(1) average lookup.
- A **hash set** stores **unique values** with O(1) average lookup.
- They work by converting the key into an array index using a **hash function**.

**How hash maps work (simplified):**
1. You give it a key (e.g., `"name"`).
2. A hash function converts the key to a number (e.g., `4`).
3. The value is stored at index `4` in an internal array.
4. To retrieve, it hashes the key again and goes directly to that index.

**Collisions** happen when two keys hash to the same index — resolved by chaining (linked list at that index) or open addressing.

**TypeScript: Map vs Set vs Object:**

```typescript
// Map — key-value pairs, keys can be any type
const map = new Map<string, number>();
map.set('apple', 3);
map.set('banana', 5);
console.log(map.get('apple'));  // 3
console.log(map.has('cherry')); // false
map.delete('banana');
console.log(map.size);          // 1

// Set — unique values only
const set = new Set<number>();
set.add(1);
set.add(2);
set.add(1); // ignored — already exists
console.log(set.has(1)); // true
console.log(set.size);   // 2

// Object — similar to Map but keys are always strings
const obj: Record<string, number> = {};
obj['apple'] = 3;
console.log(obj['apple']); // 3
```

**When to use Map vs Object:**
- Use **Map** when keys are not strings, when you need `.size`, or when you iterate frequently.
- Use **Object** for simple string-keyed lookups or JSON-compatible data.

**Frequency counter pattern** — one of the most common interview patterns:

```typescript
// Count character frequency
function charFrequency(s: string): Map<string, number> {
  const freq = new Map<string, number>();
  for (const char of s) {
    freq.set(char, (freq.get(char) || 0) + 1);
  }
  return freq;
}

// Check if two strings are anagrams
function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;
  const freq = new Map<string, number>();
  for (const char of s) {
    freq.set(char, (freq.get(char) || 0) + 1);
  }
  for (const char of t) {
    const count = freq.get(char);
    if (!count) return false;
    freq.set(char, count - 1);
  }
  return true;
}
```

**In short:** If you need fast lookup (O(1)), think hash map or set. The frequency counter pattern solves many interview problems.

---

## 6. Stacks

- A **stack** is a Last-In, First-Out (LIFO) data structure.
- Think of a **stack of plates** — you add to the top and remove from the top.
- Main operations: `push` (add to top), `pop` (remove from top), `peek` (look at top without removing).
- All operations are **O(1)**.

**TypeScript implementation:**

```typescript
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}
```

**Classic interview problem — Valid Parentheses:**

```typescript
function isValid(s: string): boolean {
  const stack: string[] = [];
  const pairs: Record<string, string> = {
    ')': '(',
    ']': '[',
    '}': '{',
  };

  for (const char of s) {
    if (char === '(' || char === '[' || char === '{') {
      stack.push(char);
    } else {
      if (stack.length === 0 || stack[stack.length - 1] !== pairs[char]) {
        return false;
      }
      stack.pop();
    }
  }

  return stack.length === 0;
}

// isValid("()[]{}") → true
// isValid("(]")     → false
// isValid("([)]")   → false
// isValid("{[]}")    → true
```

**When stacks are used:**
- Undo/redo functionality
- Browser back/forward navigation
- Expression evaluation (postfix notation)
- Call stack in recursion
- DFS traversal (iterative version)

---

## 7. Queues

- A **queue** is a First-In, First-Out (FIFO) data structure.
- Think of a **line at a store** — first person in line is the first one served.
- Main operations: `enqueue` (add to back), `dequeue` (remove from front), `peek` (look at front).

**TypeScript implementation:**

```typescript
class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift(); // O(n) — for O(1), use linked list
  }

  peek(): T | undefined {
    return this.items[0];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}
```

> **Note:** `Array.shift()` is O(n) because it re-indexes all elements. For a true O(1) queue, use a linked list or a circular buffer. In interviews, using an array is usually acceptable.

**Priority Queue concept:**
- A special queue where each element has a **priority**.
- Elements with higher priority are dequeued first, regardless of insertion order.
- Used in: Dijkstra's algorithm, task scheduling, event systems.
- Typically implemented with a **heap** (min-heap or max-heap).

**When queues are used:**
- BFS traversal
- Task scheduling / job queues
- Message queues (RabbitMQ, SQS)
- Print queue / request handling
- Rate limiting

---

## 8. Linked Lists

- A **linked list** is a sequence of **nodes**, where each node holds data and a pointer to the next node.
- Unlike arrays, elements are **not stored contiguously** in memory — they can be scattered anywhere.

**Types:**
- **Singly Linked List** — each node points to the next node. Last node points to `null`.
- **Doubly Linked List** — each node points to both the next and previous nodes.

**Node structure:**

```typescript
class ListNode {
  val: number;
  next: ListNode | null;
  constructor(val: number, next: ListNode | null = null) {
    this.val = val;
    this.next = next;
  }
}
```

**Operations:**

```typescript
// Insert at head — O(1)
function insertAtHead(head: ListNode | null, val: number): ListNode {
  const newNode = new ListNode(val);
  newNode.next = head;
  return newNode;
}

// Insert at tail — O(n) for singly linked list
function insertAtTail(head: ListNode | null, val: number): ListNode {
  const newNode = new ListNode(val);
  if (!head) return newNode;
  let current = head;
  while (current.next) {
    current = current.next;
  }
  current.next = newNode;
  return head;
}

// Delete a node by value — O(n)
function deleteNode(head: ListNode | null, val: number): ListNode | null {
  if (!head) return null;
  if (head.val === val) return head.next;
  let current = head;
  while (current.next) {
    if (current.next.val === val) {
      current.next = current.next.next;
      return head;
    }
    current = current.next;
  }
  return head;
}

// Reverse a linked list — O(n) time, O(1) space
function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let current = head;
  while (current) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  return prev;
}
```

**Linked List vs Array:**
- **Access by index** — Array: O(1), Linked List: O(n)
- **Insert at beginning** — Array: O(n), Linked List: O(1)
- **Insert at end** — Array: O(1) amortized, Linked List: O(n) singly / O(1) doubly
- **Delete from beginning** — Array: O(n), Linked List: O(1)
- **Memory** — Array: contiguous block, Linked List: scattered with pointer overhead
- **Cache performance** — Array: excellent (contiguous), Linked List: poor (scattered)

> **When to use linked lists:** When you frequently insert/delete at the beginning, need a dynamic size without resizing, or implement stacks/queues.

---

## 9. Trees and Binary Search Trees

- A **tree** is a hierarchical data structure with a root node and child nodes forming a parent-child relationship.
- A **binary tree** has at most 2 children per node (left and right).
- A **binary search tree (BST)** adds a rule: left child < parent < right child.

**Key terminology:**
- **Root** — the topmost node
- **Leaf** — a node with no children
- **Height** — the longest path from root to a leaf
- **Depth** — distance from the root to a specific node
- **Balanced tree** — left and right subtrees differ in height by at most 1

**Node structure:**

```typescript
class TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
  constructor(val: number, left: TreeNode | null = null, right: TreeNode | null = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}
```

**Tree traversals:**

```typescript
// In-order (Left → Root → Right) — gives sorted order for BST
function inOrder(node: TreeNode | null): number[] {
  if (!node) return [];
  return [...inOrder(node.left), node.val, ...inOrder(node.right)];
}

// Pre-order (Root → Left → Right) — useful for copying trees
function preOrder(node: TreeNode | null): number[] {
  if (!node) return [];
  return [node.val, ...preOrder(node.left), ...preOrder(node.right)];
}

// Post-order (Left → Right → Root) — useful for deleting trees
function postOrder(node: TreeNode | null): number[] {
  if (!node) return [];
  return [...postOrder(node.left), ...postOrder(node.right), node.val];
}

// Level-order (BFS) — level by level
function levelOrder(root: TreeNode | null): number[][] {
  if (!root) return [];
  const result: number[][] = [];
  const queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const levelSize = queue.length;
    const level: number[] = [];
    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift()!;
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }

  return result;
}
```

**Classic problem — Maximum Depth of Binary Tree:**

```typescript
function maxDepth(root: TreeNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
```

**BST operations:**

- **Search** — O(log n) average, O(n) worst (skewed tree)
- **Insert** — O(log n) average
- **Delete** — O(log n) average

```typescript
// Search in BST
function searchBST(root: TreeNode | null, target: number): TreeNode | null {
  if (!root) return null;
  if (target === root.val) return root;
  if (target < root.val) return searchBST(root.left, target);
  return searchBST(root.right, target);
}

// Validate BST
function isValidBST(
  node: TreeNode | null,
  min: number = -Infinity,
  max: number = Infinity
): boolean {
  if (!node) return true;
  if (node.val <= min || node.val >= max) return false;
  return isValidBST(node.left, min, node.val) && isValidBST(node.right, node.val, max);
}
```

---

## 10. Graphs

- A **graph** is a collection of **nodes (vertices)** connected by **edges**.
- Unlike trees, graphs can have **cycles** and nodes can have **multiple parents**.

**Types:**
- **Directed** — edges have a direction (A → B doesn't mean B → A). Example: Twitter follow.
- **Undirected** — edges go both ways (A — B means both can reach each other). Example: Facebook friendship.
- **Weighted** — edges have a cost/distance. Example: Google Maps distances.
- **Unweighted** — all edges are equal.

**How to represent a graph:**

```typescript
// Adjacency List — most common, memory efficient
// Each node stores a list of its neighbors
const adjList: Map<string, string[]> = new Map();
adjList.set('A', ['B', 'C']);
adjList.set('B', ['A', 'D']);
adjList.set('C', ['A']);
adjList.set('D', ['B']);

// Adjacency Matrix — good for dense graphs
// matrix[i][j] = 1 means there's an edge from i to j
const adjMatrix = [
  //    A  B  C  D
  /* A */ [0, 1, 1, 0],
  /* B */ [1, 0, 0, 1],
  /* C */ [1, 0, 0, 0],
  /* D */ [0, 1, 0, 0],
];
```

**Adjacency List vs Matrix:**
- **Space** — List: O(V + E), Matrix: O(V²)
- **Check if edge exists** — List: O(degree), Matrix: O(1)
- **Find all neighbors** — List: O(degree), Matrix: O(V)
- **Best for** — List: sparse graphs, Matrix: dense graphs

> **In short:** Use adjacency list for most interview problems. Use adjacency matrix only when the graph is dense or you need O(1) edge lookups.

---

## Algorithms

---

## 11. Two Pointers Technique

- Uses **two pointers** (indices) that move through the data, usually from opposite ends or at different speeds.
- Works on **sorted arrays** or when you need to find pairs/triplets.
- Reduces O(n²) brute force to O(n).

**When to use:**
- Finding pairs with a target sum (sorted array)
- Removing duplicates in-place
- Reversing an array/string
- Container with most water, trapping rain water

**Example: Two Sum II (sorted input):**

```typescript
function twoSumSorted(numbers: number[], target: number): [number, number] {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) {
      return [left + 1, right + 1]; // 1-indexed
    } else if (sum < target) {
      left++;   // need a larger sum
    } else {
      right--;  // need a smaller sum
    }
  }

  return [-1, -1]; // not found
}
```

**Example: Container With Most Water:**

```typescript
function maxArea(height: number[]): number {
  let left = 0;
  let right = height.length - 1;
  let maxWater = 0;

  while (left < right) {
    const width = right - left;
    const h = Math.min(height[left], height[right]);
    maxWater = Math.max(maxWater, width * h);

    // Move the pointer with the shorter line
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }

  return maxWater;
}
```

---

## 12. Sliding Window

- Maintains a **window** (subarray/substring) that slides through the data.
- Instead of recalculating everything for each position, you **add the new element and remove the old one**.
- Reduces O(n²) or O(n*k) brute force to O(n).

**Two types:**
- **Fixed-size window** — window size `k` is given.
- **Variable-size window** — window grows/shrinks based on a condition.

**Fixed window — Maximum sum of subarray of size k:**

```typescript
function maxSubarraySum(arr: number[], k: number): number {
  if (arr.length < k) return -1;

  // Calculate sum of first window
  let windowSum = 0;
  for (let i = 0; i < k; i++) {
    windowSum += arr[i];
  }

  let maxSum = windowSum;

  // Slide the window: add new element, remove old element
  for (let i = k; i < arr.length; i++) {
    windowSum += arr[i] - arr[i - k];
    maxSum = Math.max(maxSum, windowSum);
  }

  return maxSum;
}
```

**Variable window — Longest substring without repeating characters:**

```typescript
function lengthOfLongestSubstring(s: string): number {
  const seen = new Map<string, number>(); // char → last index
  let maxLen = 0;
  let start = 0;

  for (let end = 0; end < s.length; end++) {
    const char = s[end];
    if (seen.has(char) && seen.get(char)! >= start) {
      start = seen.get(char)! + 1; // shrink window past the duplicate
    }
    seen.set(char, end);
    maxLen = Math.max(maxLen, end - start + 1);
  }

  return maxLen;
}

// "abcabcbb" → 3 ("abc")
// "bbbbb"    → 1 ("b")
// "pwwkew"   → 3 ("wke")
```

---

## 13. Binary Search

- A search algorithm that works on **sorted** data.
- Repeatedly divides the search space in half — O(log n).
- Much faster than linear search O(n) for large datasets.

**How it works:**
1. Look at the middle element.
2. If it's the target, done.
3. If target is smaller, search the left half.
4. If target is larger, search the right half.
5. Repeat until found or search space is empty.

**Basic implementation:**

```typescript
function binarySearch(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      return mid;  // found
    } else if (arr[mid] < target) {
      left = mid + 1;  // search right half
    } else {
      right = mid - 1; // search left half
    }
  }

  return -1; // not found
}
```

**Find first occurrence (when duplicates exist):**

```typescript
function findFirst(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;
  let result = -1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      result = mid;     // possible answer, but keep searching left
      right = mid - 1;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return result;
}
```

**Find last occurrence:**

```typescript
function findLast(arr: number[], target: number): number {
  let left = 0;
  let right = arr.length - 1;
  let result = -1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) {
      result = mid;    // possible answer, but keep searching right
      left = mid + 1;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  return result;
}
```

> **Key insight:** Binary search is not just for "find this number." It can solve any problem where the answer space is sorted and you can check if you should go left or right.

---

## 14. Sorting Algorithms

Sorting is a fundamental operation. Understanding how different algorithms work is a common interview topic.

**Bubble Sort — O(n²)**
- Repeatedly swaps adjacent elements if they're in the wrong order.
- Simple but slow. Good for teaching, bad for production.

```typescript
function bubbleSort(arr: number[]): number[] {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }
    if (!swapped) break; // already sorted
  }
  return arr;
}
```

**Merge Sort — O(n log n)**
- Divide and conquer: split the array in half, sort each half, merge them back.
- Consistent O(n log n) in all cases. Uses O(n) extra space.
- **Stable** — equal elements keep their original order.

```typescript
function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0;
  let j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i]);
      i++;
    } else {
      result.push(right[j]);
      j++;
    }
  }

  return [...result, ...left.slice(i), ...right.slice(j)];
}
```

**Quick Sort — O(n log n) average**
- Pick a pivot, partition the array: elements smaller go left, larger go right.
- Recursively sort both sides.
- O(n²) worst case (bad pivot), but O(n log n) average. In-place (O(log n) stack space).
- **Not stable** — equal elements may change order.

```typescript
function quickSort(arr: number[], low = 0, high = arr.length - 1): number[] {
  if (low < high) {
    const pivotIndex = partition(arr, low, high);
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
  return arr;
}

function partition(arr: number[], low: number, high: number): number {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}
```

**Sorting algorithm comparison:**
- **Bubble Sort** — Best: O(n), Avg: O(n²), Worst: O(n²), Space: O(1), Stable: Yes
- **Merge Sort** — Best: O(n log n), Avg: O(n log n), Worst: O(n log n), Space: O(n), Stable: Yes
- **Quick Sort** — Best: O(n log n), Avg: O(n log n), Worst: O(n²), Space: O(log n), Stable: No
- **JavaScript sort()** — Uses TimSort (hybrid merge + insertion sort), O(n log n), Stable: Yes

> **In short:** Use merge sort when stability matters, quick sort for average-case performance, and `Array.sort()` in practice.

---

## 15. Recursion

- **Recursion** is when a function calls itself to solve smaller instances of the same problem.
- Every recursive function needs two things:
  1. **Base case** — the condition that stops the recursion.
  2. **Recursive case** — the function calls itself with a smaller input.

**How the call stack works:**
- Each recursive call is added to the **call stack**.
- When the base case is reached, calls start returning (unwinding the stack).
- Too many calls without reaching base case → **stack overflow**.

```typescript
// Factorial: n! = n × (n-1) × ... × 1
function factorial(n: number): number {
  if (n <= 1) return 1;           // base case
  return n * factorial(n - 1);     // recursive case
}
// factorial(5) → 5 * factorial(4) → 5 * 4 * factorial(3) → ... → 120

// Fibonacci: fib(n) = fib(n-1) + fib(n-2)
function fibonacci(n: number): number {
  if (n <= 1) return n;           // base case
  return fibonacci(n - 1) + fibonacci(n - 2); // O(2^n) — very slow!
}
```

**Memoization — caching results to avoid redundant work:**

```typescript
function fibMemo(n: number, memo: Map<number, number> = new Map()): number {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n)!;

  const result = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  memo.set(n, result);
  return result;
}
// Now O(n) instead of O(2^n)
```

**When to use recursion:**
- Tree/graph traversal
- Divide and conquer (merge sort, quick sort)
- Backtracking problems (permutations, combinations)
- Problems with a naturally recursive structure

> **Tip:** Every recursive solution can be converted to an iterative one using a stack. Interviewers sometimes ask you to do this.

---

## 16. Dynamic Programming

- **Dynamic Programming (DP)** solves complex problems by breaking them into overlapping subproblems.
- It's recursion + memoization (or building up from the bottom).
- Two characteristics that suggest DP:
  1. **Overlapping subproblems** — the same subproblems are solved multiple times.
  2. **Optimal substructure** — optimal solution can be built from optimal solutions of subproblems.

**Two approaches:**
- **Top-down (Memoization)** — Start with the big problem, recurse down, cache results.
- **Bottom-up (Tabulation)** — Start with the smallest subproblems, build up to the answer.

**Example: Fibonacci**

```typescript
// Top-down (memoization)
function fibTopDown(n: number, memo: number[] = []): number {
  if (n <= 1) return n;
  if (memo[n] !== undefined) return memo[n];
  memo[n] = fibTopDown(n - 1, memo) + fibTopDown(n - 2, memo);
  return memo[n];
}

// Bottom-up (tabulation)
function fibBottomUp(n: number): number {
  if (n <= 1) return n;
  const dp = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i - 1] + dp[i - 2];
  }
  return dp[n];
}

// Space-optimized bottom-up
function fibOptimized(n: number): number {
  if (n <= 1) return n;
  let prev2 = 0;
  let prev1 = 1;
  for (let i = 2; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }
  return prev1;
}
```

**Classic DP: Climbing Stairs**

```typescript
// You can climb 1 or 2 steps. How many ways to reach step n?
function climbStairs(n: number): number {
  if (n <= 2) return n;
  let prev2 = 1; // ways to reach step 1
  let prev1 = 2; // ways to reach step 2

  for (let i = 3; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}
// climbStairs(5) → 8 (ways: [1,1,1,1,1], [1,1,1,2], [1,1,2,1], [1,2,1,1], [2,1,1,1], [1,2,2], [2,1,2], [2,2,1])
```

**Classic DP: Coin Change**

```typescript
// Given coins and an amount, find minimum coins needed
function coinChange(coins: number[], amount: number): number {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0; // 0 coins needed for amount 0

  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (coin <= i && dp[i - coin] + 1 < dp[i]) {
        dp[i] = dp[i - coin] + 1;
      }
    }
  }

  return dp[amount] === Infinity ? -1 : dp[amount];
}

// coinChange([1, 5, 10, 25], 30) → 2 (25 + 5)
// coinChange([2], 3) → -1 (impossible)
```

**How to approach DP problems:**
1. Can I identify overlapping subproblems?
2. Define the state — what changes between subproblems?
3. Write the recurrence relation — how does the current state relate to previous states?
4. Decide: top-down (easier to write) or bottom-up (often more efficient)?
5. Optimize space if possible.

---

## 17. Breadth-First Search (BFS)

- BFS explores nodes **level by level**, visiting all neighbors before moving deeper.
- Uses a **queue** (FIFO) to track which nodes to visit next.
- Guarantees the **shortest path** in an unweighted graph.
- Time: O(V + E), Space: O(V)

> **Analogy:** Like ripples spreading outward when you drop a stone in water — they expand evenly in all directions.

**BFS on a binary tree:**

```typescript
function bfs(root: TreeNode | null): number[] {
  if (!root) return [];
  const result: number[] = [];
  const queue: TreeNode[] = [root];

  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(node.val);
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }

  return result;
}
```

**BFS on a graph (with visited tracking):**

```typescript
function bfsGraph(graph: Map<string, string[]>, start: string): string[] {
  const visited = new Set<string>();
  const queue: string[] = [start];
  const result: string[] = [];

  visited.add(start);

  while (queue.length > 0) {
    const node = queue.shift()!;
    result.push(node);

    for (const neighbor of graph.get(node) || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return result;
}
```

**Shortest path in an unweighted graph:**

```typescript
function shortestPath(
  graph: Map<string, string[]>,
  start: string,
  end: string
): string[] | null {
  const visited = new Set<string>();
  const queue: [string, string[]][] = [[start, [start]]];

  visited.add(start);

  while (queue.length > 0) {
    const [node, path] = queue.shift()!;

    if (node === end) return path;

    for (const neighbor of graph.get(node) || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, [...path, neighbor]]);
      }
    }
  }

  return null; // no path found
}
```

**When to use BFS:**
- Finding shortest path in unweighted graphs
- Level-order tree traversal
- Finding all nodes within a distance
- Web crawlers, social network "people you may know"

---

## 18. Depth-First Search (DFS)

- DFS explores as **deep as possible** along a branch before backtracking.
- Uses a **stack** (or recursion, which uses the call stack).
- Does NOT guarantee shortest path (use BFS for that).
- Time: O(V + E), Space: O(V)

> **Analogy:** Like exploring a maze — you go as deep as you can, hit a dead end, backtrack, and try a different path.

**DFS on a binary tree (recursive):**

```typescript
function dfsTree(root: TreeNode | null): number[] {
  if (!root) return [];
  return [root.val, ...dfsTree(root.left), ...dfsTree(root.right)];
}
```

**DFS on a graph (recursive):**

```typescript
function dfsGraph(
  graph: Map<string, string[]>,
  start: string,
  visited = new Set<string>()
): string[] {
  visited.add(start);
  const result: string[] = [start];

  for (const neighbor of graph.get(start) || []) {
    if (!visited.has(neighbor)) {
      result.push(...dfsGraph(graph, neighbor, visited));
    }
  }

  return result;
}
```

**DFS on a graph (iterative with stack):**

```typescript
function dfsIterative(graph: Map<string, string[]>, start: string): string[] {
  const visited = new Set<string>();
  const stack: string[] = [start];
  const result: string[] = [];

  while (stack.length > 0) {
    const node = stack.pop()!;

    if (visited.has(node)) continue;
    visited.add(node);
    result.push(node);

    for (const neighbor of graph.get(node) || []) {
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
      }
    }
  }

  return result;
}
```

**Cycle detection in a directed graph:**

```typescript
function hasCycle(graph: Map<string, string[]>): boolean {
  const visited = new Set<string>();
  const inStack = new Set<string>(); // tracks current DFS path

  function dfs(node: string): boolean {
    visited.add(node);
    inStack.add(node);

    for (const neighbor of graph.get(node) || []) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) return true;
      } else if (inStack.has(neighbor)) {
        return true; // back edge found — cycle!
      }
    }

    inStack.delete(node); // backtrack
    return false;
  }

  for (const node of graph.keys()) {
    if (!visited.has(node)) {
      if (dfs(node)) return true;
    }
  }

  return false;
}
```

**When to use DFS:**
- Detecting cycles in graphs
- Path finding (all paths, not shortest)
- Topological sorting
- Solving puzzles (Sudoku, N-Queens)
- Tree traversals (in-order, pre-order, post-order)

**BFS vs DFS:**
- **Shortest path** — BFS: yes (unweighted), DFS: no
- **Memory** — BFS: O(width of graph), DFS: O(depth of graph)
- **Complete** — BFS: yes (finds solution if exists), DFS: yes (but may take longer)
- **Use case** — BFS: shortest path, level-order, DFS: cycle detection, topological sort, backtracking

---

## Practice

---

## 19. Common Interview Problems with Solutions

### Problem 1: Two Sum

**Problem:** Given an array of numbers and a target, return indices of two numbers that add up to the target.

```typescript
function twoSum(nums: number[], target: number): [number, number] {
  const map = new Map<number, number>(); // value → index

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    map.set(nums[i], i);
  }

  return [-1, -1];
}

// twoSum([2, 7, 11, 15], 9) → [0, 1] (because 2 + 7 = 9)
```

**Approach:** For each number, check if `target - number` exists in the map. Time: O(n), Space: O(n).

---

### Problem 2: Valid Anagram

**Problem:** Check if two strings are anagrams (same characters, different order).

```typescript
function isAnagram(s: string, t: string): boolean {
  if (s.length !== t.length) return false;

  const count = new Map<string, number>();
  for (const char of s) {
    count.set(char, (count.get(char) || 0) + 1);
  }
  for (const char of t) {
    const c = count.get(char);
    if (!c) return false;
    count.set(char, c - 1);
  }

  return true;
}

// isAnagram("anagram", "nagaram") → true
// isAnagram("rat", "car") → false
```

**Approach:** Count characters in first string, subtract for second. Time: O(n), Space: O(1) — at most 26 characters.

---

### Problem 3: Maximum Subarray (Kadane's Algorithm)

**Problem:** Find the contiguous subarray with the largest sum.

```typescript
function maxSubArray(nums: number[]): number {
  let currentSum = nums[0];
  let maxSum = nums[0];

  for (let i = 1; i < nums.length; i++) {
    // Either extend the current subarray or start fresh
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}

// maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]) → 6 (subarray [4, -1, 2, 1])
```

**Approach:** At each position, decide whether to extend the current subarray or start a new one. Time: O(n), Space: O(1).

---

### Problem 4: Merge Two Sorted Lists

**Problem:** Merge two sorted linked lists into one sorted list.

```typescript
function mergeTwoLists(
  l1: ListNode | null,
  l2: ListNode | null
): ListNode | null {
  const dummy = new ListNode(0);
  let current = dummy;

  while (l1 && l2) {
    if (l1.val <= l2.val) {
      current.next = l1;
      l1 = l1.next;
    } else {
      current.next = l2;
      l2 = l2.next;
    }
    current = current.next;
  }

  current.next = l1 || l2; // attach remaining nodes
  return dummy.next;
}
```

**Approach:** Use a dummy head node, compare elements from both lists, attach the smaller one. Time: O(n + m), Space: O(1).

---

### Problem 5: Best Time to Buy and Sell Stock

**Problem:** Given daily prices, find the maximum profit from one buy and one sell.

```typescript
function maxProfit(prices: number[]): number {
  let minPrice = prices[0];
  let maxProfit = 0;

  for (let i = 1; i < prices.length; i++) {
    if (prices[i] < minPrice) {
      minPrice = prices[i]; // new minimum buy price
    } else {
      maxProfit = Math.max(maxProfit, prices[i] - minPrice);
    }
  }

  return maxProfit;
}

// maxProfit([7, 1, 5, 3, 6, 4]) → 5 (buy at 1, sell at 6)
```

**Approach:** Track the minimum price seen so far, calculate profit at each step. Time: O(n), Space: O(1).

---

### Problem 6: Contains Duplicate

**Problem:** Check if any value appears at least twice in the array.

```typescript
function containsDuplicate(nums: number[]): boolean {
  const seen = new Set<number>();
  for (const num of nums) {
    if (seen.has(num)) return true;
    seen.add(num);
  }
  return false;
}

// containsDuplicate([1, 2, 3, 1]) → true
// containsDuplicate([1, 2, 3, 4]) → false
```

**Approach:** Use a Set for O(1) lookups. Time: O(n), Space: O(n).

---

## 20. Tips for Solving Algorithm Problems

**The problem-solving framework:**

1. **Understand the problem** — Read it carefully. What are the inputs? Outputs? Constraints? Edge cases?
2. **Work through examples** — Trace through 2-3 examples by hand. Include edge cases (empty input, single element, negative numbers).
3. **Think of a brute force solution** — Start simple. Even if it's O(n²) or worse, say it out loud. It shows you understand the problem.
4. **Optimize** — Can you use a hash map for O(1) lookups? Can two pointers reduce O(n²) to O(n)? Can sorting help? Can you use a sliding window?
5. **Write clean code** — Use meaningful variable names. Handle edge cases. Keep it readable.
6. **Test your solution** — Walk through your code with examples. Check edge cases.

**Communication tips for interviews:**
- **Think out loud** — Explain your thought process. The interviewer wants to see how you think, not just the final answer.
- **Ask clarifying questions** — "Can the array contain negatives?" "Is the input sorted?" "Can there be duplicates?"
- **State your approach before coding** — "I'm going to use a hash map to track frequencies, which gives O(n) time."
- **Mention time and space complexity** — After writing your solution, state the Big O.
- **If stuck, start with brute force** — It's better to have a working O(n²) solution than no solution at all.

**Time management:**
- Spend 3-5 minutes understanding the problem and planning.
- Spend 15-20 minutes coding.
- Spend 5 minutes testing and fixing.

**Common mistakes to avoid:**
- Jumping into code without understanding the problem.
- Not handling edge cases (null, empty, single element).
- Off-by-one errors (fencepost problems).
- Modifying the input when the problem says not to.
- Not considering negative numbers when the problem allows them.
- Using `===` vs `==` inconsistently in JavaScript/TypeScript.

**Pattern recognition — what technique to use:**
- **"Find a pair that sums to X"** → Hash map (unsorted) or Two pointers (sorted)
- **"Find longest/shortest subarray"** → Sliding window
- **"Search in sorted array"** → Binary search
- **"Explore all possibilities"** → Backtracking / DFS
- **"Shortest path"** → BFS
- **"Count ways to do X"** → Dynamic programming
- **"Check valid parentheses"** → Stack
- **"Frequency of elements"** → Hash map
- **"Top K elements"** → Heap / sorting
- **"Detect cycle"** → DFS with visited set / Floyd's algorithm

**Practice resources:**
- **LeetCode** — The standard for algorithm practice. Start with "Easy" problems.
- **NeetCode** — Curated list of 150 problems organized by pattern.
- **HackerRank** — Good for beginners, has guided challenges.
- **Blind 75** — The most commonly asked 75 problems.

> **In short:** Practice is the key. Aim for 2-3 problems per day. Focus on understanding patterns, not memorizing solutions. When stuck for more than 20 minutes, look at the solution, understand it, then solve it again from scratch.

---

For more coding challenges and system design problems, see [System Design & Live Coding](./03_system_design.md).
