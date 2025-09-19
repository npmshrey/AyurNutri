import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProgressTracking = () => {
  const [selectedMetric, setSelectedMetric] = useState('energy');

  const energyData = [
    { date: '2025-09-01', value: 65, mood: 'Good' },
    { date: '2025-09-03', value: 72, mood: 'Great' },
    { date: '2025-09-05', value: 68, mood: 'Good' },
    { date: '2025-09-07', value: 78, mood: 'Excellent' },
    { date: '2025-09-09', value: 75, mood: 'Great' },
    { date: '2025-09-11', value: 82, mood: 'Excellent' },
    { date: '2025-09-13', value: 79, mood: 'Great' },
    { date: '2025-09-15', value: 85, mood: 'Excellent' },
    { date: '2025-09-17', value: 88, mood: 'Excellent' },
    { date: '2025-09-18', value: 90, mood: 'Excellent' }
  ];

  const symptomData = [
    { symptom: 'Digestive Issues', week1: 8, week2: 6, week3: 4, week4: 2 },
    { symptom: 'Sleep Problems', week1: 7, week2: 5, week3: 3, week4: 2 },
    { symptom: 'Stress Levels', week1: 9, week2: 7, week3: 5, week4: 3 },
    { symptom: 'Joint Stiffness', week1: 6, week2: 4, week3: 3, week4: 1 }
  ];

  const doshaBalance = [
    { name: 'Vata', value: 45, color: '#87A96B' },
    { name: 'Pitta', value: 35, color: '#D4AF37' },
    { name: 'Kapha', value: 20, color: '#2D5016' }
  ];

  const biomarkers = [
    { name: 'Blood Pressure', current: '118/78', previous: '125/82', trend: 'down', status: 'optimal' },
    { name: 'Resting Heart Rate', current: '62 bpm', previous: '68 bpm', trend: 'down', status: 'good' },
    { name: 'Sleep Score', current: '85%', previous: '72%', trend: 'up', status: 'excellent' },
    { name: 'Stress Index', current: '3.2', previous: '4.8', trend: 'down', status: 'good' }
  ];

  const metrics = [
    { id: 'energy', label: 'Energy Levels', icon: 'Zap', color: 'text-yellow-600' },
    { id: 'symptoms', label: 'Symptom Reduction', icon: 'TrendingDown', color: 'text-green-600' },
    { id: 'dosha', label: 'Constitutional Balance', icon: 'Target', color: 'text-purple-600' },
    { id: 'biomarkers', label: 'Health Metrics', icon: 'Activity', color: 'text-blue-600' }
  ];

  const renderChart = () => {
    switch (selectedMetric) {
      case 'energy':
        return (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={energyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E3D8" />
                <XAxis 
                  dataKey="date" 
                  stroke="#4A5568"
                  fontSize={12}
                  tickFormatter={(value) => new Date(value)?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis stroke="#4A5568" fontSize={12} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value)?.toLocaleDateString()}
                  formatter={(value, name) => [`${value}%`, 'Energy Level']}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#D4AF37" 
                  strokeWidth={3}
                  dot={{ fill: '#D4AF37', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      case 'symptoms':
        return (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={symptomData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E3D8" />
                <XAxis type="number" stroke="#4A5568" fontSize={12} />
                <YAxis dataKey="symptom" type="category" stroke="#4A5568" fontSize={12} width={100} />
                <Tooltip />
                <Bar dataKey="week1" fill="#9B2C2C" name="Week 1" />
                <Bar dataKey="week2" fill="#C05621" name="Week 2" />
                <Bar dataKey="week3" fill="#D4AF37" name="Week 3" />
                <Bar dataKey="week4" fill="#22543D" name="Week 4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case 'dosha':
        return (
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={doshaBalance}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {doshaBalance?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry?.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );
      case 'biomarkers':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {biomarkers?.map((metric, index) => (
              <div key={index} className="bg-muted rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-secondary">{metric?.name}</span>
                  <div className={`flex items-center space-x-1 ${
                    metric?.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <Icon 
                      name={metric?.trend === 'up' ? 'TrendingUp' : 'TrendingDown'} 
                      size={14} 
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold text-primary">{metric?.current}</div>
                    <div className="text-xs text-text-secondary">Previous: {metric?.previous}</div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    metric?.status === 'excellent' ? 'bg-green-100 text-green-800' :
                    metric?.status === 'good'? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {metric?.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-card rounded-xl organic-shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-display font-semibold text-primary mb-1">
            Progress Tracking
          </h3>
          <p className="text-sm text-text-secondary">
            Monitor your wellness journey with detailed insights
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" iconName="Download">
            Export Data
          </Button>
          <Button variant="outline" size="sm" iconName="Share2">
            Share Progress
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-6">
        {metrics?.map((metric) => (
          <button
            key={metric?.id}
            onClick={() => setSelectedMetric(metric?.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium organic-transition ${
              selectedMetric === metric?.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-text-secondary hover:text-primary hover:bg-muted/80'
            }`}
          >
            <Icon name={metric?.icon} size={16} className={selectedMetric === metric?.id ? '' : metric?.color} />
            <span>{metric?.label}</span>
          </button>
        ))}
      </div>
      <div className="mb-6">
        {renderChart()}
      </div>
      {selectedMetric === 'dosha' && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {doshaBalance?.map((dosha, index) => (
            <div key={index} className="text-center">
              <div 
                className="w-4 h-4 rounded-full mx-auto mb-2"
                style={{ backgroundColor: dosha?.color }}
              />
              <div className="font-semibold text-primary">{dosha?.name}</div>
              <div className="text-sm text-text-secondary">{dosha?.value}%</div>
            </div>
          ))}
        </div>
      )}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4 border border-primary/10">
        <div className="flex items-start space-x-3">
          <Icon name="TrendingUp" size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h5 className="font-semibold text-primary mb-1">Progress Insights</h5>
            <p className="text-sm text-text-secondary mb-2">
              Your energy levels have improved by 38% over the past month. The consistent meal timing and constitutional foods are showing excellent results.
            </p>
            <Button variant="ghost" size="sm" iconName="ArrowRight" iconPosition="right">
              View Detailed Analysis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracking;