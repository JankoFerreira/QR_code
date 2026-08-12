export function DestinationScene({ step }: { step: number; reducedMotion: boolean }) {
  return (
    <div className="p-scene p-centered">
      <p className="p-kicker">06 / DESTINATION</p>
      <h2>{step < 4 ? "Decode the destination." : step === 4 ? "The QR code is not the website." : "It brought you HERE."}</h2>
      <div className="p-destination-chain">
        <span className="active">QR CODE</span>
        {step >= 1 && <span>DECODED DATA</span>}
        {step >= 2 && <span>URL</span>}
        {step >= 3 && <span>WEBSITE</span>}
      </div>
      {step >= 4 && <p>{step === 4 ? "It contains information your phone can use." : "And that information brought you here."}</p>}
      {step >= 5 && <strong className="p-here">HERE</strong>}
    </div>
  );
}
