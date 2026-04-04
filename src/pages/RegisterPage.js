import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const BackgroundElements = () => {
    return (
        <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            overflow: 'hidden',
            zIndex: 0,
            pointerEvents: 'none',
            background: 'var(--bg)', // Dynamic CSS variable
        }}>
            {/* Very subtle grid for texture */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
                zIndex: 1,
            }} />
        </div>
    );
};

const FloatingGeometry = ({ delay, size, top, left, right, bottom, rotate }) => (
    <div style={{
        position: 'absolute',
        top, left, right, bottom,
        width: size,
        height: size,
        border: '1px solid var(--border)',
        borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
        animation: `driftBlob 40s infinite linear ${delay}`,
        transform: `rotate(${rotate})`,
        zIndex: 3,
    }} />
);

const RegisterPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = new URLSearchParams(location.search).get('redirect') || '/dashboard';

    const [form, setForm] = useState({
        tenantName: '',
        userName: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
        setErrors((p) => ({ ...p, [name]: '', submit: '' }));
        setApiError('');
    };

    const validate = () => {
        const errs = {};
        if (!form.tenantName.trim()) errs.tenantName = 'Company name is required';
        if (!form.userName.trim()) errs.userName = 'Full name is required';
        if (!form.email.trim()) errs.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address';
        if (!form.password) errs.password = 'Password is required';
        else if (form.password.length < 8) errs.password = 'Min 8 characters required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setApiError('');
        try {
            const res = await authAPI.register({
                tenantName: form.tenantName.trim(),
                userName: form.userName.trim(),
                email: form.email.trim(),
                password: form.password,
            });
            const token = res.data?.data?.token;
            if (token) {
                localStorage.setItem('token', token);
                const user = {
                    email: res.data?.data?.email || form.email,
                    name: form.userName.trim(),
                    role: 'ROLE_TENANT_ADMIN'
                };
                localStorage.setItem('user', JSON.stringify(user));
                navigate(decodeURIComponent(redirectTo));
            } else {
                navigate('/login');
            }
        } catch (err) {
            setApiError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden' // Ensure the background elements don't spill
        }}>
            <Navbar />
            <BackgroundElements />

            <div style={styles.page}>
                <div style={styles.card}>
                    <h1 style={styles.heading}>Create account</h1>
                    <p style={styles.subtext}>
                        Already have an account? <Link to="/login" style={styles.switchLink}>Sign in</Link>
                    </p>

                    {apiError && <div style={styles.apiError}>{apiError}</div>}

                    <form onSubmit={handleSubmit} noValidate style={{ marginTop: '32px' }}>
                        <div style={{ marginBottom: '16px' }}>
                            <div style={styles.inputWrapper(errors.tenantName)}>
                                <div style={styles.inputIcon}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21h18"></path><path d="M3 7v1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7m0 1a3 3 0 0 0 6 0V7H3"></path><path d="M19 21V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v14"></path><path d="M9 21v-4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4"></path></svg>
                                </div>
                                <input
                                    type="text"
                                    name="tenantName"
                                    value={form.tenantName}
                                    onChange={handleChange}
                                    placeholder="Company Name"
                                    style={styles.inputField}
                                />
                            </div>
                            {errors.tenantName && <div style={styles.fieldError}>{errors.tenantName}</div>}
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <div style={styles.inputWrapper(errors.userName)}>
                                <div style={styles.inputIcon}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                </div>
                                <input
                                    type="text"
                                    name="userName"
                                    value={form.userName}
                                    onChange={handleChange}
                                    placeholder="Full Name"
                                    style={styles.inputField}
                                />
                            </div>
                            {errors.userName && <div style={styles.fieldError}>{errors.userName}</div>}
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <div style={styles.inputWrapper(errors.email)}>
                                <div style={styles.inputIcon}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Email Address"
                                    style={styles.inputField}
                                />
                            </div>
                            {errors.email && <div style={styles.fieldError}>{errors.email}</div>}
                        </div>

                        <div style={{ marginBottom: '24px' }}>
                            <div style={styles.inputWrapper(errors.password)}>
                                <div style={styles.inputIcon}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                                </div>
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    style={styles.inputField}
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} style={styles.eyeBtn} tabIndex={-1}>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                </button>
                            </div>
                            {errors.password && <div style={styles.fieldError}>{errors.password}</div>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{ ...styles.submitBtn, opacity: loading ? 0.75 : 1 }}
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                    </form>

                    <div style={styles.dividerContainer}>
                        <div style={styles.line}></div>
                        <span style={styles.dividerText}>or</span>
                        <div style={styles.line}></div>
                    </div>

                    <p style={styles.socialPrompt}>Join With Your Favorite Social Media Account</p>

                    <div style={styles.socialRow}>
                        <button style={styles.socialBtn}><svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg></button>
                        <button style={styles.socialBtn}><svg width="20" height="20" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07z" /></svg></button>
                        <button style={styles.socialBtn}><svg width="20" height="20" fill="#000000" viewBox="0 0 24 24"><path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.41l-5.8-7.58-6.64 7.58H.47l8.6-9.83L0 1.15h7.59l5.24 6.96L18.9 1.15zM17.61 20.65h2.04L6.48 3.24H4.32l11.29 17.41z" /></svg></button>
                        <button style={styles.socialBtn}><svg width="20" height="20" fill="#000000" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.253 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.15 2.95.89 3.67 2.01-3.24 1.95-2.73 5.92.59 7.35-.69 1.57-1.45 2.76-2.91 3.65zm-2.1-14.86c-.53.74-1.35 1.19-2.1 1.25-.13-1.01.37-2.07 1-2.78.61-.69 1.63-1.12 2.38-1.11.16.94-.3 1.94-.97 2.64z" /></svg></button>
                    </div>

                    <p style={styles.legalText}>
                        By signing up, you agree to our<br />
                        <Link to="#" style={styles.legalLink}>Terms of Service</Link> and <Link to="#" style={styles.legalLink}>Privacy Policy</Link>.
                    </p>
                </div>
            </div>

            <div style={{ position: 'relative', zIndex: 10 }}>
                <Footer />
            </div>

            <style>{`
                @keyframes driftBlob {
                    0% { transform: scale(1) translate(0, 0); }
                    50% { transform: scale(1.1) translate(5%, 5%); }
                    100% { transform: scale(0.9) translate(-5%, -5%); }
                }
            `}</style>
        </div>
    );
};

const styles = {
    page: {
        width: '100%',
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '90px 24px 60px',
        fontFamily: "Inter, sans-serif",
        position: 'relative',
        zIndex: 10,
    },
    card: {
        background: 'var(--surface)',
        width: '100%',
        maxWidth: '480px',
        padding: '48px 52px',
        borderRadius: '32px',
        boxShadow: '0 25px 60px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px var(--border)',
        textAlign: 'left',
        position: 'relative',
        zIndex: 5,
        transition: 'all 0.3s ease',
    },
    heading: {
        fontFamily: 'var(--ff-sans)',
        fontSize: '32px',
        fontWeight: 800,
        color: 'var(--ink)',
        letterSpacing: '-1.5px',
        marginBottom: '8px',
    },
    subtext: {
        fontSize: '15px',
        color: 'var(--muted)',
        marginBottom: '24px',
    },
    switchLink: {
        color: '#3b82f6',
        textDecoration: 'none',
        fontWeight: 600,
    },
    apiError: {
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        borderRadius: '12px',
        padding: '12px 16px',
        color: '#EF4444',
        fontSize: '14px',
        marginBottom: '20px',
    },
    inputWrapper: (hasError) => ({
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        border: `1px solid ${hasError ? '#ef4444' : 'var(--border)'}`,
        borderRadius: '16px',
        background: 'var(--bg)',
        height: '56px',
        overflow: 'hidden',
        transition: 'all 0.2s',
    }),
    inputIcon: {
        color: 'var(--muted)',
        marginRight: '12px',
        display: 'flex',
        alignItems: 'center',
        zIndex: 2,
    },
    inputField: {
        flex: 1,
        height: '100%',
        border: 'none',
        outline: 'none',
        fontSize: '16px',
        fontWeight: '500',
        color: 'var(--ink)',
        background: 'transparent',
    },
    eyeBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--muted)',
        padding: '0 4px',
    },
    fieldError: {
        color: '#EF4444',
        fontSize: '12.5px',
        marginTop: '4px',
        fontWeight: 500,
    },
    submitBtn: {
        width: '100%',
        height: '56px',
        background: 'var(--ink)',
        color: 'var(--bg)',
        borderRadius: '32px',
        fontSize: '18px',
        fontWeight: 700,
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
        marginTop: '8px',
    },
    dividerContainer: {
        display: 'flex',
        alignItems: 'center',
        margin: '24px 0 16px',
    },
    line: {
        flex: 1,
        height: '1px',
        background: '#E2E8F0',
    },
    dividerText: {
        color: '#9CA3AF',
        fontSize: '13px',
        margin: '0 16px',
        fontWeight: 500,
    },
    socialPrompt: {
        textAlign: 'center',
        color: '#64748b',
        fontSize: '12px',
        fontWeight: 600,
        marginBottom: '16px',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    socialRow: {
        display: 'flex',
        justifyContent: 'center',
        gap: '16px',
    },
    socialBtn: {
        width: '52px',
        height: '52px',
        borderRadius: '32px',
        border: '1px solid #E2E8F0',
        background: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
    },
    legalText: {
        textAlign: 'center',
        fontSize: '12px',
        color: '#6B7280',
        marginTop: '40px',
        lineHeight: 1.6,
    },
    legalLink: {
        color: '#3b82f6',
        textDecoration: 'none',
        fontWeight: 600,
    }
};

export default RegisterPage;
