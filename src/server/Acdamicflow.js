const cache = require('./cache');
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32); // 32 bytes for aes-256-cbc
const iv = crypto.randomBytes(16);  // 16 bytes IV for AES

const cipher = crypto.createCipheriv(algorithm, key, iv);

const {getStudentByParentPhone} = require('./parentscontrollers');
const {getAttendanceByStudentId} = require('./AttendanceCheck');
const {generateRequest} = require('./sendresponse');
const {sendMessage} = require('./sendingtowhatsapp');
const {pendingassignments} = require('./PendingAssighnments');
const {Acadamics} = require('./Acadamicsdatawithid')
const {  createTextMessage} = require('./Textmessage');


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
            const headerText = 'Academic portal: Please select an option below'; 
            let menuList = [{
                id: 'Attendance',
                title: 'Attendance',
                description:'check your children Attendance Register'

        

            },{
                id: 'Pending Assignments',
                title: 'Pending Assignments',
                description:'See your children pending assighnments '

        

            },
            {
                id: 'Progress',
                title: 'Progress',
                description:'See your children pending assighnments '

        

            },     {
                id: 'classteacherReport',
                title: 'classteacher Report',
                description:'See what class teacher says about your child'

        

            },{
                id: 'Check pending fees',
                title: 'Pending Fees',
                description:'Check if there any pending fees'

        

            },
            {
                id: 'backtomainmenu',
                title: 'Back to Mainmenu',
                description:'Retirn Back To Mainmenu'

        

            }]
           
            const bodyText = '';
            const footerText = '';
            const buttonTitle = 'Select Options';
            
             const message = generateRequest(user, headerText, bodyText, footerText, buttonTitle,menuList) 
              console.log(message)
             sendMessage(message);
        case 1:
              
           if (!('varification' in userstatus)){
            userstatus = { ...userstatus, varification: 'validation' };
            console.log(userstatus.varification)
            cache.set(user, userstatus);
            const headerText = 'please ensure using Registerd number'
            let menuList = [{
                id: 'yes',
                title: 'yes i have',
                description:'use the mobile phone you registerd'

        

            },{
                id: 'No',
                title: 'I dont have',
                description:'use the mobile phone you registerd'

        

            }]
            const bodyText = '';
            const footerText = '';
            const buttonTitle = 'Select Options';
            
             const message = generateRequest(user, headerText, bodyText = "", footerText = "", buttonTitle = "",menuList) 
              console.log(message)
             sendMessage(message);

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
           else {
              
            switch(userstatus.varification ){
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
                        let Textmessage = 'please enter your OTP'
                      whatsapptextmessages =  createTextMessage(user,Textmessage)
                      sendMessage(whatsapptextmessages);
                       
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
            case 0 :  getAttendanceByStudentId (req, res,messageContent,user)

          }

            



            }
          


           }
           

        case 2:
            //Pending Assaignment Section
     
            if (!('varification' in userstatus)){
                userstatus = { ...userstatus, varification: 'validation' };
                console.log(userstatus.varification)
                cache.set(user, userstatus);
                const headerText = 'please ensure using Registerd number'
                let menuList = [{
                    id: 'yes',
                    title: 'yes i have',
                    description:'use the mobile phone you registerd'
    
            
    
                },{
                    id: 'No',
                    title: 'I dont have',
                    description:'use the mobile phone you registerd'
    
            
    
                }]
                const bodyText = '';
                const footerText = '';
                const buttonTitle = 'Select Options';
                
                 const message = generateRequest(user, headerText, bodyText = "", footerText = "", buttonTitle = "",menuList) 
                  console.log(message)
                 sendMessage(message);
    
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
               else {
                  
                switch(userstatus.varification ){
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
                            let Textmessage = 'please enter your OTP'
                          whatsapptextmessages =  createTextMessage(user,Textmessage)
                          sendMessage(whatsapptextmessages);
                           
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
                               //Here is the value to be pasted   
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
                case 0 :  pendingassignments (req, res,messageContent,user)
    
              }
    
                
    
    
    
                }
              
    
    
               }    
        
      
            
            case 3:
                //Progress Section code will work here --------------------------------------------------
                if(userstatus.path == 3){
                if (!('varification' in userstatus)){
                    userstatus = { ...userstatus, varification: 'validation' };
                    console.log(userstatus.varification)
                    cache.set(user, userstatus);
                    const headerText = 'please ensure using Registerd number'
                    let menuList = [{
                        id: 'yes',
                        title: 'yes i have',
                        description:'use the mobile phone you registerd'
        
                
        
                    },{
                        id: 'No',
                        title: 'I dont have',
                        description:'use the mobile phone you registerd'
        
                
        
                    }]
                    const bodyText = '';
                    const footerText = '';
                    const buttonTitle = 'Select Options';
                    
                     const message = generateRequest(user, headerText, bodyText = "", footerText = "", buttonTitle = "",menuList) 
                      console.log(message)
                     sendMessage(message);
        
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
                   else {
                      
                    switch(userstatus.varification ){
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
                                let Textmessage = 'please enter your OTP'
                              whatsapptextmessages =  createTextMessage(user,Textmessage)
                              sendMessage(whatsapptextmessages);
                               
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
                                   //Here is the value to be pasted   
                                   if(!('stuentid' in userstatus && userstatus.path)){
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
                    case 0 :  Acadamics (req, res,messageContent,user)
        
                  }
        
                    
        
        
        
                    }
                  
        
        
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
