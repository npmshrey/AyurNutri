import React from 'react';
import Icon from '../../../components/AppIcon';

const DashboardOverview = () => {
  const todayStats = {
    appointments: 8,
    pendingReviews: 3,
    progressAlerts: 2,
    newPatients: 1
  };

  const quickStats = [
    {
      id: 1,
      title: "Today\'s Appointments",
      value: todayStats?.appointments,
      icon: "Calendar",
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      id: 2,
      title: "Pending Plan Reviews",
      value: todayStats?.pendingReviews,
      icon: "FileText",
      color: "text-warning",
      bgColor: "bg-warning/10"
    },
    {
      id: 3,
      title: "Progress Alerts",
      value: todayStats?.progressAlerts,
      icon: "TrendingUp",
      color: "text-success",
      bgColor: "bg-success/10"
    },
    {
      id: 4,
      title: "New Patients",
      value: todayStats?.newPatients,
      icon: "UserPlus",
      color: "text-secondary",
      bgColor: "bg-secondary/10"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: "appointment",
      patient: "Sarah Johnson",
      action: "Consultation completed",
      time: "2 hours ago",
      dosha: "Vata-Pitta"
    },
    {
      id: 2,
      type: "plan",
      patient: "Michael Chen",
      action: "Nutrition plan updated",
      time: "4 hours ago",
      dosha: "Kapha"
    },
    {
      id: 3,
      type: "progress",
      patient: "Emma Davis",
      action: "Weekly progress logged",
      time: "6 hours ago",
      dosha: "Pitta-Vata"
    }
  ];

  const upcomingAppointments = [
    {
      id: 1,
      patient: "Robert Wilson",
      time: "2:00 PM",
      type: "Follow-up",
      dosha: "Vata",
      condition: "Digestive Issues"
    },
    {
      id: 2,
      patient: "Lisa Anderson",
      time: "3:30 PM",
      type: "Initial Consultation",
      dosha: "Pitta-Kapha",
      condition: "Weight Management"
    },
    {
      id: 3,
      patient: "David Kumar",
      time: "4:15 PM",
      type: "Plan Review",
      dosha: "Kapha-Vata",
      condition: "Metabolic Health"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6 border border-border">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-semibold text-primary mb-2">
              Welcome back, Dr. Patel
            </h2>
            <h2 className="text-black">
              <b>{todayStats?.appointments}</b> appointments scheduled.
            </h2>
          </div>
        </div>
      </div>
      {/* Quick Stats Grid */}
      
      <div className="">
        {/* Upcoming Appointments */}
        <div className="bg-card rounded-lg border border-border organic-shadow">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text-primary">Today's Appointments</h3>
              <Icon name="Calendar" size={20} className="text-text-secondary" />
            </div>
          </div>
          <div className="p-4 space-y-3">
            {upcomingAppointments?.map((appointment) => (
              <div key={appointment?.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border hover:border-green-700  ">
                <div className="flex-1 ">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-text-primary">{appointment?.patient}</h4>
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                      {appointment?.dosha}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary">{appointment?.condition}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-text-primary">{appointment?.time}</p>
                  <p className="text-xs text-text-secondary">{appointment?.type}</p>
                </div>
              </div>
            ))}
            <button className="w-full mt-3 p-2 text-sm text-primary hover:bg-primary/5 rounded-lg organic-transition">
              View All Appointments
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;