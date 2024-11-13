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
const acadamics = (user, userstatus, res, req,messageContent) => {
    let isuservarified =cache.get('varification') || false
    console.log(isuservarified,"uservarificationstatus")


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
       
    }

    cache.set(user, userstatus);

    console.log(cache.get(user))
    // Handle the main menu or specific options based on path
    switch (userstatus.path) {
        case 0:
           
        const headerText = 'Academic portal: Please select an option below';
        const bodyText = '';  
        const footerText = '';
        const buttonTitle = 'Select Options';
             
              
                fetchAndSendMenu(1,user,headerText,footerText,buttonTitle,bodyText);
           
            
             
        case 1:
            if(userstatus.path == 1){

              if( isuservarified == true){
                        userstatus = { ...userstatus, varification: 'varified' };
                         
                                   //Here is the value to be pasted   
                                   if(!('stuentid' in userstatus && userstatus.path)){
                                    getStudentByParentPhone(user,messageContent,res)
                                }
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
                            
                if(userstatus.varification == 'varified'){

                     
                console.log()
                if (isuservarified) {
                  
                    if (!user.hasRunOnce && !('studentid' in userstatus && userstatus.path)) {
                        console.log("Welcome to isuservarified");
                        
                     
                        getStudentByParentPhone(user, messageContent, res);
                        
                       
                        user.hasRunOnce = true;
                    }
                }
                cache.set('varification',true)
    
              switch(userstatus.studentid ){
                case 0 :  getAttendanceByStudentId (req, res,messageContent,user)
    
              }
    
                
    
    
    
                }
              
    
    
               
               
                    
            
               
    
            
        case 2:
            //Pending Assaignment Section
     
            if(userstatus.path == 2){
                // what can i set is here
                        
                if(userstatus.varification == 'varified'){
                    console.log()
    
                    switch(userstatus.studentid ){
                      case 0 :let newmessage =` Here’s a quick update on ${messageContent}  progress with pending assignments:
      
                      Academics: Strong in [Math/Science], but could benefit from extra attention in [Language Arts/other subjects].
                      
                      Pending Assignments and Status:
                      
                      Math: Chapter review exercises for Unit 3 — In Progress
                      Science: Lab report on [Experiment Name] — Not Started
                      Language Arts: Book report on [Book Title] — In Progress
                      Social Studies: Worksheet on [Topic] — Completed, pending review
                      Behavior: Respectful, helpful, and actively participates in class.
                      
                      Goal: Complete remaining assignments and continue practicing [writing/reading] to build confidence.
                      
                      Thank you!
                      [Sumitha TV]`
                      
      
      
                      whatsapptextmessages =  createTextMessage(user,newmessage)
                      sendMessage(whatsapptextmessages);
                       
                      
          
                    }
          
                      
          
          
          
                      }
                    }

                
               
              
    
    
               
        
           
      
            
            case 3:




                //Progress Section code will work here --------------------------------------------------
                if(userstatus.path == 3){
               
                                  
                                   
                    if(userstatus.varified == 'varified'){

                        switch(userstatus.studentid ){
                            case 0 :  Acadamics (req, res,messageContent,user)
                
                          }
                        
                    }
                    console.log()
        
             
        
                    
        
        
        
                    }
                  
        
        
                           
        




        case 4:
            //Class TEacher Report  Section code will work here --------------------------------------------------
            if(userstatus.path == 4){
           
                if(userstatus.varification == 'varified'){
                    console.log()
    
                    switch(userstatus.studentid ){
                      case 0 :   let Textmessage = `
      Akhil’s Progress Update
      
      Hi ,
      A quick update on ${messageContent}:
      
      Academics: Strong in [Math/Science], needs a bit more focus on [Language Arts/other subjects].
      Behavior: Respectful, helpful, and participates well.
      Goal: Practice [writing/reading] to build confidence.
      Thank you!
      [Sumitha TV]
      
      
      
      
      
      
      `
                      whatsapptextmessages =  createTextMessage(user,Textmessage)
                      sendMessage(whatsapptextmessages);
                       
          
                    }
          
                      
          
          
          
                      }
                    

                }
               
    
    
                          
    




    case 5:
        //Class TEacher Report  Section code will work here --------------------------------------------------
        if(userstatus.path == 5){
       
                    
            if(userstatus.varification == 'varified'){
                console.log()

          switch(userstatus.studentid ){
            case 0 :   let Textmessage = `
Pending Fees Summary for ${messageContent}

Total Fees: ₹12700
Next Installment: ₹3500 due on 12-11-2024
Management Signature:Sumesh KV






`
            whatsapptextmessages =  createTextMessage(user,Textmessage)
            sendMessage(whatsapptextmessages);
             

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
