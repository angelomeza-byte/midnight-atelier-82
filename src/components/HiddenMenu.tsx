import { useEffect, useState } from "react";

const items = [
  { label: "Atelier", note: "the room behind the door" },
  { label: "Carte", note: "seven quiet creations" },
  { label: "Rituals", note: "how to taste slowly" },
  { label: "Reserve", note: "by invitation, after dusk" },
];

export function HiddenMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className="group fixed right-8 top-8 z-[80] flex items-center gap-3 text-cream"
        aria-label="Open menu"
      >
        <span className="eyebrow transition-colors duration-700 group-hover:text-cream">
          {open ? "close" : "enter"}
        </span>
        <span className="relative block h-[1px] w-10 bg-cream/60 transition-all duration-700 group-hover:w-14 group-hover:bg-cream" />
      </button>

      <div
        className="fixed inset-0 z-[75] transition-all duration-[1200ms]"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          backdropFilter: open ? "blur(28px) saturate(140%)" : "blur(0px)",
          WebkitBackdropFilter: open ? "blur(28px) saturate(140%)" : "blur(0px)",
          background: open ? "oklch(0.10 0.012 40 / 0.78)" : "oklch(0.10 0.012 40 / 0)",
        }}
      >
        <div className="flex h-full items-center justify-center px-8">
          <ul className="space-y-10">
            {items.map((it, i) => (
              <li
                key={it.label}
                className="group cursor-none"
                style={{
                  transitionDelay: `${i * 120 + 200}ms`,
                  transform: open ? "translateY(0)" : "translateY(20px)",
                  opacity: open ? 1 : 0,
                  transition: "transform 1200ms cubic-bezier(.2,.7,.2,1), opacity 1200ms ease",
                }}
              >
                <div className="flex items-baseline gap-8">
                  <span className="eyebrow w-8 text-right">0{i + 1}</span>
                  <span className="display text-5xl text-cream transition-all duration-700 group-hover:text-ember md:text-7xl">
                    {it.label}
                  </span>
                </div>
                <div className="ml-16 mt-2 max-h-0 overflow-hidden text-mist opacity-0 transition-all duration-700 group-hover:max-h-12 group-hover:opacity-100">
                  <span className="eyebrow">— {it.note}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
