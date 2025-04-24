const express = require("express");
const router = express.Router();
const planController = require("../controllers/recipePlan.controller");
const auth = require("../middlewares/auth");

router.get("/user/:userId",auth, planController.getPlansByUser);
router.post("/",auth, planController.createPlan);
router.put("/:id",auth, planController.updatePlan);
router.delete("/:id",auth, planController.deletePlan);

module.exports = router;