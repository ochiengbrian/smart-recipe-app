import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import RecipeCard from "../components/RecipeCard";
import Spinner from "../components/ui/Spinner";
import Alert from "../components/ui/Alert";
import { usePreferences } from "../context/PreferencesContext";
import { getDailySearchPool, searchRecipes } from "../services/recipeService";

function normalize(s) {
  return (s || "").toLowerCase().trim();
}

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const { prefs } = usePreferences();

  // User types here (no API calls while typing)
  const [qInput, setQInput] = useState("");

  // The query we actually execute (only updates when user presses Search)
  const [qActive, setQActive] = useState("");

  useEffect(() => {
  const params = new URLSearchParams(location.search);
  const qFromUrl = params.get("q") || "";

  if (qFromUrl) {
    setQInput(qFromUrl);
    // IMPORTANT: we intentionally do NOT set qActive here
    // so NO search happens until user presses the Search button
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


  const [sort, setSort] = useState("relevance"); // relevance | timeAsc | timeDesc
  const [visibleCount, setVisibleCount] = useState(6);

  const [pool, setPool] = useState([]); // daily pool
  const [items, setItems] = useState([]); // currently shown results

  const [loadingPool, setLoadingPool] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [err, setErr] = useState("");

  // 1) Load daily pool once/day (cached)
  useEffect(() => {
    const controller = new AbortController();

    async function run() {
      setErr("");
      setLoadingPool(true);
      try {
        const results = await getDailySearchPool(controller.signal);
        setPool(results);
      } catch (e) {
        if (e?.name === "AbortError") return;
        if (String(e?.message || "").toLowerCase().includes("aborted")) return;
        setErr(e.message || "Failed to load daily recipe pool.");
      } finally {
        setLoadingPool(false);
      }
    }

    run();
    return () => controller.abort();
  }, []);

  // helper: apply preferences client-side
  const applyPreferences = useCallback(
  (list) => {
    let out = list;

    // cuisine (simple client-side filter using tags/title text)
    if (prefs.cuisine && prefs.cuisine !== "Any") {
      const c = normalize(prefs.cuisine);
      out = out.filter(
        (r) =>
          normalize(r.title).includes(c) ||
          (r.tags || []).some((t) => normalize(t).includes(c))
      );
    }

    // max time
    if (prefs.maxTime && prefs.maxTime !== "Any") {
      const maxTime = Number(prefs.maxTime);
      out = out.filter((r) => {
        const mins = parseInt(r.time, 10);
        return Number.isFinite(mins) ? mins <= maxTime : true;
      });
    }

    // diet toggles (best effort using tags)
    if (prefs.diets.vegan) {
      out = out.filter((r) =>
        (r.tags || []).some((t) => normalize(t).includes("vegan"))
      );
    } else if (prefs.diets.vegetarian) {
      out = out.filter((r) =>
        (r.tags || []).some((t) => normalize(t).includes("vegetarian"))
      );
    }

    return out;
  },
  [
    prefs.cuisine,
    prefs.maxTime,
    prefs.diets.vegan,
    prefs.diets.vegetarian,
  ]
);


  // 2) Compute results from pool when qActive or prefs changes (NO API call)
  const poolResults = useMemo(() => {
    const q = normalize(qActive);
    let list = pool;

    // filter by query
    if (q) {
      list = list.filter((r) => {
        const inTitle = normalize(r.title).includes(q);
        const inTags = (r.tags || []).some((t) => normalize(t).includes(q));
        return inTitle || inTags;
      });
    }

    list = applyPreferences(list);

    // sort
    if (sort === "timeAsc") {
      list = [...list].sort((a, b) => parseInt(a.time, 10) - parseInt(b.time, 10));
    }
    if (sort === "timeDesc") {
      list = [...list].sort((a, b) => parseInt(b.time, 10) - parseInt(a.time, 10));
    }

    return list;
  }, [
    pool, qActive, sort, applyPreferences
  ]);

  // when poolResults changes, update displayed items
  useEffect(() => {
    setVisibleCount(6);
    setItems(poolResults);
  }, [poolResults]);

  function buildDietParam() {
    return prefs.diets.vegan
      ? "vegan"
      : prefs.diets.vegetarian
      ? "vegetarian"
      : prefs.diets.glutenFree
      ? "gluten free"
      : prefs.diets.dairyFree
      ? "dairy free"
      : undefined;
  }

  // 3) If pool gives zero results, fallback to API (only when user presses Search)
  async function fallbackApiSearch(queryText) {
    const controller = new AbortController();
    setLoadingSearch(true);
    setErr("");

    try {
      const dietParam = buildDietParam();

      const results = await searchRecipes(
        {
          query: queryText || "",
          number: 6, // ✅ reduced default
          sort: queryText ? undefined : "popularity",
          cuisine: prefs.cuisine !== "Any" ? prefs.cuisine : undefined,
          diet: dietParam,
        },
        controller.signal
      );

      // Apply maxTime preference client-side
      const maxTimeParam = prefs.maxTime !== "Any" ? Number(prefs.maxTime) : undefined;
      const filteredByTime = maxTimeParam
        ? results.filter((r) => {
            const mins = parseInt(r.time, 10);
            return Number.isFinite(mins) ? mins <= maxTimeParam : true;
          })
        : results;

      setItems(filteredByTime);
    } catch (e) {
      if (e?.name === "AbortError") return;
      if (String(e?.message || "").toLowerCase().includes("aborted")) return;
      setErr(e.message || "Failed to search recipes.");
    } finally {
      setLoadingSearch(false);
    }

    return () => controller.abort();
  }

  // Click-to-search handler
  async function onSubmit(e) {
    e.preventDefault();
    const text = qInput.trim();
    setQActive(text);

    // if pool already yields results, NO API CALL
    // if pool yields zero results, do 1 API call
    // note: we use the computed poolResults AFTER qActive updates,
    // so we compute quickly here too:
    const q = normalize(text);
    let quickPool = pool;

    if (q) {
      quickPool = quickPool.filter((r) => {
        const inTitle = normalize(r.title).includes(q);
        const inTags = (r.tags || []).some((t) => normalize(t).includes(q));
        return inTitle || inTags;
      });
    }

    quickPool = applyPreferences(quickPool);

    if (quickPool.length === 0) {
      await fallbackApiSearch(text);
    }
  }

  const visible = items.slice(0, visibleCount);

  return (
    <div className="stack">
      <section className="searchTop">
        <Card title="Search recipes" subtitle="We search locally first (daily pool). API is used only if needed.">
          <div className="searchControls">
            <form onSubmit={onSubmit} className="row" style={{ gap: "12px", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "240px" }}>
                <Input
                  value={qInput}
                  onChange={(e) => setQInput(e.target.value)}
                  placeholder="Type a recipe name, ingredient, or tag..."
                  autoComplete="off"
                />
              </div>

              <Button variant="primary" size="lg" type="submit">
                Search
              </Button>

              <Button
                variant="ghost"
                size="lg"
                type="button"
                onClick={() => {
                  setQInput("");
                  setQActive("");
                  setVisibleCount(6);
                  setSort("relevance");
                  setItems(applyPreferences(pool));
                  setErr("");
                }}
              >
                Clear
              </Button>
            </form>

            <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
              <div style={{ minWidth: "240px", flex: 1 }}>
                <select
                  className="select"
                  value={sort}
                  onChange={(e) => {
                    setVisibleCount(6);
                    setSort(e.target.value);
                  }}
                >
                  <option value="relevance">Sort: Relevance</option>
                  <option value="timeAsc">Sort: Time (fastest first)</option>
                  <option value="timeDesc">Sort: Time (slowest first)</option>
                </select>
              </div>

              <Button variant="ghost" onClick={() => navigate("/ingredients")}>
                Cook with ingredients
              </Button>
            </div>

            {loadingPool ? <Spinner label="Loading daily recipe pool..." /> : null}
            {loadingSearch ? <Spinner label="Searching API (fallback)..." /> : null}
            {err ? <Alert message={err} /> : null}
          </div>
        </Card>

        <Card title="How this saves API calls" subtitle="Daily pool + fallback only when needed.">
          <div className="stack">
            <p className="muted" style={{ margin: 0 }}>
              Most searches run on the daily pool (0 API calls). We only call the API if your search returns no matches.
            </p>
            <p className="muted" style={{ margin: 0 }}>
              Pool refreshes once per day (first app open after midnight).
            </p>
          </div>
        </Card>
      </section>

      <section className="section">
        <div className="searchMetaLine">
          <h2 className="sectionTitle" style={{ margin: 0 }}>Results</h2>
          <p className="sectionHint" style={{ margin: 0 }}>
            Showing {visible.length} of {items.length}
          </p>
        </div>

        {(!loadingPool && !loadingSearch && !err && items.length === 0) ? (
          <div className="emptyState" style={{ marginTop: "16px" }}>
            <h3 style={{ margin: 0 }}>No matches found</h3>
            <p className="muted" style={{ marginTop: "10px" }}>
              Try a different keyword, or we’ll fallback to API on Search.
            </p>
          </div>
        ) : (
          <>
            <div className="grid" style={{ marginTop: "16px" }}>
              {visible.map((r) => (
                <RecipeCard key={r.id} recipe={r} />
              ))}
            </div>

            {visibleCount < items.length ? (
              <div style={{ marginTop: "18px", display: "flex", justifyContent: "center" }}>
                <Button variant="ghost" size="lg" onClick={() => setVisibleCount((c) => c + 6)}>
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
