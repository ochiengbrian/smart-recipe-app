import "./ui.css";

export default function Input({
  value,
  onChange,
  placeholder = "",
  type = "text",
  name,
  id,
  autoComplete,
}) {
  return (
    <input
      className="input"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      name={name}
      id={id}
      autoComplete={autoComplete}
    />
  );
}
