import { DecodePipeline } from "../components/DecodePipeline";
import { presentationConfig } from "../data/presentation";

export function DecodeSection({ progress }: { progress: number }) {
  return (
    <section id="decode" className="scroll-section is-long">
      <div className="sticky-stage two-column">
        <DecodePipeline progress={progress} />
        <div className="section-copy">
          <p className="overline">05 / DECODE ME</p>
          <h2>The signal resolves.</h2>
          <p>Information found.<br />Instruction decoded.</p>
          <div className={`revealed-url ${progress > 0.82 ? "is-active" : ""}`}>{presentationConfig.exampleUrl}</div>
        </div>
      </div>
    </section>
  );
}
