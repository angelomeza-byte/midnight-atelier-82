import { useEffect, useRef, useState } from "react";

export function AmbientCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    let gx = window.innerWidth / 2;
    let gy = window.innerHeight / 2;
    let tx = gx;
    let ty = gy;

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${tx - 3}px, ${ty - 3}px, 0)`;
      }
      const t = e.target as HTMLElement;
      setHovering(!!t.closest("a, button, [data-hover]"));
    };

    const tick = () => {
      gx += (tx - gx) * 0.08;
      gy += (ty - gy) * 0.08;
      if (glow.current) {
        glow.current.style.transform = `translate3d(${gx - 200}px, ${gy - 200}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    let raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={glow}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[55] h-[400px] w-[400px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.68 0.10 55 / 0.18) 0%, transparent 60%)",
          mixBlendMode: "screen",
          transition: "opacity 600ms ease",
          opacity: hovering ? 1 : 0.7,
        }}
      />
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[70] rounded-full bg-cream"
        style={{
          width: hovering ? 28 : 6,
          height: hovering ? 28 : 6,
          marginLeft: hovering ? -11 : 0,
          marginTop: hovering ? -11 : 0,
          opacity: hovering ? 0.18 : 0.9,
          transition: "width 500ms cubic-bezier(.2,.7,.2,1), height 500ms cubic-bezier(.2,.7,.2,1), opacity 400ms ease, margin 500ms cubic-bezier(.2,.7,.2,1)",
        }}
      />
    </>
  );
}
