"use node";

// convex/stream.ts
import { action } from "./_generated/server";
import { StreamClient } from "@stream-io/node-sdk";

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const SECRET = process.env.STREAM_SECRET_KEY;

export const generateStreamToken = action({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    if (!API_KEY || !SECRET) {
      throw new Error("Stream keys are missing in environment variables");
    }

    const client = new StreamClient(API_KEY, SECRET);

    // Generate token valid for 1 hour for this specific user
    const token = client.createToken(identity.subject);

    return token;
  },
});
