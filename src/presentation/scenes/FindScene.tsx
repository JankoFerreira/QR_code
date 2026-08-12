import { QRPattern } from "../../components/QRPattern";

export function FindScene({ step }: { step: number; reducedMotion: boolean }) {
  const detected = step <= 0 ? 0 : step >= 4 ? 3 : step;
  return (
    <div className="p-scene p-demo">
      <div className="p-visual p-find-visual">
        <QRPattern variant={step === 0 ? "decorative" : "dimmed"} detectedCount={detected} className="p-large-qr" />
      </div>
      <div className="p-copy">
        <p className="p-kicker">01 / FIND ME</p>
        <h2>{step === 0 ? "First, find the code." : step >= 4 ? "Three reference points." : "Finder pattern found."}</h2>
        <p>{step === 0 ? "The scanner first needs to locate the code." : step >= 4 ? "They help the scanner lock onto the QR code." : `Point ${detected}: FOUND OK`}</p>
      </div>
    </div>
  );
}
