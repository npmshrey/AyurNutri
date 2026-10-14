// src/pages/ayurvedic-intelligence-center/IntelligenceCenterDashboard.jsx
// The learning area. Rendered on its own page (index.jsx) and inside the
// patient's Wellness Hub, so it has no header of its own.
//
// Merged from two near-identical copies. Dropped the "Knowledge Search" tab:
// it returned the same two hardcoded results whatever you searched for.
import React, { useLayoutEffect, useRef, useState } from "react";
import Icon from "../../components/AppIcon";
import { gsap, useGSAP, MOTION_OK } from "../../lib/motion";

import DoshaVisualization from "./components/DoshaVisualization";
import LearningPathCards from "./components/LearningPathCards";
import InteractiveTools from "./components/InteractiveTools";
import VideoLibrary from "./components/VideoLibrary";
import ConceptInfographics from "./components/ConceptInfographics";

const SECTIONS = [
  { id: "overview", name: "Overview", icon: "Compass" },
  { id: "learning", name: "Learning paths", icon: "BookOpen" },
  { id: "tools", name: "Interactive tools", icon: "Calculator" },
  { id: "videos", name: "Videos", icon: "PlayCircle" },
  { id: "concepts", name: "Concept guides", icon: "Layers" },
];

const ENTRY_CARDS = [
  { id: "learning", icon: "BookOpen", title: "Learning paths", body: "Short, ordered modules from the doshas to seasonal eating." },
  { id: "tools", icon: "Calculator", title: "Interactive tools", body: "A dosha self-check and food-combination checks you can try now." },
  { id: "videos", icon: "PlayCircle", title: "Videos", body: "Explainers on agni, the six tastes and daily routine." },
  { id: "concepts", icon: "Layers", title: "Concept guides", body: "Rasa, guna, virya and vipaka, one idea at a time." },
];

const IntelligenceCenterDashboard = () => {
  const [active, setActive] = useState("overview");
  const tabsRef = useRef(null);
  const pillRef = useRef(null);
  const contentRef = useRef(null);

  // Slide the highlight under the active tab.
  useLayoutEffect(() => {
    const tabs = tabsRef.current;
    const btn = tabs?.querySelector(`[data-tab="${active}"]`);
    if (!btn || !pillRef.current) return;
    gsap.to(pillRef.current, {
      x: btn.offsetLeft,
      width: btn.offsetWidth,
      duration: 0.45,
      ease: "power3.out",
    });
    // keep the active tab visible when the strip scrolls on phones
    btn.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [active]);

  // Fade the new section in.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(contentRef.current, { y: 16, autoAlpha: 0, duration: 0.5, clearProps: "transform,opacity,visibility" });
      });
      return () => mm.revert();
    },
    { dependencies: [active] }
  );

  const render = () => {
    switch (active) {
      case "learning":
        return <LearningPathCards />;
      case "tools":
        return <InteractiveTools />;
      case "videos":
        return <VideoLibrary />;
      case "concepts":
        return <ConceptInfographics />;
      default:
        return <Overview onOpen={setActive} />;
    }
  };

  return (
    <div className="pb-16">
      <div className="mb-8 flex justify-center">
        <div
          ref={tabsRef}
          role="tablist"
          aria-label="Learning sections"
          className="relative flex max-w-full gap-1 overflow-x-auto rounded-md border border-border bg-card p-1 [scrollbar-width:none]"
        >
          <span ref={pillRef} aria-hidden="true" className="absolute left-0 top-1 bottom-1 rounded-md bg-primary" />
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              data-tab={s.id}
              aria-selected={active === s.id}
              onClick={() => setActive(s.id)}
              className={`relative z-10 flex shrink-0 items-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                active === s.id ? "text-primary-foreground" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Icon name={s.icon} size={16} />
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div ref={contentRef} role="tabpanel">
        {render()}
      </div>
    </div>
  );
};

const Overview = ({ onOpen }) => (
  <div className="space-y-12">
    <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-[var(--shadow-organic)] sm:p-12">
      <p className="eyebrow justify-center">Learn Ayurveda</p>
      <h1 className="mt-4 font-display text-4xl font-semibold text-text-primary sm:text-5xl">
        The ideas behind your plan
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-text-secondary">
        Why a practitioner calls a food heating or heavy, what your dosha result means, and how to
        eat with the seasons. Short modules, no jargon without an explanation.
      </p>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {ENTRY_CARDS.map((c) => (
        <button
          key={c.id}
          type="button"
          onClick={() => onOpen(c.id)}
          className="group rounded-2xl border border-border bg-card p-6 text-left shadow-[var(--shadow-organic)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--shadow-elevated)]"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon name={c.icon} size={18} />
          </span>
          <h3 className="mt-4 font-display text-lg font-semibold text-text-primary">{c.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{c.body}</p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
            Open
            <Icon name="ArrowRight" size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </button>
      ))}
    </div>

    <DoshaVisualization />
  </div>
);

export default IntelligenceCenterDashboard;
