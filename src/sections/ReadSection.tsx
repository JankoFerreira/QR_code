import { presentationConfig } from "../data/presentation";

export function ReadSection({ progress }: { progress: number }) {
  const active = progress > 0.74 ? 3 : progress > 0.55 ? 2 : progress > 0.34 ? 1 : 0;
  return (
    <section id="read" className="scroll-section is-long read-section">
      <div className="sticky-stage two-column">
        <div className="module-cloud">
          {Array.from({ length: 64 }, (_, index) => (
            <span key={index} className={(index * 7 + index) % 5 < 2 ? "dark" : ""} />
          ))}
        </div>
        <div className="section-copy">
          <p className="overline">03 / READ ME</p>
          <h2>Pattern becomes data.</h2>
          <p>A picture to us.<br />Structure to the scanner.</p>
          <div className="data-stack">
            <span className={active >= 0 ? "is-active" : ""}>QR modules</span>
            <span className={active >= 1 ? "is-active" : ""}>digital data</span>
            <span className={active >= 2 ? "is-active" : ""}>characters</span>
            <span className={active >= 3 ? "is-active" : ""}>{presentationConfig.exampleUrl}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
