import { useEffect, useRef } from "react";

type QRDepthFieldProps = {
  progress: number;
  reducedMotion: boolean;
  className?: string;
};

type ModuleSeed = {
  x: number;
  y: number;
  z: number;
  size: number;
  tone: number;
};

const moduleSeeds: ModuleSeed[] = Array.from({ length: 96 }, (_, index) => {
  const col = index % 12;
  const row = Math.floor(index / 12);
  const finderBias = (col < 3 && row < 3) || (col > 8 && row < 3) || (col < 3 && row > 4);
  const active = finderBias || (index * 17 + row * 11 + col * 7) % 6 < 3;
  return {
    x: (col - 5.5) * 0.54 + (((index * 13) % 7) - 3) * 0.018,
    y: (3.5 - row) * 0.54 + (((index * 19) % 5) - 2) * 0.018,
    z: -((index * 29) % 90) / 9 - 1.5,
    size: active ? 0.14 + ((index * 5) % 3) * 0.028 : 0.055,
    tone: active ? 0.34 + ((index * 3) % 5) * 0.08 : 0.08
  };
});

export function QRDepthField({ progress, reducedMotion, className = "" }: QRDepthFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(progress);
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    if (reducedMotion || !canvasRef.current) return;

    const canvas = canvasRef.current;
    let frame = 0;
    let disposed = false;
    let cleanupScene = () => {};

    const move = (event: PointerEvent) => {
      pointerRef.current = {
        x: (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2,
        y: (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2
      };
    };

    window.addEventListener("pointermove", move, { passive: true });

    void import("three").then((THREE) => {
      if (disposed) return;
      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: false,
        antialias: false,
        powerPreference: "high-performance"
      });
      renderer.setClearColor(0x050505, 1);
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 36);
      const geometry = new THREE.PlaneGeometry(1, 1);
      const material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.58,
        depthWrite: false
      });
      const mesh = new THREE.InstancedMesh(geometry, material, moduleSeeds.length);
      const dummy = new THREE.Object3D();
      scene.add(mesh);

      const resize = () => {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.45));
        renderer.setSize(width, height, false);
        camera.aspect = width / Math.max(height, 1);
        camera.updateProjectionMatrix();
      };

      const render = (time: number) => {
        const scroll = progressRef.current;
        const pointer = pointerRef.current;
        camera.position.z = 4.8 - scroll * 4.4;
        camera.rotation.x = pointer.y * 0.035;
        camera.rotation.y = -pointer.x * 0.04;

        moduleSeeds.forEach((seed, index) => {
          const depth = seed.z + scroll * 8.2;
          const drift = Math.sin(time * 0.00024 + index) * 0.018;
        const scale = seed.size * (1 + scroll * 0.9);
          dummy.position.set(seed.x + pointer.x * 0.08 + drift, seed.y - pointer.y * 0.06, depth);
          dummy.scale.set(scale, scale, 1);
          dummy.rotation.z = scroll * 0.08 + drift;
          dummy.updateMatrix();
          mesh.setMatrixAt(index, dummy.matrix);
          mesh.setColorAt(index, new THREE.Color(seed.tone, seed.tone, seed.tone));
        });
        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
        renderer.render(scene, camera);
        frame = requestAnimationFrame(render);
      };

      resize();
      window.addEventListener("resize", resize);
      frame = requestAnimationFrame(render);
      cleanupScene = () => {
        window.removeEventListener("resize", resize);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
      };
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      cleanupScene();
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;
  return <canvas ref={canvasRef} className={`qr-depth-field ${className}`} aria-hidden="true" />;
}
