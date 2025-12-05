// src/pages/professional-dashboard-portal/components/DashboardOverview.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Icon from "../../../components/AppIcon";
import useAuth from "../../../hooks/useAuth";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const DashboardOverview = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user } = useAuth();

  const api = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
  });

  /* ---------------------------------------------------------
      FETCH DOCTOR'S APPOINTMENTS
  --------------------------------------------------------- */
useEffect(() => {
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("authToken");
      const doctorId = user?._id || user?.id;

      if (!token || !doctorId) {
        setError("Not authenticated. Please log in as a doctor.");
        return;
      }

      const res = await api.get(`/api/appointments/doctor/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAppointments(res.data?.appointments || []);
    } catch (err) {
      console.error("Failed to load appointments", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to load appointments";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  fetchAppointments();
}, [user]);


  const isToday = (dateString) => {
    const today = new Date();
    const parts = dateString.split("-");
    const d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  };

  /* ---------------------------------------------------------
      FORMAT DATA FOR UI
  --------------------------------------------------------- */
  const { todayStats, todaysAppointments } = useMemo(() => {
    const todays = [];

    appointments.forEach((apt) => {
      if (isToday(apt.date)) {
        todays.push({
          id: apt._id,
          patient: apt.patientId?.fullName || "Unknown Patient",
          timeLabel: apt.time,
          type: apt.sessionType,
        });
      }
    });

    return {
      todayStats: {
        appointments: todays.length,
        pendingReviews: 0,
        progressAlerts: 0,
        newPatients: 0,
      },
      todaysAppointments: todays,
    };
  }, [appointments]);

  const quickStats = [
    {
      id: 1,
      title: "Today's Appointments",
      value: todayStats.appointments,
      icon: "Calendar",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      id: 2,
      title: "Pending Plan Reviews",
      value: todayStats.pendingReviews,
      icon: "FileText",
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      id: 3,
      title: "Progress Alerts",
      value: todayStats.progressAlerts,
      icon: "TrendingUp",
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      id: 4,
      title: "New Patients",
      value: todayStats.newPatients,
      icon: "UserPlus",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
  ];

  const getDoctorDisplayName = () => {
    const baseName = user?.fullName || user?.name || "Doctor";
    if (/^dr\.?/i.test(baseName.trim())) return baseName;
    return `Dr. ${baseName}`;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-2xl p-6 md:p-7 border border-border organic-shadow">
        <h2 className="text-2xl md:text-3xl font-display font-semibold text-primary mb-1">
          Welcome back, {getDoctorDisplayName()}
        </h2>
        <p className="text-sm text-text-secondary">
          <b>{loading ? "Loading..." : todayStats.appointments}</b> appointments scheduled today.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {quickStats.map((s) => (
          <div
            key={s.id}
            className="p-4 rounded-xl border border-border bg-card organic-shadow-sm flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-text-secondary mb-1">{s.title}</div>
                <div className="text-2xl font-semibold">{s.value ?? 0}</div>
              </div>
              <div className={`rounded-full p-2 ${s.bgColor}`}>
                <Icon name={s.icon} size={20} className={s.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Today's Appointments */}
      <div className="bg-card rounded-xl border border-border organic-shadow">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">
            Today&apos;s Appointments
          </h3>
          <Icon name="Calendar" size={20} className="text-text-secondary" />
        </div>

        <div className="p-4 space-y-3">
          {loading && <p className="text-text-secondary">Loading...</p>}

          {!loading && todaysAppointments.length === 0 && (
            <p className="text-text-secondary">No appointments for today</p>
          )}

          {todaysAppointments.map((apt) => (
            <div
              key={apt.id}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border hover:border-green-700 organic-transition"
            >
              <div>
                <h4 className="font-medium text-text-primary">{apt.patient}</h4>
                <p className="text-xs text-text-secondary">{apt.type}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{apt.timeLabel}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md px-3 py-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default DashboardOverview;
