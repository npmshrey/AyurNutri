import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// Import all components
import WellnessOverview from './components/WellnessOverview';
import MealRecommendations from './components/MealRecommendations';
import ProgressTracking from './components/ProgressTracking';
import LearningModules from './components/LearningModules';
import CommunitySection from './components/CommunitySection';
import HealthIntegration from './components/HealthIntegration';
import QuickActions from './components/QuickActions';

const PersonalWellnessHub = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [currentLanguage, setCurrentLanguage] = useState('en');

  // Mock user data
  const userData = {
    name: "Priya Sharma",
    constitution: "Vata-Pitta",
    journeyDay: 45,
    wellnessScore: 78,
    profileImage: "https://randomuser.me/api/portraits/women/32.jpg"
  };

  const todaysRecommendations = {
    primaryMeal: "Kitchari with seasonal vegetables",
    keySpice: "Ginger for digestive fire",
    mindfulnessPractice: "5-minute breathing meditation",
    lifestyle: "Warm oil massage before shower"
  };

  useEffect(() => {
    // Check for saved language preference
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
    setCurrentLanguage(savedLanguage);
  }, []);

  const navigationSections = [
    { id: 'overview', label: 'Wellness Overview', icon: 'Home' },
    { id: 'meals', label: 'Meal Planning', icon: 'Utensils' },
    { id: 'progress', label: 'Progress Tracking', icon: 'TrendingUp' },
    { id: 'learning', label: 'Learning Modules', icon: 'BookOpen' },
    { id: 'community', label: 'Community Hub', icon: 'Users' },
    { id: 'integration', label: 'Health Integration', icon: 'Smartphone' },
    { id: 'actions', label: 'Quick Actions', icon: 'Zap' }
  ];

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'overview':
        return <WellnessOverview userData={userData} todaysRecommendations={todaysRecommendations} />;
      case 'meals':
        return <MealRecommendations />;
      case 'progress':
        return <ProgressTracking />;
      case 'learning':
        return <LearningModules />;
      case 'community':
        return <CommunitySection />;
      case 'integration':
        return <HealthIntegration />;
      case 'actions':
        return <QuickActions />;
      default:
        return <WellnessOverview userData={userData} todaysRecommendations={todaysRecommendations} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Personal Wellness Hub - AyurNutri Platform</title>
        <meta name="description" content="Your personalized Ayurvedic wellness dashboard with meal recommendations, progress tracking, and constitutional guidance." />
        <meta name="keywords" content="ayurveda, personal wellness, constitutional health, meal planning, progress tracking" />
      </Helmet>
      <Header />
      <Sidebar 
        isCollapsed={sidebarCollapsed} 
        onToggle={toggleSidebar}
      />
      <main className={`pt-16 organic-transition ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-72'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-display font-bold text-primary mb-2">
                  Personal Wellness Hub
                </h1>
                <p className="text-text-secondary">
                  Your personalized journey to constitutional balance and optimal health
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" iconName="Calendar">
                  Schedule Consultation
                </Button>
                <Button variant="default" size="sm" iconName="MessageCircle">
                  Ask Expert
                </Button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card rounded-lg p-4 text-center organic-shadow">
                <div className="text-2xl font-bold text-primary">45</div>
                <div className="text-sm text-text-secondary">Days Active</div>
              </div>
              <div className="bg-card rounded-lg p-4 text-center organic-shadow">
                <div className="text-2xl font-bold text-secondary">78%</div>
                <div className="text-sm text-text-secondary">Wellness Score</div>
              </div>
              <div className="bg-card rounded-lg p-4 text-center organic-shadow">
                <div className="text-2xl font-bold text-accent">12</div>
                <div className="text-sm text-text-secondary">Goals Achieved</div>
              </div>
              <div className="bg-card rounded-lg p-4 text-center organic-shadow">
                <div className="text-2xl font-bold text-primary">3.2kg</div>
                <div className="text-sm text-text-secondary">Progress Made</div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 bg-card rounded-xl p-2 organic-shadow">
              {navigationSections?.map((section) => (
                <button
                  key={section?.id}
                  onClick={() => setActiveSection(section?.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium organic-transition ${
                    activeSection === section?.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-text-secondary hover:text-primary hover:bg-muted/50'
                  }`}
                >
                  <Icon name={section?.icon} size={16} />
                  <span className="hidden sm:inline">{section?.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="mb-8">
            {renderActiveSection()}
          </div>

          {/* Emergency Contact */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Icon name="Phone" size={20} className="text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-800 mb-2">
                  24/7 Wellness Support
                </h3>
                <p className="text-sm text-red-700 mb-4">
                  Need immediate guidance on your wellness journey? Our certified Ayurvedic practitioners are available around the clock.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                    <Icon name="Phone" size={16} className="mr-2" />
                    Call Support: +1-800-AYUR-HELP
                  </Button>
                  <Button variant="outline" size="sm" className="border-red-300 text-red-700 hover:bg-red-50">
                    <Icon name="MessageCircle" size={16} className="mr-2" />
                    Live Chat
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <Button
          variant="default"
          size="lg"
          className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 elevated-shadow"
          iconName="Plus"
        />
      </div>
    </div>
  );
};

export default PersonalWellnessHub;