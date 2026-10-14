import express from "express";
import multer from "multer";
import path from "path";
import { verifyToken } from "../middlewares/authMiddleware.js";
import ClinicalPatient from "../models/ClinicalPatient.js";

const router = express.Router();

// Ensure "uploads/reports" folder exists
import fs from "fs";
const uploadDir = "uploads/reports";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});

// ---------------------------------------------------------------
// POST /api/patient/reports/upload
// Patient uploads a medical document
// ---------------------------------------------------------------
router.post("/upload", verifyToken, upload.single("file"), async (req, res) => {
  try {
    if (req.user.role !== "patient") {
      return res.status(403).json({ message: "Patient access only." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    const patientId = req.user.id;

    // Find clinical record
    const clinical = await ClinicalPatient.findOne({
      patientAccountId: patientId,
    });

    if (!clinical) {
      return res
        .status(404)
        .json({ message: "No clinical record found for this patient." });
    }

    const fileData = {
      originalName: req.file.originalname,
      fileName: req.file.filename,
      mimeType: req.file.mimetype,
      url: `/uploads/reports/${req.file.filename}`,
      uploadedAt: new Date(),
    };

    clinical.reportFiles.push(fileData);
    await clinical.save();

    res.json({ message: "Report uploaded", file: fileData });
  } catch (err) {
    console.error("upload report error:", err);
    res.status(500).json({ message: "Server error uploading report." });
  }
});

export default router;
