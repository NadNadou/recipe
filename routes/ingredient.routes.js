const express = require("express");
const router = express.Router();
const ingredientController = require("../controllers/ingredient.controller");
const auth = require("../middlewares/auth")

router.get("/",auth, ingredientController.getAllIngredients);
router.get("/:id",auth, ingredientController.getIngredientById);
router.post("/",auth,auth,auth, ingredientController.createIngredient);
router.put("/:id",auth, ingredientController.updateIngredient);
router.delete("/:id",auth, ingredientController.deleteIngredient);

module.exports = router;