import { AnimatePresence, motion } from "framer-motion";
import { presentationSteps } from "./presentationSteps";
import { presentationScenes } from "./presentationSteps";
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
      {({ currentIndex, cursorVisible, next, previous, requestFullscreen }) => {
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
            <div className="presentation-nav" aria-hidden="true">
              <div className="presentation-nav-line">
                {presentationScenes.map((scene) => {
                  const first = presentationSteps.findIndex((item) => item.id === scene.id);
                  const last = first + scene.steps - 1;
                  const state = currentIndex < first ? "future" : currentIndex > last ? "done" : "current";
                  return <span key={scene.id} className={state}>{scene.number}</span>;
                })}
              </div>
              <div className="presentation-nav-label">
                <strong>{step.number} / {step.label}</strong>
                <span>{step.localStep + 1} / {step.steps}</span>
              </div>
              <div className="presentation-step-dots">
                {Array.from({ length: step.steps }, (_, index) => (
                  <i key={index} className={index <= step.localStep ? "active" : ""} />
                ))}
              </div>
            </div>
            {currentIndex === 0 && (
              <div className="presentation-help" aria-hidden="true">
                <span><b>Right</b> Next</span>
                <span><b>Left</b> Back</span>
                <span><b>F</b> Fullscreen</span>
                <span><b>R</b> Reset</span>
              </div>
            )}
            <button className="presentation-fullscreen" type="button" onClick={requestFullscreen} aria-label="Enter fullscreen">FS</button>
            <div className="presentation-click-controls" aria-label="Presentation controls">
              <button type="button" onClick={previous} aria-label="Previous slide">&larr;</button>
              <button type="button" onClick={next} aria-label="Next slide">&rarr;</button>
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
