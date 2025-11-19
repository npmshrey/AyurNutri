import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const LearningModules = () => {
  const [selectedCategory, setSelectedCategory] = useState('constitution');

  const categories = [
    { id: 'constitution', label: 'Your Constitution', icon: 'User', count: 8 },
    { id: 'seasonal', label: 'Seasonal Wellness', icon: 'Calendar', count: 12 },
    { id: 'mindful', label: 'Mindful Eating', icon: 'Heart', count: 6 },
    { id: 'lifestyle', label: 'Lifestyle Practices', icon: 'Sun', count: 10 }
  ];

  const modules = {
    constitution: [
      {
        title: "Understanding Your Vata-Pitta Nature",
        description: "Learn how your unique constitutional blend affects your daily energy, digestion, and emotional patterns.",
        duration: "8 min read",
        progress: 100,
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
        level: "Beginner",
        completed: true
      },
      {
        title: "Balancing Air and Fire Elements",
        description: "Practical strategies to harmonize the mobile Vata energy with the intense Pitta fire in your system.",
        duration: "12 min read",
        progress: 60,
        image: "https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?w=300&h=200&fit=crop",
        level: "Intermediate",
        completed: false
      },
      {
        title: "Constitutional Eating Guidelines",
        description: "Discover which foods support your constitution and which ones to enjoy in moderation.",
        duration: "15 min read",
        progress: 0,
        image: "https://images.pixabay.com/photo/2017/05/11/19/44/fresh-fruits-2305192_1280.jpg?w=300&h=200&fit=crop",
        level: "Beginner",
        completed: false
      }
    ],
    seasonal: [
      {
        title: "Autumn Wellness for Vata Types",
        description: "Navigate the windy, dry autumn season with grounding practices and warming foods.",
        duration: "10 min read",
        progress: 80,
        image: "https://images.unsplash.com/photo-1507371341162-763b5e419618?w=300&h=200&fit=crop",
        level: "Beginner",
        completed: false
      },
      {
        title: "Seasonal Detox Practices",
        description: "Gentle cleansing methods that align with natural seasonal transitions.",
        duration: "18 min read",
        progress: 0,
        image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?w=300&h=200&fit=crop",
        level: "Advanced",
        completed: false
      }
    ],
    mindful: [
      {
        title: "The Art of Conscious Eating",
        description: "Transform your relationship with food through mindfulness and awareness practices.",
        duration: "14 min read",
        progress: 40,
        image: "https://images.pixabay.com/photo/2017/08/12/18/59/snack-2635035_1280.jpg?w=300&h=200&fit=crop",
        level: "Beginner",
        completed: false
      },
      {
        title: "Digestive Fire Meditation",
        description: "Learn to kindle and maintain your digestive fire through breathing and visualization.",
        duration: "20 min practice",
        progress: 0,
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
        level: "Intermediate",
        completed: false
      }
    ],
    lifestyle: [
      {
        title: "Daily Routine for Constitutional Balance",
        description: "Create a personalized daily schedule that supports your natural rhythms and constitution.",
        duration: "16 min read",
        progress: 25,
        image: "https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?w=300&h=200&fit=crop",
        level: "Beginner",
        completed: false
      },
      {
        title: "Stress Management for Dual Types",
        description: "Specific techniques to manage stress when you have both Vata and Pitta tendencies.",
        duration: "22 min read",
        progress: 0,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
        level: "Intermediate",
        completed: false
      }
    ]
  };

  const currentModules = modules?.[selectedCategory] || [];

  return (
    <div className="bg-card rounded-xl organic-shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-display font-semibold text-primary mb-1">
            Personalized Learning
          </h3>
          <p className="text-sm text-text-secondary">
            Curated content based on your Vata-Pitta constitution
          </p>
        </div>
        <Button variant="outline" size="sm" iconName="BookOpen">
          View All Modules
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {categories?.map((category) => (
          <button
            key={category?.id}
            onClick={() => setSelectedCategory(category?.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium organic-transition ${
              selectedCategory === category?.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-text-secondary hover:text-primary hover:bg-muted/80'
            }`}
          >
            <Icon name={category?.icon} size={16} />
            <span>{category?.label}</span>
            <span className="text-xs opacity-70">({category?.count})</span>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {currentModules?.map((module, index) => (
          <div key={index} className="bg-muted rounded-lg overflow-hidden">
            <div className="relative h-32">
              <Image
                src={module.image}
                alt={module.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1">
                <span className="text-xs font-medium text-primary">{module.level}</span>
              </div>
              {module.completed && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <Icon name="Check" size={12} className="text-white" />
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h5 className="font-semibold text-primary text-sm">{module.title}</h5>
                <span className="text-xs text-text-secondary">{module.duration}</span>
              </div>
              <p className="text-xs text-text-secondary mb-3 line-clamp-2">
                {module.description}
              </p>
              
              {module.progress > 0 && (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-text-secondary">Progress</span>
                    <span className="text-xs font-medium text-primary">{module.progress}%</span>
                  </div>
                  <div className="w-full bg-border rounded-full h-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full organic-transition"
                      style={{ width: `${module.progress}%` }}
                    />
                  </div>
                </div>
              )}
              
              <div className="flex space-x-2">
                <Button 
                  variant={module.completed ? "outline" : "default"} 
                  size="sm" 
                  className="flex-1"
                >
                  {module.completed ? 'Review' : module.progress > 0 ? 'Continue' : 'Start'}
                </Button>
                <Button variant="ghost" size="sm" iconName="Bookmark" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-gradient-to-r from-accent/10 to-secondary/10 rounded-lg p-4 border border-accent/20">
        <div className="flex items-start space-x-3">
          <Icon name="Award" size={20} className="text-secondary flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-semibold text-primary mb-1">Learning Milestone</h5>
            <p className="text-sm text-text-secondary mb-2">
              Complete 3 more modules to unlock the "Constitutional Expert" badge and access advanced practices.
            </p>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-border rounded-full h-2">
                <div className="bg-secondary h-2 rounded-full" style={{ width: '60%' }} />
              </div>
              <span className="text-xs font-medium text-secondary">3/5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningModules;