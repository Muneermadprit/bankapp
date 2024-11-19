
const {Sendotp,otpVerification} = require('./sendotp');
const cache = require('./cache');
const { getDb } = require('./db');
const {  createTextMessage} = require('./Textmessage');
const {fetchAndSendMenu} = require('./fetch_data_and _send_message');
const {generateRequest} = require('./sendresponse');
const {sendMessage} = require('./sendingtowhatsapp')
const {setUserVerification} = require('./changinguservarification')


async function fetchuser(user,messageContent,userstatus,res) {
    
    let userCache =cache.get('varification') || false
    let position

    console.log(user)
    console.log(userCache,'usercache')
   
    console.log(userstatus,'userstatus')
    
    try {
        if(userCache == false){

         
            console.log("user in the false condition")
            const db = await getDb(); // Ensure the connection is available
            const [result] = await db.query('CALL GetPositionAndVerificationStatus(?)', [user]);
            console.log(result,'the resul is on it when')
            switch(result[0][0].Position){
                case 'P':cache.set('Position','P')
                break;
                case 'T':cache.set('Position','T') 
                break;
                case 'M':cache.set('Position','M')
                break;
                default:

                   

                    cache.set(user, { counter: 1 });
                    userstatus.counter = 1
                    let Textmessage = 'There is a Mistake entering your Details please contact school management to use Whatsapp services'
                whatsapptextmessages =  createTextMessage(user,Textmessage)
                sendMessage(whatsapptextmessages);
               
            }
        

            if (!(userstatus.counter > 0)){


                if (result && result.length > 0 && result[0][0].VerificationStatus != null) {
                    console.log('what is it doing')
    
    
    
                   
    
    
                     console.log(result[0][0].VerificationStatus)
                    if(result[0][0].VerificationStatus == 'N'){
        
                        if (!('varification' in userstatus)){
                            userstatus = { ...userstatus, varification: 'validation' };
                            console.log(userstatus.varification)
                            cache.set(user, userstatus);
                            let headerText = 'Your Consent Matters'
                            let menuList = [{
                                id: 'yes',
                                title: 'Proceed',
                                description:'use the mobile phone you registerd'
                
                        
                
                            }]
                            const bodyText = 'Proceeding confirms your agreement to our terms and your consent for us to process your information in line with our privacy policy.';
                            const footerText = '';
                            const buttonTitle = 'Select Options';
                            
                             const message = generateRequest(user, headerText, bodyText , footerText , buttonTitle ,menuList) 
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
                                    let Textmessage = 'please enter your OTP'
                                    whatsapptextmessages =  createTextMessage(user,Textmessage)
                                    sendMessage(whatsapptextmessages);
                                    let phoneRegex = /^\+?[1-9]\d{1,14}$/;  
                                     let otpSent = false; // E.164 format
                                     if (phoneRegex.test(userstatus.id)) {
                                         if (!otpSent) { // Check if `Sendotp` has already been called
                                           otpSent = true; // Set the flag to true to prevent further calls
                                            Sendotp(user,messageContent).catch((error) => console.error('Error in Sendotp:', error));
                                        }
                                        return res.status(403).send({
                                            "messaging_product": "whatsapp",
                                            "recipient_type": "individual",
                                            "to": user,
                                            "type": "text",
                                            "text": {
                                                "body": "You need to complete verification before submitting your application."
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
                                        console.log(messageContent,'message contrent here working')
                                        
                                        // Call the OTP verification function
                                        otpVerification(user, messageContent, res);
                                        if(userstatus.varification = 'varified'){
                                            console.log('helo how are you')
    
    
                                            console.log(userstatus)
                                        cache.set(user, userstatus);
                                 
                                       
                                        setUserVerification(user)
                                        const headerText = 'Academic portal: Please select an option below';
                                  const bodyText = `To proceed, please choose an option from the main menu. You can select the item that best fits your needs, whether it's for navigating to a specific section, viewing detailed information, or accessing additional features. Simply pick an option from the list, and you'll be directed to the corresponding page or action to continue.`;  
                                  const footerText = '';
                                  const buttonTitle = 'Select Options';
                                  cache.set('varification',true)
                                  position = cache.get('Position')
                                        
                                          fetchAndSendMenu(0,user,headerText,footerText,buttonTitle,bodyText,position);
                
                                            // Send a response indicating the next step
    
                                            cache.set(user, { counter: 1, });    
                                            
                                        }
                    
                                        
                                        }
                                        
                                        }
                                    
                       
                                
        
                    }
                     else{
                        console.log('hai you are in correct else part')
                        cache.set('varification',true)
    
                        cache.set(user, { counter: 1 });
    
                        const headerText = 'Academic portal: Please select an option below';
                  const bodyText = `To proceed, please choose an option from the main menu. You can select the item that best fits your needs, whether it's for navigating to a specific section`;  
                  const footerText = '';
                  const buttonTitle = 'Select Options';
                  position = cache.get('Position')

                 
                       
                        
                          fetchAndSendMenu(0,user,headerText,footerText,buttonTitle,bodyText,position);
                
    
                    }
    
    
                    
                
                }

              }
           
         
          else {
            if (!(userstatus.counter > 0)){
                cache.set(user, { counter: 1 });
                let Textmessage = 'Hai Iam Greeks Ai agent feel free to ask anything'
               whatsapptextmessages =  createTextMessage(user,Textmessage)
                sendMessage(whatsapptextmessages);

            }

           
              }
      
        
       
        } 
       else{

        cache.set(user, { counter: 1 });

        const headerText = 'Academic portal: Please select an option below';
  const bodyText = `To proceed, please choose an option from the main menu. You can select the item that best fits your needs, whether it's for navigating to a specific section`;  
  const footerText = '';
  const buttonTitle = 'Select Options';
  position = cache.get('Position')

  console.log(position,"helo position is ready for you")
  fetchAndSendMenu(0,user,headerText,footerText,buttonTitle,bodyText,position);


       } 
        
       
    } catch (error) {
        console.error('Error calling stored procedure:', error.stack || error);
        throw error;
    }
}

module.exports = { fetchuser };
