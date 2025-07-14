"use client";

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeftIcon, StarIcon, UsersIcon } from "@heroicons/react/20/solid";
import { Tab } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface Recipe {
  id: string;
  Name: string;
  Description?: string;
  Type?: string;
  Servings?: number | string;
  Ingredients: string;
  Instructions: string;
  Allergies?: string;
  NutritionAnalysis?: string;
  Image?: string | { url: string }[];
  Rating?: number;
}

function RecipeSkeleton({ error }: { error?: string }) {
  return (
    <div className="bg-white">
      <div className="mx-auto mt-0 lg:mt-8 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8 flex justify-end">
        <div className="h-6 w-32 animate-pulse bg-gray-300 rounded-md" />
      </div>
      <div className="mx-auto mt-8 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        {error ? (
          <div className="flex flex-col items-start">
            <nav
              aria-label="Breadcrumb"
              className="my-8 max-w-2xl lg:max-w-7xl"
            >
              <ol className="flex items-center space-x-4 text-sm">
                <li>
                  <Link to="/" className="text-gray-900 hover:underline">
                    Accueil
                  </Link>
                </li>
                <span className="mx-2 text-gray-300">/</span>
                <li>
                  <Link to="/recipes" className="text-gray-900 hover:underline">
                    Recettes
                  </Link>
                </li>
                <span className="mx-2 text-gray-300">/</span>
                <li className="text-gray-500">{error}</li>
              </ol>
            </nav>
            <Link
              to="/recipes"
              className="inline-flex justify-start items-center rounded-md bg-white px-5 py-3 text-base font-semibold text-[#7C3AED] ring-1 ring-[#7C3AED] hover:bg-purple-50"
            >
              <ArrowLeftIcon
                className="ml-2 h-5 w-5 text-[#7C3AED]"
                aria-hidden="true"
              />
              Retour à liste des recettes
            </Link>
          </div>
        ) : (
          <div className="h-4 w-1/2 animate-pulse bg-gray-300 rounded" />
        )}
      </div>
      <div className="pt-0 pb-16 sm:pb-24">
        <div className="mx-auto mt-8 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:mt-0 w-full lg:w-1/3">
              <div className="h-[530px] w-full bg-gray-300 animate-pulse rounded-lg" />
            </div>
            <div className="flex flex-col w-full lg:w-1/2 space-y-6">
              <div className="flex justify-between items-center">
                <div className="h-8 w-3/4 bg-gray-300 animate-pulse rounded-md" />
                <div className="h-6 w-20 bg-gray-300 animate-pulse rounded-md" />
              </div>
              <div className="h-5 w-24 bg-gray-300 animate-pulse rounded mb-2" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-300 animate-pulse rounded" />
                <div className="h-4 w-5/6 bg-gray-300 animate-pulse rounded" />
              </div>
              <div className="space-y-2 pt-6">
                <div className="h-6 w-1/2 bg-gray-300 animate-pulse rounded" />
                <div className="h-4 w-full bg-gray-300 animate-pulse rounded" />
              </div>
              <div className="space-y-2 pt-6">
                <div className="h-6 w-1/2 bg-gray-300 animate-pulse rounded" />
                <div className="space-y-1">
                  <div className="h-4 w-3/4 bg-gray-300 animate-pulse rounded" />
                  <div className="h-4 w-2/3 bg-gray-300 animate-pulse rounded" />
                  <div className="h-4 w-1/2 bg-gray-300 animate-pulse rounded" />
                </div>
              </div>
              <div className="pt-6">
                <div className="h-8 w-48 bg-gray-300 animate-pulse rounded mb-4" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-300 animate-pulse rounded" />
                  <div className="h-4 w-full bg-gray-300 animate-pulse rounded" />
                  <div className="h-4 w-3/4 bg-gray-300 animate-pulse rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID de recette manquant");
      setLoading(false);
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/api/recipe/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Recette introuvable");
        return res.json();
      })
      .then((data: Recipe) => {
        setRecipe(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  function renderStars(raw: number | string | undefined) {
    if (raw == null) {
      return null;
    }

    const rating = typeof raw === "string" ? parseFloat(raw) : raw;

    if (isNaN(rating)) {
      return null;
    }

    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

    return (
      <div className="flex items-center space-x-0.5">
        {Array(full)
          .fill(0)
          .map((_, i) => (
            <StarIcon key={`full-${i}`} className="h-5 w-5 text-yellow-400" />
          ))}
        {half && (
          <div className="relative h-5 w-5 text-yellow-400">
            <StarIcon className="absolute inset-0" />
            <StarIcon
              className="absolute inset-0 text-gray-200"
              style={{ clipPath: "inset(0 50% 0 0)" }}
            />
          </div>
        )}
        {Array(empty)
          .fill(0)
          .map((_, i) => (
            <StarIcon key={`empty-${i}`} className="h-5 w-5 text-gray-200" />
          ))}
      </div>
    );
  }

  if (loading) {
    return <RecipeSkeleton />;
  }

  if (error) {
    if (error === "Recette introuvable") {
      return <RecipeSkeleton error={error} />;
    }

    return (
      <div className="p-8 text-center text-red-600">
        <p>Erreur : {error}</p>
        <Link
          to="/recipes"
          className="mt-4 inline-block text-[#7C3AED] hover:text-purple-800"
        >
          ← Retour à la liste
        </Link>
      </div>
    );
  }

  if (!recipe) {
    return null;
  }

  let nutritionObj: Record<string, any> | null = null;

  if (recipe.NutritionAnalysis) {
    try {
      nutritionObj = JSON.parse(recipe.NutritionAnalysis);
    } catch {
      nutritionObj = null;
    }
  }

  const ingredientsList = recipe.Ingredients.split(/,\s*/)
    .map((i) => i.trim())
    .filter((i) => i);
  const instructionsList = recipe.Instructions.split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s);

  return (
    <div className="bg-white">
      <div className="mx-auto mt-0 lg:mt-8 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8 flex justify-end">
        <Link
          to="/recipes"
          className="text-[#7C3AED] hover:text-purple-800 flex items-center"
        >
          <XMarkIcon className="mr-2 h-5 w-5 text-gray-500" />
          Retour à la liste des recettes
        </Link>
      </div>
      <nav
        aria-label="Breadcrumb"
        className="mx-auto mt-8 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8"
      >
        <ol className="flex items-center space-x-4 text-sm">
          <li>
            <Link to="/" className="text-gray-900 hover:underline">
              Accueil
            </Link>
          </li>
          <span className="mx-2 text-gray-300">/</span>
          <li>
            <Link to="/recipes" className="text-gray-900 hover:underline">
              Recettes
            </Link>
          </li>
          <span className="mx-2 text-gray-300">/</span>
          <li className="text-gray-500">{recipe.Name}</li>
        </ol>
      </nav>
      <div className="pt-0 pb-16 sm:pb-24">
        <div className="mx-auto mt-8 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:mt-0 w-full lg:w-1/2">
              <h2 className="sr-only">Images</h2>
              <div className="flex lg:gap-8 h-full">
                <div className="h-64 lg:h-full w-full">
                  {Array.isArray(recipe.Image) ? (
                    recipe.Image.map((imgObj, idx) => (
                      <img
                        key={idx}
                        src={imgObj.url}
                        alt={recipe.Name}
                        className={classNames(
                          idx === 0
                            ? "lg:col-span-2 lg:row-span-2"
                            : "hidden lg:block",
                          "rounded-lg object-cover"
                        )}
                      />
                    ))
                  ) : recipe.Image ? (
                    <img
                      src={recipe.Image as string}
                      alt={recipe.Name}
                      className="lg:col-span-2 lg:row-span-2 rounded-lg object-cover w-full h-full"
                    />
                  ) : (
                    <div className="lg:col-span-2 lg:row-span-2 rounded-lg bg-gray-200 w-full h-full" />
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col w-[fill-available] w-[-webkit-fill-available]">
              <div className="h-full">
                <div className="lg:col-span-5 lg:col-start-8">
                  <div className="flex justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {recipe.Name}
                    </h1>
                    {recipe.Type && (
                      <span className="rounded-md bg-purple-100 px-2 py-1 text-xs font-medium text-[#7C3AED] flex justify-center items-center uppercase">
                        {recipe.Type} <UsersIcon className="ml-1 h-4 w-4" />
                        &nbsp;{recipe.Servings}
                      </span>
                    )}
                  </div>
                  <div className="mt-4 flex items-center">
                    {renderStars(recipe.Rating)}
                    <span className="ml-2 text-sm text-gray-600">
                      {recipe.Rating && ` (${recipe.Rating} / 5)`}
                    </span>
                  </div>
                  {recipe.Description && (
                    <div className="mt-6">
                      <h2 className="text-lg font-medium text-gray-900 text-left">
                        Description
                      </h2>
                      <p className="mt-2 text-gray-700 text-left">
                        {recipe.Description}
                      </p>
                    </div>
                  )}
                </div>
                <div className="mt-8 lg:col-span-5 lg:col-start-8">
                  {recipe.Allergies && (
                    <div>
                      <h2 className="text-lg font-medium text-gray-900 text-left">
                        Allergies / Intolérances
                      </h2>
                      <p className="mt-2 text-gray-700 text-left">
                        {recipe.Allergies}
                      </p>
                    </div>
                  )}
                  {nutritionObj && (
                    <div className="mt-6">
                      <h2 className="text-lg font-medium text-gray-900 text-left">
                        Analyse Nutritionnelle
                      </h2>
                      <ul className="list-disc space-y-1 pl-5 text-gray-700 mt-2 text-left">
                        {Object.entries(nutritionObj).map(([key, value]) => (
                          <li key={key}>
                            <span className="capitalize">{key} :</span>{" "}
                            {String(value)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="mt-8 lg:col-span-5 lg:col-start-8">
                  <Tab.Group>
                    <Tab.List className="flex space-x-1 border-b">
                      {["Ingrédients", "Instructions"].map((tabName) => (
                        <Tab
                          key={tabName}
                          className={({ selected }) =>
                            classNames(
                              "px-3 py-1 text-sm font-medium",
                              selected
                                ? "border-b-2 border-[#7C3AED] text-[#7C3AED]"
                                : "text-gray-500 hover:text-gray-700"
                            )
                          }
                        >
                          {tabName}
                        </Tab>
                      ))}
                    </Tab.List>
                    <Tab.Panels className="mt-4">
                      <Tab.Panel>
                        {ingredientsList.length ? (
                          <ul className="list-disc space-y-1 pl-5 text-gray-700 text-left">
                            {ingredientsList.map((ing, i) => (
                              <li key={i}>{ing}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500">
                            Aucun ingrédient renseigné.
                          </p>
                        )}
                      </Tab.Panel>
                      <Tab.Panel>
                        {instructionsList.length ? (
                          <ol className="list-decimal space-y-1 pl-5 text-gray-700 text-left">
                            {instructionsList.map((step, i) => (
                              <li key={i}>{step}</li>
                            ))}
                          </ol>
                        ) : (
                          <p className="text-gray-500">
                            Aucune instruction renseignée.
                          </p>
                        )}
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
