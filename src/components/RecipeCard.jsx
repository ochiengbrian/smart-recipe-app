import { Link } from "react-router-dom";
import Badge from "./ui/Badge";
import Card from "./ui/Card";

export default function RecipeCard({ recipe }) {
  return (
    <Link to={`/recipes/${recipe.id}`} className="recipeLink" aria-label={`Open ${recipe.title}`}>
      <article className="recipeCard">
        <div className="recipeThumb">
          <img src={recipe.image} alt={recipe.title} loading="lazy" />
          <div className="recipeOverlay" />
        </div>

        <div className="recipeBody">
          <div className="recipeMeta">
            <Badge tone={recipe.difficulty === "Easy" ? "success" : "warning"}>
              {recipe.difficulty}
            </Badge>
            <span className="recipeTime">{recipe.time}</span>
          </div>

          <h3 className="recipeTitle">{recipe.title}</h3>

          <div className="recipeTags">
            {recipe.tags.slice(0, 2).map((t) => (
              <span key={t} className="miniTag">
                {t}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}
