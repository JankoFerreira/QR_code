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
  stepId: string;
  title: string;
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

const stepMeta: Record<PresentationSceneId, { id: string; title: string }[]> = {
  intro: [
    { id: "intro-title", title: "Inside The Code" },
    { id: "intro-qr", title: "Opening QR" },
    { id: "intro-detected", title: "Detected" },
    { id: "intro-enter", title: "Enter The Code" },
    { id: "intro-find", title: "Find Me" }
  ],
  find: [
    { id: "find-start", title: "Finder Patterns" },
    { id: "find-top-left", title: "Top Left Pattern" },
    { id: "find-top-right", title: "Top Right Pattern" },
    { id: "find-bottom-left", title: "Bottom Left Pattern" },
    { id: "find-complete", title: "Code Located" }
  ],
  orient: [
    { id: "orient-start", title: "Orientation Problem" },
    { id: "orient-90", title: "Rotated 90" },
    { id: "orient-180", title: "Rotated 180" },
    { id: "orient-lock", title: "Orientation Lock" }
  ],
  read: [
    { id: "read-start", title: "Read Pattern" },
    { id: "read-zoom", title: "Module Zoom" },
    { id: "read-data", title: "Encoded Data" },
    { id: "read-characters", title: "Characters" },
    { id: "read-url", title: "Website Address" }
  ],
  repair: [
    { id: "repair-start", title: "Intact Code" },
    { id: "repair-damage", title: "Damaged Code" },
    { id: "repair-missing", title: "Missing Data" },
    { id: "repair-error-correction", title: "Error Correction" },
    { id: "repair-recovered", title: "Recovering" },
    { id: "repair-complete", title: "Recovered OK" }
  ],
  decode: [
    { id: "decode-camera", title: "Camera" },
    { id: "decode-detect", title: "Detect" },
    { id: "decode-orient", title: "Orient" },
    { id: "decode-read", title: "Read" },
    { id: "decode-correct", title: "Correct" },
    { id: "decode-final", title: "Decode" },
    { id: "decode-url", title: "Data Found" }
  ],
  destination: [
    { id: "destination-qr", title: "QR Code" },
    { id: "destination-url", title: "Decoded Data" },
    { id: "destination-address", title: "URL" },
    { id: "destination-website", title: "Website" },
    { id: "destination-info", title: "Not Magic" },
    { id: "destination-here", title: "Here" }
  ],
  security: [
    { id: "security-start", title: "Two QR Codes" },
    { id: "security-a", title: "QR A" },
    { id: "security-b", title: "QR B" },
    { id: "security-reveal", title: "Treat Like Links" },
    { id: "security-check", title: "Check The Source" }
  ],
  final: [
    { id: "final-start", title: "Blackout" },
    { id: "final-message", title: "Travelled Through A QR Code" },
    { id: "final-find", title: "Find" },
    { id: "final-orient", title: "Orient" },
    { id: "final-read", title: "Read" },
    { id: "final-repair", title: "Repair" },
    { id: "final-decode", title: "Decode" },
    { id: "final-open", title: "Open" },
    { id: "final-simple", title: "Complicated Made Simple" },
    { id: "final-title", title: "More Than Just A Square" },
    { id: "final-qr", title: "Final QR" }
  ]
};

export const presentationSteps: PresentationStep[] = presentationScenes.flatMap((scene) =>
  Array.from({ length: scene.steps }, (_, localStep) => ({
    ...scene,
    stepId: stepMeta[scene.id][localStep]?.id ?? `${scene.id}-${localStep}`,
    title: stepMeta[scene.id][localStep]?.title ?? scene.label,
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

export const stepIndexById = presentationSteps.reduce<Record<string, number>>((acc, step, index) => {
  acc[step.stepId] = index;
  return acc;
}, {});
