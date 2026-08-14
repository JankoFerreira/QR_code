import type { CSSProperties } from "react";
import { presentationConfig } from "../../data/presentation";

const pipeline = [
  { title: "CAMERA", detail: "captures the square" },
  { title: "FIND", detail: "locks onto patterns" },
  { title: "ORIENT", detail: "turns the map upright" },
  { title: "READ", detail: "checks every module" },
  { title: "REPAIR", detail: "fills what it can" },
  { title: "DECODE", detail: "reveals the address" }
];

export function DecodeScene({ step }: { step: number; reducedMotion: boolean }) {
  const activeStep = Math.min(step, pipeline.length - 1);
  return (
    <div className="p-scene p-centered p-decode-show">
      <div className="p-decode-core">
        <p className="p-kicker">05 / DECODE ME</p>
        <h2>{step >= 6 ? "The code becomes an address." : "Let's put the journey together."}</h2>
        <div className="p-decode-radar" aria-hidden="true">
          {pipeline.map((item, index) => (
            <span key={item.title} className={index <= activeStep ? "lit" : ""} />
          ))}
          <strong>{pipeline[activeStep].title}</strong>
        </div>
      </div>
      <div className="p-wide-pipeline p-cinematic-pipeline" style={{ "--active-step": activeStep } as CSSProperties}>
        {pipeline.map((item, index) => (
          <div key={item.title} className={index < step ? "done" : index === step ? "active" : ""}>
            <span>{item.title}</span>
            <small>{item.detail}</small>
            <b>{index < step ? "OK" : index === step ? "ACTIVE" : ""}</b>
          </div>
        ))}
      </div>
      {step >= 6 && (
        <div className="p-data-found p-address-reveal">
          <span>Decoded address</span>
          <strong>{presentationConfig.exampleUrl}</strong>
        </div>
      )}
    </div>
  );
}
