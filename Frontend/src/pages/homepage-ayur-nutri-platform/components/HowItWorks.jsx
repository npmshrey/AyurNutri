import React, { useRef } from "react";
import Icon from "../../../components/AppIcon";
import { gsap, useGSAP, MOTION_OK } from "../../../lib/motion";

const STEPS = [
  {
    icon: "ClipboardList",
    title: "Assess the dosha",
    body: "The patient answers a short questionnaire. Each answer is weighted toward Vata, Pitta or Kapha, and the result is kept in their history so changes show up visit to visit.",
  },
  {
    icon: "Sparkles",
    title: "Draft a week of meals",
    body: "Age, weight, activity, goal and dosha go to the plan generator. It can only pick foods from the library, and answers in a fixed structure the app can check.",
  },
  {
    icon: "Stethoscope",
    title: "Practitioner reviews",
    body: "The draft lands with the practitioner, who swaps items, adjusts portions and approves it. Nothing reaches the patient without that step.",
  },
  {
    icon: "CalendarCheck",
    title: "Follow day by day",
    body: "The patient ticks off meals and exercise. Missed days and overeating show up on the practitioner's side without anyone having to ask.",
  },
];

const HowItWorks = () => {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        // The connecting line grows as you scroll through the section.
        gsap.from("[data-track]", {
          scaleX: 0,
          scaleY: 0,
          ease: "none",
          scrollTrigger: { trigger: "[data-steps]", start: "top 75%", end: "bottom 60%", scrub: 0.6 },
        });
        gsap.utils.toArray("[data-step]", ref.current).forEach((step) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: step, start: "top 85%", once: true } });
          tl.from(step.querySelector("[data-dot]"), { scale: 0, duration: 0.45, ease: "back.out(2)" })
            .from(step.querySelector("[data-body]"), { y: 20, autoAlpha: 0, duration: 0.6, clearProps: "transform,opacity,visibility" }, "-=0.2");
        });
        gsap.from("[data-head] > *", {
          y: 20,
          autoAlpha: 0,
          stagger: 0.08,
          duration: 0.7,
          clearProps: "transform,opacity,visibility",
          scrollTrigger: { trigger: "[data-head]", start: "top 88%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <section id="how-it-works" ref={ref} className="scroll-mt-20 py-24">
      <div className="page-container">
        <div data-head className="max-w-2xl">
          <p className="eyebrow">How it works</p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-text-primary sm:text-4xl">
            From first questionnaire to daily follow-up
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-text-secondary">
            Four steps, with the practitioner in the loop at the point that matters most.
          </p>
        </div>

        <ol data-steps className="relative mt-14 grid gap-10 lg:grid-cols-4 lg:gap-8">
          {/* connecting line: vertical on mobile, horizontal on desktop */}
          <span
            data-track
            aria-hidden="true"
            className="absolute left-[19px] top-2 bottom-2 w-px origin-top bg-primary/30 lg:left-0 lg:right-0 lg:top-[19px] lg:bottom-auto lg:h-px lg:w-auto lg:origin-left"
          />
          {STEPS.map((s, i) => (
            <li key={s.title} data-step className="relative pl-14 lg:pl-0 lg:pt-14">
              <span
                data-dot
                className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-background text-primary shadow-[var(--shadow-organic)]"
              >
                <Icon name={s.icon} size={18} />
              </span>
              <div data-body>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-text-secondary">
                  Step {i + 1}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold text-text-primary">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HowItWorks;
