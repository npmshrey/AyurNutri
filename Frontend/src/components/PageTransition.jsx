// src/components/PageTransition.jsx
// Cross-fades each new route in so moving between pages feels continuous.
// Deliberately opacity-only: a transform here would make this wrapper the
// containing block for position:fixed children (the header, the doctor
// sidebar, the chatbot), and they'd jump during the fade. Pages add their
// own upward motion to their content via useEnter.
import React, { useRef } from "react";
import { useLocation } from "react-router-dom";
import { gsap, useGSAP, ScrollTrigger, MOTION_OK } from "../lib/motion";

const PageTransition = ({ children }) => {
  const ref = useRef(null);
  const { pathname } = useLocation();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          ref.current,
          { autoAlpha: 0 },
          {
            autoAlpha: 1,
            duration: 0.45,
            ease: "power1.out",
            clearProps: "opacity,visibility",
            onComplete: () => ScrollTrigger.refresh(),
          }
        );
      });
      return () => mm.revert();
    },
    { dependencies: [pathname] }
  );

  return <div ref={ref}>{children}</div>;
};

export default PageTransition;
