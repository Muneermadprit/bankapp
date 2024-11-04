const cache = require('./cache');
const axios = require('axios');
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32); // 32 bytes for aes-256-cbc
const iv = crypto.randomBytes(16);  // 16 bytes IV for AES

const cipher = crypto.createCipheriv(algorithm, key, iv);






async function generateOTP(user, messageContent) {
    // Generate a 6-digit OTP using crypto.randomInt for each digit
    const otp = Array.from({ length: 6 }, () => crypto.randomInt(0, 10)).join('');

    // Set expiry time to 1 minute (60,000 milliseconds) from now
    const expiresAt = Date.now() + 60 * 1000;

    // Cache the OTP with user details
    cache.set(otp, { registeredNumber: messageContent, otp: otp, currentUser: user, expiresAt });
    console.log('Generated OTP:', cache.get(otp));
    
 
    // Return OTP details
    return { otp, expiresAt };
}



const Sendotp = async (user, messageContent) => {
    console.log("welcome to send otp")
    try {
        function sha256Encrypt(data) {
            return crypto.createHash('sha256').update(data).digest('hex');
        }

        function encrypt(textToEncrypt, keyAsHexString) {
            const key = Buffer.from(keyAsHexString, 'hex');
            const iv = crypto.randomBytes(16);
            const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
            let encrypted = cipher.update(textToEncrypt, 'utf8', 'base64');
            encrypted += cipher.final('base64');
            const encryptedWithIV = Buffer.concat([iv, Buffer.from(encrypted, 'base64')]).toString('base64');
            return encryptedWithIV;
        }

        const otpDetails = await generateOTP(user, messageContent);

        // Retrieve the object from cache using the otp key
        const cachedOTPData = cache.get(otpDetails.otp);
        const userdata = cache.get(user)
        console.log(userdata,'userdatain send otp')
        if (cachedOTPData && cachedOTPData.currentUser === user) {
            // OTP and user match, proceed with request
            const authRequest = {
                BankCode: "SMVBHSS",
                MobileNo: userdata.id ,
                OTP: otpDetails.otp,
                TenantBankId: ""
            };

            const CHKSUM_KEY = "ccbank";
            const checkSum = `${authRequest.BankCode}${authRequest.TenantBankId}${authRequest.MobileNo}${authRequest.OTP}${CHKSUM_KEY}`;
            authRequest.CheckSum = sha256Encrypt(checkSum);

            const plainText = JSON.stringify(authRequest);
            const keyAsHexString = '7CB4BD9321E392916C071496411D58DC';
            const EncrData = encrypt(plainText, keyAsHexString);

            const response = await axios.post('https://enableauth.azurewebsites.net/api/SendAuthCode', {
                EncryptedData: EncrData,
            }, {
                headers: {
                    'X-Auth-Id': 'uhT5brksiE-aFsaL7FMSXQ',
                    'X-Auth-Hash': 'JByQMYG4QsSXeMdZAPFuUbITa54hxf0j0W0aBK266j0hdVrLL6z7Ch==',
                    'Content-Type': 'application/json',
                },
            });

            console.log('OTP sent successfully:', response.data);
        } else {
            console.log("Condition not met or user does not match.");
        }
    } catch (error) {
        console.error('Error sending OTP:', error.message);
    }
};



const otpVerification = (user, messageContent, res) => {
    console.log('Welcome to the OTP verification');

    // Fetch cached OTP data using the provided messageContent
    const cachedOTPData = cache.get(messageContent);
    console.log(cachedOTPData);
      console.log(user,'otp varificatio test')
    // Check if OTP data exists and matches the user
    if (cachedOTPData && cachedOTPData.currentUser === user) {
        
        // Validate the OTP
        if (cachedOTPData.otp === messageContent) {
            // Update user status as verified
            let userstatus = cache.get(user)
          userstatus.varification = 'varified'
        
            console.log(userstatus)
            cache.set(user, userstatus);
          
            // Respond with a success message
           
   
};
    }
}


module.exports = {
    Sendotp,
    otpVerification
}
