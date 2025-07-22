import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, config.data);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status}`, response.data);
    return response.data;
  },
  (error) => {
    console.error('API Response Error:', error);
    
    if (error.code === 'ECONNREFUSED') {
      throw new Error('API server is not running. Please start it with: npm run api:start');
    }
    
    if (error.response?.status === 404) {
      throw new Error('API endpoint not found');
    }
    
    if (error.response?.status >= 500) {
      throw new Error('Server error. Please try again later.');
    }
    
    throw new Error(error.response?.data?.error || error.message || 'Unknown API error');
  }
);

// Semantic API endpoints
export const semanticAPI = {
  // Health check
  health: () => api.get('/health'),
  
  // Main processing
  process: (data) => api.post('/process', data),
  
  // Real-time preview
  preview: (data) => api.post('/preview', data),
  
  // Classification explanation
  explain: (data) => api.post('/explain', data),
  
  // Content suggestions
  getSuggestions: (data) => api.post('/suggestions', data),
  
  // Batch processing
  batchProcess: (data) => api.post('/batch', data),
  
  // User learning
  addLearning: (data) => api.post('/learn', data),
  
  // Statistics
  getStats: () => api.get('/stats'),
  
  // Backend connection
  connectBackend: (data) => api.post('/connect-backend', data),
  
  // Templates
  getTemplates: () => api.get('/templates'),
};

// Export default api instance for custom requests
export default api; 