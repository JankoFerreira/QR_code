import { DamageAnimation } from "../../components/DamageAnimation";

export function RepairScene({ step }: { step: number; reducedMotion: boolean }) {
  const progress = step === 0 ? 0 : step === 1 ? 0.42 : step === 2 ? 0.5 : step === 3 ? 0.62 : step === 4 ? 0.86 : 1;
  return (
    <div className="p-scene p-demo">
      <div className="p-visual">
        <div className={step >= 4 ? "p-repair-active" : ""}>
          <DamageAnimation progress={progress} />
          {step >= 4 && <div className="p-recovery-clusters"><span /><span /><span /></div>}
        </div>
      </div>
      <div className="p-copy">
        <p className="p-kicker">04 / REPAIR ME</p>
        <h2 className={step >= 4 ? "accent-heading" : ""}>{step === 0 ? "Intact." : step < 3 ? "DAMAGED" : step === 3 ? "ERROR CORRECTION" : step === 4 ? "RECOVERING..." : "RECOVERED OK"}</h2>
        <p>
          {step < 2
            ? "But what happens if information is missing?"
            : "QR codes can include error-correction information that allows some lost or damaged information to be reconstructed."}
        </p>
        {step >= 4 && <p>Not unlimited.</p>}
        {step >= 5 && <div className="p-repair-recap"><span>ORIGINAL</span><span>DAMAGED</span><strong>RECOVERED</strong></div>}
      </div>
    </div>
  );
}
