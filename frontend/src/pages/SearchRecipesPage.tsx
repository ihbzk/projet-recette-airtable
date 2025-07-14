"use client";

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { StarIcon as SolidStar, UsersIcon } from "@heroicons/react/20/solid";
import { StarIcon as OutlineStar } from "@heroicons/react/24/outline";
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";

interface Recipe {
  id: string;
  Name: string;
  Description: string;
  Ingredients: string;
  Instructions: string;
  Image?: string | { url: string }[];
  Servings: number | string;
  Type?: string;
  Rating?: number;
}

export default function SearchRecipesPage() {
  const [keyword, setKeyword] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const recipesPerPage = 9;

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialKeyword = queryParams.get("keyword") || "";

  useEffect(() => {
    if (initialKeyword) {
      setKeyword(initialKeyword);
      fetchResults(initialKeyword);
    }
  }, [initialKeyword]);

  async function fetchResults(term: string) {
    setLoading(true);
    setError(null);
    setRecipes([]);

    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_URL
        }/api/searchRecipes?keyword=${encodeURIComponent(term)}`
      );

      if (!response.ok) {
        throw new Error("Erreur lors de la recherche");
      }

      const data: Recipe[] = await response.json();

      setRecipes(data);
      setCurrentPage(1);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

  function renderStars(raw: number | string) {
    const rating = typeof raw === "string" ? parseFloat(raw) : raw;
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

    return (
      <div className="flex items-center space-x-0.5">
        {Array(full)
          .fill(0)
          .map((_, i) => (
            <SolidStar key={`full-${i}`} className="h-5 w-5 text-yellow-400" />
          ))}
        {half && (
          <div className="relative h-5 w-5 text-yellow-400">
            <SolidStar className="absolute inset-0" />
            <SolidStar
              className="absolute inset-0 text-gray-200"
              style={{ clipPath: "inset(0 50% 0 0)" }}
            />
          </div>
        )}
        {Array(empty)
          .fill(0)
          .map((_, i) => (
            <OutlineStar key={`empty-${i}`} className="h-5 w-5 text-gray-300" />
          ))}
      </div>
    );
  }

  const totalPages = Math.ceil(recipes.length / recipesPerPage);
  const startIndex = (currentPage - 1) * recipesPerPage;
  const endIndex = startIndex + recipesPerPage;
  const paginatedRecipes = recipes.slice(startIndex, endIndex);

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="bg-white">
      <nav
        aria-label="breadcrumb"
        className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 text-sm text-gray-600"
      >
        <ol className="flex space-x-2">
          <li>
            <Link to="/" className="hover:underline text-gray-700">
              Accueil
            </Link>
          </li>
          <span className="mx-2">/</span>
          <li>
            <Link to="/recipes" className="hover:underline text-gray-700">
              Recettes
            </Link>
          </li>
          <span className="mx-2">/</span>
          <li className="text-gray-500">
            <span className="italic">{keyword}</span>
          </li>
        </ol>
      </nav>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <h1 className="text-3xl font-bold text-gray-900">
          Résultats pour « {keyword} » :{" "}
          <span className="text-[#7C3AED]">
            {recipes.length} résultat {recipes.length > 1 ? "s" : ""}
          </span>
        </h1>
        {error && <p className="mt-4 text-center text-red-600">{error}</p>}
      </div>
      <div className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              Array.from({ length: recipesPerPage }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-white shadow animate-pulse"
                >
                  <div className="h-48 w-full bg-gray-300 rounded-t-lg" />
                  <div className="p-6 space-y-4">
                    <div className="mx-auto h-5 w-24 bg-gray-300 rounded" />
                    <div className="h-6 w-3/4 bg-gray-300 rounded" />
                    <div className="h-4 w-full bg-gray-300 rounded" />
                    <div className="h-4 w-5/6 bg-gray-300 rounded" />
                  </div>
                </div>
              ))
            ) : recipes.length > 0 ? (
              paginatedRecipes.map((recipe) => (
                <Link
                  key={recipe.id}
                  to={`/recipes/${recipe.id}`}
                  className="block rounded-lg bg-white shadow hover:shadow-md"
                >
                  {recipe.Image ? (
                    Array.isArray(recipe.Image) ? (
                      <img
                        src={recipe.Image[0].url}
                        alt={recipe.Name}
                        className="h-48 w-full object-cover rounded-t-lg"
                      />
                    ) : (
                      <img
                        src={recipe.Image as string}
                        alt={recipe.Name}
                        className="h-48 w-full object-cover rounded-t-lg"
                      />
                    )
                  ) : (
                    <div className="h-48 w-full bg-gray-200 flex items-center justify-center rounded-t-lg">
                      <span className="text-gray-500">Pas d’image</span>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex justify-center items-center mb-4">
                      <UsersIcon className="ml-1 h-4 w-4" />
                      &nbsp;{recipe.Servings}
                    </div>
                    <div className="flex justify-center mb-4">
                      {renderStars(recipe.Rating || 0)}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {recipe.Name}
                    </h2>
                    <p className="mt-2 text-gray-600 line-clamp-3">
                      {recipe.Description}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-gray-500">
                Aucune recette ne correspond à « {keyword} ».
              </div>
            )}
          </div>
        </div>
      </div>
      {!loading && recipes.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 pb-8">
          <nav className="flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
            <div className="-mt-px flex w-0 flex-1">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className={classNames(
                  currentPage === 1
                    ? "cursor-not-allowed text-gray-300"
                    : "text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  "inline-flex items-center border-t-2 border-transparent pt-4 pr-1 text-sm font-medium"
                )}
              >
                <ArrowLongLeftIcon
                  aria-hidden="true"
                  className={classNames(
                    currentPage === 1 ? "text-gray-300" : "text-gray-400",
                    "mr-3 h-5 w-5"
                  )}
                />
                Précédent
              </button>
            </div>
            <div className="hidden md:-mt-px md:flex">
              {Array.from({ length: totalPages }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    aria-current={currentPage === pageNum ? "page" : undefined}
                    className={classNames(
                      currentPage === pageNum
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                      "inline-flex items-center border-t-2 px-4 pt-4 text-sm font-medium"
                    )}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <div className="-mt-px flex w-0 flex-1 justify-end">
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages || totalPages === 0}
                className={classNames(
                  currentPage === totalPages || totalPages === 0
                    ? "cursor-not-allowed text-gray-300"
                    : "text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  "inline-flex items-center border-t-2 border-transparent pt-4 pl-1 text-sm font-medium"
                )}
              >
                Suivant
                <ArrowLongRightIcon
                  aria-hidden="true"
                  className={classNames(
                    currentPage === totalPages || totalPages === 0
                      ? "text-gray-300"
                      : "text-gray-400",
                    "ml-3 h-5 w-5"
                  )}
                />
              </button>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}
