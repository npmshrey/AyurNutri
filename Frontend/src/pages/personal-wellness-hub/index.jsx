// src/pages/personal-wellness-hub/index.jsx
// Patient area. RequirePatient already guards this route, so there is no
// role check here. The open section lives in ?section= so a refresh or a
// shared link lands on the same screen, and the back button works.
import React, { useRef } from "react";
import { Helmet } from "react-helmet";
import { useSearchParams } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { MOTION_OK } from "../../lib/motion";

import NavbarPatient, { PATIENT_SECTIONS } from "./components/NavbarPatient";
import DashboardHome from "./components/DashboardHome";
import FoodScan from "./components/FoodScan";
import Analytics from "./components/Analytics";
import Sessions from "./components/Sessions";
import Messages from "./components/Messages";
import IntelligenceCenterDashboard from "../ayurvedic-intelligence-center/IntelligenceCenterDashboard";

const PersonalWellnessHub = () => {
  const [params, setParams] = useSearchParams();
  const requested = params.get("section");
  const active = PATIENT_SECTIONS.some((s) => s.id === requested) ? requested : "dashboard";
  const contentRef = useRef(null);

  const setActive = (id) => {
    setParams(id === "dashboard" ? {} : { section: id });
    window.scrollTo({ top: 0 });
  };

  // Short fade when switching sections. Opacity only: a transform here
  // would trap any position:fixed modal inside the section.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(contentRef.current, { autoAlpha: 0, duration: 0.3, clearProps: "opacity,visibility" });
      });
      return () => mm.revert();
    },
    { dependencies: [active] }
  );

  const renderActive = () => {
    switch (active) {
      case "food-scan":
        return <FoodScan />;
      case "analytics":
        return <Analytics />;
      case "sessions":
        return <Sessions />;
      case "messages":
        return <Messages />;
      case "intelligence-center":
        return <IntelligenceCenterDashboard />;
      default:
        return <DashboardHome onNavigate={setActive} />;
    }
  };

  const label = PATIENT_SECTIONS.find((s) => s.id === active)?.label;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{`${label} | AyurNutri`}</title>
      </Helmet>

      <NavbarPatient active={active} onNavigate={setActive} />

      <main className="pt-6 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={contentRef} key={active} className="space-y-8">
            {renderActive()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PersonalWellnessHub;
