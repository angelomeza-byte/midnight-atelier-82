import { createFileRoute, Link } from "@tanstack/react-router";
import dessert from "@/assets/dessert-3.jpg";

export const Route = createFileRoute("/atelier")({
  head: () => ({
    meta: [
      { title: "Atelier — Noctume" },
      { name: "description", content: "The room behind the door. A small kitchen, lit by one lamp." },
      { property: "og:title", content: "Atelier — Noctume" },
      { property: "og:description", content: "The room behind the door." },
    ],
  }),
  component: AtelierPage,
});

function AtelierPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <img
        src={dessert}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-40"
        style={{ filter: "blur(2px) brightness(0.55)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />

      <section className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-10 px-8 soft-rise">
        <div className="flex items-center gap-4">
          <span className="eyebrow">i. — atelier</span>
          <span className="h-px w-16 bg-cream/30" />
        </div>
        <h1 className="display text-5xl text-cream md:text-7xl">
          The room
          <br />
          <span className="italic text-ember/90">behind the door.</span>
        </h1>
        <div className="max-w-md space-y-6 text-mist">
          <p className="leading-relaxed">
            One lamp. One stove. Twelve chairs and a long marble counter that has
            been here since 1962. Most nights, the only sounds are a kettle and a
            spoon scraping the side of a copper pot.
          </p>
          <p className="leading-relaxed">
            We bake the night before. We close when the last piece is gone.
          </p>
        </div>
        <Link to="/" className="eyebrow text-cream/70 transition-colors duration-700 hover:text-ember">
          ← return to the dark
        </Link>
      </section>
    </main>
  );
}
