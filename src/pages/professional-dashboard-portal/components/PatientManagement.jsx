import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PatientManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedDosha, setSelectedDosha] = useState('all');

  const filterOptions = [
    { value: 'all', label: 'All Patients' },
    { value: 'active', label: 'Active Treatment' },
    { value: 'followup', label: 'Follow-up Required' },
    { value: 'new', label: 'New Patients' },
    { value: 'completed', label: 'Treatment Completed' }
  ];

  const doshaOptions = [
    { value: 'all', label: 'All Doshas' },
    { value: 'vata', label: 'Vata' },
    { value: 'pitta', label: 'Pitta' },
    { value: 'kapha', label: 'Kapha' },
    { value: 'vata-pitta', label: 'Vata-Pitta' },
    { value: 'pitta-kapha', label: 'Pitta-Kapha' },
    { value: 'kapha-vata', label: 'Kapha-Vata' }
  ];

  const patients = [
    {
      id: 1,
      name: "Sarah Johnson",
      age: 34,
      dosha: "Vata-Pitta",
      condition: "Digestive Issues",
      status: "active",
      lastVisit: "2024-09-15",
      nextAppointment: "2024-09-22",
      progress: 78,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Michael Chen",
      age: 42,
      dosha: "Kapha",
      condition: "Weight Management",
      status: "followup",
      lastVisit: "2024-09-10",
      nextAppointment: "2024-09-25",
      progress: 65,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Emma Davis",
      age: 28,
      dosha: "Pitta-Vata",
      condition: "Stress & Anxiety",
      status: "active",
      lastVisit: "2024-09-17",
      nextAppointment: "2024-09-24",
      progress: 82,
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "Robert Wilson",
      age: 55,
      dosha: "Vata",
      condition: "Joint Health",
      status: "new",
      lastVisit: "2024-09-18",
      nextAppointment: "2024-09-20",
      progress: 25,
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 5,
      name: "Lisa Anderson",
      age: 38,
      dosha: "Pitta-Kapha",
      condition: "Metabolic Health",
      status: "active",
      lastVisit: "2024-09-16",
      nextAppointment: "2024-09-23",
      progress: 71,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 6,
      name: "David Kumar",
      age: 45,
      dosha: "Kapha-Vata",
      condition: "Sleep Disorders",
      status: "completed",
      lastVisit: "2024-09-12",
      nextAppointment: null,
      progress: 95,
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-success/10 text-success';
      case 'followup': return 'bg-warning/10 text-warning';
      case 'new': return 'bg-secondary/10 text-secondary';
      case 'completed': return 'bg-primary/10 text-primary';
      default: return 'bg-muted text-text-secondary';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'followup': return 'Follow-up';
      case 'new': return 'New';
      case 'completed': return 'Completed';
      default: return status;
    }
  };

  const getDoshaColor = (dosha) => {
    if (dosha?.includes('Vata')) return 'bg-blue-100 text-blue-800';
    if (dosha?.includes('Pitta')) return 'bg-red-100 text-red-800';
    if (dosha?.includes('Kapha')) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-primary">Patient Management</h2>
          <p className="text-text-secondary">Manage your patients and track their progress</p>
        </div>
        <Button variant="default" iconName="UserPlus" iconPosition="left">
          Add New Patient
        </Button>
      </div>
      {/* Filters */}
      <div className="bg-card rounded-lg p-4 border border-border organic-shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            type="search"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="w-full"
          />
          <Select
            options={filterOptions}
            value={selectedFilter}
            onChange={setSelectedFilter}
            placeholder="Filter by status"
          />
          <Select
            options={doshaOptions}
            value={selectedDosha}
            onChange={setSelectedDosha}
            placeholder="Filter by dosha"
          />
        </div>
      </div>
      {/* Patient List */}
      <div className="bg-card rounded-lg border border-border organic-shadow">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-primary">
              Patients ({patients?.length})
            </h3>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" iconName="Filter">
                Filter
              </Button>
              <Button variant="ghost" size="sm" iconName="Download">
                Export
              </Button>
            </div>
          </div>
        </div>

        <div className="divide-y divide-border">
          {patients?.map((patient) => (
            <div key={patient?.id} className="p-4 hover:bg-muted/30 organic-transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={patient?.avatar}
                      alt={patient?.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-white"></div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-text-primary">{patient?.name}</h4>
                      <span className="text-sm text-text-secondary">({patient?.age}y)</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getDoshaColor(patient?.dosha)}`}>
                        {patient?.dosha}
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary">{patient?.condition}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-text-secondary">
                        Last visit: {new Date(patient.lastVisit)?.toLocaleDateString()}
                      </span>
                      {patient?.nextAppointment && (
                        <span className="text-xs text-text-secondary">
                          Next: {new Date(patient.nextAppointment)?.toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(patient?.status)}`}>
                        {getStatusLabel(patient?.status)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full organic-transition"
                          style={{ width: `${patient?.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-text-secondary">{patient?.progress}%</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" iconName="Eye">
                      View
                    </Button>
                    <Button variant="ghost" size="sm" iconName="Edit">
                      Edit
                    </Button>
                    <Button variant="ghost" size="sm" iconName="MessageSquare">
                      Message
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between">
            <p className="text-sm text-text-secondary">
              Showing 1-6 of 127 patients
            </p>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" iconName="ChevronLeft">
                Previous
              </Button>
              <Button variant="outline" size="sm" iconName="ChevronRight">
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientManagement;