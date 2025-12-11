import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Trophy, Star } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility, if not, standard template literals work

interface LevelBadgeProps {
  level: number;
  currentXP: number;
  xpForNextLevel: number;
  levelName: string;
}

export const LevelBadge = ({
  level,
  currentXP,
  xpForNextLevel,
  levelName,
}: LevelBadgeProps) => {
  const progress = Math.min(100, (currentXP / xpForNextLevel) * 100);

  return (
    <Card className="w-full max-w-sm bg-slate-950 border-slate-800 relative overflow-hidden group shadow-2xl transition-all duration-300 hover:shadow-blue-900/20 hover:border-blue-500/30">
      
      {/* 1. Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      {/* 2. Top Glow Effect */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <CardContent className="p-8 flex flex-col items-center text-center relative z-10">
        
        {/* Header Badge */}
        <div className="mb-6 relative">
            <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full group-hover:opacity-40 transition-opacity" />
            <div className="relative w-12 h-12 bg-slate-900/80 backdrop-blur-sm border border-slate-700 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6 text-blue-400 fill-blue-400/10" />
            </div>
        </div>

        {/* Level Label */}
        <div className="space-y-1 mb-2">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400 group-hover:text-blue-300 transition-colors">
                {levelName}
            </h3>
        </div>

        {/* The Big Number (Gradient Text) */}
        <div className="relative mb-8">
             {/* Glow behind number */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-blue-500/20 blur-3xl rounded-full pointer-events-none" />
            
            <span className="text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-100 to-slate-500 drop-shadow-2xl">
                {level}
            </span>
        </div>

        {/* Custom Progress Bar Section */}
        <div className="w-full space-y-3">
          <div className="h-3 w-full bg-slate-900 rounded-full border border-slate-800 overflow-hidden relative">
            {/* Background shimmer */}
            <div className="absolute inset-0 bg-slate-800/50 w-full" />
            
            {/* Gradient Bar */}
            <div 
                className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400 transition-all duration-1000 ease-out relative"
                style={{ width: `${progress}%` }}
            >
                {/* Shimmer effect on the bar itself */}
                <div className="absolute top-0 right-0 bottom-0 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </div>
          </div>
          
          <div className="flex justify-between items-center text-xs font-medium px-1">
            <span className="text-blue-200">
              {currentXP.toLocaleString()} <span className="text-slate-500">XP</span>
            </span>
            <span className="text-slate-600">
              {xpForNextLevel.toLocaleString()} XP
            </span>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};