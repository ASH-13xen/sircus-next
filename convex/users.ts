// user.ts
import { mutation, query } from "./_generated/server";
import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getRoleFromXP, getLevelFromXP } from "./gameLogic";
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

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) return null;

    // Convert storage ID to a useful URL
    let resumeUrl = null;
    if (user.resumeStorageId) {
      resumeUrl = await ctx.storage.getUrl(user.resumeStorageId);
    }
    let transcriptUrl = null;
    if (user.transcriptStorageId) {
      transcriptUrl = await ctx.storage.getUrl(user.transcriptStorageId);
    }

    return { ...user, resumeUrl, transcriptUrl };
  },
});
//update resume
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// 2. NEW: Save the storage ID after the frontend finishes uploading
export const updateResume = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      resumeStorageId: args.storageId,
    });
  },
});
//transcript upload
export const updateTranscript = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      transcriptStorageId: args.storageId,
    });
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
export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) return null;

    // Convert storage ID to a useful URL
    let resumeUrl = null;
    if (user.resumeStorageId) {
      resumeUrl = await ctx.storage.getUrl(user.resumeStorageId);
    }
    let transcriptUrl = null;
    if (user.transcriptStorageId) {
      transcriptUrl = await ctx.storage.getUrl(user.transcriptStorageId);
    }

    return { ...user, resumeUrl, transcriptUrl };
  },
});
export const getLeaderboard = query({
  args: {
    // We now accept arrays!
    years: v.optional(v.array(v.number())),
    branches: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // 1. Fetch the Top 200 global users (sorted by XP)
    // We fetch more than 10 because we might filter many out.
    // For a college app, filtering in memory is perfectly fine and fast.
    const allTopUsers = await ctx.db
      .query("users")
      .withIndex("by_xp")
      .order("desc")
      .take(200);

    // 2. Filter in Memory (The Logic)
    const filtered = allTopUsers.filter((user) => {
      // Check Year (if filter exists)
      const matchesYear = 
        !args.years || 
        args.years.length === 0 || 
        (user.collegeYear && args.years.includes(user.collegeYear));

      // Check Branch (if filter exists)
      const matchesBranch = 
        !args.branches || 
        args.branches.length === 0 || 
        (user.branch && args.branches.includes(user.branch));

      return matchesYear && matchesBranch;
    });

    // 3. Return Top 10 of the filtered list
    return filtered.slice(0, 10);
  },
});
export const searchUsers = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    if (!args.searchTerm) return [];

    // Use the search index
    return await ctx.db
      .query("users")
      .withSearchIndex("search_name", (q) => q.search("name", args.searchTerm))
      .take(5); // Limit to top 5 matches
  },
});
export const updateProfileDetails = mutation({
  args: {
    branch: v.string(),
    collegeYear: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
      
    if (!user) throw new Error("User not found");
    
    await ctx.db.patch(user._id, {
      branch: args.branch,
      collegeYear: args.collegeYear,
    });
  }
});
export const addXP = mutation({
  args: {
    userId: v.id("users"),
    xpToAdd: v.number(),
  },
  handler: async (ctx, args) => {
    // 1. Get the current user
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    // 2. Calculate new totals
    const newXP = (user.currentXP || 0) + args.xpToAdd;
    
    // 3. AUTOMATION: Calculate new Role and Level based on new XP
    const newRole = getRoleFromXP(newXP);
    const newLevel = getLevelFromXP(newXP);

    // 4. Save everything at once
    await ctx.db.patch(args.userId, {
      currentXP: newXP,
      role: newRole,      // <--- Automatically updates role!
      currentLevel: newLevel, // <--- Automatically updates level!
    });
    
    return `Gained ${args.xpToAdd} XP! You are now a ${newRole}.`;
  },
});

//premium mutation
export const markAsPremium = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (user) {
      await ctx.db.patch(user._id, { isPremium: true });
    }
  },
});
export const updateAcademicDetails = mutation({
  args: {
    branch: v.string(),
    collegeYear: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    // 1. Get current count (default to 0)
    const currentCount = user.profileUpdateCount || 0;

    // 2. ENFORCE LIMIT: If they used 2 attempts, STOP THEM.
    if (currentCount >= 2) {
      throw new Error("Academic details are locked. You have used your edit attempts.");
    }

    // 3. Update fields and increment count
    await ctx.db.patch(user._id, {
      branch: args.branch,
      collegeYear: args.collegeYear,
      profileUpdateCount: currentCount + 1,
    });

    return "Profile updated successfully";
  },
});