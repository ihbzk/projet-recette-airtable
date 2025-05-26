import { Request, Response } from 'express';
// @ts-ignore
import AirtablePlus from 'airtable-plus';
import dotenv from 'dotenv';

dotenv.config();
const tableName = 'Recipes'; // Nom de la table dans Airtable
const base = new AirtablePlus({
  baseID: process.env.AIRTABLE_BASE_ID!,
  apiKey: process.env.AIRTABLE_TOKEN!,
  tableName: tableName,
});

export const getAllRecipes = async (req: Request, res: Response) => {
  try {
    const records = await base.read();

    const recipes = records.map((record: any) => {
      const fields = record.fields;
      return {
        id: record.id,
        Name: fields["Name"] || "",
        Description: fields["Description"] || "",
        Type: fields["Type"] || "",
        Servings: fields["Servings"] || "",
        Ingredients: fields["Ingredients"] || "",
        Instructions: fields["Instructions"] || "",
        Allergies: fields["Allergies"] || "",
        NutritionAnalysis: fields["NutritionAnalysis"] || "",
        Image: fields["Image"] || "",
      };
    });

    res.json(recipes);
  } catch (error) {
    console.error('Airtable API error:', error);
    res.status(500).json({ error: 'Failed to fetch recipes from Airtable' });
  }
};

export const addRecipe = async (req: Request, res: Response) => {
  try {
    const {
      Name,
      Description,
      Type,
      Servings,
      Ingredients,
      Instructions,
      Allergies,
      NutritionAnalysis,
      Image,
    } = req.body;

    // Vérification des champs obligatoires
    if (!Name || !Description || !Ingredients || !Instructions) {
      res.status(400).json({
        error: 'Name, Description, Ingredients and Instructions are required',
      });
      return;
    }

    // Création dans Airtable
    const createdRecord = await base.create({
      Name,
      Description,
      Type: Type || '',
      Servings: Servings || '',
      Ingredients,
      Instructions,
      Allergies: Allergies || '',
      NutritionAnalysis: NutritionAnalysis || '',
      Image: Image || '',
    });

    res.status(201).json({
      id: createdRecord.id,
      fields: createdRecord.fields,
    });
  } catch (error) {
    console.error('Error adding recipe:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
  