const cache = require('./cache');
const { getDb } = require('./db');

const setUserVerification = async (phonenumber) => {
    try {
        const db = await getDb(); // Ensure the connection is available
        const [result] = await db.query('CALL UpdatePhoneNumber(?)', [phonenumber]);
        return result;
    } catch (error) {
        console.error('Error updating phone number:', error);
        throw error; // Re-throw the error after logging
    }
};

module.exports = {
    setUserVerification
}
