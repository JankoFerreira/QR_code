import { QRPattern } from "./QRPattern";

export function DamageAnimation({ progress }: { progress: number }) {
  const damage = progress < 0.45 ? progress / 0.45 : 1;
  const recover = progress > 0.58 ? (progress - 0.58) / 0.42 : 0;
  const variant = recover > 0.25 ? "recovered" : damage > 0.2 ? "damaged" : "decorative";

  return (
    <div className="repair-visual">
      <QRPattern variant={variant} damageProgress={recover || damage} />
      <div className="damage-hole" style={{ opacity: damage > 0.25 && recover < 0.45 ? 1 : 0 }} />
      <div className="repair-labels">
        <span className={progress < 0.33 ? "is-active" : ""}>ORIGINAL</span>
        <span className={progress >= 0.33 && progress < 0.67 ? "is-active" : ""}>DAMAGED</span>
        <span className={progress >= 0.67 ? "is-active" : ""}>RECOVERED</span>
      </div>
    </div>
  );
}
