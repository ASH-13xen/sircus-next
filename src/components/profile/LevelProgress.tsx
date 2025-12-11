interface LevelProgressProps {
  currentLevel: number;
  currentXP: number;
  nextLevelXP: number; // New Prop
}

export default function LevelProgress({
  currentLevel,
  currentXP,
  nextLevelXP,
}: LevelProgressProps) {
  
  // Safe math to prevent division by zero
  const safeGoal = nextLevelXP || 1000;
  const progressPercent = Math.min((currentXP / safeGoal) * 100, 100);

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Level Progress
          </h3>
          <div className="text-3xl font-display font-bold mt-1">
            Level {currentLevel}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">
            {currentXP.toLocaleString()} <span className="text-muted-foreground text-base font-normal">/ {safeGoal.toLocaleString()} XP</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {safeGoal - currentXP} XP to Level {currentLevel + 1}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-4 bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-blue-500 to-cyan-400 transition-all duration-1000 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
