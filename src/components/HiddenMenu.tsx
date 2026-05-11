import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const items = [
  { label: "Atelier", note: "the room behind the door", to: "/atelier" as const },
  { label: "Carte", note: "seven quiet creations", to: "/carte" as const },
  { label: "Rituals", note: "how to taste slowly", to: "/rituals" as const },
  { label: "Reserve", note: "by invitation, after dusk", to: "/reserve" as const },
];

export function HiddenMenu() {
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Keyboard: M to toggle, Esc to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if ((e.key === "m" || e.key === "M") && !e.metaKey && !e.ctrlKey) {
        const tag = (e.target as HTMLElement)?.tagName;
        if (tag !== "INPUT" && tag !== "TEXTAREA") setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Edge-of-screen exploration: hovering top-right corner reveals the trigger
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nearCorner = e.clientX > window.innerWidth - 220 && e.clientY < 160;
      setHint(nearCorner);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      {/* The toggle — a single thin line that breathes brighter as you approach */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="group fixed right-8 top-8 z-[80] flex items-center gap-3"
        aria-label={open ? "close menu" : "open menu"}
        aria-expanded={open}
      >
        <span
          className="eyebrow transition-all duration-700"
          style={{
            opacity: open || hint ? 1 : 0.35,
            color: open ? "var(--color-ember)" : undefined,
            letterSpacing: hint ? "0.6em" : "0.4em",
          }}
        >
          {open ? "close" : "enter"}
        </span>
        <span
          className="relative block h-px bg-cream transition-all duration-700"
          style={{
            width: open ? 56 : hint ? 48 : 32,
            opacity: open || hint ? 1 : 0.4,
          }}
        />
      </button>

      {/* Tiny ambient hint at the edges — invites exploration without explaining */}
      <div className="pointer-events-none fixed bottom-6 right-8 z-[80]">
        <span
          className="eyebrow transition-opacity duration-1000"
          style={{ opacity: hint && !open ? 0.7 : 0, color: "var(--color-mist)" }}
        >
          press m
        </span>
      </div>

      {/* The veil */}
      <div
        className="fixed inset-0 z-[75] transition-all duration-[1200ms]"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          backdropFilter: open ? "blur(28px) saturate(140%)" : "blur(0px)",
          WebkitBackdropFilter: open ? "blur(28px) saturate(140%)" : "blur(0px)",
          background: open ? "oklch(0.10 0.012 40 / 0.78)" : "oklch(0.10 0.012 40 / 0)",
        }}
        onClick={() => setOpen(false)}
      >
        <div
          className="flex h-full items-center justify-center px-8"
          onClick={(e) => e.stopPropagation()}
        >
          <ul className="space-y-10">
            {items.map((it, i) => {
              const isActive = pathname === it.to;
              return (
                <li
                  key={it.label}
                  style={{
                    transitionDelay: `${i * 120 + 200}ms`,
                    transform: open ? "translateY(0)" : "translateY(20px)",
                    opacity: open ? 1 : 0,
                    transition:
                      "transform 1200ms cubic-bezier(.2,.7,.2,1), opacity 1200ms ease",
                  }}
                >
                  <Link
                    to={it.to}
                    className="group block"
                    activeProps={{ "aria-current": "page" } as never}
                  >
                    <div className="flex items-baseline gap-8">
                      <span className="eyebrow w-8 text-right">0{i + 1}</span>
                      <span
                        className="display text-5xl transition-all duration-700 group-hover:text-ember md:text-7xl"
                        style={{ color: isActive ? "var(--color-ember)" : "var(--color-cream)" }}
                      >
                        {it.label}
                      </span>
                    </div>
                    <div className="ml-16 mt-2 max-h-0 overflow-hidden text-mist opacity-0 transition-all duration-700 group-hover:max-h-12 group-hover:opacity-100">
                      <span className="eyebrow">— {it.note}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}
