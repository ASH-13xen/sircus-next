"use client";

import * as React from "react";
import { useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";
import { Loader2 } from "lucide-react";

import { HeroSection } from "@/components/home/HeroSection";
import { StatsGrid } from "@/components/home/StatsGrid";
import { SkillDomainsGrid } from "@/components/home/SkillDomainsGrid";
import { RecentActivity } from "@/components/home/RecentActivity";
import { AchievementsList } from "@/components/home/AchievementsList";

// Default "Guest" Data to show when not logged in
const GUEST_DATA = {
  name: "Guest",
  level: 1,
  currentXP: 0,
  role: "Visitor",
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

  // 2. STATE: Global Loading (Waiting for Clerk to initialize)
  if (!isClerkLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  // 3. STATE: Not Logged In (Guest Mode)
  // If Clerk is loaded but there is no user, render immediately with GUEST data.
  if (!clerkUser) {
    return (
      <div className="min-h-screen">
        <HeroSection
          name={GUEST_DATA.name}
          level={GUEST_DATA.level}
          currentXP={GUEST_DATA.currentXP}
          role={GUEST_DATA.role}
          isGuest={true} // New prop to toggle UI
        />
        {/* You might want to hide these or show demo versions for guests */}
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

  // 4. STATE: Logged In but Convex Loading
  if (userData === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  // 5. STATE: Logged In but Syncing (User created but DB not updated yet)
  if (userData === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Setting up your profile...</p>
      </div>
    );
  }

  // 6. STATE: Authenticated & Loaded
  return (
    <div className="min-h-screen">
      <HeroSection
        name={userData.name}
        level={userData.currentLevel}
        currentXP={userData.currentXP}
        role={userData.role}
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
