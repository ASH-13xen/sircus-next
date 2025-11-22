import * as React from "react";
import { Sparkles } from "lucide-react";
import { LevelBadge } from "@/components/home/LevelBadge";

const heroImage = "/images/homecircustent.jpg";

interface HeroSectionProps {
  name: string;
  level: number;
  currentXP: number;
  role: string;
}

export const HeroSection = ({
  name,
  level,
  currentXP,
  role,
}: HeroSectionProps) => {
  // Calculation logic (Consistent with your Profile page)
  const xpForNextLevel = (level + 1) * 1000;

  return (
    <div
      className="relative py-20 overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(14, 165, 233, 0.15)), linear-gradient(to bottom, rgba(2, 6, 23, 0.75), rgba(2, 6, 23, 0.9)), url(${heroImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Level {level} {role}
                </span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-display text-foreground leading-tight">
                Welcome back,
                <br />
                <span className="text-primary">{name}</span>!
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg">
                Your journey to becoming a Ringmaster continues. Keep mastering
                skills and earning XP at the Big Top!
              </p>
            </div>
            <div className="flex justify-center">
              <LevelBadge
                level={level}
                currentXP={currentXP}
                xpForNextLevel={xpForNextLevel}
                levelName={role}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
