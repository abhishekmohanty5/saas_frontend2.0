import axios from 'axios';

// Backend base URL
// Backend base URL - Dynamic
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://backendasservice-production.up.railway.app/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Bypass-Tunnel-Reminder': 'true',
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

// Create public axios instance (independent, no auto-redirect on 401)
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Bypass-Tunnel-Reminder': 'true',
    'Accept': 'application/json'
  },
  withCredentials: false 
});

// Add token to public requests IF available (allows logged-in users to still access "public" resources if backend is strict)
publicApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==================== AUTH ENDPOINTS ====================
export const authAPI = {
  // Register new user - uses publicApi (no token needed, avoids 401 interceptor)
  register: (userData) => publicApi.post('v1/auth/register', userData),

  // Login user - uses publicApi (no token needed, avoids 401 interceptor causing redirect loop)
  login: (credentials) => publicApi.post('v1/auth/login', credentials),

  // Logout (client-side only - clear tokens)
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Password Reset Endpoints
  forgotPassword: (email) => publicApi.post('v1/auth/forgot-password', { email }),
  validateResetToken: (token) => publicApi.get(`v1/auth/validate-reset-token?token=${token}`),
  resetPassword: (data) => publicApi.post('v1/auth/reset-password', data)
};

// ==================== PUBLIC ENDPOINTS ====================
export const publicAPI = {
  // Get all plans (no auth required)
  getAllPlans: (page = 0, size = 10) => publicApi.get(`v1/public/plans?page=${page}&size=${size}`),
};

// ==================== SUBSCRIPTION ENDPOINTS (Plan-based) ====================
export const subscriptionAPI = {
  /**
   * Step 1 – Process mock payment. 
   * Returns { transactionId } on success.
   */
  processPayment: (paymentData) =>
    api.post('tenant-admin/engine-subscription/pay', paymentData),

  /**
   * Step 2 – Activate the plan. Requires a valid transactionId from step 1.
   */
  subscribe: (planId, billingInterval, transactionId) =>
    api.post('v1/tenant-admin/billing/upgrade', {
      targetPlanId: planId,
      billingInterval: billingInterval || 'MONTHLY',
      transactionId,
    }),

  // Get current engine subscription for logged-in tenant
  getUserSubscription: () => api.get('v1/tenant-admin/billing'),

  // Cancel subscription
  cancelSubscription: () => api.put('v1/tenant-admin/billing/cancel'),

  // Get all plans (admin)
  getAllPlans: (page = 0, size = 10) => api.get(`v1/super-admin/engine-plans/all?page=${page}&size=${size}`),
};

// ==================== USER SUBSCRIPTION ENDPOINTS (Personal tracking) ====================
export const userSubscriptionAPI = {
  // Create new subscription
  createSubscription: (subscriptionDto) =>
    api.post('v1/tenant-admin/user-subscriptions', subscriptionDto),

  // Get all user subscriptions
  getAllSubscriptions: (page = 0, size = 10) =>
    api.get(`v1/tenant-admin/user-subscriptions/all?page=${page}&size=${size}`),

  // Get active subscriptions only
  getActiveSubscriptions: () =>
    api.get('v1/tenant-admin/user-subscriptions/active'),

  // Get subscriptions by category
  getSubscriptionsByCategory: (categoryId) =>
    api.get(`v1/tenant-admin/user-subscriptions/category/${categoryId}`),

  // Update subscription
  updateSubscription: (id, subscriptionDto) =>
    api.put(`v1/tenant-admin/user-subscriptions/update/${id}`, subscriptionDto),

  // Cancel subscription
  cancelSubscription: (id) =>
    api.put(`v1/tenant-admin/user-subscriptions/cancel/${id}`),

  // Get upcoming renewals (default 7 days)
  getUpcomingRenewals: (days = 7) =>
    api.get(`v1/tenant-admin/user-subscriptions/upcoming?days=${days}`),

  // Get subscription statistics
  getStats: () =>
    api.get('v1/tenant-admin/user-subscriptions/stats'),

  // Get smart insights
  getInsights: () =>
    api.get('v1/tenant-admin/user-subscriptions/insights'),
};

// ==================== ADMIN ENDPOINTS ====================
export const adminAPI = {
  // Create new plan
  createPlan: (planData) => api.post('v1/super-admin/engine-plans', {
    name: planData.name,
    price: planData.price,
    durationInDays: planData.duration
  }),

  // Activate plan
  activatePlan: (planId) => api.put(`v1/super-admin/engine-plans/${planId}/activate`),

  // Deactivate plan
  deactivatePlan: (planId) => api.put(`v1/super-admin/engine-plans/${planId}/deactivate`),

  // Delete plan
  deletePlan: (planId) => api.delete(`v1/super-admin/engine-plans/${planId}`),

  // Get all users
  getAllUsers: (page = 0, size = 10) => api.get(`v1/tenant-admin/users?page=${page}&size=${size}`),

  // Get all platform tenants
  getTenants: (page = 0, size = 10) => api.get(`v1/super-admin/tenants?page=${page}&size=${size}`),
};

// ==================== AI ENDPOINTS ====================
export const aiAPI = {
  // Generate pricing plans based on business description
  generatePlans: (businessDescription) =>
    api.post('v1/users/ai/generate-plans', { businessDescription }),

  // Get deep subscription analytics
  getAnalytics: () =>
    api.get('v1/users/ai/analytics'),

  // Predict churn for a specific user
  predictChurn: (userId) =>
    api.get(`v1/users/ai/predict-churn/${userId}`),
};

// ==================== DASHBOARD ENDPOINTS ====================
export const dashboardAPI = {
  // Get main dashboard overview
  getOverview: () => api.get('v1/tenant-admin/dashboard'),

  // Get tenant stats (total/active subscriptions)
  getStats: () => api.get('v1/tenant-admin/user-subscriptions/stats'),

  // Get tenant-defined plans
  getTenantPlans: (page = 0, size = 10) => api.get(`v1/tenant-admin/tenant-plans?page=${page}&size=${size}`),

  // Get tenant's end users
  getEndUsers: (page = 0, size = 10) => api.get(`v1/tenant-admin/users?page=${page}&size=${size}`),
};

export default api;
