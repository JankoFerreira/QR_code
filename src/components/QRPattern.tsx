import { FinderPattern } from "./FinderPattern";
import { QRModule } from "./QRModule";

const size = 29;
const finderAreas = [
  { row: 1, col: 1, key: "tl" },
  { row: 1, col: 21, key: "tr" },
  { row: 21, col: 1, key: "bl" }
];

function isFinder(row: number, col: number) {
  return finderAreas.some(
    (finder) => row >= finder.row && row < finder.row + 7 && col >= finder.col && col < finder.col + 7
  );
}

function moduleOn(row: number, col: number) {
  if (isFinder(row, col)) return false;
  const a = (row * 7 + col * 11 + row * col) % 9;
  const b = (row + col * 3) % 5;
  return a < 4 || b === 0;
}

type QRPatternProps = {
  variant?: "decorative" | "dimmed" | "damaged" | "recovered";
  showFinders?: boolean;
  detectedCount?: number;
  damageProgress?: number;
  className?: string;
};

export function QRPattern({
  variant = "decorative",
  showFinders = true,
  detectedCount = 0,
  damageProgress = 0,
  className = ""
}: QRPatternProps) {
  const cells = Array.from({ length: size * size }, (_, index) => {
    const row = Math.floor(index / size);
    const col = index % size;
    const repairZone = row > 10 && row < 21 && col > 12 && col < 24;
    const damaged =
      variant === "damaged" &&
      damageProgress > 0.18 &&
      ((row > 9 && row < 17 && col > 12 && col < 23) ||
        (row > 17 && row < 25 && col > 15 && (row + col) % 2 === 0));
    const recovering = variant === "recovered" && damageProgress < 0.85 && repairZone;
    const recovered = variant === "recovered" && repairZone && moduleOn(row, col);
    return (
      <QRModule
        key={`${row}-${col}`}
        active={recovered || (!damaged && !recovering && moduleOn(row, col))}
        className={damaged || recovering ? "is-missing" : recovered ? "is-recovered-block" : ""}
        style={{ transitionDelay: `${((row + col) % 12) * 14}ms` }}
      />
    );
  });

  return (
    <div className={`qr-pattern qr-pattern-${variant} ${className}`} aria-hidden="true">
      <div className="qr-grid">{cells}</div>
      {showFinders &&
        finderAreas.map((finder, index) => (
          <div
            key={finder.key}
            className="finder-slot"
            style={{
              gridColumn: `${finder.col + 1} / span 7`,
              gridRow: `${finder.row + 1} / span 7`
            }}
          >
            <FinderPattern detected={index < detectedCount} label={index < detectedCount ? "DETECTED" : undefined} />
          </div>
        ))}
    </div>
  );
}
