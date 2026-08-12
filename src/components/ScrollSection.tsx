import { PropsWithChildren, useRef } from "react";
import { motion } from "framer-motion";
import { useScrollProgress } from "../hooks/useScrollProgress";

type ScrollSectionProps = PropsWithChildren<{
  id: string;
  className?: string;
  height?: "normal" | "long";
  onProgress?: (progress: number) => void;
}>;

export function ScrollSection({ id, className = "", height = "normal", children, onProgress }: ScrollSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);
  onProgress?.(progress);

  return (
    <motion.section
      id={id}
      ref={ref}
      className={`scroll-section ${height === "long" ? "is-long" : ""} ${className}`}
      initial={{ opacity: 0.5 }}
      whileInView={{ opacity: 1 }}
      viewport={{ amount: 0.3 }}
    >
      {children}
    </motion.section>
  );
}
