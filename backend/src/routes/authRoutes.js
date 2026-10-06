const express = require("express");

const {
    login,
    updateCredentials
} = require("../controllers/authController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", login);

router.put(
    "/update-credentials",
    authenticateToken,
    updateCredentials
);

module.exports = router;