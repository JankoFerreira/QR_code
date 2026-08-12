import { useCallback, useEffect, useMemo, useState } from "react";
import { presentationScenes, presentationSteps, sceneStartIndex } from "./presentationSteps";

type PresentationControllerProps = {
  children: (state: {
    currentIndex: number;
    setCurrentIndex: (index: number) => void;
    next: () => void;
    previous: () => void;
    reset: () => void;
    cursorVisible: boolean;
  }) => React.ReactNode;
};

export function PresentationController({ children }: PresentationControllerProps) {
  const [currentIndex, setCurrentIndexState] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(true);
  const total = presentationSteps.length;

  const setCurrentIndex = useCallback((index: number) => {
    setCurrentIndexState(Math.min(total - 1, Math.max(0, index)));
  }, [total]);

  const next = useCallback(() => setCurrentIndexState((index) => Math.min(total - 1, index + 1)), [total]);
  const previous = useCallback(() => setCurrentIndexState((index) => Math.max(0, index - 1)), []);
  const reset = useCallback(() => setCurrentIndexState(0), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      const key = event.key.toLowerCase();
      if (["arrowright", " ", "pagedown", "arrowleft", "pageup", "home", "end", "r", "f"].includes(key)) {
        event.preventDefault();
      }
      if (key === "arrowright" || key === " " || key === "pagedown") next();
      if (key === "arrowleft" || key === "pageup") previous();
      if (key === "home" || key === "r") reset();
      if (key === "end") setCurrentIndex(total - 1);
      if (key === "f") {
        void document.documentElement.requestFullscreen?.().catch(() => undefined);
      }
      if (/^[1-9]$/.test(key)) {
        const scene = presentationScenes[Number(key) - 1];
        if (scene) setCurrentIndex(sceneStartIndex[scene.id]);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [next, previous, reset, setCurrentIndex, total]);

  useEffect(() => {
    let timer = window.setTimeout(() => setCursorVisible(false), 2000);
    const onMove = () => {
      setCursorVisible(true);
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setCursorVisible(false), 2000);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("pointerdown", onMove);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("pointerdown", onMove);
    };
  }, []);

  const state = useMemo(
    () => ({ currentIndex, setCurrentIndex, next, previous, reset, cursorVisible }),
    [currentIndex, cursorVisible, next, previous, reset, setCurrentIndex]
  );

  return <>{children(state)}</>;
}
