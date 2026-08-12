import { stages } from "../data/presentation";

type ProgressIndicatorProps = {
  activeIndex: number;
};

export function ProgressIndicator({ activeIndex }: ProgressIndicatorProps) {
  return (
    <aside className="progress-indicator" aria-label="Experience progress">
      {stages.map((stage, index) => (
        <a
          key={stage}
          className={index === activeIndex ? "is-active" : ""}
          href={`#${stage.toLowerCase()}`}
          aria-label={stage}
        >
          {String(index + 1).padStart(2, "0")}
        </a>
      ))}
    </aside>
  );
}
