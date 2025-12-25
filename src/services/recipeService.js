import { apiGet } from "./apiClient";

function difficultyFromMinutes(mins) {
  if (mins <= 20) return "Easy";
  if (mins <= 40) return "Medium";
  return "Hard";
}

export function mapToCard(r) {
  const minutes = r.readyInMinutes ?? r.readyInMinutes;
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
  { query, number = 12, diet, cuisine, sort }, // sort optional
  signal
) {
  const data = await apiGet(
    "/recipes/complexSearch",
    {
      query: query || undefined,
      number,
      addRecipeInformation: true,
      diet,
      cuisine,
      sort: sort || undefined, // e.g. "popularity"
    },
    signal
  );

  return (data.results || []).map(mapToCard);
}


// Find recipes by ingredients
export async function findByIngredients({ ingredients, number = 12 }, signal) {
  // Spoonacular expects comma-separated list
  const data = await apiGet(
    "/recipes/findByIngredients",
    {
      ingredients: ingredients.join(","),
      number,
      ranking: 1,
      ignorePantry: true,
    },
    signal
  );

  // This endpoint returns a simpler object; we map basics:
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
  return apiGet(`/recipes/${id}/information`, { includeNutrition: false }, signal);
}
