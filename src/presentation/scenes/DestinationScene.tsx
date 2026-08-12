export function DestinationScene({ step }: { step: number; reducedMotion: boolean }) {
  return (
    <div className="p-scene p-centered">
      <p className="p-kicker">06 / DESTINATION</p>
      <h2 className={step >= 5 ? "p-here-heading" : ""}>{step < 4 ? "Decode the destination." : step === 4 ? "The QR code is not the website." : "HERE"}</h2>
      <div className="p-destination-chain p-destination-horizontal">
        <span className="active">QR CODE</span>
        {step >= 1 && <span>DECODED DATA</span>}
        {step >= 2 && <span>URL</span>}
        {step >= 3 && <span>WEBSITE</span>}
      </div>
      {step === 4 && <p>It contains information your phone can use.</p>}
    </div>
  );
}
