// backend/routes/aiPlansGemini.js
import express from "express";
import OpenAI from "openai";
import { verifyToken } from "../middlewares/authMiddleware.js";
import { getAllFoods } from "../data/food.js";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// POST /api/ai/week-plan-gemini
// Body: {
//   age, weightKg, heightCm, gender,
//   activityLevel, // "sedentary" | "light" | "moderate" | "active" | "veryActive"
//   goal,          // "lose" | "maintain" | "gain"
//   dosha,         // "vata" | "pitta" | "kapha" | "mixed"
//   durationDays   // optional, default 7
// }
router.post("/week-plan-gemini", verifyToken, async (req, res) => {
  try {
    const {
      age,
      weightKg,
      heightCm,
      gender,
      activityLevel = "moderate",
      goal = "maintain",
      dosha = "mixed",
      durationDays = 7,
    } = req.body;

    if (!age || !weightKg || !heightCm || !gender) {
      return res.status(400).json({
        message: "age, weightKg, heightCm, and gender are required",
      });
    }

    const foods = getAllFoods();
    const foodCatalog = buildFoodCatalog(foods);

    const today = new Date().toISOString().slice(0, 10);

    const prompt = buildPrompt({
      age,
      weightKg,
      heightCm,
      gender,
      activityLevel,
      goal,
      dosha,
      durationDays,
      weekStartDate: today,
      foodCatalog,
    });

    const generateWithRetry = async (contentsToGenerate, maxRetries = 3) => {
      let lastError;
      for (let i = 0; i < maxRetries; i++) {
        try {
          const response = await openai.chat.completions.create({
            model: "llama-3.3-70b-versatile", 
            messages: [{ role: "user", content: contentsToGenerate }],
            response_format: { type: "json_object" }
          });
          return response.choices[0].message.content;
        } catch (error) {
          lastError = error;
          const is503 = error.status === 503 || (error.message && error.message.includes("503"));
          if (is503 && i < maxRetries - 1) {
            console.warn(`AI API 503 error. Retrying in ${i + 1} seconds... (${i + 1}/${maxRetries - 1})`);
            await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
            continue;
          }
          throw error;
        }
      }
      throw lastError;
    };

    const text = await generateWithRetry(prompt);

    // Expect strictly JSON. If model returns extra text, we try to extract JSON part.
    const jsonStr = extractJson(text);

    let plan;
    try {
      plan = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Failed to parse Gemini JSON:", e, "raw text:", text);
      return res.status(500).json({
        message: "AI returned invalid JSON. Adjust prompt or check logs.",
      });
    }

    // Optional: validate structure here (weekStartDate, days[], meals, etc.)

    return res.json(plan);
  } catch (err) {
    console.error("AI week-plan error:", err);
    if (err.status === 503 || (err.message && err.message.includes("503"))) {
      return res.status(503).json({ message: "The AI service is currently experiencing high demand. Please try again in a few moments." });
    }
    return res
      .status(500)
      .json({ message: "Failed to generate AI week plan" });
  }
});

// Build a compact catalog so we do not blow up tokens
function buildFoodCatalog(foods) {
  // take first 120 items as an example
  const subset = foods.slice(0, 120);

  return subset
    .map((f) => {
      const name =
        f.name || f["Food Item"] || f.title || f.id || "Food item";

      const kcal =
        f.nutritionPerServing?.caloriesKcal ??
        f.calories ??
        f.kcal ??
        null;

      const protein =
        f.nutritionPerServing?.proteinG ?? f.protein ?? null;
      const carbs =
        f.nutritionPerServing?.carbsG ?? f.carbs ?? null;
      const fat = f.nutritionPerServing?.fatG ?? f.fat ?? null;

      let doshaTag = "";
      const ay = f.ayurveda || {};
      if (ay.doshaEffect) {
        const { vata, pitta, kapha } = ay.doshaEffect;
        const parts = [];
        if (typeof vata === "number") parts.push(`Vata ${vata}`);
        if (typeof pitta === "number") parts.push(`Pitta ${pitta}`);
        if (typeof kapha === "number") parts.push(`Kapha ${kapha}`);
        doshaTag = parts.join(" | ");
      } else if (Array.isArray(ay.suitablePrakriti)) {
        doshaTag = `Suitable: ${ay.suitablePrakriti.join(", ")}`;
      }

      const macroStr = [
        kcal != null ? `${kcal} kcal` : null,
        protein != null ? `${protein}g P` : null,
        carbs != null ? `${carbs}g C` : null,
        fat != null ? `${fat}g F` : null,
      ]
        .filter(Boolean)
        .join(" · ");

      return `- ${name}${
        macroStr ? ` | ${macroStr}` : ""
      }${doshaTag ? ` | ${doshaTag}` : ""}`;
    })
    .join("\n");
}

function buildPrompt({
  age,
  weightKg,
  heightCm,
  gender,
  activityLevel,
  goal,
  dosha,
  durationDays,
  weekStartDate,
  foodCatalog,
}) {
  // We ask Gemini to design the plan AND return strict JSON
  return `
You are an expert Ayurvedic dietitian and nutritionist.
You design weekly diet plans using a fixed food library.

PATIENT PARAMETERS
- Age: ${age}
- Weight: ${weightKg} kg
- Height: ${heightCm} cm
- Gender: ${gender}
- Activity level: ${activityLevel}
- Goal: ${goal} (lose / maintain / gain)
- Dominant dosha: ${dosha}

WEEK PLAN PARAMETERS
- Week start date (ISO): ${weekStartDate}
- Number of days: ${durationDays}
- For each day, create 3 meals: breakfast, lunch, dinner.
- Use only foods from the FOOD LIBRARY below.

AYURVEDIC + NUTRITION GUIDELINES
- Respect basic Ayurvedic principles for the given dosha.
- Use mostly sattvic, easily digestible items.
- Avoid heavy combinations and incompatible foods.
- Make the daily calories roughly appropriate for the patient:
  - Slight deficit if goal = "lose"
  - Near maintenance if goal = "maintain"
  - Slight surplus if goal = "gain"
- Distribute calories approximately 25% breakfast, 40% lunch, 35% dinner.
- You can repeat foods across days, but keep some variety.

FOOD LIBRARY (one item per line)
Each line: "- name | kcal + macros | dosha info"
Only pick foods from this list.

${foodCatalog}

OUTPUT FORMAT (VERY IMPORTANT)
Return ONLY a single JSON object that matches this TypeScript type:

type WeekPlan = {
  title: string;              // short human readable title
  weekStartDate: string;      // ISO date string YYYY-MM-DD
  durationDays: number;
  meta: {
    dailyCaloriesApprox: number;
    goal: "lose" | "maintain" | "gain";
    dosha: string;
    activityLevel: string;
  };
  days: {
    date: string;             // ISO date
    meals: {
      breakfast: FoodEntry[];
      lunch: FoodEntry[];
      dinner: FoodEntry[];
    };
  }[];
};

type FoodEntry = {
  name: string;               // must be exactly one of the FOOD LIBRARY names
  calories?: number;
  notes?: string;             // short Ayurveda/nutrition note
};

Rules:
- DO NOT include any explanations outside of JSON.
- DO NOT include comments.
- DO NOT use markdown.
- The root element must be a single JSON object (WeekPlan).
`;
}

// Try to extract the JSON part from the model text
function extractJson(text) {
  // If the model behaved, it's pure JSON already.
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1) {
    return text;
  }
  return text.slice(firstBrace, lastBrace + 1);
}

export default router;
