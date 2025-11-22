"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="font-accent">Level Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Level {currentLevel}</span>
          <span className="text-muted-foreground">
            Level {currentLevel + 1}
          </span>
        </div>
        <Progress value={currentLevelProgress} className="h-3" />
        <div className="flex items-center justify-between text-sm">
          <span className="font-accent text-primary">
            {currentXP.toLocaleString()} XP
          </span>
          <span className="text-muted-foreground">
            {xpToNextLevel.toLocaleString()} XP to next level
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
