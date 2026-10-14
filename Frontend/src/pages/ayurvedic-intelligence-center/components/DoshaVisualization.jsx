// Dosha explorer shown on the "Learn Ayurveda" overview.
// The content here was already written in this file but had been commented
// out, so the component rendered nothing. Rebuilt around the same data.
import React, { useRef, useState } from "react";
import Icon from "../../../components/AppIcon";
import { gsap, useGSAP, MOTION_OK } from "../../../lib/motion";
import { useApi } from "../../../lib/api";

const DOSHAS = [
  {
    id: "vata",
    name: "Vata",
    sanskrit: "वात",
    say: "VAH-tah",
    element: "Air + space",
    icon: "Wind",
    accent: "#4F8FB0",
    qualities: ["Light", "Dry", "Cold", "Rough", "Subtle", "Mobile"],
    body: "Thin build, dry skin, cold hands and feet, appetite that comes and goes.",
    mind: "Creative and quick, enthusiastic, and anxious when out of balance.",
    eat: "Warm, moist, grounding food at regular times. Go easy on raw and cold.",
  },
  {
    id: "pitta",
    name: "Pitta",
    sanskrit: "पित्त",
    say: "PIT-tah",
    element: "Fire + water",
    icon: "Flame",
    accent: "#C9771C",
    qualities: ["Hot", "Sharp", "Light", "Liquid", "Spreading", "Oily"],
    body: "Medium build, runs warm, strong appetite and usually good digestion.",
    mind: "Focused, organised, competitive, and irritable when out of balance.",
    eat: "Cooling, sweet and bitter foods. Hold back on very spicy, sour and salty.",
  },
  {
    id: "kapha",
    name: "Kapha",
    sanskrit: "कफ",
    say: "KAH-fah",
    element: "Earth + water",
    icon: "Mountain",
    accent: "#3C7A4E",
    qualities: ["Heavy", "Slow", "Cool", "Oily", "Smooth", "Stable"],
    body: "Sturdy build, smooth skin, slower digestion, steady energy.",
    mind: "Calm, loving and patient, and sluggish when out of balance.",
    eat: "Light, warm, lightly spiced meals in smaller portions. Less heavy and oily food.",
  },
];

const DoshaVisualization = () => {
  const [active, setActive] = useState(0);
  const panelRef = useRef(null);
  const d = DOSHAS[active];

  // Foods that calm or raise this dosha, straight from the live library.
  const calms = useApi("/api/foods", { params: { dosha: d.id, effect: "calms", random: 1, limit: 8 } });
  const raises = useApi("/api/foods", { params: { dosha: d.id, effect: "raises", random: 1, limit: 6 } });
  const favour = (calms.data?.items || []).map((f) => f.name);
  const reduce = (raises.data?.items || []).map((f) => f.name);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(panelRef.current.querySelectorAll("[data-d]"), {
          y: 8,
          autoAlpha: 0,
          duration: 0.35,
          stagger: 0.05,
          clearProps: "transform,opacity,visibility",
        });
      });
      return () => mm.revert();
    },
    { dependencies: [active, calms.data, raises.data], scope: panelRef }
  );

  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-organic)] sm:p-10">
      <div className="max-w-2xl">
        <p className="eyebrow">The three doshas</p>
        <h2 className="mt-3 font-display text-3xl font-semibold text-text-primary">Pick one to explore</h2>
        <p className="mt-2 text-text-secondary">
          Everyone has all three. The one that dominates is your prakriti; the one that's out of
          balance right now is your vikriti.
        </p>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3" role="tablist" aria-label="Doshas">
        {DOSHAS.map((x, i) => (
          <button
            key={x.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-[border-color,background-color,box-shadow] duration-300 ${
              i === active ? "border-transparent shadow-[var(--shadow-elevated)]" : "border-border hover:border-primary/30"
            }`}
            style={i === active ? { backgroundColor: `color-mix(in srgb, ${x.accent} 12%, var(--color-card))` } : undefined}
          >
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white"
              style={{ backgroundColor: x.accent }}
            >
              <Icon name={x.icon} size={20} />
            </span>
            <span>
              <span className="block font-display text-lg font-semibold text-text-primary">{x.name}</span>
              <span className="block text-xs text-text-secondary">{x.element}</span>
            </span>
          </button>
        ))}
      </div>

      <div ref={panelRef} className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]" role="tabpanel">
        <div>
          <p data-d className="flex items-baseline gap-3">
            <span className="font-display text-4xl font-semibold" style={{ color: d.accent }}>{d.sanskrit}</span>
            <span className="text-sm text-text-secondary">say it "{d.say}"</span>
          </p>
          <div data-d className="mt-5 flex flex-wrap gap-2">
            {d.qualities.map((q) => (
              <span key={q} data-chip className="rounded-md border border-border bg-background px-3 py-1 text-xs font-medium text-text-primary">
                {q}
              </span>
            ))}
          </div>
          <dl className="mt-6 space-y-4 text-sm">
            {[
              ["Body", d.body],
              ["Mind", d.mind],
              ["How to eat", d.eat],
            ].map(([k, v]) => (
              <div data-d key={k}>
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">{k}</dt>
                <dd className="mt-1 leading-relaxed text-text-primary">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <div data-d className="rounded-2xl bg-primary/5 p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Icon name="ThumbsUp" size={16} /> From the library: calms {d.name}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {favour.length === 0 && <li className="text-xs text-text-secondary">{calms.loading ? "Loading…" : "Nothing found in the library."}</li>}
              {favour.map((f) => (
                <li key={f} data-chip className="rounded-md bg-card px-3 py-1 text-xs text-text-primary shadow-sm">{f}</li>
              ))}
            </ul>
          </div>
          <div data-d className="rounded-2xl bg-warning/5 p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-warning">
              <Icon name="MinusCircle" size={16} /> From the library: raises {d.name}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {reduce.length === 0 && <li className="text-xs text-text-secondary">{raises.loading ? "Loading…" : "Nothing found in the library."}</li>}
              {reduce.map((f) => (
                <li key={f} data-chip className="rounded-md bg-card px-3 py-1 text-xs text-text-primary shadow-sm">{f}</li>
              ))}
            </ul>
          </div>
          <p data-d className="flex gap-2 text-xs leading-relaxed text-text-secondary">
            <Icon name="Info" size={14} className="mt-px shrink-0" />
            General guidance only. Your practitioner adjusts it to your constitution, season and digestion.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DoshaVisualization;
