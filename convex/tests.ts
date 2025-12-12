import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getLevelFromXP, getRoleFromXP } from "./gameLogic";

// Ideally, this should be consistent with your Clerk PROCTOR_EMAIL
const PROCTOR_EMAIL = process.env.PROCTOR_EMAIL;

// --- PROCTOR FUNCTIONS ---
export const updateCode = mutation({
  args: {
    testId: v.id("tests"),
    code: v.string(),
    language: v.string(),
  },
  handler: async (ctx, args) => {
    // Note: In a real app, you might want to debounce this or use checking
    // to ensure only the candidate can type, but for now we allow both.
    await ctx.db.patch(args.testId, {
      currentCode: args.code,
      language: args.language,
    });
  },
});

// Update the problem statement (Proctor only)
export const setProblem = mutation({
  args: { testId: v.id("tests"), problem: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.testId, { problemStatement: args.problem });
  },
});

export const createTest = mutation({
  args: {
    title: v.string(),
    domain: v.string(),
    topic: v.string(),
    startTime: v.number(),
    durationMinutes: v.number(),
    maxPoints: v.number(),
    // Added meetingId so it can be stored (matches schema)
    meetingId: v.optional(v.string()),
    status: v.union(
      v.literal("scheduled"),
      v.literal("live"),
      v.literal("completed")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Security Check
    if (identity.email !== PROCTOR_EMAIL) {
      throw new Error("Access Denied: Only the Proctor can create tests.");
    }

    await ctx.db.insert("tests", {
      ...args,
      createdBy: identity.email!, // We store email to link back to proctor
    });
  },
});

export const getMyHostedTests = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    // Return empty if not logged in or not proctor
    if (!identity || identity.email !== PROCTOR_EMAIL) return [];

    // Fetch tests created by this proctor
    const tests = await ctx.db
      .query("tests")
      .withIndex("by_creator", (q) => q.eq("createdBy", identity.email!))
      .collect();

    // Sort by start time (nearest first)
    return tests.sort((a, b) => a.startTime - b.startTime);
  },
});

export const getTestById = query({
  args: { testId: v.id("tests") },
  handler: async (ctx, args) => {
    const test = await ctx.db.get(args.testId);
    if (!test) return null;

    // Check if the current user is registered for this test
    const identity = await ctx.auth.getUserIdentity();
    let isRegistered = false;

    if (identity) {
      const registration = await ctx.db
        .query("registrations")
        .withIndex("by_test", (q) => q.eq("testId", args.testId))
        .filter((q) => q.eq(q.field("userId"), identity.subject))
        .first();
      isRegistered = !!registration;
    }

    return { ...test, isRegistered };
  },
});
export const submitTest = mutation({
  args: { testId: v.id("tests") },
  handler: async (ctx, args) => {
    // 1. Mark the test as submitted/completed in the database
    await ctx.db.patch(args.testId, {
      status: "completed", // OR use isSubmitted: true, depending on your schema
    });
  },
});

// --- USER FUNCTIONS ---

export const registerForTest = mutation({
  args: { testId: v.id("tests") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // 1. Check if ANYONE has registered for this test
    const existingRegistration = await ctx.db
      .query("registrations")
      .withIndex("by_test", (q) => q.eq("testId", args.testId))
      .first();

    // If result is found, it means the slot is taken
    if (existingRegistration) {
      throw new Error("This test has already been taken by another user.");
    }

    // 2. If free, book it for the current user
    await ctx.db.insert("registrations", {
      testId: args.testId,
      userId: identity.subject,
      status: "registered",
    });
  },
});

export const getAvailableTests = query({
  handler: async (ctx) => {
    // 1. Get ALL tests
    const allTests = await ctx.db.query("tests").collect();
    const now = Date.now();

    // 2. Get ALL registrations (Globally)
    const allRegistrations = await ctx.db.query("registrations").collect();

    // 3. Create a Set of "Taken" Test IDs
    const takenTestIds = new Set(allRegistrations.map((r) => r.testId));

    // 4. Return tests that are:
    //    a) NOT taken
    //    b) In the future (startTime > now)
    //    c) Status is explicitly 'scheduled' (hide completed/live ones)
    return allTests.filter(
      (t) =>
        !takenTestIds.has(t._id) &&
        t.startTime > now &&
        t.status === "scheduled"
    );
  },
});

export const getUpcomingTests = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const userId = identity.subject;
    const now = Date.now();

    const myRegistrations = await ctx.db
      .query("registrations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const tests = await Promise.all(
      myRegistrations.map(async (r) => {
        const test = await ctx.db.get(r.testId);
        return test;
      })
    );

    // FIXED FILTER:
    // 1. Must be in future OR live
    // 2. AND must NOT be completed (even if time is in future)
    return tests.filter(
      (t) =>
        t &&
        (t.startTime > now || t.status === "live") &&
        t.status !== "completed" // <--- THIS WAS MISSING
    );
  },
});

export const getPastTests = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const userId = identity.subject;
    const now = Date.now();

    const myRegistrations = await ctx.db
      .query("registrations")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const tests = await Promise.all(
      myRegistrations.map(async (r) => {
        const test = await ctx.db.get(r.testId);
        // Attach the score from registration to the test object
        return test ? { ...test, myScore: r.score } : null;
      })
    );

    // Filter for tests that are completed OR time has passed and they aren't live
    return tests.filter(
      (t) =>
        (t && t.startTime <= now && t.status !== "live") ||
        t?.status === "completed"
    );
  },
});

export const updateTestStatus = mutation({
  args: {
    testId: v.id("tests"),
    status: v.union(
      v.literal("scheduled"),
      v.literal("live"),
      v.literal("completed")
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Only allow Proctor to update status
    if (identity.email !== PROCTOR_EMAIL) {
      throw new Error("Only proctor can update status");
    }

    await ctx.db.patch(args.testId, {
      status: args.status,
    });
  },
});

export const finalizeTestResult = mutation({
  args: {
    testId: v.id("tests"),
    score: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || identity.email !== PROCTOR_EMAIL)
      throw new Error("Unauthorized");

    // 1. Fetch Test Data (to get maxPoints)
    const test = await ctx.db.get(args.testId);
    if (!test) throw new Error("Test not found");

    // 2. Mark test as completed
    await ctx.db.patch(args.testId, {
      status: "completed",
    });

    // 3. Find the Registration to get the User ID
    const registration = await ctx.db
      .query("registrations")
      .withIndex("by_test", (q) => q.eq("testId", args.testId))
      .first();

    if (!registration) throw new Error("No registration found for this test");

    // 4. Update the Registration
    await ctx.db.patch(registration._id, {
      score: args.score,
      status: "completed",
    });

    // --- GAME LOGIC START ---

    // 5. Calculate XP Earned
    // Formula: (Given / Total) * 1000
    const ratio = args.score / test.maxPoints;
    const xpEarned = Math.floor(ratio * 1000);

    // 6. Fetch the User Profile
    // Note: registration.userId stores the Clerk Subject ID.
    // We need to find the user in your 'users' table using the index we defined.
    const userProfile = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", registration.userId))
      .first();

    if (userProfile) {
      const newTotalXP = (userProfile.currentXP || 0) + xpEarned;
      const newLevel = getLevelFromXP(newTotalXP);
      const newRole = getRoleFromXP(newTotalXP);

      // 7. Update User Stats
      await ctx.db.patch(userProfile._id, {
        currentXP: newTotalXP,
        currentLevel: newLevel,
        role: newRole,
        totalTests: (userProfile.totalTests || 0) + 1, // Increment total tests taken
      });
    }
    // --- GAME LOGIC END ---
  },
});

export const updateTestOutput = mutation({
  args: {
    testId: v.id("tests"),
    output: v.string(),
  },
  handler: async (ctx, args) => {
    // This saves the console execution result to the DB
    // so the proctor can see it in real-time.
    await ctx.db.patch(args.testId, {
      consoleOutput: args.output,
    });
  },
});

export const updateQuestion = mutation({
  args: { testId: v.id("tests"), question: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.testId, { question: args.question });
  },
});

export const updateOutput = mutation({
  args: { testId: v.id("tests"), output: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.testId, { output: args.output });
  },
});
