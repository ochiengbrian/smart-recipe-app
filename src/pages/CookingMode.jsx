import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Spinner from "../components/ui/Spinner";
import Alert from "../components/ui/Alert";
import { extractSteps, getRecipeDetails } from "../services/recipeService";

export default function CookingMode() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function run() {
      setErr("");
      setLoading(true);
      try {
        const d = await getRecipeDetails(id, controller.signal);
        setData(d);
        setIndex(0);
      } catch (e) {
        if (e?.name === "AbortError") return;
        if (String(e?.message || "").toLowerCase().includes("aborted")) return;
        setErr(e.message || "Failed to load cooking mode.");
      } finally {
        setLoading(false);
      }
    }

    run();
    return () => controller.abort();
  }, [id]);

  const steps = useMemo(() => (data ? extractSteps(data) : []), [data]);
  const total = steps.length;
  const current = steps[index] || "";

  function prev() {
    setIndex((i) => Math.max(0, i - 1));
  }

  function next() {
    setIndex((i) => Math.min(total - 1, i + 1));
  }

  // Keyboard controls: Left/Right arrows
  useEffect(() => {
    function onKey(e) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  return (
    <div className="cookShell">
      <div className="cookTopbar">
        <div className="cookTitle">
          {data?.title ? data.title : "Cooking Mode"}
        </div>

        <Link to={`/recipes/${id}`} className="cookBtn" style={{ textDecoration: "none" }}>
          Exit
        </Link>
      </div>

      <div className="cookMain">
        {loading ? <Spinner label="Loading steps..." /> : null}
        {err ? <Alert message={err} /> : null}

        {!loading && !err && data ? (
          total > 0 ? (
            <>
              <div className="cookStepNum">
                Step {index + 1} of {total}
              </div>

              <div className="cookStepText">{current}</div>

              <div className="cookControls">
                <button className="cookBtn" onClick={prev} disabled={index === 0}>
                  ← Previous
                </button>

                <button className="cookBtn" onClick={next} disabled={index >= total - 1}>
                  Next →
                </button>
              </div>

              <div style={{ marginTop: "10px", color: "rgba(249, 250, 251, 0.65)", fontSize: "14px" }}>
                Tip: Use your keyboard arrows <span className="kbd">←</span> / <span className="kbd">→</span>
              </div>
            </>
          ) : (
            <div className="emptyState">
              <h3 style={{ margin: 0 }}>No steps available</h3>
              <p className="muted" style={{ marginTop: "10px" }}>
                This recipe doesn’t include structured instructions.
              </p>
            </div>
          )
        ) : null}
      </div>
    </div>
  );
}
