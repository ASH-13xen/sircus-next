"use client";

import * as React from "react";
import { useEffect, useState, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { useUser } from "@clerk/nextjs";
import { api } from "../../convex/_generated/api";
import { 
  Loader2, 
  Code2, 
  Database, 
  BrainCircuit, 
  Cpu, 
  TerminalSquare, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";

// Import your shared game logic
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

// --- UPDATED COMPONENT: Sliding Topic Banner with Manual Controls ---

const TOPICS = [
  { 
    label: "Web Development", 
    icon: Code2, 
    color: "text-blue-400", 
    bg: "bg-blue-500/10", 
    border: "border-blue-500/20",
    img: "https://images.unsplash.com/photo-1621839673705-6617adf9e890?q=80&w=600&auto=format&fit=crop" 
  },
  { 
    label: "DSA & Algorithms", 
    icon: TerminalSquare, 
    color: "text-emerald-400", 
    bg: "bg-emerald-500/10", 
    border: "border-emerald-500/20",
    img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop" 
  },
  { 
    label: "Aptitude & Logic", 
    icon: BrainCircuit, 
    color: "text-yellow-400", 
    bg: "bg-yellow-500/10", 
    border: "border-yellow-500/20",
    img: "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=600&auto=format&fit=crop" 
  },
  { 
    label: "AI / ML", 
    icon: Database, 
    color: "text-purple-400", 
    bg: "bg-purple-500/10", 
    border: "border-purple-500/20",
    img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop" 
  },
  { 
    label: "System Design", 
    icon: Cpu, 
    color: "text-red-400", 
    bg: "bg-red-500/10", 
    border: "border-red-500/20",
    img: "https://images.unsplash.com/photo-1558494949-ef526b0042a0?q=80&w=600&auto=format&fit=crop" 
  },
];



// ... (keep your TOPICS array exactly as it was) ...

const SlidingTopicBanner = () => {
  // We duplicate the topics to ensure the loop is seamless
  const duplicatedTopics = [...TOPICS, ...TOPICS];

  return (
    <div className="w-full py-12 relative border-y border-slate-800 bg-[#02040a]/50 backdrop-blur-sm my-8 group overflow-hidden">
      
      {/* 1. Inject Styles for the Animation */}
      <style>
        {`
          @keyframes slide-right {
            from { transform: translateX(-50%); }
            to { transform: translateX(0); }
          }
          
          .animate-infinite-slide {
            animation: slide-right 20s linear infinite;
          }

          /* Optional: Pause animation on hover for better UX */
          .group:hover .animate-infinite-slide {
            animation-play-state: paused;
          }
        `}
      </style>

      {/* 2. Gradient Fade Edges (Visual Polish) */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#02040a] to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#02040a] to-transparent z-20 pointer-events-none" />

      {/* 3. The Sliding Track */}
      <div className="flex w-max animate-infinite-slide">
        {duplicatedTopics.map((topic, idx) => {
          const Icon = topic.icon;
          return (
            <div 
              key={idx} 
              className="mx-4 relative h-[220px] w-[320px] shrink-0 rounded-2xl overflow-hidden border border-slate-800 hover:border-slate-600 transition-all hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-900/20 bg-[#0b1021] group/card"
            >
              {/* Background Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={topic.img} 
                alt={topic.label} 
                className="object-cover w-full h-full opacity-40 group-hover/card:opacity-60 transition-opacity duration-500 grayscale group-hover/card:grayscale-0" 
              />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1021] via-[#0b1021]/60 to-transparent p-6 flex flex-col justify-end">
                <div className={`inline-flex p-2 rounded-lg ${topic.bg} border ${topic.border} w-fit mb-3 backdrop-blur-md`}>
                  <Icon className={`w-5 h-5 ${topic.color}`} />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight group-hover/card:text-blue-200 transition-colors">
                  {topic.label}
                </h3>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ... (Rest of your HomePage export remains the same)


// --- MAIN COMPONENT ---

// Default "Guest" Data
const GUEST_DATA = {
  name: "Guest",
  currentXP: 0,
  level: getLevelFromXP(0),
  role: getRoleFromXP(0),
};

export default function HomePage() {
  const { user: clerkUser, isLoaded: isClerkLoaded } = useUser();
  const userData = useQuery(api.users.getUserProfile);
  const storeUser = useMutation(api.users.storeUser);
  const [mounted, setMounted] = useState(false);

  // Ensure animation only runs on client to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Auto-Sync
  useEffect(() => {
    if (isClerkLoaded && clerkUser && userData === null) {
      storeUser({});
    }
  }, [isClerkLoaded, clerkUser, userData, storeUser]);

  // 2. STATE: Global Loading
  if (!isClerkLoaded || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#02040a]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  // 3. STATE: Guest Mode
  if (!clerkUser) {
    return (
      <div className="min-h-screen bg-[#02040a] relative isolate overflow-hidden">
        {/* Background Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none -z-10" 
          style={{ backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px)`, backgroundSize: '32px 32px' }}
        />

        <HeroSection
          name={GUEST_DATA.name}
          level={GUEST_DATA.level}
          currentXP={GUEST_DATA.currentXP}
          role={GUEST_DATA.role}
          nextLevelXP={getNextLevelXP(GUEST_DATA.currentXP)}
          isGuest={true}
        />
        
        {/* NEW SLIDER WITH BUTTONS */}
        <SlidingTopicBanner />
        
        <div className="container mx-auto px-4 py-12 relative">
          {/* Locked State Overlay */}
          <div className="absolute inset-0 z-10 flex flex-col items-center pt-20">
             <div className="bg-[#0b1021]/80 backdrop-blur-md border border-slate-800 p-8 rounded-2xl shadow-2xl text-center max-w-md">
                <h2 className="text-2xl font-bold text-white mb-2">Access Restricted</h2>
                <p className="text-slate-400 mb-6">Sign in to track your stats, unlock domains, and view your activity history.</p>
             </div>
          </div>

          <div className="opacity-20 blur-sm pointer-events-none select-none max-w-7xl mx-auto space-y-12 grayscale">
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
      <div className="min-h-screen flex items-center justify-center bg-[#02040a]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  // 5. STATE: Creating Profile
  if (userData === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#02040a]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
        <p className="text-slate-400">Initializing your command center...</p>
      </div>
    );
  }

  // 6. STATE: Authenticated & Loaded
  const displayLevel = getLevelFromXP(userData.currentXP);
  const displayRole = getRoleFromXP(userData.currentXP);
  const nextLevelGoal = getNextLevelXP(userData.currentXP);

  return (
    <div className="min-h-screen bg-[#02040a] relative isolate overflow-hidden">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none -z-10" 
        style={{ backgroundImage: `radial-gradient(#3b82f6 1px, transparent 1px)`, backgroundSize: '32px 32px' }}
      />
      
      <HeroSection
        name={userData.name}
        level={displayLevel}
        currentXP={userData.currentXP}
        role={displayRole}
        nextLevelXP={nextLevelGoal}
        isGuest={false}
      />

      {/* NEW SLIDER WITH BUTTONS */}
      <SlidingTopicBanner />
    </div>
  );
}