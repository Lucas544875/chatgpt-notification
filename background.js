chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'RESPONSE_COMPLETED') {
    const notificationOptions = {
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'ChatGPT Notification',
      message: 'ChatGPTの回答が完了しました！',
      priority: 2
    };
    
    const uniqueId = 'chatgpt-response-' + Date.now();
    chrome.notifications.create(uniqueId, notificationOptions, (notificationId) => {
      if (chrome.runtime.lastError) {
        console.error('Notification error:', chrome.runtime.lastError);
      } else {
        console.log('Notification created:', notificationId);
      }
    });
  }
});

chrome.notifications.onClicked.addListener((notificationId) => {
  if (notificationId.startsWith('chatgpt-response-')) {
    chrome.tabs.query({ url: ['https://chatgpt.com/*', 'https://chat.openai.com/*'] }, (tabs) => {
      if (tabs.length > 0) {
        chrome.tabs.update(tabs[0].id, { active: true });
        chrome.windows.update(tabs[0].windowId, { focused: true });
      }
    });
    
    chrome.notifications.clear(notificationId);
  }
});