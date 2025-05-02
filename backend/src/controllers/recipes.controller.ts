import { Request, Response } from 'express';
import Airtable from 'airtable';
import dotenv from 'dotenv';

dotenv.config();

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID!);
const tableName = "Recipes";
export const getAllRecipes = async (req: Request, res: Response) => {
    try {
        const Ingredients= await base("Ingredient").select().all();
        const IngredientMap= Ingredients.reduce((acc:Record<string,string>, ingredient) => {
            acc[ingredient.id] = ingredient.fields["Name"] as string;
            return acc; 
        }, {});
    
        const recipesRecords = await base(tableName).select().all();
    
        const recipes = recipesRecords.map((record)=> {
            const fields = record.fields;
            return {
                id: record.id,
                Name: fields["Name"] || "",
                Description: fields["Description"] || "",
                Type: fields["Type"] || "",
                Servings: fields["Servings"] || "",
                Ingredients: (fields["Ingredients"] as string[] || []).map(id => IngredientMap[id] || id),
                Instructions: fields["Instructions"] || "",
                Allergies: fields["Allergies"] || "",
                NutrutionAnalysis: fields["NutritionAnalysis"] || "",
                Image: fields["Image"] || "",
                
            };
        })
    
    
        res.json(recipes);
      } catch (error) {
        console.error("Error fetching data from Airtable:", error);
        res.status(500).json({ error: "Failed to fetch recipes from Airtable" });
      }
}