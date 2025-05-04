const Ingredient = require("../models/ingredient.model");
const Recipe = require("../models/recipe.model");

// GET all ingredients
exports.getAllIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find().sort({ name: 1 });

    if (!ingredients || ingredients.length === 0) {
      return res.status(404).json({ message: "Aucun ingrédient trouvable" });
    }

    // On récupère toutes les recettes une seule fois
    const allRecipes = await Recipe.find({}, { _id: 1, title: 1, recipeIngredients: 1 });

    // Pour chaque ingrédient, trouver les recettes qui l'utilisent
    const enrichedIngredients = ingredients.map(ingredient => {
      const usedIn = allRecipes.filter(recipe =>
        recipe.recipeIngredients.some(ri =>
          ri.ingredientId.toString() === ingredient._id.toString()
        )
      );

      const usedInRecipes = usedIn.map(r => ({
        recipeId: r._id,
        recipeTitle: r.title
      }));

      return {
        ...ingredient.toObject(),
        usedInRecipes
      };
    });

    res.status(200).json(enrichedIngredients);

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// GET single ingredient
exports.getIngredientById = async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);
    if (!ingredient) {
      return res.status(404).json({ message: "Ingrédient introuvable" });
    }

    // Rechercher les recettes qui utilisent cet ingrédient
    const recipes = await Recipe.find(
      { 'recipeIngredients.ingredientId': ingredient._id },
      { _id: 1,title:1 } // ne ramène que les ID
    );

    // Injecter dans la réponse
    const ingredientWithUsage = {
      ...ingredient.toObject(),
      usedInRecipes: recipes.map(r => ({
        recipeId: r._id,
        recipeTitle: r.title
      }))
    };

    res.status(200).json(ingredientWithUsage);

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// POST create ingredient
exports.createIngredient = async (req, res) => {
  try {
    const {
      name,
      defaultUnit = 'g',
      units = ['g'],
      unitConversions = { g: 1 },
      nutritionPer100g = { calories: 0, proteins: 0, carbs: 0, fats: 0 },
      nutritionalProperties = [],
    } = req.body;

    // Validation rapide
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ message: "Le nom de l'ingrédient est obligatoire." });
    }

    const newIngredient = new Ingredient({
      name,
      defaultUnit,
      units,
      unitConversions,
      nutritionPer100g,
      nutritionalProperties,
    });

    const saved = await newIngredient.save();
    res.status(201).json(saved);

  } catch (error) {
    res.status(400).json({ message: "Erreur de création", error: error.message });
  }
};


// PUT update ingredient
exports.updateIngredient = async (req, res) => {
  try {
    // 1. Mettre à jour l’ingrédient
    const updated = await Ingredient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Ingrédient introuvable" });

    // 2. Trouver les recettes qui utilisent cet ingrédient
    const recipesToUpdate = await Recipe.find({ 'recipeIngredients.ingredientId': updated._id });

    // 3. Recalculer les macronutriments pour chaque recette concernée
    for (let recipe of recipesToUpdate) {
      let macros = { calories: 0, proteins: 0, carbs: 0, fats: 0 };
      let totalWeight = 0;

      for (let item of recipe.recipeIngredients) {
        const ingredientData = item.ingredientId.equals(updated._id)
          ? updated
          : await Ingredient.findById(item.ingredientId);
        
        if (!ingredientData || !ingredientData.nutritionPer100g) continue;

        const q = item.quantity || 0;
        totalWeight += q;

        const n = ingredientData.nutritionPer100g;

        macros.calories += (n.calories / 100) * q;
        macros.proteins += (n.proteins / 100) * q;
        macros.carbs    += (n.carbs / 100) * q;
        macros.fats     += (n.fats / 100) * q;
      }

      // 4. Calcul des valeurs par portion et pour 100g
      const servings = recipe.servings || 1;
      const totalWeightSafe = totalWeight || 1;

      recipe.nutrition = {
        calories: +macros.calories.toFixed(1),
        proteins: +macros.proteins.toFixed(1),
        carbs: +macros.carbs.toFixed(1),
        fats: +macros.fats.toFixed(1),

        caloriesPerPortion: +(macros.calories / servings).toFixed(1),
        proteinsPerPortion: +(macros.proteins / servings).toFixed(1),
        carbsPerPortion: +(macros.carbs / servings).toFixed(1),
        fatsPerPortion: +(macros.fats / servings).toFixed(1),

        caloriesPer100g: +(macros.calories / totalWeightSafe * 100).toFixed(1),
        proteinsPer100g: +(macros.proteins / totalWeightSafe * 100).toFixed(1),
        carbsPer100g: +(macros.carbs / totalWeightSafe * 100).toFixed(1),
        fatsPer100g: +(macros.fats / totalWeightSafe * 100).toFixed(1),
      };

      // 5. Mettre à jour le poids total aussi
      recipe.totalWeightInGrams = +totalWeight.toFixed(1);
      await recipe.save();
    }

    // 6. Retourner l’ingrédient mis à jour
    res.status(200).json(updated);

  } catch (error) {
    res.status(400).json({ message: "Erreur de mise à jour", error: error.message });
  }
};

// DELETE ingredient
exports.deleteIngredient = async (req, res) => {
  try {
    const ingredientId = req.params.id;

    // 1. Vérifier si l’ingrédient est utilisé dans une recette
    const usedInRecipe = await Recipe.exists({ 'recipeIngredients.ingredientId': ingredientId });

    if (usedInRecipe) {
      return res.status(400).json({
        message: "Suppression impossible : l’ingrédient est utilisé dans au moins une recette.",
      });
    }

    // 2. Supprimer l’ingrédient s’il n’est pas utilisé
    const deleted = await Ingredient.findByIdAndDelete(ingredientId);

    if (!deleted) {
      return res.status(404).json({ message: "Ingrédient introuvable" });
    }

    res.status(200).json({ message: "Ingrédient supprimé" });

  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

