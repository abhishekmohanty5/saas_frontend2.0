import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

/* ─────────────────────────────────────────────────────────
   LOGIN PAGE  –  /login
   POST /api/auth/log → { email, password }
───────────────────────────────────────────────────────── */
const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const searchParams = new URLSearchParams(location.search);
    const redirectTo = searchParams.get('redirect') || '/dashboard';

    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((p) => ({ ...p, [name]: value }));
        setErrors((p) => ({ ...p, [name]: '', submit: '' }));
    };

    const validate = () => {
        const errs = {};
        if (!form.email.trim()) errs.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address';
        if (!form.password) errs.password = 'Password is required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const result = await login(form.email.trim(), form.password);
            if (result.success) {
                navigate(decodeURIComponent(redirectTo));
            } else {
                // Route specific error messages
                const msg = result.error || '';
                if (msg.toLowerCase().includes('email') || msg.toLowerCase().includes('not exist') || msg.toLowerCase().includes('register')) {
                    setErrors({ email: msg });
                } else if (msg.toLowerCase().includes('password') || msg.toLowerCase().includes('credential') || msg.toLowerCase().includes('invalid')) {
                    setErrors({ password: msg });
                } else {
                    setErrors({ submit: msg });
                }
            }
        } catch (err) {
            setErrors({ submit: 'An unexpected error occurred. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const TRUST_BADGES = [
        { icon: '🔐', label: 'JWT secured' },
        { icon: '⚡', label: 'Instant access' },
        { icon: '🔄', label: '14-day free trial' },
    ];

    return (
        <div style={styles.page}>
            <div style={styles.glow1} />
            <div style={styles.glow2} />

            {/* Back to home */}
            <Link to="/" style={styles.backLink}>
                <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                    <path d="M10 3L5 8l5 5" stroke="#C4BAA8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Back to home
            </Link>

            {/* Card */}
            <div style={styles.card}>
                {/* Logo */}
                <div style={styles.logoRow}>
                    <div style={styles.logoMark}>
                        <svg width="16" height="16" viewBox="0 0 14 14" fill="none">
                            <rect width="6" height="6" rx="1.5" fill="#1A1714" />
                            <rect x="8" width="6" height="6" rx="1.5" fill="#1A1714" opacity=".5" />
                            <rect y="8" width="6" height="6" rx="1.5" fill="#1A1714" opacity=".5" />
                            <rect x="8" y="8" width="6" height="6" rx="1.5" fill="#1A1714" opacity=".85" />
                        </svg>
                    </div>
                    <span style={styles.logoText}>SubSphere</span>
                </div>

                <h1 style={styles.heading}>Welcome back</h1>
                <p style={styles.subtext}>Sign in to your SubSphere Developer Console</p>

                {/* Global error */}
                {errors.submit && <div style={styles.apiError}>{errors.submit}</div>}

                <form onSubmit={handleSubmit} noValidate>
                    {/* Email */}
                    <div style={{ marginBottom: '16px' }}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@startup.com"
                            style={{
                                ...styles.input,
                                borderColor: errors.email ? 'rgba(181,70,58,0.6)' : 'rgba(255,255,255,0.1)',
                            }}
                            onFocus={(e) => { e.target.style.borderColor = errors.email ? 'rgba(181,70,58,0.8)' : 'rgba(201,168,76,0.5)'; }}
                            onBlur={(e) => { e.target.style.borderColor = errors.email ? 'rgba(181,70,58,0.6)' : 'rgba(255,255,255,0.1)'; }}
                        />
                        {errors.email && <div style={styles.fieldError}>{errors.email}</div>}
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: '24px' }}>
                        <label style={styles.label}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPass ? 'text' : 'password'}
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Your password"
                                style={{
                                    ...styles.input,
                                    paddingRight: '48px',
                                    borderColor: errors.password ? 'rgba(181,70,58,0.6)' : 'rgba(255,255,255,0.1)',
                                }}
                                onFocus={(e) => { e.target.style.borderColor = errors.password ? 'rgba(181,70,58,0.8)' : 'rgba(201,168,76,0.5)'; }}
                                onBlur={(e) => { e.target.style.borderColor = errors.password ? 'rgba(181,70,58,0.6)' : 'rgba(255,255,255,0.1)'; }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPass((v) => !v)}
                                style={styles.eyeBtn}
                                tabIndex={-1}
                            >
                                {showPass ? '🙈' : '👁️'}
                            </button>
                        </div>
                        {errors.password && <div style={styles.fieldError}>{errors.password}</div>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{ ...styles.submitBtn, opacity: loading ? 0.75 : 1, cursor: loading ? 'wait' : 'pointer' }}
                        onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = 'var(--ink2)'; }}
                        onMouseLeave={(e) => { if (!loading) e.currentTarget.style.background = 'var(--ink)'; }}
                    >
                        {loading ? 'Signing in…' : 'Sign in →'}
                    </button>
                </form>

                {/* Register link */}
                <p style={styles.switchText}>
                    Don't have an account?{' '}
                    <Link to="/register" style={styles.switchLink}>Start free trial</Link>
                </p>
            </div>

            {/* Trust Badges */}
            <div style={styles.trustRow}>
                {TRUST_BADGES.map((b) => (
                    <div key={b.label} style={styles.trustBadge}>
                        <span style={{ fontSize: '16px' }}>{b.icon}</span>
                        <span style={{ fontSize: '12px', color: 'var(--stone)', fontWeight: 500 }}>{b.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    page: {
        minHeight: '100vh',
        background: 'var(--ink)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'var(--ff-sans)',
    },
    glow1: {
        position: 'fixed',
        top: '-200px',
        right: '-200px',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 65%)',
        pointerEvents: 'none',
    },
    glow2: {
        position: 'fixed',
        bottom: '-150px',
        left: '-150px',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 65%)',
        pointerEvents: 'none',
    },
    backLink: {
        position: 'absolute',
        top: '28px',
        left: '32px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        color: 'var(--stone)',
        textDecoration: 'none',
        fontSize: '13px',
        fontWeight: 500,
        fontFamily: 'var(--ff-sans)',
        transition: 'color 0.15s',
    },
    card: {
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '20px',
        padding: '40px 40px 32px',
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
        position: 'relative',
        zIndex: 1,
    },
    logoRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '28px',
    },
    logoMark: {
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        background: 'var(--gold)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    logoText: {
        fontFamily: 'var(--ff-sans)',
        fontSize: '18px',
        fontWeight: 700,
        color: 'var(--white)',
        letterSpacing: '-0.3px',
    },
    heading: {
        fontFamily: 'var(--ff-serif)',
        fontSize: '28px',
        fontWeight: 400,
        color: 'var(--white)',
        letterSpacing: '-0.5px',
        marginBottom: '8px',
    },
    subtext: {
        fontSize: '14px',
        color: 'var(--stone)',
        marginBottom: '28px',
        lineHeight: 1.5,
    },
    apiError: {
        background: 'rgba(181,70,58,0.12)',
        border: '1px solid rgba(181,70,58,0.3)',
        borderRadius: '10px',
        padding: '12px 16px',
        color: '#E07070',
        fontSize: '13px',
        fontWeight: 500,
        marginBottom: '20px',
        lineHeight: 1.5,
    },
    label: {
        display: 'block',
        fontSize: '12px',
        fontWeight: 600,
        color: 'rgba(255,255,255,0.5)',
        marginBottom: '7px',
        letterSpacing: '0.4px',
        textTransform: 'uppercase',
    },
    input: {
        display: 'block',
        width: '100%',
        padding: '13px 16px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px',
        color: 'var(--white)',
        fontSize: '14px',
        fontFamily: 'var(--ff-sans)',
        outline: 'none',
        transition: 'border-color 0.15s',
        boxSizing: 'border-box',
    },
    eyeBtn: {
        position: 'absolute',
        right: '12px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: '16px',
        padding: '2px 4px',
        opacity: 0.6,
    },
    fieldError: {
        color: '#E07070',
        fontSize: '12px',
        marginTop: '5px',
        fontWeight: 500,
    },
    submitBtn: {
        width: '100%',
        padding: '15px',
        background: 'var(--ink)',
        border: '1px solid rgba(255,255,255,0.15)',
        color: 'var(--white)',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: 700,
        fontFamily: 'var(--ff-sans)',
        cursor: 'pointer',
        transition: 'background 0.15s',
        letterSpacing: '0.2px',
    },
    switchText: {
        textAlign: 'center',
        fontSize: '13px',
        color: 'var(--stone)',
        marginTop: '20px',
        fontFamily: 'var(--ff-sans)',
    },
    switchLink: {
        color: 'var(--gold)',
        textDecoration: 'none',
        fontWeight: 600,
    },
    trustRow: {
        display: 'flex',
        gap: '12px',
        marginTop: '28px',
        zIndex: 1,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    trustBadge: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '30px',
    },
};

export default LoginPage;
