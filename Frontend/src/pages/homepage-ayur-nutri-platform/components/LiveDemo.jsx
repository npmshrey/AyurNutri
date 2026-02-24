import React from "react";
import Icon from "../../../components/AppIcon";

const LiveDemo = () => {
  return (
    <section className="py-5 bg-gradient-to-br from-background via-card/40 to-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ===================== SECTION 1 — ANCIENT WISDOM ===================== */}
        <div className="rounded-3xl bg-card border border-border shadow-md mb-16">

          <div className="bg-card/95 backdrop-blur-md rounded-[2.1rem] px-6 sm:px-10 lg:px-14 py-12 sm:py-16 text-center">

            <Icon name="Leaf" size={40} className="text-primary mx-auto mb-4" />

            <h3 className="text-3xl sm:text-4xl font-display font-bold text-text-primary mb-2">
              Ancient Wisdom
            </h3>

            <p className="text-sm uppercase tracking-wide text-text-secondary mb-6">
              Ayurvedic Constitutional Intelligence
            </p>

            <p className="text-base text-text-secondary max-w-3xl mx-auto mb-6">
              The platform is rooted in classical Ayurvedic principles of{" "}
              <span className="font-semibold">Prakriti (constitution)</span> and{" "}
              <span className="font-semibold">Dosha dynamics — Vata, Pitta, Kapha</span>.
              It interprets natural tendencies, digestion patterns, metabolism, and
              lifestyle traits using this ancient knowledge system.
            </p>

            <ul className="text-text-secondary text-base max-w-2xl mx-auto space-y-3 text-center list-none">
              <li>• Identifies Prakriti and Vikriti.</li>
              <li>• Converts Ayurvedic food qualities into structured logic.</li>
              <li>• Uses traditional insights to guide long-term diet and lifestyle choices.</li>
            </ul>

          </div>
        </div>

        {/* ===================== SECTION 2 — SCIENTIFIC PRECISION ===================== */}
        <div className="rounded-3xl bg-card border border-border shadow-md mb-16">

          <div className="bg-card/95 backdrop-blur-md rounded-[2.1rem] px-6 sm:px-10 lg:px-14 py-12 sm:py-16 text-center">

            <Icon name="BarChart3" size={40} className="text-secondary mx-auto mb-4" />

            <h3 className="text-3xl sm:text-4xl font-display font-bold text-text-primary mb-2">
              Scientific Precision
            </h3>

            <p className="text-sm uppercase tracking-wide text-text-secondary mb-6">
              Evidence-Based Nutritional Framework
            </p>

            <p className="text-base text-text-secondary max-w-3xl mx-auto mb-6">
              Modern nutritional science makes every recommendation measurable,
              trackable, and clinically aligned with the user’s physiology.
            </p>

            <ul className="text-text-secondary text-base max-w-2xl mx-auto space-y-3 text-center list-none">
              <li>• Estimates calorie needs and macronutrient distribution.</li>
              <li>• Tracks essential vitamins, minerals and potential imbalances.</li>
              <li>• Integrates biomarkers (glucose, lipids, vitamin levels) when available.</li>
              <li>• Maps food sensitivities using symptom-intake correlation.</li>
            </ul>

          </div>
        </div>

        {/* ===================== SECTION 3 — INTELLIGENT SYNTHESIS ===================== */}
        <div className="rounded-3xl bg-card border border-border shadow-md mb-16">

          <div className="bg-card/95 backdrop-blur-md rounded-[2.1rem] px-6 sm:px-10 lg:px-14 py-12 sm:py-16 text-center">

            <Icon name="Brain" size={40} className="text-accent mx-auto mb-4" />

            <h3 className="text-3xl sm:text-4xl font-display font-bold text-text-primary mb-2">
              Intelligent Synthesis
            </h3>

            <p className="text-sm uppercase tracking-wide text-text-secondary mb-6">
              AI-Powered Recommendation Engine
            </p>

            <p className="text-base text-text-secondary max-w-3xl mx-auto mb-6">
              The AI engine merges Ayurvedic logic with modern nutritional data
              to generate dynamic, personalized recommendations for meals, habits
              and wellness.
            </p>

            <ul className="text-text-secondary text-base max-w-2xl mx-auto space-y-3 text-center list-none">
              <li>• Combines Ayurvedic rules with data-driven nutrition analysis.</li>
              <li>• Generates personalized food lists and meal timing.</li>
              <li>• Adapts plans using feedback on digestion, energy, sleep and stress.</li>
              <li>• Provides transparent reasoning for each suggestion.</li>
            </ul>

          </div>
        </div>

      </div>
    </section>
  );
};

export default LiveDemo;
