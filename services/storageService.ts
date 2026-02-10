import { AppConfig, Review, RequestConfig } from '../types';
import { DEFAULT_CONFIG } from '../constants';

const STORAGE_KEY = 'miuw_store_v7_react';

// Helper to ensure data integrity and unique IDs
const sanitizeIds = (items: any[]): any[] => {
    if (!Array.isArray(items)) return [];
    
    // Use a Set to track seen IDs to prevent duplicates
    const seen = new Set();
    
    return items.map(item => {
        // Ensure item is an object
        if (typeof item !== 'object' || item === null) return null;

        let id = item.id;
        
        // Generate ID if missing or invalid
        if (!id) {
            id = Date.now() + Math.floor(Math.random() * 1000);
        }
        
        // Ensure ID is unique in this list
        if (seen.has(String(id))) {
            id = Date.now() + Math.floor(Math.random() * 10000);
        }
        
        seen.add(String(id));
        return { ...item, id };
    }).filter(Boolean); // Remove nulls
};

export const loadConfig = (): AppConfig => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      
      // Deep merge with default to ensure all required fields exist
      // This prevents crashes if new config fields are added in the future
      const merged: AppConfig = {
          ...DEFAULT_CONFIG,
          ...parsed,
          overrides: { ...DEFAULT_CONFIG.overrides, ...(parsed.overrides || {}) },
          adminAuth: { ...DEFAULT_CONFIG.adminAuth, ...(parsed.adminAuth || {}) },
          productStyles: { ...DEFAULT_CONFIG.productStyles, ...(parsed.productStyles || {}) }
      };
      
      // Sanitize critical arrays to prevent "map of undefined" errors
      merged.reviews = sanitizeIds(merged.reviews || DEFAULT_CONFIG.reviews);
      merged.requests = sanitizeIds(merged.requests || []);
      
      return merged;
    }
  } catch (e) {
    console.error("Failed to load config, falling back to default", e);
    // If JSON is corrupted, we could optionally clear localStorage here, 
    // but returning default is safer to avoid data loss without user consent.
  }
  return DEFAULT_CONFIG;
};

export const saveConfig = (config: AppConfig): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error("Failed to save config", e);
    // Alert the user if storage is full (QuotaExceededError)
    if (e instanceof DOMException && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
        alert("Warning: Local storage is full. Your changes may not be saved. Please clear some browser data.");
    }
  }
};