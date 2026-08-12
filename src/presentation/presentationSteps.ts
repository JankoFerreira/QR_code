export type PresentationSceneId =
  | "intro"
  | "find"
  | "orient"
  | "read"
  | "repair"
  | "decode"
  | "destination"
  | "security"
  | "final";

export type PresentationSceneMeta = {
  id: PresentationSceneId;
  label: string;
  number: string;
  steps: number;
};

export type PresentationStep = PresentationSceneMeta & {
  localStep: number;
  absoluteStep: number;
};

export const presentationScenes: PresentationSceneMeta[] = [
  { id: "intro", label: "Enter", number: "00", steps: 5 },
  { id: "find", label: "Find", number: "01", steps: 5 },
  { id: "orient", label: "Orient", number: "02", steps: 4 },
  { id: "read", label: "Read", number: "03", steps: 5 },
  { id: "repair", label: "Repair", number: "04", steps: 6 },
  { id: "decode", label: "Decode", number: "05", steps: 7 },
  { id: "destination", label: "Destination", number: "06", steps: 6 },
  { id: "security", label: "Security", number: "07", steps: 5 },
  { id: "final", label: "Reveal", number: "08", steps: 11 }
];

const removedPresentationPages = new Set([3, 21, 44]);

export const presentationSteps: PresentationStep[] = presentationScenes.flatMap((scene) =>
  Array.from({ length: scene.steps }, (_, localStep) => ({
    ...scene,
    localStep,
    absoluteStep: 0
  }))
)
  .map((step, absoluteStep) => ({ ...step, absoluteStep }))
  .filter((step) => !removedPresentationPages.has(step.absoluteStep + 1));

export const sceneStartIndex = presentationScenes.reduce<Record<PresentationSceneId, number>>((acc, scene) => {
  acc[scene.id] = presentationSteps.findIndex((step) => step.id === scene.id);
  return acc;
}, {} as Record<PresentationSceneId, number>);
