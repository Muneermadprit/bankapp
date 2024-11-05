// Import the necessary model
const AttendanceRegister = require('./models/AttendanceRegister');
const cache = require('./cache');
const { sendMessage } = require('./sendingtowhatsapp');
const { createTextMessage } = require('./Textmessage');

// Function to get attendance records by student ID
const getAttendanceByStudentId = async (req, res, id, user) => {
    // Destructure studentId from the request body
    const userdata = cache.get(user);
    const userid = userdata.id;

    try {
        // Find attendance record by student ID
        const attendanceRecord = await AttendanceRegister.findOne({
            where: { StudentID: id } // Assuming the field name in the table is 'StudentID'
        });

        // Check if attendance record is found
        if (!attendanceRecord) {
            return res.status(404).json({ error: 'Attendance record not found for the given student ID' });
        }

        // Construct the WhatsApp message
        const whatsappResponse = `
            Hello, ${attendanceRecord.Name}! Here is your attendance record for this week:\n\n
            Student Name: ${attendanceRecord.Name}\n
            Student ID: ${attendanceRecord.StudentID}\n
            Grade: ${attendanceRecord.Grade}\n
            Section: ${attendanceRecord.Section}\n\n
            Weekly Attendance:\n\n
            - Monday: ${attendanceRecord.Mon === 'P' ? 'Present' : 'Absent'}\n
            - Tuesday: ${attendanceRecord.Tue === 'P' ? 'Present' : 'Absent'}\n
            - Wednesday: ${attendanceRecord.Wed === 'P' ? 'Present' : 'Absent'}\n
            - Thursday: ${attendanceRecord.Thu === 'P' ? 'Present' : 'Absent'}\n
            - Friday: ${attendanceRecord.Fri === 'P' ? 'Present' : 'Absent'}\n\n
            Summary:\n\n
            - Total Present Days: ${attendanceRecord.TotalPresent}\n
            - Total Absent Days: ${attendanceRecord.TotalAbsent}\n
            - Total Late Days: ${attendanceRecord.TotalLate}\n
            - Remarks: ${attendanceRecord.Remarks}
        `;

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
    getAttendanceByStudentId
};
