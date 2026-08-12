import { QRCodeSVG } from "qrcode.react";
import { presentationConfig } from "../data/presentation";

export function SecuritySection() {
  return (
    <section id="security" className="scroll-section security-section">
      <div className="sticky-stage two-column">
        <div className="security-pair" aria-hidden="true">
          <QRCodeSVG value={presentationConfig.securityExampleUrlA} size={150} bgColor="#ffffff" fgColor="#000000" level="H" includeMargin />
          <QRCodeSVG value={presentationConfig.securityExampleUrlB} size={150} bgColor="#ffffff" fgColor="#000000" level="H" includeMargin />
        </div>
        <div className="section-copy">
          <p className="overline">07 / WHICH ONE DO YOU TRUST?</p>
          <h2>Treat QR codes like links.</h2>
          <p>You cannot reliably read the destination just by looking at the pattern.</p>
        </div>
      </div>
    </section>
  );
}
