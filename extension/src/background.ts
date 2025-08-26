let offscreenDocumentPath = 'offscreen.html';

async function hasOffscreenDocument(path: string): Promise<boolean> {
    const offscreenUrl = chrome.runtime.getURL(path);
    const matchedClients = await clients.matchAll();
    return matchedClients.some(c => c.url === offscreenUrl);
}

async function setupOffscreenDocument(path: string) {
    if (await hasOffscreenDocument(path)) {
        console.log('Offscreen document already exists.');
    } else {
        await chrome.offscreen.createDocument({
            url: path,
            reasons: [chrome.offscreen.Reason.USER_MEDIA],
            justification: 'To handle Firebase authentication in a secure context.',
        });
        console.log('Offscreen document created.');
    }
}

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
    if (msg.name === 'start-auth') {
        console.log('Background script received start-auth message.');
        await setupOffscreenDocument(offscreenDocumentPath);
        // Send a message to the offscreen document to start the auth process.
        chrome.runtime.sendMessage({ name: 'start-auth-in-offscreen' });
        sendResponse({ success: true });
    } else if (msg.name === 'auth-complete' && msg.user) {
        console.log('Background script received auth-complete message.');
        await chrome.storage.local.set({ user: msg.user });
        // Close the offscreen document.
        await chrome.offscreen.closeDocument();
        console.log('Offscreen document closed.');
        // Notify the popup.
        chrome.runtime.sendMessage({ name: 'auth-flow-complete', ...msg });
    } else if (msg.name === 'logout') {
        await chrome.storage.local.remove('user');
        chrome.runtime.sendMessage({ name: 'logout-complete' });
    } else if (msg.name === 'get-auth-state') {
        const { user } = await chrome.storage.local.get('user');
        sendResponse({ user });
    }
    return true;
});

console.log('JobTrac background script loaded.');


