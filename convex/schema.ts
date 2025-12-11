import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    currentLevel: v.number(),
    currentXP: v.number(),
    role: v.string(),
    totalSkills: v.number(),
    totalTests: v.number(),
    totalProjects: v.number(),
    totalCertifications: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  tests: defineTable({
    title: v.string(),
    domain: v.string(),
    topic: v.string(),
    startTime: v.number(),
    durationMinutes: v.number(),
    maxPoints: v.number(),
    createdBy: v.string(),
    status: v.optional(v.string()),
    meetingId: v.optional(v.string()),
  }).index("by_creator", ["createdBy"]),

  interviews: defineTable({
    title: v.string(),
    type: v.union(v.literal("interview"), v.literal("test")),
    candidateId: v.string(),
    interviewerId: v.string(),
    streamCallId: v.optional(v.string()),
    status: v.string(),
    startTime: v.number(),
  })
    .index("by_candidate_id", ["candidateId"])
    .index("by_stream_call_id", ["streamCallId"]),

  registrations: defineTable({
    testId: v.id("tests"),
    userId: v.string(),
    status: v.string(),
    score: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_test", ["testId"]),
});
