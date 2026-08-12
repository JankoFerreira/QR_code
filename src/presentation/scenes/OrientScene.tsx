import { motion } from "framer-motion";
import { QRPattern } from "../../components/QRPattern";

export function OrientScene({ step, reducedMotion }: { step: number; reducedMotion: boolean }) {
  const rotation = step === 1 ? 90 : step === 2 ? 180 : step >= 3 ? 0 : -12;
  return (
    <div className="p-scene p-demo">
      <div className="p-visual">
        <motion.div className="p-orient-frame" animate={{ rotate: reducedMotion ? 0 : rotation }} transition={{ duration: 0.8, ease: "easeInOut" }}>
          <QRPattern detectedCount={step >= 3 ? 3 : 0} className="p-large-qr" />
          {step > 0 && <span className="p-degree">{rotation}deg</span>}
        </motion.div>
      </div>
      <div className="p-copy">
        <p className="p-kicker">02 / ORIENT ME</p>
        <h2>{step >= 3 ? "Orientation detected." : "What if it is not upright?"}</h2>
        <p>{step >= 3 ? "Sideways or upside down, the scanner can determine its orientation." : "The finder patterns reveal which way is up."}</p>
      </div>
    </div>
  );
}
