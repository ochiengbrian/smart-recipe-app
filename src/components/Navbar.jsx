import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="nav">
      <div className="nav__inner">
        <NavLink to="/" className="nav__brand">
          SmartRecipe
        </NavLink>

        <nav className="nav__links">
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
