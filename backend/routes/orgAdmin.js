import express from "express";
import Doctor from "../models/doctor.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

/* ============================
   VERIFY ORG ADMIN
============================ */
function verifyOrgAdmin(req, res, next) {
  if (req.user?.role !== "org-admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
  next();
}

/* ============================
   GET PENDING + APPROVED DOCTORS
============================ */
router.get("/doctors", verifyToken, verifyOrgAdmin, async (req, res) => {
  try {
    const orgName = req.user.organisationName;

    if (!orgName) {
      return res.status(400).json({ message: "Organisation name missing in token" });
    }

    const pending = await Doctor.find({
      organisationName: orgName,
      approvalStatus: "pending",
      isApproved: false
    });

    const approved = await Doctor.find({
      organisationName: orgName,
      approvalStatus: "approved",
      isApproved: true
    });

    res.json({ pending, approved });
  } catch (err) {
    console.error("Error loading doctors:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ============================
   APPROVE DOCTOR
============================ */
router.post("/approve/:id", verifyToken, verifyOrgAdmin, async (req, res) => {
  try {
    await Doctor.findByIdAndUpdate(req.params.id, {
      isApproved: true,
      approvalStatus: "approved",
      approvedBy: req.user.id,
      approvalDate: new Date()
    });

    res.json({ message: "Doctor approved successfully" });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ============================
   REJECT DOCTOR
============================ */
router.post("/reject/:id", verifyToken, verifyOrgAdmin, async (req, res) => {
  try {
    await Doctor.findByIdAndUpdate(req.params.id, {
      approvalStatus: "rejected",
      isApproved: false,
      approvedBy: req.user.id
    });

    // Or delete permanently:
    // await Doctor.findByIdAndDelete(req.params.id);

    res.json({ message: "Doctor rejected" });
  } catch (err) {
    console.error("Reject error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;