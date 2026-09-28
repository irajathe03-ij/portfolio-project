const express = require("express");

const {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService
} = require("../controllers/serviceController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getServices);
router.get("/:id", getServiceById);

// Protected admin routes
router.post("/", authenticateToken, createService);
router.put("/:id", authenticateToken, updateService);
router.delete("/:id", authenticateToken, deleteService);

module.exports = router;