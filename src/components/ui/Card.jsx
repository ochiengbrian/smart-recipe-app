import "./ui.css";

export default function Card({ title, subtitle, children }) {
  return (
    <section className="card">
      <div className="card__body">
        {title ? <h2 className="card__title">{title}</h2> : null}
        {subtitle ? <p className="card__subtitle">{subtitle}</p> : null}
        {children ? <div style={{ marginTop: "16px" }}>{children}</div> : null}
      </div>
    </section>
  );
}
