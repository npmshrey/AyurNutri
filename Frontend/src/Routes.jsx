// import React from "react";
// import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
// import ScrollToTop from "components/ScrollToTop";
// import ErrorBoundary from "components/ErrorBoundary";
// import NotFound from "pages/NotFound";
// import AyurvedicIntelligenceCenter from './pages/ayurvedic-intelligence-center';
// import PersonalWellnessHub from './pages/personal-wellness-hub';
// import HomepageAyurNutriPlatform from './pages/homepage-ayur-nutri-platform';
// // import PatientSuccessStories from './pages/patient-success-stories';
// import ProfessionalDashboardPortal from './pages/professional-dashboard-portal';
// // import ClinicalResearchLibrary from './pages/clinical-research-library';

// const Routes = () => {
//   return (
//     <BrowserRouter>
//       <ErrorBoundary>
//       <ScrollToTop />
//       <RouterRoutes>
//         {/* Define your route here */}
//         <Route path="/" element={<AyurvedicIntelligenceCenter />} />
//         <Route path="/ayurvedic-intelligence-center" element={<AyurvedicIntelligenceCenter />} />
//         <Route path="/personal-wellness-hub" element={<PersonalWellnessHub />} />
//         <Route path="/homepage-ayur-nutri-platform" element={<HomepageAyurNutriPlatform />} />
//         {/* <Route path="/patient-success-stories" element={<PatientSuccessStories />} /> */}
//         <Route path="/professional-dashboard-portal" element={<ProfessionalDashboardPortal />} />
//         {/* <Route path="/clinical-research-library" element={<ClinicalResearchLibrary />} /> */}
//         <Route path="*" element={<NotFound />} />
//       </RouterRoutes>
//       </ErrorBoundary>
//     </BrowserRouter>
//   );
// };

// export default Routes;





// src/Routes.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";

import AyurvedicIntelligenceCenter from './pages/ayurvedic-intelligence-center';
import PersonalWellnessHub from './pages/personal-wellness-hub';
import HomepageAyurNutriPlatform from './pages/homepage-ayur-nutri-platform';
import ProfessionalDashboardPortal from './pages/professional-dashboard-portal';

import SignInPage from "./pages/sign-in/SignInPage";
import SignupPatient from "./pages/sign-in/SignupPatient";
import SignupDoctor from "./pages/sign-in/SignupDoctor";
import ResetPassword from "./pages/sign-in/ResetPassword";

import ClinicalResearchLibrary from './pages/clinical-research-library';
// import FoodScanResult from "./pages/personal-wellness-hub/components/FoodScanResult";
// import FoodScan from "./pages/personal-wellness-hub/components/FoodScan";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <Routes>
          {/* Auth */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignupPatient />} />
          <Route path="/signup/doctor" element={<SignupDoctor />} />
          <Route path="/reset" element={<ResetPassword />} />

          {/* Main */}
          <Route path="/" element={<HomepageAyurNutriPlatform  />} />
          <Route path="/ayurvedic-intelligence-center" element={<AyurvedicIntelligenceCenter />} />
          <Route path="/personal-wellness-hub" element={<PersonalWellnessHub />} />
          <Route path="/homepage-ayur-nutri-platform" element={<HomepageAyurNutriPlatform />} />
          <Route path="/professional-dashboard-portal" element={<ProfessionalDashboardPortal />} />

          <Route path="/clinical-research-library" element={<ClinicalResearchLibrary />} />
          {/* <Route path="/personal-wellness-hub/food-result" element={<FoodScanResult />} />
          <Route path="/personal-wellness-hub/food-scan" element={<FoodScan />} /> */}

          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default AppRoutes;