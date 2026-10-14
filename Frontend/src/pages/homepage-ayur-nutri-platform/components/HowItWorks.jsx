import React, { useRef } from "react";
import Icon from "../../../components/AppIcon";
import Ambient from "../../../components/Ambient";
import { gsap, useGSAP, useReveal, MOTION_OK } from "../../../lib/motion";

const STEPS = [
  {
    icon: "ClipboardList",
    title: "Assess the dosha",
    body: "The patient answers a short questionnaire. Each answer is weighted toward Vata, Pitta or Kapha, and every result is kept so changes show up from visit to visit.",
  },
  {
    icon: "FileText",
    title: "Draft a week of meals",
    body: "Age, weight, activity, goal and dosha go to the plan generator. It can only choose foods from the library and must answer in a fixed format the app checks.",
  },
  {
    icon: "Stethoscope",
    title: "Practitioner reviews",
    body: "The draft goes to the practitioner, who swaps items, adjusts portions and approves it. Nothing reaches the patient before that.",
  },
  {
    icon: "CalendarCheck",
    title: "Follow day by day",
    body: "The patient ticks off meals and exercise. Missed days and overeating show up for the practitioner without anyone having to ask.",
  },
];

const HowItWorks = () => {
  const ref = useRef(null);
  useReveal(ref);

  // The line joining the four steps draws itself as the section scrolls in.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and (min-width: 1024px)`, () => {
        gsap.fromTo(
          "[data-connector]",
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            transformOrigin: "left center",
            scrollTrigger: { trigger: "[data-steps]", start: "top 80%", end: "bottom 60%", scrub: 0.6 },
          }
        );
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <section id="how-it-works" ref={ref} className="relative isolate scroll-mt-20 overflow-hidden py-20">
      <Ambient
        fields={[
          { tone: "sage", className: "left-[10%] top-1/3 h-72 w-96" },
          { tone: "gold", className: "right-[5%] bottom-0 h-64 w-80" },
        ]}
      />
      <div className="page-container relative">
        <div data-reveal className="max-w-2xl">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-text-primary">
            From the first questionnaire to daily follow-up
          </h2>
        </div>

        <div data-steps className="relative mt-12">
          <div
            aria-hidden="true"
            className="absolute left-[12%] right-[12%] top-[2.75rem] hidden h-px bg-border lg:block"
          >
            <div data-connector className="h-full w-full origin-left bg-primary" />
          </div>

          <ol data-reveal-group className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title}>
                <div className="glass lift h-full rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                      <Icon name={s.icon} size={18} />
                    </span>
                    <span className="text-sm font-medium text-text-secondary">{i + 1} of 4</span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold text-text-primary">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
