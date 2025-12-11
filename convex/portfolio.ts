import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ==========================================
// 1. CERTIFICATES LOGIC
// ==========================================

export const getCertificates = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("certificates")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

export const addCertificate = mutation({
  args: {
    name: v.string(),
    issuer: v.string(),
    issueDate: v.string(),
    certificateLink: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    await ctx.db.insert("certificates", {
      userId: user._id,
      ...args,
    });

    await ctx.db.patch(user._id, {
      totalCertifications: (user.totalCertifications || 0) + 1,
    });
  },
});

// ==========================================
// 2. PROJECT LOGIC (Simple List for Profile Modal)
// ==========================================

export const getProjects = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

// ==========================================
// 3. PROJECT FEED LOGIC (For Projects Page)
// ==========================================

// GET ALL PROJECTS (Feed)
export const getProjectFeed = query({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").order("desc").take(50);

    const projectsWithAuthor = await Promise.all(
      projects.map(async (p) => {
        const author = await ctx.db.get(p.userId);
        return {
          ...p,
          author: author ? {
            name: author.name,
            image: author.image,
            clerkId: author.clerkId,
            _id: author._id,
            role: author.role,
          } : null
        };
      })
    );
    return projectsWithAuthor.filter(p => p.author !== null);
  },
});

// SEARCH PROJECTS
export const searchProjects = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    if (!args.searchTerm) return [];

    const projects = await ctx.db
      .query("projects")
      .withSearchIndex("search_projects", (q) => q.search("title", args.searchTerm))
      .take(20);

    const projectsWithAuthor = await Promise.all(
      projects.map(async (p) => {
        const author = await ctx.db.get(p.userId);
        return {
          ...p,
          author: author ? {
            name: author.name,
            image: author.image,
            clerkId: author.clerkId,
            _id: author._id,
            role: author.role,
          } : null
        };
      })
    );

    return projectsWithAuthor.filter(p => p.author !== null);
  },
});

// ADD PROJECT
export const addProject = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    techStack: v.string(),
    githubLink: v.optional(v.string()),
    youtubeLink: v.optional(v.string()),
    imageUrls: v.optional(v.string()),
    liveLink: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    await ctx.db.insert("projects", { userId: user._id, ...args });
    await ctx.db.patch(user._id, { totalProjects: (user.totalProjects || 0) + 1 });
  },
});

// EDIT PROJECT
export const editProject = mutation({
  args: {
    projectId: v.id("projects"),
    title: v.string(),
    description: v.string(),
    techStack: v.string(),
    githubLink: v.optional(v.string()),
    youtubeLink: v.optional(v.string()),
    imageUrls: v.optional(v.string()),
    liveLink: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const project = await ctx.db.get(args.projectId);
    if (!project) throw new Error("Project not found");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
      
    if (!user || user._id !== project.userId) {
      throw new Error("Unauthorized");
    }

    const { projectId, ...updates } = args;
    await ctx.db.patch(projectId, updates);
  },
});

// DELETE PROJECT
export const deleteProject = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    const project = await ctx.db.get(args.projectId);
    if (!project) return;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user || user._id !== project.userId) {
      throw new Error("Unauthorized");
    }

    await ctx.db.delete(args.projectId);
    await ctx.db.patch(user._id, { totalProjects: Math.max(0, (user.totalProjects || 0) - 1) });
  },
});
