const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const recipeRoutes = require("./routes/recipe.routes");
const ingredientRoutes = require("./routes/ingredient.routes");
const tagRoutes = require("./routes/tag.routes");
const equipmentRoutes = require("./routes/equipment.routes");
const planRoutes = require("./routes/plan.routes");
const statsRoutes = require("./routes/stats.routes")

const userRoutes = require("./routes/user.routes");
const app = express();

// ✅ Charger tous les modèles Mongoose (pour éviter les erreurs de populate)
require("./models/recipe.model");
require("./models/ingredient.model");
require("./models/user.model");
require("./models/tag.model");
require("./models/equipment.model");
require("./models/recipePlan.model");

// 🌍 Middleware globaux
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// 🔗 Routes API
app.use("/api/recipes", recipeRoutes);
app.use("/api/ingredients",ingredientRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/equipments", equipmentRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stats",statsRoutes)


// ✅ Route de test
app.get("/", (req, res) => {
  res.send("🍽️ API Recettes opérationnelle !");
});

// ❌ 404 si aucune route ne correspond
app.use((req, res, next) => {
  res.status(404).json({ message: "Route non trouvée" });
});

// 🔥 Middleware global de gestion des erreurs
app.use((err, req, res, next) => {
  console.error("Erreur non gérée :", err);
  res.status(500).json({ message: "Erreur serveur", error: err.message });
});

module.exports = app;