'use strict';

const db = require('./db');
const { collection, addDoc, getDocs,query, where, writeBatch,doc, getDoc   } = require('firebase/firestore');
const Students = require('./models/studentscredentials');
const Acadamics = require('./models/acadamics');
const Parentscredentials = require('./models/parentscredentials');
const AttendanceRegister = require('./models/AttendanceRegister');
const Query = require('./models/querys');
const axios = require('axios');
const fs = require('fs');
const {fetchuser} = require('./IsUser_Registerd');
const {generateRequest} = require('./sendresponse');
const {Events} = require('./Eventsflow')
const {sendMessage} = require('./sendingtowhatsapp');
const {fetchAndSendMenu} = require('./fetch_data_and _send_message');
const {getStudentByParentPhone} = require('./parentscontrollers');
const {Sendotp,otpVerification} = require('./sendotp');
const { getAttendanceByStudentId} = require('./AttendanceCheck')

const {  createTextMessage} = require('./Textmessage');
const { acadamics} = require('./Acdamicflow')
const { activities} = require('./Activitiesflow')
const cache = require('./cache'); // Global cache with TTL of 180 seconds
const user = new Map();
// Read the contents of the text file
const infoText = fs.readFileSync('cochincomputing_info.txt', 'utf8');
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32); // 32 bytes for aes-256-cbc
const iv = crypto.randomBytes(16);  // 16 bytes IV for AES

const cipher = crypto.createCipheriv(algorithm, key, iv);










































// function for admission process you can change and modify this code when you want to change the admission flow


const admission = (req, res, user, messageContent,userstatus,messageType) => {

    console.log(messageContent,'message content in funsction')

    let headerText = 'Admission portal: Please select an option below';
    let bodyText = '';  
    let footerText = '';
    let buttonTitle = 'Select Options';

    // Initialize userstatus if `admission` is not in currentstatus


    // Update userstatus based on message content



    switch (messageContent) {
        case 'ApplicationStatus':
            userstatus = { ...userstatus, path: 1 };
            cache.set(user, userstatus);
            break;

        case 'SubmitApplication':
            userstatus = { ...userstatus, path: 2 };
            cache.set(user, userstatus);
            break;
            default:
                if( userstatus.path<0){


                    bodyText  =` The selected option is not identified please select a valid option `







                        headerText = 'Report Summary: Key Details and Insights';

                        footerText = "";
                        buttonTitle = "";



                        const menuList =[{
                         id:'Back to mainmenu',
                         title: 'Back to Mainmenu',
                         description:'Return Back',

                     }] 
                       const backtomenu = generateRequest(user, headerText, bodyText, footerText, buttonTitle,menuList) 
                       sendMessage(backtomenu)


                }
    }

    // Response based on userstatus.admission value
    switch (userstatus.path) {
        case 0:
            userstatus = { ...userstatus, path: -1 };
             headerText = 'Admission portal: Please select an option below';
             bodyText = 'For updates on your admission status, log in to the portal and review the latest information.';  
             footerText = '';
             buttonTitle = 'Select Options';
                 let position = cache.get('Position')

                    fetchAndSendMenu(2,user,headerText,footerText,buttonTitle,bodyText,position);








            return res.status(200).send({
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": user,
                "type": "interactive",
                "interactive": {
                    "type": "list",
                    "header": { "type": "text", "text": "Hi! You are in the admission portal" },
                    "body": { "text": "Choose one of the following options to proceed:" },
                    "footer": { "text": "Admission Portal Menu" },
                    "action": {
                        "sections": [{
                            "title": "Admission Options",
                            "rows": [
                                { "id": "ApplicationStatus", "title": "Application Status", "description": "Check your admission application status" },
                                { "id": "ApplicationSubmission", "title": "Application Submission", "description": "Submit your application" }
                            ]
                        }]
                    }
                }
            });

        case 1:
            if(userstatus.path == 1){



                (async () => {
                    try {
                        // Wait for the function to complete before proceeding
                        await getStudentByParentPhone(user, messageContent, res);

                        // After the function completes, update the userstatus and cache
                        userstatus = { ...userstatus, path: 11 };
                        cache.set(user, userstatus);

                        // Send a response indicating the next step
                        console.log('Function completed and cache updated.');
                    } catch (error) {
                        console.error('Error in getStudentByParentPhone:', error);
                    }
                })();









                                    // Send a response indicating the next step

                                } else {
                                    console.log("User is selected a invalid path check and get more data about this.");

                                    // Optionally send a response or handle the non-verified case here
                                    return res.status(403).send({
                                        "messaging_product": "whatsapp",
                                        "recipient_type": "individual",
                                        "to": user,
                                        "type": "text",
                                        "text": {
                                            "body": "You need to complete verification before submitting your application."
                                        }
                                    });
                                }

            case 11:


            if(userstatus.path == 11 ){

                if(messageType == 'BUTTON_REPLY'){
                    bodyText ='your application status is pending . After the varification of submitted data we will contact you'
             footerText = '';
             buttonTitle = 'Select Options';

            const menuList = [{
             id: 'Back to mainmenu',
             title: 'Back to mainmenu',
             description: 'Admission-related queries'

            }]

            const message = generateRequest(user, headerText, bodyText , footerText, buttonTitle,menuList) 
            console.log(message)
    console.log(   sendMessage(message))      



                }
                else{
                    bodyText  =` The selected option is not identified please select a valid option `







                    headerText = 'Report Summary: Key Details and Insights';

                    footerText = "";
                    buttonTitle = "";



                    const menuList =[{
                     id:'Back to mainmenu',
                     title: 'Back to Mainmenu',
                     description:'Return Back',

                 }] 
                   const backtomenu = generateRequest(user, headerText, bodyText, footerText, buttonTitle,menuList) 
                   sendMessage(backtomenu)

                }


                  }











            //



            return res.status(200).send({
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": user,
                "type": "text",
                "text": {
                    "body": "Your Application are in pending . After valuation we will inform you"
                }
            }); 











//
        case 2:

        if(userstatus.path == 2){



            (async () => {
                try {
                    // Wait for the function to complete before proceeding
                    await getStudentByParentPhone(user, messageContent, res);

                    // After the function completes, update the userstatus and cache
                    userstatus = { ...userstatus, path: 12 };
                    cache.set(user, userstatus);

                    // Send a response indicating the next step
                    console.log('Function completed and cache updated.');
                } catch (error) {
                    console.error('Error in getStudentByParentPhone:', error);
                }
            })();









                                // Send a response indicating the next step

                            } else {
                                console.log("User is selected a invalid path check and get more data about this.");

                                // Optionally send a response or handle the non-verified case here
                                return res.status(403).send({
                                    "messaging_product": "whatsapp",
                                    "recipient_type": "individual",
                                    "to": user,
                                    "type": "text",
                                    "text": {
                                        "body": "You need to complete verification before submitting your application."
                                    }
                                });
                            }


            case 12:


            if(userstatus.path == 11 ){

                if(messageType == 'BUTTON_REPLY'){
                    bodyText ='For Submit your application Visit  '
                    footerText = '';
                    buttonTitle = 'Select Options';

                    menuList = [{
                    id: 'Back to mainmenu',
                    title: 'Back to mainmenu',
                    description: 'Admission-related queries'

                   }]

                    message = generateRequest(user, headerText, bodyText , footerText, buttonTitle,menuList) 
                   console.log(message)
           console.log(   sendMessage(message)) 



           return res.status(200).send({
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": user,
            "type": "text",
            "text": {
                "body": "Your Application are in pending . After valuation we will inform you"
            }
        }); 


                }
                else{
                    bodyText  =` The selected option is not identified please select a valid option `







                    headerText = 'Report Summary: Key Details and Insights';

                    footerText = "";
                    buttonTitle = "";



                    const menuList =[{
                     id:'Back to mainmenu',
                     title: 'Back to Mainmenu',
                     description:'Return Back',

                 }] 
                   const backtomenu = generateRequest(user, headerText, bodyText, footerText, buttonTitle,menuList) 
                   sendMessage(backtomenu)

                }


                  }










            //













        default:
            console.log("Unrecognized option.");
            console.log(userstatus.varification)
            break;
    }

    // Handle Main Menu or unknown response
    if (messageContent === 'MainMenu') {
        return res.status(200).send({
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": user,
            "type": "text",
            "text": {
                "body": "Returning to the main menu. Type 'Start' to begin again."
            }
        });
    } else {
        return res.status(200).send({
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": user,
            "type": "text",
            "text": {
                "body": "I'm sorry, I didn't understand that. Please choose an option from the menu."
            }
        });
    }
};


// The ending portion of admission fuction 






// Example usage:
// const request = { BankCode: 'XYZ', MobileNo: '1234567890', OTP: '123456' };
// GetOtpToTheClient(request).then(response => console.log(response));







// get messages from Ai sysny and process wher to go
// Controller function to handle queries with GPT integration
const decidewheretogo = async (req, res) => {
    try {
        const user = req.body.data.message.phone_number;
        const messageType = req.body.data.message.message_type;
        const messageTitle = req.body.data.message.message_content.title
        let messageContent 
        let userCache =cache.get(user) || { id: user,counter:0 }
        let counter = userCache.counter;

        let bodyText 
        let headerText
        let footerText 
        let buttonTitle 



      //getting the consent from the user are done in this part 












        console.log(`User: ${user}, Counter: ${userCache.counter}`);




                if ( messageType === 'BUTTON_REPLY' )  {
                    messageContent =  req.body.data.message.message_content.id;
                    if(messageContent=='Back to mainmenu'){
                   userCache.counter = 0;
                   cache.set(user, userCache);}
               }



                 // Inactivity timeout: reset counter if no activity for 3 minutes
                 setTimeout(() => {
                   const userCache = cache.get(user);
                   if (userCache && Date.now() - userCache.lastInteraction > 3 * 60 * 1000) {
                       cache.set(user, { counter: 0 });
                       cache.set('varification',true)
                       console.log(`User ${user} counter reset due to inactivity.`);
                       cache.set('Position','')
                   }
               }, 3 * 60 * 1000);



               // Handle initial text interaction
               if (messageType === 'TEXT') {
                   if (counter === 0) {
                       messageContent = req.body.data.message.message_content.text;

                       console.log("Initial interaction, counter set to 1.");
                   } else if (counter === 1) {
                       messageContent = req.body.data.message.message_content.text;
                       const headerText = 'Hai Iam The Ai Agent feel free to ask '
                       console.log(`Processing user query: ${messageContent}`);
                       try {
                           const result = await handleQueryWithGPT(messageContent, 'Greets public school');
                           console.log(result)
                           if(cache.get(user).gpt==1){
                           
                            whatsapptextmessages =  createTextMessage(user,result.message)
                             sendMessage(whatsapptextmessages);

                           }
                           else{
                            const bodyText = result.message;
                            const footerText = '';
                            const buttonTitle = 'Select Options';
 
                            const menuList = [{
                             id: 'Back to mainmenu',
                             title: 'Back to mainmenu',
                             description: 'Admission-related queries'
 
                            }]
 
                            const message = generateRequest(user, headerText, bodyText, footerText, buttonTitle,menuList) 
                            console.log(message)
                           sendMessage(message);
                           }
                          
                       } catch (error) {
                           console.error(`Error handling query: ${error.message}`);
                           return res.status(500).send(`Error handling query: ${error.message}`);
                       }
                   }
               } else if (messageType === 'LIST_REPLY' && counter === 1) {
                   messageContent = req.body.data.message.message_content.postbackText;
                   cache.set(user, { id:user, counter: 2 });
                   userCache = cache.get(user)
                  console.log(userCache)
                   console.log("List reply received, counter set to 2.");
                   console.log(messageContent)
               }
               else if (messageType === 'LIST_REPLY' && counter === 2) {
                   messageContent = req.body.data.message.message_content.postbackText;
                   const userdata = cache.get(user);
                   userdata.counter = 2;
                  console.log(userCache)
                   console.log("List reply received, counter set to 2.");
                   console.log(messageContent)
               }
               if (messageType === 'TEXT' && counter === 2) {
                console.log('we are in text counter 2')
                   messageContent = req.body.data.message.message_content.text;
                   const userdata = cache.get(user);
                   userdata.counter = 2;
                  console.log(userCache)
                   console.log("List reply received, counter set to 3.");
                   console.log(messageContent)
               }
               if (messageType === 'BUTTON_REPLY' && counter === 2) {
                   messageContent = req.body.data.message.message_content.id;
                   const userdata = cache.get(user);
                   userdata.counter = 2;
                  console.log(userCache)
                   console.log("List reply received, counter set to 3.");
                   console.log(messageContent)
               }


               if(messageContent == 'backtomainmenu'){
                userCache.counter = 0;
                cache.set(user, userCache);
               }








        if (userCache.counter === 0 ) {

          // check the user is in the 


          (async () => {
            try {
              let result = await fetchuser(user,messageContent,userCache,res);
              console.log(result,'The result is on the way');
            } catch (error) {
              console.error("Error fetching user:", error);
            }
          })();











        } else if (userCache.counter === 2) {
            console.log("welcome to the world of history");
            let currentstatus = cache.get(user) || {}; // Ensure currentstatus is an object
           console.log(currentstatus)
            let userstatus;

            if (!('position' in currentstatus)) {
                console.log("welcome to secrets");
                userstatus = { id: user, counter: 2, position: messageContent };
                cache.set(user, userstatus);
            } else {
                // Use currentstatus if it exists
                if (messageContent == "ADMISSION" && messageContent == "ACADAMICS" && messageContent == "ACTIVITIES" && messageContent == "EVENTS") {
                    userstatus = currentstatus;
                    bodyText  =` The selected option is not identified please select a valid option `







                    headerText = 'Report Summary: Key Details and Insights';

                    footerText = "";
                    buttonTitle = "";



                    const menuList =[{
                     id:'Back to mainmenu',
                     title: 'Back to Mainmenu',
                     description:'Return Back',

                 }] 
                   const backtomenu = generateRequest(user, headerText, bodyText, footerText, buttonTitle,menuList) 
                   sendMessage(backtomenu)
                }
                userstatus = currentstatus

            }

            // Make sure userstatus is defined before accessing position
            switch (userstatus.position) {
                case 'ADMISSION':
                    if (!('path' in userstatus)) {
                        // Initialize admission if not present
                        userstatus = { ...userstatus, path: 0 };
                        console.log(userstatus)

                        cache.set(user, userstatus);
                        admission(req, res, user, messageContent, userstatus,messageType); 
                        console.log("In the admission portal");
                    }
                    else{
                        admission(req, res, user, messageContent, userstatus,messageType);  
                    }
                    break; // Handle admission logic

                case 'ACADAMICS':
                    if (!('path' in userstatus)) {
                        // Initialize admission if not present
                        userstatus = { ...userstatus, path: 0 };
                        console.log(userstatus)

                        cache.set(user, userstatus);
                        acadamics(user, userstatus, res, req,messageContent, messageTitle,messageType ); 
                        console.log("In the admission portal");
                    }
                    else{
                        acadamics(user, userstatus, res, req,messageContent, messageTitle,messageType );  

                    }
                    break; // Handle admission logic


                case 'ACTIVITIES':
                    if (!('path' in userstatus)) {
                        // Initialize admission if not present
                        userstatus = { ...userstatus, path: 0 };
                        console.log(userstatus)

                        cache.set(user, userstatus);
                        activities(user, userstatus, res, req,messageContent,messageTitle,messageType); 
                        console.log("In the admission portal");
                    }
                    else{
                        activities(user, userstatus, res, req,messageContent,messageTitle,messageType);  
                    }
                    break; // Handle admission logic
                case 'EVENTS':
                    if (!('path' in userstatus)) {
                        // Initialize admission if not present
                        userstatus = { ...userstatus, path: 0 };
                        console.log(userstatus)

                        cache.set(user, userstatus);
                        Events(user, userstatus, res, req,messageContent,messageTitle,messageType); 
                        console.log("In the admission portal");
                    }
                    else{
                        Events(user, userstatus, res, req,messageContent,messageTitle,messageType);  
                    }

                case 'Upcoming Events':
                    console.log(`The message is ${messageContent}.`);
                    break;

                default:
                    console.log("Unrecognized option.");
            }
        }

    } catch (error) {
        console.error(`Error handling request: ${error.message}`);
        res.status(500).send(`Error handling request: ${error.message}`);
    }
};


// Controller function to handle queries with GPT integration
const handleQueryWithGPT = async (message, companyName) => {
    try {
        const knowledgeBase = [
            {
                name: "Greets Public School",
                industry: "Education",
                info: infoText,
                brochureLink: "https://example.com/brochure/greeks-public-school.pdf",
            },
        ];

        const greetings = ["hai", "helo", "hello", "hi", "hoi", "hey"];
        const isGreeting = greetings.some(greet => message.toLowerCase().trim() === greet);

        const brochureSynonyms = ["brochure", "catalog", "leaflet", "pamphlet", "details", "booklet", "document"];
        const brochureRequestDetected = brochureSynonyms.some(word =>
            message.toLowerCase().includes(word.toLowerCase())
        ) || inferBrochureIntent(message);

        const knowledgeEntry = knowledgeBase.find(entry =>
            entry.name.toLowerCase() === companyName.toLowerCase()
        );

        if (isGreeting) {
            return { message: "Hello! How can I help you?" };
        }

        if (brochureRequestDetected) {
            if (knowledgeEntry?.brochureLink) {
                return {
                    message: `Here is the brochure for ${knowledgeEntry.name}. You can download it using this link: [Download Brochure](${knowledgeEntry.brochureLink})`,
                };
            } else {
                return { message: `Sorry, we couldn't find a brochure for ${companyName}. Please contact us for more details.` };
            }
        }

        const prompt = knowledgeEntry
            ? `About ${knowledgeEntry.name} in the ${knowledgeEntry.industry} industry. User asks: ${message}. Provide a clear and concise response in 3-4 points, ensuring the final point is a comprehensive conclusion, and the entire response stays within 200 tokens.`
            : `User asks: ${message}. Provide a clear and concise response in 3-4 points. Ensure the final point is a comprehensive conclusion, and the entire response is structured so it stays within 160 tokens.`;

        const apiKey = process.env.OpenApikey;
        if (!apiKey) throw new Error('OpenAI API key is missing');

        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4',
                messages: [{ role: 'user', content: prompt }],
                
                max_tokens: 180,
                temperature: 0.7,
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        if (response.data.choices?.[0]?.message?.content) {
            return { message: response.data.choices[0].message.content.trim() };
        } else {
            throw new Error('Unexpected GPT response structure');
        }
    } catch (error) {
        console.error(`Error handling GPT query: ${error.message}`);
        return { message: "An error occurred while processing your query. Please try again later." };
    }
};

const inferBrochureIntent = (message) => {
    const indicativePhrases = [
        "send me the details", "information packet", "full details", 
        "material about", "documents for", "guide about", "information on"
    ];
    return indicativePhrases.some(phrase => message.toLowerCase().includes(phrase.toLowerCase()));
};




const getAllParentsCredentials = async (req, res) => {
    try {
        const parents = await Parentscredentials.findAll();
        res.json(parents); // Send the fetched data as JSON response
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' }); // Send error response
    }
};

const getAllStudentsCredential = async (req, res) => { 
    try {
        const students = await Students.findAll(); // Fetch all records from the studentscredential table
        res.json(students); // Send the fetched data as JSON response
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' }); // Send error response
    }
};

const getAllAttendanceRecords = async (req, res) => { 
    try {
        const attendanceRecords = await AttendanceRegister.findAll(); // Fetch all records from the AttendanceRegister table
        res.json(attendanceRecords); // Send the fetched data as JSON response
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' }); // Send error response
    }
};


const getAllAcademicRecords = async (req, res) => {  
    try {
        const attendanceRecords = await Acadamics.findAll(); // Fetch all records from the AttendanceRegister table
        res.status(200).json({ data: attendanceRecords }); // Send the fetched data as JSON response
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Error fetching data' }); // Send error response
    }
};












module.exports = {


    decidewheretogo, 
    getAllParentsCredentials,
    getAllStudentsCredential,
    getAllAttendanceRecords,
    getAllAcademicRecords,
    getStudentByParentPhone,
    getAttendanceByStudentId,


};

