'use client'

import React, { useState } from "react";
import axios from "axios";
import { Tab } from "@headlessui/react";
import { UsersIcon } from "@heroicons/react/20/solid";

export const GenerateRecipePage: React.FC = () => {
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
      await axios.post(`${process.env.REACT_APP_API_URL}/api/addRecipes`, {
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
      });
      alert("Recette sauvegardée avec succès !");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const ingredientsList: string[] = recipe?.ingredients
    ? typeof recipe.ingredients === "string"
      ? recipe.ingredients.split(",").map((i: string) => i.trim())
      : recipe.ingredients
    : [];

  const instructionsList: string[] = recipe?.instructions
    ? typeof recipe.instructions === "string"
      ? recipe.instructions.split("\n").map((i: string) => i.trim())
      : recipe.instructions
    : [];

  let nutrition: any = null;
  if (recipe && recipe.nutrition) {
    try {
      nutrition = JSON.parse(recipe.nutrition);
    } catch {
      nutrition = recipe.nutrition;
    }
  }

  return (
    <div className="bg-white">
      <nav aria-label="breadcrumb" className="mx-auto max-w-7xl px-4 pt-8 text-sm text-gray-600 sm:px-6 lg:px-8">
        <ol className="flex space-x-2">
          <li>
            <a href="/" className="hover:underline text-gray-700">
              Accueil
            </a>
          </li>
          <span className="mx-2">/</span>
          <li>
            <a href="/recipes" className="hover:underline text-gray-700">
              Recettes
            </a>
          </li>
          <span className="mx-2">/</span>
          <li className="text-gray-500">Générer une recette</li>
        </ol>
      </nav>
      <div className="mx-auto mt-4 max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Générer une recette personnalisée
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Indiquez vos ingrédients, le nombre de personnes et vos intolérances pour
          obtenir une recette créée par notre IA.
        </p>
      </div>
      <section className="mx-auto mt-8 flex flex-col gap-8 px-4 sm:px-6 lg:flex-row-reverse lg:max-w-5xl lg:px-8 py-8 justify-center">
        <div className="lg:w-1/2">
          <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
            <div>
              <label htmlFor="ingredients" className="block text-sm font-medium text-gray-900 text-left">
                Ingrédients (séparés par des virgules)
              </label>
              <div className="mt-2">
                <input id="ingredients" name="ingredients" type="text" value={ingredients} onChange={(e) => setIngredients(e.target.value)} required className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 border outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#7C3AED] sm:text-sm" placeholder="Ex. pommes de terre, oignon, ail" />
              </div>
            </div>
            <div>
              <label htmlFor="servings" className="block text-sm font-medium text-gray-900 text-left">
                Nombre de personnes
              </label>
              <div className="mt-2">
                <input id="servings" name="servings" type="number" min={1} value={servings} onChange={(e) => setServings(Number(e.target.value))} required className="block w-24 rounded-md bg-white px-3.5 py-2 text-base text-gray-900 border outline-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-[#7C3AED] sm:text-sm" />
              </div>
            </div>
            <div>
              <label htmlFor="intolerances" className="block text-sm font-medium text-gray-900 text-left">
                Intolérances (séparées par des virgules)
              </label>
              <div className="mt-2">
                <input id="intolerances" name="intolerances" type="text" value={intolerances} onChange={(e) => setIntolerances(e.target.value)} className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 border outline-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#7C3AED] sm:text-sm" placeholder="Ex. gluten, lactose" />
              </div>
            </div>
            <div className="pt-4">
              <button type="submit" disabled={loading} className="w-full rounded-md bg-[#7C3AED] px-4 py-2 text-center text-sm font-semibold text-white shadow hover:bg-purple-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]">
                {loading ? "Génération en cours…" : "Générer la recette"}
              </button>
            </div>
            {error && (
              <div className="mt-4 text-center text-red-600">
                Erreur : {error}
              </div>
            )}
          </form>
        </div>
        {recipe && (
          <div className="lg:w-1/2">
            <div className="bg-gray-50 p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">{recipe.title || recipe.Name}</h2>
                {(recipe.type || recipe.Type) && (
                  <span className="inline-flex items-center rounded-md bg-purple-100 px-2 py-1 text-xs font-medium text-[#7C3AED] uppercase">
                    {recipe.type || recipe.Type} <UsersIcon className="ml-1 h-4 w-4" />&nbsp;{recipe.servings || recipe.Servings} 
                  </span>
                )}
              </div>
              {recipe.image && (
                <div className="mt-6 flex justify-center">
                  <img src={recipe.image} alt={recipe.title || recipe.Name} className="rounded-lg object-cover shadow-lg w-full max-w-md" />
                </div>
              )}
              {recipe.description && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 text-left">Description</h3>
                  <p className="mt-2 text-gray-700 text-left">{recipe.description || recipe.Description}</p>
                </div>
              )}
              {nutrition && (
                <div className="mt-8">
                  <h4 className="text-lg font-medium text-gray-900 text-left">
                    Analyse nutritionnelle
                  </h4>
                  {typeof nutrition === "object" ? (
                    <ul className="mt-2 list-disc list-inside text-gray-700 text-left">
                      {Object.entries(nutrition).map(([key, value]) => (
                        <li key={key}>
                          <span className="capitalize">{key} :</span> {String(value)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <pre className="mt-2 text-gray-700">{nutrition}</pre>
                  )}
                </div>
              )}
              <div className="mt-6">
                <Tab.Group>
                  <Tab.List className="flex space-x-1 border-b">
                    {["Ingrédients", "Instructions"].map((tabName) => (
                      <Tab key={tabName} className={({ selected }) => selected ? "px-3 py-1 text-sm font-medium border-b-2 border-[#7C3AED] text-[#7C3AED]" : "px-3 py-1 text-sm font-medium text-gray-500 hover:text-gray-700"}>
                        {tabName}
                      </Tab>
                    ))}
                  </Tab.List>
                  <Tab.Panels className="mt-4">
                    <Tab.Panel>
                      {ingredientsList.length > 0 ? (
                        <ul className="list-disc list-inside text-gray-700 text-left">
                          {ingredientsList.map((ing: string, idx: number) => (
                            <li key={idx}>{ing}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">Aucun ingrédient fourni.</p>
                      )}
                    </Tab.Panel>
                    <Tab.Panel>
                      {instructionsList.length > 0 ? (
                        <ol className="list-decimal list-inside text-gray-700 text-left">
                          {instructionsList.map((step: string, idx: number) => (
                            <li key={idx}>{step}</li>
                          ))}
                        </ol>
                      ) : (
                        <p className="text-gray-500">Aucune instruction disponible.</p>
                      )}
                    </Tab.Panel>
                  </Tab.Panels>
                </Tab.Group>
              </div>
              <div className="mt-6 flex justify-center">
                <button onClick={handleSave} disabled={loading} className="rounded-md bg-[#7C3AED] px-6 py-2 text-sm font-semibold text-white shadow hover:bg-purple-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]">
                  Sauvegarder la recette
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
