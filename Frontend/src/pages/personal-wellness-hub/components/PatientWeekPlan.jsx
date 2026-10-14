// src/pages/personal-wellness-hub/components/PatientWeekPlan.jsx
import React, { useEffect, useState } from "react";
import useAuth from "../../../hooks/useAuth";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

const mealKeys = ["breakfast", "lunch", "dinner"];

// today "YYYY-MM-DD"
function getTodayStr() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// planned vs consumed macros for a day
function computeDayNutritionSplit(day) {
  const meals = day?.meals || {};
  const result = {
    assigned: { calories: 0, protein: 0, carbs: 0 },
    consumed: { calories: 0, protein: 0, carbs: 0 },
  };

  mealKeys.forEach((k) => {
    const arr = meals[k] || [];
    arr.forEach((item) => {
      const food = item.food || item || {};
      const n = food.nutritionPerServing || {};
      const cals = n.caloriesKcal || 0;
      const prot = n.proteinG || 0;
      const carbs = n.carbsG || 0;

      result.assigned.calories += cals;
      result.assigned.protein += prot;
      result.assigned.carbs += carbs;

      if (item.checked) {
        result.consumed.calories += cals;
        result.consumed.protein += prot;
        result.consumed.carbs += carbs;
      }
    });
  });

  return result;
}

export default function PatientWeekPlan({ patientId, planId: initialPlanId }) {
  const { token } = useAuth();

  const [plan, setPlan] = useState(null);
  const [planId, setPlanId] = useState(initialPlanId || null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [savingKey, setSavingKey] = useState(null); // ⬅ per-item saving state

  const todayStr = getTodayStr();

  // load plan
  useEffect(() => {
    if (!token || !patientId) return;

    const load = async () => {
      try {
        setLoading(true);
        setErr("");

        let effectivePlanId = initialPlanId;

        if (!effectivePlanId) {
          const resList = await fetch(
            `${API_BASE}/api/patients/${patientId}/week-plans`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const body = await resList.json().catch(() => null);

          if (!resList.ok) {
            throw new Error(
              body?.message ||
                `Failed to load weekly plans (${resList.status})`
            );
          }

          const plans = body.weeklyPlans || [];
          if (!plans.length) {
            setErr("No weekly plan assigned yet.");
            setPlan(null);
            return;
          }

          plans.sort(
            (a, b) =>
              new Date(b.updatedAt || b.createdAt).getTime() -
              new Date(a.updatedAt || a.createdAt).getTime()
          );
          effectivePlanId = plans[0]._id;
          setPlanId(effectivePlanId);
        }

        const resOne = await fetch(
          `${API_BASE}/api/patients/${patientId}/week-plans/${effectivePlanId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const bodyOne = await resOne.json().catch(() => null);

        if (!resOne.ok) {
          throw new Error(
            bodyOne?.message ||
              `Failed to load weekly plan (${resOne.status})`
          );
        }

        setPlan(bodyOne.plan || null);
      } catch (e) {
        console.error("PatientWeekPlan load error:", e);
        setErr(e.message || "Failed to load weekly plan");
        setPlan(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token, patientId, initialPlanId]);

  // toggle item (optimistic)
  const toggleItem = async (opts) => {
    if (!token || !plan || !planId) return;
    const { dayIndex, kind, mealKey, itemIndex, checked, itemKey } = opts;

    // don't send another request while one is in flight
    if (savingKey && savingKey !== itemKey) return;

    setSavingKey(itemKey);

    const previousPlan = plan;

    // Optimistically update local state
    let optimisticPlan = previousPlan;
    try {
      if (previousPlan) {
        const newPlan = {
          ...previousPlan,
          days: [...(previousPlan.days || [])],
        };

        const day = { ...newPlan.days[dayIndex] };
        newPlan.days[dayIndex] = day;

        if (kind === "meal") {
          const meals = { ...(day.meals || {}) };
          const mealArr = [...(meals[mealKey] || [])];
          const item = { ...mealArr[itemIndex], checked };
          mealArr[itemIndex] = item;
          meals[mealKey] = mealArr;
          day.meals = meals;
        } else if (kind === "exercise") {
          const exArr = [...(day.exercises || [])];
          const item = { ...exArr[itemIndex], checked };
          exArr[itemIndex] = item;
          day.exercises = exArr;
        }

        optimisticPlan = newPlan;
        setPlan(newPlan);
      }

      // send real update to backend
      const res = await fetch(
        `${API_BASE}/api/patients/${patientId}/week-plans/${planId}/check`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            dayIndex,
            kind,
            mealKey,
            itemIndex,
            checked,
          }),
        }
      );
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(body?.message || "Failed to update item");
      }

      // server is source of truth if provided
      setPlan(body.plan || optimisticPlan);
    } catch (e) {
      console.error("toggleItem error:", e);
      // rollback optimistic change
      setPlan(previousPlan);
      alert(e.message || "Failed to update");
    } finally {
      setSavingKey(null);
    }
  };

  const renderMealList = (day, mealKey, dayIndex, isPastDay) => {
    const arr = (day.meals && day.meals[mealKey]) || [];
    if (!arr.length) {
      return (
        <p className="text-[11px] text-text-secondary italic">
          No {mealKey} items.
        </p>
      );
    }

    return (
      <ul className="space-y-1">
        {arr.map((item, idx) => {
          const label =
            item.food?.name ||
            item.food?.["Food Item"] ||
            item.name ||
            "Food item";
          const checked = !!item.checked;
          const itemKey = `day-${dayIndex}-meal-${mealKey}-${idx}`;

          return (
            <li key={`${mealKey}-${idx}`} className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-3 w-3 rounded border-border text-primary focus:ring-ring"
                checked={checked}
                disabled={isPastDay || savingKey === itemKey}
                onChange={(e) => {
                  if (isPastDay) return;
                  toggleItem({
                    dayIndex,
                    kind: "meal",
                    mealKey,
                    itemIndex: idx,
                    checked: e.target.checked,
                    itemKey,
                  });
                }}
              />
              <span
                className={`text-[11px] truncate ${
                  isPastDay ? "text-text-secondary" : "text-text-primary"
                }`}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  const renderExerciseList = (day, dayIndex, isPastDay) => {
    const arr = day.exercises || [];
    if (!arr.length) {
      return (
        <p className="text-[11px] text-text-secondary italic">
          No exercises added.
        </p>
      );
    }

    return (
      <ul className="space-y-1">
        {arr.map((ex, idx) => {
          const checked = !!ex.checked;
          const itemKey = `day-${dayIndex}-exercise-${idx}`;

          return (
            <li key={idx} className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-3 w-3 rounded border-border text-primary focus:ring-ring"
                checked={checked}
                disabled={isPastDay || savingKey === itemKey}
                onChange={(e) => {
                  if (isPastDay) return;
                  toggleItem({
                    dayIndex,
                    kind: "exercise",
                    itemIndex: idx,
                    checked: e.target.checked,
                    itemKey,
                  });
                }}
              />
              <span
                className={`text-[11px] truncate ${
                  isPastDay ? "text-text-secondary" : "text-text-primary"
                }`}
              >
                {ex.name}{" "}
                {ex.reps ? `• ${ex.reps}` : ""}{" "}
                {ex.durationMinutes ? `• ${ex.durationMinutes} min` : ""}
              </span>
            </li>
          );
        })}
      </ul>
    );
  };

  if (loading && !plan) {
    return (
      <div className="text-sm text-text-secondary bg-card border rounded-xl shadow-sm px-4 py-3">
        Loading weekly plan…
      </div>
    );
  }

  if (err && !plan) {
    return (
      <div className="text-sm text-error bg-card border rounded-xl shadow-sm px-4 py-3">
        {err}
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="text-sm text-text-secondary bg-card border rounded-xl shadow-sm px-4 py-3">
        No weekly plan found for this patient.
      </div>
    );
  }

  return (
    <div className="mt-4 bg-card border rounded-2xl shadow-sm p-4 sm:p-5 lg:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
        <div className="space-y-1.5">
          <h2 className="text-xl font-semibold text-text-primary tracking-tight">
            {plan.title || "Weekly Diet & Exercise Plan"}
          </h2>
          <p className="text-xs text-text-secondary">
            Week starting{" "}
            {plan.weekStartDate
              ? new Date(plan.weekStartDate).toLocaleDateString()
              : "-"}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-[10px] font-medium text-primary border border-border">
              <span className="w-2 h-2 rounded-full bg-primary mr-1.5" />
              Today
            </span>
            <span className="inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-[10px] font-medium text-text-primary border border-border">
              <span className="w-2 h-2 rounded-full bg-muted-foreground mr-1.5" />
              Past day (locked)
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <p className="text-xs text-text-secondary">Overall Progress</p>
          <p className="text-2xl font-semibold text-primary leading-tight">
            {plan.progressPercent ?? 0}%
          </p>
          <div className="mt-1 w-32 sm:w-40 h-1.5 bg-primary/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{
                width: `${Math.min(
                  100,
                  Number(plan.progressPercent ?? 0)
                )}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Days grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {plan.days?.map((day, dayIndex) => {
          const dayStr = day?.date ? String(day.date).slice(0, 10) : "";
          const isPastDay = dayStr && dayStr < todayStr;
          const isToday = dayStr === todayStr;

          const { assigned, consumed } = computeDayNutritionSplit(day);

          const completionRatio =
            assigned.calories > 0
              ? Math.min(
                  100,
                  (consumed.calories / assigned.calories) * 100
                )
              : 0;

          return (
            <div
              key={day.date || dayIndex}
              className={`flex flex-col justify-between border rounded-2xl p-3 sm:p-4 bg-muted shadow-[0_1px_2px_rgba(15,23,42,0.06)] transition-transform duration-150 hover:-translate-y-[1px] hover:shadow-md ${
                isToday
                  ? "border-primary/80 ring-1 ring-ring"
                  : "border-[#E2D4C3]"
              } ${isPastDay ? "opacity-95" : ""}`}
            >
              {/* Day header */}
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-text-primary">
                  {day.date
                    ? new Date(day.date).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })
                    : `Day ${dayIndex + 1}`}
                </p>
                <div className="flex items-center gap-1.5">
                  {isToday && (
                    <span className="text-[10px] px-2 py-[2px] rounded-md bg-primary/10 text-primary border border-border">
                      Today
                    </span>
                  )}
                  {isPastDay && (
                    <span className="text-[10px] px-2 py-[2px] rounded-md bg-muted text-text-secondary border border-border">
                      Past
                    </span>
                  )}
                </div>
              </div>

              {/* Planned vs completed */}
              <div className="mb-3 space-y-1.5 text-[11px]">
                <div className="rounded-md bg-card/70 px-2 py-1.5 border border-[#E8D9C5]">
                  <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                      Planned
                    </span>
                    <div className="flex flex-wrap gap-1">
                      <span className="inline-flex items-center rounded-md bg-muted px-2 py-[2px] text-[10px] text-text-primary">
                        {Math.round(assigned.calories)} kcal
                      </span>
                      <span className="inline-flex items-center rounded-md bg-muted px-2 py-[2px] text-[10px] text-text-primary">
                        {Math.round(assigned.protein)}g protein
                      </span>
                      <span className="inline-flex items-center rounded-md bg-muted px-2 py-[2px] text-[10px] text-text-primary">
                        {Math.round(assigned.carbs)}g carbs
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-md bg-primary/10 px-2 py-1.5 border border-border">
                  <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-primary">
                      Completed
                    </span>
                    <div className="flex flex-wrap gap-1">
                      <span className="inline-flex items-center rounded-md bg-card px-2 py-[2px] text-[10px] text-primary">
                        {Math.round(consumed.calories)} kcal
                      </span>
                      <span className="inline-flex items-center rounded-md bg-card px-2 py-[2px] text-[10px] text-primary">
                        {Math.round(consumed.protein)}g protein
                      </span>
                      <span className="inline-flex items-center rounded-md bg-card px-2 py-[2px] text-[10px] text-primary">
                        {Math.round(consumed.carbs)}g carbs
                      </span>
                    </div>
                  </div>

                  <div className="mt-1.5">
                    <div className="w-full h-1.5 rounded-full bg-primary/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${completionRatio}%` }}
                      />
                    </div>
                    <p className="mt-0.5 text-[10px] text-primary">
                      {completionRatio
                        ? `${Math.round(
                            completionRatio
                          )}% of planned calories`
                        : "No items completed yet."}
                    </p>
                  </div>
                </div>

                {isPastDay && (
                  <p className="text-[10px] text-text-secondary">
                    Past day – checkboxes are locked.
                  </p>
                )}
              </div>

              {/* Meals + Exercise */}
              <div className="space-y-1.5">
                {mealKeys.map((mk) => (
                  <div key={mk} className="rounded-md bg-card/70 px-2 py-1.5">
                    <p className="text-[11px] font-semibold capitalize text-text-primary mb-0.5">
                      {mk}
                    </p>
                    {renderMealList(day, mk, dayIndex, isPastDay)}
                  </div>
                ))}

                <div className="mt-2 rounded-md bg-muted px-2 py-1.5 border border-border">
                  <p className="text-[11px] font-semibold text-text-primary mb-0.5">
                    Exercise
                  </p>
                  {renderExerciseList(day, dayIndex, isPastDay)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {savingKey && (
        <p className="mt-3 text-[11px] text-text-secondary flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          Saving your changes…
        </p>
      )}
    </div>
  );
}
