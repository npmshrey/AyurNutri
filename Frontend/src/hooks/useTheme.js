// src/hooks/useTheme.js
// Light/dark preference shared by every toggle in the app. index.html
// applies the saved value before first paint; this keeps React in sync
// and lets toggles in different components update each other.
import { useCallback, useEffect, useState } from "react";

const EVENT = "ayurnutri:theme";

const readTheme = () => {
  try {
    return localStorage.getItem("theme") === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
};

const useTheme = () => {
  const [theme, setThemeState] = useState(readTheme);

  useEffect(() => {
    const sync = () => setThemeState(readTheme());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const setTheme = useCallback((next) => {
    try {
      localStorage.setItem("theme", next);
    } catch {
      /* storage blocked — still switch for this session */
    }
    document.documentElement.setAttribute("data-theme", next);
    setThemeState(next);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  const toggleTheme = useCallback(
    () => setTheme(readTheme() === "dark" ? "light" : "dark"),
    [setTheme]
  );

  return { theme, setTheme, toggleTheme };
};

export default useTheme;
