import axios from 'axios';

// Backend base URL
// Backend base URL - Hardcoded for production to ensure correct routing
const API_BASE_URL = 'https://saassubscription-production.up.railway.app/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath === '/login' || currentPath === '/register' || currentPath === '/auth';
      // Only auto-redirect to login if not already on an auth page
      if (!isAuthPage) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Create public axios instance (no auth interceptors)
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== AUTH ENDPOINTS ====================
export const authAPI = {
  // Register new user - uses publicApi (no token needed, avoids 401 interceptor)
  register: (userData) => publicApi.post('/auth/reg', userData),

  // Login user - uses publicApi (no token needed, avoids 401 interceptor causing redirect loop)
  login: (credentials) => publicApi.post('/auth/log', credentials),

  // Logout (client-side only - clear tokens)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// ==================== PUBLIC ENDPOINTS ====================
export const publicAPI = {
  // Get all plans (no auth required)
  getAllPlans: () => publicApi.get('/public'),
};

// ==================== SUBSCRIPTION ENDPOINTS (Plan-based) ====================
export const subscriptionAPI = {
  // Subscribe to a plan
  subscribe: (planId) => api.post(`/subscriptions/subscribe/${planId}`),

  // Get user's current subscription
  getUserSubscription: () => api.get('/subscriptions'),

  // Cancel subscription
  cancelSubscription: () => api.put('/subscriptions/cancel'),

  // Get all plans
  getAllPlans: () => api.get('/admin/plan'),
};

// ==================== USER SUBSCRIPTION ENDPOINTS (Personal tracking) ====================
export const userSubscriptionAPI = {
  // Create new subscription
  createSubscription: (subscriptionDto) =>
    api.post('/user-Subscriptions', subscriptionDto),

  // Get all user subscriptions
  getAllSubscriptions: () =>
    api.get('/user-Subscriptions'),

  // Get active subscriptions only
  getActiveSubscriptions: () =>
    api.get('/user-Subscriptions/active'),

  // Get subscriptions by category
  getSubscriptionsByCategory: (categoryId) =>
    api.get(`/user-Subscriptions/category/${categoryId}`),

  // Update subscription
  updateSubscription: (id, subscriptionDto) =>
    api.put(`/user-Subscriptions/update/${id}`, subscriptionDto),

  // Cancel subscription
  cancelSubscription: (id) =>
    api.put(`/user-Subscriptions/cancel/${id}`),

  // Get upcoming renewals (default 7 days)
  getUpcomingRenewals: (days = 7) =>
    api.get(`/user-Subscriptions/upcoming?days=${days}`),

  // Get subscription statistics
  getStats: () =>
    api.get('/user-Subscriptions/stats'),

  // Get smart insights
  getInsights: () =>
    api.get('/user-Subscriptions/insights'),

  // Get subscription categories
  getCategories: () =>
    api.get('/categories'), // You'll need to add this endpoint in backend
};

// ==================== ADMIN ENDPOINTS ====================
export const adminAPI = {
  // Create new plan
  createPlan: (planData) => api.post('/admin/plan', {
    name: planData.name,
    price: planData.price,
    durationInDays: planData.duration
  }),

  // Activate plan
  activatePlan: (planId) => api.put(`/admin/plan/${planId}/activate`),

  // Deactivate plan
  deactivatePlan: (planId) => api.put(`/admin/plan/${planId}/deactivate`),

  // Delete plan
  deletePlan: (planId) => api.delete(`/admin/plan/${planId}`),

  // Get all users (you'll need to add this endpoint)
  getAllUsers: () => api.get('/admin/users'),
};

export default api;