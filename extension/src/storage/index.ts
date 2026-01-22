// Storage utilities for the extension
// Handles Chrome storage API for settings and cached data

import { StoredSettings, DEFAULT_SETTINGS, ApplicationPayload } from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'jobtrac_settings',
  PENDING_APPLICATIONS: 'jobtrac_pending_applications',
  AUTH_TOKEN: 'jobtrac_auth_token',
  USER_ID: 'jobtrac_user_id',
} as const;

/**
 * Get extension settings
 */
export const getSettings = async (): Promise<StoredSettings> => {
  const result = await chrome.storage.local.get(STORAGE_KEYS.SETTINGS);
  return { ...DEFAULT_SETTINGS, ...result[STORAGE_KEYS.SETTINGS] };
};

/**
 * Save extension settings
 */
export const saveSettings = async (settings: Partial<StoredSettings>): Promise<void> => {
  const current = await getSettings();
  await chrome.storage.local.set({
    [STORAGE_KEYS.SETTINGS]: { ...current, ...settings },
  });
};

/**
 * Get pending applications (saved locally, not yet synced)
 */
export const getPendingApplications = async (): Promise<ApplicationPayload[]> => {
  const result = await chrome.storage.local.get(STORAGE_KEYS.PENDING_APPLICATIONS);
  return result[STORAGE_KEYS.PENDING_APPLICATIONS] || [];
};

/**
 * Add a pending application
 */
export const addPendingApplication = async (app: ApplicationPayload): Promise<void> => {
  const pending = await getPendingApplications();
  pending.push(app);
  await chrome.storage.local.set({
    [STORAGE_KEYS.PENDING_APPLICATIONS]: pending,
  });
};

/**
 * Remove a pending application
 */
export const removePendingApplication = async (index: number): Promise<void> => {
  const pending = await getPendingApplications();
  pending.splice(index, 1);
  await chrome.storage.local.set({
    [STORAGE_KEYS.PENDING_APPLICATIONS]: pending,
  });
};

/**
 * Clear all pending applications
 */
export const clearPendingApplications = async (): Promise<void> => {
  await chrome.storage.local.set({
    [STORAGE_KEYS.PENDING_APPLICATIONS]: [],
  });
};

/**
 * Store auth credentials (for Firebase integration)
 */
export const storeAuthCredentials = async (userId: string, token?: string): Promise<void> => {
  await chrome.storage.local.set({
    [STORAGE_KEYS.USER_ID]: userId,
    [STORAGE_KEYS.AUTH_TOKEN]: token || null,
  });
};

/**
 * Get stored auth credentials
 */
export const getAuthCredentials = async (): Promise<{ userId: string | null; token: string | null }> => {
  const result = await chrome.storage.local.get([STORAGE_KEYS.USER_ID, STORAGE_KEYS.AUTH_TOKEN]);
  return {
    userId: result[STORAGE_KEYS.USER_ID] || null,
    token: result[STORAGE_KEYS.AUTH_TOKEN] || null,
  };
};

/**
 * Clear auth credentials
 */
export const clearAuthCredentials = async (): Promise<void> => {
  await chrome.storage.local.remove([STORAGE_KEYS.USER_ID, STORAGE_KEYS.AUTH_TOKEN]);
};

/**
 * Clear all extension data
 */
export const clearAllData = async (): Promise<void> => {
  await chrome.storage.local.clear();
};
