import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import { useReveal } from "../../../lib/motion";

const CARDS = [
  {
    tag: "For patients",
    title: "Know what to eat this week, and why",
    points: [
      "Take the dosha questionnaire and keep your results",
      "See the plan your practitioner approved, meal by meal",
      "Photograph a dish for a quick nutrient estimate",
      "Message your practitioner and book sessions",
    ],
    cta: "Create a patient account",
    to: "/signup",
    secondary: { label: "I already have one", to: "/signin" },
    icon: "HeartPulse",
  },
  {
    tag: "For practitioners",
    title: "Spend your time on judgement, not charts",
    points: [
      "Link patients by the email or phone they signed up with",
      "Get a dosha-aware first draft of each weekly plan",
      "Edit and approve before anything goes out",
      "Watch adherence without chasing patients for updates",
    ],
    cta: "Register as a practitioner",
    to: "/signup/doctor",
    secondary: { label: "Practitioner sign in", to: "/signin/doctor" },
    icon: "Stethoscope",
  },
];

const Audience = () => {
  const ref = useRef(null);
  const navigate = useNavigate();
  useReveal(ref);

  return (
    <section ref={ref} className="py-24">
      <div className="page-container">
        <div data-reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">Two sides of one consultation</p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-text-primary sm:text-4xl">
            Built for the patient and the person advising them
          </h2>
        </div>

        <div data-reveal-group className="mt-12 grid gap-6 md:grid-cols-2">
          {CARDS.map((c) => (
            // Reveal animates this wrapper; the card's own hover lift stays on
            // the article so the two transforms don't fight.
            <div key={c.tag} className="flex">
            <article
              className="group flex w-full flex-col rounded-3xl border border-border bg-card p-7 shadow-[var(--shadow-organic)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-elevated)] sm:p-9"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                <Icon name={c.icon} size={20} />
              </span>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary">{c.tag}</p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-text-primary">{c.title}</h3>
              <ul className="mt-5 flex-1 space-y-3">
                {c.points.map((p) => (
                  <li key={p} className="flex gap-3 text-text-secondary">
                    <Icon name="Check" size={18} className="mt-0.5 shrink-0 text-primary" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button className="rounded-full px-6" onClick={() => navigate(c.to)}>
                  {c.cta}
                </Button>
                <button
                  type="button"
                  onClick={() => navigate(c.secondary.to)}
                  className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  {c.secondary.label}
                </button>
              </div>
            </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Audience;
