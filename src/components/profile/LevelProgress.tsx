"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Target } from "lucide-react";

interface LevelProgressProps {
  currentLevel: number;
  currentXP: number;
}

export default function LevelProgress({
  currentLevel,
  currentXP,
}: LevelProgressProps) {
  const nextLevelXP = (currentLevel + 1) * 1000;
  const xpToNextLevel = nextLevelXP - currentXP;
  const currentLevelProgress = (currentXP / nextLevelXP) * 100;

  return (
    <Card className="mt-8 bg-[#0b1021] border-slate-800 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-slate-800/50 rounded-lg border border-slate-700">
            <Target className="w-5 h-5 text-blue-400" />
          </div>
          <CardTitle className="font-sans text-lg font-bold text-white tracking-tight">
            Level Progress
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-5">
        
        {/* Progress Bar Container */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider text-slate-500">
            <span>Level {currentLevel}</span>
            <span>Level {currentLevel + 1}</span>
          </div>
          
          <Progress 
            value={currentLevelProgress} 
            className="h-3 bg-slate-800"
            // Note: Ensure your global CSS or Progress component uses bg-blue-600 for the indicator
            indicatorClassName="bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]" 
          />
        </div>

        {/* Footer Stats */}
        <div className="flex items-center justify-between text-sm p-3 rounded-lg bg-slate-900/50 border border-slate-800/50">
          <div className="flex flex-col">
            <span className="text-slate-500 text-xs">Current XP</span>
            <span className="font-bold text-blue-400 font-mono">
              {currentXP.toLocaleString()}
            </span>
          </div>
          
          <div className="flex flex-col items-end">
             <span className="text-slate-500 text-xs">To Next Level</span>
             <span className="text-slate-300 font-medium">
              {xpToNextLevel.toLocaleString()} XP
            </span>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}