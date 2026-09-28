const { pool } = require("../config/db");

// GET all blogs
const getBlogs = async (req, res, next) => {
    try {
        const [rows] = await pool.query(
            `SELECT id, title, slug, excerpt, content, image,
                    published, created_at, updated_at
             FROM blogs
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

// GET blog by ID
const getBlogById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.query(
            `SELECT id, title, slug, excerpt, content, image,
                    published, created_at, updated_at
             FROM blogs
             WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
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

// CREATE blog
const createBlog = async (req, res, next) => {
    try {
        const {
            title,
            slug,
            excerpt,
            content,
            image,
            published
        } = req.body;

        if (!title || !slug) {
            return res.status(400).json({
                success: false,
                message: "Title and slug are required"
            });
        }

        const [result] = await pool.query(
            `INSERT INTO blogs
             (title, slug, excerpt, content, image, published)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                title,
                slug,
                excerpt || null,
                content || null,
                image || null,
                published ?? 0
            ]
        );

        const [rows] = await pool.query(
            `SELECT id, title, slug, excerpt, content, image,
                    published, created_at, updated_at
             FROM blogs
             WHERE id = ?`,
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            message: "Blog created successfully",
            data: rows[0]
        });
    } catch (error) {
        // Handle duplicate slug
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "A blog with this slug already exists"
            });
        }

        next(error);
    }
};

// UPDATE blog
const updateBlog = async (req, res, next) => {
    try {
        const { id } = req.params;

        const {
            title,
            slug,
            excerpt,
            content,
            image,
            published
        } = req.body;

        if (!title || !slug) {
            return res.status(400).json({
                success: false,
                message: "Title and slug are required"
            });
        }

        const [result] = await pool.query(
            `UPDATE blogs
             SET title = ?,
                 slug = ?,
                 excerpt = ?,
                 content = ?,
                 image = ?,
                 published = ?
             WHERE id = ?`,
            [
                title,
                slug,
                excerpt || null,
                content || null,
                image || null,
                published ?? 0,
                id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        const [rows] = await pool.query(
            `SELECT id, title, slug, excerpt, content, image,
                    published, created_at, updated_at
             FROM blogs
             WHERE id = ?`,
            [id]
        );

        res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            data: rows[0]
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).json({
                success: false,
                message: "A blog with this slug already exists"
            });
        }

        next(error);
    }
};

// DELETE blog
const deleteBlog = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            "DELETE FROM blogs WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Blog deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog
};