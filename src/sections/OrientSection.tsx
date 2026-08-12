import { motion } from "framer-motion";
import { QRPattern } from "../components/QRPattern";

export function OrientSection({ progress, reducedMotion }: { progress: number; reducedMotion: boolean }) {
  const rotation = reducedMotion ? 0 : progress < 0.35 ? 0 : progress < 0.55 ? 90 : progress < 0.75 ? 180 : 0;
  return (
    <section id="orient" className="scroll-section">
      <div className="sticky-stage two-column reverse">
        <motion.div
          className="orientation-frame"
          animate={{ rotate: rotation }}
          transition={{ type: "spring", stiffness: 74, damping: 20 }}
        >
          <QRPattern />
          <span className="degree-readout">{rotation}deg</span>
        </motion.div>
        <div className="section-copy">
          <p className="overline">02 / ORIENT ME</p>
          <h2>Sideways still works.</h2>
          <p>The markers reveal which way is up.</p>
        </div>
      </div>
    </section>
  );
}
