const express = require("express");

const {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
} = require("../controllers/projectController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getProjects);
router.get("/:id", getProjectById);

// Protected admin routes
router.post("/", authenticateToken, createProject);
router.put("/:id", authenticateToken, updateProject);
router.delete("/:id", authenticateToken, deleteProject);

module.exports = router;