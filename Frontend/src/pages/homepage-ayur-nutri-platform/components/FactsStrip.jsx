import React, { useRef } from "react";
import Icon from "../../../components/AppIcon";
import Ambient from "../../../components/Ambient";
import { useApi } from "../../../lib/api";
import { useReveal } from "../../../lib/motion";

// Facts about the food library itself, read live from GET /api/foods/stats.
// Deliberately no user/customer counts and no count-up animation.
const FactsStrip = () => {
  const ref = useRef(null);
  const { data, error } = useApi("/api/foods/stats");
  useReveal(ref, [!!data]);
  if (error) return null;

  const categories = data ? Object.entries(data.categories).sort((a, b) => b[1] - a[1]) : [];
  const facts = data
    ? [
        { icon: "Database", value: data.total.toLocaleString("en-IN"), label: "foods and recipes in the library" },
        { icon: "LayoutGrid", value: categories.length, label: "food categories, from meals to seeds" },
        { icon: "Leaf", value: data.complete.toLocaleString("en-IN"), label: "records with rasa, guna, virya and vipaka filled in" },
      ]
    : [];

  return (
    <section ref={ref} className="relative isolate overflow-hidden border-b border-border bg-muted/40">
      <Ambient
        fields={[
          { tone: "gold", className: "-left-20 -top-24 h-64 w-96" },
          { tone: "green", className: "right-0 top-4 h-56 w-80" },
        ]}
      />
      <div data-reveal-group className="page-container relative grid gap-4 py-10 sm:grid-cols-3">
        {data
          ? facts.map((f) => (
              <div key={f.label} className="glass lift flex items-start gap-4 rounded-xl p-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon name={f.icon} size={18} />
                </span>
                <div>
                  <p className="font-display text-3xl font-semibold text-text-primary">{f.value}</p>
                  <p className="mt-1 text-sm text-text-secondary">{f.label}</p>
                </div>
              </div>
            ))
          : [0, 1, 2].map((i) => (
              <div key={i} aria-hidden="true" className="glass rounded-xl p-5">
                <div className="h-8 w-20 animate-pulse rounded bg-muted" />
                <div className="mt-2 h-4 w-48 animate-pulse rounded bg-muted" />
              </div>
            ))}
      </div>
      {categories.length > 0 && (
        <p className="page-container relative pb-6 text-xs text-text-secondary">
          {categories.map(([name, n]) => `${name} ${n}`).join("  ·  ")}
        </p>
      )}
    </section>
  );
};

export default FactsStrip;
