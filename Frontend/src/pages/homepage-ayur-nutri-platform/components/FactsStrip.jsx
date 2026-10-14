import React, { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "../../../lib/motion";
import { useApi } from "../../../lib/api";

// Every number is counted live by GET /api/stats/public. Nothing is typed in.
const FACTS = [
  { key: "foods", label: "foods in the library, each with nutrient and Ayurvedic data" },
  { key: "practitioners", label: "practitioners registered on the platform" },
  { key: "patients", label: "patients who have signed up" },
  { key: "weeklyPlans", label: "weekly diet plans written so far" },
];

const FactsStrip = () => {
  const ref = useRef(null);
  const { data, loading, error } = useApi("/api/stats/public");

  useGSAP(
    () => {
      if (!data) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray("[data-count]", ref.current).forEach((el) => {
          const end = Number(el.dataset.count) || 0;
          const obj = { v: 0 };
          gsap.to(obj, {
            v: end,
            duration: end > 100 ? 1.6 : 1,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
            onUpdate: () => {
              el.textContent = Math.round(obj.v).toLocaleString("en-IN");
            },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: ref, dependencies: [data] }
  );

  // Don't show made-up fallbacks if the backend can't be reached.
  if (error) return null;

  return (
    <section ref={ref} className="border-y border-border bg-card/70" aria-busy={loading}>
      <div className="page-container grid grid-cols-2 gap-x-6 gap-y-8 py-10 lg:grid-cols-4">
        {FACTS.map((f) => (
          <div key={f.key}>
            <p className="font-display text-3xl font-semibold text-primary sm:text-4xl">
              {data ? (
                <span data-count={data[f.key]}>{Number(data[f.key] || 0).toLocaleString("en-IN")}</span>
              ) : (
                <span className="inline-block h-9 w-20 animate-pulse rounded-md bg-muted align-middle" />
              )}
            </p>
            <p className="mt-2 max-w-[16rem] text-sm leading-snug text-text-secondary">{f.label}</p>
          </div>
        ))}
      </div>
      <p className="page-container pb-4 text-right text-[11px] text-text-secondary/70">Live figures from the AyurNutri database</p>
    </section>
  );
};

export default FactsStrip;
