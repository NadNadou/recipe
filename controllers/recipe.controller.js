const Recipe = require("../models/recipe.model");
const Ingredient = require('../models/ingredient.model');
const Equipment = require('../models/equipment.model');
const Tag = require('../models/tag.model');
const cloudinary = require('cloudinary').v2;


const { calculateTotalWeightInGrams } = require('../utils/recipeUtils');
const { calculateNutritionPerPortionAnd100g,calculateMacrosFromIngredients} = require("../utils/nutritionUtils");


// GET /api/recipes
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .populate("tagIds")
      .populate("equipmentIds")
      .populate("linkedRecipeIds", "title image _id")

    res.status(200).json(recipes);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};

// GET /api/recipes/:id
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate("tagIds")
      .populate("equipmentIds")
      .populate("linkedRecipeIds", "title image _id")
      .populate("recipeIngredients.ingredientId") // pour avoir .name
      .lean();

    if (!recipe) return res.status(404).json({ message: "Recette introuvable" });

    // Facultatif mais utile si tu veux calculer à partir des unités
    const ingredientsData = await Ingredient.find({}).lean();

    // Calcul du poids total
    const totalWeight = calculateTotalWeightInGrams(recipe.recipeIngredients, ingredientsData);

    // Recalcul des valeurs nutritionnelles enrichies
    const nutritionEnriched = calculateNutritionPerPortionAnd100g(
      recipe.nutrition,
      totalWeight,
      recipe.servings
    );

    // Remplacer les ingrédients par leurs noms pour le front
    const enrichedIngredients = recipe.recipeIngredients.map(item => ({
      ingredientId:item.ingredientId._id,
      quantity: item.quantity,
      unit: item.unit,
      name: item.ingredientId?.name || 'Ingrédient inconnu'
    }));

    // Réponse enrichie
    res.status(200).json({
      ...recipe,
      recipeIngredients: enrichedIngredients,
      nutrition: nutritionEnriched,         // 🧠 overwrite ici directement
      totalWeightInGrams: totalWeight
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};



// POST /api/recipes
exports.createRecipe = async (req, res) => {
  try {
    const { title, description, servings, prepTime, cookTime, restTime, steps, tagIds, equipmentIds, recipeIngredients, linkedRecipeIds = [] } = JSON.parse(req.body.data);
    
    // 🔥 Nouveau traitement ici 🔥
    const updatedRecipeIngredients = await Promise.all(
      recipeIngredients.map(async ing => {
        if (ing.ingredientId === 'new' && ing.newName) {
          // Création d'un nouvel ingrédient minimal
          const newIngredient = new Ingredient({
            name: ing.newName,
            defaultUnit: ing.unit || 'g',
            units: [ing.unit || 'g'],
            unitConversions: { [ing.unit || 'g']: 1 },
          });
          const savedIngredient = await newIngredient.save();
          return {
            ingredientId: savedIngredient._id,
            quantity: ing.quantity,
            unit: ing.unit
          };
        } else {
          return ing;
        }
      })
    );

     // 🔥 2. Créer les nouveaux équipements si besoin
     const updatedEquipmentIds = await Promise.all(
      equipmentIds.map(async eq => {
        if (typeof eq === 'object' && eq.newName) {
          const newEquipment = new Equipment({ name: eq.newName });
          const savedEquipment = await newEquipment.save();
          return savedEquipment._id;
        } else {
          return eq;
        }
      })
    );

      // 🔥 3. Créer les nouveaux tags si besoin
      const updatedTagIds = await Promise.all(
      tagIds.map(async tag => {
        if (typeof tag === 'object' && tag.newName) {
          const newTag = new Tag({ label: tag.newName });
          const savedTag = await newTag.save();
          return savedTag._id;
        } else {
          return tag;
        }
      })
    );


    // 🔥 Gestion de l'image
    let imageUrl = '';
    if (req.file && req.file.path) {
      imageUrl = req.file.path;
    }

    const baseMacros = await calculateMacrosFromIngredients(updatedRecipeIngredients);

    const totalWeightInGrams = baseMacros.totalWeightInGrams || 0;
    delete baseMacros.totalWeightInGrams;

    // Calculate full nutrition including per portion and per 100g values
    const nutrition = calculateNutritionPerPortionAnd100g(baseMacros, totalWeightInGrams, servings);

    // ✅ Créer la recette
    const newRecipe = new Recipe({
      title,
      description,
      servings,
      prepTime,
      cookTime,
      restTime,
      steps,
      tagIds: updatedTagIds,
      equipmentIds: updatedEquipmentIds,
      recipeIngredients: updatedRecipeIngredients,
      linkedRecipeIds,
      totalWeightInGrams,
      nutrition,
      image: imageUrl,
    });
    const savedRecipe = await newRecipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: "Erreur de création", error: error.message });
  }
};



// PUT /api/recipes/:id
exports.updateRecipe = async (req, res) => {
  try {
    const recipeId = req.params.id;
    const updatedData = JSON.parse(req.body.data);

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ error: 'Recette non trouvée' });

    // 1️⃣ Si une nouvelle image est uploadée
    if (req.file && req.file.path) {
      if (recipe.image) {
        const publicId = recipe.image.split('/').slice(-1)[0].split('.')[0];
        await cloudinary.uploader.destroy(`recipe_DEV/${publicId}`);
      }
      updatedData.image = req.file.path; // la nouvelle image Cloudinary
    }

    // 2️⃣ Traiter les Tags
    const finalTagIds = [];
    for (const tag of updatedData.tagIds) {
      if (typeof tag === 'string') {
        finalTagIds.push(tag);
      } else if (tag.isNew && tag.label) {
        const newTag = await Tag.create({ label: tag.label });
        finalTagIds.push(newTag._id);
      }
    }
    updatedData.tagIds = finalTagIds;

    // 3️⃣ Traiter les Equipements
    const finalEquipmentIds = [];
    for (const equip of updatedData.equipmentIds) {
      if (typeof equip === 'string') {
        finalEquipmentIds.push(equip);
      } else if (equip.isNew && equip.name) {
        const newEquip = await Equipment.create({ name: equip.name });
        finalEquipmentIds.push(newEquip._id);
      }
    }
    updatedData.equipmentIds = finalEquipmentIds;

    // 4️⃣ Traiter les Ingrédients
    const finalRecipeIngredients = [];
    for (const ing of updatedData.recipeIngredients) {
      if (ing.ingredientId === 'new' && ing.newName) {
        const newIngredient = await Ingredient.create({ name: ing.newName });
        finalRecipeIngredients.push({
          ingredientId: newIngredient._id,
          quantity: ing.quantity,
          unit: ing.unit,
        });
      } else {
        finalRecipeIngredients.push({
          ingredientId: ing.ingredientId,
          quantity: ing.quantity,
          unit: ing.unit,
        });
      }
    }
    updatedData.recipeIngredients = finalRecipeIngredients;

    const baseMacros = await calculateMacrosFromIngredients(updatedData.recipeIngredients);
    const totalWeightInGrams = baseMacros.totalWeightInGrams || 0;
    delete baseMacros.totalWeightInGrams;

    // Calculate full nutrition including per portion and per 100g values
    const nutrition = calculateNutritionPerPortionAnd100g(baseMacros, totalWeightInGrams, updatedData.servings || recipe.servings);
    updatedData.nutrition = nutrition;
    updatedData.totalWeightInGrams = totalWeightInGrams;

    // 5️⃣ Traiter les recettes liées
    if (updatedData.linkedRecipeIds) {
      updatedData.linkedRecipeIds = updatedData.linkedRecipeIds.filter(id => id && typeof id === 'string');
    }

    // 6️⃣ Nettoyer les champs inutiles
    delete updatedData.imageFile;
    delete updatedData.createdAt;
    delete updatedData.updatedAt;
    delete updatedData.__v;

    // 7️⃣ Mettre à jour la recette
    const updatedRecipe = await Recipe.findByIdAndUpdate(recipeId, updatedData, { new: true });

    res.status(200).json(updatedRecipe);
  } catch (err) {
    console.error('Erreur lors de la mise à jour de la recette :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};



// DELETE /api/recipes/:id
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recette introuvable" });

    // 🔥 Supprimer l'image sur Cloudinary si elle existe
    if (recipe.image) {
      const publicId = recipe.image.split('/').slice(-1)[0].split('.')[0];
      try {
        await cloudinary.uploader.destroy(`${process.env.CLOUDINARY_FOLDER}/${publicId}`);
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'image Cloudinary :', error.message);
        // Ne pas throw, on continue la suppression de la recette
      }
    }

    // ✅ Supprimer la recette dans MongoDB
    await Recipe.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Recette et image supprimées" });
  } catch (err) {
    console.error('Erreur lors de la suppression de la recette :', err);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};


// DUPLICATE
exports.duplicateRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. On récupère la recette d’origine
    const original = await Recipe.findById(id).lean();
    if (!original) return res.status(404).json({ message: 'Recette non trouvée.' });

    // 2. On retire les propriétés spécifiques à Mongo et on modifie un peu le titre
    const {
      _id,
      createdAt,
      updatedAt,
      ...rest
    } = original;

    const newRecipe = new Recipe({
      ...rest,
      title: `${original.title} (copie)`,
    });

    // 3. On enregistre la nouvelle recette
    const saved = await newRecipe.save();
    res.status(201).json(saved);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la duplication.' });
  }
};


// PUT /api/recipes/bulk-update-appliances
exports.bulkUpdateAppliances = async (req, res) => {
  try {
    const { recipeIds, appliances, mode = 'add' } = req.body;

    if (!recipeIds || !Array.isArray(recipeIds) || recipeIds.length === 0) {
      return res.status(400).json({ message: "recipeIds is required (non-empty array)" });
    }
    if (!appliances || !Array.isArray(appliances)) {
      return res.status(400).json({ message: "appliances is required (array)" });
    }

    let result;
    if (mode === 'replace') {
      result = await Recipe.updateMany(
        { _id: { $in: recipeIds } },
        { $set: { cookingAppliances: appliances } }
      );
    } else {
      // 'add' mode: add appliances without duplicates
      result = await Recipe.updateMany(
        { _id: { $in: recipeIds } },
        { $addToSet: { cookingAppliances: { $each: appliances } } }
      );
    }

    res.status(200).json({
      message: `${result.modifiedCount} recipe(s) updated`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST /api/recipes/recalculate-nutrition
// Recalculate nutrition for all existing recipes
exports.recalculateAllNutrition = async (req, res) => {
  try {
    const recipes = await Recipe.find({});
    let updated = 0;

    for (const recipe of recipes) {
      const baseMacros = await calculateMacrosFromIngredients(recipe.recipeIngredients);
      const totalWeightInGrams = baseMacros.totalWeightInGrams || 0;
      delete baseMacros.totalWeightInGrams;

      const nutrition = calculateNutritionPerPortionAnd100g(baseMacros, totalWeightInGrams, recipe.servings || 1);

      await Recipe.findByIdAndUpdate(recipe._id, {
        nutrition,
        totalWeightInGrams
      });

      updated++;
    }

    res.status(200).json({ message: `Nutrition recalculated for ${updated} recipes` });
  } catch (err) {
    console.error('Error recalculating nutrition:', err);
    res.status(500).json({ message: 'Error recalculating nutrition', error: err.message });
  }
};

