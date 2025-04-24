const Equipment = require("../models/equipment.model");

// GET all equipments
exports.getAllEquipments = async (req, res) => {
  try {
    const equipments = await Equipment.find().sort({ name: 1 });
    res.status(200).json(equipments);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// GET equipment by ID
exports.getEquipmentById = async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) return res.status(404).json({ message: "Équipement introuvable" });
    res.status(200).json(equipment);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// POST create equipment
exports.createEquipment = async (req, res) => {
  try {
    const newEquipment = new Equipment(req.body);
    const saved = await newEquipment.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: "Erreur de création", error: error.message });
  }
};

// PUT update equipment
exports.updateEquipment = async (req, res) => {
  try {
    const updated = await Equipment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Équipement introuvable" });
    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: "Erreur de mise à jour", error: error.message });
  }
};

// DELETE equipment
exports.deleteEquipment = async (req, res) => {
  try {
    const deleted = await Equipment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Équipement introuvable" });
    res.status(200).json({ message: "Équipement supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
