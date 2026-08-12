export type EnemyKind = "normal" | "fast" | "heavy" | "glitch" | "bonus" | "error";

export type Enemy = {
  id: number;
  kind: EnemyKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  speed: number;
  hp: number;
  maxHp: number;
  points: number;
  damage: number;
  bornAt: number;
  jitterSeed: number;
};

export type FloatingScore = {
  id: number;
  x: number;
  y: number;
  text: string;
  bornAt: number;
};

export type GameSnapshot = {
  score: number;
  elapsed: number;
  comboHits: number;
  comboMultiplier: number;
  bestCombo: number;
  integrity: number;
  shots: number;
  hits: number;
  destroyed: number;
  warning: string;
  phase: "playing" | "paused" | "over";
  bombs: number;
  slowMoUntil: number;
};

export type GameResults = {
  score: number;
  elapsed: number;
  accuracy: number;
  bestCombo: number;
  destroyed: number;
  rank: string;
};

export type HighScore = {
  bestScore: number;
  bestSurvivalTime: number;
  bestCombo: number;
};
