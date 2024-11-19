const { getDb } = require('./db'); // Load database connection

async function getServiceMenu() {
    let db;
    try {
        db = await getDb(); // Establish database connection
        console.log('Database connection established.');

        // Call the stored procedure
        const [rows] = await db.query('CALL sp_whatsapp_get_service_menu');
        console.log('Stored procedure executed, raw result:', rows);

        // Check the structure of the result
        if (rows && Array.isArray(rows) && rows.length > 0) {
            return rows[0]; // Assuming the first item contains the relevant data
        } else {
            console.warn('Stored procedure returned an unexpected structure or empty result.');
            return []; // Return an empty array if no data
        }
    } catch (error) {
        console.error('Error executing query:', error);
        throw error; // Propagate error to the caller
    } finally {
        if (db) {
            await db.end(); // Ensure the connection is closed
            console.log('Database connection closed.');
        }
    }
}

module.exports = {
    getServiceMenu,
};
