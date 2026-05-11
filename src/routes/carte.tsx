import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import d1 from "@/assets/dessert-1.jpg";
import d2 from "@/assets/dessert-2.jpg";
import d3 from "@/assets/dessert-3.jpg";
import hero from "@/assets/hero.jpg";

const carte = [
  { i: "i.", name: "Ombre", note: "70% Madagascar · burnt honey", image: d1 },
  { i: "ii.", name: "Velours", note: "vanilla bourbon · salted caramel", image: d2 },
  { i: "iii.", name: "Fumée", note: "smoked cacao · ash vanilla", image: d3 },
  { i: "iv.", name: "Soir", note: "an hour past midnight", image: hero },
  { i: "v.", name: "Cendre", note: "still being decided", image: d1 },
  { i: "vi.", name: "Lune", note: "served only on full moons", image: d2 },
  { i: "vii.", name: "—", note: "the secret one", image: d3 },
];

export const Route = createFileRoute("/carte")({
  head: () => ({
    meta: [
      { title: "Carte — Noctume" },
      { name: "description", content: "Seven quiet creations. Hover to remember." },
      { property: "og:title", content: "Carte — Noctume" },
      { property: "og:description", content: "Seven quiet creations." },
    ],
  }),
  component: CartePage,
});

function CartePage() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <main className="relative min-h-screen bg-background">
      {/* Floating image — follows hover */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {carte.map((c, i) => (
          <img
            key={c.name + i}
            src={c.image}
            alt=""
            className="absolute left-1/2 top-1/2 h-[60vh] w-[40vw] -translate-x-1/2 -translate-y-1/2 object-cover transition-all duration-[1600ms] ease-out"
            style={{
              opacity: active === i ? 0.55 : 0,
              transform: `translate(-50%, -50%) scale(${active === i ? 1 : 1.1})`,
              filter: "blur(2px)",
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-background" />
      </div>

      <section className="relative z-10 mx-auto flex min-h-screen max-w-4xl flex-col justify-center gap-12 px-8 py-32">
        <div className="flex items-center gap-4 soft-rise">
          <span className="eyebrow">ii. — la carte</span>
          <span className="h-px w-16 bg-cream/30" />
        </div>

        <h1 className="display text-4xl text-cream md:text-6xl soft-rise">
          Seven, only ever seven.
        </h1>

        <ul className="space-y-6">
          {carte.map((c, i) => (
            <li
              key={c.name + i}
              data-hover
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className="group flex items-baseline gap-6 border-b border-cream/10 py-5 transition-all duration-700"
              style={{ paddingLeft: active === i ? "2rem" : "0" }}
            >
              <span className="eyebrow w-10">{c.i}</span>
              <span className="display flex-1 text-3xl text-cream transition-colors duration-700 group-hover:text-ember md:text-4xl">
                {c.name}
              </span>
              <span
                className="eyebrow text-mist transition-all duration-700"
                style={{
                  opacity: active === i ? 1 : 0.3,
                  transform: active === i ? "translateX(0)" : "translateX(8px)",
                }}
              >
                {c.note}
              </span>
            </li>
          ))}
        </ul>

        <Link to="/" className="eyebrow text-cream/70 transition-colors duration-700 hover:text-ember">
          ← return to the dark
        </Link>
      </section>
    </main>
  );
}
