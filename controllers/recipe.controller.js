const Recipe = require("../models/recipe.model");
const Ingredient = require('../models/ingredient.model');
const Equipment = require('../models/equipment.model');
const Tag = require('../models/tag.model');

const { calculateTotalWeightInGrams } = require('../utils/recipeUtils');
const { calculateNutritionPerPortionAnd100g } = require("../utils/nutritionUtils");


// GET /api/recipes
exports.getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find()
      .populate("tagIds")
      .populate("equipmentIds")

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
    const { title, description, servings, prepTime, cookTime, restTime, steps, tagIds, equipmentIds, recipeIngredients, nutrition } = JSON.parse(req.body.data);
    
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
      imageUrl = req.file.path; // 👈 Cloudinary renvoie `path`
    }

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
    const updatedData = JSON.parse(req.body.data); // les autres infos

    // Si une image a été uploadée, on met à jour le champ
    if (req.file && req.file.path) {
      updatedData.image = req.file.path; // Lien direct vers Cloudinary
    }

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
    const deleted = await Recipe.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Recette introuvable" });

    res.status(200).json({ message: "Recette supprimée" });
  } catch (err) {
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

