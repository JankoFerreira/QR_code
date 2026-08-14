import { QRCodeSVG } from "qrcode.react";
import { presentationConfig } from "../../data/presentation";

const words = ["FIND.", "ORIENT.", "READ.", "REPAIR.", "DECODE.", "OPEN."];

export function FinalScene({ step }: { step: number; reducedMotion: boolean }) {
  return (
    <div className="p-scene p-final-presentation">
      {step === 0 && <span className="p-blackout" />}
      {step === 1 && (
        <div className="p-final-opening">
          <div className="p-scan-card p-final-message-qr">
            <QRCodeSVG value={presentationConfig.presentationUrl} size={360} bgColor="#ffffff" fgColor="#000000" level="H" includeMargin />
          </div>
          <h1>WE STARTED WITH THIS.</h1>
        </div>
      )}
      {step >= 2 && step < 7 && <h1>YOUR PHONE DID ALL OF THIS.</h1>}
      {step >= 2 && step < 7 && (
        <div className="p-final-words">
          {words.map((word, index) => <span key={word} className={step >= index + 2 ? "active" : ""}>{word} OK</span>)}
        </div>
      )}
      {step >= 7 && step < 8 && (
        <div className="p-point-scan-open">
          <span>POINT</span>
          <span>SCAN</span>
          <span>OPEN</span>
        </div>
      )}
      {step >= 8 && step < 9 && <h2>SOMETHING COMPLICATED<br />MADE <em>INCREDIBLY SIMPLE.</em></h2>}
      {step >= 9 && step < 10 && <h2>MORE THAN JUST A <em>SQUARE.</em></h2>}
      {step >= 10 && (
        <div className="p-scan-card p-final-qr-return p-grand-finale">
          <QRCodeSVG value={presentationConfig.presentationUrl} size={390} bgColor="#ffffff" fgColor="#000000" level="H" includeMargin />
          <h2>INSIDE EVERY SIMPLE SCAN<br /><em>IS A HIDDEN JOURNEY.</em></h2>
        </div>
      )}
    </div>
  );
}
