type FinderPatternProps = {
  detected?: boolean;
  label?: string;
};

export function FinderPattern({ detected = false, label }: FinderPatternProps) {
  return (
    <div className={`finder ${detected ? "is-detected" : ""}`} aria-hidden="true">
      <div className="finder-ring">
        <div className="finder-core" />
      </div>
      <span className="finder-scan" />
      {label && <span className="finder-label">{label}</span>}
    </div>
  );
}
