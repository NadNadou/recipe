const RecipePlan = require("../models/recipePlan.model");

// GET all plans for a user
exports.getPlansByUser = async (req, res) => {
  try {
    const plans = await RecipePlan.find({ userId: req.params.userId })
      .populate("recipeId")
      .sort({ date: 1 });

    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// POST create a plan
exports.createPlan = async (req, res) => {
  try {
    const newPlan = new RecipePlan(req.body);
    const saved = await newPlan.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: "Erreur de création", error: error.message });
  }
};

// PUT update a plan
exports.updatePlan = async (req, res) => {
  try {
    const updated = await RecipePlan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Plan introuvable" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: "Erreur de mise à jour", error: error.message });
  }
};

// DELETE a plan
exports.deletePlan = async (req, res) => {
  try {
    const deleted = await RecipePlan.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Plan introuvable" });
    res.status(200).json({ message: "Plan supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};