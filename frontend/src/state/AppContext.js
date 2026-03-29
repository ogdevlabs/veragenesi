import React, { createContext, useReducer, useCallback } from 'react';
import { assessmentAPI, userAPI, toolsAPI } from '../services/apiService';

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
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

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
    submitArchetypeQuiz,
    submitEIAssessment,
    recordToolUsage,
    clearError,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
