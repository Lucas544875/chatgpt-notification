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
  const observer = new MutationObserver(() => {
    detectResponseCompletion();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', observeDOM);
} else {
  observeDOM();
}

detectResponseCompletion();