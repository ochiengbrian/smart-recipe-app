import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import RecipeCard from "../components/RecipeCard";
import { mockRecipes } from "../data/mockRecipes";
import { useDebounce } from "../services/useDebounce";

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

  const debouncedQ = useDebounce(q, 250);

  const [difficulty, setDifficulty] = useState("all"); // all | easy | medium
  const [time, setTime] = useState("all"); // all | under15 | under30 | under45
  const [sort, setSort] = useState("relevance"); // relevance | timeAsc | timeDesc

  const [visibleCount, setVisibleCount] = useState(6);

  const filtered = useMemo(() => {
    const query = normalize(debouncedQ);

    let list = mockRecipes.filter((r) => {
      const inTitle = normalize(r.title).includes(query);
      const inTags = (r.tags || []).some((t) => normalize(t).includes(query));
      const inDiff = normalize(r.difficulty).includes(query);

      const queryOk = query ? (inTitle || inTags || inDiff) : true;

      const diffOk =
        difficulty === "all" ? true : normalize(r.difficulty) === difficulty;

      const timeOk = time === "all" ? true : matchesTimeFilter(r.time, time);

      return queryOk && diffOk && timeOk;
    });

    // Sorting
    if (sort === "timeAsc") {
      list = [...list].sort((a, b) => parseInt(a.time, 10) - parseInt(b.time, 10));
    }
    if (sort === "timeDesc") {
      list = [...list].sort((a, b) => parseInt(b.time, 10) - parseInt(a.time, 10));
    }

    // "relevance" keeps original mock order

    return list;
  }, [debouncedQ, difficulty, time, sort]);

  const visible = filtered.slice(0, visibleCount);

  function toggleDifficulty(next) {
    setVisibleCount(6);
    setDifficulty((prev) => (prev === next ? "all" : next));
  }

  function toggleTime(next) {
    setVisibleCount(6);
    setTime((prev) => (prev === next ? "all" : next));
  }

  return (
    <div className="stack">
      <section className="searchTop">
        <Card
          title="Search recipes"
          subtitle="Type a recipe, ingredient, or tag. Filters update automatically."
        >
          <div className="searchControls">
            <Input
              value={q}
              onChange={(e) => {
                setVisibleCount(6);
                setQ(e.target.value);
              }}
              placeholder="Try: pasta, chicken, quick, vegetarian..."
              autoComplete="off"
            />

            <div className="filterRow">
              <button
                type="button"
                className={`pill ${difficulty === "easy" ? "pillActive" : ""}`}
                onClick={() => toggleDifficulty("easy")}
              >
                Easy
              </button>

              <button
                type="button"
                className={`pill ${difficulty === "medium" ? "pillActive" : ""}`}
                onClick={() => toggleDifficulty("medium")}
              >
                Medium
              </button>

              <button
                type="button"
                className={`pill ${time === "under15" ? "pillActive" : ""}`}
                onClick={() => toggleTime("under15")}
              >
                ≤ 15 min
              </button>

              <button
                type="button"
                className={`pill ${time === "under30" ? "pillActive" : ""}`}
                onClick={() => toggleTime("under30")}
              >
                ≤ 30 min
              </button>

              <button
                type="button"
                className={`pill ${time === "under45" ? "pillActive" : ""}`}
                onClick={() => toggleTime("under45")}
              >
                ≤ 45 min
              </button>
            </div>

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

              <Button
                variant="ghost"
                onClick={() => {
                  setQ("");
                  setDifficulty("all");
                  setTime("all");
                  setSort("relevance");
                  setVisibleCount(6);
                }}
              >
                Clear filters
              </Button>
            </div>

            <p className="muted" style={{ margin: 0 }}>
              Phase 7 will replace mock recipes with real API results.
            </p>
          </div>
        </Card>

        <Card
          title="Quick tip"
          subtitle="You can also cook using ingredients you already have."
        >
          <div className="stack">
            <p className="muted">
              Want ideas without shopping? Add what’s in your kitchen and we’ll recommend recipes that match.
            </p>
            <Button variant="primary" onClick={() => navigate("/ingredients")}>
  Go to Ingredients
</Button>

          </div>
        </Card>
      </section>

      <section className="section">
        <div className="searchMetaLine">
          <h2 className="sectionTitle" style={{ margin: 0 }}>
            Results
          </h2>
          <p className="sectionHint" style={{ margin: 0 }}>
            Showing {visible.length} of {filtered.length}
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="emptyState" style={{ marginTop: "16px" }}>
            <h3 style={{ margin: 0 }}>No matches found</h3>
            <p className="muted" style={{ marginTop: "10px" }}>
              Try a different keyword (e.g., “quick”, “vegetarian”, “chicken”).
            </p>
          </div>
        ) : (
          <>
            <div className="grid" style={{ marginTop: "16px" }}>
              {visible.map((r) => (
                <RecipeCard key={r.id} recipe={r} />
              ))}
            </div>

            {visibleCount < filtered.length ? (
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
