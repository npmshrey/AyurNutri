import express from "express";
import Appointment from "../models/appointment.js";
import Patient from "../models/Patient.js";
import Doctor from "../models/doctor.js";

const router = express.Router();

/* ------------------ CREATE NEW APPOINTMENT ------------------ */
router.post("/", async (req, res) => {
  try {
    const { patientId, doctorId, sessionType, date, time } = req.body;

    if (!patientId || !doctorId || !sessionType || !date || !time) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const patientExists = await Patient.findById(patientId);
    if (!patientExists) {
      return res.status(404).json({ success: false, message: "Patient not found" });
    }

    const doctorExists = await Doctor.findById(doctorId);
    if (!doctorExists) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    const existing = await Appointment.findOne({ doctorId, date, time });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "This slot is already booked. Choose another time.",
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
      message: "Appointment created successfully",
      appointment: newAppointment,
    });

  } catch (err) {
    console.error("Appointment Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/* --------------- GET APPOINTMENTS BY PATIENT ID --------------- */
router.get("/patient/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const appointments = await Appointment.find({ patientId: id })
      .populate("doctorId", "fullName email phoneNumber verified")
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      appointments,
    });

  } catch (err) {
    console.error("Fetch appointments error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/* --------------- GET APPOINTMENTS BY DOCTOR ID (NEW) --------------- */
router.get("/doctor/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const appointments = await Appointment.find({ doctorId: id })
      .populate("patientId", "fullName email phoneNumber age gender")
      .sort({ date: 1, time: 1 });

    return res.json({
      success: true,
      appointments,
    });

  } catch (err) {
    console.error("Fetch doctor appointments error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

/* ------------------ DELETE APPOINTMENT ------------------ */
router.delete("/:id", async (req, res) => {
  try {
    const aptId = req.params.id;

    const deleted = await Appointment.findByIdAndDelete(aptId);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    return res.json({
      success: true,
      message: "Appointment deleted successfully",
    });

  } catch (err) {
    console.error("Delete Appointment Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
