// Import the necessary model
const AttendanceRegister = require('./models/AttendanceRegister');

// Function to get attendance records by student ID
const getAttendanceByStudentId = async (req, res,id) => {
     // Destructure studentId from the request body

    try {
        

        // Find attendance record by student ID
        const attendanceRecord = await AttendanceRegister.findOne({
            where: { StudentID: id } // Assuming the field name in the table is 'student_id'
        });

        // Check if attendance record is found
        if (!attendanceRecord) {
            return res.status(404).json({ error: 'Attendance record not found for the given student ID' });
        }

        // Return the attendance record
        res.json(attendanceRecord); // Send the fetched attendance data as JSON response
    } catch (error) {
        console.error('Error fetching attendance data:', error);
        res.status(500).json({ error: 'Error fetching attendance data' }); // Send error response
    }
};

module.exports = {
    getAttendanceByStudentId
};
