document.addEventListener('DOMContentLoaded', () => {
  const enableNotificationsCheckbox = document.getElementById('enableNotifications');
  const minResponseTimeInput = document.getElementById('minResponseTime');
  const statusText = document.getElementById('statusText');
  const statusDot = document.getElementById('statusDot');

  chrome.storage.sync.get(['enableNotifications', 'minResponseTime'], (result) => {
    enableNotificationsCheckbox.checked = result.enableNotifications ?? true;
    minResponseTimeInput.value = result.minResponseTime ?? 10;
  });

  enableNotificationsCheckbox.addEventListener('change', (e) => {
    chrome.storage.sync.set({ enableNotifications: e.target.checked });
    updateStatus();
  });

  minResponseTimeInput.addEventListener('change', (e) => {
    const value = Math.max(1, Math.min(300, parseInt(e.target.value) || 10));
    e.target.value = value;
    chrome.storage.sync.set({ minResponseTime: value });
    console.log("setting changed: minResponseTime "+ value);
  });


  function updateStatus() {
    if (enableNotificationsCheckbox.checked) {
      statusText.textContent = 'アクティブ';
      statusDot.style.background = '#10a37f';
    } else {
      statusText.textContent = '無効';
      statusDot.style.background = '#ccc';
    }
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTab = tabs[0];
    if (currentTab.url.includes('chatgpt.com') || currentTab.url.includes('chat.openai.com')) {
      statusText.textContent = 'ChatGPTページで待機中';
      statusDot.style.background = '#10a37f';
    } else {
      statusText.textContent = 'ChatGPTページに移動してください';
      statusDot.style.background = '#ff9500';
    }
  });

  updateStatus();
});