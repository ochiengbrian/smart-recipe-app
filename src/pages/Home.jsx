import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import RecipeCard from "../components/RecipeCard";
import { useEffect, useState } from "react";
import Spinner from "../components/ui/Spinner";
import Alert from "../components/ui/Alert";
import { getDailyFeatured } from "../services/recipeService";



export default function Home() {
  const [featured, setFeatured] = useState([]);
const [loadingFeatured, setLoadingFeatured] = useState(false);
const [errFeatured, setErrFeatured] = useState("");

useEffect(() => {
  const controller = new AbortController();

  async function run() {
    setErrFeatured("");
    setLoadingFeatured(true);

    try {
      const results = await getDailyFeatured(controller.signal);
setFeatured(results);

    } catch (e) {
      if (e?.name === "AbortError") return;
      if (String(e?.message || "").toLowerCase().includes("aborted")) return;
      setErrFeatured(e.message || "Failed to load featured recipes.");
    } finally {
      setLoadingFeatured(false);
    }
  }

  run();
  return () => controller.abort();
}, []);


  return (
    <div className="stack">
      {/* HERO */}
      <section className="hero">
        <div className="heroLeft">
          <h1 className="heroTitle">Turn what you have into something you’ll love.</h1>
          <p className="heroSub">
            Search recipes or list ingredients in your kitchen, Smart Recipe recommends the best dish you can cook right now.
          </p>

          <div className="heroActions">
            <Link to="/search">
              <Button variant="primary" size="lg">Find Recipes</Button>
            </Link>
            <Link to="/ingredients">
              <Button variant="ghost" size="lg">Cook With What I Have</Button>
            </Link>
          </div>

          <div style={{ marginTop: "16px" }} className="muted">
            Tip: Try <span className="kbd">/recipes/101</span> to see the detail route working.
          </div>
        </div>

        <div className="heroRight" aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1400&q=80"
            alt=""
          />
        </div>
      </section>

      {/* HOW IT WORKS */}
<section className="section">
  <div className="sectionHeader">
    <h2 className="sectionTitle">How it works</h2>
    <p className="sectionHint">Fast, simple, and beginner-friendly.</p>
  </div>

  <div className="steps">
    <div className="card stepCard">
      <div className="card__body">
        <div className="stepIcon">1</div>
        <h3 style={{ margin: 0 }}>Add ingredients</h3>
        <p className="muted" style={{ marginTop: "8px" }}>
          Tell us what’s in your kitchen — even a few items helps.
        </p>
      </div>
    </div>

    <div className="card stepCard">
      <div className="card__body">
        <div className="stepIcon">2</div>
        <h3 style={{ margin: 0 }}>Get smart matches</h3>
        <p className="muted" style={{ marginTop: "8px" }}>
          We recommend recipes that fit your ingredients and preferences.
        </p>
      </div>
    </div>

    <div className="card stepCard">
      <div className="card__body">
        <div className="stepIcon">3</div>
        <h3 style={{ margin: 0 }}>Cook confidently</h3>
        <p className="muted" style={{ marginTop: "8px" }}>
          Clear steps, helpful tips, and a cooking mode for focus.
        </p>
      </div>
    </div>
  </div>
</section>


      {/* FEATURED */}
      <section className="section">
        <div className="sectionHeader">
          <h2 className="sectionTitle">Featured recipes</h2>
          <p className="sectionHint">A few picks to get you started.</p>
        </div>

        {loadingFeatured ? <Spinner label="Loading featured recipes..." /> : null}
{errFeatured ? <Alert message={errFeatured} /> : null}

{!loadingFeatured && !errFeatured ? (
  <div className="grid">
    {featured.map((r) => (
      <RecipeCard key={r.id} recipe={r} />
    ))}
  </div>
) : null}

      </section>
    </div>
  );
}
