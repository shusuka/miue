
import { AppConfig, Review, RequestConfig } from '../types';
import { DEFAULT_CONFIG } from '../constants';

// Updated key to v8 to force refresh of default config (links and reviews)
const STORAGE_KEY = 'miuw_store_v8_final';

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
      const merged: AppConfig = {
          ...DEFAULT_CONFIG,
          ...parsed,
          overrides: { ...DEFAULT_CONFIG.overrides, ...(parsed.overrides || {}) },
          adminAuth: { ...DEFAULT_CONFIG.adminAuth, ...(parsed.adminAuth || {}) },
          productStyles: { ...DEFAULT_CONFIG.productStyles, ...(parsed.productStyles || {}) }
      };
      
      // Sanitize critical arrays
      merged.reviews = sanitizeIds(merged.reviews || DEFAULT_CONFIG.reviews);
      merged.requests = sanitizeIds(merged.requests || []);
      
      return merged;
    }
  } catch (e) {
    console.error("Failed to load config, falling back to default", e);
  }
  return DEFAULT_CONFIG;
};

export const saveConfig = (config: AppConfig): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.error("Failed to save config", e);
    if (e instanceof DOMException && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')) {
        alert("Warning: Local storage is full. Your changes may not be saved.");
    }
  }
};
