const express = require("express");

const {
    getMessages,
    getMessageById,
    createMessage,
    updateMessageStatus,
    deleteMessage
} = require("../controllers/messageController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Public contact form
router.post("/", createMessage);

// Protected admin routes
router.get("/", authenticateToken, getMessages);
router.get("/:id", authenticateToken, getMessageById);
router.put("/:id/status", authenticateToken, updateMessageStatus);
router.delete("/:id", authenticateToken, deleteMessage);

module.exports = router;