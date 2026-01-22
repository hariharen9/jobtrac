// Content Script
// Runs on job posting pages to extract job data

import { extractJobData } from './utils';
import { ExtractedJobData, ExtensionMessage } from './types';

console.log('[JobTrac] Content script loaded');

// Listen for messages from popup or background
chrome.runtime.onMessage.addListener(
  (
    message: ExtensionMessage,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response: { success: boolean; data: ExtractedJobData | null }) => void
  ) => {
    if (message.type === 'EXTRACT_JOB_DATA') {
      console.log('[JobTrac] Received extract request');

      // Extract job data from the page
      const jobData = extractJobData();

      sendResponse({
        success: !!jobData,
        data: jobData,
      });
    }

    // Return true to indicate async response
    return true;
  }
);

// Notify background that content script is ready
chrome.runtime.sendMessage({ type: 'CONTENT_SCRIPT_READY' });
