import type { PresentationStep } from "./presentationSteps";

export const PRESENTER_CHANNEL_NAME = "inside-the-code-presenter";

export type PresentationStatePayload = {
  stepId: string;
  scene: string;
  localStep: number;
  absoluteStep: number;
  currentIndex: number;
  totalSteps: number;
};

export type PresenterMessage =
  | { type: "GO_TO_STEP"; stepId: string }
  | { type: "NEXT_STEP" }
  | { type: "PREVIOUS_STEP" }
  | { type: "RESET" }
  | { type: "FIRST_STEP" }
  | { type: "FINAL_STEP" }
  | { type: "PING" }
  | { type: "PONG" }
  | { type: "REQUEST_STATE" }
  | ({ type: "STATE_UPDATE" } & PresentationStatePayload);

export function createPresenterChannel() {
  if (!("BroadcastChannel" in window)) return null;
  return new BroadcastChannel(PRESENTER_CHANNEL_NAME);
}

export function getPresentationStatePayload(step: PresentationStep, currentIndex: number, totalSteps: number): PresentationStatePayload {
  return {
    stepId: step.stepId,
    scene: step.label,
    localStep: step.localStep,
    absoluteStep: step.absoluteStep + 1,
    currentIndex,
    totalSteps
  };
}
