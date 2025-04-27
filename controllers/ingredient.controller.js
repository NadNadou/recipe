const Ingredient = require("../models/ingredient.model");

// GET all ingredients
exports.getAllIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find().sort({ name: 1 });
    res.status(200).json(ingredients);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// GET single ingredient
exports.getIngredientById = async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);
    if (!ingredient) return res.status(404).json({ message: "Ingrédient introuvable" });
    res.status(200).json(ingredient);
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

    console.log({saved})
    res.status(201).json(saved);

  } catch (error) {
    res.status(400).json({ message: "Erreur de création", error: error.message });
  }
};


// PUT update ingredient
exports.updateIngredient = async (req, res) => {
  try {
    const updated = await Ingredient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Ingrédient introuvable" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: "Erreur de mise à jour", error: error.message });
  }
};

// DELETE ingredient
exports.deleteIngredient = async (req, res) => {
  try {
    const deleted = await Ingredient.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Ingrédient introuvable" });
    res.status(200).json({ message: "Ingrédient supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
