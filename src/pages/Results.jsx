import { useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Chip from "../components/ui/Chip";

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

  return (
    <div className="stack">
      <Card
        title="Results"
        subtitle="Phase 5: Showing selected ingredients. Phase 6+ will show real recipe results."
      >
        {ingredients.length === 0 ? (
          <p className="muted">
            No ingredients received. Go add some ingredients first.
          </p>
        ) : (
          <>
            <p className="muted">You selected:</p>
            <div className="chipWrap" style={{ marginTop: "12px" }}>
              {ingredients.map((i) => (
                <Chip key={i} label={i} />
              ))}
            </div>
          </>
        )}

        <div style={{ marginTop: "16px" }} className="row">
          <Link to="/ingredients">
            <Button variant="ghost">Edit Ingredients</Button>
          </Link>
          <Link to="/search">
            <Button variant="primary">Go to Search</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
