const express = require("express");

const {
    getExperiences,
    getExperienceById,
    createExperience,
    updateExperience,
    deleteExperience
} = require("../controllers/experienceController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getExperiences);
router.get("/:id", getExperienceById);

// Protected admin routes
router.post("/", authenticateToken, createExperience);
router.put("/:id", authenticateToken, updateExperience);
router.delete("/:id", authenticateToken, deleteExperience);

module.exports = router;