import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loadJSON, saveJSON } from "../services/storage";

const PreferencesContext = createContext(null);

const STORAGE_KEY = "smartRecipe:preferences";

const DEFAULT_PREFS = {
  diets: {
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
  },
  cuisine: "Any", // Any, Italian, Indian, etc
  maxTime: "Any", // Any, 15, 30, 45
};

export function PreferencesProvider({ children }) {
  const [prefs, setPrefs] = useState(() => loadJSON(STORAGE_KEY, DEFAULT_PREFS));

  useEffect(() => {
    saveJSON(STORAGE_KEY, prefs);
  }, [prefs]);

  const api = useMemo(() => {
    function setDiet(key, value) {
      setPrefs((prev) => ({
        ...prev,
        diets: { ...prev.diets, [key]: value },
      }));
    }

    function setCuisine(value) {
      setPrefs((prev) => ({ ...prev, cuisine: value }));
    }

    function setMaxTime(value) {
      setPrefs((prev) => ({ ...prev, maxTime: value }));
    }

    function reset() {
      setPrefs(DEFAULT_PREFS);
    }

    return { prefs, setDiet, setCuisine, setMaxTime, reset };
  }, [prefs]);

  return <PreferencesContext.Provider value={api}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used inside <PreferencesProvider>");
  return ctx;
}
