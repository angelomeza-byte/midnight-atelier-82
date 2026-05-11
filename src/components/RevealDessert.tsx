import { useState } from "react";

interface Props {
  index: string;
  name: string;
  whisper: string;
  notes: string[];
  image: string;
  align?: "left" | "right";
}

export function RevealDessert({ index, name, whisper, notes, image, align = "left" }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group relative grid min-h-[80vh] grid-cols-12 items-center gap-6 px-8 md:px-16"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-hover
    >
      {/* Image — fades up from darkness on hover */}
      <div
        className={`relative col-span-12 md:col-span-7 ${
          align === "right" ? "md:order-2 md:col-start-6" : ""
        }`}
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 30%, var(--background) 90%)",
            }}
          />
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition-all duration-[1800ms] ease-out"
            style={{
              transform: hovered ? "scale(1.04)" : "scale(1.12)",
              filter: hovered ? "brightness(1) blur(0)" : "brightness(0.55) blur(2px)",
              opacity: hovered ? 1 : 0.55,
            }}
          />
        </div>
      </div>

      {/* Text — slow reveal */}
      <div
        className={`col-span-12 space-y-6 md:col-span-5 ${
          align === "right" ? "md:order-1 md:pr-12" : "md:pl-12"
        }`}
      >
        <div className="flex items-center gap-4">
          <span className="eyebrow">{index}</span>
          <span className="h-px w-12 bg-cream/30" />
        </div>

        <h3 className="display text-4xl text-cream md:text-6xl">{name}</h3>

        <p
          className="max-w-sm text-sm leading-relaxed text-mist transition-all duration-1000"
          style={{
            opacity: hovered ? 1 : 0.45,
            transform: hovered ? "translateY(0)" : "translateY(8px)",
          }}
        >
          {whisper}
        </p>

        <ul
          className="space-y-2 transition-all duration-1000"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(12px)",
            transitionDelay: hovered ? "300ms" : "0ms",
          }}
        >
          {notes.map((n, i) => (
            <li key={n} className="flex items-center gap-3">
              <span className="h-px w-6 bg-ember/70" />
              <span
                className="eyebrow text-cream"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {n}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
