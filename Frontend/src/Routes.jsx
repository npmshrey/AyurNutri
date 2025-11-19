import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import AyurvedicIntelligenceCenter from './pages/ayurvedic-intelligence-center';
import PersonalWellnessHub from './pages/personal-wellness-hub';
import HomepageAyurNutriPlatform from './pages/homepage-ayur-nutri-platform';
import PatientSuccessStories from './pages/patient-success-stories';
import ProfessionalDashboardPortal from './pages/professional-dashboard-portal';
import ClinicalResearchLibrary from './pages/clinical-research-library';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AyurvedicIntelligenceCenter />} />
        <Route path="/ayurvedic-intelligence-center" element={<AyurvedicIntelligenceCenter />} />
        <Route path="/personal-wellness-hub" element={<PersonalWellnessHub />} />
        <Route path="/homepage-ayur-nutri-platform" element={<HomepageAyurNutriPlatform />} />
        <Route path="/patient-success-stories" element={<PatientSuccessStories />} />
        <Route path="/professional-dashboard-portal" element={<ProfessionalDashboardPortal />} />
        <Route path="/clinical-research-library" element={<ClinicalResearchLibrary />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;