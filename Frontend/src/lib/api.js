// src/lib/api.js
// One HTTP client for the whole app. Several components used to hardcode
// "http://localhost:9000" (and one used :5000), which breaks the moment the
// app runs anywhere else. Everything goes through here instead.
import axios from "axios";
import { useEffect, useState } from "react";

export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:9000";

export const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** Turn an axios error into something readable for the UI. */
export const errorMessage = (err, fallback = "Something went wrong.") =>
  err?.response?.data?.message ||
  err?.response?.data?.error ||
  (err?.request && !err?.response ? "Can't reach the server. Is the backend running?" : fallback);

/**
 * GET a URL and track loading/error state. Re-fetches when `url` or any
 * value in `deps` changes. Pass url = null to skip.
 */
export function useApi(url, { params, deps = [], select } = {}) {
  const [state, setState] = useState({ data: null, loading: !!url, error: "" });

  useEffect(() => {
    if (!url) {
      setState({ data: null, loading: false, error: "" });
      return;
    }
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: "" }));
    api
      .get(url, { params })
      .then((res) => {
        if (!cancelled) setState({ data: select ? select(res.data) : res.data, loading: false, error: "" });
      })
      .catch((err) => {
        if (!cancelled) setState({ data: null, loading: false, error: errorMessage(err) });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, JSON.stringify(params || {}), ...deps]);

  return state;
}
