// backend/routes/weekPlanLogs.js
import express from "express";
import mongoose from "mongoose";
import { verifyToken } from "../middlewares/authMiddleware.js";
import PatientDayLog from "../models/PatientDayLog.js";
import ClinicalPatient from "../models/ClinicalPatient.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// ---------- GEMINI SETUP ----------
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

// simple in-memory flag to stop hammering if we know quota is 0
let geminiTemporarilyDisabledUntil = 0;

// ---------- HELPERS ----------

// Weekly pattern summary
function summarizeLogsForAi(dayLogs) {
  let overeatingDays = 0;
  let skippedDays = 0;

  dayLogs.forEach((log) => {
    let over = false;
    let skip = false;
    ["breakfast", "lunch", "dinner"].forEach((meal) => {
      const status = log.meals?.[meal]?.status;
      if (status === "overate") over = true;
      if (status === "skipped") skip = true;
    });
    if (over) overeatingDays++;
    if (skip) skippedDays++;
  });

  return {
    totalLogs: dayLogs.length,
    overeatingDays,
    skippedDays,
  };
}

// Local rule-based fallback suggestions (no AI call)
function buildFallbackSuggestions({ prakriti, todayLog, patternSummary }) {
  const tips = [];

  const mealStatuses = todayLog.meals || {};
  const overate = [];
  const skipped = [];

  ["breakfast", "lunch", "dinner"].forEach((meal) => {
    const st = mealStatuses[meal]?.status;
    if (st === "overate") overate.push(meal);
    if (st === "skipped") skipped.push(meal);
  });

  if (overate.length) {
    tips.push(
      `You may have overeaten at ${overate.join(
        ", "
      )}. Keep your next 1–2 meals lighter – khichdi, dal-soup, steamed vegetables; avoid heavy fried food.`
    );
  }

  if (skipped.length) {
    tips.push(
      `You skipped ${skipped.join(
        ", "
      )}. Avoid compensating with a very heavy meal later. Take a warm, easy-to-digest meal instead.`
    );
  }

  if (todayLog.exercise?.status === "skipped") {
    tips.push(
      "You skipped exercise today. Aim for at least 10–15 minutes of walking or stretching tomorrow."
    );
  }

  const p = (prakriti || "").toLowerCase();
  if (p.includes("pitta")) {
    tips.push(
      "With a Pitta nature, reduce very spicy and oily food in the evening to avoid heat and acidity."
    );
  } else if (p.includes("vata")) {
    tips.push(
      "With a Vata tendency, keep meals warm and regular. Avoid skipping meals so your energy stays stable."
    );
  } else if (p.includes("kapha")) {
    tips.push(
      "With a Kapha tendency, prefer lighter dinners and avoid overeating at night."
    );
  }

  if (patternSummary.overeatingDays + patternSummary.skippedDays >= 3) {
    tips.push(
      "You’ve had multiple difficult days this week. Consider asking your doctor to simplify the remaining plan."
    );
  }

  if (!tips.length) {
    tips.push(
      "You stayed close to your plan today. Maintain regular meal timing, chew well, and stay hydrated."
    );
  }

  return tips;
}

/**
 * Decide whether we actually call Gemini for this log.
 * Goal: reduce API calls drastically.
 */
function shouldCallGemini({ todayLog, patternSummary }) {
  const meals = todayLog.meals || {};
  const statuses = ["breakfast", "lunch", "dinner"].map(
    (m) => meals[m]?.status || "completed"
  );

  const hasProblemToday = statuses.some((s) =>
    ["overate", "skipped", "partial"].includes(s)
  );
  const exerciseStatus = todayLog.exercise?.status || "completed";
  const exerciseProblem = ["skipped", "partial"].includes(exerciseStatus);

  const struggledManyDays =
    patternSummary.overeatingDays + patternSummary.skippedDays >= 3;

  // Strategy:
  // - If everything is "completed" and no notes → no Gemini.
  // - If small occasional issues, only use fallback.
  // - Only call Gemini when:
  //     - user is struggling many days OR
  //     - today has problems AND there is at least 1 previous problem day.
  const hasNotes = (todayLog.notes || "").trim().length > 0;

  if (!hasProblemToday && !exerciseProblem && !struggledManyDays && !hasNotes) {
    return false;
  }

  if (struggledManyDays) return true;

  // single bad day in an otherwise clean week -> fallback is enough
  const hasHistoryProblems =
    patternSummary.overeatingDays + patternSummary.skippedDays > 0;

  return hasProblemToday && hasHistoryProblems;
}

// Gemini + fallback in one place
async function getAiSuggestionsWithFallback({ prakriti, todayLog, patternSummary }) {
  const mode =
    patternSummary.overeatingDays + patternSummary.skippedDays >= 3
      ? "fullSimplificationAllowed"
      : "lightAdjustments";

  // Base fallback result
  const fallback = {
    tips: buildFallbackSuggestions({ prakriti, todayLog, patternSummary }),
    proposedChanges: { mode: "light", days: [] },
    source: "fallback",
  };

  // Hard guards: don’t even touch API in these cases
  const now = Date.now();
  if (!GEMINI_API_KEY || !genAI) {
    return fallback;
  }
  if (now < geminiTemporarilyDisabledUntil) {
    // recently hit quota – skip calling API for a while
    return fallback;
  }

  // Soft logic: only call Gemini when actually needed
  if (!shouldCallGemini({ todayLog, patternSummary })) {
    return fallback;
  }

  const aiInput = {
    mode,
    prakriti,
    today: {
      dayIndex: todayLog.dayIndex,
      date: todayLog.date,
      meals: todayLog.meals,
      exercise: todayLog.exercise,
      notes: todayLog.notes,
    },
    patternSummary,
  };

  // VERY compact prompt to reduce tokens
  const prompt = `
You are an Ayurvedic diet & lifestyle assistant.
Adjust upcoming days of a weekly diet+exercise plan based on this data.

Return STRICT JSON:
{
  "tips": ["...", "..."],
  "changes": {
    "mode": "light" | "full-redesign",
    "days": [
      {
        "offsetFromToday": number,
        "meals": {
          "breakfast"?: [ { "name": string } ],
          "lunch"?: [ { "name": string } ],
          "dinner"?: [ { "name": string } ]
        }
      }
    ]
  }
}

Input:
${JSON.stringify(aiInput)}
`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: 256, // reduce output size to save quota
      },
    });

    const raw = result.response.text() || "{}";

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (err) {
      console.error("Gemini JSON parse error, falling back:", err);
      parsed = {
        tips: [],
        changes: { mode: "light", days: [] },
      };
    }

    const tips =
      Array.isArray(parsed.tips) && parsed.tips.length
        ? parsed.tips
        : fallback.tips;

    const proposedChanges = parsed.changes || fallback.proposedChanges;

    return {
      tips,
      proposedChanges,
      source: "gemini",
    };
  } catch (err) {
    console.error("Gemini error, falling back to local suggestions:", err);

    // If this is a quota / 429 error, stop hitting API for ~5 minutes
    const msg = String(err?.message || "");
    if (msg.includes("429") || msg.includes("Quota")) {
      geminiTemporarilyDisabledUntil = Date.now() + 5 * 60 * 1000;
    }

    return fallback;
  }
}

// ---------- ROUTE ----------

router.post(
  "/patients/:cpId/week-plans/:planId/day-log",
  verifyToken,
  async (req, res) => {
    try {
      const { cpId, planId } = req.params;
      const {
        date,
        dayIndex,
        meals = {},
        exercise = {},
        notes = "",
      } = req.body;

      if (req.user.role !== "patient") {
        return res
          .status(403)
          .json({ message: "Only patients can log daily progress" });
      }

      if (!mongoose.Types.ObjectId.isValid(planId)) {
        return res.status(400).json({ message: "Invalid week plan id" });
      }

      const logDate = date ? new Date(date) : new Date();
      const startOfDay = new Date(logDate.toDateString());
      const endOfDay = new Date(
        startOfDay.getTime() + 24 * 60 * 60 * 1000
      );

      // 1) Save / update log
      let dayLog = await PatientDayLog.findOne({
        weekPlanId: planId,
        date: { $gte: startOfDay, $lt: endOfDay },
      });

      if (dayLog) {
        dayLog.dayIndex = dayIndex ?? dayLog.dayIndex;
        dayLog.meals = { ...dayLog.meals, ...meals };
        dayLog.exercise = { ...dayLog.exercise, ...exercise };
        dayLog.notes = notes ?? dayLog.notes;
        await dayLog.save();
      } else {
        dayLog = await PatientDayLog.create({
          patientId: req.user.id,
          clinicalPatientId: cpId,
          weekPlanId: planId,
          date: logDate,
          dayIndex,
          meals,
          exercise,
          notes,
        });
      }

      // 2) Clinical info for prakriti
      const clinical = await ClinicalPatient.findById(cpId).lean();
      const prakriti =
        clinical?.dosha || clinical?.prakriti || clinical?.constitution || "";

      // 3) All logs for this plan → pattern
      const allLogs = await PatientDayLog.find({ weekPlanId: planId }).lean();
      const patternSummary = summarizeLogsForAi(allLogs);

      // 4) Get AI suggestions (Gemini only when needed, else fallback)
      const { tips, proposedChanges, source } =
        await getAiSuggestionsWithFallback({
          prakriti,
          todayLog: dayLog.toObject(),
          patternSummary,
        });

      return res.json({
        message: "Day log saved",
        tips,
        proposedChanges,
        patternSummary,
        aiSource: source, // "gemini" or "fallback"
      });
    } catch (err) {
      console.error("Day log route error:", err);
      return res.status(500).json({
        message: "Failed to process day log or AI suggestions",
        error: err.message,
      });
    }
  }
);

export default router;
