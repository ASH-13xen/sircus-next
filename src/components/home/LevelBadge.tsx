import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Zap } from "lucide-react";

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
  const progress = (currentXP / xpForNextLevel) * 100;

  return (
    <Card className="w-full max-w-sm bg-[#0b1021] border-slate-800 shadow-xl rounded-2xl overflow-hidden relative group">
      {/* Optional: Subtle top gradient highlight similar to the screenshot's hover state */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-50" />

      <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
        
        {/* Header: Icon + Role Name */}
        <div className="space-y-2">
            <div className="w-10 h-10 mx-auto bg-slate-800/50 rounded-lg flex items-center justify-center border border-slate-700 text-blue-400 mb-3">
                <Zap className="w-5 h-5 fill-blue-500/20" />
            </div>
            <div className="text-xs uppercase tracking-[0.2em] text-blue-500 font-bold">
            {levelName}
            </div>
        </div>

        {/* The Big Number */}
        <div className="relative">
             {/* Text Shadow/Glow effect */}
            <div className="absolute inset-0 blur-lg bg-blue-500/20 rounded-full" />
            <div className="relative text-7xl font-sans font-bold text-white tracking-tighter">
            {level}
            </div>
        </div>

        {/* Progress Section */}
        <div className="w-full space-y-2">
          {/* Customizing the Progress component colors via classNames */}
          <Progress 
            value={progress} 
            className="h-2 bg-slate-800" 
            // Note: You may need to ensure your global.css allows overriding the indicator color, 
            // or use a custom style for the indicator if utilizing default shadcn.
            // Assuming standard Tailwind usage here:
            indicatorClassName="bg-blue-600"
          />
          
          <div className="flex justify-between items-center text-xs font-medium pt-1">
            <span className="text-white">
              {currentXP.toLocaleString()} <span className="text-slate-500">XP</span>
            </span>
            <span className="text-slate-500">
              {xpForNextLevel.toLocaleString()} XP
            </span>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};