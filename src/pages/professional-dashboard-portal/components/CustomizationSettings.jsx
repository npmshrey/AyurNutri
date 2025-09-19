import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const CustomizationSettings = () => {
  const [activeTab, setActiveTab] = useState('treatment');

  const tabs = [
    { id: 'treatment', name: 'Treatment Preferences', icon: 'Stethoscope' },
    { id: 'cultural', name: 'Cultural Considerations', icon: 'Globe' },
    { id: 'integration', name: 'Integration Levels', icon: 'Layers' },
    { id: 'interface', name: 'Interface Settings', icon: 'Settings' }
  ];

  const [treatmentPreferences, setTreatmentPreferences] = useState({
    primaryApproach: 'balanced',
    doshaEmphasis: 'constitution',
    treatmentDuration: 'moderate',
    followUpFrequency: 'biweekly',
    planComplexity: 'moderate'
  });

  const [culturalSettings, setCulturalSettings] = useState({
    primaryCulture: 'mixed',
    dietaryRestrictions: ['vegetarian', 'gluten-free'],
    religiousConsiderations: true,
    languagePreferences: ['english', 'hindi'],
    familyInvolvement: 'moderate'
  });

  const [integrationLevels, setIntegrationLevels] = useState({
    conventionalMedicine: 'high',
    ayurvedicPrinciples: 'high',
    modernNutrition: 'high',
    labIntegration: true,
    medicationConsideration: true
  });

  const [interfaceSettings, setInterfaceSettings] = useState({
    dashboardLayout: 'comprehensive',
    informationDensity: 'moderate',
    chartPreferences: 'detailed',
    notificationLevel: 'important',
    mobileOptimization: true
  });

  const treatmentApproachOptions = [
    { value: 'traditional', label: 'Traditional Ayurvedic Focus' },
    { value: 'modern', label: 'Modern Nutrition Focus' },
    { value: 'balanced', label: 'Balanced Integration' },
    { value: 'evidence', label: 'Evidence-Based Priority' }
  ];

  const doshaEmphasisOptions = [
    { value: 'constitution', label: 'Constitutional Balance' },
    { value: 'imbalance', label: 'Current Imbalances' },
    { value: 'seasonal', label: 'Seasonal Adjustments' },
    { value: 'condition', label: 'Condition-Specific' }
  ];

  const durationOptions = [
    { value: 'short', label: 'Short-term (4-8 weeks)' },
    { value: 'moderate', label: 'Moderate (8-16 weeks)' },
    { value: 'long', label: 'Long-term (16+ weeks)' },
    { value: 'flexible', label: 'Flexible Duration' }
  ];

  const followUpOptions = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'asneeded', label: 'As Needed' }
  ];

  const complexityOptions = [
    { value: 'simple', label: 'Simple Plans' },
    { value: 'moderate', label: 'Moderate Complexity' },
    { value: 'detailed', label: 'Detailed Plans' },
    { value: 'comprehensive', label: 'Comprehensive Plans' }
  ];

  const cultureOptions = [
    { value: 'indian', label: 'Indian/South Asian' },
    { value: 'western', label: 'Western' },
    { value: 'mixed', label: 'Mixed Cultural Background' },
    { value: 'other', label: 'Other' }
  ];

  const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'sanskrit', label: 'Sanskrit Terms' },
    { value: 'spanish', label: 'Spanish' }
  ];

  const integrationLevelOptions = [
    { value: 'low', label: 'Low Integration' },
    { value: 'moderate', label: 'Moderate Integration' },
    { value: 'high', label: 'High Integration' },
    { value: 'complete', label: 'Complete Integration' }
  ];

  const layoutOptions = [
    { value: 'minimal', label: 'Minimal Dashboard' },
    { value: 'standard', label: 'Standard Layout' },
    { value: 'comprehensive', label: 'Comprehensive View' },
    { value: 'custom', label: 'Custom Layout' }
  ];

  const densityOptions = [
    { value: 'compact', label: 'Compact' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'spacious', label: 'Spacious' }
  ];

  const notificationOptions = [
    { value: 'minimal', label: 'Critical Only' },
    { value: 'important', label: 'Important Updates' },
    { value: 'all', label: 'All Notifications' },
    { value: 'custom', label: 'Custom Settings' }
  ];

  const renderTreatmentPreferences = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Primary Treatment Approach"
          description="Your preferred balance between traditional and modern approaches"
          options={treatmentApproachOptions}
          value={treatmentPreferences?.primaryApproach}
          onChange={(value) => setTreatmentPreferences(prev => ({ ...prev, primaryApproach: value }))}
        />
        <Select
          label="Dosha Assessment Emphasis"
          description="How to prioritize dosha considerations in treatment"
          options={doshaEmphasisOptions}
          value={treatmentPreferences?.doshaEmphasis}
          onChange={(value) => setTreatmentPreferences(prev => ({ ...prev, doshaEmphasis: value }))}
        />
        <Select
          label="Typical Treatment Duration"
          description="Default duration for treatment plans"
          options={durationOptions}
          value={treatmentPreferences?.treatmentDuration}
          onChange={(value) => setTreatmentPreferences(prev => ({ ...prev, treatmentDuration: value }))}
        />
        <Select
          label="Follow-up Frequency"
          description="Preferred frequency for patient follow-ups"
          options={followUpOptions}
          value={treatmentPreferences?.followUpFrequency}
          onChange={(value) => setTreatmentPreferences(prev => ({ ...prev, followUpFrequency: value }))}
        />
      </div>
      
      <Select
        label="Plan Complexity Level"
        description="Default complexity level for nutrition plans"
        options={complexityOptions}
        value={treatmentPreferences?.planComplexity}
        onChange={(value) => setTreatmentPreferences(prev => ({ ...prev, planComplexity: value }))}
      />
    </div>
  );

  const renderCulturalConsiderations = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Primary Cultural Context"
          description="Main cultural background of your patient population"
          options={cultureOptions}
          value={culturalSettings?.primaryCulture}
          onChange={(value) => setCulturalSettings(prev => ({ ...prev, primaryCulture: value }))}
        />
        <Select
          label="Language Preferences"
          description="Languages to include in patient materials"
          options={languageOptions}
          value={culturalSettings?.languagePreferences?.[0] || ''}
          onChange={(value) => setCulturalSettings(prev => ({ 
            ...prev, 
            languagePreferences: [value, ...prev?.languagePreferences?.slice(1)] 
          }))}
          multiple
        />
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-text-primary">Common Dietary Restrictions</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher', 'jain', 'diabetic']?.map((restriction) => (
            <Checkbox
              key={restriction}
              label={restriction?.charAt(0)?.toUpperCase() + restriction?.slice(1)}
              checked={culturalSettings?.dietaryRestrictions?.includes(restriction)}
              onChange={(e) => {
                if (e?.target?.checked) {
                  setCulturalSettings(prev => ({
                    ...prev,
                    dietaryRestrictions: [...prev?.dietaryRestrictions, restriction]
                  }));
                } else {
                  setCulturalSettings(prev => ({
                    ...prev,
                    dietaryRestrictions: prev?.dietaryRestrictions?.filter(r => r !== restriction)
                  }));
                }
              }}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-text-primary">Additional Considerations</h4>
        <div className="space-y-3">
          <Checkbox
            label="Include religious and spiritual considerations in treatment plans"
            checked={culturalSettings?.religiousConsiderations}
            onChange={(e) => setCulturalSettings(prev => ({ 
              ...prev, 
              religiousConsiderations: e?.target?.checked 
            }))}
          />
        </div>
      </div>
    </div>
  );

  const renderIntegrationLevels = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Conventional Medicine Integration"
          description="Level of integration with conventional medical practices"
          options={integrationLevelOptions}
          value={integrationLevels?.conventionalMedicine}
          onChange={(value) => setIntegrationLevels(prev => ({ ...prev, conventionalMedicine: value }))}
        />
        <Select
          label="Ayurvedic Principles Emphasis"
          description="How prominently to feature traditional Ayurvedic concepts"
          options={integrationLevelOptions}
          value={integrationLevels?.ayurvedicPrinciples}
          onChange={(value) => setIntegrationLevels(prev => ({ ...prev, ayurvedicPrinciples: value }))}
        />
        <Select
          label="Modern Nutrition Science"
          description="Integration level of contemporary nutritional research"
          options={integrationLevelOptions}
          value={integrationLevels?.modernNutrition}
          onChange={(value) => setIntegrationLevels(prev => ({ ...prev, modernNutrition: value }))}
        />
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-text-primary">Clinical Integration Features</h4>
        <div className="space-y-3">
          <Checkbox
            label="Integrate with laboratory results and biomarkers"
            description="Automatically incorporate lab values into treatment recommendations"
            checked={integrationLevels?.labIntegration}
            onChange={(e) => setIntegrationLevels(prev => ({ 
              ...prev, 
              labIntegration: e?.target?.checked 
            }))}
          />
          <Checkbox
            label="Consider current medications and supplements"
            description="Check for interactions and complementary effects"
            checked={integrationLevels?.medicationConsideration}
            onChange={(e) => setIntegrationLevels(prev => ({ 
              ...prev, 
              medicationConsideration: e?.target?.checked 
            }))}
          />
        </div>
      </div>
    </div>
  );

  const renderInterfaceSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Dashboard Layout"
          description="Choose your preferred dashboard organization"
          options={layoutOptions}
          value={interfaceSettings?.dashboardLayout}
          onChange={(value) => setInterfaceSettings(prev => ({ ...prev, dashboardLayout: value }))}
        />
        <Select
          label="Information Density"
          description="How much information to display at once"
          options={densityOptions}
          value={interfaceSettings?.informationDensity}
          onChange={(value) => setInterfaceSettings(prev => ({ ...prev, informationDensity: value }))}
        />
        <Select
          label="Chart and Graph Preferences"
          description="Default detail level for data visualizations"
          options={complexityOptions}
          value={interfaceSettings?.chartPreferences}
          onChange={(value) => setInterfaceSettings(prev => ({ ...prev, chartPreferences: value }))}
        />
        <Select
          label="Notification Level"
          description="Types of notifications you want to receive"
          options={notificationOptions}
          value={interfaceSettings?.notificationLevel}
          onChange={(value) => setInterfaceSettings(prev => ({ ...prev, notificationLevel: value }))}
        />
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-text-primary">Device Optimization</h4>
        <div className="space-y-3">
          <Checkbox
            label="Optimize interface for mobile consultations"
            description="Adjust layout and controls for tablet and mobile use during patient visits"
            checked={interfaceSettings?.mobileOptimization}
            onChange={(e) => setInterfaceSettings(prev => ({ 
              ...prev, 
              mobileOptimization: e?.target?.checked 
            }))}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-primary">Customization Settings</h2>
          <p className="text-text-secondary">Personalize your practice preferences and interface</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" iconName="RotateCcw">
            Reset to Defaults
          </Button>
          <Button variant="default" iconName="Save">
            Save Settings
          </Button>
        </div>
      </div>
      {/* Settings Tabs */}
      <div className="bg-card rounded-lg border border-border organic-shadow">
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6" aria-label="Settings tabs">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm organic-transition ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'treatment' && renderTreatmentPreferences()}
          {activeTab === 'cultural' && renderCulturalConsiderations()}
          {activeTab === 'integration' && renderIntegrationLevels()}
          {activeTab === 'interface' && renderInterfaceSettings()}
        </div>
      </div>
      {/* Settings Preview */}
      <div className="bg-card rounded-lg border border-border organic-shadow">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-text-primary">Settings Preview</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3 bg-muted/30 rounded-lg">
              <h4 className="font-medium text-text-primary mb-2">Treatment Approach</h4>
              <p className="text-sm text-text-secondary">
                {treatmentApproachOptions?.find(opt => opt?.value === treatmentPreferences?.primaryApproach)?.label}
              </p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <h4 className="font-medium text-text-primary mb-2">Cultural Context</h4>
              <p className="text-sm text-text-secondary">
                {cultureOptions?.find(opt => opt?.value === culturalSettings?.primaryCulture)?.label}
              </p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <h4 className="font-medium text-text-primary mb-2">Integration Level</h4>
              <p className="text-sm text-text-secondary">
                Conventional: {integrationLevels?.conventionalMedicine}, Ayurvedic: {integrationLevels?.ayurvedicPrinciples}
              </p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <h4 className="font-medium text-text-primary mb-2">Interface</h4>
              <p className="text-sm text-text-secondary">
                {layoutOptions?.find(opt => opt?.value === interfaceSettings?.dashboardLayout)?.label}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizationSettings;