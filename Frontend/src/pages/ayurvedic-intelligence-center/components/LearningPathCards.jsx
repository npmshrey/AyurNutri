import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

// Reading guides grouped by level. These are topic outlines, not courses:
// there are no lessons, durations or downloads behind them, so the cards
// only list what each path covers.
const LEARNING_PATHS = [
  {
    id: 'fundamentals',
    title: 'Ayurveda Fundamentals',
    subtitle: 'For anyone new to Ayurvedic principles',
    description:
      'The foundational concepts of Ayurveda: the three doshas, the five elements and basic constitutional theory.',
    level: 'Beginner',
    icon: 'BookOpen',
    color: '#87A96B',
    topics: [
      'Introduction to Ayurveda',
      'The Three Doshas Explained',
      'Five Elements Theory',
      'Constitutional Assessment',
      'Basic Food Guidelines',
      'Seasonal Living',
      'Daily Routines (Dinacharya)',
      'Mind-Body Connection'
    ],
    benefits: [
      'Understand your constitution',
      'Learn basic food compatibility',
      'Set up a daily routine',
      'Recognise signs of imbalance'
    ]
  },
  {
    id: 'clinical',
    title: 'Clinical Integration',
    subtitle: 'For healthcare professionals',
    description:
      'How Ayurvedic dietary principles fit alongside clinical practice, from patient assessment to documentation.',
    level: 'Professional',
    icon: 'Stethoscope',
    color: '#D4AF37',
    topics: [
      'Evidence-Based Ayurveda',
      'Patient Assessment Protocols',
      'Integrative Treatment Plans',
      'Herb-Drug Interactions',
      'Clinical Case Studies',
      'Documentation Standards',
      'Patient Communication',
      'Regulatory Considerations',
      'Research Methodologies',
      'Outcome Measurement',
      'Continuing Education',
      'Professional Ethics'
    ],
    benefits: [
      'Plan diets around a patient assessment',
      'Spot herb-drug interaction risks',
      'Keep clear clinical records',
      'Explain plans to patients'
    ]
  },
  {
    id: 'advanced',
    title: 'Advanced Concepts',
    subtitle: 'Rasa, Virya, Guna and Vipaka in depth',
    description:
      'The principles that describe food energetics and how they are applied in personalised nutrition.',
    level: 'Advanced',
    icon: 'Brain',
    color: '#2D5016',
    topics: [
      'Rasa (Six Tastes)',
      'Virya (Potency) Applications',
      'Guna (Qualities) Analysis',
      'Vipaka (Post-Digestive Effect)',
      'Prabhava (Special Effects)',
      'Food Combining Principles',
      'Therapeutic Cooking',
      'Seasonal Adjustments',
      'Constitutional Variations',
      'Disease-Specific Protocols',
      'Advanced Assessment Tools',
      'Research Applications',
      'Teaching Methodologies',
      'Case Study Analysis',
      'Integration Strategies',
      'Future Developments'
    ],
    benefits: [
      'Read food energetics from a food record',
      'Build more precise meal plans',
      'Understand subtle food effects',
      'Teach the concepts to others'
    ]
  }
];

const LearningPathCards = () => {
  const [selectedPath, setSelectedPath] = useState(null);

  const togglePath = (pathId) => {
    setSelectedPath(selectedPath === pathId ? null : pathId);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-semibold text-primary mb-3">
          Learning Paths
        </h2>
        <p className="text-text-secondary max-w-3xl mx-auto">
          Three reading outlines, from first principles to clinical use. Open a path to see the
          topics it covers.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {LEARNING_PATHS.map((path) => {
          const open = selectedPath === path.id;
          return (
            <div
              key={path.id}
              className={`bg-background rounded-xl organic-shadow organic-transition ${
                open ? 'elevated-shadow' : 'hover:elevated-shadow'
              }`}
            >
              <button
                type="button"
                onClick={() => togglePath(path.id)}
                aria-expanded={open}
                className="w-full text-left p-6 border-b border-border"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${path.color}20` }}
                  >
                    <Icon name={path.icon} size={24} style={{ color: path.color }} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                      path.level === 'Beginner' ? 'bg-success/20 text-success' :
                      path.level === 'Professional' ? 'bg-warning/20 text-warning' : 'bg-primary/20 text-primary'
                    }`}>
                      {path.level}
                    </span>
                    <Icon
                      name={open ? 'ChevronUp' : 'ChevronDown'}
                      size={16}
                      className="text-text-secondary"
                    />
                  </div>
                </div>

                <h3 className="text-xl font-display font-semibold text-primary mb-2">
                  {path.title}
                </h3>
                <p className="text-sm text-text-secondary mb-4">{path.subtitle}</p>
                <p className="text-text-secondary mb-4">{path.description}</p>

                <div className="flex items-center space-x-1 text-sm text-text-secondary">
                  <Icon name="BookOpen" size={14} />
                  <span>{path.topics.length} topics</span>
                </div>
              </button>

              {open && (
                <div className="p-6 space-y-6">
                  <div>
                    <h4 className="font-semibold text-primary mb-3 flex items-center">
                      <Icon name="List" size={16} className="mr-2" />
                      Topics
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {path.topics.map((topic) => (
                        <div key={topic} className="flex items-center space-x-2 text-sm text-text-secondary">
                          <div className="w-1.5 h-1.5 rounded-full bg-brand-sage" />
                          <span>{topic}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-primary mb-3 flex items-center">
                      <Icon name="Target" size={16} className="mr-2" />
                      What you will understand
                    </h4>
                    <div className="space-y-2">
                      {path.benefits.map((benefit) => (
                        <div key={benefit} className="flex items-center space-x-2 text-sm text-text-secondary">
                          <Icon name="Check" size={14} className="text-success" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LearningPathCards;
