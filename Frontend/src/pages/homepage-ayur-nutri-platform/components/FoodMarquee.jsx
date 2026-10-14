import React, { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "../../../lib/motion";
import { useApi } from "../../../lib/api";

const Row = ({ items, reverse }) => {
  const trackRef = useRef(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const track = trackRef.current;
      // The list is rendered twice; moving by half its width loops seamlessly.
      const tween = gsap.fromTo(
        track,
        { xPercent: reverse ? -50 : 0 },
        { xPercent: reverse ? 0 : -50, duration: 45, ease: "none", repeat: -1 }
      );
      const slow = () => gsap.to(tween, { timeScale: 0.2, duration: 0.6 });
      const resume = () => gsap.to(tween, { timeScale: 1, duration: 0.6 });
      track.addEventListener("mouseenter", slow);
      track.addEventListener("mouseleave", resume);
      return () => {
        track.removeEventListener("mouseenter", slow);
        track.removeEventListener("mouseleave", resume);
      };
    });
    return () => mm.revert();
  });

  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
      <ul ref={trackRef} className="flex shrink-0 gap-3 pr-3">
        {[...items, ...items].map((f, i) => (
          <li
            key={`${f}-${i}`}
            aria-hidden={i >= items.length || undefined}
            className="whitespace-nowrap rounded-full border border-border bg-card px-4 py-2 text-sm text-text-secondary"
          >
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
};

// A fresh random sample from the live library on every visit.
const FoodMarquee = () => {
  const { data } = useApi("/api/foods", { params: { random: 1, limit: 24 } });
  const names = (data?.items || []).map((f) => f.name);
  if (names.length < 6) return null;
  const half = Math.ceil(names.length / 2);

  return (
    <section className="space-y-3 py-10" aria-label="A few foods from the library">
      <Row items={names.slice(0, half)} />
      <Row items={names.slice(half)} reverse />
    </section>
  );
};

export default FoodMarquee;
