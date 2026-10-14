// Standalone "Learn Ayurveda" page. Wraps the same learning area the
// Wellness Hub embeds, with the site header and footer around it.
import React from "react";
import { Helmet } from "react-helmet";
import Header from "../../components/ui/Header";
import Footer from "../homepage-ayur-nutri-platform/components/Footer";
import IntelligenceCenterDashboard from "./IntelligenceCenterDashboard";

const IntelligenceCenterPage = () => (
  <div className="min-h-screen bg-background">
    <Helmet>
      <title>Learn Ayurveda — AyurNutri</title>
    </Helmet>
    <Header />
    <main className="page-container pt-24">
      <IntelligenceCenterDashboard />
    </main>
    <Footer />
  </div>
);

export default IntelligenceCenterPage;
