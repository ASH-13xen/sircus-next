
export function getRoleFromXP(xp: number): string {
  if (xp >= 10000) return "Ringmaster";
  if (xp >= 5000) return "Magician";
  if (xp >= 2500) return "Acrobat";
  if (xp >= 1000) return "Juggler";
  return "Novice";
}

export function getLevelFromXP(xp: number): number {
  if (xp >= 10000) return 5;
  if (xp >= 5000) return 4;
  if (xp >= 2500) return 3;
  if (xp >= 1000) return 2;
  return 1;
}


export function getNextLevelXP(xp: number): number {
  if (xp >= 10000) return 20000;
  if (xp >= 5000) return 10000;
  if (xp >= 2500) return 5000;
  if (xp >= 1000) return 2500;
  return 1000;
}