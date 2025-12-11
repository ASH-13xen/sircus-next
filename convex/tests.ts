import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Ideally, this should be consistent with your Clerk PROCTOR_EMAIL
const PROCTOR_EMAIL = process.env.PROCTOR_EMAIL;

// --- PROCTOR FUNCTIONS ---

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

    // Return tests that are in the future OR currently live
    // (We want the user to see the "Enter Test" button if status is 'live')
    return tests.filter((t) => t && (t.startTime > now || t.status === "live"));
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

    // 1. Mark test as completed
    await ctx.db.patch(args.testId, {
      status: "completed",
    });

    // 2. Update the registration with the score
    const registration = await ctx.db
      .query("registrations")
      .withIndex("by_test", (q) => q.eq("testId", args.testId))
      .first();

    if (registration) {
      await ctx.db.patch(registration._id, {
        score: args.score,
        status: "completed",
      });
    }
  },
});
