import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";
import vataImg from "../../../assets/vata.jpg"; // ⭐ Only image we keep

const HeroSection = () => {
  const [currentAnimation, setCurrentAnimation] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const animationSteps = [
    { icon: "Wind", label: "Vata", color: "text-blue-600" },
    { icon: "Flame", label: "Pitta", color: "text-red-600" },
    { icon: "Mountain", label: "Kapha", color: "text-green-600" },
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentAnimation((prev) => (prev + 1) % animationSteps.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-background via-muted/30 to-brand-cream overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <defs>
            <pattern id="organic-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="2" fill="currentColor" className="text-primary" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#organic-pattern)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">

          {/* LEFT SIDE CONTENT */}
          <div
            className={`space-y-8 transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                <Icon name="Sparkles" size={16} />
                <span>Pioneering Ayurvedic-Nutrition Intelligence</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-text-primary leading-tight">
                Where Ancient Wisdom
                <span className="block text-primary">Meets Modern</span>
                <span className="block text-secondary">Precision</span>
              </h1>

              <p className="text-lg sm:text-xl text-text-secondary leading-relaxed max-w-2xl">
                The world's first comprehensive platform bridging 5,000-year-old
                Ayurvedic principles with cutting-edge nutritional science.
                Generate personalized diet plans that honor both clinical
                requirements and constitutional balance.
              </p>
            </div>

            {/* Live Transformation Card */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">Live Transformation</h3>
                <div className="flex space-x-2">
                  {animationSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentAnimation ? "bg-primary" : "bg-border"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-full bg-primary/10 ${animationSteps[currentAnimation].color}`}>
                    <Icon name={animationSteps[currentAnimation].icon} size={24} />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{animationSteps[currentAnimation].label} Constitution</p>
                    <p className="text-sm text-text-secondary">Ayurvedic Assessment</p>
                  </div>
                </div>

                <Icon name="ArrowRight" size={20} className="text-text-secondary animate-pulse" />

                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-full bg-secondary/10">
                    <Icon name="BarChart3" size={24} className="text-secondary" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">Personalized Plan</p>
                    <p className="text-sm text-text-secondary">Nutritional Precision</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA BTN */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="default"
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg"
                iconName="Stethoscope"
                iconPosition="left"
              >
                Watch Demo
              </Button>
            </div>
          </div>

          {/* RIGHT SIDE — ONLY IMAGE */}
          <div
            className={`relative transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
          >
            <img
              src={vataImg}
              alt="Vata Pitta Kapha"
              className="w-full h-auto object-contain"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
