import axios from 'axios';
import { Platform } from 'react-native';
import storageService from './storageService';

const getApiBaseUrl = () => {
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
  // Android emulator routes `localhost` to itself — the host machine is at 10.0.2.2
  if (Platform.OS === 'android') return 'http://10.0.2.2:3000';
  return 'http://localhost:3000';
};

const API_BASE_URL = getApiBaseUrl();

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add token to requests
apiClient.interceptors.request.use(
  async (config) => {
    const token = await storageService.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      await storageService.removeAuthToken();
    }
    return Promise.reject(error);
  }
);

const authAPI = {
  register: (email, firstName, password) =>
    apiClient.post('/auth/register', { email, firstName, password }),
  login: (email, password) =>
    apiClient.post('/auth/login', { email, password }),
};

const assessmentAPI = {
  submitArchetypeQuiz: (answers) =>
    apiClient.post('/assessments/archetype', { answers }),
  submitEIAssessment: (answers) =>
    apiClient.post('/assessments/ei-baseline', { answers }),
  getLatestAssessment: (type) =>
    apiClient.get(`/assessments/${type}`),
};

const toolsAPI = {
  recordToolUsage: (toolId, durationSeconds, beforeMood, afterMood, note) =>
    apiClient.post('/tools/usage', {
      toolId,
      durationSeconds,
      beforeMood,
      afterMood,
      note,
    }),
  getToolsList: () =>
    apiClient.get('/tools/list'),
  getToolStats: () =>
    apiClient.get('/tools/stats'),
  getToolHistory: (limit = 20, offset = 0) =>
    apiClient.get('/tools/history', { params: { limit, offset } }),
};

const userAPI = {
  getUserProfile: () =>
    apiClient.get('/user/profile'),
};

const resourcesAPI = {
  getEmergencyResources: () =>
    apiClient.get('/resources/emergency'),
};

export default apiClient;
export { authAPI, assessmentAPI, toolsAPI, userAPI, resourcesAPI };
