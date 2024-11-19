// Import the necessary model
const AttendanceRegister = require('./models/AttendanceRegister');
const cache = require('./cache');
const { sendMessage } = require('./sendingtowhatsapp');
const { createTextMessage } = require('./Textmessage');
const {generateRequest} = require('./sendresponse');

// Function to get attendance records by student ID
const getAttendanceByStudentId = async (req, res, id, user) => {



    let headerText
    let bodyText    
    let footerText 
    let buttonTitle 


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
------------------------------------------------------------------------------------------

📩 *Dear ${attendanceRecord.Name},*

We hope this message finds you well. Please find your detailed attendance record for the week below:

---

**Student Information:**

- *Name*: ${attendanceRecord.Name}
- *Student ID*: ${attendanceRecord.StudentID}
- *Grade*: ${attendanceRecord.Grade}
- *Section*: ${attendanceRecord.Section}

---

**Weekly Attendance Overview:**

- *Monday*: ${attendanceRecord.Mon === 'P' ? 'Present' : 'Absent'}
- *Tuesday*: ${attendanceRecord.Tue === 'P' ? 'Present' : 'Absent'}
- *Wednesday*: ${attendanceRecord.Wed === 'P' ? 'Present' : 'Absent'}
- *Thursday*: ${attendanceRecord.Thu === 'P' ? 'Present' : 'Absent'}
- *Friday*: ${attendanceRecord.Fri === 'P' ? 'Present' : 'Absent'}

---

**Attendance Summary:**

- *Total Present Days*: ${attendanceRecord.TotalPresent}
- *Total Absent Days*: ${attendanceRecord.TotalAbsent}
- *Total Late Days*: ${attendanceRecord.TotalLate}
- *Remarks*: ${attendanceRecord.Remarks}

---

Should you have any further questions or require additional information, please do not hesitate to contact us.

Thank you for your attention.

Best regards,  
*Greets Public School*  
------------------------------------------------------------------------------------------
`;


        // Create WhatsApp message and send it
        const whatsappTextMessage = createTextMessage(userid, whatsappResponse);
        await sendMessage(whatsappTextMessage); // Ensure sendMessage is awaited for proper handling

        // Optionally, you might want to send a response back to the client
        
       // here adding back to mainmenu to the last option
         

       headerText = 'Return Back To Mainmenu';
       bodyText = "Discover What's Next – Click Here to Go for More";
       footerText = "";
       buttonTitle = "";

          

       const menuList =[{
        id:'Back to mainmenu',
        title: 'Back to Mainmenu',
        description:'Return Back',
        
    }] 
      const backtomenu = generateRequest(user, headerText, bodyText, footerText, buttonTitle,menuList) 
      sendMessage(backtomenu)




        
    } catch (error) {
        console.error('Error fetching attendance data:', error);
        res.status(500).json({ error: 'Error fetching attendance data' }); // Send error response
    }
};

module.exports = {
    getAttendanceByStudentId
};
