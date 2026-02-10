
import { AppConfig } from '../types';
import { DEFAULT_CONFIG } from '../constants';

const STORAGE_KEY = 'miuw_store_v9_live';
// Public Sync Bin URL (Using a consistent endpoint for Miuw Store)
const SYNC_API_URL = 'https://api.npoint.io/88939c4a860b249b6727'; 

export const loadConfig = async (): Promise<AppConfig> => {
  // 1. Try to load from Cloud first for Live Data
  try {
    const response = await fetch(SYNC_API_URL);
    if (response.ok) {
      const remoteData = await response.json();
      console.log("Live cloud data synchronized");
      return mergeWithDefaults(remoteData);
    }
  } catch (e) {
    console.error("Cloud sync failed, falling back to local storage", e);
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
    return {
        ...DEFAULT_CONFIG,
        ...parsed,
        // Deep merge critical sections
        overrides: { ...DEFAULT_CONFIG.overrides, ...(parsed.overrides || {}) },
        adminAuth: { ...DEFAULT_CONFIG.adminAuth, ...(parsed.adminAuth || {}) },
        productStyles: { ...DEFAULT_CONFIG.productStyles, ...(parsed.productStyles || {}) },
        reviews: Array.isArray(parsed.reviews) ? parsed.reviews : DEFAULT_CONFIG.reviews,
        requests: Array.isArray(parsed.requests) ? parsed.requests : DEFAULT_CONFIG.requests
    };
};

export const saveConfig = async (config: AppConfig): Promise<boolean> => {
  // Save locally
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));

  // Push to Cloud for Global Sync
  try {
    const response = await fetch(SYNC_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    return response.ok;
  } catch (e) {
    console.error("Failed to synchronize data to cloud", e);
    return false;
  }
};
