# 🍳 Projet Recettes Culinaires - Airtable

Une application web moderne de recettes culinaires avec backend Node.js/TypeScript et frontend React, intégrant Airtable comme base de données et des APIs externes pour les images.

## ✨ Fonctionnalités

### 🎯 **Gestion des Recettes**
- 📖 **Liste complète** : Affichage de toutes les recettes avec pagination
- 🔍 **Recherche avancée** : Recherche par nom, description, ingrédients
- 🏷️ **Filtrage intelligent** : Par type de recette et note minimale
- 📊 **Tri dynamique** : Par note, date de création, popularité
- 📱 **Interface responsive** : Optimisé mobile et desktop

### ⭐ **Système de Notation Fictif**
- 🌟 **Notes réalistes** : Génération automatique de notes entre 3.0 et 5.0 étoiles
- 🔄 **Cohérence** : Chaque recette garde sa note unique basée sur son ID
- 📈 **Filtrage par note** : Filtres ≥ 1, ≥ 2, ≥ 3, ≥ 4, 5 étoiles
- 🏆 **Tri par popularité** : Tri "Meilleure note" fonctionnel
- 🎨 **Affichage visuel** : Étoiles pleines, demi-étoiles et vides

### 🥗 **Catégories Spécialisées**
- 🥬 **Recettes Faibles Calories** : ≤ 700 kcal avec analyse nutritionnelle
- 🍔 **Recettes Hautes Calories** : > 700 kcal pour les gourmands
- 🍰 **Types variés** : Plats principaux, desserts, entrées, etc.

### 🤖 **Génération IA**
- 🧠 **Recettes intelligentes** : Génération via OpenAI GPT-3.5
- 🎯 **Personnalisation** : Basée sur ingrédients, nombre de personnes, intolérances
- 📊 **Analyse nutritionnelle** : Calories, protéines, glucides, lipides
- 🖼️ **Images automatiques** : Récupération via Unsplash API

### 🖼️ **Gestion des Images**
- 📸 **Unsplash Integration** : Images de haute qualité pour chaque recette
- 🔄 **Fallback Pexels** : Système de secours pour les images
- 🎨 **Recherche intelligente** : Mots-clés culinaires pour des résultats pertinents
- 📱 **Optimisation responsive** : Images adaptées à tous les écrans

## 🛠️ Technologies Utilisées

### **Backend**
- **Node.js** + **TypeScript** : Runtime et langage
- **Express.js** : Framework web
- **Airtable Plus** : Intégration base de données
- **OpenAI API** : Génération de recettes IA
- **Unsplash API** : Images de recettes
- **Pexels API** : Images de secours

### **Frontend**
- **React 18** : Framework UI
- **TypeScript** : Typage statique
- **Tailwind CSS** : Styling moderne
- **React Router** : Navigation
- **Headless UI** : Composants accessibles
- **Heroicons** : Icônes SVG

### **Infrastructure**
- **Docker** : Containerisation
- **Docker Compose** : Orchestration
- **Airtable** : Base de données cloud
- **Environment Variables** : Configuration sécurisée

## 🚀 Installation et Démarrage

### **Prérequis**
- Node.js 18+ et npm
- Docker et Docker Compose
- Comptes développeur : Airtable, OpenAI, Unsplash

### **1. Clonage et Configuration**
```bash
git clone <repository-url>
cd projet-recette-airtable
```

### **2. Configuration des Variables d'Environnement**
Créez un fichier `.env` dans le dossier racine du projet :
```bash
cp .env.example .env
```

Puis éditez le fichier `.env` avec vos vraies clés API :
```env
# Airtable
AIRTABLE_BASE_ID=votre_base_id
AIRTABLE_TOKEN=votre_token

# OpenAI
OPENAI_API_KEY=votre_clé_openai

# Unsplash
UNSPLASH_ACCESS_KEY=votre_clé_unsplash

# Pexels (fallback)
PEXELS_API_KEY=votre_clé_pexels

# Configuration du serveur
PORT=8000
NODE_ENV=development
```

⚠️ **IMPORTANT** : Ne jamais commiter le fichier `.env` sur Git ! Il contient vos clés API sensibles.

### **3. Installation des Dépendances**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### **4. Démarrage avec Docker**
```bash
# Depuis la racine du projet
docker-compose up --build
```

### **5. Démarrage Manuel**
```bash
# Backend (port 8000)
cd backend
npm run dev

# Frontend (port 3000)
cd frontend
npm start
```

## 📁 Structure du Projet

```
projet-recette-airtable/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── recipes.controller.ts    # Logique métier recettes
│   │   │   ├── ingredients.controller.ts
│   │   │   └── contacts.controller.ts
│   │   ├── routes/
│   │   │   ├── recipes.ts               # Routes API recettes
│   │   │   ├── ingredient.ts
│   │   │   └── contacts.ts
│   │   └── index.ts                     # Point d'entrée serveur
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/                  # Composants réutilisables
│   │   ├── pages/                       # Pages principales
│   │   │   ├── RecipesPage.tsx          # Liste des recettes
│   │   │   ├── RecipeDetail.tsx         # Détail d'une recette
│   │   │   ├── LowCaloriesPage.tsx      # Recettes faibles calories
│   │   │   ├── HighCaloriesPage.tsx     # Recettes hautes calories
│   │   │   ├── SearchRecipesPage.tsx    # Recherche
│   │   │   └── GenerateRecipe.tsx       # Génération IA
│   │   └── routes/
│   ├── package.json
│   └── tailwind.config.js
├── docker-compose.yml
└── README.md
```

## 🔧 API Endpoints

### **Recettes**
- `GET /api/recipes` - Liste toutes les recettes
- `GET /api/recipes?sort=newest` - Tri par date
- `GET /api/recipe/:id` - Détail d'une recette
- `POST /api/recipes` - Ajouter une recette
- `POST /api/generateRecipe` - Générer une recette IA

### **Recherche et Filtres**
- `GET /api/searchRecipes?keyword=...` - Recherche par mot-clé
- `GET /api/lowCaloriesRecipes` - Recettes ≤ 700 kcal
- `GET /api/highCaloriesRecipes` - Recettes > 700 kcal

### **Autres**
- `GET /api/ingredients` - Liste des ingrédients
- `POST /api/contacts` - Formulaire de contact

## 🎨 Fonctionnalités Avancées


### **Filtrage et Tri**
- **Filtres actifs** : Badges visuels pour les filtres appliqués
- **Tri multiple** : Par note, date, popularité
- **Pagination** : Navigation fluide entre les pages
- **Recherche temps réel** : Résultats instantanés

## 🔒 Sécurité et Performance

### **Sécurité**
- Variables d'environnement pour les clés API
- Fichier `.env` exclu du versioning Git
- Template `.env.example` pour la configuration
- Validation des entrées utilisateur
- Gestion d'erreurs robuste
- CORS configuré

### **Performance**
- Pagination côté serveur
- Images optimisées et lazy loading
- Tri côté serveur pour les grandes listes
- Cache des requêtes API


Membres de l'équipe :
- Ilyes KABRINE
- Jean-Pierre BEGUERISSE
- Ilyesse HAMCHERIF


---

**Développé avec ❤️ pour les passionnés de cuisine**