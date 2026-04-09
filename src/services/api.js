import axios from 'axios';

// Backend base URL - Dynamic
let API_BASE_URL = process.env.REACT_APP_API_URL || 'https://backendasservice-production.up.railway.app/api';

// Safety check: Ensure URL is absolute and starts with http/https
if (API_BASE_URL && !API_BASE_URL.startsWith('http')) {
  API_BASE_URL = `https://${API_BASE_URL}`;
}

// Clean up: removes any trailing slash to avoid double slashes in calls
if (API_BASE_URL.endsWith('/')) {
  API_BASE_URL = API_BASE_URL.slice(0, -1);
}

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

// Create public axios instance
const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Bypass-Tunnel-Reminder': 'true',
    'Accept': 'application/json'
  },
  withCredentials: false 
});

const normalizeBilling = (billingInterval) => {
  const raw = String(billingInterval || 'MONTHLY').trim().toUpperCase();
  if (raw === 'ANNUAL' || raw === 'YEARLY') {
    return {
      billingInterval: 'ANNUAL',
      billingCycle: 'YEARLY',
    };
  }
  return {
    billingInterval: 'MONTHLY',
    billingCycle: 'MONTHLY',
  };
};

// ==================== AUTH ENDPOINTS ====================
export const authAPI = {
  register: (userData) => publicApi.post('v1/auth/register', userData),
  login: (credentials) => publicApi.post('v1/auth/login', credentials),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  forgotPassword: (email) => publicApi.post('v1/auth/forgot-password', { email }),
  validateResetToken: (token) => publicApi.get(`v1/auth/validate-reset-token?token=${token}`),
  resetPassword: (data) => publicApi.post('v1/auth/reset-password', data),
  verifyEmail: (token) => publicApi.get(`v1/auth/verify-email?token=${token}`)
};

// ==================== PUBLIC ENDPOINTS ====================
export const publicAPI = {
  getAllPlans: (page = 0, size = 10) => publicApi.get(`v1/public/plans?page=${page}&size=${size}`),
};

// ==================== SUBSCRIPTION ENDPOINTS ====================
export const subscriptionAPI = {
  createRazorpayOrder: (planId, billingInterval) =>
    api.post('v1/tenant-admin/billing/razorpay/order', {
      targetPlanId: planId,
      planId,
      ...normalizeBilling(billingInterval),
    }),
  processMockPayment: (payload) =>
    api.post('tenant-admin/engine-subscription/pay', payload),
  verifyRazorpayPayment: (payload) =>
    api.post('v1/tenant-admin/billing/razorpay/verify', payload),
  subscribe: (planId, billingInterval, transactionId) =>
    api.post('v1/tenant-admin/billing/upgrade', {
      targetPlanId: planId,
      planId,
      transactionId,
      ...normalizeBilling(billingInterval),
    }),
  getUserSubscription: () => api.get('v1/tenant-admin/billing'),
  cancelSubscription: () => api.put('v1/tenant-admin/billing/cancel'),
};

// ==================== USER SUBSCRIPTION ENDPOINTS ====================
export const userSubscriptionAPI = {
  createSubscription: (subscriptionDto) =>
    api.post('v1/tenant-admin/user-subscriptions', subscriptionDto),
  getAllSubscriptions: (page = 0, size = 10) =>
    api.get(`v1/tenant-admin/user-subscriptions/all?page=${page}&size=${size}`),
  getActiveSubscriptions: () =>
    api.get('v1/tenant-admin/user-subscriptions/active'),
  updateSubscription: (id, subscriptionDto) =>
    api.put(`v1/tenant-admin/user-subscriptions/update/${id}`, subscriptionDto),
  cancelSubscription: (id) =>
    api.put(`v1/tenant-admin/user-subscriptions/cancel/${id}`),
  getStats: () => api.get('v1/tenant-admin/user-subscriptions/stats'),
  getInsights: () => api.get('v1/tenant-admin/user-subscriptions/insights'),
};

// ==================== ADMIN ENDPOINTS ====================
export const adminAPI = {
  createPlan: (planData) => api.post('v1/super-admin/engine-plans', {
    name: planData.name,
    price: planData.price,
    durationInDays: planData.duration
  }),
  activatePlan: (planId) => api.put(`v1/super-admin/engine-plans/${planId}/activate`),
  deactivatePlan: (planId) => api.put(`v1/super-admin/engine-plans/${planId}/deactivate`),
  deletePlan: (planId) => api.delete(`v1/super-admin/engine-plans/${planId}`),
  getAllUsers: (page = 0, size = 10) => api.get(`v1/tenant-admin/users?page=${page}&size=${size}`),
  getTenants: (page = 0, size = 10) => api.get(`v1/super-admin/tenants?page=${page}&size=${size}`),
};

// ==================== AI ENDPOINTS ====================
export const aiAPI = {
  generatePlans: (businessDescription) =>
    api.post('v1/users/ai/generate-plans', { businessDescription }),
  getAnalytics: () => api.get('v1/users/ai/analytics'),
  predictChurn: (userId) => api.get(`v1/users/ai/predict-churn/${userId}`),
};

// ==================== DASHBOARD ENDPOINTS ====================
export const dashboardAPI = {
  getOverview: () => api.get('v1/tenant-admin/dashboard'),
  getStats: () => api.get('v1/tenant-admin/user-subscriptions/stats'),
  
  // Tenant Plan Management
  getTenantPlans: (page = 0, size = 10) => api.get(`v1/tenant-admin/tenant-plans?page=${page}&size=${size}`),
  createTenantPlan: (planData) => api.post('v1/tenant-admin/tenant-plans', planData),
  updateTenantPlan: (id, planData) => api.put(`v1/tenant-admin/tenant-plans/${id}`, planData),
  deleteTenantPlan: (id) => api.delete(`v1/tenant-admin/tenant-plans/${id}`),
  
  getEndUsers: (page = 0, size = 10) => api.get(`v1/tenant-admin/users?page=${page}&size=${size}`),
  getApiKeys: () => api.get('v1/tenant-admin/keys'),
  regenerateSecret: () => api.post('v1/tenant-admin/keys/regenerate'),
};

export default api;
