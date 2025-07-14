'use client'

import { Link } from 'react-router-dom'

export default function PrivacyPolicyPage() {
    return (
        <div className="bg-white">
            <div className="relative isolate overflow-hidden bg-purple-50 py-16 sm:py-24">
                <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                        Politique de confidentialité
                    </h1>
                    <p className="mt-6 text-lg text-gray-700">
                        Bienvenue sur CookSync. Votre vie privée est importante pour nous. <br />
                        Cette politique décrit quelles données nous collectons, comment nous les utilisons, et vos droits en tant qu’utilisateur.
                    </p>
                </div>
            </div>
            <main className="mx-auto max-w-4xl px-6 py-16 sm:py-24 lg:px-8 space-y-12">
                <nav aria-label="breadcrumb" className="text-sm text-gray-600">
                    <ol className="flex space-x-2">
                        <li>
                            <Link to="/" className="hover:underline text-gray-700">
                                Accueil
                            </Link>
                        </li>
                        <span className="mx-2">/</span>
                        <li className="text-gray-500">Politique de confidentialité</li>
                    </ol>
                </nav>
                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 text-left">1. Introduction</h2>
                    <p className="mt-4 text-gray-600 leading-relaxed text-left">
                        CookSync est une application de gestion et de génération de recettes basée sur l’IA.
                        Cette politique s’applique à toutes les fonctionnalités accessibles depuis notre site web et notre application mobile.
                        En utilisant CookSync, vous acceptez les conditions décrites ci-dessous.
                    </p>
                </section>
                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 text-left">2. Données que nous collectons</h2>
                    <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2 text-left">
                        <li>
                            <strong>Données de compte :</strong> lorsque vous remplissez notre formulaire de contact, nous collectons votre adresse email, votre nom de famille, votre pénom et votre numéro de téléphone.
                        </li>
                        <li>
                            <strong>Recettes et préférences :</strong> toutes les recettes que vous enregistrez, générez ou modifiez sont stockées.
                        </li>
                        <li>
                            <strong>Données de recherche :</strong> les mots-clés que vous utilisez pour rechercher des recettes sont temporairement stockés, uniquement pour personnaliser les suggestions et optimiser nos algorithmes de recherche.
                        </li>
                    </ul>
                </section>
                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 text-left">3. Finalité de la collecte des données</h2>
                    <p className="mt-4 text-gray-600 leading-relaxed text-left">
                        Nous utilisons vos données pour :
                    </p>
                    <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2 text-left">
                        <li>Gérer votre compte utilisateur et sécuriser votre accès.</li>
                        <li>Personnaliser votre expérience (recommandations de recettes, suggestions IA, etc.).</li>
                        <li>Améliorer nos algorithmes de recherche et de génération de recettes.</li>
                        <li>Envoyer des notifications importantes (mises à jour de l’application, nouveautés, etc.).</li>
                        <li>Produire des statistiques anonymisées pour mesurer l’utilisation et optimiser les performances du service.</li>
                    </ul>
                </section>
                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 text-left">4. Partage des informations et tiers</h2>
                    <p className="mt-4 text-gray-600 leading-relaxed text-left">
                        CookSync ne vend ni ne loue vos informations personnelles. Nous partageons vos données uniquement dans les cas suivants :
                    </p>
                    <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2 text-left">
                        <li>
                            <strong>Prestataires techniques :</strong> pour l’hébergement,  et l’envoi d’emails (ex. services cloud, services d’emailing). Tous nos prestataires sont soumis à des accords de confidentialité stricts.
                        </li>
                        <li>
                            <strong>Questions légales :</strong> si la loi l’exige (conformité réglementaire, réponses à une injonction judiciaire ou autre procédure légale).
                        </li>
                        <li>
                            <strong>Consentement explicite :</strong> vous pouvez explicitement accepter de partager certaines données avec des partenaires ou intégrations tierces (par exemple, export vers une plateforme externe).
                        </li>
                    </ul>
                </section>
                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 text-left">5. Sécurité des données</h2>
                    <p className="mt-4 text-gray-600 leading-relaxed text-left">
                        Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles standard de l’industrie pour protéger vos données contre tout accès non autorisé, altération ou divulgation :
                    </p>
                    <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2 text-left">
                        <li>Utilisation de certificats SSL/TLS pour toutes les communications entre votre appareil et nos serveurs.</li>
                        <li>Accès restreint aux données sur la base du principe du « besoin de savoir » pour nos collaborateurs et prestataires.</li>
                        <li>Surveillance régulière des systèmes pour détecter d’éventuelles tentatives d’intrusion ou failles.</li>
                    </ul>
                </section>
                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 text-left">6. Cookies et technologies similaires</h2>
                    <p className="mt-4 text-gray-600 leading-relaxed text-left">
                        Nous utilisons des cookies et des balises pixel pour :
                    </p>
                    <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2 text-left">
                        <li>Maintenir votre session active lorsque vous êtes connecté.</li>
                        <li>Analyser l’utilisation du site (Google Analytics ou équivalent).</li>
                        <li>Personnaliser votre expérience et retenir vos préférences (langue, filtres, etc.).</li>
                    </ul>
                    <p className="mt-4 text-gray-600 leading-relaxed text-left">
                        Vous pouvez configurer votre navigateur pour refuser tous les cookies ou afficher une alerte avant d’accepter un cookie.
                        Néanmoins, certaines fonctionnalités pourraient ne plus fonctionner correctement.
                    </p>
                </section>
                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 text-left">7. Conservation et suppression des données</h2>
                    <p className="mt-4 text-gray-600 leading-relaxed text-left">
                        Vos données restent conservées :
                    </p>
                    <ul className="mt-4 list-disc list-inside text-gray-600 space-y-2 text-left">
                        <li>
                            <strong>Données enregistrées :</strong> les recettes et préférences que vous avez créées restent dans notre base tant que vous ne demandez pas leur suppression.
                        </li>
                    </ul>
                </section>
                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 text-left">8. Modifications de cette politique</h2>
                    <p className="mt-4 text-gray-600 leading-relaxed text-left">
                        Nous pouvons mettre à jour cette politique à tout moment.
                        La date de dernière modification sera indiquée en haut de cette page.
                        En cas de changement majeur, nous vous en informerons via une notification dans l’application ou un email.
                    </p>
                </section>
                <section>
                    <h2 className="text-2xl font-semibold text-gray-900 text-left">9. Nous contacter</h2>
                    <p className="mt-4 text-gray-600 leading-relaxed text-left">
                        Pour toute question ou demande concernant cette politique de confidentialité, vous remplir notre <a href="/contact" className="text-[#7C3AED] hover:underline">formulaire de contact</a>.
                    </p>
                </section>
            </main>
        </div>
    )
}