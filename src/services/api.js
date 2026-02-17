import axios from 'axios';

// Backend base URL
const API_BASE_URL = 'http://localhost:8080/api';

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
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH ENDPOINTS ====================
export const authAPI = {
  // Register new user
  register: (userData) => api.post('/auth/reg', userData),
  
  // Login user
  login: (credentials) => api.post('/auth/log', credentials),
  
  // Logout (client-side only - clear tokens)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// ==================== PUBLIC ENDPOINTS ====================
export const publicAPI = {
  // Get all plans (no auth required)
  getAllPlans: () => api.get('/admin/plan'),
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