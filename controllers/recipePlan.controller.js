const { RecipePlan, BatchSession } = require("../models/recipePlan.model");
const Recipe = require("../models/recipe.model");

// ==================== PLANS ====================

// GET all plans for a user
exports.getPlansByUser = async (req, res) => {
  try {
    const plans = await RecipePlan.find({
      userId: req.user._id
    })
      .populate("recipeId")
      .populate("batchSessionId")
      .sort({ date: 1 });

    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST create a plan (simple or from batch)
exports.createPlan = async (req, res) => {
  try {
    const userId = req.user._id;
    const { batchSessionId } = req.body;

    // If from batch session, decrement remaining portions
    if (batchSessionId) {
      const session = await BatchSession.findById(batchSessionId);
      if (!session) {
        return res.status(404).json({ message: "Batch session not found" });
      }
      if (session.remainingPortions <= 0) {
        return res.status(400).json({ message: "No portions remaining in this batch" });
      }

      // Decrement remaining portions
      session.remainingPortions -= 1;
      await session.save();
    }

    const newPlan = new RecipePlan({
      ...req.body,
      userId,
      isBatchCooked: !!batchSessionId,
    });

    const saved = await newPlan.save();
    const populated = await RecipePlan.findById(saved._id)
      .populate("recipeId")
      .populate("batchSessionId");

    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({
      message: 'Error creating plan',
      error: error.message,
    });
  }
};

// PUT update a plan
exports.updatePlan = async (req, res) => {
  try {
    const existingPlan = await RecipePlan.findById(req.params.id);
    if (!existingPlan) return res.status(404).json({ message: "Plan not found" });

    const updated = await RecipePlan.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("recipeId")
      .populate("batchSessionId");

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: "Error updating plan", error: error.message });
  }
};

// DELETE a plan
exports.deletePlan = async (req, res) => {
  try {
    const plan = await RecipePlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    // If from batch, restore the portion
    if (plan.batchSessionId) {
      await BatchSession.findByIdAndUpdate(plan.batchSessionId, {
        $inc: { remainingPortions: 1 }
      });
    }

    await RecipePlan.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Plan deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ==================== BATCH SESSIONS ====================

// GET all batch sessions for a user
exports.getBatchSessions = async (req, res) => {
  try {
    const sessions = await BatchSession.find({
      userId: req.user._id,
      remainingPortions: { $gt: 0 } // Only sessions with remaining portions
    })
      .populate("recipeId")
      .sort({ preparedDate: -1 });

    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET all batch sessions (including empty ones)
exports.getAllBatchSessions = async (req, res) => {
  try {
    const sessions = await BatchSession.find({
      userId: req.user._id
    })
      .populate("recipeId")
      .sort({ preparedDate: -1 });

    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST create a batch session
exports.createBatchSession = async (req, res) => {
  try {
    const userId = req.user._id;
    const { recipeId, quantityMultiplier = 2, preparedDate, notes } = req.body;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    // Calculate total portions
    let effectiveMultiplier = quantityMultiplier;
    if (!recipe.isBatchCookingDefault) {
      effectiveMultiplier = Math.max(quantityMultiplier, recipe.minBatchMultiplier || 2);
    }

    const totalPortions = recipe.servings * effectiveMultiplier;

    const newSession = new BatchSession({
      userId,
      recipeId,
      preparedDate: preparedDate || new Date(),
      quantityMultiplier: effectiveMultiplier,
      totalPortions,
      remainingPortions: totalPortions,
      notes,
    });

    const saved = await newSession.save();
    const populated = await BatchSession.findById(saved._id).populate("recipeId");

    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({
      message: 'Error creating batch session',
      error: error.message,
    });
  }
};

// DELETE a batch session (keeps linked plans)
exports.deleteBatchSession = async (req, res) => {
  try {
    const session = await BatchSession.findById(req.params.id);
    if (!session) return res.status(404).json({ message: "Batch session not found" });

    // Keep the plans but remove the batch session reference and batch flag
    await RecipePlan.updateMany(
      { batchSessionId: req.params.id },
      { $set: { batchSessionId: null, isBatchCooked: false } }
    );

    await BatchSession.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Batch session deleted (plans kept)" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// POST consume a portion from batch (manual decrease)
exports.consumeBatchPortion = async (req, res) => {
  try {
    const session = await BatchSession.findById(req.params.id);
    if (!session) return res.status(404).json({ message: "Batch session not found" });

    if (session.remainingPortions <= 0) {
      return res.status(400).json({ message: "No portions remaining" });
    }

    session.remainingPortions -= 1;
    await session.save();

    const populated = await BatchSession.findById(session._id).populate("recipeId");
    res.status(200).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// PUT update batch session
exports.updateBatchSession = async (req, res) => {
  try {
    const updated = await BatchSession.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate("recipeId");

    if (!updated) return res.status(404).json({ message: "Batch session not found" });

    res.status(200).json(updated);
  } catch (error) {
    res.status(400).json({ message: "Error updating batch session", error: error.message });
  }
};
