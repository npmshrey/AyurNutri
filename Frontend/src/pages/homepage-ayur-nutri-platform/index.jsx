import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import Header from "../../components/ui/Header";
import HeroSection from "./components/HeroSection";
import FactsStrip from "./components/FactsStrip";
import HowItWorks from "./components/HowItWorks";
import FoodLibraryPreview from "./components/FoodLibraryPreview";
import Audience from "./components/Audience";
import ClosingCta from "./components/ClosingCta";
import Footer from "./components/Footer";

const HomepageAyurNutriPlatform = () => {
  const { hash } = useLocation();

  // Links like "/#how-it-works" (footer, other pages) should land on that
  // section. React Router doesn't do this by itself.
  useEffect(() => {
    if (!hash) return;
    const t = setTimeout(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 120);
    return () => clearTimeout(t);
  }, [hash]);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>AyurNutri | Ayurvedic diet planning for dietitians and patients</title>
        <meta
          name="description"
          content="Dosha assessment, AI-drafted weekly diet plans from a food library with both nutrient and Ayurvedic data, reviewed by a practitioner and followed day by day."
        />
        <link rel="canonical" href="/" />
      </Helmet>

      <Header />

      <main className="pt-16">
        <HeroSection />
        <FactsStrip />
        <HowItWorks />
        <FoodLibraryPreview />
        <Audience />
        <ClosingCta />
      </main>

      <Footer />
    </div>
  );
};

export default HomepageAyurNutriPlatform;
