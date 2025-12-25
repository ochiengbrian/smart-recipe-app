import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";

export default function Home() {
  return (
    <div className="stack">
      <Card
        title="Smart Recipe App"
        subtitle="Search recipes or tell us what’s in your kitchen — we’ll recommend what you can cook."
      >
        <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
          <div className="row" style={{ flexWrap: "wrap" }}>
            <Badge tone="neutral">Premium UI</Badge>
            <Badge tone="success">Beginner-friendly build</Badge>
            <Badge tone="warning">Phase 3: UI kit</Badge>
          </div>

          <div className="row" style={{ flexWrap: "wrap" }}>
            <Button variant="primary" size="lg">Find Recipes</Button>
            <Button variant="ghost" size="lg">Cook With What I Have</Button>
          </div>
        </div>
      </Card>

      <Card title="What’s next?" subtitle="Phase 4 will build the Home & Dashboard screens properly.">
        <p className="muted">
          Tip: Keep your browser open. Any file save will automatically refresh the page.
        </p>
      </Card>
    </div>
  );
}
