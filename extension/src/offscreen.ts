const AUTH_PAGE_URL = 'YOUR_DEPLOYED_AUTH_PAGE_URL_HERE';

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.name === 'start-auth-in-offscreen') {
    const iframe = document.createElement('iframe');
    iframe.src = AUTH_PAGE_URL;
    document.body.appendChild(iframe);

    window.addEventListener('message', (event) => {
      if (event.source === iframe.contentWindow) {
        chrome.runtime.sendMessage({ name: 'auth-complete', ...event.data });
        document.body.removeChild(iframe);
      }
    }, { once: true });

    sendResponse({ success: true });
  }
  return true;
});

