import { DamageAnimation } from "../components/DamageAnimation";

export function RepairSection({ progress }: { progress: number }) {
  const headline = progress < 0.42 ? "Something is missing." : progress < 0.68 ? "It may survive." : "Recovered.";
  return (
    <section id="repair" className="scroll-section is-long">
      <div className="sticky-stage two-column reverse">
        <DamageAnimation progress={progress} />
        <div className="section-copy">
          <p className="overline">04 / REPAIR ME</p>
          <h2>{headline}</h2>
          <p>Error correction can rebuild some lost data.</p>
          <p>Not unlimited. Just enough.</p>
        </div>
      </div>
    </section>
  );
}
