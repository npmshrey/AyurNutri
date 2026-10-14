// backend/routes/foods.js
// Read-only access to the food library (backend/data/foods.json), so the
// frontend never ships its own copy of the data.
//
//   GET /api/foods           ?q= &category= &mealSlot= &dosha=vata|pitta|kapha
//                            &effect=calms|raises &complete=1 &random=1
//                            &limit=50 &offset=0
//   GET /api/foods/stats     totals and per-category counts
//   GET /api/foods/:id       one item
import express from "express";
import { getAllFoods } from "../data/food.js";

const router = express.Router();

const DOSHAS = ["vata", "pitta", "kapha"];

// A record counts as "complete" when it has both a nutrient block and the
// four classical Ayurvedic properties.
const isComplete = (f) =>
  f?.nutritionPerServing?.caloriesKcal != null &&
  f?.ayurveda?.rasa?.length &&
  f?.ayurveda?.guna?.length &&
  f?.ayurveda?.virya &&
  f?.ayurveda?.vipaka;

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

router.get("/", (req, res) => {
  const { q, category, mealSlot, dosha, effect, complete, random } = req.query;
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 50, 1), 1000);
  const offset = Math.max(parseInt(req.query.offset, 10) || 0, 0);

  let items = getAllFoods();

  if (q) {
    const needle = String(q).toLowerCase();
    items = items.filter(
      (f) =>
        f.name?.toLowerCase().includes(needle) ||
        f.category?.toLowerCase().includes(needle) ||
        (f.tags || []).some((t) => String(t).toLowerCase().includes(needle))
    );
  }
  if (category) {
    const c = String(category).toLowerCase();
    items = items.filter((f) => f.category?.toLowerCase() === c);
  }
  if (mealSlot) {
    const m = String(mealSlot).toLowerCase();
    items = items.filter((f) => (f.mealSlots || []).some((s) => s.toLowerCase() === m));
  }
  if (dosha && DOSHAS.includes(String(dosha).toLowerCase())) {
    const d = String(dosha).toLowerCase();
    items = items.filter((f) => {
      const v = f?.ayurveda?.doshaEffect?.[d];
      if (typeof v !== "number") return false;
      if (effect === "calms") return v < 0;
      if (effect === "raises") return v > 0;
      return true;
    });
  }
  if (complete === "1") items = items.filter(isComplete);
  if (random === "1") items = shuffle(items);

  res.json({ total: items.length, items: items.slice(offset, offset + limit) });
});

router.get("/stats", (req, res) => {
  const all = getAllFoods();
  const categories = {};
  all.forEach((f) => {
    const c = f.category || "Other";
    categories[c] = (categories[c] || 0) + 1;
  });
  res.json({
    total: all.length,
    complete: all.filter(isComplete).length,
    categories,
  });
});

router.get("/:id", (req, res) => {
  const item = getAllFoods().find((f) => f.id === req.params.id);
  if (!item) return res.status(404).json({ message: "Food not found" });
  res.json({ item });
});

export default router;
