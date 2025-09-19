import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const WellnessOverview = ({ userData, todaysRecommendations }) => {
  const progressData = [
    { label: 'Energy Level', value: 78, color: 'bg-green-500' },
    { label: 'Sleep Quality', value: 85, color: 'bg-blue-500' },
    { label: 'Digestive Health', value: 72, color: 'bg-yellow-500' },
    { label: 'Stress Management', value: 68, color: 'bg-purple-500' }
  ];

  return (
    <div className="bg-card rounded-xl organic-shadow p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Image
              src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face"
              alt="User Profile"
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <Icon name="Check" size={12} className="text-white" />
            </div>
          </div>
          <div>
            <h2 className="text-xl font-display font-semibold text-primary">
              Welcome back, {userData?.name}
            </h2>
            <p className="text-sm text-text-secondary">
              {userData?.constitution} Constitution • Day {userData?.journeyDay} of your wellness journey
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{userData?.wellnessScore}%</div>
          <div className="text-xs text-text-secondary">Wellness Score</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {progressData?.map((item, index) => (
          <div key={index} className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-secondary">{item?.label}</span>
              <span className="text-sm font-semibold text-primary">{item?.value}%</span>
            </div>
            <div className="w-full bg-border rounded-full h-2">
              <div
                className={`${item?.color} h-2 rounded-full organic-transition`}
                style={{ width: `${item?.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4 border border-primary/10">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="Lightbulb" size={16} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-primary mb-1">Today's Wellness Insight</h3>
            <p className="text-sm text-text-secondary">
              Your {userData?.constitution} constitution thrives with warm, cooked foods during this season. 
              Focus on grounding activities and maintain regular meal times for optimal balance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WellnessOverview;