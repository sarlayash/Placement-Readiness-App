import { CodingProblem } from '../../types';

// ============================================================================
// CODING CHALLENGES - PART 1 (Problems 1 to 7)
// With Full Solved Solutions in C, C++, Java, Python, and JavaScript
// ============================================================================

export const PROBLEMS_1_TO_7: CodingProblem[] = [
  // --------------------------------------------------------------------------
  // 1. Two Sum Target Indices (Arrays & Hashing)
  // --------------------------------------------------------------------------
  {
    id: 'code_01',
    title: 'Two Sum Target Indices',
    category: 'Arrays & Hashing',
    difficulty: 'Easy',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.`,
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.',
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Return array of two indices [i, j]
  
}`,
      python: `def two_sum(nums: list[int], target: int) -> list[int]:
    # Return list of two indices [i, j]
    pass`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Return array of two indices
        return new int[0];
    }
}`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Return vector of two indices
        return {};
    }
};`,
      c: `/**
 * Note: The returned array must be malloced, assume caller calls free().
 */
int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    *returnSize = 2;
    int* result = (int*)malloc(2 * sizeof(int));
    // Write your solution here
    return result;
}`,
    },
    solvedSolutions: {
      c: `// C Solution - O(n^2) Brute Force or O(n) with Hash Table simulation
#include <stdio.h>
#include <stdlib.h>

int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    *returnSize = 2;
    int* result = (int*)malloc(2 * sizeof(int));
    for (int i = 0; i < numsSize - 1; i++) {
        for (int j = i + 1; j < numsSize; j++) {
            if (nums[i] + nums[j] == target) {
                result[0] = i;
                result[1] = j;
                return result;
            }
        }
    }
    return result;
}`,
      cpp: `// C++ Solution - Optimal O(n) Hash Map
#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (seen.find(complement) != seen.end()) {
                return {seen[complement], i};
            }
            seen[nums[i]] = i;
        }
        return {};
    }
};`,
      java: `// Java Solution - Optimal O(n) HashMap
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}`,
      python: `# Python Solution - Optimal O(n) Dictionary
def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
      javascript: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
    },
    testCases: [
      {
        id: 'tc_1_1',
        input: 'nums = [2,7,11,15], target = 9',
        expectedOutput: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 2 + 7 == 9, return [0, 1].',
      },
      {
        id: 'tc_1_2',
        input: 'nums = [3,2,4], target = 6',
        expectedOutput: '[1,2]',
        explanation: 'nums[1] + nums[2] == 2 + 4 == 6, return [1, 2].',
      },
      {
        id: 'tc_1_3',
        input: 'nums = [3,3], target = 6',
        expectedOutput: '[0,1]',
        explanation: 'nums[0] + nums[1] == 3 + 3 == 6, return [0, 1].',
      },
    ],
    solutionHints: [
      'Can you solve it in a single pass instead of nested loops O(n^2)?',
      'Use a Hash Map to store numbers you have already visited along with their index.',
      'Check if (target - current_number) is already present in your map.',
    ],
    targetTimeComplexity: 'O(n)',
    targetSpaceComplexity: 'O(n)',
  },

  // --------------------------------------------------------------------------
  // 2. Valid Parentheses Checker (Stack & Queue)
  // --------------------------------------------------------------------------
  {
    id: 'code_02',
    title: 'Valid Parentheses Checker',
    category: 'Stack & Queue',
    difficulty: 'Easy',
    description: `Given a string \`s\` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'.',
    ],
    starterCode: {
      javascript: `function isValid(s) {
  // Return boolean true or false
  
}`,
      python: `def is_valid(s: str) -> bool:
    # Return True or False
    pass`,
      java: `class Solution {
    public boolean isValid(String s) {
        // Return boolean true or false
        return false;
    }
}`,
      cpp: `class Solution {
public:
    bool isValid(string s) {
        // Return boolean true or false
        return false;
    }
};`,
      c: `bool isValid(char* s) {
    // Return true if valid, false otherwise
    return false;
}`,
    },
    solvedSolutions: {
      c: `// C Solution - Stack implementation with array
#include <stdbool.h>
#include <string.h>
#include <stdlib.h>

bool isValid(char* s) {
    int len = strlen(s);
    if (len % 2 != 0) return false;
    
    char* stack = (char*)malloc(len * sizeof(char));
    int top = -1;
    
    for (int i = 0; i < len; i++) {
        char c = s[i];
        if (c == '(' || c == '{' || c == '[') {
            stack[++top] = c;
        } else {
            if (top == -1) { free(stack); return false; }
            char open = stack[top--];
            if ((c == ')' && open != '(') ||
                (c == '}' && open != '{') ||
                (c == ']' && open != '[')) {
                free(stack);
                return false;
            }
        }
    }
    bool valid = (top == -1);
    free(stack);
    return valid;
}`,
      cpp: `// C++ Solution - std::stack
#include <string>
#include <stack>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        stack<char> st;
        for (char c : s) {
            if (c == '(') st.push(')');
            else if (c == '{') st.push('}');
            else if (c == '[') st.push(']');
            else {
                if (st.empty() || st.top() != c) return false;
                st.pop();
            }
        }
        return st.empty();
    }
};`,
      java: `// Java Solution - Deque as Stack
import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(') stack.push(')');
            else if (c == '{') stack.push('}');
            else if (c == '[') stack.push(']');
            else {
                if (stack.isEmpty() || stack.pop() != c) return false;
            }
        }
        return stack.isEmpty();
    }
}`,
      python: `# Python Solution - List as Stack
def is_valid(s: str) -> bool:
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping.values():
            stack.append(char)
        elif char in mapping:
            if not stack or stack.pop() != mapping[char]:
                return False
        else:
            return False
    return len(stack) == 0`,
      javascript: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (char === '(' || char === '{' || char === '[') {
      stack.push(char);
    } else {
      if (stack.length === 0 || stack.pop() !== map[char]) {
        return false;
      }
    }
  }
  return stack.length === 0;
}`,
    },
    testCases: [
      {
        id: 'tc_2_1',
        input: 's = "()"',
        expectedOutput: 'true',
        explanation: 'Simple valid parenthesis pair.',
      },
      {
        id: 'tc_2_2',
        input: 's = "()[]{}"',
        expectedOutput: 'true',
        explanation: 'All three bracket types open and close in correct sequence.',
      },
      {
        id: 'tc_2_3',
        input: 's = "(]"',
        expectedOutput: 'false',
        explanation: 'Mismatched bracket pair: ( closed with ].',
      },
      {
        id: 'tc_2_4',
        input: 's = "([)]"',
        expectedOutput: 'false',
        explanation: 'Interleaved invalid nesting.',
      },
    ],
    solutionHints: [
      'A Stack data structure (LIFO) is ideal for matching nested pairs.',
      'Whenever you encounter an open bracket, push it onto the stack.',
      'When you see a closing bracket, compare it with the top of the stack.',
    ],
    targetTimeComplexity: 'O(n)',
    targetSpaceComplexity: 'O(n)',
  },

  // --------------------------------------------------------------------------
  // 3. Maximum Subarray - Kadane's Algorithm (Dynamic Programming)
  // --------------------------------------------------------------------------
  {
    id: 'code_03',
    title: 'Maximum Subarray (Kadane Algorithm)',
    category: 'Dynamic Programming',
    difficulty: 'Medium',
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.

A subarray is a contiguous non-empty sequence of elements within an array.`,
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
    ],
    starterCode: {
      javascript: `function maxSubArray(nums) {
  // Return the maximum contiguous subarray sum
  
}`,
      python: `def max_sub_array(nums: list[int]) -> int:
    # Return the maximum contiguous subarray sum
    pass`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        // Return the maximum contiguous subarray sum
        return 0;
    }
}`,
      cpp: `class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        // Return the maximum contiguous subarray sum
        return 0;
    }
};`,
      c: `int maxSubArray(int* nums, int numsSize) {
    // Return the maximum contiguous subarray sum
    return 0;
}`,
    },
    solvedSolutions: {
      c: `// C Solution - Kadane's Algorithm O(n) time, O(1) space
#include <stdio.h>

int maxSubArray(int* nums, int numsSize) {
    int max_sum = nums[0];
    int current_sum = nums[0];
    
    for (int i = 1; i < numsSize; i++) {
        current_sum = (nums[i] > current_sum + nums[i]) ? nums[i] : (current_sum + nums[i]);
        if (current_sum > max_sum) {
            max_sum = current_sum;
        }
    }
    return max_sum;
}`,
      cpp: `// C++ Solution - Kadane's Algorithm
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int max_sum = nums[0];
        int current_sum = nums[0];
        for (size_t i = 1; i < nums.size(); ++i) {
            current_sum = max(nums[i], current_sum + nums[i]);
            max_sum = max(max_sum, current_sum);
        }
        return max_sum;
    }
};`,
      java: `// Java Solution - Kadane's Algorithm
class Solution {
    public int maxSubArray(int[] nums) {
        int max = nums[0];
        int current = nums[0];
        for (int i = 1; i < nums.length; i++) {
            current = Math.max(nums[i], current + nums[i]);
            max = Math.max(max, current);
        }
        return max;
    }
}`,
      python: `# Python Solution - Kadane's Algorithm
def max_sub_array(nums: list[int]) -> int:
    current_sum = max_sum = nums[0]
    for x in nums[1:]:
        current_sum = max(x, current_sum + x)
        max_sum = max(max_sum, current_sum)
    return max_sum`,
      javascript: `function maxSubArray(nums) {
  let currentSum = nums[0];
  let maxSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}`,
    },
    testCases: [
      {
        id: 'tc_3_1',
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        expectedOutput: '6',
        explanation: 'Contiguous subarray [4,-1,2,1] has the maximum sum of 6.',
      },
      {
        id: 'tc_3_2',
        input: 'nums = [1]',
        expectedOutput: '1',
        explanation: 'Single element array.',
      },
      {
        id: 'tc_3_3',
        input: 'nums = [5,4,-1,7,8]',
        expectedOutput: '23',
        explanation: 'The entire array adds up to 23.',
      },
    ],
    solutionHints: [
      'If the running sum drops below the current element itself, reset the subarray starting at the current element.',
      'Maintain both running sum and global best sum in O(1) space.',
    ],
    targetTimeComplexity: 'O(n)',
    targetSpaceComplexity: 'O(1)',
  },

  // --------------------------------------------------------------------------
  // 4. Reverse Words in a String (Strings & Parsing)
  // --------------------------------------------------------------------------
  {
    id: 'code_04',
    title: 'Reverse Words in a String',
    category: 'Strings & Parsing',
    difficulty: 'Medium',
    description: `Given an input string \`s\`, reverse the order of the words.

A word is defined as a sequence of non-space characters. The words in \`s\` will be separated by at least one space.

Return a string of the words in reverse order concatenated by a single space. Note that \`s\` may contain leading or trailing spaces or multiple spaces between two words. The returned string should only have a single space separating the words.`,
    constraints: [
      '1 <= s.length <= 10^4',
      's contains English letters, digits, and spaces \' \'.',
      'There is at least one word in s.',
    ],
    starterCode: {
      javascript: `function reverseWords(s) {
  // Return words reversed as single spaced string
  
}`,
      python: `def reverse_words(s: str) -> str:
    # Return words reversed as single spaced string
    pass`,
      java: `class Solution {
    public String reverseWords(String s) {
        // Return words reversed as single spaced string
        return "";
    }
}`,
      cpp: `class Solution {
public:
    string reverseWords(string s) {
        // Return words reversed as single spaced string
        return "";
    }
};`,
      c: `char* reverseWords(char* s) {
    // Return words reversed as single spaced string
    return s;
}`,
    },
    solvedSolutions: {
      c: `// C Solution - In-place two pointer reverse words
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

void reverseSubstr(char* str, int start, int end) {
    while (start < end) {
        char temp = str[start];
        str[start++] = str[end];
        str[end--] = temp;
    }
}

char* reverseWords(char* s) {
    int len = strlen(s);
    char* clean = (char*)malloc((len + 1) * sizeof(char));
    int i = 0, j = 0;
    
    // Trim and normalize multiple spaces
    while (i < len && s[i] == ' ') i++;
    while (i < len) {
        if (s[i] != ' ') {
            clean[j++] = s[i++];
        } else {
            while (i < len && s[i] == ' ') i++;
            if (i < len) clean[j++] = ' ';
        }
    }
    clean[j] = '\\0';
    
    // Reverse the entire cleaned string
    reverseSubstr(clean, 0, j - 1);
    
    // Reverse each individual word back
    int start = 0;
    for (int k = 0; k <= j; k++) {
        if (clean[k] == ' ' || clean[k] == '\\0') {
            reverseSubstr(clean, start, k - 1);
            start = k + 1;
        }
    }
    return clean;
}`,
      cpp: `// C++ Solution - Stringstream tokenization
#include <string>
#include <vector>
#include <sstream>
using namespace std;

class Solution {
public:
    string reverseWords(string s) {
        stringstream ss(s);
        string word, result = "";
        vector<string> words;
        while (ss >> word) words.push_back(word);
        for (int i = (int)words.size() - 1; i >= 0; i--) {
            result += words[i] + (i > 0 ? " " : "");
        }
        return result;
    }
};`,
      java: `// Java Solution - Regex split and StringBuilder
class Solution {
    public String reverseWords(String s) {
        String[] tokens = s.trim().split("\\\\s+");
        StringBuilder sb = new StringBuilder();
        for (int i = tokens.length - 1; i >= 0; i--) {
            sb.append(tokens[i]);
            if (i > 0) sb.append(" ");
        }
        return sb.toString();
    }
}`,
      python: `# Python Solution - Optimal split & reversed
def reverse_words(s: str) -> str:
    return " ".join(reversed(s.split()))`,
      javascript: `function reverseWords(s) {
  return s.trim().split(/\\s+/).reverse().join(' ');
}`,
    },
    testCases: [
      {
        id: 'tc_4_1',
        input: 's = "the sky is blue"',
        expectedOutput: '"blue is sky the"',
        explanation: 'Simple sentence reversed word by word.',
      },
      {
        id: 'tc_4_2',
        input: 's = "  hello world  "',
        expectedOutput: '"world hello"',
        explanation: 'Leading and trailing spaces trimmed.',
      },
      {
        id: 'tc_4_3',
        input: 's = "a good   example"',
        expectedOutput: '"example good a"',
        explanation: 'Multiple spaces between words reduced to a single space.',
      },
    ],
    solutionHints: [
      'In Python and JS, split on whitespace regex automatically handles multiple contiguous spaces.',
      'In C/C++, reverse the full string first, then reverse individual words in place.',
    ],
    targetTimeComplexity: 'O(n)',
    targetSpaceComplexity: 'O(n)',
  },

  // --------------------------------------------------------------------------
  // 5. Container With Most Water (Two Pointers) [NEW 1/10]
  // --------------------------------------------------------------------------
  {
    id: 'code_05',
    title: 'Container With Most Water',
    category: 'Two Pointers',
    difficulty: 'Medium',
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i-th\` line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store. Notice that you may not slant the container.`,
    constraints: [
      'n == height.length',
      '2 <= n <= 10^5',
      '0 <= height[i] <= 10^4',
    ],
    starterCode: {
      javascript: `function maxArea(height) {
  // Return maximum water container capacity
  
}`,
      python: `def max_area(height: list[int]) -> int:
    # Return maximum water container capacity
    pass`,
      java: `class Solution {
    public int maxArea(int[] height) {
        // Return maximum water container capacity
        return 0;
    }
}`,
      cpp: `class Solution {
public:
    int maxArea(vector<int>& height) {
        // Return maximum water container capacity
        return 0;
    }
};`,
      c: `int maxArea(int* height, int heightSize) {
    // Return maximum water container capacity
    return 0;
}`,
    },
    solvedSolutions: {
      c: `// C Solution - Two Pointers O(n) time, O(1) space
#include <stdio.h>

int maxArea(int* height, int heightSize) {
    int left = 0;
    int right = heightSize - 1;
    int max_water = 0;
    
    while (left < right) {
        int h = height[left] < height[right] ? height[left] : height[right];
        int w = right - left;
        int area = h * w;
        if (area > max_water) max_water = area;
        
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    return max_water;
}`,
      cpp: `// C++ Solution - Two Pointers O(n)
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxArea(vector<int>& height) {
        int left = 0, right = (int)height.size() - 1;
        int max_water = 0;
        while (left < right) {
            int width = right - left;
            int h = min(height[left], height[right]);
            max_water = max(max_water, width * h);
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        return max_water;
    }
};`,
      java: `// Java Solution - Two Pointers O(n)
class Solution {
    public int maxArea(int[] height) {
        int left = 0, right = height.length - 1;
        int maxWater = 0;
        while (left < right) {
            int h = Math.min(height[left], height[right]);
            int width = right - left;
            maxWater = Math.max(maxWater, h * width);
            if (height[left] < height[right]) {
                left++;
            } else {
                right--;
            }
        }
        return maxWater;
    }
}`,
      python: `# Python Solution - Two Pointers O(n)
def max_area(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    max_water = 0
    while left < right:
        h = min(height[left], height[right])
        max_water = max(max_water, h * (right - left))
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    return max_water`,
      javascript: `function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let maxWater = 0;
  while (left < right) {
    const h = Math.min(height[left], height[right]);
    const width = right - left;
    maxWater = Math.max(maxWater, h * width);
    if (height[left] < height[right]) {
      left++;
    } else {
      right--;
    }
  }
  return maxWater;
}`,
    },
    testCases: [
      {
        id: 'tc_5_1',
        input: 'height = [1,8,6,2,5,4,8,3,7]',
        expectedOutput: '49',
        explanation: 'Indices 1 and 8 (heights 8 and 7) with width 7 give min(8, 7) * 7 = 49.',
      },
      {
        id: 'tc_5_2',
        input: 'height = [1,1]',
        expectedOutput: '1',
        explanation: 'Width 1, height 1 -> area = 1.',
      },
      {
        id: 'tc_5_3',
        input: 'height = [4,3,2,1,4]',
        expectedOutput: '16',
        explanation: 'Boundary heights 4 and 4 at width 4 -> 4 * 4 = 16.',
      },
    ],
    solutionHints: [
      'Initialize two pointers at the ends of the array: left = 0, right = n - 1.',
      'The area is limited by the shorter bar. Moving the taller bar inward can never increase area, so always advance the shorter bar.',
    ],
    targetTimeComplexity: 'O(n)',
    targetSpaceComplexity: 'O(1)',
  },

  // --------------------------------------------------------------------------
  // 6. Longest Substring Without Repeating Characters [NEW 2/10]
  // --------------------------------------------------------------------------
  {
    id: 'code_06',
    title: 'Longest Substring Without Repeating Characters',
    category: 'Strings & Parsing',
    difficulty: 'Medium',
    description: `Given a string \`s\`, find the length of the longest substring without duplicate characters.

A substring is a contiguous non-empty sequence of characters within a string.`,
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.',
    ],
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {
  // Return integer length of longest unique substring
  
}`,
      python: `def length_of_longest_substring(s: str) -> int:
    # Return integer length of longest unique substring
    pass`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        // Return integer length of longest unique substring
        return 0;
    }
}`,
      cpp: `class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        // Return integer length of longest unique substring
        return 0;
    }
};`,
      c: `int lengthOfLongestSubstring(char* s) {
    // Return integer length of longest unique substring
    return 0;
}`,
    },
    solvedSolutions: {
      c: `// C Solution - Sliding Window with ASCII index table
#include <stdio.h>
#include <string.h>

int lengthOfLongestSubstring(char* s) {
    int lastPos[256];
    for (int i = 0; i < 256; i++) lastPos[i] = -1;
    
    int max_len = 0;
    int start = 0;
    int len = strlen(s);
    
    for (int i = 0; i < len; i++) {
        unsigned char c = (unsigned char)s[i];
        if (lastPos[c] >= start) {
            start = lastPos[c] + 1;
        }
        lastPos[c] = i;
        int current_len = i - start + 1;
        if (current_len > max_len) max_len = current_len;
    }
    return max_len;
}`,
      cpp: `// C++ Solution - Sliding window with hash map
#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_map<char, int> charMap;
        int maxLen = 0, left = 0;
        for (int right = 0; right < s.length(); right++) {
            if (charMap.count(s[right]) && charMap[s[right]] >= left) {
                left = charMap[s[right]] + 1;
            }
            charMap[s[right]] = right;
            maxLen = max(maxLen, right - left + 1);
        }
        return maxLen;
    }
};`,
      java: `// Java Solution - Sliding Window HashMap
import java.util.HashMap;
import java.util.Map;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        Map<Character, Integer> map = new HashMap<>();
        int maxLen = 0, left = 0;
        for (int right = 0; right < s.length(); right++) {
            char c = s.charAt(right);
            if (map.containsKey(c)) {
                left = Math.max(left, map.get(c) + 1);
            }
            map.put(c, right);
            maxLen = Math.max(maxLen, right - left + 1);
        }
        return maxLen;
    }
}`,
      python: `# Python Solution - Sliding Window Dict
def length_of_longest_substring(s: str) -> int:
    char_map = {}
    left = 0
    max_len = 0
    for right, char in enumerate(s):
        if char in char_map and char_map[char] >= left:
            left = char_map[char] + 1
        char_map[char] = right
        max_len = max(max_len, right - left + 1)
    return max_len`,
      javascript: `function lengthOfLongestSubstring(s) {
  const map = new Map();
  let maxLen = 0;
  let left = 0;
  for (let right = 0; right < s.length; right++) {
    const char = s[right];
    if (map.has(char) && map.get(char) >= left) {
      left = map.get(char) + 1;
    }
    map.set(char, right);
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}`,
    },
    testCases: [
      {
        id: 'tc_6_1',
        input: 's = "abcabcbb"',
        expectedOutput: '3',
        explanation: 'The answer is "abc", with length 3.',
      },
      {
        id: 'tc_6_2',
        input: 's = "bbbbb"',
        expectedOutput: '1',
        explanation: 'The answer is "b", with length 1.',
      },
      {
        id: 'tc_6_3',
        input: 's = "pwwkew"',
        expectedOutput: '3',
        explanation: 'The answer is "wke", with length 3. Notice "pwke" is not a contiguous substring.',
      },
      {
        id: 'tc_6_4',
        input: 's = ""',
        expectedOutput: '0',
        explanation: 'Empty string returns 0.',
      },
    ],
    solutionHints: [
      'Maintain a sliding window [left, right] of characters without duplicates.',
      'Use a hash map to record the last seen index of each character.',
      'When you see a duplicate, jump the left pointer forward past the previous occurrence.',
    ],
    targetTimeComplexity: 'O(n)',
    targetSpaceComplexity: 'O(min(m, n)) where m is charset size',
  },

  // --------------------------------------------------------------------------
  // 7. Merge Two Sorted Arrays / Lists [NEW 3/10]
  // --------------------------------------------------------------------------
  {
    id: 'code_07',
    title: 'Merge Two Sorted Arrays',
    category: 'Two Pointers',
    difficulty: 'Easy',
    description: `You are given two integer arrays \`list1\` and \`list2\` sorted in non-decreasing order.

Merge the two arrays into one sorted array in non-decreasing order and return the merged array.`,
    constraints: [
      '0 <= list1.length, list2.length <= 10^4',
      '-10^9 <= list1[i], list2[i] <= 10^9',
      'Both list1 and list2 are sorted in non-decreasing order.',
    ],
    starterCode: {
      javascript: `function mergeTwoLists(list1, list2) {
  // Return merged sorted array
  
}`,
      python: `def merge_two_lists(list1: list[int], list2: list[int]) -> list[int]:
    # Return merged sorted list
    pass`,
      java: `class Solution {
    public int[] mergeTwoLists(int[] list1, int[] list2) {
        // Return merged sorted array
        return new int[0];
    }
}`,
      cpp: `class Solution {
public:
    vector<int> mergeTwoLists(vector<int>& list1, vector<int>& list2) {
        // Return merged sorted vector
        return {};
    }
};`,
      c: `int* mergeTwoLists(int* list1, int size1, int* list2, int size2, int* returnSize) {
    *returnSize = size1 + size2;
    int* result = (int*)malloc((*returnSize) * sizeof(int));
    // Merge into result
    return result;
}`,
    },
    solvedSolutions: {
      c: `// C Solution - Two Pointers Merge O(n + m)
#include <stdio.h>
#include <stdlib.h>

int* mergeTwoLists(int* list1, int size1, int* list2, int size2, int* returnSize) {
    *returnSize = size1 + size2;
    int* result = (int*)malloc((*returnSize) * sizeof(int));
    int i = 0, j = 0, k = 0;
    
    while (i < size1 && j < size2) {
        if (list1[i] <= list2[j]) {
            result[k++] = list1[i++];
        } else {
            result[k++] = list2[j++];
        }
    }
    while (i < size1) result[k++] = list1[i++];
    while (j < size2) result[k++] = list2[j++];
    
    return result;
}`,
      cpp: `// C++ Solution - Two Pointers Linear Merge
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> mergeTwoLists(vector<int>& list1, vector<int>& list2) {
        vector<int> result;
        result.reserve(list1.size() + list2.size());
        size_t i = 0, j = 0;
        while (i < list1.size() && j < list2.size()) {
            if (list1[i] <= list2[j]) {
                result.push_back(list1[i++]);
            } else {
                result.push_back(list2[j++]);
            }
        }
        while (i < list1.size()) result.push_back(list1[i++]);
        while (j < list2.size()) result.push_back(list2[j++]);
        return result;
    }
};`,
      java: `// Java Solution - Two Pointers
class Solution {
    public int[] mergeTwoLists(int[] list1, int[] list2) {
        int[] result = new int[list1.length + list2.length];
        int i = 0, j = 0, k = 0;
        while (i < list1.length && j < list2.length) {
            if (list1[i] <= list2[j]) {
                result[k++] = list1[i++];
            } else {
                result[k++] = list2[j++];
            }
        }
        while (i < list1.length) result[k++] = list1[i++];
        while (j < list2.length) result[k++] = list2[j++];
        return result;
    }
}`,
      python: `# Python Solution - Two Pointers Merge
def merge_two_lists(list1: list[int], list2: list[int]) -> list[int]:
    result = []
    i = j = 0
    while i < len(list1) and j < len(list2):
        if list1[i] <= list2[j]:
            result.append(list1[i])
            i += 1
        else:
            result.append(list2[j])
            j += 1
    result.extend(list1[i:])
    result.extend(list2[j:])
    return result`,
      javascript: `function mergeTwoLists(list1, list2) {
  const result = [];
  let i = 0, j = 0;
  while (i < list1.length && j < list2.length) {
    if (list1[i] <= list2[j]) {
      result.push(list1[i++]);
    } else {
      result.push(list2[j++]);
    }
  }
  while (i < list1.length) result.push(list1[i++]);
  while (j < list2.length) result.push(list2[j++]);
  return result;
}`,
    },
    testCases: [
      {
        id: 'tc_7_1',
        input: 'list1 = [1,2,4], list2 = [1,3,4]',
        expectedOutput: '[1,1,2,3,4,4]',
        explanation: 'Combined sorted elements.',
      },
      {
        id: 'tc_7_2',
        input: 'list1 = [], list2 = []',
        expectedOutput: '[]',
        explanation: 'Both empty lists result in empty array.',
      },
      {
        id: 'tc_7_3',
        input: 'list1 = [], list2 = [0]',
        expectedOutput: '[0]',
        explanation: 'Empty list combined with single element.',
      },
    ],
    solutionHints: [
      'Use two pointers pointing to the heads of list1 and list2.',
      'Compare elements at both pointers, append the smaller one, and advance that pointer.',
      'Append any remaining elements from the unfinished list.',
    ],
    targetTimeComplexity: 'O(n + m)',
    targetSpaceComplexity: 'O(n + m)',
  },
];
