import express from "express";
import HealthAssessment from "../models/HealthAssessment.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// POST /api/quiz/submit
// patientId is taken from the verified token, never trusted from the request
// body — otherwise any signed-in user could submit or overwrite another
// patient's dosha assessment (IDOR).
router.post("/submit", verifyToken, async (req, res) => {
  try {
    if (req.user.role !== "patient") {
      return res
        .status(403)
        .json({ message: "Only patients can submit a dosha assessment" });
    }

    const patientId = req.user.id;
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "Invalid request payload" });
    }

    // Calculate Dosha
    let vataScore = 0;
    let pittaScore = 0;
    let kaphaScore = 0;

    answers.forEach(ans => {
      if (ans.dosha === "Vata") vataScore += ans.weight || 1;
      if (ans.dosha === "Pitta") pittaScore += ans.weight || 1;
      if (ans.dosha === "Kapha") kaphaScore += ans.weight || 1;
    });

    const total = vataScore + pittaScore + kaphaScore;
    if (total === 0) {
      return res.status(400).json({ message: "No valid answers provided" });
    }

    const vata = Math.round((vataScore / total) * 100);
    const pitta = Math.round((pittaScore / total) * 100);
    const kapha = Math.round((kaphaScore / total) * 100);

    // Determine primary dosha
    let primaryDosha = "Vata";
    let maxScore = vata;
    
    if (pitta > maxScore) {
      maxScore = pitta;
      primaryDosha = "Pitta";
    }
    if (kapha > maxScore) {
      maxScore = kapha;
      primaryDosha = "Kapha";
    }

    // Handle ties gracefully (e.g. Vata-Pitta)
    const doshas = [
      { name: "Vata", score: vata },
      { name: "Pitta", score: pitta },
      { name: "Kapha", score: kapha }
    ].sort((a, b) => b.score - a.score);

    if (doshas[0].score === doshas[1].score) {
      primaryDosha = `${doshas[0].name}-${doshas[1].name}`;
    }

    const result = { vata, pitta, kapha, primaryDosha };

    const assessment = new HealthAssessment({
      patientId,
      answers,
      result
    });

    await assessment.save();

    res.status(201).json({ message: "Assessment saved successfully", assessment });
  } catch (err) {
    console.error("Quiz submission error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /api/quiz/history/:patientId
// A patient may only read their own history; a doctor may look up any
// patient's history (needed for the clinical view).
router.get("/history/:patientId", verifyToken, async (req, res) => {
  try {
    const { patientId } = req.params;

    if (req.user.role === "patient" && req.user.id !== patientId) {
      return res.status(403).json({ message: "Not your assessment history" });
    }
    if (req.user.role !== "patient" && req.user.role !== "doctor") {
      return res.status(403).json({ message: "Access not allowed" });
    }

    const history = await HealthAssessment.find({ patientId }).sort({ createdAt: -1 });
    res.status(200).json({ history });
  } catch (err) {
    console.error("Quiz history error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
