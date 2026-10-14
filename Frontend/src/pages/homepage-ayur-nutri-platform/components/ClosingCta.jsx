import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../../components/AppIcon";
import { gsap, useGSAP, MOTION_OK } from "../../../lib/motion";

const ClosingCta = () => {
  const ref = useRef(null);
  const navigate = useNavigate();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-cta-panel]", {
          y: 40,
          scale: 0.97,
          autoAlpha: 0,
          duration: 1,
          clearProps: "transform,opacity,visibility",
          scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
        });
        // Slow drift on the decorative rings.
        gsap.to("[data-ring]", { rotate: 360, duration: 60, ease: "none", repeat: -1, transformOrigin: "50% 50%" });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="pb-24">
      <div className="page-container">
        <div
          data-cta-panel
          className="relative overflow-hidden rounded-[2rem] bg-[#14301F] px-6 py-14 text-center sm:px-12 sm:py-20"
        >
          <svg data-ring aria-hidden="true" viewBox="0 0 400 400" className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] opacity-20">
            {[180, 140, 100, 60].map((r) => (
              <circle key={r} cx="200" cy="200" r={r} fill="none" stroke="#D8B64A" strokeWidth="1" strokeDasharray="4 10" />
            ))}
          </svg>
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#5FB483]/20 blur-3xl" />

          <p className="relative text-xs font-semibold uppercase tracking-[0.2em] text-[#D8B64A]">Ready when you are</p>
          <h2 className="relative mx-auto mt-4 max-w-2xl font-display text-3xl font-semibold leading-tight text-white sm:text-5xl">
            Start with a dosha check. The plan comes after.
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-base text-white/70 sm:text-lg">
            Create an account in a minute, or sign in if your practitioner has already added you.
          </p>
          <div className="relative mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate("/auth-selection")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D8B64A] px-7 py-3.5 text-sm font-semibold text-[#14301F] transition-transform duration-200 hover:scale-[1.03] active:scale-95"
            >
              Get started
              <Icon name="ArrowRight" size={17} />
            </button>
            <button
              type="button"
              onClick={() => navigate("/ayurvedic-intelligence-center")}
              className="inline-flex items-center justify-center rounded-full border border-white/25 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Learn the basics first
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClosingCta;
