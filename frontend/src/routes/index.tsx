import { Routes, Route } from "react-router-dom";
import { GenerateRecipePage } from "../pages/GenerateRecipePage";
import RecipesPage from "../pages/RecipesPage";
import HomePage from "../pages/HomePage";
import RecipeDetail from "../pages/RecipeDetail";
import ContactPage from "../pages/ContactPage";
import AboutPage from "../pages/AboutPage";
import PrivacyPolicyPage from "../pages/PrivacyPolicyPage";
import SearchRecipesPage from "../pages/SearchRecipesPage";
import LowCaloriesPage from "../pages/LowCaloriesPage";
import HighCaloriesPage from "../pages/HighCaloriesPage";
import ContactSuccessPage from "../pages/ContactSuccessPage";

const AppRoutes = () => {
  return (
    <div className="pt-16">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/contact/success" element={<ContactSuccessPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/recipes" element={<RecipesPage />} />
        <Route path="/recipes/search" element={<SearchRecipesPage />} />
        <Route path="/recipes/low-calories" element={<LowCaloriesPage />} />
        <Route path="/recipes/high-calories" element={<HighCaloriesPage />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/recipes/generate" element={<GenerateRecipePage />} />
      </Routes>
    </div>
  );
};

export default AppRoutes;
