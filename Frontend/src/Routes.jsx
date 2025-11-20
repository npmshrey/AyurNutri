import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";

import AyurvedicIntelligenceCenter from './pages/ayurvedic-intelligence-center';
import PersonalWellnessHub from './pages/personal-wellness-hub';
import HomepageAyurNutriPlatform from './pages/homepage-ayur-nutri-platform';
import ProfessionalDashboardPortal from './pages/professional-dashboard-portal';

import ClinicalResearchLibrary from './pages/clinical-research-library';
import FoodScanResult from "./pages/personal-wellness-hub/components/FoodScanResult";
import FoodScan from "./pages/personal-wellness-hub/components/FoodScan";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          <Route path="/" element={<AyurvedicIntelligenceCenter />} />
          <Route path="/ayurvedic-intelligence-center" element={<AyurvedicIntelligenceCenter />} />
          <Route path="/personal-wellness-hub" element={<PersonalWellnessHub />} />
          <Route path="/homepage-ayur-nutri-platform" element={<HomepageAyurNutriPlatform />} />
          <Route path="/professional-dashboard-portal" element={<ProfessionalDashboardPortal />} />

          <Route path="/clinical-research-library" element={<ClinicalResearchLibrary />} />
          <Route path="/personal-wellness-hub/food-result" element={<FoodScanResult />} />
          <Route path="/personal-wellness-hub/food-scan" element={<FoodScan />} />

          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
