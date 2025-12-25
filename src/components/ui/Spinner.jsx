import "./ui.css";

export default function Spinner({ label = "Loading..." }) {
  return (
    <div className="spinnerWrap" role="status" aria-live="polite">
      <div className="spinner" />
      <span className="spinnerText">{label}</span>
    </div>
  );
}
