const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tag.controller");
const auth = require("../middlewares/auth");

router.get("/",auth, tagController.getAllTags);
router.get("/:id",auth, tagController.getTagById);
router.post("/",auth, tagController.createTag);
router.put("/:id",auth, tagController.updateTag);
router.delete("/:id",auth, tagController.deleteTag);

module.exports = router;