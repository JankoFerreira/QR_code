import { AnimatePresence, motion } from "framer-motion";
import { presentationSteps } from "./presentationSteps";
import { PresentationController } from "./PresentationController";
import { IntroScene } from "./scenes/IntroScene";
import { FindScene } from "./scenes/FindScene";
import { OrientScene } from "./scenes/OrientScene";
import { ReadScene } from "./scenes/ReadScene";
import { RepairScene } from "./scenes/RepairScene";
import { DecodeScene } from "./scenes/DecodeScene";
import { DestinationScene } from "./scenes/DestinationScene";
import { SecurityScene } from "./scenes/SecurityScene";
import { FinalScene } from "./scenes/FinalScene";

type PresentationModeProps = {
  debug: boolean;
  reducedMotion: boolean;
};

export function PresentationMode({ debug, reducedMotion }: PresentationModeProps) {
  return (
    <PresentationController>
      {({ currentIndex, cursorVisible }) => {
        const step = presentationSteps[currentIndex];
        const sceneProps = { step: step.localStep, reducedMotion };
        return (
          <main className={`presentation-stage ${cursorVisible ? "" : "is-cursor-hidden"}`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${step.id}-${step.localStep}`}
                className="presentation-scene-shell"
                initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 1.015 }}
                transition={{ duration: reducedMotion ? 0.12 : 0.45, ease: "easeOut" }}
              >
                {step.id === "intro" && <IntroScene {...sceneProps} />}
                {step.id === "find" && <FindScene {...sceneProps} />}
                {step.id === "orient" && <OrientScene {...sceneProps} />}
                {step.id === "read" && <ReadScene {...sceneProps} />}
                {step.id === "repair" && <RepairScene {...sceneProps} />}
                {step.id === "decode" && <DecodeScene {...sceneProps} />}
                {step.id === "destination" && <DestinationScene {...sceneProps} />}
                {step.id === "security" && <SecurityScene {...sceneProps} />}
                {step.id === "final" && <FinalScene {...sceneProps} />}
              </motion.div>
            </AnimatePresence>
            <div className="presentation-progress" aria-hidden="true">
              <span>{step.number} {step.label}</span>
              <span>{currentIndex + 1} / {presentationSteps.length}</span>
            </div>
            {debug && (
              <div className="presentation-debug">
                <span>scene: {step.id}</span>
                <span>local step: {step.localStep}</span>
                <span>absolute: {currentIndex + 1}</span>
                <span>total: {presentationSteps.length}</span>
              </div>
            )}
          </main>
        );
      }}
    </PresentationController>
  );
}
