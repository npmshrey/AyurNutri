// backend/routes/stats.js
// Aggregate, non-identifying numbers for the public homepage. Everything is
// counted live from the database — nothing here is hardcoded.
//
//   GET /api/stats/public
import express from "express";
import Patient from "../models/Patient.js";
import Doctor from "../models/doctor.js";
import ClinicalPatient from "../models/ClinicalPatient.js";
import HealthAssessment from "../models/HealthAssessment.js";
import { getAllFoods } from "../data/food.js";

const router = express.Router();

router.get("/public", async (req, res) => {
  try {
    const [patients, practitioners, planAgg, doshaAgg, assessments] = await Promise.all([
      Patient.countDocuments(),
      Doctor.countDocuments(),
      ClinicalPatient.aggregate([
        { $project: { n: { $size: { $ifNull: ["$weeklyPlans", []] } } } },
        { $group: { _id: null, total: { $sum: "$n" } } },
      ]),
      HealthAssessment.aggregate([
        {
          $group: {
            _id: null,
            vata: { $avg: "$result.vata" },
            pitta: { $avg: "$result.pitta" },
            kapha: { $avg: "$result.kapha" },
          },
        },
      ]),
      HealthAssessment.countDocuments(),
    ]);

    const mix = doshaAgg[0];
    res.json({
      foods: getAllFoods().length,
      patients,
      practitioners,
      weeklyPlans: planAgg[0]?.total || 0,
      assessments,
      // Average dosha split across every assessment taken, or null if none yet.
      doshaMix:
        assessments > 0 && mix
          ? {
              vata: Math.round(mix.vata || 0),
              pitta: Math.round(mix.pitta || 0),
              kapha: Math.round(mix.kapha || 0),
            }
          : null,
    });
  } catch (err) {
    console.error("GET /api/stats/public error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
