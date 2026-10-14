// src/pages/personal-wellness-hub/components/DashboardHome.jsx

import React, { useEffect, useMemo, useState } from "react";
import Icon from "../../../components/AppIcon";
import useAuth from "../../../hooks/useAuth";
import Button from "../../../components/ui/Button";
import PatientWeekPlan from "./PatientWeekPlan";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

// onNavigate prop (parent se aayega)
const DashboardHome = ({ onNavigate }) => {
  const { token, user } = useAuth();

  const [overview, setOverview] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [overviewError, setOverviewError] = useState("");

  const [clinicalPatientId, setClinicalPatientId] = useState(null);
  const [latestPlanId, setLatestPlanId] = useState(null);
  const [weeklyLoading, setWeeklyLoading] = useState(false);
  const [weeklyError, setWeeklyError] = useState("");

  const [selectedReport, setSelectedReport] = useState(null);

  // =========================================================
  // 1) FETCH PATIENT OVERVIEW
  // =========================================================
  useEffect(() => {
    if (!token) return;

    const fetchOverview = async () => {
      try {
        setOverviewLoading(true);
        setOverviewError("");

        const res = await fetch(`${API_BASE}/api/patient/overview`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const body = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(body.message || "Failed to load your dashboard");
        }

        setOverview(body);
      } catch (e) {
        console.error("Overview error:", e);
        setOverviewError(e.message || "Failed to load your dashboard");
      } finally {
        setOverviewLoading(false);
      }
    };

    fetchOverview();
  }, [token]);

  const profile = overview?.profile || null;
  const latestRecord =
    overview?.primaryRecord ||
    overview?.latestRecord ||
    overview?.record ||
    null;
  const appointments = overview?.appointments || [];
  const nextAppointment = overview?.nextAppointment || null;

  // =========================================================
  // 2) FETCH WEEKLY PLANS (once we know clinical patient id)
  // =========================================================
  useEffect(() => {
    if (!token) return;
    if (!latestRecord?._id) {
      setClinicalPatientId(null);
      setLatestPlanId(null);
      return;
    }

    const cpId = latestRecord._id;
    setClinicalPatientId(cpId);

    const fetchWeeklyPlans = async () => {
      try {
        setWeeklyLoading(true);
        setWeeklyError("");

        const res = await fetch(
          `${API_BASE}/api/patients/${cpId}/week-plans`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const body = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(body.message || "Failed to load weekly plans");
        }

        const plans = body.weeklyPlans || [];
        if (!plans.length) {
          setLatestPlanId(null);
          return;
        }

        plans.sort(
          (a, b) =>
            new Date(b.updatedAt || b.createdAt).getTime() -
            new Date(a.updatedAt || a.createdAt).getTime()
        );

        setLatestPlanId(plans[0]._id);
      } catch (e) {
        console.error("Weekly plans error:", e);
        setWeeklyError(e.message || "Failed to load weekly plan");
      } finally {
        setWeeklyLoading(false);
      }
    };

    fetchWeeklyPlans();
  }, [token, latestRecord?._id]);

  // =========================================================
  // 3) HELPERS / DERIVED VALUES
  // =========================================================

  const patientName = useMemo(() => {
    if (profile?.fullName) return profile.fullName;
    if (user?.fullName) return user.fullName;
    return "AyurNutri User";
  }, [profile, user]);

  const prakritiLabel = latestRecord?.dosha || "Not assessed yet";
  const currentStateLabel =
    latestRecord?.status || "No active clinical record";

  const doctorInfo = useMemo(() => {
    const doc = latestRecord?.doctorId;
    if (!doc) return null;
    return {
      name: doc.fullName || "Your Ayurvedic Doctor",
      email: doc.email || "",
      phone: doc.phoneNumber || "",
    };
  }, [latestRecord]);

  const dietPlan = latestRecord?.dietPlan || {
    breakfast: [],
    lunch: [],
    dinner: [],
  };

  const nutritionSummary = useMemo(() => {
    const meals = ["breakfast", "lunch", "dinner"];
    let total = 0;
    const perMeal = {};

    meals.forEach((m) => {
      const items = dietPlan[m] || [];
      const cal = items.reduce((sum, item) => {
        const raw = item.nutritionPerServing?.caloriesKcal || 0;
        return sum + (Number(raw) || 0);
      }, 0);
      total += cal;
      perMeal[m] = { count: items.length, calories: cal };
    });

    return { totalCalories: total, perMeal };
  }, [dietPlan]);

  const hasDiet =
    (dietPlan.breakfast?.length || 0) +
      (dietPlan.lunch?.length || 0) +
      (dietPlan.dinner?.length || 0) >
    0;

  // helper: safe navigate
  const handleNavigate = (target) => {
    if (typeof onNavigate === "function") {
      onNavigate(target);
    }
  };

  const formatDateTime = (val) => {
    if (!val) return "-";
    return new Date(val).toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // =========================================================
  // 4) LOADING / ERROR STATES
  // =========================================================

  if (overviewLoading && !overview) {
    return (
      <div className="w-full py-10 text-center text-text-secondary">
        Loading your wellness hub…
      </div>
    );
  }

  if (overviewError && !overview) {
    return (
      <div className="w-full py-10 text-center text-error text-sm">
        {overviewError}
      </div>
    );
  }

  // =========================================================
  // 5) MAIN UI
  // =========================================================
  return (
    <div className="w-full">
      {/* HEADER SECTION */}
      <div className="bg-muted p-6 rounded-xl shadow-sm mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-semibold text-text-primary">
              Namaste, {patientName}
            </h1>

            <p className="text-text-secondary mt-2">
              Welcome to your Ayurvedic wellness journey.
            </p>

            {nextAppointment ? (
              <p className="text-sm text-text-primary mt-2">
                <span className="font-medium">Next appointment:</span>{" "}
                {formatDateTime(nextAppointment.date || nextAppointment)}{" "}
                {nextAppointment.doctor?.fullName &&
                  `· with ${nextAppointment.doctor.fullName}`}
              </p>
            ) : (
              <p className="text-sm text-text-secondary mt-2">
                No upcoming appointment yet.
              </p>
            )}
          </div>

          <div className="border rounded-xl p-4 bg-card shadow-sm text-center min-w-[180px]">
            <p className="text-sm text-text-secondary">Prakriti</p>
            <p className="text-lg font-semibold text-primary">
              {prakritiLabel}
            </p>
            <p className="text-xs text-text-secondary">
              Current State: {currentStateLabel}
            </p>
          </div>
        </div>
      </div>

      {/* Action Cards – hover + clickable */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 mb-8">
        {/* Scan Food */}
        <button
          type="button"
          onClick={() => handleNavigate("food-scan")}
          className="bg-card rounded-xl p-6 border border-border shadow-sm text-left transition-all duration-200 hover:shadow-md hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon name="Camera" size={20} />
            </div>
          </div>
          <h3 className="font-semibold text-text-primary">Scan Food</h3>
          <p className="text-sm text-text-secondary">
            Analyze meals with Ayurvedic principles
          </p>
        </button>

        {/* Analytics */}
        <button
          type="button"
          onClick={() => handleNavigate("analytics")}
          className="bg-card rounded-xl p-6 border border-border shadow-sm text-left transition-all duration-200 hover:shadow-md hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name="BarChart3" size={20} />
          </div>
          <h3 className="font-semibold text-text-primary mt-3">Analytics</h3>
          <p className="text-sm text-text-secondary">
            View your nutrition & progress
          </p>
        </button>

        {/* Diet Plans – scroll to diet section */}
        <button
          type="button"
          onClick={() => {
            const el = document.getElementById("diet-plan-section");
            if (el) {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }}
          className="bg-card rounded-xl p-6 border border-border shadow-sm text-left transition-all duration-200 hover:shadow-md hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name="Apple" size={20} />
          </div>
          <h3 className="font-semibold text-text-primary mt-3">Diet Plans</h3>
          <p className="text-sm text-text-secondary">
            Personalized recommendations from your doctor
          </p>
        </button>

        {/* Sessions */}
        <button
          type="button"
          onClick={() => handleNavigate("sessions")}
          className="bg-card rounded-xl p-6 border border-border shadow-sm text-left transition-all duration-200 hover:shadow-md hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon name="CalendarDays" size={20} />
          </div>
          <h3 className="font-semibold text-text-primary mt-3">Sessions</h3>
          <p className="text-sm text-text-secondary">Book consultations</p>
        </button>
      </div>

      {/* DOCTOR + NUTRITION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* DOCTOR INFO CARD */}
        <div className="bg-muted rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-text-primary mb-3">
            Your Ayurvedic Doctor
          </h2>

          {doctorInfo ? (
            <div className="bg-card p-4 rounded-xl border shadow-sm flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="Stethoscope" size={20} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">
                    {doctorInfo.name}
                  </h3>
                  <p className="text-sm text-text-secondary">{doctorInfo.email}</p>
                  {doctorInfo.phone && (
                    <p className="text-xs text-primary">{doctorInfo.phone}</p>
                  )}
                </div>
              </div>

              <Button onClick={() => handleNavigate("sessions")}>
                Book Consultation
              </Button>
            </div>
          ) : (
            <div className="bg-card p-4 rounded-xl border shadow-sm text-text-secondary text-sm">
              No doctor assigned yet.
            </div>
          )}
        </div>

        {/* NUTRITION OVERVIEW */}
        <div className="bg-muted rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-text-primary mb-3">
            Today&apos;s Nutrition Overview
          </h2>

          {!hasDiet ? (
            <div className="bg-card p-4 rounded-xl border shadow-sm text-sm text-text-secondary">
              No diet plan assigned yet.
            </div>
          ) : (
            <div className="bg-card p-4 rounded-xl shadow-sm border">
              <p className="font-medium text-text-primary mb-1">Calories</p>

              <div className="w-full bg-muted h-3 rounded-full">
                <div
                  className="h-3 rounded-full bg-warning"
                  style={{
                    width: `${Math.min(
                      100,
                      (nutritionSummary.totalCalories / 2000) * 100
                    )}%`,
                  }}
                ></div>
              </div>

              <p className="text-right text-sm mt-1">
                {nutritionSummary.totalCalories} / 2000 kcal
              </p>

              <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                {["breakfast", "lunch", "dinner"].map((meal) => (
                  <div key={meal}>
                    <p className="font-medium text-text-primary">
                      {meal.charAt(0).toUpperCase() + meal.slice(1)}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {nutritionSummary.perMeal[meal]?.count ?? 0} items ·{" "}
                      {nutritionSummary.perMeal[meal]?.calories ?? 0} cal
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DIET + CLINICAL REPORTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Diet Plan Details */}
        <div
          id="diet-plan-section" // Diet Plans card scrolls here
          className="bg-muted rounded-xl p-6 shadow-sm"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-text-primary">
              Your Current Diet Plan
            </h2>
          </div>

          {!hasDiet ? (
            <div className="bg-card p-4 rounded-xl border shadow-sm text-sm text-text-secondary">
              No diet items added yet.
            </div>
          ) : (
            ["breakfast", "lunch", "dinner"].map((meal) => {
              const items = dietPlan[meal] || [];

              return (
                <div
                  key={meal}
                  className="bg-card p-4 rounded-xl border shadow-sm mb-4"
                >
                  <div className="flex justify-between mb-2">
                    <p className="font-medium text-text-primary">
                      {meal.charAt(0).toUpperCase() + meal.slice(1)}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {items.length} item(s)
                    </p>
                  </div>

                  {items.length === 0 ? (
                    <p className="text-xs text-text-secondary">
                      No items for this meal.
                    </p>
                  ) : (
                    <ul className="text-sm space-y-1">
                      {items.map((food, i) => (
                        <li
                          key={i}
                          className="flex justify-between text-text-primary"
                        >
                          {food.name ||
                            food.title ||
                            food["Food Item"] ||
                            "Food item"}
                          {food.nutritionPerServing?.caloriesKcal && (
                            <span className="text-xs text-text-secondary">
                              {food.nutritionPerServing.caloriesKcal} kcal
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Medical Reports & Prescriptions */}
        <div className="bg-muted rounded-xl p-6 shadow-sm">
          <h2 className="font-semibold text-text-primary mb-3">
            Medical Reports & Prescriptions
          </h2>

          {!latestRecord?.clinicalReports?.length ? (
            <div className="bg-card border rounded-xl shadow-sm p-4 text-sm text-text-secondary">
              No consultation notes available yet.
            </div>
          ) : (
            latestRecord.clinicalReports.map((rep, idx) => (
              <div
                key={rep._id || idx}
                className="bg-card border rounded-xl shadow-sm p-4 cursor-pointer hover:shadow-md transition mb-4"
              >
                <div className="flex justify-between">
                  <p className="font-semibold text-text-primary">
                    {rep.title || `Visit ${idx + 1}`}
                  </p>

                  <span className="text-xs text-text-secondary">
                    {new Date(rep.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-sm text-text-secondary mt-1">
                  {rep.summary || "Tap to view details"}
                </p>

                <button
                  onClick={() => setSelectedReport(rep)}
                  className="text-primary underline text-sm mt-2"
                >
                  View Details
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* WEEKLY PLAN BLOCK */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-text-primary mb-3">
          Weekly Diet & Exercise Plan
        </h2>

        {weeklyLoading && (
          <div className="text-sm text-text-secondary">Loading weekly plan…</div>
        )}

        {!weeklyLoading && weeklyError && (
          <div className="text-sm text-error">{weeklyError}</div>
        )}

        {!weeklyLoading &&
          !weeklyError &&
          clinicalPatientId &&
          latestPlanId && (
            <PatientWeekPlan
              patientId={clinicalPatientId}
              planId={latestPlanId}
            />
          )}

        {!weeklyLoading &&
          !weeklyError &&
          clinicalPatientId &&
          !latestPlanId && (
            <div className="text-sm text-text-secondary">
              Your doctor has not assigned a weekly plan yet.
            </div>
          )}

        {!weeklyLoading &&
          !weeklyError &&
          !clinicalPatientId && (
            <div className="text-sm text-text-secondary">
              Your account is not yet linked to a clinical record. Weekly plans
              will appear here once your doctor adds you.
            </div>
          )}

        {/* Simple Ayurvedic recommendations */}
        <div className="mt-4">
          {[
            {
              icon: "Sunrise",
              title: "Morning Routine",
              text:
                "Start your day with warm water and gentle movement. " +
                "Follow any specific guidance shared by your practitioner.",
            },
            {
              icon: "Salad",
              title: "Diet Tip",
              text: latestRecord?.dietPreferences
                ? `Keep your meals aligned with your preference: ${latestRecord.dietPreferences}. Avoid overeating and keep regular meal timings.`
                : "Favour freshly cooked, warm, lightly spiced meals. Avoid heavy, overly oily or very cold foods.",
            },
            {
              icon: "Flower2",
              title: "Mindfulness",
              text:
                "Practice slow, mindful eating. Sit down, avoid screens, and chew thoroughly to support digestion (Agni).",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-card border rounded-xl shadow-sm p-4 mb-3"
            >
              <p className="font-medium text-text-primary flex items-center space-x-2 text-lg">
                <Icon name={item.icon} size={18} className="text-primary" />
                <span>{item.title}</span>
              </p>
              <p className="text-sm text-text-secondary">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* HEALTH TIMELINE */}
      <div className="mt-12 bg-muted rounded-xl p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-text-primary mb-6">
          Your Health Timeline
        </h2>

        {(() => {
          const reports = latestRecord?.clinicalReports || [];
          const appts = appointments || [];

          const combined = [
            ...reports.map((r) => ({
              type: "report",
              date: r.createdAt,
              title: r.title || "Clinical Report",
              description:
                r.summary || r.diagnosis || "Doctor’s note added",
              data: r,
            })),
            ...appts.map((a) => ({
              type: "appointment",
              date: a.createdAt || a.date,
              title: a.sessionType || "Appointment",
              description: `Consultation with doctor`,
              data: a,
            })),
          ].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          );

          if (combined.length === 0) {
            return (
              <p className="text-text-secondary bg-card p-4 rounded-xl border shadow-sm">
                No medical activity recorded yet.
              </p>
            );
          }

          return (
            <div className="relative border-l-2 border-primary pl-6 space-y-8">
              {combined.map((event, i) => (
                <div key={i} className="relative">
                  {/* Dot */}
                  <div className="absolute -left-[11px] w-5 h-5 bg-primary rounded-full border-2 border-white"></div>

                  {/* Content */}
                  <div className="bg-card p-4 rounded-xl shadow-sm border">
                    <p className="text-xs text-text-secondary">
                      {new Date(event.date).toLocaleString()}
                    </p>

                    <h3 className="text-lg font-semibold text-text-primary mt-1 flex items-center gap-2">
                      <Icon name={event.type === "report" ? "FileText" : "CalendarDays"} size={15} className="inline mr-1.5 -mt-0.5" />{event.title}
                    </h3>

                    <p className="text-sm text-text-secondary mt-1">
                      {event.description}
                    </p>

                    {event.type === "report" && (
                      <button
                        onClick={() => setSelectedReport(event.data)}
                        className="text-primary underline text-sm mt-2"
                      >
                        View Report
                      </button>
                    )}

                    {event.type === "appointment" && (
                      <p className="text-sm text-primary mt-2">
                        Appointment booked
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          );
        })()}
      </div>

      {/* REPORT POPUP MODAL */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl shadow-xl p-6 max-w-xl w-full relative">
            {/* Close Button */}
            <button
              className="absolute top-3 right-3 text-text-secondary hover:text-text-primary"
              onClick={() => setSelectedReport(null)}
            >
              <Icon name="X" size={18} />
            </button>

            {/* Title */}
            <h2 className="text-xl font-semibold text-text-primary">
              {selectedReport.title}
            </h2>

            <p className="text-sm text-text-secondary mt-1">
              {new Date(selectedReport.createdAt).toLocaleString()}
            </p>

            <div className="mt-4 space-y-3 text-text-primary text-sm">
              {selectedReport.diagnosis && (
                <div>
                  <p className="font-medium text-text-primary">Diagnosis</p>
                  <p>{selectedReport.diagnosis}</p>
                </div>
              )}

              {selectedReport.notes && (
                <div>
                  <p className="font-medium text-text-primary">Notes</p>
                  <p className="whitespace-pre-line">
                    {selectedReport.notes}
                  </p>
                </div>
              )}

              {selectedReport.testsRecommended && (
                <div>
                  <p className="font-medium text-text-primary">
                    Tests Recommended
                  </p>
                  <p>{selectedReport.testsRecommended}</p>
                </div>
              )}

              {selectedReport.plan && (
                <div>
                  <p className="font-medium text-text-primary">Treatment Plan</p>
                  <p className="whitespace-pre-line">{selectedReport.plan}</p>
                </div>
              )}
            </div>

            {/* DOWNLOAD BUTTON */}
            <button
              className="mt-6 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
              onClick={() => downloadReport(selectedReport)}
            >
              Download Prescription
            </button>
          </div>
        </div>
      )}

      {overviewError && overview && (
        <div className="mt-4 text-sm text-error">{overviewError}</div>
      )}
    </div>
  );
};

// =========================================================
// DOWNLOAD TXT REPORT
// =========================================================

function downloadReport(rep) {
  const content = `
<Icon name="FileText" size={18} className="inline mr-1.5 -mt-0.5" />Ayurvedic Consultation Report
--------------------------------------
Title: ${rep.title}
Date: ${new Date(rep.createdAt).toLocaleString()}

Diagnosis:
${rep.diagnosis || "-"}

Notes:
${rep.notes || "-"}

Tests Recommended:
${rep.testsRecommended || "-"}

Treatment / Plan:
${rep.plan || "-"}

Follow-up Date:
${
  rep.followUpDate ? new Date(rep.followUpDate).toLocaleDateString() : "-"
}
`;

  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${rep.title || "prescription"}.txt`;
  a.click();

  URL.revokeObjectURL(url);
}

export default DashboardHome;
