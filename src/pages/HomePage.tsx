"use client";

import * as React from "react";
import { useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api"; // Adjust path if needed
import { Loader2 } from "lucide-react";

import { HeroSection } from "@/components/home/HeroSection";
import { StatsGrid } from "@/components/home/StatsGrid";
import { SkillDomainsGrid } from "@/components/home/SkillDomainsGrid";
import { RecentActivity } from "@/components/home/RecentActivity";
import { AchievementsList } from "@/components/home/AchievementsList";

export default function HomePage() {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const userData = useQuery(api.users.getUserProfile);
  const storeUser = useMutation(api.users.storeUser);

  // Auto-Sync: Ensure user exists in Convex DB on load
  useEffect(() => {
    if (isClerkLoaded && clerkUser && userData === null) {
      storeUser({});
    }
  }, [isClerkLoaded, clerkUser, userData, storeUser]);

  // --- LOADING STATE ---
  if (userData === undefined || !isClerkLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  // --- NOT LOGGED IN / SYNCING STATE ---
  // If no user data yet (or not logged in), show a safe fallback or loader
  if (!userData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Entering the Circus...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* --- Hero Section (Dynamic Data) --- */}
      <HeroSection
        name={userData.name}
        level={userData.currentLevel}
        currentXP={userData.currentXP}
        role={userData.role}
      />

      {/* --- Main Content Section --- */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Note: You will need to update these components to accept props 
              similar to how we updated HeroSection if you want them dynamic. */}

          {/* --- Stats Grid --- */}
          <StatsGrid />

          {/* --- Skill Domains --- */}
          <SkillDomainsGrid />

          {/* --- Recent Activity & Achievements --- */}
          <div className="grid lg:grid-cols-3 gap-6">
            <RecentActivity />
            <AchievementsList />
          </div>
        </div>
      </div>
    </div>
  );
}
