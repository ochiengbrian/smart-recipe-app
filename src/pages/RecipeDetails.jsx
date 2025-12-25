import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Spinner from "../components/ui/Spinner";
import Alert from "../components/ui/Alert";
import Badge from "../components/ui/Badge";
import { extractSteps, getRecipeDetails } from "../services/recipeService";

function stripHtml(html) {
  return (html || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export default function RecipeDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [checked, setChecked] = useState({}); // ingredientId -> true

  useEffect(() => {
    const controller = new AbortController();

    async function run() {
      setErr("");
      setLoading(true);
      try {
        const d = await getRecipeDetails(id, controller.signal);
        setData(d);
        setChecked({});
      } catch (e) {
        if (e?.name === "AbortError") return;
        if (String(e?.message || "").toLowerCase().includes("aborted")) return;
        setErr(e.message || "Failed to load recipe details.");
      } finally {
        setLoading(false);
      }
    }

    run();
    return () => controller.abort();
  }, [id]);

  const steps = useMemo(() => (data ? extractSteps(data) : []), [data]);
  const diets = (data?.diets || []).slice(0, 4);

  function toggleIngredient(ingId) {
    setChecked((prev) => ({ ...prev, [ingId]: !prev[ingId] }));
  }

  return (
    <div className="stack">
      {loading ? <Spinner label="Loading recipe..." /> : null}
      {err ? <Alert message={err} /> : null}

      {data ? (
        <>
          {/* HERO */}
          <section className="recipeHero">
            <div className="heroMedia">
              <img src={data.image} alt={data.title} loading="lazy" />
            </div>

            <div className="heroInfo">
              <h1 className="heroTitle">{data.title}</h1>

              <div className="heroBadges">
                {data.readyInMinutes ? <Badge tone="neutral">{data.readyInMinutes} min</Badge> : null}
                {data.servings ? <Badge tone="success">{data.servings} servings</Badge> : null}
                {diets.map((d) => (
                  <Badge key={d} tone="warning">{d}</Badge>
                ))}
              </div>

              <div className="heroActions">
                <Link to={`/recipes/${id}/cook`}>
                  <Button variant="primary" size="lg">Start Cooking</Button>
                </Link>

                <Link to="/search">
                  <Button variant="ghost" size="lg">Back to Search</Button>
                </Link>
              </div>

              {data.summary ? (
                <p className="muted" style={{ marginTop: "14px" }}>
                  {stripHtml(data.summary).slice(0, 220)}{stripHtml(data.summary).length > 220 ? "…" : ""}
                </p>
              ) : null}
            </div>
          </section>

          {/* CONTENT */}
          <section className="twoCol">
            {/* Ingredients */}
            <Card title="Ingredients" subtitle="Check off as you go.">
              <div className="ingList">
                {(data.extendedIngredients || []).map((ing) => {
                  const isDone = Boolean(checked[ing.id]);
                  return (
                    <label key={ing.id} className="ingItem">
                      <input
                        className="ingCheck"
                        type="checkbox"
                        checked={isDone}
                        onChange={() => toggleIngredient(ing.id)}
                      />
                      <span className={`ingText ${isDone ? "ingTextDone" : ""}`}>
                        {ing.original}
                      </span>
                    </label>
                  );
                })}
              </div>
            </Card>

            {/* Steps */}
            <Card title="Instructions" subtitle="Clear step-by-step guidance.">
              {steps.length === 0 ? (
                <p className="muted">No structured steps available for this recipe.</p>
              ) : (
                <div className="stepList">
                  {steps.map((s, idx) => (
                    <div key={idx} className="stepItem">
                      <div className="stepNum">Step {idx + 1}</div>
                      <p className="stepText">{s}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </section>
        </>
      ) : null}
    </div>
  );
}
