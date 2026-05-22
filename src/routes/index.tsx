import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import hero from "@/assets/hero.jpg";
import dessert1 from "@/assets/dessert-1.jpg";
import dessert2 from "@/assets/dessert-2.jpg";
import dessert3 from "@/assets/dessert-3.jpg";



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

  // Reveal sections on scroll instead of hard cuts
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const heroShift = scrolled * 0.25;

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground">


      {/* Wordmark */}
      <div className="fixed left-8 top-8 z-[80] mix-blend-difference">
        <span className="display text-xl tracking-[0.4em] text-cream">
          N O C T U M E
        </span>
      </div>
      {/* ─────────────── 1. HERO — IDENTIDAD (cinematográfico + 3D) ─────────────── */}
      <section
        ref={heroRef}
        className="relative flex h-[100svh] w-full items-end overflow-hidden"
      >
        <img
          src={hero}
          alt="A single dessert in a pool of warm light"
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            transform: `translate3d(0, ${heroShift}px, 0) scale(${1.05 + scrolled / 6000})`,
            opacity: Math.max(0, 1 - scrolled / 600),
            filter: `brightness(${0.85 - scrolled / 2400}) blur(${Math.min(scrolled / 120, 8)}px)`,
            transition: "opacity 200ms linear",
          }}
        />


        {/* Volumetric fog veil */}
        <div
          aria-hidden
          className="absolute inset-0 z-[2]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 70%, transparent 0%, oklch(0.12 0.02 35 / 0.4) 60%, oklch(0.08 0.015 30 / 0.85) 100%)",
          }}
        />
        <div className="absolute inset-0 z-[2] bg-gradient-to-b from-background/40 via-background/10 to-background" />

        <div className="relative z-10 mx-auto w-full max-w-6xl px-8 pb-32 md:pb-40">
          <div className="space-y-6 soft-rise">
            <span className="eyebrow">— un atelier, después del anochecer —</span>
            <h1 className="display text-[clamp(3rem,9vw,9rem)] text-cream">
              De cacao,
              <br />
              <span className="italic text-ember/90">silencio,</span>
              <br />
              y horas lentas.
            </h1>
          </div>

          {/* Holographic UI sliver */}
          <div
            aria-hidden
            className="mt-12 flex max-w-md items-center gap-4 rounded-sm border border-cream/15 bg-cream/[0.03] px-5 py-3 backdrop-blur-md"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.95 0.02 80 / 0.06), oklch(0.68 0.10 55 / 0.08), oklch(0.95 0.02 80 / 0.04))",
              boxShadow:
                "inset 0 1px 0 oklch(0.95 0.02 80 / 0.15), 0 0 40px oklch(0.68 0.10 55 / 0.12)",
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-ember pulse-glow" />
            <span className="eyebrow text-cream/80">
              session 003 — open until dawn
            </span>
            <span className="ml-auto eyebrow text-cream/40">live</span>
          </div>
        </div>

        {/* floating ember light */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-[15%] top-[20%] z-[3] h-64 w-64 rounded-full pulse-glow"
          style={{
            background:
              "radial-gradient(circle, oklch(0.68 0.10 55 / 0.35), transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        <div className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2">
          <span className="eyebrow whisper">desliza, despacio</span>
        </div>
      </section>



      {/* ─────────────── 2. SERVICIOS — OFERTA B2C + B2B (midnight) ─────────────── */}
      <section className="reveal relative py-32" style={{ background: "linear-gradient(180deg, oklch(0.10 0.012 40 / 0.92), oklch(0.12 0.012 40 / 0.78) 50%, oklch(0.10 0.012 40 / 0.92))" }}>
        <div className="pointer-events-none absolute inset-0 backdrop-blur-[2px]" />

        <div
          aria-hidden
          className="pointer-events-none absolute right-[10%] top-[20%] h-72 w-72 rounded-full pulse-glow"
          style={{
            background:
              "radial-gradient(circle, oklch(0.68 0.10 55 / 0.3), transparent 70%)",
            filter: "blur(60px)",
          }}
        />

        <div className="mx-auto max-w-6xl px-8 md:px-16">
          <div className="mb-20 flex items-center gap-4">
            <span className="eyebrow">02 — la oferta</span>
            <span className="h-px w-24 bg-cream/20" />
          </div>
          <h2 className="reveal display max-w-3xl text-4xl text-cream md:text-6xl">
            Dos formas de
            <br />
            <span className="italic text-ember/90">entrar al cuarto.</span>
          </h2>



          <div className="mt-20 grid grid-cols-1 gap-12 md:grid-cols-2">
            {/* B2C */}
            <article
              data-hover
              className="group relative overflow-hidden rounded-sm border border-cream/10 p-10 transition-all duration-700 hover:border-ember/40"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={dessert1}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-105"
                  style={{ filter: "brightness(0.7)" }}
                />
              </div>
              <div className="mt-8 space-y-4">
                <span className="eyebrow text-ember">para vos — b2c</span>
                <h3 className="display text-3xl text-cream md:text-4xl">
                  La caja de medianoche
                </h3>
                <p className="text-sm leading-relaxed text-mist">
                  Una selección de tres piezas, empacadas a mano, entregadas los
                  jueves después de las 22:00.
                </p>
                <div className="flex items-center gap-3 pt-4">
                  <span className="h-px w-8 bg-cream/40 transition-all duration-700 group-hover:w-14 group-hover:bg-ember" />
                  <span className="eyebrow text-cream">reservar una caja</span>
                </div>
              </div>
            </article>

            {/* B2B */}
            <article
              data-hover
              className="group relative overflow-hidden rounded-sm border border-cream/10 p-10 transition-all duration-700 hover:border-ember/40 md:mt-24"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={dessert2}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-105"
                  style={{ filter: "brightness(0.7)" }}
                />
              </div>
              <div className="mt-8 space-y-4">
                <span className="eyebrow text-ember">para tu marca — b2b</span>
                <h3 className="display text-3xl text-cream md:text-4xl">
                  Mesas privadas & catas
                </h3>
                <p className="text-sm leading-relaxed text-mist">
                  Diseñamos experiencias gastronómicas para hoteles, restaurantes
                  y eventos íntimos. Doce comensales, una sola noche.
                </p>
                <div className="flex items-center gap-3 pt-4">
                  <span className="h-px w-8 bg-cream/40 transition-all duration-700 group-hover:w-14 group-hover:bg-ember" />
                  <span className="eyebrow text-cream">conversemos</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ─────────────── 3. ORIGEN — HISTORIA + VALORES (cream) ─────────────── */}
      <section
        className="relative py-32"
        style={{ background: "var(--color-cream)", color: "var(--color-espresso)" }}
      >
        <div className="mx-auto max-w-6xl px-8 md:px-16">
          <div className="mb-20 flex items-center gap-4">
            <span className="eyebrow" style={{ color: "var(--color-cocoa)" }}>
              03 — origen
            </span>
            <span
              className="h-px w-24"
              style={{ background: "oklch(0.32 0.045 45 / 0.3)" }}
            />
          </div>

          <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
            <div className="md:col-span-5">
              <div className="aspect-[3/4] overflow-hidden rounded-sm">
                <img
                  src={dessert3}
                  alt="Macro detail of a dessert"
                  loading="lazy"
                  className="h-full w-full object-cover float-slow"
                />
              </div>
            </div>

            <div className="space-y-10 md:col-span-7 md:pl-12 md:pt-12">
              <h2 className="display text-4xl md:text-6xl">
                Una cocina, una lámpara,
                <br />
                <span
                  className="italic"
                  style={{ color: "var(--color-cocoa)" }}
                >
                  y mucho silencio.
                </span>
              </h2>

              <div
                className="space-y-6 text-base leading-relaxed"
                style={{ color: "var(--color-cocoa)", opacity: 0.9 }}
              >
                <p>
                  Empezamos en 2019, en una cocina prestada, horneando para amigos
                  que se quedaban hasta tarde. Los pedidos llegaron por boca de
                  alguien que conocía a alguien.
                </p>
                <p>
                  Nunca buscamos crecer. Buscamos hacer cada pieza como si fuera la
                  única.
                </p>
              </div>

              <ul className="space-y-5 pt-6">
                {[
                  ["Lentitud.", "Fermentamos, descansamos, esperamos."],
                  ["Origen.", "Cacao trazado, lácteos del valle, sal del mar."],
                  ["Intimidad.", "Pocas piezas, pocas mesas, pocas palabras."],
                ].map(([k, v]) => (
                  <li key={k} className="flex items-baseline gap-6">
                    <span
                      className="display text-2xl"
                      style={{ color: "var(--color-cocoa)" }}
                    >
                      {k}
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: "var(--color-cocoa)", opacity: 0.75 }}
                    >
                      {v}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────── 4. ALCANCE — ESCALA + FUTURO (midnight) 🆕 ─────────────── */}
      <section className="reveal relative py-32" style={{ background: "linear-gradient(180deg, oklch(0.10 0.012 40 / 0.88), oklch(0.13 0.012 40 / 0.72) 50%, oklch(0.08 0.010 40 / 0.94))" }}>

        <div
          aria-hidden
          className="pointer-events-none absolute left-[5%] top-[40%] h-96 w-96 rounded-full pulse-glow"
          style={{
            background:
              "radial-gradient(circle, oklch(0.68 0.10 55 / 0.18), transparent 70%)",
            filter: "blur(80px)",
          }}
        />

        <div className="mx-auto max-w-6xl px-8 md:px-16">
          <div className="mb-20 flex items-center gap-4">
            <span className="eyebrow">04 — alcance</span>
            <span className="h-px w-24 bg-cream/20" />
          </div>
          <h2 className="reveal display max-w-4xl text-4xl text-cream md:text-6xl">
            Pequeños, a propósito.
            <br />
            <span className="italic text-ember/90">
              Pero llegando más lejos.
            </span>
          </h2>


          <div className="mt-20 grid grid-cols-2 gap-y-16 md:grid-cols-4">
            {[
              ["07", "piezas por noche"],
              ["12", "comensales en la mesa"],
              ["1.4k", "cajas en el último año"],
              ["3", "ciudades, en silencio"],
            ].map(([n, l]) => (
              <div key={l} className="space-y-3" data-hover>
                <div className="display text-5xl text-cream md:text-7xl">{n}</div>
                <div className="eyebrow text-mist">{l}</div>
              </div>
            ))}
          </div>

          <div className="mt-32 grid grid-cols-1 gap-12 border-t border-cream/10 pt-16 md:grid-cols-3">
            {[
              {
                t: "Buenos Aires",
                d: "El atelier original. Jueves y viernes, después de las 21:00.",
                s: "abierto",
              },
              {
                t: "Ciudad de México",
                d: "Una segunda cocina, en una azotea de la Roma. Por invitación.",
                s: "en silencio",
              },
              {
                t: "Lisboa",
                d: "Una tercera mesa que aún no tiene nombre. Otoño 2026.",
                s: "próximo",
              },
            ].map((c) => (
              <article key={c.t} className="group space-y-4" data-hover>
                <div className="flex items-center gap-3">
                  <span
                    className="h-2 w-2 rounded-full bg-ember pulse-glow"
                    style={{
                      opacity: c.s === "abierto" ? 1 : 0.4,
                    }}
                  />
                  <span className="eyebrow text-mist">{c.s}</span>
                </div>
                <h3 className="display text-3xl text-cream transition-colors duration-700 group-hover:text-ember">
                  {c.t}
                </h3>
                <p className="text-sm leading-relaxed text-mist">{c.d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────── 5. ALIADOS — PRUEBA SOCIAL (cream) ─────────────── */}
      <section
        className="relative py-32"
        style={{ background: "var(--color-cream)", color: "var(--color-espresso)" }}
      >
        <div className="mx-auto max-w-6xl px-8 md:px-16">
          <div className="mb-20 flex items-center gap-4">
            <span className="eyebrow" style={{ color: "var(--color-cocoa)" }}>
              05 — aliados
            </span>
            <span
              className="h-px w-24"
              style={{ background: "oklch(0.32 0.045 45 / 0.3)" }}
            />
          </div>

          <h2 className="display max-w-3xl text-4xl md:text-6xl">
            Quienes
            <span className="italic" style={{ color: "var(--color-cocoa)" }}>
              {" "}
              se sentaron{" "}
            </span>
            con nosotros.
          </h2>

          {/* Quotes */}
          <div className="mt-20 grid grid-cols-1 gap-12 md:grid-cols-2">
            {[
              {
                q: "Comer en Noctume no es comer un postre. Es entrar a una habitación que alguien preparó solo para ti.",
                a: "— Vogue Living",
              },
              {
                q: "Una de las experiencias gastronómicas más íntimas y silenciosas que hemos cubierto este año.",
                a: "— Monocle, edición de marzo",
              },
            ].map((t) => (
              <blockquote
                key={t.a}
                className="space-y-6 border-l pl-8"
                style={{ borderColor: "oklch(0.32 0.045 45 / 0.25)" }}
              >
                <p
                  className="display text-2xl leading-snug md:text-3xl"
                  style={{ color: "var(--color-espresso)" }}
                >
                  "{t.q}"
                </p>
                <footer
                  className="eyebrow"
                  style={{ color: "var(--color-cocoa)" }}
                >
                  {t.a}
                </footer>
              </blockquote>
            ))}
          </div>

          {/* Logos */}
          <div
            className="mt-24 flex flex-wrap items-center justify-center gap-x-16 gap-y-8 border-t pt-16"
            style={{ borderColor: "oklch(0.32 0.045 45 / 0.15)" }}
          >
            {[
              "VOGUE",
              "MONOCLE",
              "KINFOLK",
              "NYT — T",
              "CEREAL",
              "APARTAMENTO",
            ].map((b) => (
              <span
                key={b}
                className="display text-lg tracking-[0.3em] transition-opacity duration-700 hover:opacity-100"
                style={{ color: "var(--color-cocoa)", opacity: 0.45 }}
                data-hover
              >
                {b}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-32 flex flex-col items-center gap-3 text-center">
            <span
              className="display text-2xl tracking-[0.4em]"
              style={{ color: "var(--color-cocoa)" }}
            >
              N O C T U M E
            </span>
            <span
              className="eyebrow"
              style={{ color: "var(--color-cocoa)", opacity: 0.6 }}
            >
              22 rue des heures tardives — open from 21:00
            </span>
            <span
              className="eyebrow"
              style={{ color: "var(--color-cocoa)", opacity: 0.4 }}
            >
              © mmxxvi — quietly
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
