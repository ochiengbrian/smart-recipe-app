import "./ui.css";

export default function Alert({ title = "Something went wrong", message }) {
  return (
    <div className="alert" role="alert">
      <div className="alertTitle">{title}</div>
      {message ? <div className="alertMsg">{message}</div> : null}
    </div>
  );
}
