const express = require("express");

const {
    getSkills,
    getSkillById,
    createSkill,
    updateSkill,
    deleteSkill
} = require("../controllers/skillController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getSkills);
router.get("/:id", getSkillById);

// Protected admin routes
router.post("/", authenticateToken, createSkill);
router.put("/:id", authenticateToken, updateSkill);
router.delete("/:id", authenticateToken, deleteSkill);

module.exports = router;