// db/db.js
require("dotenv").config();
// Get connection
const { Pool } = require("pg");
console.log("Database_Url", process.env.DATABASE_URL);

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1); // Exit the process if the database URL is missing
}

// Use environment variables to protect sensitive information
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "YOUR_RAILWAY_CONNECTION_URL",
  ssl: {
    rejectUnauthorized: false, // For Railway's SSL requirement
  },
});

module.exports = pool;
