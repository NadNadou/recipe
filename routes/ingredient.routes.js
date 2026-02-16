const express = require("express");
const router = express.Router();
const ingredientController = require("../controllers/ingredient.controller");
const auth = require("../middlewares/auth")

router.get("/",auth, ingredientController.getAllIngredients);
router.get("/:id",auth, ingredientController.getIngredientById);
router.post("/",auth, ingredientController.createIngredient);
router.put("/:id",auth, ingredientController.updateIngredient);
router.delete("/:id",auth, ingredientController.deleteIngredient);

// OpenFoodFacts nutrition enrichment
router.post("/search-nutrition", auth, ingredientController.searchNutrition);
router.post("/search-nutrition-multiple", auth, ingredientController.searchNutritionMultiple);
router.post("/enrich-all", auth, ingredientController.enrichAllIngredients);
router.post("/:id/enrich", auth, ingredientController.enrichIngredientNutrition);

module.exports = router;