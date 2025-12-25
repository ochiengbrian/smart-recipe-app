import { Link } from "react-router-dom";
import Badge from "./ui/Badge";
import { useFavorites } from "../context/FavoritesContext";

export default function RecipeCard({ recipe }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const saved = isFavorite(recipe.id);

  return (
    <div className="recipeCard">
      <div className="recipeThumb">
        <img src={recipe.image} alt={recipe.title} loading="lazy" />
        <div className="recipeOverlay" />

        <button
          type="button"
          className={`saveBtn ${saved ? "saveBtnSaved" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(recipe);
          }}
          aria-label={saved ? "Remove from favorites" : "Save to favorites"}
          title={saved ? "Saved" : "Save"}
        >
          {saved ? "✓" : "+"}
        </button>
      </div>

      <Link to={`/recipes/${recipe.id}`} className="recipeLink" aria-label={`Open ${recipe.title}`}>
        <div className="recipeBody">
          <div className="recipeMeta">
            <Badge tone={recipe.difficulty === "Easy" ? "success" : "warning"}>
              {recipe.difficulty}
            </Badge>
            <span className="recipeTime">{recipe.time}</span>
          </div>

          <h3 className="recipeTitle">{recipe.title}</h3>

          <div className="recipeTags">
            {(recipe.tags || []).slice(0, 2).map((t) => (
              <span key={t} className="miniTag">
                {t}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}
