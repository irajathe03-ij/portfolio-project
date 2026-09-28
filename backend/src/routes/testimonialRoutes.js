const express = require("express");

const {
    getTestimonials,
    getTestimonialById,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial
} = require("../controllers/testimonialController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getTestimonials);
router.get("/:id", getTestimonialById);

// Protected admin routes
router.post("/", authenticateToken, createTestimonial);
router.put("/:id", authenticateToken, updateTestimonial);
router.delete("/:id", authenticateToken, deleteTestimonial);

module.exports = router;