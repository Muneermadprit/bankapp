const cache = require('./cache');
const Acadamicsdata = require('./models/acadamics');

const { sendMessage } = require('./sendingtowhatsapp');
const { createTextMessage } = require('./Textmessage');

// Function to get attendance records by student ID
const Acadamics = async (req, res, id, user) => {
    // Destructure studentId from the request body
    const userdata = cache.get(user);
    const userid = userdata.id;

    try {
        // Find attendance record by student ID
        const Acadamics = await Acadamicsdata.findOne({
            where: { student_id: id } // Assuming the field name in the table is 'StudentID'
        });

        // Check if attendance record is found
        if (!Acadamics) {
            return res.status(404).json({ error: 'Attendance record not found for the given student ID' });
        }

        // Construct the WhatsApp message
       const whatsappResponse =  `
            Student ID: ${Acadamics.student_id}\n
            Name: ${Acadamics.name}\n
            MATH: ${Acadamics.Math}\n
            SCIENCE: ${Acadamics.Science}\n
            ENGLISH: ${Acadamics.English}\n
            HISTORY: ${Acadamics.History}\n
            GEOGRAPHY: ${Acadamics.Geography}\n
            PHYSICS: ${Acadamics. Physics}\n
            CHEMISTRY: ${Acadamics.Chemistry}\n
            COMPUTER SCIENCE: ${Acadamics.Computer_Science}\n
            PHYSICAL EDUCATION: ${Acadamics.Physical_Education}\n
            ARTS: ${Acadamics.Arts}\n
            ---------------------------`
            


  
    

        // Create WhatsApp message and send it
        const whatsappTextMessage = createTextMessage(userid, whatsappResponse);
        await sendMessage(whatsappTextMessage); // Ensure sendMessage is awaited for proper handling

        // Optionally, you might want to send a response back to the client
        return res.status(200).json({ message: 'Attendance record sent via WhatsApp.' });
        
    } catch (error) {
        console.error('Error fetching attendance data:', error);
        res.status(500).json({ error: 'Error fetching attendance data' }); // Send error response
    }
};

module.exports = {
    Acadamics
};