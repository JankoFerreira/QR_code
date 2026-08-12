import { QRCodeSVG } from "qrcode.react";

type QRCodeDisplayProps = {
  value: string;
  label?: string;
};

export function QRCodeDisplay({ value, label = "Scannable presentation QR code" }: QRCodeDisplayProps) {
  return (
    <figure className="real-qr">
      <QRCodeSVG value={value} size={180} bgColor="#ffffff" fgColor="#000000" level="H" includeMargin />
      <figcaption>{label}</figcaption>
    </figure>
  );
}
