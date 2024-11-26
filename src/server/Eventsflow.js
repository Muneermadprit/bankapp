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
const Events = (user, userstatus, res, req,messageContent,messageTitle,messageType) => {


    let headerText
    let bodyText  
    let footerText 
    let buttonTitle 
   


    // Retrieve messageContent from req.body if defined
  console.log("welcome acadamic function")
      console.log(messageContent,'messagehere')
    // Set path in userstatus based on messageContent
    switch (messageContent) {
        case 'UP COMING EVENTS':
            userstatus = { ...userstatus, path: 1 };
            break;
        case 'HOLIDAY CALENDER':
            userstatus = { ...userstatus, path: 2 };
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

    console.log(cache.get(user))
    // Handle the main menu or specific options based on path
    switch (userstatus.path) {
        case 0:
            userstatus = { ...userstatus, path: -1 };
             headerText = 'Activities portal: Please select an option below';
             bodyText = `Please refer to the events and holiday calendar for an overview of upcoming activities, important dates, and scheduled breaks`;  
             footerText = '';
             buttonTitle = 'Select Options';
             let position = cache.get('Position')

                 
                  
                    fetchAndSendMenu(4,user,headerText,footerText,buttonTitle,bodyText,position);
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
                            
              
    
     case 11 :


     if(userstatus.path == 11 ){
           
        if(messageType == 'BUTTON_REPLY' &&  /\d/.test(messageContent)){
            bodyText = `🌟 Upcoming School Events - 2024 🌟

Hello Sukumaran 👋,

We’re excited to share the schedule of upcoming events at Greets Public School! 🎉

📅 Event Lineup:

1️⃣ Annual Sports Day
🗓️ Date: 20-11-2024
⏰ Time: 9:00 AM
  Venue: School Playground

2️⃣ Science Exhibition
🗓️ Date: 22-11-2024
⏰ Time: 10:00 AM
  Venue: Science Block

3️⃣ Cultural Fest
🗓️ Date: 01-12-2024
⏰ Time: 5:00 PM
  Venue: School Auditorium

4️⃣ Parent-Teacher Meeting
🗓️ Date: 08-12-2024
⏰ Time: 3:00 PM
   Venue: Classrooms

5️⃣ Christmas Celebration
🗓️ Date: 20-12-2024
⏰ Time: 11:30 AM
   Venue: School Grounds

We look forward to your participation and support in making these events a success! 🎭✨

For details, contact us at [Contact Information].

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

              
                case 12 :

                
     if(userstatus.path == 12 ){
           
        if(messageType == 'BUTTON_REPLY' &&  /\d/.test(messageContent)){
            let bodyText =`🌟 Holiday Calendar - 2024 🌟
Greets Public School

📅 January
🗓️ 01 - New Year’s Day
🗓️ 15 - Pongal

📅 February
🗓️ 14 - Maha Shivaratri

📅 March
🗓️ 08 - Holi
🗓️ 29 - Good Friday

📅 April
🗓️ 14 - Vishu
🗓️ 22 - Eid-ul-Fitr

📅 May
🗓️ 01 - Labor Day

📅 June
🗓️ No Holidays

📅 July
🗓️ 29 - Muharram

📅 August
🗓️ 15 - Independence Day
🗓️ 29 - Onam

📅 September
🗓️ 16 - Ganesh Chaturthi

📅 October
🗓️ 02 - Gandhi Jayanti
🗓️ 23 - Dussehra

📅 November
🗓️ 12 - Diwali
🗓️ 24 - Eid Milad

📅 December
🗓️ 25 - Christmas

Let’s enjoy these special days with joy and togetherness! For any updates, feel free to reach out to [Contact Information].

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
    Events

};
