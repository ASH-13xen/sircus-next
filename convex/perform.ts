import { mutation, query, action } from "./_generated/server";
import { v } from "convex/values";

// --- TYPES ---
type Question = {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  userCode?: string;
  isSolved?: boolean;
};

// --- HELPER: QUESTION BANK ---
function getQuestionsForSkill(skill: string): Question[] {
  const normalizedSkill = skill.toLowerCase();

  switch (normalizedSkill) {
    case "web-development":
      return [
        {
          id: "web_1",
          title: "React Counter with Limits",
          description:
            "Create a Counter component. It should not go below 0 or above 10. Display the current count in an h1 tag.",
          starterCode: `import React, { useState } from 'react';

export default function Counter() {
  // TODO: Implement state and logic
  return (
    <div>
      <h1>Count: 0</h1>
      <button>Increment</button>
      <button>Decrement</button>
    </div>
  );
}`,
        },
        {
          id: "web_2",
          title: "Async Data Fetching",
          description:
            "Fetch user data from 'https://jsonplaceholder.typicode.com/users/1' and display the 'name' and 'email'. Handle the loading state.",
          starterCode: `import React, { useEffect, useState } from 'react';

export default function UserProfile() {
  // TODO: Fetch data on mount
  return (
    <div>
      {/* Display Name and Email */}
    </div>
  );
}`,
        },
        {
          id: "web_3",
          title: "JS: Array Filtering",
          description:
            "Given an array of products, write a function to return only products that are 'inStock' and price is below 50.",
          starterCode: `function filterProducts(products) {
  // products is an array of objects: { id, price, inStock }
  // Your code here
}`,
        },
        {
          id: "web_4",
          title: "JS: Debounce Function",
          description:
            "Implement a debounce function that limits the rate at which a function can fire.",
          starterCode: `function debounce(func, delay) {
  // Return a function that triggers 'func' only after 'delay' ms
}`,
        },
        {
          id: "web_5",
          title: "CSS to JS Object",
          description:
            "Convert a kebab-case CSS string (e.g., 'background-color') to camelCase (e.g., 'backgroundColor').",
          starterCode: `function toCamelCase(str) {
  // Your code here
}`,
        },
        {
          id: "web_6",
          title: "React: Prop Drilling",
          description:
            "Fix the prop drilling issue in the provided component structure using Context API (Conceptual implementation).",
          starterCode: `// Write your Context setup here
const UserContext = React.createContext();
`,
        },
      ];

    case "dsa":
      return [
        {
          id: "dsa_1",
          title: "Two Sum",
          description:
            "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
          starterCode: `function twoSum(nums, target) {
  // Write your solution here
}`,
        },
        {
          id: "dsa_2",
          title: "Valid Palindrome",
          description:
            "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
          starterCode: `function isPalindrome(s) {
  // Write your solution here
}`,
        },
        {
          id: "dsa_3",
          title: "Reverse Linked List",
          description:
            "Given the head of a singly linked list, reverse the list, and return the reversed list.",
          starterCode: `function reverseList(head) {
  // Definition for singly-linked list.
  // function ListNode(val, next) { this.val = (val===undefined ? 0 : val); this.next = (next===undefined ? null : next); }
}`,
        },
        {
          id: "dsa_4",
          title: "Best Time to Buy Stock",
          description:
            "Maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
          starterCode: `function maxProfit(prices) {
  // Write your solution here
}`,
        },
        {
          id: "dsa_5",
          title: "Valid Parentheses",
          description:
            "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
          starterCode: `function isValid(s) {
  // Write your solution here
}`,
        },
        {
          id: "dsa_6",
          title: "Binary Search",
          description:
            "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums.",
          starterCode: `function search(nums, target) {
  // Write your solution here
}`,
        },
      ];

    case "aiml":
      return [
        {
          id: "ai_1",
          title: "Matrix Transpose",
          description:
            "Write a function to compute the transpose of a 2D matrix (list of lists).",
          starterCode: `def transpose(matrix):
    # Your code here
    pass`,
        },
        {
          id: "ai_2",
          title: "Cosine Similarity",
          description:
            "Calculate the cosine similarity between two vectors A and B.",
          starterCode: `import math

def cosine_similarity(A, B):
    # Your code here
    pass`,
        },
        {
          id: "ai_3",
          title: "Data Normalization",
          description:
            "Implement Min-Max scaling to normalize a list of numbers to the range [0, 1].",
          starterCode: `def min_max_scale(data):
    # data is a list of numbers
    pass`,
        },
        {
          id: "ai_4",
          title: "Word Frequency (BoW)",
          description:
            "Implement a simple Bag of Words model. Count the frequency of each word in a sentence.",
          starterCode: `def bag_of_words(sentence):
    # Return a dictionary of word counts
    pass`,
        },
        {
          id: "ai_5",
          title: "ReLU Activation",
          description:
            "Implement the Rectified Linear Unit (ReLU) activation function.",
          starterCode: `def relu(x):
    # Return max(0, x)
    pass`,
        },
        {
          id: "ai_6",
          title: "Euclidean Distance",
          description:
            "Calculate the Euclidean distance between two points (lists) p1 and p2.",
          starterCode: `def euclidean_distance(p1, p2):
    # Your code here
    pass`,
        },
      ];

    case "cybersecurity":
      return [
        {
          id: "sec_1",
          title: "Caesar Cipher Decoder",
          description:
            "Write a function to decode a string encrypted with Caesar Cipher given a shift value.",
          starterCode: `def decrypt_caesar(text, shift):
    # Your code here
    pass`,
        },
        {
          id: "sec_2",
          title: "Log Parsing",
          description:
            "Given a raw log string, extract all IP addresses using Regex.",
          starterCode: `import re

def extract_ips(log_text):
    # Return a list of IPs
    pass`,
        },
        {
          id: "sec_3",
          title: "Password Strength Checker",
          description:
            "Check if a password has 8+ chars, 1 uppercase, 1 lowercase, 1 number, and 1 special char.",
          starterCode: `def check_strength(password):
    # Return True or False
    pass`,
        },
        {
          id: "sec_4",
          title: "Hash Comparison",
          description:
            "Simulate a login check. Compare a plaintext password against a stored MD5 hash (assume hashlib is imported).",
          starterCode: `import hashlib

def verify_password(plain, stored_hash):
    # Your code here
    pass`,
        },
        {
          id: "sec_5",
          title: "Port Scanner Logic",
          description:
            "Given a list of open ports and a target port, return 'Open' if target is in list, else 'Closed'.",
          starterCode: `def check_port(open_ports, target):
    # Your code here
    pass`,
        },
        {
          id: "sec_6",
          title: "Base64 Encoder",
          description:
            "Implement a basic string to Base64 encoder (using library is fine).",
          starterCode: `import base64

def to_base64(text):
    # Your code here
    pass`,
        },
      ];

    default:
      return [
        {
          id: "gen_1",
          title: "Hello World",
          description: "Print hello world to the console.",
          starterCode: "print('hello world')",
        },
      ];
  }
}

// --- QUERIES & MUTATIONS ---

// 1. Get Server Time (For Global Timer Sync)
export const getServerTime = query({
  handler: async () => {
    return Date.now();
  },
});

// 2. Check Cooldown (Before creating test)
export const checkCooldown = query({
  args: { skill: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { allowed: false, daysRemaining: 0 };

    const tenDaysInMs = 10 * 24 * 60 * 60 * 1000;

    const lastTest = await ctx.db
      .query("perform_tests")
      .withIndex("by_user_skill", (q) =>
        q.eq("userId", identity.subject).eq("skill", args.skill)
      )
      .order("desc")
      .first();

    if (!lastTest) {
      return { allowed: true, daysRemaining: 0 };
    }

    const timeDiff = Date.now() - lastTest.startTime;

    if (timeDiff < tenDaysInMs) {
      const remainingMs = tenDaysInMs - timeDiff;
      const daysRemaining = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));
      return { allowed: false, daysRemaining };
    }

    return { allowed: true, daysRemaining: 0 };
  },
});

// 3. Create Test (Starts Timer)
export const createPerformTest = mutation({
  args: {
    skill: v.string(),
    language: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Double-Check Cooldown (Security)
    const tenDaysInMs = 10 * 24 * 60 * 60 * 1000;
    const lastTest = await ctx.db
      .query("perform_tests")
      .withIndex("by_user_skill", (q) =>
        q.eq("userId", identity.subject).eq("skill", args.skill)
      )
      .order("desc")
      .first();

    if (lastTest) {
      const timeDiff = Date.now() - lastTest.startTime;
      if (timeDiff < tenDaysInMs) {
        throw new Error(`Cooldown active. Please wait.`);
      }
    }

    const questions = getQuestionsForSkill(args.skill);

    const testId = await ctx.db.insert("perform_tests", {
      userId: identity.subject,
      skill: args.skill,
      language: args.language,
      status: "live",
      startTime: Date.now(),
      questions: questions,
      currentCode: "",
      score: 0,
    });

    return testId;
  },
});

// 4. Get Test Data
export const getPerformTest = query({
  args: { testId: v.id("perform_tests") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.testId);
  },
});

// 5. Save Code (Per Question)
export const saveQuestionCode = mutation({
  args: {
    testId: v.id("perform_tests"),
    questionIndex: v.number(),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const test = await ctx.db.get(args.testId);
    if (!test) throw new Error("Test not found");

    const newQuestions = [...test.questions];
    newQuestions[args.questionIndex].userCode = args.code;

    await ctx.db.patch(args.testId, { questions: newQuestions });
  },
});

// 6. Mark Question as Solved
export const markQuestionSolved = mutation({
  args: {
    testId: v.id("perform_tests"),
    questionIndex: v.number(),
    isSolved: v.boolean(),
  },
  handler: async (ctx, args) => {
    const test = await ctx.db.get(args.testId);
    if (!test) throw new Error("Test not found");

    const newQuestions = [...test.questions];
    newQuestions[args.questionIndex].isSolved = args.isSolved;

    await ctx.db.patch(args.testId, { questions: newQuestions });
  },
});

// 7. Submit Test (Calculates Rank)
export const submitPerformTest = mutation({
  args: { testId: v.id("perform_tests") },
  handler: async (ctx, args) => {
    const test = await ctx.db.get(args.testId);
    if (!test) throw new Error("Test not found");

    // Prevent re-submission if already done
    if (test.status !== "live") return;

    // 1. Calculate Score
    const solvedCount = test.questions.filter((q) => q.isSolved).length;
    const passed = solvedCount >= 5;

    // 2. Update Test Status
    await ctx.db.patch(args.testId, {
      status: passed ? "passed" : "failed",
      score: solvedCount,
    });

    // 3. Update User XP & Rank
    if (solvedCount > 0) {
      const xpEarned = solvedCount * 100;

      // Find User
      const user = await ctx.db
        .query("users")
        .withIndex("by_clerk_id", (q) => q.eq("clerkId", test.userId))
        .first();

      if (user) {
        const newXP = (user.currentXP || 0) + xpEarned;

        let newRole = user.role;
        if (newXP > 1000) newRole = "Intermediate";
        if (newXP > 3000) newRole = "Advanced";
        if (newXP > 5000) newRole = "Expert";
        if (newXP > 10000) newRole = "Master";

        await ctx.db.patch(user._id, {
          currentXP: newXP,
          role: newRole,
        });
      }
    }
  },
});

export const runCode = action({
  args: {
    language: v.string(),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    // 1. Define Piston Runtime Configurations
    // These versions are standard on the Piston API.
    const runtimes: Record<string, { language: string; version: string }> = {
      javascript: { language: "javascript", version: "18.15.0" },
      python: { language: "python", version: "3.10.0" },
      java: { language: "java", version: "15.0.2" },
      cpp: { language: "c++", version: "10.2.0" },
      "c++": { language: "c++", version: "10.2.0" },
    };

    const config =
      runtimes[args.language.toLowerCase()] || runtimes["javascript"];

    try {
      const response = await fetch("https://emkc.org/api/v2/piston/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: config.language,
          version: config.version,
          files: [{ content: args.code }],
        }),
      });

      const data = await response.json();

      // Check if Piston returned an API-level error (e.g., unsupported version)
      if (data.message) {
        console.error("Piston API Error:", data.message);
        return `Error: ${data.message}`;
      }

      // Return standard output or error output
      return data.run.output || "No output returned.";
    } catch (error) {
      console.error("Execution Action Failed:", error);
      // Return a user-friendly string instead of throwing to prevent client crash
      return "Error: Failed to connect to the execution engine. Please try again.";
    }
  },
});
