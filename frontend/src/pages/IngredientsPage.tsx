'use client'

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

interface IngredientRecord {
    id: string;
    Name: string;
    Description: string;
    Recettes: string[]; // noms des recettes associées
}

export default function IngredientsPage() {
    const [ingredients, setIngredients] = useState<IngredientRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchIngredients();
    }, []);

    const fetchIngredients = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API_URL}/api/ingredients`
            );
            if (!response.ok) throw new Error("Erreur de récupération");
            const data: IngredientRecord[] = await response.json();
            setIngredients(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white px-4 py-8 sm:px-6 lg:px-8">
            {/* Fil d’Ariane */}
            <nav aria-label="breadcrumb" className="mb-6 text-sm text-gray-600">
                <ol className="flex space-x-2">
                    <li>
                        <Link to="/" className="hover:underline text-gray-700">
                            Accueil
                        </Link>
                    </li>
                    <span className="mx-2">/</span>
                    <li className="text-gray-500">Ingrédients</li>
                </ol>
            </nav>

            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-gray-900">Liste des ingrédients</h1>
                <Link
                    to="/ingredients/add"
                    className="rounded-md bg-[#7C3AED] px-4 py-2 text-white hover:bg-purple-800"
                >
                    Ajouter un ingrédient
                </Link>
            </div>

            {loading && <p className="text-gray-500">Chargement…</p>}
            {error && <p className="text-red-600">Erreur : {error}</p>}

            {!loading && !error && ingredients.length === 0 && (
                <p className="text-gray-500">Aucun ingrédient enregistré.</p>
            )}

            {!loading && !error && ingredients.length > 0 && (
                <ul className="space-y-4">
                    {ingredients.map((ing) => (
                        <li
                            key={ing.id}
                            className="rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md"
                        >
                            <h2 className="text-lg font-semibold text-gray-800">{ing.Name}</h2>
                            <p className="mt-1 text-gray-600">{ing.Description}</p>
                            {ing.Recettes && ing.Recettes.length > 0 && (
                                <p className="mt-2 text-sm text-gray-500">
                                    Recettes associées : {ing.Recettes.join(", ")}
                                </p>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}