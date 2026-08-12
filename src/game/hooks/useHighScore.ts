import { useCallback, useEffect, useState } from "react";
import type { GameResults, HighScore } from "../gameTypes";

const key = "qrBlasterHighScore";
const emptyScore: HighScore = { bestScore: 0, bestSurvivalTime: 0, bestCombo: 0 };

export function useHighScore() {
  const [highScore, setHighScore] = useState<HighScore>(emptyScore);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored) setHighScore({ ...emptyScore, ...JSON.parse(stored) as HighScore });
    } catch {
      setHighScore(emptyScore);
    }
  }, []);

  const saveResult = useCallback((result: GameResults) => {
    setHighScore((current) => {
      const next = {
        bestScore: Math.max(current.bestScore, result.score),
        bestSurvivalTime: Math.max(current.bestSurvivalTime, result.elapsed),
        bestCombo: Math.max(current.bestCombo, result.bestCombo)
      };
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        return next;
      }
      return next;
    });
  }, []);

  return { highScore, saveResult };
}
