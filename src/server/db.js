const mysql = require('mysql2');
const config = require('./config'); // Ensure this file has your MySQL config

// Create a MySQL connection
const connection = mysql.createConnection({
  host: config.mysqlConfig.host,
  user: config.mysqlConfig.user,
  password: config.mysqlConfig.password,
  database: config.mysqlConfig.database,
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL as id', connection.threadId);
});

// Export the connection for use in other modules
module.exports = connection;






