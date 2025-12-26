import {apiGetCached } from "./apiClient";
import { getTodayKey, msUntilNextMidnight } from "./dailyCache";


function difficultyFromMinutes(mins) {
  if (mins <= 20) return "Easy";
  if (mins <= 40) return "Medium";
  return "Hard";
}

function dailyOffset(maxOffset = 120) {
  // Deterministic "random" offset based on date string
  const key = getTodayKey(); // YYYY-MM-DD
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) % 100000;
  return hash % maxOffset;
}


export function mapToCard(r) {
  const minutes = r.readyInMinutes;
  return {
    id: String(r.id),
    title: r.title,
    time: minutes ? `${minutes} min` : "—",
    difficulty: minutes ? difficultyFromMinutes(minutes) : "Easy",
    tags: (r.diets && r.diets.length ? r.diets : r.dishTypes || []).slice(0, 2),
    image: r.image,
  };
}


// Search recipes (text search)
export async function searchRecipes(
  { query, number = 12, diet, cuisine, sort },
  signal
) {
  const ttl = msUntilNextMidnight();

  const cacheKey = `search:${getTodayKey()}|q=${query || ""}|n=${number}|diet=${diet || ""}|cuisine=${cuisine || ""}|sort=${sort || ""}`;

  const data = await apiGetCached(
    cacheKey,
    "/recipes/complexSearch",
    {
      query: query || undefined,
      number,
      addRecipeInformation: true,
      diet,
      cuisine,
      sort: sort || undefined,
    },
    ttl,
    signal
  );

  return (data.results || []).map(mapToCard);
}



// Find recipes by ingredients
export async function findByIngredients({ ingredients, number = 12 }, signal) {
  const ttl = msUntilNextMidnight();

  const list = ingredients.map((x) => x.trim()).filter(Boolean).join(",").toLowerCase();
  const cacheKey = `ingredients:${getTodayKey()}|list=${list}|n=${number}`;

  const data = await apiGetCached(
    cacheKey,
    "/recipes/findByIngredients",
    {
      ingredients: ingredients.join(","),
      number,
      ranking: 1,
      ignorePantry: true,
    },
    ttl,
    signal
  );

  return (data || []).map((r) => ({
    id: String(r.id),
    title: r.title,
    time: "—",
    difficulty: "Easy",
    tags: [],
    image: r.image,
  }));
}


// Recipe details
export async function getRecipeDetails(id, signal) {
  const ttl = msUntilNextMidnight();
  const cacheKey = `recipeDetails:${getTodayKey()}|id=${id}`;

  return apiGetCached(
    cacheKey,
    `/recipes/${id}/information`,
    { includeNutrition: false },
    ttl,
    signal
  );
}


export function extractSteps(recipeDetails) {
  const analyzed = recipeDetails?.analyzedInstructions;
  if (Array.isArray(analyzed) && analyzed.length > 0) {
    const steps = analyzed[0]?.steps || [];
    return steps
      .map((s) => (s?.step || "").trim())
      .filter(Boolean);
  }

  // Fallback: basic instructions string (often HTML)
  const raw = recipeDetails?.instructions || "";
  const text = raw
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Split into sentences as a rough fallback
  if (!text) return [];
  return text.split(". ").map((x) => x.trim()).filter(Boolean);
}

export async function getDailyFeatured(signal) {
  const ttl = msUntilNextMidnight();
  const offset = dailyOffset(120);

  const cacheKey = `dailyFeatured:${getTodayKey()}`;

  const data = await apiGetCached(
    cacheKey,
    "/recipes/complexSearch",
    {
      query: "",                // no keyword
      sort: "popularity",
      number: 6,
      offset,                   // daily variation
      addRecipeInformation: true,
    },
    ttl,
    signal
  );

  return (data.results || []).map(mapToCard);
}

export async function getDailyRecommended(signal) {
  const ttl = msUntilNextMidnight();
  const offset = dailyOffset(120);

  const cacheKey = `dailyRecommended:${getTodayKey()}`;

  const data = await apiGetCached(
    cacheKey,
    "/recipes/complexSearch",
    {
      query: "quick",           // a stable theme for dashboard
      number: 6,
      offset,                   // daily variation
      addRecipeInformation: true,
    },
    ttl,
    signal
  );

  return (data.results || []).map(mapToCard);
}

export async function getDailySearchPool(signal) {
  const ttl = msUntilNextMidnight();
  const offset = dailyOffset(180);

  const cacheKey = `dailySearchPool:${getTodayKey()}`;

  const data = await apiGetCached(
    cacheKey,
    "/recipes/complexSearch",
    {
      query: "", // broad pool
      sort: "popularity",
      number: 18, // pool size
      offset,
      addRecipeInformation: true,
    },
    ttl,
    signal
  );

  return (data.results || []).map(mapToCard);
}
