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
      {({ currentIndex, cursorVisible, next, previous, reset, requestFullscreen, setCurrentIndex }) => {
        const step = presentationSteps[currentIndex];
        const total = presentationSteps.length;
        const progress = ((currentIndex + 1) / total) * 100;
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
            <div className="presentation-toolbar" aria-label="Presentation controls">
              <button type="button" onClick={previous} disabled={currentIndex === 0} aria-label="Previous step">
                <span>Back</span>
                <strong>Left</strong>
              </button>
              <div className="presentation-progress-panel">
                <div className="presentation-progress-meta">
                  <strong>{currentIndex + 1} / {total}</strong>
                  <span>{step.localStep + 1} / {step.steps}</span>
                </div>
                <div className="presentation-progress-track"><i style={{ width: `${progress}%` }} /></div>
                <div className="presentation-scenes">
                  {presentationScenes.map((scene) => {
                    const first = presentationSteps.findIndex((item) => item.id === scene.id);
                    const last = first + scene.steps - 1;
                    const state = currentIndex < first ? "future" : currentIndex > last ? "done" : "current";
                    return (
                      <button key={scene.id} type="button" className={state} onClick={() => setCurrentIndex(first)}>
                        <span>{scene.number}</span>
                        <strong>{scene.label}</strong>
                      </button>
                    );
                  })}
                </div>
              </div>
              <button type="button" onClick={next} disabled={currentIndex === total - 1} aria-label="Next step">
                <span>Next</span>
                <strong>Right / Space</strong>
              </button>
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
