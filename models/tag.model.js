const mongoose = require("mongoose");
const { Schema } = mongoose;

const tagSchema = new Schema({
  label: { type: String, required: true, unique: true }
});

module.exports = mongoose.model("Tag", tagSchema);
