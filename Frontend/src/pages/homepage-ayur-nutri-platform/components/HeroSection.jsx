import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import vataImg from "../../../assets/vata.jpg";
import { gsap, useGSAP, MOTION_OK } from "../../../lib/motion";
import { useApi } from "../../../lib/api";

const SLOTS = ["Breakfast", "Lunch", "Dinner"];
const DOSHA_COLORS = { vata: "#4F8FB0", pitta: "#C9771C", kapha: "#3C7A4E" };

const DOSHAS = [
  { name: "Vata", element: "air + space", icon: "Wind", tone: "text-sky-700 bg-sky-50 dark:bg-sky-950/40 dark:text-sky-300" },
  { name: "Pitta", element: "fire + water", icon: "Flame", tone: "text-orange-700 bg-orange-50 dark:bg-orange-950/40 dark:text-orange-300" },
  { name: "Kapha", element: "earth + water", icon: "Mountain", tone: "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300" },
];

// Headline split into lines so each line can rise into view on its own.
const HEADLINE = ["Diet plans that respect", "the dosha and the numbers."];

const HeroSection = () => {
  const ref = useRef(null);
  const chipRef = useRef(null);
  const navigate = useNavigate();
  const [dosha, setDosha] = useState(0);

  // A sample day assembled live from the food library: one item per meal.
  const { data: foodData } = useApi("/api/foods", { params: { random: 1, complete: 1, limit: 80 } });
  const sampleDay = SLOTS.map((slot) => ({
    slot,
    food: (foodData?.items || []).find((f) => (f.mealSlots || []).includes(slot)),
  })).filter((m) => m.food);
  const dayKcal = sampleDay.reduce((sum, m) => sum + (m.food.nutritionPerServing?.caloriesKcal || 0), 0);

  // Real average dosha split across every assessment taken on the platform.
  const { data: stats } = useApi("/api/stats/public");
  const mix = stats?.doshaMix;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.from("[data-line] > span", { yPercent: 110, duration: 1, stagger: 0.12 })
          .from("[data-hero-fade]", { y: 18, autoAlpha: 0, duration: 0.8, stagger: 0.08 }, "-=0.6")
          .from("[data-hero-art]", { scale: 0.94, autoAlpha: 0, duration: 1.1, ease: "power3.out" }, 0.15);

        // Slow float on the illustration — enough to feel alive, not distracting.
        gsap.to("[data-float]", { y: -10, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1 });
      });

      // Floating cards drift with the pointer on desktop, each at its own
      // depth. Cards appear only once their live data has loaded, so they're
      // looked up on each move rather than once at mount.
      mm.add(`${MOTION_OK} and (min-width: 1024px) and (pointer: fine)`, () => {
        const movers = new WeakMap();
        const moverFor = (el) => {
          if (!movers.has(el)) {
            movers.set(el, {
              depth: Number(el.dataset.depth),
              x: gsap.quickTo(el, "x", { duration: 0.8, ease: "power3.out" }),
              y: gsap.quickTo(el, "y", { duration: 0.8, ease: "power3.out" }),
            });
          }
          return movers.get(el);
        };
        const onMove = (e) => {
          const rect = ref.current.getBoundingClientRect();
          const nx = (e.clientX - rect.left) / rect.width - 0.5;
          const ny = (e.clientY - rect.top) / rect.height - 0.5;
          ref.current.querySelectorAll("[data-depth]").forEach((el) => {
            const m = moverFor(el);
            m.x(nx * m.depth);
            m.y(ny * m.depth);
          });
        };
        ref.current.addEventListener("mousemove", onMove);
        return () => ref.current?.removeEventListener("mousemove", onMove);
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  // Cycle the dosha chip every few seconds.
  useEffect(() => {
    const id = setInterval(() => setDosha((d) => (d + 1) % DOSHAS.length), 2800);
    return () => clearInterval(id);
  }, []);

  useGSAP(
    () => {
      if (!chipRef.current) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(chipRef.current, { y: 8, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, ease: "power2.out" });
      });
      return () => mm.revert();
    },
    { dependencies: [dosha] }
  );

  const scrollToHowItWorks = () =>
    document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth", block: "start" });

  const current = DOSHAS[dosha];

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* Soft background: two blurred colour washes plus a fine dot grid. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 -left-40 h-[520px] w-[520px] rounded-full bg-primary/[0.07] blur-3xl" />
        <div className="absolute top-20 right-[-10rem] h-[460px] w-[460px] rounded-full bg-secondary/15 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.35] dark:opacity-[0.12]"
          style={{
            backgroundImage: "radial-gradient(var(--color-border) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage: "radial-gradient(ellipse at 30% 40%, black 30%, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse at 30% 40%, black 30%, transparent 75%)",
          }}
        />
      </div>

      <div className="page-container relative grid items-center gap-12 pb-20 pt-10 lg:min-h-[calc(100vh-var(--header-h))] lg:grid-cols-[1.1fr_0.9fr] lg:pb-16">
        <div>
          <p data-hero-fade className="eyebrow">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            For Ayurvedic dietitians and their patients
          </p>

          <h1 className="mt-5 font-display text-[2.6rem] font-semibold leading-[1.08] text-text-primary sm:text-6xl">
            {HEADLINE.map((line, i) => (
              <span key={line} data-line className="block overflow-hidden pb-1">
                <span className={`block ${i === 1 ? "text-primary" : ""}`}>{line}</span>
              </span>
            ))}
          </h1>

          <p data-hero-fade className="mt-6 max-w-xl text-lg leading-relaxed text-text-secondary">
            AyurNutri scores a patient's Vata, Pitta and Kapha, drafts a week of meals from a food
            library that knows both calories and rasa, and puts the practitioner in charge of every
            plan before it reaches the patient.
          </p>

          <div data-hero-fade className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="rounded-full px-7" onClick={() => navigate("/auth-selection")}>
              Get started
              <Icon name="ArrowRight" size={18} className="ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full px-7 bg-card/60" onClick={scrollToHowItWorks}>
              See how it works
            </Button>
          </div>

          <p data-hero-fade className="mt-5 flex items-center gap-2 text-sm text-text-secondary">
            <Icon name="ShieldCheck" size={16} className="text-primary" />
            Every AI-drafted plan is reviewed by a practitioner first.
          </p>
        </div>

        <div data-hero-art className="relative mx-auto w-full max-w-md lg:max-w-none">
          {/* A day assembled live from the food library */}
          {sampleDay.length > 0 && (
            <div
              data-depth="28"
              className="absolute -left-10 top-10 z-10 hidden w-64 rounded-2xl border border-border bg-card/95 p-4 shadow-[var(--shadow-elevated)] backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-700 lg:block xl:-left-16"
            >
              <p className="flex items-center justify-between text-xs font-semibold text-text-secondary">
                <span>A day from the library</span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary">{dayKcal} kcal</span>
              </p>
              <ul className="mt-3 space-y-2.5 text-sm">
                {sampleDay.map(({ slot, food }) => (
                  <li key={slot} className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-primary">
                      <Icon name={slot === "Breakfast" ? "Sunrise" : slot === "Lunch" ? "Sun" : "Moon"} size={13} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[11px] text-text-secondary">{slot}</span>
                      <span className="block truncate text-text-primary">{food.name}</span>
                    </span>
                    <span className="text-[11px] text-text-secondary">{food.nutritionPerServing?.caloriesKcal}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Real average across every dosha assessment taken; hidden until there is one */}
          {mix && (
            <div
              data-depth="-22"
              className="absolute -right-6 top-16 z-10 hidden w-56 rounded-2xl border border-border bg-card/95 p-4 shadow-[var(--shadow-elevated)] backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-700 lg:block xl:-right-10"
            >
              <p className="text-xs font-semibold text-text-secondary">
                Average dosha mix · {stats.assessments} assessment{stats.assessments === 1 ? "" : "s"}
              </p>
              <div className="mt-3 space-y-2">
                {["vata", "pitta", "kapha"].map((d) => (
                  <div key={d}>
                    <div className="flex justify-between text-xs">
                      <span className="capitalize text-text-primary">{d}</span>
                      <span className="text-text-secondary">{mix[d]}%</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full" style={{ width: `${mix[d]}%`, backgroundColor: DOSHA_COLORS[d] }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="relative rounded-[2rem] border border-border bg-card p-6 shadow-[var(--shadow-elevated)]">
            <div data-float>
              <img
                src={vataImg}
                alt="Illustrations of the three doshas: Vata, Pitta and Kapha"
                className="mx-auto w-full max-w-sm rounded-2xl object-contain mix-blend-multiply dark:mix-blend-normal dark:opacity-90"
              />
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-border bg-background/70 px-4 py-3">
              <div ref={chipRef} className="flex items-center gap-3">
                <span className={`flex h-10 w-10 items-center justify-center rounded-full ${current.tone}`}>
                  <Icon name={current.icon} size={18} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-text-primary">{current.name}</span>
                  <span className="block text-xs text-text-secondary">{current.element}</span>
                </span>
              </div>
              <div className="flex gap-1.5" aria-hidden="true">
                {DOSHAS.map((d, i) => (
                  <span
                    key={d.name}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === dosha ? "w-6 bg-primary" : "w-1.5 bg-border"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
