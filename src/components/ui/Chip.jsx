import "./ui.css";

export default function Chip({ label, onRemove, onClick }) {
  const clickable = Boolean(onClick);

  return (
    <span
      className="chip"
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (!clickable) return;
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      style={clickable ? { cursor: "pointer" } : undefined}
    >
      {label}
      {onRemove ? (
        <button className="chip__x" onClick={onRemove} aria-label={`Remove ${label}`}>
          ×
        </button>
      ) : null}
    </span>
  );
}
