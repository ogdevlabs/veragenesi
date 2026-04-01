import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  USER_PREFERENCES: 'userPreferences',
  TOOL_CACHE: 'toolCache',
  PENDING_TOOL_USAGE: 'pendingToolUsage',
  OFFLINE_NOTES: 'offlineNotes',
};

// Web-compatible storage adapter
const webStorage = {
  setItem: async (key, value) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  },
  getItem: async (key) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return null;
  },
  removeItem: async (key) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(key);
    }
  },
  clear: async () => {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.clear();
    }
  },
};

// Use localStorage on web, AsyncStorage on native
const storage = Platform.OS === 'web' ? webStorage : AsyncStorage;

const storageService = {
  // Auth
  saveAuthToken: async (token) => {
    await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },
  getAuthToken: async () => {
    return await storage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },
  removeAuthToken: async () => {
    await storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  // User data
  saveUserData: async (userData) => {
    await storage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  },
  getUserData: async () => {
    const data = await storage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  },
  clearUserData: async () => {
    await storage.removeItem(STORAGE_KEYS.USER_DATA);
  },

  // User preferences
  saveUserPreferences: async (preferences) => {
    await storage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
  },
  getUserPreferences: async () => {
    const data = await storage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return data ? JSON.parse(data) : null;
  },

  // Tool cache
  saveToolCache: async (tools) => {
    await storage.setItem(STORAGE_KEYS.TOOL_CACHE, JSON.stringify(tools));
  },
  getToolCache: async () => {
    const data = await storage.getItem(STORAGE_KEYS.TOOL_CACHE);
    return data ? JSON.parse(data) : null;
  },

  // Pending tool usage (for offline sync)
  addPendingToolUsage: async (toolUsage) => {
    const pending = await storageService.getPendingToolUsage();
    const updated = [...(pending || []), toolUsage];
    await storage.setItem(STORAGE_KEYS.PENDING_TOOL_USAGE, JSON.stringify(updated));
  },
  getPendingToolUsage: async () => {
    const data = await storage.getItem(STORAGE_KEYS.PENDING_TOOL_USAGE);
    return data ? JSON.parse(data) : [];
  },
  clearPendingToolUsage: async () => {
    await storage.removeItem(STORAGE_KEYS.PENDING_TOOL_USAGE);
  },

  // Notes (local-only storage for Quick Write)
  saveOfflineNote: async (note) => {
    const notes = await storageService.getOfflineNotes();
    const updated = [...(notes || []), note];
    await storage.setItem(STORAGE_KEYS.OFFLINE_NOTES, JSON.stringify(updated));
  },
  getOfflineNotes: async () => {
    const data = await storage.getItem(STORAGE_KEYS.OFFLINE_NOTES);
    return data ? JSON.parse(data) : [];
  },
  clearOfflineNotes: async () => {
    await storage.removeItem(STORAGE_KEYS.OFFLINE_NOTES);
  },

  // Clear all
  clearAll: async () => {
    await storage.clear();
  },
};

export default storageService;
