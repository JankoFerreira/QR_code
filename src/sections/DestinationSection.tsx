import { QRCodeDisplay } from "../components/QRCodeDisplay";
import { presentationConfig } from "../data/presentation";

export function DestinationSection({ presentationMode, progress }: { presentationMode: boolean; progress: number }) {
  return (
    <section id="destination" className="scroll-section destination-section">
      <div className="sticky-stage two-column reverse">
        <div className="destination-flow">
          <span>QR CODE</span>
          <i>-&gt;</i>
          <span>URL</span>
          <i>-&gt;</i>
          <span>WEBSITE</span>
          {!presentationMode && <QRCodeDisplay value={presentationConfig.presentationUrl} />}
        </div>
        <div className="section-copy">
          <p className="overline">06 / DESTINATION</p>
          <h2>Not magic.</h2>
          <p>The code held a destination.</p>
          <p>That destination is <strong className={progress > 0.55 ? "here-pop" : ""}>HERE</strong>.</p>
        </div>
      </div>
    </section>
  );
}
