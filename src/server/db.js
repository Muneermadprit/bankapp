const mysql = require('mysql2/promise');
const config = require('./config');

let db; // Global variable to hold the database connection

// Initialize the database connection asynchronously
async function initializeDatabase() {
  if (!db) {
    try {
      db = await mysql.createConnection({
        host: config.mysqlConfig.host,
        user: config.mysqlConfig.user,
        password: config.mysqlConfig.password,
        database: config.mysqlConfig.database,
      });
      console.log('Connected to MySQL as id', db.threadId);
    } catch (err) {
      console.error('Error connecting to MySQL:', err);
      throw err;
    }
  }
  return db;
}

// Function to get the DB connection (ensures it's initialized)
async function getDb() {
  if (!db) {
    await initializeDatabase(); // Ensure initialization if not done
  }
  return db;
}

module.exports = { getDb };  // Export `getDb` to retrieve the database connection when needed
