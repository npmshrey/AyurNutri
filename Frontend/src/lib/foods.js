// src/lib/foods.js
// The whole food library, loaded once from GET /api/foods and shared by
// every screen that needs it (diet builder, week planner, tools). This
// replaces a 437 KB copy of the data that used to be bundled into the
// frontend and could drift out of sync with the backend.
import { useEffect, useState } from "react";
import { api, errorMessage } from "./api";

let cache = null;
let inflight = null;

const loadAll = () => {
  if (cache) return Promise.resolve(cache);
  if (!inflight) {
    inflight = api
      .get("/api/foods", { params: { limit: 1000 } })
      .then((res) => {
        cache = res.data?.items || [];
        return cache;
      })
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
};

export function useFoodLibrary() {
  const [state, setState] = useState(() => ({ foods: cache || [], loading: !cache, error: "" }));

  useEffect(() => {
    if (cache) return;
    let cancelled = false;
    loadAll()
      .then((foods) => !cancelled && setState({ foods, loading: false, error: "" }))
      .catch((err) => !cancelled && setState({ foods: [], loading: false, error: errorMessage(err, "Couldn't load the food library.") }));
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
