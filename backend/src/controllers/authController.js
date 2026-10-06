const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");

// Generate access token
const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h"
        }
    );
};

// Login
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const [users] = await pool.query(
            "SELECT id, name, email, password, role FROM users WHERE email = ? LIMIT 1",
            [email.trim()]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = users[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = generateAccessToken(user);

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        next(error);
    }
};

// Update admin email and password
const updateCredentials = async (req, res, next) => {
    try {
        const {
            currentPassword,
            newEmail,
            newPassword
        } = req.body;

        if (!currentPassword || !newEmail || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password, new email and new password are required"
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 8 characters long"
            });
        }

        const email = newEmail.trim().toLowerCase();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            });
        }

        const userId = req.user.id;

        const [users] = await pool.query(
            "SELECT id, name, email, password, role FROM users WHERE id = ? LIMIT 1",
            [userId]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Admin user not found"
            });
        }

        const user = users[0];

        if (user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admins can change credentials"
            });
        }

        const passwordMatch = await bcrypt.compare(
            currentPassword,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
            });
        }

        const [existingUsers] = await pool.query(
            "SELECT id FROM users WHERE email = ? AND id <> ? LIMIT 1",
            [email, userId]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message: "This email is already in use"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await pool.query(
            "UPDATE users SET email = ?, password = ? WHERE id = ?",
            [email, hashedPassword, userId]
        );

        const updatedUser = {
            id: user.id,
            name: user.name,
            email,
            role: user.role
        };

        const token = generateAccessToken(updatedUser);

        res.status(200).json({
            success: true,
            message: "Admin credentials updated successfully",
            token,
            user: updatedUser
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    login,
    updateCredentials
};