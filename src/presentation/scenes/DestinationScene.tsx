import { QRCodeSVG } from "qrcode.react";
import { presentationConfig } from "../../data/presentation";

export function DestinationScene({ step }: { step: number; reducedMotion: boolean }) {
  const active = Math.min(step, 5);
  return (
    <div className="p-scene p-centered p-destination-story">
      <p className="p-kicker">06 / DESTINATION</p>
      <h2>{step < 4 ? "The square is a doorway." : step === 4 ? "It started here." : "It ends on the page."}</h2>
      <div className="p-destination-map">
        <div className={`p-destination-node ${active >= 0 ? "active" : ""}`}>
          <QRCodeSVG value={presentationConfig.presentationUrl} size={180} bgColor="#ffffff" fgColor="#000000" level="H" includeMargin />
          <span>QR code</span>
        </div>
        <div className={`p-destination-node ${active >= 1 ? "active" : ""}`}>
          <b>010010</b>
          <span>decoded data</span>
        </div>
        <div className={`p-destination-node p-url-node ${active >= 2 ? "active" : ""}`}>
          <b>{presentationConfig.exampleUrl}</b>
          <span>website address</span>
        </div>
        <div className={`p-destination-node p-phone-node ${active >= 3 ? "active" : ""}`}>
          <div className="p-phone-browser">
            <i />
            <strong>Inside The Code</strong>
            <em>Find. Orient. Read. Repair. Decode.</em>
            <small>Audience page open</small>
          </div>
          <span>website page</span>
        </div>
      </div>
      {step >= 4 && <p>The website on your phone did not come from magic. It came from a pattern your phone translated into a destination.</p>}
    </div>
  );
}
