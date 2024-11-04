// Import necessary models
const ParentCredential = require('./models/parentscredentials');
const StudentCredentials = require('./models/studentscredentials');
const cache = require('./cache');

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
           
        
        
        // Step 3: Prepare the response for the student data
        return res.status(200).send({
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": user,
            "type": "interactive",
            "interactive": {
                "type": "list",
                "header": { 
                    "type": "text", 
                    "text": "Hi! You are in the admission portal. Please select from the options." 
                },
                "body": { 
                    "text": "Choose one of the following students to proceed:" 
                },
                "footer": { 
                    "text": "Admission Portal Menu" 
                },
                "action": {
                    "sections": [{
                        "title": "Student Options",
                        "rows": students.slice(0, 2).map(student => ({
                            id: student.id,
                            title: student.name,
                            description: `Details for ${student.name}`
                        }))
                    }]
                }
            }
        });

    } catch (error) {
        console.error('Error fetching student data:', error);
        return res.status(500).json({ error: 'Error fetching student data' }); // Send error response
    }


};

module.exports = {
    getStudentByParentPhone
};
