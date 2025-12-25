import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Ingredients from "./pages/Ingredients";
import Search from "./pages/Search";
import Results from "./pages/Results";
import RecipeDetails from "./pages/RecipeDetails";
import CookingMode from "./pages/CookingMode";

import Favorites from "./pages/Favorites";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Shared layout (Navbar + Footer) */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="/search" element={<Search />} />
          <Route path="/results" element={<Results />} />
          <Route path="/recipes/:id" element={<RecipeDetails />} />
<Route path="/recipes/:id/cook" element={<CookingMode />} />

          <Route path="/favorites" element={<Favorites />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
