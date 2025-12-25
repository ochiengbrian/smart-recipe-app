import "./ui.css";

export default function Badge({ children, tone = "neutral" }) {
  const classes = ["badge"];
  if (tone === "success") classes.push("badge--success");
  if (tone === "warning") classes.push("badge--warning");
  if (tone === "neutral") classes.push("badge--neutral");

  return <span className={classes.join(" ")}>{children}</span>;
}
