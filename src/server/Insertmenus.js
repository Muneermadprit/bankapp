const db = require('odbc')();
const cn = process.env.ODBC_CONNECTION_URL;

// Define a function to insert a menu record
function insertMenu(menu_id, menu_name, description, display_name, parent_id, has_child, status) {
    // Open the connection
    db.open(cn, function (err) {
        if (err) {
            console.error("Connection error:", err);
            return;
        }

        // Prepare the SQL statement to call the procedure with parameterized inputs
        const sql = `CALL CC.sp_whatsapp_insert(?, ?, ?, ?, ?, ?, ?)`;

        // Set the parameters for the stored procedure
        const params = [menu_id, menu_name, description, display_name, parent_id, has_child, status];

        // Call the procedure
        db.query(sql, params, function (err, result) {
            if (err) {
                console.error("Query error:", err);
            } else {
                console.log("Insert successful:", result);
            }

            // Close the connection after the query
            db.close((closeErr) => {
                if (closeErr) {
                    console.error("Error closing connection:", closeErr);
                } else {
                    console.log("Connection closed.");
                }
            });
        });
    });
}

// Usage example

