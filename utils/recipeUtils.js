/**
 * Calcule le poids total en grammes d'une liste d'ingrédients
 * @param {Array} recipeIngredients - Liste des ingrédients d'une recette
 * @param {Array} ingredientsData - Liste complète des ingrédients avec conversions
 * @returns {Number} poids total
 */


function calculateTotalWeightInGrams(recipeIngredients, ingredientsData) {
    return recipeIngredients.reduce((sum, ing) => {
      const ingredient = ingredientsData.find(i =>
        i._id.toString() === (ing.ingredientId?._id?.toString())
      );
      if (!ingredient) return sum;
  
      const conversions = ingredient.unitConversions || {};
      const multiplier = conversions.get
        ? conversions.get(ing.unit)
        : conversions[ing.unit];
  
      return sum + (ing.quantity * (multiplier || 1));
    }, 0);
  }  
  
  module.exports = { calculateTotalWeightInGrams };
  