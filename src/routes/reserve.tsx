import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/reserve")({
  head: () => ({
    meta: [
      { title: "Reserve — Noctume" },
      { name: "description", content: "By invitation, after dusk. Twelve chairs, only on the nights we light the candles." },
      { property: "og:title", content: "Reserve — Noctume" },
      { property: "og:description", content: "By invitation, after dusk." },
    ],
  }),
  component: ReservePage,
});

function ReservePage() {
  const [sent, setSent] = useState(false);

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/2 rounded-full pulse-glow"
        style={{
          background: "radial-gradient(circle, oklch(0.68 0.10 55 / 0.18), transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <div className="glass relative w-full max-w-xl rounded-sm p-12 soft-rise">
        <div className="space-y-8 text-center">
          <span className="eyebrow">iv. — reserve</span>
          <h1 className="display text-3xl text-cream md:text-5xl">
            By invitation,
            <br />
            <span className="italic text-ember/90">after dusk.</span>
          </h1>
          <p className="text-sm leading-relaxed text-mist">
            Boxes leave the atelier on Thursdays at midnight.
            <br />
            Tables, only on the nights we light the candles.
          </p>

          {sent ? (
            <p className="eyebrow whisper text-ember">— a reply will arrive, quietly. —</p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              className="mx-auto flex max-w-sm items-end gap-4 border-b border-cream/20 pb-2"
            >
              <input
                type="email"
                required
                placeholder="your email, in a whisper"
                className="flex-1 bg-transparent text-sm text-cream placeholder:text-mist/60 focus:outline-none"
              />
              <button
                type="submit"
                className="eyebrow text-cream transition-colors duration-700 hover:text-ember"
              >
                send →
              </button>
            </form>
          )}

          <Link to="/" className="eyebrow inline-block text-cream/60 transition-colors duration-700 hover:text-ember">
            ← return to the dark
          </Link>
        </div>
      </div>
    </main>
  );
}
