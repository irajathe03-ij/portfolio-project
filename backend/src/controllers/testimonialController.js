const { pool } = require("../config/db");

// GET all testimonials
const getTestimonials = async (req, res, next) => {
    try {
        const [rows] = await pool.query(
            `SELECT id, name, role, message, image, created_at
             FROM testimonials
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

// GET testimonial by ID
const getTestimonialById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.query(
            `SELECT id, name, role, message, image, created_at
             FROM testimonials
             WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Testimonial not found"
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

// CREATE testimonial
const createTestimonial = async (req, res, next) => {
    try {
        const {
            name,
            role,
            message,
            image
        } = req.body;

        if (!name || !message) {
            return res.status(400).json({
                success: false,
                message: "Name and message are required"
            });
        }

        const [result] = await pool.query(
            `INSERT INTO testimonials
             (name, role, message, image)
             VALUES (?, ?, ?, ?)`,
            [
                name,
                role || null,
                message,
                image || null
            ]
        );

        const [rows] = await pool.query(
            `SELECT id, name, role, message, image, created_at
             FROM testimonials
             WHERE id = ?`,
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: "Testimonial created successfully",
            data: rows[0]
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE testimonial
const updateTestimonial = async (req, res, next) => {
    try {
        const { id } = req.params;

        const {
            name,
            role,
            message,
            image
        } = req.body;

        if (!name || !message) {
            return res.status(400).json({
                success: false,
                message: "Name and message are required"
            });
        }

        const [result] = await pool.query(
            `UPDATE testimonials
             SET name = ?,
                 role = ?,
                 message = ?,
                 image = ?
             WHERE id = ?`,
            [
                name,
                role || null,
                message,
                image || null,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Testimonial not found"
            });
        }

        const [rows] = await pool.query(
            `SELECT id, name, role, message, image, created_at
             FROM testimonials
             WHERE id = ?`,
            [id]
        );

        res.status(200).json({
            success: true,
            message: "Testimonial updated successfully",
            data: rows[0]
        });
    } catch (error) {
        next(error);
    }
};

// DELETE testimonial
const deleteTestimonial = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            "DELETE FROM testimonials WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Testimonial not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Testimonial deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getTestimonials,
    getTestimonialById,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial
};