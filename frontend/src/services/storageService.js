import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  USER_PREFERENCES: 'userPreferences',
  TOOL_CACHE: 'toolCache',
  PENDING_TOOL_USAGE: 'pendingToolUsage',
  OFFLINE_NOTES: 'offlineNotes',
};

const storageService = {
  // Auth
  saveAuthToken: async (token) => {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },
  getAuthToken: async () => {
    return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },
  removeAuthToken: async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  // User data
  saveUserData: async (userData) => {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  },
  getUserData: async () => {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  },
  clearUserData: async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
  },

  // User preferences
  saveUserPreferences: async (preferences) => {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
  },
  getUserPreferences: async () => {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return data ? JSON.parse(data) : null;
  },

  // Tool cache
  saveToolCache: async (tools) => {
    await AsyncStorage.setItem(STORAGE_KEYS.TOOL_CACHE, JSON.stringify(tools));
  },
  getToolCache: async () => {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.TOOL_CACHE);
    return data ? JSON.parse(data) : null;
  },

  // Pending tool usage (for offline sync)
  addPendingToolUsage: async (toolUsage) => {
    const pending = await storageService.getPendingToolUsage();
    const updated = [...(pending || []), toolUsage];
    await AsyncStorage.setItem(STORAGE_KEYS.PENDING_TOOL_USAGE, JSON.stringify(updated));
  },
  getPendingToolUsage: async () => {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_TOOL_USAGE);
    return data ? JSON.parse(data) : [];
  },
  clearPendingToolUsage: async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.PENDING_TOOL_USAGE);
  },

  // Notes (local-only storage for Quick Write)
  saveOfflineNote: async (note) => {
    const notes = await storageService.getOfflineNotes();
    const updated = [...(notes || []), note];
    await AsyncStorage.setItem(STORAGE_KEYS.OFFLINE_NOTES, JSON.stringify(updated));
  },
  getOfflineNotes: async () => {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.OFFLINE_NOTES);
    return data ? JSON.parse(data) : [];
  },
  clearOfflineNotes: async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.OFFLINE_NOTES);
  },

  // Clear all
  clearAll: async () => {
    await AsyncStorage.clear();
  },
};

export default storageService;
