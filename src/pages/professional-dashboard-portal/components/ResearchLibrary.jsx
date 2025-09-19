import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ResearchLibrary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState('');

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'ayurveda', label: 'Ayurvedic Medicine' },
    { value: 'nutrition', label: 'Clinical Nutrition' },
    { value: 'integration', label: 'Integrative Medicine' },
    { value: 'pharmacology', label: 'Herbal Pharmacology' },
    { value: 'metabolism', label: 'Metabolic Health' }
  ];

  const patientOptions = [
    { value: '', label: 'Select Patient for Relevant Studies' },
    { value: 'sarah-johnson', label: 'Sarah Johnson (Digestive Issues)' },
    { value: 'michael-chen', label: 'Michael Chen (Weight Management)' },
    { value: 'emma-davis', label: 'Emma Davis (Stress & Anxiety)' },
    { value: 'robert-wilson', label: 'Robert Wilson (Joint Health)' }
  ];

  const researchStudies = [
    {
      id: 1,
      title: "Efficacy of Personalized Ayurvedic Nutrition in Managing Type 2 Diabetes: A Randomized Controlled Trial",
      authors: ["Dr. Rajesh Sharma", "Dr. Priya Nair", "Dr. Michael Thompson"],
      journal: "Journal of Integrative Medicine",
      year: 2024,
      category: "ayurveda",
      relevantConditions: ["Metabolic Health", "Weight Management"],
      abstract: `This 12-week randomized controlled trial examined the effectiveness of personalized Ayurvedic nutrition plans based on individual dosha constitution in managing Type 2 diabetes. 180 participants were randomly assigned to either personalized Ayurvedic nutrition (n=90) or standard dietary counseling (n=90). The Ayurvedic group showed significant improvements in HbA1c levels (-1.2% vs -0.4%, p<0.001), fasting glucose (-28.5 mg/dL vs -12.3 mg/dL, p<0.001), and quality of life scores. The study demonstrates the potential of constitutional-based nutrition therapy in diabetes management.`,
      keyFindings: [
        "1.2% greater reduction in HbA1c compared to standard care",
        "Significant improvement in insulin sensitivity",
        "Better patient adherence (87% vs 62%)",
        "Reduced medication requirements in 45% of participants"
      ],
      citationCount: 23,
      impactFactor: 4.2,
      openAccess: true,
      relevantToCurrentPatients: ["michael-chen"],
      tags: ["diabetes", "personalized nutrition", "dosha", "clinical trial"]
    },
    {
      id: 2,
      title: "Ayurvedic Dietary Principles and Gut Microbiome Diversity: A Cross-Sectional Analysis",
      authors: ["Dr. Sarah Mitchell", "Dr. Lisa Chen", "Dr. David Kumar"],
      journal: "Microbiome Research",
      year: 2024,
      category: "nutrition",
      relevantConditions: ["Digestive Issues"],
      abstract: `This cross-sectional study analyzed the relationship between adherence to Ayurvedic dietary principles and gut microbiome diversity in 250 healthy adults. Participants following Ayurvedic dietary guidelines showed significantly higher microbial diversity (Shannon index: 4.2 vs 3.6, p<0.001) and beneficial bacterial populations. The study provides scientific validation for traditional Ayurvedic food combining principles and their impact on digestive health.`,
      keyFindings: [
        "17% higher gut microbiome diversity",
        "Increased beneficial Bifidobacterium species",
        "Lower inflammatory markers",
        "Better digestive symptom scores"
      ],
      citationCount: 18,
      impactFactor: 5.8,
      openAccess: false,
      relevantToCurrentPatients: ["sarah-johnson"],
      tags: ["microbiome", "digestive health", "food combining", "ayurvedic diet"]
    },
    {
      id: 3,
      title: "Seasonal Nutrition Adaptation Based on Ayurvedic Principles: Effects on Circadian Rhythms and Metabolic Health",
      authors: ["Dr. Priya Nair", "Dr. Robert Anderson", "Dr. Emma Thompson"],
      journal: "Chronobiology International",
      year: 2023,
      category: "integration",
      relevantConditions: ["Sleep Disorders", "Metabolic Health"],
      abstract: `A 6-month longitudinal study investigating the effects of seasonal dietary modifications based on Ayurvedic principles on circadian rhythms and metabolic parameters. 120 participants adapted their diets according to seasonal dosha variations. Results showed improved sleep quality, better metabolic flexibility, and enhanced circadian rhythm stability compared to controls following static dietary patterns.`,
      keyFindings: [
        "23% improvement in sleep quality scores",
        "Better metabolic flexibility markers",
        "Improved circadian rhythm stability",
        "Reduced seasonal affective symptoms"
      ],
      citationCount: 31,
      impactFactor: 3.9,
      openAccess: true,
      relevantToCurrentPatients: ["emma-davis"],
      tags: ["seasonal nutrition", "circadian rhythms", "sleep", "metabolic health"]
    },
    {
      id: 4,
      title: "Anti-inflammatory Effects of Traditional Ayurvedic Spice Combinations: A Systematic Review and Meta-Analysis",
      authors: ["Dr. Michael Thompson", "Dr. Rajesh Sharma", "Dr. Lisa Chen"],
      journal: "Phytotherapy Research",
      year: 2023,
      category: "pharmacology",
      relevantConditions: ["Joint Health", "Stress & Anxiety"],
      abstract: `This systematic review and meta-analysis examined 24 randomized controlled trials investigating the anti-inflammatory effects of traditional Ayurvedic spice combinations. The analysis included 1,847 participants across various inflammatory conditions. Results demonstrated significant reductions in inflammatory markers (CRP, IL-6, TNF-α) and improved clinical outcomes in arthritis, digestive inflammation, and stress-related conditions.`,
      keyFindings: [
        "Significant reduction in inflammatory markers",
        "Improved joint pain scores in arthritis patients",
        "Better stress resilience markers",
        "Minimal adverse effects reported"
      ],
      citationCount: 42,
      impactFactor: 4.6,
      openAccess: false,
      relevantToCurrentPatients: ["robert-wilson"],
      tags: ["anti-inflammatory", "spices", "arthritis", "systematic review"]
    },
    {
      id: 5,
      title: "Personalized Nutrition Based on Ayurvedic Constitution: A Pilot Study on Weight Management Outcomes",
      authors: ["Dr. Sarah Mitchell", "Dr. David Kumar", "Dr. Priya Nair"],
      journal: "Obesity Medicine",
      year: 2024,
      category: "nutrition",
      relevantConditions: ["Weight Management"],
      abstract: `A 16-week pilot study evaluating the effectiveness of constitution-based nutrition plans for weight management. 60 overweight participants received personalized meal plans based on their predominant dosha. The intervention group achieved greater weight loss, improved body composition, and better long-term adherence compared to standard calorie-restricted diets.`,
      keyFindings: [
        "2.3x greater weight loss than control group",
        "Improved body composition metrics",
        "Higher long-term adherence rates",
        "Better metabolic health markers"
      ],
      citationCount: 15,
      impactFactor: 3.2,
      openAccess: true,
      relevantToCurrentPatients: ["michael-chen"],
      tags: ["weight management", "personalized nutrition", "body composition", "adherence"]
    }
  ];

  const citationTemplates = [
    {
      style: "APA",
      example: "Sharma, R., Nair, P., & Thompson, M. (2024). Efficacy of Personalized Ayurvedic Nutrition in Managing Type 2 Diabetes: A Randomized Controlled Trial. Journal of Integrative Medicine, 15(3), 234-248."
    },
    {
      style: "MLA",
      example: "Sharma, Rajesh, et al. \"Efficacy of Personalized Ayurvedic Nutrition in Managing Type 2 Diabetes: A Randomized Controlled Trial.\" Journal of Integrative Medicine, vol. 15, no. 3, 2024, pp. 234-248."
    },
    {
      style: "Chicago",
      example: "Sharma, Rajesh, Priya Nair, and Michael Thompson. \"Efficacy of Personalized Ayurvedic Nutrition in Managing Type 2 Diabetes: A Randomized Controlled Trial.\" Journal of Integrative Medicine 15, no. 3 (2024): 234-248."
    }
  ];

  const filteredStudies = researchStudies?.filter(study => {
    const matchesSearch = study?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                         study?.authors?.some(author => author?.toLowerCase()?.includes(searchTerm?.toLowerCase())) ||
                         study?.tags?.some(tag => tag?.toLowerCase()?.includes(searchTerm?.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || study?.category === selectedCategory;
    const matchesPatient = !selectedPatient || study?.relevantToCurrentPatients?.includes(selectedPatient);
    
    return matchesSearch && matchesCategory && matchesPatient;
  });

  const getRelevanceScore = (study) => {
    if (selectedPatient && study?.relevantToCurrentPatients?.includes(selectedPatient)) {
      return "High Relevance";
    }
    return "General Interest";
  };

  const getRelevanceColor = (relevance) => {
    return relevance === "High Relevance" ? "bg-success/10 text-success" : "bg-primary/10 text-primary";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-primary">Research Library</h2>
          <p className="text-text-secondary">Evidence-based studies relevant to your practice</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" iconName="Bookmark">
            Saved Studies
          </Button>
          <Button variant="default" iconName="Plus">
            Submit Research
          </Button>
        </div>
      </div>
      {/* Search and Filters */}
      <div className="bg-card rounded-lg p-4 border border-border organic-shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="search"
            placeholder="Search studies, authors, keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
          />
          <Select
            options={categoryOptions}
            value={selectedCategory}
            onChange={setSelectedCategory}
            placeholder="Filter by category"
          />
          <Select
            options={patientOptions}
            value={selectedPatient}
            onChange={setSelectedPatient}
            placeholder="Show relevant to patient"
          />
        </div>
      </div>
      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-text-secondary">
          Showing {filteredStudies?.length} of {researchStudies?.length} studies
        </p>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" iconName="Filter">
            Advanced Filters
          </Button>
          <Button variant="ghost" size="sm" iconName="ArrowUpDown">
            Sort by Relevance
          </Button>
        </div>
      </div>
      {/* Research Studies */}
      <div className="space-y-4">
        {filteredStudies?.map((study) => (
          <div key={study?.id} className="bg-card rounded-lg border border-border organic-shadow">
            <div className="p-6">
              {/* Study Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-text-primary leading-tight">
                      {study?.title}
                    </h3>
                    {study?.openAccess && (
                      <span className="text-xs px-2 py-1 bg-success/10 text-success rounded">
                        Open Access
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-text-secondary mb-2">
                    <span>{study?.authors?.join(", ")}</span>
                    <span>•</span>
                    <span>{study?.journal} ({study?.year})</span>
                    <span>•</span>
                    <span>Impact Factor: {study?.impactFactor}</span>
                    <span>•</span>
                    <span>{study?.citationCount} citations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs px-2 py-1 rounded ${getRelevanceColor(getRelevanceScore(study))}`}>
                      {getRelevanceScore(study)}
                    </span>
                    {study?.relevantConditions?.map((condition) => (
                      <span key={condition} className="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded">
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  <Button variant="ghost" size="sm" iconName="Bookmark">
                    Save
                  </Button>
                  <Button variant="ghost" size="sm" iconName="Share">
                    Share
                  </Button>
                  <Button variant="ghost" size="sm" iconName="Quote">
                    Cite
                  </Button>
                </div>
              </div>

              {/* Abstract */}
              <div className="mb-4">
                <h4 className="font-medium text-text-primary mb-2">Abstract</h4>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {study?.abstract}
                </p>
              </div>

              {/* Key Findings */}
              <div className="mb-4">
                <h4 className="font-medium text-text-primary mb-2">Key Findings</h4>
                <ul className="space-y-1">
                  {study?.keyFindings?.map((finding, index) => (
                    <li key={index} className="text-sm text-text-secondary flex items-start">
                      <Icon name="CheckCircle" size={14} className="text-success mr-2 mt-0.5 flex-shrink-0" />
                      {finding}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags and Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex flex-wrap gap-1">
                  {study?.tags?.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 bg-muted text-text-secondary rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" iconName="ExternalLink">
                    View Full Text
                  </Button>
                  <Button variant="default" size="sm" iconName="FileText">
                    Add to Documentation
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Citation Tools */}
      <div className="bg-card rounded-lg border border-border organic-shadow">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-text-primary">Citation Tools</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {citationTemplates?.map((template) => (
              <div key={template?.style} className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-text-primary">{template?.style} Style</h4>
                  <Button variant="ghost" size="sm" iconName="Copy">
                    Copy
                  </Button>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {template?.example}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchLibrary;