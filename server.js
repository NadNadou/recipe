require("dotenv").config();
const connectDB = require("./config/db");
const app = require("./app"); // 👈 ajoute cette ligne

connectDB().then(() => {
  app.listen(process.env.PORT || 5000, () => {
    console.log("🚀 Serveur lancé !",process.env.PORT);
  });
});
