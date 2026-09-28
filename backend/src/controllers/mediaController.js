const fs = require("fs");
const path = require("path");
const { pool } = require("../config/db");

// GET all media
const getMedia = async (req, res, next) => {
    try {
        const [rows] = await pool.query(
            `SELECT id, file_name, file_path, file_type,
                    file_size, uploaded_by, created_at
             FROM media
             ORDER BY created_at DESC`
        );

        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        next(error);
    }
};

// GET media by ID
const getMediaById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.query(
            `SELECT id, file_name, file_path, file_type,
                    file_size, uploaded_by, created_at
             FROM media
             WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Media not found"
            });
        }

        res.status(200).json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        next(error);
    }
};

// UPLOAD media
const uploadMedia = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Please select a file to upload"
            });
        }

        const file = req.file;

        const filePath = `/uploads/${file.filename}`;

        const uploadedBy = req.user ? req.user.id : null;

        const [result] = await pool.query(
            `INSERT INTO media
             (file_name, file_path, file_type, file_size, uploaded_by)
             VALUES (?, ?, ?, ?, ?)`,
            [
                file.originalname,
                filePath,
                file.mimetype,
                file.size,
                uploadedBy
            ]
        );

        const [rows] = await pool.query(
            `SELECT id, file_name, file_path, file_type,
                    file_size, uploaded_by, created_at
             FROM media
             WHERE id = ?`,
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: "Media uploaded successfully",
            data: rows[0]
        });
    } catch (error) {
        // If database insert fails, remove uploaded file
        if (req.file) {
            const uploadedFilePath = path.join(
                __dirname,
                "../../uploads",
                req.file.filename
            );

            if (fs.existsSync(uploadedFilePath)) {
                fs.unlinkSync(uploadedFilePath);
            }
        }

        next(error);
    }
};

// DELETE media
const deleteMedia = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.query(
            `SELECT file_path
             FROM media
             WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Media not found"
            });
        }

        const filePath = rows[0].file_path;

        const [result] = await pool.query(
            "DELETE FROM media WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Media not found"
            });
        }

        // Remove physical file
        if (filePath) {
            const fileName = path.basename(filePath);

            const physicalPath = path.join(
                __dirname,
                "../../uploads",
                fileName
            );

            if (fs.existsSync(physicalPath)) {
                fs.unlinkSync(physicalPath);
            }
        }

        res.status(200).json({
            success: true,
            message: "Media deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMedia,
    getMediaById,
    uploadMedia,
    deleteMedia
};