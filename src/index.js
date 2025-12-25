import React from 'react';
import ReactDOM from 'react-dom/client';
import "./styles/global.css";
import "./styles/app.css";
import "./styles/pages.css";
import "./styles/ingredients.css";
import "./styles/search.css";
import "./styles/recipeDetails.css";

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

