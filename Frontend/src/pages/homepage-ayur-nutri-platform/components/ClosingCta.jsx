import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { gsap, useGSAP, useReveal, MOTION_OK } from "../../../lib/motion";

const ClosingCta = () => {
  const ref = useRef(null);
  const navigate = useNavigate();
  useReveal(ref);

  // Two slow light fields drifting inside the dark band.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.to("[data-glow]", {
          xPercent: (i) => (i ? -25 : 25),
          yPercent: (i) => (i ? 15 : -15),
          duration: 12,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <section ref={ref} className="pb-20">
      <div className="page-container">
        <div data-reveal className="relative isolate overflow-hidden rounded-xl bg-[#14301F] px-6 py-12 sm:px-12">
          <span data-glow aria-hidden="true" className="pointer-events-none absolute -left-16 -top-24 -z-10 h-72 w-72 rounded-full bg-[#2E8B57]/40 blur-3xl" />
          <span data-glow aria-hidden="true" className="pointer-events-none absolute -bottom-28 right-0 -z-10 h-72 w-96 rounded-full bg-[#D8B64A]/25 blur-3xl" />
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">
                Start with the dosha questionnaire
              </h2>
              <p className="mt-2 text-white/75">
                Create a free patient account to take it. If your practitioner has already added you,
                sign in with the email or phone you gave them.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="inline-flex items-center justify-center rounded-md bg-[#D8B64A] px-5 py-2.5 text-sm font-semibold text-[#14301F] transition-colors hover:bg-[#e2c364]"
              >
                Create an account
              </button>
              <Link
                to="/signin"
                className="inline-flex items-center justify-center rounded-md border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition-colors hover:bg-white/20"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClosingCta;
