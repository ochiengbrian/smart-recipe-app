import React from 'react';
import ReactDOM from 'react-dom/client';
import "./styles/global.css";
import "./styles/app.css";
import "./styles/pages.css";
import "./styles/ingredients.css";
import "./styles/search.css";
import "./styles/recipeDetails.css";
import "./styles/settings.css";

import { FavoritesProvider } from "./context/FavoritesContext";
import { PreferencesProvider } from "./context/PreferencesContext";


import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <PreferencesProvider>
      <FavoritesProvider>
        <App />
      </FavoritesProvider>
    </PreferencesProvider>
  </React.StrictMode>
);



