import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const AuthPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectTo = searchParams.get('redirect') || '/dashboard';
  const [isLogin, setIsLogin] = useState(location.pathname !== '/register');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      } else if (formData.name.trim().length < 2) {
        newErrors.name = 'Name must be at least 2 characters';
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 2) {
      newErrors.password = 'Password must be at least 2 characters';
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter';
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    } else if (!/(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one special character (@$!%*?&)';
    }

    if (!isLogin) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password);

        if (result.success) {
          navigate(redirectTo);
        } else {
          setErrors({ submit: result.error });
        }
      } else {
        const result = await register({
          userName: formData.name,
          email: formData.email,
          password: formData.password
        });

        if (result.success) {
          setSuccessMessage(result.message || 'Registration successful! Please login.');
          setIsLogin(true);
          setFormData({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            rememberMe: false
          });
        } else {
          setErrors({ submit: result.error });
        }
      }
    } catch (error) {
      setErrors({ submit: error.message || 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '45% 55%' }}>
      {/* Left Side - Premium Dark Side */}
      <div style={{
        background: 'linear-gradient(135deg, #1A1714 0%, #2D2620 50%, #1A1714 100%)',
        padding: '80px 70px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated gradient orbs */}
        <div style={{
          position: 'absolute',
          top: '-150px',
          right: '-150px',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.15) 0%, transparent 70%)',
          animation: 'float1 8s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-100px',
          left: '-100px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)',
          animation: 'float2 10s ease-in-out infinite'
        }} />

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '80px',
            cursor: 'pointer'
          }}
            onClick={() => navigate('/')}
          >
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--gold) 0%, var(--gold2) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(201,168,76,0.3)'
            }}>
              <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
                <path d="M3 3h4v4H3zM9 3h4v4H9zM3 9h4v4H3zM9 9h4v4H9z" fill="#1A1714" />
              </svg>
            </div>
            <span style={{ fontSize: '24px', fontWeight: 700, color: 'white', fontFamily: 'var(--ff-sans)', letterSpacing: '-0.5px' }}>
              SubSphere
            </span>
          </div>

          <h2 style={{
            fontFamily: 'var(--ff-serif)',
            fontSize: '52px',
            color: 'white',
            lineHeight: 1.1,
            letterSpacing: '-1px',
            fontWeight: 400,
            marginBottom: '28px'
          }}>
            Subscription<br />billing made<br /><em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>effortless</em>
          </h2>

          <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: '440px' }}>
            Join thousands of developers using SubSphere to manage subscription lifecycles, automated renewals, and seamless billing infrastructure.
          </p>
        </div>

        {/* Premium Features */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <FeatureItem icon={<ShieldIcon />} text="JWT-secured authentication" />
          <FeatureItem icon={<BoltIcon />} text="Automated renewal reminders" />
          <FeatureItem icon={<ChartIcon />} text="Real-time admin dashboard" />
          <FeatureItem icon={<RefreshIcon />} text="Complete lifecycle management" />
        </div>
      </div>

      {/* Right Side - Premium Auth Card */}
      <div style={{
        background: 'linear-gradient(135deg, #F8F8F8 0%, #E8E8E8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 50px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '28px',
          padding: '52px 44px',
          maxWidth: '480px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 0 1px rgba(0,0,0,0.05)'
        }}>
          {/* Header */}
          <h1 style={{
            fontSize: '32px',
            fontWeight: 700,
            color: '#1a1a1a',
            marginBottom: '10px',
            letterSpacing: '-0.5px'
          }}>
            {isLogin ? 'Sign in' : 'Create an account'}
          </h1>
          <p style={{
            fontSize: '15px',
            color: '#666',
            marginBottom: '32px'
          }}>
            {isLogin ? (
              <>New user? <button onClick={() => setIsLogin(false)} style={{ background: 'none', border: 'none', color: '#4A90E2', cursor: 'pointer', padding: 0, textDecoration: 'none', fontWeight: 600 }}>Create an account</button></>
            ) : (
              <>Already have an account? <button onClick={() => setIsLogin(true)} style={{ background: 'none', border: 'none', color: '#4A90E2', cursor: 'pointer', padding: 0, textDecoration: 'none', fontWeight: 600 }}>Sign in</button></>
            )}
          </p>

          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              position: 'absolute',
              top: '24px',
              left: '24px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#666',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '14px',
              fontWeight: 500,
              padding: '8px',
              borderRadius: '8px',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f0f0f0'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>

          {/* Success Message */}
          {successMessage && (
            <div style={{
              background: 'linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 100%)',
              border: '1px solid #81C784',
              color: '#2E7D32',
              padding: '14px 18px',
              borderRadius: '14px',
              marginBottom: '24px',
              fontSize: '14px',
              fontWeight: 500
            }}>
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div style={{
              background: 'linear-gradient(135deg, #FFEBEE 0%, #FCE4EC 100%)',
              border: '1px solid #EF5350',
              color: '#C62828',
              padding: '14px 18px',
              borderRadius: '14px',
              marginBottom: '24px',
              fontSize: '14px',
              fontWeight: 500
            }}>
              {errors.submit}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Name Field (Register only) */}
            {!isLogin && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  background: '#F8F9FA',
                  borderRadius: '14px',
                  border: errors.name ? '2px solid #F44336' : '2px solid transparent',
                  transition: 'all 0.2s'
                }}
                  onFocus={(e) => e.currentTarget.style.borderColor = errors.name ? '#F44336' : '#4A90E2'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'transparent'}
                >
                  <span style={{ padding: '0 18px', color: '#999' }}>
                    <UserIcon />
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    style={{
                      flex: 1,
                      padding: '16px 18px 16px 0',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: '15px',
                      color: '#1a1a1a',
                      fontWeight: 500
                    }}
                  />
                </div>
                {errors.name && <span style={{ fontSize: '13px', color: '#F44336', marginTop: '6px', display: 'block', marginLeft: '4px' }}>{errors.name}</span>}
              </div>
            )}

            {/* Email Field */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                background: '#F8F9FA',
                borderRadius: '14px',
                border: errors.email ? '2px solid #F44336' : '2px solid transparent',
                transition: 'all 0.2s'
              }}
                onFocus={(e) => e.currentTarget.style.borderColor = errors.email ? '#F44336' : '#4A90E2'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'transparent'}
              >
                <span style={{ padding: '0 18px', color: '#999' }}>
                  <MailIcon />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  style={{
                    flex: 1,
                    padding: '16px 18px 16px 0',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '15px',
                    color: '#1a1a1a',
                    fontWeight: 500
                  }}
                />
              </div>
              {errors.email && <span style={{ fontSize: '13px', color: '#F44336', marginTop: '6px', display: 'block', marginLeft: '4px' }}>{errors.email}</span>}
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: isLogin ? '16px' : '20px' }}>
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                background: '#F8F9FA',
                borderRadius: '14px',
                border: errors.password ? '2px solid #F44336' : '2px solid transparent',
                transition: 'all 0.2s'
              }}
                onFocus={(e) => e.currentTarget.style.borderColor = errors.password ? '#F44336' : '#4A90E2'}
                onBlur={(e) => e.currentTarget.style.borderColor = 'transparent'}
              >
                <span style={{ padding: '0 18px', color: '#999' }}>
                  <LockIcon />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  style={{
                    flex: 1,
                    padding: '16px 0',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '15px',
                    color: '#1a1a1a',
                    fontWeight: 500
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0 18px',
                    color: '#999',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
              {errors.password && <span style={{ fontSize: '13px', color: '#F44336', marginTop: '6px', display: 'block', marginLeft: '4px' }}>{errors.password}</span>}
            </div>

            {/* Confirm Password (Register only) */}
            {!isLogin && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  background: '#F8F9FA',
                  borderRadius: '14px',
                  border: errors.confirmPassword ? '2px solid #F44336' : '2px solid transparent',
                  transition: 'all 0.2s'
                }}
                  onFocus={(e) => e.currentTarget.style.borderColor = errors.confirmPassword ? '#F44336' : '#4A90E2'}
                  onBlur={(e) => e.currentTarget.style.borderColor = 'transparent'}
                >
                  <span style={{ padding: '0 18px', color: '#999' }}>
                    <LockIcon />
                  </span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    style={{
                      flex: 1,
                      padding: '16px 0',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      fontSize: '15px',
                      color: '#1a1a1a',
                      fontWeight: 500
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0 18px',
                      color: '#999',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {errors.confirmPassword && <span style={{ fontSize: '13px', color: '#F44336', marginTop: '6px', display: 'block', marginLeft: '4px' }}>{errors.confirmPassword}</span>}
              </div>
            )}

            {/* Forgot Password (Login only) */}
            {isLogin && (
              <div style={{ textAlign: 'right', marginBottom: '28px' }}>
                <a href="#" style={{ fontSize: '14px', color: '#4A90E2', textDecoration: 'none', fontWeight: 600 }}>
                  Forgot password?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '17px',
                borderRadius: '14px',
                border: 'none',
                background: loading ? '#999' : 'linear-gradient(135deg, #000 0%, #1a1a1a 100%)',
                color: 'white',
                fontSize: '16px',
                fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '28px',
                boxShadow: loading ? 'none' : '0 4px 14px rgba(0,0,0,0.25)',
                transition: 'all 0.2s',
                letterSpacing: '0.3px'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 14px rgba(0,0,0,0.25)';
                }
              }}
            >
              {loading ? 'Processing...' : isLogin ? 'Login' : 'Create Account'}
            </button>

            {/* Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '28px'
            }}>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent 0%, #E0E0E0 50%, transparent 100%)' }} />
              <span style={{ fontSize: '13px', color: '#999', fontWeight: 600 }}>or</span>
              <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent 0%, #E0E0E0 50%, transparent 100%)' }} />
            </div>

            {/* Social Login */}
            <p style={{ fontSize: '13px', color: '#666', textAlign: 'center', marginBottom: '20px', fontWeight: 500 }}>
              Join With Your Favorite Social Media Account
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginBottom: '28px' }}>
              <SocialButton>
                <GoogleIcon />
              </SocialButton>
              <SocialButton>
                <FacebookIcon />
              </SocialButton>
              <SocialButton>
                <TwitterIcon />
              </SocialButton>
              <SocialButton>
                <AppleIcon />
              </SocialButton>
            </div>

            {/* Terms */}
            <p style={{ fontSize: '12px', color: '#999', textAlign: 'center', lineHeight: 1.6 }}>
              By signing in with an account, you agree to our{' '}
              <a href="#" style={{ color: '#4A90E2', textDecoration: 'none', fontWeight: 600 }}>Terms of Service</a>
              {' '}and{' '}
              <a href="#" style={{ color: '#4A90E2', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</a>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

// Premium Feature Item Component
const FeatureItem = ({ icon, text }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '16px 20px',
    transition: 'all 0.3s'
  }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
      e.currentTarget.style.borderColor = 'rgba(201,168,76,0.3)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
    }}
  >
    <div style={{ color: 'var(--gold)' }}>{icon}</div>
    <span style={{ fontSize: '15px', color: 'rgba(255,255,255,0.8)', fontWeight: 500 }}>{text}</span>
  </div>
);

// Premium Social Button with Glow Effect
const SocialButton = ({ children }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      type="button"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        border: '2px solid #E8E8E8',
        background: 'white',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s',
        boxShadow: isHovered ? '0 8px 25px rgba(74, 144, 226, 0.25)' : '0 2px 8px rgba(0,0,0,0.08)',
        transform: isHovered ? 'translateY(-3px)' : 'translateY(0)',
        borderColor: isHovered ? '#4A90E2' : '#E8E8E8'
      }}
    >
      {children}
    </button>
  );
};

// SVG Icons
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 10a4 4 0 100-8 4 4 0 000 8zM3 18a7 7 0 1114 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M2 7l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="4" y="9" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M7 9V6a3 3 0 016 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 5C5.5 5 2 10 2 10s3.5 5 8 5 8-5 8-5-3.5-5-8-5z" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M3 3l14 14M10 7a3 3 0 013 3M7 10a3 3 0 003 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M5 5.5C3.5 6.5 2 10 2 10s3.5 5 8 5c1.5 0 2.8-.5 4-1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M12 2L4 6v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V6l-8-4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BoltIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChartIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M3 3v18h18M7 16l4-4 4 4 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0118.8-4.3M22 12.5a10 10 0 01-18.8 4.2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const GoogleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2" />
  </svg>
);

const TwitterIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#000" />
  </svg>
);

const AppleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" fill="#000" />
  </svg>
);

export default AuthPage;