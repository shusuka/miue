
import { AppConfig } from '../types';
import { DEFAULT_CONFIG } from '../constants';

const STORAGE_KEY = 'miuw_store_v9_live_sync';
// Public JSON storage for live sync (Miuw Store Shared Pool)
const SYNC_API_URL = 'https://api.npoint.io/88939c4a860b249b6727'; 

export const loadConfig = async (): Promise<AppConfig> => {
  // 1. Always try cloud sync first for Live experience
  try {
    const response = await fetch(SYNC_API_URL);
    if (response.ok) {
      const remoteData = await response.json();
      console.log("Global sync complete");
      return mergeWithDefaults(remoteData);
    }
  } catch (e) {
    console.error("Cloud sync unreachable, falling back to local storage", e);
  }

  // 2. Local fallback if offline or cloud fails
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return mergeWithDefaults(JSON.parse(stored));
    }
  } catch (e) {
    console.error("Local load failed", e);
  }

  return DEFAULT_CONFIG;
};

const mergeWithDefaults = (parsed: any): AppConfig => {
  return {
    ...DEFAULT_CONFIG,
    ...parsed,
    // Deep merge critical arrays to ensure UI stability
    reviews: Array.isArray(parsed.reviews) ? parsed.reviews : DEFAULT_CONFIG.reviews,
    requests: Array.isArray(parsed.requests) ? parsed.requests : DEFAULT_CONFIG.requests,
    overrides: { ...DEFAULT_CONFIG.overrides, ...(parsed.overrides || {}) },
    productStyles: { ...DEFAULT_CONFIG.productStyles, ...(parsed.productStyles || {}) },
    adminAuth: { ...DEFAULT_CONFIG.adminAuth, ...(parsed.adminAuth || {}) }
  };
};

export const saveConfig = async (config: AppConfig): Promise<boolean> => {
  // Save locally immediately
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));

  // Push to global cloud bin for other users to see
  try {
    const response = await fetch(SYNC_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    return response.ok;
  } catch (e) {
    console.error("Failed to push to global sync", e);
    return false;
  }
};
