import type { CSSProperties } from "react";
import { presentationConfig } from "../../data/presentation";

const pipeline = ["CAMERA", "DETECT", "ORIENT", "READ", "CORRECT", "DECODE"];

export function DecodeScene({ step }: { step: number; reducedMotion: boolean }) {
  return (
    <div className="p-scene p-centered">
      <p className="p-kicker">05 / DECODE ME</p>
      <h2>{step >= 6 ? "DATA FOUND OK" : "The journey becomes one instruction."}</h2>
      {step >= 6 && (
        <div className="p-data-found">
          <strong>{presentationConfig.exampleUrl}</strong>
        </div>
      )}
      <div className="p-wide-pipeline" style={{ "--active-step": Math.min(step, pipeline.length - 1) } as CSSProperties}>
        {pipeline.map((item, index) => (
          <div key={item} className={index < step ? "done" : index === step ? "active" : ""}>
            <span>{item}</span>
            <b>{index < step ? "OK" : index === step ? "ACTIVE" : ""}</b>
          </div>
        ))}
      </div>
    </div>
  );
}
