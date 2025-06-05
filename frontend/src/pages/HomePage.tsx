'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

interface Recipe {
  id: string;
  Name: string;
  Image?: string | { url: string }[];
}

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [featured, setFeatured] = useState<Recipe[]>([]);
  const [lowCal, setLowCal] = useState<Recipe[]>([]);
  const [highCal, setHighCal] = useState<Recipe[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingLow, setLoadingLow] = useState(true);
  const [loadingHigh, setLoadingHigh] = useState(true);
  const [errorFeatured, setErrorFeatured] = useState<string | null>(null);
  const [errorLow, setErrorLow] = useState<string | null>(null);
  const [errorHigh, setErrorHigh] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/recipes`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Erreur de récupération des recettes');
        }
        return res.json();
      })
      .then((data: Recipe[]) => {
        setFeatured(data.slice(0, 5));
        setLoadingFeatured(false);
      })
      .catch((err) => {
        setErrorFeatured(err.message);
        setLoadingFeatured(false);
      })
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/lowCaloriesRecipes`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Erreur de récupération low calories');
        }
        return res.json();
      })
      .then((data: Recipe[]) => {
        const mapped = data.map((recipe) => ({
          id: recipe.id,
          Name: recipe.Name,
          Image: recipe.Image,
        }))
        setLowCal(mapped.slice(0, 5));
        setLoadingLow(false);
      })
      .catch((err) => {
        setErrorLow(err.message);
        setLoadingLow(false);
      })
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/highCaloriesRecipes`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Erreur de récupération high calories');
        }
        return res.json()
      })
      .then((data: Recipe[]) => {
        const mapped = data.map((recipe) => ({
          id: recipe.id,
          Name: recipe.Name,
          Image: recipe.Image,
        }))
        setHighCal(mapped.slice(0, 5));
        setLoadingHigh(false);
      })
      .catch((err) => {
        setErrorHigh(err.message);
        setLoadingHigh(false);
      })
  }, []);

  function RenderCarousel({
    items,
    loading,
    error,
    title,
    linkAll,
    linkTitle,
  }: {
    items: Recipe[],
    loading: boolean,
    error: string | null,
    title: string,
    linkAll: string,
    linkTitle: string,
  }) {
    return (
      <section aria-labelledby={title.replace(/\s/g, '-') + '-heading'} className="py-8 xl:mx-auto xl:max-w-7xl xl:px-8">
        <nav aria-label="breadcrumb" className="text-sm text-gray-600 mb-8">
          <ol className="flex space-x-2">
            <li className="text-gray-500">Accueil</li>
          </ol>
        </nav>
        <div className="px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8 xl:px-0">
          <h2 id={title.replace(/\s/g, '-') + '-heading'} className="text-2xl font-bold tracking-tight text-gray-900">
            {title}
          </h2>
          <Link to={linkAll} className="hidden text-sm font-semibold text-[#7C3AED] hover:text-purple-800 sm:block">
            {linkTitle}
            <span aria-hidden="true"> →</span>
          </Link>
        </div>
        <div className="mt-4 flow-root">
          <div className="-my-2">
            <div className="relative box-content h-72 overflow-x-auto py-2 xl:overflow-visible">
              {loading ? (
                <div className="absolute flex space-x-6 px-4 sm:px-6 lg:px-8 xl:relative xl:grid xl:grid-cols-5 xl:gap-x-8 xl:space-x-0 xl:px-0">
                  {Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <div key={index} className="relative flex h-72 w-48 flex-col overflow-hidden rounded-lg bg-gray-100 p-4 animate-pulse xl:w-auto">
                        <div className="absolute inset-0 bg-gray-300" />
                        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-gray-800 opacity-50" />
                        <div className="relative mt-auto h-4 w-28 bg-gray-300" />
                      </div>
                    ))}
                </div>
              ) : error ? (
                <div className="flex h-72 w-full items-center justify-center">
                  <p className="text-red-500">Erreur : {error}</p>
                </div>
              ) : (
                <div className="absolute flex space-x-6 px-4 sm:px-6 lg:px-8 xl:relative xl:grid xl:grid-cols-5 xl:gap-x-8 xl:space-x-0 xl:px-0">
                  {items.map((recipe) => (
                    <Link key={recipe.id} to={`/recipes/${recipe.id}`} className="relative flex h-72 w-48 flex-col overflow-hidden rounded-lg bg-gray-100 p-4 hover:opacity-75 xl:w-auto">
                      <span aria-hidden="true" className="absolute inset-0">
                        {recipe.Image ? (
                          Array.isArray(recipe.Image) ? (
                            <img alt={recipe.Name} src={recipe.Image[0].url} className="h-full w-full object-cover rounded-md" />
                          ) : (
                            <img alt={recipe.Name} src={recipe.Image as string} className="h-full w-full object-cover rounded-md" />
                          )
                        ) : (
                          <div className="h-full w-full bg-gray-200 flex items-center justify-center text-gray-400">
                            Pas d’image
                          </div>
                        )}
                      </span>
                      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-gray-800 opacity-50" />
                      <span className="relative mt-auto text-center text-lg font-bold text-white truncate">
                        {recipe.Name}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 px-4 sm:hidden">
          <Link to={linkAll} className="block text-sm font-semibold text-[#7C3AED] hover:text-purple-800">
            Voir toutes <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    )
  }

  return (
    <div className="bg-white">
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="relative z-40 lg:hidden">
        <DialogBackdrop transition className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0" />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel transition className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full">
            <div className="flex px-4 pt-5 pb-2">
              <button type="button" onClick={() => setMobileMenuOpen(false)} className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400">
                <span className="sr-only">Fermer le menu</span>
                <XMarkIcon aria-hidden="true" className="h-6 w-6" />
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
      <div className="relative !bg-cover" style={{ background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://i.goopics.net/yuq6o2.jpg)' }}>
        <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 py-32 text-center sm:py-64 lg:px-0">
          <h1 className="text-4xl font-bold tracking-tight text-white lg:text-6xl">
            Cook<span className="italic">Sync</span>
          </h1>
          <p className="mt-4 text-xl text-white">
            Découvrez les recettes les plus savoureuses et faciles à réaliser. Cliquez sur “Voir toutes les recettes” pour parcourir notre collection complète.
          </p>
          <Link to="/recipes" className="mt-8 inline-block rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-gray-900 hover:bg-gray-100">
            Voir toutes les recettes
          </Link>
        </div>
      </div>
      <main>
        <RenderCarousel items={featured} loading={loadingFeatured} error={errorFeatured} title="Recettes à la une" linkAll="/recipes" linkTitle="Voir toutes les recettes" />
        <section aria-labelledby="inspiration-heading" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-lg">
            <div className="absolute inset-0">
              <img alt="Cuisine gourmande" src="https://i.goopics.net/jcme3g.jpg" className="size-full object-cover" />
            </div>
            <div className="relative bg-gray-900/75 px-6 py-32 sm:px-12 sm:py-40 lg:px-16">
              <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
                <h2 id="inspiration-heading" className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Générateur de recettes IA
                </h2>
                <p className="mt-3 text-xl text-white">
                  Obtenez instantanément des recettes personnalisées grâce à notre intelligence artificielle. Décrivez vos ingrédients ou vos envies, et laissez notre outil vous guider vers des plats savoureux.
                </p>
                <Link to="/recipes/generate" className="mt-8 block w-full rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-gray-900 hover:bg-gray-100 sm:w-auto">
                  Essayez le générateur IA
                </Link>
              </div>
            </div>
          </div>
        </section>
        <RenderCarousel items={lowCal} loading={loadingLow} error={errorLow} title="Recettes faibles en calories" linkAll="/recipes/low-calories" linkTitle="Voir toutes les recettes faibles en calories" />
        <RenderCarousel items={highCal} loading={loadingHigh} error={errorHigh} title="Recettes riches en calories" linkAll="/recipes/high-calories" linkTitle="Voir toutes les recettes riches en calories" />
        <section aria-labelledby="inspiration-heading" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-lg">
            <div className="absolute inset-0">
              <img alt="Cuisine gourmande" src="https://i.goopics.net/7im23x.jpg" className="size-full object-cover" />
            </div>
            <div className="relative bg-gray-900/75 px-6 py-32 sm:px-12 sm:py-40 lg:px-16">
              <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
                <h2 id="inspiration-heading" className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Recettes pour tous les goûts et tous les objectifs
                </h2>
                <p className="mt-3 text-xl text-white">
                  Découvrez des recettes équilibrées, qu’elles soient faibles en calories pour garder la ligne ou riches pour les gourmands. Notre sélection s’adapte à chaque envie, sans compromis sur le goût.
                </p>
                <Link to="/contact" className="mt-8 block w-full rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-gray-900 hover:bg-gray-100 sm:w-auto">
                  Contactez-nous
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
