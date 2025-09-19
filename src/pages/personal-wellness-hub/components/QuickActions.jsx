import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const QuickActions = () => {
  const [quickLogType, setQuickLogType] = useState('meal');
  const [moodRating, setMoodRating] = useState(0);
  const [energyLevel, setEnergyLevel] = useState(0);

  const quickActions = [
    { id: 'meal', label: 'Log Meal', icon: 'Utensils', color: 'bg-green-500' },
    { id: 'water', label: 'Water Intake', icon: 'Droplets', color: 'bg-blue-500' },
    { id: 'mood', label: 'Mood Check', icon: 'Smile', color: 'bg-yellow-500' },
    { id: 'symptom', label: 'Log Symptom', icon: 'AlertCircle', color: 'bg-red-500' },
    { id: 'exercise', label: 'Activity', icon: 'Activity', color: 'bg-purple-500' },
    { id: 'meditation', label: 'Mindfulness', icon: 'Brain', color: 'bg-indigo-500' }
  ];

  const todaysGoals = [
    { goal: 'Drink 8 glasses of water', progress: 6, target: 8, icon: 'Droplets', completed: false },
    { goal: 'Eat 3 constitutional meals', progress: 2, target: 3, icon: 'Utensils', completed: false },
    { goal: '10 minutes meditation', progress: 10, target: 10, icon: 'Brain', completed: true },
    { goal: '8,000 steps', progress: 6247, target: 8000, icon: 'Footprints', completed: false }
  ];

  const recentLogs = [
    { type: 'meal', content: 'Spiced oatmeal with almonds', time: '8:30 AM', icon: 'Utensils' },
    { type: 'water', content: '2 glasses of warm water', time: '7:45 AM', icon: 'Droplets' },
    { type: 'mood', content: 'Feeling energized and focused', time: '9:15 AM', icon: 'Smile' },
    { type: 'meditation', content: '10 min breathing practice', time: '7:00 AM', icon: 'Brain' }
  ];

  const handleQuickLog = (actionId) => {
    setQuickLogType(actionId);
    // In a real app, this would open a modal or navigate to a logging screen
    console.log(`Quick logging: ${actionId}`);
  };

  const renderMoodSelector = () => {
    const moods = [
      { value: 1, emoji: '😔', label: 'Low' },
      { value: 2, emoji: '😐', label: 'Okay' },
      { value: 3, emoji: '🙂', label: 'Good' },
      { value: 4, emoji: '😊', label: 'Great' },
      { value: 5, emoji: '😄', label: 'Excellent' }
    ];

    return (
      <div className="flex justify-between items-center">
        {moods?.map((mood) => (
          <button
            key={mood?.value}
            onClick={() => setMoodRating(mood?.value)}
            className={`flex flex-col items-center p-2 rounded-lg organic-transition ${
              moodRating === mood?.value ? 'bg-primary/10 border border-primary' : 'hover:bg-muted/50'
            }`}
          >
            <span className="text-2xl mb-1">{mood?.emoji}</span>
            <span className="text-xs text-text-secondary">{mood?.label}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Quick Action Buttons */}
      <div className="bg-card rounded-xl organic-shadow p-6">
        <h3 className="text-xl font-display font-semibold text-primary mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions?.map((action) => (
            <button
              key={action?.id}
              onClick={() => handleQuickLog(action?.id)}
              className="flex flex-col items-center p-4 bg-muted rounded-lg hover:bg-muted/80 organic-transition group"
            >
              <div className={`w-12 h-12 ${action?.color} rounded-full flex items-center justify-center mb-2 group-hover:scale-105 organic-transition`}>
                <Icon name={action?.icon} size={20} className="text-white" />
              </div>
              <span className="text-sm font-medium text-primary text-center">{action?.label}</span>
            </button>
          ))}
        </div>
      </div>
      {/* Today's Goals */}
      <div className="bg-card rounded-xl organic-shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-display font-semibold text-primary">
            Today's Wellness Goals
          </h3>
          <span className="text-sm text-text-secondary">
            {todaysGoals?.filter(g => g?.completed)?.length}/{todaysGoals?.length} completed
          </span>
        </div>
        <div className="space-y-4">
          {todaysGoals?.map((goal, index) => (
            <div key={index} className="bg-muted rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <Icon name={goal?.icon} size={16} className="text-primary" />
                  <span className="font-medium text-primary">{goal?.goal}</span>
                </div>
                {goal?.completed && (
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <Icon name="Check" size={12} className="text-white" />
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex-1 bg-border rounded-full h-2">
                  <div
                    className={`h-2 rounded-full organic-transition ${
                      goal?.completed ? 'bg-green-500' : 'bg-primary'
                    }`}
                    style={{ width: `${Math.min((goal?.progress / goal?.target) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-sm text-text-secondary">
                  {goal?.progress}/{goal?.target}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Quick Mood & Energy Check */}
      <div className="bg-card rounded-xl organic-shadow p-6">
        <h3 className="text-xl font-display font-semibold text-primary mb-4">
          How are you feeling?
        </h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-primary mb-3">Mood</label>
            {renderMoodSelector()}
          </div>
          <div>
            <label className="block text-sm font-medium text-primary mb-3">Energy Level</label>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-text-secondary">Low</span>
              <input
                type="range"
                min="1"
                max="10"
                value={energyLevel}
                onChange={(e) => setEnergyLevel(e?.target?.value)}
                className="flex-1 h-2 bg-border rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-text-secondary">High</span>
              <span className="text-sm font-medium text-primary w-8">{energyLevel}/10</span>
            </div>
          </div>
          <Button variant="default" className="w-full">
            Save Check-in
          </Button>
        </div>
      </div>
      {/* Recent Activity */}
      <div className="bg-card rounded-xl organic-shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-display font-semibold text-primary">
            Recent Activity
          </h3>
          <Button variant="ghost" size="sm" iconName="Clock">
            View All
          </Button>
        </div>
        <div className="space-y-3">
          {recentLogs?.map((log, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Icon name={log?.icon} size={14} className="text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-primary">{log?.content}</p>
                <p className="text-xs text-text-secondary">{log?.time}</p>
              </div>
              <Button variant="ghost" size="sm" iconName="Edit2" />
            </div>
          ))}
        </div>
      </div>
      {/* Motivational Quote */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 border border-primary/20">
        <div className="flex items-start space-x-3">
          <Icon name="Quote" size={24} className="text-primary flex-shrink-0 mt-1" />
          <div>
            <blockquote className="text-lg font-accent text-primary mb-2 italic">
              "When diet is wrong, medicine is of no use. When diet is correct, medicine is of no need."
            </blockquote>
            <cite className="text-sm text-text-secondary">— Ancient Ayurvedic Proverb</cite>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;