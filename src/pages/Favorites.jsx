import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import RecipeCard from "../components/RecipeCard";
import { useFavorites } from "../context/FavoritesContext";
import { Link } from "react-router-dom";

export default function Favorites() {
  const { listFavorites } = useFavorites();
  const items = listFavorites();

  return (
    <div className="stack">
      <Card title="Favorites" subtitle="Your saved recipes (stored on this device).">
        {items.length === 0 ? (
          <div className="stack">
            <p className="muted">You haven’t saved any recipes yet.</p>
            <Link to="/search">
              <Button variant="primary">Browse recipes</Button>
            </Link>
          </div>
        ) : (
          <p className="muted">
            You have {items.length} saved recipe{items.length === 1 ? "" : "s"}.
          </p>
        )}
      </Card>

      {items.length > 0 ? (
        <section className="section">
          <div className="grid">
            {items.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
