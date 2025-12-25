import "./ui.css";

export default function Button({
  children,
  variant = "primary", // primary | ghost | danger
  size = "md", // sm | md | lg
  type = "button",
  onClick,
  disabled = false,
}) {
  const classes = [
    "btn",
    variant === "primary" && "btn--primary",
    variant === "ghost" && "btn--ghost",
    variant === "danger" && "btn--danger",
    size === "sm" && "btn--sm",
    size === "lg" && "btn--lg",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
