"use client";

import * as React from "react";
import { useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";
import { Loader2 } from "lucide-react";

// Import your shared game logic
// (Make sure this path matches where you put the file)
import { 
  getRoleFromXP, 
  getLevelFromXP, 
  getNextLevelXP 
} from "../../convex/gameLogic";

import { HeroSection } from "@/components/home/HeroSection";
import { StatsGrid } from "@/components/home/StatsGrid";
import { SkillDomainsGrid } from "@/components/home/SkillDomainsGrid";
import { RecentActivity } from "@/components/home/RecentActivity";
import { AchievementsList } from "@/components/home/AchievementsList";

// Default "Guest" Data
const GUEST_DATA = {
  name: "Guest",
  currentXP: 0,
  // We calculate these for guests too!
  level: getLevelFromXP(0),
  role: getRoleFromXP(0),
};

export default function HomePage() {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const userData = useQuery(api.users.getUserProfile);
  const storeUser = useMutation(api.users.storeUser);

  // 1. Auto-Sync: Only runs if we actually HAVE a Clerk user
  useEffect(() => {
    if (isClerkLoaded && clerkUser && userData === null) {
      storeUser({});
    }
  }, [isClerkLoaded, clerkUser, userData, storeUser]);

  // 2. STATE: Global Loading
  if (!isClerkLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  // 3. STATE: Guest Mode
  if (!clerkUser) {
    return (
      <div className="min-h-screen">
        <HeroSection
          name={GUEST_DATA.name}
          level={GUEST_DATA.level}
          currentXP={GUEST_DATA.currentXP}
          role={GUEST_DATA.role}
          // Pass the calculated next goal (e.g., 1000)
          nextLevelXP={getNextLevelXP(GUEST_DATA.currentXP)}
          isGuest={true}
        />
        <div className="container mx-auto px-4 py-12 blur-sm select-none opacity-50 pointer-events-none">
          <div className="max-w-7xl mx-auto space-y-12">
            <h2 className="text-center text-2xl font-bold">
              Sign in to view your stats
            </h2>
            <StatsGrid />
            <SkillDomainsGrid />
          </div>
        </div>
      </div>
    );
  }

  // 4. STATE: Convex Loading
  if (userData === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  // 5. STATE: Creating Profile
  if (userData === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Setting up your profile...</p>
      </div>
    );
  }

  // 6. STATE: Authenticated & Loaded
  // ✨ MAGIC FIX: Calculate stats on the fly from XP
  // This ensures the UI is always correct, even if the DB "role" field is stale.
  const displayLevel = getLevelFromXP(userData.currentXP);
  const displayRole = getRoleFromXP(userData.currentXP);
  const nextLevelGoal = getNextLevelXP(userData.currentXP);

  return (
    <div className="min-h-screen">
      <HeroSection
        name={userData.name}
        level={displayLevel}         // Use calculated Level
        currentXP={userData.currentXP}
        role={displayRole}           // Use calculated Role
        nextLevelXP={nextLevelGoal}  // Pass the correct Goal
        isGuest={false}
      />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-12">
          <StatsGrid />
          <SkillDomainsGrid />
          <div className="grid lg:grid-cols-3 gap-6">
            <RecentActivity />
            <AchievementsList />
          </div>
        </div>
      </div>
    </div>
  );
}
