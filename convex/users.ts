// user.ts
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Default stats for new users
const NEW_USER_DEFAULTS = {
  currentLevel: 1,
  currentXP: 0,
  role: "Novice",
  totalSkills: 0,
  totalTests: 0,
  totalProjects: 0,
  totalCertifications: 0,
};

// ==========================================
// 1. FRONTEND FUNCTIONS (Called by React)
// ==========================================

export const storeUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    // Use 'subject' to match the Clerk ID
    const userId = identity.subject;

    // Check if user exists
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", userId))
      .unique();

    if (user !== null) {
      // Optional: You could update the name/image here if it changed
      return user._id;
    }

    // If new, create record with defaults
    const newUserId = await ctx.db.insert("users", {
      clerkId: userId,
      name: identity.name || "Anonymous",
      email: identity.email!,
      image: identity.pictureUrl,
      ...NEW_USER_DEFAULTS, // Spread default stats
    });

    return newUserId;
  },
});

export const getUserProfile = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const userId = identity.subject;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", userId))
      .unique();

    return user; // Returns the single combined object
  },
});

// ==========================================
// 2. WEBHOOK FUNCTIONS (Called by Clerk)
// ==========================================

export const syncUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (existingUser) return;

    // Insert with identity args + defaults
    await ctx.db.insert("users", {
      ...args,
      ...NEW_USER_DEFAULTS,
    });
  },
});

export const updateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!existingUser) return;

    // Only patch the identity fields, leave stats alone
    await ctx.db.patch(existingUser._id, {
      name: args.name,
      email: args.email,
      image: args.image,
    });
  },
});
