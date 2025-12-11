import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createInterview = mutation({
  args: {
    title: v.string(),
    type: v.union(v.literal("interview"), v.literal("test")), // Matches schema strictness
    candidateId: v.string(), // The Clerk ID of the user being interviewed
    startTime: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Check if the creator is an admin/interviewer if needed
    // const user = await ctx.db.query("users").withIndex("by_clerk_id", ...).first();
    // if (user?.role !== "admin") throw new Error("Only admins can schedule interviews");

    const interviewId = await ctx.db.insert("interviews", {
      title: args.title,
      type: args.type,
      candidateId: args.candidateId,
      interviewerId: identity.subject, // Store the creator as the interviewer
      startTime: args.startTime,
      status: "scheduled", // Default status
      streamCallId: undefined, // Will be generated/added later
    });

    return interviewId;
  },
});

export const assignStreamCallId = mutation({
  args: {
    interviewId: v.id("interviews"),
    streamCallId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    await ctx.db.patch(args.interviewId, {
      streamCallId: args.streamCallId,
    });
  },
});

export const getMyInterviews = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    // Uses the index defined in schema.ts: .index("by_candidate_id", ["candidateId"])
    const interviews = await ctx.db
      .query("interviews")
      .withIndex("by_candidate_id", (q) =>
        q.eq("candidateId", identity.subject)
      )
      .collect();

    return interviews;
  },
});

export const getInterviewByStreamCallId = query({
  args: {
    streamCallId: v.string(),
  },
  handler: async (ctx, args) => {
    // Uses the index defined in schema.ts: .index("by_stream_call_id", ["streamCallId"])
    return await ctx.db
      .query("interviews")
      .withIndex("by_stream_call_id", (q) =>
        q.eq("streamCallId", args.streamCallId)
      )
      .first();
  },
});

export const updateInterviewStatus = mutation({
  args: {
    interviewId: v.id("interviews"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    await ctx.db.patch(args.interviewId, {
      status: args.status,
    });
  },
});
