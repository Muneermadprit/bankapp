// Import the necessary model
const AttendanceRegister = require('./models/AttendanceRegister');
const cache = require('./cache');


// Function to get attendance records by student ID
const getAttendanceByStudentId = async (req, res,id,user) => {
     // Destructure studentId from the request body
     const userdata = cache.get(user)
      
    try {
        

        // Find attendance record by student ID
        const attendanceRecord = await AttendanceRegister.findOne({
            where: { StudentID: id } // Assuming the field name in the table is 'student_id'
        });

        // Check if attendance record is found
        if (!attendanceRecord) {
            return res.status(404).json({ error: 'Attendance record not found for the given student ID' });
        }

        const whatsappResponse = {
            id: "669165b9c87d98ff758518a9", // Example ID, replace with dynamic value if needed
            created_at: new Date().toISOString(),
            topic: "message.sender.user",
            project_id: "663dbb3c09605e5be5b5b1af", // Replace with your actual project ID
            delivery_attempt: "1",
            data: {
                message: {
                    type: "message",
                    id: "669165b91541072a3dc591a3", // Example message ID, replace if needed
                    phone_number: userdata.id, // Replace with the recipient's phone number
                    contact_id: "6645b6de35357c0bfb4af346",
                    sender: "USER",
                    message_content: {
                        text: `Hello, Anoop Anilkumar! Here is your attendance record for this week:\n\n` +
                              `Student Name: ${attendanceRecord.Name}\n` +
                              `Student ID: ${attendanceRecord.StudentID}\n` +
                              `Grade: ${attendanceRecord.Grade}\n` +
                              `Section: ${attendanceRecord.Section}\n\n` +
                              `Weekly Attendance:\n\n` +
                              `- Monday: ${attendanceRecord.Mon === 'P' ? 'Present' : 'Absent'}\n` +
                              `- Tuesday: ${attendanceRecord.Tue === 'P' ? 'Present' : 'Absent'}\n` +
                              `- Wednesday: ${attendanceRecord.Wed === 'P' ? 'Present' : 'Absent'}\n` +
                              `- Thursday: ${attendanceRecord.Thu === 'P' ? 'Present' : 'Absent'}\n` +
                              `- Friday: ${attendanceRecord.Fri === 'P' ? 'Present' : 'Absent'}\n\n` +
                              `Summary:\n\n` +
                              `- Total Present Days: ${attendanceRecord.TotalPresent}\n` +
                              `- Total Absent Days: ${attendanceRecord.TotalAbsent}\n` +
                              `- Total Late Days: ${attendanceRecord.TotalLate}\n` +
                              `- Remarks: ${attendanceRecord.Remarks}`
                    },
                    message_type: "TEXT",
                    status: "DELIVERED",
                    is_HSM: false,
                    userName: "Anoop Anilkumar",
                    countryCode: "91",
                    messageId: "wamid.HBgMOTE3MzU2MzY4NTM2FQIAEhggNTU0RkQxOEFFNUI3MUREMUZFRkFCRkFBREQ5MzFBREQA"
                }
            }
        };
        

        // Send the WhatsApp template response
        res.json(whatsappResponse); // Send the fetched attendance data as JSON response
    } catch (error) {
        console.error('Error fetching attendance data:', error);
        res.status(500).json({ error: 'Error fetching attendance data' }); // Send error response
    }
};

module.exports = {
    getAttendanceByStudentId
};
