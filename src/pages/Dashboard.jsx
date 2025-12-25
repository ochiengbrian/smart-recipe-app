import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import RecipeCard from "../components/RecipeCard";
import { useEffect } from "react";
import Spinner from "../components/ui/Spinner";
import Alert from "../components/ui/Alert";
import { searchRecipes } from "../services/recipeService";

import { useState } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const [recommended, setRecommended] = useState([]);
const [loadingRecs, setLoadingRecs] = useState(false);
const [errRecs, setErrRecs] = useState("");

useEffect(() => {
  const controller = new AbortController();

  async function run() {
    setErrRecs("");
    setLoadingRecs(true);

    try {
      const results = await searchRecipes(
        { query: "quick", number: 6 },
        controller.signal
      );
      setRecommended(results);
    } catch (e) {
      if (e?.name === "AbortError") return;
      if (String(e?.message || "").toLowerCase().includes("aborted")) return;
      setErrRecs(e.message || "Failed to load recommendations.");
    } finally {
      setLoadingRecs(false);
    }
  }

  run();
  return () => controller.abort();
}, []);


  function handleSearch(e) {
    e.preventDefault();
    // For now we just go to /search (Phase 6 will make this real)
    navigate("/search");
  }

  return (
    <div className="stack">
      {/* Top blocks */}
      <section className="dashboardTop">
        <Card
          title="Search recipes"
          subtitle="Find meals by name, cuisine, or ingredient."
        >
          <form onSubmit={handleSearch} className="searchBarWrap">
            <div className="searchGrow">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Try: chicken, pasta, avocado..."
                autoComplete="off"
              />
            </div>
            <Button variant="primary" size="lg" type="submit">
              Search
            </Button>
          </form>

          <p className="muted" style={{ marginTop: "10px" }}>
            Phase 6 will connect this to real search results.
          </p>
        </Card>

        <Card
          title="Cook with what you have"
          subtitle="Tell us your ingredients — we’ll recommend what to make."
        >
          <div className="stack">
            <Link to="/ingredients">
              <Button variant="ghost" size="lg">Add Ingredients</Button>
            </Link>
            <p className="muted">
              Works great when you want ideas without shopping.
            </p>
          </div>
        </Card>
      </section>

      {/* Recommendations */}
      <section className="section">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Recommended for you</h2>
          <p className="sectionHint">Static picks for now (Phase 7 adds API personalization).</p>
        </div>

        {loadingRecs ? <Spinner label="Loading recommendations..." /> : null}
{errRecs ? <Alert message={errRecs} /> : null}

{!loadingRecs && !errRecs ? (
  <div className="grid">
    {recommended.map((r) => (
      <RecipeCard key={r.id} recipe={r} />
    ))}
  </div>
) : null}

      </section>
    </div>
  );
}
