const mongoose = require("mongoose");
const { Schema } = mongoose;

const recipePlanSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  recipeId: { type: Schema.Types.ObjectId, ref: "Recipe", required: true },
  date: { type: Date, required: true },
  mealType: { type: String, enum: ["Petit-déjeuner", "Déjeuner", "Dîner", "Snack"] },
  notes: String
});

module.exports = mongoose.model("RecipePlan", recipePlanSchema);