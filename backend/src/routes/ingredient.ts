import express from 'express';
import * as IngredientController from '../controllers/ingredients.controller';

const router = express.Router();

router.get('/api/ingredients', IngredientController.getAllIngredients);

export default router;
