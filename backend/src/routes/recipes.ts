import express from "express";
import * as RecipesController from "../controllers/recipes.controller";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.get("/api/recipes", RecipesController.getAllRecipes);
router.post("/api/addRecipes", RecipesController.addRecipe);
router.post("/api/generate", RecipesController.generateRecipe);
router.get("/api/searchRecipes", RecipesController.searchRecipes);
router.get("/api/lowCaloriesRecipes", RecipesController.getLowCaloriesRecipes);
router.get("/api/highCaloriesRecipes", RecipesController.getHighCaloriesRecipes);
router.get("/api/recipe/:id", RecipesController.getRecipeById);

export default router;
