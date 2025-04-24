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

  
  module.exports = { calculateNutritionPerPortionAnd100g };
  