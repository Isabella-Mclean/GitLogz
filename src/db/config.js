const { Pool } = require("pg");

// Set up the connection pool
const pool = new Pool({
  user: "myuser", // Your PostgreSQL username
  host: "localhost",
  database: "commit_history", // Your PostgreSQL database name
  password: "waseefmd", // Your PostgreSQL password
  port: 5432,
});

module.exports = pool;
