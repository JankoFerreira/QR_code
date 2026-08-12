import { QRPattern } from "../components/QRPattern";
import { presentationConfig } from "../data/presentation";

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export function DestinationSection({ progress }: { presentationMode: boolean; progress: number }) {
  const addressIn = clamp((progress - 0.18) / 0.24);
  const addressOut = clamp((progress - 0.54) / 0.18);
  const arrival = clamp((progress - 0.62) / 0.24);
  const signalStyle = {
    opacity: Math.max(0.08, 1 - progress * 1.5),
    transform: `translateY(${Math.min(38, progress * 58)}px) scale(${Math.max(0.68, 1 - progress * 0.32)})`
  };
  const urlStyle = {
    opacity: addressIn * (1 - addressOut),
    transform: `translateY(${Math.max(-18, 22 - progress * 64)}px)`
  };
  const arrivalStyle = {
    opacity: arrival,
    transform: `scale(${0.92 + arrival * 0.08})`
  };

  return (
    <section id="destination" className="scroll-section destination-section">
      <div className="sticky-stage two-column reverse">
        <div className="destination-reveal">
          <div className="destination-signal" style={signalStyle}>
            <QRPattern variant={progress > 0.42 ? "dimmed" : "decorative"} detectedCount={progress > 0.18 ? 3 : 0} />
          </div>
          <div className="destination-address" style={urlStyle}>
            <span>destination found</span>
            <strong>{presentationConfig.exampleUrl}</strong>
          </div>
          <div className="destination-arrival" style={arrivalStyle}>
            <span>OPEN</span>
            <strong>HERE</strong>
          </div>
        </div>
        <div className="section-copy">
          <p className="overline">06 / DESTINATION</p>
          <h2>Not magic.</h2>
          <p>The pattern became an address.</p>
          <p>And the address brought you <strong className={progress > 0.55 ? "here-pop" : ""}>HERE</strong>.</p>
        </div>
      </div>
    </section>
  );
}
