import { Request, Response } from "express";
// @ts-ignore
import AirtablePlus from "airtable-plus";
import dotenv from "dotenv";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

dotenv.config();
const tableName = "Recipes";
const base = new AirtablePlus({
  baseID: process.env.AIRTABLE_BASE_ID!,
  apiKey: process.env.AIRTABLE_TOKEN!,
  tableName: tableName,
});

export const getAllRecipes = async (req: Request, res: Response) => {
  try {
    const sortBy = req.query.sort as string;

    let records;
    if (sortBy === "newest") {
      records = await base.read({
        sort: [{ field: "CreatedAt", direction: "desc" }],
      });
    } else if (sortBy === "oldest") {
      records = await base.read({
        sort: [{ field: "CreatedAt", direction: "asc" }],
      });
    } else {
      records = await base.read();
    }

    const recipes = records.map((record: any) => {
      const fields = record.fields;

      // Générer une note fictive basée sur l'ID de la recette pour la cohérence
      const seed = record.id
        .split("")
        .reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
      const randomRating = (seed % 21) / 10 + 3.0; // Note entre 3.0 et 5.0

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
        CreatedAt: fields["CreatedAt"] || record.createdTime || "",
        Rating: parseFloat(randomRating.toFixed(1)), // Note fictive avec 1 décimale
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

const getRecipeImageFromUnsplash = async (recipeTitle: string) => {
  try {
    // Améliorer la requête de recherche pour de meilleurs résultats culinaires
    let searchQuery = recipeTitle;

    // Ajouter des mots-clés culinaires pour améliorer la pertinence
    if (
      recipeTitle.toLowerCase().includes("dessert") ||
      recipeTitle.toLowerCase().includes("cake") ||
      recipeTitle.toLowerCase().includes("sweet")
    ) {
      searchQuery = `${recipeTitle} dessert food`;
    } else if (
      recipeTitle.toLowerCase().includes("soup") ||
      recipeTitle.toLowerCase().includes("broth")
    ) {
      searchQuery = `${recipeTitle} soup food`;
    } else if (recipeTitle.toLowerCase().includes("salad")) {
      searchQuery = `${recipeTitle} salad food`;
    } else if (
      recipeTitle.toLowerCase().includes("pasta") ||
      recipeTitle.toLowerCase().includes("spaghetti")
    ) {
      searchQuery = `${recipeTitle} pasta food`;
    } else {
      // Par défaut, ajouter des termes culinaires génériques
      searchQuery = `${recipeTitle} food dish`;
    }

    // Nettoyer la requête
    searchQuery = searchQuery
      .toLowerCase()
      .replace(/[^\w\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    console.log(`Recherche Unsplash pour: "${searchQuery}"`);

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        searchQuery
      )}&per_page=3&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY!}`,
        },
      }
    );

    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const selectedPhoto = data.results[0];
      console.log(
        `Image Unsplash trouvée: ${
          selectedPhoto.alt_description || "Sans description"
        }`
      );
      return selectedPhoto.urls.regular || selectedPhoto.urls.full || "";
    }

    // Si pas de résultat, essayer une recherche plus générique
    const fallbackResponse = await fetch(
      `https://api.unsplash.com/search/photos?query=food%20dish&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY!}`,
        },
      }
    );

    const fallbackData = await fallbackResponse.json();
    return fallbackData.results?.[0]?.urls?.regular || "";
  } catch (error) {
    console.error("Erreur Unsplash:", error);
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

    const imageUrl = await getRecipeImageFromUnsplash(recipe.name);

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

export const searchRecipes = async (req: Request, res: Response) => {
  try {
    const keyword = ((req.query.keyword as string) || "").toLowerCase();

    const records = await base.read({
      sort: [{ field: "CreatedAt", direction: "asc" }],
    });

    const recipes = records.map((record: any, index: number) => {
      // Générer une note fictive basée sur l'ID de la recette pour la cohérence
      const seed = record.id
        .split("")
        .reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
      const randomRating = (seed % 21) / 10 + 3.0; // Note entre 3.0 et 5.0

      return {
        index: index + 1,
        id: record.id,
        Name: record.fields["Name"] || "",
        Description: record.fields["Description"] || "",
        Type: record.fields["Type"] || "",
        Servings: record.fields["Servings"] || "",
        Ingredients: record.fields["Ingredients"] || "",
        Instructions: record.fields["Instructions"] || "",
        Allergies: record.fields["Allergies"] || "",
        NutritionAnalysis: record.fields["NutritionAnalysis"] || "",
        Image: record.fields["Image"] || "",
        CreatedAt: record.fields["CreatedAt"] || "",
        Rating: parseFloat(randomRating.toFixed(1)), // Note fictive avec 1 décimale
      };
    });

    const filteredRecipes = recipes.filter((recipe: any) =>
      `${recipe.Name} ${recipe.Description} ${recipe.Ingredients} ${recipe.Instructions}`
        .toLowerCase()
        .includes(keyword)
    );

    res.json(filteredRecipes);
  } catch (error) {
    console.error("Error searching recipes:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getLowCaloriesRecipes = async (req: Request, res: Response) => {
  try {
    const sortBy = req.query.sort as string;

    let records;
    if (sortBy === "newest") {
      records = await base.read({
        sort: [{ field: "CreatedAt", direction: "desc" }],
      });
    } else if (sortBy === "oldest") {
      records = await base.read({
        sort: [{ field: "CreatedAt", direction: "asc" }],
      });
    } else {
      records = await base.read({
        sort: [{ field: "CreatedAt", direction: "asc" }],
      });
    }

    const highCalories = records
      .map((record: any, index: number) => {
        const rawNutrition = record.fields["NutritionAnalysis"];
        let calories = 0;

        try {
          const parsed =
            typeof rawNutrition === "string"
              ? JSON.parse(rawNutrition)
              : rawNutrition;
          calories = parseFloat(parsed?.calories) || 0;
        } catch (_) {}

        // Générer une note fictive basée sur l'ID de la recette pour la cohérence
        const seed = record.id
          .split("")
          .reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
        const randomRating = (seed % 21) / 10 + 3.0; // Note entre 3.0 et 5.0

        return {
          index: index + 1,
          id: record.id,
          Name: record.fields["Name"] || "",
          Description: record.fields["Description"] || "",
          Type: record.fields["Type"] || "",
          Servings: record.fields["Servings"] || 0,
          Ingredients: record.fields["Ingredients"] || "",
          Instructions: record.fields["Instructions"] || "",
          Allergies: record.fields["Allergies"] || "",
          NutritionAnalysis: record.fields["NutritionAnalysis"] || "",
          Image: record.fields["Image"] || "",
          CreatedAt: record.fields["CreatedAt"] || "",
          Calories: calories,
          Rating: parseFloat(randomRating.toFixed(1)), // Note fictive avec 1 décimale
        };
      })
      .filter((recipe: { Calories: number }) => recipe.Calories <= 700);

    res.json(highCalories);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getHighCaloriesRecipes = async (req: Request, res: Response) => {
  try {
    const sortBy = req.query.sort as string;

    let records;
    if (sortBy === "newest") {
      records = await base.read({
        sort: [{ field: "CreatedAt", direction: "desc" }],
      });
    } else if (sortBy === "oldest") {
      records = await base.read({
        sort: [{ field: "CreatedAt", direction: "asc" }],
      });
    } else {
      records = await base.read({
        sort: [{ field: "CreatedAt", direction: "asc" }],
      });
    }

    const highCalories = records
      .map((record: any, index: number) => {
        const rawNutrition = record.fields["NutritionAnalysis"];
        let calories = 0;

        try {
          const parsed =
            typeof rawNutrition === "string"
              ? JSON.parse(rawNutrition)
              : rawNutrition;
          calories = parseFloat(parsed?.calories) || 0;
        } catch (_) {
          calories = 0;
        }

        // Générer une note fictive basée sur l'ID de la recette pour la cohérence
        const seed = record.id
          .split("")
          .reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
        const randomRating = (seed % 21) / 10 + 3.0; // Note entre 3.0 et 5.0

        return {
          index: index + 1,
          id: record.id,
          Name: record.fields["Name"] || "",
          Description: record.fields["Description"] || "",
          Type: record.fields["Type"] || "",
          Servings: record.fields["Servings"] || 0,
          Ingredients: record.fields["Ingredients"] || "",
          Instructions: record.fields["Instructions"] || "",
          Allergies: record.fields["Allergies"] || "",
          NutritionAnalysis: record.fields["NutritionAnalysis"] || "",
          Image: record.fields["Image"] || "",
          CreatedAt: record.fields["CreatedAt"] || "",
          Calories: calories,
          Rating: parseFloat(randomRating.toFixed(1)), // Note fictive avec 1 décimale
        };
      })
      .filter((recipe: { Calories: number }) => recipe.Calories > 700);

    res.json(highCalories);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
};

export const getRecipeById = async (req: Request, res: Response) => {
  const recipeId = req.params.id;

  try {
    const record = await base.find(recipeId);

    if (!record) {
      res.status(404).json({ error: "Recette non trouvée" });
    }

    // Générer une note fictive basée sur l'ID de la recette pour la cohérence
    const seed = record.id
      .split("")
      .reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
    const randomRating = (seed % 21) / 10 + 3.0; // Note entre 3.0 et 5.0

    const recipe = {
      id: record.id,
      Name: record.fields["Name"],
      Description: record.fields["Description"],
      Type: record.fields["Type"],
      Servings: record.fields["Servings"],
      Ingredients: record.fields["Ingredients"],
      Instructions: record.fields["Instructions"],
      Allergies: record.fields["Allergies"],
      NutritionAnalysis: record.fields["NutritionAnalysis"],
      Image: record.fields["Image"],
      Rating: parseFloat(randomRating.toFixed(1)), // Note fictive avec 1 décimale
    };

    res.json(recipe);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération de la recette" });
  }
};
