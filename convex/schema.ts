// schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    // Identity
    clerkId: v.string(),
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),

    // Gamification & Stats (Merged from userDetails)
    currentLevel: v.number(),
    currentXP: v.number(),
    role: v.string(),
    totalSkills: v.number(),
    totalTests: v.number(),
    totalProjects: v.number(),
    totalCertifications: v.number(),
  }).index("by_clerk_id", ["clerkId"]),
});
