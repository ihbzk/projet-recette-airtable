import { Request, Response } from 'express';
import Airtable from 'airtable';
import dotenv from 'dotenv';

dotenv.config();

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID!);

export const getAllIngredients = async (req: Request, res: Response) => {
  try {
    const recipesRecords = await base('Recipes').select().all();
    const recipeMap = recipesRecords.reduce((acc: Record<string, string>, recipe) => {
      acc[recipe.id] = recipe.fields['Name'] as string;
      return acc;
    }, {});

    const ingredientRecords = await base('Ingredient').select().all();

    const ingredients = ingredientRecords.map((record) => {
      const fields = record.fields;
      return {
        id: record.id,
        Name: fields['Name'],
        Description: fields['Description'],
        Recettes: (fields['Recettes'] as string[] || []).map(id => recipeMap[id] || id),
      };
    });

    res.json(ingredients);
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addIngredient = async (req: Request, res: Response) => {
   try {
     const { Name, Description, Recettes } = req.body;

    if(!Name) {
      res.status(400).json({ error: 'Name and Description are required' });
      return;
    }

     const createdRecord = await base('Ingredient').create({
       Name,
       Description,
       Recettes, 
     });

     res.status(201).json({
       id: createdRecord.id,
       fields: createdRecord.fields,
     });
   } catch (error) {
     console.error('Error adding ingredient:', error);
     res.status(500).json({ error: 'Internal server error' });
  }
};
