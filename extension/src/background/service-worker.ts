// Background Service Worker
// Handles extension lifecycle and messaging

import { ExtractedJobData } from '../types';

console.log('[JobTrac] Background service worker started');

// Handle extension icon click (when popup is not shown)
chrome.action.onClicked.addListener(async (tab) => {
  if (!tab.id) return;

  // Try to inject content script if not already present
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js'],
    });
  } catch (error) {
    console.log('[JobTrac] Content script may already be loaded:', error);
  }
});

// Handle keyboard shortcuts
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'capture-all-tabs') {
    // Future: Quick capture functionality
    console.log('[JobTrac] Quick capture command triggered');
  }
});

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener((message, sender, _sendResponse) => {
  console.log('[JobTrac] Background received message:', message.type);

  if (message.type === 'CONTENT_SCRIPT_READY') {
    console.log('[JobTrac] Content script ready in tab:', sender.tab?.id);
  }

  return true;
});

// Utility: Extract job data from active tab
export const extractFromActiveTab = async (): Promise<ExtractedJobData | null> => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab.id) {
      console.error('[JobTrac] No active tab found');
      return null;
    }

    // First, try to inject content script
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js'],
      });
    } catch {
      // Content script might already be loaded
    }

    // Wait a bit for content script to initialize
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Send message to content script
    const response = await chrome.tabs.sendMessage(tab.id, { type: 'EXTRACT_JOB_DATA' });

    if (response?.success) {
      return response.data;
    }

    return null;
  } catch (error) {
    console.error('[JobTrac] Error extracting job data:', error);
    return null;
  }
};

// Export for popup to use
(globalThis as unknown as { extractFromActiveTab: typeof extractFromActiveTab }).extractFromActiveTab = extractFromActiveTab;
