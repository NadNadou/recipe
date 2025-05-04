const mongoose = require("mongoose");
const { Schema } = mongoose;

const recipePlanSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  recipeId: { type: Schema.Types.ObjectId, ref: "Recipe", required: true },
  date: { type: Date, required: true },
  mealType: { type: String },
  servings: { type: Number, default: 1 },
  notes: String,
  parentPlanId: { type: Schema.Types.ObjectId, ref: 'RecipePlan', default: null },
});

module.exports = mongoose.model("RecipePlan", recipePlanSchema);