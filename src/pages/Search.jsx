import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import RecipeCard from "../components/RecipeCard";
import Spinner from "../components/ui/Spinner";
import Alert from "../components/ui/Alert";
import { useDebounce } from "../services/useDebounce";
import { searchRecipes } from "../services/recipeService";
import { usePreferences } from "../context/PreferencesContext";



function normalize(s) {
  return (s || "").trim().toLowerCase();
}

function matchesTimeFilter(recipeTime, timeFilter) {
  // recipeTime looks like "20 min"
  const num = parseInt(recipeTime, 10);
  if (Number.isNaN(num)) return true;

  if (timeFilter === "under15") return num <= 15;
  if (timeFilter === "under30") return num <= 30;
  if (timeFilter === "under45") return num <= 45;
  return true;
}

export default function Search() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const debouncedQ = useDebounce(q, 300);
  const { prefs } = usePreferences();


  const [sort, setSort] = useState("relevance");
  const [visibleCount, setVisibleCount] = useState(9);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function run() {
      setErr("");
      setLoading(true);

      try {
        const dietParam =
  prefs.diets.vegan ? "vegan" :
  prefs.diets.vegetarian ? "vegetarian" :
  prefs.diets.glutenFree ? "gluten free" :
  prefs.diets.dairyFree ? "dairy free" :
  undefined;

const maxTimeParam = prefs.maxTime !== "Any" ? Number(prefs.maxTime) : undefined;

const results = await searchRecipes(
  {
    query: debouncedQ || "",
    number: 18,
    sort: debouncedQ ? undefined : "popularity",
    cuisine: prefs.cuisine !== "Any" ? prefs.cuisine : undefined,
    diet: dietParam,
  },
  controller.signal
);

// If maxTime is set, filter client-side (simple + effective)
const filteredByTime = maxTimeParam
  ? results.filter((r) => {
      const mins = parseInt(r.time, 10);
      return Number.isFinite(mins) ? mins <= maxTimeParam : true;
    })
  : results;

setItems(filteredByTime);


        setItems(results);
      } catch (e) {
  // Ignore "AbortError" (happens when user types quickly or component re-renders)
  if (e?.name === "AbortError") return;
  if (String(e?.message || "").toLowerCase().includes("aborted")) return;

  setErr(e.message || "Failed to load recipes.");
} finally {
  setLoading(false);
}

    }

    run();
    return () => controller.abort();
  }, [debouncedQ]);

  const sorted = useMemo(() => {
    if (sort === "relevance") return items;
    if (sort === "timeAsc") return [...items].sort((a, b) => parseInt(a.time, 10) - parseInt(b.time, 10));
    if (sort === "timeDesc") return [...items].sort((a, b) => parseInt(b.time, 10) - parseInt(a.time, 10));
    return items;
  }, [items, sort]);

  const visible = sorted.slice(0, visibleCount);

  return (
    <div className="stack">
      <section className="searchTop">
        <Card title="Search recipes" subtitle="Real recipes are now loaded from the API.">
          <div className="searchControls">
            <Input
              value={q}
              onChange={(e) => {
                setVisibleCount(9);
                setQ(e.target.value);
              }}
              placeholder="Try: pasta, chicken, vegetarian..."
              autoComplete="off"
            />

            <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
              <div style={{ minWidth: "240px", flex: 1 }}>
                <select
                  className="select"
                  value={sort}
                  onChange={(e) => {
                    setVisibleCount(9);
                    setSort(e.target.value);
                  }}
                >
                  <option value="relevance">Sort: Relevance</option>
                  <option value="timeAsc">Sort: Time (fastest first)</option>
                  <option value="timeDesc">Sort: Time (slowest first)</option>
                </select>
              </div>

              <Button variant="ghost" onClick={() => { setQ(""); setSort("relevance"); setVisibleCount(9); }}>
                Clear
              </Button>
            </div>

            {loading ? <Spinner label="Fetching recipes..." /> : null}
            {err ? <Alert message={err} /> : null}
          </div>
        </Card>

        <Card title="Cook with ingredients" subtitle="Get recipes based on what you already have.">
          <div className="stack">
            <Button variant="primary" onClick={() => navigate("/ingredients")}>
              Go to Ingredients
            </Button>
            <p className="muted" style={{ margin: 0 }}>
              Add items in your kitchen, then we’ll match recipes.
            </p>
          </div>
        </Card>
      </section>

      <section className="section">
        <div className="searchMetaLine">
          <h2 className="sectionTitle" style={{ margin: 0 }}>Results</h2>
          <p className="sectionHint" style={{ margin: 0 }}>
            Showing {visible.length} of {sorted.length}
          </p>
        </div>

        {(!loading && !err && sorted.length === 0) ? (
          <div className="emptyState" style={{ marginTop: "16px" }}>
            <h3 style={{ margin: 0 }}>No matches found</h3>
            <p className="muted" style={{ marginTop: "10px" }}>
              Try a different keyword.
            </p>
          </div>
        ) : (
          <>
            <div className="grid" style={{ marginTop: "16px" }}>
              {visible.map((r) => (
                <RecipeCard key={r.id} recipe={r} />
              ))}
            </div>

            {visibleCount < sorted.length ? (
              <div style={{ marginTop: "18px", display: "flex", justifyContent: "center" }}>
                <Button variant="ghost" size="lg" onClick={() => setVisibleCount((c) => c + 9)}>
                  Load more
                </Button>
              </div>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}

