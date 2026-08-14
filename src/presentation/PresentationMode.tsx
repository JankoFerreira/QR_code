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

type PresentationViewProps = PresentationModeProps & {
  currentIndex: number;
  cursorVisible: boolean;
  next: () => void;
  previous: () => void;
  reset: () => void;
  requestFullscreen: () => void;
};

export function PresentationMode({ debug, reducedMotion }: PresentationModeProps) {
  return (
    <PresentationController>
      {(state) => <PresentationView {...state} debug={debug} reducedMotion={reducedMotion} />}
    </PresentationController>
  );
}

function PresentationView({
  currentIndex,
  cursorVisible,
  debug,
  next,
  previous,
  reducedMotion,
  requestFullscreen,
  reset
}: PresentationViewProps) {
  const step = presentationSteps[currentIndex];
  const sceneProps = { step: step.localStep, reducedMotion };

  return (
    <main className={`presentation-stage ${cursorVisible ? "" : "is-cursor-hidden"}`}>
            <button className="presentation-hit-zone presentation-hit-zone-left" type="button" onClick={previous} aria-label="Previous step" />
            <button className="presentation-hit-zone presentation-hit-zone-right" type="button" onClick={next} aria-label="Next step" />
            <AnimatePresence mode="wait">
              <motion.div
                key={step.id}
                className="presentation-scene-shell"
                initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
                transition={{ duration: reducedMotion ? 0.12 : 0.32, ease: "easeOut" }}
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
            <div className="presentation-topbar">
              <div>
                <span>Presentation Mode</span>
                <strong>{step.number} / {step.label}</strong>
              </div>
              <div className="presentation-topbar-actions">
                <button type="button" onClick={reset}>Reset</button>
                <button type="button" onClick={requestFullscreen}>Fullscreen</button>
              </div>
            </div>
            {debug && (
              <div className="presentation-debug">
                <span>scene: {step.id}</span>
                <span>local step: {step.localStep}</span>
                <span>page: {step.absoluteStep + 1}</span>
                <span>step id: {step.stepId}</span>
                <span>visible: {currentIndex + 1}</span>
                <span>total: {presentationSteps.length}</span>
              </div>
            )}
    </main>
  );
}
