chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'RESPONSE_COMPLETED') {
    chrome.storage.sync.get(['enableNotifications', 'minResponseTime'], (result) => {
      const enableNotifications = result.enableNotifications ?? true;
      const minResponseTime = result.minResponseTime ?? 10;
      const responseTime = message.responseTime || 600;
      
      console.log(`Response time: ${responseTime}s, minimum: ${minResponseTime}s`);
      
      if (enableNotifications && responseTime >= minResponseTime) {
        const notificationOptions = {
          type: 'basic',
          iconUrl: 'icons/icon48.png',
          title: 'ChatGPT Notification',
          message: `ChatGPTの回答が完了しました！（${responseTime.toFixed(1)}秒）`,
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
      } else if (!enableNotifications) {
        console.log('Notifications disabled, skipping notification');
      } else {
        console.log(`Response too fast (${responseTime}s < ${minResponseTime}s), skipping notification`);
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