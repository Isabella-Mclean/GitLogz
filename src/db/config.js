const { Pool } = require("pg");

// Set up the connection pool
const pool = new Pool({
  user: process.env.DB_USER || "postgres", // Your PostgreSQL username
  host: process.env.DB_HOST || "localhost", // Your PostgreSQL host
  database: process.env.DB_DATABASE_NAME || "postgres", // Your PostgreSQL database name
  password: process.env.DB_PASSWORD || "password", // Your PostgreSQL password
  port: process.env.DB_PORT || 5432, // Your PostgreSQL port
});

module.exports = pool;
