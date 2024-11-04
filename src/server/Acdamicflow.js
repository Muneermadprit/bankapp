const cache = require('./cache');
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32); // 32 bytes for aes-256-cbc
const iv = crypto.randomBytes(16);  // 16 bytes IV for AES

const cipher = crypto.createCipheriv(algorithm, key, iv);

const {getStudentByParentPhone} = require('./parentscontrollers');
const {getAttendanceByStudentId} = require('./AttendanceCheck');

const {Sendotp,otpVerification} = require('./sendotp');
const acadamics = (user, userstatus, res, req,messageContent) => {
   



    // Retrieve messageContent from req.body if defined
  console.log("welcome acadamic function")
      console.log(messageContent,'messagehere')
    // Set path in userstatus based on messageContent
    switch (messageContent) {
        case 'Attendance':
            userstatus = { ...userstatus, path: 1 };
            break;
        case 'Pending Assignments':
            userstatus = { ...userstatus, path: 2 };
            break;
        case 'Progress':
            userstatus = { ...userstatus, path: 3 };
            break;
        case 'Report from classteacher':
            userstatus = { ...userstatus, path: 4 };
            break;
        case 'Check pending fees':
            userstatus = { ...userstatus, path: 5 };
            break;
       
    }

    cache.set(user, userstatus);

    console.log(cache.get(user))
    // Handle the main menu or specific options based on path
    switch (userstatus.path) {
        case 0:
            return res.status(200).send({
                "messaging_product": "whatsapp",
                "recipient_type": "individual",
                "to": user,
                "type": "interactive",
                "interactive": {
                    "type": "list",
                    "header": { "type": "text", "text": "Hi! You are in the academic portal. Please select from the options." },
                    "body": { "text": "Choose one of the following options to proceed:" },
                    "footer": { "text": "Academics Portal Menu" },
                    "action": {
                        "sections": [{
                            "title": "Admission Options",
                            "rows": [
                                { "id": "Attendance", "title": "Attendance", "description": "Check your child's last week attendance." },
                                { "id": "Pending Assignments", "title": "Pending Assignments", "description": "Check pending assignments." },
                                { "id": "Progress", "title": "Progress Report", "description": "Check the latest marksheet." },
                                { "id": "Report from classteacher", "title": "Class Teacher Report", "description": "Overall performance and suggestions." },
                                { "id": "Check pending fees", "title": "Fees Status", "description": "Check pending fees status." }
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
                            if(!('stuentid' in userstatus)){
                                getStudentByParentPhone(user,messageContent,res)
                            }


                            // Send a response indicating the next step
                           
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
            console.log()

          switch(userstatus.studentid ){
            case 0 :  getAttendanceByStudentId (req, res,messageContent)

          }

            



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
                "type": "text",
                "text": {
                    "body": "Please enter your Registerd phonenumber."
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
                    if (phoneRegex.test(messageContent)) {
                        if (!otpSent) { // Check if `Sendotp` has already been called
                            otpSent = true; 
                            const user = cache.get(user)// Set the flag to true to prevent further calls
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
       
    }
}


module.exports = {
    acadamics
};
