import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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
      createdBy: identity.email!,
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
    // We need to know every test that has ever been booked
    const allRegistrations = await ctx.db.query("registrations").collect();

    // 3. Create a Set of "Taken" Test IDs
    const takenTestIds = new Set(allRegistrations.map((r) => r.testId));

    // 4. Return only tests that are NOT in the "Taken" set
    return allTests.filter(
      (t) => !takenTestIds.has(t._id) && t.startTime > now
    );
  },
});

// ... Keep getUpcomingTests and getPastTests exactly the same ...
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

    return tests.filter((t) => t && t.startTime > now);
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
        return test ? { ...test, myScore: r.score } : null;
      })
    );

    return tests.filter((t) => t && t.startTime <= now);
  },
});
