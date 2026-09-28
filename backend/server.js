const app = require("./src/app");
const { testDatabaseConnection } = require("./src/config/db");

require("dotenv").config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await testDatabaseConnection();

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:");
        console.error(error.message);

        process.exit(1);
    }
};

startServer();