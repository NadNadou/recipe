const express = require("express");
const router = express.Router();
const planController = require("../controllers/recipePlan.controller");
const auth = require("../middlewares/auth");

// Plans
router.get("/", auth, planController.getPlansByUser);
router.post("/", auth, planController.createPlan);
router.put("/:id", auth, planController.updatePlan);
router.delete("/:id", auth, planController.deletePlan);

// Batch Sessions
router.get("/batch", auth, planController.getBatchSessions);
router.get("/batch/all", auth, planController.getAllBatchSessions);
router.post("/batch", auth, planController.createBatchSession);
router.put("/batch/:id", auth, planController.updateBatchSession);
router.delete("/batch/:id", auth, planController.deleteBatchSession);
router.post("/batch/:id/consume", auth, planController.consumeBatchPortion);

module.exports = router;