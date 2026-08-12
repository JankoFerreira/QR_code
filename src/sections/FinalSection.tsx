import { QRPattern } from "../components/QRPattern";
import { presentationConfig } from "../data/presentation";

const finalWords = ["Find.", "Orient.", "Read.", "Repair.", "Decode.", "Open."];

export function FinalSection({ progress, onScanAgain, onPlayGame }: { progress: number; onScanAgain: () => void; onPlayGame: () => void }) {
  const activeWords = Math.min(finalWords.length, Math.floor(Math.max(0, progress - 0.16) * 10));
  return (
    <section id="reveal" className="final-section">
      <div className="sticky-stage final-stage">
        <div className="final-copy">
          <h2>Through a QR code.</h2>
          <div className="word-sequence">
            {finalWords.map((word, index) => (
              <span key={word} className={index < activeWords ? "is-active" : ""}>{word}</span>
            ))}
          </div>
          <p className={progress > 0.62 ? "is-active" : ""}>The complex became simple.</p>
          <h3 className={progress > 0.72 ? "is-active" : ""}>{presentationConfig.title.toUpperCase()}</h3>
          <div className={`last-message ${progress > 0.82 ? "is-active" : ""}`}>
            <p>The scan was only the beginning.</p>
            <p>Now you know what happened<br />before this screen.</p>
          </div>
          <div className={`final-actions ${progress > 0.88 ? "is-active" : ""}`}>
            <p>Think you're faster than the scanner?</p>
            <button type="button" className="game-cta" onClick={onPlayGame}>PLAY QR BLASTER</button>
            <button type="button" onClick={onScanAgain}>SCAN AGAIN</button>
          </div>
        </div>
        <div className="final-pattern"><QRPattern /></div>
      </div>
    </section>
  );
}
