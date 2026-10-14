import express from "express";
import Appointment from "../models/appointment.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/doctor.js";
import ClinicalPatient from "../models/ClinicalPatient.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Every appointment route needs a signed-in user. These routes used to be
// open, so anyone could list, book, accept or delete any appointment.
router.use(verifyToken);

const isOwner = (apt, user) =>
  (user.role === "patient" && String(apt.patientId?._id || apt.patientId) === String(user.id)) ||
  (user.role === "doctor" && String(apt.doctorId?._id || apt.doctorId) === String(user.id));

/* ------------------ CREATE NEW APPOINTMENT ------------------ */
router.post("/", async (req, res) => {
  try {
    if (req.user.role !== "patient") {
      return res.status(403).json({ success: false, message: "Only patients can book appointments" });
    }
    // Book for the signed-in patient, never for an id sent in the body.
    const patientId = req.user.id;
    const { doctorId, sessionType, date, time } = req.body;

    if (!patientId || !doctorId || !sessionType || !date || !time) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const patientExists = await Patient.findById(patientId);
    const doctorExists = await Doctor.findById(doctorId);

    if (!patientExists)
      return res
        .status(404)
        .json({ success: false, message: "Patient not found" });
    if (!doctorExists)
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });

    const existingSlot = await Appointment.findOne({
      doctorId,
      date,
      time,
    });

    if (existingSlot) {
      return res.status(409).json({
        success: false,
        message: "This slot is already booked",
      });
    }

    const newAppointment = await Appointment.create({
      patientId,
      doctorId,
      sessionType,
      date,
      time,
      status: "Scheduled",
    });

    return res.json({
      success: true,
      appointment: newAppointment,
    });
  } catch (err) {
    console.error("Appointment Error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Server error" });
  }
});

/* ------------------ ACCEPT APPOINTMENT (ENHANCED) ------------------ */
router.post("/:id/accept", async (req, res) => {
  try {
    const aptId = req.params.id;

    const appointment = await Appointment.findById(aptId)
      .populate("patientId")
      .populate("doctorId");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    if (req.user.role !== "doctor" || !isOwner(appointment, req.user)) {
      return res.status(403).json({ success: false, message: "Not your appointment" });
    }

    if (!appointment.patientId) {
      return res.status(400).json({
        success: false,
        message: "Invalid patient assigned",
      });
    }

    if (!appointment.doctorId) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor assigned",
      });
    }

    // UPDATE STATUS
    appointment.status = "Accepted";
    await appointment.save();

    // FIND CLINICAL PATIENT IF EXISTS
    let clinical = await ClinicalPatient.findOne({
      doctorId: appointment.doctorId._id,
      patientAccountId: appointment.patientId._id,
    });

    // CREATE NEW CLINICAL PATIENT RECORD IF NOT EXISTING
    if (!clinical) {
      clinical = await ClinicalPatient.create({
        name: appointment.patientId.fullName || "Unnamed",
        age: appointment.patientId.age || null,
        dosha: "vata",
        condition: appointment.sessionType,
        status: "new",
        doctorId: appointment.doctorId._id,
        patientAccountId: appointment.patientId._id,
        lastVisit: new Date(),
      });
    }

    /* ------------------ NEW FEATURE: ADD APPOINTMENT HISTORY ------------------ */
    if (!Array.isArray(clinical.appointmentHistory)) {
  clinical.appointmentHistory = [];
}
    clinical.appointmentHistory.push({
      appointmentId: appointment._id,
      doctorId: appointment.doctorId._id,
      sessionType: appointment.sessionType,
      date: new Date(`${appointment.date} ${appointment.time}`),
      summary: "Appointment marked as completed",
      clinicalReportId: null, // Will be filled when doctor creates a report
    });

    await clinical.save();
    /* ------------------------------------------------------------------------ */

    const populated = await ClinicalPatient.findById(clinical._id).populate(
      "patientAccountId",
      "fullName email phoneNumber"
    );

    return res.json({
      success: true,
      message: "Appointment accepted",
      patient: populated,
    });
  } catch (err) {
    console.error("Accept appointment error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error during accept",
      error: err.message,
    });
  }
});

/* ------------------ REJECT APPOINTMENT ------------------ */
router.post("/:id/reject", async (req, res) => {
  try {
    const aptId = req.params.id;

    const apt = await Appointment.findById(aptId);
    if (!apt)
      return res
        .status(404)
        .json({ success: false, message: "Appointment not found" });

    if (req.user.role !== "doctor" || !isOwner(apt, req.user)) {
      return res.status(403).json({ success: false, message: "Not your appointment" });
    }

    apt.status = "Rejected";
    await apt.save();

    return res.json({ success: true, message: "Appointment rejected" });
  } catch (err) {
    console.error("Reject Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* ------------------ GET APPOINTMENTS BY PATIENT ------------------ */
router.get("/patient/:id", async (req, res) => {
  try {
    // A patient sees their own; a doctor sees only this patient's
    // appointments that are with them.
    const filter = { patientId: req.params.id };
    if (req.user.role === "patient") {
      if (String(req.user.id) !== String(req.params.id)) {
        return res.status(403).json({ success: false, message: "Not your appointments" });
      }
    } else if (req.user.role === "doctor") {
      filter.doctorId = req.user.id;
    } else {
      return res.status(403).json({ success: false, message: "Access not allowed" });
    }
    const appointments = await Appointment.find(filter)
      .populate("doctorId", "fullName email phoneNumber verified")
      .sort({ createdAt: -1 });

    return res.json({ success: true, appointments });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* ------------------ GET APPOINTMENTS BY DOCTOR ------------------ */
router.get("/doctor/:id", async (req, res) => {
  try {
    if (req.user.role !== "doctor" || String(req.user.id) !== String(req.params.id)) {
      return res.status(403).json({ success: false, message: "Not your appointments" });
    }
    const appointments = await Appointment.find({
      doctorId: req.params.id,
    })
      .populate(
        "patientId",
        "fullName email phoneNumber age gender"
      )
      .sort({ date: 1, time: 1 });

    return res.json({ success: true, appointments });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

/* ------------------ DELETE APPOINTMENT ------------------ */
router.delete("/:id", async (req, res) => {
  try {
    const apt = await Appointment.findById(req.params.id);

    if (!apt) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }
    if (!isOwner(apt, req.user)) {
      return res.status(403).json({ success: false, message: "Not your appointment" });
    }
    await apt.deleteOne();

    return res.json({
      success: true,
      message: "Appointment deleted",
    });
  } catch (err) {
    console.error("Delete Error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;
