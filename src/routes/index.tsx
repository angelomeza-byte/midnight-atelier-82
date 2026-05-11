import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import hero from "@/assets/hero.jpg";
import dessert1 from "@/assets/dessert-1.jpg";
import dessert2 from "@/assets/dessert-2.jpg";
import dessert3 from "@/assets/dessert-3.jpg";
import { AmbientCursor } from "@/components/AmbientCursor";
import { HiddenMenu } from "@/components/HiddenMenu";
import { RevealDessert } from "@/components/RevealDessert";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [scrolled, setScrolled] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const heroOpacity = Math.max(0, 1 - scrolled / 600);
  const heroShift = scrolled * 0.35;

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <AmbientCursor />
      <HiddenMenu />

      {/* Wordmark */}
      <div className="fixed left-8 top-8 z-[80]">
        <span className="display text-xl tracking-[0.4em] text-cream">N O C T U M E</span>
      </div>

      {/* Footer hint */}
      <div className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2">
        <span className="eyebrow whisper">scroll, slowly</span>
      </div>

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative flex h-[100svh] w-full items-end overflow-hidden"
      >
        <img
          src={hero}
          alt="A single dessert in a pool of warm light"
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            transform: `translate3d(0, ${heroShift}px, 0) scale(1.05)`,
            opacity: heroOpacity,
            filter: "brightness(0.85)",
            transition: "opacity 200ms linear",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/10 to-background" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-8 pb-32 md:pb-40">
          <div className="space-y-6 soft-rise">
            <span className="eyebrow">a dessert atelier — open after dusk</span>
            <h1 className="display text-[clamp(3rem,9vw,9rem)] text-cream">
              Of cocoa,
              <br />
              <span className="italic text-ember/90">silence,</span>
              <br />
              and slow hours.
            </h1>
          </div>
        </div>

        {/* floating ember light */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-[15%] top-[20%] h-64 w-64 rounded-full pulse-glow"
          style={{
            background:
              "radial-gradient(circle, oklch(0.68 0.10 55 / 0.35), transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </section>

      {/* INTERLUDE — poetic line */}
      <section className="relative flex min-h-[60vh] items-center justify-center px-8">
        <p className="display max-w-3xl text-center text-2xl leading-relaxed text-mist md:text-4xl">
          We do not serve dessert.
          <br />
          <span className="text-cream">We serve the room around it.</span>
        </p>
      </section>

      {/* CARTE — three desserts, hover to reveal */}
      <section className="relative space-y-32 py-24">
        <div className="px-8 md:px-16">
          <div className="flex items-center gap-4">
            <span className="eyebrow">la carte — seven, only ever seven</span>
            <span className="h-px w-24 bg-cream/20" />
          </div>
        </div>

        <RevealDessert
          index="i."
          name="Ombre"
          whisper="A dark chocolate dome dusted in cocoa earth — broken open, it sighs."
          notes={["70% Madagascar", "burnt honey", "sea salt"]}
          image={dessert1}
        />

        <RevealDessert
          index="ii."
          name="Velours"
          whisper="Soft cream folded over warm caramel. A candle, a spoon, a long pause."
          notes={["vanilla bourbon", "salted caramel", "brown butter"]}
          image={dessert2}
          align="right"
        />

        <RevealDessert
          index="iii."
          name="Fumée"
          whisper="A truffle veiled in smoke and sugar dust. It disappears as you find it."
          notes={["smoked cacao", "muscovado", "ash vanilla"]}
          image={dessert3}
        />

        <div className="px-8 text-center md:px-16">
          <p className="eyebrow text-mist">— four more, if you stay long enough —</p>
        </div>
      </section>

      {/* RITUAL */}
      <section className="relative flex min-h-[80vh] items-center px-8 py-24 md:px-16">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-16 md:grid-cols-2">
          <div className="space-y-6">
            <span className="eyebrow">a small ritual</span>
            <h2 className="display text-4xl text-cream md:text-6xl">
              Eat with the lights low.
            </h2>
          </div>
          <div className="space-y-6 text-mist">
            <p className="leading-relaxed">
              Each piece is made the night before in a kitchen lit only by one lamp.
              We use slow heat, patient hands, and ingredients we trust by name.
            </p>
            <p className="leading-relaxed">
              When yours arrives — turn the music down. Hold it for a moment.
              Then, taste.
            </p>
          </div>
        </div>
      </section>

      {/* RESERVE */}
      <section className="relative flex min-h-[90vh] items-center justify-center px-8">
        <div className="glass relative w-full max-w-xl rounded-sm p-12 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-sm"
            style={{
              background:
                "radial-gradient(circle at 30% 0%, oklch(0.68 0.10 55 / 0.18), transparent 60%)",
            }}
          />
          <div className="relative space-y-8">
            <span className="eyebrow">reserve — by the spoonful</span>
            <h2 className="display text-3xl text-cream md:text-5xl">
              The room holds twelve.
            </h2>
            <p className="text-sm text-mist">
              Boxes leave the atelier on Thursdays at midnight.
              <br />
              Tables, only on the nights we light the candles.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
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
          </div>
        </div>
      </section>

      {/* OUTRO */}
      <footer className="relative flex flex-col items-center gap-4 px-8 py-24 text-center">
        <span className="display text-2xl tracking-[0.4em] text-cream/80">
          N O C T U M E
        </span>
        <span className="eyebrow text-mist">
          22 rue des heures tardives — open from 21:00
        </span>
        <span className="eyebrow text-mist/60">© mmxxvi — quietly</span>
      </footer>
    </main>
  );
}
