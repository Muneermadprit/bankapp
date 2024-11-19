const { getServiceMenu } = require('./getdatamenulist');
const cache = require('./cache');
const { generateRequest } = require('./sendresponse');
const { sendMessage } = require('./sendingtowhatsapp');

async function fetchAndSendMenu(check, user, headerText, footerText, buttonTitle, bodyText, position) {
  try {
    let result;

    // Check the cache for menu items
    if (!cache.has('menuitems')) {
      result = await getServiceMenu(); // Fetch menu from the external service
      if (!result || !Array.isArray(result)) {
        throw new Error('Invalid menu data fetched from the service');
      }
      cache.set('menuitems', result); // Cache the result
    } else {
      result = cache.get('menuitems'); // Retrieve from cache
    }

    // Filter and format the menu items
    const parentMenuItems = result
      .filter(item => item.parent_id === check && item.positions === position)
      .map(item => ({
        id: item.menu_name,
        title: item.display_name,
        description: item.Menu_Description,
        position: item.positions,
      }));

    // Add "Back to Mainmenu" option if `check` > 0
    if (check > 0) {
      parentMenuItems.push({
        id: 'backtomainmenu',
        title: 'Back to Mainmenu',
        description: 'Return Back To Mainmenu',
      });
    }

    if (parentMenuItems.length === 0) {
      console.warn('No menu items matched the filter criteria.');
      return;
    }

    console.log('Filtered Menu List:', parentMenuItems);

    // Generate and send the message
    const message = generateRequest(user, headerText, bodyText, footerText, buttonTitle, parentMenuItems);
    console.log('Generated Message:', message);

    await sendMessage(message); // Ensure sendMessage is awaited if it's asynchronous
    console.log('Message sent successfully');
  } catch (error) {
    console.error('Error in fetchAndSendMenu:', error.message);
  }
}

module.exports = {
  fetchAndSendMenu,
};

