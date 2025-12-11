"use node"; // This file stays in Node.js

import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api"; // Import 'internal' to call other files
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const createOrder = action({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const amount = 49900; 

    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return order.id;
  },
});

export const verifyPayment = action({
  args: {
    razorpay_order_id: v.string(),
    razorpay_payment_id: v.string(),
    razorpay_signature: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(args.razorpay_order_id + "|" + args.razorpay_payment_id)
      .digest("hex");

    if (generated_signature === args.razorpay_signature) {
      await ctx.runMutation(internal.users.markAsPremium, {
        clerkId: identity.subject,
      });
      return { success: true };
    } else {
      throw new Error("Invalid signature");
    }
  },
});