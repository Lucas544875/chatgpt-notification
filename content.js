let isGenerating = false;
let lastMessageCount = 0;

function detectResponseCompletion() {
  const streamingIndicator = document.querySelector('[data-testid="stop-button"]');
  const messages = document.querySelectorAll('[data-message-author-role="assistant"]');
  const currentMessageCount = messages.length;
  
  if (streamingIndicator && !isGenerating) {
    isGenerating = true;
    console.log('ChatGPT started generating response');
  }
  
  if (isGenerating && !streamingIndicator) {
    isGenerating = false;
    
    if (currentMessageCount > lastMessageCount) {
      console.log('ChatGPT finished generating response');
      
      chrome.runtime.sendMessage({
        type: 'RESPONSE_COMPLETED',
        timestamp: Date.now()
      });
      
      lastMessageCount = currentMessageCount;
    }
  }
}

function observeDOM() {
  let throttleTimer = null;
  
  const observer = new MutationObserver(() => {
    if (throttleTimer) return;
    throttleTimer = setTimeout(() => {
      detectResponseCompletion();
      throttleTimer = null;
    }, 100);
  });
  
  function startObserving() {
    const chatContainer = document.querySelector('[data-testid="conversation-turn"]') ||
                         document.querySelector('.conversation-turn-common') ||
                         document.querySelector('[role="main"]') ||
                         document.querySelector('main');
    
    if (chatContainer) {
      observer.observe(chatContainer, {
        childList: true,
        subtree: true
      });
      console.log('Observing chat container:', chatContainer.tagName);
    } else {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      console.log('Fallback: Observing document.body');
    }
  }
  
  setTimeout(startObserving, 1000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', observeDOM);
} else {
  observeDOM();
}

detectResponseCompletion();