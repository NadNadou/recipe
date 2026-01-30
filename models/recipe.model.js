const mongoose = require("mongoose");
const { Schema } = mongoose;

// Sous-schema pour une étape
const stepSchema = new Schema({
  sectionTitle: String,
  order: Number,
  instructions: [String],
}, { _id: false });

// Sous-schema pour un ingrédient
const recipeIngredientSchema = new Schema({
  ingredientId: { type: Schema.Types.ObjectId, ref: "Ingredient", required: true },
  quantity: Number,
  unit: String,
  notes: String,
}, { _id: false });

// Sous-schema pour les infos nutritionnelles
const nutritionSchema = new Schema({
  calories: Number,
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
  fatsPer100g: Number,
}, { _id: false });


const recipeSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: String,
    servings: {
      type: Number,
      default: 2,
    },
    prepTime: Number,
    cookTime: Number,
    restTime: Number,

    steps: [stepSchema],
    recipeIngredients: [recipeIngredientSchema],
    nutrition: nutritionSchema, // 👈 intégré ici

    tagIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    equipmentIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Equipment",
      },
    ],
    linkedRecipeIds: [
      {
        type: Schema.Types.ObjectId,
        ref: "Recipe",
      },
    ],
    image: {
      type: String,
      default: "",
    },
    totalWeightInGrams: Number,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Recipe", recipeSchema);