"use client";

import { Zap } from "lucide-react";

interface LevelProgressProps {
  currentLevel: number;
  currentXP: number;
  nextLevelXP: number;
}

export default function LevelProgress({
  currentLevel,
  currentXP,
  nextLevelXP,
}: LevelProgressProps) {
  
  // Safe math to prevent division by zero
  const safeGoal = nextLevelXP || 1000;
  const progressPercent = Math.min((currentXP / safeGoal) * 100, 100);
  const xpRemaining = safeGoal - currentXP;

  return (
    <div className="bg-[#0b1021] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
      
      {/* Optional: Subtle top highlight effect */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-50" />

      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
        
        {/* Left Side: Level & Icon */}
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
            <Zap className="w-6 h-6 fill-blue-500/20" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">
              Current Rank
            </h3>
            <div className="text-3xl font-bold text-white tracking-tight">
              Level {currentLevel}
            </div>
          </div>
        </div>

        {/* Right Side: XP Stats (Hidden on tiny screens, shown on SM+) */}
        <div className="text-left sm:text-right">
          <div className="text-2xl font-bold text-white font-mono tracking-tight">
            {currentXP.toLocaleString()} <span className="text-slate-500 text-lg">/ {safeGoal.toLocaleString()} XP</span>
          </div>
          <p className="text-xs text-slate-400 font-medium mt-1">
            <span className="text-blue-400 font-bold">{xpRemaining.toLocaleString()} XP</span> needed for Level {currentLevel + 1}
          </p>
        </div>
      </div>

      {/* Custom Progress Bar Container */}
      <div className="relative h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-800 shadow-inner">
        {/* The Fill Bar */}
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all duration-1000 ease-out relative"
          style={{ width: `${progressPercent}%` }}
        >
          {/* Shine Effect on the bar */}
          <div className="absolute top-0 right-0 bottom-0 left-0 bg-gradient-to-b from-white/10 to-transparent" />
        </div>
      </div>

    </div>
  );
}