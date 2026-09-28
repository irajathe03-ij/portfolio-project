const express = require("express");

const {
    getBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog
} = require("../controllers/blogController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getBlogs);
router.get("/:id", getBlogById);

// Protected admin routes
router.post("/", authenticateToken, createBlog);
router.put("/:id", authenticateToken, updateBlog);
router.delete("/:id", authenticateToken, deleteBlog);

module.exports = router;