import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { presentationConfig } from "../../data/presentation";

export function IntroScene({ step, reducedMotion }: { step: number; reducedMotion: boolean }) {
  const qrScale = step === 3 ? 1.08 : 1;
  const showQr = step >= 1 && step <= 3;
  return (
    <div className="p-scene p-intro">
      {step === 0 && (
        <motion.div
          className="p-opening-title"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.92, filter: "blur(14px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: reducedMotion ? 0.1 : 0.7, ease: "easeOut" }}
        >
          <span>Tonight</span>
          <h1>Inside The Code</h1>
          <i />
        </motion.div>
      )}
      {showQr && (
        <motion.div className="p-scan-card p-opening-qr p-qr-only" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0, scale: qrScale }}>
          <div className={`p-real-qr-frame ${step === 3 ? "is-scanning" : ""} ${step === 2 ? "is-detected" : ""}`}>
            <QRCodeSVG value={presentationConfig.presentationUrl} size={560} bgColor="#ffffff" fgColor="#000000" level="H" includeMargin />
          </div>
          {step === 3 && <h1>SCAN ME</h1>}
          {step === 2 && <p>DETECTED OK</p>}
        </motion.div>
      )}
      {step >= 4 && (
        <div className="p-title-reveal p-chapter-label">
          <h1>INSIDE THE CODE</h1>
          <p>01 / FIND ME</p>
        </div>
      )}
    </div>
  );
}
