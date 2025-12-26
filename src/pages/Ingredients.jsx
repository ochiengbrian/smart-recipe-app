import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Chip from "../components/ui/Chip";
import Card from "../components/ui/Card";
import { ingredientSuggestions } from "../data/ingredientSuggestions";

function normalize(str) {
  return str.trim().toLowerCase();
}

function titleCase(str) {
  const s = str.trim();
  if (!s) return "";
  return s
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export default function Ingredients() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [ingredients, setIngredients] = useState([]);

  const normalizedSet = useMemo(() => {
    return new Set(ingredients.map((i) => normalize(i)));
  }, [ingredients]);

  const filteredAutocomplete = useMemo(() => {
    const q = normalize(input);
    if (!q) return [];
    return ingredientSuggestions
      .filter((s) => normalize(s).includes(q))
      .filter((s) => !normalizedSet.has(normalize(s)))
      .slice(0, 6);
  }, [input, normalizedSet]);

  function addIngredient(raw) {
    const cleaned = titleCase(raw);
    if (!cleaned) return;

    if (normalizedSet.has(normalize(cleaned))) return;

    setIngredients((prev) => [...prev, cleaned]);
    setInput("");
  }

  function removeIngredient(label) {
    setIngredients((prev) => prev.filter((x) => normalize(x) !== normalize(label)));
  }

  function handleSubmit(e) {
    e.preventDefault();
    addIngredient(input);
  }

  function goToResults() {
    // Pass ingredients through query string for now
    // Example: /results?ing=Chicken,Garlic,Rice
    const qs = encodeURIComponent(ingredients.join(","));
    navigate(`/results?ing=${qs}`);
  }

  const quickPicks = useMemo(() => {
    // Suggested list should hide items already added
    return ingredientSuggestions
      .filter((s) => !normalizedSet.has(normalize(s)))
      .slice(0, 12);
  }, [normalizedSet]);

  return (
    <div className="stack">
      <div className="ingHeader">
        <div>
          <h1 className="ingTitle">Cook with what you have</h1>
          <p className="ingSub">
            Add ingredients from your kitchen. We’ll recommend recipes you can make right now.
          </p>
        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={goToResults}
          disabled={ingredients.length === 0}
        >
          Find Recipes
        </Button>
      </div>

      <section className="ingPanel">
        {/* Left: Input + chips */}
        <div className="ingBox">
          <Card
            title="Add ingredients"
            subtitle="Type an ingredient and press Enter. Or pick from suggestions."
          >
            <form onSubmit={handleSubmit} className="ingRow">
              <div className="autoWrap">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g., chicken, garlic, rice..."
                  autoComplete="off"
                />

                {/* Autocomplete dropdown */}
                {filteredAutocomplete.length > 0 ? (
                  <div className="autoList" role="listbox" aria-label="Suggestions">
                    {filteredAutocomplete.map((s) => (
                      <div
  key={s}
  className="autoItem"
  role="option"
  aria-selected={false}
  onMouseDown={(e) => {
    e.preventDefault();
    addIngredient(s);
  }}
>

                        <span>{s}</span>
                        <span className="autoMeta">Click to add</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <Button variant="ghost" size="lg" type="submit">
                Add
              </Button>
            </form>

            <p className="ingHint">
              Tip: You can add as little as 2–3 ingredients and still get ideas.
            </p>

            <div className="chipWrap" aria-label="Selected ingredients">
              {ingredients.length === 0 ? (
                <span className="muted">No ingredients added yet.</span>
              ) : (
                ingredients.map((ing) => (
                  <Chip
                    key={ing}
                    label={ing}
                    onRemove={() => removeIngredient(ing)}
                  />
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Right: Suggestions */}
        <div className="ingBox">
          <Card title="Quick picks" subtitle="Tap to add commonly used ingredients.">
            <div className="suggestGrid">
              {quickPicks.map((s) => (
                <button
                  key={s}
                  className="suggestBtn"
                  onClick={() => addIngredient(s)}
                  type="button"
                >
                  {s}
                </button>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
