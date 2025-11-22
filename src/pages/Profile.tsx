"use client";

import { useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Loader2, LogIn } from "lucide-react";

// --- FIX: Correctly map the imports to the file names ---
import StatsProfile from "@/components/profile/StatsProfile"; // Was StatsGrid
import ProfileHeader from "@/components/profile/ProfileHeader";
import LevelProgress from "@/components/profile/LevelProgress";

export default function Profile() {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();

  // NOTE: Ensure your file in convex/ is named 'user.ts' (singular).
  // If it is 'users.ts', keep api.users.
  const userData = useQuery(api.users.getUserProfile);
  const storeUser = useMutation(api.users.storeUser);

  // Auto-Sync Effect
  useEffect(() => {
    if (isClerkLoaded && clerkUser && userData === null) {
      storeUser({});
    }
  }, [isClerkLoaded, clerkUser, userData, storeUser]);

  // --- LOADING STATE ---
  if (userData === undefined || !isClerkLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // --- NOT LOGGED IN STATE ---
  if (!clerkUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6 px-4 text-center">
        <div className="p-4 rounded-full bg-primary/10">
          <LogIn className="w-10 h-10 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-display text-foreground">
            Please Log In
          </h2>
          <p className="text-muted-foreground max-w-md">
            You need to be signed in to view your profile.
          </p>
        </div>
        <SignInButton mode="modal">
          <Button size="lg">Sign In / Sign Up</Button>
        </SignInButton>
      </div>
    );
  }

  // --- SYNCING STATE ---
  if (userData === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">
          Setting up your profile...
        </p>
      </div>
    );
  }

  // --- MAIN CONTENT ---
  return (
    <div className="min-h-screen bg-background">
      {/* Top Section */}
      <div className="bg-linear-to-br from-cyan-900/20 via-background to-teal-900/20 py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            {/* 1. Header Component */}
            <ProfileHeader
              name={userData.name}
              email={userData.email}
              image={userData.image}
              role={userData.role}
              joinDate={userData._creationTime}
            />

            {/* 2. Level Progress Component */}
            <LevelProgress
              currentLevel={userData.currentLevel}
              currentXP={userData.currentXP}
            />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* 3. Stats Component (Renamed from StatsGrid) */}
          <StatsProfile
            totalSkills={userData.totalSkills}
            totalTests={userData.totalTests}
            totalProjects={userData.totalProjects}
            totalCertifications={userData.totalCertifications}
          />
        </div>
      </div>
    </div>
  );
}
