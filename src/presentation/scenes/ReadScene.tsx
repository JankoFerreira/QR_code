import { motion } from "framer-motion";
import { QRPattern } from "../../components/QRPattern";
import { presentationConfig } from "../../data/presentation";

export function ReadScene({ step, reducedMotion }: { step: number; reducedMotion: boolean }) {
  return (
    <div className="p-scene p-demo">
      <div className="p-visual">
        {step === 0 && <QRPattern className="p-large-qr" />}
        {step > 0 && (
          <motion.div className="p-module-zoom" animate={{ scale: step === 1 && !reducedMotion ? 1.12 : 1 }}>
            {Array.from({ length: 36 }, (_, index) => (
              <span key={index} className={(index * 7 + index) % 5 < 2 ? "on" : ""} />
            ))}
          </motion.div>
        )}
      </div>
      <div className="p-copy">
        <p className="p-kicker">03 / READ ME</p>
        <h2>{step < 2 ? "The pattern is interpreted." : step < 4 ? "Image becomes information." : "A destination appears."}</h2>
        <div className="p-data-ladder">
          <span className={step >= 2 ? "active" : ""}>MODULE PATTERN</span>
          <span className={step >= 2 ? "active" : ""}>ENCODED DATA</span>
          <span className={step >= 3 ? "active" : ""}>STRUCTURED DATA</span>
          <span className={step >= 3 ? "active" : ""}>CHARACTERS</span>
          <strong className={step >= 4 ? "active" : ""}>{presentationConfig.exampleUrl}</strong>
        </div>
        <p>{step >= 4 ? "What looks like an image becomes structured information." : "The scanner reads the arrangement of modules."}</p>
      </div>
    </div>
  );
}
