const { pool } = require("../config/db");

// GET all skills
const getSkills = async (req, res, next) => {
    try {
        const [rows] = await pool.query(
            `SELECT id, name, category, level, icon, created_at
             FROM skills
             ORDER BY id DESC`
        );

        res.status(200).json({
            success: true,
            data: rows
        });
    } catch (error) {
        next(error);
    }
};

// GET skill by ID
const getSkillById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.query(
            `SELECT id, name, category, level, icon, created_at
             FROM skills
             WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Skill not found"
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

// CREATE skill
const createSkill = async (req, res, next) => {
    try {
        const {
            name,
            category,
            level,
            icon
        } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Skill name is required"
            });
        }

        const [result] = await pool.query(
            `INSERT INTO skills
             (name, category, level, icon)
             VALUES (?, ?, ?, ?)`,
            [
                name,
                category || null,
                level ?? 0,
                icon || null
            ]
        );

        const [rows] = await pool.query(
            `SELECT id, name, category, level, icon, created_at
             FROM skills
             WHERE id = ?`,
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: "Skill created successfully",
            data: rows[0]
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE skill
const updateSkill = async (req, res, next) => {
    try {
        const { id } = req.params;

        const {
            name,
            category,
            level,
            icon
        } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Skill name is required"
            });
        }

        const [result] = await pool.query(
            `UPDATE skills
             SET name = ?,
                 category = ?,
                 level = ?,
                 icon = ?
             WHERE id = ?`,
            [
                name,
                category || null,
                level ?? 0,
                icon || null,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Skill not found"
            });
        }

        const [rows] = await pool.query(
            `SELECT id, name, category, level, icon, created_at
             FROM skills
             WHERE id = ?`,
            [id]
        );

        res.status(200).json({
            success: true,
            message: "Skill updated successfully",
            data: rows[0]
        });
    } catch (error) {
        next(error);
    }
};

// DELETE skill
const deleteSkill = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            "DELETE FROM skills WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Skill not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Skill deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getSkills,
    getSkillById,
    createSkill,
    updateSkill,
    deleteSkill
};