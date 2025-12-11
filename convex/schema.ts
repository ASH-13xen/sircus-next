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
    isPremium: v.optional(v.boolean()),
    branch: v.optional(v.string()), // e.g., "CSE", "ECE", "DSAI"
    collegeYear: v.optional(v.number()),
    profileUpdateCount: v.optional(v.number()),
    resumeStorageId: v.optional(v.id("_storage")),
    transcriptStorageId: v.optional(v.id("_storage")),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_xp", ["currentXP"])
    .index("by_year_xp", ["collegeYear", "currentXP"])
    .searchIndex("search_name", { searchField: "name" }),
  certificates: defineTable({
    userId: v.id("users"),
    name: v.string(),
    issuer: v.string(), // e.g., "Coursera", "Udemy"
    issueDate: v.string(),
    certificateLink: v.string(),
  }).index("by_user", ["userId"]),

  // 2. PROJECTS TABLE
  projects: defineTable({
    userId: v.id("users"),
    title: v.string(),
    description: v.string(),
    techStack: v.string(), // e.g. "React, Convex, Tailwind"
    githubLink: v.optional(v.string()),
    youtubeLink: v.optional(v.string()), // New
    imageUrls: v.optional(v.string()),   // New (Comma separated string)
    liveLink: v.optional(v.string()),
  }).index("by_user", ["userId"])
  .searchIndex("search_projects", { 
    searchField: "title", 
    filterFields: ["userId"] 
  }),
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
    problemStatement: v.optional(v.string()),
    currentCode: v.optional(v.string()),
    language: v.optional(v.string()),
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
