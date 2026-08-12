import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { QRDepthField } from "../../components/QRDepthField";
import { QRPattern } from "../../components/QRPattern";
import { presentationConfig } from "../../data/presentation";

export function IntroScene({ step, reducedMotion }: { step: number; reducedMotion: boolean }) {
  const diving = step >= 3;
  const qrScale = step === 2 ? 1.16 : 1;
  return (
    <div className="p-scene p-intro">
      {diving && <QRDepthField progress={step === 3 ? 0.45 : 1} reducedMotion={reducedMotion} />}
      {diving && (
        <motion.div className="p-tunnel-qr" animate={{ scale: step === 3 && !reducedMotion ? 2.7 : 4.4, opacity: step === 4 ? 0.34 : 0.68, x: step >= 3 ? "-12vw" : 0, y: step >= 3 ? "-7vh" : 0 }}>
          <QRPattern />
        </motion.div>
      )}
      {step <= 2 && (
        <motion.div className="p-scan-card p-opening-qr" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0, scale: qrScale }}>
          <div className={`p-real-qr-frame ${step === 1 ? "is-scanning" : ""} ${step >= 1 ? "is-detected" : ""}`}>
            <QRCodeSVG value={presentationConfig.presentationUrl} size={560} bgColor="#ffffff" fgColor="#000000" level="H" includeMargin />
          </div>
          <h1>SCAN ME</h1>
          <p>{step === 0 ? "Use your phone camera" : step === 1 ? "DETECTED OK" : "Now look closer."}</p>
        </motion.div>
      )}
      {step >= 4 && (
        <motion.div className="p-title-reveal p-chapter-label" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1>INSIDE THE CODE</h1>
          <p>01 / FIND ME</p>
        </motion.div>
      )}
    </div>
  );
}
