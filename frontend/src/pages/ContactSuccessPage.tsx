'use client'

import { Link } from 'react-router-dom'

export default function ContactSuccessPage() {
    return (
        <>
            <nav aria-label="breadcrumb" className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 text-sm text-gray-600">
                <ol className="flex space-x-2">
                    <li>
                        <Link to="/" className="hover:underline text-gray-700">
                            Accueil
                        </Link>
                    </li>
                    <span className="mx-2">/</span>
                    <li>
                        <Link to="/contact" className="hover:underline text-gray-700">
                            Contact
                        </Link>
                    </li>
                    <span className="mx-2">/</span>
                    <li className="text-gray-500">Succès</li>
                </ol>
            </nav>
            <main className="relative isolate px-6 pt-14 lg:px-8">
                <div aria-hidden="true" className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                    <div
                        style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36rem] -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72rem]" />
                </div>
                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                    <div className="text-center">
                        <h1 className="text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
                            Merci !
                        </h1>
                        <p className="mt-8 text-lg font-medium text-gray-500 sm:text-xl">
                            Votre message a bien été envoyé. Nous vous contacterons sous 24 h.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Link to="/" className="rounded-md bg-[#7C3AED] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-purple-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]">
                                Retour à l’accueil
                            </Link>
                            <Link to="/recipes" className="text-sm font-semibold text-gray-900">
                                Voir nos recettes <span aria-hidden="true">→</span>
                            </Link>
                        </div>
                    </div>
                </div>
                <div aria-hidden="true" className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
                    <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} className="relative left-[calc(50%+3rem)] aspect-1155/678 w-[36rem] -translate-x-1/2 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72rem]" />
                </div>
            </main>
        </>
    )
}
