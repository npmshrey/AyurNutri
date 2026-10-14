import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import Ambient from "../../../components/Ambient";
import { useReveal } from "../../../lib/motion";

const CARDS = [
  {
    tag: "For patients",
    title: "See your plan and keep track of it",
    points: [
      "Take the dosha questionnaire and keep your results",
      "See the weekly plan your practitioner approved",
      "Tick off meals and exercise each day",
      "Photograph a dish for a rough nutrient estimate",
      "Message your practitioner and book sessions",
    ],
    cta: "Create a patient account",
    to: "/signup",
    secondary: { label: "Patient sign in", to: "/signin" },
    icon: "HeartPulse",
  },
  {
    tag: "For practitioners",
    title: "Manage patients and their weekly plans",
    points: [
      "Link patients by the email or phone they registered with",
      "Get a first draft of each weekly plan, based on the dosha",
      "Edit and approve every plan before it is sent",
      "See which meals and days were followed",
      "Keep clinical notes and uploaded reports together",
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
    <section ref={ref} className="relative isolate overflow-hidden py-20">
      <Ambient
        fields={[
          { tone: "sage", className: "left-[-4rem] top-1/4 h-80 w-80" },
          { tone: "green", className: "right-[-2rem] bottom-[10%] h-72 w-96" },
        ]}
      />
      <div className="page-container relative">
        <div data-reveal className="max-w-2xl">
          <p className="eyebrow">Who it's for</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-text-primary">
            Separate accounts for patients and practitioners
          </h2>
        </div>

        <div data-reveal-group className="mt-10 grid gap-6 md:grid-cols-2">
          {CARDS.map((c) => (
            <div key={c.tag}>
            <article className="glass lift flex h-full flex-col rounded-xl p-7 sm:p-8">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Icon name={c.icon} size={18} />
              </span>
              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-text-secondary">{c.tag}</p>
              <h3 className="mt-2 font-display text-xl font-semibold text-text-primary">{c.title}</h3>
              <ul className="mt-5 flex-1 space-y-2.5">
                {c.points.map((p) => (
                  <li key={p} className="flex gap-3 text-sm text-text-secondary">
                    <Icon name="Check" size={16} className="mt-0.5 shrink-0 text-primary" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button className="rounded-md" onClick={() => navigate(c.to)}>
                  {c.cta}
                </Button>
                <Link to={c.secondary.to} className="px-1 text-sm font-medium text-primary underline-offset-4 hover:underline">
                  {c.secondary.label}
                </Link>
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
