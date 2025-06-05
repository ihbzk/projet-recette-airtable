'use client'

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function AddIngredientPage() {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      setError("Le nom et la description sont requis.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/addIngredient`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Name: name.trim(),
            Description: description.trim(),
            Recettes: [], // Pas d’association de recettes par défaut
          }),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erreur à l’ajout");
      }
      // Après création, on revient à la liste des ingrédients
      navigate("/ingredients");
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
          <li>
            <Link to="/ingredients" className="hover:underline text-gray-700">
              Ingrédients
            </Link>
          </li>
          <span className="mx-2">/</span>
          <li className="text-gray-500">Ajouter</li>
        </ol>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-4">Ajouter un ingrédient</h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-6 rounded-lg border border-gray-200 p-6 shadow-sm">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-900">
            Nom de l’ingrédient
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-gray-900 focus:outline-[#7C3AED]"
            placeholder="Ex : Tomates"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-900">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-gray-900 focus:outline-[#7C3AED]"
            placeholder="Ex : Légume rouge utilisé en salade, sauce…"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex justify-between">
          <Link
            to="/ingredients"
            className="inline-block rounded-md bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="inline-block rounded-md bg-[#7C3AED] px-4 py-2 text-sm text-white hover:bg-purple-800 disabled:opacity-50"
          >
            {loading ? "Enregistrement…" : "Ajouter"}
          </button>
        </div>
      </form>
    </div>
  );
}
