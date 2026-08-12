import { DetectionAnimation } from "../components/DetectionAnimation";

export function FindSection({ progress }: { progress: number }) {
  return (
    <section id="find" className="scroll-section is-long">
      <div className="sticky-stage two-column">
        <DetectionAnimation progress={progress} />
        <div className="section-copy">
          <p className="overline">01 / FIND ME</p>
          <h2>Three anchors.</h2>
          <p>"I am a QR code."</p>
        </div>
      </div>
    </section>
  );
}
