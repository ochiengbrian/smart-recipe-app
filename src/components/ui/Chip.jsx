import "./ui.css";

export default function Chip({ label, onRemove }) {
  return (
    <span className="chip">
      {label}
      {onRemove ? (
        <button className="chip__x" onClick={onRemove} aria-label={`Remove ${label}`}>
          ×
        </button>
      ) : null}
    </span>
  );
}
