import { QRCodeSVG } from "qrcode.react";
import { presentationConfig } from "../../data/presentation";

const words = ["FIND.", "ORIENT.", "READ.", "REPAIR.", "DECODE.", "OPEN."];

export function FinalScene({ step }: { step: number; reducedMotion: boolean }) {
  return (
    <div className="p-scene p-final-presentation">
      {step === 0 && <span className="p-blackout" />}
      {step >= 1 && step < 10 && <h1>YOU JUST TRAVELLED THROUGH A QR CODE.</h1>}
      {step >= 2 && step < 8 && (
        <div className="p-final-words">
          {words.map((word, index) => <span key={word} className={step >= index + 2 ? "active" : ""}>{word}</span>)}
        </div>
      )}
      {step >= 8 && step < 9 && <h2>SOMETHING COMPLICATED<br />MADE INCREDIBLY SIMPLE.</h2>}
      {step >= 9 && step < 10 && <h2>{presentationConfig.title.toUpperCase()}</h2>}
      {step >= 10 && (
        <div className="p-scan-card">
          <QRCodeSVG value={presentationConfig.presentationUrl} size={390} bgColor="#ffffff" fgColor="#000000" level="H" includeMargin />
          <p>Now you know what happened between the scan and this screen.</p>
        </div>
      )}
    </div>
  );
}
