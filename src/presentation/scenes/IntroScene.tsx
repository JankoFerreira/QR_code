import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { QRDepthField } from "../../components/QRDepthField";
import { QRPattern } from "../../components/QRPattern";
import { presentationConfig } from "../../data/presentation";

export function IntroScene({ step, reducedMotion }: { step: number; reducedMotion: boolean }) {
  const diving = step >= 3;
  return (
    <div className="p-scene p-intro">
      {diving && <QRDepthField progress={step === 3 ? 0.45 : 1} reducedMotion={reducedMotion} />}
      {diving && (
        <motion.div className="p-tunnel-qr" animate={{ scale: step === 3 && !reducedMotion ? 2.5 : 3.4, opacity: step === 4 ? 0.24 : 0.52 }}>
          <QRPattern />
        </motion.div>
      )}
      {step <= 2 && (
        <motion.div className="p-scan-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <QRCodeSVG value={presentationConfig.presentationUrl} size={420} bgColor="#ffffff" fgColor="#000000" level="H" includeMargin />
          <h1>SCAN ME</h1>
          <p>{step === 0 ? "Use your phone camera" : step === 1 ? "You scanned it." : "Now step inside it."}</p>
        </motion.div>
      )}
      {step >= 4 && (
        <motion.div className="p-title-reveal" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1>INSIDE THE CODE</h1>
        </motion.div>
      )}
    </div>
  );
}
