const express = require("express");
const router = express.Router();
const equipmentController = require("../controllers/equipment.controller");

const auth = require("../middlewares/auth");


router.get("/",auth, equipmentController.getAllEquipments);
router.get("/:id",auth, equipmentController.getEquipmentById);
router.post("/",auth, equipmentController.createEquipment);
router.put("/:id",auth, equipmentController.updateEquipment);
router.delete("/:id",auth, equipmentController.deleteEquipment);

module.exports = router;
