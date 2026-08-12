import type { CSSProperties } from "react";

type QRModuleProps = {
  active: boolean;
  className?: string;
  style?: CSSProperties;
};

export function QRModule({ active, className = "", style }: QRModuleProps) {
  return (
    <span
      aria-hidden="true"
      className={`qr-module ${active ? "is-dark" : "is-light"} ${className}`}
      style={style}
    />
  );
}
