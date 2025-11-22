import * as React from "react";
import { Sparkles } from "lucide-react";
import { LevelBadge } from "@/components/home/LevelBadge";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

const heroImage = "/images/homecircustent.jpg";

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
          {/* GRID LOGIC: 
            - If Guest: Use flex and center everything (1 column look)
            - If User: Use grid with 2 columns
          */}
          <div
            className={
              isGuest
                ? "flex flex-col items-center justify-center text-center max-w-3xl mx-auto"
                : "grid lg:grid-cols-2 gap-12 items-center"
            }
          >
            {/* --- LEFT SIDE: TEXT --- */}
            <div
              className={`space-y-6 ${isGuest ? "text-center" : "text-center lg:text-left"}`}
            >
              {!isGuest && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">
                    Level {level} {role}
                  </span>
                </div>
              )}

              <h1 className="text-5xl lg:text-7xl font-display text-foreground leading-tight">
                {isGuest ? (
                  <span>
                    Step into the <br />
                    <span className="text-primary">Ring!</span>
                  </span>
                ) : (
                  <span>
                    Welcome back,
                    <br />
                    <span className="text-primary">{name}</span>!
                  </span>
                )}
              </h1>

              <p className="text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0">
                {isGuest
                  ? "Join the greatest show on earth. Sign in to track your progress and master your skills."
                  : "Your journey to becoming a Ringmaster continues. Keep mastering skills and earning XP at the Big Top!"}
              </p>

              {isGuest && (
                <div className="pt-4">
                  <SignInButton mode="modal">
                    <Button size="lg" className="text-lg px-8">
                      Start Your Journey
                    </Button>
                  </SignInButton>
                </div>
              )}
            </div>

            {/* --- RIGHT SIDE: BADGE (ONLY IF SIGNED IN) --- */}
            {!isGuest && (
              <div className="flex justify-center">
                <LevelBadge
                  level={level}
                  currentXP={currentXP}
                  xpForNextLevel={xpForNextLevel}
                  levelName={role}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
