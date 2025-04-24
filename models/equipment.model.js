const mongoose = require("mongoose");
const { Schema } = mongoose;

const equipmentSchema = new Schema({
  name: { type: String, required: true, unique: true }
});

module.exports = mongoose.model("Equipment", equipmentSchema);