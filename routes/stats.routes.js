const express = require("express");
const router = express.Router();
const statsController = require("../controllers/stats.controller");
const auth = require("../middlewares/auth");

// GET /api/stats/weekly-calories
router.get('/weekly-calories',auth, statsController.getWeeklyCalories);
router.get('/weekly-ingredients',auth, statsController.getWeeklyIngredientsByDay);


module.exports = router;