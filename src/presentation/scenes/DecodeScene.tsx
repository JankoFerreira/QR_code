import { presentationConfig } from "../../data/presentation";

const pipeline = ["CAMERA", "DETECT", "ORIENT", "READ", "CORRECT", "DECODE"];

export function DecodeScene({ step }: { step: number; reducedMotion: boolean }) {
  return (
    <div className="p-scene p-centered">
      <p className="p-kicker">05 / DECODE ME</p>
      <h2>The journey becomes one instruction.</h2>
      <div className="p-wide-pipeline">
        {pipeline.map((item, index) => (
          <div key={item} className={index < step ? "done" : index === step ? "active" : ""}>
            <span>{item}</span>
            <b>{index < step ? "OK" : index === step ? "..." : ""}</b>
          </div>
        ))}
      </div>
      {step >= 6 && (
        <div className="p-data-found">
          <span>DATA FOUND</span>
          <strong>{presentationConfig.exampleUrl}</strong>
        </div>
      )}
    </div>
  );
}
