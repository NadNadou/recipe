// models/ingredient.model.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ingredientSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    defaultUnit: {
      type: String,
      default: 'g'
    },
    units: {
      type: [String],
      default: []
    },
    unitConversions: {
      type: Map,
      of: Number,
      default: {}
    },
    nutritionPer100g: {
      calories: { type: Number, default: 0 },
      proteins: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fats: { type: Number, default: 0 }
    },
    nutritionalProperties: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Ingredient = mongoose.model('Ingredient', ingredientSchema);
module.exports = Ingredient;
