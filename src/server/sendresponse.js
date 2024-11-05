function generateRequest(recipient, headerText, bodyText , footerText , buttonTitle,menuList) {
    // Replace with actual body text if none provided
    bodyText = bodyText || process.env.BODY_TEXT || "Default body text";

    // Mock of WebApiApplication.GetMenuList equivalent
  
    const menuItems = menuList
      console.log(menuItems,'menulistitemsdata')
    if (menuItems.length <= 3) {
        // Create button message if items are <= 3
        const buttons = menuItems.map(menuItem => ({
            type: "reply",
            reply: {
                id: menuItem.id,
                title: menuItem.title
            }
        }));

        return {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: recipient,
            type: "interactive",
            interactive: {
                type: "button",
                header: {
                    type: "text",
                    text: headerText
                },
                body: {
                    text: bodyText
                },
                action: {
                    buttons: buttons
                }
            }
        };
    } else {
        console.log("we are in else condition")
        // Create list message if items are > 3
        const rows = menuItems.map(menuItem => ({
            id: menuItem.id,
            title: menuItem.title,
            description: menuItem. description
        }));
        console.log(rows)

        return {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: recipient,
            type: "interactive",
            interactive: {
                type: "list",
                header: {
                    type: "text",
                    text: headerText
                },
                body: {
                    text: bodyText
                },
                footer: {
                    text: footerText
                },
                action: {
                    button: buttonTitle,
                    sections: [
                        {
                            title: "Services",
                            rows: rows
                        }
                    ]
                }
            }
        };
    }
}

module.exports = {
    generateRequest
}
