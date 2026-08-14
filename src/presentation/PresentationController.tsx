import { useCallback, useEffect, useMemo, useState } from "react";
import { createPresenterChannel, getPresentationStatePayload, type PresenterMessage } from "./presenterChannel";
import { presentationScenes, presentationSteps, sceneStartIndex, stepIndexById } from "./presentationSteps";

type PresentationControllerProps = {
    children: (state: {
    currentIndex: number;
    setCurrentIndex: (index: number) => void;
    next: () => void;
    previous: () => void;
    reset: () => void;
    requestFullscreen: () => void;
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
  const goToFinal = useCallback(() => setCurrentIndexState(total - 1), [total]);
  const requestFullscreen = useCallback(() => {
    void document.documentElement.requestFullscreen?.().catch(() => undefined);
  }, []);

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
      if (key === "end") goToFinal();
      if (key === "f") requestFullscreen();
      if (/^[1-9]$/.test(key)) {
        const scene = presentationScenes[Number(key) - 1];
        if (scene) setCurrentIndex(sceneStartIndex[scene.id]);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goToFinal, next, previous, requestFullscreen, reset, setCurrentIndex, total]);

  useEffect(() => {
    const channel = createPresenterChannel();
    if (!channel) return undefined;
    const sendState = () => {
      channel.postMessage({
        type: "STATE_UPDATE",
        ...getPresentationStatePayload(presentationSteps[currentIndex], currentIndex, total)
      } satisfies PresenterMessage);
    };
    const onMessage = (event: MessageEvent<PresenterMessage>) => {
      const message = event.data;
      if (!message || typeof message !== "object") return;
      if (message.type === "PING") channel.postMessage({ type: "PONG" } satisfies PresenterMessage);
      if (message.type === "REQUEST_STATE") sendState();
      if (message.type === "NEXT_STEP") next();
      if (message.type === "PREVIOUS_STEP") previous();
      if (message.type === "RESET" || message.type === "FIRST_STEP") reset();
      if (message.type === "FINAL_STEP") goToFinal();
      if (message.type === "GO_TO_STEP") {
        const index = stepIndexById[message.stepId];
        if (typeof index === "number") setCurrentIndex(index);
      }
    };
    channel.addEventListener("message", onMessage);
    return () => {
      channel.removeEventListener("message", onMessage);
      channel.close();
    };
  }, [currentIndex, goToFinal, next, previous, reset, setCurrentIndex, total]);

  useEffect(() => {
    const channel = createPresenterChannel();
    if (!channel) return undefined;
    channel.postMessage({
      type: "STATE_UPDATE",
      ...getPresentationStatePayload(presentationSteps[currentIndex], currentIndex, total)
    } satisfies PresenterMessage);
    return () => channel.close();
  }, [currentIndex, total]);

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
    () => ({ currentIndex, setCurrentIndex, next, previous, reset, requestFullscreen, cursorVisible }),
    [currentIndex, cursorVisible, next, previous, requestFullscreen, reset, setCurrentIndex]
  );

  return <>{children(state)}</>;
}
