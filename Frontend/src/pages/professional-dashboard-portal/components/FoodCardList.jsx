import React, { useMemo, useState } from "react";
import Icon from "../../../components/AppIcon";
import axios from "axios";
import { useFoodLibrary } from "../../../lib/foods";

// Was falling back to :5000 while every other component in the app falls
// back to :9000 (the backend's actual default port) - a copy-paste
// mismatch that silently pointed this component at the wrong port whenever
// VITE_API_BASE_URL wasn't set.
const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

// Small pill chip
const Chip = ({ children, variant = "default" }) => {
  const base =
    "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium";
  const styles =
    variant === "soft-green"
      ? "bg-primary/10 text-primary border border-border"
      : variant === "soft-blue"
      ? "bg-primary/10 text-primary border border-border"
      : variant === "soft-amber"
      ? "bg-muted text-warning border border-warning/30"
      : "bg-muted text-text-primary";
  return <span className={`${base} ${styles}`}>{children}</span>;
};

// Nutrition stat box (used in modal)
const InfoBox = ({ label, value }) => (
  <div className="p-4 rounded-xl bg-muted flex flex-col items-center text-center shadow-sm">
    <div className="text-lg font-semibold text-text-primary">{value}</div>
    <div className="text-xs text-text-secondary">{label}</div>
  </div>
);

// Map doshaEffect numeric flags into readable chips
const getDoshaChips = (doshaEffect = {}) => {
  const map = [];
  if (doshaEffect.vata !== undefined) {
    map.push({
      dosha: "Vata",
      effect: doshaEffect.vata,
    });
  }
  if (doshaEffect.pitta !== undefined) {
    map.push({
      dosha: "Pitta",
      effect: doshaEffect.pitta,
    });
  }
  if (doshaEffect.kapha !== undefined) {
    map.push({
      dosha: "Kapha",
      effect: doshaEffect.kapha,
    });
  }
  return map;
};

export default function FoodCardList({ dataSource, patientId, onDietSaved }) {
  // Data source – use prop if provided, else the live library from the API
  const { foods: liveFoods, loading: libraryLoading, error: libraryError } = useFoodLibrary();
  const data =
    Array.isArray(dataSource) && dataSource.length ? dataSource : liveFoods;

  // Pagination / filters
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const [query, setQuery] = useState("");
  const [field, setField] = useState("all"); // all | name | category | cuisine | tags | rasa
  const [minCalories, setMinCalories] = useState("");
  const [maxCalories, setMaxCalories] = useState("");

  // Diet builder
  const [currentMeal, setCurrentMeal] = useState("breakfast");
  const [dietPlan, setDietPlan] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
  });

  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // Detail modal state
  const [selectedFood, setSelectedFood] = useState(null);

  // ------- FILTERING -------

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return data.filter((item) => {
      const calories = item?.nutritionPerServing?.caloriesKcal ?? 0;

      // Calories filters
      if (minCalories !== "" && calories < Number(minCalories)) return false;
      if (maxCalories !== "" && calories > Number(maxCalories)) return false;

      if (!q) return true;

      const name = item.name?.toLowerCase() || "";
      const category = item.category?.toLowerCase() || "";
      const cuisine = item.cuisine?.toLowerCase() || "";
      const tags = (item.tags || []).join(" ").toLowerCase();
      const rasa = (item.ayurveda?.rasa || []).join(" ").toLowerCase();

      if (field === "name") return name.includes(q);
      if (field === "category") return category.includes(q);
      if (field === "cuisine") return cuisine.includes(q);
      if (field === "tags") return tags.includes(q);
      if (field === "rasa") return rasa.includes(q);

      // all fields
      return (
        name.includes(q) ||
        category.includes(q) ||
        cuisine.includes(q) ||
        tags.includes(q) ||
        rasa.includes(q)
      );
    });
  }, [data, query, field, minCalories, maxCalories]);

  // Pagination
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;
  const paged = filtered.slice(start, start + pageSize);

  // ------- DIET PLAN HANDLERS -------

  const addToCurrentMeal = (item) => {
    setDietPlan((prev) => ({
      ...prev,
      [currentMeal]: [...prev[currentMeal], item],
    }));
  };

  const removeFromMeal = (meal, idx) => {
    setDietPlan((prev) => ({
      ...prev,
      [meal]: prev[meal].filter((_, i) => i !== idx),
    }));
  };

  const totalCaloriesByMeal = (meal) =>
    dietPlan[meal].reduce(
      (sum, f) =>
        sum + (f?.nutritionPerServing?.caloriesKcal ?? 0),
      0
    );

  // ------- SAVE DIET PLAN -------

  const handleSaveDietPlan = async () => {
    if (!patientId) {
      setSaveMsg("No patient selected.");
      return;
    }

    try {
      setSaving(true);
      setSaveMsg("");

      const token = localStorage.getItem("authToken");
      const payload = dietPlan;

      const res = await axios.post(
        `${API_BASE}/api/patients/${patientId}/diet-plan`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSaveMsg("Saved successfully!");
      onDietSaved && onDietSaved(res.data);
    } catch (err) {
      console.error("Save diet plan error:", err);
      setSaveMsg("Failed to save.");
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(""), 3000);
    }
  };

  // ------- STYLE HELPERS -------

  const cardBase =
    "border rounded-2xl p-4 bg-card shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between";
  const mealButtonClasses = (meal) =>
    `px-4 py-2 rounded-md border text-sm transition ${
      currentMeal === meal
        ? "bg-primary text-white border-primary shadow"
        : "bg-card border-border hover:bg-muted"
    }`;

  // ------------------------------------------------
  //                      UI
  // ------------------------------------------------

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT – CARDS + FILTERS */}
      <div className="lg:col-span-2 space-y-6">
        {/* Search + filters */}
        <div className="flex flex-wrap gap-3 items-center">
          <input
            className="flex-1 p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Search by name, rasa, cuisine, tags..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />

          <select
            className="p-3 border rounded-lg shadow-sm"
            value={field}
            onChange={(e) => {
              setField(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All fields</option>
            <option value="name">Name</option>
            <option value="category">Category</option>
            <option value="cuisine">Cuisine</option>
            <option value="tags">Tags</option>
            <option value="rasa">Rasa (tastes)</option>
          </select>

          <input
            className="p-3 w-24 border rounded-lg shadow-sm"
            placeholder="Min cal"
            value={minCalories}
            onChange={(e) =>
              setMinCalories(e.target.value.replace(/[^0-9]/g, ""))
            }
          />
          <input
            className="p-3 w-24 border rounded-lg shadow-sm"
            placeholder="Max cal"
            value={maxCalories}
            onChange={(e) =>
              setMaxCalories(e.target.value.replace(/[^0-9]/g, ""))
            }
          />
        </div>

        {/* Meal Selector */}
        <div className="flex flex-wrap gap-3 items-center">
          <span className="text-sm text-text-primary">Assign to:</span>
          <button
            type="button"
            className={mealButtonClasses("breakfast")}
            onClick={() => setCurrentMeal("breakfast")}
          >
            Breakfast
          </button>
          <button
            type="button"
            className={mealButtonClasses("lunch")}
            onClick={() => setCurrentMeal("lunch")}
          >
            Lunch
          </button>
          <button
            type="button"
            className={mealButtonClasses("dinner")}
            onClick={() => setCurrentMeal("dinner")}
          >
            Dinner
          </button>
        </div>

        {/* FOOD CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {paged.map((item) => {
            const n = item.nutritionPerServing || {};
            const a = item.ayurveda || {};
            const firstRasa = a.rasa?.[0];
            const doshaChips = getDoshaChips(a.doshaEffect);

            return (
              <article
                key={item.id}
                className={cardBase}
                onClick={() => setSelectedFood(item)}
              >
                {/* Top: name + basic tags */}
                <div>
                  <header className="mb-3">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="text-lg font-semibold text-text-primary leading-snug">
                        {item.name}
                      </h2>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2">
                      <Chip variant="soft-green">{item.cuisine}</Chip>
                      <Chip variant="soft-blue">{item.category}</Chip>
                      {item.mealSlots?.slice(0, 1).map((slot) => (
                        <Chip key={slot} variant="soft-amber">
                          {slot}
                        </Chip>
                      ))}
                    </div>
                  </header>

                  {/* Macro row (like cards in screenshot) */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-muted rounded-xl p-2 text-center">
                      <div className="text-xs text-text-secondary">Calories</div>
                      <div className="text-sm font-semibold text-text-primary">
                        {n.caloriesKcal ?? "–"}
                      </div>
                    </div>
                    <div className="bg-primary/10 rounded-xl p-2 text-center">
                      <div className="text-xs text-text-secondary">Protein</div>
                      <div className="text-sm font-semibold text-text-primary">
                        {n.proteinG ?? "–"}g
                      </div>
                    </div>
                    <div className="bg-primary/10 rounded-xl p-2 text-center">
                      <div className="text-xs text-text-secondary">Carbs</div>
                      <div className="text-sm font-semibold text-text-primary">
                        {n.carbsG ?? "–"}g
                      </div>
                    </div>
                  </div>

                  {/* Ayurvedic tags / short text */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {firstRasa && <Chip>{firstRasa} (Rasa)</Chip>}
                    {doshaChips.map((d) => (
                      <Chip key={d.dosha}>
                        {d.dosha}{" "}
                        {d.effect === -1
                          ? "Pacifies"
                          : d.effect === 1
                          ? "Aggravates"
                          : "• (neutral)"}
                      </Chip>
                    ))}
                  </div>

                  {/* Short description, built from indications */}
                  {item.indications && item.indications.length > 0 && (
                    <p className="text-xs text-text-secondary line-clamp-2">
                      {item.indications.join(" • ")}
                    </p>
                  )}
                </div>

                {/* Add button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent opening modal
                    addToCurrentMeal(item);
                  }}
                  className="mt-4 w-full py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-medium shadow"
                >
                  Add to{" "}
                  {currentMeal.charAt(0).toUpperCase() +
                    currentMeal.slice(1)}
                </button>
              </article>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-text-secondary text-sm mt-6">
            {libraryLoading
              ? "Loading the food library…"
              : libraryError
              ? libraryError
              : "No foods match your filters."}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 text-sm mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>
          <span>
            Page {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {/* RIGHT – CURRENT DIET PLAN SUMMARY */}
      <aside className="p-6 bg-muted border border-border rounded-2xl shadow-xl h-fit">
        <h2 className="text-xl font-semibold text-primary mb-2">
          Current Diet Plan
        </h2>
        <p className="text-xs text-primary mb-4">
          These meals will be saved to the patient&apos;s record.
        </p>

        {["breakfast", "lunch", "dinner"].map((meal) => (
          <div key={meal} className="mb-5">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-text-primary">
                {meal.charAt(0).toUpperCase() + meal.slice(1)}
              </h3>
              <span className="text-xs text-text-secondary">
                {dietPlan[meal].length} items •{" "}
                {totalCaloriesByMeal(meal)} cal
              </span>
            </div>

            <div className="mt-2 space-y-2 max-h-32 overflow-y-auto pr-1">
              {dietPlan[meal].length === 0 && (
                <p className="text-xs italic text-text-secondary">
                  No items added.
                </p>
              )}

              {dietPlan[meal].map((item, i) => (
                <div
                  key={`${meal}-${item.id}-${i}`}
                  className="flex justify-between items-center bg-card rounded-lg shadow p-2 border"
                >
                  <span className="truncate text-sm">{item.name}</span>
                  <button
                    className="text-error text-xs ml-2"
                    onClick={() => removeFromMeal(meal, i)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          onClick={handleSaveDietPlan}
          disabled={saving}
          className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg disabled:opacity-60 text-sm font-medium"
        >
          {saving ? "Saving..." : "Save Diet Plan"}
        </button>

        {saveMsg && (
          <p className="text-xs text-center mt-3 text-primary">
            {saveMsg}
          </p>
        )}
      </aside>

      {/* DETAIL MODAL (like Quinoa Upma UI) */}
      {selectedFood && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-6">
          <div className="bg-card w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            {/* HEADER BAR */}
            <div className="p-5 bg-primary text-primary-foreground flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold">
                  {selectedFood.name}
                </h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Chip variant="soft-green">{selectedFood.cuisine}</Chip>
                  <Chip variant="soft-blue">{selectedFood.category}</Chip>
                  {selectedFood.mealSlots?.map((slot) => (
                    <Chip key={slot} variant="soft-amber">
                      {slot}
                    </Chip>
                  ))}
                </div>
              </div>

              <button
                className="text-white text-2xl leading-none ml-4"
                onClick={() => setSelectedFood(null)}
              >
                <Icon name="X" size={18} />
              </button>
            </div>

            {/* SCROLLABLE CONTENT */}
            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Description (built from indications) */}
              {selectedFood.indications && (
                <section>
                  <h3 className="font-semibold mb-1 text-text-primary">
                    Description / Indications
                  </h3>
                  <p className="text-sm text-text-primary">
                    {selectedFood.indications.join(" • ")}
                  </p>
                </section>
              )}

              {/* NUTRITION SECTION */}
              <section>
                <h3 className="font-semibold text-text-primary mb-3">
                  Nutritional Information (per serving)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <InfoBox
                    label="Calories"
                    value={`${selectedFood.nutritionPerServing?.caloriesKcal ?? "–"} kcal`}
                  />
                  <InfoBox
                    label="Protein"
                    value={`${selectedFood.nutritionPerServing?.proteinG ?? "–"} g`}
                  />
                  <InfoBox
                    label="Carbs"
                    value={`${selectedFood.nutritionPerServing?.carbsG ?? "–"} g`}
                  />
                  <InfoBox
                    label="Fat"
                    value={`${selectedFood.nutritionPerServing?.fatG ?? "–"} g`}
                  />
                  <InfoBox
                    label="Fiber"
                    value={`${selectedFood.nutritionPerServing?.fiberG ?? "–"} g`}
                  />
                  {selectedFood.nutritionPerServing?.sodiumMg !== undefined && (
                    <InfoBox
                      label="Sodium"
                      value={`${selectedFood.nutritionPerServing.sodiumMg} mg`}
                    />
                  )}
                </div>
              </section>

              {/* AYURVEDIC PROPERTIES */}
              <section>
                <h3 className="font-semibold text-text-primary mb-3">
                  Ayurvedic Properties
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div className="p-4 rounded-xl bg-primary/10">
                    <p className="font-semibold mb-1">Rasa (Tastes)</p>
                    <p>{(selectedFood.ayurveda?.rasa || []).join(", ") || "-"}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-primary/10">
                    <p className="font-semibold mb-1">Guna (Qualities)</p>
                    <p>{(selectedFood.ayurveda?.guna || []).join(", ") || "-"}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted">
                    <p className="font-semibold mb-1">Virya / Vipaka</p>
                    <p>
                      {selectedFood.ayurveda?.virya || "-"}{" "}
                      {selectedFood.ayurveda?.vipaka
                        ? `• ${selectedFood.ayurveda.vipaka} vipaka`
                        : ""}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted">
                    <p className="font-semibold mb-1">Dosha Effect</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {getDoshaChips(selectedFood.ayurveda?.doshaEffect).map(
                        (d) => (
                          <Chip key={d.dosha}>
                            {d.dosha}{" "}
                            {d.effect === -1
                              ? "Pacifies"
                              : d.effect === 1
                              ? "Aggravates"
                              : "• neutral"}
                          </Chip>
                        )
                      )}
                    </div>
                  </div>
                  {selectedFood.ayurveda?.suitablePrakriti && (
                    <div className="p-4 rounded-xl bg-muted">
                      <p className="font-semibold mb-1">Suitable Prakriti</p>
                      <p>
                        {selectedFood.ayurveda.suitablePrakriti.join(", ")}
                      </p>
                    </div>
                  )}
                  {selectedFood.ayurveda?.avoidIn && (
                    <div className="p-4 rounded-xl bg-muted">
                      <p className="font-semibold mb-1">Avoid / Use Caution</p>
                      <ul className="list-disc pl-4 space-y-1">
                        {selectedFood.ayurveda.avoidIn.map((x) => (
                          <li key={x}>{x}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </section>

              {/* INGREDIENTS (if recipe) */}
              {selectedFood.isRecipe && selectedFood.ingredients && (
                <section>
                  <h3 className="font-semibold text-text-primary mb-2">
                    Ingredients
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-text-secondary border-b">
                          <th className="py-2 pr-4">Ingredient</th>
                          <th className="py-2 pr-4">Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedFood.ingredients.map((ing, index) => (
                          <tr
                            key={`${ing.name}-${index}`}
                            className="border-b last:border-0"
                          >
                            <td className="py-2 pr-4">{ing.name}</td>
                            <td className="py-2 pr-4">
                              {ing.quantity} {ing.unit}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* Tags */}
              {selectedFood.tags && selectedFood.tags.length > 0 && (
                <section>
                  <h3 className="font-semibold text-text-primary mb-2">
                    Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedFood.tags.map((t) => (
                      <Chip key={t}>{t}</Chip>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Modal footer: Add to selection */}
            <div className="border-t p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-text-secondary">
                Serving:{" "}
                {selectedFood.serving?.description ||
                  `${selectedFood.serving?.amount || ""} ${
                    selectedFood.serving?.unit || ""
                  }`}
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setSelectedFood(null)}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    addToCurrentMeal(selectedFood);
                    setSelectedFood(null);
                  }}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-medium shadow"
                >
                  Add to{" "}
                  {currentMeal.charAt(0).toUpperCase() +
                    currentMeal.slice(1)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
