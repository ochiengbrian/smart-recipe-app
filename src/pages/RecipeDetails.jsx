import { useParams } from "react-router-dom";

export default function RecipeDetails() {
  const { id } = useParams();

  return (
    <div className="page">
      <h1>Recipe Details</h1>
      <p>Recipe ID: <strong>{id}</strong></p>
      <p>Full recipe info will appear here later.</p>
    </div>
  );
}
