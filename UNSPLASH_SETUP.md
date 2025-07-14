# 🖼️ Configuration Unsplash pour les Images de Recettes

## 🎯 Pourquoi Unsplash ?

- **Qualité supérieure** : Images culinaires de haute qualité
- **Pertinence** : Meilleure détection des plats
- **Gratuit** : 5000 requêtes/mois gratuites
- **Fiabilité** : Moins d'images non pertinentes que Pexels

## 🔧 Configuration

### Étape 1 : Créer un Compte Unsplash

1. Aller sur [unsplash.com/developers](https://unsplash.com/developers)
2. Cliquer sur "Register as a developer"
3. Créer un compte ou se connecter

### Étape 2 : Créer une Application

1. Dans le dashboard, cliquer sur "New Application"
2. Remplir les informations :
   - **Application name** : "Recette App" (ou votre nom)
   - **Description** : "Application de recettes culinaires"
   - **What are you building?** : "Web application"
   - **Will your app be commercial?** : "No" (pour usage personnel)

### Étape 3 : Obtenir la Clé API

1. Une fois l'application créée, copier la **Access Key**
2. Elle ressemble à : `abc123def456ghi789...`

### Étape 4 : Configuration du Fichier .env

Créer ou modifier le fichier `.env` dans `projet-recette-airtable/` :

```env
# API Unsplash
UNSPLASH_ACCESS_KEY=votre_clé_unsplash_ici

# Autres APIs (si nécessaire)
OPENAI_API_KEY=votre_clé_openai
AIRTABLE_BASE_ID=votre_base_id
AIRTABLE_TOKEN=votre_token
```

## 🚀 Fonctionnement

### Améliorations Implémentées

1. **Détection Intelligente** :
   - Desserts → "dessert food"
   - Soupes → "soup food"
   - Salades → "salad food"
   - Pâtes → "pasta food"

2. **Recherche Optimisée** :
   - Ajout automatique de mots-clés culinaires
   - Nettoyage des caractères spéciaux
   - Orientation paysage pour un meilleur affichage

3. **Fallback Intelligent** :
   - Si pas de résultat spécifique → recherche "food dish"
   - Logs détaillés pour le debugging

## 📝 Exemples de Logs

```
Recherche Unsplash pour: "gateau chocolat dessert food"
Image Unsplash trouvée: Delicious chocolate cake with berries
```

## 🧪 Test

### Pour tester la configuration :

1. **Redémarrer l'application** :
   ```bash
   docker-compose down
   docker-compose up
   ```

2. **Générer une recette** avec des mots-clés spécifiques :
   - "Gâteau au chocolat" → devrait chercher "gateau chocolat dessert food"
   - "Soupe à l'oignon" → devrait chercher "soupe oignon soup food"

3. **Vérifier les logs** du backend pour voir les requêtes

## ❗ Dépannage

### Erreur "Access Key"
- Vérifier que `UNSPLASH_ACCESS_KEY` est correct
- S'assurer que l'application Unsplash est active

### Erreur "Rate Limit"
- Vérifier les limites d'utilisation (5000/mois)
- Attendre la réinitialisation mensuelle

### Aucune Image
- Vérifier les logs pour identifier l'erreur
- Tester avec une recherche simple : "food dish"

## 📊 Comparaison avec Pexels

| Critère | Unsplash | Pexels |
|---------|----------|--------|
| **Qualité Images** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Images Culinaires** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Pertinence** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Limite Gratuite** | 5000/mois | 200/h |
| **Fiabilité** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

## 🎯 Avantages d'Unsplash

- **Images plus pertinentes** pour les recettes
- **Moins d'images non culinaires** (pas de voitures pour "poulet rôti")
- **Qualité professionnelle** des photos
- **Meilleure API** avec plus d'options 