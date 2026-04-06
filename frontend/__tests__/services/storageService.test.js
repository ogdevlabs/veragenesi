/**
 * storageService tests — mocks AsyncStorage and Platform
 */

// Mock react-native Platform so we hit the AsyncStorage branch (not web)
jest.mock('react-native', () => ({
  Platform: { OS: 'ios' },
}));

// Mock inline — factory must NOT reference outer-scope variables because
// jest.mock is hoisted above all declarations by babel-plugin-jest-hoist.
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn().mockResolvedValue(undefined),
  getItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn().mockResolvedValue(undefined),
  clear: jest.fn().mockResolvedValue(undefined),
}));

import storageService from '../../src/services/storageService';
import AsyncStorage from '@react-native-async-storage/async-storage';

beforeEach(() => {
  jest.clearAllMocks();
  // Restore default return value cleared by clearAllMocks
  AsyncStorage.getItem.mockResolvedValue(null);
});

// ── Auth token ───────────────────────────────────────────────────────────────

describe('Auth token methods', () => {
  it('saveAuthToken stores the token', async () => {
    await storageService.saveAuthToken('tok123');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('authToken', 'tok123');
  });

  it('getAuthToken retrieves the stored token', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce('tok_saved');
    const result = await storageService.getAuthToken();
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('authToken');
    expect(result).toBe('tok_saved');
  });

  it('removeAuthToken removes the token', async () => {
    await storageService.removeAuthToken();
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('authToken');
  });
});

// ── User data ────────────────────────────────────────────────────────────────

describe('User data methods', () => {
  const user = { id: 1, email: 'u@test.com', firstName: 'Uma' };

  it('saveUserData serialises and stores user', async () => {
    await storageService.saveUserData(user);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('userData', JSON.stringify(user));
  });

  it('getUserData deserialises and returns user', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(user));
    const result = await storageService.getUserData();
    expect(result).toEqual(user);
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('userData');
  });

  it('getUserData returns null when nothing stored', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    const result = await storageService.getUserData();
    expect(result).toBeNull();
  });

  it('clearUserData removes user from storage', async () => {
    await storageService.clearUserData();
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('userData');
  });
});

// ── User preferences ─────────────────────────────────────────────────────────

describe('User preferences methods', () => {
  it('saveUserPreferences and getUserPreferences round-trip', async () => {
    const prefs = { lang: 'en', theme: 'dark' };
    await storageService.saveUserPreferences(prefs);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('userPreferences', JSON.stringify(prefs));

    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(prefs));
    const result = await storageService.getUserPreferences();
    expect(result).toEqual(prefs);
  });

  it('getUserPreferences returns null when empty', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    expect(await storageService.getUserPreferences()).toBeNull();
  });
});

// ── Tool cache ───────────────────────────────────────────────────────────────

describe('Tool cache methods', () => {
  it('saveToolCache and getToolCache round-trip', async () => {
    const tools = [{ id: 'calm_breath' }];
    await storageService.saveToolCache(tools);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith('toolCache', JSON.stringify(tools));

    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(tools));
    expect(await storageService.getToolCache()).toEqual(tools);
  });

  it('getToolCache returns null when empty', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    expect(await storageService.getToolCache()).toBeNull();
  });
});

// ── Pending tool usage (offline sync) ───────────────────────────────────────

describe('Pending tool usage methods', () => {
  it('addPendingToolUsage appends to existing list', async () => {
    const existing = [{ toolId: 'calm_breath' }];
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(existing)); // getPendingToolUsage

    await storageService.addPendingToolUsage({ toolId: 'quick_write' });

    const stored = JSON.parse(AsyncStorage.setItem.mock.calls[0][1]);
    expect(stored).toHaveLength(2);
    expect(stored[1].toolId).toBe('quick_write');
  });

  it('getPendingToolUsage returns [] when empty', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    expect(await storageService.getPendingToolUsage()).toEqual([]);
  });

  it('clearPendingToolUsage removes the key', async () => {
    await storageService.clearPendingToolUsage();
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('pendingToolUsage');
  });
});

// ── Offline notes ────────────────────────────────────────────────────────────

describe('Offline notes methods', () => {
  it('saveOfflineNote appends to existing notes', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify([{ text: 'Note 1' }]));

    await storageService.saveOfflineNote({ text: 'Note 2' });

    const stored = JSON.parse(AsyncStorage.setItem.mock.calls[0][1]);
    expect(stored).toHaveLength(2);
  });

  it('getOfflineNotes returns [] when empty', async () => {
    AsyncStorage.getItem.mockResolvedValueOnce(null);
    expect(await storageService.getOfflineNotes()).toEqual([]);
  });

  it('clearOfflineNotes removes the key', async () => {
    await storageService.clearOfflineNotes();
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('offlineNotes');
  });
});

// ── clearAll ─────────────────────────────────────────────────────────────────

describe('clearAll', () => {
  it('calls storage.clear()', async () => {
    await storageService.clearAll();
    expect(AsyncStorage.clear).toHaveBeenCalledTimes(1);
  });
});
