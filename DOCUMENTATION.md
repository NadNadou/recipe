# Recipe & Meal Planning App - Documentation

## Table of Contents

1. [Architecture Technique](#1-architecture-technique)
2. [Gestion des Recettes](#2-gestion-des-recettes)
3. [Gestion des Ingredients](#3-gestion-des-ingrédients)
4. [Systeme Nutritionnel](#4-système-nutritionnel)
5. [Planification des Repas](#5-planification-des-repas)
6. [Batch Cooking](#6-batch-cooking)
7. [Dashboard](#7-dashboard)
8. [Cooking Session Planner](#8-cooking-session-planner)
9. [Authentification](#9-authentification)
10. [Modeles de Donnees](#10-modèles-de-données)
11. [API Endpoints](#11-api-endpoints)
12. [Variables d'Environnement](#12-variables-denvironnement)

---

## 1. Architecture Technique

### Stack Backend

| Composant | Technologie | Version |
|-----------|-------------|---------|
| Runtime | Node.js | 22.x |
| Framework | Express | 5.1 |
| Base de donnees | MongoDB (Mongoose) | 8.13 |
| Authentification | JWT (jsonwebtoken) | 7d expiry |
| Hashage | bcryptjs | 10 rounds |
| Images | Cloudinary (multer-storage-cloudinary) | Auto-resize 800x800 |
| Logs | Morgan | dev mode |

### Stack Frontend

| Composant | Technologie | Version |
|-----------|-------------|---------|
| Framework | React | 18.2 |
| Build | Vite | 5.x |
| State | Redux + Redux Toolkit + Thunk | - |
| Router | React Router DOM | 5.3 (HashRouter) |
| UI | React-Bootstrap | 2.10 (Bootstrap 5.3) |
| Calendrier | FullCalendar | 6.1 |
| Graphiques | ApexCharts (react-apexcharts) | - |
| HTTP | Axios | - |
| Icones | Tabler Icons, React Feather | - |

### Structure des Fichiers

```
recipe/
  server.js                 # Point d'entree serveur
  app.js                    # Configuration Express, middleware, routes
  config/
    db.js                   # Connexion MongoDB (dev/prod)
    cloudinary.js           # Configuration Cloudinary
  middlewares/
    auth.js                 # Verification JWT
    uploadCloudinary.js     # Upload images (multer + Cloudinary)
  models/
    recipe.model.js
    ingredient.model.js
    recipePlan.model.js     # RecipePlan + BatchSession
    user.model.js
    tag.model.js
    equipment.model.js
  controllers/
    recipe.controller.js
    ingredient.controller.js
    recipePlan.controller.js
    stats.controller.js
    user.controller.js
    tag.controller.js
    equipment.controller.js
  routes/
    recipe.routes.js
    ingredient.routes.js
    plan.routes.js
    stats.routes.js
    user.routes.js
    tag.routes.js
    equipment.routes.js
  utils/
    nutritionUtils.js       # Calcul macros depuis ingredients
    recipeUtils.js          # Calcul poids total
    openFoodFactsService.js # Recherche nutrition (USDA + OpenFoodFacts)
  client/
    src/
      api/                  # Modules Axios (auth, recipes, ingredients, plan, stats, tags, equipments)
      redux/
        constants/          # Action type constants
        action/             # Thunk actions
        reducer/            # Reducers (Recipe, MetaData, Plans, Stats, User)
        store/              # Store configuration
      views/
        Dashboard/          # Dashboard + widgets
        Recipe/             # CRUD recettes
        Ingredients/        # CRUD ingredients
        Calendar/           # Calendrier FullCalendar
        MealPlanner/        # Planificateur 4 semaines
        CookingSession/     # Planificateur sessions de cuisine
        Authentication/     # Login, Signup
      layout/               # Header, Navbar, Footer
      routes/               # RouteList.jsx
```

---

## 2. Gestion des Recettes

### Fonctionnalites

- **Liste** : Grille de cartes avec image, titre, description, tags, temps total
- **Creation** : Formulaire complet dans une modale
- **Edition** : Meme formulaire en modale, pre-rempli
- **Suppression** : Avec confirmation (SweetAlert)
- **Duplication** : Cree une copie avec "(copie)" dans le titre
- **Detail** : Page dediee avec sidebar, header, body

### Champs d'une Recette

| Champ | Description |
|-------|-------------|
| `title` | Nom de la recette (obligatoire) |
| `description` | Description libre |
| `servings` | Nombre de portions (defaut: 2) |
| `prepTime` | Temps de preparation en minutes |
| `cookTime` | Temps de cuisson en minutes |
| `restTime` | Temps de repos en minutes |
| `image` | Photo (upload Cloudinary, max 800x800) |
| `recipeIngredients` | Liste d'ingredients avec quantite, unite, notes |
| `steps` | Etapes groupees par sections avec instructions ordonnees |
| `tagIds` | Tags associes (Vegetarian, Keto, Quick to prepare...) |
| `equipmentIds` | Equipements necessaires (Casserole, Four, Mixeur...) |
| `cookingAppliances` | Appareils de cuisson : oven, stovetop, airfryer, steamer, no-heat, robot |
| `linkedRecipeIds` | Recettes liees (ex: sauce d'accompagnement) |
| `isBatchCookingDefault` | Si true, recette deja optimisee pour le batch cooking |
| `minBatchMultiplier` | Multiplicateur minimum en batch cooking (2 a 10) |
| `nutrition` | Macros calculees automatiquement (total, par portion, pour 100g) |

### Creation inline d'entites

Lors de la creation/edition d'une recette, on peut creer a la volee :
- **Nouveaux ingredients** : Selectionner "+ Ajouter" dans le dropdown, saisir un nom
- **Nouveaux equipements** : Idem
- **Nouveaux tags** : Idem

Ces entites sont creees en base au moment de la sauvegarde de la recette.

---

## 3. Gestion des Ingredients

### Fonctionnalites

- **Liste** : Grille de cartes avec nom, proprietes nutritionnelles (badges), macros par 100g
- **Creation/Edition** : Nom, unite par defaut, conversions d'unites, macros par 100g, proprietes nutritionnelles
- **Suppression** : Bloquee si l'ingredient est utilise dans au moins une recette
- **Enrichissement OpenFoodFacts** : Recherche automatique des donnees nutritionnelles
- **Enrichissement en lot** : Enrichit automatiquement TOUS les ingredients sans donnees nutritionnelles

### Champs d'un Ingredient

| Champ | Description |
|-------|-------------|
| `name` | Nom (unique) |
| `defaultUnit` | Unite par defaut (g, ml, piece...) |
| `units` | Unites disponibles |
| `unitConversions` | Table de conversion (ex: { g: 1, kg: 1000 }) |
| `nutritionPer100g` | Calories, proteines, glucides, lipides pour 100g |
| `nutritionalProperties` | Proprietes (Riche en proteines, Source de fibres...) |

### Recherche nutritionnelle (USDA + OpenFoodFacts)

L'app utilise deux sources de donnees nutritionnelles, interrogees en parallele :

| Source | Priorite | API | Forces |
|--------|----------|-----|--------|
| USDA FoodData Central | Primaire | `api.nal.usda.gov/fdc/v1/foods/search` | Ingredients bruts/generiques (Foundation + SR Legacy) |
| OpenFoodFacts | Fallback | `search.openfoodfacts.org/search` | Termes francais, produits conditionnes |

**Algorithme de scoring** (`nameMatchScore`) :
- Match exact = 100 pts, commence par le terme = 80 pts, contient les mots = 70 pts
- Bonus : +20 "raw"/"cru", +10 "fresh"/"frais", +5 "whole"/"boneless"/"skinless"
- Penalite : -25 pour termes transformes (dehydrated, breaded, crackers, chocolate, etc.)
- Penalite de longueur : noms courts = plus generiques = preferes

**Recherche multi-resultats (selection utilisateur)** :
- Le bouton "Rechercher" dans la modale d'edition affiche les **5 meilleurs resultats** des deux sources combinees
- Chaque resultat affiche : nom, macros (kcal, P, G, L), badge source (USDA bleu / OFF vert)
- L'utilisateur clique sur le bon resultat pour remplir les champs nutrition
- Les deux APIs sont appelees en parallele (`Promise.all`) pour un temps de reponse optimal

**Enrichissement en lot** :
- Depuis le header de la page ingredients, lance l'enrichissement de tous les ingredients sans macros
- Utilise le mode "meilleur resultat automatique" (USDA d'abord, OFF en fallback)
- Delai de 700ms entre chaque appel (rate limiting). Modale de progression en temps reel

**Cascade** : Toute modification des macros d'un ingredient declenche le recalcul nutritionnel de toutes les recettes utilisant cet ingredient.

---

## 4. Systeme Nutritionnel

### Chaine de calcul

```
Ingredient (nutritionPer100g)
  |
  v
Recipe: calcul automatique lors de la creation/maj
  |
  v  calculateMacrosFromIngredients()
  |  Pour chaque ingredient: (nutritionPer100g / 100) * quantite_en_grammes
  |  Somme de toutes les contributions
  v
  nutrition.calories, proteins, carbs, fats  (total de la recette)
  |
  v  calculateNutritionPerPortionAnd100g()
  |
  +-> caloriesPerPortion = total / servings
  +-> caloriesPer100g   = total / totalWeight * 100
```

### Valeurs calculees

| Champ | Formule |
|-------|---------|
| `calories` | Somme totale de la recette |
| `caloriesPerPortion` | total / nombre de portions |
| `caloriesPer100g` | total / poids total * 100 |
| (idem pour proteins, carbs, fats) | |

### Declencheurs de recalcul

1. Creation d'une recette
2. Mise a jour d'une recette (ajout/suppression d'ingredients, changement de quantites)
3. Mise a jour d'un ingredient (cascade vers toutes les recettes l'utilisant)
4. Enrichissement OpenFoodFacts d'un ingredient
5. Endpoint `POST /api/recipes/recalculate-nutrition` (recalcul global)

---

## 5. Planification des Repas

### Types de repas

| Type | Code | Couleur | Heure par defaut |
|------|------|---------|-----------------|
| Breakfast | BRK | Orange #FFA726 | 08:00 |
| Lunch | LUN | Vert #66BB6A | 12:00 |
| Dinner | DIN | Bleu #42A5F5 | 19:30 |
| Lunchbox | LBX | Violet #AB47BC | 12:00 |
| Babyfood | BBF | Rose #EC407A | 12:00 |

### Calendrier (page `/apps/calendar`)

- Vue mois/semaine/jour/liste via FullCalendar
- Evenements colores par type de repas
- **Drag & Drop** pour deplacer un repas a une autre date
- **Click** sur un evenement : tiroir lateral avec details (recette, calories, macros, temps de preparation)
- **Edition** depuis le tiroir : changer le type de repas, la date, les notes
- **Suppression** avec confirmation SweetAlert
- **Creation** via bouton sidebar : selection recette, type de repas, portions, date, notes

### Planificateur 4 semaines (page `/apps/meal-planner`)

- Vue tableur : lignes = types de repas, colonnes = jours
- Navigation semaine par semaine (precedent/suivant/aujourd'hui)
- **Click sur une cellule** : ajouter un repas via modale
- **Click sur un repas existant** : editer (type, date, notes)
- **Supprimer** directement depuis la cellule
- **Integration Batch Cooking** : toggle "Use from Batch Cooking" dans la modale d'ajout
- Calories par cellule et total journalier (couleur : vert < 2000, orange 2000-2500, rouge > 2500)
- Jours passes grises et non-cliquables
- Section separee listant tous les repas issus du batch cooking

---

## 6. Batch Cooking

### Concept

Le systeme de batch cooking permet de :
1. Preparer une recette en grande quantite (multiplier les portions)
2. Stocker les portions dans une "pile" (BatchSession)
3. Assigner les portions a des repas planifies au fur et a mesure
4. Suivre les portions restantes

### Workflow

```
1. Creer une session batch
   - Choisir une recette
   - Choisir le multiplicateur (x2, x3, x4)
   - Definir la date de preparation
   -> totalPortions = recette.servings * multiplicateur
   -> remainingPortions = totalPortions

2. Assigner des portions
   - Depuis BatchPile ou TwoWeekPlanner
   - Choisir la date et le type de repas
   -> Cree un RecipePlan avec batchSessionId
   -> remainingPortions -= 1

3. Supprimer un repas issu du batch
   -> remainingPortions += 1 (portion restituee)

4. Consommer une portion manuellement
   -> remainingPortions -= 1 (mange sans planification)
```

### Logique du multiplicateur

- Si `recipe.isBatchCookingDefault = true` : la recette est deja optimisee, le multiplicateur s'applique tel quel
- Si `recipe.isBatchCookingDefault = false` : `effectiveMultiplier = max(multiplicateur, recipe.minBatchMultiplier)`

### Impact sur la liste de courses

La grocery list prend en compte :
- **Repas normaux** : ingredients multiplies par `plan.servings / recipe.servings`
- **Sessions batch** : ingredients multiplies par `batchSession.quantityMultiplier`

---

## 7. Dashboard

### Layout

```
+-----------------------------------+------------+
|                                   |            |
|    Weekly Recipe Planner          | Batch      |
|    (FullCalendar 4 semaines)      | Cooking    |
|    + filtres + stats footer       | Pile       |
|                                   |            |
+---------------------------+-------+------------+
|                           |                    |
|  Weekly Calories Chart    |  Grocery List      |
|  (ApexCharts stacked bar) |  (par semaine,     |
|  + KPI row                |   checkable)       |
|                           |                    |
+---------------------------+--------------------+
```

### Weekly Recipe Planner (9 colonnes)

- Calendrier FullCalendar en vue "4 semaines"
- Filtres : All, Meals, Lunchbox, Babyfood, Batch
- Footer avec statistiques : nombre de recettes planifiees, repas bebe, repas batch, temps de cuisson moyen

### Batch Cooking Pile (3 colonnes)

- Liste des sessions batch actives (portions restantes > 0)
- Pour chaque session : titre, date de preparation, multiplicateur, compteur portions
- Boutons rapides par type de repas pour assigner une portion
- Bouton "-" pour consommer une portion manuellement
- Creation de nouvelle session (modale)
- Suppression avec confirmation

### Weekly Calories Chart (8 colonnes)

- Graphique en barres empilees (ApexCharts)
- 7 jours (semaine courante)
- Couleurs par type de repas (Babyfood exclu)
- Ligne objectif a 1800 kcal
- KPI : calories moyennes journalieres, moyenne par type de repas

### Grocery List (4 colonnes)

- Navigation par semaine (semaine en cours, +1, +2, +3)
- Liste d'ingredients aggreges depuis les repas planifies + sessions batch
- Regroupement intelligent des unites :
  - Poids : g/kg (consolide)
  - Volume : ml/L (consolide)
  - Comptage : pieces normalisees
- Checkboxes avec persistance localStorage
- Barre de progression
- Separation items coches/non-coches

---

## 8. Cooking Session Planner

### Concept

Outil d'organisation pour planifier une session de cuisine :
1. Selectionner les recettes a realiser
2. L'app identifie les appareils de cuisson necessaires
3. L'app montre quelles recettes peuvent etre realisees en parallele
4. Timeline visuelle montrant les pistes paralleles

### Appareils de cuisson

| Valeur | Label | Icone | Couleur |
|--------|-------|-------|---------|
| `oven` | Oven | `r` | #FF6B6B |
| `stovetop` | Stovetop | `n` | #4ECDC4 |
| `airfryer` | Air Fryer | `z` | #45B7D1 |
| `steamer` | Steamer | `o` | #A8E6CF |
| `no-heat` | No Cooking | `q` | #96CEB4 |
| `robot` | Blender/Processor | `p` | #FFB347 |

### Algorithme de timeline

```
Regles :
- 1 appareil = 1 piste (track) dans la timeline
- Recettes sur le MEME appareil -> sequentielles (l'une apres l'autre)
- Recettes sur des appareils DIFFERENTS -> paralleles
- Recette multi-appareils -> bloque TOUS les appareils simultanement
- Temps total = max des temps de toutes les pistes

Exemple :
  Recette A : Four, 45min
  Recette B : Plaque, 30min
  Recette C : Four, 30min

  Four    : [====A (45min)====][===C (30min)===]  = 75min
  Plaque  : [===B (30min)===]                     = 30min

  Temps total = 75min (au lieu de 105min en sequentiel)
  Gain = 30min
```

### Interface

- **Panneau gauche** : Liste de recettes avec recherche, checkboxes, badges d'appareils
- **Stats** : Temps total parallele, temps economise, nombre d'appareils
- **Groupement** : Recettes regroupees par appareil avec couleurs
- **Timeline** : Barres horizontales colorees proportionnelles au temps, tooltips au survol

---

## 9. Authentification

- **Inscription** : nom, email, mot de passe -> hashage bcrypt (10 rounds) -> creation User
- **Connexion** : email, mot de passe -> verification bcrypt -> generation JWT (7 jours)
- **Token** : stocke dans `localStorage`, envoye via header `Authorization: Bearer <token>`
- **Middleware auth** : decode le JWT, attache `req.user._id` et `req.user.email`
- **Routes protegees** : Toutes les routes sauf login/register

---

## 10. Modeles de Donnees

### Schema Relationnel

```
User ──────────┐
               |
     ┌─────────┼──────────────────────┐
     |         |                      |
     v         v                      v
  Recipe    RecipePlan           BatchSession
     |         |                      |
     |    batchSessionId ────────────>|
     |         |
     +--- recipeIngredients[] ──> Ingredient
     +--- tagIds[] ─────────────> Tag
     +--- equipmentIds[] ───────> Equipment
     +--- linkedRecipeIds[] ────> Recipe (self)
```

### Recipe

```javascript
{
  title: String,              // Obligatoire
  description: String,
  servings: Number,           // Defaut: 2
  prepTime: Number,           // Minutes
  cookTime: Number,           // Minutes
  restTime: Number,           // Minutes
  image: String,              // URL Cloudinary
  steps: [{
    sectionTitle: String,
    order: Number,
    instructions: [String]
  }],
  recipeIngredients: [{
    ingredientId: ObjectId,   // -> Ingredient
    quantity: Number,
    unit: String,
    notes: String
  }],
  nutrition: {
    calories: Number,         // Total
    proteins: Number,
    carbs: Number,
    fats: Number,
    caloriesPerPortion: Number,
    proteinsPerPortion: Number,
    carbsPerPortion: Number,
    fatsPerPortion: Number,
    caloriesPer100g: Number,
    proteinsPer100g: Number,
    carbsPer100g: Number,
    fatsPer100g: Number
  },
  tagIds: [ObjectId],         // -> Tag
  equipmentIds: [ObjectId],   // -> Equipment
  cookingAppliances: [String],// Enum: oven, stovetop, airfryer, steamer, no-heat, robot
  linkedRecipeIds: [ObjectId],// -> Recipe
  totalWeightInGrams: Number,
  isBatchCookingDefault: Boolean,
  minBatchMultiplier: Number  // 2-10
}
```

### Ingredient

```javascript
{
  name: String,               // Unique
  defaultUnit: String,        // Defaut: 'g'
  units: [String],
  unitConversions: Map,       // { g: 1, kg: 1000, ... }
  nutritionPer100g: {
    calories: Number,
    proteins: Number,
    carbs: Number,
    fats: Number
  },
  nutritionalProperties: [String]
}
```

### RecipePlan

```javascript
{
  userId: ObjectId,           // -> User
  recipeId: ObjectId,         // -> Recipe
  date: Date,
  mealType: String,           // Enum: Breakfast, Lunch, Dinner, Lunchbox, Babyfood
  servings: Number,           // Defaut: 1
  notes: String,
  isBatchCooked: Boolean,     // Defaut: false
  batchSessionId: ObjectId    // -> BatchSession (null si pas batch)
}
```

### BatchSession

```javascript
{
  userId: ObjectId,           // -> User
  recipeId: ObjectId,         // -> Recipe
  preparedDate: Date,
  quantityMultiplier: Number, // 1-10, defaut: 2
  totalPortions: Number,      // recipe.servings * multiplier
  remainingPortions: Number,  // Decremente a chaque assignation
  notes: String,
  timestamps: true
}
```

---

## 11. API Endpoints

### Authentification

| Methode | Route | Auth | Description |
|---------|-------|------|-------------|
| POST | `/api/users/register` | Non | Inscription (name, email, password) |
| POST | `/api/users/login` | Non | Connexion -> JWT token |

### Recettes

| Methode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/recipes` | Oui | Liste toutes les recettes (avec tags, equipements, recettes liees) |
| GET | `/api/recipes/:id` | Oui | Detail d'une recette (nutrition enrichie, noms d'ingredients) |
| POST | `/api/recipes` | Oui | Creer (multipart/form-data pour image). Auto-cree ingredients/equipements/tags inline |
| PUT | `/api/recipes/:id` | Oui | Mettre a jour (remplacement image si nouvelle). Recalcule la nutrition |
| DELETE | `/api/recipes/:id` | Oui | Supprimer (+ suppression image Cloudinary) |
| POST | `/api/recipes/:id/duplicate` | Oui | Dupliquer une recette |
| POST | `/api/recipes/recalculate-nutrition` | Oui | Recalculer la nutrition de toutes les recettes |

### Ingredients

| Methode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/ingredients` | Oui | Liste (triee par nom, avec `usedInRecipes[]`) |
| GET | `/api/ingredients/:id` | Oui | Detail avec `usedInRecipes[]` |
| POST | `/api/ingredients` | Oui | Creer |
| PUT | `/api/ingredients/:id` | Oui | Mettre a jour (cascade: recalcul nutrition des recettes liees) |
| DELETE | `/api/ingredients/:id` | Oui | Supprimer (refuse si utilise dans une recette) |
| POST | `/api/ingredients/:id/enrich` | Oui | Enrichir depuis OpenFoodFacts |
| POST | `/api/ingredients/enrich-all` | Oui | Enrichir en lot tous les ingredients sans macros |
| POST | `/api/ingredients/search-nutrition` | Oui | Rechercher nutrition - meilleur resultat unique (preview) |
| POST | `/api/ingredients/search-nutrition-multiple` | Oui | Rechercher nutrition - top 5 resultats USDA+OFF (selection UI) |

### Plans et Batch Sessions

| Methode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/plans` | Oui | Tous les plans de l'utilisateur |
| POST | `/api/plans` | Oui | Creer un plan (decremente batch si `batchSessionId`) |
| PUT | `/api/plans/:id` | Oui | Mettre a jour |
| DELETE | `/api/plans/:id` | Oui | Supprimer (restitue la portion batch si applicable) |
| GET | `/api/plans/batch` | Oui | Sessions batch avec portions restantes > 0 |
| GET | `/api/plans/batch/all` | Oui | Toutes les sessions batch |
| POST | `/api/plans/batch` | Oui | Creer une session batch |
| PUT | `/api/plans/batch/:id` | Oui | Mettre a jour une session |
| DELETE | `/api/plans/batch/:id` | Oui | Supprimer une session (plans gardes) |
| POST | `/api/plans/batch/:id/consume` | Oui | Consommer 1 portion manuellement |

### Statistiques

| Methode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET | `/api/stats/weekly-calories` | Oui | Calories des 7 derniers jours par type de repas |
| GET | `/api/stats/weekly-ingredients` | Oui | Ingredients par jour (semaine ISO courante) |
| GET | `/api/stats/grocery-list?startDate=&endDate=` | Oui | Liste de courses agregee (repas + batch) |

### Tags et Equipements

| Methode | Route | Auth | Description |
|---------|-------|------|-------------|
| GET/POST/PUT/DELETE | `/api/tags` | Oui | CRUD complet |
| GET/POST/PUT/DELETE | `/api/equipments` | Oui | CRUD complet |

---

## 12. Variables d'Environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `PORT` | Port du serveur | `5001` |
| `NODE_ENV` | Environnement | `development` ou `production` |
| `MONGO_URI_DEV` | URI MongoDB (dev) | `mongodb://localhost:27017/recipe` |
| `MONGO_URI_PROD` | URI MongoDB (prod) | `mongodb+srv://...` |
| `JWT_SECRET` | Cle secrete JWT | `my-secret-key` |
| `CLOUDINARY_CLOUD_NAME` | Nom du cloud Cloudinary | `my-cloud` |
| `CLOUDINARY_API_KEY` | Cle API Cloudinary | `123456789` |
| `CLOUDINARY_API_SECRET` | Secret API Cloudinary | `abc...xyz` |
| `CLOUDINARY_FOLDER` | Dossier Cloudinary | `recipe_DEV` |
| `USDA_API_KEY` | Cle API USDA FoodData Central (gratuite) | `xxxxxxxx` |
| `VITE_API_URL` | URL API pour le frontend | `http://localhost:5001/api` |
