// src/Routes.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import PageTransition from "components/PageTransition";
import Chatbot from "components/ui/Chatbot";
import NotFound from "pages/NotFound";

import HomepageAyurNutriPlatform from "./pages/homepage-ayur-nutri-platform";
import IntelligenceCenterPage from "./pages/ayurvedic-intelligence-center";
import PersonalWellnessHub from "./pages/personal-wellness-hub";
import ProfessionalDashboardPortal from "./pages/professional-dashboard-portal";
import DoctorWeekPlanner from "./pages/professional-dashboard-portal/components/DoctorWeekPlanner";
import DoctorDietBuilderPage from "./pages/professional-dashboard-portal/components/DoctorDietBuilderPage.jsx";
import PatientCaseProfile from "./pages/professional-dashboard-portal/PatientCaseProfile";

import SignInPage from "./pages/sign-in/SignInPage";
import SignInDoctor from "./pages/sign-in/SignInDoctor";
import SignupPatient from "./pages/sign-in/SignupPatient";
import SignupDoctor from "./pages/sign-in/SignupDoctor";
import ResetPassword from "./pages/sign-in/ResetPassword";
import ResetPasswordConfirm from "./pages/sign-in/ResetPasswordConfirm";
import AuthSelection from "./pages/auth-selection";

import FoodScan from "./pages/personal-wellness-hub/components/FoodScan";
import FoodScanResult from "./pages/personal-wellness-hub/components/FoodScanResult";

import RequirePatient from "./route/RequirePatient";
import RequireDoctor from "./route/RequireDoctor";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />

        <PageTransition>
          <Routes>
            {/* Public */}
            <Route path="/" element={<HomepageAyurNutriPlatform />} />
            <Route path="/ayurvedic-intelligence-center" element={<IntelligenceCenterPage />} />

            {/* Auth */}
            <Route path="/auth-selection" element={<AuthSelection />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signin/doctor" element={<SignInDoctor />} />
            <Route path="/signup" element={<SignupPatient />} />
            <Route path="/signup/doctor" element={<SignupDoctor />} />
            <Route path="/reset" element={<ResetPassword />} />
            <Route path="/reset/confirm" element={<ResetPasswordConfirm />} />

            {/* Patient-only */}
            <Route element={<RequirePatient />}>
              <Route path="/personal-wellness-hub" element={<PersonalWellnessHub />} />
              <Route path="/personal-wellness-hub/food-scan" element={<FoodScan />} />
              <Route path="/personal-wellness-hub/food-scan/result" element={<FoodScanResult />} />
            </Route>

            {/* Practitioner-only */}
            <Route element={<RequireDoctor />}>
              <Route path="/professional-dashboard-portal" element={<ProfessionalDashboardPortal />} />
              <Route path="/professional-dashboard-portal/patient/:patientId" element={<PatientCaseProfile />} />
              <Route path="/doctor/diet-builder/:patientId" element={<DoctorDietBuilderPage />} />
              <Route path="/doctor/week-planner/:patientId" element={<DoctorWeekPlanner />} />
            </Route>

            {/* Catch-all stays last */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTransition>

        {/* Inside the router so it can hide itself on sign-in screens */}
        <Chatbot />
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default AppRoutes;
