"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";

// 1. Safety Check: Ensure the URL exists to prevent build crashes
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

// 2. Only instantiate if we have a URL (prevents "undefined" constructor error)
// Note: If this is null, the app won't work, but it won't crash the build immediately
const convex = convexUrl ? new ConvexReactClient(convexUrl) : undefined;

function ConvexClerkProvider({ children }: { children: React.ReactNode }) {
  // 3. If environment variables are missing, render children safely (or a clean error)
  // This allows the build to finish even if variables are momentarily missing
  if (!convex || !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    console.warn(
      "⚠️ Convex or Clerk environment variables are missing. Auth disabled."
    );
    // In production, you might want to throw an error, but for debugging build:
    return <>{children}</>;
  }

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

export default ConvexClerkProvider;
