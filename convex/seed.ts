import { mutation } from "./_generated/server";

export const addDummyData = mutation({
  args: {},
  handler: async (ctx) => {
    const dummyUsers = [
      {
        name: "Alice Wonderland",
        email: "alice@example.com",
        clerkId: "user_dummy_1",
        image: "https://i.pravatar.cc/150?u=alice",
        role: "Wizard",
        currentXP: 1500,  // Rank 2
        currentLevel: 5,
        totalSkills: 12,
        totalTests: 5,
        totalProjects: 2,
        totalCertifications: 1,
      },
      {
        name: "Bob Builder",
        email: "bob@example.com",
        clerkId: "user_dummy_2",
        image: "https://i.pravatar.cc/150?u=bob",
        role: "Novice",
        currentXP: 300,   // Rank 4
        currentLevel: 2,
        totalSkills: 4,
        totalTests: 1,
        totalProjects: 0,
        totalCertifications: 0,
      },
      {
        name: "Charlie Chaplin",
        email: "charlie@example.com",
        clerkId: "user_dummy_3",
        image: "https://i.pravatar.cc/150?u=charlie",
        role: "Master",
        currentXP: 2500,  // Rank 1 (The Winner)
        currentLevel: 8,
        totalSkills: 20,
        totalTests: 10,
        totalProjects: 5,
        totalCertifications: 3,
      },
      {
        name: "Dana Scully",
        email: "dana@example.com",
        clerkId: "user_dummy_4",
        image: "https://i.pravatar.cc/150?u=dana",
        role: "Expert",
        currentXP: 800,   // Rank 3
        currentLevel: 3,
        totalSkills: 8,
        totalTests: 3,
        totalProjects: 1,
        totalCertifications: 1,
      },
    ];

    for (const user of dummyUsers) {
      await ctx.db.insert("users", user);
    }

    return "Successfully added 4 dummy users!";
  },
});