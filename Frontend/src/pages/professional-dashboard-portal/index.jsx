// Practitioner portal shell.
//
// Fixes over the previous version:
//  - Hooks ran after an early <Navigate/> return, which breaks React's rules
//    of hooks and can crash the page ("Rendered more hooks than during the
//    previous render"). Access control now lives in the route guard.
//  - On phones the section sidebar was simply hidden, with no way to open
//    it — a doctor couldn't reach Patient Management at all.
//  - The current section lives in the URL (?section=patients), so refresh
//    and the browser Back button keep you where you were.
//  - The breadcrumb linked to a route that doesn't exist.
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "../../components/ui/Header";
import Icon from "../../components/AppIcon";
import useAuth from "../../hooks/useAuth";
import { gsap, useGSAP, MOTION_OK } from "../../lib/motion";

import DashboardOverview from "./components/DashboardOverview";
import PatientManagement from "./components/PatientManagement";
import AnalyticsSuite from "./components/AnalyticsSuite";
import CommunicationTools from "./components/CommunicationTools";
import DoctorDietBuilderPage from "./components/DoctorDietBuilderPage";

const SECTIONS = [
  { id: "overview", name: "Overview", icon: "LayoutDashboard", description: "Today's appointments" },
  { id: "patients", name: "Patients", icon: "Users", description: "Profiles, notes and plans" },
  { id: "plans", name: "Diet builder", icon: "Salad", description: "Build a plan from the food library" },
  { id: "analytics", name: "Analytics", icon: "BarChart3", description: "How your practice is doing" },
  { id: "communication", name: "Messages", icon: "MessageSquare", description: "Chat with patients" },
];

const renderSection = (id) => {
  switch (id) {
    case "patients":
      return <PatientManagement />;
    case "plans":
      return <DoctorDietBuilderPage embedded />;
    case "analytics":
      return <AnalyticsSuite />;
    case "communication":
      return <CommunicationTools />;
    default:
      return <DashboardOverview />;
  }
};

const NavList = ({ active, collapsed, onSelect }) => (
  <nav className="space-y-1" aria-label="Portal sections">
    {SECTIONS.map((s) => {
      const isActive = active === s.id;
      return (
        <button
          key={s.id}
          type="button"
          onClick={() => onSelect(s.id)}
          aria-current={isActive ? "page" : undefined}
          title={collapsed ? s.name : undefined}
          className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors duration-200 ${
            isActive ? "bg-primary/10 text-primary" : "text-text-secondary hover:bg-muted hover:text-text-primary"
          }`}
        >
          {isActive && <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary" aria-hidden="true" />}
          <Icon name={s.icon} size={19} className={`shrink-0 ${collapsed ? "mx-auto" : ""}`} />
          {!collapsed && (
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">{s.name}</span>
              <span className="block truncate text-xs text-text-secondary">{s.description}</span>
            </span>
          )}
        </button>
      );
    })}
  </nav>
);

const ProfessionalDashboardPortal = () => {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const requested = params.get("section");
  const active = SECTIONS.some((s) => s.id === requested) ? requested : "overview";

  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem("portalSidebar") === "collapsed";
    } catch {
      return false;
    }
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

  const contentRef = useRef(null);
  const drawerRef = useRef(null);
  const overlayRef = useRef(null);

  const doctorName = (() => {
    const base = (user?.fullName || user?.name || "Doctor").trim();
    return /^dr\.?/i.test(base) ? base : `Dr. ${base}`;
  })();
  const current = SECTIONS.find((s) => s.id === active);

  const select = (id) => {
    setParams(id === "overview" ? {} : { section: id });
    setDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      try {
        localStorage.setItem("portalSidebar", c ? "expanded" : "collapsed");
      } catch {
        /* ignore */
      }
      return !c;
    });
  };

  // Section change: content rises in.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(contentRef.current, { y: 18, autoAlpha: 0, duration: 0.5, clearProps: "transform,opacity,visibility" });
      });
      return () => mm.revert();
    },
    { dependencies: [active] }
  );

  // Mobile drawer.
  useLayoutEffect(() => {
    const drawer = drawerRef.current;
    const overlay = overlayRef.current;
    if (!drawer || !overlay) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const d = reduce ? 0 : 0.35;
    if (drawerOpen) {
      gsap.set([drawer, overlay], { display: "block" });
      gsap.fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1, duration: d });
      gsap.fromTo(drawer, { xPercent: -100 }, { xPercent: 0, duration: d, ease: "power3.out" });
    } else {
      gsap.to(overlay, { autoAlpha: 0, duration: d * 0.7 });
      gsap.to(drawer, {
        xPercent: -100,
        duration: d * 0.7,
        ease: "power2.in",
        onComplete: () => gsap.set([drawer, overlay], { display: "none" }),
      });
    }
  }, [drawerOpen]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e) => e.key === "Escape" && setDrawerOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [drawerOpen]);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{`${current.name} — Practitioner portal`}</title>
      </Helmet>

      <Header fluid />

      {/* Desktop sidebar */}
      <aside
        className={`fixed bottom-0 left-0 top-16 z-30 hidden flex-col border-r border-border bg-card/80 backdrop-blur-sm transition-[width] duration-300 lg:flex ${
          collapsed ? "w-[76px]" : "w-72"
        }`}
      >
        <div className={`flex items-center border-b border-border p-4 ${collapsed ? "justify-center" : "justify-between"}`}>
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate font-display text-base font-semibold text-text-primary">{doctorName}</p>
              <p className="text-xs text-text-secondary">Practitioner workspace</p>
            </div>
          )}
          <button
            type="button"
            onClick={toggleCollapsed}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-muted hover:text-text-primary"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Icon name={collapsed ? "PanelLeftOpen" : "PanelLeftClose"} size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3">
          <NavList active={active} collapsed={collapsed} onSelect={select} />
        </div>
      </aside>

      {/* Mobile drawer */}
      <div
        ref={overlayRef}
        onClick={() => setDrawerOpen(false)}
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] lg:hidden"
        style={{ display: "none" }}
        aria-hidden="true"
      />
      <aside
        ref={drawerRef}
        className="fixed bottom-0 left-0 top-0 z-50 w-72 max-w-[85vw] border-r border-border bg-card p-4 shadow-[var(--shadow-elevated)] lg:hidden"
        style={{ display: "none" }}
        aria-label="Portal sections"
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="font-display text-base font-semibold text-text-primary">{doctorName}</p>
            <p className="text-xs text-text-secondary">Practitioner workspace</p>
          </div>
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted"
            aria-label="Close sections"
          >
            <Icon name="X" size={18} />
          </button>
        </div>
        <NavList active={active} collapsed={false} onSelect={select} />
      </aside>

      <main className={`pt-16 transition-[padding] duration-300 ${collapsed ? "lg:pl-[76px]" : "lg:pl-72"}`}>
        {/* Mobile section bar */}
        <div className="sticky top-16 z-20 flex items-center gap-3 border-b border-border bg-background/90 px-4 py-2.5 backdrop-blur-md lg:hidden">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-text-primary"
            aria-expanded={drawerOpen}
          >
            <Icon name="PanelLeft" size={16} />
            Sections
          </button>
          <span className="truncate text-sm text-text-secondary">{current.name}</span>
        </div>

        <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-7xl">
            <nav className="mb-6 hidden items-center gap-2 text-sm text-text-secondary lg:flex" aria-label="Breadcrumb">
              <Link to="/" className="transition-colors hover:text-primary">AyurNutri</Link>
              <Icon name="ChevronRight" size={14} />
              <button type="button" onClick={() => select("overview")} className="transition-colors hover:text-primary">
                Practitioner portal
              </button>
              <Icon name="ChevronRight" size={14} />
              <span className="text-text-primary">{current.name}</span>
            </nav>

            <div ref={contentRef}>{renderSection(active)}</div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfessionalDashboardPortal;
