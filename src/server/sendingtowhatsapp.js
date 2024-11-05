const axios = require('axios');

async function sendMessage(message) {
    try {
        const projectId = process.env.PROJECT_ID; // Set your Project ID in environment variables
        const apiPwd = process.env.API_PWD;       // Set your API Password in environment variables

        if (!projectId || !apiPwd) {
            throw new Error("Project ID or API Password not found.");
        }

        const apiUrl = `https://apis.aisensy.com/project-apis/v1/project/663dbb3c09605e5be5b5b1af/messages`

        // Configure headers
        const headers = {
            'Content-Type': 'application/json',
            'X-AiSensy-Project-API-Pwd': apiPwd,
        };

        // Send POST request
        const response = await axios.post(apiUrl, message, { headers });

        console.log("API Success:", response.data);
    } catch (error) {
        console.error("API Error:", error.response ? error.response.data : error.message);
    }
}

module.exports = {
    sendMessage
}
