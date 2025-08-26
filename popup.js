document.addEventListener('DOMContentLoaded', () => {
  const enableNotificationsCheckbox = document.getElementById('enableNotifications');
  const playSoundCheckbox = document.getElementById('playSound');
  const statusText = document.getElementById('statusText');
  const statusDot = document.getElementById('statusDot');

  chrome.storage.sync.get(['enableNotifications', 'playSound'], (result) => {
    enableNotificationsCheckbox.checked = result.enableNotifications !== false;
    playSoundCheckbox.checked = result.playSound === true;
  });

  enableNotificationsCheckbox.addEventListener('change', (e) => {
    chrome.storage.sync.set({ enableNotifications: e.target.checked });
    updateStatus();
  });

  playSoundCheckbox.addEventListener('change', (e) => {
    chrome.storage.sync.set({ playSound: e.target.checked });
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