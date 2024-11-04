// config.js
const assert = require('assert');
require('dotenv').config(); // Load environment variables from .env file

const {
    PORT,
    HOST,
    HOST_URL,

    // MySQL Configuration
    MYSQL_HOST,
    MYSQL_USER,
    MYSQL_PASSWORD,
    MYSQL_DB_NAME
} = process.env;

assert(PORT, 'PORT is required');
assert(HOST, 'HOST is required');

// Assert MySQL configuration
assert(MYSQL_HOST, 'MYSQL_HOST is required');
assert(MYSQL_USER, 'MYSQL_USER is required');
assert(MYSQL_PASSWORD, 'MYSQL_PASSWORD is required');
assert(MYSQL_DB_NAME, 'MYSQL_DB_NAME is required');

module.exports = {
    port: PORT,
    host: HOST,
    url: HOST_URL,
    mysqlConfig: {
        host: MYSQL_HOST,
        user: MYSQL_USER,
        password: MYSQL_PASSWORD,
        database: MYSQL_DB_NAME,
    }
};
