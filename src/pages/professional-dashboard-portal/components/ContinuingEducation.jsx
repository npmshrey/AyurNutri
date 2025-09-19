import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ContinuingEducation = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Courses', count: 24 },
    { id: 'ayurveda', name: 'Ayurvedic Principles', count: 8 },
    { id: 'nutrition', name: 'Clinical Nutrition', count: 6 },
    { id: 'integration', name: 'Integrative Medicine', count: 5 },
    { id: 'research', name: 'Latest Research', count: 5 }
  ];

  const courses = [
    {
      id: 1,
      title: "Advanced Dosha Assessment Techniques",
      category: "ayurveda",
      duration: "2.5 hours",
      credits: 2.5,
      difficulty: "Advanced",
      progress: 75,
      instructor: "Dr. Rajesh Sharma",
      description: "Master the art of precise constitutional analysis using modern diagnostic tools combined with traditional Ayurvedic assessment methods.",
      thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=200&fit=crop",
      enrolled: true,
      completed: false
    },
    {
      id: 2,
      title: "Nutritional Genomics in Ayurvedic Practice",
      category: "integration",
      duration: "3 hours",
      credits: 3.0,
      difficulty: "Expert",
      progress: 0,
      instructor: "Dr. Sarah Mitchell",
      description: "Explore how genetic variations influence individual responses to Ayurvedic dietary recommendations and therapeutic interventions.",
      thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=300&h=200&fit=crop",
      enrolled: false,
      completed: false
    },
    {
      id: 3,
      title: "Seasonal Nutrition Planning",
      category: "nutrition",
      duration: "1.5 hours",
      credits: 1.5,
      difficulty: "Intermediate",
      progress: 100,
      instructor: "Dr. Priya Nair",
      description: "Learn to create dynamic nutrition plans that adapt to seasonal changes and their impact on different constitutional types.",
      thumbnail: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=300&h=200&fit=crop",
      enrolled: true,
      completed: true
    },
    {
      id: 4,
      title: "Clinical Research in Ayurvedic Nutrition",
      category: "research",
      duration: "4 hours",
      credits: 4.0,
      difficulty: "Expert",
      progress: 25,
      instructor: "Dr. Michael Thompson",
      description: "Understanding and applying evidence-based research methodologies in Ayurvedic nutritional interventions.",
      thumbnail: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=300&h=200&fit=crop",
      enrolled: true,
      completed: false
    },
    {
      id: 5,
      title: "Micro-Learning: Daily Ayurvedic Insights",
      category: "ayurveda",
      duration: "5 min/day",
      credits: 0.5,
      difficulty: "Beginner",
      progress: 60,
      instructor: "AyurNutri Team",
      description: "Daily bite-sized lessons on Ayurvedic principles, perfect for busy practitioners to learn during patient prep time.",
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
      enrolled: true,
      completed: false
    },
    {
      id: 6,
      title: "Patient Communication in Integrative Medicine",
      category: "integration",
      duration: "2 hours",
      credits: 2.0,
      difficulty: "Intermediate",
      progress: 0,
      instructor: "Dr. Lisa Chen",
      description: "Effective strategies for explaining Ayurvedic concepts to patients from diverse cultural backgrounds.",
      thumbnail: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=300&h=200&fit=crop",
      enrolled: false,
      completed: false
    }
  ];

  const certifications = [
    {
      id: 1,
      name: "Certified Ayurvedic Nutrition Specialist",
      progress: 78,
      totalCredits: 40,
      earnedCredits: 31.2,
      estimatedCompletion: "2 months",
      benefits: ["Professional recognition", "Enhanced patient trust", "Higher consultation fees"]
    },
    {
      id: 2,
      name: "Integrative Medicine Practitioner",
      progress: 45,
      totalCredits: 60,
      earnedCredits: 27,
      estimatedCompletion: "4 months",
      benefits: ["Hospital privileges", "Insurance recognition", "Research opportunities"]
    }
  ];

  const microLearningTopics = [
    {
      id: 1,
      title: "Understanding Agni (Digestive Fire)",
      duration: "3 min",
      completed: true,
      date: "Today"
    },
    {
      id: 2,
      title: "Rasa and Its Clinical Applications",
      duration: "4 min",
      completed: true,
      date: "Yesterday"
    },
    {
      id: 3,
      title: "Seasonal Dosha Variations",
      duration: "5 min",
      completed: false,
      date: "Available"
    },
    {
      id: 4,
      title: "Food Combining Principles",
      duration: "3 min",
      completed: false,
      date: "Available"
    }
  ];

  const filteredCourses = selectedCategory === 'all' 
    ? courses 
    : courses?.filter(course => course?.category === selectedCategory);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-success/10 text-success';
      case 'Intermediate': return 'bg-warning/10 text-warning';
      case 'Advanced': return 'bg-primary/10 text-primary';
      case 'Expert': return 'bg-error/10 text-error';
      default: return 'bg-muted text-text-secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-primary">Continuing Education</h2>
          <p className="text-text-secondary">Enhance your expertise with integrated learning modules</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" iconName="Calendar">
            Schedule Learning
          </Button>
          <Button variant="default" iconName="Award">
            View Certificates
          </Button>
        </div>
      </div>
      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certifications?.map((cert) => (
          <div key={cert?.id} className="bg-card rounded-lg p-4 border border-border organic-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-text-primary">{cert?.name}</h3>
                <p className="text-sm text-text-secondary">
                  {cert?.earnedCredits} of {cert?.totalCredits} credits earned
                </p>
              </div>
              <Icon name="Award" size={20} className="text-secondary" />
            </div>
            
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-text-secondary">Progress</span>
                <span className="font-medium text-text-primary">{cert?.progress}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full organic-transition"
                  style={{ width: `${cert?.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-text-secondary">
                Estimated completion: {cert?.estimatedCompletion}
              </p>
              <div className="flex flex-wrap gap-1">
                {cert?.benefits?.map((benefit, index) => (
                  <span key={index} className="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded">
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Micro-Learning Section */}
      <div className="bg-card rounded-lg border border-border organic-shadow">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon name="Zap" size={20} className="text-warning" />
              <h3 className="text-lg font-semibold text-text-primary">Daily Micro-Learning</h3>
            </div>
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {microLearningTopics?.map((topic) => (
              <div key={topic?.id} className={`p-3 rounded-lg border ${
                topic?.completed ? 'bg-success/5 border-success/20' : 'bg-muted/30 border-border'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-text-secondary">{topic?.duration}</span>
                  {topic?.completed ? (
                    <Icon name="CheckCircle" size={16} className="text-success" />
                  ) : (
                    <Icon name="Play" size={16} className="text-primary" />
                  )}
                </div>
                <h4 className="text-sm font-medium text-text-primary mb-1">{topic?.title}</h4>
                <p className="text-xs text-text-secondary">{topic?.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Course Categories */}
      <div className="flex flex-wrap gap-2">
        {categories?.map((category) => (
          <button
            key={category?.id}
            onClick={() => setSelectedCategory(category?.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium organic-transition ${
              selectedCategory === category?.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-text-secondary hover:bg-muted/70'
            }`}
          >
            {category?.name} ({category?.count})
          </button>
        ))}
      </div>
      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses?.map((course) => (
          <div key={course?.id} className="bg-card rounded-lg border border-border organic-shadow overflow-hidden">
            <div className="relative">
              <img
                src={course?.thumbnail}
                alt={course?.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-3 right-3">
                <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(course?.difficulty)}`}>
                  {course?.difficulty}
                </span>
              </div>
              {course?.enrolled && (
                <div className="absolute top-3 left-3">
                  <span className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded">
                    Enrolled
                  </span>
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-text-primary">{course?.title}</h3>
                {course?.completed && (
                  <Icon name="CheckCircle" size={20} className="text-success" />
                )}
              </div>

              <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                {course?.description}
              </p>

              <div className="flex items-center justify-between text-sm text-text-secondary mb-3">
                <span>{course?.duration}</span>
                <span>{course?.credits} CE Credits</span>
              </div>

              <div className="flex items-center space-x-2 mb-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="User" size={12} className="text-primary" />
                </div>
                <span className="text-sm text-text-secondary">{course?.instructor}</span>
              </div>

              {course?.enrolled && !course?.completed && (
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-text-secondary">Progress</span>
                    <span className="font-medium text-text-primary">{course?.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full organic-transition"
                      style={{ width: `${course?.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                {course?.enrolled ? (
                  course?.completed ? (
                    <Button variant="outline" size="sm" fullWidth iconName="RotateCcw">
                      Review Course
                    </Button>
                  ) : (
                    <Button variant="default" size="sm" fullWidth iconName="Play">
                      Continue Learning
                    </Button>
                  )
                ) : (
                  <Button variant="outline" size="sm" fullWidth iconName="Plus">
                    Enroll Now
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContinuingEducation;