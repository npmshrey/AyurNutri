// src/pages/personal-wellness-hub/index.jsx
import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { AnimatePresence, motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

// Local components
import NavbarPatient from "./components/NavbarPatient";
import DashboardHome from "./components/DashboardHome";
import FoodScan from "./components/FoodScan";
import Analytics from "./components/Analytics";
import Sessions from "./components/Sessions";
import Messages from "./components/Messages";
import IntelligenceCenterDashboard from "../ayurvedic-intelligence-center/IntelligenceCenterDashboard";

const pageMotion = {
  initial: { opacity: 0, y: 10, scale: 0.995 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.995 },
  transition: { duration: 0.36, ease: "easeOut" },
};

const PersonalWellnessHub = () => {
  const { user, isPatient } = useAuth();

  // Agar doctor ya unauthenticated aaya toh redirect
  if (!isPatient) {
    if (user?.role === "doctor") {
      return <Navigate to="/professional-dashboard-portal" replace />;
    }
    return <Navigate to="/signin" replace />;
  }

  // Kaunsa screen open hai (dashboard / food-scan / analytics ...)
  const [active, setActive] = useState("dashboard");

  // Active ke hisaab se component dikhana
  const renderActive = () => {
    switch (active) {
      case "dashboard":
        // ✅ yahan se DashboardHome ko onNavigate milta hai (cards ko control karega)
        return <DashboardHome onNavigate={setActive} />;
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

  // Theme colors
  const themeVars = {
    "--ayur-primary": "#0F6C3F",
    "--ayur-mint": "#E8F7EE",
    "--ayur-beige": "#E8E2D9",
    "--ayur-border": "#D6D1C9",
    "--ayur-text-dark": "#2A2A2A",
    "--ayur-text-med": "#555555",
    "--ayur-bg": "#FAF9F6",
  };

  return (
    <div style={themeVars} className="min-h-screen" aria-live="polite">
      <Helmet>
        <title>Personal Wellness Hub</title>
      </Helmet>

      {/* Top patient navbar (jo pehle se tha) */}
      <NavbarPatient active={active} onNavigate={setActive} />

      <main className="pt-6 pb-12 bg-[var(--ayur-bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 👇 Middle wala extra navbar hata diya, sirf content bacha */}

          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageMotion}
              transition={pageMotion.transition}
            >
              <div className="space-y-8">{renderActive()}</div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default PersonalWellnessHub;
