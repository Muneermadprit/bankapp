const { getServiceMenu } = require('./getdatamenulist');
const cache = require('./cache');
const {generateRequest} = require('./sendresponse');
const {sendMessage} = require('./sendingtowhatsapp');

async function fetchAndSendMenu(check, user,headerText,footerText,buttonTitle,bodyText) {
  try {
    let result;

    
    if (!cache.has('menuitems')) {
      result = await getServiceMenu();
      cache.set('menuitems', result); 
    } else {
      result = cache.get('menuitems'); 
    }

   
    if (result && Array.isArray(result)) {
      const parentMenuItems = result
        .filter(item => item.parent_id === check)
        .map(item => ({
          id: item.menu_name,
          title: item.display_name,
          description: item. Menu_Description,
        }));

      console.log('Filtered Menu List:', parentMenuItems);
      if(check>0){
        parentMenuItems.push({
            id: 'backtomainmenu',
            title: 'Back to Mainmenu',
            description: 'Return Back To Mainmenu'
        });
      }

  
    
      const message = generateRequest(user, headerText, bodyText, footerText, buttonTitle, parentMenuItems);
      console.log('Generated Message:', message);

     
      sendMessage(message);
    } else {
      console.error('Invalid or empty menu result:', result);
    }
  } catch (error) {
    
    console.error('Error fetching menu items:', error);
  }
}

module.exports = {
  fetchAndSendMenu
};
