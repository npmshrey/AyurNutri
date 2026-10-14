// src/lib/motion.js
// Single place where GSAP is configured. Everything animated in the app
// goes through here so the easing, timing and reduced-motion handling
// stay consistent from page to page.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

gsap.defaults({ ease: "power3.out", duration: 0.7 });

// People who ask their OS for less motion get content shown immediately.
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/**
 * Staggered entrance for elements marked data-enter inside `scope`.
 * Runs once on mount — used for page headers, auth cards, hero copy.
 */
export function useEnter(scope, { delay = 0.05, stagger = 0.08, y = 22 } = {}, deps = []) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const items = gsap.utils.toArray("[data-enter]", scope.current);
        if (!items.length) return;
        gsap.from(items, {
          y,
          autoAlpha: 0,
          duration: 0.8,
          delay,
          stagger,
          clearProps: "transform,opacity,visibility",
        });
      });
      return () => mm.revert();
    },
    { scope, dependencies: deps }
  );
}

/**
 * Scroll reveals for elements marked data-reveal inside `scope`.
 * A parent marked data-reveal-group reveals its direct children in
 * sequence instead, which reads better for card grids.
 */
export function useReveal(scope, deps = []) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.utils.toArray("[data-reveal]", scope.current).forEach((el) => {
          gsap.from(el, {
            y: 32,
            autoAlpha: 0,
            duration: 0.9,
            clearProps: "transform,opacity,visibility",
            scrollTrigger: { trigger: el, start: "top 92%", once: true },
          });
        });

        gsap.utils.toArray("[data-reveal-group]", scope.current).forEach((group) => {
          gsap.from(group.children, {
            y: 28,
            autoAlpha: 0,
            duration: 0.75,
            stagger: 0.09,
            clearProps: "transform,opacity,visibility",
            scrollTrigger: { trigger: group, start: "top 90%", once: true },
          });
        });
      });
      // Layout can shift after fonts/images load; make triggers re-measure.
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      return () => {
        window.removeEventListener("load", refresh);
        mm.revert();
      };
    },
    { scope, dependencies: deps }
  );
}

export { gsap, ScrollTrigger, useGSAP };
