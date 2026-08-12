import type { EnemyKind } from "./gameTypes";

export const gameConfig = {
  startingIntegrity: 100,
  finderDamageMultiplier: 2.4,
  spawnRateStart: 1250,
  spawnRateMin: 330,
  speedIncreasePerSecond: 0.012,
  comboThresholds: [
    { hits: 15, multiplier: 2.5 },
    { hits: 10, multiplier: 2 },
    { hits: 5, multiplier: 1.5 },
    { hits: 3, multiplier: 1.2 }
  ],
  enemy: {
    normal: { size: 34, speed: 90, hp: 1, points: 100, damage: 5 },
    fast: { size: 28, speed: 145, hp: 1, points: 250, damage: 4 },
    heavy: { size: 46, speed: 62, hp: 2, points: 400, damage: 10 },
    glitch: { size: 36, speed: 105, hp: 1, points: 500, damage: 8 },
    bonus: { size: 32, speed: 120, hp: 1, points: 1000, damage: 0 },
    error: { size: 38, speed: 82, hp: 1, points: -500, damage: 0 }
  } satisfies Record<EnemyKind, { size: number; speed: number; hp: number; points: number; damage: number }>
};

export function comboMultiplier(comboHits: number) {
  return gameConfig.comboThresholds.find((threshold) => comboHits >= threshold.hits)?.multiplier ?? 1;
}

export function rankForScore(score: number) {
  if (score >= 35000) return "QR MASTER";
  if (score >= 20000) return "SCANNER ELITE";
  if (score >= 10000) return "CODE HUNTER";
  if (score >= 5000) return "DECODER";
  return "NEEDS RECALIBRATION";
}
