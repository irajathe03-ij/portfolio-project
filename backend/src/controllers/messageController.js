const { pool } = require("../config/db");
const { sendContactNotification } = require("../services/emailService");
// GET all messages
const getMessages = async (req, res, next) => {
    try {
        const [rows] = await pool.query(
            `SELECT id, name, email, subject, message, status, created_at
             FROM messages
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

// GET message by ID
const getMessageById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [rows] = await pool.query(
            `SELECT id, name, email, subject, message, status, created_at
             FROM messages
             WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
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

// CREATE message
// Public contact form
const createMessage = async (req, res, next) => {
    try {
        const {
            name,
            email,
            subject,
            message
        } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Name, email and message are required"
            });
        }

        const [result] = await pool.query(
            `INSERT INTO messages
             (name, email, subject, message, status)
             VALUES (?, ?, ?, ?, 'new')`,
            [
                name,
                email,
                subject || null,
                message
            ]
        );

        const [rows] = await pool.query(
            `SELECT id, name, email, subject, message, status, created_at
             FROM messages
             WHERE id = ?`,
            [result.insertId]
        );

        try {
    await sendContactNotification(rows[0]);
} catch (emailError) {
    console.error("Email notification failed:");
    console.error(emailError.message);
}

        res.status(201).json({
            success: true,
            message: "Your message has been sent successfully",
            data: rows[0]
        });
    } catch (error) {
        next(error);
    }
};

// UPDATE message status
const updateMessageStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = [
            "new",
            "read",
            "replied"
        ];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status must be new, read or replied"
            });
        }

        const [result] = await pool.query(
            `UPDATE messages
             SET status = ?
             WHERE id = ?`,
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
            });
        }

        const [rows] = await pool.query(
            `SELECT id, name, email, subject, message, status, created_at
             FROM messages
             WHERE id = ?`,
            [id]
        );

        res.status(200).json({
            success: true,
            message: "Message status updated successfully",
            data: rows[0]
        });
    } catch (error) {
        next(error);
    }
};

// DELETE message
const deleteMessage = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [result] = await pool.query(
            "DELETE FROM messages WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Message not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Message deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getMessages,
    getMessageById,
    createMessage,
    updateMessageStatus,
    deleteMessage
};