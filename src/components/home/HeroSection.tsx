import * as React from "react";
import { Sparkles, Terminal, Code2 } from "lucide-react"; // Swapped icons for tech theme
import { LevelBadge } from "@/components/home/LevelBadge";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  name: string;
  level: number;
  currentXP: number;
  role: string;
  isGuest?: boolean;
}

export const HeroSection = ({
  name,
  level,
  currentXP,
  role,
  isGuest = false,
}: HeroSectionProps) => {
  const xpForNextLevel = (level + 1) * 1000;

  return (
    <div className="relative py-20 overflow-hidden bg-[#02040a]">
      {/* --- BACKGROUND EFFECTS --- */}
      {/* Subtle top gradient to mimic the 'glow' in the screenshot */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Optional Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{
            backgroundImage: `radial-gradient(#1e293b 1px, transparent 1px)`,
            backgroundSize: '32px 32px'
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div
            className={
              isGuest
                ? "flex flex-col items-center justify-center text-center max-w-3xl mx-auto"
                : "grid lg:grid-cols-2 gap-12 items-center"
            }
          >
            {/* --- LEFT SIDE: TEXT --- */}
            <div
              className={`space-y-8 ${isGuest ? "text-center" : "text-center lg:text-left"}`}
            >
              {/* Level / Role Pill */}
              {!isGuest && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 backdrop-blur-sm">
                  <Terminal className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-semibold tracking-wide uppercase text-blue-400">
                    Level {level} • {role}
                  </span>
                </div>
              )}

              {/* Main Headline */}
              <h1 className="text-5xl lg:text-7xl font-sans font-bold text-white tracking-tight leading-[1.1]">
                {isGuest ? (
                  <span>
                    Master the <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                      Future of Tech
                    </span>
                  </span>
                ) : (
                  <span>
                    Welcome back,
                    <br />
                    <span className="text-blue-500">{name}</span>
                  </span>
                )}
              </h1>

              {/* Subheading Description */}
              <p className="text-lg text-slate-400 leading-relaxed max-w-lg mx-auto lg:mx-0">
                {isGuest
                  ? "Select a domain to start your journey. From Data Structures to AI, our paths are curated to take you from beginner to advanced."
                  : "Your learning path continues. Keep building projects and earning XP to unlock advanced system designs."}
              </p>

              {/* CTA Buttons */}
              {isGuest && (
                <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center">
                  <SignInButton mode="modal">
                    <Button 
                        size="lg" 
                        className="bg-blue-600 hover:bg-blue-700 text-white text-base px-8 h-12 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_25px_rgba(59,130,246,0.5)]"
                    >
                      Start Learning <span className="ml-2">→</span>
                    </Button>
                  </SignInButton>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 h-12 rounded-xl px-8"
                  >
                    View Curriculum
                  </Button>
                </div>
              )}
            </div>

            {/* --- RIGHT SIDE: BADGE / VISUAL (ONLY IF SIGNED IN) --- */}
            {!isGuest && (
              <div className="relative flex justify-center lg:justify-end">
                {/* Glow effect behind the badge */}
                <div className="absolute inset-0 bg-blue-500/20 blur-[60px] rounded-full transform scale-75" />
                
                <div className="relative z-10 bg-[#0b1021] border border-slate-800 p-8 rounded-3xl shadow-2xl w-[300px]">
                    <LevelBadge
                      level={level}
                      currentXP={currentXP}
                      xpForNextLevel={xpForNextLevel}
                      levelName={role}
                    />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};