import { Request, Response } from "express";
// @ts-ignore
import AirtablePlus from "airtable-plus";
import dotenv from "dotenv";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

dotenv.config();
const tableName = "Recipes"; // Nom de la table dans Airtable
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
    console.error("Airtable API error:", error);
    res.status(500).json({ error: "Failed to fetch recipes from Airtable" });
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
        error: "Name, Description, Ingredients and Instructions are required",
      });
      return;
    }

    // Création dans Airtable
    const createdRecord = await base.create({
      Name,
      Description,
      Type: Type || "",
      Servings: Servings || "",
      Ingredients,
      Instructions,
      Allergies: Allergies || "",
      NutritionAnalysis: NutritionAnalysis || "",
      Image: Image || "",
    });

    res.status(201).json({
      id: createdRecord.id,
      fields: createdRecord.fields,
    });
  } catch (error) {
    console.error("Error adding recipe:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getRecipeImageFromPexels = async (recipeTitle: string) => {
  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        recipeTitle
      )}&per_page=1`,
      {
        headers: {
          Authorization: process.env.PEXELS_API_KEY!,
        },
      }
    );

    const data = await response.json();
    return data.photos[0]?.src?.large || "";
  } catch (error) {
    console.error("Erreur Pexels:", error);
    return "";
  }
};

export const generateRecipe = async (req: Request, res: Response) => {
  try {
    const { ingredients, servings, intolerances } = req.body;

    // Vérification des champs obligatoires
    if (!ingredients || !servings || !intolerances) {
      res.status(400).json({
        error: "Champs requis manquants",
      });
      return;
    }

    const prompt = `
      Génère une recette de cuisine pour ${servings} personnes avec les ingrédients suivants : ${ingredients}.
      Respecte les intolérances suivantes : ${intolerances}.
      Tu es une API. Réponds uniquement avec un objet JSON **valide**, sans commentaire, sans retour à la ligne inutile, sans code markdown.

      Réponds uniquement au format JSON suivant, sans explication, sans texte autour :
      {
        "name": "Nom de la recette",
        "description": "Courte description du plat",
        "type": "Type de plat (ex: plat principal, dessert, entrée, etc.)",
        "servings": nombre de personnes,
        "ingredients": ["ingrédient 1", "ingrédient 2", ...],
        "instructions": ["étape 1", "étape 2", ...],
        "intolerances": ["intolérance 1", ...],
        "nutrition": {
          "calories": nombre,
          "proteines": nombre,
          "glucides": nombre,
          "lipides": nombre
        }
      }
      Réponds uniquement avec ce JSON, sans texte supplémentaire.
      `;

    // Appel à l'API OpenAI
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const aiResponse = chatCompletion.choices[0].message.content;
    // On essaye de parser le JSON retourné par l'IA
    let recipe;
    try {
      recipe = JSON.parse(aiResponse || "");
    } catch (e) {
      // Si l'IA ne répond pas en JSON, on renvoie le texte brut
      recipe = { raw: aiResponse };
    }

    const imageUrl = await getRecipeImageFromPexels(recipe.name);

    recipe.image = imageUrl;

    //Création dans Airtable
    // const createdRecord = await base.create({
    //   Name: recipe.title || "Recette générée",
    //   Description: recipe.description || "", // si tu as une description
    //   Type: recipe.type || "", // si tu as un type
    //   Servings: recipe.servings || "",
    //   Ingredients: Array.isArray(recipe.ingredients)
    //     ? recipe.ingredients.join(", ")
    //     : recipe.ingredients,
    //   Instructions: Array.isArray(recipe.steps)
    //     ? recipe.steps.join("\n")
    //     : recipe.steps,
    //   Allergies: Array.isArray(recipe.intolerances)
    //     ? recipe.intolerances.join(", ")
    //     : recipe.intolerances,
    //   NutritionAnalysis: recipe.nutrition
    //     ? JSON.stringify(recipe.nutrition)
    //     : "",
    //   Image: imageUrl || "", // si tu ajoutes une image plus tard
    // });

    // Tu peux renvoyer le record créé ou la recette générée
    // res.status(201).json({
    //   id: createdRecord.id,
    //   fields: createdRecord.fields,
    // });
    res.status(201).json(recipe);
  } catch (error) {
    console.error("Error adding recipe:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
