const mongoose = require("mongoose");
const { Schema } = mongoose;

// Schema for batch cooking sessions (the "pile" of portions)
const batchSessionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  recipeId: { type: Schema.Types.ObjectId, ref: "Recipe", required: true },
  preparedDate: { type: Date, required: true },
  quantityMultiplier: { type: Number, default: 2, min: 1, max: 10 },
  totalPortions: { type: Number, required: true },
  remainingPortions: { type: Number, required: true },
  notes: String,
}, { timestamps: true });

// Schema for planned meals
const recipePlanSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  recipeId: { type: Schema.Types.ObjectId, ref: "Recipe", required: true },
  date: { type: Date, required: true },
  mealType: {
    type: String,
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Lunchbox', 'Babyfood'],
    required: true
  },
  servings: { type: Number, default: 1 },
  notes: String,
  // Batch cooking reference
  isBatchCooked: { type: Boolean, default: false },
  batchSessionId: { type: Schema.Types.ObjectId, ref: 'BatchSession', default: null },
});

const BatchSession = mongoose.model("BatchSession", batchSessionSchema);
const RecipePlan = mongoose.model("RecipePlan", recipePlanSchema);

module.exports = { RecipePlan, BatchSession };