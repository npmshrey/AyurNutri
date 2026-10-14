// Diet plan builder. Two ways in:
//  - /doctor/diet-builder/:patientId  (from a patient's record) — full page
//  - the "Plan Generation" section of the dashboard — embedded, no patient
//    chosen yet, so it shows a picker.
//
// Before: it printed the patient's raw database id as their name, and its
// Back button called navigate(-1), which inside the dashboard threw the
// doctor out of the portal altogether.
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Header from "../../../components/ui/Header";
import Icon from "../../../components/AppIcon";
import FoodCardList from "./FoodCardList";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";
const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("authToken")}` });

const DoctorDietBuilderPage = ({ embedded = false }) => {
  const params = useParams();
  const [patientId, setPatientId] = useState(params.patientId || "");
  const [patients, setPatients] = useState([]);
  const [current, setCurrent] = useState(null);
  const [loadError, setLoadError] = useState("");

  // Patient list for the picker.
  useEffect(() => {
    axios
      .get(`${API_BASE}/api/patients`, { headers: authHeader() })
      .then((res) => setPatients(Array.isArray(res.data) ? res.data : res.data?.patients || []))
      .catch(() => setLoadError("Couldn't load your patients."));
  }, []);

  // Name and details of the chosen patient.
  useEffect(() => {
    if (!patientId) {
      setCurrent(null);
      return;
    }
    axios
      .get(`${API_BASE}/api/patients/${patientId}`, { headers: authHeader() })
      .then((res) => setCurrent(res.data?.patient || res.data))
      .catch(() => setCurrent(null));
  }, [patientId]);

  const body = (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card p-6 shadow-[var(--shadow-organic)] sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Diet plan builder</p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-text-primary sm:text-3xl">
            {current ? `Plan for ${current.name}` : "Choose a patient to start"}
          </h1>
          {current && (
            <p className="mt-1 text-sm text-text-secondary">
              {[current.dosha && `Dosha: ${current.dosha}`, current.condition, current.age && `${current.age} yrs`]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
        </div>

        <div className="w-full sm:w-72">
          <label htmlFor="diet-patient" className="text-xs font-medium text-text-secondary">
            Patient
          </label>
          <div className="relative mt-1">
            <select
              id="diet-patient"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="h-11 w-full appearance-none bg-none rounded-lg border border-border bg-input px-3.5 pr-10 text-sm text-text-primary focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
            >
              <option value="">{patients.length ? "Select a patient" : "No linked patients yet"}</option>
              {patients.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name || p.patientAccountId?.fullName || "Unnamed patient"}
                </option>
              ))}
            </select>
            <Icon name="ChevronDown" size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
          </div>
          {loadError && <p className="mt-1 text-xs text-destructive">{loadError}</p>}
        </div>
      </div>

      {patientId ? (
        <FoodCardList patientId={patientId} />
      ) : (
        <div className="rounded-3xl border border-dashed border-border bg-card/60 p-10 text-center">
          <Icon name="Users" size={28} className="mx-auto text-text-secondary" />
          <p className="mt-3 font-medium text-text-primary">Pick a patient above to open the food library.</p>
          <p className="mt-1 text-sm text-text-secondary">
            Patients appear here once you've linked them in Patient Management.
          </p>
        </div>
      )}
    </div>
  );

  if (embedded) return body;

  return (
    <div className="min-h-screen bg-background">
      <Header fluid />
      <main className="page-container pb-16 pt-24">
        <Link
          to="/professional-dashboard-portal?section=patients"
          className="mb-5 inline-flex items-center gap-1.5 text-sm text-text-secondary transition-colors hover:text-primary"
        >
          <Icon name="ArrowLeft" size={15} />
          Back to patients
        </Link>
        {body}
      </main>
    </div>
  );
};

export default DoctorDietBuilderPage;
