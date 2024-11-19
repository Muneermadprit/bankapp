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
const {fetchAndSendMenu} = require('./fetch_data_and _send_message');


const {Sendotp,otpVerification} = require('./sendotp');
const activities = (user, userstatus, res, req,messageContent,messageTitle,messageType) => {

    
    let headerText 
        
    let footerText 
    let buttonTitle 


    // Retrieve messageContent from req.body if defined
  console.log("welcome acadamic function")
      console.log(messageContent,'messagehere')
    // Set path in userstatus based on messageContent
    switch (messageContent) {
        case 'ARTS':
            userstatus = { ...userstatus, path: 1 };
            break;
        case 'SPORTS':
            userstatus = { ...userstatus, path: 2 };
            break;

            default :
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

    cache.set(user, userstatus);

    console.log(cache.get(user))
    // Handle the main menu or specific options based on path
    switch (userstatus.path) {
        case 0:
            userstatus = { ...userstatus, path: -1 };
             headerText = 'Activities portal: Please select an option below';
             bodyText = `Dear Parent,

We are thrilled to offer a range of exciting activities for your child this term! 🎉
Please review the options below and select one activity each from Arts and Sports.`;  
             footerText = '';
             buttonTitle = 'Select Options';

             let position = cache.get('Position')
                 
                  
                    fetchAndSendMenu(3,user,headerText,footerText,buttonTitle,bodyText,position);
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
                              
                return res.status(403).send({
                    "messaging_product": "whatsapp",
                    "recipient_type": "individual",
                    "to": user,
                    "type": "text",
                    "text": {
                        "body": "You need to complete verification before submitting your application."
                    }
                });          
                       
    
    
    
    
        
        
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
                            
              
    
     case 11 :


     if(userstatus.path == 11 ){
           
        if(messageType == 'BUTTON_REPLY' &&  /\d/.test(messageContent)){
            bodyText = `🌟 Youth Festival 2024 - Mimicry Participation 🌟

            Hello Sukumaran 👋,
            
            We are pleased to inform you that Participant ID: ${messageTitle} has been successfully registered for the Mimicry Event at the Youth Festival 2024! 🎭
            
            Event Details:
            📅 Date: 24th November 2024
            ⏰ Time: 1:30 PM
               Venue: School Auditorium
            
            This is a wonderful opportunity for ${messageTitle} to showcase their talent, and we’re thrilled to support them throughout this exciting journey!
            
            If you have any questions or need assistance, please don’t hesitate to contact us at Greets Public School.
            
            Let’s come together to cheer them on and make this event a memorable one! 🎉👏
            
            Warm regards,
            Greets Public School`
                        
                                     
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
        
                
    
    
    
            
        case 2:
            //Pending Assaignment Section
     
            if(userstatus.path == 2){
                (async () => {
                    try {
                     
                        await getStudentByParentPhone(user, messageContent, res);
            
                        userstatus = { ...userstatus, path: 12 };
                        cache.set(user, userstatus);
            
                      
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

              
                case 12 :




                if(userstatus.path == 12 ){
           
                    if(messageType == 'BUTTON_REPLY' &&  /\d/.test(messageContent)){
                        bodyText =` student ${messageTitle} doesnt have any sports entrollement `
                   
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
       
    }
}


module.exports = {
    activities
};
