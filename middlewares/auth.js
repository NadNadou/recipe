const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // console.log("==> Authorization Header:", req.headers.authorization);
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({ message: "Accès refusé, token manquant" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Ajoute l'utilisateur au req
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalide" });
  }
};