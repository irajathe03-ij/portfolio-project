const { pool } = require("../config/db");

// GET all experience
const getExperiences = async (req, res, next) => {
    try {
        const [rows] = await pool.query(
            `SELECT id, title, company, start_date, end_date,
                    description, created_at
             FROM experience
             ORDER BY start_date DESC`
        );

        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        next(error);
    }
};

// GET experience by ID
const getExperienceById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.query(
            `SELECT id, title, company, start_date, end_date,
                    description, created_at
             FROM experience
             WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Experience not found"
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

// CREATE experience
const createExperience = async (req, res, next) => {
    try {
        const {
            title,
            company,
            start_date,
            end_date,
            description
        } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Experience title is required"
            });
        }

        const [result] = await pool.query(
            `INSERT INTO experience
             (title, company, start_date, end_date, description)
             VALUES (?, ?, ?, ?, ?)`,
            [
                title,
                company || null,
                start_date || null,
                end_date || null,
                description || null
            ]
        );

        const [rows] = await pool.query(
            `SELECT id, title, company, start_date, end_date,
                    description, created_at
             FROM experience
             WHERE id = ?`,
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: "Experience created successfully",
            data: rows[0]
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE experience
const updateExperience = async (req, res, next) => {
    try {
        const { id } = req.params;

        const {
            title,
            company,
            start_date,
            end_date,
            description
        } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Experience title is required"
            });
        }

        const [result] = await pool.query(
            `UPDATE experience
             SET title = ?,
                 company = ?,
                 start_date = ?,
                 end_date = ?,
                 description = ?
             WHERE id = ?`,
            [
                title,
                company || null,
                start_date || null,
                end_date || null,
                description || null,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Experience not found"
            });
        }

        const [rows] = await pool.query(
            `SELECT id, title, company, start_date, end_date,
                    description, created_at
             FROM experience
             WHERE id = ?`,
            [id]
        );

        res.status(200).json({
            success: true,
            message: "Experience updated successfully",
            data: rows[0]
        });
    } catch (error) {
        next(error);
    }
};

// DELETE experience
const deleteExperience = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            "DELETE FROM experience WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Experience not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Experience deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getExperiences,
    getExperienceById,
    createExperience,
    updateExperience,
    deleteExperience
};