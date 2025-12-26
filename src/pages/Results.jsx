import { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Chip from "../components/ui/Chip";
import RecipeCard from "../components/RecipeCard";
import Spinner from "../components/ui/Spinner";
import Alert from "../components/ui/Alert";
import { findByIngredients } from "../services/recipeService";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Results() {
  const query = useQuery();
  const ingRaw = query.get("ing") || "";
  const ingredients = ingRaw
    ? decodeURIComponent(ingRaw).split(",").map((x) => x.trim()).filter(Boolean)
    : [];

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (ingredients.length === 0) return;

    const controller = new AbortController();

    async function run() {
      setErr("");
      setLoading(true);
      try {
        const results = await findByIngredients({ ingredients, number: 18 }, controller.signal);
        setItems(results);
      } catch (e) {
  if (e?.name === "AbortError") return;
  if (String(e?.message || "").toLowerCase().includes("aborted")) return;

  setErr(e.message || "Failed to load recipes.");
} finally {
  setLoading(false);
}

    }

    run();
    return () => controller.abort();
  }, [ingRaw, ingredients]); // re-run if query changes

  return (
    <div className="stack">
      <Card
        title="Recipes you can make"
        subtitle="Based on the ingredients you entered."
      >
        {ingredients.length === 0 ? (
          <p className="muted">No ingredients received. Go add some first.</p>
        ) : (
          <>
            <p className="muted">You selected:</p>
            <div className="chipWrap" style={{ marginTop: "12px" }}>
              {ingredients.map((i) => <Chip key={i} label={i} />)}
            </div>
          </>
        )}

        <div style={{ marginTop: "16px" }} className="row">
          <Link to="/ingredients"><Button variant="ghost">Edit Ingredients</Button></Link>
          <Link to="/search"><Button variant="primary">Search Instead</Button></Link>
        </div>

        {loading ? <div style={{ marginTop: "16px" }}><Spinner label="Matching recipes..." /></div> : null}
        {err ? <div style={{ marginTop: "16px" }}><Alert message={err} /></div> : null}
      </Card>

      {(!loading && !err && items.length > 0) ? (
        <section className="section">
          <div className="grid">
            {items.map((r) => <RecipeCard key={r.id} recipe={r} />)}
          </div>
        </section>
      ) : null}
    </div>
  );
}
