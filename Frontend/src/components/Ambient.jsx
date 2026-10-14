// Blurred light fields that sit behind a section so .glass surfaces on top
// have something to frost. Each field drifts slowly on its own loop; nothing
// moves for people who ask their OS for reduced motion.
import React, { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "../lib/motion";

/**
 * fields: [{ tone: "green" | "sage" | "gold", className: "size and position" }]
 * grid: draw the faint dot grid underneath
 */
const Ambient = ({ fields = [], grid = false }) => {
  const ref = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray("[data-field]", ref.current).forEach((el, i) => {
          gsap.to(el, {
            x: gsap.utils.random(-60, 60),
            y: gsap.utils.random(-40, 40),
            scale: gsap.utils.random(0.9, 1.15),
            duration: gsap.utils.random(14, 22),
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: i * -3,
          });
        });
      });
      return () => mm.revert();
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className="ambient" aria-hidden="true">
      {grid && <div className="dot-grid absolute inset-0" />}
      {fields.map((f, i) => (
        <span key={i} data-field className={`tone-${f.tone} ${f.className}`} />
      ))}
    </div>
  );
};

export default Ambient;
