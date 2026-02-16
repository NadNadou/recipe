const express = require("express");
const router = express.Router();
const ingredientController = require("../controllers/ingredient.controller");
const auth = require("../middlewares/auth")

router.get("/",auth, ingredientController.getAllIngredients);
router.post("/",auth, ingredientController.createIngredient);

// Bulk actions (before /:id routes)
router.put("/bulk-update-category", auth, ingredientController.bulkUpdateCategory);
router.post("/bulk-enrich", auth, ingredientController.bulkEnrich);

// OpenFoodFacts nutrition enrichment
router.post("/search-nutrition", auth, ingredientController.searchNutrition);
router.post("/search-nutrition-multiple", auth, ingredientController.searchNutritionMultiple);
router.post("/enrich-all", auth, ingredientController.enrichAllIngredients);

// Parameterized routes (must be last)
router.get("/:id",auth, ingredientController.getIngredientById);
router.put("/:id",auth, ingredientController.updateIngredient);
router.delete("/:id",auth, ingredientController.deleteIngredient);
router.post("/:id/enrich", auth, ingredientController.enrichIngredientNutrition);

module.exports = router;