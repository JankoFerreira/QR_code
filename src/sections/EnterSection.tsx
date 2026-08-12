import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { useRef } from "react";
import { QRDepthField } from "../components/QRDepthField";
import { useScrollProgress } from "../hooks/useScrollProgress";

const tunnelGridSize = 33;

const tunnelModules = Array.from({ length: tunnelGridSize * tunnelGridSize }, (_, index) => {
  const row = Math.floor(index / tunnelGridSize);
  const col = index % tunnelGridSize;
  const topLeftFinder = row < 7 && col < 7;
  const topRightFinder = row < 7 && col > tunnelGridSize - 8;
  const bottomLeftFinder = row > tunnelGridSize - 8 && col < 7;
  const timingTrack = row === 8 || col === 8;
  const active =
    topLeftFinder ||
    topRightFinder ||
    bottomLeftFinder ||
    (timingTrack && (row + col) % 2 === 0) ||
    (row * 7 + col * 11 + row * col) % 9 < 3 ||
    (row + col * 2) % 11 === 0;
  return { active, delay: ((row + col) % 9) * 18 };
});

export function EnterSection({ reducedMotion }: { reducedMotion: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);
  const tunnelProgress = Math.max(0, (progress - 0.28) / 0.72);
  const scale = reducedMotion ? 1 + tunnelProgress * 0.08 : 0.76 + tunnelProgress * tunnelProgress * 2.9;
  const opacity = Math.min(1, tunnelProgress * 1.45);
  const titleOpacity = progress < 0.18 ? 1 : Math.max(0, 1 - (progress - 0.18) / 0.16);
  const depthOpacity = Math.min(0.5, Math.max(0, (progress - 0.3) / 0.28));
  const cueOpacity = Math.max(0, 1 - tunnelProgress * 5);

  return (
    <section id="enter" ref={ref} className="enter-section">
      <div className="sticky-stage">
        <div className="depth-field-shell" style={{ opacity: depthOpacity }}>
          <QRDepthField progress={tunnelProgress} reducedMotion={reducedMotion} />
        </div>
        <motion.div
          className="enter-tunnel"
          style={{ "--tunnel-grid": tunnelGridSize, scale, opacity, x: "-50%", y: "-50%" } as CSSProperties}
        >
          {tunnelModules.map((module, index) => (
            <span
              key={index}
              className={module.active ? "is-on" : ""}
              style={{ transitionDelay: `${module.delay}ms` }}
            />
          ))}
        </motion.div>
        <motion.div className="hero-copy title-only" style={{ opacity: titleOpacity }}>
          <h1>Inside the Code</h1>
        </motion.div>
        <div className="scroll-cue" style={{ opacity: cueOpacity }}>Scroll</div>
      </div>
    </section>
  );
}
