const express = require("express");

const {
    getAbout,
    getAboutById,
    createAbout,
    updateAbout,
    deleteAbout
} = require("../controllers/aboutController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Public GET
router.get("/", getAbout);
router.get("/:id", getAboutById);

// Admin protected routes
router.post("/", authenticateToken, createAbout);
router.put("/:id", authenticateToken, updateAbout);
router.delete("/:id", authenticateToken, deleteAbout);

module.exports = router;