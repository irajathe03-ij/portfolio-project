const { pool } = require("../config/db");

// GET all services
const getServices = async (req, res, next) => {
    try {
        const [rows] = await pool.query(
            `SELECT id, title, description, icon, created_at
             FROM services
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

// GET service by ID
const getServiceById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.query(
            `SELECT id, title, description, icon, created_at
             FROM services
             WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
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

// CREATE service
const createService = async (req, res, next) => {
    try {
        const {
            title,
            description,
            icon
        } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Service title is required"
            });
        }

        const [result] = await pool.query(
            `INSERT INTO services
             (title, description, icon)
             VALUES (?, ?, ?)`,
            [
                title,
                description || null,
                icon || null
            ]
        );

        const [rows] = await pool.query(
            `SELECT id, title, description, icon, created_at
             FROM services
             WHERE id = ?`,
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: "Service created successfully",
            data: rows[0]
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE service
const updateService = async (req, res, next) => {
    try {
        const { id } = req.params;

        const {
            title,
            description,
            icon
        } = req.body;

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Service title is required"
            });
        }

        const [result] = await pool.query(
            `UPDATE services
             SET title = ?,
                 description = ?,
                 icon = ?
             WHERE id = ?`,
            [
                title,
                description || null,
                icon || null,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        const [rows] = await pool.query(
            `SELECT id, title, description, icon, created_at
             FROM services
             WHERE id = ?`,
            [id]
        );

        res.status(200).json({
            success: true,
            message: "Service updated successfully",
            data: rows[0]
        });
    } catch (error) {
        next(error);
    }
};

// DELETE service
const deleteService = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            "DELETE FROM services WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Service not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Service deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService
};