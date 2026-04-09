import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './utils/AuthContext';
import { ThemeProvider } from './utils/ThemeContext';
import { ToastProvider } from './components/ToastProvider';
import ProtectedRoute from './components/ProtectedRoute';import ThemeSwitcher from './components/ThemeSwitcher';
// Pages
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import PricingPage from './pages/PricingPage';
import Dashboard from './pages/Dashboard';
import SubscriptionsPage from './pages/SubscriptionsPage';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';



import './App.css';

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <div className="App">
            <Routes>
              {/* ── Public Routes ── */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />

              {/* ── Tenant Admin Dashboard ── */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute roles={['ROLE_TENANT_ADMIN']}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* ── End User Subscriptions ── */}
              <Route
                path="/subscriptions"
                element={
                  <ProtectedRoute>
                    <SubscriptionsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-subscriptions"
                element={
                  <ProtectedRoute>
                    <SubscriptionsPage />
                  </ProtectedRoute>
                }
              />

              {/* ── Super Admin Control Panel ── */}
              <Route
                path="/super-admin"
                element={
                  <ProtectedRoute roles={['ROLE_SUPER_ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />


              {/* ── Fallback ── */}
              <Route path="*" element={<LandingPage />} />
            </Routes>

            {/* Global Theme Switcher */}
            <div style={{ 
              position: 'fixed', 
              bottom: '24px', 
              right: '24px', 
              zIndex: 9999,
              background: 'var(--surface)',
              borderRadius: '50%',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <ThemeSwitcher />
            </div>
          </div>
        </Router>
      </AuthProvider>
    </ToastProvider>
  </ThemeProvider>
  );
}

export default App;