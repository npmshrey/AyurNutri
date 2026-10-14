import React, { useState, useEffect } from "react";
import { API_BASE } from "../../../lib/api";
import axios from "axios";
import BookingModal from "./BookingModal";
import useAuth from "../../../hooks/useAuth";

const Sessions = () => {
  const [selected] = useState("Initial Consultation"); // default type
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [appointments, setAppointments] = useState([]);

  // Default tab
  const [activeTab, setActiveTab] = useState("book");

  const { user } = useAuth();
  const patientId = user?._id || user?.id || localStorage.getItem("patientId");

  const formatDate = (d) => {
    if (!d.includes("-")) return d;
    const [day, month, year] = d.split("-");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    // Fetch Doctors
    axios
      .get(`${API_BASE}/api/doctors`)
      .then((res) => setDoctors(res.data))
      .catch((err) => console.error("Error loading doctors:", err));

    // Fetch Appointments
    if (patientId) {
      axios
        .get(`${API_BASE}/api/appointments/patient/${patientId}`)
        .then((res) => setAppointments(res.data.appointments || []))
        .catch((err) => console.error("Error fetching appointments:", err));
    }
  }, [patientId]);

  const handleBookClick = (doc) => {
    setSelectedDoctor(doc);
    setShowModal(true);
  };

  const handleConfirmBooking = async () => {
    try {
      if (!patientId) return alert("Patient ID missing. Please login again.");

      await axios.post(`${API_BASE}/api/appointments`, {
        patientId,
        doctorId: selectedDoctor._id,
        sessionType: selected,
        date: formatDate(date),
        time,
      });

      alert("Appointment Booked Successfully!");
      setShowModal(false);
      setDate("");
      setTime("");
      setSelectedDoctor(null);

      const res = await axios.get(
        `${API_BASE}/api/appointments/patient/${patientId}`
      );
      setAppointments(res.data.appointments || []);
    } catch (err) {
      console.error("BOOKING ERROR:", err);
      alert("Error booking appointment");
    }
  };

  return (
    <>
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <div className="bg-[#f5efe6] p-6 md:p-10 rounded-2xl shadow-sm">
          <h2 className="text-3xl font-semibold text-gray-900">Sessions</h2>
          <p className="text-gray-600 mt-1">
            Book consultations and manage your appointments
          </p>

          <div className="mt-8 bg-white p-6 rounded-xl shadow-sm">
            {/* Tabs */}
            <div className="mb-6">
              <ul className="flex gap-8 border-b pb-3 text-sm md:text-base">
                <li
                  className={`cursor-pointer pb-2 ${
                    activeTab === "book"
                      ? "text-emerald-700 font-semibold border-b-2 border-emerald-700"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("book")}
                >
                  Book Session
                </li>

                <li
                  className={`cursor-pointer pb-2 ${
                    activeTab === "scheduled"
                      ? "text-emerald-700 font-semibold border-b-2 border-emerald-700"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("scheduled")}
                >
                  Scheduled Sessions
                </li>

                <li
                  className={`cursor-pointer pb-2 ${
                    activeTab === "history"
                      ? "text-emerald-700 font-semibold border-b-2 border-emerald-700"
                      : "text-gray-500"
                  }`}
                  onClick={() => setActiveTab("history")}
                >
                  Session History
                </li>
              </ul>
            </div>

            {/* Default tab fix */}
            {!activeTab && setActiveTab("book")}

            {/* TAB 1 — BOOK SESSION */}
            {activeTab === "book" && (
              <>
                {/* Doctor List */}
                <div className="mt-4 space-y-4">
                  {doctors.length === 0 ? (
                    <p className="text-gray-500">No doctors available.</p>
                  ) : (
                    doctors.map((doc) => (
                      <div
                        key={doc._id}
                        className="p-5 border rounded-xl shadow-sm bg-white hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {doc.fullName}
                            </h3>

                            {/* ➡️ SPECIALIZATION ADDED */}
                            <p className="text-gray-600 text-sm mt-1">
                              {doc.specialization || "Ayurveda Specialist"}
                            </p>
                          </div>

                          {doc.verified && (
                            <span className="text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full text-xs font-medium">
                              Verified
                            </span>
                          )}
                        </div>

                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={() => handleBookClick(doc)}
                            className="px-6 py-2 rounded-lg text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition"
                          >
                            Book
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}

            {/* TAB 2 — SCHEDULED SESSIONS */}
            {activeTab === "scheduled" && (
              <div className="mt-4 space-y-4">
                {appointments.length === 0 ? (
                  <p className="text-gray-500">No scheduled sessions.</p>
                ) : (
                  appointments.map((apt) => (
                    <div
                      key={apt._id}
                      className="p-5 border rounded-xl shadow-sm bg-emerald-50 flex justify-between items-start"
                    >
                      <div>
                        <h3 className="font-semibold text-lg">
                          {apt.sessionType}
                        </h3>

                        <p className="text-gray-700 mt-1">
                          Doctor: {apt.doctorId?.fullName}
                        </p>

                        <p className="text-gray-600 mt-1">
                          Date: {apt.date} • Time: {apt.time}
                        </p>

                        <span className="text-sm text-emerald-700 font-medium">
                          Status: {apt.status}
                        </span>
                      </div>

                      <button
                        onClick={async () => {
                          const ok = window.confirm("Delete appointment?");
                          if (!ok) return;

                          try {
                            await axios.delete(
                              `${API_BASE}/api/appointments/${apt._id}`
                            );

                            const res = await axios.get(
                              `${API_BASE}/api/appointments/patient/${patientId}`
                            );
                            setAppointments(res.data.appointments || []);
                          } catch (err) {
                            console.error("DELETE ERROR:", err);
                            alert("Failed to delete appointment");
                          }
                        }}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {showModal && (
        <BookingModal
          doctor={selectedDoctor}
          date={date}
          setDate={setDate}
          time={time}
          setTime={setTime}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmBooking}
        />
        
      )}
    </>
  );
};

export default Sessions;
