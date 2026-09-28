const { pool } = require("../config/db");

// GET all projects
const getProjects = async (req, res, next) => {
    try {
        const [rows] = await pool.query(
            `SELECT id, title, description, image, technologies,
                    github_url, live_url, created_at, updated_at
             FROM projects
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

// GET project by ID
const getProjectById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.query(
            `SELECT id, title, description, image, technologies,
                    github_url, live_url, created_at, updated_at
             FROM projects
             WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
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

// CREATE project
const createProject = async (req, res, next) => {
    try {
        const {
            title,
            description,
            image,
            technologies,
            github_url,
            live_url
        } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Project title is required"
            });
        }

        const [result] = await pool.query(
            `INSERT INTO projects
             (title, description, image, technologies, github_url, live_url)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                title,
                description || null,
                image || null,
                technologies || null,
                github_url || null,
                live_url || null
            ]
        );

        const [rows] = await pool.query(
            `SELECT id, title, description, image, technologies,
                    github_url, live_url, created_at, updated_at
             FROM projects
             WHERE id = ?`,
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: rows[0]
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE project
const updateProject = async (req, res, next) => {
    try {
        const { id } = req.params;

        const {
            title,
            description,
            image,
            technologies,
            github_url,
            live_url
        } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Project title is required"
            });
        }

        const [result] = await pool.query(
            `UPDATE projects
             SET title = ?,
                 description = ?,
                 image = ?,
                 technologies = ?,
                 github_url = ?,
                 live_url = ?
             WHERE id = ?`,
            [
                title,
                description || null,
                image || null,
                technologies || null,
                github_url || null,
                live_url || null,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        const [rows] = await pool.query(
            `SELECT id, title, description, image, technologies,
                    github_url, live_url, created_at, updated_at
             FROM projects
             WHERE id = ?`,
            [id]
        );

        res.status(200).json({
            success: true,
            message: "Project updated successfully",
            data: rows[0]
        });
    } catch (error) {
        next(error);
    }
};

// DELETE project
const deleteProject = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            "DELETE FROM projects WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Project deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
};