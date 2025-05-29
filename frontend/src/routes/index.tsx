import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GenerateRecipe } from "../pages/GenerateRecipe";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/recipes/generate" element={<GenerateRecipe />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
