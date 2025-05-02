import express from 'express';
import * as RecipesController from '../controllers/recipes.controller';
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.get('/api/recipes', RecipesController.getAllRecipes);
router.post('/api/addRecipes', RecipesController.addRecipe);

export default router;
