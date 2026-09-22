import { CodingProblem } from '../../types';

// ============================================================================
// CODING CHALLENGES - PART 2 (Problems 8 to 14)
// With Full Solved Solutions in C, C++, Java, Python, and JavaScript
// ============================================================================

export const PROBLEMS_8_TO_14: CodingProblem[] = [
  // --------------------------------------------------------------------------
  // 8. Coin Change - Minimum Coins Required (Dynamic Programming) [NEW 4/10]
  // --------------------------------------------------------------------------
  {
    id: 'code_08',
    title: 'Coin Change (Min Coins)',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.

You may assume that you have an infinite number of each kind of coin.`,
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4',
    ],
    starterCode: {
      javascript: `function coinChange(coins, amount) {
  // Return minimum coins needed or -1
  
}`,
      python: `def coin_change(coins: list[int], amount: int) -> int:
    # Return minimum coins needed or -1
    pass`,
      java: `class Solution {
    public int coinChange(int[] coins, int amount) {
        // Return minimum coins needed or -1
        return -1;
    }
}`,
      cpp: `class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        // Return minimum coins needed or -1
        return -1;
    }
};`,
      c: `int coinChange(int* coins, int coinsSize, int amount) {
    // Return minimum coins needed or -1
    return -1;
}`,
    },
    solvedSolutions: {
      c: `// C Solution - 1D Bottom-Up Dynamic Programming
#include <stdio.h>
#include <stdlib.h>

int coinChange(int* coins, int coinsSize, int amount) {
    if (amount == 0) return 0;
    int* dp = (int*)malloc((amount + 1) * sizeof(int));
    for (int i = 0; i <= amount; i++) dp[i] = amount + 1;
    dp[0] = 0;
    
    for (int i = 1; i <= amount; i++) {
        for (int j = 0; j < coinsSize; j++) {
            if (coins[j] <= i) {
                int prev = dp[i - coins[j]];
                if (prev != amount + 1 && prev + 1 < dp[i]) {
                    dp[i] = prev + 1;
                }
            }
        }
    }
    int ans = dp[amount] > amount ? -1 : dp[amount];
    free(dp);
    return ans;
}`,
      cpp: `// C++ Solution - Bottom-Up DP Tabulation
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        vector<int> dp(amount + 1, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (i >= coin) {
                    dp[i] = min(dp[i], dp[i - coin] + 1);
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
};`,
      java: `// Java Solution - Bottom-Up DP Tabulation
import java.util.Arrays;

class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (i >= coin) {
                    dp[i] = Math.min(dp[i], dp[i - coin] + 1);
                }
            }
        }
        return dp[amount] > amount ? -1 : dp[amount];
    }
}`,
      python: `# Python Solution - Dynamic Programming Tabulation
def coin_change(coins: list[int], amount: int) -> int:
    dp = [amount + 1] * (amount + 1)
    dp[0] = 0
    for i in range(1, amount + 1):
        for coin in coins:
            if i >= coin:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    return dp[amount] if dp[amount] <= amount else -1`,
      javascript: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(amount + 1);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      if (i >= coin) {
        dp[i] = Math.min(dp[i], dp[i - coin] + 1);
      }
    }
  }
  return dp[amount] > amount ? -1 : dp[amount];
}`,
    },
    testCases: [
      {
        id: 'tc_8_1',
        input: 'coins = [1,2,5], amount = 11',
        expectedOutput: '3',
        explanation: '11 = 5 + 5 + 1 (3 coins)',
      },
      {
        id: 'tc_8_2',
        input: 'coins = [2], amount = 3',
        expectedOutput: '-1',
        explanation: 'Amount 3 cannot be formed using only coin of 2.',
      },
      {
        id: 'tc_8_3',
        input: 'coins = [1], amount = 0',
        expectedOutput: '0',
        explanation: '0 amount requires 0 coins.',
      },
    ],
    solutionHints: [
      'Define dp[i] as the minimum coins needed for amount i.',
      'Initialize dp array with infinity (or amount + 1) and dp[0] = 0.',
      'For each amount i from 1 to amount, transition: dp[i] = min(dp[i], dp[i - coin] + 1).',
    ],
    targetTimeComplexity: 'O(amount * n)',
    targetSpaceComplexity: 'O(amount)',
  },

  // --------------------------------------------------------------------------
  // 9. Trapping Rain Water (Two Pointers / Stack) [NEW 5/10]
  // --------------------------------------------------------------------------
  {
    id: 'code_09',
    title: 'Trapping Rain Water',
    category: 'Two Pointers',
    difficulty: 'Hard',
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.`,
    constraints: [
      'n == height.length',
      '1 <= n <= 2 * 10^4',
      '0 <= height[i] <= 10^5',
    ],
    starterCode: {
      javascript: `function trap(height) {
  // Return total trapped rain water units
  
}`,
      python: `def trap(height: list[int]) -> int:
    # Return total trapped rain water units
    pass`,
      java: `class Solution {
    public int trap(int[] height) {
        // Return total trapped rain water units
        return 0;
    }
}`,
      cpp: `class Solution {
public:
    int trap(vector<int>& height) {
        // Return total trapped rain water units
        return 0;
    }
};`,
      c: `int trap(int* height, int heightSize) {
    // Return total trapped rain water units
    return 0;
}`,
    },
    solvedSolutions: {
      c: `// C Solution - Two Pointers O(n) time, O(1) space
#include <stdio.h>

int trap(int* height, int heightSize) {
    if (heightSize <= 2) return 0;
    int left = 0, right = heightSize - 1;
    int left_max = 0, right_max = 0;
    int total_water = 0;
    
    while (left < right) {
        if (height[left] < height[right]) {
            if (height[left] >= left_max) {
                left_max = height[left];
            } else {
                total_water += left_max - height[left];
            }
            left++;
        } else {
            if (height[right] >= right_max) {
                right_max = height[right];
            } else {
                total_water += right_max - height[right];
            }
            right--;
        }
    }
    return total_water;
}`,
      cpp: `// C++ Solution - Two Pointers O(n)
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int trap(vector<int>& height) {
        if (height.empty()) return 0;
        int left = 0, right = (int)height.size() - 1;
        int left_max = 0, right_max = 0;
        int water = 0;
        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= left_max) {
                    left_max = height[left];
                } else {
                    water += left_max - height[left];
                }
                left++;
            } else {
                if (height[right] >= right_max) {
                    right_max = height[right];
                } else {
                    water += right_max - height[right];
                }
                right--;
            }
        }
        return water;
    }
};`,
      java: `// Java Solution - Two Pointers O(n)
class Solution {
    public int trap(int[] height) {
        int left = 0, right = height.length - 1;
        int leftMax = 0, rightMax = 0;
        int trapped = 0;
        while (left < right) {
            if (height[left] < height[right]) {
                if (height[left] >= leftMax) {
                    leftMax = height[left];
                } else {
                    trapped += leftMax - height[left];
                }
                left++;
            } else {
                if (height[right] >= rightMax) {
                    rightMax = height[right];
                } else {
                    trapped += rightMax - height[right];
                }
                right--;
            }
        }
        return trapped;
    }
}`,
      python: `# Python Solution - Two Pointers O(n)
def trap(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    left_max = right_max = 0
    water = 0
    while left < right:
        if height[left] < height[right]:
            if height[left] >= left_max:
                left_max = height[left]
            else:
                water += left_max - height[left]
            left += 1
        else:
            if height[right] >= right_max:
                right_max = height[right]
            else:
                water += right_max - height[right]
            right -= 1
    return water`,
      javascript: `function trap(height) {
  let left = 0;
  let right = height.length - 1;
  let leftMax = 0;
  let rightMax = 0;
  let water = 0;
  while (left < right) {
    if (height[left] < height[right]) {
      if (height[left] >= leftMax) {
        leftMax = height[left];
      } else {
        water += leftMax - height[left];
      }
      left++;
    } else {
      if (height[right] >= rightMax) {
        rightMax = height[right];
      } else {
        water += rightMax - height[right];
      }
      right--;
    }
  }
  return water;
}`,
    },
    testCases: [
      {
        id: 'tc_9_1',
        input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]',
        expectedOutput: '6',
        explanation: 'The elevation map traps 6 units of rain water between the peaks.',
      },
      {
        id: 'tc_9_2',
        input: 'height = [4,2,0,3,2,5]',
        expectedOutput: '9',
        explanation: 'Deep basin traps 9 units of water.',
      },
    ],
    solutionHints: [
      'Water trapped at any index is min(max_left, max_right) - height[i].',
      'Instead of computing prefix and suffix maximum arrays in O(n) space, use two pointers from both ends to solve in O(1) auxiliary space.',
    ],
    targetTimeComplexity: 'O(n)',
    targetSpaceComplexity: 'O(1)',
  },

  // --------------------------------------------------------------------------
  // 10. Valid Anagram (Arrays & Hashing) [NEW 6/10]
  // --------------------------------------------------------------------------
  {
    id: 'code_10',
    title: 'Valid Anagram',
    category: 'Arrays & Hashing',
    difficulty: 'Easy',
    description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
    constraints: [
      '1 <= s.length, t.length <= 5 * 10^4',
      's and t consist of lowercase English letters.',
    ],
    starterCode: {
      javascript: `function isAnagram(s, t) {
  // Return boolean true if anagram, false otherwise
  
}`,
      python: `def is_anagram(s: str, t: str) -> bool:
    # Return True if anagram, False otherwise
    pass`,
      java: `class Solution {
    public boolean isAnagram(String s, String t) {
        // Return boolean true if anagram, false otherwise
        return false;
    }
}`,
      cpp: `class Solution {
public:
    bool isAnagram(string s, string t) {
        // Return boolean true if anagram, false otherwise
        return false;
    }
};`,
      c: `bool isAnagram(char* s, char* t) {
    // Return true if anagram, false otherwise
    return false;
}`,
    },
    solvedSolutions: {
      c: `// C Solution - Frequency array of size 26
#include <stdbool.h>
#include <string.h>

bool isAnagram(char* s, char* t) {
    int len_s = strlen(s);
    int len_t = strlen(t);
    if (len_s != len_t) return false;
    
    int count[26] = {0};
    for (int i = 0; i < len_s; i++) {
        count[s[i] - 'a']++;
        count[t[i] - 'a']--;
    }
    for (int i = 0; i < 26; i++) {
        if (count[i] != 0) return false;
    }
    return true;
}`,
      cpp: `// C++ Solution - Character frequency vector
#include <string>
#include <vector>
using namespace std;

class Solution {
public:
    bool isAnagram(string s, string t) {
        if (s.length() != t.length()) return false;
        vector<int> freq(26, 0);
        for (size_t i = 0; i < s.length(); i++) {
            freq[s[i] - 'a']++;
            freq[t[i] - 'a']--;
        }
        for (int count : freq) {
            if (count != 0) return false;
        }
        return true;
    }
};`,
      java: `// Java Solution - 26-element array counting
class Solution {
    public boolean isAnagram(String s, String t) {
        if (s.length() != t.length()) return false;
        int[] count = new int[26];
        for (int i = 0; i < s.length(); i++) {
            count[s.charAt(i) - 'a']++;
            count[t.charAt(i) - 'a']--;
        }
        for (int val : count) {
            if (val != 0) return false;
        }
        return true;
    }
}`,
      python: `# Python Solution - Collections Counter
def is_anagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    count = {}
    for c1, c2 in zip(s, t):
        count[c1] = count.get(c1, 0) + 1
        count[c2] = count.get(c2, 0) - 1
    return all(v == 0 for v in count.values())`,
      javascript: `function isAnagram(s, t) {
  if (s.length !== t.length) return false;
  const count = {};
  for (let i = 0; i < s.length; i++) {
    count[s[i]] = (count[s[i]] || 0) + 1;
    count[t[i]] = (count[t[i]] || 0) - 1;
  }
  for (const key in count) {
    if (count[key] !== 0) return false;
  }
  return true;
}`,
    },
    testCases: [
      {
        id: 'tc_10_1',
        input: 's = "anagram", t = "nagaram"',
        expectedOutput: 'true',
        explanation: 'Both contain exact identical frequencies of {a:3, n:1, g:1, r:1, m:1}.',
      },
      {
        id: 'tc_10_2',
        input: 's = "rat", t = "car"',
        expectedOutput: 'false',
        explanation: 'Frequencies do not match.',
      },
    ],
    solutionHints: [
      'If string lengths differ, they cannot be anagrams.',
      'Count character frequencies using a fixed-size 26-element array.',
    ],
    targetTimeComplexity: 'O(n)',
    targetSpaceComplexity: 'O(1) (fixed 26 letters)',
  },

  // --------------------------------------------------------------------------
  // 11. Climbing Stairs (Dynamic Programming) [NEW 7/10]
  // --------------------------------------------------------------------------
  {
    id: 'code_11',
    title: 'Climbing Stairs',
    category: 'Dynamic Programming',
    difficulty: 'Easy',
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
    constraints: [
      '1 <= n <= 45',
    ],
    starterCode: {
      javascript: `function climbStairs(n) {
  // Return number of distinct ways to climb n stairs
  
}`,
      python: `def climb_stairs(n: int) -> int:
    # Return number of distinct ways to climb n stairs
    pass`,
      java: `class Solution {
    public int climbStairs(int n) {
        // Return number of distinct ways to climb n stairs
        return 0;
    }
}`,
      cpp: `class Solution {
public:
    int climbStairs(int n) {
        // Return number of distinct ways to climb n stairs
        return 0;
    }
};`,
      c: `int climbStairs(int n) {
    // Return number of distinct ways to climb n stairs
    return 0;
}`,
    },
    solvedSolutions: {
      c: `// C Solution - Fibonacci recurrence in O(n) time, O(1) space
#include <stdio.h>

int climbStairs(int n) {
    if (n <= 2) return n;
    int first = 1;
    int second = 2;
    for (int i = 3; i <= n; i++) {
        int third = first + second;
        first = second;
        second = third;
    }
    return second;
}`,
      cpp: `// C++ Solution - O(n) time, O(1) space
class Solution {
public:
    int climbStairs(int n) {
        if (n <= 2) return n;
        int prev2 = 1, prev1 = 2;
        for (int i = 3; i <= n; i++) {
            int current = prev1 + prev2;
            prev2 = prev1;
            prev1 = current;
        }
        return prev1;
    }
};`,
      java: `// Java Solution - O(n) time, O(1) space
class Solution {
    public int climbStairs(int n) {
        if (n <= 2) return n;
        int prev2 = 1, prev1 = 2;
        for (int i = 3; i <= n; i++) {
            int cur = prev1 + prev2;
            prev2 = prev1;
            prev1 = cur;
        }
        return prev1;
    }
}`,
      python: `# Python Solution - O(n) time, O(1) space
def climb_stairs(n: int) -> int:
    if n <= 2:
        return n
    prev2, prev1 = 1, 2
    for _ in range(3, n + 1):
        prev2, prev1 = prev1, prev2 + prev1
    return prev1`,
      javascript: `function climbStairs(n) {
  if (n <= 2) return n;
  let prev2 = 1;
  let prev1 = 2;
  for (let i = 3; i <= n; i++) {
    const cur = prev1 + prev2;
    prev2 = prev1;
    prev1 = cur;
  }
  return prev1;
}`,
    },
    testCases: [
      {
        id: 'tc_11_1',
        input: 'n = 2',
        expectedOutput: '2',
        explanation: 'There are two ways: 1 step + 1 step, or 2 steps.',
      },
      {
        id: 'tc_11_2',
        input: 'n = 3',
        expectedOutput: '3',
        explanation: 'Three ways: (1+1+1), (1+2), (2+1).',
      },
      {
        id: 'tc_11_3',
        input: 'n = 5',
        expectedOutput: '8',
        explanation: 'Fibonacci sequence: 1, 2, 3, 5, 8.',
      },
    ],
    solutionHints: [
      'To reach step n, you must arrive from step n - 1 or step n - 2.',
      'Therefore, ways(n) = ways(n - 1) + ways(n - 2), which is the Fibonacci series.',
    ],
    targetTimeComplexity: 'O(n)',
    targetSpaceComplexity: 'O(1)',
  },

  // --------------------------------------------------------------------------
  // 12. Binary Tree Inorder Traversal (Trees) [NEW 8/10]
  // --------------------------------------------------------------------------
  {
    id: 'code_12',
    title: 'Binary Tree Inorder Traversal',
    category: 'Trees',
    difficulty: 'Easy',
    description: `Given the root of a binary tree represented as a hierarchical array \`root\`, return the inorder traversal of its nodes' values (Left -> Root -> Right).

For array serialized tree representation: index 0 is root, left child is 2*i + 1, right child is 2*i + 2 (with null representing absent nodes).`,
    constraints: [
      'The number of nodes in the tree is in the range [0, 100].',
      '-100 <= Node.val <= 100',
    ],
    starterCode: {
      javascript: `function inorderTraversal(root) {
  // Return array of node values in inorder sequence
  
}`,
      python: `def inorder_traversal(root: list) -> list[int]:
    # Return list of node values in inorder sequence
    pass`,
      java: `class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        // Return list of node values in inorder sequence
        return new ArrayList<>();
    }
}`,
      cpp: `class Solution {
public:
    vector<int> inorderTraversal(TreeNode* root) {
        // Return vector of node values in inorder sequence
        return {};
    }
};`,
      c: `int* inorderTraversal(struct TreeNode* root, int* returnSize) {
    *returnSize = 0;
    // Return array of inorder values
    return NULL;
}`,
    },
    solvedSolutions: {
      c: `// C Solution - Inorder Traversal (Recursive or Array Tree)
#include <stdio.h>
#include <stdlib.h>

struct TreeNode {
    int val;
    struct TreeNode *left;
    struct TreeNode *right;
};

void traverse(struct TreeNode* root, int* arr, int* size) {
    if (!root) return;
    traverse(root->left, arr, size);
    arr[(*size)++] = root->val;
    traverse(root->right, arr, size);
}

int* inorderTraversal(struct TreeNode* root, int* returnSize) {
    int* result = (int*)malloc(100 * sizeof(int));
    *returnSize = 0;
    traverse(root, result, returnSize);
    return result;
}`,
      cpp: `// C++ Solution - Iterative with std::stack
#include <vector>
#include <stack>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Solution {
public:
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> result;
        stack<TreeNode*> st;
        TreeNode* curr = root;
        while (curr != nullptr || !st.empty()) {
            while (curr != nullptr) {
                st.push(curr);
                curr = curr->left;
            }
            curr = st.top();
            st.pop();
            result.push_back(curr->val);
            curr = curr->right;
        }
        return result;
    }
};`,
      java: `// Java Solution - Recursive helper
import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> res = new ArrayList<>();
        helper(root, res);
        return res;
    }
    private void helper(TreeNode node, List<Integer> res) {
        if (node == null) return;
        helper(node.left, res);
        res.add(node.val);
        helper(node.right, res);
    }
}`,
      python: `# Python Solution - Array tree / TreeNode traversal
def inorder_traversal(root) -> list[int]:
    if not root:
        return []
    if isinstance(root, list):
        if len(root) == 0 or root[0] is None:
            return []
        class TreeNode:
            def __init__(self, val=0, left=None, right=None):
                self.val = val
                self.left = left
                self.right = right
        tree_root = TreeNode(root[0])
        queue = [tree_root]
        i = 1
        while queue and i < len(root):
            curr = queue.pop(0)
            if i < len(root):
                if root[i] is not None:
                    curr.left = TreeNode(root[i])
                    queue.append(curr.left)
                i += 1
            if i < len(root):
                if root[i] is not None:
                    curr.right = TreeNode(root[i])
                    queue.append(curr.right)
                i += 1
    else:
        tree_root = root

    res = []
    def dfs(node):
        if not node:
            return
        dfs(node.left)
        res.append(node.val)
        dfs(node.right)
    dfs(tree_root)
    return res`,
      javascript: `function inorderTraversal(root) {
  if (!root) return [];
  let treeRoot = root;
  if (Array.isArray(root)) {
    if (root.length === 0 || root[0] === null) return [];
    treeRoot = { val: root[0], left: null, right: null };
    const queue = [treeRoot];
    let i = 1;
    while (queue.length > 0 && i < root.length) {
      const curr = queue.shift();
      if (i < root.length) {
        if (root[i] !== null && root[i] !== undefined) {
          curr.left = { val: root[i], left: null, right: null };
          queue.push(curr.left);
        }
        i++;
      }
      if (i < root.length) {
        if (root[i] !== null && root[i] !== undefined) {
          curr.right = { val: root[i], left: null, right: null };
          queue.push(curr.right);
        }
        i++;
      }
    }
  }

  const res = [];
  function dfs(node) {
    if (!node) return;
    dfs(node.left);
    res.push(node.val);
    dfs(node.right);
  }
  dfs(treeRoot);
  return res;
}`,
    },
    testCases: [
      {
        id: 'tc_12_1',
        input: 'root = [1,null,2,3]',
        expectedOutput: '[1,3,2]',
        explanation: 'Left subtree empty, root 1 visited, then left child of 2 is 3, then 2.',
      },
      {
        id: 'tc_12_2',
        input: 'root = []',
        expectedOutput: '[]',
        explanation: 'Empty tree gives empty traversal.',
      },
      {
        id: 'tc_12_3',
        input: 'root = [1]',
        expectedOutput: '[1]',
        explanation: 'Single root node.',
      },
    ],
    solutionHints: [
      'Inorder traversal visits Left Subtree -> Root -> Right Subtree.',
      'Can be solved recursively with helper function or iteratively using a Stack.',
    ],
    targetTimeComplexity: 'O(n)',
    targetSpaceComplexity: 'O(h) where h is tree height',
  },

  // --------------------------------------------------------------------------
  // 13. Product of Array Except Self (Arrays & Hashing) [NEW 9/10]
  // --------------------------------------------------------------------------
  {
    id: 'code_13',
    title: 'Product of Array Except Self',
    category: 'Arrays & Hashing',
    difficulty: 'Medium',
    description: `Given an integer array \`nums\`, return an array \`answer\` such that \`answer[i]\` is equal to the product of all the elements of \`nums\` except \`nums[i]\`.

The product of any prefix or suffix of \`nums\` is guaranteed to fit in a 32-bit integer.

You must write an algorithm that runs in \`O(n)\` time and without using the division operation.`,
    constraints: [
      '2 <= nums.length <= 10^5',
      '-30 <= nums[i] <= 30',
      'The product of any prefix or suffix fits in a 32-bit integer.',
    ],
    starterCode: {
      javascript: `function productExceptSelf(nums) {
  // Return array where answer[i] = product of all except nums[i]
  
}`,
      python: `def product_except_self(nums: list[int]) -> list[int]:
    # Return list where answer[i] = product of all except nums[i]
    pass`,
      java: `class Solution {
    public int[] productExceptSelf(int[] nums) {
        // Return array where answer[i] = product of all except nums[i]
        return new int[nums.length];
    }
}`,
      cpp: `class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        // Return vector where answer[i] = product of all except nums[i]
        return {};
    }
};`,
      c: `int* productExceptSelf(int* nums, int numsSize, int* returnSize) {
    *returnSize = numsSize;
    int* answer = (int*)malloc(numsSize * sizeof(int));
    // Calculate prefix and suffix products
    return answer;
}`,
    },
    solvedSolutions: {
      c: `// C Solution - Prefix & Suffix in O(n) time, O(1) auxiliary space
#include <stdio.h>
#include <stdlib.h>

int* productExceptSelf(int* nums, int numsSize, int* returnSize) {
    *returnSize = numsSize;
    int* ans = (int*)malloc(numsSize * sizeof(int));
    
    // Prefix products
    ans[0] = 1;
    for (int i = 1; i < numsSize; i++) {
        ans[i] = ans[i - 1] * nums[i - 1];
    }
    
    // Running suffix product
    int right = 1;
    for (int i = numsSize - 1; i >= 0; i--) {
        ans[i] *= right;
        right *= nums[i];
    }
    return ans;
}`,
      cpp: `// C++ Solution - Prefix & Running Suffix
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        int n = nums.size();
        vector<int> ans(n, 1);
        for (int i = 1; i < n; i++) {
            ans[i] = ans[i - 1] * nums[i - 1];
        }
        int right = 1;
        for (int i = n - 1; i >= 0; i--) {
            ans[i] *= right;
            right *= nums[i];
        }
        return ans;
    }
};`,
      java: `// Java Solution - Prefix and Suffix
class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] ans = new int[n];
        ans[0] = 1;
        for (int i = 1; i < n; i++) {
            ans[i] = ans[i - 1] * nums[i - 1];
        }
        int right = 1;
        for (int i = n - 1; i >= 0; i--) {
            ans[i] *= right;
            right *= nums[i];
        }
        return ans;
    }
}`,
      python: `# Python Solution - Prefix and Running Suffix
def product_except_self(nums: list[int]) -> list[int]:
    n = len(nums)
    ans = [1] * n
    for i in range(1, n):
        ans[i] = ans[i - 1] * nums[i - 1]
    right = 1
    for i in range(n - 1, -1, -1):
        ans[i] *= right
        right *= nums[i]
    return ans`,
      javascript: `function productExceptSelf(nums) {
  const n = nums.length;
  const ans = new Array(n).fill(1);
  for (let i = 1; i < n; i++) {
    ans[i] = ans[i - 1] * nums[i - 1];
  }
  let right = 1;
  for (let i = n - 1; i >= 0; i--) {
    ans[i] *= right;
    right *= nums[i];
  }
  return ans;
}`,
    },
    testCases: [
      {
        id: 'tc_13_1',
        input: 'nums = [1,2,3,4]',
        expectedOutput: '[24,12,8,6]',
        explanation: 'At 0: 2*3*4 = 24; at 1: 1*3*4 = 12; at 2: 1*2*4 = 8; at 3: 1*2*3 = 6.',
      },
      {
        id: 'tc_13_2',
        input: 'nums = [-1,1,0,-3,3]',
        expectedOutput: '[0,0,9,0,0]',
        explanation: 'Only index 2 (where original value is 0) has non-zero product: (-1)*1*(-3)*3 = 9.',
      },
    ],
    solutionHints: [
      'Construct a prefix product array where ans[i] is the product of all elements to the left of i.',
      'Then traverse backwards while maintaining a running suffix product of all elements to the right of i.',
    ],
    targetTimeComplexity: 'O(n)',
    targetSpaceComplexity: 'O(1) auxiliary space (output array does not count)',
  },

  // --------------------------------------------------------------------------
  // 14. Evaluate Reverse Polish Notation (Stack & Queue) [NEW 10/10]
  // --------------------------------------------------------------------------
  {
    id: 'code_14',
    title: 'Evaluate Reverse Polish Notation',
    category: 'Stack & Queue',
    difficulty: 'Medium',
    description: `You are given an array of strings \`tokens\` that represents an arithmetic expression in a Reverse Polish Notation (Postfix Notation).

Evaluate the expression. Return an integer that represents the value of the expression.

Note that:
- The valid operators are '+', '-', '*', and '/'.
- Each operand may be an integer or another expression.
- The division between two integers always truncates toward zero.`,
    constraints: [
      '1 <= tokens.length <= 10^4',
      'tokens[i] is either an operator: "+", "-", "*", or "/", or an integer in the range [-200, 200].',
    ],
    starterCode: {
      javascript: `function evalRPN(tokens) {
  // Return evaluated integer result
  
}`,
      python: `def eval_rpn(tokens: list[str]) -> int:
    # Return evaluated integer result
    pass`,
      java: `class Solution {
    public int evalRPN(String[] tokens) {
        // Return evaluated integer result
        return 0;
    }
}`,
      cpp: `class Solution {
public:
    int evalRPN(vector<string>& tokens) {
        // Return evaluated integer result
        return 0;
    }
};`,
      c: `int evalRPN(char** tokens, int tokensSize) {
    // Return evaluated integer result
    return 0;
}`,
    },
    solvedSolutions: {
      c: `// C Solution - Stack implementation
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int evalRPN(char** tokens, int tokensSize) {
    int* stack = (int*)malloc(tokensSize * sizeof(int));
    int top = -1;
    
    for (int i = 0; i < tokensSize; i++) {
        char* token = tokens[i];
        if (strlen(token) == 1 && (token[0] == '+' || token[0] == '-' || token[0] == '*' || token[0] == '/')) {
            int b = stack[top--];
            int a = stack[top--];
            if (token[0] == '+') stack[++top] = a + b;
            else if (token[0] == '-') stack[++top] = a - b;
            else if (token[0] == '*') stack[++top] = a * b;
            else if (token[0] == '/') stack[++top] = a / b;
        } else {
            stack[++top] = atoi(token);
        }
    }
    int result = stack[top];
    free(stack);
    return result;
}`,
      cpp: `// C++ Solution - std::stack with integer truncation
#include <vector>
#include <string>
#include <stack>
using namespace std;

class Solution {
public:
    int evalRPN(vector<string>& tokens) {
        stack<int> st;
        for (const string& token : tokens) {
            if (token == "+" || token == "-" || token == "*" || token == "/") {
                int b = st.top(); st.pop();
                int a = st.top(); st.pop();
                if (token == "+") st.push(a + b);
                else if (token == "-") st.push(a - b);
                else if (token == "*") st.push(a * b);
                else if (token == "/") st.push(a / b);
            } else {
                st.push(stoi(token));
            }
        }
        return st.top();
    }
};`,
      java: `// Java Solution - Deque as Stack
import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public int evalRPN(String[] tokens) {
        Deque<Integer> stack = new ArrayDeque<>();
        for (String t : tokens) {
            if (t.equals("+") || t.equals("-") || t.equals("*") || t.equals("/")) {
                int b = stack.pop();
                int a = stack.pop();
                if (t.equals("+")) stack.push(a + b);
                else if (t.equals("-")) stack.push(a - b);
                else if (t.equals("*")) stack.push(a * b);
                else if (t.equals("/")) stack.push(a / b);
            } else {
                stack.push(Integer.parseInt(t));
            }
        }
        return stack.pop();
    }
}`,
      python: `# Python Solution - List as Stack with int() truncation
def eval_rpn(tokens: list[str]) -> int:
    stack = []
    for token in tokens:
        if token in {"+", "-", "*", "/"}:
            b = stack.pop()
            a = stack.pop()
            if token == "+":
                stack.append(a + b)
            elif token == "-":
                stack.append(a - b)
            elif token == "*":
                stack.append(a * b)
            elif token == "/":
                stack.append(int(a / b))  # Truncates toward zero
        else:
            stack.append(int(token))
    return stack[0]`,
      javascript: `function evalRPN(tokens) {
  const stack = [];
  for (const token of tokens) {
    if (token === '+' || token === '-' || token === '*' || token === '/') {
      const b = stack.pop();
      const a = stack.pop();
      if (token === '+') stack.push(a + b);
      else if (token === '-') stack.push(a - b);
      else if (token === '*') stack.push(a * b);
      else if (token === '/') stack.push(Math.trunc(a / b));
    } else {
      stack.push(Number(token));
    }
  }
  return stack[0];
}`,
    },
    testCases: [
      {
        id: 'tc_14_1',
        input: 'tokens = ["2","1","+","3","*"]',
        expectedOutput: '9',
        explanation: '((2 + 1) * 3) = 9',
      },
      {
        id: 'tc_14_2',
        input: 'tokens = ["4","13","5","/","+"]',
        expectedOutput: '6',
        explanation: '(4 + (13 / 5)) = 4 + 2 = 6',
      },
      {
        id: 'tc_14_3',
        input: 'tokens = ["10","6","9","3","+","-11","*","/","*","17","+","5","+"]',
        expectedOutput: '22',
        explanation: 'Complex nested postfix expression evaluates to 22.',
      },
    ],
    solutionHints: [
      'Use a stack: iterate through the tokens.',
      'If the token is a number, push it to the stack.',
      'If the token is an operator, pop the top two numbers (note order: second popped is left operand, first popped is right operand), apply the operator, and push the result back.',
    ],
    targetTimeComplexity: 'O(n)',
    targetSpaceComplexity: 'O(n)',
  },
];
