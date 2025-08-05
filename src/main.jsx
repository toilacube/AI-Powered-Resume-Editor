// src/main.jsx

import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./styles/App.css"; // Make sure this path is correct
import "./index.css"; // And this one too

// 1. Get the root element from the DOM.
const rootElement = document.getElementById("root");

// 2. Create a root.
const root = createRoot(rootElement);

// 3. Render the app.
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
