import express from "express";
import Conversation from "../models/Conversation.js";
import ChatMessage from "../models/ChatMessage.js";
import Patient from "../models/Patient.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();


/* -----------------------------------------------------------
   0) GET ALL DOCTORS ASSIGNED TO A PATIENT
----------------------------------------------------------- */
router.get("/patient/my-doctors", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "patient") {
      return res.status(403).json({ message: "Patient access required" });
    }

    const patientId = req.user.id;

    const convos = await Conversation.find({ patientId })
      .populate("doctorId", "fullName email specialty avatar phoneNumber location");

    const doctors = convos.map((c) => ({
      id: c.doctorId._id,
      name: c.doctorId.fullName,
      email: c.doctorId.email,
      specialty: c.doctorId.specialty || "Ayurvedic Specialist",
      avatar: c.doctorId.avatar || "https://i.pravatar.cc/300",
      phone: c.doctorId.phoneNumber,
      location: c.doctorId.location || "Clinic",
    }));

    res.json(doctors);

  } catch (err) {
    console.error("❌ Error fetching doctors for patient:", err);
    res.status(500).json({ message: "Failed to load doctors" });
  }
});



/* -----------------------------------------------------------
   ⭐ NEW: LIST ALL PATIENTS FOR DOCTOR (even without chat)
----------------------------------------------------------- */
router.get("/doctor/all-patients", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Doctor access required" });
    }

    const patients = await Patient.find({}, "fullName avatar dosha status");

    const formatted = patients.map((p) => ({
      id: p._id,
      name: p.fullName,
      avatar: p.avatar || "https://i.pravatar.cc/300",
      dosha: p.dosha || "Vata",
      status: p.status || "offline",
    }));

    res.json(formatted);

  } catch (err) {
    console.error("❌ Error fetching all patients:", err);
    res.status(500).json({ message: "Failed to load patients" });
  }
});



/* -----------------------------------------------------------
   1) GET DOCTOR’S EXISTING CONVERSATIONS
----------------------------------------------------------- */
router.get("/doctor/me/conversations", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "doctor") {
      return res.status(403).json({ message: "Doctor access required" });
    }

    const doctorId = req.user.id;

    const convos = await Conversation.find({ doctorId })
      .populate("patientId", "fullName avatar dosha status")
      .sort({ lastMessageAt: -1 });

    const formatted = convos.map((c) => ({
      id: c._id,
      patientId: c.patientId._id,
      patient: {
        name: c.patientId.fullName,
        avatar: c.patientId.avatar,
        dosha: c.patientId.dosha || "Vata",
        status: c.patientId.status || "offline",
      },
      lastMessage: c.lastMessage || "",
      timestamp: c.lastMessageAt,
      unread: c.unreadCountForDoctor || 0,
      priority: "normal",
    }));

    res.json(formatted);

  } catch (err) {
    console.error("❌ Error fetching doctor conversations:", err);
    res.status(500).json({ message: "Failed to load conversations" });
  }
});



/* -----------------------------------------------------------
   2) LOAD ALL MESSAGES IN A THREAD (doctor <-> patient)
----------------------------------------------------------- */
router.get("/thread", verifyToken, async (req, res) => {
  try {
    const { patientId, doctorId } = req.query;

    let convo = await Conversation.findOne({ patientId, doctorId });

    if (!convo) return res.json([]); // No messages yet

    const messages = await ChatMessage.find({
      conversationId: convo._id,
    }).sort({ createdAt: 1 });

    res.json(messages);

  } catch (err) {
    console.error("❌ Error loading messages:", err);
    res.status(500).json({ message: "Failed to load messages" });
  }
});



/* -----------------------------------------------------------
   3) SEND MESSAGE (Patient → Doctor OR Doctor → Patient)
----------------------------------------------------------- */
router.post("/send", verifyToken, async (req, res) => {
  try {
    const { patientId, doctorId, text } = req.body;

    if (!patientId || !doctorId || !text) {
      return res.status(400).json({ message: "Missing fields" });
    }

    // Conversation Exists?
    let convo = await Conversation.findOne({ patientId, doctorId });

    // Create if not exists
    if (!convo) {
      convo = await Conversation.create({
        doctorId,
        patientId,
        lastMessage: text,
        lastMessageAt: new Date(),
      });
    }

    // Save Message
    const msg = await ChatMessage.create({
      conversationId: convo._id,
      patientId,
      doctorId,
      senderRole: req.user.role,
      text,
    });

    // Update conversation meta
    convo.lastMessage = text;
    convo.lastMessageAt = new Date();

    if (req.user.role === "doctor") {
      convo.unreadCountForPatient += 1;
    } else {
      convo.unreadCountForDoctor += 1;
    }

    await convo.save();

    res.json(msg);

  } catch (err) {
    console.error("❌ Error sending message:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
});



export default router;
