const steps = ["CAMERA", "DETECT", "ORIENT", "READ", "CORRECT", "DECODE"];

export function DecodePipeline({ progress }: { progress: number }) {
  const active = Math.min(steps.length, Math.floor(progress * (steps.length + 0.9)));
  return (
    <div className="pipeline" aria-label="QR decoding pipeline">
      {steps.map((step, index) => (
        <div key={step} className={`pipeline-step ${index < active ? "is-active" : ""}`}>
          <span>{step}</span>
          <b>{index < active ? "OK" : ""}</b>
        </div>
      ))}
      <div className={`data-found ${active >= steps.length ? "is-active" : ""}`}>DATA FOUND</div>
    </div>
  );
}
