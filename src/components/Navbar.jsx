import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="nav">
      <div className="nav__inner">
        <NavLink to="/" className="nav__brand">
          SmartRecipe
        </NavLink>

        <nav className="nav__links">
          <NavLink to="" className="nav__link">
    Home
  </NavLink>
  <NavLink to="/dashboard" className="nav__link">
    Dashboard
  </NavLink>
  <NavLink to="/search" className="nav__link">
    Search
  </NavLink>
  <NavLink to="/ingredients" className="nav__link">
    Ingredients
  </NavLink>
  <NavLink to="/favorites" className="nav__link">
    Favorites
  </NavLink>
  <NavLink to="/settings" className="nav__link">
    Settings
  </NavLink>
</nav>

      </div>
    </header>
  );
}
