import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loadJSON, saveJSON } from "../services/storage";

const FavoritesContext = createContext(null);

const STORAGE_KEY = "smartRecipe:favorites";
// We'll store favorites as an object map by id: { [id]: recipeCardData }
const DEFAULT_VALUE = {};

export function FavoritesProvider({ children }) {
  const [favoritesMap, setFavoritesMap] = useState(() => loadJSON(STORAGE_KEY, DEFAULT_VALUE));

  useEffect(() => {
    saveJSON(STORAGE_KEY, favoritesMap);
  }, [favoritesMap]);

  const api = useMemo(() => {
    function isFavorite(id) {
      return Boolean(favoritesMap[String(id)]);
    }

    function addFavorite(recipeCard) {
      const id = String(recipeCard.id);
      setFavoritesMap((prev) => ({ ...prev, [id]: recipeCard }));
    }

    function removeFavorite(id) {
      const key = String(id);
      setFavoritesMap((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }

    function toggleFavorite(recipeCard) {
      const id = String(recipeCard.id);
      if (favoritesMap[id]) removeFavorite(id);
      else addFavorite(recipeCard);
    }

    function listFavorites() {
      // Return array sorted by title
      return Object.values(favoritesMap).sort((a, b) =>
        String(a.title).localeCompare(String(b.title))
      );
    }

    return { isFavorite, addFavorite, removeFavorite, toggleFavorite, listFavorites };
  }, [favoritesMap]);

  return <FavoritesContext.Provider value={api}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside <FavoritesProvider>");
  return ctx;
}
