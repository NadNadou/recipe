const RecipePlan = require("../models/recipePlan.model");

// GET all plans for a user
exports.getPlansByUser = async (req, res) => {
  try {
    const plans = await RecipePlan.find({
      userId: req.user._id
    })
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
    const userId = req.user._id;

    const newPlan = new RecipePlan({
      ...req.body,
      userId,
    });

    const saved = await newPlan.save();

    // 👻 Batch Cooking standard
    if (
      saved.servings >= 4 &&
      saved.servings % 2 === 0 &&
      saved.mealType !== 'Babyfood'
    ) {
      const ghostPlan = new RecipePlan({
        userId,
        recipeId: saved.recipeId,
        date: saved.date,
        mealType: saved.mealType,
        notes: '[Batch Cooking]',
        servings: saved.servings / 2,
        parentPlanId: saved._id,
        isBatch: true,
      });
      await ghostPlan.save();
    }

    // 👶 Cas Babyfood : créer servings - 1 plans fantômes
    if (saved.mealType === 'Babyfood' && saved.servings > 1) {
      const babyPlans = [];

      for (let i = 1; i < saved.servings; i++) {
        babyPlans.push(
          new RecipePlan({
            userId,
            recipeId: saved.recipeId,
            date: saved.date,
            mealType: saved.mealType,
            notes: `[Portion bébé ${i + 1}]`,
            servings: 1,
            parentPlanId: saved._id,
            isBatch: true,
          })
        );
      }

      await RecipePlan.insertMany(babyPlans);
    }

    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({
      message: 'Erreur de création',
      error: error.message,
    });
  }
};

// PUT update a plan
exports.updatePlan = async (req, res) => {
  try {
    const existingPlan = await RecipePlan.findById(req.params.id);
    if (!existingPlan) return res.status(404).json({ message: "Plan introuvable" });

    const updated = await RecipePlan.findByIdAndUpdate(req.params.id, req.body, { new: true });

    const oldServings = existingPlan.servings;
    const newServings = req.body.servings ?? oldServings;

    // 🔥 Si la valeur de servings a changé
    if (newServings !== oldServings) {
      // 🧹 Supprimer anciens plans fantômes
      await RecipePlan.deleteMany({ parentPlanId: updated._id });

      // 👻 Recréer un ou plusieurs plans fantômes
      if (newServings > 2 && newServings % 2 === 0) {
        const ghostPlan = new RecipePlan({
          ...updated.toObject(),
          servings: newServings / 2,
          parentPlanId: updated._id,
          _id: undefined, // important pour forcer la création
        });
        await ghostPlan.save();
      }
    }

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

    // 👻 Supprime les éventuels plans fantômes
    await RecipePlan.deleteMany({ parentPlanId: req.params.id });

    res.status(200).json({ message: "Plan supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
