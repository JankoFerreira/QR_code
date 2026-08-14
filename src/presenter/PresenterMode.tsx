import type { CSSProperties } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPresenterChannel, type PresentationStatePayload, type PresenterMessage } from "../presentation/presenterChannel";
import { presentationSteps, stepIndexById } from "../presentation/presentationSteps";
import { scriptBlocks, scriptSections, type ScriptBlock } from "./speechData";

const SCROLL_KEY = "inside-code-presenter-scroll";
const TIMER_KEY = "inside-code-presenter-timer";
const AUTO_KEY = "inside-code-presenter-auto";
const SECTION_KEY = "inside-code-presenter-section";
const FONT_KEY = "inside-code-presenter-font";
const SPEAKING_LINE_RATIO = 0.4;
const SPEAKING_LINE_BOTTOM_GAP = 10;
const WHEEL_LINE_GLIDE_MS = 900;

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function getTimerState(seconds: number) {
  if (seconds >= 360) return "soft";
  return "normal";
}

function getTimerLightState(seconds: number) {
  if (seconds >= 470) return "critical";
  if (seconds >= 450) return "red";
  if (seconds >= 420) return "orange";
  if (seconds >= 360) return "green";
  return "idle";
}

function easeInOutSine(value: number) {
  return -(Math.cos(Math.PI * value) - 1) / 2;
}

export function PresenterMode() {
  const channelRef = useRef<BroadcastChannel | null>(null);
  const blockRefs = useRef<Record<string, HTMLElement | null>>({});
  const currentStepIdRef = useRef("");
  const activeBlockIdRef = useRef(scriptBlocks[0]?.id ?? "");
  const targetBlockIndexRef = useRef(0);
  const wheelLockedRef = useRef(false);
  const wheelFrameRef = useRef(0);
  const [connected, setConnected] = useState(false);
  const [lastPongAt, setLastPongAt] = useState(0);
  const [presentationState, setPresentationState] = useState<PresentationStatePayload | null>(null);
  const [activeBlockId, setActiveBlockId] = useState(scriptBlocks[0]?.id ?? "");
  const [currentSectionId, setCurrentSectionId] = useState(() => sessionStorage.getItem(SECTION_KEY) ?? "opening");
  const [autoMode, setAutoMode] = useState(() => sessionStorage.getItem(AUTO_KEY) !== "false");
  const [fontScale, setFontScale] = useState(() => Number(localStorage.getItem(FONT_KEY) ?? "1"));
  const [timerSeconds, setTimerSeconds] = useState(() => Number(sessionStorage.getItem(TIMER_KEY) ?? "0"));
  const [timerRunning, setTimerRunning] = useState(false);
  const [autoScroll, setAutoScroll] = useState(false);
  const [autoScrollSpeed, setAutoScrollSpeed] = useState(1);
  const timerLightState = getTimerLightState(timerSeconds);

  const activeBlock = useMemo(() => scriptBlocks.find((block) => block.id === activeBlockId) ?? scriptBlocks[0], [activeBlockId]);
  const speechProgress = useMemo(() => {
    const activeIndex = scriptBlocks.findIndex((block) => block.id === activeBlock?.id);
    if (activeIndex < 0 || scriptBlocks.length <= 1) return 0;
    return Math.round((activeIndex / (scriptBlocks.length - 1)) * 100);
  }, [activeBlock]);
  const nearestTrigger = useMemo(() => {
    const activeIndex = scriptBlocks.findIndex((block) => block.id === activeBlock?.id);
    if (activeIndex < 0) return undefined;
    return scriptBlocks
      .slice(0, activeIndex + 1)
      .reverse()
      .find((block) => block.triggerStepId);
  }, [activeBlock]);
  const currentStepIndex = presentationState?.stepId ? stepIndexById[presentationState.stepId] : -1;
  const currentStep = currentStepIndex >= 0 ? presentationSteps[currentStepIndex] : undefined;
  const nextStep = currentStepIndex >= 0 ? presentationSteps[currentStepIndex + 1] : undefined;

  const send = useCallback((message: PresenterMessage) => {
    channelRef.current?.postMessage(message);
  }, []);

  const goToStep = useCallback((stepId: string) => {
    send({ type: "GO_TO_STEP", stepId });
  }, [send]);

  useEffect(() => {
    const channel = createPresenterChannel();
    channelRef.current = channel;
    if (!channel) return undefined;
    const onMessage = (event: MessageEvent<PresenterMessage>) => {
      const message = event.data;
      if (message.type === "PONG") {
        setConnected(true);
        setLastPongAt(Date.now());
      }
      if (message.type === "STATE_UPDATE") {
        setPresentationState(message);
      }
    };
    channel.addEventListener("message", onMessage);
    channel.postMessage({ type: "REQUEST_STATE" } satisfies PresenterMessage);
    return () => {
      channel.removeEventListener("message", onMessage);
      channel.close();
      channelRef.current = null;
    };
  }, []);

  useEffect(() => {
    const pingTimer = window.setInterval(() => {
      send({ type: "PING" });
      setConnected(Date.now() - lastPongAt < 6500);
    }, 3000);
    send({ type: "PING" });
    return () => window.clearInterval(pingTimer);
  }, [lastPongAt, send]);

  useEffect(() => {
    const saved = Number(sessionStorage.getItem(SCROLL_KEY) ?? "0");
    if (saved > 0) window.setTimeout(() => window.scrollTo({ top: saved, behavior: "auto" }), 80);
  }, []);

  useEffect(() => {
    sessionStorage.setItem(AUTO_KEY, String(autoMode));
  }, [autoMode]);

  useEffect(() => {
    localStorage.setItem(FONT_KEY, String(fontScale));
  }, [fontScale]);

  useEffect(() => {
    sessionStorage.setItem(TIMER_KEY, String(timerSeconds));
  }, [timerSeconds]);

  useEffect(() => {
    currentStepIdRef.current = presentationState?.stepId ?? "";
  }, [presentationState?.stepId]);

  useEffect(() => {
    activeBlockIdRef.current = activeBlockId;
  }, [activeBlockId]);

  useEffect(() => {
    if (!timerRunning) return undefined;
    const timer = window.setInterval(() => setTimerSeconds((seconds) => seconds + 1), 1000);
    return () => window.clearInterval(timer);
  }, [timerRunning]);

  useEffect(() => {
    if (!autoScroll) return undefined;
    let frame = 0;
    let previousTime = performance.now();
    const tick = (time: number) => {
      const delta = time - previousTime;
      previousTime = time;
      window.scrollBy({ top: (autoScrollSpeed * delta) / 32, behavior: "auto" });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [autoScroll, autoScrollSpeed]);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || event.deltaY === 0) return;
      event.preventDefault();
      if (wheelLockedRef.current) return;

      const activeIndex = scriptBlocks.findIndex((block) => block.id === activeBlockIdRef.current);
      const fromIndex = activeIndex >= 0 ? activeIndex : targetBlockIndexRef.current;
      const direction = event.deltaY > 0 ? 1 : -1;
      const nextIndex = Math.min(scriptBlocks.length - 1, Math.max(0, fromIndex + direction));
      if (nextIndex === fromIndex) return;

      const block = scriptBlocks[nextIndex];
      const element = blockRefs.current[block.id];
      if (!element) return;

      wheelLockedRef.current = true;
      targetBlockIndexRef.current = nextIndex;

      const rect = element.getBoundingClientRect();
      const targetY = window.scrollY + rect.bottom + SPEAKING_LINE_BOTTOM_GAP - window.innerHeight * SPEAKING_LINE_RATIO;
      const startY = window.scrollY;
      const endY = Math.max(0, targetY);
      const startTime = performance.now();
      cancelAnimationFrame(wheelFrameRef.current);

      const glide = (time: number) => {
        const progress = Math.min(1, (time - startTime) / WHEEL_LINE_GLIDE_MS);
        const eased = easeInOutSine(progress);
        window.scrollTo({ top: startY + (endY - startY) * eased, behavior: "auto" });
        if (progress < 1) {
          wheelFrameRef.current = requestAnimationFrame(glide);
          return;
        }
        wheelLockedRef.current = false;
      };

      wheelFrameRef.current = requestAnimationFrame(glide);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      cancelAnimationFrame(wheelFrameRef.current);
      wheelLockedRef.current = false;
      window.removeEventListener("wheel", onWheel);
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    const evaluate = () => {
      const speakingY = window.innerHeight * SPEAKING_LINE_RATIO;
      sessionStorage.setItem(SCROLL_KEY, String(Math.round(window.scrollY)));

      let nearest: { block: ScriptBlock; distance: number } | null = null;
      for (const block of scriptBlocks) {
        const element = blockRefs.current[block.id];
        if (!element) continue;
        const rect = element.getBoundingClientRect();
        const anchor = rect.bottom + SPEAKING_LINE_BOTTOM_GAP;
        const distance = Math.abs(anchor - speakingY);
        if (!nearest || distance < nearest.distance) nearest = { block, distance };
      }
      if (nearest) {
        const nearestIndex = scriptBlocks.findIndex((block) => block.id === nearest.block.id);
        if (nearestIndex >= 0) targetBlockIndexRef.current = nearestIndex;
        setActiveBlockId(nearest.block.id);
        setCurrentSectionId(nearest.block.sectionId);
        sessionStorage.setItem(SECTION_KEY, nearest.block.sectionId);
        if (autoMode && nearest.block.triggerStepId && nearest.block.triggerStepId !== currentStepIdRef.current) {
          goToStep(nearest.block.triggerStepId);
        }
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(evaluate);
    };
    evaluate();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [autoMode, goToStep]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      if ([" ", "arrowright", "arrowleft", "r", "p", "home", "end"].includes(key)) event.preventDefault();
      if (key === " " || key === "arrowright") send({ type: "NEXT_STEP" });
      if (key === "arrowleft") send({ type: "PREVIOUS_STEP" });
      if (key === "r") send({ type: "RESET" });
      if (key === "p") setAutoMode((value) => !value);
      if (key === "home") send({ type: "FIRST_STEP" });
      if (key === "end") send({ type: "FINAL_STEP" });
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [send]);

  const jumpToSection = (sectionId: string) => {
    document.getElementById(`presenter-section-${sectionId}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const syncNearest = () => {
    if (nearestTrigger?.triggerStepId) goToStep(nearestTrigger.triggerStepId);
  };

  return (
    <main className="presenter-shell" style={{ "--presenter-font-scale": fontScale } as CSSProperties}>
      <div className="presenter-speaking-line" aria-hidden="true" />
      <header className="presenter-statusbar">
        <div className={connected ? "is-connected" : "is-disconnected"}>{connected ? "CONNECTED" : "NOT CONNECTED"} <span /></div>
        <strong>{presentationState ? `${presentationState.scene.toUpperCase()} - ${currentStep?.title.toUpperCase() ?? presentationState.stepId.toUpperCase()}` : "AWAITING PRESENTATION"}</strong>
        <div>STEP {presentationState ? presentationState.currentIndex + 1 : "--"} / {presentationState?.totalSteps ?? presentationSteps.length}</div>
        <time className={getTimerState(timerSeconds)}>{formatTime(timerSeconds)}</time>
      </header>

      <aside className="presenter-control-rail" aria-label="Presenter controls">
        <button type="button" onClick={() => send({ type: "PREVIOUS_STEP" })}>PREVIOUS</button>
        <button type="button" onClick={() => send({ type: "NEXT_STEP" })}>NEXT</button>
        <button type="button" className={autoMode ? "active" : ""} onClick={() => setAutoMode((value) => !value)}>AUTO {autoMode ? "ON" : "OFF"}</button>
        <button type="button" onClick={syncNearest}>SYNC</button>
        <button type="button" onClick={() => send({ type: "RESET" })}>RESET</button>
        <div className="presenter-compact-row">
          <button type="button" onClick={() => setFontScale((value) => Math.max(0.82, Number((value - 0.08).toFixed(2))))}>A-</button>
          <button type="button" onClick={() => setFontScale((value) => Math.min(1.35, Number((value + 0.08).toFixed(2))))}>A+</button>
        </div>
        <div className="presenter-compact-row">
          <button type="button" onClick={() => setTimerRunning(true)}>START</button>
          <button type="button" onClick={() => setTimerRunning(false)}>PAUSE</button>
        </div>
        <button type="button" onClick={() => { setTimerRunning(false); setTimerSeconds(0); }}>RESET TIMER</button>
        <button type="button" className={autoScroll ? "active" : ""} onClick={() => setAutoScroll((value) => !value)}>SCROLL {autoScroll ? "ON" : "OFF"}</button>
        <div className="presenter-compact-row">
          <button type="button" onClick={() => setAutoScrollSpeed((value) => Math.max(0.4, Number((value - 0.2).toFixed(1))))}>SLOWER</button>
          <button type="button" onClick={() => setAutoScrollSpeed((value) => Math.min(3, Number((value + 0.2).toFixed(1))))}>FASTER</button>
        </div>
      </aside>

      <nav className="presenter-section-nav" aria-label="Script sections">
        {scriptSections.map((section) => (
          <div key={section.id} className={section.id === currentSectionId ? "current" : ""}>
            <button type="button" onClick={() => jumpToSection(section.id)}>{section.number} {section.title}</button>
            <button type="button" onClick={() => goToStep(section.firstStepId)}>SYNC</button>
          </div>
        ))}
      </nav>

      <section className="presenter-visual-panel" aria-label="Current presentation state">
        <span>CURRENT VISUAL</span>
        <strong>{currentStep ? `${currentStep.label} - ${currentStep.title}` : "Presentation not connected"}</strong>
        <span>NEXT</span>
        <strong>{nextStep ? `${nextStep.label} - ${nextStep.title}` : "End"}</strong>
        <span>AUTO</span>
        <strong className={autoMode ? "cyan" : ""}>{autoMode ? "ON" : "OFF"}</strong>
      </section>

      <section className="presenter-timer-marks" aria-label="Timer markers">
        <span className={timerLightState === "green" ? "active green" : ""}>6:00</span>
        <span className={timerLightState === "orange" ? "active orange" : ""}>7:00</span>
        <span className={timerLightState === "red" ? "active red" : ""}>7:30</span>
        <span className={timerLightState === "critical" ? "active critical" : ""}>7:50</span>
      </section>

      <section className="presenter-speech-progress" aria-label="Speech progress">
        <div>
          <span>SPEECH</span>
          <strong>{speechProgress}%</strong>
        </div>
        <i style={{ width: `${speechProgress}%` }} />
      </section>

      <article className="presenter-script">
        {scriptSections.map((section) => (
          <section key={section.id} id={`presenter-section-${section.id}`} className="presenter-script-section">
            <h2><span>{section.number}</span>{section.title}</h2>
            {scriptBlocks.filter((block) => block.sectionId === section.id).map((block) => {
              const isActive = block.id === activeBlockId;
              return (
                <p
                  key={block.id}
                  ref={(element) => { blockRefs.current[block.id] = element; }}
                  className={`presenter-script-block ${isActive ? "active" : ""} ${block.emphasis ? "emphasis" : ""}`}
                  data-trigger={block.triggerStepId ?? undefined}
                >
                  {block.cue && <span className={`presenter-cue ${block.cueType ?? "note"}`}>{block.cueType === "camera" ? "CAMERA UP" : block.cue}</span>}
                  {block.text}
                </p>
              );
            })}
          </section>
        ))}
      </article>
      <div className="presenter-bottom-space" />
    </main>
  );
}
