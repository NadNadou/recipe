
const Ingredient = require('../models/ingredient.model');

const convertToGrams = (quantity, unit) => {
  if (unit === 'g') return quantity;
  if (unit === 'kg') return quantity * 1000;
  if (unit === 'mg') return quantity / 1000;
  if (unit === 'l') return quantity * 1000; // approximation pour l’eau
  if (unit === 'ml') return quantity;       // 1ml ≈ 1g pour eau et liquides simples
  return null;
};

const calculateMacrosFromIngredients = async (recipeIngredients) => {
  let totalCalories = 0;
  let totalProteins = 0;
  let totalCarbs = 0;
  let totalFats = 0;

  for (const ing of recipeIngredients) {
    if (!ing.ingredientId) continue;

    const ingredient = await Ingredient.findById(ing.ingredientId).lean();
    if (!ingredient || !ingredient.nutritionPer100g) continue;

    const { calories, proteins, carbs, fats } = ingredient.nutritionPer100g;
    const grams = convertToGrams(ing.quantity, ing.unit);

    if (!grams) continue;

    const factor = grams / 100;

    totalCalories += calories * factor;
    totalProteins += proteins * factor;
    totalCarbs += carbs * factor;
    totalFats += fats * factor;
  }

  return {
    calories: Math.round(totalCalories),
    proteins: parseFloat(totalProteins.toFixed(1)),
    carbs: parseFloat(totalCarbs.toFixed(1)),
    fats: parseFloat(totalFats.toFixed(1))
  };
};

function calculateNutritionPerPortionAnd100g(nutritionBase, totalWeight, servings) {
  if (!nutritionBase || totalWeight === 0 || servings === 0) {
    return {
      calories: 0, proteins: 0, carbs: 0, fats: 0,
      caloriesPerPortion: 0, proteinsPerPortion: 0, carbsPerPortion: 0, fatsPerPortion: 0,
      caloriesPer100g: 0, proteinsPer100g: 0, carbsPer100g: 0, fatsPer100g: 0
    };
  }

  const round = (num) => Math.round(num * 10) / 10;

  const {
    calories = 0,
    proteins = 0,
    carbs = 0,
    fats = 0
  } = nutritionBase;

  return {
    calories,
    proteins,
    carbs,
    fats,

    caloriesPerPortion: round(calories / servings),
    proteinsPerPortion: round(proteins / servings),
    carbsPerPortion: round(carbs / servings),
    fatsPerPortion: round(fats / servings),

    caloriesPer100g: round((calories / totalWeight) * 100),
    proteinsPer100g: round((proteins / totalWeight) * 100),
    carbsPer100g: round((carbs / totalWeight) * 100),
    fatsPer100g: round((fats / totalWeight) * 100)
  };
}

  
  module.exports = { calculateNutritionPerPortionAnd100g,calculateMacrosFromIngredients };
  