'use client'

import { Link } from 'react-router-dom'
import { ArrowRightIcon, SparklesIcon, ComputerDesktopIcon, HeartIcon } from '@heroicons/react/20/solid'

export default function AboutPage() {
    return (
        <div className="bg-white">
            <nav aria-label="breadcrumb" className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 text-sm text-gray-600">
                <ol className="flex space-x-2">
                    <li>
                        <Link to="/" className="hover:underline text-gray-700">
                            Accueil
                        </Link>
                    </li>
                    <span className="mx-2">/</span>
                    <li className="text-gray-500">À propos</li>
                </ol>
            </nav>
            <div className="relative isolate overflow-hidden py-20 sm:py-28">
                <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        À propos de <span className="text-[#7C3AED]">CookSync</span>
                    </h1>
                    <p className="mt-6 text-lg text-gray-700">
                        Chez CookSync, notre passion est de vous simplifier la vie en cuisine : recherches rapides, génération IA,
                        et organisation intuitive de vos recettes préférées.
                    </p>
                    <div className="mt-8 flex justify-center gap-x-4">
                        <Link to="/recipes" className="inline-flex items-center rounded-md bg-[#7C3AED] px-5 py-3 text-base font-semibold text-white hover:bg-purple-800">
                            Découvrir nos recettes
                            <ArrowRightIcon className="ml-2 h-5 w-5" aria-hidden="true" />
                        </Link>
                        <Link to="/recipes/generate" className="inline-flex items-center rounded-md bg-white px-5 py-3 text-base font-semibold text-[#7C3AED] ring-1 ring-[#7C3AED] hover:bg-purple-50">
                            Générer une recette
                            <SparklesIcon className="ml-2 h-5 w-5 text-[#7C3AED]" aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </div>
            <section className="bg-purple-50">
                <div className="mx-auto max-w-4xl px-6 py-16 sm:py-24 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Notre mission</h2>
                        <p className="mt-4 text-gray-600">
                            Nous croyons que cuisiner doit être un plaisir, pas une corvée.
                            Grâce à notre plateforme, chaque utilisateur peut trouver des recettes adaptées à son goût,
                            générer du contenu unique par IA, et conserver tout ce qu’il aime dans un seul endroit.
                            Notre objectif : rendre la création et le partage de recettes aussi simple que possible.
                        </p>
                    </div>
                </div>
            </section>
            <section className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
                <h2 className="text-3xl font-bold tracking-tight text-center text-gray-900">Nos valeurs</h2>
                <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="flex flex-col items-center text-center">
                        <SparklesIcon className="h-10 w-10 text-[#7C3AED]" aria-hidden="true" />
                        <h3 className="mt-4 text-xl font-semibold text-gray-900">Innovation</h3>
                        <p className="mt-2 text-gray-600">
                            Nous repensons la cuisine grâce à l’IA et à des fonctionnalités de recherche avancées pour vous inspirer.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <ComputerDesktopIcon className="h-10 w-10 text-[#7C3AED]" aria-hidden="true" />
                        <h3 className="mt-4 text-xl font-semibold text-gray-900">Simplicité</h3>
                        <p className="mt-2 text-gray-600">
                            Une interface claire, des filtres intelligents, et une organisation sans effort pour toutes vos recettes.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center">
                        <HeartIcon className="h-10 w-10 text-[#7C3AED]" aria-hidden="true" />
                        <h3 className="mt-4 text-xl font-semibold text-gray-900">Communauté</h3>
                        <p className="mt-2 text-gray-600">
                            Nous valorisons le partage et l’entraide. CookSync, c’est aussi un lieu pour échanger vos meilleures idées culinaires.
                        </p>
                    </div>
                </div>
            </section>
            <section className="mx-auto max-w-4xl px-6 py-16 sm:py-24 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Notre équipe</h2>
                    <p className="mt-4 text-gray-600">
                        Derrière CookSync se trouvent des passionnés de gastronomie, de technologie et de design,
                        toujours prêts à vous offrir la meilleure expérience.
                    </p>
                </div>
                <ul className="mt-12 grid gap-x-8 gap-y-16 text-center sm:grid-cols-2 md:grid-cols-3">
                    <li>
                        <h3 className="mt-6 text-lg font-semibold text-gray-900">Ilyes KABRINE</h3>
                        <p className="mt-2 text-[#7C3AED]">Développeur</p>
                    </li>
                    <li>
                        <h3 className="mt-6 text-lg font-semibold text-gray-900">Jean Pierre BEGUERISSE</h3>
                        <p className="mt-2 text-[#7C3AED]">Développeur</p>
                    </li>
                    <li>
                        <h3 className="mt-6 text-lg font-semibold text-gray-900">Ilyesse HAMCHERIF</h3>
                        <p className="mt-2 text-[#7C3AED]">Développeur</p>
                    </li>
                </ul>
            </section>
            <section className="bg-purple-50 py-16">
                <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Rejoignez-nous dès maintenant</h2>
                    <p className="mt-4 text-gray-600">
                        Découvrez pourquoi des milliers d’utilisateurs aiment CookSync. Commencez en ligne gratuitement.
                    </p>
                    <div className="mt-8 flex justify-center gap-x-4">
                        <Link to="/contact" className="inline-flex items-center rounded-md bg-[#7C3AED] px-5 py-3 text-base font-semibold text-white hover:bg-purple-800">
                            Contactez-nous
                            <ArrowRightIcon className="ml-2 h-5 w-5" aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}
