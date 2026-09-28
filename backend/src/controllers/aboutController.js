const { pool } = require("../config/db");

// GET About information
const getAbout = async (req, res, next) => {
    try {
        const [rows] = await pool.query(
            "SELECT id, description, updated_at, title, profile_image FROM about ORDER BY id DESC"
        );

        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        next(error);
    }
};

// GET About information by ID
const getAboutById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.query(
            "SELECT id, description, updated_at, title, profile_image FROM about WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "About information not found"
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

// CREATE About information
const createAbout = async (req, res, next) => {
    try {
        const {
            title,
            description,
            profile_image
        } = req.body;

        const [result] = await pool.query(
            `INSERT INTO about
            (title, description, profile_image)
            VALUES (?, ?, ?)`,
            [
                title || null,
                description || null,
                profile_image || null
            ]
        );

        const [rows] = await pool.query(
            "SELECT id, description, updated_at, title, profile_image FROM about WHERE id = ?",
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: "About information created successfully",
            data: rows[0]
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE About information
const updateAbout = async (req, res, next) => {
    try {
        const { id } = req.params;

        const {
            title,
            description,
            profile_image
        } = req.body;

        const [result] = await pool.query(
            `UPDATE about
             SET title = ?,
                 description = ?,
                 profile_image = ?
             WHERE id = ?`,
            [
                title || null,
                description || null,
                profile_image || null,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "About information not found"
            });
        }

        const [rows] = await pool.query(
            "SELECT id, description, updated_at, title, profile_image FROM about WHERE id = ?",
            [id]
        );

        res.status(200).json({
            success: true,
            message: "About information updated successfully",
            data: rows[0]
        });
    } catch (error) {
        next(error);
    }
};

// DELETE About information
const deleteAbout = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            "DELETE FROM about WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "About information not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "About information deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAbout,
    getAboutById,
    createAbout,
    updateAbout,
    deleteAbout
};