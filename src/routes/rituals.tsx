import { createFileRoute, Link } from "@tanstack/react-router";

const rituals = [
  { n: "01", t: "Lower the lights.", d: "One lamp is enough. Two is too many." },
  { n: "02", t: "Hold for a moment.", d: "The piece is warm. The room should be quieter than the piece." },
  { n: "03", t: "Use a small spoon.", d: "Smaller than you think. Then smaller again." },
  { n: "04", t: "Do not speak.", d: "For the first three bites. After that — quietly." },
];

export const Route = createFileRoute("/rituals")({
  head: () => ({
    meta: [
      { title: "Rituals — Noctume" },
      { name: "description", content: "How to taste slowly. A small ceremony, in four parts." },
      { property: "og:title", content: "Rituals — Noctume" },
      { property: "og:description", content: "How to taste slowly." },
    ],
  }),
  component: RitualsPage,
});

function RitualsPage() {
  return (
    <main className="relative min-h-screen bg-background">
      <section className="relative mx-auto flex min-h-screen max-w-4xl flex-col justify-center gap-16 px-8 py-32">
        <div className="space-y-4 soft-rise">
          <div className="flex items-center gap-4">
            <span className="eyebrow">iii. — rituals</span>
            <span className="h-px w-16 bg-cream/30" />
          </div>
          <h1 className="display text-4xl text-cream md:text-6xl">
            How to taste,
            <br />
            <span className="italic text-ember/90">slowly.</span>
          </h1>
        </div>

        <ol className="space-y-12">
          {rituals.map((r, i) => (
            <li
              key={r.n}
              className="grid grid-cols-12 gap-6 soft-rise"
              style={{ animationDelay: `${i * 200}ms` }}
              data-hover
            >
              <span className="eyebrow col-span-2 pt-2 text-ember">{r.n}</span>
              <div className="col-span-10 space-y-3 md:col-span-8">
                <h2 className="display text-2xl text-cream md:text-3xl">{r.t}</h2>
                <p className="text-sm leading-relaxed text-mist">{r.d}</p>
              </div>
            </li>
          ))}
        </ol>

        <Link to="/" className="eyebrow text-cream/70 transition-colors duration-700 hover:text-ember">
          ← return to the dark
        </Link>
      </section>
    </main>
  );
}
