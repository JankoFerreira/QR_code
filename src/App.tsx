import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ProgressIndicator } from "./components/ProgressIndicator";
import { stages } from "./data/presentation";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { DecodeSection } from "./sections/DecodeSection";
import { DestinationSection } from "./sections/DestinationSection";
import { EnterSection } from "./sections/EnterSection";
import { FinalSection } from "./sections/FinalSection";
import { FindSection } from "./sections/FindSection";
import { OrientSection } from "./sections/OrientSection";
import { ReadSection } from "./sections/ReadSection";
import { RepairSection } from "./sections/RepairSection";
import { SecuritySection } from "./sections/SecuritySection";
import { PresentationMode } from "./presentation/PresentationMode";

function useQueryFlags() {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    return {
      debug: params.get("debug") === "true",
      presentationMode: params.get("presentation") === "true"
    };
  }, []);
}

export default function App() {
  const reducedMotion = useReducedMotion();
  const { debug, presentationMode } = useQueryFlags();
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressBySection, setProgressBySection] = useState<Record<string, number>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = stages.findIndex((stage) => stage.toLowerCase() === visible.target.id);
        if (index >= 0) setActiveIndex(index);
      },
      { threshold: [0.25, 0.5, 0.75] }
    );
    stages.forEach((stage) => {
      const element = document.getElementById(stage.toLowerCase());
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);

  const setSectionProgress = useCallback((id: string, value: number) => {
    setProgressBySection((current) => (Math.abs((current[id] ?? 0) - value) < 0.01 ? current : { ...current, [id]: value }));
  }, []);

  const scanAgain = () => window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });

  if (presentationMode) {
    return <PresentationMode debug={debug} reducedMotion={reducedMotion} />;
  }

  return (
    <main>
      <ProgressIndicator activeIndex={activeIndex} />
      <EnterSection reducedMotion={reducedMotion} />
      <ProgressWrapper id="find" onProgress={setSectionProgress}><FindSection progress={progressBySection.find ?? 0} /></ProgressWrapper>
      <ProgressWrapper id="orient" onProgress={setSectionProgress}><OrientSection progress={progressBySection.orient ?? 0} reducedMotion={reducedMotion} /></ProgressWrapper>
      <ProgressWrapper id="read" onProgress={setSectionProgress}><ReadSection progress={progressBySection.read ?? 0} /></ProgressWrapper>
      <ProgressWrapper id="repair" onProgress={setSectionProgress}><RepairSection progress={progressBySection.repair ?? 0} /></ProgressWrapper>
      <ProgressWrapper id="decode" onProgress={setSectionProgress}><DecodeSection progress={progressBySection.decode ?? 0} /></ProgressWrapper>
      <ProgressWrapper id="destination" onProgress={setSectionProgress}><DestinationSection presentationMode={presentationMode} progress={progressBySection.destination ?? 0} /></ProgressWrapper>
      <SecuritySection />
      <ProgressWrapper id="reveal" onProgress={setSectionProgress}><FinalSection progress={progressBySection.reveal ?? 0} onScanAgain={scanAgain} /></ProgressWrapper>
      {debug && (
        <div className="debug-panel">
          <span>section: {stages[activeIndex]}</span>
          <span>scroll: {Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100 || 0)}%</span>
          <span>animation: {Math.round((progressBySection[stages[activeIndex].toLowerCase()] ?? 0) * 100)}%</span>
        </div>
      )}
    </main>
  );
}

function ProgressWrapper({ id, onProgress, children }: { id: string; onProgress: (id: string, progress: number) => void; children: ReactNode }) {
  useEffect(() => {
    let frame = 0;
    const update = () => {
      const element = document.getElementById(id);
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const value = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / (rect.height + window.innerHeight)));
      onProgress(id, value);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [id, onProgress]);
  return <>{children}</>;
}
