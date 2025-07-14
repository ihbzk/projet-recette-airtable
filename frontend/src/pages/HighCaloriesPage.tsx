"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react";
import { StarIcon as SolidStar } from "@heroicons/react/20/solid";
import { StarIcon as OutlineStar } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
} from "@heroicons/react/20/solid";
import { Link, useLocation } from "react-router-dom";

interface Recipe {
  id: string;
  Name: string;
  Description: string;
  Ingredients: string;
  Instructions: string;
  Image?: string | { url: string }[];
  Servings: number | string;
  Type?: string;
  CreatedAt?: string;
  Calories?: number;
  Rating?: number;
}

interface FilterOption {
  value: string;
  label: string;
  checked: boolean;
}
interface FilterSection {
  id: string;
  name: string;
  options: FilterOption[];
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function HighCaloriesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [filterTypes, setFilterTypes] = useState<string[]>([]);
  const [filterRating, setFilterRating] = useState<number>(0);
  type SortOption = "bestRating" | "newest" | "";
  const [sortOption, setSortOption] = useState<SortOption>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const recipesPerPage = 9;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search")?.toLowerCase() || "";

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/highCaloriesRecipes`)
      .then((res) => {
        if (!res.ok) throw new Error("Erreur de récupération");
        return res.json();
      })
      .then((data: Recipe[]) => {
        const mapped = data.map((recipe) => ({
          id: recipe.id,
          Name: recipe.Name,
          Description: recipe.Description || "",
          Ingredients: recipe.Ingredients || "",
          Instructions: recipe.Instructions || "",
          Image: recipe.Image,
          Servings: recipe.Servings || 0,
          Type: recipe.Type || "",
          CreatedAt: recipe.CreatedAt || "",
          Calories: recipe.Calories || 0,
        }));
        setRecipes(mapped);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

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

  const allTypes = Array.from(
    new Set(
      recipes
        .map((r) => (r.Type ? r.Type.toString().trim() : ""))
        .filter((t) => t && t.length > 0)
    )
  ).sort();

  const typeSection: FilterSection = {
    id: "type",
    name: "Type de recette",
    options: allTypes.map((type) => ({
      value: type,
      label: type,
      checked: filterTypes.includes(type),
    })),
  };

  const ratingSection: FilterSection = {
    id: "rating",
    name: "Note minimale",
    options: [
      { value: "0", label: "Toutes notes", checked: filterRating === 0 },
      { value: "1", label: "≥ 1 étoile", checked: filterRating === 1 },
      { value: "2", label: "≥ 2 étoiles", checked: filterRating === 2 },
      { value: "3", label: "≥ 3 étoiles", checked: filterRating === 3 },
      { value: "4", label: "≥ 4 étoiles", checked: filterRating === 4 },
      { value: "5", label: "5 étoiles", checked: filterRating === 5 },
    ],
  };

  const filters: FilterSection[] = [typeSection, ratingSection];

  let filtered = recipes.filter((recipe) => {
    if (searchQuery) {
      const nameLower = recipe.Name.toLowerCase();
      const descLower = recipe.Description?.toLowerCase() || "";

      if (
        !nameLower.includes(searchQuery) &&
        !descLower.includes(searchQuery)
      ) {
        return false;
      }
    }
    const byType =
      filterTypes.length === 0 ||
      (recipe.Type && filterTypes.includes(recipe.Type.toString().trim()));

    const ratingValue = recipe.Rating || 0;
    const byRating = ratingValue >= filterRating;

    return byType && byRating;
  });

  if (sortOption === "bestRating") {
    filtered = filtered.sort((a, b) => {
      const aVal = a.Rating || 0;
      const bVal = b.Rating || 0;
      return bVal - aVal;
    });
  } else if (sortOption === "newest") {
    filtered = filtered.sort((a, b) => {
      const aTime = a.CreatedAt ? new Date(a.CreatedAt).getTime() : 0;
      const bTime = b.CreatedAt ? new Date(b.CreatedAt).getTime() : 0;

      return bTime - aTime;
    });
  }

  const totalPages = Math.ceil(filtered.length / recipesPerPage);

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }

  const startIndex = (currentPage - 1) * recipesPerPage;
  const endIndex = startIndex + recipesPerPage;
  const paginatedRecipes = filtered.slice(startIndex, endIndex);

  const activeFilterBadges: { id: string; label: string }[] = [];

  filterTypes.forEach((type) => {
    activeFilterBadges.push({ id: `type__${type}`, label: type });
  });

  if (filterRating > 0) {
    activeFilterBadges.push({
      id: `rating__${filterRating}`,
      label: `≥ ${filterRating} étoile${filterRating > 1 ? "s" : ""}`,
    });
  }

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (error) {
    return <div className="p-8 text-red-600">Erreur : {error}</div>;
  }

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
          <li className="text-gray-500">Hautes calories</li>
        </ol>
      </nav>
      <Dialog
        as="div"
        className="relative z-40 sm:hidden"
        open={mobileFiltersOpen}
        onClose={setMobileFiltersOpen}
      >
        <DialogBackdrop className="fixed inset-0 bg-black/25 transition-opacity" />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel className="relative ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition ease-in-out">
            <div className="flex items-center justify-between px-4">
              <h2 className="text-lg font-medium text-gray-900">Filtres</h2>
              <button
                type="button"
                className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                onClick={() => setMobileFiltersOpen(false)}
              >
                <span className="sr-only">Fermer le menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <form className="mt-4">
              {filters.map((section) => (
                <Disclosure
                  as="div"
                  key={section.id}
                  className="border-t border-gray-200 px-4 py-6"
                >
                  <h3 className="-mx-2 -my-3 flow-root">
                    <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-sm text-gray-400">
                      <span className="font-medium text-gray-900">
                        {section.name}
                      </span>
                      <span className="ml-6 flex items-center">
                        <ChevronDownIcon
                          className="h-5 w-5 transform group-data-open:-rotate-180 transition"
                          aria-hidden="true"
                        />
                      </span>
                    </DisclosureButton>
                  </h3>
                  <DisclosurePanel className="pt-6">
                    <div className="space-y-6">
                      {section.options.map((option, optionIdx) => (
                        <div
                          key={option.value}
                          className="flex items-center gap-3"
                        >
                          <input
                            id={`filter-mobile-${section.id}-${optionIdx}`}
                            name={`${section.id}[]`}
                            type="checkbox"
                            value={option.value}
                            defaultChecked={option.checked}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            onChange={(e) => {
                              if (section.id === "type") {
                                const val = option.value;
                                setFilterTypes((prev) =>
                                  e.target.checked
                                    ? [...prev, val]
                                    : prev.filter((x) => x !== val)
                                );
                              } else if (section.id === "rating") {
                                const valNum = parseInt(option.value, 10);
                                setFilterRating(e.target.checked ? valNum : 0);
                              }
                            }}
                          />
                          <label
                            htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                            className="text-sm text-gray-700"
                          >
                            {option.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </DisclosurePanel>
                </Disclosure>
              ))}
            </form>
          </DialogPanel>
        </div>
      </Dialog>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Hautes calories
        </h1>
        <p className="mb-6 text-base text-gray-500">
          Découvrez nos recettes avec &gt; 700 kcal. Appliquez recherche,
          filtres et tri comme d’habitude.
        </p>
        <section aria-labelledby="filter-heading">
          <h2 id="filter-heading" className="sr-only">
            Filtres
          </h2>
          <div className="border-b border-gray-200 bg-white pb-4">
            <div className="flex items-center justify-between">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <MenuButton className="inline-flex items-center px-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                    Trier
                    <ChevronDownIcon
                      className="-mr-1 ml-1 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </MenuButton>
                </div>
                <MenuItems className="absolute left-0 z-10 mt-2 w-40 origin-top-left rounded-md bg-white shadow-2xl ring-1 ring-black/5 focus:outline-none">
                  <div className="py-1">
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={() => setSortOption("bestRating")}
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block w-full px-4 py-2 text-left text-sm"
                          )}
                        >
                          Meilleure note
                        </button>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={() => setSortOption("newest")}
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block w-full px-4 py-2 text-left text-sm"
                          )}
                        >
                          Le plus récent
                        </button>
                      )}
                    </MenuItem>
                  </div>
                </MenuItems>
              </Menu>
              <button
                type="button"
                className="inline-block text-sm font-medium text-gray-700 hover:text-gray-900 sm:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                Filtres
              </button>
              <div className="hidden sm:block">
                <PopoverGroup className="flex items-center space-x-6">
                  {filters.map((section) => (
                    <Popover
                      key={section.id}
                      className="relative inline-block text-left px-4"
                    >
                      <PopoverButton className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
                        <span>{section.name}</span>
                        <ChevronDownIcon
                          className="-mr-1 ml-1 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      </PopoverButton>
                      <PopoverPanel className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white p-4 shadow-2xl ring-1 ring-black/5 focus:outline-none">
                        <form className="space-y-4">
                          {section.options.map((option, optionIdx) => (
                            <div
                              key={option.value}
                              className="flex items-center gap-3"
                            >
                              <input
                                id={`filter-${section.id}-${optionIdx}`}
                                name={`${section.id}[]`}
                                type="checkbox"
                                value={option.value}
                                defaultChecked={option.checked}
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                onChange={(e) => {
                                  if (section.id === "type") {
                                    const val = option.value;
                                    setFilterTypes((prev) =>
                                      e.target.checked
                                        ? [...prev, val]
                                        : prev.filter((x) => x !== val)
                                    );
                                  } else if (section.id === "rating") {
                                    const valNum = parseInt(option.value, 10);
                                    setFilterRating(
                                      e.target.checked ? valNum : 0
                                    );
                                  }
                                }}
                              />
                              <label
                                htmlFor={`filter-${section.id}-${optionIdx}`}
                                className="text-sm text-gray-700"
                              >
                                {option.label}
                              </label>
                            </div>
                          ))}
                        </form>
                      </PopoverPanel>
                    </Popover>
                  ))}
                </PopoverGroup>
              </div>
            </div>
          </div>
          {activeFilterBadges.length > 0 && (
            <div className="bg-gray-100">
              <div className="mx-auto max-w-7xl px-4 py-3 sm:flex sm:items-center sm:px-6 lg:px-8">
                <h3 className="text-sm font-medium text-gray-500">
                  Filtres :<span className="sr-only">, actifs</span>
                </h3>
                <div
                  aria-hidden="true"
                  className="hidden h-5 w-px bg-gray-300 sm:ml-4 sm:block"
                />
                <div className="mt-2 sm:mt-0 sm:ml-4">
                  <div className="-m-1 flex flex-wrap items-center">
                    {activeFilterBadges.map((badge) => (
                      <span
                        key={badge.id}
                        className="m-1 inline-flex items-center rounded-full border border-gray-200 bg-white py-1.5 pr-2 pl-3 text-sm font-medium text-gray-900"
                      >
                        <span>{badge.label}</span>
                        <button
                          type="button"
                          className="ml-1 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-500"
                          onClick={() => {
                            if (badge.id.startsWith("type__")) {
                              const val = badge.id.split("__")[1];
                              setFilterTypes((prev) =>
                                prev.filter((x) => x !== val)
                              );
                            } else if (badge.id.startsWith("rating__")) {
                              setFilterRating(0);
                            }
                          }}
                        >
                          <span className="sr-only">
                            Retirer filtre pour {badge.label}
                          </span>
                          <svg
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 8 8"
                            className="h-2 w-2"
                          >
                            <path
                              d="M1 1l6 6m0-6L1 7"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
      <div className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array.from({ length: recipesPerPage }).map((_, idx) => (
                  <div
                    key={idx}
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
              : paginatedRecipes.map((recipe) => (
                  <Link key={recipe.id} to={`/recipes/${recipe.id}`}>
                    <div className="rounded-lg bg-white shadow h-full">
                      {recipe.Image ? (
                        Array.isArray(recipe.Image) ? (
                          <img
                            src={recipe.Image[0].url}
                            alt={recipe.Name}
                            className="h-48 w-full object-cover rounded-t-lg"
                          />
                        ) : (
                          <img
                            src={recipe.Image}
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
                        <h2 className="text-sm font-semibold italic text-gray-800">
                          {recipe.Calories} kcal
                        </h2>
                        <div className="flex justify-center my-4">
                          {renderStars(recipe.Rating || 0)}
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">
                          {recipe.Name}
                        </h2>
                        <p className="mt-2 text-gray-600 line-clamp-3">
                          {recipe.Description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
            {!loading && filtered.length === 0 && (
              <div className="col-span-full py-8 text-center text-gray-500">
                Aucune recette ne correspond aux filtres sélectionnés.
              </div>
            )}
          </div>
        </div>
      </div>
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
    </div>
  );
}
