const express = require("express");
const MemeController = require("../controllers/MemeController");

const router = express.Router();

// GET /api/memes - Get all memes
router.get("/", MemeController.getAllMemes);

// GET /api/memes/:id - Get meme by ID
router.get("/:id", MemeController.getMemeById);

// POST /api/memes - Create new meme
router.post("/", MemeController.createMeme);

// PUT /api/memes/:id - Update meme
router.put("/:id", MemeController.updateMeme);

// DELETE /api/memes/:id - Delete meme
router.delete("/:id", MemeController.deleteMeme);

module.exports = router;
