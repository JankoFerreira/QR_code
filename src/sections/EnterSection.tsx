import { motion } from "framer-motion";
import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { QRDepthField } from "../components/QRDepthField";
import { QRPattern } from "../components/QRPattern";
import { presentationConfig } from "../data/presentation";
import { useScrollProgress } from "../hooks/useScrollProgress";

export function EnterSection({ reducedMotion }: { reducedMotion: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);
  const tunnelProgress = Math.max(0, (progress - 0.68) / 0.32);
  const scale = reducedMotion ? 1 + tunnelProgress * 0.06 : 1 + tunnelProgress * 3.1;
  const opacity = tunnelProgress * 0.9;
  const titleOpacity = progress < 0.2 ? 1 : Math.max(0, 1 - (progress - 0.2) / 0.16);
  const realQrOpacity = progress < 0.18 ? 0 : progress < 0.32 ? (progress - 0.18) / 0.14 : Math.max(0, 1 - (progress - 0.62) / 0.12);
  const realQrScale = 0.92 + Math.min(1, Math.max(0, (progress - 0.18) / 0.2)) * 0.08;
  const depthOpacity = Math.min(0.42, Math.max(0, (progress - 0.72) / 0.18));

  return (
    <section id="enter" ref={ref} className="enter-section">
      <div className="sticky-stage">
        <div className="depth-field-shell" style={{ opacity: depthOpacity }}>
          <QRDepthField progress={tunnelProgress} reducedMotion={reducedMotion} />
        </div>
        <motion.div className="enter-pattern" style={{ scale, opacity }}>
          <QRPattern />
        </motion.div>
        <motion.div className="hero-copy title-only" style={{ opacity: titleOpacity }}>
          <h1>Inside the Code</h1>
        </motion.div>
        <motion.div className="intro-real-qr" style={{ opacity: realQrOpacity, scale: realQrScale }}>
          <QRCodeSVG
            value={presentationConfig.presentationUrl}
            size={236}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H"
            includeMargin
          />
          <p>The QR code that opened this experience.</p>
        </motion.div>
        <div className="scroll-cue">Scroll</div>
      </div>
    </section>
  );
}
