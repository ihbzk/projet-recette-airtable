import React, { useEffect, useState } from "react";

interface Recipe {
  id: string;
  [key: string]: any;
}

const RecipeList: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/recipes")
      .then((res) => {
        if (!res.ok)
          throw new Error("Erreur lors de la récupération des recettes");
        return res.json();
      })
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Chargement des recettes...</div>;
  if (error) return <div>Erreur : {error}</div>;

  return (
    <div>
      <h2>Liste des recettes</h2>
      {recipes.length === 0 ? (
        <p>Aucune recette trouvée.</p>
      ) : (
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id}>{recipe.Name || "Recette sans nom"}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecipeList;
