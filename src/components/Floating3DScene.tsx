import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Scroll-driven cinematic 3D environment.
 *
 * Behavior:
 * - Fixed full-viewport canvas; persists across every section.
 * - Reads document scroll progress (0 → 1) and drives:
 *     • camera position + look-at (cinematic travel through stages)
 *     • per-orb position / scale / morph (reposition + slow transform)
 *     • light color + intensity (warm ember → cream dawn → deep cocoa)
 *     • fog density (depth progression)
 *     • particle drift speed (environmental movement)
 * - Cursor adds layered parallax on top of the scroll choreography.
 * - SSR-safe; three.js loads only on mount.
 */
export function Floating3DScene() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !mount.current) return;

    let raf = 0;
    let disposed = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      if (disposed || !mount.current) return;

      const el = mount.current;
      const w = () => el.clientWidth;
      const h = () => el.clientHeight;

      // ─── Scene + camera ───────────────────────────────────
      const scene = new THREE.Scene();
      const fog = new THREE.FogExp2(0x0a0807, 0.07);
      scene.fog = fog;

      const camera = new THREE.PerspectiveCamera(38, w() / h(), 0.1, 100);
      camera.position.set(0, 0, 7);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w(), h());
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.95;
      el.appendChild(renderer.domElement);
      renderer.domElement.style.cssText =
        "width:100%;height:100%;display:block;pointer-events:none;";

      // ─── Lights ───────────────────────────────────────────
      const ambient = new THREE.AmbientLight(0x2a1d18, 0.55);
      scene.add(ambient);

      const keyLight = new THREE.PointLight(0xffb478, 3.5, 22, 1.4);
      keyLight.position.set(2.5, 1.8, 3);
      scene.add(keyLight);

      const cursorLight = new THREE.PointLight(0xffd1a0, 2.4, 16, 1.6);
      cursorLight.position.set(0, 0, 4);
      scene.add(cursorLight);

      const rimLight = new THREE.DirectionalLight(0x6b4a3a, 0.45);
      rimLight.position.set(-4, -2, -3);
      scene.add(rimLight);

      // ─── Orbs (floating desserts) ─────────────────────────
      type Orb = {
        mesh: THREE.Mesh;
        material: THREE.MeshPhysicalMaterial;
        baseRot: THREE.Vector3;
        // 5 keyframed positions across scroll stages (0, .25, .5, .75, 1)
        path: THREE.Vector3[];
        scalePath: number[];
        floatSpeed: number;
      };
      const orbs: Orb[] = [];

      const palettes = [
        { color: 0x3a1e14, rough: 0.18, metal: 0.85, transmission: 0 },
        { color: 0xe9d8b8, rough: 0.30, metal: 0.20, transmission: 0.45 },
        { color: 0x6b3a1f, rough: 0.25, metal: 0.55, transmission: 0 },
      ];
      const geos = [
        new THREE.IcosahedronGeometry(1, 4),
        new THREE.TorusKnotGeometry(0.7, 0.24, 200, 32),
        new THREE.SphereGeometry(0.85, 64, 64),
      ];

      // Each orb gets a 5-stage journey through space
      const paths: THREE.Vector3[][] = [
        [
          new THREE.Vector3(-2.4, 0.4, 0),
          new THREE.Vector3(-3.2, 1.1, -1.5),
          new THREE.Vector3(-1.8, -0.6, -3),
          new THREE.Vector3(0.6, 1.4, -4.5),
          new THREE.Vector3(2.8, -0.2, -6),
        ],
        [
          new THREE.Vector3(2.3, -0.3, -1.2),
          new THREE.Vector3(1.4, 0.8, -0.4),
          new THREE.Vector3(-0.2, 1.2, 0.6),
          new THREE.Vector3(-1.6, 0.2, -1.8),
          new THREE.Vector3(-2.6, -1.0, -4),
        ],
        [
          new THREE.Vector3(0.2, 0.9, -2.5),
          new THREE.Vector3(-0.8, -0.4, -1.4),
          new THREE.Vector3(1.6, -0.8, 0),
          new THREE.Vector3(2.4, 0.6, -2.2),
          new THREE.Vector3(0.4, 1.6, -5),
        ],
      ];
      const scalePaths: number[][] = [
        [1.0, 1.15, 0.9, 1.25, 0.6],
        [0.95, 1.05, 1.3, 1.0, 0.7],
        [1.0, 0.8, 1.2, 0.95, 0.5],
      ];

      for (let i = 0; i < 3; i++) {
        const p = palettes[i];
        const mat = new THREE.MeshPhysicalMaterial({
          color: p.color,
          roughness: p.rough,
          metalness: p.metal,
          clearcoat: 0.9,
          clearcoatRoughness: 0.2,
          reflectivity: 0.7,
          transmission: p.transmission,
          ior: 1.4,
          sheen: 0.5,
          sheenColor: new THREE.Color(0xffb478),
        });
        const mesh = new THREE.Mesh(geos[i], mat);
        mesh.position.copy(paths[i][0]);
        scene.add(mesh);
        orbs.push({
          mesh,
          material: mat,
          baseRot: new THREE.Vector3(
            0.05 + i * 0.02,
            0.08 + i * 0.015,
            0.02,
          ),
          path: paths[i],
          scalePath: scalePaths[i],
          floatSpeed: 0.35 + i * 0.12,
        });
      }

      // ─── Particles (ambient fog motes) ────────────────────
      const particleCount = 320;
      const pPositions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        pPositions[i * 3] = (Math.random() - 0.5) * 18;
        pPositions[i * 3 + 1] = (Math.random() - 0.5) * 12;
        pPositions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 1;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
      const pMat = new THREE.PointsMaterial({
        color: 0xffd1a0,
        size: 0.028,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const particles = new THREE.Points(pGeo, pMat);
      scene.add(particles);

      // ─── Camera keyframes (5 stages) ──────────────────────
      const camPath = [
        new THREE.Vector3(0, 0, 7),
        new THREE.Vector3(1.2, -0.6, 5.6),
        new THREE.Vector3(-1.4, 0.4, 4.8),
        new THREE.Vector3(0.8, -1.0, 6.4),
        new THREE.Vector3(0, 0.2, 9.5),
      ];
      const lookPath = [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(-0.4, 0.2, -1),
        new THREE.Vector3(0.6, -0.2, -2),
        new THREE.Vector3(-0.2, 0.4, -3),
        new THREE.Vector3(0, 0, -5),
      ];

      // Light color keyframes — warm ember → cream dawn → deep cocoa
      const keyColors = [
        new THREE.Color(0xffb478),
        new THREE.Color(0xffcf9a),
        new THREE.Color(0xf5e3c4),
        new THREE.Color(0xd6904a),
        new THREE.Color(0x6b3a1f),
      ];
      const fogColors = [
        new THREE.Color(0x0a0807),
        new THREE.Color(0x14100c),
        new THREE.Color(0x1e1610),
        new THREE.Color(0x100a08),
        new THREE.Color(0x050403),
      ];
      const fogDensities = [0.07, 0.055, 0.045, 0.065, 0.11];
      const exposures = [0.95, 1.05, 1.15, 0.95, 0.75];

      // ─── Interaction state ────────────────────────────────
      const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
      const scrollState = { progress: 0, target: 0 };

      const updateScroll = () => {
        const max = Math.max(
          1,
          document.documentElement.scrollHeight - window.innerHeight,
        );
        scrollState.target = Math.min(1, Math.max(0, window.scrollY / max));
      };
      const onMove = (e: MouseEvent) => {
        mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);
      };
      const onResize = () => {
        camera.aspect = w() / h();
        camera.updateProjectionMatrix();
        renderer.setSize(w(), h());
        updateScroll();
      };

      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("scroll", updateScroll, { passive: true });
      window.addEventListener("resize", onResize);
      updateScroll();

      // ─── Helpers ──────────────────────────────────────────
      const sampleVec = (path: THREE.Vector3[], t: number) => {
        const n = path.length - 1;
        const i = Math.min(n - 1, Math.floor(t * n));
        const local = t * n - i;
        // smoothstep
        const k = local * local * (3 - 2 * local);
        return new THREE.Vector3().lerpVectors(path[i], path[i + 1], k);
      };
      const sampleNum = (arr: number[], t: number) => {
        const n = arr.length - 1;
        const i = Math.min(n - 1, Math.floor(t * n));
        const local = t * n - i;
        const k = local * local * (3 - 2 * local);
        return arr[i] * (1 - k) + arr[i + 1] * k;
      };
      const sampleColor = (arr: THREE.Color[], t: number) => {
        const n = arr.length - 1;
        const i = Math.min(n - 1, Math.floor(t * n));
        const local = t * n - i;
        const k = local * local * (3 - 2 * local);
        return arr[i].clone().lerp(arr[i + 1], k);
      };

      // ─── Render loop ──────────────────────────────────────
      const clock = new THREE.Clock();
      const lookAt = new THREE.Vector3();

      const tick = () => {
        const t = clock.getElapsedTime();

        // ease cursor + scroll
        mouse.x += (mouse.tx - mouse.x) * 0.04;
        mouse.y += (mouse.ty - mouse.y) * 0.04;
        scrollState.progress +=
          (scrollState.target - scrollState.progress) * 0.06;
        const sp = scrollState.progress;

        // camera travel
        const camPos = sampleVec(camPath, sp);
        camera.position.x = camPos.x + mouse.x * 0.5;
        camera.position.y = camPos.y + mouse.y * 0.3;
        camera.position.z = camPos.z;

        lookAt.copy(sampleVec(lookPath, sp));
        lookAt.x += mouse.x * 0.15;
        lookAt.y += mouse.y * 0.1;
        camera.lookAt(lookAt);

        // depth + tonal mood
        fog.density = sampleNum(fogDensities, sp);
        fog.color.copy(sampleColor(fogColors, sp));
        scene.background = null;
        renderer.toneMappingExposure = sampleNum(exposures, sp);

        // light color drift
        const lc = sampleColor(keyColors, sp);
        keyLight.color.copy(lc);
        cursorLight.color.copy(lc).lerp(new THREE.Color(0xffd1a0), 0.4);
        keyLight.intensity = 3.0 + Math.sin(t * 0.4) * 0.3 + sp * 0.4;

        // cursor light
        cursorLight.position.x = mouse.x * 4;
        cursorLight.position.y = mouse.y * 3;
        cursorLight.position.z = 3.5 - sp * 1.5;
        cursorLight.intensity = 2.2 + Math.sin(t * 0.7) * 0.4;

        // orb choreography
        orbs.forEach((o, i) => {
          const target = sampleVec(o.path, sp);
          const float = Math.sin(t * o.floatSpeed + i * 1.7) * 0.18;
          o.mesh.position.set(target.x, target.y + float, target.z);

          const s = sampleNum(o.scalePath, sp);
          // breathing on top of keyframe scale
          const breathe = 1 + Math.sin(t * 0.5 + i) * 0.025;
          o.mesh.scale.setScalar(s * breathe);

          o.mesh.rotation.x += o.baseRot.x * 0.01;
          o.mesh.rotation.y += o.baseRot.y * 0.01 + sp * 0.002;
          o.mesh.rotation.z += o.baseRot.z * 0.01;
        });

        // particles — accelerate with scroll
        particles.rotation.y = t * (0.02 + sp * 0.08);
        particles.rotation.x = Math.sin(t * 0.05) * 0.05 + sp * 0.15;
        pMat.opacity = 0.4 + 0.35 * Math.sin(t * 0.3) * 0.5 + sp * 0.15;

        renderer.render(scene, camera);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("scroll", updateScroll);
        window.removeEventListener("resize", onResize);
        geos.forEach((g) => g.dispose());
        pGeo.dispose();
        pMat.dispose();
        orbs.forEach((o) => o.material.dispose());
        renderer.dispose();
        if (renderer.domElement.parentNode === el) {
          el.removeChild(renderer.domElement);
        }
      };
    })().catch((err) => {
      console.warn("[Floating3DScene] WebGL unavailable:", err);
    });

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={mount}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[1]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
