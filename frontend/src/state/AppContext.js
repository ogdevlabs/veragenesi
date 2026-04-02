import React, { createContext, useReducer, useCallback, useEffect } from 'react';
import { assessmentAPI, userAPI, toolsAPI } from '../services/apiService';
import { storage } from '../services/storageService';
import { useAuth } from './AuthContext';

const LANG_STORAGE_KEY = '@vera_lang';

const AppContext = createContext();

export const useApp = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

const initialState = {
  user: null,
  archetypeResults: null,
  eiResults: null,
  toolStats: null,
  tools: [],
  loading: false,
  error: null,
  lang: 'es',
  assessmentsLoaded: false,
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_ARCHETYPE_RESULTS':
      return { ...state, archetypeResults: action.payload };
    case 'SET_EI_RESULTS':
      return { ...state, eiResults: action.payload };
    case 'SET_TOOL_STATS':
      return { ...state, toolStats: action.payload };
    case 'SET_TOOLS':
      return { ...state, tools: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_LANG':
      return { ...state, lang: action.payload };
    case 'SET_ASSESSMENTS_LOADED':
      return { ...state, assessmentsLoaded: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { token, isLoading: authLoading } = useAuth();

  // Restore language preference from storage on mount
  useEffect(() => {
    const loadLang = async () => {
      try {
        const saved = await storage.getItem(LANG_STORAGE_KEY);
        if (saved) dispatch({ type: 'SET_LANG', payload: saved });
      } catch {}
    };
    loadLang();
  }, []);

  const loadAssessments = useCallback(async () => {
    try {
      const [archetypeRes, eiRes] = await Promise.allSettled([
        assessmentAPI.getLatestAssessment('archetype'),
        assessmentAPI.getLatestAssessment('ei-baseline'),
      ]);
      if (archetypeRes.status === 'fulfilled') {
        dispatch({ type: 'SET_ARCHETYPE_RESULTS', payload: archetypeRes.value.data.results });
      }
      if (eiRes.status === 'fulfilled') {
        dispatch({ type: 'SET_EI_RESULTS', payload: eiRes.value.data.results });
      }
    } catch {}
    dispatch({ type: 'SET_ASSESSMENTS_LOADED', payload: true });
  }, []);

  // Auto-load assessment results when auth is ready
  useEffect(() => {
    if (!authLoading && token) {
      loadAssessments();
    } else if (!authLoading && !token) {
      // Logged out — reset assessment state
      dispatch({ type: 'SET_ARCHETYPE_RESULTS', payload: null });
      dispatch({ type: 'SET_EI_RESULTS', payload: null });
      dispatch({ type: 'SET_ASSESSMENTS_LOADED', payload: false });
    }
  }, [token, authLoading]);

  const setLang = useCallback(async (newLang) => {
    dispatch({ type: 'SET_LANG', payload: newLang });
    try {
      await storage.setItem(LANG_STORAGE_KEY, newLang);
    } catch {}
  }, []);

  const loadUserProfile = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await userAPI.getUserProfile();
      dispatch({ type: 'SET_USER', payload: response.data.user });
      if (response.data.toolStats) {
        dispatch({ type: 'SET_TOOL_STATS', payload: response.data.toolStats });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const submitArchetypeQuiz = useCallback(async (answers) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await assessmentAPI.submitArchetypeQuiz(answers);
      dispatch({ type: 'SET_ARCHETYPE_RESULTS', payload: response.data });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 'Assessment submission failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const submitEIAssessment = useCallback(async (answers) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await assessmentAPI.submitEIAssessment(answers);
      dispatch({ type: 'SET_EI_RESULTS', payload: response.data });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 'Assessment submission failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const recordToolUsage = useCallback(async (toolId, durationSeconds, beforeMood, afterMood, note) => {
    try {
      const response = await toolsAPI.recordToolUsage(
        toolId,
        durationSeconds,
        beforeMood,
        afterMood,
        note
      );
      // Refresh tool stats
      await loadUserProfile();
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.error?.message || 'Failed to record tool usage';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, [loadUserProfile]);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value = {
    ...state,
    loadUserProfile,
    loadAssessments,
    submitArchetypeQuiz,
    submitEIAssessment,
    recordToolUsage,
    clearError,
    setLang,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
