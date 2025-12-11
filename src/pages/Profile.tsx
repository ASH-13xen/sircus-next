"use client";

import { useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser, SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Loader2, LogIn } from "lucide-react";

// Import your Game Logic Helper
import { 
  getRoleFromXP, 
  getLevelFromXP, 
  getNextLevelXP 
} from "../../convex/gameLogic";

import StatsProfile from "@/components/profile/StatsProfile"; 
import ProfileHeader from "@/components/profile/ProfileHeader";
import LevelProgress from "@/components/profile/LevelProgress";

export default function Profile() {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
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

  // --- NOT LOGGED IN ---
  if (!clerkUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-6 px-4 text-center">
        <div className="p-4 rounded-full bg-primary/10">
          <LogIn className="w-10 h-10 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-display text-foreground">Please Log In</h2>
          <SignInButton mode="modal">
            <Button size="lg">Sign In / Sign Up</Button>
          </SignInButton>
        </div>
      </div>
    );
  }

  // --- SYNCING ---
  if (userData === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">Setting up your profile...</p>
      </div>
    );
  }

  // --- CALCULATE REAL-TIME STATS ---
  const displayLevel = getLevelFromXP(userData.currentXP);
  const displayRole = getRoleFromXP(userData.currentXP);
  const nextLevelGoal = getNextLevelXP(userData.currentXP);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-linear-to-br from-cyan-900/20 via-background to-teal-900/20 py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            
            {/* 1. Header: Now receives isPremium and dynamic Role */}
            <ProfileHeader
              name={userData.name}
              email={userData.email}
              image={userData.image}
              role={displayRole}  // Use calculated role
              joinDate={userData._creationTime}
              isPremium={userData.isPremium} // <--- PASSING THE STATUS
            />

            {/* 2. Progress: Now receives the correct goal (e.g. 5000) */}
            <LevelProgress
              currentLevel={displayLevel}
              currentXP={userData.currentXP}
              nextLevelXP={nextLevelGoal} // <--- PASSING THE GOAL
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto space-y-8">
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
