const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipe.controller");
const auth = require("../middlewares/auth");
const upload = require("../middlewares/uploadCloudinary");

router.get("/",auth,recipeController.getAllRecipes);
router.post("/", auth, upload.single('image'),recipeController.createRecipe);
router.post("/recalculate-nutrition", auth, recipeController.recalculateAllNutrition);
router.put("/bulk-update-appliances", auth, recipeController.bulkUpdateAppliances);
router.post("/:id/duplicate", auth,recipeController.duplicateRecipe);
router.get("/:id",auth, recipeController.getRecipeById);
router.put("/:id", auth,upload.single('image'),recipeController.updateRecipe);
router.delete("/:id", auth, recipeController.deleteRecipe);


module.exports = router;
