// backend/utils/foodLibrary.js
import foodsRaw from "./data.json" assert { type: "json" }; // adjust path

// Normalize your data.json into a convenient form
const foods = Array.isArray(foodsRaw) ? foodsRaw : [];

function getFoodName(raw = {}) {
  return (
    raw.name ||
    raw.foodName ||
    raw["Food Item"] ||
    raw.title ||
    raw.label ||
    raw.id ||
    "Food item"
  );
}

function buildFoodMeta() {
  return foods.map((f) => {
    const name = getFoodName(f);
    const calories =
      Number(f.calories) ||
      Number(f["Calories (per 100g)"]) ||
      Number(f["Calories"]) ||
      null;

    const doshaEffect =
      f.doshaEffect ||
      f["Dosha Effect"] ||
      f["Dosha"] ||
      f["Ayurveda Impact"] ||
      "";

    const category =
      f.category || f["Category"] || f["Meal Type"] || "general";

    return {
      name,
      calories,
      doshaEffect,
      category,
      raw: f,
    };
  });
}

const FOOD_META = buildFoodMeta();

// Quick lookup by name (lowercased)
const FOOD_BY_NAME = FOOD_META.reduce((acc, item) => {
  acc[item.name.toLowerCase()] = item;
  return acc;
}, {});

// Helper: get meta by name, or null
export function findFoodMetaByName(name) {
  if (!name) return null;
  return FOOD_BY_NAME[String(name).toLowerCase()] || null;
}

export function getFoodMetaList() {
  return FOOD_META;
}
