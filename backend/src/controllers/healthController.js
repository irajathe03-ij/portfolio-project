const { pool } = require("../config/db");

const healthCheck = async (req, res, next) => {
    try {
        await pool.query("SELECT 1");

        res.status(200).json({
            status: "OK",
            message: "Backend and database are working",
            database: "MySQL"
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    healthCheck
};