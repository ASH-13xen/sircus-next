import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ... Keep users table as is ...
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
  }).index("by_clerk_id", ["clerkId"]) 
  .index("by_xp", ["currentXP"])
  .index("by_year_xp", ["collegeYear", "currentXP"])
  .searchIndex("search_name", { searchField: "name" }),
  // ... Keep tests table as is ...
  tests: defineTable({
    title: v.string(),
    domain: v.string(),
    topic: v.string(),
    startTime: v.number(),
    durationMinutes: v.number(),
    maxPoints: v.number(),
    createdBy: v.string(),
  }),

  // UPDATED: Add "by_test" index
  registrations: defineTable({
    testId: v.id("tests"),
    userId: v.string(),
    status: v.string(),
    score: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_test", ["testId"]), // <--- NEW INDEX
});
