import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Ambient from "../../../components/Ambient";
import { gsap, useGSAP, MOTION_OK } from "../../../lib/motion";
import { useApi } from "../../../lib/api";

const SLOTS = [
  { slot: "Breakfast", icon: "Sunrise" },
  { slot: "Lunch", icon: "Sun" },
  { slot: "Dinner", icon: "Moon" },
];

const HEADLINE = ["Ayurvedic diet planning,", "with the nutrition numbers", "alongside."];

// One food per meal, picked from the live library.
const SampleDay = () => {
  const listRef = useRef(null);
  const [seed, setSeed] = useState(0);
  const { data, loading, error } = useApi("/api/foods", {
    params: { random: 1, complete: 1, limit: 80 },
    deps: [seed],
  });
  const items = data?.items || [];
  // Pick a different food for each meal.
  const used = new Set();
  const day = SLOTS.map((s) => {
    const food = items.find((f) => !used.has(f.id) && (f.mealSlots || []).includes(s.slot));
    if (food) used.add(food.id);
    return { ...s, food };
  });
  const total = day.reduce((sum, m) => sum + (m.food?.nutritionPerServing?.caloriesKcal || 0), 0);

  // Rows slide in each time a new day arrives.
  useGSAP(
    () => {
      if (!data) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(listRef.current.querySelectorAll("[data-row]"), {
          x: 14,
          autoAlpha: 0,
          duration: 0.5,
          stagger: 0.08,
          clearProps: "transform,opacity,visibility",
        });
      });
      return () => mm.revert();
    },
    { dependencies: [data], scope: listRef }
  );

  return (
    <div className="glass rounded-2xl">
      <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
        <div>
          <p className="text-sm font-semibold text-text-primary">A sample day</p>
          <p className="text-xs text-text-secondary">Drawn from the food library just now</p>
        </div>
        <button
          type="button"
          onClick={() => setSeed((s) => s + 1)}
          className="group inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/10"
        >
          <Icon
            name="RefreshCw"
            size={13}
            className={`transition-transform duration-500 group-hover:rotate-180 ${loading ? "animate-spin" : ""}`}
          />
          Another day
        </button>
      </div>

      <ul ref={listRef} className="divide-y divide-border/70">
        {day.map(({ slot, icon, food }) => (
          <li key={slot} data-row className="flex items-start gap-3 px-5 py-4">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Icon name={icon} size={15} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs text-text-secondary">{slot}</p>
              {food ? (
                <>
                  <p className="truncate font-medium text-text-primary">{food.name}</p>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    {[
                      food.ayurveda?.virya && `Virya: ${food.ayurveda.virya}`,
                      (food.ayurveda?.rasa || []).length && `Rasa: ${food.ayurveda.rasa.join(", ")}`,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </>
              ) : (
                <div className={`mt-1 h-4 w-40 rounded bg-muted ${loading ? "animate-pulse" : ""}`} />
              )}
            </div>
            {food && (
              <p className="shrink-0 text-sm text-text-secondary">
                {food.nutritionPerServing?.caloriesKcal} <span className="text-xs">kcal</span>
              </p>
            )}
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between border-t border-border/70 px-5 py-3 text-sm">
        <span className="text-text-secondary">{error ? "Couldn't reach the food library." : "Total"}</span>
        {!error && <span className="font-semibold text-text-primary">{total ? `${total} kcal` : ""}</span>}
      </div>
    </div>
  );
};

const HeroSection = () => {
  const ref = useRef(null);
  const navigate = useNavigate();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from("[data-eyebrow]", { y: 10, autoAlpha: 0, duration: 0.5 })
          // Each headline line rises out of its own clipped row.
          .from("[data-line]", { yPercent: 105, duration: 0.8, stagger: 0.09 }, "-=0.2")
          .from("[data-after]", { y: 12, autoAlpha: 0, duration: 0.55, stagger: 0.07, clearProps: "transform,opacity,visibility" }, "-=0.45")
          .from("[data-card]", { y: 24, autoAlpha: 0, duration: 0.8, clearProps: "transform,opacity,visibility" }, 0.25);
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="relative isolate overflow-hidden border-b border-border">
      <Ambient
        grid
        fields={[
          { tone: "green", className: "-left-24 top-10 h-80 w-80" },
          { tone: "gold", className: "right-[8%] top-[18%] h-72 w-72" },
          { tone: "sage", className: "bottom-[-6rem] right-[30%] h-80 w-[26rem]" },
        ]}
      />

      <div className="page-container relative grid grid-cols-[minmax(0,1fr)] items-center gap-12 py-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:py-24">
        <div>
          <p data-eyebrow className="eyebrow">For Ayurvedic dietitians and their patients</p>

          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-text-primary sm:text-5xl">
            {HEADLINE.map((line, i) => (
              <span key={line} className="block overflow-hidden pb-1">
                <span data-line className={`block ${i === 2 ? "text-primary" : ""}`}>
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p data-after className="mt-5 max-w-xl text-lg leading-relaxed text-text-secondary">
            Assess a patient's dosha, build a week of meals from a food library that records both
            nutrients and Ayurvedic properties, and see each day whether the plan is being followed.
          </p>

          <div data-after className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button size="lg" className="rounded-md px-6" onClick={() => navigate("/auth-selection")}>
              Create an account
            </Button>
            <Link
              to="/#how-it-works"
              className="group inline-flex items-center justify-center gap-1.5 px-2 py-2 text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              How it works
              <Icon name="ArrowRight" size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          <p data-after className="mt-6 flex items-center gap-2 text-sm text-text-secondary">
            <Icon name="ShieldCheck" size={16} className="text-primary" />
            Plans drafted by the AI are reviewed by a practitioner before a patient sees them.
          </p>
        </div>

        <div data-card className="relative">
          <SampleDay />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
