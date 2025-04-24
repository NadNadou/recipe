const Tag = require("../models/tag.model");

// GET all tags
exports.getAllTags = async (req, res) => {
  try {
    const tags = await Tag.find().sort({ label: 1 });
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// GET tag by ID
exports.getTagById = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    if (!tag) return res.status(404).json({ message: "Tag introuvable" });
    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// POST create tag
exports.createTag = async (req, res) => {
  try {
    const newTag = new Tag(req.body);
    const saved = await newTag.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: "Erreur de création", error: error.message });
  }
};

// PUT update tag
exports.updateTag = async (req, res) => {
  try {
    const updated = await Tag.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Tag introuvable" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: "Erreur de mise à jour", error: error.message });
  }
};

// DELETE tag
exports.deleteTag = async (req, res) => {
  try {
    const deleted = await Tag.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Tag introuvable" });
    res.status(200).json({ message: "Tag supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
