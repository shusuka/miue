
import { AppConfig } from '../types';
import { DEFAULT_CONFIG } from '../constants';

const STORAGE_KEY = 'miuw_store_v8_cloud';
// Public Sync Bin ID (Generated for Miuw Store)
// This allows different users to share the same data pool
const SYNC_API_URL = 'https://api.npoint.io/88939c4a860b249b6727'; 

export const loadConfig = async (): Promise<AppConfig> => {
  // 1. Try to load from Cloud first
  try {
    const response = await fetch(SYNC_API_URL);
    if (response.ok) {
      const remoteData = await response.json();
      console.log("Cloud data loaded successfully");
      return mergeWithDefaults(remoteData);
    }
  } catch (e) {
    console.error("Cloud sync failed, trying local storage", e);
  }

  // 2. Fallback to Local Storage
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return mergeWithDefaults(JSON.parse(stored));
    }
  } catch (e) {
    console.error("Local storage load failed", e);
  }

  return DEFAULT_CONFIG;
};

const mergeWithDefaults = (parsed: any): AppConfig => {
    const merged: AppConfig = {
        ...DEFAULT_CONFIG,
        ...parsed,
        overrides: { ...DEFAULT_CONFIG.overrides, ...(parsed.overrides || {}) },
        adminAuth: { ...DEFAULT_CONFIG.adminAuth, ...(parsed.adminAuth || {}) },
        productStyles: { ...DEFAULT_CONFIG.productStyles, ...(parsed.productStyles || {}) }
    };
    return merged;
};

export const saveConfig = async (config: AppConfig): Promise<boolean> => {
  // Always save locally first
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));

  // Try to push to Cloud
  try {
    const response = await fetch(SYNC_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    return response.ok;
  } catch (e) {
    console.error("Failed to push to Cloud sync", e);
    return false;
  }
};
