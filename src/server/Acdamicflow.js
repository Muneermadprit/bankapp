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
const {fetchAndSendMenu} = require('./fetch_data_and _send_message');
const {pendingassignments} = require('./PendingAssighnments');
const {Acadamics} = require('./Acadamicsdatawithid')
const {  createTextMessage} = require('./Textmessage');


const {Sendotp,otpVerification} = require('./sendotp');
const { use } = require('passport');
const acadamics = (user, userstatus, res, req,messageContent,messageTitle,messageType) => {
    let headerText
    let bodyText    
    let footerText 
    let buttonTitle 
          
    
 
    let Textmessage
    let position

    // Retrieve messageContent from req.body if defined
  console.log("welcome acadamic function")
      console.log(messageContent,'messagehere')
    // Set path in userstatus based on messageContent
    switch (messageContent) {
        case 'Attendance':
            userstatus = { ...userstatus, path: 1 };
            break;
        case 'Assignments':
            userstatus = { ...userstatus, path: 2 };
            break;
        case 'Progress':
            userstatus = { ...userstatus, path: 3 };
            break;
        case 'TeacherReport':
            userstatus = { ...userstatus, path: 4 };
            break;
        case 'PendingFees':
            userstatus = { ...userstatus, path: 5 };
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

    cache.set(user, userstatus);

    // Handle the main menu or specific options based on path
    switch (userstatus.path) {
        
        case 0:
           
        userstatus = { ...userstatus, path: -1 };
        cache.set(user, userstatus);

             headerText = 'Academic portal: Please select an option below';
             bodyText = `Enter the child's academic information, including grade, subjects, and performance history.`;  
             footerText = '';
             buttonTitle = 'Select Options';
              
          position = cache.get('Position')
              
                fetchAndSendMenu(1,user,headerText,footerText,buttonTitle,bodyText,position );
           
            
             
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
            
           
            if(messageType == 'BUTTON_REPLY' &&  /\d/.test(messageContent)){
                console.log('you are in a wrong area')
                getAttendanceByStudentId (req, res,messageContent,user)
  

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
            



                
                        
              
                    
     case 12 : 


     if(userstatus.path == 12 ){
           
        if(messageType == 'BUTTON_REPLY' &&  /\d/.test(messageContent)){
             
     bodyText  =`${messageContent} - Progress Update and Pending Tasks
     Hello ${messageTitle},
     
     I hope you're doing well. Here’s an update on [Message Title]’s progress and the current status of pending assignments:
     
     Academic Overview:
     
     Strengths: Science
     Areas for Improvement: Language Arts
     Pending Assignments:
     
     Math: Chapter review exercises for Unit 3 (In Progress)
     Science: Lab report on Organic Chemistry (Not Started)
     Language Arts: Book report on  (In Progress)
     Social Studies: Worksheet on The Catcher in the Rye (Completed, pending review)
     Next Steps:
     
     Focus on completing pending assignments and continue practicing reading to enhance confidence.
     Thank you for your attention to this update.
     
     Best regards,
     Class Teacher
     Greeks Public School
     
     `
                           
           
           
                            
                           
               
                         
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
     
     
     
   
          
          
                     

                
               
              
    
    
               
        
           
      
            
            case 3:

             


                //Progress Section code will work here --------------------------------------------------
                if (userstatus.path == 3) {
                    console.log('We are in the correct path inside');
                    
                    (async () => {
                        try {
                            // Wait for the function to complete before proceeding
                            await getStudentByParentPhone(user, messageContent, res);
                
                            // After the function completes, update the userstatus and cache
                            userstatus = { ...userstatus, path: 13 };
                            cache.set(user, userstatus);
                
                            // Send a response indicating the next step
                            console.log('Function completed and cache updated.');

                            return res.status(403).send({
                                "messaging_product": "whatsapp",
                                "recipient_type": "individual",
                                "to": user,
                                "type": "text",
                                "text": {
                                    "body": "You need to complete verification before submitting your application."
                                }
                            });
                        } catch {

                        }
                    })();
                }
                 
                   
               
                             
                                   
               
        case 13 :

        if(userstatus.path == 13 ){
           
            if(messageType == 'BUTTON_REPLY' &&  /\d/.test(messageContent)){
                Acadamics (req, res,messageContent,user)
  

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
          
        
     
                
        
             
        
                    
        
        
        
                    
                  
        
        
                           
        




        case 4:
            //Class TEacher Report  Section code will work here --------------------------------------------------
            if(userstatus.path == 4){

                (async () => {
                    try {
                        // Wait for the function to complete before proceeding
                        await getStudentByParentPhone(user, messageContent, res);
            
                        // After the function completes, update the userstatus and cache
                        userstatus = { ...userstatus, path: 14 };
                        cache.set(user, userstatus);
            
                        // Send a response indicating the next step
                        console.log('Function completed and cache updated.');
                    } catch (error) {
                        console.error('Error in getStudentByParentPhone:', error);
                    }
                })();

          
           
   






                // Send a response indicating the next step
               
            }

           
 case 14 : 



 if(userstatus.path == 14 ){

    console.log("you are in my way ")
           
    if(messageType == 'BUTTON_REPLY' &&  /\d/.test(messageContent)){
        bodyText = `
        ${messageContent} Progress Update
      Hello ${messageTitle},
      
      I hope you're doing well. Here's a quick update on Akhil's progress:
      
      Academics:
      
      Strong performance in Science.
      Needs a bit more focus on Language Arts.
      Goal:
      
      Concentrate on [writing/reading] to build confidence.
      Thank you for your support!
      
      Best regards,
      Sumitha TV
            
            
            
            
            
            `
                            whatsapptextmessages =  createTextMessage(user,Textmessage)
                            sendMessage(whatsapptextmessages);
                             
                
              headerText = 'Instructor’s Feedback Response';
            
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












 
 
 
                          
    




    case 5:
        //Class TEacher Report  Section code will work here --------------------------------------------------
        if(userstatus.path == 5){
       

            (async () => {
                try {
                    // Wait for the function to complete before proceeding
                    await getStudentByParentPhone(user, messageContent, res);
        
                    // After the function completes, update the userstatus and cache
                    userstatus = { ...userstatus, path: 15 };
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
    

                

         
            case 15 :  

            if(userstatus.path == 15 ){
           
                if(messageType == 'BUTTON_REPLY' &&  /\d/.test(messageContent)){
                    bodyText = `
                    Pending Fees Summary for ${messageTitle} 
                    Studentid : ${messageContent}
                    
                    Total Fees: ₹12700
                    Paid:₹6200
                    Balance:₹6500
                    Next Installment: ₹3500 due on 12-11-2024
                    Management Signature:Sumesh KV
                    
                    
                    
                    
                    
                    
                    `
                                 
    
    
                                
            headerText = 'Fees Details';
           
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
    acadamics
};
