import React, { useState } from "react";
import axios from "axios";

export const GenerateRecipe: React.FC = () => {
  const [ingredients, setIngredients] = useState<string>("");
  const [servings, setServings] = useState<number>(1);
  const [intolerances, setIntolerances] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setRecipe(null);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/generate`,
        {
          ingredients: ingredients.split(",").map((i) => i.trim()),
          servings,
          intolerances: intolerances
            .split(",")
            .map((i) => i.trim())
            .filter(Boolean),
        }
      );
      // console.log(response.data);
      setRecipe(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!recipe) return;
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/addRecipes`,
        {
          Name: recipe.name || recipe.Name,
          Description: recipe.description || recipe.Description,
          Type: recipe.type || recipe.Type,
          Servings: recipe.servings || recipe.Servings,
          Ingredients: Array.isArray(recipe.ingredients)
            ? recipe.ingredients.join(", ")
            : recipe.Ingredients,
          Instructions: Array.isArray(recipe.instructions)
            ? recipe.instructions.join("\n")
            : recipe.Instructions,
          Allergies: Array.isArray(recipe.intolerances)
            ? recipe.intolerances.join(", ")
            : recipe.intolerances,
          NutritionAnalysis: recipe.nutrition
            ? JSON.stringify(recipe.nutrition)
            : recipe.NutritionAnalysis,
          Image: recipe.image || recipe.Image || "",
        }
      );
      console.log(response);
      alert("Recette sauvegardée avec succès !");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Pour parser le champ nutrition
  let nutrition = null;
  if (recipe && recipe.nutrition) {
    try {
      nutrition = JSON.parse(recipe.nutrition);
    } catch {
      nutrition = recipe.nutrition;
    }
  }

  // Pour afficher les ingrédients sous forme de liste
  const ingredientsList = recipe?.ingredients
    ? typeof recipe.ingredients === "string"
      ? recipe.ingredients.split(",").map((i: string) => i.trim())
      : recipe.ingredients
    : [];

  // Pour afficher les instructions sous forme de liste
  const instructionsList = recipe?.instructions
    ? typeof recipe.instructions === "string"
      ? recipe.instructions.split("\n").map((i: string) => i.trim())
      : recipe.instructions
    : [];

  return (
    <div>
      <h2>Générer une recette personnalisée</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Ingrédients (séparés par des virgules) :</label>
          <input
            type="text"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Nombre de personnes :</label>
          <input
            type="number"
            min={1}
            value={servings}
            onChange={(e) => setServings(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label>Intolérances (séparées par des virgules) :</label>
          <input
            type="text"
            value={intolerances}
            onChange={(e) => setIntolerances(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Génération en cours..." : "Générer la recette"}
        </button>
      </form>

      {error && <div style={{ color: "red" }}>{error}</div>}

      {recipe && (
        <div>
          <div style={{ marginTop: 20 }}>
            <h3>{recipe.title}</h3>
            <p>{recipe.description}</p>
            <strong>Type :</strong> {recipe.type}
            <br />
            <strong>Pour {recipe.servings} personnes</strong>
            {recipe.image && (
              <div>
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  style={{ maxWidth: 300, margin: "1em 0" }}
                />
              </div>
            )}
            <h4>Ingrédients :</h4>
            <ul>
              {ingredientsList.map((ing: string, idx: number) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>
            <h4>Instructions :</h4>
            <ol>
              {instructionsList.map((step: string, idx: number) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
            <h4>Analyse nutritionnelle :</h4>
            {nutrition && typeof nutrition === "object" ? (
              <ul>
                <li>Calories : {nutrition.calories}</li>
                <li>Protéines : {nutrition.proteines} g</li>
                <li>Glucides : {nutrition.glucides} g</li>
                <li>Lipides : {nutrition.lipides} g</li>
              </ul>
            ) : (
              <pre>{nutrition}</pre>
            )}
          </div>
          <button onClick={handleSave} disabled={loading}>
            Sauvegarder la recette
          </button>
        </div>
      )}
    </div>
  );
};
