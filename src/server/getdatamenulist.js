require('dotenv').config();  // Load environment variables from .env file
const odbc = require('odbc');

function getServiceMenu() {
    let db;
    return odbc.connect(process.env.DB_CONNECTION_STRING)
        .then(connection => {
            db = connection;
            return db.query(`CALL "CC"."sp_whatsapp_get_service_menu"`);
        })
        .then(result => {
          
            return result;
        })
        .catch(error => {
            console.error('Error calling stored procedure:', error.stack || error);
            throw error;  // Propagate the error for further handling if needed
        })
        .finally(() => {
            if (db) {
                db.close((closeErr) => {
                    if (closeErr) {
                        console.error("Error closing connection:", closeErr);
                    } else {
                        console.log("Connection closed.");
                    }
                });
            }
        });
}

module.exports = {
    getServiceMenu
}
