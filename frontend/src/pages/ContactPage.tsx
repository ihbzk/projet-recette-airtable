'use client'

import { Fragment, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/16/solid';
import { Switch } from '@headlessui/react';
import { Link, useNavigate } from 'react-router-dom';

export default function ContactPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [agreed, setAgreed] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!firstName || !lastName || !email || !message) {
            setStatusMessage("Merci de remplir tous les champs obligatoires.");
            return;
        };

        if (!agreed) {
            setStatusMessage("Vous devez accepter la politique de confidentialité.");
            return;
        };

        setIsSubmitting(true);
        setStatusMessage(null);

        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/api/contacts`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        firstName: firstName.trim(),
                        lastName: lastName.trim(),
                        email: email.trim(),
                        phone: phone.trim(),
                        message: message.trim(),
                        agreed,
                    }),
                }
            );

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Échec de l’envoi');
            };

            setFirstName('');
            setLastName('');
            setEmail('');
            setPhone('');
            setMessage('');
            setAgreed(false);
            navigate('/contact/success');
        } catch (err: any) {
            setStatusMessage(`Erreur : ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    <li className="text-gray-500">Contact</li>
                </ol>
            </nav>
            <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
                <div aria-hidden="true" className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                    <div style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }} className="relative left-1/2 -z-10 aspect-1155/678 w-[144.5rem] max-w-none -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-[288.75rem]" />
                </div>
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">
                        Contactez l’équipe Cook<span className="italic">Sync</span>
                    </h2>
                    <p className="mt-2 text-lg/8 text-gray-600">
                        Besoin d’une démo ou d’informations ? Notre équipe vous répondra sous 24 h.
                    </p>
                </div>
                {statusMessage && (
                    <p className="mt-6 text-center text-sm font-medium text-red-600">
                        {statusMessage}
                    </p>
                )}
                <form onSubmit={handleSubmit} className="mx-auto mt-16 max-w-xl sm:mt-20">
                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                        <div>
                            <label htmlFor="first-name" className="block text-sm/6 font-semibold text-gray-900 text-left">
                                Prénom <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-2.5">
                                <input id="first-name" name="first-name" type="text" autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 border outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#7C3AED]" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="last-name" className="block text-sm/6 font-semibold text-gray-900 text-left">
                                Nom de famille <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-2.5">
                                <input id="last-name" name="last-name" type="text" autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="block w-full rounded-md bg-white px-3.5 py-2 text-base border text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#7C3AED]" />
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="email" className="block text-sm/6 font-semibold text-gray-900 text-left">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-2.5">
                                <input id="email" name="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="block w-full rounded-md bg-white px-3.5 py-2 text-base border text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#7C3AED]" />
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="phone-number" className="block text-sm/6 font-semibold text-gray-900 text-left">
                                Téléphone
                            </label>
                            <div className="mt-2.5">
                                <div className="flex rounded-md bg-white border outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-[#7C3AED]">
                                    <div className="grid shrink-0 grid-cols-1 focus-within:relative">
                                        <select id="country" name="country" autoComplete="country" aria-label="Country" defaultValue="+33" className="col-start-1 row-start-1 w-full appearance-none rounded-md py-2 pr-7 pl-3.5 text-base text-gray-500 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#7C3AED] sm:text-sm/6">
                                            <option>+33</option>
                                        </select>
                                        <ChevronDownIcon aria-hidden="true" className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4" />
                                    </div>
                                    <input id="phone-number" name="phone-number" type="text" placeholder="06 12 34 56 78" value={phone} onChange={(e) => setPhone(e.target.value)} className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6" />
                                </div>
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="message" className="block text-sm/6 font-semibold text-gray-900 text-left">
                                Message <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-2.5">
                                <textarea id="message" name="message" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} required className="block w-full rounded-md bg-white px-3.5 py-2 text-base border text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#7C3AED]" />
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <Switch.Group as={Fragment}>
                                <div className="flex items-center">
                                    <Switch checked={agreed} onChange={setAgreed} className={`${agreed ? 'bg-[#7C3AED]' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none`}>
                                        <span className="sr-only">Agree to privacy policy</span>
                                        <span className={`${agreed ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
                                    </Switch>
                                    <Switch.Label as="span" className="ml-3 text-sm text-gray-600">
                                        En sélectionnant ceci, vous acceptez notre{' '}
                                        <a href="/privacy-policy" className="font-semibold text-[#7C3AED]">
                                            politique de confidentialité
                                        </a>.
                                    </Switch.Label>
                                </div>
                            </Switch.Group>
                        </div>
                    </div>
                    <div className="mt-10">
                        <button type="submit" disabled={isSubmitting} className="block w-full rounded-md bg-[#7C3AED] px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-purple-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED] disabled:opacity-50">
                            {isSubmitting ? "Envoi en cours…" : "Envoyer"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}
