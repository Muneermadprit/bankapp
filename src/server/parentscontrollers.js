// Import necessary models
const ParentCredential = require('./models/parentscredentials');
const StudentCredentials = require('./models/studentscredentials');
const cache = require('./cache');
const {generateRequest} = require('./sendresponse');
const {sendMessage} = require('./sendingtowhatsapp');
// Define the function
const getStudentByParentPhone = async (user, messageContent, res) => {
    let phoneNumber;
    
    // Fetch user data from cache
    let userdata = cache.get(user);
    userdata.studentid = 0;

    cache.set(user, userdata);

    // Check if the user data has the necessary ID
    if (userdata && userdata.id) {
        phoneNumber = userdata.id; // Set phone number from user data
    } else {
        console.log("Please validate your phone number");
        return res.status(400).json({ error: 'Phone number not validated' }); // Return early with an error response
    }

    try {
        // Step 1: Find the parent record by phone
        const parent = await ParentCredential.findOne({
            where: { phone: phoneNumber.trim() } // Trim to remove any extra spaces
        });

        // Check if parent record is found
        if (!parent) {
            return res.status(404).json({ error: 'Parent not found' });
        }

        // Step 2: Find all student records using the `parentid`
        const students = await StudentCredentials.findAll({
            where: { parentid: parent.parentid }
        });

        // Check if any student records are found
        if (students.length === 0) {
            return res.status(404).json({ error: 'No students found for the given parent' });
        }
        const headerText = 'select from the options'
        const studentData = students.map(student => ({
            id: student.id,
            title: student.name,
            description: student.name,
            
        }));  
          
        const bodyText = '';
        const footerText = '';
        const buttonTitle = 'Select Options';
        
         const newmessage = generateRequest(user, headerText, bodyText, footerText, buttonTitle,studentData) 
       
          sendMessage(newmessage)
          const menuList = students.map(student => ({
            id:'Back to mainmenu',
            title: 'Back to Mainmenu',
            description: student.name,
            
        }));  
          const backtomenu = generateRequest(user, headerText, bodyText, footerText, buttonTitle,menuList) 
          sendMessage(backtomenu)
        // Step 3: Prepare the response for the student data
        

    } catch (error) {
        console.error('Error fetching student data:', error);
        return res.status(500).json({ error: 'Error fetching student data' }); // Send error response
    }


};

module.exports = {
    getStudentByParentPhone
};
