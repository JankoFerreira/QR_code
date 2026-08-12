import { QRCodeSVG } from "qrcode.react";
import { presentationConfig } from "../../data/presentation";

export function SecurityScene({ step }: { step: number; reducedMotion: boolean }) {
  return (
    <div className="p-scene p-security">
      <div className="p-copy">
        <p className="p-kicker">07 / WHICH ONE DO YOU TRUST?</p>
        <h2>{step < 3 ? "Which one do you trust?" : "Treat QR codes like links."}</h2>
        <p>
          {step === 1
            ? "Can you tell where this goes?"
            : step === 2
              ? "What about this one?"
              : step >= 3
                ? "Consider where the code came from before opening it."
                : "They look equally unreadable to us."}
        </p>
      </div>
      <div className="p-security-qrs">
        <div className={step === 1 ? "selected" : ""}>
          <QRCodeSVG value={presentationConfig.securityExampleUrlA} size={280} bgColor="#ffffff" fgColor="#000000" level="H" includeMargin />
          {step >= 3 && <span>You cannot reliably read the destination by sight.</span>}
        </div>
        <div className={step === 2 ? "selected" : ""}>
          <QRCodeSVG value={presentationConfig.securityExampleUrlB} size={280} bgColor="#ffffff" fgColor="#000000" level="H" includeMargin />
          {step >= 4 && <span>Check the source before opening.</span>}
        </div>
      </div>
    </div>
  );
}
