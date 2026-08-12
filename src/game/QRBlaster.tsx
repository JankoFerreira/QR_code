import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { comboMultiplier, gameConfig, rankForScore } from "./gameConfig";
import type { Enemy, EnemyKind, FloatingScore, GameResults, GameSnapshot } from "./gameTypes";
import { useHighScore } from "./hooks/useHighScore";

type QRBlasterProps = {
  onBack: () => void;
};

type Runtime = {
  enemies: Enemy[];
  floats: FloatingScore[];
  score: number;
  comboHits: number;
  bestCombo: number;
  integrity: number;
  shots: number;
  hits: number;
  destroyed: number;
  elapsed: number;
  lastTime: number;
  lastSpawn: number;
  nextId: number;
  nextFloatId: number;
  warning: string;
  warningUntil: number;
  shakeUntil: number;
  running: boolean;
  paused: boolean;
  over: boolean;
};

const initialSnapshot: GameSnapshot = {
  score: 0,
  elapsed: 0,
  comboHits: 0,
  comboMultiplier: 1,
  bestCombo: 0,
  integrity: 100,
  shots: 0,
  hits: 0,
  destroyed: 0,
  warning: "",
  phase: "playing"
};

function createRuntime(): Runtime {
  return {
    enemies: [],
    floats: [],
    score: 0,
    comboHits: 0,
    bestCombo: 0,
    integrity: gameConfig.startingIntegrity,
    shots: 0,
    hits: 0,
    destroyed: 0,
    elapsed: 0,
    lastTime: 0,
    lastSpawn: 0,
    nextId: 1,
    nextFloatId: 1,
    warning: "",
    warningUntil: 0,
    shakeUntil: 0,
    running: false,
    paused: false,
    over: false
  };
}

export function QRBlaster({ onBack }: QRBlasterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runtimeRef = useRef<Runtime>(createRuntime());
  const rafRef = useRef(0);
  const sizeRef = useRef({ width: 390, height: 700, dpr: 1 });
  const savedRef = useRef(false);
  const { highScore, saveResult } = useHighScore();
  const [view, setView] = useState<"menu" | "countdown" | "playing" | "over">("menu");
  const [countdown, setCountdown] = useState("3");
  const [snapshot, setSnapshot] = useState<GameSnapshot>(initialSnapshot);
  const [results, setResults] = useState<GameResults | null>(null);

  const accuracy = snapshot.shots ? Math.round((snapshot.hits / snapshot.shots) * 100) : 100;

  const resetGame = useCallback(() => {
    runtimeRef.current = createRuntime();
    savedRef.current = false;
    setSnapshot(initialSnapshot);
    setResults(null);
  }, []);

  const startCountdown = useCallback(() => {
    resetGame();
    setView("countdown");
    const marks = ["3", "2", "1", "SCAN!"];
    marks.forEach((mark, index) => {
      window.setTimeout(() => setCountdown(mark), index * 620);
    });
    window.setTimeout(() => {
      runtimeRef.current.running = true;
      runtimeRef.current.lastTime = performance.now();
      runtimeRef.current.lastSpawn = performance.now();
      setView("playing");
    }, marks.length * 620);
  }, [resetGame]);

  const resultFromRuntime = useCallback((runtime: Runtime): GameResults => {
    const finalAccuracy = runtime.shots ? Math.round((runtime.hits / runtime.shots) * 100) : 100;
    const timeBonus = Math.floor(runtime.elapsed * 12);
    const accuracyBonus = Math.round(finalAccuracy * 8);
    const finalScore = Math.max(0, runtime.score + timeBonus + accuracyBonus);
    return {
      score: finalScore,
      elapsed: runtime.elapsed,
      accuracy: finalAccuracy,
      bestCombo: runtime.bestCombo,
      destroyed: runtime.destroyed,
      rank: rankForScore(finalScore)
    };
  }, []);

  const finishGame = useCallback((runtime: Runtime) => {
    if (savedRef.current) return;
    runtime.over = true;
    runtime.running = false;
    savedRef.current = true;
    const nextResults = resultFromRuntime(runtime);
    setResults(nextResults);
    saveResult(nextResults);
    setView("over");
  }, [resultFromRuntime, saveResult]);

  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    sizeRef.current = { width: rect.width, height: rect.height, dpr };
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
  }, []);

  useEffect(() => {
    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, [updateCanvasSize]);

  useEffect(() => {
    const pause = () => {
      const runtime = runtimeRef.current;
      if (!runtime.running || runtime.over) return;
      runtime.paused = true;
      setSnapshot((current) => ({ ...current, phase: "paused" }));
    };
    document.addEventListener("visibilitychange", pause);
    window.addEventListener("blur", pause);
    return () => {
      document.removeEventListener("visibilitychange", pause);
      window.removeEventListener("blur", pause);
    };
  }, []);

  const resume = () => {
    const runtime = runtimeRef.current;
    if (runtime.paused) {
      runtime.paused = false;
      runtime.lastTime = performance.now();
      setSnapshot((current) => ({ ...current, phase: "playing" }));
    }
  };

  const shoot = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    const runtime = runtimeRef.current;
    if (!canvas || view !== "playing" || runtime.paused || runtime.over) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (y < 42 || y > rect.height - 36) return;
    runtime.shots += 1;
    const target = [...runtime.enemies]
      .reverse()
      .find((enemy) => Math.hypot(enemy.x - x, enemy.y - y) <= Math.max(24, enemy.size * 0.75));
    if (!target) {
      runtime.comboHits = 0;
      runtime.warning = "COMBO RESET";
      runtime.warningUntil = performance.now() + 520;
      return;
    }
    if (target.kind === "error") {
      runtime.score = Math.max(0, runtime.score - 500);
      runtime.comboHits = 0;
      runtime.warning = "-500 ERROR MODULE";
      runtime.warningUntil = performance.now() + 900;
      runtime.shakeUntil = performance.now() + 180;
      runtime.enemies = runtime.enemies.filter((enemy) => enemy.id !== target.id);
      return;
    }
    target.hp -= 1;
    runtime.hits += 1;
    runtime.comboHits += 1;
    runtime.bestCombo = Math.max(runtime.bestCombo, runtime.comboHits);
    if (target.hp > 0) {
      runtime.floats.push({ id: runtime.nextFloatId++, x: target.x, y: target.y, text: "HIT", bornAt: performance.now() });
      return;
    }
    const points = Math.round(target.points * comboMultiplier(runtime.comboHits));
    runtime.score += points;
    runtime.destroyed += 1;
    runtime.floats.push({ id: runtime.nextFloatId++, x: target.x, y: target.y, text: `+${points}`, bornAt: performance.now() });
    runtime.enemies = runtime.enemies.filter((enemy) => enemy.id !== target.id);
  };

  useEffect(() => {
    const loop = (now: number) => {
      const canvas = canvasRef.current;
      const runtime = runtimeRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          draw(ctx, runtime, sizeRef.current, now);
        }
      }
      if (runtime.running && !runtime.paused && !runtime.over) {
        const dt = Math.min(0.04, (now - runtime.lastTime) / 1000 || 0);
        runtime.lastTime = now;
        runtime.elapsed += dt;
        updateRuntime(runtime, sizeRef.current, now, dt);
        if (runtime.integrity <= 0) finishGame(runtime);
        if (Math.floor(now / 120) !== Math.floor((now - dt * 1000) / 120)) {
          setSnapshot({
            score: runtime.score,
            elapsed: runtime.elapsed,
            comboHits: runtime.comboHits,
            comboMultiplier: comboMultiplier(runtime.comboHits),
            bestCombo: runtime.bestCombo,
            integrity: runtime.integrity,
            shots: runtime.shots,
            hits: runtime.hits,
            destroyed: runtime.destroyed,
            warning: now < runtime.warningUntil ? runtime.warning : "",
            phase: runtime.paused ? "paused" : runtime.over ? "over" : "playing"
          });
        }
      } else {
        runtime.lastTime = now;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [finishGame]);

  const formattedBest = useMemo(() => highScore.bestScore.toLocaleString(), [highScore.bestScore]);

  return (
    <main className="qr-blaster-shell">
      {view === "menu" && (
        <section className="qr-blaster-panel">
          <p className="overline">BONUS MODE</p>
          <h1>QR BLASTER</h1>
          <h2>DEFEND THE CODE</h2>
          <div className="qr-blaster-menu-code" aria-hidden="true">{Array.from({ length: 49 }, (_, index) => <i key={index} />)}</div>
          <div className="qr-blaster-instructions">
            <p>Corrupted modules are attacking the QR code.</p>
            <p>Tap them before they reach the code.</p>
            <p>Protect the three finder patterns.</p>
            <p>Survive as long as you can.</p>
          </div>
          <div className="qr-blaster-best"><span>PERSONAL BEST</span><strong>{formattedBest}</strong></div>
          <div className="qr-blaster-actions">
            <button type="button" onClick={startCountdown}>START</button>
            <button type="button" className="secondary" onClick={onBack}>BACK TO EXPERIENCE</button>
          </div>
        </section>
      )}

      {(view === "countdown" || view === "playing") && (
        <section className="qr-blaster-game" onPointerDown={(event) => shoot(event.clientX, event.clientY)}>
          <div className="qr-blaster-hud">
            <Stat label="SCORE" value={snapshot.score.toLocaleString()} />
            <Stat label="TIME" value={formatTime(snapshot.elapsed)} />
            <Stat label="COMBO" value={`x${snapshot.comboMultiplier}`} accent />
          </div>
          <canvas ref={canvasRef} className="qr-blaster-canvas" aria-label="QR Blaster game area" />
          <div className="qr-blaster-integrity">
            <span>QR INTEGRITY</span>
            <div><i style={{ width: `${Math.max(0, snapshot.integrity)}%` }} /></div>
            <strong>{Math.ceil(Math.max(0, snapshot.integrity))}%</strong>
          </div>
          <div className={`qr-blaster-warning ${snapshot.warning ? "is-active" : ""}`}>{snapshot.warning}</div>
          {view === "countdown" && <div className="qr-blaster-countdown">{countdown}</div>}
          {snapshot.phase === "paused" && (
            <button type="button" className="qr-blaster-pause" onClick={resume}>
              <strong>PAUSED</strong>
              <span>Tap to continue</span>
            </button>
          )}
        </section>
      )}

      {view === "over" && results && (
        <section className="qr-blaster-panel qr-blaster-results">
          <p className="overline">CODE CORRUPTED</p>
          <h1>QR BLASTER</h1>
          <Result label="SCORE" value={results.score.toLocaleString()} />
          <Result label="SURVIVAL TIME" value={formatTime(results.elapsed, true)} />
          <Result label="ACCURACY" value={`${results.accuracy}%`} />
          <Result label="BEST COMBO" value={`x${results.bestCombo}`} />
          <Result label="ENEMIES DESTROYED" value={String(results.destroyed)} />
          <Result label="RANK" value={results.rank} accent />
          <div className="qr-blaster-actions">
            <button type="button" onClick={startCountdown}>PLAY AGAIN</button>
            <button type="button" className="secondary" onClick={onBack}>BACK TO EXPERIENCE</button>
          </div>
        </section>
      )}
    </main>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return <div className={accent ? "is-accent" : ""}><span>{label}</span><strong>{value}</strong></div>;
}

function Result({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return <div className={`qr-blaster-result ${accent ? "is-accent" : ""}`}><span>{label}</span><strong>{value}</strong></div>;
}

function formatTime(totalSeconds: number, tenths = false) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const suffix = tenths ? `.${Math.floor((totalSeconds % 1) * 10)}` : "";
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}${suffix}`;
}

function updateRuntime(runtime: Runtime, size: { width: number; height: number }, now: number, dt: number) {
  const spawnEvery = Math.max(gameConfig.spawnRateMin, gameConfig.spawnRateStart - runtime.elapsed * 18);
  if (now - runtime.lastSpawn > spawnEvery) {
    runtime.lastSpawn = now;
    const count = runtime.elapsed > 45 ? 2 : 1;
    for (let index = 0; index < count; index += 1) runtime.enemies.push(createEnemy(runtime, size));
  }

  const center = qrCenter(size);
  const radius = qrSize(size) * 0.52;
  runtime.enemies.forEach((enemy) => {
    if (enemy.kind === "glitch") {
      const wobble = Math.sin(now / 110 + enemy.jitterSeed) * 0.8;
      enemy.x += (enemy.vx - enemy.vy * wobble) * dt;
      enemy.y += (enemy.vy + enemy.vx * wobble) * dt;
    } else {
      enemy.x += enemy.vx * dt;
      enemy.y += enemy.vy * dt;
    }
  });

  runtime.enemies = runtime.enemies.filter((enemy) => {
    const distance = Math.hypot(enemy.x - center.x, enemy.y - center.y);
    if (distance > radius) return true;
    const finderHit = isFinderHit(enemy.x, enemy.y, size);
    const damage = finderHit ? enemy.damage * gameConfig.finderDamageMultiplier : enemy.damage;
    runtime.integrity = Math.max(0, runtime.integrity - damage);
    runtime.comboHits = 0;
    runtime.warning = finderHit ? "FINDER PATTERN DAMAGED" : "QR INTEGRITY HIT";
    runtime.warningUntil = now + 950;
    runtime.shakeUntil = now + 240;
    return false;
  });

  runtime.floats = runtime.floats.filter((floating) => now - floating.bornAt < 760);
}

function createEnemy(runtime: Runtime, size: { width: number; height: number }): Enemy {
  const kind = pickEnemyKind(runtime.elapsed);
  const spec = gameConfig.enemy[kind];
  const center = qrCenter(size);
  const edge = Math.floor(Math.random() * 8);
  const positions = [
    { x: Math.random() * size.width, y: -40 },
    { x: Math.random() * size.width, y: size.height + 40 },
    { x: -40, y: Math.random() * size.height },
    { x: size.width + 40, y: Math.random() * size.height },
    { x: -40, y: -40 },
    { x: size.width + 40, y: -40 },
    { x: -40, y: size.height + 40 },
    { x: size.width + 40, y: size.height + 40 }
  ];
  const spawn = positions[edge];
  const angle = Math.atan2(center.y - spawn.y, center.x - spawn.x);
  const speed = spec.speed * (1 + runtime.elapsed * gameConfig.speedIncreasePerSecond);
  return {
    id: runtime.nextId++,
    kind,
    x: spawn.x,
    y: spawn.y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    speed,
    size: spec.size,
    hp: spec.hp,
    maxHp: spec.hp,
    points: spec.points,
    damage: spec.damage,
    bornAt: performance.now(),
    jitterSeed: Math.random() * 10
  };
}

function pickEnemyKind(elapsed: number): EnemyKind {
  const roll = Math.random();
  if (roll > 0.975 && elapsed > 18) return "bonus";
  if (roll > 0.93 && elapsed > 20) return "error";
  if (roll > 0.82 && elapsed > 16) return "glitch";
  if (roll > 0.66 && elapsed > 12) return "heavy";
  if (roll > 0.43 && elapsed > 6) return "fast";
  return "normal";
}

function qrCenter(size: { width: number; height: number }) {
  return { x: size.width / 2, y: size.height / 2 + 6 };
}

function qrSize(size: { width: number; height: number }) {
  return Math.min(size.width * 0.62, size.height * 0.42, 330);
}

function isFinderHit(x: number, y: number, size: { width: number; height: number }) {
  const base = qrSize(size);
  const origin = { x: size.width / 2 - base / 2, y: size.height / 2 + 6 - base / 2 };
  const finder = base * 0.24;
  const zones = [
    { x: origin.x + finder * 0.55, y: origin.y + finder * 0.55 },
    { x: origin.x + base - finder * 0.55, y: origin.y + finder * 0.55 },
    { x: origin.x + finder * 0.55, y: origin.y + base - finder * 0.55 }
  ];
  return zones.some((zone) => Math.hypot(x - zone.x, y - zone.y) < finder * 0.95);
}

function draw(ctx: CanvasRenderingContext2D, runtime: Runtime, size: { width: number; height: number; dpr: number }, now: number) {
  ctx.setTransform(size.dpr, 0, 0, size.dpr, 0, 0);
  ctx.clearRect(0, 0, size.width, size.height);
  const shake = now < runtime.shakeUntil ? Math.sin(now / 24) * 5 : 0;
  ctx.save();
  ctx.translate(shake, 0);
  drawGrid(ctx, size);
  drawQRBase(ctx, size, runtime.integrity, now);
  runtime.enemies.forEach((enemy) => drawEnemy(ctx, enemy, now));
  runtime.floats.forEach((floating) => drawFloating(ctx, floating, now));
  ctx.restore();
}

function drawGrid(ctx: CanvasRenderingContext2D, size: { width: number; height: number }) {
  ctx.strokeStyle = "rgba(255,255,255,0.045)";
  ctx.lineWidth = 1;
  for (let x = 0; x < size.width; x += 28) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, size.height);
    ctx.stroke();
  }
  for (let y = 0; y < size.height; y += 28) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size.width, y);
    ctx.stroke();
  }
}

function drawQRBase(ctx: CanvasRenderingContext2D, size: { width: number; height: number }, integrity: number, now: number) {
  const base = qrSize(size);
  const cell = base / 21;
  const origin = { x: size.width / 2 - base / 2, y: size.height / 2 + 6 - base / 2 };
  const lowPulse = integrity < 25 ? Math.sin(now / 240) * 0.22 + 0.28 : 0;
  ctx.fillStyle = "rgba(255,255,255,0.05)";
  ctx.fillRect(origin.x - 10, origin.y - 10, base + 20, base + 20);
  for (let row = 0; row < 21; row += 1) {
    for (let col = 0; col < 21; col += 1) {
      if (!moduleOn(row, col)) continue;
      const corrupted = integrity < 80 && ((row * 11 + col * 7) % Math.max(3, Math.floor(integrity / 9)) === 0);
      if (corrupted) continue;
      ctx.fillStyle = "rgba(245,245,245,0.92)";
      ctx.fillRect(origin.x + col * cell + cell * 0.14, origin.y + row * cell + cell * 0.14, cell * 0.72, cell * 0.72);
    }
  }
  drawFinder(ctx, origin.x, origin.y, cell);
  drawFinder(ctx, origin.x + cell * 14, origin.y, cell);
  drawFinder(ctx, origin.x, origin.y + cell * 14, cell);
  if (integrity < 60) {
    ctx.fillStyle = `rgba(0,245,255,${0.08 + (60 - integrity) / 220})`;
    ctx.fillRect(origin.x + cell * 8, origin.y + cell * 8, cell * 6, cell * 6);
  }
  if (lowPulse) {
    ctx.strokeStyle = `rgba(255,255,255,${lowPulse})`;
    ctx.lineWidth = 3;
    ctx.strokeRect(origin.x - 16, origin.y - 16, base + 32, base + 32);
  }
}

function drawFinder(ctx: CanvasRenderingContext2D, x: number, y: number, cell: number) {
  ctx.fillStyle = "#f7f7f7";
  ctx.fillRect(x, y, cell * 7, cell * 7);
  ctx.fillStyle = "#050505";
  ctx.fillRect(x + cell, y + cell, cell * 5, cell * 5);
  ctx.fillStyle = "#f7f7f7";
  ctx.fillRect(x + cell * 2, y + cell * 2, cell * 3, cell * 3);
  ctx.strokeStyle = "rgba(0,245,255,0.55)";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(x - 2, y - 2, cell * 7 + 4, cell * 7 + 4);
}

function moduleOn(row: number, col: number) {
  const inFinder = (row < 7 && col < 7) || (row < 7 && col > 13) || (row > 13 && col < 7);
  if (inFinder) return false;
  return (row * 3 + col * 5 + row * col) % 4 !== 0;
}

function drawEnemy(ctx: CanvasRenderingContext2D, enemy: Enemy, now: number) {
  const pulse = enemy.kind === "glitch" ? Math.sin(now / 60 + enemy.jitterSeed) * 3 : 0;
  const size = enemy.size + pulse;
  ctx.save();
  ctx.translate(enemy.x, enemy.y);
  ctx.rotate(enemy.kind === "glitch" ? Math.sin(now / 90) * 0.3 : 0);
  ctx.fillStyle = enemy.kind === "bonus" ? "#ffe27a" : enemy.kind === "error" ? "#050505" : "rgba(245,245,245,0.92)";
  ctx.strokeStyle = enemy.kind === "error" ? "rgba(255,255,255,0.78)" : enemy.kind === "bonus" ? "rgba(0,245,255,0.92)" : "rgba(0,245,255,0.48)";
  ctx.lineWidth = 2;
  ctx.fillRect(-size / 2, -size / 2, size, size);
  ctx.strokeRect(-size / 2, -size / 2, size, size);
  ctx.fillStyle = enemy.kind === "error" ? "#fff" : "#050505";
  const cells = enemy.kind === "fast" ? 3 : 4;
  const mini = size / cells;
  for (let row = 0; row < cells; row += 1) {
    for (let col = 0; col < cells; col += 1) {
      if ((row + col + enemy.id) % 2 === 0) ctx.fillRect(-size / 2 + col * mini + 2, -size / 2 + row * mini + 2, mini - 4, mini - 4);
    }
  }
  if (enemy.maxHp > 1) {
    ctx.fillStyle = "rgba(0,245,255,0.8)";
    ctx.fillRect(-size / 2, size / 2 + 5, size * (enemy.hp / enemy.maxHp), 3);
  }
  ctx.restore();
}

function drawFloating(ctx: CanvasRenderingContext2D, floating: FloatingScore, now: number) {
  const age = now - floating.bornAt;
  ctx.globalAlpha = Math.max(0, 1 - age / 760);
  ctx.fillStyle = "#00f5ff";
  ctx.font = "900 16px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(floating.text, floating.x, floating.y - age * 0.05);
  ctx.globalAlpha = 1;
}
