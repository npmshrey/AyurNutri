import React, { useRef, useState } from "react";
import Icon from "../../../components/AppIcon";
import Ambient from "../../../components/Ambient";
import { gsap, useGSAP, useReveal, MOTION_OK } from "../../../lib/motion";
import { useApi } from "../../../lib/api";

// Maps a record from GET /api/foods into what the card shows.
const toView = (f) => ({
  name: f.name,
  serving: f.serving?.description || [f.serving?.amount, f.serving?.unit].filter(Boolean).join(" "),
  kcal: f.nutritionPerServing?.caloriesKcal ?? 0,
  protein: f.nutritionPerServing?.proteinG ?? 0,
  carbs: f.nutritionPerServing?.carbsG ?? 0,
  fat: f.nutritionPerServing?.fatG ?? 0,
  rasa: f.ayurveda?.rasa || [],
  guna: f.ayurveda?.guna || [],
  virya: f.ayurveda?.virya || "-",
  vipaka: f.ayurveda?.vipaka || "-",
  dosha: f.ayurveda?.doshaEffect || {},
  note: (f.ayurveda?.avoidIn || []).length ? `Avoid in: ${f.ayurveda.avoidIn.join("; ")}.` : "",
});

const effect = (v) =>
  v < 0
    ? { label: "calms", icon: "ArrowDown", cls: "bg-primary/10 text-primary" }
    : v > 0
    ? { label: "raises", icon: "ArrowUp", cls: "bg-warning/10 text-warning" }
    : { label: "neutral", icon: "Minus", cls: "bg-muted text-text-secondary" };

const FoodLibraryPreview = () => {
  const ref = useRef(null);
  const cardRef = useRef(null);
  const [active, setActive] = useState(0);
  const [seed, setSeed] = useState(0);

  // Four random, fully described records from the live library.
  const { data, loading, error } = useApi("/api/foods", {
    params: { complete: 1, random: 1, limit: 4 },
    deps: [seed],
  });
  const foods = (data?.items || []).map(toView);
  const food = foods[active] || foods[0];
  const macroTotal = food ? food.protein + food.carbs + food.fat || 1 : 1;

  useReveal(ref);

  useGSAP(
    () => {
      if (!food) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(cardRef.current.querySelectorAll("[data-swap]"), {
          y: 10,
          autoAlpha: 0,
          duration: 0.45,
          stagger: 0.04,
          clearProps: "transform,opacity,visibility",
        });
        gsap.from(cardRef.current.querySelectorAll("[data-bar]"), {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
        });
      });
      return () => mm.revert();
    },
    { dependencies: [active, data], scope: cardRef }
  );

  return (
    <section id="food-library" ref={ref} className="relative isolate scroll-mt-20 overflow-hidden bg-muted/60 py-24">
      <Ambient
        fields={[
          { tone: "green", className: "right-[12%] top-[15%] h-80 w-80" },
          { tone: "gold", className: "right-[30%] bottom-[5%] h-72 w-72" },
        ]}
      />
      <div className="page-container relative grid grid-cols-[minmax(0,1fr)] items-center gap-12 lg:grid-cols-2">
        <div data-reveal>
          <p className="eyebrow">The food library</p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-text-primary sm:text-4xl">
            One record, two ways of reading food
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-text-secondary">
            Most nutrition apps stop at calories. Classical texts stop at taste and potency. Every
            food in AyurNutri carries both, so a plan can be checked against an energy target and a
            patient's dosha at the same time.
          </p>
          <ul className="mt-6 space-y-3 text-text-secondary">
            {[
              "Calories, protein, carbs and fat per serving",
              "Rasa, guna, virya and vipaka from Ayurvedic sources",
              "Which doshas it calms or raises, and when to avoid it",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <Icon name="Check" size={18} className="mt-0.5 shrink-0 text-primary" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div data-reveal>
          <div className="mb-3 flex flex-wrap items-center gap-2" role="tablist" aria-label="Foods from the library">
            {foods.map((f, i) => (
              <button
                key={f.name}
                type="button"
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={`max-w-[12rem] truncate rounded-md border px-3.5 py-1.5 text-sm transition-colors ${
                  i === active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "glass text-text-secondary hover:text-text-primary"
                }`}
              >
                {f.name.replace(/\s*\(.*\)/, "")}
              </button>
            ))}
            {foods.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setActive(0);
                  setSeed((s) => s + 1);
                }}
                className="ml-auto inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
              >
                <Icon name="Shuffle" size={15} />
                Show others
              </button>
            )}
          </div>

          <article ref={cardRef} className="glass min-h-[26rem] rounded-2xl p-6 sm:p-8">
            {loading && !food && (
              <div className="space-y-4" aria-busy="true">
                <div className="h-7 w-2/3 animate-pulse rounded bg-muted" />
                <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-2 animate-pulse rounded bg-muted" />
                ))}
              </div>
            )}
            {error && !food && (
              <p className="text-sm text-text-secondary">The food library couldn't be loaded right now.</p>
            )}
            {food && (
              <>
                <header data-swap className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-text-primary">{food.name}</h3>
                    <p className="mt-1 text-sm text-text-secondary">{food.serving}</p>
                  </div>
                  <p className="text-right">
                    <span className="block font-display text-3xl font-semibold text-primary">{food.kcal}</span>
                    <span className="text-xs uppercase tracking-wider text-text-secondary">kcal</span>
                  </p>
                </header>

                <div className="mt-6 space-y-3">
                  {[
                    ["Protein", food.protein, "bg-primary"],
                    ["Carbs", food.carbs, "bg-secondary"],
                    ["Fat", food.fat, "bg-accent"],
                  ].map(([label, g, color]) => (
                    <div key={label} data-swap>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-primary">{label}</span>
                        <span className="text-text-secondary">{g} g</span>
                      </div>
                      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                        <div data-bar className={`h-full rounded-full ${color}`} style={{ width: `${(g / macroTotal) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                <dl data-swap className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-5 text-sm">
                  {[
                    ["Rasa (taste)", food.rasa.join(", ") || "-"],
                    ["Guna (quality)", food.guna.join(", ") || "-"],
                    ["Virya (potency)", food.virya],
                    ["Vipaka (after digestion)", food.vipaka],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt className="text-xs text-text-secondary">{k}</dt>
                      <dd className="font-medium text-text-primary">{v}</dd>
                    </div>
                  ))}
                </dl>

                <div data-swap className="mt-5 flex flex-wrap gap-2">
                  {["vata", "pitta", "kapha"]
                    .filter((d) => typeof food.dosha[d] === "number")
                    .map((d) => {
                      const e = effect(food.dosha[d]);
                      return (
                        <span key={d} className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium ${e.cls}`}>
                          <Icon name={e.icon} size={12} />
                          <span className="capitalize">{d}</span> {e.label}
                        </span>
                      );
                    })}
                </div>

                {food.note && (
                  <p data-swap className="mt-4 flex items-start gap-2 text-xs text-text-secondary">
                    <Icon name="Info" size={14} className="mt-px shrink-0" />
                    {food.note}
                  </p>
                )}
              </>
            )}
          </article>
        </div>
      </div>
    </section>
  );
};

export default FoodLibraryPreview;
