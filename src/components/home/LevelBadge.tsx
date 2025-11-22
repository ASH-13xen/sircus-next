import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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
    <Card className="w-full max-w-sm bg-background/50 backdrop-blur-lg border-primary/20 shadow-xl">
      <CardContent className="p-6 text-center space-y-4">
        <div className="text-sm uppercase tracking-wider text-primary font-semibold">
          {levelName}
        </div>
        <div className="text-7xl font-bold font-display text-foreground">
          {level}
        </div>
        <Progress value={progress} className="h-2" />
        <div className="text-sm text-muted-foreground">
          <span className="font-bold text-foreground">
            {currentXP.toLocaleString()}
          </span>{" "}
          / {xpForNextLevel.toLocaleString()} XP
        </div>
      </CardContent>
    </Card>
  );
};
