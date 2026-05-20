import { useEffect, useRef } from "react";
import * as THREE from "three";


/**
 * A slow, cinematic WebGL backdrop.
 * - 3 floating "dessert" orbs with reflective/glass-like materials
 * - volumetric ember light that follows the cursor
 * - soft fog + ambient particles
 * - depth-based parallax tied to scroll
 * Renders nothing on SSR; loads three.js lazily on mount.
 */
export function Floating3DScene() {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!mount.current) return;

    let raf = 0;
    let disposed = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      const T = await import("three") as typeof import("three");
      const THREE_NS = T;
      if (disposed || !mount.current) return;

      const el = mount.current;
      const w = () => el.clientWidth;
      const h = () => el.clientHeight;

      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x0a0807, 0.085);

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
      renderer.toneMappingExposure = 0.9;
      el.appendChild(renderer.domElement);
      renderer.domElement.style.cssText =
        "width:100%;height:100%;display:block;pointer-events:none;";

      // ─── Lights ───────────────────────────────────────────
      scene.add(new THREE.AmbientLight(0x2a1d18, 0.6));

      const keyLight = new THREE.PointLight(0xffb478, 3.5, 18, 1.5);
      keyLight.position.set(2.5, 1.8, 3);
      scene.add(keyLight);

      const cursorLight = new THREE.PointLight(0xffd1a0, 2.2, 14, 1.7);
      cursorLight.position.set(0, 0, 4);
      scene.add(cursorLight);

      const rimLight = new THREE.DirectionalLight(0x6b4a3a, 0.4);
      rimLight.position.set(-4, -2, -3);
      scene.add(rimLight);

      // ─── Floating dessert "orbs" ──────────────────────────
      const orbGroup = new THREE.Group();
      scene.add(orbGroup);

      type Orb = {
        mesh: THREE.Mesh;
        baseY: number;
        speed: number;
        rotSpeed: THREE.Vector3;
      };
      const orbs: Orb[] = [];

      const palettes = [
        { color: 0x3a1e14, rough: 0.15, metal: 0.85 }, // dark chocolate metallic
        { color: 0xe9d8b8, rough: 0.35, metal: 0.2 },  // cream glass
        { color: 0x6b3a1f, rough: 0.25, metal: 0.55 }, // espresso
      ];

      const geos = [
        new THREE.IcosahedronGeometry(1, 4),
        new THREE.TorusKnotGeometry(0.7, 0.24, 180, 28),
        new THREE.SphereGeometry(0.85, 64, 64),
      ];

      const positions = [
        new THREE.Vector3(-2.4, 0.4, 0),
        new THREE.Vector3(2.3, -0.3, -1.2),
        new THREE.Vector3(0.2, 0.9, -2.5),
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
          transmission: i === 1 ? 0.35 : 0,
          ior: 1.4,
          sheen: 0.5,
          sheenColor: new THREE.Color(0xffb478),
        });
        const mesh = new THREE.Mesh(geos[i], mat);
        mesh.position.copy(positions[i]);
        mesh.scale.setScalar(i === 1 ? 0.95 : 1);
        orbGroup.add(mesh);
        orbs.push({
          mesh,
          baseY: positions[i].y,
          speed: 0.35 + i * 0.12,
          rotSpeed: new THREE.Vector3(
            0.05 + i * 0.02,
            0.08 + i * 0.015,
            0.02
          ),
        });
      }

      // ─── Ambient particles (dust / fog motes) ─────────────
      const particleCount = 220;
      const pPositions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount; i++) {
        pPositions[i * 3] = (Math.random() - 0.5) * 14;
        pPositions[i * 3 + 1] = (Math.random() - 0.5) * 9;
        pPositions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
      const pMat = new THREE.PointsMaterial({
        color: 0xffd1a0,
        size: 0.025,
        transparent: true,
        opacity: 0.55,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const particles = new THREE.Points(pGeo, pMat);
      scene.add(particles);

      // ─── Interaction state ────────────────────────────────
      const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
      const scrollState = { y: 0 };

      const onMove = (e: MouseEvent) => {
        mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.ty = -((e.clientY / window.innerHeight) * 2 - 1);
      };
      const onScroll = () => {
        scrollState.y = window.scrollY;
      };
      const onResize = () => {
        camera.aspect = w() / h();
        camera.updateProjectionMatrix();
        renderer.setSize(w(), h());
      };

      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);

      // ─── Render loop ──────────────────────────────────────
      const clock = new THREE.Clock();

      const tick = () => {
        const t = clock.getElapsedTime();

        // smooth cursor easing
        mouse.x += (mouse.tx - mouse.x) * 0.04;
        mouse.y += (mouse.ty - mouse.y) * 0.04;

        // cinematic camera drift + scroll depth
        const scrollNorm = Math.min(scrollState.y / 1400, 1);
        camera.position.x = mouse.x * 0.6;
        camera.position.y = mouse.y * 0.35 - scrollNorm * 1.2;
        camera.position.z = 7 + scrollNorm * 2.5;
        camera.lookAt(0, -scrollNorm * 0.5, 0);

        // cursor-reactive light
        cursorLight.position.x = mouse.x * 4;
        cursorLight.position.y = mouse.y * 3;
        cursorLight.position.z = 3.5;
        cursorLight.intensity = 2.2 + Math.sin(t * 0.7) * 0.4;

        // slow rotation + float
        orbs.forEach((o, i) => {
          o.mesh.rotation.x += o.rotSpeed.x * 0.01;
          o.mesh.rotation.y += o.rotSpeed.y * 0.01;
          o.mesh.rotation.z += o.rotSpeed.z * 0.01;
          o.mesh.position.y =
            o.baseY + Math.sin(t * o.speed + i * 1.7) * 0.18;
        });

        // parallax group
        orbGroup.rotation.y = mouse.x * 0.12;
        orbGroup.rotation.x = -mouse.y * 0.08;

        // particle drift
        particles.rotation.y = t * 0.02;
        particles.rotation.x = Math.sin(t * 0.05) * 0.05;

        renderer.render(scene, camera);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        geos.forEach((g) => g.dispose());
        pGeo.dispose();
        pMat.dispose();
        orbs.forEach((o) =>
          (o.mesh.material as THREE.Material).dispose()
        );
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
      className="pointer-events-none absolute inset-0 z-[1]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
