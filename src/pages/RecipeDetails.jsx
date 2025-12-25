import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Spinner from "../components/ui/Spinner";
import Alert from "../components/ui/Alert";
import Badge from "../components/ui/Badge";
import { getRecipeDetails } from "../services/recipeService";

export default function RecipeDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function run() {
      setErr("");
      setLoading(true);
      try {
        const d = await getRecipeDetails(id, controller.signal);
        setData(d);
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
  }, [id]);

  return (
    <div className="stack">
      <Card title="Recipe Details" subtitle={`Recipe ID: ${id}`}>
        <div className="row" style={{ flexWrap: "wrap" }}>
          <Link to="/search"><Button variant="ghost">Back to Search</Button></Link>
          <Link to="/ingredients"><Button variant="ghost">Cook With Ingredients</Button></Link>
        </div>

        {loading ? <div style={{ marginTop: "16px" }}><Spinner label="Loading recipe..." /></div> : null}
        {err ? <div style={{ marginTop: "16px" }}><Alert message={err} /></div> : null}

        {data ? (
          <div style={{ marginTop: "16px" }} className="stack">
            <img
              src={data.image}
              alt={data.title}
              style={{ borderRadius: "18px", border: "1px solid var(--color-border)" }}
            />

            <h2 style={{ margin: 0 }}>{data.title}</h2>

            <div className="row" style={{ flexWrap: "wrap" }}>
              <Badge tone="neutral">{data.readyInMinutes} min</Badge>
              <Badge tone="success">{data.servings} servings</Badge>
              {(data.diets || []).slice(0, 2).map((d) => (
                <Badge key={d} tone="warning">{d}</Badge>
              ))}
            </div>

            <div>
              <h3>Ingredients</h3>
              <ul>
                {(data.extendedIngredients || []).slice(0, 12).map((x) => (
                  <li key={x.id}>{x.original}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3>Instructions</h3>
              <p className="muted">
                {data.instructions ? (
                  <span dangerouslySetInnerHTML={{ __html: data.instructions }} />
                ) : (
                  "No instructions provided for this recipe."
                )}
              </p>
            </div>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
