// Opened from an appointment in the practitioner dashboard:
// /professional-dashboard-portal/patient/:patientId  (patient *account* id)
//
// This page and the endpoint it calls both existed only on one side before:
// the route was never registered and the API returned 404 for everything.
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../../components/ui/Header";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";
import { useEnter } from "../../lib/motion";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const Stat = ({ label, value }) => (
  <div className="rounded-2xl border border-border bg-background/60 p-4">
    <p className="text-xs text-text-secondary">{label}</p>
    <p className="mt-1 font-medium text-text-primary">{value || "-"}</p>
  </div>
);

export default function PatientCaseProfile() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const ref = useRef(null);
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get(`${API_BASE}/api/patients/by-account/${patientId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!cancelled) setPatient(res.data.patient);
      } catch (err) {
        if (!cancelled) setError(err?.response?.data?.message || "Couldn't load this patient.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [patientId]);

  useEnter(ref, {}, [patient, error]);

  const reports = patient?.clinicalReports || [];

  return (
    <div ref={ref} className="min-h-screen bg-background">
      <Header />
      <main className="page-container pb-16 pt-24">
        <Link
          to="/professional-dashboard-portal"
          className="inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-primary"
        >
          <Icon name="ArrowLeft" size={15} />
          Back to dashboard
        </Link>

        {error && (
          <div data-enter className="mx-auto mt-10 max-w-lg rounded-3xl border border-border bg-card p-8 text-center shadow-[var(--shadow-organic)]">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-warning/10 text-warning">
              <Icon name="UserX" size={22} />
            </span>
            <h1 className="mt-4 font-display text-2xl font-semibold text-text-primary">{error}</h1>
            <p className="mt-2 text-sm text-text-secondary">
              Add them from Patient Management using the email or phone they signed up with.
            </p>
            <Button className="mt-6 rounded-md" onClick={() => navigate("/professional-dashboard-portal?section=patients")}>
              Go to Patient Management
            </Button>
          </div>
        )}

        {!error && !patient && (
          <div className="mt-8 space-y-4" aria-busy="true">
            <div className="h-10 w-72 animate-pulse rounded-lg bg-muted" />
            <div className="h-40 animate-pulse rounded-3xl bg-muted" />
          </div>
        )}

        {patient && (
          <>
            <div data-enter className="mt-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="eyebrow">Patient case</p>
                <h1 className="mt-2 font-display text-3xl font-semibold text-text-primary sm:text-4xl">{patient.name}</h1>
                <p className="mt-1 text-sm text-text-secondary">
                  {patient.patientAccountId?.email}
                  {patient.patientAccountId?.phoneNumber ? ` · ${patient.patientAccountId.phoneNumber}` : ""}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="rounded-md" onClick={() => navigate(`/doctor/diet-builder/${patient._id}`)}>
                  <Icon name="Salad" size={16} className="mr-2" /> Diet builder
                </Button>
                <Button className="rounded-md" onClick={() => navigate(`/doctor/week-planner/${patient._id}`)}>
                  <Icon name="CalendarDays" size={16} className="mr-2" /> Week planner
                </Button>
              </div>
            </div>

            <section data-enter className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Stat label="Age" value={patient.age} />
              <Stat label="Dosha" value={patient.dosha} />
              <Stat label="Condition" value={patient.condition} />
              <Stat label="Status" value={patient.status} />
              <Stat label="Height / weight" value={patient.heightCm || patient.weightKg ? `${patient.heightCm || "-"} cm · ${patient.weightKg || "-"} kg` : ""} />
              <Stat label="Blood pressure" value={patient.bloodPressure} />
              <Stat label="Allergies" value={patient.allergies} />
              <Stat label="Medications" value={patient.medications} />
            </section>

            <section data-enter className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-organic)] sm:p-8">
              <h2 className="font-display text-xl font-semibold text-text-primary">Clinical notes</h2>
              {reports.length === 0 ? (
                <p className="mt-3 text-sm text-text-secondary">No notes yet. Add one from Patient Management.</p>
              ) : (
                <ol className="mt-5 space-y-4 border-l border-border pl-5">
                  {[...reports].reverse().map((r) => (
                    <li key={r._id} className="relative">
                      <span className="absolute -left-[25px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
                      <p className="text-xs text-text-secondary">{new Date(r.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
                      <h3 className="font-medium text-text-primary">{r.title}</h3>
                      {r.summary && <p className="mt-1 text-sm text-text-secondary">{r.summary}</p>}
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}
