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
  
  // NOTE: Ensure your convex query supports fetching isPremium
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
      <div className="min-h-screen flex items-center justify-center bg-[#02040a]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // --- NOT LOGGED IN STATE ---
  if (!clerkUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#02040a] px-4">
        {/* Dark Theme Card for Login Prompt */}
        <div className="bg-[#0b1021] border border-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full text-center space-y-6 relative overflow-hidden">
            {/* Subtle Gradient Glow inside card */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
            
            <div className="mx-auto p-4 rounded-full bg-slate-800/50 w-20 h-20 flex items-center justify-center border border-slate-700">
                <LogIn className="w-8 h-8 text-blue-400" />
            </div>
            
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">
                Access Restricted
                </h2>
                <p className="text-slate-400">
                Please sign in to view your profile, track your progress, and manage your settings.
                </p>
            </div>
            
            <SignInButton mode="modal">
                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-[0_0_15px_rgba(37,99,235,0.5)]">
                    Sign In / Sign Up
                </Button>
            </SignInButton>
        </div>
      </div>
    );
  }

  // --- SYNCING STATE ---
  if (userData === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#02040a] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-slate-400 font-medium animate-pulse">
            Synchronizing profile data...
        </p>
      </div>
    );
  }

  // --- CALCULATE REAL-TIME STATS ---
  const displayLevel = getLevelFromXP(userData.currentXP);
  const displayRole = getRoleFromXP(userData.currentXP);
  const nextLevelGoal = getNextLevelXP(userData.currentXP);

  // --- MAIN CONTENT ---
  return (
    <div className="min-h-screen bg-[#02040a] relative isolate">
      {/* BACKGROUND EFFECTS */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-900/20 rounded-full blur-[100px] -z-10" />
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none -z-10" 
        style={{
            backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
        }}
      />

      {/* Top Section */}
      <div className="pt-12 pb-6 border-b border-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            
            {/* 1. Header: Now receives isPremium and dynamic Role */}
            <ProfileHeader
              name={userData.name}
              email={userData.email}
              image={userData.image}
              role={displayRole}  
              joinDate={userData._creationTime}
              isPremium={userData.isPremium} 
            />

            {/* 2. Progress: Added top margin for separation */}
            <div className="mt-8">
                <LevelProgress
                currentLevel={displayLevel}
                currentXP={userData.currentXP}
                nextLevelXP={nextLevelGoal}
                />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Stats */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
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