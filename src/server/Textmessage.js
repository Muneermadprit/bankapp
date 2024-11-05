function createTextMessage(contact, message) {
    return {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: contact,
        type: "text",
        text: {
            preview_url: false,
            body: message
        }
    };
}

// Example usage:
module.exports = {
    createTextMessage
}
