import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

export default function Navbar() {
    const [query, setQuery] = useState<string>('')
    const navigate = useNavigate()

    function onSubmitSearch(e: React.FormEvent) {
        e.preventDefault()
        const trimmed = query.trim()

        if (trimmed) {
            navigate(`/recipes/search?keyword=${encodeURIComponent(trimmed)}`)
        } else {
            navigate('/recipes')
        }
    }

    const navigation = [
        { name: 'Accueil', to: '/' },
        { name: 'À propos', to: '/about' },
        { name: 'Recettes', to: '/recipes' },
        { name: 'Générer une recette', to: '/recipes/generate' },
    ]

    return (
        <Disclosure as="nav" className="bg-white shadow-sm fixed w-full z-50">
            <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
                <div className="flex h-16 justify-between">
                    <div className="flex px-2 lg:px-0">
                        <div className="flex shrink-0 items-center">
                            <Link to="/" className="flex items-center">
                                <svg width="58" height="56" viewBox="0 0 58 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-auto">
                                    <path d="M3 27L55 27" stroke="#7C3AED" strokeWidth="4" strokeLinecap="round" />
                                    <path d="M49.0006 27C49.0006 33.3652 48.7514 43.4991 45.0006 48C41.2499 52.5009 34.3049 52 29.0006 52C23.6962 52 14.5792 52.5009 10.8285 48C7.07776 43.4991 9.00064 33.3652 9.00064 27" stroke="#7C3AED" strokeWidth="4" />
                                    <path d="M45.2848 11.1714C45.8656 11.4423 46.2745 11.8413 46.4874 12.2225C46.7011 12.605 46.6856 12.8926 46.6032 13.0695L40.2032 26.7942C40.1208 26.9711 39.9104 27.1677 39.48 27.25C39.0512 27.3319 38.4827 27.2752 37.9017 27.0043C37.5565 26.8433 37.2574 26.7354 37.014 26.6529L42.9903 11.3665C43.0776 11.1936 43.2875 11.0052 43.7057 10.9253C44.1345 10.8434 44.7037 10.9004 45.2848 11.1714Z" stroke="#7C3AED" strokeWidth="2" />
                                    <path d="M24.5 18.5C24.5 15.5 18.0004 12.5 22.0001 9.5" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" />
                                    <path d="M30.5012 15.5C28.5019 13 35.999 10 32.5 3" stroke="#7C3AED" strokeWidth="3" strokeLinecap="round" />
                                </svg>
                                <p className="ml-2 text-[#7C3AED] font-bold">Cook<span className="italic">Sync</span></p>
                            </Link>
                        </div>
                        <div className="hidden lg:ml-6 lg:flex lg:space-x-8">
                            {navigation.map((item) => (
                                <Link key={item.name} to={item.to} className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700">
                                    {item.name}
                                </Link>
                            ))}
                            <div className="flex items-center">
                                <div className="shrink-0">
                                    <a href="/contact" type="button" className="relative inline-flex items-center gap-x-1.5 rounded-md bg-[#7C3AED] px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-purple-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]">
                                        Contact
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end">
                        <div className="grid w-full max-w-lg grid-cols-1 lg:max-w-xs">
                            <form onSubmit={onSubmitSearch} className="col-start-1 row-start-1 w-full">
                                <label htmlFor="search" className="sr-only">
                                    Rechercher une recette
                                </label>
                                <div className="relative">
                                    <input id="search" name="search" type="search" placeholder="Rechercher une recette..." value={query} onChange={(e) => setQuery(e.target.value)} className="block w-full rounded-md bg-white py-1.5 pr-3 pl-10 text-base text-gray-900 outline-1 border outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#7C3AED] sm:text-sm/6" />
                                    <MagnifyingGlassIcon aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <DisclosurePanel className="lg:hidden">
                <div className="space-y-1 pt-2 pb-3">
                    {navigation.map((item) => (
                        <DisclosureButton as={Link} to={item.to} key={item.name} className="block border-l-4 border-transparent py-2 pr-4 pl-3 text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800">
                            {item.name}
                        </DisclosureButton>
                    ))}
                </div>
            </DisclosurePanel>
        </Disclosure>
    )
}
