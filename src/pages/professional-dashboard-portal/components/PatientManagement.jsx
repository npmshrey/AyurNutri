import React, { useState } from "react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

const PatientManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedDosha, setSelectedDosha] = useState("all");
  const [patients, setPatients] = useState([
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
    },
  ]);

  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    dosha: "vata",
    condition: "",
    status: "new",
  });

  const filterOptions = [
    { value: "all", label: "All Patients" },
    { value: "active", label: "Active Treatment" },
    { value: "followup", label: "Follow-up Required" },
    { value: "new", label: "New Patients" },
    { value: "completed", label: "Treatment Completed" },
  ];

  const doshaOptions = [
    { value: "all", label: "All Doshas" },
    { value: "vata", label: "Vata" },
    { value: "pitta", label: "Pitta" },
    { value: "kapha", label: "Kapha" },
    { value: "vata-pitta", label: "Vata-Pitta" },
    { value: "pitta-kapha", label: "Pitta-Kapha" },
    { value: "kapha-vata", label: "Kapha-Vata" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success";
      case "followup":
        return "bg-warning/10 text-warning";
      case "new":
        return "bg-secondary/10 text-secondary";
      case "completed":
        return "bg-primary/10 text-primary";
      default:
        return "bg-muted text-text-secondary";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "active":
        return "Active";
      case "followup":
        return "Follow-up";
      case "new":
        return "New";
      case "completed":
        return "Completed";
      default:
        return status;
    }
  };

  const getDoshaColor = (dosha) => {
    if (dosha?.includes("Vata")) return "bg-blue-100 text-blue-800";
    if (dosha?.includes("Pitta")) return "bg-red-100 text-red-800";
    if (dosha?.includes("Kapha")) return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-800";
  };

  // open modal
  const handleNewPatient = () => setShowNewPatientModal(true);

  // handle save
  const handleSavePatient = () => {
    if (!newPatient.name || !newPatient.age || !newPatient.condition) {
      alert("Please fill all fields!");
      return;
    }

    const newId = patients.length + 1;
    setPatients([
      ...patients,
      {
        id: newId,
        ...newPatient,
        lastVisit: new Date().toISOString(),
        nextAppointment: null,
        progress: 0,
      },
    ]);
    setNewPatient({
      name: "",
      age: "",
      dosha: "vata",
      condition: "",
      status: "new",
    });
    setShowNewPatientModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-semibold text-primary">
            Patient Management
          </h2>
          <p className="text-text-secondary">
            Manage your patients and track their progress
          </p>
        </div>
        <Button
          variant="default"
          iconName="UserPlus"
          iconPosition="left"
          onClick={handleNewPatient}
        >
          Add New Patient
        </Button>
      </div>

      {/* Patient List */}
      <div className="bg-card rounded-lg border border-border organic-shadow">
        <div className="p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-text-primary">
            Patients ({patients?.length})
          </h3>
        </div>

        <div className="divide-y divide-border">
          {patients?.map((patient) => (
            <div
              key={patient?.id}
              className="p-4 hover:bg-muted/30 organic-transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-text-primary">
                      {patient?.name}
                    </h4>
                    <span className="text-sm text-text-secondary">
                      ({patient?.age}y)
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getDoshaColor(
                        patient?.dosha
                      )}`}
                    >
                      {patient?.dosha}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary">
                    {patient?.condition}
                  </p>
                </div>

                <span
                  className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                    patient?.status
                  )}`}
                >
                  {getStatusLabel(patient?.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* New Patient Modal */}
      {showNewPatientModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Patient</h3>

            <Input
              placeholder="Full Name"
              value={newPatient.name}
              onChange={(e) =>
                setNewPatient({ ...newPatient, name: e.target.value })
              }
              className="mb-3"
            />
            <Input
              type="number"
              placeholder="Age"
              value={newPatient.age}
              onChange={(e) =>
                setNewPatient({ ...newPatient, age: e.target.value })
              }
              className="mb-3"
            />
            <Select
              options={doshaOptions.filter((o) => o.value !== "all")}
              value={newPatient.dosha}
              onChange={(val) => setNewPatient({ ...newPatient, dosha: val })}
              placeholder="Select Dosha"
              className="mb-3"
            />
            <Input
              placeholder="Condition"
              value={newPatient.condition}
              onChange={(e) =>
                setNewPatient({ ...newPatient, condition: e.target.value })
              }
              className="mb-3"
            />
            <Select
              options={filterOptions.filter((o) => o.value !== "all")}
              value={newPatient.status}
              onChange={(val) => setNewPatient({ ...newPatient, status: val })}
              placeholder="Select Status"
              className="mb-3"
            />

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowNewPatientModal(false)}
              >
                Cancel
              </Button>
              <Button variant="default" onClick={handleSavePatient}>
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientManagement;
