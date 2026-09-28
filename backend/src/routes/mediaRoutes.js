const express = require("express");
const multer = require("multer");
const path = require("path");

const {
    getMedia,
    getMediaById,
    uploadMedia,
    deleteMedia
} = require("../controllers/mediaController");

const authenticateToken = require("../middleware/authMiddleware");

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../uploads"));
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() +
            "-" +
            Math.round(Math.random() * 1E9) +
            path.extname(file.originalname);

        cb(null, uniqueName);
    }
});

// Allow common image/document files
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "application/pdf"
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPG, PNG, WEBP, GIF and PDF files are allowed"));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

// Public routes
router.get("/", getMedia);
router.get("/:id", getMediaById);

// Protected upload/delete routes
router.post(
    "/upload",
    authenticateToken,
    upload.single("file"),
    uploadMedia
);

router.delete(
    "/:id",
    authenticateToken,
    deleteMedia
);

module.exports = router;