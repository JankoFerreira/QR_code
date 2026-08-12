import { QRPattern } from "./QRPattern";

export function DetectionAnimation({ progress }: { progress: number }) {
  const detectedCount = progress > 0.72 ? 3 : progress > 0.52 ? 2 : progress > 0.32 ? 1 : 0;
  return (
    <div className="detection-stage">
      <QRPattern variant="dimmed" detectedCount={detectedCount} />
    </div>
  );
}
