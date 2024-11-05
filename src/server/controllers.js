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
const {generateRequest} = require('./sendresponse');
const {sendMessage} = require('./sendingtowhatsapp');
const {getStudentByParentPhone} = require('./parentscontrollers');
const {Sendotp,otpVerification} = require('./sendotp');
const { getAttendanceByStudentId} = require('./AttendanceCheck')

const {  createTextMessage} = require('./Textmessage');
const { acadamics} = require('./Acdamicflow')
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


const admission = (req, res, user, messageContent,userstatus) => {
   
    console.log(messageContent,'message content in funsction')

    // Initialize userstatus if `admission` is not in currentstatus
   

    // Update userstatus based on message content

   

    switch (messageContent) {
        case 'ApplicationStatus':
            userstatus = { ...userstatus, path: 1 };
            cache.set(user, userstatus);
            break;

        case 'ApplicationSubmission':
            userstatus = { ...userstatus, path: 2 };
            cache.set(user, userstatus);
            break;
    }

    // Response based on userstatus.admission value
    switch (userstatus.path) {
        case 0:
            return res.status(200).send({
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": user,
                "type": "interactive",
                "interactive": {
                    "type": "list",
                    "header": { "type": "text", "text": "Hi! You are in the admission portal. Please select from the options." },
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

           if (!('varification' in userstatus)){
            userstatus = { ...userstatus, varification: 'validation' };
            console.log(userstatus.varification)
            cache.set(user, userstatus);
            return res.status(200).send({
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": user,
                "type": "interactive",
                "interactive": {
                    "type": "list",
                    "header": { "type": "text", "text": "You have to use your Registerd phonenumber. For continew" },
                    "body": { "text": "Choose one of the following options to proceed:" },
                    "footer": { "text": "Academics Portal Menu" },
                    "action": {
                        "sections": [{
                            "title": "Admission Options",
                            "rows": [
                                { "id": "yes", "title": "Yes i have", "description": "Check your child's last week attendance." },
                                { "id": "No", "title": "No I dont have", "description": "Check pending assignments." },
                                
                            ]
                        }]
                    }
                }
            });
            
        
           }
           else {

            switch(userstatus.varification){
                case 'validation':
                    console.log('entrance')
                    userstatus = { ...userstatus, varification: 'pending' };
                    cache.set(user, userstatus);
                    const phoneRegex = /^\+?[1-9]\d{1,14}$/;  
                    let otpSent = false; // E.164 format
                    if (phoneRegex.test(userstatus.id)) {
                        if (!otpSent) { // Check if `Sendotp` has already been called
                            otpSent = true; // Set the flag to true to prevent further calls
                            Sendotp(user,messageContent).catch((error) => console.error('Error in Sendotp:', error));
                        }
                        return res.status(200).send({
                            "messaging_product": "whatsapp",
                            "recipient_type": "individual",
                            "to": user,
                            "type": "text",
                            "text": {
                                "body": "please enter your OTP"
                            }
                        }); 
                       
                    } else {
                        // Optional: handle invalid phone number format
                        res.status(400).send({
                            "error": "Invalid phone number format. Please enter a valid phone number in the correct format."
                        });
                
                
                    }

                    case 'pending':
                        console.log('we are in pending side');
                        
                        // Call the OTP verification function
                        otpVerification(user, messageContent, res);
                        
                        // Retrieve the verification status from the cache
                        let isVerified = cache.get(user);
                        
                        // Check if the retrieved data is valid and contains varification
                        if (isVerified && isVerified.varification === 'varified') {
                            console.log("we are in verified condition");
                            
                            // Send a response indicating the next step
                            return res.status(200).send({
                                "messaging_product": "whatsapp",
                                "recipient_type": "individual",
                                "to": user,
                                "type": "text",
                                "text": {
                                    "body": "your application status is pending . After the varification of submitted data we will contact you"
                                }
                            });
                        } else {
                            console.log("User is not verified yet or verification status is invalid.");
                            
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
                        break;
                    
            case'varified':

           
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
          


           }
           

        case 2:
            
           if (!('varification' in userstatus)){
            userstatus = { ...userstatus, varification: 'validation' };
            console.log(userstatus.varification)
            cache.set(user, userstatus);
            return res.status(200).send({
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": user,
                "type": "interactive",
                "interactive": {
                    "type": "list",
                    "header": { "type": "text", "text": "You have to use your Registerd phonenumber. For continew" },
                    "body": { "text": "Choose one of the following options to proceed:" },
                    "footer": { "text": "Academics Portal Menu" },
                    "action": {
                        "sections": [{
                            "title": "Admission Options",
                            "rows": [
                                { "id": "yes", "title": "Yes i have", "description": "Check your child's last week attendance." },
                                { "id": "No", "title": "No I dont have", "description": "Check pending assignments." },
                                
                            ]
                        }]
                    }
                }
            });
            
        
            
        
           }
           else {

            switch(userstatus.varification){
                case 'validation':
                    console.log('entrance')
                    userstatus = { ...userstatus, varification: 'pending' };
                    cache.set(user, userstatus);
                    const phoneRegex = /^\+?[1-9]\d{1,14}$/;  
                    let otpSent = false; // E.164 format
                    if (phoneRegex.test(userstatus.id)) {
                        if (!otpSent) { // Check if `Sendotp` has already been called
                            otpSent = true; // Set the flag to true to prevent further calls
                            Sendotp(user,messageContent).catch((error) => console.error('Error in Sendotp:', error));
                        }
                        return res.status(200).send({
                            "messaging_product": "whatsapp",
                            "recipient_type": "individual",
                            "to": user,
                            "type": "text",
                            "text": {
                                "body": "please enter your OTP"
                            }
                        }); 
                       
                    } else {
                        // Optional: handle invalid phone number format
                        res.status(400).send({
                            "error": "Invalid phone number format. Please enter a valid phone number in the correct format."
                        });
                
                
                    }

                       
                    case 'pending':
                        console.log('we are in pending side');
                        
                        // Call the OTP verification function
                        otpVerification(user, messageContent, res);
                        
                        // Retrieve the verification status from the cache
                        let isVerified = cache.get(user);
                        
                        // Check if the retrieved data is valid and contains varification
                        if (isVerified && isVerified.varification === 'varified') {
                            console.log("we are in verified condition");
                            
                            // Send a response indicating the next step
                            return res.status(200).send({
                                "messaging_product": "whatsapp",
                                "recipient_type": "individual",
                                "to": user,
                                "type": "text",
                                "text": {
                                    "body": "Submit your application without the website portal. https://admission.gps.ac.in/"
                                }
                            });
                        } else {
                            console.log("User is not verified yet or verification status is invalid.");
                            
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
                        break;
                    
            case'varified':

           
            return res.status(200).send({
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": user,
                "type": "text",
                "text": {
                    "body": "submit your application with out website portal . https://admission.gps.ac.in/"
                }
            }); 

            



            }
          


           }
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
        let messageContent 
        let userCache = cache.get(user) || { id: user,counter:0 };
        let counter = userCache.counter;
       
        


        console.log(`User: ${user}, Counter: ${userCache.counter}`);

              if(req.topic=="message.sender.user"){


                if ( messageType === 'BUTTON_REPLY' && messageContent=='Back to mainmenu')  {
                    messageContent =  req.body.data.message.message_content.id;
                    if(messageContent=='Back to mainmenu')
                   userCache.counter = 0;
                   cache.set(user, userCache);
               }

       
       
                 // Inactivity timeout: reset counter if no activity for 3 minutes
                 setTimeout(() => {
                   const userCache = cache.get(user);
                   if (userCache && Date.now() - userCache.lastInteraction > 3 * 60 * 1000) {
                       cache.set(user, { counter: 0 });
                       console.log(`User ${user} counter reset due to inactivity.`);
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
                           const result = await handleQueryWithGPT(messageContent, 'cochincomputing');
                           console.log(result)
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

              }

     
        // Reset counter if "Back to mainmenu" is selected
        

      
        // Main menu or submenu based on counter value
        if (userCache.counter === 0) {
            cache.set(user, { counter: 1 });
            const headerText = 'Academic portal: Please select an option below';
            let menuList = [
                {
                    id: 'ADMISSION',
                    title: 'ADMISSION',
                    description: 'Admission-related queries'
                },
                {
                    id: 'ACADAMICS',
                    title: 'ACADAMICS',
                    description: 'Academic-related queries for your children'
                },
                {
                    id: 'ACTIVITIES',
                    title: 'ACTIVITIES',
                    description: 'Your children’s extracurricular activities'
                },
                {
                    id: 'EVENTS',
                    title: 'EVENTS',
                    description: 'School events'
                },
                {
                    id: 'NOTICE BOARD',
                    title: 'NOTICE BOARD',
                    description: 'Notices related to school activities for teachers and students'
                }
            ];
            const bodyText = '';
            const footerText = '';
            const buttonTitle = 'Select Options';
            
             const message = generateRequest(user, headerText, bodyText, footerText, buttonTitle,menuList) 
              console.log(message)
             sendMessage(message);
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
                userstatus = currentstatus;
                console.log(userstatus)
            }
        
            // Make sure userstatus is defined before accessing position
            switch (userstatus.position) {
                case 'ADMISSION':
                    if (!('path' in userstatus)) {
                        // Initialize admission if not present
                        userstatus = { ...userstatus, path: 0 };
                        console.log(userstatus)

                        cache.set(user, userstatus);
                        admission(req, res, user, messageContent, userstatus); 
                        console.log("In the admission portal");
                    }
                    else{
                        admission(req, res, user, messageContent, userstatus);  
                    }
                    break; // Handle admission logic
        
                case 'ACADAMICS':
                    if (!('path' in userstatus)) {
                        // Initialize admission if not present
                        userstatus = { ...userstatus, path: 0 };
                        console.log(userstatus)

                        cache.set(user, userstatus);
                        acadamics(user, userstatus, res, req,messageContent); 
                        console.log("In the admission portal");
                    }
                    else{
                        acadamics(user, userstatus, res, req,messageContent);  
                    }
                    break; // Handle admission logic


                case 'ACTIVITIES':
                case 'School Notices':
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
        // Knowledge base definition
        const knowledgeBase = [
            {
                name: "cochincomputing",
                industry: "IT Solutions",
                info: infoText
            },
            // Add more entries as needed
        ];

        // Search for knowledge entry
        const knowledgeEntry = knowledgeBase.find(entry => entry.name.toLowerCase() === companyName.toLowerCase());
       
        // Create prompt
        const prompt = knowledgeEntry 
            ? `About ${knowledgeEntry.name} in the ${knowledgeEntry.industry} industry: ${knowledgeEntry.info}. User asks: ${message}.` 
            : `User asks: ${message}. Provide a detailed response.`;
    
        // Load API key (use environment variables in production)
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
            throw new Error('OpenAI API key is missing');
        }

        // Generate response from GPT
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 100, // Reduced token count
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        // Check for response structure
        if (response.data.choices && response.data.choices.length > 0) {
            const gptResponse = response.data.choices[0].message.content.trim();
            return {
                message: gptResponse,
               
            };
        } else {
            throw new Error('Unexpected response structure from GPT API');
        }
    } catch (error) {
        console.error(`Error handling GPT query: ${error.message}`);
        throw new Error(`Error handling GPT query: ${error.message}`);
    }
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

